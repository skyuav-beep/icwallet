# Domain ERD Highlights / 도메인 ERD 요약

This note extends `spec.md` §11 with concrete attributes, bridge tables, and relationship expectations so the schema work can start without ambiguity.  
본 문서는 `spec.md` 11장을 확장해 구체 속성, 브릿지 테이블, 관계 기준을 명시하여 스키마 설계 시 혼선을 줄입니다.

## Legend / 범례
- **PK**, **FK** notation follows canonical Prisma naming (`id`, `<entity>Id`).  
  **PK**, **FK** 표시는 Prisma 명명 규칙(`id`, `<entity>Id`)을 따릅니다.
- Timestamps are stored as UTC (`*_at`).  
  시각 필드는 UTC로 저장하며 `*_at` 접미사를 사용합니다.
- Soft deletes use `deleted_at` when needed.  
  필요 시 `deleted_at`으로 소프트 삭제를 표현합니다.

## Implementation Snapshot (2025-10-11) / 구현 현황 (2025-10-11)
- **Wallet & Asset Tables**: Prisma schema now includes `Token`, `BalanceSnapshot`, and `WhitelistAddress`, covering asset registry, historical balances, and withdrawal whitelists.  
  Prisma 스키마에 `Token`, `BalanceSnapshot`, `WhitelistAddress`를 추가해 자산 레지스트리·잔액 이력·출금 화이트리스트를 구현했습니다.
- **Merchant & Voucher Core**: `Merchant`, `GiftSpec`, `CouponSpec`, `RedeemLog`, `Settlement`을 생성해 NFT 상품권과 정산 흐름의 필수 엔티티를 마련했습니다.  
  `Merchant`, `GiftSpec`, `CouponSpec`, `RedeemLog`, `Settlement` 테이블을 구축해 NFT 상품권 및 정산 핵심 엔티티를 확보했습니다.
- **P2P Escrow Enhancements**: `P2PChat`, `Dispute`, `Escrow.hasDispute` 컬럼으로 에스크로 커뮤니케이션과 분쟁 상태를 저장합니다.  
  `P2PChat`, `Dispute`, `Escrow.hasDispute` 컬럼을 통해 에스크로 대화 및 분쟁 상태를 기록합니다.
- **Mining & EARN Coverage**: `Hashpower`, `HashpowerTxn`, `MiningStatDaily`, `MiningBalance`, `WithdrawalRequest`, `StakingProduct`, `StakingPosition`, `LendingOffer`, `LendingLoan`, `LoanProduct`, `LoanApplication`이 §11.5–11.6 도메인 요구를 반영합니다.  
  `Hashpower`, `HashpowerTxn`, `MiningStatDaily`, `MiningBalance`, `WithdrawalRequest`, `StakingProduct`, `StakingPosition`, `LendingOffer`, `LendingLoan`, `LoanProduct`, `LoanApplication`으로 §11.5–11.6 요구사항을 수용했습니다.
- **Store Domain**: `StoreItem`과 `StoreOrder`를 추가해 외부 쿠폰몰 통합과 주문 내역 저장 기반을 완성했습니다.  
  `StoreItem`, `StoreOrder` 테이블로 외부 쿠폰몰 연동 및 주문 기록 기반을 마련했습니다.

## Identity & Security / 정체 및 보안
- **Member** (`id`, `email`, `phone`, `status`, `kyc_status`, `preferred_lang`, `created_at`, `last_login_at`) — user accounts with language preference and KYC gate; `status` ∈ {active, suspended, closed}.  
  회원 계정 테이블로 언어 선호와 KYC 상태를 포함하며 `status`는 {active, suspended, closed} 값을 가집니다.
- **MemberProfile** (`member_id` PK/FK, `full_name`, `birth_date`, `nationality_code`, `doc_type`, `doc_number`, `kyc_level`, `kyc_reviewed_at`, `reviewed_by`) — extends member with compliance metadata.  
  회원 준법 정보를 확장 저장하는 테이블로 신분증 종류·번호, KYC 등급 등을 관리합니다.
