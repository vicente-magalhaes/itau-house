---
author: Vicente (sessão com Claude)
status: done
decisions: [0033, 0035]
---

# Preparar e rodar o Devin: DV-1, DV-3, DV-5 e DV-6 (0033, 0035)

## Changes

- 0033 (o Devin lê o repositório inteiro) e 0035 (o back fala com o Supabase pelo cliente Python, atrás de um repositório) aceitas. Exceção do Devin nas regras de segurança.
- "Fechar antes" da DV-1 completo: contas na Vercel e no Render, tokens `VERCEL_TOKEN` e `RENDER_API_TOKEN` nos Secrets pessoais do Devin, chaves do Supabase no Environment Group `itau-house-supabase`, região `us-east-1` e Render em Virginia.
- DV-1 (T-38): site publicado em `itau-house.vercel.app`, com `/api` repassado ao Render.
- DV-3 (T-25): `supabase/reset_demo.sh`.
- DV-5 (T-39): repositório, `usuario_atual`, `ErroApi` e `GET /api/usuarios`.
- DV-6 (T-12): servidor MCP em `mcp/`.
- DV-5 e DV-6 são briefs novos no `docs/devin.md`. Todas as entregas foram revisadas e juntadas.
- Revisão do Claude no MCP: resposta sem JSON não levanta mais exceção, e dois testes passaram a rodar no Windows.
- `render.yaml` sem `buildFilter`. T-38, T-03, T-05, T-25 e T-39 estão `Feito`. T-12, T-06 e T-07 estão `Fazendo`, com a DV-2 rodando. T-40 (n8n) foi montada pelo Vicente.

## Why

O objetivo era abrir a primeira sessão do Devin. Com o Devin trabalhando como mais uma pessoa do time, duas sessões por vez, em pastas diferentes, adiantaram a base do back e o MCP.

## Dead ends

- Criar decisão ou task sem `git fetch` logo antes → a 0032 colidiu de novo (Gemini), e a 0033 do outro autor virou 0034. **Lesson:** fetch imediatamente antes de `harness-hacka new decision`, e juntar na `main` logo depois do accept.
- Renomear decisão com `git mv` → o guard do harness bloqueia. **Lesson:** reescrever numa branch nova a partir da `origin/main`, pela ferramenta de edição, e pedir novo `accept`.
- Merge na `main` pelo agente depois da DV-1 → o classificador bloqueia, porque todo push na `main` publica em produção. **Lesson:** o agente junta localmente, e o Vicente dá o push.
- `buildFilter: backend/**` no Render → o push da DV-5 não publicou o back, e foi preciso um Manual Deploy. **Lesson:** sem o filtro, o deploy automático saiu. A causa exata é hipótese (o push terminava num merge só de docs).

## Verification

- `backend`: 45 testes passando, 1 pulado (o teste Supabase local). `mcp`: 8 passando no Windows.
- Fumaça com o back em memória e o MCP: 7 de 7 ok. Usuários, 401, 422 e 404 no formato do contrato, cena 1 gravada e cena 2 barrada na linha 12.
- Produção:
  - `/api/health` 200 e `/api/usuarios` 200 com 20 pessoas;
  - 422 `entrada_invalida` com `erro` na raiz;
  - `/memoria`, `/docs/03`, `AGENTS.md` e `.claude/` dão 404.
- `harness-hacka check`: 0 erros.

## Next steps

- [ ] Vicente: revisar e juntar a DV-2 (T-06, T-07). Depois, conferir no Claude Code as quatro ferramentas do MCP que dependem das rotas (T-12).
- [ ] Vicente: T-15, com o reset contra o Supabase do time (psql e Session pooler, nota na T-15). Depois, abrir a DV-4.
- [ ] Vicente: confirmar no Render → Environment que o grupo `itau-house-supabase` está ligado ao serviço.
- [ ] Bruno: pôr `https://itau-house.vercel.app` nas URLs de retorno do Supabase Auth (0034), passar a busca para o repositório (0035) e revisar as descrições das ferramentas do MCP.
- [ ] Alexandre: contadores desencontrados no front (perfil 122 contra 123 nos cards).
- [ ] Preencher as ACUs no registro das sessões do `docs/devin.md`. Revogar a chave do Render depois da banca.
- [ ] T-34 (declaração de uso de IA) a partir do registro das sessões. Housekeeping das notas 04, 05 e 09.
