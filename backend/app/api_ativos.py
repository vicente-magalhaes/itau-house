"""Catálogo e ciclo de publicação dos ativos."""

import uuid
from typing import Annotated, Literal

from fastapi import APIRouter, Depends
from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel

from app import catalogo, validador
from app.api_validacoes import ItemOut
from app.erros import ErroApi
from app.repositorio import Repositorio, agora, obter_repositorio
from app.sessao import usuario_atual

router = APIRouter(prefix="/api", tags=["ativos"])
Banco = Annotated[Repositorio, Depends(obter_repositorio)]
Pessoa = Annotated[dict, Depends(usuario_atual)]


class _Camel(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, extra="forbid")


class Arquivo(_Camel):
    caminho: str
    conteudo: str


class Post(_Camel):
    nome: str = Field(min_length=1)
    tipo: Literal[
        "skill", "agente", "mcp", "framework", "componente", "esqueleto", "design_system", "harness"
    ]
    resumo: str = ""
    readme: str = ""
    arquivos: list[Arquivo] = Field(default_factory=list)
    manual_instalacao: str = ""
    visibilidade: Literal["squad", "frente", "banco"] = "squad"
    derivado_de: str | None = None
    tags: list[str] = Field(default_factory=list)
    ferramentas: list[str] = Field(default_factory=list)
    validacao_ids: list[str] = Field(default_factory=list)


class Edicao(_Camel):
    nome: str | None = Field(default=None, min_length=1)
    tipo: (
        Literal[
            "skill",
            "agente",
            "mcp",
            "framework",
            "componente",
            "esqueleto",
            "design_system",
            "harness",
        ]
        | None
    ) = None
    resumo: str | None = None
    readme: str | None = None
    arquivos: list[Arquivo] | None = None
    manual_instalacao: str | None = None
    visibilidade: Literal["squad", "frente", "banco"] | None = None
    derivado_de: str | None = None
    tags: list[str] | None = None
    ferramentas: list[str] | None = None
    validacao_ids: list[str] | None = None


def _visivel(banco: Repositorio, id_: str, pessoa: dict) -> dict:
    ativo = banco.ativo(id_)
    if ativo is None or not catalogo.visivel(ativo, pessoa):
        raise ErroApi(404, "nao_encontrado", "Não encontrei o ativo.")
    return ativo


def _pessoa_curta(pessoa: dict | None) -> dict | None:
    if pessoa is None:
        return None
    return {campo: pessoa[campo] for campo in ("nome", "cargo", "squad")}


def _detalhe(banco: Repositorio, ativo: dict, pessoa: dict) -> dict:
    eventos = banco.eventos(ativo["id"])
    origem = banco.ativo(ativo["derivadoDe"]) if ativo.get("derivadoDe") else None
    if origem and not catalogo.visivel(origem, pessoa):
        origem = None
    usos = [
        {
            "tipo": uso["tipo"],
            "pessoa": _pessoa_curta(banco.usuario(uso["pessoaId"])),
            "em": uso["em"],
        }
        for uso in ativo.get("usos", [])
    ]
    historico = []
    if ativo.get("enviadoEm") and not any(e["tipo"] == "envio" for e in eventos):
        autor = banco.usuario(ativo["autorId"])
        historico.append(
            {"em": ativo["enviadoEm"], "evento": "Enviado para aprovação", "quem": autor["nome"]}
        )
    if (
        ativo.get("publicadoEm")
        and ativo.get("aprovadoPorId")
        and not any(e["tipo"] == "aprovacao" for e in eventos)
    ):
        aprovador = banco.usuario(ativo["aprovadoPorId"])
        historico.append(
            {"em": ativo["publicadoEm"], "evento": "Publicação aprovada", "quem": aprovador["nome"]}
        )
    nomes = {
        "validacao": "Validação realizada",
        "envio": "Enviado para aprovação",
        "aprovacao": "Publicação aprovada",
        "devolucao": "Devolvido pelo coordenador",
        "instalacao": "Ativo instalado",
        "derivacao": "Ativo adaptado",
        "decisao": "Decisão registrada",
    }
    for evento in eventos:
        ator = banco.usuario(evento["atorId"])
        historico.append(
            {
                "em": evento["em"],
                "evento": nomes.get(evento["tipo"], evento["tipo"]),
                "quem": ator["nome"],
            }
        )
        if evento["tipo"] in {"instalacao", "derivacao"}:
            usos.append({"tipo": evento["tipo"], "pessoa": _pessoa_curta(ator), "em": evento["em"]})
    com_evento = {e["dados"].get("validacaoId") for e in eventos if e["tipo"] == "validacao"}
    for validacao in banco.validacoes(ativo["id"]):
        if validacao["id"] not in com_evento:
            autor = banco.usuario(validacao["atorId"])
            historico.append(
                {"em": validacao["em"], "evento": "Validação realizada", "quem": autor["nome"]}
            )
    origem_autor = banco.usuario(origem["autorId"]) if origem else None
    return catalogo.resumo(ativo, pessoa) | {
        "curtidoPorMim": banco.curtido(ativo["id"], pessoa["id"]),
        "readme": ativo["readme"],
        "arquivos": ativo["arquivos"],
        "manualInstalacao": ativo["manualInstalacao"],
        "acessos": ativo["acessos"],
        "derivadoDe": (
            {"id": origem["id"], "nome": origem["nome"], "autor": _pessoa_curta(origem_autor)}
            if origem
            else None
        ),
        "usos": sorted(usos, key=lambda uso: uso["em"], reverse=True),
        "historico": sorted(historico, key=lambda item: item["em"]),
        "enviadoPor": (
            {
                "nome": banco.usuario(ativo["autorId"])["nome"],
                "cargo": banco.usuario(ativo["autorId"])["cargo"],
            }
            if ativo.get("enviadoEm")
            else None
        ),
        "aprovadoPor": (
            {
                "nome": banco.usuario(ativo["aprovadoPorId"])["nome"],
                "cargo": banco.usuario(ativo["aprovadoPorId"])["cargo"],
            }
            if ativo.get("aprovadoPorId")
            else None
        ),
        "comentarioCoordenador": ativo.get("comentarioCoordenador"),
    }


