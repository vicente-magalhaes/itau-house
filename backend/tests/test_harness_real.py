"""O harness-hacka, primeiro ativo real do catálogo (T-44).

Passa no validador e funciona instalado a partir dos arquivos que o Itaú House devolve, sem rede.
"""

import json
import os
import subprocess
import sys

from fastapi.testclient import TestClient

from app import validador
from app.main import app

cliente = TestClient(app)
RAFAEL = {"X-Usuario-Id": "u-rafael"}
ID = "a-harness-hacka"


def _detalhe() -> dict:
    resposta = cliente.get(f"/api/ativos/{ID}", headers=RAFAEL)
    assert resposta.status_code == 200, resposta.text
    return resposta.json()


def test_validador_aprova_os_arquivos_do_harness() -> None:
    arquivos = [validador.Arquivo(a["caminho"], a["conteudo"]) for a in _detalhe()["arquivos"]]
    itens = validador.validar(arquivos, "u-vicente", "s-itau-house")
    assert validador.resultado(itens) == "aprovado", [vars(i) for i in itens if i.resultado != "ok"]


def test_harness_aparece_no_feed_com_autor_e_numeros_reais() -> None:
    feed = cliente.get("/api/ativos", headers=RAFAEL).json()["ativos"]
    assert ID in {a["id"] for a in feed}
    detalhe = _detalhe()
    assert detalhe["tipo"] == "harness"
    assert detalhe["autor"]["nome"] == "Vicente Magalhães"
    assert detalhe["aprovadoPor"]["nome"] == "Vicente Magalhães"
    assert detalhe["readme"] and detalhe["manualInstalacao"] and detalhe["acessos"]
    # Ativo real: nenhum número inventado.
    assert (detalhe["curtidas"], detalhe["instalacoes"], detalhe["derivacoes"]) == (0, 0, 0)


def test_instalado_a_partir_do_itau_house_funciona(tmp_path) -> None:
    plugin, projeto = tmp_path / "plugin", tmp_path / "projeto"
    for arquivo in _detalhe()["arquivos"]:
        destino = plugin / arquivo["caminho"]
        destino.parent.mkdir(parents=True, exist_ok=True)
        # newline="": grava o conteúdo como veio, sem trocar \n por \r\n no Windows.
        destino.write_text(arquivo["conteudo"], encoding="utf-8", newline="")
    projeto.mkdir()
    subprocess.run(["git", "init", "-q"], cwd=projeto, check=True)
    cli = [sys.executable, str(plugin / "bin" / "harness-hacka.py")]
    ambiente = {**os.environ, "CLAUDE_PROJECT_DIR": str(projeto)}

    def rodar(*args: str, entrada: str = "") -> subprocess.CompletedProcess:
        return subprocess.run(
            [*cli, *args],
            cwd=projeto,
            input=entrada,
            capture_output=True,
            text=True,
            encoding="utf-8",
            env=ambiente,
        )

    init = rodar("init", "--name", "Projeto de teste", "--memory-dir", "memoria")
    assert init.returncode == 0, init.stderr
    assert (projeto / ".claude" / "harness-hacka.json").is_file()
    assert (projeto / "memoria" / "README.md").is_file()

    evento = {"hook_event_name": "SessionStart", "source": "startup", "cwd": str(projeto)}
    hook = rodar("hook", "session-start", entrada=json.dumps(evento))
    assert hook.returncode == 0, hook.stderr
    saida = json.loads(hook.stdout)["hookSpecificOutput"]
    assert saida["hookEventName"] == "SessionStart"
    assert "Memória do projeto" in saida["additionalContext"]
