import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Merchant Portal / 가맹점 포털",
  description:
    "Starting point for merchant product management and settlement tracking.",
};

export default function MerchantsPage() {
  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <h2 className="text-3xl font-semibold">
          Merchant Workspace
          <span className="block text-lg text-neutral-500">
            가맹점 작업 공간
          </span>
        </h2>
        <p className="max-w-3xl text-neutral-600 dark:text-neutral-400">
          Outline flows for merchant onboarding, product uploads, and settlement
          reconciliation tied to NFT redemptions.
          <span className="block">
            가맹점 온보딩, 상품 등록, NFT 사용 정산 흐름을 이 레이아웃에
            정의하세요.
          </span>
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        <article className="rounded-2xl border border-dashed border-neutral-300 p-6 dark:border-neutral-700">
          <h3 className="text-lg font-semibold">
            Portal Sections / 포털 섹션
          </h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-neutral-600 dark:text-neutral-400">
            <li>Merchant profile and KYC verification status.</li>
            <li>가맹점 프로필 및 KYC 검증 상태.</li>
            <li>Product catalog management with redemption counts.</li>
            <li>사용 횟수가 포함된 상품 카탈로그 관리.</li>
            <li>Settlement schedule and payout references.</li>
            <li>정산 일정 및 지급 레퍼런스.</li>
          </ul>
        </article>
        <article className="rounded-2xl border border-dashed border-neutral-300 p-6 dark:border-neutral-700">
          <h3 className="text-lg font-semibold">
            Collaboration / 협업 포인트
          </h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-neutral-600 dark:text-neutral-400">
            <li>Shared audit logs accessible by admin reviewers.</li>
            <li>관리자 검토자가 접근 가능한 감사 로그 공유.</li>
            <li>Notification preferences for settlement or dispute updates.</li>
            <li>정산·분쟁 알림 환경설정.</li>
            <li>Integration hooks for support ticketing workflows.</li>
            <li>고객지원 티켓 흐름 연동 포인트.</li>
          </ul>
        </article>
      </div>
    </section>
  );
}
