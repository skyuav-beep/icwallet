import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Merchant Products / 가맹점 상품",
  description: "Blueprint for NFT voucher and coupon catalogue management.",
};

export default function MerchantProductsPage() {
  return (
    <article className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold">
          Product Catalogue Planner
          <span className="block text-lg text-neutral-500">
            상품 카탈로그 설계
          </span>
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400">
          Define form states for creating and maintaining NFT vouchers, coupons,
          and availability windows. Plan validation hooks that mirror admin
          policy rules.
          <span className="block">
            NFT 상품권·쿠폰·판매 가능 기간을 생성/관리하는 폼 상태와 관리자
            정책을 반영한 검증 훅을 설계하세요.
          </span>
        </p>
      </header>
      <section className="grid gap-4 md:grid-cols-2">
        {[
          {
            title: "Creation Flow / 생성 플로우",
            body: [
              "SKU builder with bilingual labels, price, supply, expiry inputs.",
              "가격·수량·만료 입력과 양언어 레이블이 포함된 SKU 구성 UI.",
            ],
          },
          {
            title: "Inventory Rules / 재고 규칙",
            body: [
              "Sync sold, reserved, and remaining counts against blockchain events.",
              "블록체인 이벤트에 따라 판매·예약·잔여 수량을 동기화합니다.",
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
          Capture draft versus published states in the shared portal store so
          navigation badges can reflect pending updates.
          <span className="block">
            공유 포털 스토어에 임시 저장/게시 상태를 담아 네비게이션 배지에서
            변경 대기 항목을 표시하세요.
          </span>
        </p>
      </section>
    </article>
  );
}
