# Role-Based Access & Audit Policy / 역할 기반 접근·감사 정책

This document defines the role model, permission boundaries, and audit logging requirements for the IC Wallet platform across user, merchant, and admin surfaces. Keep it synchronized with `spec.md` §§5, 10, 11 and update when new roles or compliance controls are introduced.  
본 문서는 IC 월렛 플랫폼의 사용자·가맹점·관리자 전면에서 적용되는 역할 모델, 권한 범위, 감사 로그 요건을 정의합니다. 새로운 역할이나 규제 통제가 생기면 `spec.md` §§5, 10, 11과 함께 즉시 갱신하세요.

## 1. Actors & Roles / 행위자·역할 정의

- **End User (회원)**: 개인 고객. 지갑, NFT, P2P, 마이닝, EARN, 스토어 기능을 이용하며 자신의 데이터만 조회/수정.  
  개인 고객으로 지갑·NFT·P2P·마이닝·EARN·스토어 기능을 사용하고 본인 데이터만 접근합니다.
- **Merchant Staff**  
  - *Cashier* (캐셔): NFT 상품권 검증·사용 처리, 주문/정산 현황 조회만 허용.  
    NFT 상품권을 확인하고 사용 처리하며 주문/정산 현황만 열람합니다.  
  - *Manager* (매니저): 상품 관리, 정산 요청, 웹훅/키 관리 등 상위 권한 포함.  
    상품 등록·정산 요청·웹훅·API 키 관리를 수행합니다.
- **Admin Team**  
  - *Operations Admin* (운영 관리자): 회원/지갑/P2P/스토어 운영 관리.  
    회원, 지갑, P2P, 스토어 전반을 운영합니다.  
  - *Finance Admin* (재무 관리자): 정산, 출금, 회계 리포트 승인 권한.  
    정산·출금·회계 리포트를 승인합니다.  
  - *Compliance Officer* (컴플라이언스 담당): KYC/AML, 감사 로그 검토, 정지/해제 권한.  
    KYC/AML 검토와 계정 정지/해제를 담당합니다.  
  - *Support Agent* (고객지원): 문의 처리, 고객 알림 발송, 계정 상태 변경 요청(직접 승인 불가).  
    문의 답변과 고객 알림 발송을 수행하며 계정 변경은 요청만 가능합니다.  
  - *Super Admin* (최고 관리자): RBAC 편집, 환경 설정, 기타 모든 권한. 해당 권한은 최소 2명으로 제한.  
    RBAC 편집 및 모든 권한을 가지며 최소 2명에게만 부여됩니다.
- **System Integration** (시스템 연동): 배치 작업, 외부 API 연동 등 비인간 주체에 할당되는 서비스 계정.  
  배치 작업과 외부 API 연동을 위한 서비스 계정입니다.

## 2. Access Principles / 접근 원칙

1. **Least Privilege / 최소 권한**: 각 역할은 업무 수행에 필요한 최소한의 권한만 보유하며, 추가 접근은 `Super Admin` 승인과 감사 로그 기록이 필요.  
   각 역할은 업무에 필요한 최소 권한만 부여되고, 추가 권한은 `Super Admin` 승인 및 감사 로그 기록이 필수입니다.
2. **Segregation of Duties / 직무 분리**: 재무 승인(출금/정산)과 정책 편집(RBAC/환경)은 별도 역할로 나누고 한 계정에 동시에 부여하지 않음.  
   출금·정산 승인과 RBAC/환경 설정 권한은 다른 역할로 분리해 한 계정에 동시에 부여하지 않습니다.
3. **Step-up Authentication / 단계적 인증**: 출금, KYC 조치, RBAC 변경과 같은 고위험 작업은 2FA 및 Turnstile 재검증을 요구.  
   고위험 작업 시 2FA 및 Turnstile 재검증을 필수로 요구합니다.
4. **Session Guardrails / 세션 가드레일**: 관리자·가맹점 포털은 15분 비활동 시 세션 만료, IP/기기 변경 시 재로그인.  
   관리자·가맹점 포털은 15분 비활동 후 세션 만료하며 IP/기기 변경 시 재로그인을 요구합니다.
5. **Change Management / 변경 관리**: RBAC 정책 변경은 사전 승인(Ticket) + 사후 감사 로그 검토를 거침.  
   RBAC 변경은 사전 승인 티켓과 사후 감사 검토 절차를 거칩니다.

## 3. Permission Matrix Summary / 권한 매트릭스 요약

