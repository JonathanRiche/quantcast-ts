import { QuantcastClient, RateLimitError, GraphQLError } from '../src/index.js';

async function reportingExample() {
  const client = new QuantcastClient({
    credentials: {
      apiKey: process.env.QUANTCAST_API_KEY!,
      apiSecret: process.env.QUANTCAST_API_SECRET!
    }
  });

  try {
    // Get the first account
    const accounts = await client.getAccounts({ limit: 1 });
    if (accounts.edges.length === 0) {
      console.log('No accounts found');
      return;
    }

    const accountId = Number(accounts.edges[0]!.id);
    console.log(`Using account ID: ${accountId}`);

    // Get available breakdowns and metrics first
    console.log('\n1. Fetching available breakdowns and metrics...');
    const available = await client.getAvailableBreakdownsAndMetrics({ accountId });
    
    console.log('Available breakdowns:', available.breakdowns.slice(0, 10).map(b => b.name));
    console.log('Available metrics:', available.metrics.slice(0, 10).map(m => m.name));

    // Example 1: Simple metrics report
    console.log('\n2. Generating simple metrics report...');
    const simpleReport = await client.getAccountMetricsReport({
      accountId,
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      timezone: 'America/New_York',
      metrics: ['Impressions', 'Budget Delivered'], // Use actual metric names from available
      breakdowns: ['Campaign Name'] // Use actual breakdown names from available
    });

    console.log(`Report returned ${simpleReport.length} rows`);
    simpleReport.slice(0, 3).forEach((row, index) => {
      console.log(`Row ${index + 1}:`);
      console.log('  Breakdowns:', row.breakdowns.map(b => `${b.key}: ${b.value}`));
      console.log('  Metrics:', row.metrics.map(m => `${m.key}: ${m.value}`));
    });

    // Example 2: Filtered report
    console.log('\n3. Generating filtered metrics report...');
    const filteredReport = await client.getAccountMetricsReport({
      accountId,
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      timezone: 'UTC',
      filters: [
        { breakdown: 'Channel', values: ['Web'] }
      ],
      breakdowns: ['Campaign Name', 'Channel'],
      metrics: ['Impressions']
    });

    console.log(`Filtered report returned ${filteredReport.length} rows`);

    // Example 3: Async report for large data sets
    console.log('\n4. Requesting async metrics report...');
    const asyncRequest = await client.requestAsyncMetricsReport({
      metricsReportRequest: {
        entity: { id: accountId, type: 'ACCOUNT' },
        dateRange: {
          absoluteDateRange: {
            startDate: '2024-01-01',
            endDate: '2024-03-31'
          }
        },
        timezone: 'America/New_York',
        breakdowns: ['Campaign Name', 'Month'],
        metrics: ['Impressions', 'Budget Delivered']
      },
      fileName: 'Q1_2024_Campaign_Report'
    });

    console.log(`Async report requested with ID: ${asyncRequest.reportRequestId}`);
    console.log(`Status: ${asyncRequest.status}`);

    // Poll for completion (in a real app, you might want to implement proper polling)
    console.log('\n5. Checking async report status...');
    let attempts = 0;
    const maxAttempts = 5;
    
    while (attempts < maxAttempts) {
      const downloadInfo = await client.getAsyncMetricsReportDownloadURL({
        entity: { id: accountId, type: 'ACCOUNT' },
        reportRequestId: asyncRequest.reportRequestId
      });

      console.log(`Attempt ${attempts + 1}: Status is ${downloadInfo.status}`);

      if (downloadInfo.status === 'COMPLETED') {
        console.log('✅ Report is ready!');
        console.log(`Download URL: ${downloadInfo.downloadUrl}`);
        break;
      } else if (downloadInfo.status === 'FAILED') {
        console.log('❌ Report generation failed');
        break;
      } else if (downloadInfo.status === 'TIMEOUT') {
        console.log('⏰ Report generation timed out');
        break;
      }

      attempts++;
      if (attempts < maxAttempts) {
        console.log('⏳ Report still in progress, waiting...');
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
      }
    }

    if (attempts >= maxAttempts) {
      console.log('⏰ Stopped polling after maximum attempts');
    }

  } catch (error) {
    if (error instanceof RateLimitError) {
      console.error('Rate limit exceeded:', error.message);
      console.error('Reset time:', error.resetTime);
    } else if (error instanceof GraphQLError) {
      console.error('GraphQL errors:', error.errors);
    } else {
      console.error('Unexpected error:', error);
    }
  }
}

// Run the example
reportingExample().catch(console.error);