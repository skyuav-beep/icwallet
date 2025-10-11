# Wallet mblockapi Integration Plan / 지갑 mblockapi 연동 계획

This note captures the steps required to connect the wallet module to mblockapi for provisioning and balance sync.  
본 문서는 지갑 모듈이 mblockapi와 연동하여 지갑 발급 및 잔액 동기화를 수행하는 절차를 정리합니다.

## API Coverage / API 범위
- `POST /wallets` — create new BNB wallet (store address, encrypted key).  
  `POST /wallets` — 새로운 BNB 지갑 발급(주소, 암호화 키 저장).
- `GET /wallets/{address}/balances` — fetch token balances (BNB, ERC-20).  
  `GET /wallets/{address}/balances` — 토큰 잔액 조회(BNB, ERC-20).
- Webhooks: `/webhooks/deposit` — detect inbound transfers for ledger updates.  
  웹훅 `/webhooks/deposit` — 입금 감지 및 원장 업데이트.

## Integration Steps / 연동 단계
1. Create `backend/src/adapters/mblockapi` with typed client and DTOs.  
   `backend/src/adapters/mblockapi`에 타입 클라이언트 및 DTO를 작성합니다. **(Done)**
2. Inject client into `WalletService` with retry/backoff & circuit breaker.  
   재시도/백오프, 서킷 브레이커를 포함해 `WalletService`에 클라이언트를 주입합니다. **(In progress)**
3. Persist wallet metadata in Prisma (`Wallet` model already defined).  
   Prisma `Wallet` 모델에 지갑 메타데이터를 저장합니다. **(Done via `WalletService.provisionWallet`)**
4. Implement balance sync job (cron or queue) leveraging `GET /balances`.  
   `GET /balances`를 활용한 잔액 동기화 작업(크론/큐)을 구현합니다.
5. Handle deposit webhook verification & idempotency.  
   웹훅 서명 검증과 멱등 처리 로직을 구현합니다.
6. Add integration tests mocking mblockapi responses (success, failure, retry). **(In progress – live success path covered, mocks pending)**  
   성공/실패/재시도 시나리오를 모킹한 통합 테스트를 추가합니다(라이브 성공 경로 완료, 모킹 기반 실패/재시도 예정).

### Testing Notes / 테스트 주의사항
- Run `RUN_MBLOCK_TESTS=true pnpm test src/adapters/mblockapi/mblockapi.spec.ts` to execute live calls.  
  라이브 호출 테스트는 `RUN_MBLOCK_TESTS=true pnpm test src/adapters/mblockapi/mblockapi.spec.ts` 명령으로 실행합니다.
- Mock suite (`mblockapi.mock.spec.ts`) covers retry/failure logic without network access.  
  모킹 스위트(`mblockapi.mock.spec.ts`)는 네트워크 없이 재시도/실패 로직을 검증합니다.

## Security Notes / 보안 참고
- Store API keys in secrets manager; expose as env `MBLOCK_API_KEY`.  
  API 키는 시크릿 매니저에 보관하고 `MBLOCK_API_KEY` 환경 변수로 주입합니다.
- Encrypt private keys if returned by API & never log sensitive fields.  
  개인키를 암호화 저장하고 민감 값은 로그에 남기지 않습니다.
- Rate limit outgoing calls to avoid provider throttling.  
  제공자 스로틀링을 방지하기 위해 외부 호출을 레이트 리미팅합니다.

Update this plan after the initial client implementation and map progress back to `docs/AUTH-WALLET-NEXT.md`.  
초기 클라이언트 구현 후 본 계획을 업데이트하고 진행 상황을 `docs/AUTH-WALLET-NEXT.md`에 반영하세요.
