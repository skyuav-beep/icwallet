import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogService } from '../shared/audit/audit-log.service';
import { NotificationService } from '../shared/notifier/notification.service';

interface PublishTermsDto {
  adminId: string;
  type: string;
  version: string;
  content: string;
  effectiveAt: Date;
}

@Injectable()
export class TermsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditLogService,
    private readonly notifications: NotificationService,
  ) {}

  async publish(dto: PublishTermsDto) {
    const existing = await this.prisma.term.findFirst({
      where: { type: dto.type, version: dto.version },
    });

    if (existing) {
      throw new BadRequestException({
        message: 'Version already published for this type',
        messageKr: '해당 유형의 버전이 이미 존재합니다.',
      });
    }

    const term = await this.prisma.term.create({
      data: {
        type: dto.type,
        version: dto.version,
        content: dto.content,
        effectiveAt: dto.effectiveAt,
      },
    });

    await Promise.all([
      this.audit.record({
        actor: { type: 'ADMIN', id: dto.adminId },
        action: 'terms.published',
        targetType: 'Terms',
        targetId: term.id,
        metadata: {
          type: term.type,
          version: term.version,
        },
      }),
      this.notifications.notifyTermsUpdated({
        id: term.id,
        type: term.type,
        version: term.version,
      }),
    ]);

    return term;
  }

  async retire(termId: string, adminId: string, note?: string) {
    const term = await this.prisma.term.findUnique({ where: { id: termId } });
    if (!term) {
      throw new NotFoundException({
        message: 'Terms not found',
        messageKr: '약관을 찾을 수 없습니다.',
      });
    }

    if (term.retiredAt) {
      throw new BadRequestException({
        message: 'Terms already retired',
        messageKr: '이미 폐기된 약관입니다.',
      });
    }

    const retired = await this.prisma.term.update({
      where: { id: termId },
      data: {
        retiredAt: new Date(),
      },
    });

    await this.audit.record({
      actor: { type: 'ADMIN', id: adminId },
      action: 'terms.retired',
      targetType: 'Terms',
      targetId: termId,
      metadata: {
        note: note ?? null,
      },
    });

    return retired;
  }

  async getLatest(type: string) {
    return this.prisma.term.findFirst({
      where: { type },
      orderBy: { effectiveAt: 'desc' },
    });
  }

  async list(options: { type?: string } = {}) {
    const { type } = options;
    return this.prisma.term.findMany({
      where: type ? { type } : undefined,
      orderBy: { effectiveAt: 'desc' },
    });
  }
}