@router.get("/ativos")
def feed(
    banco: Banco, pessoa: Pessoa, ordem: Literal["alta", "curtidos", "novos"] = "alta"
) -> dict:
    ativos = [
        a for a in banco.ativos() if a["status"] == "publicado" and catalogo.visivel(a, pessoa)
    ]
    if ordem == "novos":
        ativos.sort(key=lambda a: a["publicadoEm"] or "", reverse=True)
    elif ordem == "curtidos":
        ativos.sort(key=lambda a: (a["curtidas"], a["instalacoes"]), reverse=True)
    else:
        ativos.sort(
            key=lambda a: (a["curtidas"] + a["instalacoes"], a["publicadoEm"] or ""), reverse=True
        )
    return {
        "ativos": [
            catalogo.resumo(a, pessoa) | {"curtidoPorMim": banco.curtido(a["id"], pessoa["id"])}
            for a in ativos
        ]
    }


@router.get("/ativos/{id}")
def detalhe(id: str, banco: Banco, pessoa: Pessoa) -> dict:
    return _detalhe(banco, _visivel(banco, id, pessoa), pessoa)


def _origem_valida(banco: Repositorio, origem_id: str | None, pessoa: dict) -> None:
    if origem_id:
        _visivel(banco, origem_id, pessoa)


@router.post("/ativos", status_code=201)
def criar(corpo: Post, banco: Banco, pessoa: Pessoa) -> dict:
    _origem_valida(banco, corpo.derivado_de, pessoa)
    if not banco.vincular_validacoes(corpo.validacao_ids, pessoa["id"], None):
        raise ErroApi(422, "entrada_invalida", "Confira as validações informadas.")
    id_ = f"a-{uuid.uuid4()}"
    dados = corpo.model_dump(by_alias=True, exclude={"validacao_ids"})
    ativo = dados | {
        "id": id_,
        "autorId": pessoa["id"],
        "squadId": pessoa["squadId"],
        "squad": pessoa["squad"],
        "frente": pessoa["frente"],
        "status": "rascunho",
        "versao": "1.0.0",
        "acessos": [],
        "curtidas": 0,
        "instalacoes": 0,
        "derivacoes": 0,
        "squadsQueReusaram": [],
        "usos": [],
        "enviadoEm": None,
        "aprovadoPorId": None,
        "publicadoEm": None,
        "comentarioCoordenador": None,
        "atualizadoEm": agora(),
    }
    banco.salvar_ativo(ativo)
    if not banco.vincular_validacoes(corpo.validacao_ids, pessoa["id"], id_):
        raise ErroApi(422, "entrada_invalida", "Confira as validações informadas.")
    return _detalhe(banco, banco.ativo(id_), pessoa)


