#!/bin/bash
set -euo pipefail

echo "[start_docker.sh] Iniciando script de arranque"

APP_DIR=/var/node/app
cd "$APP_DIR"

npm install

npx prisma generate

npm install -g pm2

npm run build

pm2 delete auth 2>/dev/null || true
pm2 start --name auth "$APP_DIR/dist/src/main.js"

pm2 logs
