#!/usr/bin/env bash

# 3A-Factory installer — thin wrapper around scripts/install.js

set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INSTALL_JS="$SCRIPT_DIR/install.js"

if [[ ! -f "$INSTALL_JS" ]]; then
  echo "[ERROR] install.js not found: $INSTALL_JS" >&2
  exit 1
fi

if ! command -v node >/dev/null 2>&1; then
  echo "[ERROR] Node.js is required. Install Node then retry." >&2
  exit 1
fi

export INIT_CWD="${INIT_CWD:-$(pwd)}"
exec node "$INSTALL_JS" "$@"
