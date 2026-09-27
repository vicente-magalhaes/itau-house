"""Estado da sessão, compartilhado entre os hooks. Um arquivo JSON por sessão, na pasta temporária."""

import json
import os
import sys
import tempfile
from pathlib import Path

MODOS = ("perguntar_antes", "proativo", "sob_demanda")


def modo() -> str:
    """Modo do plugin. Sem escolha explícita, perguntar antes (RF-02, D-17)."""
    escolhido = os.environ.get("ITAU_HOUSE_MODO", "perguntar_antes")
    return escolhido if escolhido in MODOS else "perguntar_antes"


def ler_entrada() -> dict:
    try:
        return json.load(sys.stdin)
    except (json.JSONDecodeError, ValueError):
        return {}


def _arquivo(sessao: str) -> Path:
    pasta = Path(tempfile.gettempdir()) / "itau-house"
    pasta.mkdir(exist_ok=True)
    return pasta / f"{sessao or 'sem-sessao'}.json"


def carregar(sessao: str) -> dict:
    try:
        return json.loads(_arquivo(sessao).read_text(encoding="utf-8"))
    except (FileNotFoundError, json.JSONDecodeError):
        return {}


def salvar(sessao: str, estado: dict) -> None:
    _arquivo(sessao).write_text(json.dumps(estado, ensure_ascii=False), encoding="utf-8")
