# Plugin Itaú House (Claude Code)

T-13. Hooks, skill, comando e o servidor MCP do Itaú House, em `mcp/`. Contrato do MCP em [docs/api.md](../docs/api.md#contrato-do-mcp-t-12).
Protótipo de hackathon. Dados fictícios.

## Instalar em todos os projetos (RF-01)

Quem não programa usa o botão laranja **Instale no seu agente**, no topo do site: escolhe o modo, copia um texto e cola no Claude Code. O agente confere git, uv e Python e roda:

```bash
claude plugin marketplace add vicente-magalhaes/itau-house --sparse .claude-plugin plugin
claude plugin install itau-house@itau-house
```

Depois grava no `env` do `settings.json` do usuário (`~/.claude/settings.json`, ou o da pasta `CLAUDE_CONFIG_DIR`):

| Variável | Padrão | Para quê |
|---|---|---|
| `ITAU_HOUSE_API` | `http://localhost:8000` | Onde está a API. O site grava o próprio endereço |
| `ITAU_HOUSE_SITE` | `https://itau-house.vercel.app` | Para onde apontam os links |
| `ITAU_HOUSE_USUARIO` | `u-rafael` | Quem está usando (login simulado). O site grava a persona de quem clicou |
| `ITAU_HOUSE_MODO` | `perguntar_antes` | `perguntar_antes`, `proativo` ou `sob_demanda` (RF-02, RF-04) |

- O repositório é privado: só instala quem tem acesso. Num piloto, o plugin viria do repositório interno do banco. O diálogo marca isso como simulado.
- A instalação copia só a pasta `plugin/`. Por isso o MCP mora dentro dela.
- O `env` do `settings.json` vale mais que a variável do terminal. Quem instalou assim e quer apontar para o back local muda o `ITAU_HOUSE_API` lá.
- Para testar como se fosse outra máquina, sem mexer no seu Claude Code: defina `CLAUDE_CONFIG_DIR` com uma pasta vazia antes de abrir o `claude`. Ele pede login de novo.

## Rodar na demo, sem instalar

```bash
docker compose up --build            # API em :8000
ITAU_HOUSE_USUARIO=u-rafael claude --plugin-dir ./plugin
```

Com o plugin instalado, não precisa do `--plugin-dir`.

## O que tem aqui

| Arquivo | Faz | Req |
|---|---|---|
| `hooks/intencao.py` | Reconhece o pedido de criar um ativo, sem LLM, e aplica o modo | RF-02, RF-03, RF-04 |
| `hooks/ativo_novo.py` | Anota skill ou agente criado em `.claude/skills/` ou `.claude/agents/` | RF-13 |
| `hooks/fim_da_tarefa.py` | Ao fim da tarefa, manda validar e convidar a publicar | RF-14, RF-16 |
| `hooks/hooks.json` | Liga os hooks. Chama `python` e, se não houver, `python3`: no Windows, `python3` costuma não existir | RNF-05 |
| `skills/itau-house/SKILL.md` | Fluxo e tom: sugerir, usar/adaptar/ignorar, validar, montar e enviar o post | RF-06 a RF-11, RF-15 a RF-18 |
| `commands/itau-house.md` | `/itau-house <o que precisa>` | RF-12 |
| `mcp/` | Servidor MCP (T-12). Projeto uv próprio: `uv run pytest` nesta pasta | RNF-05 |
| `.mcp.json` | Sobe o servidor de `mcp/` com `uv run` | RNF-05 |

Testes dos hooks: `backend/tests/test_plugin_hooks.py`.

## Cuidados no ensaio

- Na cena 1, a skill adaptada também dispara a validação ao fim da tarefa (RF-13). Responda "agora não" ao convite ou corte na edição.
- O estado da sessão fica em `$TMPDIR/itau-house/`. Para reensaiar do zero, apague essa pasta.