- **KycSubmission** (`id`, `member_id` FK, `provider`(Sumsub 등), `external_ref`, `status`, `submitted_at`, `completed_at`, `payload_snapshot`) — tracks external KYC vendor responses.  
  외부 KYC 벤더 연동 결과를 추적하는 테이블입니다.
- **AuthFactor** (`id`, `member_id`, `type`, `secret_encrypted`, `enabled`, `created_at`, `updated_at`) — 2FA/TOTP/OTP secrets with encryption metadata.  
  2FA/TOTP/OTP 시크릿을 암호화 저장합니다.
- **DeviceSession** (`id`, `member_id`, `device_fingerprint`, `ip_hash`, `last_seen_at`, `trusted`) — remember devices for reduced friction.  
  장치 신뢰도를 기록해 2FA 흐름을 최적화합니다.
- **LoginAttempt** (`id`, `member_id` nullable, `identifier`, `ip_hash`, `user_agent`, `status`, `failure_reason`, `attempted_at`) — supports rate-limiting and fraud analytics.  
  레이트 리미팅과 이상 탐지를 위한 로그인 시도 로그입니다.
- **AdminUser** (`id`, `email`, `name`, `role_id`, `status`) — backoffice admin identities.  
  백오피스 관리자 계정 정보입니다.
- **Role** / **Permission** / **RolePermission** — RBAC matrix governing admin, merchant staff, and system integrators.  
  관리자·가맹점 직원·시스템 계정에 대한 RBAC 매트릭스를 구성합니다.
- **AuditLog** (`id`, `actor_type`, `actor_id`, `action`, `target_type`, `target_id`, `meta_json`, `created_at`) — referenced by all critical flows; ensure indices on `target_type/target_id`.  
  주요 플로가 참조하는 감사 로그로 `target_type/target_id`에 인덱스를 둡니다.

## Wallet & Asset Domain / 지갑 및 자산 영역
- **Wallet** (`id`, `member_id`, `network`, `address`, `label`, `wallet_key_ciphertext`, `is_locked`, `created_at`) — primary wallet registry storing encrypted keys.  
  암호화된 `wallet_key`를 저장하는 기본 지갑 레지스트리입니다.
- **WalletRotationLog** (`id`, `wallet_id`, `old_key_hash`, `new_key_hash`, `rotated_at`, `reason`, `performed_by`) — required by `docs/WALLET-KEY-ROTATION.md` to audit key refreshes.  
  키 교체 이력을 감사하기 위한 레코드로 `docs/WALLET-KEY-ROTATION.md` 요구사항을 충족합니다.
- **WalletNetworkSetting** (`network`, `chain_id`, `explorer_url`, `min_confirmations`, `maintenance_state`) — centralizes per-network metadata.  
  네트워크별 메타데이터를 집중 관리합니다.
- **Token** (`id`, `network`, `symbol`, `name`, `contract`, `decimals`, `logo_url`, `is_p2p_enabled`, `is_swap_enabled`) — token registry controlling availability flags.  
  토큰 사용 가능 여부를 제어하는 레지스트리입니다.
- **TokenPriceSnapshot** (`token_id`, `captured_at`, `price_usd`, `price_krw`, `source`) — supports valuation for dashboard and risk checks.  
  대시보드 및 리스크 검증용 가격 스냅샷입니다.
- **NFTCollection** (`id`, `network`, `standard`, `contract`, `issuer_id`, `metadata_uri`) — NFT contract catalog.  
  NFT 컨트랙트 카탈로그입니다.
- **NFToken** (`id`, `collection_id`, `token_id`, `owner_wallet_id`, `type`, `status`, `metadata_uri`, `expires_at`, `usable_from`) — per-token ownership with lifecycle.  
  NFT 단위 소유권과 라이프사이클을 저장합니다.
- **BalanceSnapshot** (`id`, `wallet_id`, `asset_type`, `asset_id`, `amount`, `captured_at`) — ledger history for compliance.  
  규제 대응을 위한 잔액 스냅샷 기록입니다.
- **WhitelistAddress** (`id`, `member_id`, `network`, `address`, `label`, `approved_at`, `approved_by`, `status`) — withdrawal whitelist with approval lineage.  
  출금 화이트리스트를 승인 정보와 함께 저장합니다.

