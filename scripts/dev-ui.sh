#!/usr/bin/env bash
# Start the Legacy Vault UI dev server (avoids stale cwd on external drives).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
UI="$ROOT/legacy-vault/ui"

cd "$UI"

echo "Ensuring UI dependencies are installed..."
npm install

echo "Starting dev server at http://localhost:5173"
npm run dev
