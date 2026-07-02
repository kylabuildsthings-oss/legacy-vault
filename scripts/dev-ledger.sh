#!/usr/bin/env bash
# Start Legacy Vault Daml sandbox + JSON API (terminal 1 for full-stack dev).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LV="$ROOT/legacy-vault"

if [[ -z "${JAVA_HOME:-}" ]]; then
  for candidate in "$HOME/.jdk"/jdk-17*; do
    [[ -d "$candidate" ]] || continue
    if [[ -x "$candidate/Contents/Home/bin/java" ]]; then
      export JAVA_HOME="$candidate/Contents/Home"
    elif [[ -x "$candidate/bin/java" ]]; then
      export JAVA_HOME="$candidate"
    else
      continue
    fi
    export PATH="$JAVA_HOME/bin:$PATH"
    break
  done
fi

export PATH="$HOME/.daml/bin:$PATH"

if ! command -v daml >/dev/null 2>&1; then
  echo "Daml not found. Run ./scripts/install-daml.sh"
  exit 1
fi

if [[ ! -f "$LV/daml.yaml" ]]; then
  echo "Missing $LV/daml.yaml"
  exit 1
fi

echo "Building contracts..."
(cd "$LV" && daml build)

echo ""
echo "Starting Daml sandbox (Ctrl+C to stop)..."
echo "UI (mock or ledger): ./scripts/dev-ui.sh"
echo ""
cd "$LV" && daml start
