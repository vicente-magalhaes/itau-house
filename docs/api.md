# Contrato da API: Itaú House

T-03 · Dono: Bruno · Valida: Vicente (back, MCP), Alexandre (front) · Destrava o marco M1.
Requisitos em [PRD.md](../PRD.md). Cenas em [roteiro-demo.md](roteiro-demo.md). Dados fictícios.

## Regras gerais

- Toda rota fica sob `/api`. JSON em UTF-8. Campos em **camelCase**, como o front já usa. No Pydantic: `alias_generator=to_camel`.
- **Login simulado (RF-23):** quem chama manda o cabeçalho `X-Usuario-Id: <id>`. Sem cabeçalho → 401. O front guarda o id escolhido na tela de entrada. O plugin lê o id da variável `ITAU_HOUSE_USUARIO`.
- **Visibilidade (RF-05, RNF-07):** vale em toda leitura (feed, detalhe, busca, MCP). Um ativo é visível para a pessoa quando está `publicado` e:
  - `visibilidade = banco`, ou
  - `visibilidade = frente` e a frente é a mesma da pessoa, ou
  - `visibilidade = squad` e o squad é o mesmo da pessoa.
  - Exceção: o autor sempre vê os próprios ativos, em qualquer status. O Cord+ vê os ativos do seu squad que estão na fila.
  - Um ativo que a pessoa não vê responde **404**, nunca 403. Assim a API não revela que ele existe.
- IDs são strings opacas (uuid no banco). Datas em ISO 8601 com fuso (`2026-09-27T10:15:00-03:00`).
- Erro: `{ "erro": "codigo_curto", "mensagem": "Texto para a pessoa, em pt-BR." }`
  - 401 sem usuário · 403 perfil sem permissão · 404 não existe ou não é visível · 409 status não permite a ação · 422 entrada inválida ou barrada pelo validador.

## Tipos

**Enums**
- `tipo`: `skill` · `agente` · `mcp` · `framework` · `componente` · `esqueleto` · `design_system` · `harness`
- `visibilidade`: `squad` (padrão) · `frente` · `banco`
- `status`: `rascunho` · `barrado` · `em_aprovacao` · `devolvido` · `publicado`
- `papel`: `produto` · `design` · `dev` · `dados` · `risco` · `coordenacao`. É o que conta no "reuso entre papéis" (PRD §11).
- `perfil`: `cord_mais` · `cord_menos`

**Pessoa**
```json
{
  "id": "u-rafael",
  "nome": "Rafael Nunes",
  "iniciais": "RN",
  "papel": "dev",
  "cargo": "Dev pleno",
  "squad": "Pix · Cobranças",
  "squadId": "s-pix-cobrancas",
  "frente": "Pix",
  "perfil": "cord_menos"
}
```
`cargo` é o texto que aparece na tela. `papel` é o enum da métrica.

**AtivoResumo** (card do feed, item de busca)
```json
{
  "id": "a-criterios-aceitacao",
  "nome": "Demanda em critérios de aceitação",
  "tipo": "skill",
  "resumo": "Transforma a demanda em critérios de aceitação no formato Dado/Quando/Então.",
  "autor": { "id": "u-marina", "nome": "Marina Alves", "iniciais": "MA", "cargo": "PM", "papel": "produto", "squad": "Cartões · Fatura" },
  "squad": "Cartões · Fatura",
  "frente": "Cartões",
  "visibilidade": "banco",
  "status": "publicado",
  "tags": ["qualidade", "refinamento"],
  "ferramentas": ["Claude Code", "Copilot"],
  "versao": "1.2.0",
  "publicadoEm": "2026-08-14T10:00:00-03:00",
  "atualizadoEm": "2026-09-22T09:30:00-03:00",
  "curtidas": 23,
  "instalacoes": 41,
  "derivacoes": 3,
  "squadsQueReusaram": ["Pix · Recebimentos", "Seguros · Vida"],
  "curtidoPorMim": false
}
```
Os contadores saem dos eventos (RF-30). `curtidas + instalacoes` é a popularidade do feed (RF-25).

