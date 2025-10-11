# Secret Management Policy / 비밀 관리 정책

This policy outlines how IC Wallet handles sensitive credentials across environments. Review it before onboarding new services or contributors.  
본 정책은 IC 월렛이 환경 전반에서 민감한 자격 증명을 다루는 방법을 정의합니다. 신규 서비스나 구성원을 온보딩하기 전에 반드시 검토하세요.

## Storage & Distribution / 보관 및 배포
- **Local Development**: Use `.env.local` (gitignored) derived from `.env.example`. Never commit real secrets.  
  **로컬 개발**: `.env.example`에서 파생된 `.env.local`(gitignore 처리)을 사용하고 실제 비밀 값은 절대 커밋하지 마세요.
- **Secrets Manager**: AWS Secrets Manager (or HashiCorp Vault as fallback) stores production credentials.  
  **시크릿 매니저**: 프로덕션 자격 증명은 AWS Secrets Manager(대안: HashiCorp Vault)에 보관합니다.
- **Access Control**: Grant least privilege via IAM roles; rotate credentials quarterly or when staff changes.  
  **접근 제어**: IAM 역할을 통해 최소 권한만 부여하고 분기별 또는 인력 변동 시 자격 증명을 교체합니다.

## Handling Practices / 취급 방식
- **Transport**: Share secrets only through encrypted channels (1Password, AWS KMS-encrypted files).  
  **전송**: 비밀 정보는 암호화된 채널(1Password, AWS KMS 암호화 파일)로만 전달합니다.
- **Logging**: Mask secrets in application logs; enable structured logging (Pino/Loki) with redaction.  
  **로그**: 애플리케이션 로그에서 비밀 값을 마스킹하고 구조화 로그(Pino/Loki) 리댁션을 활성화합니다.
- **Backups**: Exclude plaintext secrets from backups; rely on secrets manager snapshots.  
  **백업**: 일반 백업에 평문 비밀이 포함되지 않도록 하고 시크릿 매니저 스냅샷을 활용합니다.
- **Admin Tokens**: Store `ADMIN_JWT_SECRET`/`ADMIN_JWT_TTL` alongside other infrastructure secrets; rotate when admin personnel changes.  
  **관리자 토큰**: `ADMIN_JWT_SECRET`·`ADMIN_JWT_TTL` 값을 다른 인프라 비밀과 함께 보관하고 관리자 교체 시 교체합니다.
- **Notification Integrations**: Keep `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` in the same secret store; rotate bot tokens when automation scope changes.  
  **알림 연동**: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`를 동일한 시크릿 저장소에 보관하고 자동화 범위가 바뀔 때 봇 토큰을 교체합니다.

## Operational Controls / 운영 통제
- **Audit Trails**: Record secret access and rotation events in audit logs (spec.md §5.1/5.10 alignment).  
  **감사 추적**: 비밀 접근 및 교체 이벤트를 감사 로그에 기록해 `spec.md` §5.1/5.10 요구와 일치시킵니다.
- **Incident Response**: On suspected leak, revoke keys immediately, redeploy with rotated secrets, and document the incident.  
  **사고 대응**: 유출이 의심되면 즉시 키를 폐기하고 교체된 비밀로 재배포하며 사고를 문서화합니다.
- **Compliance Check**: Review this policy during each milestone retrospective to ensure conformance.  
  **컴플라이언스 점검**: 각 마일스톤 회고 시 정책 준수 여부를 확인합니다.

## Automation / 자동화
- **CI/CD**: Use encrypted secret stores (GitHub Actions secrets) and avoid inline secrets in workflow files.  
  **CI/CD**: GitHub Actions 시크릿 등 암호화 저장소를 사용하고 워크플로 파일에 비밀을 직접 작성하지 않습니다.
- **Scripts**: When scripts need secrets, read from environment variables and document required keys in bilingual headers.  
  **스크립트**: 스크립트가 비밀을 필요로 하면 환경 변수에서 읽도록 하고, 필요한 키를 영문/국문 헤더에 명시합니다.

Keep this document synchronized with infrastructure changes and notify the team in release notes when updates occur.  
인프라 변경 시 본 문서를 즉시 갱신하고 업데이트 내용을 릴리스 노트로 팀에 공지하세요.
