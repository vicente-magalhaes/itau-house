"""Hooks do plugin (T-13), rodados como o Claude Code roda: JSON no stdin, contexto no stdout."""

import json
import os
import subprocess
import sys
from pathlib import Path

import pytest

HOOKS = Path(__file__).resolve().parents[2] / "plugin" / "hooks"
CENA1 = "cria uma skill que transforma a demanda em critérios de aceitação e casos de teste"


@pytest.fixture
def rodar(tmp_path):
    def _rodar(hook, entrada, modo=None):
        env = os.environ | {"TMPDIR": str(tmp_path)}
        env.pop("ITAU_HOUSE_MODO", None)
        if modo:
            env["ITAU_HOUSE_MODO"] = modo
        entrada = {"session_id": "s1"} | entrada
        return subprocess.run(
            [sys.executable, str(HOOKS / hook)],
            input=json.dumps(entrada),
            capture_output=True,
            text=True,
            env=env,
        )

    return _rodar


def _escreveu(caminho):
    return {"tool_name": "Write", "tool_input": {"file_path": caminho}}


def test_pedido_de_skill_pergunta_antes(rodar) -> None:
    r = rodar("intencao.py", {"prompt": CENA1})

    assert "Quer que eu procure no Itaú House" in r.stdout
    assert "(skill)" in r.stdout


def test_resposta_a_pergunta_nao_pergunta_de_novo(rodar) -> None:
    rodar("intencao.py", {"prompt": CENA1})
    r = rodar("intencao.py", {"prompt": "sim, e cria uma skill boa"})

    assert r.stdout == ""


@pytest.mark.parametrize(
    "pedido",
    [
        "corrige esse bug no teste de fatura",
        "a skill de ata quebrou, pode olhar o log?",
        "/itau-house critérios de aceitação",
        "explica o que esse agente faz",
    ],
)
def test_pedido_comum_nao_interrompe(rodar, pedido) -> None:
    assert rodar("intencao.py", {"prompt": pedido}).stdout == ""


def test_modo_proativo_busca_sem_perguntar(rodar) -> None:
    r = rodar("intencao.py", {"prompt": "cria um agente de conciliação"}, modo="proativo")

    assert "chame a ferramenta buscar_ativos" in r.stdout
    assert "Quer que eu procure" not in r.stdout


def test_modo_sob_demanda_nao_interrompe(rodar) -> None:
    assert rodar("intencao.py", {"prompt": CENA1}, modo="sob_demanda").stdout == ""


def test_skill_nova_dispara_validacao_uma_vez_no_fim(rodar) -> None:
    rodar("ativo_novo.py", _escreveu("/repo/.claude/skills/massa-pix/SKILL.md"))
    rodar("ativo_novo.py", _escreveu("/repo/.claude/skills/massa-pix/scripts/gerar_massa.py"))

    fim = rodar("fim_da_tarefa.py", {"stop_hook_active": False})
    assert fim.returncode == 2
    assert "/repo/.claude/skills/massa-pix" in fim.stderr
    assert fim.stderr.count("massa-pix") == 1
    assert "validar_ativo" in fim.stderr

    # Já avisou: o próximo fim não bloqueia, para o Claude não entrar em loop.
    assert rodar("fim_da_tarefa.py", {"stop_hook_active": True}).returncode == 0


def test_arquivo_comum_nao_e_ativo(rodar) -> None:
    rodar("ativo_novo.py", _escreveu("/repo/backend/app/main.py"))

    assert rodar("fim_da_tarefa.py", {}).returncode == 0


def test_agente_novo_tambem_conta(rodar) -> None:
    rodar("ativo_novo.py", _escreveu("/repo/.claude/agents/revisor.md"))

    assert rodar("fim_da_tarefa.py", {}).returncode == 2
