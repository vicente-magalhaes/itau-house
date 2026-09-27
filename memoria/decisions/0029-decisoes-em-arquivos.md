---
status: accepted
date: 2026-09-26
decided_by: Vicente
supersedes: []
superseded_by: []
---

# 0029: Decisões em arquivos, uma por decisão

## Rule

- Decisão nova é um arquivo em `memoria/decisions/`, criado com `/harness-hacka:decide`. Só vira accepted com `accept NNNN` de uma pessoa.

## Context

As D-01 a D-28 ficavam na tabela "Decidido" da `05-decisoes-e-pendencias.md`, como a [0020](0020-harness-do-time.md) previa. A D-28, do Alexandre, entrou na `main` durante a migração e ficou com o número 28; por isso esta decisão, escrita depois, é a 0029. O harness não enxerga decisão dentro de nota. O resumo do início de sessão não listava nenhuma, a trava do `accept NNNN` não valia (as D-24 a D-27 foram escritas direto na tabela pelo agente) e o `check` não conferia substituição, como a da 0018 sobre a 0003. Vicente pediu a migração em 26/09/2026.

## Options

### Uma decisão por arquivo em `decisions/`

Escolhida. Cada D-XX vira `NNNN-titulo.md` com o mesmo número: D-12 é a 0012. O texto original fica no corpo, sem mudança. A 05 vira `05-pendencias-e-riscos.md` (removido depois), só com o que está em aberto e os riscos.

### Manter a tabela na 05

Descartada porque o harness não lê decisão dentro de nota: sem resumo, sem trava de aceite e sem auditoria de substituição.

## Consequences

Boas: o resumo de cada sessão traz as decisões que valem; aceitar volta a exigir uma pessoa; decisão substituída é conferida pelo `check`.

Ruins, e aceitas: textos antigos citam D-XX, e a auditoria só reconhece citações como "decisão 0012" ou links para o arquivo. As migradas ficam com `decided_by: time`, porque a tabela era o registro do time e não dizia quem aceitou cada uma. O resumo do início de sessão fica maior.

Ajusta a [0020](0020-harness-do-time.md) (as decisões seguiam na tabela) e a [0024](0024-memoria-so-com-o-que-envelhece.md) (a 05 era "decisões e pendências").

## Revisit when

Se o resumo do início de sessão passar do teto e deixar de mostrar as regras das decisões.
