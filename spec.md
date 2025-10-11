# IC Wallet 기능 명세 요약 v1.0

> 본 문서는 사용자가 제공한 요구 목록을 체계화한 기능 요약/정리본입니다. 이후 상세 PRD/화면 설계/API 스펙으로 확장할 수 있도록 목차형 구조로 정리했습니다.
> 

---

## 1. 공통 개요

- **목적**
    1. **지갑 (Wallet)**: mblockapi로 BNB 네트워크 지갑 발행, 멀티자산(토큰, NFT) 보관/전송/수신/스왑
    2. **NFT 상품권 (NFT Gift Shop)**: 자체 ISC 기반 NFT 상품권을 발행·판매·사용
    3. **P2P 거래 플랫폼**: 중개인 없이 ISC 토큰/NFT를 에스크로로 안전하게 개인 간 매매
    4. **채굴 (Mining)**: LTC 계열 멀티 코인 채굴 데이터 조회·출금, 해시파워 구매/지급 이력 관리
    5. **재테크 (EARN)**: ISC 토큰·NFT의 Staking, Lending(빌려주기/빌리기), Loan(대출상품) 제공
    6. **쿠폰몰 (Coupon Mall)**: 외부 쿠폰/상품권 API 연동, 자체 토큰·NFT로 구매
    7. **가맹점 (Merchant)**: NFT 상품권 제시 시 정산 가능한 가맹점용 페이지/정산 흐름 제공
- **주요 네트워크**: BNB Network, Island Smart Chain (ISC Network)
- **구성 환경**: 사용자 페이지 / 가맹점 페이지 / 관리자 페이지 (각각 별도 링크·로그인 제공)

---

## 2. 외부 연동

1. **mblockapi**: BNB 지갑 발행·전송·결제 기능 사용
2. **외부 쿠폰/상품권사 API**: 카테고리/상품 조회, 구매/발급 내역 수신, 상태 동기화

---

## 3. 사용자 기능

### 3.1 Wallet

- **네트워크 전환**: BNB / ISC
- **자산(토큰)**: BNB, USDT, AITC, AITCP, ICC, ICS, ICF, ICG
- **자산(NFT)**: ISC 기반 NFT 상품권/쿠폰
- **기능**: 전송, 받기(QR), 스왑

### 3.2 NFT 상품권 (마켓)

- **NFT 상품권(금액권/교환권)**: 10,000/50,000/100,000/500,000원, 1박/2박 콘도, 워터파크 등
- **NFT 쿠폰**: 할인/증정/무료교환권 등
- **마케팅 기능**
    - **Time-Locked NFT**: 특정 시점 전까지/까지만 사용 가능
    - **Limited-Time Edition**: 기간 한정·희소성 강조 에디션 발행

### 3.3 P2P(판매/구매)

- **거래 대상**: ISC 토큰, ISC NFT 전용
- **에스크로 포함**
- **핵심 화면**: 판매등록, 구매등록, 리스트/검색, 나의 거래(등록·완료)
- **환경설정 반영**: 거래 가능 토큰/NFT, 결제 통화(USDT 등)

### 3.4 Mining(마이닝)

- **Hashpower**: 구매/리워드로 확보, 환경설정으로 판매 가능 토큰·가격 설정
- **지표 조회**: Hashdam API 기준 전일까지의 24h Hashrate, Reject rate
- **차트**: 24h Hashrate / Reject rate
- **내역**: 해시파워 구매/지급 이력, 채굴 내역(일 단위, 전일 기준)
- **출금**: **CoinEx 계정 주소로만** 출금 (계정 등록·확인 필수), 8종 코인 출금 요청→관리자 승인 후 차감
- **채굴 코인(8종)**: LTC, DOGE, BELLS, JKC, LKY, PEP, DINGO, SHIC
- **지갑 현황**: 8개 코인별 채굴 지갑 잔고 표시

### 3.5 재테크 (EARN)

- **대상**: IC Chain의 토큰, NFT
- **스테이킹**: 기간·이율 기반 수익
- **Lending (랜딩)**: 회원/회사 간 대여·차입. 담보형(지정 토큰·수량) 지원
- **Loan (론)**: 회사 등록 대출상품 신청 (이자율/기간/담보조건 반영)

### 3.6 쿠폰몰(Store)

- **쿠폰 구매**: 지정 토큰/NFT로 외부 쿠폰몰 상품 구매 및 전달

### 3.7 가맹점

- **리스트/상품 조회/구매**
- **정산 연동**: NFT 상품권 사용 시 정산 데이터 확정(스마트컨트랙트)

### 3.8 My Page

