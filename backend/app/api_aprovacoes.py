"""Fila e decisão da coordenação do squad."""

from typing import Annotated, Literal

from fastapi import APIRouter, Depends
from pydantic import BaseModel, ConfigDict

from app import catalogo
from app.api_ativos import _detalhe
from app.erros import ErroApi
from app.repositorio import Repositorio, agora, obter_repositorio
from app.sessao import usuario_atual

router = APIRouter(prefix="/api/aprovacoes", tags=["coordenação"])
Banco = Annotated[Repositorio, Depends(obter_repositorio)]
Pessoa = Annotated[dict, Depends(usuario_atual)]


def _coordenador(pessoa: dict) -> None:
    if pessoa["perfil"] != "cord_mais":
        raise ErroApi(403, "sem_permissao", "Só a coordenação pode fazer isso.")


@router.get("")
def fila(banco: Banco, pessoa: Pessoa) -> dict:
    _coordenador(pessoa)
    ativos = [
        a for a in banco.ativos() if a["status"] == "em_aprovacao" and catalogo.visivel(a, pessoa)
    ]
    ativos.sort(key=lambda a: a["enviadoEm"] or "")
    itens = []
    for ativo in ativos:
        validacoes = banco.validacoes(ativo["id"])
        itens.append(
            {
                "ativo": _detalhe(banco, ativo, pessoa, validacoes),
                "enviadoEm": ativo["enviadoEm"],
                "validacoes": [
                    {"resultado": v["resultado"], "em": v["em"], "itens": v["itens"]}
                    for v in validacoes
                ],
            }
        )
    return {"itens": itens}


class Decisao(BaseModel):
    model_config = ConfigDict(extra="forbid")

    decisao: Literal["aprovar", "devolver"]
    comentario: str | None = None


@router.post("/{ativo_id}")
def decidir(ativo_id: str, corpo: Decisao, banco: Banco, pessoa: Pessoa) -> dict:
    _coordenador(pessoa)
    ativo = banco.ativo(ativo_id)
    if ativo is None or not catalogo.visivel(ativo, pessoa):
        raise ErroApi(404, "nao_encontrado", "Não encontrei o ativo.")
    if ativo["status"] != "em_aprovacao":
        raise ErroApi(409, "conflito", "Este ativo não está em aprovação.")
    if corpo.decisao == "devolver" and not (corpo.comentario and corpo.comentario.strip()):
        raise ErroApi(422, "entrada_invalida", "Escreva um comentário para devolver o ativo.")
    if corpo.decisao == "aprovar":
        ativo["status"] = "publicado"
        ativo["aprovadoPorId"] = pessoa["id"]
        ativo["publicadoEm"] = agora()
        ativo["comentarioCoordenador"] = None
    else:
        ativo["status"] = "devolvido"
        ativo["comentarioCoordenador"] = corpo.comentario.strip()
    ativo["atualizadoEm"] = agora()
    banco.salvar_ativo(ativo)
    banco.registrar_evento(
        "aprovacao" if corpo.decisao == "aprovar" else "devolucao",
        pessoa["id"],
        ativo_id,
        {"comentario": ativo["comentarioCoordenador"]} if corpo.decisao == "devolver" else {},
    )
    return _detalhe(banco, banco.ativo(ativo_id), pessoa)
