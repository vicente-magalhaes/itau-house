---
status: accepted
date: 2026-09-27
decided_by: Vicente
supersedes: []
superseded_by: []
---

# 0034: Login com Google autentica; a persona continua escolhida

## Rule

- A plataforma entra com Google pelo Supabase Auth (OIDC de verdade). Depois do login, a pessoa escolhe com qual persona fictícia do seed opera. O front manda o token do Supabase e a persona; o back, no MVP, não exige o token. O plugin e o MCP seguem só com `X-Usuario-Id`.

## Context

Bruno quer mostrar à banca que a infraestrutura de SSO existe (27/09/2026). O RF-23 pedia login simulado. O MAISA App já usa o Supabase Auth com Google, mas cria o usuário do app a partir da conta do Google. Aqui isso não serve: as personas têm squad, frente e perfil que o Google não conhece, e a demo depende dessa hierarquia. Criar usuário a partir do Google também poria pessoa real na tela, o que o RNF-03 proíbe.

## Options

### Google autentica, persona escolhida, token não exigido no MVP

Escolhida. Mostra SSO de verdade sem pôr a demo na dependência do Google ao vivo. Frase para a banca: "O login já é SSO. No piloto, o provedor vira o Entra ID do Itaú e o perfil vem do diretório corporativo."

### Criar o usuário a partir da conta do Google, como no MAISA

Descartada. Perde a hierarquia fictícia e põe pessoa real na plataforma (RNF-03).

### Exigir o token em toda rota da plataforma

Descartada para o MVP. Se o Google falhar na hora da banca, a demo para. Fica como próximo passo, junto com a hierarquia vinda do diretório.

## Consequences

- O RF-23 passa de "simulado" para "login real, hierarquia simulada". A tela diz as duas coisas.
- O Supabase Auth guarda o e-mail de quem entrar (`auth.users`). Só o time entra na demo.
- Configuração do provedor: `supabase/ligar_google.sh`, que declara só o Google e as URLs de retorno.
