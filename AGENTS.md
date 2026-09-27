# AGENTS.md: Itaú House

Instruções para agentes de IA que trabalham neste repositório e não leem o `CLAUDE.md` sozinhos, como o Devin e o Copilot.
A fonte das regras é o [CLAUDE.md](CLAUDE.md). Este arquivo resume o que todo agente precisa seguir. Se os dois divergirem, vale o CLAUDE.md.

## Antes de qualquer tarefa

1. Leia o [CLAUDE.md](CLAUDE.md) e as [regras de segurança](.claude/rules/security.md).
2. Requisitos em [PRD.md](PRD.md). Contrato da API em [docs/api.md](docs/api.md). Onde a PRD (seção 10) e o contrato divergem, vale o contrato: o JSON dele é o que front, MCP e plugin esperam.
3. Decisões em [memoria/decisions/](memoria/decisions/README.md).

## O projeto

Itaú House: protótipo do Hackathon Itaú 2026, Case C. Fórum interno em que squads publicam e reaproveitam agentes, skills e esqueletos de código, com aprovação do coordenador do squad.
Não é produto oficial do Itaú. Todos os dados são fictícios, menos um ativo real: o `harness-hacka` (decisão 0036).

| Pasta | O que tem | Comandos |
|---|---|---|
| `backend/` | API em Python 3.12 com FastAPI, gerenciada com uv. Rotas sob `/api` | `uv sync`, `uv run pytest`, `uv run ruff check .`, `uv run ruff format .` |
| `frontend/` | React 19 + Vite + TypeScript, com JSX. Importa `../design-system` | `npm ci`, `npm run build`, `npm run lint` |
| `design-system/` | Tokens CSS e componentes React da marca | — |
| `plugin/` | Plugin do Claude Code (T-13): hooks, skill e comando `/itau-house`. Instala pelo marketplace da raiz (`.claude-plugin/marketplace.json`) | `claude plugin validate plugin` |
| `plugin/mcp/` | Servidor MCP que o plugin sobe (T-12). Fica dentro do plugin porque a instalação copia só essa pasta. Projeto uv próprio, Python 3.12 | `uv sync`, `uv run pytest` |
| `supabase/` | Migrações e seed do banco, que é o Supabase na nuvem | Agente não aplica nada no banco (ver "Banco") |
| raiz | `docker-compose.yml` (dev), `docker-compose.prod.yml` (produção, nginx em :8080) e CI em `.github/workflows/` | `docker compose up --build` |

O que vale para qualquer rota do back:
- A regra de visibilidade é uma só: `catalogo.visivel`, em `backend/app/catalogo.py` (RF-05, RNF-07). Toda leitura passa por ela. Não reescreva a regra em outro lugar, nem em SQL.
- Ativo que a pessoa não pode ver responde 404, nunca 403.
- Quem chama se identifica pelo cabeçalho `X-Usuario-Id` (login simulado, RF-23). Sem ele, 401.
- Erro no formato `{ "erro": "codigo_curto", "mensagem": "Texto em pt-BR." }`. Campos do JSON em camelCase.
- O catálogo fictício está em `backend/app/dados/seed.json`. A exceção é o ativo `a-harness-hacka`, real. Os arquivos dele saem do `supabase/empacotar_harness.py`.

## Regras que não mudam

### Git
- Trabalhe numa branch `feat/<tarefa>` ou `fix/<tarefa>` criada a partir da `main`.
- Faça push só da sua branch. Não abra Pull Request. Não faça merge nem push na `main`. Quem junta é uma pessoa do time (decisão 0008).
- Nunca force push. Nunca reescreva histórico.
- Commits em Conventional Commits, citando o requisito que atendem: `feat: feed por popularidade (RF-25)`.
- Não edite a pasta `memoria/`. Quem mexe nela é uma pessoa.

### Segredos
- Nenhuma chave, token ou senha em código, commit, log, teste ou relatório.
- Segredo fica em `.env`, que não vai para o git, ou no painel da plataforma. Só o `.env.example` é versionado, com os nomes e sem os valores.
- Não leia nem edite `.env`, chaves ou credenciais.
- Não rode `docker compose config` sem `--quiet` nem `docker compose exec <serviço> env`: os dois imprimem segredos.

### Dados e conteúdo interno
- Só dados fictícios. Nome de pessoa real não entra em seed, tela, teste ou exemplo. Exceção única: o Vicente, autor do ativo real `harness-hacka`, com consentimento (decisão 0036). Não crie outra exceção.
- O conteúdo interno do hackathon (pesquisa com pessoas do Itaú, regulamento, guia de marca oficial) não está neste repositório. Não traga de volta nem cite pessoa, conversa ou informação interna do Itaú.
- Não invente dados, resultados, números ou depoimentos.
- Nenhuma conexão com sistema real do Itaú. O que dependeria do banco fica simulado e aparece como **[SIMULADO]** na tela.

### Banco
- O Supabase é um projeto só, usado pelo time inteiro e pela demo (decisão 0022).
- Não rode `supabase db push`, `supabase db reset --linked` nem SQL contra ele. Não altere tabela pelo painel. Quem aplica migração ou seed é uma pessoa.
- Teste nunca escreve no Supabase do time. Para testar migração, seed ou acesso ao banco, use uma base descartável na sua máquina.
- Estrutura do banco só por migração em `supabase/migrations/`. Seed idempotente.
- O `supabase/seed.sql` sai do `seed.json` pelo `supabase/gerar_seed_sql.py`. Não edite o SQL à mão.

### Arquitetura
- O front chama a API por caminho relativo (`/api/...`), nunca pela URL do back. Sem CORS e sem `VITE_API_URL`. Quem repassa o `/api` é o proxy do Vite (dev), o nginx (build de produção) ou os rewrites da Vercel (site publicado).
- Toda rota nova fica sob `/api`.
- O front usa os tokens e componentes de `design-system/`. Nada de hex ou px de marca solto. Nunca vermelho, roxo ou gradiente.
- Texto de interface em pt-BR, falando com "você".
- Arquivo novo que uma imagem Docker precisa entra na lista de permissão: `backend/.dockerignore` ou `frontend/Dockerfile.dockerignore`.
- Dependência nova só se a tarefa precisar, justificada no relatório. Python com `uv add`, front com `npm install`.

### Escopo
- Faça só o que a tarefa pede, nos arquivos que o brief libera. Se achar que precisa mexer em outro lugar, pare e explique no relatório.
- Não crie funcionalidade fora da PRD.
- Item marcado "em aberto" ou "(sugestão Claude)" não é decisão. Não implemente como se fosse.
- Nada é publicado, aprovado ou vai para produção sem uma pessoa (regra do Case C).

## Trabalho sem supervisão

- Não espere resposta. Se travar, registre o bloqueio e siga com o resto da tarefa.
- Entre duas opções, escolha a mais conservadora e explique o porquê no relatório.
- Antes do push, rode os testes e o lint do que você mexeu. Se mexeu em Dockerfile, compose ou CI, rode também o build Docker.

## Relatório ao fim da tarefa

Na conversa da sessão, não em arquivo:
- O que foi feito e os arquivos alterados.
- Como verificar, passo a passo.
- O que ficou para uma pessoa fazer: painel, conta, segredo, migração.
- Bloqueios e o que ficou de fora.
- Decisões que você tomou e por quê.
