import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PaginationQueryDto } from '../dto/pagination.dto';

@Injectable()
export class AdminWalletsService {
  constructor(private readonly prisma: PrismaService) {}

  async listWallets(params: PaginationQueryDto) {
    const { limit = 20, offset = 0 } = params;
    const [items, total] = await Promise.all([
      this.prisma.wallet.findMany({
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          member: {
            select: {
              id: true,
              email: true,
              status: true,
            },
          },
          balanceSnapshots: {
            orderBy: { capturedAt: 'desc' },
            take: 1,
          },
        },
      }),
      this.prisma.wallet.count(),
    ]);

    return { total, items };
  }

  async listWhitelistAddresses(params: PaginationQueryDto) {
    const { limit = 20, offset = 0 } = params;
    const [items, total] = await Promise.all([
      this.prisma.whitelistAddress.findMany({
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          member: {
            select: { id: true, email: true, status: true },
          },
        },
      }),
      this.prisma.whitelistAddress.count(),
    ]);

    return { total, items };
  }
}
