import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CoinExClient } from './coinex.client';

@Module({
  imports: [HttpModule],
  providers: [CoinExClient],
  exports: [CoinExClient],
})
export class CoinExModule {}
