import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coupon Store / 쿠폰 스토어",
  description:
    "Foundation for external coupon integrations and settlement updates.",
};

export default function StorePage() {
  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <h2 className="text-3xl font-semibold">
          Coupon Store Framework
          <span className="block text-lg text-neutral-500">
            쿠폰 스토어 프레임워크
          </span>
        </h2>
        <p className="max-w-3xl text-neutral-600 dark:text-neutral-400">
          Prepare catalog browsing, purchase confirmations, and webhook-driven
          status sync with external providers.
          <span className="block">
            외부 공급사와 연동되는 카탈로그 탐색, 구매 확인, 웹훅 기반 상태
            동기화를 이곳에서 설계하세요.
          </span>
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        <article className="rounded-2xl border border-dashed border-neutral-300 p-6 dark:border-neutral-700">
          <h3 className="text-lg font-semibold">
            Purchase Flow / 구매 흐름
          </h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-neutral-600 dark:text-neutral-400">
            <li>Product detail modal with token selection.</li>
            <li>토큰 선택을 지원하는 상품 상세 모달.</li>
            <li>Balance checks and approval prompts before checkout.</li>
            <li>결제 전 잔액 확인·승인 안내.</li>
            <li>Success and failure states with retry guidance.</li>
            <li>재시도 안내가 포함된 성공·실패 상태.</li>
          </ul>
        </article>
        <article className="rounded-2xl border border-dashed border-neutral-300 p-6 dark:border-neutral-700">
          <h3 className="text-lg font-semibold">
            Provider Sync / 공급사 동기화
          </h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-neutral-600 dark:text-neutral-400">
            <li>Display reconciliation status and resend options.</li>
            <li>정산 상태와 재전송 옵션 표시.</li>
            <li>Integrate webhook acknowledgements from providers.</li>
            <li>공급사 웹훅 응답 연동.</li>
            <li>Surface settlement history for admin review.</li>
            <li>관리자 검토용 정산 이력 노출.</li>
          </ul>
        </article>
      </div>
    </section>
  );
}
