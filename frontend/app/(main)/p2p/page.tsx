import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "P2P Trading / P2P 거래",
  description:
    "Scaffold buy and sell listings, escrow states, and dispute handling.",
};

export default function P2PPage() {
  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <h2 className="text-3xl font-semibold">
          P2P Order Workspace
          <span className="block text-lg text-neutral-500">
            P2P 주문 작업 공간
          </span>
        </h2>
        <p className="max-w-3xl text-neutral-600 dark:text-neutral-400">
          Build the lifecycle for buy/sell postings, escrow deposits, and
          release or refund actions with audit-ready logging.
          <span className="block">
            매수·매도 게시, 에스크로 입금, 해제/환불 절차를 감사 로그와 함께
            구현할 공간입니다.
          </span>
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        <article className="rounded-2xl border border-dashed border-neutral-300 p-6 dark:border-neutral-700">
          <h3 className="text-lg font-semibold">
            Order Lifecycle / 주문 라이프사이클
          </h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-neutral-600 dark:text-neutral-400">
            <li>Post creation, matching, and completion tracking.</li>
            <li>게시 생성·매칭·완료 추적 UI.</li>
            <li>Whitelist and 2FA requirements for high-value trades.</li>
            <li>고액 거래용 화이트리스트·2FA 요구사항.</li>
            <li>Status badges for escrow states and dispute escalation.</li>
            <li>에스크로 상태·분쟁 단계 배지 표시.</li>
          </ul>
        </article>
        <article className="rounded-2xl border border-dashed border-neutral-300 p-6 dark:border-neutral-700">
          <h3 className="text-lg font-semibold">
            Realtime UX / 실시간 UX
          </h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-neutral-600 dark:text-neutral-400">
            <li>Socket integrations for live status updates.</li>
            <li>실시간 상태 갱신을 위한 소켓 연동.</li>
            <li>Notifications for counterparty actions and admin reviews.</li>
            <li>거래 상대·관리자 조치에 대한 알림.</li>
            <li>Fallback messaging when backend services degrade.</li>
            <li>백엔드 성능 저하 시 대체 메시지 전략.</li>
          </ul>
        </article>
      </div>
    </section>
  );
}
