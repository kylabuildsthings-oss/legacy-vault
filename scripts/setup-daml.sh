#!/usr/bin/env bash
# Check that Java and Daml SDK are ready for Legacy Vault Step 2 (backend).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OK=0
MISSING=0

pass() {
  echo "  OK   $1"
  OK=$((OK + 1))
}

fail() {
  echo "  MISS $1"
  echo "       $2"
  MISSING=$((MISSING + 1))
}

echo "Legacy Vault — Daml backend readiness"
echo "Repo: $ROOT"
echo ""

# Prefer ~/.jdk from install-java.sh when JAVA_HOME is unset
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

if [[ -z "${PATH:-}" ]] || [[ ":$PATH:" != *":$HOME/.daml/bin:"* ]]; then
  export PATH="$HOME/.daml/bin:$PATH"
fi

# Java
if command -v java >/dev/null 2>&1; then
  if java -version 2>&1 | grep -qE 'version "[0-9]+'; then
    pass "Java: $(java -version 2>&1 | head -1)"
  else
    fail "Java" "java exists but may be the macOS stub. Run: ./scripts/install-java.sh"
  fi
else
  fail "Java" "Run: ./scripts/install-java.sh — or brew install --cask temurin@17 — see docs/legacy-vault/DAML_SETUP.md"
fi

# Daml
if command -v daml >/dev/null 2>&1; then
  pass "Daml: $(daml version 2>&1 | head -1)"
else
  fail "Daml SDK" "Run: ./scripts/install-daml.sh — or curl -sSL https://get.daml.com/ | sh"
fi

# Contract placeholder
if [[ -d "$ROOT/legacy-vault/daml" ]]; then
  pass "Contract dir: legacy-vault/daml/"
else
  fail "legacy-vault/daml/" "Expected directory missing"
fi

# Daml project build
if [[ -f "$ROOT/legacy-vault/daml.yaml" ]] && command -v daml >/dev/null 2>&1; then
  if (cd "$ROOT/legacy-vault" && daml build >/dev/null 2>&1); then
    pass "daml build: legacy-vault/.daml/dist/*.dar"
  else
    fail "daml build" "Run: cd legacy-vault && daml build"
  fi
fi

echo ""
if [[ "$MISSING" -eq 0 ]]; then
  echo "Ready for Step 2. Smoke test:"
  echo "  cd /tmp && daml new lv-check --template create-daml-app && cd lv-check && daml start"
  echo ""
  echo "Full guide: docs/legacy-vault/DAML_SETUP.md"
  exit 0
fi

echo "$MISSING check(s) failed, $OK passed."
echo "See docs/legacy-vault/DAML_SETUP.md for install steps."
exit 1
