---
status: accepted
date: 2026-09-26
decided_by: time
supersedes: []
superseded_by: []
---

# 0022: Banco: Supabase na nuvem

## Rule

- Supabase na nuvem, um projeto só para dev e produção, sem Supabase local. Estrutura só por migração versionada, com seed no repositório.

## Decision

Banco: Supabase na nuvem, um projeto só para dev e produção. Sem Supabase local. Motivo (Vicente): todos os dados são fictícios, inclusive em produção, e o MVP precisa estar online para os gestores acessarem. Controle: estrutura só por migração versionada e seed no repo, para recriar o banco do zero.

## Origin

Era a D-22 na tabela "Decidido" da antiga `05-decisoes-e-pendencias.md`. Texto copiado sem mudança.
