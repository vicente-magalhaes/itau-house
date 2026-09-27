---
status: accepted
date: 2026-09-26
decided_by: time
supersedes: []
superseded_by: []
---

# 0019: Stack de IA e busca

## Rule

- Claude via API (`claude-opus-5`, SDK `anthropic`), esforço por rota e saída por schema. Sem embeddings no MVP: o LLM ranqueia.

## Decision

Stack de IA e busca. **LLM:** Claude via API, modelo `claude-opus-5`, SDK oficial `anthropic` em Python, com esforço (`effort`) ajustado por rota: `low` para reconhecer intenção e ranquear semelhança, `medium` a `high` para validador e adaptação. Respostas estruturadas por schema. Fallback do servidor ligado para recusas. **Busca:** sem embeddings no MVP. Com 15 a 20 ativos, o back-end filtra por visibilidade e o LLM ranqueia e justifica. Em escala, entra pgvector no Supabase para pré-filtrar. **Banco:** Supabase (já previsto no compose). Se a latência atrapalhar a demo, o time decide trocar de modelo ou baixar o esforço; o fallback gravado (RNF-04) cobre falhas. Fecha A-09.

## Origin

Era a D-19 na tabela "Decidido" da antiga `05-decisoes-e-pendencias.md`. Texto copiado sem mudança.
