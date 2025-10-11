import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Operations & Compliance / 관리자 운영·컴플라이언스",
  description:
    "Structure audit logs, SLA compliance metrics, and incident response playbooks.",
};

export default function AdminOperationsPage() {
  return (
    <article className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold">
          Operations Command Center
          <span className="block text-lg text-neutral-500">
            운영 지휘 센터
          </span>
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400">
          Plan searchable audit logs, SLA scorecards, and incident response
          checklists. Integrate runbook links for fast remediation.
          <span className="block">
            검색 가능한 감사 로그, SLA 점수표, 사고 대응 체크리스트를 설계하고
            신속한 복구를 위한 런북 링크를 연동하세요.
          </span>
        </p>
      </header>
      <section className="grid gap-4 md:grid-cols-2">
        {[
          {
            title: "Audit Timeline / 감사 타임라인",
            body: [
              "Filter actions by domain, actor, and severity with exports.",
              "도메인·행위자·심각도 기준으로 필터링하고 내보내기를 지원합니다.",
            ],
          },
          {
            title: "Incident Playbooks / 사고 대응",
            body: [
              "Map triggers to runbook steps and acknowledgement workflows.",
              "트리거를 런북 단계와 승인 흐름에 연결합니다.",
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
          Mirror changes back into <code>docs/RBAC-AUDIT-POLICY.md</code> and{" "}
          <code>docs/ROADMAP.md</code> whenever workflows evolve.
          <span className="block">
            워크플로가 변경될 때마다{" "}
            <code>docs/RBAC-AUDIT-POLICY.md</code>와{" "}
            <code>docs/ROADMAP.md</code>에 내용을 반영하세요.
          </span>
        </p>
      </section>
    </article>
  );
}
