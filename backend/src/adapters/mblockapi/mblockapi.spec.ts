import axios from 'axios';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeAll } from 'vitest';
import { MBlockApiClient } from './mblockapi.client';

const shouldRun = process.env.RUN_MBLOCK_TESTS === 'true';

(shouldRun ? describe : describe.skip)('MBlockApiClient (live)', () => {
  const timeout = 20000;
  let module: TestingModule;
  let client: MBlockApiClient;

  beforeAll(async () => {
    const base = process.env.MBLOCK_API_BASE ?? 'https://agent.mblockapi.com/bsc';
    const key =
      process.env.MBLOCK_TEST_KEY ??
      process.env.MBLOCK_API_KEY ??
      'l3NR5Rz658AoV87N556xHGs8czL13ohjve01JRlncqnSCdTBZUvj0TcngNXAD2o5';

    module = await Test.createTestingModule({
      imports: [HttpModule.register({ timeout: 10000 })],
    }).compile();

    const http = module.get<HttpService>(HttpService);
    const config = new ConfigService({
      MBLOCK_API_BASE: base,
      MBLOCK_API_KEY: key,
    });

    client = new MBlockApiClient(http, config);
  });

  it('creates wallet successfully', async () => {
    const result = await client.createWallet();
    expect(result).toHaveProperty('address');
    expect(typeof result.address).toBe('string');
  }, timeout);

  it('retrieves balances for created wallet', async () => {
    const { address } = await client.createWallet();
    const balance = await client.getBalance(address);
    expect(balance.result).toBe(true);
  }, timeout);
});
