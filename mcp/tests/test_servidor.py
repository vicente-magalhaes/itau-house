import contextlib
import json
from pathlib import Path

import anyio
import httpx
import pytest
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

import servidor

CLIENTE_REAL = httpx.Client


@pytest.fixture
def api_falsa(monkeypatch):
    chamadas = []

    def responder(requisicao):
        chamadas.append(requisicao)
        return httpx.Response(200, json={"ok": True})

    transporte = httpx.MockTransport(responder)
    monkeypatch.setattr(
        servidor.httpx, "Client", lambda **opcoes: CLIENTE_REAL(transport=transporte, **opcoes)
    )
    monkeypatch.setenv("ITAU_HOUSE_API", "http://127.0.0.1:8000/")
    monkeypatch.setenv("ITAU_HOUSE_USUARIO", "u-rafael")
    monkeypatch.setenv("ITAU_HOUSE_MODO", "perguntar_antes")
    return chamadas


def conferir_chamada(chamadas, metodo, caminho, corpo=None):
    assert len(chamadas) == 1
    requisicao = chamadas.pop()
    assert requisicao.method == metodo
    assert requisicao.url.path == caminho
    assert requisicao.url.host == "127.0.0.1"
    assert requisicao.headers["X-Usuario-Id"] == "u-rafael"
    if corpo is None:
        assert not requisicao.content
    else:
        assert json.loads(requisicao.content) == corpo


def test_descoberta_e_decisao(api_falsa):
    assert json.loads(servidor.buscar_ativos("Preciso de uma skill", "skill")) == {"ok": True}
    conferir_chamada(
        api_falsa,
        "POST",
        "/api/busca",
        {"pedido": "Preciso de uma skill", "tipo": "skill", "modo": "perguntar_antes"},
    )

    servidor.detalhar_ativo("a-exemplo")
    conferir_chamada(api_falsa, "GET", "/api/ativos/a-exemplo")

    servidor.registrar_decisao("b-1", "a-exemplo", "adaptar")
    conferir_chamada(
        api_falsa,
        "POST",
        "/api/decisoes",
        {"buscaId": "b-1", "ativoId": "a-exemplo", "decisao": "adaptar"},
    )
    servidor.registrar_decisao("b-1", None, "ignorar")
    conferir_chamada(
        api_falsa,
        "POST",
        "/api/decisoes",
        {"buscaId": "b-1", "ativoId": None, "decisao": "ignorar"},
    )

    servidor.enviar_para_aprovacao("a-exemplo")
    conferir_chamada(api_falsa, "POST", "/api/ativos/a-exemplo/envio")


def test_modo_configuravel(api_falsa, monkeypatch):
    monkeypatch.setenv("ITAU_HOUSE_MODO", "proativo")
    servidor.buscar_ativos("Pedido")
    conferir_chamada(
        api_falsa, "POST", "/api/busca", {"pedido": "Pedido", "tipo": None, "modo": "proativo"}
    )


def test_envio_vem_com_link_do_post(api_falsa, monkeypatch):
    monkeypatch.setenv("ITAU_HOUSE_SITE", "https://site.exemplo")
    corpo = json.loads(servidor.enviar_para_aprovacao("a-1"))
    assert corpo["ok"] is True
    assert corpo["link"] == "[seu post no Itaú House](https://site.exemplo/#/ativo/a-1)"


def test_sugestao_vem_com_link_do_site(monkeypatch):
    monkeypatch.setenv("ITAU_HOUSE_SITE", "https://site.exemplo/")
    ativo = {"id": "a-criterios-aceitacao", "tipo": "skill", "autor": {"nome": "Marina Alves"}}
    corpo = json.loads(servidor._com_links(json.dumps({"sugestoes": [{"ativo": ativo}]})))
    url = "https://site.exemplo/#/ativo/a-criterios-aceitacao"
    assert corpo["sugestoes"][0]["url"] == url
    assert corpo["sugestoes"][0]["link"] == f"[skill de Marina]({url})"
    assert "comoMostrarLink" in corpo
    # Sem sugestões ou sem JSON, a resposta passa intacta.
    assert servidor._com_links('{"encontrou": false, "sugestoes": []}') == '{"encontrou": false, "sugestoes": []}'
    assert servidor._com_links("<html>") == "<html>"


def test_leitura_de_pasta_e_arquivo(api_falsa, tmp_path):
    (tmp_path / "scripts").mkdir()
    (tmp_path / "scripts" / "gerar.py").write_text(
        "primeira\nsegunda\n", encoding="utf-8", newline="\n"
    )
    (tmp_path / "SKILL.md").write_text("description: Exemplo\n", encoding="utf-8", newline="\n")
    for pasta in (".git", "__pycache__", "node_modules"):
        (tmp_path / pasta).mkdir()
        (tmp_path / pasta / "oculto.txt").write_text("ignorar", encoding="utf-8")
    (tmp_path / "binario.dat").write_bytes(b"abc\x00def")
    (tmp_path / "grande.txt").write_text("x" * (200 * 1024 + 1), encoding="utf-8")
    # No Windows, criar atalho pede permissão de administrador. Sem ele, o teste segue.
    with contextlib.suppress(OSError):
        (tmp_path / "atalho.txt").symlink_to(tmp_path / "SKILL.md")

    servidor.validar_ativo(str(tmp_path))
    conferir_chamada(
        api_falsa,
        "POST",
        "/api/validacoes",
        {
            "arquivos": [
                {"caminho": "SKILL.md", "conteudo": "description: Exemplo\n"},
                {"caminho": "scripts/gerar.py", "conteudo": "primeira\nsegunda\n"},
            ]
        },
    )

    servidor.validar_ativo(str(tmp_path / "scripts" / "gerar.py"))
    conferir_chamada(
        api_falsa,
        "POST",
        "/api/validacoes",
        {"arquivos": [{"caminho": "gerar.py", "conteudo": "primeira\nsegunda\n"}]},
    )


