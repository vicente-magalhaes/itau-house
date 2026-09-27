---
status: accepted
date: 2026-09-27
decided_by: Vicente
supersedes: []
superseded_by: []
---

# 0033: Devin lê o repositório inteiro

## Rule

- O Devin fica ligado ao `itau-house` inteiro, inclusive `memoria/`, os documentos numerados de `docs/` e `itau-design-system/`. Ele pode ler esse conteúdo, mas não pode copiar nada dele para código, seed, tela, commit ou relatório (`AGENTS.md`).

## Context

A primeira sessão do Devin, a DV-1 (T-38, ver [docs/devin.md](../../docs/devin.md)), só pode abrir quando este item do "Fechar antes" estiver resolvido. Ao conectar, o Devin clona o repositório com todo o histórico do git e indexa o conteúdo, inclusive o que é interno. A [regra de segurança](../../.claude/rules/security.md) diz para não colar esse conteúdo em serviço externo. A 3.7.2 do regulamento proíbe colar em IA externa material interno do Itaú não autorizado ([docs/01](../../docs/01-hackathon-regras-e-entregas.md)). Os créditos do Devin vieram da organização do hackathon: US$ 200 por membro. Vicente decidiu em 27/09.

Esta decisão nasceu como 0032 e foi renumerada: a 0032 da `main` é a do Gemini como segundo provedor da busca.

## Options

### Repositório inteiro

Escolhida. O Devin conecta ao `itau-house` como ele está, e não precisa de passo extra. A ferramenta veio da organização. O Claude Code já lê o mesmo conteúdo em toda sessão do time, então o Devin não abre uma exposição de tipo novo. O `AGENTS.md` já proíbe copiar o conteúdo interno para qualquer saída.

### Repositório só com o código

Um segundo repositório privado, com a `main` sem as pastas internas, e o Devin ligado só nele. Descartada pelo custo no dia da banca. Cada uma das quatro sessões pediria atualizar a cópia antes de abrir. A branch do Devin voltaria por cherry-pick, porque os dois históricos não se ligam. E, na DV-1, testar o Render pela `feat/deploy` ficaria difícil, porque a Vercel e o Render apontam para o `itau-house`.

### Limpar o conteúdo interno antes

Adiantar a limpeza da [0009](0009-repositorio-privado-ate-a-banca.md) e apagar as pastas internas da `main` antes de conectar. Descartada porque não protege: o conteúdo continua no histórico, e o Devin clona o histórico. Reescrever o histórico está proibido (force push bloqueado, [0008](0008-git-main-e-branches-de-trabalho.md)). E o time perderia `memoria/` e `docs/` no dia da banca, e o harness-hacka depende deles.

## Consequences

Boas: a DV-1 abre sem preparo extra, e as quatro sessões usam o mesmo fluxo de revisão e merge da 0008.

Ruins, e aceitas:
- O conteúdo interno vai para os servidores da Cognition, no clone e no índice. Aceitamos isso com base em que a ferramenta foi dada pela organização, como já aceitamos para o Claude Code.
- Uma exceção à regra de "não colar em serviço externo" das [regras de segurança](../../.claude/rules/security.md), limitada ao Devin.

## Revisit when

- Se a organização disser que o Devin não está autorizado para material interno do Itaú: desligar o repositório do Devin e seguir com a opção "repositório só com o código".
