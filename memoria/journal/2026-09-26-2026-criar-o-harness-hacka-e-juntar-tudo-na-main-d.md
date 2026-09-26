---
author: Vicente (sessão com Claude)
status: done
decisions: [D-20, D-21, D-22]
---

# Criar o harness-hacka e juntar tudo na main (D-20, D-22)

## Changes

- Harness publicado em `vicente-magalhaes/harness-hacka` (MIT) e ligado aqui (D-20).
- `feat/supabase-local` commitada e juntada na `main` (`e0e860a`), junto com o kanban e os
  papéis do Bruno.
- Renumerado no merge: banco no Supabase virou D-22 (D-12 e D-21 já existiam), hospedagem
  virou A-17. CLAUDE.md cita D-22. README com links da equipe e papéis.

## Why

Ver D-20. Os merges eram para a `main` ter o trabalho de todos antes da banca.

## Dead ends

- Juntar a branch na `main` logo depois do CI → o Bruno enviou um commit no meio e o merge
  conflitou na própria `main`. **Lesson:** `git fetch` imediatamente antes; se a `main` andou,
  traga para a branch, resolva lá e junte com `--ff-only`.
- Escolher o número da decisão ao escrever → duas pessoas pegaram D-12 e depois D-21 em
  paralelo. **Lesson:** confirme o próximo número livre na `main` na hora do merge.

## Verification

- CI do Docker verde (dev e prod) no commit `e0e860a`, que é a `main`.
- `harness-hacka check`: 0 erros. Checagem linha a linha: nada dos dois lados se perdeu.

## Next steps

- [ ] Confirmar o GitHub do Alexandre no README: `@Alekka` no texto, link para `Allekka`
- [ ] Cada pessoa: `git pull` e sessão nova do Claude Code para aceitar o plugin
- [ ] Confirmar com a organização se o harness conta como elemento pré-existente
- [ ] Decidir a hospedagem (A-17)
