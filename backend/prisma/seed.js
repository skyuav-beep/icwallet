/* eslint-disable no-console */
/**
 * Prisma seed script.
 * Usage / 사용법: `DATABASE_URL` 환경 변수를 설정한 뒤 `pnpm --filter backend db:seed` 실행.
 */
const { PrismaClient, Network } = require('@prisma/client');
const { hashSync } = require('bcryptjs');

const prisma = new PrismaClient();

const permissionSeeds = [
  { key: 'wallet:manage', label: 'Manage wallets / 지갑 관리' },
  { key: 'wallet:withdraw.approve', label: 'Approve withdrawals / 출금 승인' },
  { key: 'wallet:withdraw.review', label: 'Review withdrawals / 출금 검토' },
  { key: 'nft:catalog.manage', label: 'Manage NFT catalog / NFT 카탈로그 관리' },
  { key: 'settlement:approve', label: 'Approve settlements / 정산 승인' },
  { key: 'p2p:moderate', label: 'Moderate P2P trades / P2P 거래 관리' },
  { key: 'mining:monitor', label: 'Monitor mining ops / 마이닝 운영 모니터링' },
  { key: 'earn:product.manage', label: 'Manage EARN products / 재테크 상품 관리' },
  { key: 'store:operate', label: 'Operate store catalog / 스토어 카탈로그 운영' },
  { key: 'support:reply', label: 'Respond to support tickets / 고객 문의 답변' },
  { key: 'rbac:manage', label: 'Manage RBAC / RBAC 관리' },
  { key: 'audit:view', label: 'View audit logs / 감사 로그 열람' }
];

const roleSeeds = [
  { name: 'Super Admin', description: 'Full platform control / 플랫폼 전체 권한' },
  { name: 'Operations Admin', description: 'Day-to-day operations / 일상 운영 담당' },
  { name: 'Finance Admin', description: 'Financial approvals / 재무 승인 담당' },
  { name: 'Compliance Officer', description: 'KYC & audit oversight / KYC·감사 담당' },
  { name: 'Support Agent', description: 'Customer support / 고객지원' },
  { name: 'Merchant Manager', description: 'Merchant management / 가맹점 운영' }
];

const rolePermissionMap = {
  'Super Admin': permissionSeeds.map((p) => p.key),
  'Operations Admin': [
    'wallet:manage',
    'p2p:moderate',
    'nft:catalog.manage',
    'mining:monitor',
    'earn:product.manage',
    'store:operate',
    'support:reply'
  ],
  'Finance Admin': [
    'wallet:withdraw.approve',
    'settlement:approve',
    'wallet:withdraw.review'
  ],
  'Compliance Officer': [
    'wallet:withdraw.review',
    'audit:view',
    'rbac:manage'
  ],
  'Support Agent': ['support:reply'],
  'Merchant Manager': ['store:operate', 'nft:catalog.manage']
};

const networkSeeds = [
  {
    network: Network.BNB,
    chainId: 56,
    explorerUrl: 'https://bscscan.com',
    minConfirmations: 12,
    maintenanceState: null,
    withdrawEnabled: true,
    depositEnabled: true,
    whitelistMandatory: true
  },
  {
    network: Network.ISC,
    chainId: 1818,
    explorerUrl: 'https://scan.islandchain.example',
    minConfirmations: 3,
    maintenanceState: null,
    withdrawEnabled: true,
    depositEnabled: true,
    whitelistMandatory: false
  }
];

