import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogService } from '../shared/audit/audit-log.service';
import { NotificationService } from '../shared/notifier/notification.service';

interface CreateTicketDto {
  memberId?: string | null;
  category: string;
  content: string;
}

interface ReplyTicketDto {
  adminId: string;
  note: string;
}

@Injectable()
export class SupportService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditLogService,
    private readonly notifications: NotificationService,
  ) {}

  async createTicket(dto: CreateTicketDto) {
    const ticket = await this.prisma.inquiry.create({
      data: {
        memberId: dto.memberId ?? null,
        category: dto.category,
        content: dto.content,
        status: 'OPEN',
      },
    });

    await Promise.all([
      this.audit.record({
        actor: {
          type: dto.memberId ? 'MEMBER' : 'SERVICE',
          id: dto.memberId ?? null,
        },
        action: 'support.ticket.created',
        targetType: 'Inquiry',
        targetId: ticket.id,
        metadata: {
          category: dto.category,
        },
      }),
      this.notifications.notifySupportTicket({
        id: ticket.id,
        memberId: ticket.memberId,
        category: ticket.category,
        content: ticket.content,
      }),
    ]);

    return ticket;
  }

  async addReply(ticketId: string, dto: ReplyTicketDto) {
    const existing = await this.prisma.inquiry.findUnique({ where: { id: ticketId } });
    if (!existing) {
      throw new NotFoundException({
        message: 'Ticket not found',
        messageKr: '티켓을 찾을 수 없습니다.',
      });
    }

    const updated = await this.prisma.inquiry.update({
      where: { id: ticketId },
      data: {
        status: 'PENDING',
        assignedTo: dto.adminId,
        respondedAt: new Date(),
      },
    });

    await this.audit.record({
      actor: { type: 'ADMIN', id: dto.adminId },
      action: 'support.ticket.replied',
      targetType: 'Inquiry',
      targetId: ticketId,
      metadata: {
        note: dto.note,
      },
    });

    return updated;
  }

  async closeTicket(ticketId: string, adminId: string, resolution: string) {
    const existing = await this.prisma.inquiry.findUnique({ where: { id: ticketId } });
    if (!existing) {
      throw new NotFoundException({
        message: 'Ticket not found',
        messageKr: '티켓을 찾을 수 없습니다.',
      });
    }

    const closed = await this.prisma.inquiry.update({
      where: { id: ticketId },
      data: {
        status: 'RESOLVED',
        assignedTo: adminId,
        respondedAt: new Date(),
      },
    });

    await this.audit.record({
      actor: { type: 'ADMIN', id: adminId },
      action: 'support.ticket.closed',
      targetType: 'Inquiry',
      targetId: ticketId,
      metadata: {
        resolution,
      },
    });

    return closed;
  }

  async listTickets(pagination: { offset?: number; limit?: number } = {}) {
    const { offset = 0, limit = 20 } = pagination;
    const [items, total] = await Promise.all([
      this.prisma.inquiry.findMany({
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.inquiry.count(),
    ]);

    return { total, items };
  }
}
