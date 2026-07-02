#!/usr/bin/env bash
# Run Legacy Vault Daml Script tests (Phase 4).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

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

cd "$ROOT/legacy-vault"
daml build
daml test --files daml/Scripts/Tests.daml
