export interface QuantcastCredentials {
  apiKey: string;
  apiSecret: string;
}

export interface AccessTokenResponse {
  token_type: 'Bearer';
  expires_in: number;
  access_token: string;
  scope: string;
}

export interface TokenManager {
  getValidToken(): Promise<string>;
  refreshToken(): Promise<string>;
  isTokenExpired(): boolean;
}