import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PaginationQueryDto } from '../dto/pagination.dto';

@Injectable()
export class AdminStoreService {
  constructor(private readonly prisma: PrismaService) {}

  async listStoreOrders(params: PaginationQueryDto) {
    const { limit = 20, offset = 0 } = params;
    const [items, total] = await Promise.all([
      this.prisma.storeOrder.findMany({
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          member: { select: { id: true, email: true } },
          item: {
            select: { id: true, title: true, status: true },
          },
        },
      }),
      this.prisma.storeOrder.count(),
    ]);

    return { total, items };
  }

  async listProviders(params: PaginationQueryDto) {
    const { limit = 20, offset = 0 } = params;
    const [items, total] = await Promise.all([
      this.prisma.couponProvider.findMany({
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          storeItems: {
            select: { id: true, title: true, status: true },
            take: 5,
          },
        },
      }),
      this.prisma.couponProvider.count(),
    ]);

    return { total, items };
  }
}
