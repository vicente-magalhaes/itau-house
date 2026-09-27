#!/usr/bin/env bash
# Reset da demo (T-25): apaga os dados das tabelas de public e reaplica supabase/seed.sql.
# Não mexe em estrutura: tabelas, views, índices e migrações ficam como estão.
# Tudo numa transação só. Se o seed falhar, nada é apagado.
#
#   supabase/reset_demo.sh                          # base local do `supabase start`
#   DB_URL='postgresql://...' supabase/reset_demo.sh  # outra base; pede confirmação
#
# A URL vai por variável de ambiente, não por argumento, para a senha não aparecer na lista de processos.
# Contra o Supabase do time, só uma pessoa roda, avisando o time antes.

set -euo pipefail

cd "$(dirname "$0")"
DB_URL="${DB_URL:-postgresql://postgres:postgres@127.0.0.1:54322/postgres}"

command -v psql >/dev/null || { echo "Precisa do psql (cliente do PostgreSQL)." >&2; exit 1; }
[ -f seed.sql ] || { echo "Não achei supabase/seed.sql. Gere com: python3 supabase/gerar_seed_sql.py" >&2; exit 1; }

case "$DB_URL" in
  *@127.0.0.1:* | *@localhost:*) ;;
  *)
    echo "A base não é local. Isto apaga todos os dados de public e reaplica o seed."
    read -r -p "Para continuar, digite resetar: " resposta
    [ "$resposta" = "resetar" ] || { echo "Cancelado."; exit 1; }
    ;;
esac

inicio=$(date +%s)

psql "$DB_URL" -X -q -v ON_ERROR_STOP=1 --single-transaction \
  -c "do \$\$
      declare tabelas text;
      begin
        select string_agg(format('%I.%I', schemaname, tablename), ', ')
          into tabelas from pg_tables where schemaname = 'public';
        if tabelas is not null then
          execute 'truncate ' || tabelas || ' restart identity';
        end if;
      end \$\$;" \
  -f seed.sql

echo "Reset feito em $(( $(date +%s) - inicio )) s."
