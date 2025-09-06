export interface CLIConfig {
  apiKey: string;
  apiSecret: string;
}

export interface CommandOptions {
  format?: 'json' | 'table';
  output?: string;
  verbose?: boolean;
}

export interface ReportOptions extends CommandOptions {
  startDate?: string;
  endDate?: string;
  timezone?: string;
  metrics?: string[];
  breakdowns?: string[];
  filters?: Array<{ breakdown: string; values: string[] }>;
}