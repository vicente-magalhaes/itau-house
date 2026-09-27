"""Busca com justificativa (RF-05, RF-06, RF-11) e respostas gravadas (RNF-04)."""

import pytest
from fastapi.testclient import TestClient

from app import busca
from app.main import app

CENA1 = "cria uma skill que transforma a demanda em critérios de aceitação e casos de teste"
CENA2 = "cria uma skill que gera massa de dados fictícios para testes de Pix, usando meu script scripts/gerar_massa.py"

cliente = TestClient(app)


def _buscar(pedido, usuario="u-rafael"):
    return cliente.post(
        "/api/busca", json={"pedido": pedido, "tipo": "skill"}, headers={"X-Usuario-Id": usuario}
    )


@pytest.fixture
def sem_claude(monkeypatch):
    monkeypatch.delenv("ANTHROPIC_API_KEY", raising=False)
    monkeypatch.delenv("GEMINI_API_KEY", raising=False)


@pytest.fixture
def claude_falso(monkeypatch):
    """Troca a chamada ao Claude por uma resposta fixa, para testar os filtros do back."""
    respostas = {}

    def falso(pedido, tipo, candidatos):
        respostas["candidatos"] = {c["id"] for c in candidatos}
        return respostas["sugestoes"]

    monkeypatch.setattr(busca, "ranquear_com_claude", falso)
    return respostas


def test_cena1_sem_claude_usa_resposta_gravada(sem_claude) -> None:
    r = _buscar(CENA1).json()

    assert r["gravada"] is True
    assert r["encontrou"] is True
    [s] = r["sugestoes"]
    assert s["ativo"]["id"] == "a-criterios-aceitacao"
    assert s["ativo"]["autor"]["nome"] == "Marina Alves"
    assert (s["ativo"]["curtidas"], s["ativo"]["instalacoes"]) == (23, 41)
    assert s["limite"] == "Não gera casos de teste."
    assert "Marina Alves, PM da squad Cartões · Fatura" in r["mensagem"]


def test_cena2_sem_claude_nao_encontra(sem_claude) -> None:
    r = _buscar(CENA2).json()

    assert (r["encontrou"], r["gravada"], r["sugestoes"]) == (False, True, [])
    assert r["mensagem"].startswith("Não encontrei nada parecido")


def test_pedido_fora_da_demo_sem_claude_avisa_que_esta_fora_do_ar(sem_claude) -> None:
    r = _buscar("cria um agente que resume reunião").json()

    assert r["indisponivel"] is True
    assert r["sugestoes"] == []


def test_ativo_de_squad_de_outra_squad_nem_chega_ao_claude(claude_falso) -> None:
    claude_falso["sugestoes"] = []
    _buscar(CENA1)

    assert "a-criterios-aceitacao" in claude_falso["candidatos"]
    assert "a-criterios-fatura" not in claude_falso["candidatos"]
    assert "a-conciliacao-extrato" not in claude_falso["candidatos"]
    assert "a-job-carga-fatura" not in claude_falso["candidatos"]


def test_back_descarta_inventado_invisivel_e_semelhanca_baixa(claude_falso) -> None:
    claude_falso["sugestoes"] = [
        {"id": "a-nao-existe", "semelhanca": "alta", "motivo": "x", "limite": ""},
        {"id": "a-criterios-fatura", "semelhanca": "alta", "motivo": "x", "limite": ""},
        {"id": "a-revisor-pr", "semelhanca": "baixa", "motivo": "x", "limite": ""},
        {"id": "a-kb-alucinacao", "semelhanca": "media", "motivo": "m", "limite": ""},
        {"id": "a-criterios-aceitacao", "semelhanca": "alta", "motivo": "a", "limite": ""},
    ]
    r = _buscar(CENA1).json()

    assert r["gravada"] is False
    assert [s["ativo"]["id"] for s in r["sugestoes"]] == [
        "a-criterios-aceitacao",
        "a-kb-alucinacao",
    ]
    assert r["sugestoes"][0]["limite"] is None


def test_no_maximo_tres_sugestoes(claude_falso) -> None:
    ids = [
        "a-criterios-aceitacao",
        "a-kb-alucinacao",
        "a-ata-notebook",
        "a-grau-mudanca",
        "a-revisor-pr",
    ]
    claude_falso["sugestoes"] = [
        {"id": i, "semelhanca": "media", "motivo": "m", "limite": ""} for i in ids
    ]

    assert len(_buscar(CENA1).json()["sugestoes"]) == 3


def test_claude_fora_do_ar_cai_na_gravada(monkeypatch) -> None:
    def cai(*_, **__):
        raise busca.Indisponivel("timeout")

    monkeypatch.setattr(busca, "ranquear_com_claude", cai)
    monkeypatch.setattr(busca, "ranquear_com_gemini", cai)

    assert _buscar(CENA1).json()["gravada"] is True


def test_claude_fora_do_ar_usa_o_gemini(monkeypatch) -> None:
    def cai(*_, **__):
        raise busca.Indisponivel("401")

    def gemini(pedido, tipo, candidatos, timeout):
        return [{"id": "a-criterios-aceitacao", "semelhanca": "alta", "motivo": "m", "limite": ""}]

    monkeypatch.setattr(busca, "ranquear_com_claude", cai)
    monkeypatch.setattr(busca, "ranquear_com_gemini", gemini)
    r = _buscar(CENA1).json()

    assert (r["gravada"], r["modelo"]) == (False, "gemini-3.8-flash")
    assert r["sugestoes"][0]["ativo"]["id"] == "a-criterios-aceitacao"


def test_sem_usuario_responde_401() -> None:
    assert cliente.post("/api/busca", json={"pedido": CENA1}).status_code == 401
