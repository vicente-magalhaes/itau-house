"""Hook Stop: ao fim da tarefa, se houve ativo novo, manda validar e convidar a publicar (RF-13, RF-14, RF-16).

Sair com código 2 impede o Claude de encerrar e entrega o texto do stderr a ele.
Cada ativo dispara uma vez; se a pessoa corrigir o arquivo, o hook de ativo novo o marca de novo.
"""

import sys

import estado


def instrucao(pastas: list[str]) -> str:
    lista = ", ".join(pastas)
    return (
        f"[Itaú House] Você criou ou mudou um ativo: {lista}. Antes de encerrar:\n"
        "1. Chame validar_ativo do MCP itau-house com a pasta (ou o arquivo) do ativo.\n"
        "2. Se barrar: mostre cada motivo com arquivo, linha e como corrigir, e diga que nada foi enviado. "
        "Não corrija sozinho: pergunte se a pessoa quer que você corrija (RF-15).\n"
        '3. Se passar: convide com estas palavras: "Quer publicar no Itaú House? Eu monto o post, '
        'você revisa e a coordenação do seu squad aprova." Se a pessoa disser não, nada é enviado (RF-16).\n'
        "Siga a skill itau-house para montar e enviar o post."
    )


def main() -> None:
    entrada = estado.ler_entrada()
    sessao = entrada.get("session_id", "")
    if estado.modo() == "sob_demanda":
        return
    atual = estado.carregar(sessao)
    pendentes = atual.get("ativos_pendentes", [])
    if not pendentes:
        return
    atual["ativos_pendentes"] = []
    estado.salvar(sessao, atual)
    print(instrucao(pendentes), file=sys.stderr)
    sys.exit(2)


if __name__ == "__main__":
    main()
