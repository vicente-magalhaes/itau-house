"""Paridade das pessoas entre seed e Supabase descartável (RF-23)."""

import os
from urllib.parse import urlsplit

import pytest

from app.repositorio import RepositorioMemoria, RepositorioSupabase, obter_repositorio


@pytest.mark.supabase
def test_pessoas_do_supabase_local_sao_iguais_as_da_memoria(monkeypatch) -> None:
    url = os.environ.get("ITAU_HOUSE_TESTE_SUPABASE_URL")
    chave = os.environ.get("ITAU_HOUSE_TESTE_SUPABASE_KEY")
    if url:
        assert urlsplit(url).hostname in {"localhost", "127.0.0.1"}
    if not url or not chave:
        pytest.skip("Configure URL e chave da base Supabase local para este teste.")

    monkeypatch.setenv("SUPABASE_URL", url)
    monkeypatch.setenv("SUPABASE_SECRET_KEY", chave)
    obter_repositorio.cache_clear()
    try:
        assert isinstance(obter_repositorio(), RepositorioSupabase)
    finally:
        obter_repositorio.cache_clear()

    memoria = RepositorioMemoria()
    supabase = RepositorioSupabase(url, chave)
    esperado = {p["id"]: p for p in memoria.usuarios()}
    encontrado = {p["id"]: p for p in supabase.usuarios()}

    assert encontrado == esperado
    for usuario_id, pessoa in esperado.items():
        assert supabase.usuario(usuario_id) == pessoa
    assert supabase.usuario("u-inventado") is None
