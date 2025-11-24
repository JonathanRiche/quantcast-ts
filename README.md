# Quantcast GraphQL API TypeScript Library & CLI

A comprehensive TypeScript library and CLI tool for interacting with the Quantcast GraphQL API. This package provides type-safe access to Quantcast's advertising platform, including account management, campaign operations, and reporting functionality.

## Features

- 🔐 **OAuth2 Authentication** - Automatic token management and refresh
- 📊 **Complete API Coverage** - Support for all Quantcast GraphQL operations
- 🛡️ **Type Safety** - Full TypeScript support with comprehensive type definitions
- 🔄 **Rate Limiting** - Built-in rate limit handling and monitoring
- 🚀 **Retry Logic** - Automatic retry for transient failures
- 📈 **Reporting** - Sync and async metrics reporting capabilities
- 🖥️ **CLI Tool** - Command-line interface for quick operations
- 🧪 **Well Tested** - Comprehensive test coverage with Bun

## Installation

```bash
npm install quantcast-ts
# or
bun add quantcast-ts
```

## CLI Installation

After installing the package, you can use the CLI tools:

```bash
# If installed globally
quantcast-cli accounts

# If installed locally
npx quantcast-cli accounts

# With bun
bun quantcast-cli accounts
```

## Quick Start

```typescript
import { QuantcastClient } from 'quantcast-ts';

// Initialize the client with your API credentials
const client = new QuantcastClient({
  credentials: {
    apiKey: 'your-api-key',
    apiSecret: 'your-api-secret'
  }
});

// Get all accounts
const accounts = await client.getAccounts();
console.log('Accounts:', accounts.edges);

// Get campaigns for a specific account
const campaigns = await client.getCampaignsWithAdsets('123456', {
  campaignLimit: 10,
  adsetLimit: 5
});
```

## Authentication

First, obtain your API credentials from the Quantcast Platform:

1. Click the Profile icon at the top right
2. Select "My Profile"
3. In the API Key section, click "Create API Key"
4. Save your Key and Secret securely

```typescript
const credentials = {
  apiKey: 'your-api-key-here',
  apiSecret: 'your-api-secret-here'
};

const client = new QuantcastClient({ credentials });
```

## API Reference

### Account Operations

```typescript
// Get all accounts
const accounts = await client.getAccounts({
  limit: 10,
  offset: 0,
  filter: { name: { contains: 'test' } }
});

// Get specific account by ID
const account = await client.getAccountById('123456');
```

### Campaign Operations

```typescript
// Get campaigns
const campaigns = await client.getCampaigns({
  limit: 20,
  filter: { accountId: { eq: '123456' } }
});

// Get campaigns with their adsets
const campaignsWithAdsets = await client.getCampaignsWithAdsets('123456', {
  campaignLimit: 10,
  adsetLimit: 5
});

// Get specific campaign
const campaign = await client.getCampaignById('789012');
```

### Reporting Operations

#### Available Metrics and Breakdowns

```typescript
// Get available breakdowns and metrics for an account
const available = await client.getAvailableBreakdownsAndMetrics({
  accountId: 123456
});

console.log('Available breakdowns:', available.breakdowns);
console.log('Available metrics:', available.metrics);
```

#### Synchronous Metrics Report

```typescript
const report = await client.getAccountMetricsReport({
  accountId: 123456,
  startDate: '2024-01-01',
  endDate: '2024-02-01',
  timezone: 'America/New_York',
  filters: [
    { breakdown: 'Device Type', values: ['Desktop'] },
    { breakdown: 'Channel', values: ['Web'] }
  ],
  breakdowns: ['Campaign Name', 'Device Type', 'Channel'],
  metrics: ['Impressions', 'Budget Delivered']
});

console.log('Report data:', report);
```

## CLI Usage

The package includes a command-line interface for quick operations:

### Authentication

Set your API credentials as environment variables:

```bash
export QUANTCAST_API_KEY="your-api-key"
export QUANTCAST_API_SECRET="your-api-secret"
```

### Available Commands

```bash
# List all accounts
quantcast-cli accounts

# Get specific account details
quantcast-cli account 123456

# List campaigns for an account
quantcast-cli campaigns 123456

# Get specific campaign details
quantcast-cli campaign 789012

# Get available metrics and breakdowns
quantcast-cli metrics 123456

# Generate a sample metrics report
quantcast-cli report 123456
```

### CLI Examples

