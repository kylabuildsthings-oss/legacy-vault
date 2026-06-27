#!/usr/bin/env bash
# Copy Legacy Vault docs into linkup_mcp/data/ for local RAG indexing.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DOCS="$ROOT/docs/legacy-vault"
DATA="$ROOT/linkup_mcp/data"

if [[ ! -d "$ROOT/linkup_mcp" ]]; then
  echo "linkup_mcp/ not found at $ROOT/linkup_mcp" >&2
  echo "Clone or restore linkup_mcp locally (gitignored from GitHub)." >&2
  exit 1
fi

mkdir -p "$DATA"

count=0
for file in "$DOCS"/*.md; do
  [[ -f "$file" ]] || continue
  cp "$file" "$DATA/"
  count=$((count + 1))
done

if [[ -f "$ROOT/README.md" ]]; then
  cp "$ROOT/README.md" "$DATA/README.md"
  count=$((count + 1))
fi

echo "Synced $count file(s) to linkup_mcp/data/"
ls -1 "$DATA"
