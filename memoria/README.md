# Memória do projeto

O que o projeto sabe e que muda com o tempo, escrito para pessoas e para agentes de código.
Mantida com o harness-hacka. Referência estável, que não vence (contrato da API, fluxos,
roteiro da demo), fica em [`docs/`](../docs/) (D-24).

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
| [04-solucao-itau-house.md](04-solucao-itau-house.md) | Tese atual, persona, mecanismos, governança, expansão, teses descartadas | Tudo sobre o produto |
| [05-pendencias-e-riscos.md](05-pendencias-e-riscos.md) | Em aberto, riscos e perguntas da banca, sugestões para o time avaliar | Antes de tratar algo como decidido; ao preparar respostas à banca |
| [09-brainstorm-time.md](09-brainstorm-time.md) | Ideias do time ainda não decididas: persona afiada, mecanismos novos, tensões | Desenho da solução, slides |
<!-- /harness-hacka:index -->

## Regras

1. Toda nota começa com frontmatter: `read_when` (obrigatório) e `review_by` (recomendado).
2. Decisão `accepted` não se reescreve. Mudou de ideia: nova decisão que substitui a antiga.
3. Registro do diário é curto (até ~25 linhas) e honesto em `## Dead ends`.
4. Sem segredo, token ou dado pessoal. O harness bloqueia na escrita e a auditoria reprova.
5. Não apague. O housekeeping move para `archive/`, com data e motivo.