**AtivoDetalhe** = AtivoResumo mais:
```json
{
  "readme": "## O que faz\n...",
  "arquivos": [{ "caminho": "SKILL.md", "conteudo": "---\nname: ...\n---\n..." }],
  "manualInstalacao": "Copie a pasta para .claude/skills/ ...",
  "acessos": [{ "icone": "file-text", "titulo": "Lê arquivos do repositório aberto", "detalhe": "Só leitura." }],
  "derivadoDe": { "id": "a-...", "nome": "...", "autor": { "nome": "...", "cargo": "...", "squad": "..." } },
  "usos": [
    { "tipo": "derivacao", "pessoa": { "nome": "Rafael Nunes", "cargo": "Dev pleno", "squad": "Pix · Cobranças" }, "em": "2026-09-27T10:12:00-03:00" }
  ],
  "historico": [
    { "em": "2026-08-14T10:00:00-03:00", "evento": "Publicação aprovada", "quem": "Juliana Prado (coordenação Pix · Cobranças)" }
  ],
  "enviadoPor": { "nome": "...", "cargo": "..." },
  "aprovadoPor": { "nome": "...", "cargo": "..." },
  "comentarioCoordenador": null
}
```
- `derivadoDe` é `null` quando o ativo é original (RF-09).
- `usos` lista instalações e derivações, mais recentes primeiro (roteiro, cena 1, passo 5).
- `historico` é a trilha de quem fez o quê (RF-22, RNF-01), montada a partir dos eventos.

## Rotas

### Sessão

| Rota | Faz | Req |
|---|---|---|
| `GET /api/usuarios` | Lista as pessoas fictícias da tela de entrada. Não pede cabeçalho. | RF-23, RF-24 |

Resposta: `{ "usuarios": [Pessoa] }`

### Catálogo (plataforma)

| Rota | Faz | Req |
|---|---|---|
| `GET /api/ativos?ordem=alta\|curtidos\|novos&tipo=&q=` | Feed: só publicados e visíveis. `alta` = curtidas + instalações (padrão). `tipo` e `q` são P1. | RF-25, RF-26 |
| `GET /api/ativos/{id}` | Detalhe do ativo. | RF-27, RF-30, RF-22 |
| `POST /api/ativos/{id}/curtida` | Liga ou desliga a curtida da pessoa. Resposta: `{ "curtido": true, "curtidas": 24 }` | RF-28 (P1) |
| `POST /api/ativos/{id}/instalacoes` | Registra a instalação pela plataforma. Resposta: `{ "instalacoes": 42 }` | RF-29 (P1) |

Feed: `{ "ativos": [AtivoResumo] }`. Detalhe: `AtivoDetalhe`.

### Descoberta (plugin, via MCP)

**`POST /api/busca`**: busca com justificativa (RF-05, RF-06, RF-11). O back filtra por visibilidade e o Claude ranqueia e justifica (D-19).

Entrada:
```json
{ "pedido": "cria uma skill que transforma a demanda em critérios de aceitação e casos de teste", "tipo": "skill", "modo": "perguntar_antes" }
```
Saída com resultado:
```json
{
  "buscaId": "b-...",
  "encontrou": true,
  "mensagem": "Encontrei uma skill parecida no Itaú House, feita pela Marina, PM da squad Cartões · Fatura.",
  "sugestoes": [
    {
      "ativo": "AtivoResumo",
      "motivo": "Escreve critérios em Dado/Quando/Então. Faz metade do que você pediu.",
      "limite": "Não gera casos de teste."
    }
  ],
  "gravada": false
}
```
Saída sem resultado:
```json
{ "buscaId": "b-...", "encontrou": false, "mensagem": "Não encontrei nada parecido. Quando terminar, posso ajudar a publicar.", "sugestoes": [], "gravada": false }
```
- No máximo 3 sugestões. Só entra quem passa do limiar de semelhança. Nenhum ativo é inventado: o back descarta qualquer id que o LLM devolva e que não esteja entre os candidatos.
- `gravada: true` quando a resposta veio do fallback (RNF-04). O plugin e a tela avisam que é resposta gravada.
- Sem Claude e com um pedido que não é cena da demo: `encontrou: false`, `indisponivel: true` e uma mensagem dizendo que a busca está fora do ar. Nunca responde "não encontrei" sem ter buscado.
- O tipo pedido não filtra os candidatos: quem pede uma skill pode se servir de um agente. Vai só como contexto para o Claude.
- A rota grava os eventos `intencao`, `busca` e `sugestao` (RF-10).

**`POST /api/decisoes`**: registra o que a pessoa escolheu (RF-07, RF-10).

