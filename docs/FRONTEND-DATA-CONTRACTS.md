# Frontend Data Contracts / 프런트엔드 데이터 계약

This document captures the shared frontend data models introduced in `frontend/lib/api/contracts.ts` and aligns them with backend API plans from `spec.md` and `docs/BACKEND-NEXT-STEPS.md`. Update both TypeScript types and this document together whenever payloads change.  
본 문서는 `frontend/lib/api/contracts.ts`에 정의된 프런트엔드 공통 데이터 모델을 `spec.md`, `docs/BACKEND-NEXT-STEPS.md`의 백엔드 계획과 맵핑합니다. 페이로드가 변하면 TypeScript 타입과 본 문서를 함께 갱신하세요.

## 1. Wallet & User Surface / 지갑·사용자 화면

| Contract | Description (EN) | 설명 (KR) | Backend Source |
|----------|------------------|-----------|----------------|
| `WalletOverviewPayload` | Aggregates per-network balances, preferred network, and surface alerts (whitelist, pending approvals). | 네트워크별 잔액, 기본 네트워크, 화이트리스트·승인 대기 등의 경고 정보를 제공합니다. | Upcoming wallet REST (`/api/v1/wallets/overview`) |
| `WalletBalanceSnapshot` | Captures token/NFT balance with localized display names and fiat approximation. | 토큰·NFT 잔액과 현지화된 표기, 법정 화폐 환산값을 포함합니다. | Same as above, plus mblockapi adapter |
| `WalletAlert` | Ties UI banners to operational warnings or degraded external services. | 운영 경고나 외부 서비스 저하를 UI 배너와 연결합니다. | Wallet service + monitoring signals |

## 2. NFT Marketplace / NFT 마켓

- `NftCatalogItem` mirrors product metadata from admin NFT definitions (time-lock, supply, merchant labels).  
  `NftCatalogItem`은 관리자 NFT 정의(타임락, 재고, 가맹점 명칭)를 반영합니다.
- `NftPurchaseReceipt` feeds the order history and redemption timeline.  
  `NftPurchaseReceipt`는 주문 기록 및 사용 타임라인에 사용됩니다.

Expected API endpoints:  
예상 API 엔드포인트:
- `GET /api/v1/nft/catalog` → `NftCatalogItem[]`
- `GET /api/v1/nft/orders` → `NftPurchaseReceipt[]`

## 3. P2P & Escrow / P2P 및 에스크로

- `P2POrderSummary` consolidates order status, escrow state, and dispute indicator (used in both user and admin consoles).  
  `P2POrderSummary`는 주문 상태, 에스크로 상태, 분쟁 여부를 통합하며 사용자·관리자 콘솔 모두에서 사용됩니다.
- WebSocket payloads should reuse this structure for real-time updates.  
  실시간 업데이트용 WebSocket 페이로드도 동일 구조를 재사용하세요.

## 4. Mining & EARN / 마이닝 및 재테크

| Contract | Description (EN) | 설명 (KR) |
|----------|------------------|-----------|
| `MiningSnapshot` | Displays per-asset balances and 24h metrics from Hashdam sync jobs. | 해시다힘 동기화 작업에서 가져온 자산별 잔액 및 24시간 지표를 표시합니다. |
| `HashpowerPosition` | Tracks purchased or rewarded hashpower units. | 구매·보상으로 획득한 해시파워 단위를 추적합니다. |
| `EarnProduct` | Normalizes staking, lending, loan offerings with bilingual labels. | 스테이킹·랜딩·론 상품을 양언어 레이블로 정규화합니다. |

## 5. Merchant Portal / 가맹점 포털

- `MerchantKpiSummary`: Dashboard tiles for daily sales, voucher redemption, settlement alerts.  
  일일 매출, 상품권 사용, 정산 알림에 대한 대시보드 타일을 구성합니다.
- `MerchantSettlementBatch`: Mirrors admin settlement workflow states for transparency.  
  관리자 정산 워크플로 상태를 반영해 투명성을 제공합니다.
- `MerchantSupportTicket`: Aligns with shared support module backlog.  
  공통 고객지원 모듈 백로그와 동일한 구조를 유지합니다.

## 6. Admin Console / 관리자 콘솔

- `AdminRiskAlert`: wraps monitoring and SLA breach notifications.  
  모니터링·SLA 위반 알림을 감싸는 구조입니다.
- `ApprovalQueueItem`: covers withdrawals, settlements, escrow decisions, KYC, RBAC changes.  
  출금, 정산, 에스크로, KYC, RBAC 변경 승인 대기를 포함합니다.
- `AuditLogEntry`: matches requirements in `docs/RBAC-AUDIT-POLICY.md`.  
  `docs/RBAC-AUDIT-POLICY.md`의 요건과 일치하도록 구성했습니다.

## 7. Implementation Notes / 구현 메모

1. Update `frontend/lib/api/contracts.ts` and backend DTO/Swagger definitions in lockstep.  
   `frontend/lib/api/contracts.ts`와 백엔드 DTO·Swagger 정의를 동시에 갱신하세요.
2. Keep bilingual strings close to data until i18n resources are formalized (see Section 8).  
   i18n 리소스가 정비될 때까지는 양언어 문자열을 데이터에 포함해 유지하세요.
3. When adding new portals/features, extend `PortalApiShape` to ensure typed coverage.  
   신규 포털·기능 추가 시 `PortalApiShape`를 확장해 타입 커버리지를 확보하세요.
4. The wallet overview endpoint (`GET /api/v1/wallets/overview`) now returns placeholder balance snapshots aligned with `WalletOverviewPayload`; expand the payload as backend aggregation matures.  
   `GET /api/v1/wallets/overview` 엔드포인트가 `WalletOverviewPayload` 구조에 맞춰 잔액 스냅샷 플레이스홀더를 반환하므로, 백엔드 집계가 고도화될 때 페이로드를 확장하세요.

## 8. Next Steps for i18n / 향후 다국어 계획

The forthcoming i18n provider will parse resource keys instead of raw strings; plan to migrate `labelKr`, `messageKr`, etc., to translation tokens while keeping this document as the mapping source.  
향후 도입할 i18n Provider는 직접 문자열 대신 리소스 키를 활용하므로 `labelKr`, `messageKr` 등의 필드를 번역 토큰으로 이전할 계획을 세우고, 이 문서를 매핑 기준으로 유지하세요.
