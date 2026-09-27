#!/usr/bin/env bash
# Liga o login com Google no Supabase do time, a partir de supabase/auth-google/config.toml.
# As credenciais vêm de backend/.env (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET) e não são impressas.
# Uso: supabase/ligar_google.sh          → só mostra o diff
#      supabase/ligar_google.sh --aplicar → aplica, pedindo confirmação
set -euo pipefail
RAIZ="$(cd "$(dirname "$0")/.." && pwd)"
REF="claohiagkdrfzolnydnc"
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
mkdir -p "$TMP/supabase" && cp "$RAIZ/supabase/auth-google/config.toml" "$TMP/supabase/config.toml"
cd "$TMP"
if [[ "${1:-}" == "--aplicar" ]]; then
  uv run --no-project --env-file "$RAIZ/backend/.env" -- supabase config push --project-ref "$REF"
else
  uv run --no-project --env-file "$RAIZ/backend/.env" -- supabase config diff --project-ref "$REF"
fi
