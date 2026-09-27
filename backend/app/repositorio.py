"""Acesso aos usuários do catálogo, em memória ou no Supabase."""

import os
from copy import deepcopy
from functools import lru_cache
from typing import Protocol

from supabase import create_client

from app import catalogo


class Repositorio(Protocol):
    def usuarios(self) -> list[dict]: ...

    def usuario(self, usuario_id: str) -> dict | None: ...


class RepositorioMemoria:
    def __init__(self) -> None:
        self._dados = deepcopy(catalogo.seed())

    def usuarios(self) -> list[dict]:
        return self._dados["usuarios"]

    def usuario(self, usuario_id: str) -> dict | None:
        return next((u for u in self.usuarios() if u["id"] == usuario_id), None)


class RepositorioSupabase:
    def __init__(self, url: str, chave: str) -> None:
        self._cliente = create_client(url, chave)

    @staticmethod
    def _pessoa(linha: dict) -> dict:
        return {
            "id": linha["id"],
            "nome": linha["nome"],
            "iniciais": linha["iniciais"],
            "papel": linha["papel"],
            "cargo": linha["cargo"],
            "squadId": linha["squad_id"],
            "squad": linha["squads"]["nome"],
            "frente": linha["squads"]["frente"],
            "perfil": linha["perfil"],
        }

    def _consulta(self):
        return self._cliente.table("usuarios").select(
            "id,nome,iniciais,papel,cargo,squad_id,perfil,squads(nome,frente)"
        )

    def usuarios(self) -> list[dict]:
        return [self._pessoa(linha) for linha in self._consulta().execute().data]

    def usuario(self, usuario_id: str) -> dict | None:
        linhas = self._consulta().eq("id", usuario_id).limit(1).execute().data
        return self._pessoa(linhas[0]) if linhas else None


@lru_cache(maxsize=1)
def obter_repositorio() -> Repositorio:
    url = os.environ.get("SUPABASE_URL")
    chave = os.environ.get("SUPABASE_SECRET_KEY")
    if url and chave:
        return RepositorioSupabase(url, chave)
    return RepositorioMemoria()
