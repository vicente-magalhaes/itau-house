---
status: proposed
date: 2026-09-27
decided_by:
supersedes: [0028]
superseded_by: []
---

# 0038: Trilha e contadores ficam no post; a área do Cord+ soma os números

## Rule

- O front da demo fica em `frontend/`, em JSX sobre o design system, no estilo do Reddit. O feed mostra curtidas e instalações.
- A página do post mostra, para todos, a trilha (RF-22), os contadores e quem reaproveitou (RF-30). A área do Cord+ (`#/coord/dados`) soma os números por ativo e por frente.

## Context

A 0028 tirou os números detalhados (derivações, squads que usaram, histórico) do feed e do post e os levou para `#/coord/dados`. A PRD pede trilha e contadores na página do post (RF-22, RF-27, RF-30). A diferença ficou aberta como A-19.

No housekeeping de 27/09, o código já seguia a PRD: o commit `4dee1f9` (Alexandre, 27/09) pôs a trilha e o "Quem reaproveitou" na página do post, e a área do Cord+ continua existindo. Desde a correção da DV-4, a área do Cord+ lê da API, com os mesmos números do post. O Vicente confirmou que essa é a resposta da A-19.

## Options

### Trilha e contadores no post, para todos; a área do Cord+ soma

Escolhida. Segue a PRD e o código que já está na `main`. A trilha no post é o que mostra a governança a quem vai reusar: quem enviou, quem aprovou e quando. O feed continua leve, só com curtidas e instalações.

### Números detalhados só na área do Cord+ (a 0028 original)

Descartada porque contraria RF-22, RF-27 e RF-30, e esconde de quem reusa quem aprovou o ativo. O motivo do Alexandre (o catálogo parecia uma loja, e os dados pesavam na tela) continua valendo para o feed, que segue sem esses números.

### Mudar a PRD para seguir a 0028

Descartada porque o código já segue a PRD, e mudar requisito no dia da banca abriria diferença entre a PRD, o código e o vídeo.

## Consequences

Boas: PRD, código e decisão dizem a mesma coisa. A governança aparece na página que a banca vê no vídeo.

Ruins, e aceitas: a página do post fica mais longa, e parte dos números aparece em dois lugares (post e área do Cord+).

## Revisit when

Um teste com pessoas mostrar que a página do post pesa a ponto de esconder o "Usar", ou o time voltar a querer o post só com curtidas e instalações.
