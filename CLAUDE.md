# Hackathon Itaú 2026: Case C

Equipe da Poli Júnior no Hackathon Itaú 2026 (26 e 27/09/2026, banca em 27/09).
Case C, Jornada de agentes: squad orientada por IA que entrega valor mais rápido sem perder qualidade, governança e decisão humana.
Solução: **Itaú House** (nome provisório). Fórum interno em que squads publicam e reaproveitam agentes, skills, frameworks e esqueletos de código, com governança. Persona (D-18): quem usa é qualquer membro do squad que cria com IA (na demo, um dev); quem governa é o coordenador do squad; a unidade de valor é o squad. Dor: retrabalho, porque o compartilhamento de agentes e skills é manual e ninguém sabe o que o outro já criou. Requisitos em [PRD.md](PRD.md).

## Memória do projeto

Ler antes de qualquer tarefa. `memoria/` e `docs/` são a fonte (D-24).
- `memoria/`: o que muda e envelhece. Decisões e o diário das sessões. O harness-hacka revisa.
- `docs/`: referência estável. Contrato da API, fluxos e roteiro da demo.

A tabela abaixo é gerada pelo harness-hacka a partir do frontmatter de cada nota (`summary`, `read_when`, `review_by`). Não editar à mão: nota nova ganha frontmatter e depois `harness-hacka index --update`.

<!-- harness-hacka:index -->
| Arquivo | Conteúdo | Ler quando |
|---|---|---|
| [memoria/04-solucao-itau-house.md](memoria/04-solucao-itau-house.md) | Tese atual, persona, mecanismos, governança, expansão, teses descartadas | Tudo sobre o produto |
| [memoria/05-pendencias-e-riscos.md](memoria/05-pendencias-e-riscos.md) | Em aberto, riscos e perguntas da banca, sugestões para o time avaliar | Antes de tratar algo como decidido; ao preparar respostas à banca |
| [memoria/09-brainstorm-time.md](memoria/09-brainstorm-time.md) | Ideias do time ainda não decididas: persona afiada, mecanismos novos, tensões | Desenho da solução, slides |
<!-- /harness-hacka:index -->

## Documentos de referência

Tabela mantida à mão. Documento novo em `docs/` entra aqui.

| Arquivo | Conteúdo | Ler quando |
|---|---|---|
| [plugin/README.md](plugin/README.md) | Plugin do Claude Code: hooks, skill, comando, MCP, como instalar e como rodar na demo | Plugin, MCP, instalação, ensaio |
| [docs/api.md](docs/api.md) | Contrato da API: rotas sob /api, JSON de entrada e saída, ferramentas do MCP | Back, front, MCP, plugin |
| [docs/roteiro-demo.md](docs/roteiro-demo.md) | Roteiro da demo: narração, o que o dev digita, o que o plugin responde | Ensaio, vídeo, contrato da API |
| [docs/fluxos.html](docs/fluxos.html) | Fonte de verdade dos fluxos (ciclo, descoberta, publicação, plataforma). Abrir no navegador; para mudar, editar `FLOWS` no arquivo | Desenho de fluxo, front-end |

## Design system

`design-system/` é o design system do protótipo (tokens CSS, componentes React, regras de voz), gerado a partir do guia de marca oficial.
Ponto de entrada: [design-system/readme.md](design-system/readme.md). Skill: `itau-design`.
- Front-end importa `design-system/styles.css` e usa os componentes de `design-system/components/` antes de criar novos.
- Cor, fonte, raio, sombra e espaçamento só por token CSS. Nada de hex ou px de marca solto no código.
- Nunca vermelho, roxo ou gradiente. Erro usa `--status-error` (azul-marinho) com ícone.
- Texto de interface em pt-BR, falando com "você", CTA sem urgência.

## Ambiente (Docker)

Comandos completos no [README](README.md#como-rodar).
- `docker compose up --build` sobe back (:8000) e front (:5173) com hot reload.
- `docker-compose.prod.yml` é o build de produção (nginx em :8080), indicado para a demo.
- Dependência nova: `uv add` ou `npm install` na máquina, depois `docker compose up --build`. No front, com `-V`.
- Toda rota da API fica sob `/api`. O front chama caminhos relativos (`/api/...`), nunca a URL do back.
- Banco: Supabase na nuvem, um projeto só para dev e demo (D-22). Não roda no Docker.
- Estrutura do banco só por migração em `supabase/migrations/` (`supabase migration new`). Nunca alterar tabela pelo painel. Dados fictícios em `supabase/seed.sql`, idempotente.
- `supabase db push` mexe no banco que o time inteiro e a demo usam. Só com aprovação de uma pessoa.
- Arquivo novo que a imagem precisa entra na lista de permissão: `backend/.dockerignore` ou `frontend/Dockerfile.dockerignore`.

## Regras para os agentes

- Não inventar dados, resultados, depoimentos, aprovações ou números. O regulamento e a banca punem isso.
- Separar sempre fato, hipótese e simulação. Evidência vem com fonte e limite.
- Não tratar item "em aberto" ou "(sugestão Claude)" como decisão. Perguntar ao time.
- Não retomar teses descartadas sem decisão do time.
- Só dados fictícios. Nada de dado real, segredo, chave ou material interno do Itaú em código, tela ou vídeo.
- Não conectar a sistemas reais do banco. Integração simulada é marcada como simulada.
- Uma persona, uma tarefa, um fluxo funcionando. Resistir a adicionar funcionalidades.
- Código segue a PRD (`PRD.md`, quando existir). Cada mudança cita o requisito (RF/RN/RNF) que atende.
- Git: trabalhar numa branch `feat/` ou `fix/` criada a partir da `main`. Antes de juntar, trazer a `main` para a branch e conferir que o fluxo principal roda. Juntar com merge direto na `main`. Sem `dev` e sem Pull Request. Nunca commitar direto na `main`.
- Ao fechar uma decisão, registrar com `/harness-hacka:decide` (0029). Ela vira um arquivo em `memoria/decisions/`, como `proposed`, e só uma pessoa aceita, com `accept NNNN`. Nos textos antigos, D-12 é a decisão 0012.
- O conteúdo interno do hackathon (pesquisa com pessoas do Itaú, regulamento, guia de marca oficial, notas de estratégia) saiu da `main` antes de o repositório ficar público (0009). Não trazer de volta nem citar pessoa ou conversa do Itaú. `design-system/` fica, porque o front-end depende dele.
- Escrever em português do Brasil, frases curtas.
- `AGENTS.md` resume estas regras para agentes que não leem este arquivo, como o Devin. Mudou uma regra aqui, atualize lá.

## Configuração do Claude Code

`.claude/settings.json` define o que os agentes podem rodar sem pedir (git, uv, npm, docker compose), o que é proibido (ler segredos, force push, `git reset --hard`) e os hooks:
- `block_secrets.py` bloqueia leitura e edição de `.env`, chaves e credenciais.
- `format_code.py` formata o arquivo editado (ruff, prettier, eslint) quando o projeto tiver essas ferramentas.

Plugin `harness-hacka` (D-20), habilitado para o time no mesmo arquivo. Config em `.claude/harness-hacka.json`.
- No início de cada sessão, injeta o resumo da memória: pendências, notas vencidas, o que não repetir.
- Ao fechar a sessão: `/harness-hacka:journal`. Quando o resumo avisar: `/harness-hacka:housekeeping`.
- Bloqueia gravar chave na memória e apagar arquivo de `memoria/` (arquivar com `harness-hacka archive`).

Regras de segurança, sempre ativas:

@.claude/rules/security.md
