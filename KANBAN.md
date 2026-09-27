# Kanban: Itaú House

Tudo que falta para entregar na banca (27/09): produto, código, evidência e apresentação.
Requisitos em [PRD.md](PRD.md). Fluxos em [docs/fluxos.html](docs/fluxos.html). Papéis em D-21.

## Como usar

1. `git pull` antes de mexer aqui. Este arquivo muda o tempo todo.
2. Pegou uma task: `Status` → `Fazendo`. Terminou: `Feito`. Travou: `Bloqueado` e diga o motivo na coluna Task.
3. Uma task só vira `Feito` depois que quem valida confere o "Pronto quando".
4. Commit só do kanban: `chore(kanban): T-05 feito`. Commit de código cita o requisito: `feat: feed por popularidade (RF-25)`.
5. Siga a sua ordem abaixo. Se a próxima estiver bloqueada, pegue a seguinte.
6. Achou uma task que falta: adicione no fim da fase certa, com o próximo número livre.

**Prazo de submissão: a confirmar (T-01).** Os horários das fases se ajustam a ele.

## Quem faz o quê

| Pessoa | Frente | Valida principalmente |
|---|---|---|
| **Bruno** | Produto e camada de IA: roteiro da demo, catálogo fictício, busca, validador, plugin. Vídeo demo (D-23) | Front e back |
| **Vicente** | Back-end, MCP, banco, deploy (com Devin) | Camada de IA |
| **Alexandre** | Front-end | Plugin (olhar de quem não construiu) |
| **JP** | Apresentação e evidência: prazo, entrevista, slides, ficha, pitch | Tudo que a banca vê |
| **Devin** (agente, sessões do Vicente) | Tasks isoladas que rodam sozinhas: deploy, rotas do back, reset da demo, conferência do link. Briefs e o que fechar antes em [docs/devin.md](docs/devin.md) | Nada: toda entrega dele passa por uma pessoa |

O Claude rascunha textos (ficha, Q&A, pesquisa, catálogo) quando pedido. Sempre com um humano validando.
O Devin só pega uma task depois que o "Fechar antes" dela, no [docs/devin.md](docs/devin.md), estiver marcado. Toda sessão dele é aberta pelo Vicente. Na T-38 e na T-15, o dono é o Devin e o Vicente valida. Nas outras, o dono é `Vicente (Devin)` e outra pessoa valida.

## Ordem de cada um

- **Bruno:** T-02 → T-03 → T-04 → T-05 (assumida do Vicente) → T-10 → T-11 → T-13 → T-14 → T-24 → T-30 (vídeo completo) → T-37 (secundária)
- **Vicente:** T-39 → T-12 → T-34 → T-35. Em paralelo, abre, revisa e junta o que o Devin faz (T-38, T-25, T-06, T-07, T-15), e valida a T-38 e a T-15
- **Alexandre:** T-16 → T-17 → T-18 → T-19 → T-20 → T-24. A T-40 entra assim que o T-38 tiver o link
- **JP:** T-01 → T-22 → T-23 → T-26 → T-27 → T-28 → T-29 → T-31 → T-32 → T-33 → T-36 → T-35
- **Devin:** T-38 (agora) → T-25 (depois do T-05) → T-06 e T-07 (depois do T-39 e do M1) → T-15, com a conferência do link

## Marcos

| Marco | Significa | Depende de |
|---|---|---|
| **M1** | Contrato da API fechado. Front, MCP e IA trabalham em paralelo. | T-03 |
| **M2** | Fluxo P0 rodando de ponta a ponta na máquina de alguém. | T-06, T-07, T-10 a T-13, T-17 a T-19 |
| **M3** | Build de produção com link e dados prontos. Ensaio da demo aprovado. | T-15, T-24 |
| **M4** | Vídeo no YouTube, público. | T-30 |
| **M5** | Submissão confirmada pela organização. | T-35 |

## Fase 0: destravar (agora)

