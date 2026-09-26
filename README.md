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
| Front-end | TypeScript + React + Vite |
| Banco | Supabase (PostgreSQL) |
| IA | LLM via API, com busca por similaridade entre ativos |
| Ambiente | Docker |

## Estrutura do repositório

```
itau-house/
├─ .claude/               configuração do Claude Code: permissões, hooks e regras de segurança
├─ CLAUDE.md              contexto e regras para os agentes de IA que desenvolvem o projeto
├─ memoria/               memória do projeto: regras do hackathon, evidências, decisões, formato da PRD
└─ itau-design-system/    guia de marca e logos do Itaú
```

As pastas de código e a `PRD.md` entram conforme o desenvolvimento avança.

## Como rodar

Em construção. Os passos entram aqui assim que o primeiro fluxo estiver funcionando.

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

| Nome | GitHub | LinkedIn | Papel |
|---|---|---|---|
| Vicente Magalhães | [@vicente-magalhaes](https://github.com/vicente-magalhaes) | [Vicente Magalhães Fraga Oliveira](https://www.linkedin.com/in/vicente-magalhães-fraga-oliveira-50187b361) | a definir |
| João Pedro Araújo | [@joaopparaujo](https://github.com/joaopparaujo) | [João Pedro de Pinho Araujo](https://www.linkedin.com/in/joaopedrodepinhoaraujo/) | a definir |
| Alexandre Delbim | a preencher | a preencher | a definir |
| Bruno Vaskevicius | a preencher | a preencher | a definir |
