# IC Wallet Task Checklist / IC 월렛 업무 체크리스트

Keep this checklist in sync with `spec.md`. Update `[ ]` to `[x]` as you finish each item.  
이 체크리스트는 `spec.md`와 함께 유지하세요. 항목 완료 시 `[ ]`를 `[x]`로 바꾸세요.

## 1. Discovery & IA / 기획 및 정보 구조
- [x] Finalize the screen map and IA across user, merchant, and admin journeys (spec.md 9–10). / 사용자·가맹점·관리자 여정을 포괄하는 화면 맵과 IA를 확정합니다(`spec.md` 9–10장 참고).
- [x] Review and enrich the domain ERD, filling any missing entities, attributes, or relations (section 11). / 도메인 ERD를 검토하고 누락된 엔티티·속성·관계를 보완합니다(11장).
- [x] Document SLA and security expectations for mblockapi, Hashdam, coupon providers, and CoinEx. / mblockapi·Hashdam·쿠폰사·CoinEx 연동의 SLA·보안 요구사항을 문서화했습니다.
- [x] Define role-based access and audit log policies for user, merchant, and admin touchpoints. / 사용자·가맹점·관리자 전 영역의 역할 기반 접근권한과 감사 로그 정책을 확정합니다.

## 2. Backend Architecture & Services / 백엔드 설계 및 서비스
- [x] Design PostgreSQL schemas and migrations for wallet, NFT, P2P, mining, EARN, and store domains. / 지갑·NFT·P2P·마이닝·EARN·스토어 도메인의 PostgreSQL 스키마와 마이그레이션을 설계합니다.
- [x] Specify adapters for external APIs (mblockapi, Hashdam, coupon, CoinEx) with failure and retry strategies. / 외부 API(mblockapi, Hashdam, 쿠폰사, CoinEx) 어댑터와 실패·재시도 전략을 정의합니다.
- [x] Implement admin REST APIs for members, merchants, wallets, NFTs, P2P, mining, EARN, store, and policies. / 회원·가맹점·지갑·NFT·P2P·마이닝·EARN·스토어·정책을 다루는 관리자 REST API를 구현합니다.
- [x] Build approval workflows covering withdrawal, settlement, and escrow with 2FA, whitelist, and admin review. / 2FA·화이트리스트·관리자 승인을 포함한 출금·정산·에스크로 승인 워크플로를 구축합니다.
- [ ] Develop shared modules for notifications, support, terms management, and embed audit logging. / 알림·고객센터·약관 관리 공통 모듈을 구현하고 감사 로그를 전 서비스에 삽입합니다.

## 3. Frontend Applications / 프론트엔드 애플리케이션
- [x] Establish the user app routing skeleton (`/wallet`, `/nft-market`, `/p2p`, `/mining`, `/earn`, `/store`, `/merchants`, `/me`). / 사용자 앱 라우팅 골격을 구성합니다.
- [x] Define state management and UI architecture for merchant (`/merchant/*`) and admin (`/admin/*`) portals. / 가맹점·관리자 포털의 상태 관리 및 UI 구조를 정의합니다.
- [ ] Implement wallet, NFT, P2P, mining, and EARN flows with live data integrations. / 지갑·NFT·P2P·마이닝·EARN 주요 플로우를 실데이터와 연동해 구현합니다.
- [ ] Design UX states for withdrawal, settlement, and escrow (warnings, 2FA prompts, progress indicators). / 출금·정산·에스크로 UX(경고, 2FA, 진행 상태)를 설계하고 반영합니다.
- [ ] Document multilingual support, network switching (BNB/ISC), and shared theming guidelines. / 다국어, 네트워크 전환(BNB/ISC), 공통 테마 가이드를 문서화합니다.

## 4. Smart Contracts / 스마트컨트랙트
- [ ] Specify NFT voucher/coupon contracts (timelock, expiry, cancel, partial use) and event schema. / 타임락·만료·취소·부분사용을 포함한 NFT 상품권/쿠폰 컨트랙트와 이벤트 스키마를 정의합니다.
- [ ] Define P2P escrow contract states and on-chain procedures. / P2P 에스크로 컨트랙트 상태 전이와 온체인 절차를 설계합니다.
- [ ] Finalize settlement contract data model and on/off-chain integration flow. / 정산 컨트랙트 데이터 모델과 온·오프체인 연동 흐름을 확정합니다.
- [ ] Draft staking, lending, and loan contract rules (APR, collateral, liquidation, upgrade pattern). / 스테이킹·랜딩·론 컨트랙트의 APR·담보·청산·업그레이드 규칙을 수립합니다.
- [ ] Implement AccessControl, Pausable, upgradeability with ADMIN/MERCHANT/ORACLE roles. / ADMIN·MERCHANT·ORACLE 역할이 포함된 AccessControl·Pausable·업그레이드 전략을 구현합니다.

## 5. Testing & Operations / 테스트 및 운영
- [ ] Create unit/integration test plans per domain and enforce ≥90% coverage on critical flows via CI. / 도메인별 단위·통합 테스트 계획을 세우고 핵심 흐름 90% 이상 커버리지를 CI에 반영합니다.
- [x] Build mocks or simulators for external services and validate failure/retry logic. / 외부 서비스 모킹·재시도 로직 검증을 완료했습니다.
- [ ] Prepare UAT scripts for withdrawal, settlement, and escrow including 2FA and whitelist checks. / 출금·정산·에스크로 UAT 시나리오와 2FA·화이트리스트 검증 절차를 마련합니다.
- [ ] Define CI/CD pipelines, environment configuration (.env management), and monitoring metrics. / CI/CD 파이프라인, 환경 설정(.env 관리), 모니터링 지표를 정의합니다.
- [ ] Complete operational playbooks (withdrawal policy, API failure handling, role change process) and training materials. / 출금 정책, API 장애 대응, 권한 변경 절차 등 운영 매뉴얼과 교육 자료를 완비합니다.
