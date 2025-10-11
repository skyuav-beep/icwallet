import { Injectable } from '@nestjs/common';
import { TelegramNotifierService } from './telegram-notifier.service';

export interface NotificationPayload {
  title: string;
  body: string;
  context?: Record<string, unknown>;
}

@Injectable()
export class NotificationService {
  constructor(private readonly telegram: TelegramNotifierService) {}

  async sendText(message: string) {
    await this.telegram.send(message);
  }

  async notifySupportTicket(ticket: {
    id: string;
    memberId?: string | null;
    category: string;
    content: string;
  }) {
    const message = [
      `*Support Ticket* (#${ticket.id})`,
      `Category: ${ticket.category}`,
      ticket.memberId ? `Member: ${ticket.memberId}` : '',
      '',
      ticket.content,
    ]
      .filter(Boolean)
      .join('\n');

    await this.telegram.send(message);
  }

  async notifyTermsUpdated(terms: { id: string; type: string; version: string }) {
    await this.telegram.send(
      `*Terms Updated*\nType: ${terms.type}\nVersion: ${terms.version}\nID: ${terms.id}`,
    );
  }
}