- **프로필, 보안, 알림 설정**
- **채굴**: 거래소 계정관리, 화이트리스트 주소
- **기타**: 공지사항, 1:1문의, 이용약관, 개인정보보호정책, 버전정보

---

## 4. 가맹점 화면

1. 로그인 / 회원가입
2. 상품 등록
3. 판매 현황
4. 정산

---

## 5. 관리자 화면

### 5.1 회원 관리

- 회원 리스트(기본정보, SNS 로그인)
- 회원별 지갑 내역
- 회원별 P2P 내역
- 회원별 채굴(해시파워/코인별 채굴) 내역
- 회원별 스테이킹/랜딩/론 내역

### 5.2 가맹점 관리

- 가맹점 리스트
- 가맹점 상품 등록
- 가맹점용 NFT 상품권 등록·발행
- NFT 사용 현황
- 가맹점 정산

### 5.3 지갑 관리

- 회원 등록 시 mblockapi 지갑 발행/등록 또는 외부 Web3 지갑 등록
- 지갑 리스트·잔액, Lock/Freeze 표시
- 토큰·NFT 등록(컨트랙트 주소/로고)

### 5.4 NFT 상품권/쿠폰 관리

- 유형 선택: 상품권 / 쿠폰
- 상품권: 금액, 유효기간 또는 타임락(택1)
- 쿠폰: 할인율/교환/무료증정 유형, 금액 또는 할인율, 유효기간
- 판매 리스트

### 5.5 P2P 관리

- 환경설정: 거래 대상(토큰/NFT), 통화(USDT 등), 에스크로 조건
- 삽니다/팝니다 리스트(진행중/완료)

### 5.6 채굴 관리

- 해시 지급 내역(구분: 판매/지급)
- 채굴 내역(8종 코인)
- 출금 요청 리스트

### 5.7 EARN 설정

- **스테이킹 상품 등록(고정형)**: 예) IC 상품권 10,000권, 30일, 최소/최대, 잔여 수량
- **랜딩 설정**: 기간(7/30/60/90/120/180/365), 대상 자산(NFT/IC 상품권 TOKEN), 최소/최대, 담보종류·수량·조건
- **론 설정**: 대출기간/대상자산/이자율/담보여부·조건, 상품 리스트

### 5.8 쿠폰몰(스토어) 관리

- 카테고리/리스트/검색
- 결제 및 구매 내역

### 5.9 공지사항 / 고객센터(1:1문의)

### 5.10 환경설정

- 회사정보, 이용약관/개인정보처리방침 등록
- **회사지갑 관리**: 지급/수취 전용주소 분리(토큰/NFT·수수료 송금)
- P2P 통화 등록(포인트/토큰·컨트랙트 존재 필수)
- 해시 지급/판매 설정(구매 통화/가격)
- Staking/Lending/Loan 정책
- 관리자 권한(카테고리별 읽기/편집)

---

## 6. 사용자 시나리오 (하이레벨)

1. 회원가입 → 로그인 → 비번찾기
2. 지갑: 보내기/받기/스왑
3. P2P: 삽니다/팝니다 등록 및 진행
4. NFT 상품권/쿠폰: 구매·사용
5. 채굴: 해시파워 구매/적립, 채굴현황 확인, 거래소 주소 등록, 출금 신청
6. 재테크: 스테이킹(상품 선택), 랜딩(등록/신청/상환/내역), 론(신청/내역/상환)
7. 스토어: 쿠폰몰 조회·구매

---

## 7. NFT 쿠폰/상품권: 유효기간·정산 구조

### 7.1 유효기간(타임락) 구현 원리

- 발행 시 스마트컨트랙트에 **만료일** 또는 **사용 가능 시작일** 정의
- 사용 시 체인 시간과 비교하여 **미경과 → 실행**, **경과 → 거절/소각**
- 메타데이터에 만료/사용 상태 반영(동적 NFT 가능)

### 7.2 장점

- 기업: 기간 집중 마케팅/수요 예측, 미사용 부채 관리
- 사용자: 희소성·재판매 가치, 사용/만료 이력의 투명성

### 7.3 명칭

- **Time-Locked NFT**, **Limited-Time Edition**

### 7.4 가맹점 정산 흐름

- **구성요소**: NFT(금액/혜택/기간/상태), 가맹점 POS/App, 정산 서버(API Gateway·가스 대납), 스마트컨트랙트
- **프로세스**
    1. 고객이 NFT QR/ID 제시 → POS가 정산 서버에 유효성 조회(오프체인)
    2. 정산 서버가 **Redeem 트랜잭션** 생성 → 스마트컨트랙트가 상태를 *사용됨*으로 변경 및 정산 데이터(가맹점ID/시각/금액) 온체인 기록
    3. 발행사는 온체인 데이터를 집계하여 **일/주기 정산** 수행 (옵션: 실시간 자동 송금)
