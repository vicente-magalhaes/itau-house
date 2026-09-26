# Hackathon Itaú 2026: Case C

Equipe da Poli Júnior no Hackathon Itaú 2026 (26 e 27/09/2026, banca em 27/09).
Case C, Jornada de agentes: squad orientada por IA que entrega valor mais rápido sem perder qualidade, governança e decisão humana.
Solução: **Itaú House** (nome provisório). Fórum interno em que squads publicam e reaproveitam agentes, skills, frameworks e esqueletos de código, com governança. Persona inicial: dev. Dor: retrabalho por não saber que outra squad já fez algo parecido.

## Memória do projeto

Ler antes de qualquer tarefa. Os documentos brutos originais foram descartados; a memória é a fonte.

| Arquivo | Conteúdo | Ler quando |
|---|---|---|
| [memoria/01-hackathon-regras-e-entregas.md](memoria/01-hackathon-regras-e-entregas.md) | Entregas, limites, formato da banca, critérios, restrições do regulamento | Qualquer entrega: slides, vídeo, ficha, protótipo |
| [memoria/02-case-c-enunciado.md](memoria/02-case-c-enunciado.md) | O que a organização pede no Case C, personas de exemplo | Desenho da solução e do fluxo |
| [memoria/03-evidencias-pesquisa.md](memoria/03-evidencias-pesquisa.md) | O que ouvimos de pessoas do Itaú, com limites; fluxo as-is | Argumentos, slide de evidências, mapa ponta a ponta |
| [memoria/04-solucao-itau-house.md](memoria/04-solucao-itau-house.md) | Tese atual, persona, mecanismos, governança, expansão, teses descartadas | Tudo sobre o produto |
| [memoria/05-decisoes-e-pendencias.md](memoria/05-decisoes-e-pendencias.md) | Decidido, em aberto, riscos, perguntas da banca | Antes de assumir qualquer decisão |
| [memoria/06-prd-e-stack.md](memoria/06-prd-e-stack.md) | Formato da PRD e stack candidata | Escrever a PRD ou começar a codar |
| [memoria/07-identidade-visual.md](memoria/07-identidade-visual.md) | Qual fonte de marca vale para quê, regras de front-end, cores, fontes, logo | Front-end, slides, vídeo |
| [memoria/08-equipe.md](memoria/08-equipe.md) | Integrantes, perfil, contatos | Slide 6, ficha, divisão de tarefas |
| [memoria/09-brainstorm-time.md](memoria/09-brainstorm-time.md) | Ideias do time ainda não decididas: persona afiada, mecanismos novos, tensões | Desenho da solução, slides |

## Design system

`design-system/` é o design system do protótipo (tokens CSS, componentes React, regras de voz), gerado a partir do guia de marca oficial.
Ponto de entrada: [design-system/readme.md](design-system/readme.md). Skill: `itau-design`.
- Front-end importa `design-system/styles.css` e usa os componentes de `design-system/components/` antes de criar novos.
- Cor, fonte, raio, sombra e espaçamento só por token CSS. Nada de hex ou px de marca solto no código.
- Nunca vermelho, roxo ou gradiente. Erro usa `--status-error` (azul-marinho) com ícone.
- Texto de interface em pt-BR, falando com "você", CTA sem urgência.
- Detalhes e interpretações provisórias em [memoria/07-identidade-visual.md](memoria/07-identidade-visual.md).

## Ambiente (Docker)

Comandos completos no [README](README.md#como-rodar).
- `docker compose up --build` sobe back (:8000) e front (:5173) com hot reload.
- `docker-compose.prod.yml` é o build de produção (nginx em :8080), indicado para a demo.
- Dependência nova: `uv add` ou `npm install` na máquina, depois `docker compose up --build`. No front, com `-V`.
- Toda rota da API fica sob `/api`. O front chama caminhos relativos (`/api/...`), nunca a URL do back.
- Banco: Supabase na nuvem, um projeto só para dev e demo (D-12). Não roda no Docker.
- Estrutura do banco só por migração em `supabase/migrations/` (`supabase migration new`). Nunca alterar tabela pelo painel. Dados fictícios em `supabase/seed.sql`, idempotente.
- `supabase db push` mexe no banco que o time inteiro e a demo usam. Só com aprovação de uma pessoa.
- Arquivo novo que a imagem precisa entra na lista de permissão: `backend/.dockerignore` ou `frontend/Dockerfile.dockerignore`.

## Regras para os agentes

- Não inventar dados, resultados, depoimentos, aprovações ou números. O regulamento e a banca punem isso.
- Separar sempre fato, hipótese e simulação. Evidência vem com fonte e limite.
- Não tratar item "em aberto" ou "(sugestão Claude)" como decisão. Perguntar ao time.
- Não retomar teses descartadas (lista em 04) sem decisão do time.
- Só dados fictícios. Nada de dado real, segredo, chave ou material interno do Itaú em código, tela ou vídeo.
- Não conectar a sistemas reais do banco. Integração simulada é marcada como simulada.
- Uma persona, uma tarefa, um fluxo funcionando. Resistir a adicionar funcionalidades.
- Código segue a PRD (`PRD.md`, quando existir). Cada mudança cita o requisito (RF/RN/RNF) que atende.
- Git: trabalhar numa branch `feat/` ou `fix/` criada a partir da `main`. Antes de juntar, trazer a `main` para a branch e conferir que o fluxo principal roda. Juntar com merge direto na `main`. Sem `dev` e sem Pull Request. Nunca commitar direto na `main`.
- Ao fechar uma decisão, registrar em `memoria/05-decisoes-e-pendencias.md` com data.
- O repositório é privado durante o desenvolvimento. Antes da banca, será limpo para ficar só o código. `memoria/` e `itau-design-system/` são internos: citam pessoas e conversas do Itaú e contêm a marca do banco. `design-system/` fica, porque o front-end depende dele.
- Escrever em português do Brasil, frases curtas.

## Configuração do Claude Code

`.claude/settings.json` define o que os agentes podem rodar sem pedir (git, uv, npm, docker compose), o que é proibido (ler segredos, force push, `git reset --hard`) e os hooks:
- `block_secrets.py` bloqueia leitura e edição de `.env`, chaves e credenciais.
- `format_code.py` formata o arquivo editado (ruff, prettier, eslint) quando o projeto tiver essas ferramentas.

Regras de segurança, sempre ativas:

@.claude/rules/security.md
