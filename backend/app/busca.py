"""Busca com justificativa (RF-05, RF-06, RF-11), com respostas gravadas de reserva (RNF-04).

O back filtra o que a pessoa pode ver. O Claude só ranqueia e justifica os candidatos (D-19).
Nenhum ativo é inventado: id fora da lista de candidatos é descartado.
"""

import json
import os
import time
import uuid
from functools import cache
from pathlib import Path

import anthropic
import httpx2 as httpx

from app import catalogo

MODELO = "claude-opus-5"  # D-19
# Segundo provedor, se o Claude falhar (0032). Sai antes das respostas gravadas.
MODELO_GEMINI = "gemini-3.8-flash"  # o 2.5 não aceita chave nova
_GEMINI_URL = (
    f"https://generativelanguage.googleapis.com/v1beta/models/{MODELO_GEMINI}:generateContent"
)
TIMEOUT_S = 10.0  # RNF-04: passou disso, usa a resposta gravada
MAX_SUGESTOES = 3  # RF-06
_ACEITAS = {"alta", "media"}  # limiar de semelhança (RF-06): "baixa" vira "não encontrei"

_GRAVADAS = Path(__file__).parent / "dados" / "respostas_gravadas.json"

_SISTEMA = """Você ajuda pessoas de squads do Itaú a reaproveitar ativos de IA (skills, agentes, MCPs, frameworks, esqueletos de código) em vez de criar do zero.

Você recebe o pedido da pessoa e uma lista de ativos candidatos. Para cada candidato que resolve pelo menos parte do pedido, diga:
- semelhanca: "alta" se faz o que foi pedido ou quase tudo; "media" se faz uma parte importante; "baixa" se só tangencia o tema.
- motivo: uma ou duas frases curtas, em pt-BR, falando com "você", sobre o que o ativo faz do que foi pedido.
- limite: o que o ativo não cobre do pedido, numa frase. Vazio se cobre tudo.

Só use ids da lista. Deixe de fora os candidatos sem relação com o pedido. Se nenhum servir, devolva a lista vazia: é melhor dizer que não encontrou do que sugerir algo que não serve."""

_SCHEMA = {
    "type": "object",
    "properties": {
        "sugestoes": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "id": {"type": "string"},
                    "semelhanca": {"type": "string", "enum": ["alta", "media", "baixa"]},
                    "motivo": {"type": "string"},
                    "limite": {"type": "string"},
                },
                "required": ["id", "semelhanca", "motivo", "limite"],
                "additionalProperties": False,
            },
        }
    },
    "required": ["sugestoes"],
    "additionalProperties": False,
}


class Indisponivel(Exception):
    """O Claude não respondeu a tempo, recusou ou não há chave."""


@cache
def _cliente() -> anthropic.Anthropic:
    # Sem retentativas: o tempo total fica em 10 s e a reserva gravada assume.
    return anthropic.Anthropic(timeout=TIMEOUT_S, max_retries=0)


def _candidato(a: dict) -> dict:
    autor = catalogo.usuario(a["autorId"]) or {}
    return {
        "id": a["id"],
        "nome": a["nome"],
        "tipo": a["tipo"],
        "resumo": a["resumo"],
        "readme": a["readme"],
        "tags": a["tags"],
        "autor": f"{autor.get('cargo')}, {a['squad']}",
    }


def _conteudo(pedido: str, tipo: str | None, candidatos: list[dict]) -> str:
    return json.dumps(
        {"pedido": pedido, "tipo_pedido": tipo, "candidatos": [_candidato(a) for a in candidatos]},
        ensure_ascii=False,
    )


def ranquear_com_claude(pedido: str, tipo: str | None, candidatos: list[dict]) -> list[dict]:
    """Chama o Claude e devolve as sugestões cruas do schema. Levanta Indisponivel."""
    if not os.environ.get("ANTHROPIC_API_KEY"):
        raise Indisponivel("sem chave")
    conteudo = _conteudo(pedido, tipo, candidatos)
    try:
        resposta = _cliente().beta.messages.create(
            model=MODELO,
            max_tokens=4000,
            system=_SISTEMA,
            messages=[{"role": "user", "content": conteudo}],
            output_config={"effort": "low", "format": {"type": "json_schema", "schema": _SCHEMA}},
            # Recusa do classificador de segurança: o servidor tenta outro modelo (D-19).
            betas=["server-side-fallback-2026-07-01"],
            fallbacks="default",
        )
    except (anthropic.APITimeoutError, anthropic.APIConnectionError, anthropic.APIStatusError) as e:
        raise Indisponivel(type(e).__name__) from e
    if resposta.stop_reason != "end_turn":
        raise Indisponivel(f"stop_reason={resposta.stop_reason}")
    texto = next(b.text for b in resposta.content if b.type == "text")
    return json.loads(texto)["sugestoes"]


def _schema_gemini(no: dict) -> dict:
    """O Gemini aceita um subconjunto do JSON Schema: sem additionalProperties."""
    if not isinstance(no, dict):
        return no
    return {
        k: (
            _schema_gemini(v)
            if k == "items"
            else {c: _schema_gemini(x) for c, x in v.items()}
            if k == "properties"
            else v
        )
        for k, v in no.items()
        if k != "additionalProperties"
    }


