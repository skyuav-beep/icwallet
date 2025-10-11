# Information Architecture Summary / 정보 구조 요약

This document finalizes the screen map and navigation flow for the IC Wallet platform across user, merchant, and admin surfaces. Keep it aligned with `spec.md` §10 and update together with `docs/ROADMAP.md`.  
본 문서는 IC 월렛 플랫폼의 사용자·가맹점·관리자 화면 맵과 내비게이션 흐름을 확정합니다. `spec.md` 10장과 정합성을 유지하며 `docs/ROADMAP.md`와 함께 갱신하세요.

## Shared Navigation & System Flows / 공통 내비게이션 및 시스템 플로
- **Shell layout**: global top bar → network indicator (BNB↔ISC), notification bell, language toggle, user/merchant/admin switcher.  
  **공통 레이아웃**: 상단 바에 네트워크 전환(BNB↔ISC), 알림, 언어 토글, 사용자/가맹점/관리자 전환.
- **Session guard**: 2FA + Turnstile challenge required before accessing `/wallet/*`, `/p2p/*`, `/mining/withdraw`, `/earn/*`, `/admin/*`.  
  **세션 보호**: `/wallet/*`, `/p2p/*`, `/mining/withdraw`, `/earn/*`, `/admin/*` 진입 시 2FA·Turnstile 선행.
- **Modal stack**: unified confirmation/toast system; deposits, withdrawals, NFT redemption, and dispute actions reuse shared modal components under `src/ui/shared/modals`.  
  **모달 스택**: 입금·출금·NFT 사용·분쟁 처리 모달을 `src/ui/shared/modals` 공용 컴포넌트로 사용.
- **Audit hooks**: all destructive flows emit `AuditLogEvent` (see `spec.md` §8); admin tools expose inline status banners showing latest audit outcome.  
  **감사 훅**: 파괴적 액션은 `AuditLogEvent`를 발생시키며, 관리자 화면은 최근 감사 결과 배너를 표시.
- **Deep links**: notifications carry route params (`/p2p/order/:id`, `/mining/withdraw/:requestId`), so each domain page must support query prefill and state replay.  
  **딥링크**: 알림에 담긴 라우트 파라미터(`/p2p/order/:id`, `/mining/withdraw/:requestId`)를 처리할 수 있도록 각 도메인 페이지는 쿼리 프리필과 상태 재생을 지원.

## User App Journey / 사용자 앱 여정

### Flow Stages / 플로 단계
1. **Onboarding & Security** — `/signup`, `/login`, `/forgot`, `/verify-2fa`: account creation, device trust, Turnstile challenge.  
   **온보딩·보안** — 계정 생성, 기기 신뢰, Turnstile 검증.
2. **Activation Hub** — `/` dashboard cards link to wallet, NFT, P2P, mining, EARN summaries; unread alerts drive actions.  
   **활성화 허브** — 대시보드 카드에서 지갑·NFT·P2P·마이닝·EARN 요약을 제공하고 미확인 알림으로 행동 유도.
3. **Transaction Domains** — `/wallet/*`, `/nft-market/*`, `/p2p/*`, `/mining/*`, `/earn/*`, `/store`, `/merchants`.  
   **거래 도메인** — 지갑, NFT 마켓, P2P, 마이닝, EARN, 스토어, 가맹점 영역으로 이동.
4. **Account Operations** — `/me/*`: profile, KYC bindings, whitelist, notification preferences, support.  
   **계정 운영** — `/me/*`에서 프로필, KYC 연동, 화이트리스트, 알림 선호, 고객센터 기능 제공.

### Screen Map / 화면 맵

```text
/
├─ login (로그인)
├─ signup (가입)
├─ forgot (비밀번호 찾기)
├─ verify-2fa (2FA 검증)
├─ wallet (지갑)
│  ├─ assets (자산 목록)
│  ├─ nft (NFT 보유)
│  ├─ send (송금)
│  ├─ receive (수신)
│  └─ swap (스왑)
├─ nft-market (NFT 마켓)
│  ├─ gift (상품권)
│  └─ coupon (쿠폰)
├─ p2p (P2P 거래)
│  ├─ list (리스트)
│  ├─ sell/new (판매 등록)
│  ├─ buy/new (구매 등록)
│  ├─ my (나의 거래)
│  └─ order/:id (거래 상세/분쟁)
├─ mining (마이닝)
│  ├─ hashpower (해시파워)
│  ├─ stats (통계)
│  ├─ withdraw (출금)
│  └─ wallets (채굴 지갑)
├─ earn (재테크)
│  ├─ staking (스테이킹)
│  ├─ lending (랜딩)
│  └─ loan (론)
├─ store (스토어)
├─ merchants (가맹점)
└─ me (마이페이지)
   ├─ profile (프로필)
   ├─ security (보안)
   ├─ notifications (알림)
   ├─ exchange (거래소 계정)
   ├─ whitelist (화이트리스트)
   ├─ notices (공지)
   ├─ support (지원)
   ├─ terms (약관)
   ├─ privacy (개인정보)
   └─ version (버전 안내)
```

