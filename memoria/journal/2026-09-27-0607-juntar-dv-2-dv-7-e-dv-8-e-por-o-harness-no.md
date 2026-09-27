---
author: Vicente (sessão com Claude)
status: done
decisions: [0036]
---

# Juntar DV-2, DV-7 e DV-8 e pôr o harness no catálogo como ativo real (0036)

## Changes

- DV-2 (T-06, T-07), DV-7 (T-42, back rápido) e DV-8 (T-43, pessoas da API no front) revisadas e juntadas. O `docs/api.md` aceita editar e reenviar um ativo `barrado`.
- DV-9 (T-44), feita pelo Claude e não pelo Devin: o `harness-hacka` entrou no seed como primeiro ativo real, com o Vicente como autor e aprovador, squad "Itaú House · Hackathon" e foto sem metadados (0036). O `supabase/empacotar_harness.py` refaz os arquivos a partir de um commit.
- Briefs da DV-7, DV-8 e DV-9 no `docs/devin.md`, sem depender do roteiro, que está sendo refeito. Exceção de nome real no `security.md` e no `AGENTS.md`. T-15 feito e DV-4 liberada.
- Front: pessoa sem nome não derruba mais a tela.

## Why

O Vicente pediu para fechar o necessário para o vídeo e para um gestor testar o link, e para o harness ser o primeiro plugin real do catálogo (tese da 0020).

## Dead ends

- Reset em produção com seed novo antes do deploy do back → o back antigo lê o autor do `seed.json` embarcado, mandou nome null e o feed quebrou por uns 5 min. **Lesson:** seed com pessoa nova: push primeiro, reset depois. O `catalogo.resumo` ainda lê o autor do `seed.json`, não do repositório.
- `git commit --no-edit` para fechar o merge de um `git pull` → a mensagem levou os comentários do modelo. **Lesson:** fechar com `git commit -m`.
- Push na `main` com o time publicando junto → recusado três vezes. **Lesson:** `git fetch` e merge da `origin/main` logo antes do push.
- `reset_demo.sh` da pasta do Windows num container Linux → o CRLF quebrou o bash. **Lesson:** `tr -d '\r'` antes. O Git Bash tolera CRLF.

## Verification

- Back: 54 testes passando e 9 pulados (casos do Supabase local). MCP: 10. Front: lint sem erro e build ok.
- Fumaça das cenas 1 e 2 pelo MCP, contra o back combinado: 25 de 25.
- Harness: validador `aprovado` nos 40 arquivos; lidos pela API, idênticos ao commit `6f35354`; seed e reset testados num Postgres descartável.
- Produção depois da DV-7: 7 de 7 respostas iguais às de antes do deploy; feed de 2,0–2,4 s para 0,36–0,55 s. `harness-hacka check`: 0 erros.

## Next steps

- [ ] Vicente: mandar a DV-4 e revisar o relatório.
- [ ] Chave válida da Anthropic no Render: a busca de produção está fora do ar (Claude 401, Gemini falhando), e o harness não aparece nela.
- [ ] Alexandre: validar T-42 e T-44 (instalar o harness pelo Claude Code a partir do Itaú House). Bruno: validar T-43 (telas).
- [ ] Reset em produção antes de gravar. Sem `psql`: rodar o `reset_demo.sh` num container `postgres:16`, com `tr -d '\r'` antes.
- [ ] Bruno: pôr o roteiro novo no `docs/roteiro-demo.md`.
- [ ] T-34 citando o Devin, o Claude Code, o Gemini (0032) e o harness (A-18 aberta). Aceitar a 0032 e a 0034.
