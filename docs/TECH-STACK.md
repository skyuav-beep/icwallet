# Technology Stack Decisions / 기술 스택 결정

This document records the initial technology selections for the IC Wallet platform. Update it whenever the stack changes and keep `spec.md`/`TASKS.md` aligned.  
본 문서는 IC 월렛 플랫폼의 초기 기술 스택 결정을 기록합니다. 스택이 변경되면 즉시 갱신하고 `spec.md`와 `TASKS.md`에도 반영하세요.

## Backend / 백엔드
- **Language & Runtime**: TypeScript on Node.js 20 LTS — strong ecosystem for Web3 tooling and shared language across services.  
  **언어·런타임**: TypeScript + Node.js 20 LTS — Web3 도구 생태계가 풍부하고 서비스 간 언어 통일성이 우수합니다.
- **Framework**: NestJS — modular architecture, built-in DI, Swagger integration, and easy microservice expansion.  
  **프레임워크**: NestJS — 모듈식 구조, DI 내장, Swagger 연동, 마이크로서비스 확장에 용이합니다.
- **Database**: PostgreSQL 15 — relational consistency for wallet, P2P, mining, EARN entities noted in `spec.md`.  
  **데이터베이스**: PostgreSQL 15 — `spec.md`에 언급된 지갑·P2P·마이닝·EARN 엔티티에 관계형 일관성을 제공합니다.
- **ORM/Query**: Prisma — type-safe schema management, migration workflows, and multi-database readiness.  
  **ORM/쿼리**: Prisma — 타입 안전한 스키마 관리, 마이그레이션 워크플로, 다중 DB 준비에 적합합니다.
- **API Standards**: REST + OpenAPI 3.1 for public/admin surfaces; GraphQL considered later if needed.  
  **API 규격**: 공개·관리자 화면용 REST + OpenAPI 3.1, 필요 시 GraphQL을 후속 검토합니다.

## Frontend / 프론트엔드
- **Language**: TypeScript.  
  **언어**: TypeScript.
- **Framework**: Next.js 14 (App Router) — SSR/ISR support, route segments match spec’s IA, and good SEO.  
  **프레임워크**: Next.js 14(App Router) — SSR/ISR, IA 구조와 라우트 세그먼트 정합성, SEO에 유리합니다.
- **UI Layer**: Chakra UI + Tailwind utility classes for rapid prototyping and consistent theming.  
  **UI 레이어**: Chakra UI + Tailwind 유틸 클래스 — 빠른 프로토타이핑과 일관된 테마 적용에 적합합니다.
- **State Management**: React Query (server state) + Zustand (local state) to balance async data and UI state.  
  **상태 관리**: React Query(서버 상태) + Zustand(로컬 상태) 조합으로 비동기 데이터와 UI 상태를 균형 있게 다룹니다.

## Smart Contracts / 스마트컨트랙트
- **Language**: Solidity 0.8.x.  
  **언어**: Solidity 0.8.x.
- **Framework**: Foundry (forge/cast) with Hardhat plugin compatibility for testing and deployments.  
  **프레임워크**: Foundry(Forge/Cast) — 테스트·배포에 강력하며 Hardhat 플러그인과 호환됩니다.
- **Libraries**: OpenZeppelin Contracts (AccessControl, Pausable, ERC721, ERC1155, ERC20, UUPS) for security baseline.  
  **라이브러리**: OpenZeppelin Contracts(AccessControl, Pausable, ERC721, ERC1155, ERC20, UUPS) — 보안 기준을 제공합니다.
- **Networks**: Island Smart Chain (ISC) primary; BNB Chain for wallet interoperability.  
  **네트워크**: Island Smart Chain(ISC) 주력, 지갑 상호운용성 확보를 위해 BNB Chain 지원.

## Tooling & DevOps / 도구 및 데브옵스
- **Package Manager**: pnpm 8 — workspace-friendly and efficient for monorepo management. ✅  
  **패키지 관리자**: pnpm 8 — 워크스페이스 및 모노레포 관리에 효율적입니다.
- **Lint/Format**: ESLint, Prettier, Stylelint, Solhint — enforce consistency across TS/SC/SCSS/Solidity. ✅  
  **린트·포맷**: ESLint, Prettier, Stylelint, Solhint — TS/SC/SCSS/Solidity 전반의 일관성을 확보합니다.
- **Testing**: Vitest (backend), Foundry (contracts), Jest + Testing Library (frontend TBD).  
  **테스트**: 백엔드 Vitest, 컨트랙트 Foundry, 프런트엔드 Jest/TL 예정.
- **CI/CD**: GitHub Actions (matrix with `RUN_MBLOCK_TESTS` flag). ✅  
  **CI/CD**: GitHub Actions — `RUN_MBLOCK_TESTS` 매트릭스로 라이브 테스트 분리.
- **Containerization**: Docker setup for Postgres/Redis; Compose stack planned.  
  **컨테이너**: Docker로 Postgres/Redis 실행, Compose 스택 구축 예정.

## Observability / 관측성
- **Logging**: Pino (backend) + Loki stack integration.  
  **로깅**: 백엔드 Pino + Loki 스택 연동.
- **Metrics**: Prometheus exporters; Grafana dashboards for wallet/P2P/mining metrics.  
  **메트릭**: Prometheus 익스포터, Grafana 대시보드 — 지갑·P2P·마이닝 지표를 시각화합니다.
- **Tracing**: OpenTelemetry instrumentation for critical flows (withdrawal, escrow release, NFT redeem).  
  **트레이싱**: 출금·에스크로·NFT 사용 등 핵심 흐름에 OpenTelemetry 계측을 적용합니다.

Revisit this document at the end of each milestone to confirm alignment with evolving requirements and performance needs.  
각 마일스톤 종료 시 요구사항·성능 요구와의 정합성을 확인하기 위해 본 문서를 재검토하세요.
