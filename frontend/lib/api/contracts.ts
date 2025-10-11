/**
 * Frontend data contracts shared across user, merchant, and admin portals.
 * 사용자·가맹점·관리자 포털 간 공통으로 사용하는 프런트엔드 데이터 계약 정의입니다.
 */

export type SupportedNetwork = "ISC" | "BNB";

export interface WalletBalanceSnapshot {
  network: SupportedNetwork;
  assetSymbol: string;
  assetType: "TOKEN" | "NFT";
  contractAddress?: string;
  balance: string;
  displayName: string;
  displayNameKr: string;
  fiatValue?: number;
  fiatCurrency?: string;
  updatedAt: string;
}

export interface WalletAlert {
  kind: "WHITELIST_REQUIRED" | "PENDING_APPROVAL" | "API_DEGRADED";
  message: string;
  messageKr: string;
  severity: "info" | "warning" | "critical";
}

export interface WalletOverviewPayload {
  memberId: string;
  preferredNetwork: SupportedNetwork;
  balances: WalletBalanceSnapshot[];
  alerts: WalletAlert[];
}

export interface NftCatalogItem {
  id: string;
  title: string;
  titleKr: string;
  description: string;
  descriptionKr: string;
  kind: "AMOUNT" | "VOUCHER" | "DISCOUNT";
  priceToken: string;
  priceAmount: string;
  limitedEdition?: boolean;
  saleWindow?: {
    startAt: string;
    endAt: string;
  };
  remainingSupply: number;
  thumbnailUrl?: string;
  merchantName: string;
  merchantNameKr: string;
}

export interface NftPurchaseReceipt {
  orderId: string;
  nftId: string;
  status: "PENDING" | "CONFIRMED" | "FAILED";
  statusKr: "대기" | "확정" | "실패";
  network: SupportedNetwork;
  txHash?: string;
  purchasedAt: string;
  redeemedAt?: string;
}

export interface P2POrderSummary {
  id: string;
  type: "BUY" | "SELL";
  assetType: "TOKEN" | "NFT";
  assetSymbol: string;
  price: string;
  quoteCurrency: string;
  status: "OPEN" | "MATCHED" | "CLOSED" | "DISPUTED";
  statusKr: "오픈" | "매칭" | "종료" | "분쟁";
  escrowState: "LOCKED" | "RELEASED" | "REFUNDED" | "DISPUTED";
  createdAt: string;
  updatedAt: string;
}

export interface MiningSnapshot {
  assetSymbol: string;
  balance: string;
  last24hHashrate: number;
  last24hRejectRate: number;
  lastSyncedAt: string;
}

export interface HashpowerPosition {
  source: "PURCHASE" | "REWARD";
  amount: number;
  unit: "THs" | "GHs";
  acquiredAt: string;
}

export interface EarnProduct {
  id: string;
  productType: "STAKING" | "LENDING" | "LOAN";
  title: string;
  titleKr: string;
  apr: number;
  termDays: number;
  collateralRequirement?: string;
  collateralRequirementKr?: string;
  totalSupply?: string;
  remainingSupply?: string;
  status: "DRAFT" | "ACTIVE" | "PAUSED" | "CLOSED";
}

export interface MerchantKpiSummary {
  merchantId: string;
  dailySales: number;
  dailyRedemptions: number;
  pendingSettlements: number;
  alerts: Array<{
    message: string;
    messageKr: string;
    severity: "info" | "warning" | "critical";
  }>;
}

export interface MerchantSettlementBatch {
  id: string;
  periodStart: string;
  periodEnd: string;
  amount: string;
  currency: string;
  status:
    | "DRAFT"
    | "PENDING"
    | "APPROVED"
    | "PAID"
    | "REJECTED"
    | "RECONCILE";
  statusKr:
    | "초안"
    | "대기"
    | "승인"
    | "지급 완료"
    | "반려"
    | "조정 중";
  lastUpdatedBy?: string;
  exportedAt?: string;
}

export interface MerchantSupportTicket {
  id: string;
  subject: string;
  subjectKr: string;
  status: "NEW" | "PENDING_ADMIN" | "PENDING_MERCHANT" | "RESOLVED";
  statusKr: "신규" | "관리자 대기" | "가맹점 대기" | "해결";
  priority: "LOW" | "MEDIUM" | "HIGH";
  priorityKr: "낮음" | "보통" | "높음";
  openedAt: string;
  updatedAt: string;
}

export interface AdminRiskAlert {
  id: string;
  domain:
    | "WALLET"
    | "NFT"
    | "P2P"
    | "MINING"
    | "EARN"
    | "OPERATIONS"
    | "COINEX"
    | "COUPON";
  message: string;
  messageKr: string;
  severity: "info" | "warning" | "critical";
  createdAt: string;
}

export interface ApprovalQueueItem {
  id: string;
  queue:
    | "WITHDRAWAL"
    | "SETTLEMENT"
    | "ESCROW"
    | "KYC"
    | "LOAN"
    | "RBAC";
  summary: string;
  summaryKr: string;
  requestedBy: string;
  requestedAt: string;
  requiredRole: "Operations Admin" | "Finance Admin" | "Compliance Officer";
}

export interface AuditLogEntry {
  id: string;
  actor: string;
  actorRole: string;
  action: string;
  actionKr: string;
  domain: string;
  resourceId: string;
  result: "SUCCESS" | "FAILURE";
  occurredAt: string;
}

export interface PortalApiShape {
  wallet: WalletOverviewPayload;
  nft: {
    catalog: NftCatalogItem[];
    receipts: NftPurchaseReceipt[];
  };
  p2p: {
    orders: P2POrderSummary[];
  };
  mining: {
    snapshot: MiningSnapshot[];
    hashpower: HashpowerPosition[];
  };
  earn: {
    products: EarnProduct[];
  };
  merchant: {
    kpis: MerchantKpiSummary;
    settlements: MerchantSettlementBatch[];
    supportTickets: MerchantSupportTicket[];
  };
  admin: {
    alerts: AdminRiskAlert[];
    approvals: ApprovalQueueItem[];
    auditLog: AuditLogEntry[];
  };
}
