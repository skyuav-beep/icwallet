import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EARN Products / 재테크 상품",
  description:
    "Staging area for staking, lending, and loan product discovery and management.",
};

export default function EarnPage() {
  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <h2 className="text-3xl font-semibold">
          EARN Product Canvas
          <span className="block text-lg text-neutral-500">
            재테크 상품 캔버스
          </span>
        </h2>
        <p className="max-w-3xl text-neutral-600 dark:text-neutral-400">
          Outline staking, lending, and loan options with APR, collateral, and
          risk disclosures aligned with admin configurations.
          <span className="block">
            관리자 설정과 연동되는 APR·담보·위험 고지를 포함한 스테이킹·랜딩·론
            옵션을 정의하세요.
          </span>
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        <article className="rounded-2xl border border-dashed border-neutral-300 p-6 dark:border-neutral-700">
          <h3 className="text-lg font-semibold">
            Product Cards / 상품 카드
          </h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-neutral-600 dark:text-neutral-400">
            <li>Fixed-term staking summaries with remaining supply.</li>
            <li>잔여 수량이 포함된 고정형 스테이킹 요약.</li>
            <li>Lending offers with collateral requirements and LTV.</li>
            <li>담보 조건·LTV를 포함한 랜딩 상품.</li>
            <li>Loan products with tenor, rate, and repayment schedules.</li>
            <li>기간·금리·상환 일정을 제공하는 대출 상품.</li>
          </ul>
        </article>
        <article className="rounded-2xl border border-dashed border-neutral-300 p-6 dark:border-neutral-700">
          <h3 className="text-lg font-semibold">
            Compliance Notes / 컴플라이언스 메모
          </h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-neutral-600 dark:text-neutral-400">
            <li>Surface regulatory disclaimers per region.</li>
            <li>지역별 규제 고지 문구 표시.</li>
            <li>Audit log hooks for subscription or early exit actions.</li>
            <li>가입·중도 해지 감사 로그 연동.</li>
            <li>Track coverage metrics to maintain ≥90% testing.</li>
            <li>테스트 커버리지 90% 이상 유지 지표 연동.</li>
          </ul>
        </article>
      </div>
    </section>
  );
}
