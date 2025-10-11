import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { TelegramNotifierService } from './telegram-notifier.service';
import { NotificationService } from './notification.service';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [TelegramNotifierService, NotificationService],
  exports: [NotificationService, TelegramNotifierService],
})
export class NotifierModule {}
