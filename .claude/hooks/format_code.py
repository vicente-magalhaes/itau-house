#!/usr/bin/env python3
"""PostToolUse hook: formata e linta o arquivo que acabou de ser editado.

Por que existe: mantém o estilo igual entre as quatro pessoas do time sem depender de
disciplina manual (ruff no Python, prettier e eslint no TypeScript). Roda depois de todo
Write/Edit.

Comportamento: best-effort e silencioso. Enquanto o projeto não tiver pyproject.toml ou
package.json, ou enquanto as dependências não estiverem instaladas, o hook não faz nada e
nunca falha a chamada (sempre retorna 0).
"""

import json
import subprocess
import sys
from pathlib import Path

# Mesma razão do block_secrets.py: evita erro de encoding no console do Windows ao
# processar caminhos com acento.
sys.stdout.reconfigure(encoding="utf-8")
sys.stderr.reconfigure(encoding="utf-8")

PY_EXTENSIONS = {".py"}
TS_EXTENSIONS = {".ts", ".tsx", ".js", ".jsx", ".css", ".json"}


def find_project_root(file_path: Path, marker: str) -> Path | None:
    """Sobe a árvore de pastas procurando o arquivo marcador (pyproject.toml ou package.json)."""
    for parent in [file_path.parent, *file_path.parents]:
        if (parent / marker).exists():
            return parent
    return None


def run_quiet(cmd: list[str], cwd: Path) -> None:
    try:
        subprocess.run(
            cmd,
            cwd=cwd,
            stdin=subprocess.DEVNULL,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            timeout=30,
            check=False,
        )
    except (OSError, subprocess.SubprocessError):
        pass  # ferramenta ausente ou falhou; best-effort, nunca trava o fluxo.


def main() -> int:
    try:
        payload = json.load(sys.stdin)
    except (json.JSONDecodeError, ValueError):
        return 0

    tool_input = payload.get("tool_input", {}) or {}
    raw_path = tool_input.get("file_path", "")
    if not raw_path:
        return 0

    file_path = Path(raw_path)
    if not file_path.exists():
        return 0

    suffix = file_path.suffix.lower()

    if suffix in PY_EXTENSIONS:
        root = find_project_root(file_path, "pyproject.toml")
        if root:
            run_quiet(["uv", "run", "ruff", "format", str(file_path)], cwd=root)
            run_quiet(["uv", "run", "ruff", "check", "--fix", str(file_path)], cwd=root)

    elif suffix in TS_EXTENSIONS:
        root = find_project_root(file_path, "package.json")
        if root and (root / "node_modules").exists():
            # --no-install: se prettier ou eslint não estiverem no projeto, o npx não
            # tenta baixar (o que travaria esperando confirmação até o timeout).
            run_quiet(["npx", "--no-install", "prettier", "--write", str(file_path)], cwd=root)
            run_quiet(["npx", "--no-install", "eslint", "--fix", str(file_path)], cwd=root)

    return 0


if __name__ == "__main__":
    sys.exit(main())