- **고려사항**
    - 가스비: 정산 서버가 대납(발행사 부담)
    - UX: QR/바코드 연동으로 POS 단순화
    - 오프체인 정산: ERP/회계/은행 이체 API 연동
    - 환불/취소: 스마트컨트랙트에 Cancel 경로 제공(상태 되돌림, 정산 로그 분리)

---

## 8. 기본 데이터/정책(요약)

- **지갑**: 네트워크(BNB/ISC), 주소/라벨, 자산리스트(토큰/NFT), 화이트리스트
- **NFT**: 유형(상품권/쿠폰), 금액/혜택, 만료·타임락, 사용상태, 가맹점ID(옵션)
- **P2P**: 아이템 타입(토큰/NFT), 수량/가격, 결제통화, 에스크로 상태, 체결/분쟁 처리
- **마이닝**: 해시파워 보유량, 구매/지급 이력, 24h hashrate·reject, 코인별 잔고, 출금요청(상태/심사)
- **EARN**: 스테이킹 상품(기간/이율/한도), 랜딩(기간/담보/최소·최대/상태), 론(기간/이율/담보)
- **가맹점**: 등록/상품/정산 계정, 사용 내역
- **권한**: 사용자/가맹점/관리자, 관리자 세분 권한(읽기/편집)

---

## 9. 다음 단계(제안)

1. **화면 맵 & IA**: 사용자/가맹점/관리자 플로우 다이어그램 확정
2. **도메인 모델**: 핵심 엔티티(지갑, NFT, P2P, 마이닝, EARN, 쿠폰몰, 가맹점) ERD 초안
3. **스마트컨트랙트 스펙**: NFT(상품권/쿠폰), 에스크로, 정산, 스테이킹/랜딩/론 정책
4. **외부 API 명세**: mblockapi, 쿠폰몰사, Hashdam, CoinEx(주소 검증 규칙) 연동 명세
5. **보안/정책**: 로그인, 2FA/Turnstile, 출금 화이트리스트, 관리자 감사로그, 레이트리밋
6. **출금 정책서**: CoinEx 계정확인 절차, KYC/계정 매핑, 승인 워크플로우

---

*본 요약본은 사용자의 원문 요구를 구조화한 것으로, 누락/가정 없이 재배치와 항목화에만 집중했습니다. 이어서 화면설계(와이어프레임) 또는 API 스키마로 확장 가능합니다.*

## 10. 화면 맵 & IA (Information Architecture)

### 10.1 사용자 앱

- **Auth**: /login, /signup, /forgot
- **Dashboard**: / (요약 카드: 지갑 잔고, NFT, P2P, 채굴, EARN, 알림)
- **Wallet**: /wallet
    - /wallet/assets (BNB/ISC 전환, 토큰 목록)
    - /wallet/nft (NFT 상품권/쿠폰)
    - /wallet/send, /wallet/receive (QR), /wallet/swap
- **NFT 마켓**: /nft-market
    - /nft-market/gift, /nft-market/coupon (필터/카테고리/상세/구매)
- **P2P**: /p2p
    - /p2p/list (판매/구매 탭, 검색/필터)
    - /p2p/sell/new, /p2p/buy/new (등록)
    - /p2p/my (나의 거래: 진행/완료)
    - /p2p/order/:id (에스크로 상태, 채팅/분쟁)
- **Mining**: /mining
    - /mining/hashpower (구매/지급 내역)
    - /mining/stats (24h hashrate/reject 차트)
    - /mining/withdraw (CoinEx 계정 등록/출금 신청)
    - /mining/wallets (8종 채굴 지갑 현황)
- **EARN**: /earn
    - /earn/staking (상품 리스트/참여/내 포지션)
    - /earn/lending (빌려주기/빌리기 등록·신청·상환)
    - /earn/loan (회사 대출상품/신청)
- **Store(쿠폰몰)**: /store (카테고리/상품/구매)
- **Merchants**: /merchants (리스트/상세/상품)
- **My Page**: /me
    - /me/profile, /me/security(2FA/Turnstile), /me/notifications
    - /me/exchange (CoinEx 계정)
    - /me/whitelist (출금 화이트리스트)
    - /me/notices, /me/support, /me/terms, /me/privacy, /me/version

### 10.2 가맹점 포털

