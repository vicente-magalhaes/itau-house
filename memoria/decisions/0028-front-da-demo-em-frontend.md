---
status: superseded
date: 2026-09-26
decided_by: time
supersedes: []
superseded_by: [0038]
---

# 0028: Front da demo em frontend/, no estilo do Reddit

## Rule

- O front da demo fica em `frontend/`, em JSX sobre o design system, no estilo do Reddit. Números detalhados ficam na área do Cord+ (`#/coord/dados`).

## Decision

Front da demo em `frontend/`. O esboço de `web/` migrou para lá e `web/` saiu do repo. Telas em JSX, como os componentes do design system, sobre a base de `frontend/` (React 19, Vite 8, TypeScript com `allowJs`, Docker e nginx). Layout no estilo do Reddit: feed com "Gostei" e ordens Em alta (curtidas + instalações), Mais curtidos e Novos. Números detalhados (derivações, squads que usaram, histórico) saem do feed e do post e vão para uma área só do Cord+ (`#/coord/dados`); feed e post mostram curtidas e instalações. Motivo (Alexandre): o catálogo parecia uma loja, não um fórum, e os dados pesavam na tela de quem só quer achar e reusar. Ajusta D-15 (a visão do gestor passa a ter a área de dados, além da fila) e afeta RF-22 e RF-30, que pedem trilha e contadores na página do post: confirmar com o time.

## Origin

Era a D-28 na tabela "Decidido" da antiga `05-decisoes-e-pendencias.md`. Entrou na `main` pelo commit `77d1bb1`, do Alexandre, enquanto a migração acontecia. Texto copiado sem mudança.
O que ficou para confirmar com o time (RF-22 e RF-30) virou a A-19 em [05-pendencias-e-riscos.md](../05-pendencias-e-riscos.md).
