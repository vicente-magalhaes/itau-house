"""Fluxos HTTP de catálogo, descoberta e publicação, em memória e na base local."""

import os
from urllib.parse import urlsplit

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.repositorio import RepositorioSupabase, obter_repositorio

cliente = TestClient(app)
RAFAEL = {"X-Usuario-Id": "u-rafael"}
JULIANA = {"X-Usuario-Id": "u-juliana"}
RENATO = {"X-Usuario-Id": "u-renato"}
NOME = "Massa de dados fictícios para testes de Pix"
CHAVE_FICTICIA = "ihs_demo_" + "x" * 12
ARQUIVO_BARRADO = {
    "caminho": "SKILL.md",
    "conteudo": f"---\ndescription: Teste.\n---\nAPI_KEY = '{CHAVE_FICTICIA}'\n",
}
ARQUIVO_CORRIGIDO = {
    "caminho": "SKILL.md",
    "conteudo": "---\ndescription: Teste.\n---\nAPI_KEY = os.getenv('API_KEY')\n",
}


@pytest.fixture(params=["memoria", pytest.param("supabase", marks=pytest.mark.supabase)])
def armazenamento(request, repositorio_isolado):
    if request.param == "supabase":
        url = os.environ.get("ITAU_HOUSE_TESTE_SUPABASE_URL")
        chave = os.environ.get("ITAU_HOUSE_TESTE_SUPABASE_KEY")
        if url:
            assert urlsplit(url).hostname in {"localhost", "127.0.0.1"}
        if not url or not chave:
            pytest.skip("Configure a base Supabase local descartável.")
        banco = RepositorioSupabase(url, chave)
        app.dependency_overrides[obter_repositorio] = lambda: banco
    yield request.param


def pedido(metodo, caminho, usuario=RAFAEL, **kwargs):
    return cliente.request(metodo, caminho, headers=usuario, **kwargs)


def rascunho(arquivo=ARQUIVO_BARRADO, visibilidade="squad"):
    return {
        "nome": NOME,
        "tipo": "skill",
        "resumo": "Massa fictícia.",
        "readme": "# Teste\nDocumentação fictícia.",
        "arquivos": [arquivo],
        "visibilidade": visibilidade,
    }


def test_catalogo_visibilidade_ordenacao_e_contrato(armazenamento):
    feed = pedido("GET", "/api/ativos").json()["ativos"]
    ids = {a["id"] for a in feed}
    assert not ids.intersection(
        {"a-criterios-fatura", "a-conciliacao-extrato", "a-botao-contratacao", "a-job-carga-fatura"}
    )
    assert {"a-resumo-incidente", "a-criterios-aceitacao"} <= ids
    assert [(a["curtidas"] + a["instalacoes"]) for a in feed] == sorted(
        [a["curtidas"] + a["instalacoes"] for a in feed], reverse=True
    )
    assert {"autor", "curtidoPorMim", "squadsQueReusaram"} <= set(feed[0])
    for id_ in (
        "a-criterios-fatura",
        "a-conciliacao-extrato",
        "a-botao-contratacao",
        "a-job-carga-fatura",
    ):
        assert pedido("GET", f"/api/ativos/{id_}").status_code == 404
    detalhe = pedido("GET", "/api/ativos/a-criterios-aceitacao").json()
    assert detalhe["id"] == "a-criterios-aceitacao"
    assert {"usos", "historico", "enviadoPor", "aprovadoPor", "manualInstalacao"} <= set(detalhe)
    assert (
        pedido("GET", "/api/ativos?ordem=curtidos").json()["ativos"][0]["curtidas"]
        >= feed[0]["curtidas"]
    )
    assert pedido("GET", "/api/ativos?ordem=novos").status_code == 200
    assert pedido("GET", "/api/ativos?ordem=invalida").status_code == 422


