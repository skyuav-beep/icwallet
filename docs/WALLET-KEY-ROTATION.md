# Wallet Key Rotation Plan / 지갑 키 로테이션 계획

## Rotation Triggers / 로테이션 트리거
- Scheduled rotation every 90 days per compliance.  
  규정상 90일마다 교체.
- Incident response (suspected compromise, abnormal access).  
  이상 징후나 유출 의심 시 즉시 교체.

## Workflow / 절차
1. Call mblockapi `refreshWallet` with existing `walletKey`.  
   기존 키로 `refreshWallet` API 호출.
2. Receive new `walletKey`, encrypt via `EncryptionService`, update Prisma record.  
   새 키 암호화 후 Prisma에 저장.
3. Invalidate old decrypted caches and notify dependent services (P2P, Store).  
   캐시 폐기 및 연동 서비스 알림.
4. Log rotation event (memberId, walletId, timestamp) in `AuditLog`.  
   감사 로그 기록.

## Automation / 자동화
- Background job (e.g., Nest schedule or queue) scanning wallets older than 90 days.  
  90일 이상 경과 지갑을 스캔하는 백그라운드 잡.
- Retry policy: 3 attempts with exponential backoff; send alert on failure.  
  재시도 3회, 실패 시 알림.
- Store rotation history in `WalletRotationLog` (walletId, oldKeyHash, newKeyHash, rotatedAt).  
  로테이션 이력을 저장하는 테이블 도입.

## Security Notes / 보안 참고
- Never log raw walletKey; hash for verification if needed.  
  원본 키 로그 금지, 필요 시 해시 비교.
- Rotate `WALLET_KEY_ENCRYPTION_SECRET` (KMS) annually with dual control.  
  암호화 키도 연 1회 이중 승인으로 교체.
