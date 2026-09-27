"""Empacota o harness-hacka como ativo real do catálogo (T-44).

Lê os arquivos direto de um commit do repositório público do harness, e não da pasta de trabalho.
Assim o conteúdo fica idêntico ao commit, qualquer que seja o fim de linha da máquina.
Troca só `arquivos` e `versao` da entrada `a-harness-hacka` do seed.json. O texto do post, o manual
e os acessos são editados à mão no JSON. Rodar duas vezes dá o mesmo resultado.

    git clone https://github.com/vicente-magalhaes/harness-hacka /tmp/harness-hacka
    python3 supabase/empacotar_harness.py /tmp/harness-hacka [commit]
    python3 supabase/gerar_seed_sql.py
"""

import json
import subprocess
import sys
import tomllib
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
SEED = RAIZ / "backend/app/dados/seed.json"
ID = "a-harness-hacka"
# O que o plugin precisa para rodar. Fica fora o que só serve ao repositório do harness:
# CI, testes, a memória dele, a config do próprio projeto e o lock (o plugin não tem dependência).
ENTRA = (
    ".claude-plugin/",
    "hooks/",
    "bin/",
    "skills/",
    "agents/",
    "src/harness_hacka/",
    "README.md",
    "LICENSE",
    "pyproject.toml",
)


def git(clone: Path, *args: str) -> str:
    # Bytes, e não text=True: o modo texto troca \r\n por \n e o arquivo deixaria de ser o do commit.
    saida = subprocess.run(["git", "-C", str(clone), *args], check=True, capture_output=True)
    return saida.stdout.decode("utf-8")


def main() -> None:
    if len(sys.argv) < 2:
        sys.exit("Uso: python3 supabase/empacotar_harness.py <clone do harness-hacka> [commit]")
    clone = Path(sys.argv[1])
    commit = git(clone, "rev-parse", sys.argv[2] if len(sys.argv) > 2 else "HEAD").strip()
    caminhos = [
        c
        for c in git(clone, "ls-tree", "-r", "--name-only", commit).splitlines()
        if c.startswith(ENTRA) and "__pycache__" not in c
    ]
    arquivos = [{"caminho": c, "conteudo": git(clone, "show", f"{commit}:{c}")} for c in caminhos]
    pyproject = next(a["conteudo"] for a in arquivos if a["caminho"] == "pyproject.toml")
    versao = tomllib.loads(pyproject)["project"]["version"]

    seed = json.loads(SEED.read_text(encoding="utf-8"))
    ativo = next((a for a in seed["ativos"] if a["id"] == ID), None)
    if ativo is None:
        sys.exit(f"Crie a entrada {ID} no seed.json antes: este script só troca arquivos e versão.")
    ativo["arquivos"] = arquivos
    ativo["versao"] = versao
    # Mesmo formato do arquivo: indentação 2, acentos, sem quebra de linha no fim.
    SEED.write_text(json.dumps(seed, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"{ID}: {len(arquivos)} arquivos do commit {commit[:7]}, versão {versao}")


if __name__ == "__main__":
    main()