@router.patch("/ativos/{id}")
def editar(id: str, corpo: Edicao, banco: Banco, pessoa: Pessoa) -> dict:
    ativo = _visivel(banco, id, pessoa)
    if ativo["status"] not in {"rascunho", "devolvido", "barrado"}:
        raise ErroApi(409, "conflito", "Este ativo não pode ser editado agora.")
    if ativo["autorId"] != pessoa["id"]:
        raise ErroApi(403, "sem_permissao", "Só o autor pode editar este ativo.")
    alteracoes = corpo.model_dump(by_alias=True, exclude_unset=True)
    ids = alteracoes.pop("validacaoIds", [])
    if not banco.vincular_validacoes(ids, pessoa["id"], None):
        raise ErroApi(422, "entrada_invalida", "Confira as validações informadas.")
    if any(valor is None for chave, valor in alteracoes.items() if chave != "derivadoDe"):
        raise ErroApi(422, "entrada_invalida", "Confira os campos enviados.")
    if "derivadoDe" in alteracoes:
        _origem_valida(banco, alteracoes["derivadoDe"], pessoa)
        if alteracoes["derivadoDe"] == id:
            raise ErroApi(422, "entrada_invalida", "O ativo não pode derivar de si mesmo.")
    if not banco.vincular_validacoes(ids, pessoa["id"], id):
        raise ErroApi(422, "entrada_invalida", "Confira as validações informadas.")
    ativo.update(alteracoes)
    ativo["atualizadoEm"] = agora()
    banco.salvar_ativo(ativo)
    return _detalhe(banco, banco.ativo(id), pessoa)


@router.post("/ativos/{id}/envio")
def enviar(id: str, banco: Banco, pessoa: Pessoa) -> dict:
    ativo = _visivel(banco, id, pessoa)
    if ativo["status"] not in {"rascunho", "devolvido", "barrado"}:
        raise ErroApi(409, "conflito", "Este ativo não pode ser enviado agora.")
    if ativo["autorId"] != pessoa["id"]:
        raise ErroApi(403, "sem_permissao", "Só o autor pode enviar este ativo.")
    arquivos = [validador.Arquivo(a["caminho"], a["conteudo"]) for a in ativo["arquivos"]]
    if ativo["readme"]:
        arquivos.append(validador.Arquivo("README.md", ativo["readme"]))
    itens = validador.validar(arquivos, pessoa["id"], pessoa["squadId"])
    resultado = validador.resultado(itens)
    validacao = {
        "id": f"v-{uuid.uuid4()}",
        "ativoId": id,
        "atorId": pessoa["id"],
        "resultado": resultado,
        "itens": [ItemOut(**vars(i)).model_dump(by_alias=True, exclude_none=True) for i in itens],
        "em": agora(),
    }
    banco.salvar_validacao(validacao)
    banco.registrar_evento(
        "validacao", pessoa["id"], id, {"validacaoId": validacao["id"], "resultado": resultado}
    )
    ativo["status"] = "barrado" if resultado == "barrado" else "em_aprovacao"
    ativo["atualizadoEm"] = agora()
    if resultado == "aprovado":
        ativo["enviadoEm"] = agora()
        ativo["comentarioCoordenador"] = None
    banco.salvar_ativo(ativo)
    if resultado == "barrado":
        raise ErroApi(
            422,
            "barrado",
            "Corrija o ativo e envie novamente.",
            validacao={
                "validacaoId": validacao["id"],
                "resultado": resultado,
                "itens": validacao["itens"],
            },
        )
    banco.registrar_evento("envio", pessoa["id"], id, {})
    return _detalhe(banco, banco.ativo(id), pessoa)


@router.post("/ativos/{id}/curtida")
def curtir(id: str, banco: Banco, pessoa: Pessoa) -> dict:
    ativo = _visivel(banco, id, pessoa)
    if ativo["status"] != "publicado":
        raise ErroApi(409, "conflito", "O ativo ainda não está publicado.")
    curtido = banco.alternar_curtida(id, pessoa["id"])
    return {"curtido": curtido, "curtidas": banco.ativo(id)["curtidas"]}


@router.post("/ativos/{id}/instalacoes")
def instalar(id: str, banco: Banco, pessoa: Pessoa) -> dict:
    ativo = _visivel(banco, id, pessoa)
    if ativo["status"] != "publicado":
        raise ErroApi(409, "conflito", "O ativo ainda não está publicado.")
    banco.registrar_evento("instalacao", pessoa["id"], id, {"origem": "plataforma"})
    return {"instalacoes": banco.ativo(id)["instalacoes"]}
