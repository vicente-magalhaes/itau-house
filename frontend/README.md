# Front do Itaú House

Front da demo, feito sobre o `design-system/` do repositório (D-28).

> Protótipo do Hackathon Itaú 2026 (Case C, Jornada de agentes), equipe da Poli Júnior. Não é um produto oficial do Itaú. Todos os dados são fictícios e nenhuma tela se conecta a sistema do banco.

## Como rodar

Com Docker, pela raiz do repo (sobe back e front juntos, ver o [README](../README.md#como-rodar)):

```bash
docker compose up --build        # front em http://localhost:5173
```

Sem Docker:

```bash
cd frontend
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc -b + vite build, gera dist/
npm run lint     # oxlint
```

## Stack

| Camada | Escolha | Por quê |
|---|---|---|
| Build | Vite 8 | `vite.config.ts` libera o `design-system/` fora da pasta e repassa `/api` ao back-end. |
| UI | React 19 | Telas em JSX, como os componentes de `design-system/components/`. |
| Tipos | TypeScript com `allowJs` | O `tsc -b` aceita as telas `.jsx` sem checá-las. Código novo pode ser `.tsx`; o design system tem `.d.ts` para cada componente. |
| Rotas | roteador por hash, em `src/router.jsx` | Sem dependência nova. Funciona em qualquer hospedagem estática e no nginx do build de produção. |
| Estado | `useState` e um contexto de sessão | A sessão guarda perfil, curtidas, filtros e o recado da tela. |
| Dados | `src/api.js`, com `src/data/` de reserva | A tela pede à API (`docs/api.md`). Se a rota ainda não existe (a lista vem do `/api/openapi.json`) ou o back não responde, usa os fictícios de `src/data/`. Rota nova só aparece depois de recarregar a página. `src/data/daApi.js` converte o JSON do contrato no formato das telas. |

## Design system

O front **não** tem cores, fontes ou espaçamentos próprios. Tudo vem do `design-system/` do repositório:

- `src/main.tsx` importa `../../design-system/styles.css` (tokens, fontes Mulish, base).
- `src/ds.js` é a ponte única para os componentes. Importe sempre de lá.
- `src/app.css` tem as cores do redesign (`--ih-*`, apontando para tokens do DS) e as classes de layout (`stack-N`, `row-N`, `topo`, `card-ativo`, `painel`, `btn`…), escritas apenas com tokens. Só tema claro: a marca pede fundo branco dominante.
- O logo é servido de `public/assets/logo/`, usado pelo componente `Logo` com `basePath="/"`.

Regras que valem para qualquer tela nova: só token para cor, fonte, raio, sombra e espaçamento; nunca vermelho, roxo ou gradiente; erro em `var(--status-error)` (azul-marinho) com ícone; um botão primário por tela; texto em pt-BR falando com "você".

Botões têm 36px. O primário é o `Button` do DS (`variant="primary" size="sm"`), **um por tela**: é a ação principal da página e o único laranja além do logo. O "Publicar" do topo é secundário por isso. O secundário é o `BotaoSec` de `components/comuns.jsx`, com borda fina.

Onde o laranja aparece: logo, botão primário, ícone do tipo do ativo (sobre branco, porque sobre cinza fica abaixo de 3:1), uma palavra do título do início e estados (curtido, "também quero", hover). Ícones de apoio, passos e barras ficam em preto ou cinza. Cards são brancos com borda fina, sem capa colorida.

## Telas

Redesign feito no Claude Design (`Itau House.dc.html`): topo com navegação, sem lateral. O catálogo atende PM, design, engenharia, dados e negócio, não só dev, mas só com os tipos que o hook reconhece (RF-03): skill, prompt, agente, MCP, framework, componente e esqueleto de código.

| Rota | Tela | O que mostra no fluxo do case |
|---|---|---|
| `#/entrar` | Entrada | SSO **simulado** (RF-23). O perfil (Membro do squad / Coordenação) troca o que a interface mostra (RF-24). |
| `#/` | Início | Busca em linguagem natural, filtros por estante, papel de quem publicou, frente e ordem (RF-26): Em alta, Mais curtidos, Mais reaproveitados, Mais adaptados e Novos. Cards por popularidade (RF-25) com curtir (RF-28). Lateral com pedidos abertos e os ativos mais reaproveitados, com a foto de quem criou. |
| `#/ativo/:id` | Ativo | Capa, usar, adaptar, curtir. **O que ele acessa**, como as permissões de um aplicativo, e a confirmação "Entendi o que este ativo acessa" antes de usar (RF-29). "Usar em" com os passos de cada ferramenta, o que tem dentro, árvore de adaptações, reaproveitamento por papel (RF-30) e governança (RF-22) (RF-27). Com a API: README, arquivos, manual de instalação, "Adaptado de" com link ao original (RF-09), squads que reaproveitaram no lugar do reuso por papel e a trilha do histórico. Relê ao voltar para a janela. |
| `#/pedidos` | Pedidos | O que alguém procurou e não achou. "Também quero" e "Eu crio". |
| `#/perfil`, `#/perfil/:id` | Perfil | O que a pessoa publicou, reaproveitamentos, papéis alcançados, adaptações e quem adaptou. "Sair" fica no próprio perfil. |
| `#/publicar` | Publicar | Hook detecta → validador barra com o que, onde e como corrigir → correção → passa → post com prévia do card → fila. |
| `#/coord/fila` | Fila de aprovação | Só Coordenação (RF-32): resultado das checagens, aprovar (RF-19), devolver ou recusar com motivo (RF-21). Quem julga é o coordenador (D-26). Com a API: o que o validador barrou em cada rodada, o alcance pedido e o link para o post; só aprovar e devolver, sem desfazer, como no contrato. O contador do topo lê a mesma fila. |
| `#/coord/dados` | Dados | Só Coordenação: curtidas, reaproveitamentos, adaptações, por frente, tabela por ativo e trilha de cada um (RF-30, RF-22). |

O alcance vale no início, no perfil e na página do ativo (RF-05): ativo de squad só aparece para a própria squad; ativo de frente, só para a mesma frente. Na demo, todo ativo tem alcance "Banco inteiro".
Com a API, curtir (RF-28) e usar (RF-29) gravam no back, e a resposta dele vale por cima do feed e do post. Nos dados fictícios, as curtidas ficam no `localStorage`, uma por perfil por ativo.

## O que é real e o que é simulado

Tudo o que está simulado aparece marcado em tela com o selo **Simulado** (componente `SeloSimulado`), como o regulamento exige.

| Item | Estado |
|---|---|
| Navegação, filtros, busca, estados das telas | Real, roda no navegador |
| Catálogo de ativos, pessoas, squads, pedidos, números de reuso | **Fictício** (`src/data/catalogo.js`) |
| Fotos das pessoas | Retratos gerados por IA (não são pessoas reais), em `public/assets/pessoas/`. Se a imagem falhar, a `Foto` mostra as iniciais |
| O que cada ativo acessa | **Fictício**, declarado no catálogo. O uso que ele confirma é simulado |
| Usar, adaptar, "Usar em", fazer pedido, "Eu crio" | **Simulados** nos dados fictícios: só mudam contadores e mostram um recado. Com a API, usar mostra o passo a passo de quem publicou e registra a instalação; nada é copiado sozinho. Adaptar é pelo plugin, no editor |
| Editar e reenviar o post | Com a API, o autor edita nome, resumo, README, manual e alcance de um post em rascunho, barrado ou devolvido, e envia de novo (RF-21, RF-31). Os arquivos se corrigem no editor, pelo plugin |
| Resultado do validador | **Simulado**: roteiro fixo em `src/data/governanca.js`. O validador real faz só checagens fixas por código, sem IA (RF-14, D-26) |
| Detecção por hook na ferramenta de código | **Simulado** em tela |
| Login por SSO | **Simulado**: seletor de perfil |
| Dados vindos da API e do banco | O início (T-17), a página do ativo (T-18) e a fila de aprovação (T-19) pedem à API. As outras telas usam `src/data/` |
| Integração com Copilot ou Claude Code | Ainda não ligada |

## Estrutura

```
frontend/
├─ index.html
├─ vite.config.ts          design-system fora da pasta, proxy /api, dedupe do react
├─ Dockerfile, nginx.conf.template   imagem de dev e de produção
├─ public/assets/logo/     logos usados pelo componente Logo
└─ src/
   ├─ main.tsx             importa o design system e monta o app
   ├─ App.jsx              rotas
   ├─ router.jsx           roteador por hash e o componente Link
   ├─ sessao.jsx           perfil, login simulado, curtidas, usados, pedidos, busca e filtros
   ├─ ds.js                ponte para os componentes do design system
   ├─ api.js               rotas da plataforma (docs/api.md) e o useDaApi, que cai em src/data/ sem a rota
   ├─ fila.js              useFila: a fila do Cord+, lida pela tela de aprovações e pelo contador do topo
   ├─ app.css              utilitários de layout, só com tokens
   ├─ components/          AppShell (topo), Post (card de ativo e Gostei), Filtro (lista no padrão dos botões), peças comuns (Foto, BotaoSec, Recado)
   ├─ data/                catálogo, pedidos e roteiro de governança, fictícios; daApi.js converte o JSON da API
   └─ pages/               uma tela por arquivo
```

## Pendências que o time precisa decidir

Local, layout e área de dados estão em D-28. Continuam em aberto:

- **Telas além do mínimo do D-12.** O D-12 pede página do post e fila de aprovação. Início, pedidos, perfil e publicar existem como apoio da demo; confirmar quais entram no vídeo. A tela "No seu editor" saiu no redesign: o "Usar em" da página do ativo ocupa o lugar dela.
- **Trilha e contadores no post.** O redesign trouxe de volta à página do ativo a governança (RF-22) e o reaproveitamento por papel (RF-30). `#/coord/dados` continua com a visão completa. Confirmar com o time se fica assim.
- **Elenco da demo.** O roteiro (`docs/roteiro-demo.md`) usa Rafael Nunes, Marina Alves e Juliana Prado em outros papéis e squads. O catálogo do redesign tem Ana Ribeiro (PM, autora da skill de critérios) e Rafael Costa (coordenação). Alinhar antes de gravar.