def ranquear_com_gemini(
    pedido: str, tipo: str | None, candidatos: list[dict], timeout: float = TIMEOUT_S
) -> list[dict]:
    """Mesmo contrato do Claude, pelo Gemini. Levanta Indisponivel."""
    chave = os.environ.get("GEMINI_API_KEY")
    if not chave:
        raise Indisponivel("sem chave do Gemini")
    corpo = {
        "systemInstruction": {"parts": [{"text": _SISTEMA}]},
        "contents": [{"role": "user", "parts": [{"text": _conteudo(pedido, tipo, candidatos)}]}],
        "generationConfig": {
            "responseMimeType": "application/json",
            "responseSchema": _schema_gemini(_SCHEMA),
            "thinkingConfig": {
                "thinkingLevel": "low"
            },  # ranquear 18 ativos não pede raciocínio longo
        },
    }
    try:
        r = httpx.post(_GEMINI_URL, json=corpo, headers={"x-goog-api-key": chave}, timeout=timeout)
        r.raise_for_status()
        texto = r.json()["candidates"][0]["content"]["parts"][0]["text"]
        return json.loads(texto)["sugestoes"]
    except (httpx.HTTPError, KeyError, IndexError, json.JSONDecodeError) as e:
        raise Indisponivel(f"gemini: {type(e).__name__}") from e


def _ranquear(pedido: str, tipo: str | None, candidatos: list[dict]) -> tuple[list[dict], str]:
    """Claude primeiro; se falhar, o Gemini com o tempo que sobrou dos 10 s (RNF-04)."""
    inicio = time.monotonic()
    try:
        return ranquear_com_claude(pedido, tipo, candidatos), MODELO
    except Indisponivel:
        restante = TIMEOUT_S - (time.monotonic() - inicio)
        if restante < 2:
            raise
        return ranquear_com_gemini(pedido, tipo, candidatos, timeout=restante), MODELO_GEMINI


def _gravada(pedido: str) -> list[dict] | None:
    """Resposta gravada da cena que bate com o pedido, ou None se não for cena da demo."""
    texto = pedido.lower()
    for cena in json.loads(_GRAVADAS.read_text(encoding="utf-8"))["cenas"]:
        if any(p in texto for p in cena["palavras"]):
            return [s | {"semelhanca": "alta"} for s in cena["sugestoes"]]
    return None


def _mensagem(sugestoes: list[dict]) -> str:
    if not sugestoes:
        return "Não encontrei nada parecido. Quando terminar, posso ajudar a publicar."
    a = sugestoes[0]["ativo"]
    tipo = {"skill": "uma skill parecida", "mcp": "um MCP parecido"}.get(
        a["tipo"], f"um {a['tipo'].replace('_', ' ')} parecido"
    )
    autor = a["autor"]
    return f"Encontrei {tipo} no Itaú House: é de {autor['nome']}, {autor['cargo']} da squad {autor['squad']}."


def buscar(pedido: str, pessoa: dict, tipo: str | None = None) -> dict:
    # Só publicados que a pessoa pode ver (RF-05). O próprio rascunho não entra.
    # O tipo não filtra: quem pede uma skill pode se servir de um agente. Vai só como contexto.
    candidatos = [a for a in catalogo.visiveis_para(pessoa) if a["status"] == "publicado"]
    por_id = {a["id"]: a for a in candidatos}

    gravada = False
    try:
        cruas, modelo = _ranquear(pedido, tipo, candidatos)
    except Indisponivel:
        cruas = _gravada(pedido)
        gravada, modelo = True, None
        if cruas is None:
            return {
                "buscaId": f"b-{uuid.uuid4()}",
                "encontrou": False,
                "indisponivel": True,
                "mensagem": "A busca no Itaú House está fora do ar agora. Siga a tarefa; você pode buscar de novo com /itau-house.",
                "sugestoes": [],
                "gravada": False,
                "modelo": None,
            }

    ordem: dict[str, int] = {"alta": 0, "media": 1}
    validas = sorted(
        (s for s in cruas if s["id"] in por_id and s["semelhanca"] in _ACEITAS),
        key=lambda s: ordem[s["semelhanca"]],
    )
    vistos: set[str] = set()
    sugestoes = []
    for s in validas:
        if s["id"] in vistos:
            continue
        vistos.add(s["id"])
        sugestoes.append(
            {
                "ativo": catalogo.resumo(por_id[s["id"]], pessoa),
                "motivo": s["motivo"],
                "limite": s["limite"] or None,
            }
        )
    sugestoes = sugestoes[:MAX_SUGESTOES]
    # TODO(T-06): gravar os eventos intencao, busca e sugestao (RF-10) quando a API tiver banco.
    return {
        "buscaId": f"b-{uuid.uuid4()}",
        "encontrou": bool(sugestoes),
        "mensagem": _mensagem(sugestoes),
        "sugestoes": sugestoes,
        "gravada": gravada,
        "modelo": modelo,
    }
