# Plano do Devin

Como o time usa o Devin no Itaú House: para quê, em que momento e com que regras.
Tem dois leitores. O time, que abre as sessões e revisa. E o próprio Devin, que acha aqui o brief da tarefa dele.
Regras para qualquer agente em [AGENTS.md](../AGENTS.md). Tasks e status em [KANBAN.md](../KANBAN.md).

**Status:** plano do Vicente, escrito com o Claude em 26/09. Os itens de "Fechar antes" são decisões do time. O que está marcado **(sugestão Claude)** ainda não foi decidido.
**Dono:** Vicente (decisão 0021: "deploy, com Devin"). Cada sessão tem um dono humano, e quem valida é outra pessoa.

## Para que serve o Devin aqui

| | Claude Code | Devin |
|---|---|---|
| Onde roda | Na máquina de cada um | Na nuvem, numa máquina própria, com terminal, editor e navegador |
| Como trabalha | Junto com a pessoa, em ciclos curtos | Sozinho, do começo ao fim, inclusive de madrugada |
| Serve para | O que precisa de olho humano a cada passo: busca com o Claude, plugin, MCP, telas | Tarefa com contrato fechado e um "pronto quando" que dá para conferir |

O gargalo não é crédito. No preço público (US$ 2,25 por ACU, e uma ACU é cerca de 15 min de trabalho), US$ 200 dão umas 89 ACUs, perto de 22 h de Devin por pessoa.
O gargalo é revisar e juntar sem conflito. Por isso: poucas sessões, bem delimitadas, cada uma numa área do código.

## Tarefas

