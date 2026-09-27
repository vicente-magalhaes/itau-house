---
status: proposed
date: 2026-09-26
decided_by:
supersedes: []
superseded_by: []
---

# 0030: O agente da pessoa adapta o ativo e escreve o post

## Rule

- A adaptação (RF-08) e o texto do post (RF-17) são feitos pelo agente da própria pessoa (Claude Code, Copilot), via MCP. O back não tem rota de adaptação nem chama LLM para isso. O back só guarda, valida e aplica as regras.

## Context

A 0019 previa o Claude no back com esforço `medium` para a adaptação. Mas quem pede a adaptação já está dentro de um agente de IA, com o arquivo aberto e o contexto do projeto. Chamar outro LLM no back repete o trabalho, soma latência na demo ao vivo e exige mandar o conteúdo para o servidor. Proposta no contrato da API (T-03, `docs/api.md`). Bruno aprovou no chat em 26/09/2026.

## Options

### Agente da pessoa adapta e escreve o post

Escolhida. O plugin busca o ativo em `detalhar_ativo`, o agente adapta localmente e mostra o que mudou, e a pessoa revisa (RNF-02). O arquivo salvo leva `derivado_de` no frontmatter. Depois, `montar_post` manda o post já escrito para `POST /api/ativos`.

### Rota de adaptação no back, com Claude em esforço `medium`

Descartada. Um LLM a mais no caminho da demo, mais latência, mais um ponto de falha para as respostas gravadas (RNF-04) cobrirem e nenhum ganho visível para a banca.

## Consequences

- Ajusta a 0019 só na adaptação. A busca continua no back, com o Claude ranqueando e justificando.
- O custo de LLM da adaptação sai da nossa conta e vai para o agente que a pessoa já usa.
