export class QuantcastError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly statusCode?: number,
    public readonly originalError?: unknown
  ) {
    super(message);
    this.name = 'QuantcastError';
  }
}

export class AuthenticationError extends QuantcastError {
  constructor(message: string, originalError?: unknown) {
    super(message, 'AUTHENTICATION_ERROR', 401, originalError);
    this.name = 'AuthenticationError';
  }
}

export class RateLimitError extends QuantcastError {
  constructor(
    message: string,
    public readonly resetTime?: string,
    public readonly remainingRequests?: number,
    public readonly remainingComplexity?: number
  ) {
    super(message, 'RATE_LIMIT_ERROR', 429);
    this.name = 'RateLimitError';
  }
}

export class GraphQLError extends QuantcastError {
  constructor(
    message: string,
    public readonly errors: Array<{ message: string; locations?: any; path?: any }>,
    public override readonly statusCode = 400
  ) {
    super(message, 'GRAPHQL_ERROR', statusCode);
    this.name = 'GraphQLError';
  }
}

export class NetworkError extends QuantcastError {
  constructor(message: string, originalError?: unknown) {
    super(message, 'NETWORK_ERROR', undefined, originalError);
    this.name = 'NetworkError';
  }
}