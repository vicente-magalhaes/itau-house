# Plugin Itaú House (Claude Code)

T-13. Hooks, skill e conexão com o MCP do Itaú House. Contrato do MCP em [docs/api.md](../docs/api.md#contrato-do-mcp-t-12).
Protótipo de hackathon. Dados fictícios.

## Rodar na demo

```bash
docker compose up --build            # API em :8000
ITAU_HOUSE_USUARIO=u-rafael claude --plugin-dir ./plugin
```

| Variável | Padrão | Para quê |
|---|---|---|
| `ITAU_HOUSE_USUARIO` | `u-rafael` | Quem está usando (login simulado) |
| `ITAU_HOUSE_MODO` | `perguntar_antes` | `perguntar_antes`, `proativo` ou `sob_demanda` (RF-02, RF-04) |
| `ITAU_HOUSE_API` | `http://localhost:8000` | Onde está a API |

## O que tem aqui

| Arquivo | Faz | Req |
|---|---|---|
| `hooks/intencao.py` | Reconhece o pedido de criar um ativo, sem LLM, e aplica o modo | RF-02, RF-03, RF-04 |
| `hooks/ativo_novo.py` | Anota skill ou agente criado em `.claude/skills/` ou `.claude/agents/` | RF-13 |
| `hooks/fim_da_tarefa.py` | Ao fim da tarefa, manda validar e convidar a publicar | RF-14, RF-16 |
| `skills/itau-house/SKILL.md` | Fluxo e tom: sugerir, usar/adaptar/ignorar, validar, montar e enviar o post | RF-06 a RF-11, RF-15 a RF-18 |
| `commands/itau-house.md` | `/itau-house <o que precisa>` | RF-12 |
| `.mcp.json` | Sobe o servidor MCP de `mcp/` | RNF-05 |

Testes dos hooks: `backend/tests/test_plugin_hooks.py`.

## Cuidados no ensaio

- Na cena 1, a skill adaptada também dispara a validação ao fim da tarefa (RF-13). Responda "agora não" ao convite ou corte na edição.
- O estado da sessão fica em `$TMPDIR/itau-house/`. Para reensaiar do zero, apague essa pasta.
