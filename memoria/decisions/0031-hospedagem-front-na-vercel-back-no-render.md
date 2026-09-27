---
status: accepted
date: 2026-09-27
decided_by: Vicente
supersedes: []
superseded_by: []
---

# 0031: Hospedagem: front na Vercel, back no Render

## Rule

- Front publicado na Vercel e back no Render, a partir da `main`. O front chama `/api` por caminho relativo, e a Vercel repassa ao Render.

## Context

A entrega 1 pede link de acesso ou instruções para executar, e os links precisam abrir sem login (`docs/01`, removido). A [0022](0022-supabase-na-nuvem.md) já partia de que o MVP precisa estar online para os gestores acessarem. Onde hospedar era a A-17, em aberto em `05-pendencias-e-riscos.md` (removido), com "provável: Vercel e/ou Render" (Vicente, 26/09).

O repositório já estava pronto: a imagem de produção do back lê `$PORT`, o health fica em `/api/health` e as rotas do front são por hash. O deploy vai para o Devin (T-38, DV-1 em `docs/devin.md`, removido), e o brief precisava da plataforma decidida. Vicente decidiu em 27/09. Fecha a A-17.

Esta decisão nasceu como 0030 e foi renumerada: a 0030 da `main` é a do Bruno, sobre o agente da pessoa adaptar o ativo.

## Options

### Vercel para o front, Render para o back

Escolhida. A Vercel serve o build estático do Vite por CDN e não dorme. O Render roda a imagem Docker de produção do back, sem mudança. Um rewrite da Vercel leva `/api/*` ao Render, então o front segue sem CORS e sem URL do back no build, como manda o README. Configuração em `vercel.json` e `render.yaml`, com os segredos só no painel do Render.

### Só o Render, com front e back

Descartada porque o front também dormiria no plano grátis: seriam dois serviços frios. E o nginx do build de produção precisaria de ajuste para repassar a um endereço externo.

### Só instruções para rodar, sem link

Descartada porque a banca é de gestores e não vai rodar Docker. E a decisão 0022 já pedia o MVP online.

## Consequences

Boas: link público sem login para a banca e para a ficha. Cada merge na `main` publica sozinho. A hospedagem custa perto de zero, o que ajuda a mostrar que o custo que cresce é o LLM (PRD, seção 9).

Ruins, e aceitas:
- O Render grátis dorme depois de 15 min sem acesso e leva de 30 s a 1 min para acordar. Um fluxo no n8n chama `/api/health` a cada 8 min (T-40).
- A Vercel grátis publica os commits do time inteiro porque o repositório está na conta pessoal do Vicente. Em repositório de organização, deixaria de publicar os commits dos outros.
- As URLs de preview da Vercel pedem login. O link da entrega é o domínio de produção.
- Link público, login simulado e banco único (decisão 0022): qualquer pessoa com o link entra como coordenadora. O reset (T-25) roda antes de gravar e antes da banca.
- O site publicado não usa o nginx da [0011](0011-ambiente-em-docker-compose.md). O build de produção com nginx continua para a demo local e para o CI.
- Duas plataformas a mais para cuidar, as duas na conta do Vicente.

## Revisit when

- Se o back acordar frio na banca mesmo com o ping: pagar o menor plano do Render.
- Se o repositório sair da conta pessoal do Vicente.
- Num piloto: a hospedagem passa a ser a infraestrutura do banco, não a Vercel nem o Render.
