import { QuantcastClient } from '../../index';
import { getConfig, formatOutput, logError, validateDateFormat } from '../utils';
import type { ReportOptions } from '../types';

export async function getAvailableMetrics(accountId: string, options: ReportOptions = {}): Promise<void> {
  try {
    const config = getConfig();
    const client = new QuantcastClient({ credentials: config });

    console.log(`Fetching available metrics and breakdowns for account ${accountId}...`);
    const available = await client.getAvailableBreakdownsAndMetrics({
      accountId: Number(accountId)
    });

    const formattedData = {
      breakdowns: available.breakdowns.map(b => b.name),
      metrics: available.metrics.map(m => m.name)
    };

    console.log(formatOutput(formattedData, options.format));

  } catch (error) {
    logError(error);
    process.exit(1);
  }
}

export async function generateReport(accountId: string, options: ReportOptions = {}): Promise<void> {
  try {
    const config = getConfig();
    const client = new QuantcastClient({ credentials: config });

    // Default values
    const startDate = options.startDate || '2024-01-01';
    const endDate = options.endDate || '2024-01-31';
    const timezone = options.timezone || 'UTC';
    let metrics = options.metrics || ['Impressions'];
    const breakdowns = options.breakdowns || ['Campaign Name'];

    // Handle "ALL" metrics option
    if (metrics.length === 1 && metrics[0]!.toUpperCase() === 'ALL') {
      console.log(`Fetching all available metrics for account ${accountId}...`);
      const available = await client.getAvailableBreakdownsAndMetrics({
        accountId: Number(accountId)
      });
      metrics = available.metrics.map(m => m.name);
      console.log(`Found ${metrics.length} available metrics`);
    }

    // Validate dates
    if (!validateDateFormat(startDate)) {
      throw new Error(`Invalid start date format: ${startDate}. Use YYYY-MM-DD format.`);
    }
    if (!validateDateFormat(endDate)) {
      throw new Error(`Invalid end date format: ${endDate}. Use YYYY-MM-DD format.`);
    }

    console.log(`Generating report for account ${accountId}...`);
    console.log(`Date range: ${startDate} to ${endDate}`);
    console.log(`Metrics: ${metrics.join(', ')}`);
    console.log(`Breakdowns: ${breakdowns.join(', ')}`);

    const report = await client.getAccountMetricsReport({
      accountId: Number(accountId),
      startDate,
      endDate,
      timezone,
      metrics,
      breakdowns,
      filters: options.filters
    });

    if (report.length === 0) {
      console.log('No data found for the specified parameters');
      return;
    }

    console.log(`\nReport (${report.length} rows):\n`);
    
    // Format report data for better display
    const formattedReport = report.map(row => {
      const result: Record<string, any> = {};
      
      // Add breakdowns
      row.breakdowns.forEach(breakdown => {
        result[breakdown.key] = breakdown.value;
      });
      
      // Add metrics
      row.metrics.forEach(metric => {
        result[metric.key] = metric.value;
      });
      
      return result;
    });

    console.log(formatOutput(formattedReport, options.format));

  } catch (error) {
    logError(error);
    process.exit(1);
  }
}

export async function generateAsyncReport(accountId: string, options: ReportOptions = {}): Promise<void> {
  try {
    const config = getConfig();
    const client = new QuantcastClient({ credentials: config });

    const startDate = options.startDate || '2024-01-01';
    const endDate = options.endDate || '2024-03-31';
    let metrics = options.metrics || ['Impressions'];
    const breakdowns = options.breakdowns || ['Campaign Name'];

    // Handle "ALL" metrics option
    if (metrics.length === 1 && metrics[0]!.toUpperCase() === 'ALL') {
      console.log(`Fetching all available metrics for account ${accountId}...`);
      const available = await client.getAvailableBreakdownsAndMetrics({
        accountId: Number(accountId)
      });
      metrics = available.metrics.map(m => m.name);
      console.log(`Found ${metrics.length} available metrics`);
    }

    console.log(`Requesting async report for account ${accountId}...`);
    
    const request = await client.requestAsyncMetricsReport({
      metricsReportRequest: {
        entity: { id: Number(accountId), type: 'ACCOUNT' },
        dateRange: {
          absoluteDateRange: { startDate, endDate }
        },
        metrics,
        breakdowns,
        filters: options.filters
      },
      fileName: `Report_${accountId}_${Date.now()}`
    });

    console.log(`Report requested with ID: ${request.reportRequestId}`);
    console.log(`Status: ${request.status}\n`);

    // Poll for completion
    console.log('Polling for completion...');
    let attempts = 0;
    const maxAttempts = 30; // 5 minutes max

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
      
      const downloadInfo = await client.getAsyncMetricsReportDownloadURL({
        entity: { id: Number(accountId), type: 'ACCOUNT' },
        reportRequestId: request.reportRequestId
      });

      console.log(`Check ${attempts + 1}: Status is ${downloadInfo.status}`);

      if (downloadInfo.status === 'COMPLETED') {
        console.log('\n✅ Report is ready!');
        console.log(`Download URL: ${downloadInfo.downloadUrl}`);
        return;
      } else if (downloadInfo.status === 'FAILED') {
        console.log('\n❌ Report generation failed');
        return;
      } else if (downloadInfo.status === 'TIMEOUT') {
        console.log('\n⏰ Report generation timed out');
        return;
      }

      attempts++;
    }

    console.log('\n⏰ Stopped polling after maximum attempts. Check status manually.');

  } catch (error) {
    logError(error);
    process.exit(1);
  }
}