const tokenSeeds = [
  {
    network: Network.BNB,
    name: 'Binance Coin',
    symbol: 'BNB',
    contract: 'native:bnb',
    decimals: 18,
    logoUrl: 'https://cdn.icwallet.example/assets/bnb.svg',
    isP2pEnabled: true,
    isSwapEnabled: true
  },
  {
    network: Network.ISC,
    name: 'Island Coin',
    symbol: 'ISC',
    contract: '0xISC000000000000000000000000000000000000',
    decimals: 18,
    logoUrl: 'https://cdn.icwallet.example/assets/isc.svg',
    isP2pEnabled: true,
    isSwapEnabled: true
  },
  {
    network: Network.ISC,
    name: 'IC Coupon Token',
    symbol: 'ICCT',
    contract: '0xICCT0000000000000000000000000000000000',
    decimals: 18,
    logoUrl: 'https://cdn.icwallet.example/assets/icct.svg',
    isP2pEnabled: false,
    isSwapEnabled: false
  }
];

const companySettings = [
  { key: 'company.name', value: 'IC Wallet Co., Ltd.' },
  { key: 'support.email', value: 'support@icwallet.example' },
  { key: 'compliance.auditRetentionYears', value: '5' }
];

const adminSeeds = [
  {
    email: 'superadmin@icwallet.example',
    name: 'Super Admin',
    roleName: 'Super Admin',
    password: 'ChangeMe123!',
  },
];

async function seedPermissions() {
  for (const permission of permissionSeeds) {
    await prisma.permission.upsert({
      where: { key: permission.key },
      update: { label: permission.label },
      create: permission
    });
  }
}

async function seedRoles() {
  for (const role of roleSeeds) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: { description: role.description },
      create: role
    });
  }
}

async function seedRolePermissions() {
  for (const [roleName, permissions] of Object.entries(rolePermissionMap)) {
    const role = await prisma.role.findUnique({ where: { name: roleName } });
    if (!role) continue;

    for (const permissionKey of permissions) {
      const permission = await prisma.permission.findUnique({ where: { key: permissionKey } });
      if (!permission) continue;

      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: role.id,
            permissionId: permission.id
          }
        },
        update: {},
        create: {
          roleId: role.id,
          permissionId: permission.id
        }
      });
    }
  }
}

async function seedNetworks() {
  for (const config of networkSeeds) {
    await prisma.walletNetworkSetting.upsert({
      where: { network: config.network },
      update: {
        chainId: config.chainId,
        explorerUrl: config.explorerUrl,
        minConfirmations: config.minConfirmations,
        maintenanceState: config.maintenanceState,
        withdrawEnabled: config.withdrawEnabled,
        depositEnabled: config.depositEnabled,
        whitelistMandatory: config.whitelistMandatory
      },
      create: config
    });
  }
}

async function seedTokens() {
  for (const token of tokenSeeds) {
    await prisma.token.upsert({
      where: { contract: token.contract },
      update: {
        name: token.name,
        symbol: token.symbol,
        network: token.network,
        decimals: token.decimals,
        logoUrl: token.logoUrl,
        isP2pEnabled: token.isP2pEnabled,
        isSwapEnabled: token.isSwapEnabled
      },
      create: token
    });
  }
}

async function seedCompanySettings() {
  for (const setting of companySettings) {
    await prisma.companySetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting
    });
  }
}

async function seedAdminUsers() {
  for (const admin of adminSeeds) {
    const role = await prisma.role.findUnique({ where: { name: admin.roleName } });
    if (!role) {
      console.warn(`⚠️  Role ${admin.roleName} not found. 관리자 계정을 건너뜁니다.`);
      continue;
    }

    const passwordHash = hashSync(admin.password, 12);

    await prisma.adminUser.upsert({
      where: { email: admin.email },
      update: {
        name: admin.name,
        roleId: role.id,
        status: 'ACTIVE',
        passwordHash,
      },
      create: {
        email: admin.email,
        name: admin.name,
        passwordHash,
        roleId: role.id,
        status: 'ACTIVE',
      },
    });
  }
}

async function main() {
  await seedPermissions();
  await seedRoles();
  await seedRolePermissions();
  await seedNetworks();
  await seedTokens();
  await seedCompanySettings();
  await seedAdminUsers();

  console.log('✅ Seed data applied / 시드 데이터 적용 완료');
}

main()
  .catch((error) => {
    console.error('❌ Seed failed / 시드 실패:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
