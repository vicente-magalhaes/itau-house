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
- `src/app.css` só tem classes de layout (`container`, `stack-N`, `row-N`, `cols-feed`…), escritas apenas com tokens.
- O logo é servido de `public/assets/logo/`, usado pelo componente `Logo` com `basePath="/"`.

Regras que valem para qualquer tela nova: só token para cor, fonte, raio, sombra e espaçamento; nunca vermelho, roxo ou gradiente; erro em `var(--status-error)` (azul-marinho) com ícone; um botão primário por tela; texto em pt-BR falando com "você".

## Telas

| Rota | Tela | O que mostra no fluxo do case |
|---|---|---|
| `#/entrar` | Entrada | SSO **simulado**. O seletor de perfil (Dev / Coordenação) troca o que a interface mostra. |
| `#/` | Catálogo | O que já existe no banco: busca, filtros, ordenação explicada. |
| `#/ativo/:id` | Detalhe do ativo | README, o que o ativo acessa (permissões), histórico de governança, reusos, comentários. |
| `#/publicar` | Publicar | **Ato 1**: hook detecta → validador reprova com motivo → correção → aprovado → post editável → fila. |
| `#/aprovacoes` | Fila da coordenação | Revisão humana: gates por grau de risco, aprovar, pedir ajuste ou recusar com motivo registrado. |
| `#/sugestao` | No seu fluxo | **Ato 2**: o aviso proativo chega enquanto o dev trabalha; ele vê o porquê e decide. |

A rota `#/aprovacoes` só aparece no perfil Coordenação.

## O que é real e o que é simulado

Tudo o que está simulado aparece marcado em tela com o selo **Simulado** (componente `SeloSimulado`), como o regulamento exige.

| Item | Estado |
|---|---|
| Navegação, filtros, busca, estados das telas | Real, roda no navegador |
| Catálogo de ativos, pessoas, squads, números de reuso | **Fictício** (`src/data/catalogo.js`) |
| Veredito do agente validador | **Simulado**: roteiro fixo em `src/data/governanca.js`, não roda modelo |
| Detecção por hook na ferramenta de código | **Simulado** em tela |
| Login por SSO | **Simulado**: seletor de perfil |
| Comentários, feedback privado, comando de instalação | **Simulados** |
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
   ├─ sessao.jsx           perfil, login simulado, ativos instalados
   ├─ ds.js                ponte para os componentes do design system
   ├─ app.css              utilitários de layout, só com tokens
   ├─ components/          AppShell (header, nav, rodapé) e peças comuns
   ├─ data/                catálogo e roteiro de governança, fictícios
   └─ pages/               uma tela por arquivo
```

## Pendências que o time precisa decidir

O esboço tomou algumas decisões de desenho para poder existir. Nenhuma delas está fechada no repositório:

- **Quais telas entram no MVP.** O esboço cobre os dois atos (publicar e reaproveitar). O Guia pede um fluxo prioritário funcionando; o resto pode ficar simulado (liga A-01).
- **Ordenação do catálogo.** Aqui é explicada como reusos, aderência à squad e atualização recente. A ideia de usar um algoritmo de engajamento não foi adotada.
- **Grau de risco definindo os gates.** Grau baixo passa por validador e coordenação; grau alto também por risco e segurança (liga A-03 e A-04).
- **Curtidas, ranking e visão do gestor** ficaram de fora. Estão em aberto em A-15 e trazem risco de leitura como vigilância.
- **TypeScript** ficou de fora por enquanto (liga A-09).
