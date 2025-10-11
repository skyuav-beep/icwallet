# Wallet Key Storage Policy / 지갑 키 저장 정책

## Objectives / 목표
- Protect walletKey values returned by mblockapi and restrict access to authorized services.  
  mblockapi가 반환하는 walletKey 값을 보호하고 승인된 서비스만 접근하도록 합니다.
- Ensure secure storage, transport, and rotation consistent with `docs/SECRET-MGMT.md`.  
  `docs/SECRET-MGMT.md`와 일치하게 안전한 저장·전송·교체를 보장합니다.

## Storage Strategy / 저장 전략
- Store encrypted walletKey in PostgreSQL (`Wallet` table extension) using per-record AES-GCM.  
  지갑 테이블에 AES-GCM으로 암호화된 walletKey 필드를 추가합니다.
- Manage encryption keys via KMS; expose encryption context (memberId, timestamp) for auditing.  
  KMS를 이용해 암호키를 관리하고 암호화 컨텍스트(memberId, timestamp)를 기록합니다.
- Cache decrypted walletKey only in memory when signing transactions; avoid logging raw values.  
  트랜잭션 서명 시에만 메모리에 복호화 값을 보관하고 로그에 노출하지 않습니다.

## Access Control / 접근 제어
- Service layer validates role-based permissions before retrieving walletKey.  
  서비스 계층에서 역할 기반 권한을 확인한 뒤 walletKey를 조회합니다.
- Track walletKey access events in audit logs with actor details.  
  액세스 이벤트를 감사 로그에 기록해 누구가 조회했는지 추적합니다.

## Rotation / 교체
- Use `refreshWallet` method to rotate on schedule or incident response.  
  정기 점검 또는 사고 대응 시 `refreshWallet` API로 교체합니다.
- Update encrypted storage immediately after rotation and notify dependent services.  
  교체 후 암호화 저장값을 즉시 갱신하고 관련 서비스에 알립니다.

## TODO / 추후 작업
- Implement rotation job that calls `refreshWallet` and re-encrypts new keys.  
  `refreshWallet` 호출 후 새 키를 재암호화하는 로테이션 잡을 구현합니다.
- Store KMS key ARN in configuration and audit rotations.  
  KMS 키 ARN을 설정에 저장하고 로테이션 이벤트를 감사 로그로 남깁니다.
