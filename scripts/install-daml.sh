#!/usr/bin/env bash
# Install Daml SDK 2.2.0 (macOS). Resumable download — retries on flaky networks.
set -euo pipefail

DAML_VERSION="${DAML_VERSION:-2.2.0}"
CACHE_DIR="${DAML_CACHE_DIR:-$HOME/.cache/legacy-vault/daml}"
TARBALL="$CACHE_DIR/daml-sdk-${DAML_VERSION}-macos.tar.gz"
URL="https://github.com/digital-asset/daml/releases/download/v${DAML_VERSION}/daml-sdk-${DAML_VERSION}-macos.tar.gz"

# Prefer user-local JDK from install-java.sh
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

if ! command -v java >/dev/null 2>&1 || ! java -version 2>&1 | grep -qE 'version "[0-9]+'; then
  echo "Java not found. Run ./scripts/install-java.sh first."
  exit 1
fi

if command -v daml >/dev/null 2>&1; then
  echo "Daml already installed: $(daml version 2>&1 | head -1)"
  exit 0
fi

mkdir -p "$CACHE_DIR"
TMPDIR="$(mktemp -d)"
cleanup() { rm -rf "$TMPDIR"; }
trap cleanup EXIT

download_sdk() {
  echo "Downloading Daml SDK ${DAML_VERSION} (resumable) ..."
  echo "  URL: $URL"
  echo "  Cache: $TARBALL"
  if [[ -f "$TARBALL" ]]; then
    curl --http1.1 -C - -fsSL "$URL" -o "$TARBALL" || {
      echo "Resume failed; retrying fresh download ..."
      rm -f "$TARBALL"
      curl --http1.1 -fsSL "$URL" -o "$TARBALL"
    }
  else
    curl --http1.1 -fsSL "$URL" -o "$TARBALL"
  fi
}

install_from_tarball() {
  if [[ ! -f "$TARBALL" ]] || [[ ! -s "$TARBALL" ]]; then
    echo "SDK tarball missing or empty: $TARBALL"
    exit 1
  fi

  if ! tar -tzf "$TARBALL" >/dev/null 2>&1; then
    echo "SDK tarball incomplete or corrupt. Delete and re-run:"
    echo "  rm -f \"$TARBALL\""
    exit 1
  fi

  if [[ -d "$HOME/.daml" ]]; then
    echo "Removing existing ~/.daml ..."
    chmod -R u+w "$HOME/.daml" 2>/dev/null || true
    rm -rf "$HOME/.daml"
  fi

  echo "Extracting SDK ..."
  mkdir -p "$TMPDIR/sdk"
  tar xzf "$TARBALL" -C "$TMPDIR/sdk" --strip-components 1
  "$TMPDIR/sdk/install.sh"
}

download_sdk
install_from_tarball

export PATH="$HOME/.daml/bin:$PATH"
if ! command -v daml >/dev/null 2>&1; then
  echo "Install finished but daml not on PATH."
  echo "Add: export PATH=\"\$HOME/.daml/bin:\$PATH\""
  exit 1
fi

echo ""
daml version
echo ""
echo "Add to ~/.zshrc or ~/.bash_profile:"
echo "  export PATH=\"\$HOME/.daml/bin:\$PATH\""
echo ""
echo "Smoke test:"
echo "  cd /tmp && daml new lv-check --template create-daml-app && cd lv-check && daml start"
