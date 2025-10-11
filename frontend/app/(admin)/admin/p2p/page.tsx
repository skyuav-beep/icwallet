import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin P2P & Escrow / 관리자 P2P·에스크로",
  description:
    "Sketch controls for dispute resolution, escrow releases, and policy configuration.",
};

export default function AdminP2PPage() {
  return (
    <article className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold">
          Escrow Governance Center
          <span className="block text-lg text-neutral-500">
            에스크로 거버넌스 센터
          </span>
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400">
          Plan dispute triage, escalation paths, and WebSocket-driven updates
          for P2P orders. Coordinate with audit logging to capture every action.
          <span className="block">
            P2P 주문의 분쟁 분류, 에스컬레이션 경로, WebSocket 기반 실시간
            업데이트를 설계하고 모든 조치를 감사 로그로 남기세요.
          </span>
        </p>
      </header>
      <section className="grid gap-4 md:grid-cols-2">
        {[
          {
            title: "Dispute Queue / 분쟁 큐",
            body: [
              "Timeline of buyer and seller evidence with admin decisions.",
              "구매자·판매자 증거와 관리자 결정을 타임라인으로 표시합니다.",
            ],
          },
          {
            title: "Policy Config / 정책 설정",
            body: [
              "Escrow release rules, collateral requirements, and cooldowns.",
              "에스크로 해제 규칙, 담보 조건, 쿨다운을 구성합니다.",
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
          When building the WebSocket adapter, emit structured events so this
          console can stream real-time updates to admins.
          <span className="block">
            WebSocket 어댑터 구현 시 구조화된 이벤트를 발행해 관리자가 실시간
            업데이트를 받을 수 있도록 하세요.
          </span>
        </p>
      </section>
    </article>
  );
}
