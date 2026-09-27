---
status: accepted
date: 2026-09-27
decided_by: Vicente
supersedes: []
superseded_by: []
---

# 0035: Back fala com o Supabase pelo cliente Python, atrás de um repositório

## Rule

- O back acessa o banco só por um repositório (`backend/app/repositorio.py`), que tem duas versões com a mesma interface. A versão Supabase usa o cliente `supabase` do Python, com `SUPABASE_URL` e `SUPABASE_SECRET_KEY`. A versão memória carrega o `seed.json`.
- As duas devolvem dicionários no formato do `seed.json`, e a visibilidade passa sempre por `catalogo.visivel`. Teste roda sempre na memória. A versão Supabase só é testada numa base local.

## Context

O T-39 é a base que a DV-2 (T-06, T-07) copia em todas as rotas, e vai para o Devin como DV-5 (`docs/devin.md`, removido). Antes dele, o back não tinha acesso ao banco: a busca e o validador liam o `seed.json`. A migração do T-05 usa ids em `text` e RLS sem política, então só a chave secreta lê e escreve. O Render já tem `SUPABASE_URL` e `SUPABASE_SECRET_KEY` no grupo `itau-house-supabase` (DV-1). A regra de visibilidade precisa continuar única (RNF-07). Vicente aprovou o plano do T-39 em 27/09.

## Options

### Cliente `supabase` do Python, atrás de um repositório com versão em memória

Escolhida. Usa as duas variáveis que já estão no Render e funciona com as chaves `sb_secret_`. O repositório deixa os testes longe do Supabase do time e faz o `catalogo.visivel` valer igual para as duas versões. A versão é escolhida sozinha: com as duas variáveis, usa o Supabase; sem elas, a memória.

### Postgres direto, com `psycopg` e SQL

Descartada porque pede um segredo novo, a string de conexão com a senha do banco, e outra configuração no Render. E a visibilidade tenderia a ir para o SQL, o que o `AGENTS.md` proíbe.

### Rotas chamando o Supabase direto, sem repositório

Descartada porque cada teste de rota tocaria um banco. Sem a versão em memória, os testes do CI precisariam de Supabase, e o risco de escrever no banco do time cresceria.

## Consequences

Boas: testes rápidos e sem banco. A DV-2 só acrescenta métodos ao repositório. A visibilidade continua num lugar só.

Ruins, e aceitas:
- Cada método novo precisa ser escrito duas vezes, na memória e no Supabase.
- A busca (T-10) continua lendo o `seed.json` até alguém passá-la para o repositório. Até lá, um ativo publicado pelas rotas novas não aparece na busca.
- Uma dependência a mais na imagem de produção.
- O filtro de visibilidade roda em Python depois de buscar os ativos. Isso cabe no catálogo da demo, que tem poucas dezenas de ativos.

## Revisit when

- Se o catálogo passar de alguns milhares de ativos: filtrar no banco, com a regra ainda vindo de um lugar só.
- Num piloto: o banco passa a ser a infraestrutura do Itaú, e o repositório ganha uma terceira versão.
