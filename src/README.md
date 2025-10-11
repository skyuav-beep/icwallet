# Source Modules Overview / 소스 모듈 개요

This directory contains production source code for the IC Wallet platform. Organize features into the subfolders below and keep documentation bilingual (EN/KR).  
이 디렉터리는 IC 월렛 플랫폼의 프로덕션 소스 코드를 보관하는 곳입니다. 아래 하위 폴더 기준으로 기능을 배치하고 모든 문서는 영문/국문으로 관리하세요.

- `core/`: Domain logic for wallet, NFT, P2P, mining, EARN, and store workflows.  
  `core/`: 지갑, NFT, P2P, 마이닝, EARN, 스토어 도메인 로직을 담습니다.
- `adapters/`: Integrations with external services such as mblockapi, Hashdam, coupon providers, and CoinEx.  
  `adapters/`: mblockapi, Hashdam, 쿠폰 공급사, CoinEx 등 외부 서비스 연동을 구현합니다.
- `ui/`: Front-end delivery (web/mobile surfaces) and shared presentation components.  
  `ui/`: 프런트엔드 화면과 공용 프레젠테이션 컴포넌트를 배치합니다.
- `shared/`: Cross-cutting utilities, validation, configuration, and constants shared across modules.  
  `shared/`: 공용 유틸리티, 검증 로직, 설정, 상수를 모아 관리합니다.

When introducing new submodules, add a brief `README.md` describing purpose and dependencies in both languages.  
새 하위 모듈을 만들 때는 목적과 의존성을 영문/국문으로 설명하는 `README.md`를 추가하세요.
