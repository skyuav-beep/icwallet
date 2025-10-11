import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { TelegramNotifierService } from './telegram-notifier.service';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [TelegramNotifierService],
  exports: [TelegramNotifierService],
})
export class NotifierModule {}