## Merchant, Voucher & Settlement / 가맹점·상품권·정산
- **Merchant** (`id`, `name`, `biz_no`, `country_code`, `status`, `settlement_currency`, `primary_contact_id`, `created_at`) — store partner master data.  
  가맹점 기본정보를 담는 마스터 테이블입니다.
- **MerchantUser** (`id`, `merchant_id`, `email`, `name`, `role`, `status`, `last_login_at`) — merchant staff accounts mapped to RBAC.  
  가맹점 직원 계정을 RBAC와 연결합니다.
- **MerchantWebhook** (`id`, `merchant_id`, `target_url`, `event_types`, `secret`, `status`, `last_success_at`) — redemption/settlement callbacks.  
  사용/정산 웹훅 엔드포인트를 관리합니다.
- **GiftSpec** (`id`, `merchant_id`, `title`, `kind`, `face_value`, `currency`, `max_redemptions`, `expires_policy`, `redeem_policy`, `active`) — NFT gift voucher blueprint.  
  NFT 상품권 설계를 정의하는 스펙입니다.
- **CouponSpec** (`id`, `merchant_id`, `type`, `rate_or_amount`, `currency`, `min_spend`, `max_discount`, `expires_policy`, `active`) — coupon-specific configuration.  
  쿠폰형 상품 설정을 정의합니다.
- **MerchantCatalogItem** (`id`, `merchant_id`, `spec_id`, `sku`, `price`, `inventory`, `start_at`, `end_at`, `status`) — storefront items tied to specs.  
  스펙과 연계된 스토어프런트 상품을 관리합니다.
- **RedeemLog** (`id`, `nft_id`, `merchant_id`, `member_id`, `amount`, `currency`, `redeemed_at`, `location`, `tx_hash`, `status`) — redemption ledger; `status` tracks pending/confirmed/reversed.  
  사용 원장을 기록하며 상태값으로 대기/확정/취소를 구분합니다.
- **Settlement** (`id`, `merchant_id`, `period_start`, `period_end`, `amount`, `currency`, `method`, `status`, `generated_by`, `generated_at`) — settlement cycle header.  
  정산 주기 헤더를 저장합니다.
- **SettlementLine** (`id`, `settlement_id`, `redeem_log_id`, `net_amount`, `fee_amount`, `notes`) — links redemptions to settlements.  
  사용 로그와 정산을 연결하는 라인 테이블입니다.

## P2P Trading & Escrow / P2P 거래 및 에스크로
- **P2POrder** (`id`, `maker_id`, `type`, `asset_type`, `asset_ref`, `qty`, `price`, `pay_currency`, `status`, `created_at`, `expires_at`) — public posted orders.  
  공개 P2P 주문을 저장하는 테이블입니다.
- **Escrow** (`id`, `order_id`, `taker_id`, `state`, `funded_at`, `released_at`, `cancelled_at`, `dispute_flag`) — escrow lifecycle state machine.  
  에스크로 상태 전환을 추적합니다.
- **EscrowTransfer** (`id`, `escrow_id`, `tx_hash`, `direction`, `amount`, `posted_at`) — on-chain/off-chain transfers tied to escrow.  
  에스크로와 연계된 온/오프체인 전송 내역입니다.
- **P2PChat** (`id`, `escrow_id`, `sender_id`, `message`, `attachment_url`, `sent_at`) — escrow chat & evidence.  
  에스크로 채팅 및 증빙 저장.
- **Dispute** (`id`, `escrow_id`, `reason_code`, `description`, `submitted_at`, `resolved_at`, `resolved_by`, `resolution`) — dispute tracking.  
  분쟁 진행 상황을 관리합니다.
- **DisputeEvidence** (`id`, `dispute_id`, `file_url`, `uploaded_by`, `uploaded_at`, `type`) — structured evidence store.  
  증빙 자료를 구조화해 저장합니다.

## Mining Domain / 마이닝 영역
- **Hashpower** (`id`, `member_id`, `source`, `mh_s`, `granted_at`, `expires_at`) — active hashpower positions.  
  활성 해시파워 데이터를 저장합니다.
- **HashpowerTxn** (`id`, `member_id`, `type`, `mh_s`, `price`, `pay_token`, `tx_hash`, `created_at`) — acquisition history.  
  해시파워 취득 이력을 관리합니다.
