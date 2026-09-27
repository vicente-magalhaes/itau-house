---
author: Vicente (sessão com Claude)
status: partial
decisions: [0024, 0025, 0026, 0027, 0028, 0029]
---

# Migrar decisões para arquivos e registrar métrica e governança

## Changes

- Referência estável foi de `memoria/` para `docs/` (0024). Guia dos mentores transcrito em `docs/10` (0027).
- Métrica de retorno de tempo (0025) e governança em três tempos (0026) registradas; F5 em `docs/03`.
- D-01 a D-28 viraram arquivos em `memoria/decisions/` (0029). A 05 virou `05-pendencias-e-riscos.md`, com A-18 e A-19.
- Main com `a4d762e` e `ad6b825`. A migração está em `feat/decisoes-em-arquivos`, ainda não juntada.

## Why

Na tabela da 05, o harness não via as decisões: sem resumo, sem trava de `accept`, sem auditoria de substituição.

## Dead ends

- Encadear `git ... | tail && ...` → o pipe esconde a falha, e o `&&` seguiu depois de um merge recusado. **Lesson:** sem `| tail` em cadeia de git, ou com `set -o pipefail`.
- Numerar a decisão da migração como 0028 → o Alexandre já tinha usado D-28 na `main`. **Lesson:** `git fetch` e conferir o número livre logo antes do merge, não ao escrever.

## Verification

- `harness-hacka check`: 0 erros, 0 avisos. Resumo de início de sessão com 5.997 caracteres, sem corte.
- CI do Docker verde em `ad6b825`.

## Next steps

- [ ] Vicente: `accept 0028` (D-28 do Alexandre, front em `frontend/`)
- [ ] Commitar a renumeração (0029), trazer a `main` e juntar `feat/decisoes-em-arquivos`
- [ ] Resolver A-19 (trilha e contadores no post ou na área do Cord+) com o Alexandre
- [ ] PRD, seção 11: marcar horas economizadas como métrica principal (0025)
