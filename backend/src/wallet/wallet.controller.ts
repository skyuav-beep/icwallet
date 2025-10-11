import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { WalletService } from './wallet.service';

@Controller({
  path: 'wallets',
  version: '1',
})
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('networks')
  listSupportedNetworks() {
    return {
      networks: ['ISC', 'BNB'],
      description: 'Supported networks per spec.md section 1.',
      descriptionKr: 'spec.md 1장에 정의된 지원 네트워크 목록입니다.',
    };
  }

  @Get('balance')
  getBalancePreview(@Query('address') address?: string) {
    return {
      address,
      warning:
        'Balance lookup not implemented yet; integrate mblockapi adapters.',
      warningKr:
        '잔액 조회는 아직 구현되지 않았습니다. mblockapi 어댑터를 연동하세요.',
    };
  }

  @Get('overview')
  async getWalletOverview(@Query('memberId') memberId?: string) {
    if (!memberId) {
      throw new BadRequestException({
        message: 'memberId query parameter is required.',
        messageKr: 'memberId 쿼리 파라미터가 필요합니다.',
      });
    }

    return this.walletService.getOverview(memberId);
  }
}
