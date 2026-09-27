---
status: accepted
date: 2026-09-26
decided_by: time
supersedes: []
superseded_by: []
---

# 0024: Memória só com o que envelhece; referência em docs/

## Rule

- `memoria/` guarda o que muda e envelhece. `docs/` guarda referência estável, com fonte.

## Decision

`memoria/` guarda só o que muda e envelhece: tese (04), decisões e pendências (05), brainstorm (09) e o diário das sessões. A referência estável, com fonte, vai para `docs/` com o mesmo nome: regulamento (01), enunciado (02), evidências (03), formato da PRD (06), identidade visual (07) e equipe (08). Motivo (Vicente): parte da memória era documento, não nota que o harness precisa revisar. Critério: o que envelhece fica em `memoria/`; o que não vence vai para `docs/`. Os documentos numerados de `docs/` continuam internos (D-09).

## Origin

Era a D-24 na tabela "Decidido" da antiga `05-decisoes-e-pendencias.md`. Texto copiado sem mudança.
Ajustada pela [0029](0029-decisoes-em-arquivos.md): a 05 virou `05-pendencias-e-riscos.md`, e as decisões ficam nesta pasta.
