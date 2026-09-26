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
| [memoria/07-identidade-visual.md](memoria/07-identidade-visual.md) | Cores, fontes e regras de logo do Itaú | Front-end, slides, vídeo |
| [memoria/08-equipe.md](memoria/08-equipe.md) | Integrantes, perfil, contatos | Slide 6, ficha, divisão de tarefas |

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
- O repositório é privado durante o desenvolvimento. Antes da banca, será limpo para ficar só o código. `memoria/` e `itau-design-system/` são internos: citam pessoas e conversas do Itaú e contêm a marca do banco.
- Escrever em português do Brasil, frases curtas.
