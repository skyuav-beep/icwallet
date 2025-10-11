import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Merchant Settlements / 가맹점 정산",
  description: "Outline settlement batches, payout statuses, and reconciliation tasks.",
};

export default function MerchantSettlementsPage() {
  return (
    <article className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold">
          Settlement Control Tower
          <span className="block text-lg text-neutral-500">
            정산 컨트롤 타워
          </span>
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400">
          Plan tables and timeline views to track payout batches, settlement
          statuses, and reconciliation outcomes with admin approvals.
          <span className="block">
            지급 배치, 정산 상태, 관리자 승인과 정합성 결과를 추적하는 테이블과
            타임라인 뷰를 설계하세요.
          </span>
        </p>
      </header>
      <section className="grid gap-4 md:grid-cols-2">
        {[
          {
            title: "Payout Runs / 지급 실행",
            body: [
              "Show amount, bank reference, approval chain, and export actions.",
              "금액·지급 레퍼런스·승인 체인·내보내기 조치를 표기합니다.",
            ],
          },
          {
            title: "Reconciliation / 정합성",
            body: [
              "Highlight mismatches between on-chain events and provider reports.",
              "온체인 이벤트와 공급사 리포트 차이를 강조합니다.",
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
          Embed download/export actions that call backend settlement APIs once
          they are ready.
          <span className="block">
            백엔드 정산 API가 준비되면 다운로드·내보내기 액션을 연동하세요.
          </span>
        </p>
      </section>
    </article>
  );
}
