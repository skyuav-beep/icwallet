import { ReactNode } from "react";
import { PortalShell } from "../../../components/portal/PortalShell";
import {
  PortalProvider,
  PortalSection,
} from "../../../lib/portal/portal-store";

const MERCHANT_SECTIONS: PortalSection[] = [
  {
    id: "merchant-dashboard",
    href: "/merchant",
    label: "Dashboard",
    labelKr: "대시보드",
    description: "High-level KPIs, settlement alerts, and redemption feed.",
    descriptionKr: "핵심 지표, 정산 알림, 사용 내역 피드를 제공합니다.",
  },
  {
    id: "merchant-products",
    href: "/merchant/products",
    label: "Products",
    labelKr: "상품",
    description: "Manage NFT vouchers, coupons, and availability windows.",
    descriptionKr: "NFT 상품권·쿠폰과 판매 가능 기간을 관리합니다.",
  },
  {
    id: "merchant-settlements",
    href: "/merchant/settlements",
    label: "Settlements",
    labelKr: "정산",
    description: "Track settlement runs, payouts, and reconciliation status.",
    descriptionKr: "정산 실행, 지급, 정합성 상태를 추적합니다.",
  },
  {
    id: "merchant-support",
    href: "/merchant/support",
    label: "Support",
    labelKr: "지원",
    description: "Handle disputes, requests, and shared knowledge base.",
    descriptionKr: "분쟁·요청 처리와 지식 베이스를 확인합니다.",
  },
];

export default function MerchantLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <PortalProvider role="merchant" initialSections={MERCHANT_SECTIONS}>
      <PortalShell
        title="Merchant Operations Workspace"
        titleKr="가맹점 운영 워크스페이스"
        description="Centralize voucher lifecycle, settlement readiness, and partner communications."
        descriptionKr="상품권 수명주기, 정산 준비, 파트너 커뮤니케이션을 한곳에서 관리하세요."
      >
        {children}
      </PortalShell>
    </PortalProvider>
  );
}