### Key Interactions / 핵심 인터랙션
- **Dashboard cards**: surface balance, pending withdrawals, NFT expiry alerts, latest dispute status; clicking routes user to filtered domain views.  
  **대시보드 카드**: 잔고, 대기 중 출금, NFT 만료 알림, 분쟁 상태를 표시하며 클릭 시 필터된 화면으로 이동.
- **Wallet send/swap**: integrates network switcher, 2FA confirmation, address whitelist check; transaction preview modal shows fees, fiat equivalent.  
  **지갑 송금/스왑**: 네트워크 전환, 2FA 확인, 주소 화이트리스트 검증 통합; 모달에서 수수료·법정화폐 환산값 미리보기 제공.
- **P2P order detail**: timeline (matched → funded → released), escrow chat, evidence upload; triggers `/support` ticket creation on escalation.  
  **P2P 거래 상세**: 타임라인(매칭→입금→해제), 에스크로 채팅, 증빙 업로드; 분쟁 시 `/support` 티켓 생성.
- **Mining withdraw**: multi-step wizard (select coin → link CoinEx account → 2FA → review → submit); status page links to admin approval queue.  
  **마이닝 출금**: 코인 선택→CoinEx 계정 연동→2FA→검토→제출의 다단계 마법사; 상태 페이지에서 관리자 승인 큐로 연결.
- **EARN flows**: staking enrolment uses APR validator, lock period picker; lending offer matches to borrowers via modal; loan application fetches collateral options from `/wallet/assets`.  
  **EARN 플로**: 스테이킹 등록 시 APR 검증과 락업 기간 선택, 랜딩 제안은 모달에서 차입자 매칭, 론 신청은 `/wallet/assets`의 담보 옵션을 호출.
- **My Page security**: 2FA reset, device management, withdrawal whitelist editing; every mutation requires OTP confirmation and logs `AuditLog`.  
  **마이페이지 보안**: 2FA 초기화, 기기 관리, 출금 화이트리스트 수정 시 OTP 확인과 `AuditLog` 기록 필수.

## Merchant Portal Journey / 가맹점 포털 여정

### Flow Stages / 플로 단계
1. **Merchant onboarding** — `/merchant/signup`, `/merchant/kyc`: submit business docs, wait for admin approval; notifications mirror status in `/admin/merchants`.  
   **가맹점 온보딩** — 사업자 서류 제출 후 관리자 승인 대기; 상태는 `/admin/merchants`와 연동된 알림으로 안내.
2. **Catalog & redemption** — manage vouchers, monitor redemption pipeline, configure redemption limits.  
   **카탈로그·사용 관리** — 상품권 설정, 사용 파이프라인 모니터링, 사용 한도 설정.
3. **Settlement & reconciliation** — review settlement cycles, download statements, flag discrepancies to support.  
   **정산·정합성 검증** — 정산 주기 확인, 명세 다운로드, 이상 거래를 고객센터에 신고.

### Screen Map / 화면 맵

```text
/merchant
├─ login (로그인)
├─ signup (가입)
├─ kyc (KYC 제출)
├─ dashboard (요약)
├─ products (상품 관리)
│  ├─ create (등록)
│  └─ edit/:id (수정)
├─ sales (판매·사용 현황)
├─ settlement (정산)
│  ├─ cycles (주기별 내역)
│  └─ payouts/:id (지급 상세)
├─ nft (NFT 타입 안내)
└─ settings (설정/멤버)
```

### Key Interactions / 핵심 인터랙션
- **Dashboard**: real-time redemption funnel, outstanding settlements, compliance alerts (e.g., expiring KYC).  
  **대시보드**: 실시간 사용 퍼널, 미지급 정산, KYC 만료 등 컴플라이언스 알림 표시.
- **Product editor**: supports bulk CSV upload for coupon codes, time-window scheduling, inventory thresholds.  
  **상품 편집기**: 쿠폰 코드 일괄 업로드, 시간대별 판매 스케줄, 재고 임계치 설정 지원.
