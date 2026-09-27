"""Validador de entrada dos ativos: checagens fixas por código, sem IA (RF-14, RF-15, D-26).

Confere segredos, dados pessoais, README e autor. Nunca corrige sozinho: só diz o que,
onde e como corrigir. O julgamento do que entra no hub é do coordenador (RF-19).
"""

import re
from dataclasses import dataclass
from typing import Literal

Criterio = Literal["segredo", "dado_pessoal", "readme", "autor"]


@dataclass(frozen=True)
class Arquivo:
    caminho: str
    conteudo: str


@dataclass(frozen=True)
class Item:
    criterio: Criterio
    resultado: Literal["ok", "falhou"]
    titulo: str
    arquivo: str | None = None
    linha: int | None = None
    trecho: str | None = None
    como_corrigir: str | None = None


# Prefixos de chave conhecidos. `ihs_demo_` é a chave inventada da cena 2 do roteiro.
_PREFIXOS = r"(?:ihs_demo_|sk-ant-|sk-|ghp_|github_pat_|xox[abprs]-|AKIA)"
_SEGREDOS = [
    # Chave com prefixo conhecido, em qualquer lugar da linha.
    re.compile(rf"(?P<valor>{_PREFIXOS}[A-Za-z0-9_\-]{{8,}})"),
    # Atribuição literal a um nome que parece segredo: API_KEY = "...", token: '...'.
    re.compile(
        r"(?i)(?:api[_-]?key|secret|token|senha|password|passwd)\w*\s*[:=]\s*"
        r"[\"'](?P<valor>[^\"'\s]{8,})[\"']"
    ),
    re.compile(r"(?P<valor>-----BEGIN [A-Z ]*PRIVATE KEY-----)"),
]
# Valor de exemplo em documentação não é segredo: `API_KEY="sua_chave_aqui"`, `<sua chave>`, `${VAR}`.
# Sem isso, o README que o próprio validador pede para escrever barraria de novo (cena 2).
_EXEMPLO = re.compile(
    r"(?i)^\$|^<.*>$|sua[_\- ]?chave|seu[_\- ]?token|your[_\-]?(?:api[_\-]?)?key"
    r"|changeme|placeholder|exemplo|example|^x{4,}$|^\*+$"
)

# Qualquer CPF formatado barra, até o de exemplo (roteiro, "Cuidados").
_CPF = re.compile(r"(?<!\d)(?P<valor>\d{3}\.\d{3}\.\d{3}-\d{2})(?!\d)")
_EMAIL = re.compile(r"(?P<valor>[\w.+-]+@(?P<dominio>[\w-]+(?:\.[\w-]+)+))")
_TELEFONE = re.compile(r"(?P<valor>\(?\b\d{2}\)?\s?9?\d{4}-\d{4}\b)")
# Domínios reservados para exemplo não são dado pessoal. `ficticio` cobre a massa de dados da cena 2.
_DOMINIOS_EXEMPLO = (
    "example.com",
    "example.org",
    "example.net",
    "exemplo.com",
    "exemplo.com.br",
    "ficticio.com",
    "ficticio.com.br",
    ".test",
    ".invalid",
    ".example",
)

_ARQUIVOS_DESCRICAO = ("skill.md", "agent.md", "agente.md")


def _mascarar(valor: str) -> str:
    """Mostra só o começo do valor. A API nunca devolve o segredo inteiro."""
    prefixo = re.match(_PREFIXOS, valor)
    visivel = prefixo.group(0) if prefixo else valor[:3]
    return visivel + "••••"


def _checar_segredos(arquivo: Arquivo) -> list[Item]:
    itens = []
    for n, linha in enumerate(arquivo.conteudo.splitlines(), start=1):
        for padrao in _SEGREDOS:
            achado = padrao.search(linha)
            if not achado:
                continue
            valor = achado.group("valor")
            if _EXEMPLO.search(valor):
                continue
            itens.append(
                Item(
                    criterio="segredo",
                    resultado="falhou",
                    titulo="Chave ou segredo escrito no código",
                    arquivo=arquivo.caminho,
                    linha=n,
                    trecho=linha.strip().replace(valor, _mascarar(valor)),
                    como_corrigir=(
                        "Leia o valor de uma variável de ambiente. No README, mostre só o "
                        "nome dela, sem o valor (ex.: export NOME_DA_VARIAVEL=<sua chave>). "
                        "Depois, valide de novo."
                    ),
                )
            )
            break  # um item por linha basta
    return itens


def _checar_dados_pessoais(arquivo: Arquivo) -> list[Item]:
    itens = []
    for n, linha in enumerate(arquivo.conteudo.splitlines(), start=1):
        motivo = None
        valor = None
        if m := _CPF.search(linha):
            motivo, valor = "CPF", m.group("valor")
        elif (m := _EMAIL.search(linha)) and not m.group("dominio").lower().endswith(
            _DOMINIOS_EXEMPLO
        ):
            motivo, valor = "e-mail", m.group("valor")
        elif m := _TELEFONE.search(linha):
            motivo, valor = "telefone", m.group("valor")
        if motivo:
            itens.append(
                Item(
                    criterio="dado_pessoal",
                    resultado="falhou",
                    titulo=f"Tem um {motivo} escrito no ativo",
                    arquivo=arquivo.caminho,
                    linha=n,
                    trecho=linha.strip().replace(valor, valor[:3] + "••••"),
                    como_corrigir=(
                        f"Troque o {motivo} por um valor gerado na hora ou por um exemplo "
                        "claramente fictício (ex.: nome@exemplo.com)."
                    ),
                )
            )
    return itens


def _tem_descricao(arquivos: list[Arquivo]) -> bool:
    """README não vazio, ou SKILL.md/agente com `description` no frontmatter."""
    for a in arquivos:
        nome = a.caminho.rsplit("/", 1)[-1].lower()
        if nome.startswith("readme") and a.conteudo.strip():
            return True
        if nome in _ARQUIVOS_DESCRICAO and re.search(
            r"(?m)^description:\s*\S", a.conteudo.split("\n---", 1)[0]
        ):
            return True
    return False


def validar(arquivos: list[Arquivo], autor_id: str | None, autor_squad: str | None) -> list[Item]:
    """Roda as quatro checagens e devolve um item por critério, ou um por ocorrência quando falha."""
    segredos = [i for a in arquivos for i in _checar_segredos(a)]
    pessoais = [i for a in arquivos for i in _checar_dados_pessoais(a)]

    itens: list[Item] = []
    itens += segredos or [Item("segredo", "ok", "Nenhuma chave ou segredo no código")]
    itens += pessoais or [Item("dado_pessoal", "ok", "Nenhum CPF, e-mail ou telefone")]

    if _tem_descricao(arquivos):
        itens.append(Item("readme", "ok", "Tem descrição do que faz"))
    else:
        itens.append(
            Item(
                "readme",
                "falhou",
                "Falta dizer o que o ativo faz",
                como_corrigir=(
                    "Crie um README.md ou preencha `description` no frontmatter do SKILL.md."
                ),
            )
        )

    if autor_id and autor_squad:
        itens.append(Item("autor", "ok", "Autor e squad preenchidos"))
    else:
        itens.append(
            Item(
                "autor",
                "falhou",
                "Falta autor ou squad",
                como_corrigir="Entre com o seu usuário para o ativo sair com autor e squad.",
            )
        )
    return itens


def resultado(itens: list[Item]) -> Literal["aprovado", "barrado"]:
    return "barrado" if any(i.resultado == "falhou" for i in itens) else "aprovado"
