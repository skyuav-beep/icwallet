# Smart Contracts / 스마트컨트랙트

Foundry workspace for ISC/BNB contracts (NFT vouchers, escrow, staking, etc.).  
ISC/BNB 네트워크용 스마트컨트랙트를 개발하는 Foundry 워크스페이스입니다.

## Commands / 명령어
- `forge build` — compile contracts. / `forge build` — 컨트랙트를 컴파일합니다.
- `forge test` — run unit tests. / `forge test` — 단위 테스트를 실행합니다.
- `forge script script/Deploy.s.sol --rpc-url <endpoint> --broadcast` — deploy scripts.  
  `forge script script/Deploy.s.sol --rpc-url <엔드포인트> --broadcast` — 배포 스크립트를 실행합니다.

## Structure / 구조
- `src/` — production contracts (e.g., NFT voucher, escrow, staking).  
  `src/` — 프로덕션 컨트랙트(NFT 상품권, 에스크로, 스테이킹 등).
- `script/` — deployment & maintenance scripts.  
  `script/` — 배포 및 운영 스크립트.
- `test/` — Forge tests (DSTest / Foundry std).  
  `test/` — Forge 테스트.
- `foundry.toml` — compiler and network configuration (EN/KR comments inline).  
  `foundry.toml` — 컴파일러 및 네트워크 설정.

Always document contract changes in both languages and sync requirements with `docs/ROADMAP.md`.  
컨트랙트 변경 시 영문/국문으로 기록하고 `docs/ROADMAP.md` 요구사항과 동기화하세요.
