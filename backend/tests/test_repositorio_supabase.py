"""Paridade das pessoas entre seed e Supabase descartável (RF-23)."""

import os
from collections import Counter
from urllib.parse import urlsplit

import httpx
import pytest
from fastapi.testclient import TestClient

from app.main import app
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


@pytest.fixture
def supabase_local():
    url = os.environ.get("ITAU_HOUSE_TESTE_SUPABASE_URL")
    chave = os.environ.get("ITAU_HOUSE_TESTE_SUPABASE_KEY")
    if url:
        assert urlsplit(url).hostname in {"localhost", "127.0.0.1"}
    if not url or not chave:
        pytest.skip("Configure URL e chave da base Supabase local para este teste.")
    return url, chave


@pytest.mark.supabase
def test_feed_detalhe_fila_e_usuario_limitam_consultas(supabase_local, monkeypatch) -> None:
    url, chave = supabase_local
    contagem = Counter()
    enviar = httpx.Client.send

    def contar(self, pedido, *args, **kwargs):
        if pedido.url.path.startswith("/rest/v1/"):
            contagem[pedido.url.path.removeprefix("/rest/v1/")] += 1
        return enviar(self, pedido, *args, **kwargs)

    monkeypatch.setattr(httpx.Client, "send", contar)
    cliente = TestClient(app)
    atual = [None]

    def repositorio_da_vez():
        return atual[0]

    app.dependency_overrides[obter_repositorio] = repositorio_da_vez
    for caminho, pessoa, limite in (
        ("/api/ativos", "u-rafael", 4),
        ("/api/ativos/a-criterios-aceitacao", "u-rafael", 8),
        ("/api/aprovacoes", "u-renato", 6),
    ):
        atual[0] = RepositorioSupabase(url, chave)
        contagem.clear()
        resposta = cliente.get(caminho, headers={"X-Usuario-Id": pessoa})
        assert resposta.status_code == 200
        if caminho == "/api/aprovacoes":
            assert "a-job-carga-fatura" in {
                item["ativo"]["id"] for item in resposta.json()["itens"]
            }
        assert sum(contagem.values()) <= limite, (caminho, contagem)
        assert contagem["usuarios"] == 1

    banco = RepositorioSupabase(url, chave)
    contagem.clear()
    assert banco.usuario("u-rafael")["id"] == "u-rafael"
    assert contagem == {"usuarios": 1}
    assert banco.usuario("u-juliana")["id"] == "u-juliana"
    assert contagem == {"usuarios": 1}


@pytest.mark.supabase
def test_cache_de_usuarios_se_renova_apos_60_segundos(supabase_local, monkeypatch) -> None:
    url, chave = supabase_local
    relogio = [100.0]
    monkeypatch.setattr("app.repositorio.monotonic", lambda: relogio[0])
    consultas = []
    enviar = httpx.Client.send

    def contar(self, pedido, *args, **kwargs):
        if pedido.url.path.startswith("/rest/v1/usuarios"):
            consultas.append(1)
        return enviar(self, pedido, *args, **kwargs)

    monkeypatch.setattr(httpx.Client, "send", contar)
    banco = RepositorioSupabase(url, chave)
    assert banco.usuario("u-rafael") is not None
    relogio[0] = 159.0
    assert banco.usuario("u-juliana") is not None
    assert len(consultas) == 1
    relogio[0] = 160.0
    assert banco.usuario("u-inventado") is None
    assert len(consultas) == 2