Entrada:
```json
{ "buscaId": "b-...", "ativoId": "a-criterios-aceitacao", "decisao": "adaptar" }
```
- `decisao`: `usar` · `adaptar` · `ignorar`. Em `ignorar`, `ativoId` pode ser `null`.
- `usar` soma 1 instalação. `adaptar` soma 1 derivação na hora, antes de o derivado ser publicado (roteiro, cena 1, passo 5).

Saída: `{ "ok": true, "instalacoes": 41, "derivacoes": 4 }`

**Adaptação (RF-08): sem rota.** Quem adapta é o próprio agente da pessoa. O plugin pega o conteúdo em `GET /api/ativos/{id}`, o Claude Code adapta localmente e mostra o que mudou. A pessoa revisa, e o arquivo salvo leva `derivado_de: <id>` no frontmatter. Isso tira uma chamada de LLM do back.

### Publicação (plugin, via MCP)

**`POST /api/validacoes`**: validador por código, sem IA (RF-14, RF-15, D-26). Não cria ativo. "Nada foi enviado" continua valendo: nada vai para a fila.

Entrada:
```json
{
  "arquivos": [
    { "caminho": "SKILL.md", "conteudo": "..." },
    { "caminho": "scripts/gerar_massa.py", "conteudo": "..." }
  ]
}
```
Saída:
```json
{
  "validacaoId": "v-...",
  "resultado": "barrado",
  "itens": [
    {
      "criterio": "segredo",
      "resultado": "falhou",
      "titulo": "Chave de API no código",
      "arquivo": "scripts/gerar_massa.py",
      "linha": 12,
      "trecho": "API_KEY = \"ihs_demo_••••\"",
      "comoCorrigir": "Leia o valor de uma variável de ambiente e documente no README como configurá-la."
    },
    { "criterio": "dado_pessoal", "resultado": "ok", "titulo": "Nenhum CPF, e-mail ou telefone" },
    { "criterio": "readme", "resultado": "ok", "titulo": "Tem descrição do que faz" },
    { "criterio": "autor", "resultado": "ok", "titulo": "Autor e squad preenchidos" }
  ]
}
```
- `resultado`: `aprovado` · `barrado`. `criterio`: `segredo` · `dado_pessoal` · `readme` · `autor`.
- O `trecho` sai sempre mascarado. A API nunca devolve o segredo.
- Um item por critério. Quando um critério falha em vários lugares, aparece um item para cada ocorrência.

**`POST /api/ativos`**: monta o rascunho do post (RF-17).

Entrada:
```json
{
  "nome": "Massa de dados fictícios para testes de Pix",
  "tipo": "skill",
  "resumo": "...",
  "readme": "...",
  "arquivos": [{ "caminho": "SKILL.md", "conteudo": "..." }],
  "manualInstalacao": "...",
  "visibilidade": "squad",
  "derivadoDe": null,
  "tags": ["teste", "pix"],
  "ferramentas": ["Claude Code"],
  "validacaoIds": ["v-1", "v-2"]
}
```
- O agente da pessoa escreve o texto do post. O back só guarda o rascunho.
- `visibilidade` vem como `squad` quando não for informada (RF-18).
- `validacaoIds` liga as rodadas anteriores ao ativo, para a fila mostrar "barrado → passou".

Saída: `201` com `AtivoDetalhe` em `status: rascunho`.

**`PATCH /api/ativos/{id}`**: a pessoa edita qualquer campo do rascunho, inclusive a visibilidade (RF-17, RF-18). Mesmo formato da criação, só com os campos que mudam. Vale para `rascunho` e `devolvido`, e só para o autor. Em outro status → 409.

**`POST /api/ativos/{id}/envio`**: envia para o coordenador (RF-18, RF-14).
- O back roda o validador de novo sobre `arquivos`. Se barrar: 422 com `{ "erro": "barrado", "mensagem": "...", "validacao": {...} }`, e o status vira `barrado`.
- Se passar: status `em_aprovacao`. O ativo entra na fila do Cord+ do squad do autor.
- Saída: `AtivoDetalhe`.

### Coordenação (plataforma, só Cord+)

| Rota | Faz | Req |
|---|---|---|
| `GET /api/aprovacoes` | Fila do squad do Cord+ logado. Cord− → 403. Coordenador de outro squad não vê o item. | RF-32, RF-19 |
| `POST /api/aprovacoes/{ativoId}` | Aprova ou devolve. | RF-19, RF-21, RF-22 |

