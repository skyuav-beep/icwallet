# Backend Service / 백엔드 서비스

NestJS-based API server for IC Wallet. Follow bilingual documentation practices for every module.  
IC 월렛을 위한 NestJS 기반 API 서버입니다. 모든 모듈에 영문/국문 문서화를 적용하세요.

## Commands / 명령어
- `pnpm install` — install dependencies.  
  `pnpm install` — 의존성을 설치합니다.
- `pnpm start:dev` — run the API with file watching.  
  `pnpm start:dev` — 파일 감시 모드로 API를 실행합니다.
- `pnpm build` / `pnpm start:prod` — compile and run production build.  
  `pnpm build` / `pnpm start:prod` — 프로덕션 빌드를 컴파일하고 실행합니다.

## Environment / 환경 변수
Populate `.env.local` (ignored by git) using the root `.env.example`. Required keys include `APP_PORT`, `DB_*`, and external API endpoints.  
루트의 `.env.example`을 참고해 `.env.local`(gitignore 처리)을 채우세요. `APP_PORT`, `DB_*`, 외부 API 엔드포인트 등이 필요합니다.

## Next Steps / 다음 단계
- Add feature modules (auth, wallets, NFTs, P2P, mining, EARN) aligned with `spec.md`.  
  `spec.md`에 맞춰 인증, 지갑, NFT, P2P, 마이닝, EARN 모듈을 추가하세요.
- Wire up Prisma/PostgreSQL configuration and health checks.  
  Prisma/PostgreSQL 설정과 헬스 체크를 연동하세요.
- Implement logging/metrics per `docs/TECH-STACK.md` observability plan.  
  `docs/TECH-STACK.md` 관측성 계획에 따라 로깅·메트릭을 구현하세요.
