import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TelegramNotifierService {
  private readonly logger = new Logger(TelegramNotifierService.name);

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {}

  async send(message: string) {
    const token = this.config.get<string>('TELEGRAM_BOT_TOKEN');
    const chatId = this.config.get<string>('TELEGRAM_CHAT_ID');

    if (!token || !chatId) {
      this.logger.debug('Telegram credentials not set; skipping notification');
      return;
    }

    try {
      await this.http.axiosRef.post(
        `https://api.telegram.org/bot${token}/sendMessage`,
        {
          chat_id: chatId,
          text: message,
          parse_mode: 'Markdown',
          disable_web_page_preview: true,
        },
        {
          timeout: 5000,
        },
      );
    } catch (error) {
      const reason =
        error instanceof Error ? error.message : 'unknown transport error';
      this.logger.warn(`Failed to send Telegram notification: ${reason}`);
    }
  }
}
