---
author: Vicente (sessão com Claude)
status: partial
decisions: []
---

# Ligar o harness-hacka no projeto (D-20)

## Changes

- `.claude/harness-hacka.json` liga o harness; `.claude/settings.json` habilita o plugin
  para o time (marketplace `vicente-magalhaes/harness-hacka`).
- As 9 notas de `memoria/` ganharam frontmatter (`summary`, `read_when`, `review_by`),
  copiado da tabela que já existia no CLAUDE.md.
- A tabela do CLAUDE.md virou região gerada. D-20 registrada no 05.

## Why

Guardar o que cada sessão aprendeu e limpar o que envelhece sem depender de disciplina
manual. Ver D-20.

## Dead ends

- none

## Verification

- `harness-hacka check`: 0 erros, 0 avisos. Índice gerado idêntico à tabela escrita à mão.
- Plugin instalado a partir do GitHub com `claude plugin install` (versão 6f35354).

## Next steps

- [ ] Juntar `feat/harness-hacka` na `main` e trazer a `main` para as branches abertas
- [ ] Cada pessoa: abrir uma sessão nova no projeto e aceitar o convite de instalação
- [ ] Resolver o número repetido da D-12 na `feat/supabase-local` (a `main` já tem outra D-12)
- [ ] Confirmar com a organização se o harness conta como elemento pré-existente
