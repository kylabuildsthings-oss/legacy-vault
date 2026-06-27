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

# Java
if command -v java >/dev/null 2>&1; then
  if java -version 2>&1 | grep -qE 'version "[0-9]+'; then
    pass "Java: $(java -version 2>&1 | head -1)"
  else
    fail "Java" "java exists but may be the macOS stub. Install JDK 17: brew install --cask temurin@17"
  fi
else
  fail "Java" "Install JDK 17: brew install --cask temurin@17 — see docs/legacy-vault/DAML_SETUP.md"
fi

# Daml
if command -v daml >/dev/null 2>&1; then
  pass "Daml: $(daml version 2>&1 | head -1)"
else
  fail "Daml SDK" "Install: curl -sSL https://get.daml.com/ | sh — then add ~/.daml/bin to PATH"
fi

# Contract placeholder
if [[ -d "$ROOT/legacy-vault/daml" ]]; then
  pass "Contract dir: legacy-vault/daml/"
else
  fail "legacy-vault/daml/" "Expected directory missing"
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
