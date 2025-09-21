import type { Entity } from './common.js';

export interface MetricsReportResponseRow {
  metrics: Array<{
    key: string;
    value: number | string;
  }>;
  breakdowns: Array<{
    key: string;
    value: string;
  }>;
}

export interface AccountMetricsReportRequestFilterInput {
  breakdown: string;
  values: string[];
}

export interface AvailableBreakdownsAndMetricsResponse {
  breakdowns: Array<{
    name: string;
    description?: string;
  }>;
  metrics: Array<{
    name: string;
    description?: string;
    type?: 'INTEGER' | 'DECIMAL' | 'CURRENCY' | 'PERCENTAGE';
  }>;
}

// Async report types
export interface AsyncMetricsReportRecord {
  status: 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'TIMEOUT';
  reportRequestId: number;
  fileName?: string;
  createdAt?: string;
  completedAt?: string;
}

export interface AsyncMetricsReportDownloadURL {
  status: 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'TIMEOUT';
  downloadUrl: string;
  expiresAt?: string;
}

export interface DateRange {
  startDate: string; // YYYY-MM-DD format
  endDate: string;   // YYYY-MM-DD format
}

export interface AbsoluteDateRange {
  absoluteDateRange: DateRange;
}

export interface MetricsReportRequestInput {
  entity: Entity;
  dateRange: AbsoluteDateRange;
  filters?: Array<{
    breakdown: string;
    values: string[];
  }>;
  breakdowns?: string[];
  metrics: string[];
}

// Report request arguments
export interface AccountMetricsReportArgs {
  accountId: number;
  startDate: string;
  endDate: string;
  timezone?: string;
  filters?: AccountMetricsReportRequestFilterInput[];
  breakdowns?: string[];
  metrics: string[];
}

export interface AsyncMetricsReportArgs {
  metricsReportRequest: MetricsReportRequestInput;
  fileName?: string;
}

export interface AsyncMetricsReportDownloadArgs {
  entity: Entity;
  reportRequestId: number;
}

export interface AvailableBreakdownsAndMetricsArgs {
  accountId: number;
}