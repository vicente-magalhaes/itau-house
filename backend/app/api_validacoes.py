"""Rota do validador: POST /api/validacoes (RF-14, RF-15). Contrato em docs/api.md."""

import uuid
from typing import Literal

from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel

from app import catalogo, validador

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
def validar(corpo: ValidacaoIn, x_usuario_id: str | None = Header(default=None)) -> ValidacaoOut:
    """Checagens fixas por código, sem IA (D-26). Não cria ativo e nada vai para a fila."""
    if not x_usuario_id:
        raise HTTPException(401, {"erro": "sem_usuario", "mensagem": "Entre com um usuário."})
    arquivos = [validador.Arquivo(a.caminho, a.conteudo) for a in corpo.arquivos]
    # Até o banco existir (T-05), o usuário vem do seed.
    pessoa = catalogo.usuario(x_usuario_id) or {}
    itens = validador.validar(arquivos, pessoa.get("id"), pessoa.get("squadId"))
    # TODO(T-07): gravar a validação e o evento `validacao` quando o banco existir.
    return ValidacaoOut(
        validacao_id=f"v-{uuid.uuid4()}",
        resultado=validador.resultado(itens),
        itens=[ItemOut(**vars(i)) for i in itens],
    )