| Domain / 도메인 | End User | Merchant Cashier | Merchant Manager | Support Agent | Operations Admin | Finance Admin | Compliance Officer | Super Admin | System Integration |
|-----------------|----------|------------------|------------------|---------------|------------------|---------------|--------------------|-------------|--------------------|
| Wallet balances / 지갑 잔고 | Read own / 본인 조회 | View merchant balances? ✕ | ✕ | Read for support (masked) / 마스킹 열람 | Full manage / 전체 관리 | View | Review locks / 잠금 검토 | Full | Scheduled sync |
| Wallet send/withdraw / 출금 | Initiate own / 본인 요청 | ✕ | ✕ | View status | Release holds / 보류 해제 | Approve withdrawals / 출금 승인 | Approve AML holds / AML 승인 | All | Execute batch payouts |
| NFT redeem / NFT 사용 | Redeem own / 본인 사용 | Validate / 검증 | Configure products / 상품 설정 | View | Override / 재처리 | Adjust settlement / 정산 조정 | Review fraud / 이상 감시 | All | Webhook dispatcher |
| P2P orders / P2P 주문 | Full own flow / 본인 플로 | ✕ | ✕ | Escalate disputes / 분쟁 이관 | Moderate listings / 게시 관리 | View | Adjudicate disputes / 분쟁 판결 | All | Price monitor |
| Mining withdraw / 마이닝 출금 | Request / 신청 | ✕ | ✕ | View | Monitor queue / 큐 모니터 | Approve / 승인 | Freeze suspicious / 이상 중단 | All | Cron sync |
| EARN products / 재테크 상품 | Subscribe own / 본인 가입 | ✕ | ✕ | View | CRUD products | View | Policy compliance check | All | Yield aggregation |
| Merchant catalog / 가맹점 상품 | View list | Redeem device view / 사용 화면 | CRUD | View | Assist | Reconcile | Compliance review | All | Inventory sync |
| Settlements / 정산 | View own | View current / 현황 조회 | Submit & download / 제출·다운로드 | View | Queue ops / 큐 운영 | Approve & export / 승인·내보내기 | Audit / 감사 | All | Generate drafts |
| Support tickets / 고객지원 | Create own / 본인 작성 | Submit | Submit & manage | Primary handler / 1차 처리 | Escalation owner / 상위 처리 | View | Oversight | All | Auto-responder |
| Settings (RBAC, policies) / 설정 | ✕ | ✕ | ✕ | ✕ | Limited (operational toggles) / 일부 (운영 토글) | ✕ | ✕ | Full | ✕ |

> Detailed API-level permission checks must be implemented via NestJS guards referencing `RolePermission` as outlined in `docs/ERD-NOTES.md`.  
> 상세 API 권한 검증은 `docs/ERD-NOTES.md`에 정리된 `RolePermission` 테이블을 활용해 NestJS 가드로 구현합니다.

## 4. Enforcement Mechanisms / 통제 구현

1. **Backend Guards / 백엔드 가드**  
   - NestJS `CanActivate` guards verify JWT scope and role membership before hitting services.  
     NestJS `CanActivate` 가드로 JWT 범위와 역할을 검증합니다.  
   - Feature flags (`src/shared/feature-flags`) gate beta modules per role (e.g., EARN loan beta).  
     역할별 베타 모듈 제어를 위해 `src/shared/feature-flags`를 사용합니다.  
   - Prisma middleware injects `tenantContext` (memberId, merchantId) to prevent cross-tenant reads.  
     Prisma 미들웨어가 `tenantContext`를 주입해 크로스 테넌트 조회를 방지합니다.

2. **Frontend Controls / 프런트엔드 제어**  
   - Route guards (Next.js middleware) enforce role segments: `/merchant/*`, `/admin/*`.  
     Next.js 미들웨어로 `/merchant/*`, `/admin/*` 경로에서 역할 체크를 수행합니다.  
   - Component-level permission hooks hide disabled actions; UI still checks backend responses.  
     컴포넌트 훅으로 비허용 액션을 숨기지만 백엔드 응답 검증도 병행합니다.

3. **Operational Workflow / 운영 절차**  
   - Role change requests logged via `/admin/settings/roles` with dual approval (requester + approver).  
     역할 변경 요청은 `/admin/settings/roles`에서 요청자·승인자 2단계 승인으로 기록합니다.  
   - Monthly RBAC review checklist added to `docs/BACKEND-NEXT-STEPS.md` follow-up tasks.  
     월간 RBAC 점검 체크리스트를 `docs/BACKEND-NEXT-STEPS.md` 후속 작업에 포함합니다.  
   - Emergency access uses break-glass accounts with one-time password rotation post-incident.  
     비상 접근은 일회성 비밀번호를 사용하는 break-glass 계정을 활용하고 사후 즉시 교체합니다.

## 5. Audit Logging Requirements / 감사 로그 요건

### 5.1 Event Coverage / 이벤트 범위
- **Authentication & Session**: login, logout, session revocation, failed login thresholds.  
  로그인, 로그아웃, 세션 종료, 로그인 실패 누적.
