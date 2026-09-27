"""Busca com justificativa (RF-05, RF-06, RF-11), com respostas gravadas de reserva (RNF-04).

O back filtra o que a pessoa pode ver. O Gemini só ranqueia e justifica os candidatos (0039).
Nenhum ativo é inventado: id fora da lista de candidatos é descartado.
"""

import json
import os
import time
import uuid
from pathlib import Path

import httpx2 as httpx

from app import catalogo

# Único provedor da busca (0039). Se ele falhar, as respostas gravadas assumem.
MODELO_GEMINI = os.environ.get("GEMINI_MODELO", "gemini-flash-lite-latest")  # o 2.5 não aceita chave nova; o 3.8 estourou a cota diária gratuita em 27/09
# Se o primeiro der 503 (demanda alta) ou 429 (cota gratuita é por modelo), tenta o seguinte.
MODELOS_GEMINI = [MODELO_GEMINI, "gemini-3.1-flash-lite", "gemini-3.5-flash"]
_GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/{}:generateContent"
_gemini_usado = MODELO_GEMINI  # o que respondeu por último, para o campo modelo da resposta
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
    """O Gemini não respondeu a tempo, recusou ou não há chave."""


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
    """Chama o Gemini e devolve as sugestões cruas do schema. Levanta Indisponivel."""
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
    global _gemini_usado
    limite = time.monotonic() + timeout
    erro: Exception | None = None
    for modelo in MODELOS_GEMINI:
        restante = limite - time.monotonic()
        if restante < 1:
            break
        try:
            r = httpx.post(
                _GEMINI_URL.format(modelo), json=corpo, headers={"x-goog-api-key": chave}, timeout=restante
            )
            r.raise_for_status()
            texto = r.json()["candidates"][0]["content"]["parts"][0]["text"]
            sugestoes = json.loads(texto)["sugestoes"]
            _gemini_usado = modelo
            return sugestoes
        except (httpx.HTTPError, KeyError, IndexError, json.JSONDecodeError) as e:
            erro = e
    raise Indisponivel(f"gemini: {type(erro).__name__ if erro else 'sem tempo'}") from erro


def _ranquear(pedido: str, tipo: str | None, candidatos: list[dict]) -> tuple[list[dict], str]:
    """Sugestões cruas e o modelo que respondeu. Levanta Indisponivel."""
    sugestoes = ranquear_com_gemini(pedido, tipo, candidatos)
    return sugestoes, _gemini_usado


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
