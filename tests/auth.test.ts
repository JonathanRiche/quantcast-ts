import { describe, test, beforeEach, expect, mock } from 'bun:test';
import { QuantcastOAuth } from '../src/auth/oauth-client';
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

describe('QuantcastOAuth', () => {
  let oauth: QuantcastOAuth;
  let mockFetch: any;

  beforeEach(() => {
    mockFetch = mock(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockTokenResponse)
    }));
    global.fetch = mockFetch;
    oauth = new QuantcastOAuth(mockCredentials);
  });

  test('should fetch a new token when none exists', async () => {
    const token = await oauth.getValidToken();
    expect(token).toBe('test-access-token');
  });

  test('should return true when no token exists', () => {
    expect(oauth.isTokenExpired()).toBe(true);
  });

  test('should return token info', async () => {
    const infoBefore = oauth.getTokenInfo();
    expect(infoBefore.hasToken).toBe(false);

    await oauth.getValidToken();

    const infoAfter = oauth.getTokenInfo();
    expect(infoAfter.hasToken).toBe(true);
  });
});