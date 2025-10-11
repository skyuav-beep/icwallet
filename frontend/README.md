# Frontend Application / 프런트엔드 애플리케이션

Next.js (App Router) workspace delivering the IC Wallet user, merchant, and admin experiences.  
IC 월렛의 사용자·가맹점·관리자 화면을 제공하는 Next.js(App Router) 워크스페이스입니다.

## Commands / 명령어
- `pnpm dev` — run the development server with Turbopack.  
  `pnpm dev` — Turbopack 기반 개발 서버를 실행합니다.
- `pnpm build` & `pnpm start` — create and serve a production build.  
  `pnpm build` & `pnpm start` — 프로덕션 빌드를 생성하고 제공합니다.
- `pnpm lint` — run ESLint against the project.  
  `pnpm lint` — ESLint 검사를 실행합니다.

## Structure / 구조
- `app/` — App Router entry points (e.g., `/wallet`, `/p2p`, `/mining`).  
  `app/` — 앱 라우터 엔트리 포인트(예: `/wallet`, `/p2p`, `/mining`).
- `components/` (add later) — shared UI building blocks.  
  `components/`(추가 예정) — 공용 UI 컴포넌트.
- `lib/` (add later) — data fetching helpers (React Query integration).  
  `lib/`(추가 예정) — 데이터 페칭 헬퍼(React Query 연동).

Keep UI copy bilingual and mirror flows documented in `spec.md`.  
UI 문구는 항상 영문/국문으로 병기하고 `spec.md`에 정의된 플로를 반영하세요.