- /merchant/login, /merchant/signup
- /merchant/products (등록/수정/재고)
- /merchant/sales (사용/판매 현황)
- /merchant/settlement (정산 내역/청구)
- /merchant/nft (사용 가능한 NFT 유형 보기)

### 10.3 관리자 콘솔

- /admin/login
- /admin/members (회원 목록/상세)
- /admin/wallets (지갑/토큰/NFT 등록)
- /admin/p2p (환경설정/삽니다/팝니다)
- /admin/mining (해시 지급/채굴/출금 요청)
- /admin/earn (스테이킹/랜딩/론 상품 설정)
- /admin/store (쿠폰몰/주문)
- /admin/merchants (가맹점/정산/NFT 발행)
- /admin/content (공지/FAQ)
- /admin/settings (회사정보/정책/권한/감사로그)

---

## 11. ERD 초안 (엔티티 요약)

> 실제 DDL은 이후 단계에서 스키마로 제공. 아래는 핵심 테이블/관계 요약.
> 

### 11.1 공통/계정

- **Member**(id, email, phone, sns_provider, status, created_at)
- **AuthFactor**(member_id, type(2FA/OTP), secret, enabled)
- **AdminUser**(id, email, role_id)
- **Role**(id, name), **Permission**(id, key), **RolePermission**(role_id, perm_id)
- **MemberRole**(member_id, role_id, assigned_by, assigned_at) — stores role assignments granted to end-users for advanced access policies.  
  **MemberRole**(member_id, role_id, assigned_by, assigned_at) — 고급 접근 제어를 위해 회원에게 부여된 역할 정보를 저장합니다.
- **AuditLog**(id, actor_type, actor_id, action, target, meta, at)

### 11.2 지갑/자산

- **Wallet**(id, member_id, network(BNB/ISC), address, label, is_locked)
- **Token**(id, network, name, symbol, contract, decimals, logo_url, is_p2p_enabled)
- **NFTCollection**(id, network, standard(ERC721/1155), contract)
- **NFToken**(id, collection_id, token_id, owner_wallet_id, type(gift/coupon), status, metadata_uri, expires_at, usable_from)
- **BalanceSnapshot**(wallet_id, asset_type(token/nft), asset_id, amount, at)
- **WhitelistAddress**(member_id, network, address, tag)

### 11.3 NFT 상품권/쿠폰 & 정산

- **GiftSpec**(id, title, kind(amount/voucher), face_value, currency, expires_policy, redeem_policy)
- **CouponSpec**(id, type(discount/free/exchange), rate_or_amount, currency, expires_policy)
- **Merchant**(id, name, biz_no, settlement_wallet, bank_info, status)
- **RedeemLog**(id, nft_id, merchant_id, member_id, amount, currency, redeemed_at, tx_hash, status)
- **Settlement**(id, merchant_id, period, amount, currency, method(onchain/offchain), status)

### 11.4 P2P & 에스크로

- **P2POrder**(id, type(buy/sell), asset_type(token/nft), asset_ref(token_id/nft_id), qty, price, pay_currency, status, maker_id)
- **Escrow**(id, order_id, taker_id, state, created_at, released_at, dispute_flag)
- **P2PChat**(escrow_id, sender_id, message, at)
- **Dispute**(escrow_id, reason, evidence_url, resolved_by, result)

### 11.5 마이닝

- **Hashpower**(id, member_id, source(purchase/reward), mh_s, granted_at, expires_at)
- **HashpowerTxn**(id, member_id, type(purchase/grant), mh_s, price, pay_token, at)
- **MiningStatDaily**(member_id, date, hashrate_24h, reject_rate)
- **MiningBalance**(member_id, coin, amount)
- **WithdrawalRequest**(id, member_id, coin, amount, dest_exchange(CoinEx), dest_account, status, approved_by, at)

### 11.6 EARN (Staking/Lending/Loan)

- **StakingProduct**(id, asset_type(token/nft), apr, lock_days, min, max, total_cap, remain)
- **StakingPosition**(id, member_id, product_id, principal, start_at, end_at, reward_accum, status)
- **LendingOffer**(id, lender_id, asset_type(token/nft), amount, term_days, rate, collateral_spec, min, max, status)
- **LendingLoan**(id, offer_id, borrower_id, amount, start_at, due_at, collateral_asset, collateral_amount, state)
- **LoanProduct**(id, asset_type, term_days, rate, collateral_required, collateral_spec)
- **LoanApplication**(id, product_id, member_id, amount, start_at, due_at, collateral_asset, collateral_amount, state)

### 11.7 쿠폰몰