Item da fila:
```json
{
  "ativo": "AtivoDetalhe",
  "enviadoEm": "2026-09-27T10:40:00-03:00",
  "validacoes": [
    { "resultado": "barrado", "em": "2026-09-27T10:31:00-03:00", "itens": [] },
    { "resultado": "aprovado", "em": "2026-09-27T10:35:00-03:00", "itens": [] }
  ]
}
```
Resposta da fila: `{ "itens": [ItemFila] }`, o mais antigo primeiro.

Decisão do coordenador:
```json
{ "decisao": "aprovar" }
{ "decisao": "devolver", "comentario": "Falta dizer no README de onde vem a chave do ambiente." }
```
- `aprovar` → `publicado`, com a visibilidade escolhida pelo autor. Guarda quem aprovou e quando.
- `devolver` → `devolvido`. `comentario` obrigatório (422 sem ele).
- Ativo fora de `em_aprovacao` → 409.
- Saída: `AtivoDetalhe`.

## Ferramentas do MCP (T-12) → rotas

| Ferramenta | Rota |
|---|---|
| `buscar_ativos` | `POST /api/busca` |
| `detalhar_ativo` | `GET /api/ativos/{id}` |
| `registrar_decisao` | `POST /api/decisoes` |
| `validar_ativo` | `POST /api/validacoes` |
| `montar_post` | `POST /api/ativos` e, para editar, `PATCH /api/ativos/{id}` |
| `enviar_para_aprovacao` | `POST /api/ativos/{id}/envio` |

O MCP repassa `X-Usuario-Id` a partir de `ITAU_HOUSE_USUARIO`.

## O que muda em relação ao que já existe

**Banco (T-05, Vicente)**
- A PRD §10 chama os campos de `titulo`, `descricao` e `alcance`. O contrato usa `nome`, `resumo` e `visibilidade`, que são os nomes do front. O nome da coluna no banco fica a critério do Vicente. O que vale é o JSON.
- `conteudo text` vira `arquivos jsonb` (lista de `{caminho, conteudo}`). O validador aponta arquivo e linha.
- `validacoes.ativo_id` precisa aceitar `null`: a validação roda antes de o rascunho existir.
- Campos a mais no ativo: `tags`, `ferramentas`, `versao`, `acessos` (jsonb), `atualizado_em`. Em `usuarios`: `cargo`, `iniciais`.
- O enum `papel` ganha `dados` e `coordenacao`. O enum `tipo` ganha `componente`, que o front já usa.
- Seed (T-04) em `backend/app/dados/seed.json`, neste formato. Os ids são legíveis (`u-rafael`, `a-criterios-aceitacao`): sugiro chave `text` em vez de `uuid`, e as URLs da demo ficam legíveis também. Os contadores do seed são a base inicial, e eventos novos somam em cima deles.

**Front (Alexandre)**
- `reusos` passa a se chamar `instalacoes`.
- `autor.papel` vira `autor.cargo` na tela. `papel` passa a ser o enum.
- `comentarios` não vem da API: RF-33 está fora do MVP. Esconder o contador ou usar `ativo.comentarios?.length`.
- Datas vêm com hora. `formatarData` precisa de `iso.slice(0, 10)`.
- Validador: `reprovado` vira `barrado`, e os critérios `c1..c4` passam a ser `segredo`, `dado_pessoal`, `readme` e `autor`. `evidencia` sai de `arquivo`, `linha` e `trecho`.
- A fila não traz `apontamentos`: seriam julgamento de IA, e a D-26 tira a IA do validador. "Alcance pedido" sai de `ativo.visibilidade`.
- A busca não traz `aderencia` em porcentagem: o Claude não mede aderência, só ranqueia. Vem `motivo` e `limite`.
- As pessoas e os ativos do mock (Ana, Thiago, Rafael Costa) mudam para o elenco do roteiro. O seed é o T-04.

## Fora do contrato

- Reset do estado da demo (T-25): comando do Vicente, não rota.
- Reconhecimento de intenção (RF-03): roda no hook, na máquina da pessoa. O evento `intencao` é gravado pela busca.
- Delegação (RF-20) e comentários (RF-33): fora do MVP.