- **Security Changes**: password reset, 2FA enrollment/reset, whitelist changes, device trust toggles.  
  비밀번호 초기화, 2FA 등록/해제, 화이트리스트 변경, 기기 신뢰 변경.
- **Financial Operations**: wallet send/swap, withdrawals, settlement approvals, refund overrides.  
  송금/스왑, 출금, 정산 승인, 환불 재처리.
- **Compliance Actions**: KYC approval/rejection, account suspension, dispute adjudication.  
  KYC 승인/거절, 계정 정지, 분쟁 판결.
- **Configuration**: RBAC edits, API key rotations, network toggles, feature flag changes.  
  RBAC 변경, API 키 교체, 네트워크 토글, 기능 플래그 변경.
- **Data Exports**: CSV/Excel export actions from admin portals, including filters used.  
  관리자 화면에서 CSV/Excel 추출 시 필터 정보까지 기록.

### 5.2 Log Structure / 로그 구조
- Stored in `AuditLog` table with JSON payload capturing `before/after` snapshots where applicable.  
  `AuditLog` 테이블에 저장하고 필요 시 `before/after` 스냅샷을 JSON으로 포함합니다.
- Include `actor_type`, `actor_id`, `role`, `ip`, `user_agent`, `target_type`, `target_id`, `result`.  
  `actor_type`, `actor_id`, `role`, `ip`, `user_agent`, `target_type`, `target_id`, `result` 등을 기록합니다.
- Correlate with tracing IDs (`trace_id`, `span_id`) to align with observability stack.  
  관측성 스택과 연계하기 위해 `trace_id`, `span_id`를 저장합니다.

### 5.3 Retention & Access / 보관·접근
- Retain for **5 years** (aligns with financial regulations) with quarterly integrity checks (hash chain).  
  금융 규제를 고려해 **5년간** 보관하며 분기마다 무결성 검사(해시 체인)를 수행합니다.
- Access restricted to Compliance Officer + Super Admin; read-only replicas for security analytics.  
  열람 권한은 컴플라이언스 담당자와 최고 관리자에게만 부여하고, 보안 분석용 읽기 전용 복제본을 제공합니다.
- Export requests require ticket + dual approval; encrypted delivery via managed channel.  
  로그 내보내기는 티켓 + 이중 승인 후 암호화된 채널로 전달합니다.

### 5.4 Monitoring / 모니터링
- Alert on high-risk events (e.g., repeated failed withdrawals, RBAC changes outside maintenance window).  
  위험 이벤트(출금 실패 반복, 점검 외 RBAC 변경)를 감지하면 알림을 발송합니다.
- Integrate with SIEM (e.g., Loki → Grafana) for anomaly detection dashboards.  
  SIEM(Grafana/Loki)과 연동해 이상 징후 대시보드를 운영합니다.

## 6. Implementation Checklist / 구현 체크리스트

- [ ] Define `Role` and `Permission` seed data covering roles above.  
  상기 역할을 포함하는 `Role`, `Permission` 시드 데이터를 정의합니다.
- [ ] Implement NestJS guards + decorators (`@Roles`, `@Permissions`).  
  NestJS 가드와 데코레이터(`@Roles`, `@Permissions`)를 구현합니다.
- [ ] Build admin UI for role assignment with audit trail integration.  
  역할 할당을 위한 관리자 UI를 구축하고 감사 로그를 연동합니다.
- [ ] Wire audit logging middleware in backend services (wallet, P2P, mining, EARN, settlement).  
  백엔드 서비스(지갑, P2P, 마이닝, EARN, 정산)에 감사 로그 미들웨어를 연결합니다.
- [ ] Schedule quarterly RBAC review and share results in `docs/ROADMAP.md` updates.  
  분기별 RBAC 점검을 예약하고 결과를 `docs/ROADMAP.md` 업데이트에 반영합니다.

## 7. Open Questions / 미해결 사항

1. **Merchant hierarchy**: do large merchants require sub-organizational RBAC (e.g., branch-level managers)?  
   **가맹점 계층**: 대형 가맹점에 지점 단위 RBAC가 필요한가요?
2. **Cross-border compliance**: if service expands to EU/US, additional audit retention mandates may apply.  
   **국제 규제**: EU/US 진출 시 추가 감사 로그 보존 요건을 검토해야 합니다.
3. **System integration credentials**: should service accounts rotate keys automatically every 60 days?  
   **서비스 계정 자격 증명**: 60일마다 자동으로 키를 교체해야 할까요?

Document decisions in this file and reflect policy changes in `spec.md` and onboarding materials (`docs/SECRET-MGMT.md`, `docs/BACKEND-NEXT-STEPS.md`).  
추가 결정 사항은 본 문서에 기록하고 `spec.md`, 온보딩 자료(`docs/SECRET-MGMT.md`, `docs/BACKEND-NEXT-STEPS.md`)에도 반영하세요.
