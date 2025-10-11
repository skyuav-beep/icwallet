# Testing & CI Strategy / 테스트 및 CI 전략

This strategy extends current scripts (`package.json`, `backend/package.json`, `contracts/foundry.toml`) into a pipeline-ready plan.  
본 전략은 현재 스크립트를 파이프라인에 맞게 확장하는 방법을 설명합니다.

## Test Layers / 테스트 계층
| Layer | Purpose | Status | Next Actions |
| --- | --- | --- | --- |
| Unit (Vitest, Foundry) / 단위 | Validate services & contracts | Auth service tests added | Expand to wallet services, DTO validation, smart contract edge cases |
| Integration / 통합 | Prisma + external API mocks | Pending | Use docker-compose Postgres, mock mblockapi/Hashdam |
| E2E / 종단간 | API + UI flows | Pending | Use Nest testing module + Playwright for Next.js |

## CI Pipeline Outline / CI 파이프라인 개요
1. **Install** – `pnpm install --frozen-lockfile`  
   설치 단계: `pnpm install --frozen-lockfile`
2. **Lint** – `pnpm lint` (root runs nested lint)  
   린트 단계: 루트 `pnpm lint`로 하위 워크스페이스 린트 수행
3. **Test** – `pnpm test` for backend, `forge test` for contracts, `pnpm test` (future) for frontend  
   테스트 단계: 백엔드 `pnpm test`, 컨트랙트 `forge test`, 향후 프런트엔드 테스트
4. **Build** – `pnpm build` to ensure artifacts compile  
   빌드 단계: `pnpm build`로 아티팩트 컴파일 확인
5. **Deploy** (staging/prod) – run Prisma migrate + app deploy  
   배포 단계: Prisma 마이그레이션 후 애플리케이션 배포

### Migration Automation / 마이그레이션 자동화
- Staging: add CI job `pnpm --filter backend prisma:migrate` with sandbox DB.  
  스테이징: CI 잡에서 `pnpm --filter backend prisma:migrate` 실행(샌드박스 DB 사용).
- Production: require manual approval + backup step before running `prisma migrate deploy`.  
  프로덕션: `prisma migrate deploy` 실행 전 수동 승인 및 백업 절차를 요구합니다.
- Record migration logs as artifacts and notify ops channel on completion.  
  마이그레이션 로그를 아티팩트로 보존하고 완료 시 운영 채널에 알림을 전송합니다.

## Tooling Recommendations / 도구 추천
- Use GitHub Actions with matrix runs (backend, frontend, contracts).  
  GitHub Actions 매트릭스 실행(백엔드, 프런트엔드, 컨트랙트)을 권장합니다.
- Cache pnpm store (`pnpm store path`) and Forge artifacts (`contracts/cache`).  
  pnpm 저장소와 Forge 아티팩트를 캐시하세요.
- Fail fast on lint/test, gate deployment on success.  
  린트/테스트 실패 시 즉시 중단하고 성공 시에만 배포를 진행합니다.

## Future Enhancements / 향후 개선
- Add coverage reports (Vitest + Istanbul) and upload to codecov.  
  커버리지 리포트를 생성해 codecov에 업로드합니다.
- Integrate contract verification steps after deployment.  
  배포 후 컨트랙트 검증 단계를 연동합니다.
- Include smoke tests post-deploy using synthetic monitoring (Checkly/Pingdom).  
  배포 후 합성 모니터링으로 스모크 테스트를 추가합니다.
- Optional: gate live mblockapi tests behind `RUN_MBLOCK_TESTS` flag to avoid external calls in CI.  
  선택적으로 `RUN_MBLOCK_TESTS` 플래그로 라이브 mblockapi 테스트 실행을 제어합니다.
- Automate Prisma migrations in staging CI with manual approval gates for production.  
  스테이징 CI에서 Prisma 마이그레이션을 자동화하고 프로덕션은 수동 승인 게이트를 둡니다.
- Example matrix: `{ mblock: [false, true] }` with `RUN_MBLOCK_TESTS=${{ matrix.mblock }}` and conditional job for live calls.  
  예시 매트릭스: `{ mblock: [false, true] }`로 설정하고 `RUN_MBLOCK_TESTS=${{ matrix.mblock }}`로 분기하여 라이브 호출 전용 잡을 실행합니다.

```yaml
jobs:
  backend-tests:
    strategy:
      matrix:
        mblock: [false, true]
    env:
      RUN_MBLOCK_TESTS: ${{ matrix.mblock }}
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm test
        if: matrix.mblock == 'false'
      - run: pnpm test src/adapters/mblockapi/mblockapi.spec.ts
        if: matrix.mblock == 'true'
```
