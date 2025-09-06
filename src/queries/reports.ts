// Query definitions for reporting operations

export const ACCOUNT_METRICS_REPORT_QUERY = `
  query AccountMetricsReport(
    $accountId: Long!,
    $startDate: Date!,
    $endDate: Date!,
    $timezone: String,
    $filters: [AccountMetricsReportRequest_FilterInput!],
    $breakdowns: [String!],
    $metrics: [String!]!
  ) {
    accountMetricsReport(
      accountId: $accountId,
      startDate: $startDate,
      endDate: $endDate,
      timezone: $timezone,
      filters: $filters,
      breakdowns: $breakdowns,
      metrics: $metrics
    ) {
      metrics {
        key
        value
      }
      breakdowns {
        key
        value
      }
    }
  }
`;

export const AVAILABLE_BREAKDOWNS_AND_METRICS_QUERY = `
  query AvailableBreakdownsAndMetrics($accountId: Long!) {
    availableBreakdownsAndMetrics(accountId: $accountId) {
      breakdowns {
        name
      }
      metrics {
        name
      }
    }
  }
`;

export const ASYNC_METRICS_REPORT_QUERY = `
  query AsyncMetricsReport(
    $metricsReportRequest: MetricsReportRequestInput!,
    $fileName: String
  ) {
    asyncMetricsReport(
      fileName: $fileName,
      metricsReportRequest: $metricsReportRequest
    ) {
      status
      reportRequestId
    }
  }
`;

export const ASYNC_METRICS_REPORT_DOWNLOAD_URL_QUERY = `
  query GetAsyncMetricsReportDownloadURL(
    $entity: EntityInput!,
    $reportRequestId: Long!
  ) {
    asyncMetricsReportDownloadURL(
      reportRequestId: $reportRequestId,
      entity: $entity
    ) {
      status
      downloadUrl
    }
  }
`;