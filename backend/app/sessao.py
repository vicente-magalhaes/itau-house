"""Identidade simulada da pessoa que chama a API."""

from typing import Annotated

from fastapi import Depends, Header

from app.erros import ErroApi
from app.repositorio import Repositorio, obter_repositorio


def usuario_atual(
    repositorio: Annotated[Repositorio, Depends(obter_repositorio)],
    x_usuario_id: Annotated[str | None, Header()] = None,
) -> dict:
    if not x_usuario_id:
        raise ErroApi(401, "sem_usuario", "Entre com um usuário.")
    pessoa = repositorio.usuario(x_usuario_id)
    if pessoa is None:
        raise ErroApi(401, "usuario_desconhecido", "Usuário não encontrado.")
    return pessoa
