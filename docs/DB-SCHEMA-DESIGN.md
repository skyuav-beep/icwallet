# PostgreSQL Schema Design / PostgreSQL 스키마 설계

This document describes the relational schema that backs the IC Wallet backend. It aligns with `backend/prisma/schema.prisma` and expands on `spec.md` §11 and `docs/ERD-NOTES.md`.  
본 문서는 IC 월렛 백엔드가 사용하는 관계형 스키마를 설명하며 `backend/prisma/schema.prisma`, `spec.md` 11장, `docs/ERD-NOTES.md` 내용을 구체화합니다.

## 1. Identity & Security / 정체 및 보안
- **Member**: login credential (`email`, `passwordHash`), compliance fields (`kycStatus`, `preferredLang`), relation hub for downstream domains.  
  로그인 정보, 준법 필드, 후속 도메인과의 관계 허브 역할을 수행합니다.
- **MemberProfile**: personally identifiable metadata (name, nationality, document numbers). One-to-one with Member.  
  실명, 국적, 증빙 정보를 담는 1:1 확장 테이블입니다.
- **KycSubmission**: third-party KYC provider snapshots with status transitions.  
  외부 KYC 벤더 결과 스냅샷과 상태 변화를 저장합니다.
- **AuthFactor**, **DeviceSession**, **LoginAttempt**: 2FA 시크릿, 신뢰 기기, 로그인 시도 추적.  
  2FA 비밀값, 신뢰 기기, 로그인 시도를 분리 관리합니다.
- **AdminUser**, **Role**, **Permission**, **RolePermission**, **MemberRole**, **ServiceAccount**: Structure RBAC coverage for admin, member, and service accounts.  
  **AdminUser**, **Role**, **Permission**, **RolePermission**, **MemberRole**, **ServiceAccount**: RBAC와 회원/서비스 계정 권한을 구조화.  
  RBAC 및 서비스 계정을 구조화한 테이블 세트입니다.
- **AuditLog**: 모든 고위험 이벤트에 대한 행위자/대상/결과/메타데이터 기록. `actorType`과 `targetType` 인덱싱.  
  고위험 이벤트를 저장하고 `actorType`, `targetType`에 인덱스를 둡니다.

## 2. Wallet & Asset / 지갑 및 자산
- **Wallet**: 회원별 네트워크 지갑 레코드. `WalletRotationLog`로 키 교체 이력 추적.  
  회원-네트워크 지갑을 관리하며 키 교체 로그를 남깁니다.
- **WalletNetworkSetting**: 네트워크별 체인 ID, 점검 상태, 출금 정책.  
  네트워크 특성을 중앙에서 관리합니다.
- **Token**, **TokenPriceSnapshot**: 등록 토큰과 시세 스냅샷.  
  토큰 레지스트리와 시세 기록입니다.
- **BalanceSnapshot**: 자산별 잔액 변화를 이력으로 저장.  
  자산 잔액을 시점별로 기록합니다.
- **WhitelistAddress**: 화이트리스트 주소 승인 상태.  
  출금 허용 주소와 승인 내역을 저장합니다.

## 3. NFT, Merchant, Settlement / NFT·가맹점·정산
- **NFTCollection**, **GiftSpec**, **CouponSpec**, **NFToken**: 발행 컬렉션, 상품 스펙, 개별 NFT 라이프사이클.  
  컬렉션과 상품 정의, NFT 상태를 관리합니다.
- **Merchant**, **MerchantUser**, **MerchantWebhook**, **MerchantCatalogItem**: 가맹점 마스터, 직원 계정, 웹훅, 스토어 상품.  
  가맹점 운영과 연동 정보를 구조화합니다.
- **RedeemLog**, **Settlement**, **SettlementLine**: 사용 로그, 정산 헤더, 라인 아이템을 분리해 회계 데이터 관리.  
  사용 및 정산 데이터를 체계적으로 기록합니다.

## 4. P2P Trading / P2P 거래
- **P2POrder**: 게시된 매수/매도 주문.  
  공개 주문 정보를 저장합니다.
- **Escrow**, **EscrowTransfer**: 주문 체결 후 에스크로 상태 및 온/오프체인 전송 내역.  
  에스크로 상태 기계와 전송 기록을 관리합니다.
