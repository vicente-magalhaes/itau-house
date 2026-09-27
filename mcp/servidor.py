"""Ferramentas MCP do Itaú House (RF-10, RF-17, RNF-05)."""

import json
import os
from pathlib import Path
from typing import Literal
from urllib.parse import quote

import httpx
from mcp.server.fastmcp import FastMCP

servidor = FastMCP("itau-house")
LIMITE_ARQUIVO = 200 * 1024
PASTAS_IGNORADAS = {".git", "__pycache__", "node_modules", "secrets"}


def _chamar(metodo: str, caminho: str, corpo: dict | None = None) -> str:
    try:
        with httpx.Client(timeout=90) as cliente:
            resposta = cliente.request(
                metodo,
                f"{os.environ.get('ITAU_HOUSE_API', 'http://localhost:8000').rstrip('/')}{caminho}",
                headers={"X-Usuario-Id": os.environ.get("ITAU_HOUSE_USUARIO", "u-rafael")},
                json=corpo,
            )
    except httpx.RequestError:
        return json.dumps(
            {
                "erro": "api_fora_do_ar",
                "mensagem": "A API do Itaú House está fora do ar. Tente novamente.",
            },
            ensure_ascii=False,
        )
    # Um 502 em HTML durante o deploy, ou um 500 em texto, não pode virar exceção.
    try:
        return json.dumps(resposta.json(), ensure_ascii=False)
    except ValueError:
        return json.dumps(
            {
                "erro": "resposta_invalida",
                "mensagem": f"A API respondeu {resposta.status_code} sem JSON. Tente de novo em instantes.",
            },
            ensure_ascii=False,
        )


def _arquivos(pasta: str) -> list[dict[str, str]]:
    origem = Path(pasta)
    if not origem.exists() or origem.is_symlink() or not (origem.is_dir() or origem.is_file()):
        raise ValueError("A pasta ou o arquivo do ativo não existe.")

    raiz = origem if origem.is_dir() else origem.parent
    caminhos = [origem] if origem.is_file() else []
    if origem.is_dir():
        for atual, pastas, nomes in os.walk(origem):
            pastas[:] = sorted(
                pasta
                for pasta in pastas
                if pasta not in PASTAS_IGNORADAS and not (Path(atual) / pasta).is_symlink()
            )
            caminhos.extend(Path(atual) / nome for nome in sorted(nomes))
    arquivos = []
    for caminho in caminhos:
        relativo = caminho.relative_to(raiz)
        if (
            any(parte in PASTAS_IGNORADAS for parte in relativo.parts[:-1])
            or caminho.is_symlink()
            or not caminho.is_file()
            or caminho.name == ".env"
            or caminho.name.startswith(".env.")
            or caminho.suffix in {".key", ".pem"}
            or caminho.name.startswith(("credentials", "service_account"))
        ):
            continue
        if caminho.stat().st_size > LIMITE_ARQUIVO:
            continue
        with caminho.open("rb") as entrada:
            dados = entrada.read(LIMITE_ARQUIVO + 1)
        if len(dados) > LIMITE_ARQUIVO or b"\x00" in dados:
            continue
        try:
            conteudo = dados.decode("utf-8")
        except UnicodeDecodeError:
            continue
        arquivos.append({"caminho": relativo.as_posix(), "conteudo": conteudo})
    return arquivos


def _ler(pasta: str) -> list[dict[str, str]] | str:
    try:
        return _arquivos(pasta)
    except (ValueError, OSError) as erro:
        return json.dumps({"erro": "arquivo_invalido", "mensagem": str(erro)}, ensure_ascii=False)


