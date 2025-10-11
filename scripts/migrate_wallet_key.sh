#!/usr/bin/env bash
set -euo pipefail
PG_CONTAINER=icwallet-db
if ! docker ps -a | grep -q "$PG_CONTAINER"; then
  docker run --name "$PG_CONTAINER" \
    -e POSTGRES_USER=icwallet_app \
    -e POSTGRES_PASSWORD=change_me \
    -e POSTGRES_DB=icwallet \
    -p 5432:5432 -d postgres:15
else
  docker start "$PG_CONTAINER"
fi
export DATABASE_URL="postgresql://icwallet_app:change_me@localhost:5432/icwallet?schema=public"
cd backend
pnpm prisma migrate dev --name add_wallet_key
