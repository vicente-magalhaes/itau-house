"""Hook PostToolUse: percebe quando um arquivo de ativo é criado ou mudado (RF-13).

Guarda a pasta da skill ou o arquivo do agente. Quem age é o hook de fim da tarefa.
"""

import re

import estado

# Pastas padrão do Claude Code: .claude/skills/<nome>/... e .claude/agents/<nome>.md
_SKILL = re.compile(r"^(?P<raiz>.*?/\.claude/skills/[^/]+)/")
_AGENTE = re.compile(r"^(?P<raiz>.*?/\.claude/agents/[^/]+\.md)$")


def raiz_do_ativo(caminho: str) -> str | None:
    for padrao in (_SKILL, _AGENTE):
        if m := padrao.match(caminho.replace("\\", "/")):
            return m.group("raiz")
    return None


def main() -> None:
    entrada = estado.ler_entrada()
    caminho = (entrada.get("tool_input") or {}).get("file_path", "")
    raiz = raiz_do_ativo(caminho)
    if not raiz:
        return
    sessao = entrada.get("session_id", "")
    atual = estado.carregar(sessao)
    pendentes = atual.setdefault("ativos_pendentes", [])
    if raiz not in pendentes:
        pendentes.append(raiz)
    estado.salvar(sessao, atual)


if __name__ == "__main__":
    main()
