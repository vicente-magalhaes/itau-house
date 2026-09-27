---
status: superseded
date: 2026-09-27
decided_by:
supersedes: []
superseded_by: [0039]
---

# 0032: Gemini como segundo provedor da busca

## Rule

- A busca tenta o Claude (`claude-opus-5`, 0019). Se ele falhar, tenta o `gemini-3.8-flash` com o tempo que sobrar dos 10 s. Se os dois falharem, usa as respostas gravadas (RNF-04). A resposta diz qual modelo ranqueou (`modelo`).

## Context

Em 27/09/2026, a chave da Anthropic do time voltou 401 (chave inválida). A única outra chave de LLM disponível era do Gemini, de um projeto pessoal do Bruno, que autorizou o uso. Teste ao vivo: o `gemini-3.8-flash` acertou as duas cenas (acha a skill da Marina na cena 1; lista vazia na cena 2), em 1,8 a 8 s. Mas a chave está no plano gratuito: depois de poucas chamadas por minuto, responde 429 (cota) e às vezes 503 (demanda alta).

## Options

### Gemini entre o Claude e as respostas gravadas

Escolhida. Custa uma função. Com uma chave da Anthropic válida, o Claude volta a ser o primeiro sem mudar código.

### Trocar o Claude pelo Gemini

Descartada. A 0019 escolheu o Claude, e a chave gratuita do Gemini não aguenta a demo ao vivo.

### Só as respostas gravadas

Descartada como única saída: pedidos fora do roteiro (pergunta da banca, teste com pessoa de fora, A-10) ficariam sem busca.

## Consequences

- A declaração de uso de IA (T-34) precisa citar o Gemini como reserva da busca.
- Para a demo ao vivo, o caminho confiável continua sendo uma chave válida da Anthropic. As respostas gravadas cobrem o roteiro.