- **MiningStatDaily** (`id`, `member_id`, `date`, `hashrate_24h`, `reject_rate`, `payout_amount`, `payout_token`) — daily stats feed from Hashdam.  
  Hashdam에서 수집한 일일 통계를 저장합니다.
- **MiningBalance** (`id`, `member_id`, `coin`, `amount`, `last_synced_at`) — synchronized wallet balances.  
  채굴 코인 잔액 동기화 정보를 기록합니다.
- **WithdrawalRequest** (`id`, `member_id`, `coin`, `amount`, `dest_exchange`, `dest_account`, `status`, `review_notes`, `created_at`, `approved_at`, `approved_by`) — withdrawal approvals with audit hooks.  
  감사 기록과 연동되는 출금 승인 요청입니다.
- **WithdrawalCheckpoint** (`id`, `withdrawal_request_id`, `step`, `status`, `actor_id`, `completed_at`, `payload`) — multi-step 2FA/whitelist checks.  
  2FA·화이트리스트 검증 단계를 기록합니다.
- **WithdrawalCheckpointSignature** (`id`, `checkpoint_id`, `admin_id`, `decision`, `note`, `signed_at`) — captures multi-signature finance approvals.  
  재무 다중 서명을 저장합니다.

## EARN Products / 재테크 도메인
- **StakingProduct** (`id`, `asset_type`, `apr`, `lock_days`, `min_deposit`, `max_deposit`, `total_cap`, `remain_amount`, `status`) — staking offer definition.  
  스테이킹 상품 정의입니다.
- **StakingPosition** (`id`, `member_id`, `product_id`, `principal`, `start_at`, `end_at`, `reward_accrued`, `status`) — user positions.  
  사용자의 스테이킹 포지션입니다.
- **LendingOffer** (`id`, `lender_id`, `asset_type`, `amount`, `term_days`, `rate`, `collateral_spec`, `min_per_fill`, `max_per_fill`, `status`) — supply side offers.  
  공급자 측 랜딩 제안입니다.
- **LendingLoan** (`id`, `offer_id`, `borrower_id`, `amount`, `start_at`, `due_at`, `collateral_asset`, `collateral_amount`, `state`) — matched loans.  
  매칭된 대출 데이터를 저장합니다.
- **LoanProduct** (`id`, `asset_type`, `term_days`, `rate`, `collateral_required`, `collateral_spec`, `status`) — company-issued loan templates.  
  회사 제공 론 상품 템플릿입니다.
- **LoanApplication** (`id`, `product_id`, `member_id`, `amount`, `start_at`, `due_at`, `collateral_asset`, `collateral_amount`, `state`, `reviewed_by`, `reviewed_at`) — application tracking with reviewer.  
  심사자 정보를 포함한 론 신청 기록입니다.

## Store & External Providers / 스토어 및 외부 연동
- **StoreItem** (`id`, `ext_provider_id`, `ext_sku`, `title`, `category`, `price`, `currency`, `status`, `locale_bundle_id`) — external marketplace items.  
  외부 마켓 상품 정보를 저장합니다.
- **StoreOrder** (`id`, `member_id`, `item_id`, `pay_asset`, `pay_amount`, `status`, `ext_payload`, `delivered_code`, `created_at`, `fulfilled_at`) — user purchases.  
  사용자의 구매 내역입니다.
- **CouponProvider** (`id`, `name`, `api_base_url`, `status`, `credential_ref`, `webhook_secret`) — vendor credentials to support reconciliation.  
  정산을 지원하기 위한 쿠폰 공급사 자격증명 테이블입니다.
- **ProviderReconciliation** (`id`, `provider_id`, `period_start`, `period_end`, `status`, `generated_at`, `payload_hash`) — reconciliation jobs and artefacts.  
  공급사 정합성 검증 작업 정보를 저장합니다.

## Content & Support / 콘텐츠 및 지원
- **Notice** (`id`, `title`, `body`, `published_at`, `locale`, `version`, `published_by`) — bilingual announcements.  
  양언어 공지를 관리합니다.
