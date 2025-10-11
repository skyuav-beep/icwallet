import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Mining & EARN / 관리자 마이닝·EARN",
  description:
    "Prepare dashboards for hashpower sync, staking governance, and loan oversight.",
};

export default function AdminEarnPage() {
  return (
    <article className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold">
          Yield Program Administration
          <span className="block text-lg text-neutral-500">
            수익 프로그램 관리
          </span>
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400">
          Combine mining telemetry, staking pool inventory, lending positions,
          and loan risk analytics into one console.
          <span className="block">
            마이닝 텔레메트리, 스테이킹 풀 재고, 랜딩 포지션, 대출 위험 분석을
            하나의 콘솔로 통합하세요.
          </span>
        </p>
      </header>
      <section className="grid gap-4 md:grid-cols-2">
        {[
          {
            title: "Hashpower Sync / 해시파워 동기화",
            body: [
              "Display latest Hashdam pull timestamps and delta warnings.",
              "Hashdam 데이터 동기화 시각과 변화량 경고를 표시합니다.",
            ],
          },
          {
            title: "Loan Oversight / 대출 모니터링",
            body: [
              "View collateral ratios, liquidation thresholds, and alerts.",
              "담보 비율, 청산 임계치, 알림을 제공합니다.",
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
          Sync the UI with EARN product definitions once smart contracts and
          backend adapters are in place.
          <span className="block">
            스마트컨트랙트와 백엔드 어댑터가 준비되면 EARN 상품 정의를 UI와
            동기화하세요.
          </span>
        </p>
      </section>
    </article>
  );
}
