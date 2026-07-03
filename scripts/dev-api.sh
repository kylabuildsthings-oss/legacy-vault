#!/usr/bin/env bash
# Start the Legacy Vault backend API dev server.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
API="$ROOT/legacy-vault/api"

cd "$API"

echo "Ensuring API dependencies are installed..."
npm install

if [[ ! -f ".env" && -f ".env.example" ]]; then
  echo "Creating legacy-vault/api/.env from .env.example"
  cp .env.example .env
fi

echo "Starting API server at http://localhost:4000"
npm run dev
