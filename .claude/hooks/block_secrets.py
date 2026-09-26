#!/usr/bin/env python3
"""PreToolUse hook: bloqueia escrita e leitura de segredos e a edição de .env real.

Por que existe: o regulamento do hackathon (3.8) só permite dados fictícios, e nenhuma
chave pode aparecer no código, no vídeo ou no repositório. Este hook roda antes de todo
Write/Edit/Bash e recusa (exit code 2) operações que tocariam em arquivos de segredo,
mesmo que alguém peça "edita o .env" sem perceber o risco.

Contrato do hook (Claude Code): lê do stdin um JSON com {tool_name, tool_input, ...}.
Exit 0            permite a chamada.
Exit 2 + stderr   bloqueia a chamada; a mensagem em stderr volta para o usuário e o modelo.

Só usa a stdlib, para rodar antes de qualquer instalação do projeto.
"""

import json
import re
import sys

# Força UTF-8 na saída. No console do Windows (o time todo usa), o codepage padrão
# corrompe os acentos das mensagens de bloqueio.
sys.stdout.reconfigure(encoding="utf-8")
sys.stderr.reconfigure(encoding="utf-8")

# Arquivos que um agente nunca escreve nem lê, mesmo com permissão geral.
# Os modelos (.example, .sample, .template) são sempre permitidos: não têm segredo real.
SECRET_FILENAME_PATTERNS = [
    re.compile(r"(^|[/\\])\.env(\..+)?$", re.IGNORECASE),
    re.compile(r"\.pem$", re.IGNORECASE),
    re.compile(r"\.key$", re.IGNORECASE),
    re.compile(r"(^|[/\\])secrets[/\\]", re.IGNORECASE),
    re.compile(r"service[_-]?account.*\.json$", re.IGNORECASE),
    re.compile(r"credentials.*\.json$", re.IGNORECASE),
]

ALLOWED_SUFFIXES = (".example", ".sample", ".template")


def is_secret_path(path: str) -> bool:
    if not path:
        return False
    normalized = path.replace("\\", "/")
    if normalized.endswith(ALLOWED_SUFFIXES):
        return False
    if re.search(r"\.env\.(example|sample|template)$", normalized, re.IGNORECASE):
        return False
    return any(p.search(normalized) for p in SECRET_FILENAME_PATTERNS)


def bash_touches_secret(command: str) -> bool:
    if not command:
        return False
    # Tira as referências seguras (.env.example etc.) antes de procurar segredo.
    safe_stripped = re.sub(r"\.env\.(example|sample|template)\b", "", command, flags=re.IGNORECASE)
    if re.search(r"\.env\b", safe_stripped, re.IGNORECASE):
        return True
    return any(p.search(safe_stripped) for p in SECRET_FILENAME_PATTERNS)


def main() -> int:
    try:
        payload = json.load(sys.stdin)
    except (json.JSONDecodeError, ValueError):
        return 0  # sem entrada estruturada não há o que checar; não bloqueia às cegas.

    tool_name = payload.get("tool_name", "")
    tool_input = payload.get("tool_input", {}) or {}

    if tool_name in ("Write", "Edit"):
        path = tool_input.get("file_path", "")
        if is_secret_path(path):
            print(
                f"Bloqueado por segurança: '{path}' parece um arquivo de segredo "
                "(.env, chave, credencial). Edite só o .env.example correspondente e "
                "documente a variável. O valor real fica fora do git.",
                file=sys.stderr,
            )
            return 2

    if tool_name == "Bash":
        command = tool_input.get("command", "")
        if bash_touches_secret(command):
            print(
                "Bloqueado por segurança: este comando referencia um arquivo de segredo "
                "(.env, chave, credencial). Operação com segredo real não passa por "
                "agente. Peça para uma pessoa do time executar.",
                file=sys.stderr,
            )
            return 2

    return 0


if __name__ == "__main__":
    sys.exit(main())
