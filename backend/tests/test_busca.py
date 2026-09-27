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
def sem_chave(monkeypatch):
    monkeypatch.delenv("GEMINI_API_KEY", raising=False)


@pytest.fixture
def gemini_falso(monkeypatch):
    """Troca a chamada ao Gemini por uma resposta fixa, para testar os filtros do back."""
    respostas = {}

    def falso(pedido, tipo, candidatos):
        respostas["candidatos"] = {c["id"] for c in candidatos}
        return respostas["sugestoes"]

    monkeypatch.setattr(busca, "ranquear_com_gemini", falso)
    return respostas


def test_cena1_sem_ia_usa_resposta_gravada(sem_chave) -> None:
    r = _buscar(CENA1).json()

    assert r["gravada"] is True
    assert r["encontrou"] is True
    [s] = r["sugestoes"]
    assert s["ativo"]["id"] == "a-criterios-aceitacao"
    assert s["ativo"]["autor"]["nome"] == "Marina Alves"
    assert (s["ativo"]["curtidas"], s["ativo"]["instalacoes"]) == (23, 41)
    assert s["limite"] == "Não gera casos de teste."
    assert "Marina Alves, PM da squad Cartões · Fatura" in r["mensagem"]


def test_cena2_sem_ia_nao_encontra(sem_chave) -> None:
    r = _buscar(CENA2).json()

    assert (r["encontrou"], r["gravada"], r["sugestoes"]) == (False, True, [])
    assert r["mensagem"].startswith("Não encontrei nada parecido")


def test_pedido_fora_da_demo_sem_ia_avisa_que_esta_fora_do_ar(sem_chave) -> None:
    r = _buscar("cria um agente que resume reunião").json()

    assert r["indisponivel"] is True
    assert r["sugestoes"] == []


def test_ativo_de_squad_de_outra_squad_nem_chega_ao_gemini(gemini_falso) -> None:
    gemini_falso["sugestoes"] = []
    _buscar(CENA1)

    assert "a-criterios-aceitacao" in gemini_falso["candidatos"]
    assert "a-criterios-fatura" not in gemini_falso["candidatos"]
    assert "a-conciliacao-extrato" not in gemini_falso["candidatos"]
    assert "a-job-carga-fatura" not in gemini_falso["candidatos"]


def test_back_descarta_inventado_invisivel_e_semelhanca_baixa(gemini_falso) -> None:
    gemini_falso["sugestoes"] = [
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


def test_no_maximo_tres_sugestoes(gemini_falso) -> None:
    ids = [
        "a-criterios-aceitacao",
        "a-kb-alucinacao",
        "a-ata-notebook",
        "a-grau-mudanca",
        "a-revisor-pr",
    ]
    gemini_falso["sugestoes"] = [
        {"id": i, "semelhanca": "media", "motivo": "m", "limite": ""} for i in ids
    ]

    assert len(_buscar(CENA1).json()["sugestoes"]) == 3


def test_gemini_fora_do_ar_cai_na_gravada(monkeypatch) -> None:
    def cai(*_, **__):
        raise busca.Indisponivel("timeout")

    monkeypatch.setattr(busca, "ranquear_com_gemini", cai)
    r = _buscar(CENA1).json()

    assert (r["gravada"], r["modelo"]) == (True, None)


def test_resposta_diz_qual_modelo_do_gemini_ranqueou(gemini_falso) -> None:
    gemini_falso["sugestoes"] = [
        {"id": "a-criterios-aceitacao", "semelhanca": "alta", "motivo": "m", "limite": ""}
    ]
    r = _buscar(CENA1).json()

    assert (r["gravada"], r["modelo"]) == (False, busca.MODELO_GEMINI)
    assert r["sugestoes"][0]["ativo"]["id"] == "a-criterios-aceitacao"


def test_sem_usuario_responde_401() -> None:
    assert cliente.post("/api/busca", json={"pedido": CENA1}).status_code == 401