- **Inquiry** (`id`, `member_id`, `category`, `content`, `status`, `assigned_to`, `created_at`, `responded_at`) — support tickets.  
  고객 지원 티켓입니다.
- **SupportAttachment** (`id`, `inquiry_id`, `file_url`, `uploaded_by`, `uploaded_at`) — ticket artefacts.  
  지원 첨부 파일을 저장합니다.
- **CompanySetting** (`key`, `value`, `updated_at`, `updated_by`) — system-wide settings.  
  시스템 전역 설정값입니다.
- **Terms** (`id`, `type`, `version`, `content`, `effective_at`, `retired_at`) — legal documents with versioning.  
  버전 관리되는 법적 문서입니다.

## Relationship Summary / 관계 요약
- Member 1–N Wallet / NFToken / P2POrder / StakingPosition / StoreOrder / Inquiry; cascading deletes disabled.  
  회원은 지갑·NFT·P2P 주문·재테크 포지션·스토어 주문·문의와 1:N 관계이며 연쇄 삭제는 비활성화합니다.
- Wallet 1–N NFToken / BalanceSnapshot / WalletRotationLog / WithdrawalRequest; Wallet 1–N MerchantCatalogItem via ownership optional.  
  지갑은 NFT·잔액 스냅샷·키 로테이션·출금 요청과 1:N 관계입니다.
- P2POrder 1–1 Escrow → Escrow 0–1 Dispute; Escrow 1–N EscrowTransfer / P2PChat.  
  P2P 주문과 에스크로는 1:1, 에스크로와 분쟁은 0~1 관계이며 전송·채팅과는 1:N입니다.
- Merchant 1–N MerchantUser / GiftSpec / CouponSpec / MerchantCatalogItem / RedeemLog / Settlement.  
  가맹점은 직원·상품 스펙·카탈로그·사용 로그·정산과 1:N 관계입니다.
- Settlement 1–N SettlementLine → RedeemLog.  
  정산은 라인 아이템을 통해 사용 로그와 연결됩니다.
- StakingProduct 1–N StakingPosition; LendingOffer 1–N LendingLoan; LoanProduct 1–N LoanApplication.  
  재테크 각 도메인은 제품 대 포지션/신청의 1:N 관계입니다.
- CouponProvider 1–N StoreItem / ProviderReconciliation; ProviderReconciliation aggregates StoreOrder via payload.  
  쿠폰 공급사는 스토어 상품 및 정합성 기록과 1:N 관계입니다.
- AuditLog targets any entity via `(target_type, target_id)`; maintain referential hints in service layer.  
  감사 로그는 `(target_type, target_id)`로 모든 엔티티를 참조하므로 서비스 레이어에서 참조 힌트를 유지합니다.

## Outstanding Questions / 보완 필요 사항
- **KYC scope**: confirm whether third-party orchestration (e.g., Sumsub) mandates additional status enums beyond `kyc_status`.  
  **KYC 범위**: Sumsub 등 외부 오케스트레이션 시 `kyc_status` 외 추가 상태 Enum이 필요한지 확정해야 합니다.
- **Provider currency normalization**: decide if StoreItem prices are normalized to KRW/USD snapshot or stored as raw provider currency.  
  **공급사 통화 정규화**: 스토어 상품 가격을 KRW/USD로 환산할지, 공급사 통화를 그대로 둘지 결정이 필요합니다.
- **Escrow collateralization**: determine whether P2P escrow locks tokens in on-chain contract (impacting EscrowTransfer schema).  
  **에스크로 담보화**: P2P 에스크로가 온체인 잠금을 요구하는지 여부가 EscrowTransfer 스키마에 영향을 줍니다.
- **Audit log retention**: align retention policy with `docs/CI-TEST-STRATEGY.md` and infra storage constraints.  
  **감사 로그 보존기간**: `docs/CI-TEST-STRATEGY.md` 및 인프라 스토리지 정책과 보존기간을 맞춰야 합니다.

Sync these updates with visual ER diagrams and adjust `spec.md` if future scope changes introduce new entity categories.  
이 내용을 시각화된 ER 다이어그램과 동기화하고, 향후 범위 변화로 새로운 엔티티가 추가되면 `spec.md`도 함께 수정하세요.
