"""Catálogo fictício (T-04) e regra de visibilidade (RF-05, RNF-07).

O seed em `dados/seed.json` segue o formato do contrato (docs/api.md). Até o banco existir
(T-05), a busca e os testes leem daqui. Depois, serve de fonte para o seed do Supabase.
"""

import json
from functools import cache
from pathlib import Path

_SEED = Path(__file__).parent / "dados" / "seed.json"


@cache
def seed() -> dict:
    return json.loads(_SEED.read_text(encoding="utf-8"))


def usuario(usuario_id: str) -> dict | None:
    return next((u for u in seed()["usuarios"] if u["id"] == usuario_id), None)


def visivel(ativo: dict, pessoa: dict) -> bool:
    """Regra única de visibilidade. Vale para feed, detalhe, busca e MCP."""
    if ativo["autorId"] == pessoa["id"]:
        return True
    if ativo["status"] != "publicado":
        return False
    if ativo["visibilidade"] == "banco":
        return True
    if ativo["visibilidade"] == "frente":
        return ativo["frente"] == pessoa["frente"]
    return ativo["squadId"] == pessoa["squadId"]


def visiveis_para(pessoa: dict) -> list[dict]:
    return [a for a in seed()["ativos"] if visivel(a, pessoa)]


def _autor(usuario_id: str) -> dict:
    u = usuario(usuario_id) or {}
    return {k: u.get(k) for k in ("id", "nome", "iniciais", "cargo", "papel", "squad")}


def resumo(ativo: dict, pessoa: dict | None = None) -> dict:
    """AtivoResumo do contrato (docs/api.md): o card do feed e o item da busca."""
    campos = [
        "id",
        "nome",
        "tipo",
        "resumo",
        "squad",
        "frente",
        "visibilidade",
        "status",
        "tags",
        "ferramentas",
        "versao",
        "publicadoEm",
        "atualizadoEm",
        "curtidas",
        "instalacoes",
        "derivacoes",
        "squadsQueReusaram",
    ]
    # TODO(T-06): curtidoPorMim sai da tabela curtidas quando a API ler do banco.
    return {k: ativo.get(k) for k in campos} | {
        "autor": _autor(ativo["autorId"]),
        "curtidoPorMim": False,
    }