def test_decisoes_somam_contadores_e_registram_usos(armazenamento):
    id_ = "a-criterios-aceitacao"
    antes = pedido("GET", f"/api/ativos/{id_}").json()
    for decisao in ("usar", "adaptar"):
        resultado = pedido(
            "POST", "/api/decisoes", json={"buscaId": "b-demo", "ativoId": id_, "decisao": decisao}
        )
        assert resultado.status_code == 200, resultado.text
    depois = pedido("GET", f"/api/ativos/{id_}").json()
    assert depois["instalacoes"] == antes["instalacoes"] + 1
    assert depois["derivacoes"] == antes["derivacoes"] + 1
    assert depois["usos"][0]["tipo"] == "derivacao"
    assert len(depois["historico"]) >= len(antes["historico"]) + 4
    assert (
        pedido(
            "POST", "/api/decisoes", json={"buscaId": "b-demo", "decisao": "ignorar"}
        ).status_code
        == 200
    )
    assert (
        pedido("POST", "/api/decisoes", json={"buscaId": "b-demo", "decisao": "usar"}).status_code
        == 422
    )
    assert (
        pedido(
            "POST",
            "/api/decisoes",
            json={"buscaId": "b-demo", "decisao": "usar", "ativoId": "a-conciliacao-extrato"},
        ).status_code
        == 404
    )


def test_cena_2_com_bloqueio_correcao_fila_e_aprovacao(armazenamento):
    prevalidacao = pedido("POST", "/api/validacoes", json={"arquivos": [ARQUIVO_BARRADO]})
    assert prevalidacao.status_code == 200
    criado = pedido(
        "POST",
        "/api/ativos",
        json=rascunho() | {"validacaoIds": [prevalidacao.json()["validacaoId"]]},
    )
    assert criado.status_code == 201, criado.text
    id_ = criado.json()["id"]
    assert criado.json()["status"] == "rascunho"
    assert pedido("GET", f"/api/ativos/{id_}", usuario=JULIANA).status_code == 404
    barrado = pedido("POST", f"/api/ativos/{id_}/envio")
    assert barrado.status_code == 422 and barrado.json()["erro"] == "barrado"
    assert barrado.json()["validacao"]["resultado"] == "barrado"
    assert CHAVE_FICTICIA not in barrado.text
    assert pedido("GET", f"/api/ativos/{id_}").json()["status"] == "barrado"
    assert (
        pedido(
            "POST", f"/api/aprovacoes/{id_}", usuario=JULIANA, json={"decisao": "aprovar"}
        ).status_code
        == 404
    )
    editado = pedido("PATCH", f"/api/ativos/{id_}", json={"arquivos": [ARQUIVO_CORRIGIDO]})
    assert editado.status_code == 200, editado.text
    enviado = pedido("POST", f"/api/ativos/{id_}/envio")
    assert enviado.status_code == 200 and enviado.json()["status"] == "em_aprovacao", enviado.text
    fila = pedido("GET", "/api/aprovacoes", usuario=JULIANA).json()["itens"]
    item = next(item for item in fila if item["ativo"]["id"] == id_)
    assert [v["resultado"] for v in item["validacoes"]] == ["barrado", "barrado", "aprovado"]
    assert not any(
        item["ativo"]["id"] == id_
        for item in pedido("GET", "/api/aprovacoes", usuario=RENATO).json()["itens"]
    )
    assert pedido("GET", "/api/aprovacoes").status_code == 403
    assert pedido("GET", f"/api/ativos/{id_}", usuario=RENATO).status_code == 404
    assert (
        pedido(
            "POST", f"/api/aprovacoes/{id_}", usuario=JULIANA, json={"decisao": "devolver"}
        ).status_code
        == 422
    )
    aprovado = pedido(
        "POST", f"/api/aprovacoes/{id_}", usuario=JULIANA, json={"decisao": "aprovar"}
    )
    assert aprovado.status_code == 200 and aprovado.json()["status"] == "publicado"
    assert aprovado.json()["aprovadoPor"]["nome"] == "Juliana Prado"
    assert id_ in {a["id"] for a in pedido("GET", "/api/ativos").json()["ativos"]}
    assert pedido("GET", f"/api/ativos/{id_}", usuario=RENATO).status_code == 404
    assert (
        pedido(
            "POST", f"/api/aprovacoes/{id_}", usuario=JULIANA, json={"decisao": "aprovar"}
        ).status_code
        == 409
    )
    assert pedido("PATCH", f"/api/ativos/{id_}", json={"nome": "Outro"}).status_code == 409
    assert {"Validação realizada", "Enviado para aprovação", "Publicação aprovada"} <= {
        h["evento"] for h in aprovado.json()["historico"]
    }
    assert [h["evento"] for h in aprovado.json()["historico"]].count("Validação realizada") == 3
    assert [h["evento"] for h in aprovado.json()["historico"]].count("Publicação aprovada") == 1


