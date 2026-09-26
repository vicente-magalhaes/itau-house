# Itaú House

Um espaço interno para as squads do Itaú encontrarem e reaproveitarem o que outras squads já construíram: agentes, skills, frameworks, harness, plugins e pedaços de códigos.

> Protótipo desenvolvido no Hackathon Itaú 2026 (Case C, Jornada de agentes). Não é um produto oficial do Itaú. Todos os dados usados aqui são fictícios.

## O problema

As squads do Itaú já usam muita IA no dia a dia. Cada time cria os próprios agentes, skills e atalhos de código, e tudo isso fica espalhado. Quem atua em várias squads ao mesmo tempo não consegue saber o que cada pessoa está usando. E quem precisa de algo parecido com o que outro time já fez acaba construindo de novo, porque não sabe que aquilo existe.

O dev é quem sente isso de forma mais direta. Ele está desenvolvendo, ou revisando um código que escreveu com a ajuda de um agente, sem saber que outra squad já resolveu o mesmo problema. O resultado é retrabalho.

Chegamos a essa dor conversando com pessoas do Itaú durante o evento: três pessoas de Finanças que trabalham com várias squads e uma product analyst que acompanha a jornada de produto dentro de uma squad.

## A proposta

O Itaú House é um lugar onde as squads publicam o que construíram e encontram o que já existe. Pode entrar ali um agente, uma skill, um framework, um componente do design system ou um esqueleto de código, como um botão que já vem com a rota por trás.

A ideia central é não depender do dev ir procurar. Enquanto ele trabalha, um agente avisa que já existe algo parecido em outra squad e explica por que acha isso. Quem decide se reaproveita ou não é sempre o dev.

## Como funciona

1. Uma squad publica um ativo no Itaú House.
2. Um agente confere se o ativo cumpre os requisitos para entrar, e uma pessoa aprova.
3. O ativo fica visível só para quem pode acessá-lo.
4. Quando um dev começa algo novo, o agente procura no catálogo e avisa se já existe algo parecido.
5. O dev decide o que fazer, e a decisão fica registrada.

Esse é o fluxo completo que imaginamos. O protótipo do hackathon demonstra uma parte dele, e o que estiver simulado vai aparecer indicado na tela.

## Governança

Num banco, compartilhar código e agentes entre times só funciona se houver regra clara. Por isso o desenho parte de alguns princípios:

- Nada entra no catálogo sem passar por verificação e aprovação humana.
- Nem tudo é visível para todos. Quem publica define quem pode ver.
- O agente sugere, a pessoa decide. Nenhuma ação irreversível acontece sozinha.
- Fica registrado quem publicou, quem aprovou e quem reaproveitou cada ativo.
- O protótipo não se conecta a nenhum sistema real do banco.

## Por onde começamos

Começamos pequeno de propósito. Escolhemos uma persona, o dev, porque é onde o retrabalho aparece mais e onde um MVP traz mais aprendizado com menos esforço. Começar com um grupo e um tipo de ativo também facilita cuidar de governança e compliance antes de abrir para mais gente.

Se a hipótese se confirmar, os próximos passos são:

1. Trazer as outras pessoas da squad: produto, design e risco.
2. Dar a Finanças uma visão de quais agentes estão em uso entre as squads.
3. Incluir conhecimento que hoje vive em apresentações e atas, como os repositórios que alguns times já montam por conta própria.

## Arquitetura

Stack prevista, que ainda pode mudar:

| Camada | Tecnologia |
|---|---|
| Back-end | Python + FastAPI |
| Front-end | TypeScript + React + Vite (possível adicionar algo conforme necessidade) |
| Banco | Supabase (PostgreSQL) na nuvem |
| IA | LLM via API, com busca por similaridade entre ativos |
| Ambiente | Docker + Docker Compose |

**Como o ambiente é montado**

