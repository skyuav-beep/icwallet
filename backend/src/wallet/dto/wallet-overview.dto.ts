export type WalletAssetType = 'TOKEN' | 'NFT';

export type WalletAlertKind =
  | 'WHITELIST_REQUIRED'
  | 'PENDING_APPROVAL'
  | 'API_DEGRADED';

export type WalletAlertSeverity = 'info' | 'warning' | 'critical';

export interface WalletBalanceSnapshotDto {
  network: 'ISC' | 'BNB';
  assetSymbol: string;
  assetType: WalletAssetType;
  contractAddress?: string;
  balance: string;
  displayName: string;
  displayNameKr: string;
  fiatValue?: number;
  fiatCurrency?: string;
  updatedAt: string;
}

export interface WalletAlertDto {
  kind: WalletAlertKind;
  message: string;
  messageKr: string;
  severity: WalletAlertSeverity;
}

export interface WalletOverviewDto {
  memberId: string;
  preferredNetwork: 'ISC' | 'BNB';
  balances: WalletBalanceSnapshotDto[];
  alerts: WalletAlertDto[];
}
