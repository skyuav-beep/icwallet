import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from '../prisma/prisma.module';
import { AdminMembersController } from './members/admin-members.controller';
import { AdminMembersService } from './members/admin-members.service';
import { AdminMerchantsController } from './merchants/admin-merchants.controller';
import { AdminMerchantsService } from './merchants/admin-merchants.service';
import { AdminWalletsController } from './wallets/admin-wallets.controller';
import { AdminWalletsService } from './wallets/admin-wallets.service';
import { AdminP2PController } from './p2p/admin-p2p.controller';
import { AdminP2PService } from './p2p/admin-p2p.service';
import { AdminMiningController } from './mining/admin-mining.controller';
import { AdminMiningService } from './mining/admin-mining.service';
import { AdminEarnController } from './earn/admin-earn.controller';
import { AdminEarnService } from './earn/admin-earn.service';
import { AdminStoreController } from './store/admin-store.controller';
import { AdminStoreService } from './store/admin-store.service';
import { AdminPolicyController } from './policy/admin-policy.controller';
import { AdminPolicyService } from './policy/admin-policy.service';
import { AdminAuthGuard } from './guards/admin-auth.guard';
import { AdminRolesGuard } from './guards/admin-roles.guard';
import { AdminAuditService } from './audit/admin-audit.service';
import { AdminAuthController } from './auth/admin-auth.controller';
import { AdminAuthService } from './auth/admin-auth.service';
import { AdminJwtStrategy } from './auth/admin-jwt.strategy';
import { CoinExModule } from '../adapters/coinex/coinex.module';
import { WithdrawalExecutorService } from './mining/withdrawal-executor.service';
import { NotifierModule } from '../shared/notifier/notifier.module';
import { AuditLogModule } from '../shared/audit/audit-log.module';
import { SupportModule } from '../support/support.module';
import { AdminSupportController } from './support/admin-support.controller';

@Module({
  imports: [
    PrismaModule,
    CoinExModule,
    AuditLogModule,
    NotifierModule,
    SupportModule,
    PassportModule.register({ defaultStrategy: 'admin-jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('ADMIN_JWT_SECRET') ?? 'change_admin_secret',
        signOptions: {
          expiresIn: Number(config.get<string>('ADMIN_JWT_TTL') ?? '1800'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [
    AdminAuthController,
    AdminMembersController,
    AdminMerchantsController,
    AdminWalletsController,
    AdminP2PController,
    AdminMiningController,
    AdminEarnController,
    AdminStoreController,
    AdminPolicyController,
    AdminSupportController,
  ],
  providers: [
    AdminAuthService,
    AdminJwtStrategy,
    AdminMembersService,
    AdminMerchantsService,
    AdminWalletsService,
    AdminP2PService,
    AdminMiningService,
    AdminEarnService,
    AdminStoreService,
    AdminPolicyService,
    AdminAuthGuard,
    AdminRolesGuard,
    AdminAuditService,
    WithdrawalExecutorService,
  ],
})
export class AdminModule {}
