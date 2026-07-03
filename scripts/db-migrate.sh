#!/usr/bin/env bash
# Apply Legacy Vault API Postgres migrations and demo seed data.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
API="$ROOT/legacy-vault/api"

cd "$API"

echo "Ensuring API dependencies are installed..."
npm install

if [[ -z "${DATABASE_URL:-}" && -f ".env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source ".env"
  set +a
fi

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "DATABASE_URL is required. Add it to legacy-vault/api/.env first."
  exit 1
fi

echo "Applying database migrations..."
npm run db:migrate
