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
| Estado | `useState` e um contexto de sessão | Os dados ainda não vêm da API. |
| Dados | arquivos em `src/data/` | Fictícios, até as rotas do T-06 e do T-07 existirem. |

## Design system

O front **não** tem cores, fontes ou espaçamentos próprios. Tudo vem do `design-system/` do repositório:

- `src/main.tsx` importa `../../design-system/styles.css` (tokens, fontes Mulish, base).
- `src/ds.js` é a ponte única para os componentes. Importe sempre de lá.
- `src/app.css` só tem classes de layout (`stack-N`, `row-N`, `topo`, `lateral`, `post`, `pill`…), escritas apenas com tokens.
- O logo é servido de `public/assets/logo/`, usado pelo componente `Logo` com `basePath="/"`.

Regras que valem para qualquer tela nova: só token para cor, fonte, raio, sombra e espaçamento; nunca vermelho, roxo ou gradiente; erro em `var(--status-error)` (azul-marinho) com ícone; um botão primário por tela; texto em pt-BR falando com "você".

## Telas

Layout no estilo do Reddit: topo com busca, lateral com navegação e filtros, feed de posts no centro.

| Rota | Tela | O que mostra no fluxo do case |
|---|---|---|
| `#/entrar` | Entrada | SSO **simulado** (RF-23). O perfil (Dev / Coordenação) troca o que a interface mostra (RF-24). |
| `#/` | Início | Feed por popularidade (RF-25): "Em alta" soma curtidas e instalações; também "Mais curtidos" e "Novos". Botão "Gostei" em cada post (RF-28). |
| `#/t/:tipo`, `#/f/:frente` | Feed filtrado | O mesmo feed, filtrado por tipo ou por frente pela lateral (RF-26). |
| `#/ativo/:id` | Post | README, o que o ativo acessa, instalar, adaptar, compartilhar, comentários (RF-27, RF-29). |
| `#/publicar` | Publicar | Hook detecta → validador reprova com motivo → correção → aprovado → post com prévia do feed → fila. |
| `#/sugestao` | No seu editor | O aviso chega enquanto o dev trabalha; ele vê o porquê e decide. |
| `#/coord/fila` | Fila de aprovação | Só Coordenação (RF-32): gates por grau de risco, aprovar, devolver ou recusar com motivo. |
| `#/coord/dados` | Dados | Só Coordenação: curtidas, instalações, derivações, instalações por frente, tabela por ativo e histórico de cada um (RF-30, RF-22). |

O alcance vale no feed (RF-05): ativo de squad só aparece para a própria squad; ativo de frente, só para a mesma frente.
Curtidas ficam no `localStorage`, uma por perfil por ativo.

## O que é real e o que é simulado

Tudo o que está simulado aparece marcado em tela com o selo **Simulado** (componente `SeloSimulado`), como o regulamento exige.

| Item | Estado |
|---|---|
| Navegação, filtros, busca, estados das telas | Real, roda no navegador |
| Catálogo de ativos, pessoas, squads, números de reuso | **Fictício** (`src/data/catalogo.js`) |
| Veredito do agente validador | **Simulado**: roteiro fixo em `src/data/governanca.js`, não roda modelo |
| Detecção por hook na ferramenta de código | **Simulado** em tela |
| Login por SSO | **Simulado**: seletor de perfil |
| Comentários, comando de instalação | **Simulados** |
| Dados vindos da API e do banco, integração com Copilot ou Claude Code | Ainda não ligados: as telas usam `src/data/` |

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
   ├─ sessao.jsx           perfil, login simulado, curtidas, instalados, busca
   ├─ ds.js                ponte para os componentes do design system
   ├─ app.css              utilitários de layout, só com tokens
   ├─ components/          AppShell (topo e lateral), Post (card do feed e Gostei), peças comuns
   ├─ data/                catálogo e roteiro de governança, fictícios
   └─ pages/               uma tela por arquivo
```

## Pendências que o time precisa decidir

Local, layout e área de dados estão em D-28. Continuam em aberto:

- **Telas além do mínimo do D-12.** O D-12 pede página do post e fila de aprovação. Feed, publicar e "No seu editor" existem como apoio da demo; confirmar quais entram no vídeo.
- **Grau de risco definindo os gates.** Grau baixo passa por validador e coordenação; grau alto também por risco e segurança (liga A-03 e A-04).
- **Trilha e contadores fora do post.** A PRD pede a trilha (RF-22) e os contadores (RF-30) na página do post; o D-28 levou os dois para `#/coord/dados`. Confirmar com o time.
