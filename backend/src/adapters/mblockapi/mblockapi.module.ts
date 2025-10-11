import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MBlockApiClient } from './mblockapi.client';

@Module({
  imports: [HttpModule],
  providers: [MBlockApiClient],
  exports: [MBlockApiClient],
})
export class MBlockApiModule {}
