"""Contrato da sessão simulada e respostas de erro (RF-23, RF-24)."""

from typing import Annotated

from fastapi import Depends, HTTPException
from fastapi.testclient import TestClient

from app import catalogo
from app.erros import ErroApi
from app.main import app
from app.repositorio import RepositorioMemoria, obter_repositorio
from app.sessao import usuario_atual

cliente = TestClient(app)
CHAVES_PESSOA = {"id", "nome", "iniciais", "papel", "cargo", "squadId", "squad", "frente", "perfil"}


def test_usuarios_sem_cabecalho_ordenados_no_formato_do_contrato() -> None:
    resposta = cliente.get("/api/usuarios")

    assert resposta.status_code == 200
    pessoas = resposta.json()["usuarios"]
    assert len(pessoas) == 20
    assert [p["nome"] for p in pessoas] == sorted(p["nome"] for p in pessoas)
    assert all(set(p) == CHAVES_PESSOA for p in pessoas)
    assert {p["id"]: p for p in pessoas} == {p["id"]: p for p in catalogo.seed()["usuarios"]}


def test_usuario_atual_responde_com_a_pessoa_ou_401() -> None:
    def rota(pessoa: Annotated[dict, Depends(usuario_atual)]) -> dict:
        return pessoa

    app.add_api_route("/api/_teste_sessao", rota)
    rota_teste = app.router.routes[-1]
    try:
        sem_cabecalho = cliente.get("/api/_teste_sessao")
        desconhecido = cliente.get("/api/_teste_sessao", headers={"X-Usuario-Id": "u-inventado"})
        rafael = cliente.get("/api/_teste_sessao", headers={"X-Usuario-Id": "u-rafael"})
    finally:
        app.router.routes.remove(rota_teste)

    for resposta, codigo in (
        (sem_cabecalho, "sem_usuario"),
        (desconhecido, "usuario_desconhecido"),
    ):
        assert resposta.status_code == 401
        assert resposta.json()["erro"] == codigo
        assert resposta.json()["mensagem"]
        assert "detail" not in resposta.json()
    assert rafael.status_code == 200
    assert rafael.json() == catalogo.usuario("u-rafael")


def test_busca_sem_cabecalho_e_com_entrada_invalida() -> None:
    sem_usuario = cliente.post("/api/busca", json={"pedido": "busca válida"})
    entrada_invalida = cliente.post("/api/busca", json={}, headers={"X-Usuario-Id": "u-rafael"})

    assert sem_usuario.status_code == 401
    assert sem_usuario.json()["erro"] == "sem_usuario"
    assert "detail" not in sem_usuario.json()
    assert entrada_invalida.status_code == 422
    assert entrada_invalida.json()["erro"] == "entrada_invalida"
    assert "pedido" in entrada_invalida.json()["mensagem"]
    assert "detail" not in entrada_invalida.json()


def test_rota_inexistente_e_erro_http_generico() -> None:
    def rota() -> None:
        raise HTTPException(status_code=403, detail="forbidden")

    app.add_api_route("/api/_teste_http", rota)
    rota_teste = app.router.routes[-1]
    try:
        generico = cliente.get("/api/_teste_http")
    finally:
        app.router.routes.remove(rota_teste)

    inexistente = cliente.get("/api/nao-existe")
    assert inexistente.status_code == 404
    assert set(inexistente.json()) == {"erro", "mensagem"}
    assert generico.status_code == 403
    assert set(generico.json()) == {"erro", "mensagem"}
    assert "forbidden" not in generico.text


def test_erro_api_preserva_campo_extra() -> None:
    def rota() -> None:
        raise ErroApi(422, "barrado", "Corrija o ativo.", validacao={"resultado": "barrado"})

    app.add_api_route("/api/_teste_erro", rota)
    rota_teste = app.router.routes[-1]
    try:
        resposta = cliente.get("/api/_teste_erro")
    finally:
        app.router.routes.remove(rota_teste)

    assert resposta.status_code == 422
    assert resposta.json() == {
        "erro": "barrado",
        "mensagem": "Corrija o ativo.",
        "validacao": {"resultado": "barrado"},
    }


def test_mutacao_na_memoria_do_teste(repositorio_isolado) -> None:
    repositorio_isolado.usuario("u-rafael")["nome"] = "Nome alterado"
    assert (
        next(p for p in cliente.get("/api/usuarios").json()["usuarios"] if p["id"] == "u-rafael")[
            "nome"
        ]
        == "Nome alterado"
    )
    assert catalogo.usuario("u-rafael")["nome"] == "Rafael Nunes"


def test_memoria_do_teste_seguinte_esta_limpa() -> None:
    pessoas = cliente.get("/api/usuarios").json()["usuarios"]
    assert next(p for p in pessoas if p["id"] == "u-rafael")["nome"] == "Rafael Nunes"


def test_sem_configuracao_seleciona_memoria() -> None:
    obter_repositorio.cache_clear()
    assert isinstance(obter_repositorio(), RepositorioMemoria)
