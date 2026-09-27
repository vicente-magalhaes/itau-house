---
status: accepted
date: 2026-09-27
decided_by: Vicente
supersedes: [0019, 0032]
superseded_by: []
---

# 0039: Gemini como único provedor de IA no MVP

## Rule

- A busca usa só o Gemini, pela API REST e sem SDK: `gemini-flash-lite-latest` (variável `GEMINI_MODELO`), com `gemini-3.1-flash-lite` e `gemini-3.5-flash` de reserva quando dá 503 ou 429. Saída por schema. Tudo cabe em 10 s; depois disso, as respostas gravadas (RNF-04).
- Sem embeddings no MVP: o back filtra por visibilidade e o LLM ranqueia e justifica (mantido da 0019). O Claude sai do código do back.

## Context

Em 27/09/2026, a chave da Anthropic do time voltou 401. A única chave de LLM que o time tem é a do Gemini (0032). A 0032 pôs o Gemini como segundo provedor, depois do Claude. Na prática, o back tentava o Claude em toda busca antes de chegar ao Gemini. Em 27/09, a busca de produção já respondia pelo `gemini-flash-lite-latest`. O Vicente decidiu no mesmo dia: Gemini como único provedor no MVP, porque é a única API que o time tem.

## Options

### Só o Gemini

Escolhida. Um provedor só no código. A busca não gasta tempo numa chamada que vai falhar, e a declaração de uso de IA (T-34) fica com uma resposta só.

### Claude primeiro e Gemini de reserva (a 0032)

Descartada porque o time não tem chave válida da Anthropic. O Claude ficaria no código sem nunca responder, e a documentação diria uma coisa que a demo não mostra.

### Só as respostas gravadas

Descartada pelo mesmo motivo da 0032: pedido fora do roteiro (pergunta da banca, teste com pessoa de fora) ficaria sem busca.

## Consequences

Boas: código, PRD, README, contrato da API e plugin dizem a mesma coisa que a demo mostra. O SDK `anthropic` sai do back.

Ruins, e aceitas: a chave do Gemini está no plano gratuito. Depois de poucas chamadas por minuto, responde 429, e às vezes 503. A reserva de modelos e as respostas gravadas cobrem o roteiro, mas pedido fora do roteiro pode ficar sem busca na hora da banca.

## Revisit when

O time tiver chave válida da Anthropic ou cota paga do Gemini, ou o plano gratuito derrubar a busca durante um ensaio.
