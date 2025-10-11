# Admin API Overview / 관리자 API 개요

This note summarizes the initial read-only Admin REST endpoints implemented under `api/v1/admin/*`. Extend this list when adding new operations (mutations, approvals, exports).  
본 문서는 `api/v1/admin/*` 경로에 구현된 1차 관리자 조회용 REST 엔드포인트를 정리합니다. 추후 쓰기·승인·엑스포트 기능을 추가할 때 본 목록을 확장하세요.

Refer to `docs/OPENAPI-ADMIN.yaml` for machine-readable specs covering authentication and approval routes; run `pnpm spectral:admin` to lint changes.  
인증 및 승인 엔드포인트의 기계 가독형 스펙은 `docs/OPENAPI-ADMIN.yaml`에서 확인할 수 있으며, 수정 시 `pnpm spectral:admin`으로 린트를 실행하세요.

> Authentication / 인증  
> `POST /api/v1/admin/auth/login`에서 발급한 JWT를 `Authorization: Bearer <token>` 헤더로 전달해야 합니다. 토큰에는 관리자 ID·역할·권한 정보가 포함되며, 컨트롤러는 역할 기반 가드를 통해 접근을 제한합니다.
> Seed default / 기본 시드 계정  
> 시드 스크립트는 `superadmin@icwallet.example / ChangeMe123!` 계정을 생성합니다. 초기 로그인 후 반드시 비밀번호를 교체하세요.

| Domain / 도메인 | Endpoint / 엔드포인트 | Description / 설명 |
| --- | --- | --- |
| Auth / 인증 | `POST /admin/auth/login` | Issue JWT for admin users. / 관리자 JWT 발급 |
| Members / 회원 | `GET /admin/members` | Paginated member list with profile, wallet summary. / 페이지네이션된 회원 목록과 프로필·지갑 요약. |
|  | `GET /admin/members/:memberId` | Single member detail including whitelist, positions. / 화이트리스트·재테크 포지션을 포함한 상세 정보. |
| Merchants / 가맹점 | `GET /admin/merchants` | Merchant directory with staff/webhook metadata. / 직원·웹훅 정보가 포함된 가맹점 목록. |
|  | `GET /admin/merchants/settlements` | Settlement queue overview. / 정산 대기 큐 요약. |
|  | `POST /admin/merchants/:merchantId/settlements` | Generate settlement batch for the specified merchant and period. / 지정한 가맹점·기간에 대한 정산 배치를 생성합니다. |
|  | `GET /admin/merchants/:merchantId` | Merchant detail, catalog, recent settlements. / 가맹점 상세, 카탈로그, 최근 정산 정보. |
|  | `POST /admin/merchants/settlements/:id/approve` | Approve settlement batch. / 정산 배치를 승인합니다. |
|  | `POST /admin/merchants/settlements/:id/reject` | Reject settlement batch with note. / 메모와 함께 정산을 거절합니다. |
|  | `GET /admin/merchants/settlements/:id/export` | Export settlement lines for finance reconciliation. / 재무 정산을 위한 정산 상세를 내보냅니다. |
| Wallets / 지갑 | `GET /admin/wallets` | Wallet registry with latest balance snapshot. / 최신 잔액 스냅샷이 포함된 지갑 레지스트리. |
|  | `GET /admin/wallets/whitelist` | Withdrawal whitelist entries. / 출금 화이트리스트 항목. |
| P2P | `GET /admin/p2p/orders` | Orders with escrow and dispute context. / 에스크로·분쟁 정보를 포함한 주문 목록. |
|  | `GET /admin/p2p/disputes` | Dispute cases with evidence links. / 증빙 정보를 포함한 분쟁 사례. |
|  | `POST /admin/p2p/disputes/:id/escalate` | Escalate dispute for compliance/legal review. / 분쟁을 컴플라이언스 검토로 에스컬레이션합니다. |
|  | `PUT /admin/p2p/disputes/:id/resolve` | Resolve dispute by releasing or refunding escrow. / 에스크로 해제·환불 중 하나로 분쟁을 해결합니다. |
|  | `POST /admin/p2p/escrows/:id/release` | Release escrow to seller. / 에스크로를 판매자에게 해제합니다. |
|  | `POST /admin/p2p/escrows/:id/refund` | Refund escrow to buyer. / 에스크로를 구매자에게 환불합니다. |
| Mining / 마이닝 | `GET /admin/mining/withdrawals` | Withdrawal requests + checkpoint trail. / 출금 요청과 체크포인트 내역. |
|  | `GET /admin/mining/hashpower-txns` | Hashpower transaction ledger. / 해시파워 거래 원장. |
|  | `POST /admin/mining/withdrawals/:id/approve` | Approve withdrawal; records finance multi-signatures before completion. / 출금을 승인하며 재무 다중 서명을 모두 수집한 뒤 완료합니다. |
|  | `POST /admin/mining/withdrawals/:id/reject` | Reject withdrawal and log reason. / 출금을 거절하고 사유를 기록합니다. |
|  | `POST /admin/mining/withdrawals/dispatch` | Execute approved withdrawals via CoinEx with retry metadata. / CoinEx 연동으로 승인된 출금을 실행하고 재시도 정보를 기록합니다. |
| EARN | `GET /admin/earn/staking-products` | Staking products + sample positions. / 스테이킹 상품 및 샘플 포지션. |
|  | `GET /admin/earn/lending-offers` | Lending offers with loan rollups. / 대여 제안과 대출 요약. |
|  | `GET /admin/earn/loan-products` | Company loan products + applications. / 회사 대출 상품과 신청 내역. |
| Store / 스토어 | `GET /admin/store/orders` | Store orders with member/item context. / 회원·상품 정보를 포함한 스토어 주문. |
|  | `GET /admin/store/providers` | Coupon providers and registered SKUs. / 쿠폰 공급사 및 등록 SKU. |
| Policy / 정책 | `GET /admin/policies/roles` | Roles with assigned permissions. / 권한이 연결된 역할 목록. |
|  | `GET /admin/policies/permissions` | Permission catalog. / 권한 카탈로그. |
|  | `GET /admin/policies/audit-logs` | Audit log timeline (paginated). / 페이지네이션된 감사 로그 타임라인. |

## Next Steps / 다음 단계
- Implement mutating endpoints (create/update) for the above resources with RBAC guards.  
  위 리소스의 생성/수정 엔드포인트와 RBAC 가드를 구현합니다.
- Add approval flows (withdrawal, settlement, dispute resolution) referencing `docs/RBAC-AUDIT-POLICY.md`.  
  `docs/RBAC-AUDIT-POLICY.md`에 따라 출금·정산·분쟁 승인 흐름을 추가합니다.
- Integrate OpenAPI documentation and automated contract tests once write operations are in place.  
  쓰기 기능이 갖춰지면 OpenAPI 문서와 계약 테스트를 연동합니다.
