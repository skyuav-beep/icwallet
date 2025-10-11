import { ReactNode } from "react";
import { PortalShell } from "../../../components/portal/PortalShell";
import {
  PortalProvider,
  PortalSection,
} from "../../../lib/portal/portal-store";

const ADMIN_SECTIONS: PortalSection[] = [
  {
    id: "admin-overview",
    href: "/admin",
    label: "Overview",
    labelKr: "개요",
    description: "Global health metrics, pending approvals, and risk alerts.",
    descriptionKr: "전역 지표, 승인 대기 항목, 위험 알림을 제공합니다.",
  },
  {
    id: "admin-members",
    href: "/admin/members",
    label: "Members & Access",
    labelKr: "회원·접근",
    description: "Manage accounts, roles, KYC status, and auth factors.",
    descriptionKr: "회원 계정·역할·KYC·인증 수단을 관리합니다.",
  },
  {
    id: "admin-wallets",
    href: "/admin/wallets",
    label: "Wallet & Settlement",
    labelKr: "지갑·정산",
    description: "Monitor wallets, withdrawals, and settlement workflows.",
    descriptionKr: "지갑, 출금, 정산 워크플로를 모니터링합니다.",
  },
  {
    id: "admin-p2p",
    href: "/admin/p2p",
    label: "P2P & Escrow",
    labelKr: "P2P·에스크로",
    description: "Resolve disputes, configure escrow ladders, audit events.",
    descriptionKr: "분쟁 해결, 에스크로 조건 설정, 감사 이벤트를 다룹니다.",
  },
  {
    id: "admin-earn",
    href: "/admin/earn",
    label: "Mining & EARN",
    labelKr: "마이닝·EARN",
    description: "Oversee hashpower sync, staking policies, and loan terms.",
    descriptionKr: "해시파워 동기화, 스테이킹 정책, 대출 조건을 관리합니다.",
  },
  {
    id: "admin-operations",
    href: "/admin/operations",
    label: "Operations & Compliance",
    labelKr: "운영·컴플라이언스",
    description: "Track audit logs, SLA adherence, and incident playbooks.",
    descriptionKr: "감사 로그, SLA 준수, 사고 대응 절차를 추적합니다.",
  },
];

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <PortalProvider role="admin" initialSections={ADMIN_SECTIONS}>
      <PortalShell
        title="Admin Control Center"
        titleKr="관리자 컨트롤 센터"
        description="Coordinate risk controls, approvals, and operational dashboards across IC Wallet."
        descriptionKr="IC 월렛 전반의 위험 통제, 승인, 운영 대시보드를 조율하세요."
      >
        {children}
      </PortalShell>
    </PortalProvider>
  );
}
