import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Merchant Dashboard / 가맹점 대시보드",
  description:
    "Plan KPI widgets, redemption feeds, and quick settlement actions for merchants.",
};

export default function MerchantDashboardPage() {
  return (
    <article className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold">
          Merchant KPI Overview
          <span className="block text-lg text-neutral-500">
            가맹점 KPI 개요
          </span>
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400">
          Wire daily sales, voucher redemptions, and pending settlement alerts
          here. Surface actionable insights with bilingual labels before
          integrating live data.
          <span className="block">
            일일 매출, 상품권 사용, 정산 대기 알림을 연결하고 실데이터 연동 전
            행동 가능한 인사이트를 양언어로 제공합니다.
          </span>
        </p>
      </header>
      <section className="grid gap-4 md:grid-cols-2">
        {[
          {
            title: "Redemption Feed / 사용 내역 피드",
            body: [
              "Display latest voucher scans with status and settlement tags.",
              "최신 상품권 스캔 상태와 정산 태그를 표시합니다.",
            ],
          },
          {
            title: "Settlement Snapshot / 정산 스냅샷",
            body: [
              "Summaries for payouts awaiting approval versus completed runs.",
              "승인 대기와 완료된 정산을 요약합니다.",
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
          Outline API contracts for dashboard widgets in <code>spec.md</code>{" "}
          and bind them once backend endpoints are available.
          <span className="block">
            <code>spec.md</code>에 대시보드 위젯 API 계약을 정의하고, 백엔드
            엔드포인트가 준비되면 연동하세요.
          </span>
        </p>
      </section>
    </article>
  );
}
