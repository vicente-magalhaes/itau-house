---
author: Vicente (sessão com Claude)
status: done
decisions: [0030, 0031]
---

# Planejar o Devin e decidir a hospedagem (0030, 0031)

## Changes

- `AGENTS.md` novo: as regras do CLAUDE.md para agentes que não o leem. O Devin carrega até 16 KiB dele por sessão; o nosso tem 6 KB.
- `docs/devin.md` novo: para que serve o Devin, o que não vai para ele, o "Fechar antes" de cada tarefa, como começar e os briefs DV-1 (deploy), DV-2 (rotas do back), DV-3 (reset) e DV-4 (conferência do link).
- Kanban: linha do Devin, T-38 (pipeline de deploy), T-39 (base do back) e T-40 (n8n acordando o Render, do Alexandre). T-06, T-07 e T-25 passam pelo Devin.
- Decisão 0031 aceita (front na Vercel, back no Render), fecha a A-17. A 0030 do Bruno foi aceita pelo Vicente.
- Merge na `main` em `23a13c8`, junto com a busca, a migração e o gerador do seed do Bruno.

## Why

A organização deu US$ 200 de Devin por pessoa, e a 0021 já punha o Devin no deploy. Faltava decidir onde hospedar e dar ao Devin regras e briefs, para ele não tomar decisão que ninguém tomou.

## Dead ends

- Criar decisão e tasks sem `git fetch` antes → colidiram com a 0030 e a T-37 do Bruno, já na `main`. **Lesson:** `git fetch` e ler a `origin/main` antes de pegar número de decisão ou de task.
- Renomear decisão com `mv` → o guard bloqueia decisão pelo shell, e a cópia com número errado só sai se uma pessoa apagar. **Lesson:** decisão só pela ferramenta de edição.
- `accept 31` → o guard não reconhece. **Lesson:** o aceite precisa dos quatro dígitos (`accept 0031`).
- `git merge -F -` → o merge não lê a mensagem da entrada padrão. **Lesson:** usar `-m`.

## Verification

- `uv run pytest -q` no backend: 25 testes passando. `ruff check`: sem erros.
- `harness-hacka check`: 0 erros, 3 avisos (04, 05 e 09 com revisão marcada para hoje).
- Não verificado: nada publicado ainda; nenhuma sessão do Devin rodou.

## Next steps

- [ ] Vicente: fechar o "Fechar antes" do DV-1 em `docs/devin.md` (contas, tokens nos Secrets do Devin, chaves e região do Supabase) e decidir se o Devin lê o repositório inteiro
- [ ] Vicente: abrir a DV-1 (T-38) no Devin
- [ ] Bruno ou Vicente: aplicar a migração do T-05 no Supabase, se ainda não foi (`db push` com aprovação). Destrava a DV-3 (T-25)
- [ ] Vicente: T-39 (base do back) e M1 com o Alexandre. Destravam a DV-2 (T-06, T-07)
- [ ] Alexandre: T-40 (n8n) quando o T-38 der o link
- [ ] Housekeeping das notas 04, 05 e 09
