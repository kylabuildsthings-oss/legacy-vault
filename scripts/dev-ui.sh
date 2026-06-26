#!/usr/bin/env bash
# Start the Legacy Vault UI dev server (avoids stale cwd on external drives).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
UI="$ROOT/legacy-vault/ui"

cd "$UI"

if [[ ! -d node_modules ]]; then
  echo "node_modules missing — running npm install..."
  npm install
fi

echo "Starting dev server at http://localhost:5173"
npm run dev
