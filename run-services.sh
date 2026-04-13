#!/usr/bin/env bash
set -euo pipefail

root_dir="${1:-.}"

if [[ ! -d "$root_dir" ]]; then
  echo "Ruta no valida: $root_dir" >&2
  exit 1
fi

shopt -s nullglob

for dir in "$root_dir"/*; do
  if [[ ! -d "$dir" ]]; then
    continue
  fi

  compose_file=""
  if [[ -f "$dir/docker-compose.yml" ]]; then
    compose_file="$dir/docker-compose.yml"
  elif [[ -f "$dir/docker-compose.yaml" ]]; then
    compose_file="$dir/docker-compose.yaml"
  fi

  echo "==> $dir"

  if [[ -n "$compose_file" ]]; then
    (cd "$dir" && docker compose up -d)
  else
    echo "   - sin docker-compose.yml/.yaml, omito docker compose"
  fi

  if [[ -f "$dir/package.json" ]]; then
    log_file="$(cd "$dir" && pwd)/start-dev.log"
    (cd "$dir" && pnpm start:dev > "$log_file" 2>&1 &)
    echo "   - pnpm start:dev en background (log: $log_file)"
  else
    echo "   - sin package.json, omito pnpm start:dev"
  fi
done
