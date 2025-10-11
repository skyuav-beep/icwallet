# Initial Development Roadmap / 초기 개발 로드맵

This roadmap translates `spec.md` and `TASKS.md` into actionable, short-term milestones so the team can begin implementation.  
이 로드맵은 `spec.md`와 `TASKS.md` 내용을 단기 실행 과제로 전환하여 개발을 시작할 수 있도록 돕습니다.

## Milestone 0 — Environment & Foundations / 마일스톤 0 — 환경 및 기반
- [ ] Confirm tech stack selections for backend, frontend, and smart contracts; document decisions.  
  백엔드·프런트엔드·스마트컨트랙트 기술 스택을 확정하고 의사결정을 문서화합니다.
- [ ] Scaffold project tooling (package managers, linters, formatters, CI placeholders).  
  패키지 관리자, 린터, 포매터, CI 기본 구성을 마련합니다.
- [ ] Define `.env.example` and secret management approach.  
  `.env.example`를 생성하고 비밀 관리 방식을 정의합니다.

- [ ] Implement member onboarding (signup/login/2FA) API and UI skeletons.  
  회원 가입·로그인·2FA API와 UI 골격을 구현합니다.
- [x] Integrate mblockapi for wallet provisioning and balance sync.  
  지갑 발급 및 잔액 동기화를 위해 mblockapi를 연동했습니다.
- [ ] Build wallet dashboard (assets, NFT listings, send/receive, swap placeholders).  
  지갑 대시보드(자산, NFT 목록, 송금/수신, 스왑 기본 UI)를 개발합니다.

## Milestone 2 — NFT Voucher Marketplace / 마일스톤 2 — NFT 상품권 마켓
- [ ] Draft NFT minting smart contracts with timelock/expiry logic.  
  타임락·만료 로직을 포함한 NFT 발행 스마트컨트랙트를 설계합니다.
- [ ] Create admin workflows for NFT product definition and mint triggers.  
  NFT 상품 정의 및 발행 트리거를 위한 관리자 워크플로를 구축합니다.
- [ ] Expose user storefront with catalog, purchase, and redemption status tracking.  
  카탈로그, 구매, 사용 상태 추적을 포함한 사용자 스토어프런트를 제공합니다.

- [ ] Deliver P2P order management API and escrow contract integration.  
  P2P 주문 관리 API와 에스크로 컨트랙트 연동을 구현합니다.
- [ ] Implement dispute resolution admin tooling and notification flows.  
  분쟁 처리용 관리자 도구와 알림 플로를 개발합니다.
- [ ] Launch user-facing buy/sell interfaces with status transitions.  
  사용자용 매수/매도 화면과 상태 전환 로직을 공개합니다.

## Milestone 4 — Mining & EARN / 마일스톤 4 — 마이닝 및 EARN
- [ ] Synchronize Hashdam mining stats and display dashboards.  
  Hashdam 마이닝 지표를 동기화하고 대시보드를 구현합니다.
- [ ] Implement EARN products (staking, lending, loan) contract calls and UI.  
  스테이킹·랜딩·론 상품의 컨트랙트 호출과 UI를 개발합니다.
- [ ] Add withdrawal approvals pipeline to enforce whitelist and admin review.  
  화이트리스트 및 관리자 승인 절차를 갖춘 출금 파이프라인을 구축합니다.

## Milestone 5 — Operations & Compliance / 마일스톤 5 — 운영 및 컴플라이언스
- [ ] Complete coupon provider integration and merchant settlement flows.  
  쿠폰 공급사 연동 및 가맹점 정산 흐름을 마무리합니다.
- [ ] Finalize monitoring, logging, and audit dashboards.  
  모니터링, 로깅, 감사 대시보드를 완성합니다.
- [ ] Produce runbooks (withdrawal policy, incident response, role change).  
  출금 정책, 장애 대응, 권한 변경 등 운영 매뉴얼을 작성합니다.

Review and update this roadmap at the end of each sprint to keep alignment with evolving requirements.  
각 스프린트 종료 시 요구사항 변화를 반영하기 위해 본 로드맵을 검토하고 업데이트하세요.
