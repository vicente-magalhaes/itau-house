"""O seed cumpre o que o roteiro da demo pede (docs/roteiro-demo.md, "O que o seed precisa")."""

from app import catalogo, validador

RAFAEL = catalogo.usuario("u-rafael")


def _ids_visiveis(pessoa):
    return {a["id"] for a in catalogo.visiveis_para(pessoa)}


def test_elenco_do_roteiro() -> None:
    marina = catalogo.usuario("u-marina")
    juliana = catalogo.usuario("u-juliana")
    renato = catalogo.usuario("u-renato")

    assert (RAFAEL["papel"], RAFAEL["squad"], RAFAEL["perfil"]) == (
        "dev",
        "Pix · Cobranças",
        "cord_menos",
    )
    assert (marina["cargo"], marina["squad"]) == ("PM", "Cartões · Fatura")
    assert (juliana["squadId"], juliana["perfil"]) == (RAFAEL["squadId"], "cord_mais")
    # Cord+ de outro squad, para conferir que ele não vê a fila da Pix (RF-19).
    assert renato["perfil"] == "cord_mais" and renato["squadId"] != RAFAEL["squadId"]


def test_skill_da_marina_com_os_numeros_do_roteiro() -> None:
    skill = next(a for a in catalogo.seed()["ativos"] if a["id"] == "a-criterios-aceitacao")

    assert skill["nome"] == "Demanda em critérios de aceitação"
    assert (skill["visibilidade"], skill["status"]) == ("banco", "publicado")
    assert (skill["curtidas"], skill["instalacoes"], skill["derivacoes"]) == (23, 41, 3)
    assert "a-criterios-aceitacao" in _ids_visiveis(RAFAEL)


def test_ativo_de_squad_de_outra_squad_nunca_aparece_para_o_rafael() -> None:
    visiveis = _ids_visiveis(RAFAEL)

    assert "a-criterios-fatura" not in visiveis  # squad, outra frente
    assert "a-conciliacao-extrato" not in visiveis  # squad, mesma frente
    assert "a-botao-contratacao" not in visiveis  # frente Cartões
    assert "a-resumo-incidente" in visiveis  # frente Pix
    assert "a-job-carga-fatura" not in visiveis  # em aprovação


def test_nenhum_ativo_de_massa_de_dados() -> None:
    # A cena 2 depende de "não encontrei".
    for a in catalogo.seed()["ativos"]:
        assert "massa" not in (a["nome"] + a["resumo"]).lower()


def test_ativos_publicados_passam_no_validador() -> None:
    for a in catalogo.seed()["ativos"]:
        arquivos = [validador.Arquivo(x["caminho"], x["conteudo"]) for x in a["arquivos"]]
        arquivos.append(validador.Arquivo("README.md", a["readme"]))
        itens = validador.validar(arquivos, a["autorId"], a["squadId"])
        assert validador.resultado(itens) == "aprovado", a["id"]


def test_cord_mais_ve_a_fila_do_proprio_squad_e_so_ela() -> None:
    em_fila = {
        "autorId": "u-rafael",
        "status": "em_aprovacao",
        "visibilidade": "frente",
        "frente": "Pix",
        "squadId": RAFAEL["squadId"],
    }
    rascunho = em_fila | {"status": "rascunho"}

    assert catalogo.visivel(em_fila, catalogo.usuario("u-juliana"))
    assert not catalogo.visivel(em_fila, catalogo.usuario("u-renato"))  # Cord+ de outro squad
    assert not catalogo.visivel(rascunho, catalogo.usuario("u-juliana"))  # ainda não enviado