```bash
# List your accounts
$ quantcast-cli accounts
🔍 Fetching accounts...

📊 Found 3 accounts:

1. My Company (ID: 123456)
2. Client Account (ID: 789012) 
3. Test Account (ID: 345678)

# Get available metrics for reporting
$ quantcast-cli metrics 123456
🔍 Fetching available metrics and breakdowns for account 123456...

📊 Available Breakdowns (25):
1. Campaign Name
2. Device Type  
3. Channel
... and 22 more

📈 Available Metrics (15):
1. Impressions
2. Budget Delivered
3. Clicks
... and 12 more

# Generate a sample report
$ quantcast-cli report 123456  
🔍 Generating sample metrics report for account 123456...

📊 Sample Metrics Report (10 rows):

Row 1:
  Breakdowns: Campaign Name: Summer Campaign, Channel: Web
  Metrics: Impressions: 125000, Budget Delivered: 1500.00

Row 2:
  Breakdowns: Campaign Name: Back to School, Channel: Web  
  Metrics: Impressions: 89000, Budget Delivered: 1200.00

... and 8 more rows
```

#### Asynchronous Metrics Report

For large reports, use the async reporting feature:

```typescript
// Request an async report
const reportRequest = await client.requestAsyncMetricsReport({
  metricsReportRequest: {
    entity: { id: 123456, type: 'ACCOUNT' },
    dateRange: {
      absoluteDateRange: {
        startDate: '2024-01-01',
        endDate: '2024-02-01'
      }
    },
    filters: [{ breakdown: 'Channel', values: ['Web'] }],
    breakdowns: ['Campaign Name'],
    metrics: ['Impressions']
  },
  fileName: 'My Async Report'
});

console.log('Report request ID:', reportRequest.reportRequestId);

// Check status and get download URL
const downloadInfo = await client.getAsyncMetricsReportDownloadURL({
  entity: { id: 123456, type: 'ACCOUNT' },
  reportRequestId: reportRequest.reportRequestId
});

if (downloadInfo.status === 'COMPLETED') {
  console.log('Download URL:', downloadInfo.downloadUrl);
}
```

## Rate Limiting

The library automatically handles Quantcast's rate limits:

- **10,000 requests per minute**
- **10,000 complexity tokens per minute**

You can monitor your rate limit usage:

```typescript
const rateLimitInfo = await client.getRateLimitInfo();
console.log('Remaining requests:', rateLimitInfo?.remainingRequests);
console.log('Remaining complexity:', rateLimitInfo?.remainingComplexity);
```

## Error Handling

The library provides specific error types for different scenarios:

```typescript
import { 
  QuantcastError, 
  AuthenticationError, 
  RateLimitError, 
  GraphQLError,
  NetworkError 
} from 'quantcast-ts';

try {
  const accounts = await client.getAccounts();
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.log('Authentication failed:', error.message);
  } else if (error instanceof RateLimitError) {
    console.log('Rate limit exceeded:', error.message);
    console.log('Reset time:', error.resetTime);
  } else if (error instanceof GraphQLError) {
    console.log('GraphQL errors:', error.errors);
  } else if (error instanceof NetworkError) {
    console.log('Network error:', error.message);
  }
}
```

## Advanced Usage

### Custom GraphQL Queries

For advanced use cases, you can use the low-level GraphQL client directly:

```typescript
import { GraphQLClient, QuantcastOAuth } from 'quantcast-ts';

const auth = new QuantcastOAuth(credentials);
const graphql = new GraphQLClient(auth);

const response = await graphql.query({
  query: `
    query CustomQuery($limit: Int) {
      accounts(limit: $limit) {
        edges {
          id
          name
        }
      }
    }
  `,
  variables: { limit: 5 }
});
```

### Custom Client Configuration

```typescript
const client = new QuantcastClient({
  credentials,
  endpoint: 'https://developers.quantcast.com/api/v2/graphql', // Custom endpoint
  timeout: 30000,      // 30 second timeout
  retryAttempts: 3,    // Retry failed requests 3 times
  retryDelay: 1000     // 1 second delay between retries
});
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## CLI Usage

The library includes a command-line interface that can be compiled into a single executable file:

```bash
# Build CLI executable for current platform
bun run build:cli

# Build for all platforms
bun run build:cli:all

# Use the executable
./quantcast-cli accounts
```

Available CLI commands:
- `accounts` - List all accounts
- `campaigns <accountId>` - List campaigns for account
- `report <accountId>` - Generate metrics report
- `metrics <accountId>` - Get available breakdowns and metrics

## Development

```bash
# Install dependencies
bun install

# Build the library
bun run build

# Build CLI executable
bun run build:cli

# Run tests
bun test

# Run tests in watch mode
bun test --watch

# Build in watch mode
bun run dev

# Use the CLI (TypeScript source)
bun src/cli/index.ts --help
```

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For issues related to this library, please open a GitHub issue.

For Quantcast API support, visit the [Quantcast Developer Documentation](https://developers.quantcast.com/docs/graphql-api/).
