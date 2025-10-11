# Test Suite Overview / 테스트 스위트 개요

Automated tests live under this directory and mirror the structure of `src/`. Keep coverage expectations and execution commands aligned with `TASKS.md`.  
자동화 테스트는 `src/` 구조를 반영하며 이 디렉터리에 위치합니다. 커버리지 목표와 실행 명령은 `TASKS.md`와 일치시켜 관리하세요.

- `core/`: Unit and integration tests for domain logic (wallet, NFT, P2P, mining, EARN, store).  
  `core/`: 지갑, NFT, P2P, 마이닝, EARN, 스토어 도메인 로직에 대한 단위/통합 테스트를 작성합니다.
- `ui/`: Component and end-to-end interaction tests for user, merchant, and admin experiences.  
  `ui/`: 사용자·가맹점·관리자 화면의 컴포넌트 및 E2E 테스트를 구성합니다.
- `shared/`: Utility and helper validation coverage shared across modules.  
  `shared/`: 모듈 간 공유 유틸리티 및 검증 로직을 테스트합니다.

Add new subdirectories as needed and document any custom tooling or fixtures in bilingual `README.md` files.  
필요 시 하위 디렉터리를 추가하고, 사용자 정의 도구나 픽스처가 있다면 영문/국문 `README.md`로 설명하세요.
