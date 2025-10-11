# OTP Persistence & Redis Plan / OTP 영속 저장 및 Redis 계획

## Goals / 목표
- Replace in-memory OTP store with Redis-backed storage.  
  인메모리 OTP 저장소를 Redis 기반으로 교체합니다.
- Support TTL management, replay protection, and audit logging.  
  TTL 관리, 재사용 방지, 감사 로그를 지원합니다.

## Steps / 단계
1. Provision Redis in local (Docker) and staging environments.  
   로컬(Docker)과 스테이징 환경에 Redis를 준비합니다.
2. Create `backend/src/auth/strategies/otp.redis.store.ts` using `@nestjs/cache-manager` or `ioredis`. **(Done)**  
   `@nestjs/cache-manager` 또는 `ioredis`를 사용해 Redis 기반 OTP 저장소를 구현합니다.
3. Store OTP with `SET key value EX ttl NX` and remove entries once verified (future: add short-lived reuse flag). **(In progress)**  
   Redis `SET key value EX ttl NX` 명령으로 OTP를 저장하고, 확인 시 삭제합니다(차후 짧은 TTL 플래그 추가 예정).
4. Add structured logging for OTP generation/verification events (no raw OTP values).  
   OTP 생성/검증 이벤트에 대한 구조화 로그(원문 저장 금지)를 추가합니다.
5. Update tests to mock Redis interactions and cover expiry behavior.  
   테스트에서 Redis 상호작용을 모킹하고 만료 동작을 검증합니다.

## Security Notes / 보안 참고
- Encrypt OTP payloads if policy requires; enforce rate limit on verification attempts.  
  정책상 필요하면 OTP 페이로드를 암호화하고 검증 시도에 레이트 리미트를 적용합니다.
- Rotate Redis credentials periodically per `docs/SECRET-MGMT.md`.  
  `docs/SECRET-MGMT.md`에 따라 Redis 자격 증명을 주기적으로 교체합니다.
