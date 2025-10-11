import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Overview / 관리자 개요",
  description:
    "Centralize risk indicators, approval queues, and cross-portal health metrics.",
};

export default function AdminOverviewPage() {
  return (
    <article className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold">
          Platform Health Summary
          <span className="block text-lg text-neutral-500">
            플랫폼 상태 요약
          </span>
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400">
          Lay out cards for total TVL, active users, pending approvals, and SLA
          breaches. Use this workspace to map data sources before wiring live
          charts.
          <span className="block">
            총 예치 자산, 활성 사용자, 승인 대기 건, SLA 위반을 보여줄 카드
            구성을 설계하고 실시간 차트 연동 전 데이터 소스를 정의하세요.
          </span>
        </p>
      </header>
      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            title: "Risk Alerts / 위험 알림",
            body: [
              "Surface suspicious withdrawals, failed logins, and API errors.",
              "의심스러운 출금·로그인 실패·API 오류를 표기합니다.",
            ],
          },
          {
            title: "Approval Queue / 승인 대기열",
            body: [
              "Summarize pending withdrawals, settlements, and contract upgrades.",
              "출금·정산·컨트랙트 업그레이드 승인 대기를 요약합니다.",
            ],
          },
          {
            title: "SLA Tracker / SLA 추적",
            body: [
              "Show SLA breaches per provider with timestamps and owners.",
              "제공사별 SLA 위반 시간과 담당자를 표시합니다.",
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
          Document data refresh cadence and latency expectations in{" "}
          <code>docs/CI-TEST-STRATEGY.md</code> or a new monitoring note.
          <span className="block">
            데이터 갱신 주기와 지연 허용치를{" "}
            <code>docs/CI-TEST-STRATEGY.md</code> 또는 신규 모니터링 문서에
            기록하세요.
          </span>
        </p>
      </section>
    </article>
  );
}