def test_montar_post_cria_e_edita_somente_os_campos_fornecidos(api_falsa, tmp_path):
    (tmp_path / "SKILL.md").write_text("description: Exemplo\n", encoding="utf-8", newline="\n")
    arquivos = [{"caminho": "SKILL.md", "conteudo": "description: Exemplo\n"}]

    servidor.montar_post(
        str(tmp_path),
        nome="Exemplo",
        tipo="skill",
        resumo="Resumo",
        readme="Instruções",
        manual_instalacao="Copie a pasta.",
        tags=["teste"],
        derivado_de="a-origem",
        validacao_ids=["v-1"],
    )
    conferir_chamada(
        api_falsa,
        "POST",
        "/api/ativos",
        {
            "arquivos": arquivos,
            "nome": "Exemplo",
            "tipo": "skill",
            "resumo": "Resumo",
            "readme": "Instruções",
            "manualInstalacao": "Copie a pasta.",
            "tags": ["teste"],
            "visibilidade": "squad",
            "derivadoDe": "a-origem",
            "validacaoIds": ["v-1"],
        },
    )
    servidor.montar_post(str(tmp_path), id="a-1", visibilidade="frente")
    conferir_chamada(
        api_falsa,
        "PATCH",
        "/api/ativos/a-1",
        {"arquivos": arquivos, "visibilidade": "frente"},
    )


def test_erros_da_api_e_conexao(api_falsa, monkeypatch):
    transporte = httpx.MockTransport(
        lambda requisicao: httpx.Response(
            422, json={"erro": "barrado", "mensagem": "Revise o arquivo."}
        )
    )

    def cliente_com_timeout(**opcoes):
        assert opcoes["timeout"] == 90
        return CLIENTE_REAL(transport=transporte, **opcoes)

    monkeypatch.setattr(servidor.httpx, "Client", cliente_com_timeout)
    assert json.loads(servidor.enviar_para_aprovacao("a-1")) == {
        "erro": "barrado",
        "mensagem": "Revise o arquivo.",
    }

    def fora_do_ar(requisicao):
        raise httpx.ConnectError("indisponível", request=requisicao)

    transporte = httpx.MockTransport(fora_do_ar)
    assert json.loads(servidor.detalhar_ativo("a-1")) == {
        "erro": "api_fora_do_ar",
        "mensagem": "A API do Itaú House está fora do ar. Tente novamente.",
    }


def test_resposta_sem_json_nao_vira_excecao(api_falsa, monkeypatch):
    transporte = httpx.MockTransport(
        lambda requisicao: httpx.Response(502, text="<html>Bad Gateway</html>")
    )
    monkeypatch.setattr(
        servidor.httpx, "Client", lambda **opcoes: CLIENTE_REAL(transport=transporte, **opcoes)
    )
    resposta = json.loads(servidor.detalhar_ativo("a-1"))
    assert resposta["erro"] == "resposta_invalida"
    assert "502" in resposta["mensagem"]


def test_pasta_inexistente_nao_chama_api(api_falsa, tmp_path):
    assert json.loads(servidor.validar_ativo(str(tmp_path / "nao-existe")))["erro"] == (
        "arquivo_invalido"
    )
    assert not api_falsa


def test_servidor_stdio_lista_ferramentas():
    raiz = Path(__file__).resolve().parents[2]

    async def listar():
        parametros = StdioServerParameters(
            command="uv",
            args=["run", "--directory", "mcp", "python", "servidor.py"],
            cwd=raiz,
        )
        async with (
            stdio_client(parametros) as (leitura, escrita),
            ClientSession(leitura, escrita) as sessao,
        ):
            await sessao.initialize()
            ferramentas = await sessao.list_tools()
            assert {f.name for f in ferramentas.tools} == {
                "buscar_ativos",
                "detalhar_ativo",
                "registrar_decisao",
                "validar_ativo",
                "montar_post",
                "enviar_para_aprovacao",
            }
            assert all(f.description for f in ferramentas.tools)

    anyio.run(listar)


@pytest.mark.smoke
def test_fumaca_backend_local(tmp_path, monkeypatch):
    monkeypatch.setenv("ITAU_HOUSE_API", "http://127.0.0.1:8000")
    monkeypatch.setenv("ITAU_HOUSE_USUARIO", "u-rafael")
    pedido = "cria uma skill que transforma a demanda em critérios de aceitação e casos de teste"
    busca = json.loads(servidor.buscar_ativos(pedido, "skill"))
    assert busca["gravada"] is True
    assert busca["encontrou"] is True

    (tmp_path / "scripts").mkdir()
    linhas = ["# Exemplo fictício"] * 11 + ["API_KEY = '" + "ihs_demo_" + "A" * 12 + "'"]
    (tmp_path / "scripts" / "gerar_massa.py").write_text("\n".join(linhas), encoding="utf-8")
    (tmp_path / "SKILL.md").write_text(
        "---\ndescription: Massa fictícia para testes\n---\n", encoding="utf-8"
    )
    validacao = json.loads(servidor.validar_ativo(str(tmp_path)))
    assert validacao["resultado"] == "barrado"
    assert any(
        item["criterio"] == "segredo"
        and item["arquivo"] == "scripts/gerar_massa.py"
        and item["linha"] == 12
        for item in validacao["itens"]
    )
