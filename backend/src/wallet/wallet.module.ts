import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { MBlockApiModule } from '../adapters/mblockapi/mblockapi.module';
import { PrismaModule } from '../prisma/prisma.module';
import { EncryptionModule } from '../encryption/encryption.module';
import { WalletRotationService } from './rotation.service';

@Module({
  imports: [MBlockApiModule, PrismaModule, EncryptionModule],
  controllers: [WalletController],
  providers: [WalletService, WalletRotationService],
})
export class WalletModule {}
