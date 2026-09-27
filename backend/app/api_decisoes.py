"""Escolhas da pessoa depois de receber uma sugestão."""

from typing import Annotated, Literal

from fastapi import APIRouter, Depends
from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel

from app import catalogo
from app.erros import ErroApi
from app.repositorio import Repositorio, obter_repositorio
from app.sessao import usuario_atual

router = APIRouter(prefix="/api", tags=["descoberta"])


class Decisao(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, extra="forbid")

    busca_id: str
    ativo_id: str | None = None
    decisao: Literal["usar", "adaptar", "ignorar"]


@router.post("/decisoes")
def decidir(
    corpo: Decisao,
    banco: Annotated[Repositorio, Depends(obter_repositorio)],
    pessoa: Annotated[dict, Depends(usuario_atual)],
) -> dict:
    if corpo.decisao != "ignorar" and not corpo.ativo_id:
        raise ErroApi(422, "entrada_invalida", "Informe o ativo escolhido.")
    ativo = banco.ativo(corpo.ativo_id) if corpo.ativo_id else None
    if corpo.ativo_id and (
        ativo is None or ativo["status"] != "publicado" or not catalogo.visivel(ativo, pessoa)
    ):
        raise ErroApi(404, "nao_encontrado", "Não encontrei o ativo.")
    banco.registrar_evento(
        "decisao",
        pessoa["id"],
        corpo.ativo_id,
        {"buscaId": corpo.busca_id, "decisao": corpo.decisao},
    )
    tipo = {"usar": "instalacao", "adaptar": "derivacao"}.get(corpo.decisao)
    if tipo:
        banco.registrar_evento(
            tipo, pessoa["id"], corpo.ativo_id, {"buscaId": corpo.busca_id, "origem": "decisao"}
        )
    atualizado = banco.ativo(corpo.ativo_id) if corpo.ativo_id else None
    return {
        "ok": True,
        "instalacoes": atualizado["instalacoes"] if atualizado else 0,
        "derivacoes": atualizado["derivacoes"] if atualizado else 0,
    }
