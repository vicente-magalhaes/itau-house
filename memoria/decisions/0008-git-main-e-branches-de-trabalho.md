---
status: accepted
date: 2026-09-26
decided_by: time
supersedes: []
superseded_by: []
---

# 0008: Git: main e branches de trabalho, sem PR

## Rule

- Só `main` e branches `feat/` ou `fix/`. Merge direto da branch na `main`, sem `dev` e sem Pull Request.

## Decision

Git: só `main` e branches de trabalho (`feat/`, `fix/`). Cada um faz merge direto da própria branch na `main`, sem `dev` e sem Pull Request, por agilidade. O Claude pode dar push (liberado em `.claude/settings.json`).

## Origin

Era a D-08 na tabela "Decidido" da antiga `05-decisoes-e-pendencias.md`. Texto copiado sem mudança.
