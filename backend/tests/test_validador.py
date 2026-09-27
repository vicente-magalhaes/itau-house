"""Validador sem IA (RF-14, RF-15, D-26), com os arquivos da cena 2 do roteiro."""

from fastapi.testclient import TestClient

from app.main import app

SKILL = """---
name: massa-pix
description: Gera massa de dados fictícios para testes de Pix.
---
Rode scripts/gerar_massa.py para gerar a massa.
"""

SCRIPT_COM_CHAVE = "\n".join(
    [f"# linha {n}" for n in range(1, 12)] + ['API_KEY = "ihs_demo_9f3a7c21b8e4"', "print(API_KEY)"]
)
SCRIPT_CORRIGIDO = SCRIPT_COM_CHAVE.replace(
    'API_KEY = "ihs_demo_9f3a7c21b8e4"', 'API_KEY = os.environ["ITAU_HOUSE_API_KEY"]'
)

cliente = TestClient(app)


def _validar(arquivos, usuario="u-rafael"):
    cabecalhos = {"X-Usuario-Id": usuario} if usuario else {}
    return cliente.post("/api/validacoes", json={"arquivos": arquivos}, headers=cabecalhos)


def test_cena2_barra_a_chave_com_arquivo_linha_e_sugestao() -> None:
    r = _validar(
        [
            {"caminho": "SKILL.md", "conteudo": SKILL},
            {"caminho": "scripts/gerar_massa.py", "conteudo": SCRIPT_COM_CHAVE},
        ]
    )

    assert r.status_code == 200
    corpo = r.json()
    assert corpo["resultado"] == "barrado"
    falha = next(i for i in corpo["itens"] if i["resultado"] == "falhou")
    assert falha["criterio"] == "segredo"
    assert falha["arquivo"] == "scripts/gerar_massa.py"
    assert falha["linha"] == 12
    assert "variável de ambiente" in falha["comoCorrigir"]
    # O segredo nunca volta inteiro.
    assert "9f3a7c21b8e4" not in r.text
    assert "ihs_demo_••••" in falha["trecho"]


def test_cena2_corrigida_passa() -> None:
    r = _validar(
        [
            {"caminho": "SKILL.md", "conteudo": SKILL},
            {"caminho": "scripts/gerar_massa.py", "conteudo": SCRIPT_CORRIGIDO},
        ]
    )

    corpo = r.json()
    assert corpo["resultado"] == "aprovado"
    assert [i["criterio"] for i in corpo["itens"]] == ["segredo", "dado_pessoal", "readme", "autor"]
    assert corpo["validacaoId"].startswith("v-")


def test_cpf_barra_mesmo_de_exemplo() -> None:
    r = _validar([{"caminho": "SKILL.md", "conteudo": SKILL + "Exemplo: 123.456.789-00\n"}])

    item = r.json()["itens"][1]
    assert r.json()["resultado"] == "barrado"
    assert (item["criterio"], item["linha"]) == ("dado_pessoal", 6)


def test_email_real_barra_e_email_de_exemplo_passa() -> None:
    real = _validar(
        [{"caminho": "SKILL.md", "conteudo": SKILL + "Fale com joao.silva@gmail.com\n"}]
    )
    exemplo = _validar([{"caminho": "SKILL.md", "conteudo": SKILL + "Use nome@exemplo.com\n"}])

    assert real.json()["resultado"] == "barrado"
    assert exemplo.json()["resultado"] == "aprovado"


def test_sem_descricao_barra() -> None:
    r = _validar([{"caminho": "scripts/gerar_massa.py", "conteudo": SCRIPT_CORRIGIDO}])

    readme = next(i for i in r.json()["itens"] if i["criterio"] == "readme")
    assert readme["resultado"] == "falhou"


def test_usuario_desconhecido_barra_por_autor() -> None:
    r = _validar([{"caminho": "SKILL.md", "conteudo": SKILL}], usuario="u-nao-existe")

    autor = next(i for i in r.json()["itens"] if i["criterio"] == "autor")
    assert autor["resultado"] == "falhou"


def test_sem_usuario_responde_401() -> None:
    r = _validar([{"caminho": "SKILL.md", "conteudo": SKILL}], usuario=None)

    assert r.status_code == 401
