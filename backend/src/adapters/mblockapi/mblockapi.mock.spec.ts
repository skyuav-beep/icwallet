import nock from 'nock';
import axios from 'axios';
import { HttpService } from '@nestjs/axios';
import { describe, it, expect, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';
import { MBlockApiClient } from './mblockapi.client';
import { ConfigService } from '@nestjs/config';

describe('MBlockApiClient (mocked)', () => {
  const host = 'https://agent.mblockapi.com';
  const path = '/bsc';
  const baseUrl = `${host}${path}`;
  const apiKey = 'test-key';
  let client: MBlockApiClient;

  beforeAll(() => {
    nock.disableNetConnect();
  });

  afterAll(() => {
    nock.enableNetConnect();
  });

  beforeEach(async () => {
    client = new MBlockApiClient(
      new HttpService(axios.create({ baseURL: baseUrl })),
      {
        get: (token: string) => {
          if (token === 'MBLOCK_API_BASE') return baseUrl;
          if (token === 'MBLOCK_API_KEY') return apiKey;
          return undefined;
        },
      } as ConfigService,
    );
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('handles successful wallet creation', async () => {
    nock(host)
      .post(path)
      .reply(200, {
        result: true,
        address: '0x123',
        walletKey: 'abc',
      });

    const response = await client.createWallet();
    expect(response).toEqual({ result: true, address: '0x123', walletKey: 'abc' });
  });

  it('retries when wallet creation fails', async () => {
    let attempts = 0;
    nock(host)
      .post(path)
      .times(2)
      .reply(() => {
        attempts += 1;
        return [200, { result: false, message: 'temporary failure' }];
      });

    nock(host)
      .post(path)
      .reply(200, { result: true, address: '0xabc', walletKey: 'key' });

    const response = await client.createWallet();
    expect(attempts).toBe(2);
    expect(response.address).toBe('0xabc');
  });

  it('throws when balance fetch fails after retries', async () => {
    nock(host)
      .post(path, (body) => {
        const data = typeof body === 'string' ? JSON.parse(body) : body;
        return data.method === 'balanceOf' && data.address === '0x123';
      })
      .times(4)
      .reply(200, { result: false });

    await expect(client.getBalance('0x123')).rejects.toThrow('mblockapi balance fetch failed');
  });
});
