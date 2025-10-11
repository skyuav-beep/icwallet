-- CreateEnum
CREATE TYPE "MemberStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'CLOSED');

-- CreateEnum
CREATE TYPE "MemberKycStatus" AS ENUM ('PENDING', 'REVIEW_REQUIRED', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "LanguageCode" AS ENUM ('EN', 'KO');

-- CreateEnum
CREATE TYPE "AdminStatus" AS ENUM ('ACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "ServiceAccountStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'REVOKED');

-- CreateEnum
CREATE TYPE "AuthFactorType" AS ENUM ('EMAIL_OTP', 'TOTP', 'BACKUP_CODE');

-- CreateEnum
CREATE TYPE "LoginAttemptStatus" AS ENUM ('SUCCESS', 'FAILURE', 'BLOCKED');

-- CreateEnum
CREATE TYPE "Network" AS ENUM ('ISC', 'BNB');

-- CreateEnum
CREATE TYPE "NFTStandard" AS ENUM ('ERC721', 'ERC1155');

-- CreateEnum
CREATE TYPE "GiftKind" AS ENUM ('AMOUNT', 'VOUCHER');

-- CreateEnum
CREATE TYPE "CouponType" AS ENUM ('DISCOUNT', 'FREE', 'EXCHANGE');

-- CreateEnum
CREATE TYPE "NFTType" AS ENUM ('GIFT', 'COUPON');

-- CreateEnum
CREATE TYPE "NFTStatus" AS ENUM ('ACTIVE', 'REDEEMED', 'EXPIRED', 'CANCELED');

-- CreateEnum
CREATE TYPE "RedeemStatus" AS ENUM ('SUBMITTED', 'CONFIRMED', 'FAILED', 'SETTLED');

-- CreateEnum
CREATE TYPE "SettlementMethod" AS ENUM ('ONCHAIN', 'OFFCHAIN');

-- CreateEnum
CREATE TYPE "SettlementStatus" AS ENUM ('DRAFT', 'PENDING', 'APPROVED', 'PAID', 'REJECTED');

-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('BUY', 'SELL');

-- CreateEnum
CREATE TYPE "AssetType" AS ENUM ('TOKEN', 'NFT');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('OPEN', 'MATCHED', 'CLOSED', 'CANCELED');

-- CreateEnum
CREATE TYPE "EscrowState" AS ENUM ('LOCKED', 'RELEASED', 'REFUNDED', 'DISPUTED');

-- CreateEnum
CREATE TYPE "EscrowTransferDirection" AS ENUM ('IN', 'OUT');

-- CreateEnum
CREATE TYPE "DisputeResult" AS ENUM ('PENDING', 'RELEASE', 'REFUND', 'ESCALATED');

-- CreateEnum
CREATE TYPE "DisputeEvidenceType" AS ENUM ('IMAGE', 'DOCUMENT', 'NOTE');

-- CreateEnum
CREATE TYPE "HashpowerSource" AS ENUM ('PURCHASE', 'REWARD');

-- CreateEnum
CREATE TYPE "HashpowerTxnType" AS ENUM ('PURCHASE', 'GRANT', 'ADJUSTMENT');

-- CreateEnum
CREATE TYPE "WithdrawalExchange" AS ENUM ('COINEX');

-- CreateEnum
CREATE TYPE "WithdrawalStatus" AS ENUM ('PENDING', 'APPROVED', 'PROCESSING', 'COMPLETED', 'REJECTED', 'FAILED');

-- CreateEnum
CREATE TYPE "WithdrawalCheckpointStep" AS ENUM ('TWO_FA', 'WHITELIST', 'COMPLIANCE_REVIEW', 'FINANCE_APPROVAL', 'EXECUTION');

-- CreateEnum
CREATE TYPE "WithdrawalCheckpointStatus" AS ENUM ('PENDING', 'COMPLETED', 'REJECTED');

-- CreateEnum
CREATE TYPE "StakingProductStatus" AS ENUM ('DRAFT', 'ACTIVE', 'INACTIVE', 'RETIRED');

-- CreateEnum
CREATE TYPE "StakingPositionStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'REDEEMED', 'CANCELED');

-- CreateEnum
CREATE TYPE "LendingOfferStatus" AS ENUM ('OPEN', 'PARTIAL', 'CLOSED', 'CANCELED');

-- CreateEnum
CREATE TYPE "LendingLoanState" AS ENUM ('ACTIVE', 'REPAID', 'DEFAULTED', 'LIQUIDATED');

-- CreateEnum
CREATE TYPE "LoanProductStatus" AS ENUM ('DRAFT', 'ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "LoanApplicationState" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'ACTIVE', 'CLOSED', 'DEFAULTED');

-- CreateEnum
CREATE TYPE "StoreItemStatus" AS ENUM ('DRAFT', 'ACTIVE', 'INACTIVE', 'DISCONTINUED');

-- CreateEnum
CREATE TYPE "StoreOrderStatus" AS ENUM ('PENDING', 'PROCESSING', 'FULFILLED', 'FAILED', 'CANCELED');

-- CreateEnum
CREATE TYPE "MerchantStatus" AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "MerchantUserRole" AS ENUM ('CASHIER', 'MANAGER', 'OWNER');

-- CreateEnum
CREATE TYPE "MerchantWebhookStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "NoticeStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "InquiryStatus" AS ENUM ('OPEN', 'PENDING', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "AuditActorType" AS ENUM ('MEMBER', 'ADMIN', 'SERVICE');

-- CreateEnum
CREATE TYPE "AuditResult" AS ENUM ('SUCCESS', 'FAILURE', 'DENIED');

-- CreateEnum
CREATE TYPE "TermType" AS ENUM ('TERMS', 'PRIVACY', 'WITHDRAWAL_POLICY', 'OTHER');

-- CreateTable
CREATE TABLE "Member" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "passwordHash" TEXT NOT NULL,
    "status" "MemberStatus" NOT NULL DEFAULT 'ACTIVE',
    "kycStatus" "MemberKycStatus" NOT NULL DEFAULT 'PENDING',
    "preferredLang" "LanguageCode" NOT NULL DEFAULT 'EN',
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemberProfile" (
    "memberId" TEXT NOT NULL,
    "fullName" TEXT,
    "birthDate" TIMESTAMP(3),
    "nationality" TEXT,
    "docType" TEXT,
    "docNumber" TEXT,
    "kycLevel" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "reviewedBy" TEXT,
    "additionalInfo" JSONB,

    CONSTRAINT "MemberProfile_pkey" PRIMARY KEY ("memberId")
);

-- CreateTable
CREATE TABLE "KycSubmission" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "externalRef" TEXT NOT NULL,
    "status" "MemberKycStatus" NOT NULL DEFAULT 'PENDING',
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "payloadSnapshot" JSONB,

    CONSTRAINT "KycSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthFactor" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "factorType" "AuthFactorType" NOT NULL,
    "secretEncrypted" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuthFactor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeviceSession" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "deviceFingerprint" TEXT NOT NULL,
    "ipHash" TEXT,
    "userAgent" TEXT,
    "trusted" BOOLEAN NOT NULL DEFAULT false,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DeviceSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoginAttempt" (
    "id" TEXT NOT NULL,
    "memberId" TEXT,
    "identifier" TEXT NOT NULL,
    "ipHash" TEXT,
    "userAgent" TEXT,
    "status" "LoginAttemptStatus" NOT NULL,
    "failureReason" TEXT,
    "attemptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LoginAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "status" "AdminStatus" NOT NULL DEFAULT 'ACTIVE',
    "roleId" TEXT,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "grantedBy" TEXT,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("roleId","permissionId")
);

-- CreateTable
CREATE TABLE "ServiceAccount" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "apiKeyHash" TEXT NOT NULL,
    "status" "ServiceAccountStatus" NOT NULL DEFAULT 'ACTIVE',
    "roleId" TEXT,
    "lastUsedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "actorType" "AuditActorType" NOT NULL,
    "actorMemberId" TEXT,
    "actorAdminId" TEXT,
    "actorServiceId" TEXT,
    "action" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT,
    "roleSnapshot" TEXT,
    "result" "AuditResult" NOT NULL DEFAULT 'SUCCESS',
    "ip" TEXT,
    "userAgent" TEXT,
    "traceId" TEXT,
    "spanId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wallet" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "network" "Network" NOT NULL,
    "address" TEXT NOT NULL,
    "walletKey" TEXT,
    "label" TEXT,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WalletRotationLog" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "rotatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "oldHash" TEXT,
    "newHash" TEXT,
    "reason" TEXT,
    "performedBy" TEXT,

    CONSTRAINT "WalletRotationLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WalletNetworkSetting" (
    "network" "Network" NOT NULL,
    "chainId" INTEGER NOT NULL,
    "explorerUrl" TEXT,
    "minConfirmations" INTEGER NOT NULL DEFAULT 1,
    "maintenanceState" TEXT,
    "withdrawEnabled" BOOLEAN NOT NULL DEFAULT true,
    "depositEnabled" BOOLEAN NOT NULL DEFAULT true,
    "whitelistMandatory" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WalletNetworkSetting_pkey" PRIMARY KEY ("network")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" TEXT NOT NULL,
    "network" "Network" NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "contract" TEXT NOT NULL,
    "decimals" INTEGER NOT NULL,
    "logoUrl" TEXT,
    "isP2pEnabled" BOOLEAN NOT NULL DEFAULT false,
    "isSwapEnabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TokenPriceSnapshot" (
    "tokenId" TEXT NOT NULL,
    "capturedAt" TIMESTAMP(3) NOT NULL,
    "priceUsd" DECIMAL(38,18),
    "priceKrw" DECIMAL(38,18),
    "source" TEXT,

    CONSTRAINT "TokenPriceSnapshot_pkey" PRIMARY KEY ("tokenId","capturedAt")
);

-- CreateTable
CREATE TABLE "BalanceSnapshot" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "assetType" "AssetType" NOT NULL,
    "assetId" TEXT NOT NULL,
    "amount" DECIMAL(38,18) NOT NULL,
    "capturedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BalanceSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WhitelistAddress" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "network" "Network" NOT NULL,
    "address" TEXT NOT NULL,
    "label" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "approvedAt" TIMESTAMP(3),
    "approvedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WhitelistAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NFTCollection" (
    "id" TEXT NOT NULL,
    "network" "Network" NOT NULL,
    "name" TEXT NOT NULL,
    "standard" "NFTStandard" NOT NULL,
    "contract" TEXT NOT NULL,
    "issuerId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NFTCollection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GiftSpec" (
    "id" TEXT NOT NULL,
    "collectionId" TEXT,
    "title" TEXT NOT NULL,
    "kind" "GiftKind" NOT NULL,
    "faceValue" DECIMAL(38,18),
    "currency" TEXT,
    "expiresPolicy" TEXT,
    "redeemPolicy" TEXT,
    "maxRedemptions" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GiftSpec_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CouponSpec" (
    "id" TEXT NOT NULL,
    "collectionId" TEXT,
    "title" TEXT NOT NULL,
    "type" "CouponType" NOT NULL,
    "rateOrAmount" DECIMAL(38,18),
    "currency" TEXT,
    "expiresPolicy" TEXT,
    "metadata" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CouponSpec_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NFToken" (
    "id" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,
    "tokenId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "type" "NFTType" NOT NULL,
    "status" "NFTStatus" NOT NULL DEFAULT 'ACTIVE',
    "metadataUri" TEXT NOT NULL,
    "usableFrom" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "lastRedeemedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "giftSpecId" TEXT,
    "couponSpecId" TEXT,

    CONSTRAINT "NFToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Merchant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bizNo" TEXT NOT NULL,
    "countryCode" TEXT,
    "settlementWallet" TEXT,
    "settlementCurrency" TEXT,
    "bankInfo" JSONB,
    "status" "MerchantStatus" NOT NULL DEFAULT 'PENDING',
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Merchant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MerchantUser" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" "MerchantUserRole" NOT NULL,
    "status" "AdminStatus" NOT NULL DEFAULT 'ACTIVE',
    "roleId" TEXT,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MerchantUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MerchantWebhook" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "targetUrl" TEXT NOT NULL,
    "eventTypes" JSONB NOT NULL,
    "secret" TEXT NOT NULL,
    "status" "MerchantWebhookStatus" NOT NULL DEFAULT 'ACTIVE',
    "lastSuccessAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MerchantWebhook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MerchantCatalogItem" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "specType" "AssetType" NOT NULL,
    "specId" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "price" DECIMAL(38,18) NOT NULL,
    "inventory" INTEGER,
    "startAt" TIMESTAMP(3),
    "endAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MerchantCatalogItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RedeemLog" (
    "id" TEXT NOT NULL,
    "nftId" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "settlementId" TEXT,
    "amount" DECIMAL(38,18) NOT NULL,
    "currency" TEXT NOT NULL,
    "redeemedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "location" TEXT,
    "txHash" TEXT,
    "status" "RedeemStatus" NOT NULL DEFAULT 'SUBMITTED',

    CONSTRAINT "RedeemLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settlement" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "amount" DECIMAL(38,18) NOT NULL,
    "currency" TEXT NOT NULL,
    "method" "SettlementMethod" NOT NULL,
    "status" "SettlementStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "generatedBy" TEXT,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "settledAt" TIMESTAMP(3),

    CONSTRAINT "Settlement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SettlementLine" (
    "id" TEXT NOT NULL,
    "settlementId" TEXT NOT NULL,
    "redeemLogId" TEXT NOT NULL,
    "netAmount" DECIMAL(38,18) NOT NULL,
    "feeAmount" DECIMAL(38,18) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SettlementLine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "P2POrder" (
    "id" TEXT NOT NULL,
    "makerId" TEXT NOT NULL,
    "orderType" "OrderType" NOT NULL,
    "assetType" "AssetType" NOT NULL,
    "assetRef" TEXT NOT NULL,
    "quantity" DECIMAL(38,18) NOT NULL,
    "price" DECIMAL(38,18) NOT NULL,
    "payCurrency" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "P2POrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Escrow" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "takerId" TEXT NOT NULL,
    "state" "EscrowState" NOT NULL DEFAULT 'LOCKED',
    "hasDispute" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "releasedAt" TIMESTAMP(3),

    CONSTRAINT "Escrow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "P2PChat" (
    "id" TEXT NOT NULL,
    "escrowId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "P2PChat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EscrowTransfer" (
    "id" TEXT NOT NULL,
    "escrowId" TEXT NOT NULL,
    "direction" "EscrowTransferDirection" NOT NULL,
    "amount" DECIMAL(38,18) NOT NULL,
    "assetType" "AssetType" NOT NULL,
    "assetRef" TEXT,
    "txHash" TEXT,
    "postedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,

    CONSTRAINT "EscrowTransfer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dispute" (
    "id" TEXT NOT NULL,
    "escrowId" TEXT NOT NULL,
    "raisedById" TEXT,
    "reason" TEXT NOT NULL,
    "resolvedBy" TEXT,
    "result" "DisputeResult" NOT NULL DEFAULT 'PENDING',
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Dispute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DisputeEvidence" (
    "id" TEXT NOT NULL,
    "disputeId" TEXT NOT NULL,
    "type" "DisputeEvidenceType" NOT NULL,
    "fileUrl" TEXT,
    "note" TEXT,
    "uploadedBy" TEXT,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DisputeEvidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hashpower" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "source" "HashpowerSource" NOT NULL,
    "mhS" DECIMAL(38,18) NOT NULL,
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Hashpower_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HashpowerTxn" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "type" "HashpowerTxnType" NOT NULL,
    "mhS" DECIMAL(38,18) NOT NULL,
    "price" DECIMAL(38,18),
    "payToken" TEXT,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,

    CONSTRAINT "HashpowerTxn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MiningStatDaily" (
    "memberId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "hashrate24h" DECIMAL(38,18),
    "rejectRate" DECIMAL(38,18),
    "payoutAmount" DECIMAL(38,18),
    "payoutToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MiningStatDaily_pkey" PRIMARY KEY ("memberId","date")
);

-- CreateTable
CREATE TABLE "MiningBalance" (
    "memberId" TEXT NOT NULL,
    "coin" TEXT NOT NULL,
    "amount" DECIMAL(38,18) NOT NULL,
    "lastSyncedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MiningBalance_pkey" PRIMARY KEY ("memberId","coin")
);

-- CreateTable
CREATE TABLE "WithdrawalRequest" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "coin" TEXT NOT NULL,
    "amount" DECIMAL(38,18) NOT NULL,
    "destExchange" "WithdrawalExchange" NOT NULL DEFAULT 'COINEX',
    "destAccount" TEXT NOT NULL,
    "status" "WithdrawalStatus" NOT NULL DEFAULT 'PENDING',
    "approvedBy" TEXT,
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),
    "metadata" JSONB,

    CONSTRAINT "WithdrawalRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WithdrawalCheckpoint" (
    "id" TEXT NOT NULL,
    "withdrawalId" TEXT NOT NULL,
    "step" "WithdrawalCheckpointStep" NOT NULL,
    "status" "WithdrawalCheckpointStatus" NOT NULL DEFAULT 'PENDING',
    "actorAdminId" TEXT,
    "actorMemberId" TEXT,
    "completedAt" TIMESTAMP(3),
    "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "adminUserId" TEXT,

    CONSTRAINT "WithdrawalCheckpoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StakingProduct" (
    "id" TEXT NOT NULL,
    "assetType" "AssetType" NOT NULL,
    "assetRef" TEXT,
    "apr" DECIMAL(38,18) NOT NULL,
    "lockDays" INTEGER NOT NULL,
    "minAmount" DECIMAL(38,18) NOT NULL,
    "maxAmount" DECIMAL(38,18) NOT NULL,
    "totalCap" DECIMAL(38,18) NOT NULL,
    "remainingCap" DECIMAL(38,18) NOT NULL,
    "status" "StakingProductStatus" NOT NULL DEFAULT 'DRAFT',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StakingProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StakingPosition" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "principal" DECIMAL(38,18) NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endAt" TIMESTAMP(3),
    "rewardAccrued" DECIMAL(38,18) NOT NULL DEFAULT 0,
    "status" "StakingPositionStatus" NOT NULL DEFAULT 'ACTIVE',
    "metadata" JSONB,

    CONSTRAINT "StakingPosition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LendingOffer" (
    "id" TEXT NOT NULL,
    "lenderId" TEXT NOT NULL,
    "assetType" "AssetType" NOT NULL,
    "assetRef" TEXT,
    "amount" DECIMAL(38,18) NOT NULL,
    "termDays" INTEGER NOT NULL,
    "rate" DECIMAL(38,18) NOT NULL,
    "collateralSpec" JSONB,
    "minAmount" DECIMAL(38,18) NOT NULL,
    "maxAmount" DECIMAL(38,18) NOT NULL,
    "status" "LendingOfferStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LendingOffer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LendingLoan" (
    "id" TEXT NOT NULL,
    "offerId" TEXT NOT NULL,
    "borrowerId" TEXT NOT NULL,
    "amount" DECIMAL(38,18) NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueAt" TIMESTAMP(3) NOT NULL,
    "collateralAsset" TEXT,
    "collateralAmount" DECIMAL(38,18),
    "state" "LendingLoanState" NOT NULL DEFAULT 'ACTIVE',
    "closedAt" TIMESTAMP(3),
    "metadata" JSONB,

    CONSTRAINT "LendingLoan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoanProduct" (
    "id" TEXT NOT NULL,
    "assetType" "AssetType" NOT NULL,
    "assetRef" TEXT,
    "termDays" INTEGER NOT NULL,
    "rate" DECIMAL(38,18) NOT NULL,
    "collateralRequired" BOOLEAN NOT NULL DEFAULT true,
    "collateralSpec" JSONB,
    "status" "LoanProductStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LoanProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoanApplication" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "amount" DECIMAL(38,18) NOT NULL,
    "startAt" TIMESTAMP(3),
    "dueAt" TIMESTAMP(3),
    "collateralAsset" TEXT,
    "collateralAmount" DECIMAL(38,18),
    "state" "LoanApplicationState" NOT NULL DEFAULT 'PENDING',
    "metadata" JSONB,
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LoanApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CouponProvider" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "apiBaseUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "credentialRef" TEXT,
    "webhookSecret" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CouponProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoreItem" (
    "id" TEXT NOT NULL,
    "providerId" TEXT,
    "extProvider" TEXT NOT NULL,
    "extSku" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "price" DECIMAL(38,18) NOT NULL,
    "currency" TEXT NOT NULL,
    "status" "StoreItemStatus" NOT NULL DEFAULT 'DRAFT',
    "metadata" JSONB,
    "localeBundleId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StoreItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoreOrder" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "payAssetType" "AssetType" NOT NULL,
    "payAssetRef" TEXT,
    "payAmount" DECIMAL(38,18) NOT NULL,
    "status" "StoreOrderStatus" NOT NULL DEFAULT 'PENDING',
    "extPayload" JSONB,
    "deliveredCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fulfilledAt" TIMESTAMP(3),

    CONSTRAINT "StoreOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProviderReconciliation" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "payloadHash" TEXT,
    "metadata" JSONB,

    CONSTRAINT "ProviderReconciliation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notice" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "locale" "LanguageCode" NOT NULL DEFAULT 'KO',
    "status" "NoticeStatus" NOT NULL DEFAULT 'DRAFT',
    "version" TEXT,
    "publishedAt" TIMESTAMP(3),
    "publishedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NoticeRead" (
    "id" TEXT NOT NULL,
    "noticeId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "readAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NoticeRead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inquiry" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" "InquiryStatus" NOT NULL DEFAULT 'OPEN',
    "assignedTo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "respondedAt" TIMESTAMP(3),

    CONSTRAINT "Inquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportAttachment" (
    "id" TEXT NOT NULL,
    "inquiryId" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "uploadedBy" TEXT,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SupportAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanySetting" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,

    CONSTRAINT "CompanySetting_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "Term" (
    "id" TEXT NOT NULL,
    "type" "TermType" NOT NULL,
    "version" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "effectiveAt" TIMESTAMP(3) NOT NULL,
    "retiredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Term_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Member_email_key" ON "Member"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Member_phone_key" ON "Member"("phone");

-- CreateIndex
CREATE INDEX "KycSubmission_memberId_status_idx" ON "KycSubmission"("memberId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "AuthFactor_memberId_factorType_key" ON "AuthFactor"("memberId", "factorType");

-- CreateIndex
CREATE UNIQUE INDEX "DeviceSession_memberId_deviceFingerprint_key" ON "DeviceSession"("memberId", "deviceFingerprint");

-- CreateIndex
CREATE INDEX "LoginAttempt_identifier_attemptedAt_idx" ON "LoginAttempt"("identifier", "attemptedAt");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_key_key" ON "Permission"("key");

-- CreateIndex
CREATE INDEX "AuditLog_actorType_createdAt_idx" ON "AuditLog"("actorType", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_targetType_targetId_idx" ON "AuditLog"("targetType", "targetId");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_address_key" ON "Wallet"("address");

-- CreateIndex
CREATE INDEX "Wallet_memberId_network_idx" ON "Wallet"("memberId", "network");

-- CreateIndex
CREATE UNIQUE INDEX "Token_contract_key" ON "Token"("contract");

-- CreateIndex
CREATE INDEX "BalanceSnapshot_walletId_assetType_capturedAt_idx" ON "BalanceSnapshot"("walletId", "assetType", "capturedAt");

-- CreateIndex
CREATE UNIQUE INDEX "WhitelistAddress_memberId_network_address_key" ON "WhitelistAddress"("memberId", "network", "address");

-- CreateIndex
CREATE UNIQUE INDEX "NFTCollection_contract_key" ON "NFTCollection"("contract");

-- CreateIndex
CREATE UNIQUE INDEX "NFToken_collectionId_tokenId_key" ON "NFToken"("collectionId", "tokenId");

-- CreateIndex
CREATE UNIQUE INDEX "Merchant_bizNo_key" ON "Merchant"("bizNo");

-- CreateIndex
CREATE UNIQUE INDEX "MerchantUser_merchantId_email_key" ON "MerchantUser"("merchantId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "MerchantCatalogItem_merchantId_sku_key" ON "MerchantCatalogItem"("merchantId", "sku");

-- CreateIndex
CREATE INDEX "Settlement_merchantId_status_idx" ON "Settlement"("merchantId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "SettlementLine_redeemLogId_key" ON "SettlementLine"("redeemLogId");

-- CreateIndex
CREATE INDEX "P2POrder_makerId_status_idx" ON "P2POrder"("makerId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Dispute_escrowId_key" ON "Dispute"("escrowId");

-- CreateIndex
CREATE INDEX "WithdrawalRequest_memberId_status_idx" ON "WithdrawalRequest"("memberId", "status");

-- CreateIndex
CREATE INDEX "WithdrawalCheckpoint_withdrawalId_step_idx" ON "WithdrawalCheckpoint"("withdrawalId", "step");

-- CreateIndex
CREATE UNIQUE INDEX "CouponProvider_name_key" ON "CouponProvider"("name");

-- CreateIndex
CREATE UNIQUE INDEX "StoreItem_extProvider_extSku_key" ON "StoreItem"("extProvider", "extSku");

-- CreateIndex
CREATE INDEX "StoreOrder_memberId_status_idx" ON "StoreOrder"("memberId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "NoticeRead_noticeId_memberId_key" ON "NoticeRead"("noticeId", "memberId");

-- AddForeignKey
ALTER TABLE "MemberProfile" ADD CONSTRAINT "MemberProfile_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KycSubmission" ADD CONSTRAINT "KycSubmission_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthFactor" ADD CONSTRAINT "AuthFactor_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeviceSession" ADD CONSTRAINT "DeviceSession_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoginAttempt" ADD CONSTRAINT "LoginAttempt_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminUser" ADD CONSTRAINT "AdminUser_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceAccount" ADD CONSTRAINT "ServiceAccount_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorMemberId_fkey" FOREIGN KEY ("actorMemberId") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorAdminId_fkey" FOREIGN KEY ("actorAdminId") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorServiceId_fkey" FOREIGN KEY ("actorServiceId") REFERENCES "ServiceAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletRotationLog" ADD CONSTRAINT "WalletRotationLog_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TokenPriceSnapshot" ADD CONSTRAINT "TokenPriceSnapshot_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "Token"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BalanceSnapshot" ADD CONSTRAINT "BalanceSnapshot_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WhitelistAddress" ADD CONSTRAINT "WhitelistAddress_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GiftSpec" ADD CONSTRAINT "GiftSpec_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "NFTCollection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CouponSpec" ADD CONSTRAINT "CouponSpec_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "NFTCollection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NFToken" ADD CONSTRAINT "NFToken_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "NFTCollection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NFToken" ADD CONSTRAINT "NFToken_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NFToken" ADD CONSTRAINT "NFToken_giftSpecId_fkey" FOREIGN KEY ("giftSpecId") REFERENCES "GiftSpec"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NFToken" ADD CONSTRAINT "NFToken_couponSpecId_fkey" FOREIGN KEY ("couponSpecId") REFERENCES "CouponSpec"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MerchantUser" ADD CONSTRAINT "MerchantUser_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MerchantUser" ADD CONSTRAINT "MerchantUser_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MerchantWebhook" ADD CONSTRAINT "MerchantWebhook_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MerchantCatalogItem" ADD CONSTRAINT "MerchantCatalogItem_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RedeemLog" ADD CONSTRAINT "RedeemLog_nftId_fkey" FOREIGN KEY ("nftId") REFERENCES "NFToken"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RedeemLog" ADD CONSTRAINT "RedeemLog_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RedeemLog" ADD CONSTRAINT "RedeemLog_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RedeemLog" ADD CONSTRAINT "RedeemLog_settlementId_fkey" FOREIGN KEY ("settlementId") REFERENCES "Settlement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Settlement" ADD CONSTRAINT "Settlement_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SettlementLine" ADD CONSTRAINT "SettlementLine_settlementId_fkey" FOREIGN KEY ("settlementId") REFERENCES "Settlement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SettlementLine" ADD CONSTRAINT "SettlementLine_redeemLogId_fkey" FOREIGN KEY ("redeemLogId") REFERENCES "RedeemLog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "P2POrder" ADD CONSTRAINT "P2POrder_makerId_fkey" FOREIGN KEY ("makerId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Escrow" ADD CONSTRAINT "Escrow_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "P2POrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Escrow" ADD CONSTRAINT "Escrow_takerId_fkey" FOREIGN KEY ("takerId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "P2PChat" ADD CONSTRAINT "P2PChat_escrowId_fkey" FOREIGN KEY ("escrowId") REFERENCES "Escrow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "P2PChat" ADD CONSTRAINT "P2PChat_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EscrowTransfer" ADD CONSTRAINT "EscrowTransfer_escrowId_fkey" FOREIGN KEY ("escrowId") REFERENCES "Escrow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dispute" ADD CONSTRAINT "Dispute_escrowId_fkey" FOREIGN KEY ("escrowId") REFERENCES "Escrow"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dispute" ADD CONSTRAINT "Dispute_raisedById_fkey" FOREIGN KEY ("raisedById") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DisputeEvidence" ADD CONSTRAINT "DisputeEvidence_disputeId_fkey" FOREIGN KEY ("disputeId") REFERENCES "Dispute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hashpower" ADD CONSTRAINT "Hashpower_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HashpowerTxn" ADD CONSTRAINT "HashpowerTxn_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MiningStatDaily" ADD CONSTRAINT "MiningStatDaily_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MiningBalance" ADD CONSTRAINT "MiningBalance_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WithdrawalRequest" ADD CONSTRAINT "WithdrawalRequest_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WithdrawalCheckpoint" ADD CONSTRAINT "WithdrawalCheckpoint_withdrawalId_fkey" FOREIGN KEY ("withdrawalId") REFERENCES "WithdrawalRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WithdrawalCheckpoint" ADD CONSTRAINT "WithdrawalCheckpoint_actorMemberId_fkey" FOREIGN KEY ("actorMemberId") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WithdrawalCheckpoint" ADD CONSTRAINT "WithdrawalCheckpoint_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StakingPosition" ADD CONSTRAINT "StakingPosition_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StakingPosition" ADD CONSTRAINT "StakingPosition_productId_fkey" FOREIGN KEY ("productId") REFERENCES "StakingProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LendingOffer" ADD CONSTRAINT "LendingOffer_lenderId_fkey" FOREIGN KEY ("lenderId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LendingLoan" ADD CONSTRAINT "LendingLoan_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "LendingOffer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LendingLoan" ADD CONSTRAINT "LendingLoan_borrowerId_fkey" FOREIGN KEY ("borrowerId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoanApplication" ADD CONSTRAINT "LoanApplication_productId_fkey" FOREIGN KEY ("productId") REFERENCES "LoanProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoanApplication" ADD CONSTRAINT "LoanApplication_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoreItem" ADD CONSTRAINT "StoreItem_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "CouponProvider"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoreOrder" ADD CONSTRAINT "StoreOrder_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoreOrder" ADD CONSTRAINT "StoreOrder_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "StoreItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderReconciliation" ADD CONSTRAINT "ProviderReconciliation_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "CouponProvider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NoticeRead" ADD CONSTRAINT "NoticeRead_noticeId_fkey" FOREIGN KEY ("noticeId") REFERENCES "Notice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NoticeRead" ADD CONSTRAINT "NoticeRead_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inquiry" ADD CONSTRAINT "Inquiry_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportAttachment" ADD CONSTRAINT "SupportAttachment_inquiryId_fkey" FOREIGN KEY ("inquiryId") REFERENCES "Inquiry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
