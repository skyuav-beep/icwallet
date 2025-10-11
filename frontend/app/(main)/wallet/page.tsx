import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wallet Overview / 지갑 개요",
  description:
    "Skeleton page for wallet dashboard flows including balances and transfers.",
};

export default function WalletPage() {
  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <h2 className="text-3xl font-semibold">
          Wallet Dashboard Placeholder
          <span className="block text-lg text-neutral-500">
            지갑 대시보드 플레이스홀더
          </span>
        </h2>
        <p className="max-w-3xl text-neutral-600 dark:text-neutral-400">
          Wire up network switching, asset balances, and transaction shortcuts
          in this area. Integrate user onboarding, wallet creation, and
          real-time balance checks via mblockapi.
          <span className="block">
            이 영역에서 네트워크 전환, 자산 잔액, 트랜잭션 바로가기를 연결하고
            온보딩·지갑 생성·mblockapi 기반 실시간 잔액 조회를 연동하세요.
          </span>
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        <article className="rounded-2xl border border-dashed border-neutral-300 p-6 dark:border-neutral-700">
          <h3 className="text-lg font-semibold">Core Modules / 핵심 모듈</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-neutral-600 dark:text-neutral-400">
            <li>Account creation, recovery, and 2FA onboarding.</li>
            <li>계정 생성·복구 및 2FA 온보딩.</li>
            <li>Network toggle (ISC ↔ BNB) with persisted preference.</li>
            <li>사용자 선호를 저장하는 ISC↔BNB 네트워크 전환.</li>
            <li>Balances, recent transactions, and quick actions layout.</li>
            <li>잔액·최근 거래·퀵 액션 레이아웃 구성.</li>
          </ul>
        </article>
        <article className="rounded-2xl border border-dashed border-neutral-300 p-6 dark:border-neutral-700">
          <h3 className="text-lg font-semibold">
            Integration Notes / 연동 메모
          </h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-neutral-600 dark:text-neutral-400">
            <li>Hook into backend wallet APIs once REST endpoints land.</li>
            <li>백엔드 지갑 API 구현 후 연동합니다.</li>
            <li>Surface alerts for whitelist, pending approvals, or holds.</li>
            <li>화이트리스트·승인 대기·보류 상태 알림을 표시합니다.</li>
            <li>Plan responsive states for empty balances or degraded APIs.</li>
            <li>잔액 없음·API 저하 상태에 대응하는 반응형 UI를 설계하세요.</li>
          </ul>
        </article>
      </div>
    </section>
  );
}
