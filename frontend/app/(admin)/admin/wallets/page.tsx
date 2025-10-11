import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Wallet & Settlement / 관리자 지갑·정산",
  description:
    "Map wallet oversight tools, withdrawal approvals, and settlement monitoring.",
};

export default function AdminWalletsPage() {
  return (
    <article className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold">
          Wallet Oversight Workspace
          <span className="block text-lg text-neutral-500">
            지갑 관리 작업 공간
          </span>
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400">
          Provide administrators with balance views, freeze actions, withdrawal
          approvals, and reconciliation timelines across wallets and settlement
          batches.
          <span className="block">
            관리자가 지갑 잔액, 동결 조치, 출금 승인, 정산 배치 타임라인을
            관리할 수 있도록 UI를 구성하세요.
          </span>
        </p>
      </header>
      <section className="grid gap-4 md:grid-cols-2">
        {[
          {
            title: "Withdrawal Queue / 출금 대기열",
            body: [
              "Integrate whitelist status, 2FA confirmation, and audit notes.",
              "화이트리스트 상태, 2FA 확인, 감사 메모를 통합합니다.",
            ],
          },
          {
            title: "Settlement Ledger / 정산 원장",
            body: [
              "Link to CoinEx executions and ledger adjustments with exports.",
              "CoinEx 실행·원장 조정과 내보내기 기능을 연동합니다.",
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
          Reference backend cron jobs and approval workflows to keep UI status
          updates aligned with true processing states.
          <span className="block">
            백엔드 크론 작업과 승인 워크플로를 참조해 UI 상태가 실제 처리 단계와
            일치하도록 유지하세요.
          </span>
        </p>
      </section>
    </article>
  );
}
