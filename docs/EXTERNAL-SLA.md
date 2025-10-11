# External Integrations SLA & Security / 외부 연동 SLA 및 보안

## mblockapi
- **Availability**: target 99.5% uptime for wallet creation & balance endpoints.  
  지갑 발급/잔액 API 가용성 99.5% 목표.
- **Retry Policy**: exponential backoff (50ms base, max 4 attempts).  
  50ms 기반 지수 백오프, 최대 4회 재시도.
- **Security**: `X-MBLOCK-Key` header, allowlisted IPs per provider. Store keys via KMS.  
  헤더 인증, IP 화이트리스트, KMS로 키 관리.
- **Monitoring**: log failures, alert if error rate >2% over 5 minutes.  
  오류율 2% 초과 시 알림.

## Hashdam API
- **Availability**: 99% daily availability for hashpower stats.  
  해시파워 통계 일일 가용성 99%.
- **Retry**: two retries with 200ms delay; fallback cached data within 1 hour.  
  200ms 간격 2회 재시도, 1시간 이내 캐시 활용.
- **Security**: API key + HTTPS; no secrets in logs.  
  API 키와 HTTPS 사용, 로그에 키 기록 금지.

## Coupon Provider API
- **Availability**: 99% uptime; queue requests when provider down.  
  가용성 99%, 장애 시 큐에 저장.
- **Idempotency**: use provider order ID to prevent duplicate issuance.  
  주문 ID로 중복 발급 방지.
- **Security**: mTLS or IP allowlist per provider, store credentials with Secrets Manager.  
  mTLS/IP 제한, 시크릿 매니저 관리.

## CoinEx Integration
- **Availability**: 99.5% for withdrawal requests; manual fallback if provider offline >15m.  
  출금 API 99.5% 가용성, 15분 이상 장애 시 수동 처리.
- **Security**: enforce withdrawal whitelist & 2FA; audit every API call.  
  화이트리스트 및 2FA, 호출 감사 로그 남김.
- **Execution Pipeline**: dispatcher batches approved withdrawals, retries up to 3 times, records attempts in metadata.  
  실행 파이프라인은 승인된 출금을 배치로 전송하며 최대 3회 재시도 후 메타데이터에 기록합니다.

Review these targets quarterly and align incident response with `docs/SECRET-MGMT.md`.  
분기별로 SLA를 재검토하고 `docs/SECRET-MGMT.md` 대응 절차와 맞추세요.
