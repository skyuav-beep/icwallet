import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NFT Marketplace / NFT 마켓",
  description:
    "Placeholder for catalog, purchase, and redemption experiences.",
};

export default function NftMarketPage() {
  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <h2 className="text-3xl font-semibold">
          NFT Marketplace Blueprint
          <span className="block text-lg text-neutral-500">
            NFT 마켓 설계 골격
          </span>
        </h2>
        <p className="max-w-3xl text-neutral-600 dark:text-neutral-400">
          Use this space to map product tiles, purchase flows, and redemption
          tracking across time-locked vouchers and coupons.
          <span className="block">
            타임락 상품권과 쿠폰에 대한 상품 카드·구매 흐름·사용 추적 UI를 이
            영역에 배치하세요.
          </span>
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        <article className="rounded-2xl border border-dashed border-neutral-300 p-6 dark:border-neutral-700">
          <h3 className="text-lg font-semibold">
            Catalog Focus / 카탈로그 포커스
          </h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-neutral-600 dark:text-neutral-400">
            <li>NFT filters by type, price, expiry, and merchant.</li>
            <li>유형·가격·만료·가맹점 기준 NFT 필터링.</li>
            <li>Edition badges for limited-time campaigns.</li>
            <li>한정판 캠페인 배지를 표시하세요.</li>
            <li>Localized pricing and balance checks before purchase.</li>
            <li>구매 전 지역화된 가격·잔액 확인을 제공합니다.</li>
          </ul>
        </article>
        <article className="rounded-2xl border border-dashed border-neutral-300 p-6 dark:border-neutral-700">
          <h3 className="text-lg font-semibold">
            Redemption Flow / 사용 흐름
          </h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-neutral-600 dark:text-neutral-400">
            <li>QR or code presentation, status updates, and receipts.</li>
            <li>QR/코드 제시, 상태 업데이트, 영수증 제공.</li>
            <li>Expired and canceled voucher handling alerts.</li>
            <li>만료·취소된 상품권 알림 처리.</li>
            <li>Integration hooks for merchant settlement triggers.</li>
            <li>가맹점 정산 트리거 연동 포인트를 마련하세요.</li>
          </ul>
        </article>
      </div>
    </section>
  );
}
