import type { QuantcastCredentials, AccessTokenResponse, TokenManager } from './types.js';

export class QuantcastOAuth implements TokenManager {
  private readonly authUrl = 'https://auth.quantcast.com/oauth2/default/v1/token';
  private readonly credentials: QuantcastCredentials;
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;
  private refreshPromise: Promise<string> | null = null;

  constructor(credentials: QuantcastCredentials) {
    this.credentials = credentials;
  }

  async getValidToken(): Promise<string> {
    if (this.accessToken && !this.isTokenExpired()) {
      return this.accessToken;
    }

    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    return this.refreshToken();
  }

  async refreshToken(): Promise<string> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.fetchNewToken();

    try {
      const token = await this.refreshPromise;
      return token;
    } finally {
      this.refreshPromise = null;
    }
  }

  isTokenExpired(): boolean {
    if (!this.tokenExpiry) {
      return true;
    }

    const now = new Date();
    const bufferTime = 5 * 60 * 1000; // 5 minutes buffer
    return now.getTime() >= (this.tokenExpiry.getTime() - bufferTime);
  }

  private async fetchNewToken(): Promise<string> {
    const { apiKey, apiSecret } = this.credentials;
    const basicAuth = btoa(`${apiKey}:${apiSecret}`);

    const response = await fetch(this.authUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${basicAuth}`
      },
      body: new URLSearchParams({
        'grant_type': 'client_credentials',
        'scope': 'api_access read_reports'
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OAuth authentication failed: ${response.status} ${errorText}`);
    }

    const tokenResponse: AccessTokenResponse = await response.json();

    if (!tokenResponse.access_token) {
      throw new Error('No access token received from OAuth endpoint');
    }

    this.accessToken = tokenResponse.access_token;
    this.tokenExpiry = new Date(Date.now() + (tokenResponse.expires_in * 1000));

    return this.accessToken;
  }

  getTokenInfo() {
    return {
      hasToken: !!this.accessToken,
      isExpired: this.isTokenExpired(),
      expiresAt: this.tokenExpiry?.toISOString() ?? null
    };
  }
}