# Memória do projeto

O que o projeto sabe, escrito para pessoas e para agentes de código. Mantida com o
harness-hacka.

| Onde | O que guarda | Quem escreve |
|---|---|---|
| `*.md` (aqui) | Notas: o que vale hoje. Cada uma diz quando ler (`read_when`) e quando revisar (`review_by`). | Qualquer pessoa, a qualquer momento |
| `lessons.md` | O que não repetir. Qualquer nota com `type: lessons`. | O housekeeping promove para cá |
| `decisions/` | Por que é assim. Uma decisão por arquivo. Só uma pessoa aceita. | `/harness-hacka:decide` |
| `journal/` | O que aconteceu em cada sessão, inclusive o que não funcionou. | `/harness-hacka:journal` |
| `archive/` | O que já não vale. Nada é apagado. | `/harness-hacka:housekeeping` |

## Notas

<!-- harness-hacka:index -->
| Arquivo | Conteúdo | Ler quando |
|---|---|---|
| [01-hackathon-regras-e-entregas.md](01-hackathon-regras-e-entregas.md) | Entregas, limites, formato da banca, critérios, restrições do regulamento | Qualquer entrega: slides, vídeo, ficha, protótipo |
| [02-case-c-enunciado.md](02-case-c-enunciado.md) | O que a organização pede no Case C, personas de exemplo | Desenho da solução e do fluxo |
| [03-evidencias-pesquisa.md](03-evidencias-pesquisa.md) | O que ouvimos de pessoas do Itaú, com limites; fluxo as-is | Argumentos, slide de evidências, mapa ponta a ponta |
| [04-solucao-itau-house.md](04-solucao-itau-house.md) | Tese atual, persona, mecanismos, governança, expansão, teses descartadas | Tudo sobre o produto |
| [05-decisoes-e-pendencias.md](05-decisoes-e-pendencias.md) | Decidido, em aberto, riscos, perguntas da banca | Antes de assumir qualquer decisão |
| [06-prd-e-stack.md](06-prd-e-stack.md) | Formato da PRD e stack candidata | Escrever a PRD ou começar a codar |
| [07-identidade-visual.md](07-identidade-visual.md) | Qual fonte de marca vale para quê, regras de front-end, cores, fontes, logo | Front-end, slides, vídeo |
| [08-equipe.md](08-equipe.md) | Integrantes, perfil, contatos | Slide 6, ficha, divisão de tarefas |
| [09-brainstorm-time.md](09-brainstorm-time.md) | Ideias do time ainda não decididas: persona afiada, mecanismos novos, tensões | Desenho da solução, slides |
<!-- /harness-hacka:index -->

## Regras

1. Toda nota começa com frontmatter: `read_when` (obrigatório) e `review_by` (recomendado).
2. Decisão `accepted` não se reescreve. Mudou de ideia: nova decisão que substitui a antiga.
3. Registro do diário é curto (até ~25 linhas) e honesto em `## Dead ends`.
4. Sem segredo, token ou dado pessoal. O harness bloqueia na escrita e a auditoria reprova.
5. Não apague. O housekeeping move para `archive/`, com data e motivo.