- **Settlement screen**: generate settlement request, attach invoices, push to `/admin/merchants` queue; discrepancies spawn `/merchant/support` ticket.  
  **정산 화면**: 정산 요청 생성, 인보이스 첨부, `/admin/merchants` 큐로 전송; 불일치 시 `/merchant/support` 티켓 생성.
- **Settings**: manage staff roles (cashier, manager), webhooks for redemption callbacks, API keys rotation prompts.  
  **설정**: 직원 역할(캐셔, 관리자) 관리, 사용 콜백 웹훅, API 키 교체 알림 제공.

## Admin Console Journey / 관리자 콘솔 여정

### Flow Stages / 플로 단계
1. **Operational monitoring** — `/admin/dashboard`, `/admin/alerts`: aggregate system health, SLA breaches, audit backlog.  
   **운영 모니터링** — 시스템 상태, SLA 위반, 감사 백로그를 집계.
2. **Domain administration** — members, wallets, merchants, P2P, mining, EARN, store modules each expose CRUD + approval workflows.  
   **도메인 관리** — 회원, 지갑, 가맹점, P2P, 마이닝, EARN, 스토어 모듈에서 CRUD와 승인 워크플로 제공.
3. **Policy & compliance** — settings, audit, content modules manage policies, announcements, role changes.  
   **정책·컴플라이언스** — 설정, 감사, 콘텐츠 모듈에서 정책, 공지, 권한 변경을 다룸.

### Screen Map / 화면 맵

```text
/admin
├─ login (로그인)
├─ dashboard (운영 현황)
├─ alerts (경보)
├─ members
│  ├─ list (회원 목록)
│  └─ detail/:id (상세)
├─ wallets
│  ├─ tokens (토큰)
│  ├─ nft (NFT 컬렉션)
│  └─ whitelist (화이트리스트 요청)
├─ merchants
│  ├─ applications (신청)
│  ├─ settlement (정산 큐)
│  └─ nft-issuance (NFT 발행)
├─ p2p
│  ├─ orders (거래 큐)
│  └─ disputes (분쟁)
├─ mining
│  ├─ payouts (지급)
│  └─ withdrawals (출금 승인)
├─ earn
│  ├─ products (상품 관리)
│  └─ positions (포지션 모니터링)
├─ store
│  ├─ catalog (상품)
│  └─ vouchers (쿠폰 코드)
├─ content
│  ├─ notices (공지)
│  └─ faq (FAQ)
└─ settings
   ├─ roles (역할)
   ├─ policies (정책)
   ├─ audit-log (감사 로그)
   └─ integrations (외부 연동)
```

### Key Interactions / 핵심 인터랙션
- **Alerts**: queue of SLA breaches, fraud flags, failed webhooks; admins can assign or snooze, each action logs actor/time.  
  **경보**: SLA 위반, 사기 징후, 실패한 웹훅 큐; 담당자 지정·보류 시 행위자와 시간이 기록.
- **Approval workflows**: withdrawals, merchant onboarding, dispute resolutions share a common approval drawer with diff view and history timeline.  
  **승인 워크플로**: 출금, 가맹점 온보딩, 분쟁 조정은 공통 승인 드로어에서 변경사항 비교와 히스토리 타임라인 제공.
- **Audit log viewer**: filters by actor, domain, severity; deep link back to originating record (e.g., `/p2p/disputes/:id`).  
  **감사 로그 뷰어**: 행위자·도메인·심각도 필터링, 원본 기록(`/p2p/disputes/:id` 등)으로 딥링크 제공.
- **Policy editor**: versioned documents (terms, privacy, withdrawal policy) with bilingual content enforcement; publishing prompts translation completeness check.  
  **정책 편집기**: 약관·개인정보·출금 정책 등 버전 관리, 양언어 필수; 게시 시 번역 완전성 검사.
- **Integration settings**: manage API credentials for mblockapi, Hashdam, coupon providers, CoinEx; rotation reminders feed into `docs/WALLET-KEY-ROTATION.md`.  
  **연동 설정**: mblockapi, Hashdam, 쿠폰사, CoinEx 자격증명 관리; 교체 알림은 `docs/WALLET-KEY-ROTATION.md`와 연계.

---

Maintain this IA as the canonical reference before wireframes or UI specs are updated; any new journey must add bilingual entries here and in `spec.md` if scope changes.  
향후 와이어프레임·UI 스펙 작성 전 이 문서를 기준 자료로 사용하며, 새로운 여정이 생기면 양언어 항목을 여기에 추가하고 범위 변화 시 `spec.md`도 갱신하세요.