| ID | Tarefa | Kanban | Quando | Valida |
|---|---|---|---|---|
| [DV-1](#dv-1-pipeline-de-deploy) | Pipeline de deploy: front na Vercel, back no Render | T-38 | Agora | Vicente |
| [DV-2](#dv-2-rotas-do-back) | Rotas do back: catálogo, decisões, publicação e coordenação | T-06, T-07 | Depois da base do back (T-39) e do M1 | Alexandre (T-06), Bruno (T-07) |
| [DV-3](#dv-3-reset-da-demo) | Reset da demo: um comando volta o banco ao seed | T-25 | Depois da migração aplicada (T-05) | Bruno |
| [DV-4](#dv-4-conferência-do-site-publicado) | Conferência do site publicado contra o checklist de entrega | T-15 | Depois do deploy com dados (T-15) | Vicente |

Ordem: DV-1 logo que a decisão 0031 for aceita. DV-3 assim que a migração estiver aplicada. DV-2 depois da base, de preferência antes de dormir, para rodar à noite. DV-4 no dia 27, depois do T-15.

## O que não vai para o Devin

- **Migração e base do back (T-05, T-39).** São decisões que as rotas vão copiar: nome de coluna, tipo de chave, como o back fala com o banco. E aplicar no Supabase precisa de uma pessoa.
- **Busca com o Claude (T-10) e validador (T-11).** São do Bruno: prompt e regra de produto.
- **Servidor MCP (T-12).** É fino e depende das rotas. A descrição das ferramentas muda como o Claude Code se comporta na demo. Rende mais com o Vicente iterando junto com o plugin do Bruno.
- Plugin (T-13), telas (T-16 a T-20), conteúdo do seed (T-04), roteiro, pitch, ficha, slides e vídeo.
- Qualquer decisão de produto que não está na PRD.

## Fechar antes de soltar o Devin

Um brief só roda com os itens dele marcados. Quem abre a sessão confere.

**Antes da primeira sessão**
- [x] `AGENTS.md` na `main`.
- [ ] Decidir e registrar que o Devin pode ler o repositório inteiro. Ao conectar, ele indexa tudo, inclusive `memoria/`, os documentos numerados de `docs/` e `itau-design-system/`. Contra: a regra de segurança diz "não colar em serviço externo", e o regulamento tem a 3.7.2. A favor: a ferramenta veio da organização, e o Claude Code já lê o mesmo conteúdo.
- [ ] Devin ligado ao GitHub só neste repositório, com o ambiente montado (ver "Como começar").

**DV-1 (deploy)**
- [x] A-17 decidida e aceita: [decisão 0031](../memoria/decisions/0031-hospedagem-front-na-vercel-back-no-render.md), front na Vercel e back no Render.
- [ ] Contas na Vercel e no Render criadas pelo Vicente, entrando com o GitHub dele. O repositório está na conta pessoal dele, e a documentação da Vercel só restringe o plano grátis em repositório de organização. Então a Vercel deve publicar commits de todo o time. Conferir no primeiro merge de outra pessoa.
- [ ] Tokens da Vercel e do Render guardados nos Secrets do Devin. Nunca no texto da sessão, nunca no repositório.
- [ ] `SUPABASE_URL` e `SUPABASE_SECRET_KEY` à mão para uma pessoa colar no painel do Render. O back ainda não usa, mas vai usar. O Devin não recebe essas chaves.
- [ ] Região do projeto no Supabase, para pôr no texto da sessão. Não é segredo.
- [x] Como manter o Render acordado: fluxo no n8n (T-40, ver abaixo). O Devin não configura ping.

**DV-2 (rotas do back)**
- [ ] M1: [docs/api.md](api.md) revisado pelo Vicente e pelo Alexandre (T-03). O contrato não muda durante a sessão.
- [ ] T-05 aplicada no Supabase, com aprovação de uma pessoa. A migração já está escrita pelo Bruno em `supabase/migrations/20260926230000_schema_inicial.sql`, com ids em `text` e RLS ligado.
- [ ] T-39: base do back na `main`. É o molde que o Devin copia:
  - acesso ao banco atrás de uma dependência do FastAPI, com duas versões: Supabase e memória, carregada do `seed.json`. Assim os testes nunca tocam o Supabase do time **(sugestão Claude)**;
  - usuário atual por uma dependência só, lendo `X-Usuario-Id` (401 sem ele);
  - uma rota pronta de ponta a ponta, com teste. `GET /api/usuarios` serve **(sugestão Claude)**.
- [ ] Combinado com o Bruno: o T-10 também mexe em `backend/app/`. Cada um fica nos próprios arquivos.

**DV-3 (seed e reset)**
- [ ] T-05 aplicada. `seed.json` estável (T-04).

**DV-4 (conferência)**
- [ ] T-15 feito: link de produção com os dados da demo.

### Manter o Render acordado

Decidido: um fluxo no n8n, que o time já conhece (T-40, do Alexandre).
- No plano grátis, o back dorme depois de 15 min sem acesso e leva de 30 s a 1 min para acordar. Se o link estiver frio, parece que o sistema travou.
- O fluxo: um Schedule Trigger a cada 8 min e um HTTP Request `GET https://<domínio-da-vercel>/api/health`, com timeout de 90 s e "Retry On Fail" ligado.
- A chamada vai pelo domínio da Vercel, não pelo do Render. Assim o ping acorda o back e confere o caminho inteiro.
- O n8n precisa ficar ligado 24 h, como o n8n Cloud ou uma instância que o time já usa. Num notebook que dorme, o ping para junto.
- Não precisa de chave: a URL é pública.
- Se o n8n de vocês já tiver um canal de aviso configurado, avisar o time quando falhar duas vezes seguidas. Se não tiver, fica sem alerta.
- O plano grátis do Render dá 750 h por mês. Um serviço acordado o mês inteiro cabe.
- Mesmo com o ping, abrir o link um minuto antes de gravar o vídeo e antes da banca.

## Como começar

Para quem nunca usou. Não precisa instalar nada: o Devin roda na nuvem e se usa pelo navegador, em [app.devin.ai](https://app.devin.ai). Existem CLI e app de desktop, mas não fazem falta aqui.

1. **GitHub.** Instalar o app do Devin no GitHub e escolher "Select repositories", só com `itau-house`.
2. **Indexar e montar o ambiente.** Adicionar o repositório e deixar o Devin indexar. O jeito simples de montar o ambiente é abrir uma sessão e pedir: ele lê o código, propõe os passos e você aprova. Precisa de Python 3.12 com uv, Node 24 e Docker.
3. **Segredos.** Tokens vão na aba de Secrets. Nunca no texto da sessão.
4. **Abrir a sessão.** Modo Agent, com o repositório selecionado. Para tarefa grande (DV-2), comece no modo Ask para ele propor um plano, e depois use "Send to Devin". Texto da sessão:

   > Leia o AGENTS.md e o docs/devin.md. Faça a tarefa DV-1, seguindo o brief e o "Pronto quando". Não abra Pull Request: faça push da sua branch e termine com o relatório.

5. **Acompanhar.** Antes de dormir, conferir se ele não parou esperando resposta.
6. **Revisar e juntar**, pela decisão 0008:
   - `git fetch` e `git diff main...origin/<branch>` para ver o que mudou;
   - rodar o que o relatório manda;
   - trazer a `main` para a branch, conferir o fluxo principal e juntar na `main`;
   - se ele abrir Pull Request mesmo assim, fechar sem juntar e seguir o fluxo normal.
7. **Fechar.** Quem valida confere o "Pronto quando" e marca no kanban. Quem abriu a sessão preenche o registro no fim deste arquivo. Em "Session Insights", "Generate Analysis" sugere um texto melhor para a próxima sessão.

## Briefs

Cada brief é autossuficiente. O Devin lê o `AGENTS.md` e o brief da tarefa dele. O resto é consulta.

### DV-1: Pipeline de deploy

**Kanban:** T-38. **Branch:** `feat/deploy`. **Requisitos:** RNF-03 e entrega 1 (link do protótipo).

**Objetivo.** Publicar o que já está na `main`: front na Vercel, back no Render. Depois disso, cada merge na `main` publica os dois sem ninguém mexer.

**Ler antes.** `AGENTS.md`. No `README.md`, "Arquitetura" e "Como rodar". `docker-compose.prod.yml`, `backend/Dockerfile`, `frontend/Dockerfile`, `frontend/nginx.conf.template`, `frontend/vite.config.ts`, `.github/workflows/docker.yml` e `backend/.env.example`.

**Já decidido.**
- Back no Render, como Web Service Docker, a partir do `backend/Dockerfile`. O último estágio (`production`) já lê `$PORT`. Health check em `/api/health`. Região mais próxima da do Supabase, que vem no texto da sessão.
- Front na Vercel, como site estático do Vite, com build em `frontend/`. O build importa `../design-system`, então a Vercel precisa enxergar essa pasta. As rotas do front são por hash: não precisa de fallback de SPA.
- O front chama `/api/...` por caminho relativo. Na Vercel, um rewrite de `/api/:path*` para `https://<serviço>.onrender.com/api/:path*`. Sem CORS no back, sem `VITE_API_URL` e sem URL do back no código do front.
- Os headers de segurança do `nginx.conf.template` vão para o `vercel.json`: `X-Content-Type-Options`, `X-Frame-Options` e `Referrer-Policy`.
- Configuração como código: `render.yaml` na raiz e `vercel.json`. No `render.yaml`, `SUPABASE_URL` e `SUPABASE_SECRET_KEY` com `sync: false`: uma pessoa cola o valor no painel.
- Publicação pela integração Git das duas plataformas, a partir da `main`. Se a plataforma tiver opção nativa de esperar o CI verde, ligue.

**Não faça.**
- Não mexa em `backend/app/`, `frontend/src/`, `design-system/`, nos Dockerfiles nem em `.github/workflows/`. Se achar que precisa, pare e explique.
- Não crie conta, não assine plano pago e não configure ping. Liste no relatório o que uma pessoa precisa fazer.
- Não peça nem use as chaves do Supabase ou da Anthropic.

**Pronto quando.**
- O domínio de produção da Vercel abre numa janela anônima, sem login. URL de preview não vale: por padrão, a Vercel pede login nelas.
- `https://<domínio>/api/health` responde `{"status": "ok"}` passando pela Vercel, e `https://<domínio>/api/docs` abre.
- Para testar antes do merge, pode apontar o Render para a `feat/deploy` e publicar a Vercel pela CLI. No fim, os dois acompanham a `main`.
- A `feat/deploy` tem `render.yaml`, `vercel.json` e uma seção curta "Deploy" no `README.md`.

**Relatório.** URLs de produção, o que uma pessoa fez ou precisa fazer nos painéis, região escolhida, custo mensal e a URL para o ping do n8n (T-40).

### DV-2: Rotas do back

**Kanban:** T-06 e T-07. **Branch:** `feat/rotas-do-back`. **Requisitos:** RF-05, RF-07, RF-10, RF-17 a RF-19, RF-21, RF-22, RF-24, RF-25, RF-27, RF-30, RF-32, RNF-01, RNF-02 e RNF-07.

Este brief supõe a base do T-39 como descrita em "Fechar antes". Se o Vicente montar a base de outro jeito, ele ajusta o brief antes de abrir a sessão.

**Objetivo.** Implementar as rotas do contrato para catálogo, decisões, publicação e coordenação, sobre a base do T-39, com testes que rodam no CI.

**Ler antes.** `AGENTS.md`. O [docs/api.md](api.md) inteiro: é o contrato. No `PRD.md`, as seções 5, 7 e 8. Todo o `backend/app/` e o `backend/tests/`.

**Rotas.**
- Sessão: `GET /api/usuarios`, se o molde ainda não tiver.
- Catálogo: `GET /api/ativos` (`ordem=alta|curtidos|novos`) e `GET /api/ativos/{id}`.
- Descoberta: `POST /api/decisoes`.
- Publicação: `POST /api/ativos`, `PATCH /api/ativos/{id}` e `POST /api/ativos/{id}/envio`.
- Coordenação: `GET /api/aprovacoes` e `POST /api/aprovacoes/{ativoId}`.
- O `TODO(T-07)` do `api_validacoes.py`: gravar a validação e o evento `validacao`. Mexa só nesse ponto do arquivo.
- Só com tudo acima verde, as P1: `POST /api/ativos/{id}/curtida` e `POST /api/ativos/{id}/instalacoes`.

**Já decidido.**
- O JSON do `docs/api.md` é o contrato. Não mude nome de campo, rota nem código de erro.
- Siga o molde do T-39: repositório pela dependência do FastAPI, usuário pela dependência do cabeçalho, erro no formato do contrato.
- Implemente as funções do repositório nas duas versões, memória e Supabase.
- Visibilidade só por `catalogo.visivel`, em toda leitura. A versão Supabase busca os ativos e filtra com ela. Ativo invisível responde 404.
- O status só muda pelas rotas do contrato: `rascunho` → `em_aprovacao` ou `barrado` → `publicado` ou `devolvido`. Fora do status certo, 409.
- Nada vira `publicado` sem o Cord+ do squad do autor (RF-19, RNF-02).
- Cada ação grava o evento do contrato (RNF-01). Os contadores do seed são a base, e os eventos novos somam em cima.

**Não faça.**
- `POST /api/busca` já existe (`api_busca.py` e `busca.py`, T-10, do Bruno): não mexa. Não altere o `validador.py`: só chame.
- Não mexa no front, no MCP, no deploy nem nas migrações.
- Nenhum teste escreve no Supabase do time. Teste a versão Supabase numa base descartável na sua máquina, por exemplo com `supabase start` e as migrações do repositório.

**Testes que precisam existir**, com o elenco do `seed.json`:
- Sem `X-Usuario-Id`, 401 em toda rota que pede usuário.
- O Rafael não vê `a-criterios-fatura`, `a-conciliacao-extrato`, `a-botao-contratacao` nem `a-job-carga-fatura`, nem no feed nem no detalhe (404). Vê `a-resumo-incidente` e `a-criterios-aceitacao`. São os casos do `test_catalogo.py`, agora pelas rotas.
- Feed em ordem de curtidas mais instalações (RF-25).
- Cena 2: rascunho com chave de API, envio responde 422 e o status vira `barrado`. Depois de corrigido, o envio leva a `em_aprovacao`.
- A Juliana (Cord+ da Pix · Cobranças) vê o item na fila. O Renato (Cord+ de outro squad) não vê. O Rafael (Cord−) recebe 403.
- Aprovar fora de `em_aprovacao` dá 409. Devolver sem comentário dá 422.
- Depois de aprovado, o ativo aparece no feed de quem pode vê-lo, com a visibilidade escolhida pelo autor.
- `usar` soma uma instalação. `adaptar` soma uma derivação.
- Cada ação acima grava o evento do contrato.

**CI.** Acrescentar ao `.github/workflows/docker.yml` um passo que roda o `pytest` do back. Hoje o CI só sobe os containers.

**Pronto quando.**
- Os testes acima passam no CI.
- A cena 2 roda por chamadas HTTP contra a versão em memória: rascunho, envio barrado, correção, envio, aprovação e feed.
- A versão Supabase passou nos mesmos testes numa base descartável. Se não deu, o relatório explica por quê.

**Relatório.** Rotas feitas e o que ficou de fora. Decisões tomadas. Como rodar contra o Supabase.

### DV-3: Reset da demo

**Kanban:** T-25. **Branch:** `feat/reset-da-demo`. **Requisitos:** RNF-03 e RNF-04.

**Objetivo.** Um comando que leva o banco ao estado inicial do roteiro: apaga os dados e reaplica o `supabase/seed.sql`.

**Ler antes.** `AGENTS.md`. `supabase/migrations/`, `supabase/gerar_seed_sql.py`, `supabase/seed.sql`, `backend/app/dados/seed.json` e, no `README.md`, a seção "Banco".

**Já existe.** O `supabase/gerar_seed_sql.py` (Bruno, T-05) gera o `supabase/seed.sql` a partir do `seed.json`, e o SQL é idempotente. Não mude o gerador, o `seed.sql` nem o `seed.json`. Se achar erro neles, registre no relatório.

**Já decidido.**
- O reset apaga os dados das tabelas e reaplica o `seed.sql`. Não apaga estrutura.
- Escolha o caminho mais simples e seguro, e explique a escolha.

**Não faça.**
- Não rode nada contra o Supabase do time. Teste numa base descartável na sua máquina.
- Não mude as migrações. Se precisar, pare e explique.

**Pronto quando.**
- Na base descartável, migrações e seed sobem sem erro, e rodar o seed duas vezes não duplica nada.
- Depois de criar dados de teste, o reset volta ao estado inicial.
- A seção "Banco" do `README.md` explica o comando, com o aviso de que só uma pessoa roda contra o Supabase do time.

**Relatório.** O comando, o que ele apaga e quanto tempo leva.

### DV-4: Conferência do site publicado

**Kanban:** apoia o T-15 e o T-35. **Branch:** nenhuma, é só relatório. **Requisitos:** RNF-06, RF-05, RF-23 e RF-25.

**Objetivo.** Abrir o link de produção como a banca abriria e conferir o checklist de entrega.

**Só leitura.** É o banco da demo: não publique, não aprove, não curta e não envie nada.

**Conferir.**
- O domínio de produção abre numa janela anônima, sem login. Se demorar, anote quanto.
- `/api/health` responde pela Vercel.
- Toda tela diz que é protótipo de hackathon, não produto oficial do Itaú (RNF-06).
- O login simulado aparece como **[SIMULADO]** (RF-23).
- Nenhum nome de pessoa real, chave ou dado pessoal na tela.
- Feed em ordem de popularidade (RF-25). Entrando como Rafael, os ativos de squad de outra squad não aparecem (RF-05).
- Nenhum vermelho, roxo ou gradiente.

**Pronto quando.** Relatório com cada item marcado como ok ou falhou, e print do que falhou.

## Registro das sessões

Quem abriu a sessão preenche ao juntar. Vira base para a declaração de uso de IA (T-34) e para a pergunta da ficha "Se usaram IA na construção, como verificaram as saídas?".

| Data | Tarefa | Quem abriu | Resultado | ACUs | O que corrigimos na revisão |
|---|---|---|---|---|---|

## Fontes

Consultadas em 26/09/2026.
- Preço e ACU: [devin.ai/pricing](https://devin.ai/pricing) e [resumo de preços de 2026](https://vp0.com/blogs/devin-ai-pricing-plans-2026).
- Devin: [AGENTS.md](https://docs.devin.ai/onboard-devin/agents-md), [primeira sessão](https://docs.devin.ai/get-started/first-run), [GitHub](https://docs.devin.ai/integrations/gh), [ambiente e segredos](https://docs.devin.ai/onboard-devin/environment).
- Render grátis: [artigo do Render sobre planos grátis](https://render.com/articles/platforms-with-a-real-free-tier-for-developers-in-2026).
- Vercel grátis e repositório privado: [documentação de Git da Vercel](https://vercel.com/docs/git).
