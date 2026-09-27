# Front do Itaú House (esboço)

Esboço navegável do front, feito sobre o `design-system/` do repositório. Serve para a demo da banca e para o time discutir o fluxo em tela, não é o produto final.

> Protótipo do Hackathon Itaú 2026 (Case C, Jornada de agentes), equipe da Poli Júnior. Não é um produto oficial do Itaú. Todos os dados são fictícios e nenhuma tela se conecta a sistema do banco.

## Como rodar

```bash
cd web
npm install
npm run dev     # abre em http://localhost:5173
```

Para gerar a versão estática (útil para o link da banca):

```bash
npm run build
npm run preview
```

## Stack

Decisão de stack ainda em aberto (A-09 em `memoria/05-decisoes-e-pendencias.md`). Este esboço usa o mínimo para rodar rápido e sem surpresa na hora da demo:

| Camada | Escolha | Por quê |
|---|---|---|
| Build | Vite 5 | Sobe em segundos e gera estático. |
| UI | React 18, JSX puro | Os componentes de `design-system/components/` são `.jsx`. Sem TypeScript por enquanto. |
| Rotas | roteador por hash, em `src/router.jsx` (~40 linhas) | Evita uma dependência nova num esboço. Funciona em qualquer hospedagem estática. |
| Estado | `useState` e um contexto de sessão | Não há back-end. |
| Dados | arquivos em `src/data/` | Fictícios, versionados junto com a tela. |

Nenhuma dependência além de `react`, `react-dom`, `vite` e `@vitejs/plugin-react`.

## Design system

O front **não** tem cores, fontes ou espaçamentos próprios. Tudo vem do `design-system/` do repositório:

- `src/main.jsx` importa `../../design-system/styles.css` (tokens, fontes Mulish, base).
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
| Back-end, banco, integração com Copilot ou Claude Code | Não existem neste esboço |

## Estrutura

```
web/
├─ index.html
├─ vite.config.js          fs.allow: ['..'] para importar o design-system de fora
├─ public/assets/logo/     logos usados pelo componente Logo
└─ src/
   ├─ main.jsx             importa o design system e monta o app
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

O esboço tomou algumas decisões de desenho para poder existir. Nenhuma delas está fechada no repositório:

- **Quais telas entram no MVP.** O esboço cobre os dois atos (publicar e reaproveitar). O Guia pede um fluxo prioritário funcionando; o resto pode ficar simulado (liga A-01).
- **Grau de risco definindo os gates.** Grau baixo passa por validador e coordenação; grau alto também por risco e segurança (liga A-03 e A-04).
- **Números só na área da coordenação.** O feed e o post mostram só curtidas e instalações; o resto (derivações, squads que usaram, histórico) foi para `#/coord/dados`. A PRD pede a trilha (RF-22) e os contadores (RF-30) na página do post: confirmar com o time.
- **TypeScript** ficou de fora por enquanto (liga A-09).
