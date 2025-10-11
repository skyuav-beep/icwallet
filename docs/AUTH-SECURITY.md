# Auth Security Enhancements / 인증 보안 강화 계획

This document expands on remaining security backlog entries for the authentication module.  
본 문서는 인증 모듈의 보안 관련 백로그 항목을 상세화합니다.

## 2FA Roadmap / 2FA 로드맵
- [x] Support email-based OTP delivery using transactional provider (prototype store).  
  트랜잭션 메일 서비스를 활용한 이메일 OTP 발송을 구현합니다.
- [ ] Integrate TOTP (RFC 6238) via authenticator apps with recovery codes.  
  인증 앱 기반 TOTP(RFC 6238)를 도입하고 복구 코드를 제공합니다.
- [ ] Store 2FA secrets encrypted in database (Prisma + KMS).  
  Prisma와 KMS를 이용해 2FA 시크릿을 암호화 저장합니다.
- [ ] Add enforcement policies (required for withdrawals/admin access).  
  출금/관리자 접근 시 2FA 필수 정책을 적용합니다.

## Rate Limiting & Monitoring / 레이트 리미팅 및 모니터링
- [x] Apply Nest rate limiter (`@nestjs/throttler`) on auth endpoints with per-IP quotas.  
  인증 엔드포인트에 `@nestjs/throttler`를 적용하고 IP별 쿼터를 설정했습니다.
- [ ] Track failed login attempts and trigger alert thresholds.  
  로그인 실패 횟수를 추적하고 경보 기준을 설정합니다.
- [ ] Forward security events to monitoring stack (Loki/Prometheus).  
  보안 이벤트를 Loki/Prometheus 모니터링 스택으로 전송합니다.
- [ ] Document incident response for credential stuffing.  
  크리덴셜 스터핑 대응 절차를 문서화합니다.

Revisit this checklist after implementing each milestone and sync status with `docs/AUTH-WALLET-NEXT.md`.  
각 단계 구현 후 본 체크리스트를 검토하고 `docs/AUTH-WALLET-NEXT.md`와 상태를 동기화하세요.
