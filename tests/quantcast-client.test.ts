import { describe, test, beforeEach, expect, mock } from 'bun:test';
import { QuantcastClient } from '../src/quantcast-client';
import type { QuantcastCredentials } from '../src/auth/types';

const mockCredentials: QuantcastCredentials = {
  apiKey: 'test-key',
  apiSecret: 'test-secret'
};

const mockTokenResponse = {
  token_type: 'Bearer' as const,
  expires_in: 3600,
  access_token: 'test-access-token',
  scope: 'api_access read_reports'
};

describe('QuantcastClient', () => {
  let client: QuantcastClient;
  let mockFetch: any;

  beforeEach(() => {
    mockFetch = mock(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockTokenResponse)
    }));
    global.fetch = mockFetch;
    client = new QuantcastClient({ credentials: mockCredentials });
  });

  test('should initialize successfully', () => {
    expect(client).toBeDefined();
  });

  test('should get auth info', () => {
    const authInfo = client.getAuthInfo();
    expect(authInfo.hasToken).toBe(false);
  });
});