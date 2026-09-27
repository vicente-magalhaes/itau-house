"""Rota do validador: POST /api/validacoes (RF-14, RF-15). Contrato em docs/api.md."""

import uuid
from typing import Annotated, Literal

from fastapi import APIRouter, Depends, Header
from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel

from app import validador
from app.erros import ErroApi
from app.repositorio import Repositorio, agora, obter_repositorio

router = APIRouter(prefix="/api", tags=["publicação"])


class _Camel(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)


class ArquivoIn(_Camel):
    caminho: str
    conteudo: str


class ValidacaoIn(_Camel):
    arquivos: list[ArquivoIn]


class ItemOut(_Camel):
    criterio: validador.Criterio
    resultado: Literal["ok", "falhou"]
    titulo: str
    arquivo: str | None = None
    linha: int | None = None
    trecho: str | None = None
    como_corrigir: str | None = None


class ValidacaoOut(_Camel):
    validacao_id: str
    resultado: Literal["aprovado", "barrado"]
    itens: list[ItemOut]


@router.post("/validacoes", response_model=ValidacaoOut, response_model_exclude_none=True)
def validar(
    corpo: ValidacaoIn,
    repositorio: Annotated[Repositorio, Depends(obter_repositorio)],
    x_usuario_id: Annotated[str | None, Header()] = None,
) -> ValidacaoOut:
    """Checagens fixas por código, sem IA (D-26). Não cria ativo e nada vai para a fila."""
    if not x_usuario_id:
        raise ErroApi(401, "sem_usuario", "Entre com um usuário.")
    pessoa = repositorio.usuario(x_usuario_id)
    arquivos = [validador.Arquivo(a.caminho, a.conteudo) for a in corpo.arquivos]
    itens = validador.validar(
        arquivos, pessoa["id"] if pessoa else None, pessoa["squadId"] if pessoa else None
    )
    resposta = ValidacaoOut(
        validacao_id=f"v-{uuid.uuid4()}",
        resultado=validador.resultado(itens),
        itens=[ItemOut(**vars(i)) for i in itens],
    )
    if pessoa is None:
        return resposta
    repositorio.salvar_validacao(
        {
            "id": resposta.validacao_id,
            "ativoId": None,
            "atorId": pessoa["id"],
            "resultado": resposta.resultado,
            "itens": [i.model_dump(by_alias=True, exclude_none=True) for i in resposta.itens],
            "em": agora(),
        }
    )
    repositorio.registrar_evento(
        "validacao",
        pessoa["id"],
        None,
        {"validacaoId": resposta.validacao_id, "resultado": resposta.resultado},
    )
    return resposta
