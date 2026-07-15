#!/bin/bash
set -euo pipefail

directorio="${BACKUP_DIR:-/backups}"
dia=$(date +%d)
mes=$(date +%m)
ano=$(date +%Y)
horas=$(date +%H)
minutos=$(date +%M)
segundos=$(date +%S)

export PGPASSWORD="${PGPASSWORD:-${DB_PASSWORD:?Defina PGPASSWORD o DB_PASSWORD}}"
export PGDATABASE="${PGDATABASE:-${DB_DATABASE:?Defina PGDATABASE o DB_DATABASE}}"
export PGUSER="${PGUSER:-${DB_USER:-desa}}"
export PGHOST="${PGHOST:-${DB_HOST:-localhost}}"
export PGPORT="${PGPORT:-${DB_PORT:-5432}}"

filename="bk_produccion${dia}${mes}${ano}${horas}${minutos}${segundos}_.sql"

pg_dump -U "$PGUSER" -p "$PGPORT" --no-password -h "$PGHOST" --column-inserts -Fp -f "$directorio/$filename"

echo "Backup guardado en: $directorio/$filename"
