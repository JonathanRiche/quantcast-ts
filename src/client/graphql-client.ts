import type { TokenManager } from '../auth/types.js';
import type { GraphQLRequest, GraphQLResponse } from '../types/common.js';
import { QuantcastError, AuthenticationError, RateLimitError, GraphQLError, NetworkError } from '../errors/index.js';

export interface GraphQLClientOptions {
  endpoint?: string;
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
}

export class GraphQLClient {
  private readonly endpoint: string;
  private readonly timeout: number;
  private readonly retryAttempts: number;
  private readonly retryDelay: number;
  private readonly tokenManager: TokenManager;

  constructor(tokenManager: TokenManager, options: GraphQLClientOptions = {}) {
    this.tokenManager = tokenManager;
    this.endpoint = options.endpoint ?? 'https://developers.quantcast.com/api/v2/graphql';
    this.timeout = options.timeout ?? 30000; // 30 seconds
    this.retryAttempts = options.retryAttempts ?? 3;
    this.retryDelay = options.retryDelay ?? 1000; // 1 second
  }

  async query<T = any>(request: GraphQLRequest): Promise<GraphQLResponse<T>> {
    return this.executeWithRetry(request);
  }

  private async executeWithRetry<T>(
    request: GraphQLRequest,
    attempt = 1
  ): Promise<GraphQLResponse<T>> {
    try {
      return await this.execute<T>(request);
    } catch (error) {
      if (attempt < this.retryAttempts && this.shouldRetry(error)) {
        await this.delay(this.retryDelay * attempt);
        return this.executeWithRetry(request, attempt + 1);
      }
      throw error;
    }
  }

  private async execute<T>(request: GraphQLRequest): Promise<GraphQLResponse<T>> {
    const token = await this.tokenManager.getValidToken();
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(request),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        await this.handleHttpError(response);
      }

      const result: GraphQLResponse<T> = await response.json();

      if (result.errors && result.errors.length > 0) {
        throw new GraphQLError(
          `GraphQL errors: ${result.errors.map(e => e.message).join(', ')}`,
          result.errors,
          response.status
        );
      }

      return result;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof QuantcastError) {
        throw error;
      }

      if (error instanceof Error && error.name === 'AbortError') {
        throw new NetworkError(`Request timeout after ${this.timeout}ms`, error);
      }

      throw new NetworkError('Network request failed', error);
    }
  }

  private async handleHttpError(response: Response): Promise<never> {
    const responseText = await response.text();
    
    if (response.status === 401 || response.status === 403) {
      throw new AuthenticationError(
        `Authentication failed: ${response.status} ${responseText}`,
        response
      );
    }

    if (response.status === 429) {
      const resetTime = response.headers.get('X-RateLimit-Reset');
      const remainingRequests = response.headers.get('X-RateLimit-Remaining-Requests');
      const remainingComplexity = response.headers.get('X-RateLimit-Remaining-Complexity');

      throw new RateLimitError(
        `Rate limit exceeded: ${responseText}`,
        resetTime ?? undefined,
        remainingRequests ? parseInt(remainingRequests, 10) : undefined,
        remainingComplexity ? parseInt(remainingComplexity, 10) : undefined
      );
    }

    throw new QuantcastError(
      `HTTP ${response.status}: ${responseText}`,
      'HTTP_ERROR',
      response.status
    );
  }

  private shouldRetry(error: unknown): boolean {
    if (error instanceof AuthenticationError) {
      return false; // Don't retry auth errors
    }
    
    if (error instanceof RateLimitError) {
      return false; // Don't retry rate limit errors
    }

    if (error instanceof GraphQLError) {
      return false; // Don't retry GraphQL errors
    }

    return true; // Retry network and other errors
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getRateLimitInfo(response: GraphQLResponse): {
    complexity: number;
    remainingComplexity: number;
    remainingRequests: number;
    complexityResetTime: string;
    requestResetTime: string;
  } | null {
    const rateLimit = response.extensions?.rateLimit;
    
    if (!rateLimit) {
      return null;
    }

    return {
      complexity: rateLimit.queryComplexity,
      remainingComplexity: rateLimit.queryComplexityRemaining,
      remainingRequests: rateLimit.requestRemaining,
      complexityResetTime: rateLimit.queryComplexityResetTime,
      requestResetTime: rateLimit.requestResetTime
    };
  }
}