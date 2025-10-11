# Auth & Wallet Follow-up Tasks / 인증 및 지갑 후속 작업

This backlog refines upcoming work for the modules introduced in `backend/src/auth` and `backend/src/wallet`.  
본 백로그는 `backend/src/auth`, `backend/src/wallet`에 도입한 모듈의 후속 작업을 정리합니다.

## Auth Module / 인증 모듈
- [x] Implement JWT issuance & refresh tokens aligned with security policy.  
  보안 정책에 맞춰 JWT 발급 및 리프레시 토큰을 구현합니다.
- [ ] Add 2FA enrollment/verification endpoints (email + authenticator).  
  2FA 등록/검증 엔드포인트(이메일 및 인증 앱)를 추가합니다.
- [ ] Integrate rate limiting & fraud monitoring hooks.  
  레이트 리미팅과 이상 탐지 훅을 연동합니다.
- [ ] Create e2e tests covering signup/login with Prisma test DB.  
  Prisma 테스트 DB를 활용해 회원가입/로그인 E2E 테스트를 작성합니다.

## Wallet Module / 지갑 모듈
- [x] Scaffold wallet provisioning service calling mblockapi.  
  mblockapi를 호출하는 지갑 발급 서비스를 스캐폴딩합니다.
- [ ] Store wallet metadata in Prisma and surface balances per network.  
  Prisma에 지갑 메타데이터를 저장하고 네트워크별 잔액을 노출합니다.
- [ ] Add swap/transfer request validation (white-list, fee logic).  
  스왑/송금 요청 검증(화이트리스트, 수수료 로직)을 구현합니다.
- [x] Build integration tests using mocked mblockapi responses.  
  모킹된 mblockapi 응답을 사용해 통합 테스트를 작성합니다.

## Cross-cutting / 공통 과제
- [ ] Centralize response DTOs & error handling strategy.  
  응답 DTO와 에러 처리 전략을 중앙화합니다.
- [ ] Document API contracts in OpenAPI specs.  
  API 계약을 OpenAPI 스펙으로 문서화합니다.
- [ ] Align logging/tracing with observability plan (`docs/TECH-STACK.md`).  
  `docs/TECH-STACK.md` 관측성 계획에 따라 로깅/트레이싱을 일치시킵니다.