- Um comando sobe back-end e front-end, igual na máquina de todo mundo.
- Dois modos: desenvolvimento, com hot reload, e produção, com o front compilado e servido por nginx. O de produção é o indicado para a demo.
- Imagens em estágios (multi-stage). A de produção leva só o necessário e roda sem root.
- Healthcheck nos dois serviços. O front só sobe depois que a API responde.
- Front e API no mesmo endereço, com a API sob `/api`. O proxy do Vite (dev) e o nginx (produção) repassam as chamadas. Sem CORS e sem URL do back-end no build.
- Cada imagem só recebe os arquivos de uma lista de permissão. `.env`, chaves e documentos internos ficam fora.
- O CI (GitHub Actions) constrói as imagens e sobe os dois modos a cada push.
- O banco é o Supabase na nuvem e fica fora do Docker. É um projeto só, com dados fictícios, para desenvolvimento e demo. A estrutura vive em migrações versionadas, então o banco pode ser recriado do zero.

## Estrutura do repositório

```
itau-house/
├─ backend/                 API em Python (FastAPI), com Dockerfile próprio
├─ frontend/                interface em React (Vite), com Dockerfile e config do nginx
├─ design-system/           tokens, componentes React e regras de voz da marca
├─ supabase/                banco: migrações e dados fictícios (seed)
├─ docker-compose.yml       ambiente de desenvolvimento
├─ docker-compose.prod.yml  build de produção
├─ .github/workflows/       CI: build das imagens e smoke test
├─ .claude/                 configuração do Claude Code: permissões, hooks e regras de segurança
├─ CLAUDE.md                contexto e regras para os agentes de IA que desenvolvem o projeto
├─ memoria/                 memória do projeto: regras do hackathon, evidências, decisões, formato da PRD
└─ itau-design-system/      guia de marca e logos do Itaú
```

A `PRD.md` entra conforme o desenvolvimento avança.

## Como rodar

**Pré-requisito:** Docker Desktop instalado e aberto. No Windows, instale o WSL 2 antes do Docker Desktop (`wsl --install`).

```bash
docker compose up --build
```

| O quê | Endereço |
|---|---|
| Front-end | http://localhost:5173 |
| API | http://localhost:8000 |
| Documentação da API | http://localhost:8000/api/docs |

O código fica montado dentro dos containers. Ao salvar um arquivo, o back-end e o front-end recarregam sozinhos.

**Build de produção.** Mesmo código, com o front compilado e servido por nginx, sem hot reload:

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

Abre em http://localhost:8080. Só o front fica exposto. O nginx repassa `/api` para o back-end, que não tem porta aberta.

**Comandos do dia a dia**

```bash
docker compose logs -f backend              # acompanhar os logs
docker compose exec backend pytest          # testes do back-end
docker compose exec backend ruff check .    # lint do back-end
docker compose exec frontend npm run lint   # lint do front-end
docker compose up --build backend           # depois de adicionar dependência Python (uv add)
docker compose up --build -V frontend       # depois de adicionar dependência do front (npm install)
docker compose down                         # parar tudo
```

No front, o `-V` descarta o `node_modules` antigo que o container guarda. Sem ele, a dependência nova não aparece.

**`/api` devolvendo a página do front.** Acontece ao trocar para uma branch sem `frontend/` com o Docker ligado: o Vite reinicia sem a configuração e perde o proxy. Resolva com `docker compose restart frontend`.

**Portas ocupadas.** Se outro projeto já usa 8000, 5173 ou 8080, troque a porta na subida, por exemplo `BACKEND_PORT=8001 FRONTEND_PORT=5174 docker compose up`. A lista está em `.env.example`.

**Variáveis de ambiente.** `backend/` e `frontend/` têm um `.env.example` com o que cada um aceita. Para usar, copie para `.env` na mesma pasta e preencha. O `.env` nunca vai para o git. O back-end precisa da URL e da chave secreta do projeto no Supabase. Peça para quem administra o projeto, por um canal privado.

