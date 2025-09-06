import { QuantcastOAuth } from './auth/index.js';
import { GraphQLClient } from './client/index.js';
import type { QuantcastCredentials } from './auth/types.js';
import type { GraphQLClientOptions } from './client/index.js';
import type {
  AccountsConnections,
  CampaignsConnections,
  MetricsReportResponseRow,
  AvailableBreakdownsAndMetricsResponse,
  AsyncMetricsReportRecord,
  AsyncMetricsReportDownloadURL,
  AccountMetricsReportArgs,
  AvailableBreakdownsAndMetricsArgs,
  AsyncMetricsReportArgs,
  AsyncMetricsReportDownloadArgs
} from './types/index.js';
import {
  GET_ACCOUNTS_QUERY,
  GET_ACCOUNT_BY_ID_QUERY,
  GET_CAMPAIGNS_QUERY,
  GET_CAMPAIGNS_WITH_ADSETS_QUERY,
  GET_CAMPAIGN_BY_ID_QUERY,
  ACCOUNT_METRICS_REPORT_QUERY,
  AVAILABLE_BREAKDOWNS_AND_METRICS_QUERY,
  ASYNC_METRICS_REPORT_QUERY,
  ASYNC_METRICS_REPORT_DOWNLOAD_URL_QUERY
} from './queries/index.js';

export interface QuantcastClientOptions extends GraphQLClientOptions {
  credentials: QuantcastCredentials;
}

export class QuantcastClient {
  private readonly auth: QuantcastOAuth;
  private readonly graphql: GraphQLClient;

  constructor(options: QuantcastClientOptions) {
    this.auth = new QuantcastOAuth(options.credentials);
    this.graphql = new GraphQLClient(this.auth, options);
  }

  // Account operations
  async getAccounts(args?: {
    limit?: number;
    offset?: number;
    filter?: any;
    order?: any;
  }): Promise<AccountsConnections> {
    const response = await this.graphql.query({
      query: GET_ACCOUNTS_QUERY,
      variables: args ?? {}
    });
    return response.data.accounts;
  }

  async getAccountById(accountId: number | string) {
    const response = await this.graphql.query({
      query: GET_ACCOUNT_BY_ID_QUERY,
      variables: { accountId: Number(accountId) }
    });
    return response.data.accounts.edges[0] ?? null;
  }

  // Campaign operations
  async getCampaigns(args?: {
    limit?: number;
    offset?: number;
    filter?: any;
    order?: any;
  }): Promise<CampaignsConnections> {
    const response = await this.graphql.query({
      query: GET_CAMPAIGNS_QUERY,
      variables: args ?? {}
    });
    return response.data.campaigns;
  }

  async getCampaignsWithAdsets(
    accountId: number | string,
    options?: {
      campaignLimit?: number;
      adsetLimit?: number;
    }
  ) {
    const response = await this.graphql.query({
      query: GET_CAMPAIGNS_WITH_ADSETS_QUERY,
      variables: {
        accountId: Number(accountId),
        campaignLimit: options?.campaignLimit ?? 10,
        adsetLimit: options?.adsetLimit ?? 10
      }
    });
    return response.data.accounts.edges[0]?.campaigns ?? { edges: [] };
  }

  async getCampaignById(campaignId: number | string) {
    const response = await this.graphql.query({
      query: GET_CAMPAIGN_BY_ID_QUERY,
      variables: { campaignId: Number(campaignId) }
    });
    return response.data.campaigns.edges[0] ?? null;
  }

  // Reporting operations
  async getAccountMetricsReport(
    args: AccountMetricsReportArgs
  ): Promise<MetricsReportResponseRow[]> {
    const response = await this.graphql.query({
      query: ACCOUNT_METRICS_REPORT_QUERY,
      variables: args
    });
    return response.data.accountMetricsReport;
  }

  async getAvailableBreakdownsAndMetrics(
    args: AvailableBreakdownsAndMetricsArgs
  ): Promise<AvailableBreakdownsAndMetricsResponse> {
    const response = await this.graphql.query({
      query: AVAILABLE_BREAKDOWNS_AND_METRICS_QUERY,
      variables: args
    });
    return response.data.availableBreakdownsAndMetrics;
  }

  // Async reporting operations
  async requestAsyncMetricsReport(
    args: AsyncMetricsReportArgs
  ): Promise<AsyncMetricsReportRecord> {
    const response = await this.graphql.query({
      query: ASYNC_METRICS_REPORT_QUERY,
      variables: args
    });
    return response.data.asyncMetricsReport;
  }

  async getAsyncMetricsReportDownloadURL(
    args: AsyncMetricsReportDownloadArgs
  ): Promise<AsyncMetricsReportDownloadURL> {
    const response = await this.graphql.query({
      query: ASYNC_METRICS_REPORT_DOWNLOAD_URL_QUERY,
      variables: args
    });
    return response.data.asyncMetricsReportDownloadURL;
  }

  // Utility methods
  async getRateLimitInfo() {
    const response = await this.graphql.query({
      query: GET_ACCOUNTS_QUERY,
      variables: { limit: 1 }
    });
    return this.graphql.getRateLimitInfo(response);
  }

  getAuthInfo() {
    return this.auth.getTokenInfo();
  }

  async refreshAuthToken() {
    return this.auth.refreshToken();
  }
}