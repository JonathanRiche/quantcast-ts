export interface GraphQLResponse<T = any> {
  data?: T;
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: Array<string | number>;
    extensions?: Record<string, any>;
  }>;
  extensions?: {
    rateLimit?: {
      queryComplexityRemaining: number;
      requestRemaining: number;
      queryComplexityResetTime: string;
      queryComplexityLimit: number;
      requestLimit: number;
      requestResetTime: string;
      queryComplexity: number;
    };
  };
}

export interface GraphQLRequest {
  query: string;
  variables?: Record<string, any>;
  operationName?: string;
}

export interface Connection<T> {
  edges: Array<T>;
  pageInfo: {
    hasMore: boolean;
  };
  totalCount: number;
}

export interface FilterInput {
  eq?: any;
  ne?: any;
  in?: any[];
  nin?: any[];
  gt?: any;
  gte?: any;
  lt?: any;
  lte?: any;
  contains?: string;
  startsWith?: string;
  endsWith?: string;
}

export interface OrderByInput {
  asc?: string;
  desc?: string;
}

export interface PaginationArgs {
  limit?: number;
  offset?: number;
}

export type EntityType = 'ACCOUNT' | 'CAMPAIGN' | 'ADSET' | 'CREATIVE';

export interface Entity {
  id: number;
  type: EntityType;
}