# Backend Remaining Tasks / 백엔드 남은 작업

## Admin APIs
- ✅ Scaffolded read-only admin endpoints for members, merchants, wallets, P2P, mining, EARN, store, and policy resources.  
  ✅ 회원·가맹점·지갑·P2P·마이닝·EARN·스토어·정책 리소스를 조회할 수 있는 관리자 읽기 전용 엔드포인트를 스캐폴딩했습니다.
- ✅ Added approval endpoints for withdrawals, settlements, and P2P escrow release/refund with audit logging.  
  ✅ 출금·정산·P2P 에스크로 해제/환불 승인 엔드포인트와 감사 로그 연동을 추가했습니다.
- ✅ Member management (search, status update, role assignment).  
  ✅ 회원 검색/상태 변경/역할 부여 API.
- ✅ Merchant settlement endpoints (generate, approve, export).  
  ✅ 가맹점 정산 생성/승인/내보내기 API.
- ✅ P2P dispute handling (escalate, resolve, refund actions).  
  ✅ P2P 분쟁 처리 API.

## Wallet Service
- ✅ Exposed `GET /api/v1/wallets/overview` skeleton returning balance snapshots and operational alerts for member dashboards.  
  ✅ 회원 대시보드를 위한 잔액 스냅샷과 운영 알림을 반환하는 `GET /api/v1/wallets/overview` 스켈레톤을 추가했습니다.
- Implement balance aggregation across tokens/NFTs with fiat valuation and latest network settings.  
  토큰·NFT 잔액을 법정화폐 환산 및 최신 네트워크 설정과 함께 집계합니다.
- Integrate whitelist, withdrawal, and maintenance signals with real-time notifications.  
  화이트리스트·출금·점검 상태 시그널을 실시간 알림과 연동합니다.

## P2P & Escrow
- Implement order lifecycle controller + WebSocket updates.  
  주문 상태 변화와 실시간 알림 구현.
- Escrow release/refund endpoints with audit logging.  
  에스크로 해제/환불 API 및 감사 로그.

## Mining & EARN
- Hashdam cron sync (daily stats & hashpower balances).  
  해시다힘 일일 동기화 작업.
- EARN product management (CRUD, APR validation, collateral policies).  
  재테크 상품 관리 API.
- Withdrawal approval workflow (2FA, whitelist checks).  
  출금 승인 절차 API.

## Store & Integrations
- Coupon provider order reconciliation job & API webhooks.  
  쿠폰 공급사 결제 정산 및 웹훅 처리.
- ✅ CoinEx withdrawal executor with error handling & retries.  
  ✅ CoinEx 출금 실행 및 재시도.

Track progress in `TASK.md` and update this list after each sprint.  
스프린트마다 `TASK.md`와 함께 본 목록을 갱신하세요.
