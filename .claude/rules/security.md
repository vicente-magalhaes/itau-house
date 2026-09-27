# Regras de segurança

Sempre ativas. Baseadas no regulamento do hackathon e em [docs/01-hackathon-regras-e-entregas.md](../../docs/01-hackathon-regras-e-entregas.md).

## Segredos

- Nenhuma chave, token ou senha no código, em commit, em tela ou no vídeo.
- Segredo vive em `.env`, que não é versionado. Só o `.env.example` vai para o git, com os nomes das variáveis e sem valores.
- O hook `.claude/hooks/block_secrets.py` bloqueia leitura e edição de `.env`, chaves e credenciais. Não tentar contornar. Se precisar mexer num segredo, pedir para uma pessoa do time.
- O Docker também expõe o `.env`: `docker compose config` sem `--quiet` e `docker compose exec <serviço> env` imprimem os valores. Não rodar esses comandos. Para validar o compose, usar `docker compose config --quiet`.

## Dados

- Só dados fictícios (regulamento 3.8). Nada de dado real de cliente, de colaborador ou informação interna do Itaú.
- Seeds e exemplos de demonstração são inventados e identificados como fictícios.
- Tudo que a aplicação manda para a API de LLM é dado de demonstração.
- Nome de pessoa real não entra em seed, tela ou teste. Usar nomes inventados.

## Sistemas do banco

- Nenhuma integração com sistema real do Itaú.
- Integração que dependeria do banco fica simulada e aparece marcada como **[SIMULADO]** na tela.
- Nenhuma ação do agente vai para produção nem é aprovada sem uma pessoa (regra do Case C).

## Conteúdo interno do time

- `memoria/`, os documentos numerados de `docs/` e `itau-design-system/` são internos. Citam pessoas e conversas do Itaú e contêm a marca do banco.
- Não publicar, não colar em serviço externo e não copiar esse conteúdo para o código da aplicação.
- Exceção: o Devin, dado pela organização, lê o repositório inteiro (decisão 0033). A proibição de copiar vale para ele também.
- O repositório é privado. Antes da banca, será limpo para ficar só o código (decisão D-09).

## Git

- Force push e `git reset --hard` estão bloqueados no `settings.json`. Como todo mundo faz merge direto na `main`, reescrever o histórico dela apaga o trabalho de um colega.
