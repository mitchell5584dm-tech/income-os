#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
PORT="${PORT:-8765}"
echo "Income OS"
echo "Open:  http://127.0.0.1:${PORT}/"
echo "Stop:  Ctrl+C"
python3 -m http.server "$PORT" --bind 127.0.0.1
