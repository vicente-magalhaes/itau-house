---
status: accepted
date: 2026-09-27
decided_by: Vicente
supersedes: []
superseded_by: []
---

# 0037: Ícone do Google fica nas cores oficiais, como exceção à regra de cor

## Rule

- O G do botão "Entrar com Google" (`frontend/public/assets/google-g.svg`) fica nas cores oficiais do Google, vermelho incluído. É a única exceção à regra "nunca vermelho, roxo ou gradiente": vale para logo de terceiro, nunca para cor da interface.

## Context

A conferência DV-4 do Devin, em 27/09, olhou o site publicado contra o checklist de entrega. O item "nenhum vermelho, roxo ou gradiente" falhou na leitura literal: o G do Google, na tela de entrada, tem vermelho. O Devin deixou para uma pessoa decidir se o ícone de terceiro é exceção.

A regra de cor está no `CLAUDE.md` e em `docs/07-identidade-visual.md` (vermelho e roxo são cores da concorrência). O botão vem do login com Google (T-41, decisão 0034) e do RNF-06.

## Options

### Manter o G nas cores oficiais, como exceção

Escolhida pelo Vicente. É logo de terceiro, não cor da interface. O guia de marca do Google para o botão de login pede o G nas cores oficiais.

### G monocromático

Descartada porque foge do guia de marca do Google. Cumpriria a regra de cor à risca, mas trocaria uma regra nossa por outra de fora.

### Tirar o ícone e deixar só o texto

Descartada porque o botão fica menos reconhecível como login do Google, e o login com Google é justamente o que a 0034 quer mostrar à banca.

## Consequences

Boas: o botão segue o padrão do Google, e a conferência passa a ter um critério claro para logo de terceiro.

Ruins, e aceitas: a tela de entrada tem uma cor fora da paleta. Quem conferir a regra à risca vai ver vermelho e precisa desta decisão para entender.

## Revisit when

A organização ou a banca disser que a regra de cor não admite exceção, ou o login com Google sair da tela de entrada.