| ID | Task | Pronto quando | Dono | Valida | Depende | Req | Status |
|---|---|---|---|---|---|---|---|
| T-01 | Confirmar prazo e formato de submissão com a organização | Horário e canal de envio anotados aqui no topo | JP | Bruno | — | — | A fazer |
| T-02 | Roteiro da demo: cena 1 (acha skill da PM e adapta) e cena 2 (cria, validador barra, corrige, coordenadora aprova) | Passo a passo com falas, telas e dados de cada clique em `docs/roteiro-demo.md` | Bruno | JP | — | todos P0 | Fazendo |
| T-03 | Contrato da API: rotas, entradas e saídas em JSON | `docs/api.md` revisado por Vicente e Alexandre | Bruno | Vicente, Alexandre | T-02 | RF-05 a RF-32 | Feito |
| T-04 | Catálogo fictício: squads, usuários (papéis, Cord+/−), 15 a 20 ativos inspirados em retrabalho real. Inclui a skill da PM da cena 1 e um ativo de alcance "squad" de outra squad (teste do RF-05) | Arquivo de seed no formato do T-03 | Bruno | JP (história), Vicente (formato) | T-03 | RNF-03, RNF-04 | Fazendo |
| T-05 | Banco no Supabase: schema do modelo de dados da PRD (seção 10) | Tabelas criadas, `.env.example` com os nomes das variáveis | Bruno | Vicente | — | PRD §10 | Feito |
| T-16 | Base do front: design system ligado, layout, aviso de protótipo, login simulado com troca de usuário | Tela de login escolhe usuário fictício e mostra perfil | Alexandre | Bruno | — | RF-23, RF-24, RNF-06 | Fazendo |
| T-22 | Entrevista com um dev do Itaú no evento | Registro em `docs/03` com papel, data, alcance e limite. Frase de recorte revisada | JP | Bruno | — | A-13 | A fazer |

## Fase 1: construir em paralelo (hoje à noite)

