"""Hook UserPromptSubmit: reconhece a intenção de criar um ativo (RF-03) e aplica o modo (RF-02, RF-04).

Sem LLM: regra por palavras, para não somar latência a todo pedido. Na dúvida, não interrompe.
O que este hook imprime vira contexto para o Claude; a pessoa não vê.
"""

import re

import estado

_VERBO = r"\b(cri[ae]r?|cria|crie|fa[çz]a|fazer|faz|mont[ae]r?|ger[ae]r?|constru[ai]r?|escrev[ae]r?|desenvolv[ae]r?|quero|preciso)\b"
_ATIVOS = {
    "skill": r"\bskills?\b",
    "agente": r"\b(sub)?agentes?\b",
    "mcp": r"\b(servidor )?mcp\b",
    "framework": r"\bframeworks?\b",
    "design_system": r"\bdesign system\b",
    "harness": r"\bharness\b",
    "esqueleto": r"\b(esqueletos?|boilerplate|scaffold)\b",
}


def tipo_do_pedido(pedido: str) -> str | None:
    """Tipo de ativo que o pedido quer criar, ou None se não é criação de ativo."""
    texto = pedido.lower()
    if texto.startswith("/"):
        return None  # comando: /itau-house já busca sozinho (RF-12)
    verbo = re.search(_VERBO, texto)
    if not verbo:
        return None
    # O ativo precisa vir depois do verbo e perto dele: "cria uma skill que...", não "a skill quebrou, cria um teste".
    trecho = texto[verbo.start() : verbo.end() + 60]
    for tipo, padrao in _ATIVOS.items():
        if re.search(padrao, trecho):
            return tipo
    return None


def contexto(tipo: str, modo: str) -> str | None:
    rotulo = tipo.replace("_", " ")
    if modo == "sob_demanda":
        return None
    if modo == "proativo":
        return (
            f"[Itaú House] O pedido é criar um ativo ({rotulo}). Modo proativo: antes de criar, "
            "chame a ferramenta buscar_ativos do MCP itau-house com o pedido da pessoa e siga a skill itau-house."
        )
    return (
        f"[Itaú House] O pedido é criar um ativo ({rotulo}). Modo perguntar antes (RF-04). "
        "Antes de começar, pergunte uma vez, com estas palavras: "
        '"Quer que eu procure no Itaú House se alguém já fez algo parecido?" '
        "e espere a resposta. Se a pessoa disser sim, chame buscar_ativos do MCP itau-house com o pedido "
        "dela e siga a skill itau-house. Se disser não, siga a tarefa normalmente e não pergunte de novo."
    )


def main() -> None:
    entrada = estado.ler_entrada()
    sessao = entrada.get("session_id", "")
    atual = estado.carregar(sessao)

    # O pedido seguinte à pergunta é a resposta dela ("sim", "não"): não perguntar de novo (RF-04).
    if atual.pop("aguardando_resposta", False):
        estado.salvar(sessao, atual)
        return

    tipo = tipo_do_pedido(entrada.get("prompt", ""))
    texto = contexto(tipo, estado.modo()) if tipo else None
    if not texto:
        return
    atual["aguardando_resposta"] = estado.modo() == "perguntar_antes"
    atual.setdefault("intencoes", []).append(tipo)
    estado.salvar(sessao, atual)
    print(texto)


if __name__ == "__main__":
    main()
