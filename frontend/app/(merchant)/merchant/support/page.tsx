import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Merchant Support / 가맹점 지원",
  description:
    "Draft dispute workflows, ticket escalation paths, and knowledge base access.",
};

export default function MerchantSupportPage() {
  return (
    <article className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold">
          Support Operations Hub
          <span className="block text-lg text-neutral-500">
            지원 운영 허브
          </span>
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400">
          Lay out ticket queues, dispute summaries, and notification
          preferences. Connect to shared notification modules once implemented.
          <span className="block">
            티켓 큐, 분쟁 요약, 알림 환경설정을 배치하고 공통 알림 모듈이
            구현되면 연동하세요.
          </span>
        </p>
      </header>
      <section className="grid gap-4 md:grid-cols-2">
        {[
          {
            title: "Ticket Board / 티켓 보드",
            body: [
              "Segment by status (new, pending admin, awaiting merchant).",
              "상태(신규·관리자 대기·가맹점 대기) 기준으로 분류합니다.",
            ],
          },
          {
            title: "Knowledge Base / 지식 베이스",
            body: [
              "Provide quick links to FAQs, policy updates, and SLA documents.",
              "FAQ·정책 업데이트·SLA 문서로 이어지는 빠른 링크를 제공합니다.",
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
          Integrate escalation triggers with the shared audit log module so
          admins can trace high-risk events.
          <span className="block">
            고위험 이벤트 추적을 위해 공통 감사 로그 모듈과 연동된 에스컬레이션
            트리거를 구현하세요.
          </span>
        </p>
      </section>
    </article>
  );
}
