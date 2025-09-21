# Quantcast GraphQL API CLI Usage

The CLI is available in two forms:

## Option 1: Single-File Executable (Recommended)

The CLI can be compiled into a single executable file that contains everything needed to run, including the Bun runtime.

### Building the Executable

```bash
# Build for current platform (optimized)
bun run build:cli

# Build for specific platforms
bun run build:cli:linux     # Linux x64
bun run build:cli:windows   # Windows x64  
bun run build:cli:macos     # macOS ARM64
bun run build:cli:all       # All platforms
```

### Using the Executable

1. Set your environment variables:
```bash
export QUANTCAST_API_KEY="your-api-key"
export QUANTCAST_API_SECRET="your-api-secret"
```

2. Run the executable directly:
```bash
./quantcast-cli <command> [options]

# Or on Windows:
./quantcast-cli-windows.exe <command> [options]
```

The executable is completely self-contained and doesn't require Bun, Node.js, or any dependencies to be installed.

## Option 2: Direct TypeScript Execution

For development or when you want to run the TypeScript source directly:

```bash
bun src/cli/index.ts <command> [options]
```

Or use the npm script:
```bash
bun run cli <command> [options]
```

## Available Commands

### List all accounts
```bash
bun src/cli/index.ts accounts
bun src/cli/index.ts accounts --format table
```

### Get specific account
```bash
bun src/cli/index.ts account 123456
```

### List campaigns
```bash
# All campaigns
bun src/cli/index.ts campaigns

# Campaigns for specific account
bun src/cli/index.ts campaigns 123456
```

### Get specific campaign
```bash
bun src/cli/index.ts campaign 789012
```

### Get campaigns with adsets
```bash
bun src/cli/index.ts campaigns-with-adsets 123456
```

### Get available metrics and breakdowns
```bash
bun src/cli/index.ts metrics 123456
```

### Generate metrics report
```bash
# Basic report
bun src/cli/index.ts report 123456

# Custom report with options
bun src/cli/index.ts report 123456 \
  --start-date 2024-01-01 \
  --end-date 2024-01-31 \
  --timezone "America/New_York" \
  --metrics "Impressions,Budget Delivered" \
  --breakdowns "Campaign Name,Device Type" \
  --format table
```

### Generate async report (for large datasets)
```bash
bun src/cli/index.ts async-report 123456 \
  --start-date 2024-01-01 \
  --end-date 2024-03-31 \
  --metrics "Impressions,Budget Delivered" \
  --breakdowns "Campaign Name,Month"
```

### Generate async report with all available metrics
```bash
bun src/cli/index.ts async-report 123456 \
  --start-date 2024-01-01 \
  --end-date 2024-03-31 \
  --metrics "ALL" \
  --breakdowns "Campaign Name"
```

## Output Formats

- `--format json` (default): Pretty-printed JSON
- `--format table`: Simple table format for readability

## Examples

```bash
# Get help
bun src/cli/index.ts --help

# List accounts in table format
bun src/cli/index.ts accounts --format table

# Generate comprehensive report
bun src/cli/index.ts report 123456 \
  --start-date 2024-01-01 \
  --end-date 2024-01-31 \
  --metrics "Impressions,Budget Delivered,CTR" \
  --breakdowns "Campaign Name,Device Type,Channel" \
  --format json > report.json

# Check available metrics before generating report
bun src/cli/index.ts metrics 123456 --format json | jq '.metrics'
```

## Development

The CLI source code is in `src/cli/` and is structured as follows:
- `src/cli/index.ts` - Main CLI entry point and argument parsing
- `src/cli/types.ts` - CLI-specific TypeScript types
- `src/cli/utils.ts` - Utility functions for formatting and validation
- `src/cli/commands/` - Individual command implementations

All files are TypeScript and run directly with Bun without compilation.