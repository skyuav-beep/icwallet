import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mining Dashboard / 마이닝 대시보드",
  description:
    "Workspace for hashpower analytics, withdrawal approvals, and Hashdam data.",
};

export default function MiningPage() {
  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <h2 className="text-3xl font-semibold">
          Mining Insights Hub
          <span className="block text-lg text-neutral-500">
            마이닝 인사이트 허브
          </span>
        </h2>
        <p className="max-w-3xl text-neutral-600 dark:text-neutral-400">
          Visualize Hashdam metrics, hashpower purchase history, and withdrawal
          queues tied to CoinEx-only destinations.
          <span className="block">
            Hashdam 지표, 해시파워 구매 이력, CoinEx 전용 출금 대기열을 이곳에
            시각화하세요.
          </span>
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        <article className="rounded-2xl border border-dashed border-neutral-300 p-6 dark:border-neutral-700">
          <h3 className="text-lg font-semibold">
            Data Panels / 데이터 패널
          </h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-neutral-600 dark:text-neutral-400">
            <li>24h hashrate, reject rate, and coin balances.</li>
            <li>24시간 해시레이트·리젝트율·코인 잔고.</li>
            <li>Hashpower source breakdown (purchase vs reward).</li>
            <li>구매/보상 해시파워 분포.</li>
            <li>Pending withdrawal approvals with 2FA status.</li>
            <li>2FA 상태를 포함한 출금 승인 대기 목록.</li>
          </ul>
        </article>
        <article className="rounded-2xl border border-dashed border-neutral-300 p-6 dark:border-neutral-700">
          <h3 className="text-lg font-semibold">
            Automation Hooks / 자동화 훅
          </h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-neutral-600 dark:text-neutral-400">
            <li>Schedule cron fetches for Hashdam daily snapshots.</li>
            <li>Hashdam 일일 스냅샷 크론 연동.</li>
            <li>Whitelist enforcement prior to CoinEx transfers.</li>
            <li>CoinEx 출금 전 화이트리스트 검증.</li>
            <li>Alerting for mining anomalies or sync failures.</li>
            <li>마이닝 이상·동기화 실패 알림.</li>
          </ul>
        </article>
      </div>
    </section>
  );
}