- **P2PChat**, **Dispute**, **DisputeEvidence**: 채팅·분쟁 기록과 증빙 자료.  
  분쟁 처리와 증빙 관리를 위한 테이블입니다.

## 5. Mining / 마이닝
- **Hashpower**, **HashpowerTxn**: 해시파워 잔고와 거래 내역.  
  해시파워 보유량 및 취득 이력을 저장합니다.
- **MiningStatDaily**, **MiningBalance**: Hashdam 연동 데이터(일일 통계, 코인별 잔액).  
  일일 통계와 코인 잔액을 동기화합니다.
- **WithdrawalRequest**, **WithdrawalCheckpoint**: CoinEx 출금 요청과 단계별 승인 체크포인트.  
  출금 요청 및 2FA/화이트리스트/컴플라이언스 절차를 기록합니다.
- **WithdrawalCheckpointSignature**: multi-signature approvals (admin, decision, note, timestamp) per compliance policy.  
  복수 서명(관리자·결정·메모·시간)을 기록해 재무 컴플라이언스를 충족합니다.

## 6. EARN / 재테크
- **StakingProduct**, **StakingPosition**: 스테이킹 상품과 회원 포지션.  
  스테이킹 상품 정의와 참여 내역입니다.
- **LendingOffer**, **LendingLoan**: 회원 간 대여 제안과 매칭된 대출.  
  랜딩 공급과 실행 데이터를 저장합니다.
- **LoanProduct**, **LoanApplication**: 회사 상품과 신청/심사 기록.  
  회사 대출 상품과 신청 절차를 관리합니다.

## 7. Store & External Providers / 스토어·외부 공급사
- **CouponProvider**, **StoreItem**, **StoreOrder**: 외부 쿠폰 공급사, 상품, 구매/전달 상태.  
  외부 쿠폰몰 연동과 주문 상태를 표현합니다.
- **ProviderReconciliation**: 공급사 정산 대비 기록 및 해시.  
  정산 대비 작업과 결과를 추적합니다.

## 8. Content & Support / 콘텐츠·지원
- **Notice**, **NoticeRead**: 공지 게시 및 열람 이력.  
  공지 발행과 읽음 기록을 관리합니다.
- **Inquiry**, **SupportAttachment**: 고객 문의와 첨부 파일.  
  문의 처리 및 증빙 첨부를 저장합니다.
- **CompanySetting**, **Term**: 시스템 전역 설정, 법적 문서 버전 관리.  
  회사 설정과 법적 문서를 버전으로 관리합니다.

## 9. Migration Strategy / 마이그레이션 전략
- **Sequencing**: apply in domain batches (identity → wallet → merchant → P2P → mining → EARN → store → support). Each batch should run via `pnpm prisma migrate dev`.  
  **순서**: 도메인별 배치(정체→지갑→가맹점→P2P→마이닝→EARN→스토어→지원)로 적용하고 각 배치는 `pnpm prisma migrate dev`로 실행합니다.
- **Reference Data**: seed `Role`, `Permission`, `WalletNetworkSetting`, baseline `Token`, and initial `CompanySetting` values.  
  **기준 데이터**: `Role`, `Permission`, `WalletNetworkSetting`, 기본 `Token`, `CompanySetting` 값을 시드합니다.
- **Backfill**: when importing legacy data, populate `AuditLog` with synthetic entries referencing `actorType = SERVICE`.  
  **데이터 이관**: 레거시 데이터를 들여올 때 `actorType = SERVICE`로 합성 감사 로그를 기록합니다.
- **Validation**: run `pnpm prisma migrate diff --from-empty --to-schema-datamodel` to review SQL before first deployment.  
  **검증**: 최초 배포 전 `pnpm prisma migrate diff --from-empty --to-schema-datamodel`로 SQL을 검증합니다.

Sync this document whenever schema changes or new compliance requirements emerge, and update `TASK.md` once each domain’s migration is implemented.  
스키마 변경이나 규제 요구가 생길 때마다 본 문서를 갱신하고, 각 도메인 마이그레이션을 구현할 때 `TASK.md` 상태를 업데이트하세요.
