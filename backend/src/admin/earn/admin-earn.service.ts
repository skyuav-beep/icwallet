import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PaginationQueryDto } from '../dto/pagination.dto';

@Injectable()
export class AdminEarnService {
  constructor(private readonly prisma: PrismaService) {}

  async listStakingProducts(params: PaginationQueryDto) {
    const { limit = 20, offset = 0 } = params;
    const [items, total] = await Promise.all([
      this.prisma.stakingProduct.findMany({
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          positions: {
            select: { id: true, memberId: true, principal: true, status: true },
            take: 5,
          },
        },
      }),
      this.prisma.stakingProduct.count(),
    ]);

    return { total, items };
  }

  async listLendingOffers(params: PaginationQueryDto) {
    const { limit = 20, offset = 0 } = params;
    const [items, total] = await Promise.all([
      this.prisma.lendingOffer.findMany({
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          lender: {
            select: { id: true, email: true },
          },
          loans: {
            select: { id: true, borrowerId: true, amount: true, state: true },
            take: 5,
          },
        },
      }),
      this.prisma.lendingOffer.count(),
    ]);

    return { total, items };
  }

  async listLoanProducts(params: PaginationQueryDto) {
    const { limit = 20, offset = 0 } = params;
    const [items, total] = await Promise.all([
      this.prisma.loanProduct.findMany({
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          applications: {
            select: {
              id: true,
              memberId: true,
              amount: true,
              state: true,
              reviewedBy: true,
            },
            take: 5,
          },
        },
      }),
      this.prisma.loanProduct.count(),
    ]);

    return { total, items };
  }
}
