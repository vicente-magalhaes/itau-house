"""Pessoas fictícias disponíveis para a sessão simulada."""

from typing import Annotated

from fastapi import APIRouter, Depends

from app.repositorio import Repositorio, obter_repositorio

router = APIRouter(prefix="/api", tags=["sessão"])


@router.get("/usuarios")
def usuarios(repositorio: Annotated[Repositorio, Depends(obter_repositorio)]) -> dict:
    return {"usuarios": sorted(repositorio.usuarios(), key=lambda pessoa: pessoa["nome"])}