def _com_links(resposta: str) -> str:
    """Acrescenta a cada sugestão a url da página do ativo no site, para o link sair pronto."""
    try:
        corpo = json.loads(resposta)
    except ValueError:
        return resposta
    if not isinstance(corpo, dict) or not corpo.get("sugestoes"):
        return resposta
    site = os.environ.get("ITAU_HOUSE_SITE", "https://itau-house.vercel.app").rstrip("/")
    for sugestao in corpo["sugestoes"]:
        ativo = sugestao.get("ativo") or {}
        if not ativo.get("id"):
            continue
        sugestao["url"] = f"{site}/#/ativo/{quote(ativo['id'], safe='')}"
        tipo = (ativo.get("tipo") or "ativo").replace("_", " ")
        nome = ((ativo.get("autor") or {}).get("nome") or "").split(" ")[0]
        rotulo = f"{tipo} de {nome}" if nome else ativo.get("nome", tipo)
        sugestao["link"] = f"[{rotulo}]({sugestao['url']})"
    # Vai na resposta, e não só na skill, porque o modelo às vezes responde sem carregar a skill.
    corpo["comoMostrarLink"] = (
        "Abaixo de cada sugestão, escreva: \"Quer ver os detalhes no navegador? Abra a <link>.\", "
        "com o campo link exatamente como veio, em markdown. Nunca mostre a URL crua."
    )
    return json.dumps(corpo, ensure_ascii=False)


@servidor.tool(description="Busque ativos parecidos com o pedido antes de criar um ativo.")
def buscar_ativos(pedido: str, tipo: str | None = None) -> str:
    return _com_links(
        _chamar(
            "POST",
            "/api/busca",
            {
                "pedido": pedido,
                "tipo": tipo,
                "modo": os.environ.get("ITAU_HOUSE_MODO", "perguntar_antes"),
            },
        )
    )


@servidor.tool(description="Veja os arquivos e o manual de um ativo sugerido na busca.")
def detalhar_ativo(id: str) -> str:
    return _chamar("GET", f"/api/ativos/{quote(id, safe='')}")


@servidor.tool(description="Registre a escolha da pessoa: usar, adaptar ou ignorar uma sugestão.")
def registrar_decisao(
    busca_id: str, ativo_id: str | None, decisao: Literal["usar", "adaptar", "ignorar"]
) -> str:
    return _chamar(
        "POST",
        "/api/decisoes",
        {"buscaId": busca_id, "ativoId": ativo_id, "decisao": decisao},
    )


@servidor.tool(
    description="Confira os arquivos de uma skill ou agente antes de oferecer a publicação."
)
def validar_ativo(pasta: str) -> str:
    arquivos = _ler(pasta)
    if isinstance(arquivos, str):
        return arquivos
    return _chamar("POST", "/api/validacoes", {"arquivos": arquivos})


@servidor.tool(
    description="Monte um rascunho para revisão da pessoa ou edite um rascunho existente."
)
def montar_post(
    pasta: str,
    nome: str | None = None,
    tipo: str | None = None,
    resumo: str | None = None,
    readme: str | None = None,
    manual_instalacao: str | None = None,
    tags: list[str] | None = None,
    visibilidade: str | None = None,
    derivado_de: str | None = None,
    validacao_ids: list[str] | None = None,
    id: str | None = None,
) -> str:
    arquivos = _ler(pasta)
    if isinstance(arquivos, str):
        return arquivos
    corpo = {"arquivos": arquivos}
    campos = {
        "nome": nome,
        "tipo": tipo,
        "resumo": resumo,
        "readme": readme,
        "manualInstalacao": manual_instalacao,
        "tags": tags,
        "visibilidade": visibilidade,
        "derivadoDe": derivado_de,
        "validacaoIds": validacao_ids,
    }
    corpo.update({chave: valor for chave, valor in campos.items() if valor is not None})
    if id is not None:
        return _chamar("PATCH", f"/api/ativos/{quote(id, safe='')}", corpo)
    corpo.setdefault("visibilidade", "squad")
    corpo.setdefault("derivadoDe", None)
    return _chamar("POST", "/api/ativos", corpo)


@servidor.tool(description="Envie o rascunho revisado pela pessoa para a coordenação do squad.")
def enviar_para_aprovacao(id: str) -> str:
    return _chamar("POST", f"/api/ativos/{quote(id, safe='')}/envio")


if __name__ == "__main__":
    servidor.run(transport="stdio")