| ID | Task | Pronto quando | Dono | Valida | Depende | Req | Status |
|---|---|---|---|---|---|---|---|
| T-06 | API do catálogo: visibilidade, feed por popularidade, detalhe do post, contadores. Pelo Devin ([DV-2](docs/devin.md#dv-2-rotas-do-back)) | Rotas do T-03 respondendo com o seed. Ativo de alcance "squad" de outra squad nunca aparece. Testes no CI | Vicente (Devin) | Alexandre | T-03, T-04, T-05, T-39 | RF-05, RF-25, RF-27, RF-30, RNF-07 | A fazer |
| T-07 | API de publicação: rascunho, envio, fila, aprovar, devolver, eventos. Pelo Devin ([DV-2](docs/devin.md#dv-2-rotas-do-back)) | Ativo sai de rascunho e chega a publicado só com aprovação do Cord+ do squad. Testes no CI | Vicente (Devin) | Bruno | T-03, T-05, T-39 | RF-17 a RF-22, RF-32, RNF-01, RNF-02 | A fazer |
| T-10 | Busca com justificativa: filtro de visibilidade + Claude ranqueia (esforço baixo, saída por schema) | Pedido da cena 1 retorna a skill da PM com motivo. Pedido da cena 2 retorna "não encontrei" | Bruno | Vicente | T-04, T-06 | RF-05, RF-06 | Fazendo |
| T-11 | Validador: checagens fixas por código (chave, CPF, e-mail, README, autor), sem IA (D-26) | Skill da cena 2 com chave de API é barrada com arquivo, linha e sugestão. Corrigida, passa | Bruno | Vicente | T-03 | RF-14, RF-15 | Fazendo |
| T-12 | Servidor MCP: `buscar_ativos`, `detalhar_ativo`, `registrar_decisao`, `validar_ativo`, `montar_post`, `enviar_para_aprovacao` | Claude Code chama cada ferramenta e recebe resposta real da API | Vicente | Bruno | T-06, T-07 | RF-10, RF-17, RNF-05 | A fazer |
| T-13 | Plugin do Claude Code: hook de intenção, modo perguntar antes, instruções de uso, hook de ativo novo e convite a publicar ao fim da tarefa | Cena 1 e cena 2 rodam no Claude Code seguindo o roteiro | Bruno | Alexandre | T-12 | RF-02, RF-03, RF-04, RF-07, RF-08, RF-09, RF-11, RF-13, RF-16 | Fazendo |
| T-17 | Feed: cards com título, tipo, autor, papel, squad, curtidas, instalações | Feed lista o seed na ordem de popularidade | Alexandre | Bruno | T-06 | RF-25 | Fazendo |
| T-18 | Página do post: detalhes, contadores, trilha de aprovação, "derivado de" com link | Post da skill da PM mostra a derivação criada na cena 1 | Alexandre | Bruno | T-06 | RF-27, RF-30, RF-22 | Fazendo |
| T-19 | Fila de aprovação do Cord+: ver resultado do validador, aprovar, devolver com comentário | Coordenadora aprova o ativo da cena 2 e ele aparece no feed | Alexandre | Vicente | T-07 | RF-32, RF-19, RF-21 | Fazendo |
| T-23 | Evidências: registrar a fonte do "bench do centão" ou descartar. Buscar dados públicos sobre retrabalho e reuso, com fonte (pedir ao Claude) | `docs/03` atualizado. Nada sem fonte vai para o slide | JP | Bruno | — | critério "Dados" | A fazer |
| T-26 | Diferenciação: comparar com Backstage, catálogos de agentes e as skills homologadas do Itaú | Uma frase clara de por que é diferente, em `memoria/05` (A-05) | JP | Bruno | — | A-05, R-01 | A fazer |
| T-38 | Pipeline de deploy com o que já está na `main`: front na Vercel, back no Render, `/api` repassado pela Vercel. Pelo Devin ([DV-1](docs/devin.md#dv-1-pipeline-de-deploy)) | Domínio de produção abre numa janela anônima e `/api/health` responde por ele. Cada merge na `main` publica sozinho | Devin (sessão do Vicente) | Vicente | A-17 | RNF-03, entrega 1 | Feito |
| T-39 | Base do back: como as rotas falam com o banco, usuário pelo cabeçalho numa dependência só, uma rota de molde com teste. É o que o Devin copia no DV-2. Pelo Devin ([DV-5](docs/devin.md#dv-5-base-do-back)), com as escolhas da decisão 0035 | Rota de molde responde, com teste, e os testes rodam sem tocar no Supabase do time | Vicente (Devin) | Bruno | — | RF-05, RF-23, RNF-07 | A fazer |

## Fase 2: integrar e testar (amanhã cedo)

| ID | Task | Pronto quando | Dono | Valida | Depende | Req | Status |
|---|---|---|---|---|---|---|---|
| T-14 | Respostas gravadas para as cenas da demo, se o Claude cair ou demorar | Demo roda completa com a internet do LLM desligada, e a tela indica que é resposta gravada | Bruno | Vicente | T-10, T-11 | RNF-04 | Fazendo |
| T-15 | Deploy da demo: build de produção, seed carregado, link ou instruções de execução. O pipeline é o T-38. O Devin confere o link ([DV-4](docs/devin.md#dv-4-conferência-do-site-publicado)). Rodar o seed no Supabase do time fica com uma pessoa (AGENTS.md): `supabase/reset_demo.sh` pelo Git Bash, com `psql` instalado, e `DB_URL` com a URL do Session pooler (painel do Supabase > Connect). A conexão direta do plano grátis costuma ser só IPv6 | Link abre sem login (ou instrução roda do zero) com os dados da demo | Devin (sessão do Vicente) | Vicente | T-06, T-07, T-17 a T-19, T-25, T-38 | RNF-04 | A fazer |
| T-20 | P1 do front, só se M2 estiver pronto: curtir, instalar com manual, editar post, filtros | Cada item funciona sem quebrar o fluxo P0 | Alexandre | Bruno | M2 | RF-26, RF-28, RF-29, RF-31 | A fazer |
| T-24 | Ensaio da demo ponta a ponta no build de produção, seguindo o roteiro | Duas execuções seguidas sem erro, cronometradas | Bruno | JP | T-13, T-15 | todos P0 | A fazer |
| T-25 | Reset rápido do estado da demo: apaga os dados e reaplica o `supabase/seed.sql`. Pelo Devin ([DV-3](docs/devin.md#dv-3-reset-da-demo)). Contra o Supabase do time, quem roda é uma pessoa | Um comando volta o banco ao estado inicial do roteiro | Vicente (Devin) | Bruno | T-04, T-05 | RNF-04 | Fazendo |
| T-27 | Teste com pessoa de fora do time: tenta completar o fluxo | Registro: quem (papel), onde travou, o que entendeu, o que mudamos depois | JP | Bruno | M2 | A-10 | A fazer |
| T-41 | Login com Google (0034): cliente OAuth no Google Cloud, provedor ligado no Supabase (`supabase/ligar_google.sh`), botão "Entrar com Google" antes da escolha de persona | Entrar com Google leva à escolha de persona; a tela diz "login real, hierarquia simulada" | Bruno (Google e Supabase), Alexandre (botão) | Vicente | T-16 | RF-23 | Fazendo |
| T-37 | Secundária. Identidade do catálogo: temas das skills, nomes das pessoas, fotos. Detalhe que surpreende a banca | Seed revisado em `backend/app/dados/seed.json`, `seed.sql` gerado de novo, fotos fictícias ou geradas, sem pessoa real | Bruno | JP | T-04 | RNF-03, RNF-06 | A fazer |
| T-40 | Manter o back acordado: fluxo no n8n que chama `https://itau-house.vercel.app/api/health` a cada 8 min, num n8n ligado 24 h (não num notebook que dorme). Como montar em [docs/devin.md](docs/devin.md#manter-o-render-acordado) | Histórico do n8n com uma execução a cada 8 min. Depois de 1 h sem ninguém usar, `/api/health` responde em menos de 2 s | Vicente | Alexandre | T-38 | entrega 1, RNF-04 | A fazer |

## Fase 3: apresentação e envio (amanhã, até a submissão)

| ID | Task | Pronto quando | Dono | Valida | Depende | Req | Status |
|---|---|---|---|---|---|---|---|
| T-28 | Modelo de métricas: indicadores, como medir, medido ou estimado | Tabela pronta para o slide, a partir da PRD seção 11 | JP | Bruno | — | A-07 | A fazer |
| T-29 | Ficha do produto (PR/FAQ): press release + 5 perguntas, até 2 páginas, com o aviso obrigatório | PDF sem capa, dentro do limite | JP | Bruno | T-22, T-27 | entrega 4 | A fazer |
| T-30 | Vídeo de 2 min: roteiro a partir do T-02, gravação, narração, edição, YouTube público | Link abre sem login. Mostra revisão humana e o que é simulado. Termina com uma limitação. Não repete o pitch | Bruno | JP | T-24 | entrega 3 | A fazer |
| T-31 | Slides (até 10): 6 blocos + mapa ponta a ponta + organograma do squad com agentes (usar `docs/fluxos.html`) | PDF ou Canva liberado, mesmo exemplo do vídeo e da ficha | JP | Bruno, Vicente | T-27, T-28 | entrega 2 | A fazer |
| T-32 | Pitch de 3 min: roteiro nos 4 blocos de tempo, quem fala, ensaio com cronômetro | Dois ensaios dentro de 3 min | JP | Todos | T-31 | banca | A fazer |
| T-33 | Perguntas prováveis (R-01 a R-08) com respostas curtas e quem responde cada tema | Documento curto, cada um sabe o seu tema | JP | Todos | T-26 | banca | A fazer |
| T-34 | Declaração de uso de IA (Claude Code, Devin, Claude Design, para quê) e do que é pré-existente (harness do Vicente). Base para o Devin: o registro das sessões em [docs/devin.md](docs/devin.md#registro-das-sessões) | Texto pronto para slide e ficha | Vicente | JP | — | regulamento 3.7, 7.1.1 | A fazer |
| T-35 | Submissão: repo limpo (D-09), links testados sem login, arquivos enviados, confirmação de recebimento | Confirmação da organização guardada | Vicente (repo), JP (envio) | Bruno | todas | checklist 01 | A fazer |
| T-36 | Nome final do produto: JP propõe, o time decide | Registrado em `memoria/05` (A-08) | JP | Todos | — | A-08 | A fazer |
