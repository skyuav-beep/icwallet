# Local PostgreSQL Setup for Prisma Migrations / Prisma 마이그레이션을 위한 로컬 PostgreSQL 설정

## Quickstart / 빠른 시작
1. `docker`가 설치되어 있다면 아래 명령으로 Postgres를 실행하세요. (5432 포트가 이미 사용 중이면 `-p 55432:5432` 등 다른 포트를 사용하세요.)
   ```bash
   docker run --name icwallet-db \
     -e POSTGRES_USER=icwallet_app \
     -e POSTGRES_PASSWORD=change_me \
     -e POSTGRES_DB=icwallet \
     -p 55432:5432 -d postgres:15
   ```
2. `backend/.env.local`에 `DATABASE_URL=postgresql://icwallet_app:change_me@localhost:55432/icwallet?schema=public`를 추가합니다.
3. `backend/`에서 `pnpm prisma migrate dev --name init_identity` 명령으로 최초 마이그레이션을 생성·적용하고, 이후 변경사항마다 적절한 이름으로 반복 적용하세요.

## Alternative / 대안
- Docker 사용이 어렵다면 팀에서 제공하는 개발용 DB 접속 정보를 받아 `DATABASE_URL`을 갱신한 뒤 동일한 명령을 실행하세요.
- 마이그레이션 후 `pnpm --filter backend db:seed`로 기본 Role/Permission, 네트워크 설정, 토큰, 회사 설정을 삽입합니다(`DATABASE_URL` 필요).