- **StoreItem**(id, ext_provider, ext_sku, title, category, price, currency, status)
- **StoreOrder**(id, member_id, item_id, pay_asset(token/nft), pay_amount, status, ext_payload, delivered_code)

### 11.8 콘텐츠/정책

- **Notice**(id, title, body, published_at)
- **Inquiry**(id, member_id, category, content, status, answered_by)
- **CompanySetting**(k, v), **Terms**(type, version, content)

**주요 관계**: Member 1–N Wallet/NFToken/Hashpower/Positions/Orders, Merchant 1–N RedeemLog/Settlement, P2POrder 1–1 Escrow, Offer 1–N Loan 등.

---

## 12. 스마트컨트랙트 스펙 (요약)

> ISC Network 기준. 업그레이더블(Poxy)·접근제어(AccessControl)·일시중지(Pausable) 권장.
> 

### 12.1 NFT 상품권/쿠폰 (ERC-721 또는 1155)

- **기능**: 민트/소각, 타임락(usable_from), 만료(expires_at), 사용상태(redeemed)
- **함수**
    - `mint(to, tokenURI, usableFrom, expiresAt, giftType, faceValue, currency)`
    - `redeem(tokenId, merchantId, amount)` (금액권 분할 사용 시 `redeemPartial` 패턴 고려)
    - `cancel(tokenId)`
- **이벤트**: `Minted`, `Redeemed`, `Canceled`, `Expired`

### 12.2 가맹점 정산(Settlement) 컨트랙트

- **기능**: `redeem` 시 정산 데이터 온체인 기록(merchantId, amount, time, tx)
- **옵션**: 실시간 자동송금 `payout(merchant, amount)` (가스/유동성 요건 충족 시)

### 12.3 P2P 에스크로 컨트랙트

- **기능**: 자산(토큰/NFT) 예치, 상태(OPEN/LOCKED/RELEASED/DISPUTED), 다중서명 릴리즈
- **함수**: `deposit(orderId, assetRef)`, `release(orderId)`, `refund(orderId)`, `raiseDispute(orderId)`
- **이벤트**: `Deposited`, `Released`, `Refunded`, `Disputed`

### 12.4 Staking 컨트랙트

- **기능**: 기간 고정 락업, APR 기반 보상 적립, 조기해지 정책(패널티)
- **함수**: `stake(productId, amount)`, `claim(positionId)`, `unstake(positionId)`

### 12.5 Lending/Loan 컨트랙트(담보형)

- **기능**: 담보 예치, LTV 검증, 청산 로직, 상환
- **함수**: `createOffer(...)`, `borrow(offerId, amount, collateral)`, `repay(loanId)`, `liquidate(loanId)`

### 12.6 권한/보안

- **AccessControl**: ADMIN, MERCHANT, ORACLE(정산/가격) 역할
- **Pausable**: 비상 중지
- **Upgradeable**: UUPS/Transparent Proxy

---

## 13. 외부 API 연동 스펙(요약)

> 실제 스웨거(YAML)는 후속 문서로 제공. 여기서는 흐름·엔드포인트 예시만 정리.
> 

### 13.1 mblockapi (BNB 체인)

- **지갑 발행**: `POST /wallets` → {address, pk(encrypted)}
- **잔액 조회**: `GET /wallets/{address}/balances`
- **토큰 전송**: `POST /tx/send` (from, to, token, amount, gasPolicy)
- **웹훅**: 입금 감지 `/webhooks/deposit`

### 13.2 Hashdam API

- **해시파워 통계**: `GET /v1/mining/stats?memberId=&date=` → {hashrate24h, reject}
- **해시파워 이력**: `GET /v1/mining/hashpower?memberId=`

### 13.3 쿠폰몰 공급사 API

- **카테고리/상품**: `GET /catalog?category=`
- **구매**: `POST /orders` (sku, quantity, payProof)
- **바우처 수령**: `GET /orders/{id}` → {code, pin, expires}
- **상태 동기화 웹훅**: `/webhooks/coupon`

### 13.4 CoinEx 관련 정책(출금)

- **계정 등록 검증**: 사전 등록된 CoinEx 계정만 허용(내부 DB 매핑)
- **출금 요청**: 내부 승인 플로우(2FA, 화이트리스트, 관리자 승인 → API 집행, 재무 다중 서명 2인 이상 필수)

---

## 14. 다음 산출물 예고

1. **화면 와이어프레임(주요 페이지)**
2. **OpenAPI YAML v0.1** (Auth/Wallet/NFT/P2P/Mining/EARN/Store/Admin)
3. **DB DDL v0.1** (PostgreSQL 기준)
4. **컨트랙트 인터페이스(ABI) 초안**
