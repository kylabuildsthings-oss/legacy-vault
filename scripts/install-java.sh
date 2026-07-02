#!/usr/bin/env bash
# Install Eclipse Temurin JDK 17 to ~/.jdk (no sudo). Used by Phase 0 / Daml setup.
set -euo pipefail

JDK_DIR="${JAVA_INSTALL_DIR:-$HOME/.jdk}"
TARBALL="${TMPDIR:-/tmp}/temurin17.tar.gz"
URL="https://api.adoptium.net/v3/binary/latest/17/ga/mac/aarch64/jdk/hotspot/normal/eclipse?project=jdk"

if [[ "$(uname -m)" != "arm64" ]]; then
  echo "This script targets macOS Apple Silicon (arm64)."
  echo "Install JDK 17 manually — see docs/legacy-vault/DAML_SETUP.md"
  exit 1
fi

mkdir -p "$JDK_DIR"

if command -v java >/dev/null 2>&1 && java -version 2>&1 | grep -qE 'version "17'; then
  echo "Java 17 already on PATH: $(java -version 2>&1 | head -1)"
  exit 0
fi

existing="$(ls -d "$JDK_DIR"/jdk-17* 2>/dev/null | head -1 || true)"
if [[ -n "$existing" ]]; then
  candidate="$existing"
  if [[ -x "$candidate/Contents/Home/bin/java" ]]; then
    candidate="$candidate/Contents/Home"
  fi
  if [[ -x "$candidate/bin/java" ]]; then
    echo "JDK already extracted at $candidate"
    echo "Run: export JAVA_HOME=$candidate && export PATH=\"\$JAVA_HOME/bin:\$PATH\""
    exit 0
  fi
fi

echo "Downloading Temurin JDK 17 to $TARBALL ..."
if [[ -f "$TARBALL" ]]; then
  curl --http1.1 -C - -fsSL "$URL" -o "$TARBALL" || {
    echo "Resume failed; retrying fresh download ..."
    rm -f "$TARBALL"
    curl --http1.1 -fsSL "$URL" -o "$TARBALL"
  }
else
  curl --http1.1 -fsSL "$URL" -o "$TARBALL"
fi

echo "Extracting to $JDK_DIR ..."
tar -xzf "$TARBALL" -C "$JDK_DIR"
JAVA_HOME="$(ls -d "$JDK_DIR"/jdk-17* | head -1)"
if [[ -d "$JAVA_HOME/Contents/Home" ]]; then
  JAVA_HOME="$JAVA_HOME/Contents/Home"
fi

echo ""
echo "Installed: $JAVA_HOME"
"$JAVA_HOME/bin/java" -version
echo ""
echo "Add to ~/.zshrc or ~/.bash_profile:"
echo "  export JAVA_HOME=$JAVA_HOME"
echo "  export PATH=\"\$JAVA_HOME/bin:\$PATH\""
