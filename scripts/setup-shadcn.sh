#!/usr/bin/env bash
# Step 3: run this from LEGACYVAULT root after Step 1 is complete.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
UI="$ROOT/legacy-vault/ui"

if [[ ! -f "$UI/package.json" ]]; then
  echo "Error: legacy-vault/ui not found at $UI"
  exit 1
fi

cd "$UI"

if [[ ! -d node_modules ]]; then
  echo "Installing npm dependencies..."
  npm install
fi

echo "Initializing shadcn/ui (default style; Legacy Vault tokens applied in Step 3)..."
npx shadcn@latest init -y -d

echo "Adding core components..."
npx shadcn@latest add -y card button input table dialog sheet dropdown-menu \
  badge tabs separator avatar skeleton toast select textarea label progress

echo "Done. Next: Step 3 — map Stitch tokens onto shadcn CSS variables."