def test_devolucao_e_alcance_escolhido(armazenamento):
    criado = pedido("POST", "/api/ativos", json=rascunho(ARQUIVO_CORRIGIDO, "frente"))
    id_ = criado.json()["id"]
    assert pedido("POST", f"/api/ativos/{id_}/envio").status_code == 200
    devolvido = pedido(
        "POST",
        f"/api/aprovacoes/{id_}",
        usuario=JULIANA,
        json={"decisao": "devolver", "comentario": "Explique melhor."},
    )
    assert devolvido.status_code == 200 and devolvido.json()["status"] == "devolvido"
    assert devolvido.json()["comentarioCoordenador"] == "Explique melhor."
    assert pedido("PATCH", f"/api/ativos/{id_}", json={"resumo": "Revisado"}).status_code == 200
    assert pedido("POST", f"/api/ativos/{id_}/envio").status_code == 200
    assert (
        pedido(
            "POST", f"/api/aprovacoes/{id_}", usuario=JULIANA, json={"decisao": "aprovar"}
        ).status_code
        == 200
    )
    assert (
        pedido("GET", f"/api/ativos/{id_}", usuario={"X-Usuario-Id": "u-thiago"}).status_code == 200
    )
    assert pedido("GET", f"/api/ativos/{id_}", usuario=RENATO).status_code == 404


def test_curtida_e_instalacao_pela_plataforma(armazenamento):
    id_ = "a-criterios-aceitacao"
    antes = pedido("GET", f"/api/ativos/{id_}").json()
    assert not antes["curtidoPorMim"]
    primeira = pedido("POST", f"/api/ativos/{id_}/curtida")
    assert primeira.status_code == 200
    assert primeira.json() == {"curtido": True, "curtidas": antes["curtidas"] + 1}
    assert pedido("GET", f"/api/ativos/{id_}").json()["curtidoPorMim"]
    assert not pedido("GET", f"/api/ativos/{id_}", usuario=JULIANA).json()["curtidoPorMim"]
    assert next(a for a in pedido("GET", "/api/ativos").json()["ativos"] if a["id"] == id_)[
        "curtidoPorMim"
    ]
    assert pedido("POST", f"/api/ativos/{id_}/curtida").json() == {
        "curtido": False,
        "curtidas": antes["curtidas"],
    }
    instalado = pedido("POST", f"/api/ativos/{id_}/instalacoes")
    assert instalado.json() == {"instalacoes": antes["instalacoes"] + 1}
    assert pedido("GET", f"/api/ativos/{id_}").json()["usos"][0]["tipo"] == "instalacao"
    assert pedido("POST", "/api/ativos/a-conciliacao-extrato/curtida").status_code == 404
    assert pedido("POST", "/api/ativos/a-conciliacao-extrato/instalacoes").status_code == 404


def test_usuario_exigido_em_todas_as_rotas(armazenamento):
    for metodo, caminho, dados in [
        ("GET", "/api/ativos", None),
        ("GET", "/api/ativos/a-criterios-aceitacao", None),
        ("POST", "/api/decisoes", {"buscaId": "b-1", "decisao": "ignorar"}),
        ("POST", "/api/ativos", rascunho(ARQUIVO_CORRIGIDO)),
        ("PATCH", "/api/ativos/a-criterios-aceitacao", {"nome": "Outro"}),
        ("POST", "/api/ativos/a-criterios-aceitacao/envio", None),
        ("POST", "/api/ativos/a-criterios-aceitacao/curtida", None),
        ("POST", "/api/ativos/a-criterios-aceitacao/instalacoes", None),
        ("GET", "/api/aprovacoes", None),
        ("POST", "/api/aprovacoes/a-criterios-aceitacao", {"decisao": "aprovar"}),
        ("POST", "/api/validacoes", {"arquivos": []}),
    ]:
        resposta = pedido(metodo, caminho, usuario={}, json=dados)
        assert resposta.status_code == 401, (caminho, resposta.text)
        assert set(resposta.json()) == {"erro", "mensagem"}
