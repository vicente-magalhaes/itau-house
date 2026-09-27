"""Rota da busca: POST /api/busca (RF-05, RF-06, RF-11). Contrato em docs/api.md."""

from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel

from app import busca, catalogo

router = APIRouter(prefix="/api", tags=["descoberta"])


class BuscaIn(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    pedido: str = Field(min_length=3)
    tipo: str | None = None
    modo: str = "perguntar_antes"


@router.post("/busca")
def buscar(corpo: BuscaIn, x_usuario_id: str | None = Header(default=None)) -> dict:
    if not x_usuario_id:
        raise HTTPException(401, {"erro": "sem_usuario", "mensagem": "Entre com um usuário."})
    # Até o banco existir (T-05, T-06), a pessoa e o catálogo vêm do seed.
    pessoa = catalogo.usuario(x_usuario_id)
    if pessoa is None:
        raise HTTPException(
            401, {"erro": "usuario_desconhecido", "mensagem": "Usuário não encontrado."}
        )
    return busca.buscar(corpo.pedido, pessoa, corpo.tipo)