**Sem Docker.** Também funciona direto na máquina, com Python 3.12, [uv](https://docs.astral.sh/uv/) e Node 24:

```bash
cd backend && uv sync && uv run uvicorn app.main:app --reload    # API em :8000
cd frontend && npm install && npm run dev                          # front em :5173
```

### Banco (Supabase)

O banco é um projeto do Supabase na nuvem, compartilhado pelo time e pela versão publicada. Todos os dados são fictícios.

Ninguém altera tabela direto pelo painel. Toda mudança de estrutura é um arquivo em `supabase/migrations/`, e os dados de demonstração ficam em `supabase/seed.sql`. Assim o banco pode ser recriado do zero a qualquer momento.

Os comandos usam a [CLI do Supabase](https://supabase.com/docs/guides/local-development/cli/getting-started). Sem instalar, dá para usar com `npx supabase`.

```bash
supabase login                                  # uma vez por máquina
supabase link --project-ref <ref-do-projeto>    # uma vez; o ref está na URL do painel
supabase migration new <nome>                   # cria o arquivo da migração
supabase db push --dry-run                      # mostra o que vai ser aplicado
supabase db push                                # aplica na nuvem
```

O banco é compartilhado. Antes de rodar `db push`, avise o time.

## Como trabalhamos

**Branches**

| Branch | Para que serve |
|---|---|
| `main` | Versão estável, a que vai para a banca. Ninguém escreve código direto nela. |
| `feat/<tarefa>`, `fix/<tarefa>` | Cada pessoa trabalha na própria branch, criada a partir da `main`. |

Cada um trabalha na própria branch e junta direto na `main` com merge, sem Pull Request e sem branch intermediária, para não travar o ritmo do hackathon. Antes de juntar, a pessoa traz para a própria branch o que já está na `main` e confere se o fluxo principal continua funcionando. Assim a `main` segue pronta para demonstrar a qualquer momento.

```bash
git checkout main && git pull origin main
git checkout -b feat/minha-tarefa

# trabalho e commits

git merge main                     # traz o que o time já juntou e resolve conflitos aqui
git checkout main && git merge feat/minha-tarefa
git push origin main
```

**Commits** seguem o padrão Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`) e citam o requisito da PRD que atendem, por exemplo `feat: descreve a mudança (RF-03)`. Assim dá para sair de qualquer requisito e achar onde ele foi implementado.

**Uso de IA na construção.** O projeto é desenvolvido com apoio do Claude Code. O contexto que os agentes usam fica no `CLAUDE.md` e na pasta `memoria/`. O que eles podem ou não fazer, os hooks e as regras de segurança ficam em `.claude/`. O fluxo de trabalho com IA que montamos para o time vai ser descrito aqui em breve.

## Segurança

- Só usamos dados fictícios. Nada de dado real de cliente ou informação interna do banco.
- Chaves e senhas ficam em arquivos `.env`, que nunca vão para o repositório. O `.env.example` traz só os nomes das variáveis.
- Um hook do Claude Code bloqueia qualquer tentativa de um agente ler ou editar `.env`, chaves e credenciais. Force push e `git reset --hard` também estão bloqueados.
- Nenhuma integração com sistemas do Itaú. O que depender disso fica simulado e indicado como tal.

## Equipe

Equipe da Poli Júnior no Hackathon Itaú 2026:

| Nome | GitHub | LinkedIn | 
|---|---|---|
| Vicente Magalhães | [@vicente-magalhaes](https://github.com/vicente-magalhaes) | [Vicente Magalhães Fraga Oliveira](https://www.linkedin.com/in/vicente-magalhães-fraga-oliveira-50187b361) | 
| João Pedro Araújo | [@joaopparaujo](https://github.com/joaopparaujo) | [João Pedro de Pinho Araujo](https://www.linkedin.com/in/joaopedrodepinhoaraujo/) | 
| Alexandre Delbim | [@Alekka](https://github.com/Allekka) | [Alexandre Delbim](linkedin.com/in/alexandre-delbim-1b2695401) | 
| Bruno Vaskevicius | [@brunovaskevicius-bot](https://github.com/brunovaskevicius-bot) | [Bruno Dos Santos Vaskevicius](linkedin.com/in/bruno-dos-santos-vaskevicius-0b5174387) | 
