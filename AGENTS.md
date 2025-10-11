# Repository Guidelines / 저장소 가이드라인

Maintain bilingual (EN/KR) documentation across all project artifacts; add translations whenever updating or creating content. (KR: 모든 문서는 영문·국문 병기를 기본으로 하며, 신규/수정 시 번역을 함께 제공합니다.)

Follow rules; update `spec.md` when scope/controls change. (KR: 범위·규제 변동 시 `spec.md` 갱신, 지침 준수)

## Project Structure & Module Organization / 프로젝트 구조 및 모듈 구성
- Layout: `src/` → `core/`, `adapters/`, `ui/`, `shared/`. (KR: `src/`에 `core/`, `adapters/`, `ui/`, `shared/` 배치)
- Tests: mirror runtime folders (`tests/core`, `tests/ui`). (KR: `tests/core`, `tests/ui`로 런타임 구조 유지)
- Docs: `docs/` for design notes; `scripts/` for automation; new dirs add `README.md`. (KR: `docs/` 설계, `scripts/` 자동화, 새 폴더 `README.md`)
- Updates: record workflow or compliance shifts in `spec.md`. (KR: 워크플로·규제 변경 `spec.md` 기록)

## Build, Test, and Development Commands / 빌드·테스트·개발 명령
- `make setup`: toolchains, dependencies, local configs. (KR: 도구·의존성·로컬 설정 `make setup`)
- `make build`: CI-matched production bundle. (KR: 프로덕션 번들 `make build` = CI)
- `make test`: full suite before merge. (KR: 병합 전 전체 테스트 `make test`)
- `make lint`: format + static checks; fix pre-commit. (KR: 포맷·정적 분석 `make lint`, 커밋 전 해결)

## Coding Style & Naming Conventions / 코딩 스타일 및 네이밍 규칙
- Indent: TypeScript·JSON 2 spaces; Rust·Python 4. (KR: TypeScript·JSON 2칸, Rust·Python 4칸)
- Naming: PascalCase exports, camelCase functions, SCREAMING_SNAKE_CASE constants, kebab-case `ui/` files. (KR: 노출 PascalCase, 함수 camelCase, 상수 SCREAMING_SNAKE_CASE, `ui/` 케밥)
- Gate: run `make lint` before push; block regressions. (KR: 푸시 전 `make lint`, 회귀 금지)

## Testing Guidelines / 테스트 지침
- Unit: place files in `tests/` beside each feature with clear names. (KR: 기능 옆 `tests/`, 명확한 이름)
- Integration: cover ledger or gateway paths before touching shared state. (KR: 공유 상태 전 원장·게이트웨이 검증)
- Coverage: keep ≥90% on critical flows; publish metrics via CI/PR. (KR: 핵심 커버리지 90%↑, CI·PR 공유)

## Commit & Pull Request Guidelines / 커밋 및 PR 지침
- Commits: Conventional (`feat:`, `fix:`, `docs:`) ≤72-char subjects; use `Refs #123` or `Fixes #123`; link stories when `spec.md` changes. (KR: Conventional 형식, 제목 72자 이하, `Refs#/Fixes#`, `spec.md` 변경 시 스토리 링크)
- PRs: explain intent, show `make test` results, note deploy impact; attach UI/CLI captures. (KR: PR 의도·`make test` 결과·배포 영향 기재, UI·CLI 캡처 첨부)

## Security & Configuration Tips / 보안 및 설정 팁
- Secrets: store in `.env.local`; ship `.env.example` defaults. (KR: 비밀 `.env.local`, 기본값 `.env.example`)
- Maintenance: rotate API keys quarterly and log in `docs/security.md`; review dependencies for CVEs quarterly and record fixes in release notes. (KR: API 키 분기 교체·`docs/security.md`, 의존성 CVE 분기 점검·릴리스 기록)
