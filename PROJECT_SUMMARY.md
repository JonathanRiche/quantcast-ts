# Quantcast GraphQL API TypeScript Library & CLI

## 🚀 **Project Overview**

A complete TypeScript library and CLI for the Quantcast GraphQL API, built with Bun for optimal performance and developer experience.

## ✅ **Features**

### **📚 Core Library**
- **OAuth2 Authentication** - Automatic token management with refresh capability
- **GraphQL Client** - Fetch-based implementation with retry logic and error handling
- **Complete API Coverage** - All Quantcast GraphQL operations supported
- **TypeScript Types** - Full type safety with comprehensive definitions
- **Rate Limiting** - Built-in handling of Quantcast's 10K requests/min and complexity limits
- **Error Handling** - Specific error types for different failure scenarios

### **🖥️ CLI Tool**
- **Pure TypeScript** - No JavaScript compilation required, runs directly with Bun
- **Simple Commands** - Easy-to-use interface for common operations
- **Account Management** - List accounts, get account details
- **Campaign Operations** - View campaigns and campaign details
- **Reporting** - Generate metrics reports, view available breakdowns/metrics
- **Environment-based Auth** - Uses QUANTCAST_API_KEY and QUANTCAST_API_SECRET

### **🧪 Bun Integration**
- **Bun Testing** - Tests use Bun's built-in test runner
- **Bun Bundling** - Library built with Bun's bundler (2ms build time!)
- **Native TypeScript** - No separate compilation step needed
- **Zero Dependencies** - Pure fetch implementation, no external HTTP libraries

## 📁 **Project Structure**

```
src/
├── auth/           # OAuth2 authentication
├── client/         # GraphQL client implementation  
├── errors/         # Custom error types
├── queries/        # Pre-built GraphQL queries
├── types/          # TypeScript type definitions
├── cli/            # CLI implementation (pure TypeScript)
└── index.ts        # Main library export

tests/              # Bun test suite
examples/           # Usage examples
```

## 🔧 **Available Commands**

```bash
# Development
bun install         # Install dependencies
bun run build       # Build library (2ms with Bun!)
bun test            # Run test suite
bun test --watch    # Watch mode testing

# CLI Usage
bun src/cli/index.ts accounts                    # List accounts
bun src/cli/index.ts campaigns 123456           # Get campaigns
bun src/cli/index.ts report 123456              # Generate report
```

## 📚 **Library Usage**

```typescript
import { QuantcastClient } from 'quantcast-graphql-api';

const client = new QuantcastClient({
  credentials: {
    apiKey: 'your-api-key',
    apiSecret: 'your-api-secret'
  }
});

// Get accounts
const accounts = await client.getAccounts();

// Generate metrics report
const report = await client.getAccountMetricsReport({
  accountId: 123456,
  startDate: '2024-01-01',
  endDate: '2024-02-01',
  metrics: ['Impressions', 'Budget Delivered'],
  breakdowns: ['Campaign Name']
});
```

## 🖥️ **CLI Usage**

```bash
# Set credentials
export QUANTCAST_API_KEY="your-key"
export QUANTCAST_API_SECRET="your-secret"

# Use CLI
bun src/cli/index.ts accounts --format table
bun src/cli/index.ts report 123456 --start-date 2024-01-01
```

## 🎯 **Key Benefits**

1. **⚡ Fast Development** - Bun's 2ms build times vs traditional TypeScript compilation
2. **🛡️ Type Safety** - Complete TypeScript coverage for all API operations  
3. **📦 Zero Dependencies** - Pure fetch implementation, no external HTTP libraries
4. **🔧 CLI Ready** - TypeScript CLI that runs directly without compilation
5. **🧪 Modern Testing** - Bun's built-in test runner, no Jest dependencies
6. **📊 Complete Coverage** - All Quantcast GraphQL API functionality supported

## 🎉 **Ready for Production**

- Full API coverage for Quantcast GraphQL endpoints
- Comprehensive error handling and retry logic
- Rate limiting with automatic token refresh
- Well-tested with Bun's test framework
- Complete TypeScript definitions
- CLI tool for quick operations
- Documentation and examples included

The library provides both programmatic and command-line interfaces to all Quantcast GraphQL API functionality in a modern, fast, and type-safe package.