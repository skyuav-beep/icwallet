# Prisma Migration Plan / Prisma 마이그레이션 계획

This document outlines how to evolve the PostgreSQL schema defined in `backend/prisma/schema.prisma`.  
본 문서는 `backend/prisma/schema.prisma`에 정의된 PostgreSQL 스키마를 발전시키는 절차를 정리합니다.

## Local Workflow / 로컬 워크플로
1. Duplicate `.env.example` to `.env.local` and update `DATABASE_URL`.  
   `.env.example`을 `.env.local`로 복사하고 `DATABASE_URL`을 수정합니다.
2. Start a local Postgres instance (Docker Compose or managed service).  
   로컬 Postgres 인스턴스를 실행합니다(Docker Compose 또는 매니지드 서비스).
3. Run `pnpm prisma migrate dev --name add_wallet_key` from `backend/`. (**Requires running Postgres `DATABASE_URL`**)  
   `backend/`에서 `pnpm prisma migrate dev --name add_wallet_key`을 실행합니다 (Postgres `DATABASE_URL` 필요).
4. Confirm generated SQL under `backend/prisma/migrations/`.  
   생성된 SQL이 `backend/prisma/migrations/`에 위치하는지 확인합니다.
5. Execute `pnpm prisma db seed` once seeding script is added.  
   시드 스크립트 추가 후 `pnpm prisma db seed`를 실행합니다.

## Environments / 환경 구분
- **Development**: Shared dev DB with feature branches running `migrate dev`.  
  **개발**: 공유 개발 DB에서 기능 브랜치가 `migrate dev`를 실행합니다.
- **Staging**: CI/CD runs `pnpm prisma migrate deploy`.  
  **스테이징**: CI/CD가 `pnpm prisma migrate deploy`를 실행합니다.
- **Production**: Manual approval before `migrate deploy`; capture migration logs.  
  **프로덕션**: `migrate deploy` 전 수동 승인, 마이그레이션 로그를 기록합니다.

## Rollback Strategy / 롤백 전략
- Prefer forward-only migrations; use `prisma migrate resolve --rolled-back` after manual fixes.  
  가능한 한 전진형 마이그레이션을 사용하고 수동 수정 후 `prisma migrate resolve --rolled-back`를 활용합니다.
- Keep backups per migration window (pg_dump or cloud snapshots).  
  마이그레이션 창마다 백업(pg_dump 또는 클라우드 스냅샷)을 유지합니다.

## Next Steps / 다음 단계
- Add seed data for reference wallets, merchants, and admin accounts.  
  기준 지갑·가맹점·관리자 계정 시드 데이터를 추가하세요.
- Integrate migration commands into CI before deploy stages.  
  배포 단계 전 CI에서 마이그레이션 명령을 실행하도록 연동하세요.
- Document migration approvals in release notes per `SECRET-MGMT.md`.  
  `SECRET-MGMT.md` 정책에 따라 릴리스 노트에 승인 내역을 기록하세요.
- Pending migration: run `pnpm --filter backend prisma migrate deploy` (or `migrate dev`) to apply `20251011132000_add_member_roles` once database access is available.  
  보류 중인 마이그레이션: 데이터베이스에 접근 가능해지면 `pnpm --filter backend prisma migrate deploy`(또는 `migrate dev`)로 `20251011132000_add_member_roles`를 적용하세요.
- Pending migration: apply `20251011140000_withdrawal_multisig` to add finance multi-signature tables and columns for withdrawal checkpoints.  
  보류 중인 마이그레이션: `20251011140000_withdrawal_multisig`을 적용해 출금 체크포인트 다중 서명 테이블과 컬럼을 추가하세요.
