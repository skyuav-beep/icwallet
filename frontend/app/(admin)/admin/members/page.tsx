import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Members & Access / 관리자 회원·접근",
  description:
    "Design admin tooling for account search, role assignment, and KYC reviews.",
};

export default function AdminMembersPage() {
  return (
    <article className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold">
          Member Management Console
          <span className="block text-lg text-neutral-500">
            회원 관리 콘솔
          </span>
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400">
          Plan searchable tables, bulk status changes, and 2FA enforcement for
          both users and merchants. Incorporate audit trails for each action.
          <span className="block">
            사용자·가맹점 대상 검색 테이블, 상태 일괄 변경, 2FA 강제 적용 UI를
            설계하고 모든 조치에 대한 감사 추적을 반영하세요.
          </span>
        </p>
      </header>
      <section className="grid gap-4 md:grid-cols-2">
        {[
          {
            title: "KYC Review / KYC 검토",
            body: [
              "Queue pending KYC with document previews and decision controls.",
              "문서 미리보기·승인/반려 제어가 포함된 KYC 대기열.",
            ],
          },
          {
            title: "Role Policies / 역할 정책",
            body: [
              "Configure RBAC templates and apply them to selected members.",
              "RBAC 템플릿을 구성하고 선택한 회원에 적용합니다.",
            ],
          },
        ].map((card) => (
          <article
            key={card.title}
            className="rounded-2xl border border-dashed border-neutral-300 p-4 dark:border-neutral-700"
          >
            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
              {card.title}
            </h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-neutral-600 dark:text-neutral-400">
              {card.body.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>
      <section className="rounded-2xl border border-dashed border-neutral-300 p-4 text-sm text-neutral-600 dark:border-neutral-700 dark:text-neutral-400">
        <p>
          Connect with the backend admin APIs when the member management module
          is ready; seed mock data meanwhile for UI development.
          <span className="block">
            백엔드 회원 관리 API가 준비되면 연동하고, UI 개발 단계에서는 Mock
            데이터를 활용하세요.
          </span>
        </p>
      </section>
    </article>
  );
}
