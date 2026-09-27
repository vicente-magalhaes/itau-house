# Plano do Devin

Como o time usa o Devin no Itaú House: para quê, em que momento e com que regras.
Tem dois leitores. O time, que abre as sessões e revisa. E o próprio Devin, que acha aqui o brief da tarefa dele.
Regras para qualquer agente em [AGENTS.md](../AGENTS.md). Tasks e status em [KANBAN.md](../KANBAN.md).

**Status:** plano do Vicente, escrito com o Claude em 26/09. Os itens de "Fechar antes" são decisões do time. O que está marcado **(sugestão Claude)** ainda não foi decidido.
**Dono:** Vicente (decisão 0021: "deploy, com Devin"). Ele abre toda sessão. Na DV-1 e na DV-4, quem faz é o Devin e o Vicente valida. Nas outras, quem valida é outra pessoa.

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
| [DV-5](#dv-5-base-do-back) | Base do back: repositório, usuário pelo cabeçalho, erro no formato do contrato e rota de molde | T-39 | Agora, em paralelo com a DV-3 | Bruno |
| [DV-6](#dv-6-servidor-mcp) | Servidor MCP com as seis ferramentas do contrato | T-12 | Agora, em paralelo com a DV-5 | Bruno |

Ordem: DV-1 e DV-3 feitas em 27/09. DV-5 e DV-6 juntas, porque ficam em pastas diferentes (`backend/` e `mcp/`). DV-2 depois da DV-5 juntada. DV-4 depois do T-15.

## O que não vai para o Devin

- **Migração (T-05).** Aplicar no Supabase precisa de uma pessoa. A base do back (T-39) saiu desta lista em 27/09: o Vicente aprovou o plano, as escolhas estão na [decisão 0035](../memoria/decisions/0035-back-fala-com-o-supabase-pelo-cliente-python.md), e o Devin executa como DV-5.
- **Busca com o Claude (T-10) e validador (T-11).** São do Bruno: prompt e regra de produto.
- Plugin (T-13), telas (T-16 a T-20), conteúdo do seed (T-04), roteiro, pitch, ficha, slides e vídeo.
- Qualquer decisão de produto que não está na PRD.

## Fechar antes de soltar o Devin

Um brief só roda com os itens dele marcados. Quem abre a sessão confere.

**Antes da primeira sessão**
- [x] `AGENTS.md` na `main`.
- [x] Decidido na [0033](../memoria/decisions/0033-devin-le-o-repositorio-inteiro.md): o Devin lê o repositório inteiro, inclusive `memoria/`, os documentos numerados de `docs/` e `itau-design-system/`. Ele não copia nada desse conteúdo para código, commit ou relatório.
- [x] Devin ligado ao GitHub só neste repositório, com o ambiente montado (ver "Como começar"). Blueprint aprovado em 27/09: Python 3.12 com uv, Node 24, Docker com Compose e a CLI da Vercel. Testes, lint e build passaram na `main` `10a2cdc`.

**DV-1 (deploy)**
- [x] A-17 decidida e aceita: [decisão 0031](../memoria/decisions/0031-hospedagem-front-na-vercel-back-no-render.md), front na Vercel e back no Render.
- [x] Contas na Vercel e no Render criadas pelo Vicente em 27/09, entrando com o GitHub dele. Nenhum projeto criado, e o app de cada uma no GitHub só tem acesso ao `itau-house`. O repositório está na conta pessoal dele, e a documentação da Vercel só restringe o plano grátis em repositório de organização. Então a Vercel deve publicar commits de todo o time. Conferir no primeiro merge de outra pessoa.
- [x] Tokens da Vercel e do Render guardados nos Secrets do Devin. Nunca no texto da sessão, nunca no repositório. Estão como segredos pessoais do Vicente, com os nomes `VERCEL_TOKEN` e `RENDER_API_TOKEN`, desde 27/09. O token da Vercel tem escopo Centao → All Projects e vence em pouco tempo. A chave do Render não expira: revogar depois da banca.
- [x] `SUPABASE_URL` e `SUPABASE_SECRET_KEY` à mão para uma pessoa colar no painel do Render. O back ainda não usa, mas vai usar. O Devin não recebe essas chaves. O Vicente pôs as duas no Environment Group `itau-house-supabase` do Render, em 27/09.
- [x] Região do projeto no Supabase, para pôr no texto da sessão. Não é segredo. É `us-east-1` (Virgínia do Norte), e no Render a região equivalente é Virginia (US East).
- [x] Como manter o Render acordado: fluxo no n8n (T-40, ver abaixo). O Devin não configura ping.

**DV-2 (rotas do back)**
- [x] M1: [docs/api.md](api.md) revisado pelo Vicente e pelo Alexandre (T-03), em 27/09. O contrato não muda durante a sessão.
- [x] T-05 aplicada no Supabase, com aprovação de uma pessoa. Conferido pelo Vicente em 27/09: `db push` diz que o banco está em dia, e as tabelas têm dados. A migração já está escrita pelo Bruno em `supabase/migrations/20260926230000_schema_inicial.sql`, com ids em `text` e RLS ligado.
- [x] DV-5 (T-39) juntada na `main` em 27/09. É o molde que o Devin copia: repositório com versão Supabase e versão memória, usuário por `usuario_atual`, erro por `ErroApi` e `GET /api/usuarios` de ponta a ponta (decisão 0035).
- [ ] Combinado com o Bruno: o T-10 também mexe em `backend/app/`. Cada um fica nos próprios arquivos.

**DV-3 (seed e reset)**
- [x] Migração do T-05 no repositório. O Devin testa numa base descartável, então não precisa dela aplicada no Supabase do time. O reset precisa funcionar com qualquer `seed.sql` que saia do gerador, porque o `seed.json` ainda muda (T-04). Liberada em 27/09.

**DV-4 (conferência)**
- [ ] T-15 feito: link de produção com os dados da demo.

**DV-5 (base do back)**
- [x] Plano aprovado pelo Vicente em 27/09. Escolhas na [decisão 0035](../memoria/decisions/0035-back-fala-com-o-supabase-pelo-cliente-python.md).

**DV-6 (servidor MCP)**
- [x] Contrato do MCP fechado no [docs/api.md](api.md) (M1) e plugin na `main` (T-13). Liberada pelo Vicente em 27/09. O MCP saiu de "O que não vai para o Devin": a primeira versão das descrições sai da skill do plugin, e o Bruno, que valida a T-12, ajusta depois junto com o plugin.

### Manter o Render acordado

Decidido: um fluxo no n8n, que o time já conhece (T-40, do Alexandre).
- No plano grátis, o back dorme depois de 15 min sem acesso e leva de 30 s a 1 min para acordar. Se o link estiver frio, parece que o sistema travou.
- O fluxo: um Schedule Trigger a cada 8 min e um HTTP Request `GET https://itau-house.vercel.app/api/health`, com timeout de 90 s e "Retry On Fail" ligado.
- A chamada vai pelo domínio da Vercel, não pelo do Render. Assim o ping acorda o back e confere o caminho inteiro.
- O n8n precisa ficar ligado 24 h, como o n8n Cloud ou uma instância que o time já usa. Num notebook que dorme, o ping para junto.
- Não precisa de chave: a URL é pública.
- Se o n8n de vocês já tiver um canal de aviso configurado, avisar o time quando falhar duas vezes seguidas. Se não tiver, fica sem alerta.
- O plano grátis do Render dá 750 h por mês, somadas entre todos os serviços Free da conta. A conta do Vicente tem outro serviço Free, o `evolution-api`. Se os dois ficarem acordados o mês inteiro, as horas não bastam. Quando acabam, o Render suspende os serviços Free até o dia 1º.
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
- Configuração como código: `render.yaml` na raiz e `vercel.json`. `SUPABASE_URL` e `SUPABASE_SECRET_KEY` já estão no Environment Group `itau-house-supabase` do Render, criado pelo Vicente no painel. No `render.yaml`, ligue o serviço a esse grupo com `fromGroup`. Não leia os valores, nem pela API.
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

Este brief supõe a base da DV-5 (decisão 0035) na `main`. Leia o `backend/app/repositorio.py`, o `sessao.py` e o `erros.py` antes de começar.

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

### DV-5: Base do back

**Kanban:** T-39. **Branch:** `feat/base-do-back`. **Requisitos:** RF-05, RF-23, RF-24 e RNF-07. **Decisão:** [0035](../memoria/decisions/0035-back-fala-com-o-supabase-pelo-cliente-python.md).

**Objetivo.** Fazer o molde que a DV-2 copia em todas as rotas: como o back fala com o banco, como sabe quem chama e como responde com erro. E uma rota de ponta a ponta, com teste.

**Ler antes.** `AGENTS.md`. A decisão 0035. No [docs/api.md](api.md), "Regras gerais", "Tipos" (Pessoa) e "Sessão". Todo o `backend/app/` e o `backend/tests/`. A migração `supabase/migrations/20260926230000_schema_inicial.sql`.

**Já decidido.**
- **Repositório** em `backend/app/repositorio.py`: a interface `Repositorio` (Protocol), `RepositorioMemoria`, `RepositorioSupabase` e `obter_repositorio()`, que é uma dependência do FastAPI com uma instância por processo. Por enquanto, só `usuarios()` e `usuario(id)`.
  - As duas versões devolvem dicionários no formato do `seed.json`, em camelCase. Para `Pessoa`: `id, nome, iniciais, papel, cargo, squadId, squad, frente, perfil`.
  - A memória faz uma cópia profunda do `catalogo.seed()`.
  - O Supabase usa o cliente `supabase` do Python (`uv add supabase`). Busca `usuarios` com `squads(nome, frente)` e converte snake_case para esse formato.
  - A escolha é automática: com `SUPABASE_URL` e `SUPABASE_SECRET_KEY` no ambiente, usa o Supabase; sem elas, a memória.
- **Usuário** em `backend/app/sessao.py`: a dependência `usuario_atual`, que lê `X-Usuario-Id` pelo repositório. Sem cabeçalho → 401 `sem_usuario`. Id desconhecido → 401 `usuario_desconhecido`.
- **Erro** em `backend/app/erros.py`, com os tratadores registrados no `main.py`:
  - `ErroApi(status, erro, mensagem, **extra)` sai como `{erro, mensagem, ...extra}`. O `extra` serve para o 422 `barrado`, que leva `validacao`;
  - `HTTPException` com um dicionário de `erro` sai com esse dicionário na raiz, sem `detail`;
  - outras `HTTPException`, como rota inexistente, saem com um código genérico por status;
  - `RequestValidationError` sai como 422 `entrada_invalida`, com mensagem em pt-BR que cita os campos.
- **Rota de molde:** `GET /api/usuarios`, em `backend/app/api_usuarios.py`. Não pede cabeçalho. Responde `{ "usuarios": [Pessoa] }`, ordenada por `nome` em Python, na rota.
- **Testes nunca tocam o Supabase do time.** O `backend/tests/conftest.py` troca `obter_repositorio` por uma `RepositorioMemoria` nova em todo teste e apaga `SUPABASE_URL` e `SUPABASE_SECRET_KEY` do ambiente.
  - A versão Supabase tem um teste próprio, `test_repositorio_supabase.py`, com o marcador `supabase`. Ele lê `ITAU_HOUSE_TESTE_SUPABASE_URL` e `ITAU_HOUSE_TESTE_SUPABASE_KEY` e pula quando elas não existem.
  - Se a URL não for `localhost` ou `127.0.0.1`, o teste **falha**, não pula.

**Não faça.**
- Não mexa em `api_busca.py`, `busca.py` e `validador.py` (T-10 e T-11, do Bruno), nem no `api_validacoes.py` (o `TODO(T-07)` é da DV-2). O tratador global já corrige o formato de erro deles.
- Não mexa no `catalogo.py`: ele continua sendo a regra de visibilidade. Não mexa em `frontend/`, `supabase/`, no README, nos Dockerfiles nem no CI.
- A DV-3 está mexendo em `supabase/` ao mesmo tempo. Se precisar de algo lá, pare e explique.
- Não rode nada contra o Supabase do time. Para o teste da versão Supabase, use só uma base local: `supabase start` e `supabase db reset`, **sem** `--linked`. As chaves locais saem de `supabase status`.

**Testes que precisam existir** (`backend/tests/test_base.py`):
- `GET /api/usuarios` sem cabeçalho → 200, com as 20 pessoas do seed, só com as chaves de `Pessoa` e em ordem de `nome`.
- `usuario_atual`, numa rota criada só no teste: sem cabeçalho → 401 `{erro: "sem_usuario", mensagem}` na raiz; id inventado → 401 `usuario_desconhecido`; `u-rafael` → a pessoa do seed.
- `POST /api/busca` sem cabeçalho → 401 com `erro` na raiz, sem `detail`. Com `{}` → 422 `entrada_invalida`, em pt-BR, citando `pedido`.
- Rota inexistente → 404 `{erro, mensagem}`.
- A memória é isolada: mudar um usuário num teste não aparece no seguinte.
- Na base local, as duas versões devolvem as mesmas pessoas, comparadas por `id`.

**Pronto quando.**
- Em `backend/`, `uv run pytest` e `uv run ruff check .` passam.
- O teste da versão Supabase passou numa base local. Se não passou, o relatório explica o motivo.
- `docker compose build` passa.
- A `feat/base-do-back` tem push, sem PR.

**Relatório.** Arquivos criados, como rodar o teste da versão Supabase na base local, e o que a DV-2 precisa saber para acrescentar métodos ao repositório.

### DV-6: Servidor MCP

**Kanban:** T-12. **Branch:** `feat/mcp`. **Requisitos:** RF-10, RF-17 e RNF-05.

**Objetivo.** Fazer o servidor MCP `itau-house`, que o plugin do Claude Code (`plugin/.mcp.json`) sobe na máquina da pessoa. Ele segue a seção "Contrato do MCP (T-12)" do [docs/api.md](api.md).

**Ler antes.** `AGENTS.md`. O [docs/api.md](api.md) inteiro: a tabela do MCP e as rotas que cada ferramenta chama. Todo o `plugin/`, principalmente o `.mcp.json` e o `skills/itau-house/SKILL.md`. As cenas 1 e 2 do [docs/roteiro-demo.md](roteiro-demo.md).

**Já decidido.**
- `mcp/` é um projeto uv próprio, com `mcp/pyproject.toml`, Python 3.12 e o SDK oficial do MCP (`mcp`, com FastMCP) e `httpx`. Transporte stdio. O comando do plugin, `uv run --directory mcp python servidor.py`, precisa funcionar sem mudança.
- As seis ferramentas têm os nomes e as entradas exatamente da tabela do contrato. Cada uma chama a rota da tabela em `ITAU_HOUSE_API` (padrão `http://localhost:8000`), com `X-Usuario-Id: $ITAU_HOUSE_USUARIO` (padrão `u-rafael`). A `buscar_ativos` manda `modo` de `ITAU_HOUSE_MODO` (padrão `perguntar_antes`).
- **Resposta:** o JSON da rota, como texto.
  - Em erro HTTP, devolve o JSON de erro da API (`{erro, mensagem}`) como texto, sem levantar exceção.
  - Com a API fora do ar, devolve `{"erro": "api_fora_do_ar", "mensagem": ...}`, em pt-BR.
  - Timeout de 90 s: o back publicado leva até 1 min para acordar.
- **Leitura da pasta** em `validar_ativo` e `montar_post`:
  - aceitam a pasta da skill ou um arquivo só, como o de um agente;
  - leem os arquivos de texto com caminho relativo à pasta;
  - ignoram `.git/`, `__pycache__/`, `node_modules/`, binários e arquivos acima de 200 KB.
- **`montar_post`:**
  - os parâmetros em snake_case viram camelCase no JSON (`manual_instalacao` → `manualInstalacao`, `derivado_de` → `derivadoDe`, `validacao_ids` → `validacaoIds`);
  - sem `id`, faz `POST /api/ativos`;
  - com `id`, faz `PATCH /api/ativos/{id}` só com os campos enviados.
- **Descrições das ferramentas:** curtas, em pt-BR, dizendo quando usar cada uma, coerentes com o `plugin/skills/itau-house/SKILL.md`. Não prometem o que a rota não faz. O Bruno ajusta depois, junto com o plugin.

**Não faça.**
- Não mexa em `backend/`, `frontend/`, `plugin/`, `supabase/`, no README nem no CI. Se o plugin precisar de mudança para falar com o servidor, pare e explique no relatório.
- Não invente rota nem campo. Hoje só existem `POST /api/busca` e `POST /api/validacoes`. As outras quatro chegam com a DV-2: teste contra uma API falsa.
- Nenhuma chave no código. O servidor não precisa de nenhuma.

**Testes que precisam existir** (`mcp/tests/`, com uma API falsa, por exemplo `httpx.MockTransport`):
- Cada ferramenta chama o método e o caminho certos, com `X-Usuario-Id` e o corpo em camelCase.
- `montar_post` sem `id` faz POST. Com `id`, faz PATCH só com os campos enviados.
- Erro 4xx sai como `{erro, mensagem}` em texto, sem exceção. API fora do ar sai como `api_fora_do_ar`.
- Leitura da pasta:
  - ignora `.git/`, `node_modules/`, binário e arquivo acima de 200 KB;
  - o caminho é relativo à pasta;
  - a linha que o validador aponta é a linha real do arquivo.
- O servidor sobe por stdio e lista as seis ferramentas, pelo cliente do SDK.
- Teste de fumaça contra o back real na sua máquina (`cd backend && uv run uvicorn app.main:app`), sem chave de LLM:
  - `buscar_ativos` com o pedido da cena 1 volta a resposta gravada;
  - `validar_ativo` numa pasta com a chave falsa da cena 2 volta `barrado`.

**Pronto quando.**
- `cd mcp && uv run pytest` passa.
- `uv run --directory mcp python servidor.py` sobe e responde à listagem de ferramentas.
- O teste de fumaça contra o back local passou.
- A `feat/mcp` tem push, sem PR.

**Relatório.**
- Como ligar o plugin com este servidor no Claude Code, na máquina de uma pessoa.
- Quais ferramentas só vão funcionar de ponta a ponta depois da DV-2.
- O texto de cada descrição de ferramenta, para o Bruno revisar.

## Registro das sessões

Quem abriu a sessão preenche ao juntar. Vira base para a declaração de uso de IA (T-34) e para a pergunta da ficha "Se usaram IA na construção, como verificaram as saídas?".

| Data | Tarefa | Quem abriu | Resultado | ACUs | O que corrigimos na revisão |
|---|---|---|---|---|---|
| 27/09 | Ambiente (blueprint) | Vicente | Ambiente pronto. Relatou 3 falhas da `main` sem corrigir: erro 401 dentro de `detail`, 422 padrão do FastAPI em inglês e contadores desencontrados no front | a preencher | Nada: a sessão não mexe em arquivo |
| 27/09 | DV-1 (T-38) | Vicente | `feat/deploy` com `render.yaml`, `vercel.json` e seção "Deploy" no README. No ar em https://itau-house.vercel.app | a preencher | Nada no código. Revisão do Claude conferiu o "Pronto quando" e que as pastas internas dão 404 no site. O segredo do Render se chama `RENDER_API_TOKEN`, e o docs foi corrigido |
| 27/09 | DV-3 (T-25) | Vicente | `feat/reset-da-demo` com `supabase/reset_demo.sh` e o aviso na seção "Banco" do README. Testado pelo Devin numa base local | a preencher | Nada. Revisão do Claude leu o script (transação única, sem `cascade`, confirmação fora da base local), conferiu que o `seed.sql` não abre transação própria e que o CI passou. Não rodou o script |
| 27/09 | DV-5 (T-39) | Vicente | `feat/base-do-back`: repositório com as versões memória e Supabase, `usuario_atual`, `ErroApi` com tratadores globais e `GET /api/usuarios`. Testado pelo Devin também numa base Supabase local | a preencher | Nada no código. Revisão do Claude rodou os testes no Windows e uma fumaça com o back em memória (usuários, 401, 422 e 404 no formato do contrato). Conferiu que o cliente `supabase` 2.31 aceita a chave `sb_secret_` sem exigir JWT. A leitura no Supabase do time só se confirma depois do deploy |
| 27/09 | DV-6 (T-12) | Vicente | `feat/mcp`: servidor stdio com as seis ferramentas. Busca e validação passaram na fumaça contra o back local. As outras quatro dependem da DV-2 | a preencher | Claude corrigiu: resposta sem JSON (502 em HTML, 500 em texto) levantava exceção, e agora sai como `resposta_invalida`. Dois testes quebravam no Windows (atalho sem permissão e quebra de linha `\r\n`) |

## Fontes

Consultadas em 26/09/2026.
- Preço e ACU: [devin.ai/pricing](https://devin.ai/pricing) e [resumo de preços de 2026](https://vp0.com/blogs/devin-ai-pricing-plans-2026).
- Devin: [AGENTS.md](https://docs.devin.ai/onboard-devin/agents-md), [primeira sessão](https://docs.devin.ai/get-started/first-run), [GitHub](https://docs.devin.ai/integrations/gh), [ambiente e segredos](https://docs.devin.ai/onboard-devin/environment).
- Render grátis: [artigo do Render sobre planos grátis](https://render.com/articles/platforms-with-a-real-free-tier-for-developers-in-2026).
- Vercel grátis e repositório privado: [documentação de Git da Vercel](https://vercel.com/docs/git).
