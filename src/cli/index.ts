#!/usr/bin/env bun
import { listAccounts, getAccount } from './commands/accounts';
import { listCampaigns, getCampaign, getCampaignsWithAdsets } from './commands/campaigns';
import { getAvailableMetrics, generateReport, generateAsyncReport } from './commands/metrics';
import type { CommandOptions, ReportOptions } from './types';

function showHelp(): void {
  console.log(`
Quantcast GraphQL API CLI

Usage:
  quantcast-cli <command> [options]

Commands:
  accounts                           List all accounts
  account <id>                      Get specific account by ID
  campaigns [accountId]             List campaigns (optionally filtered by account)
  campaign <id>                     Get specific campaign by ID
  campaigns-with-adsets <accountId> Get campaigns with their adsets for an account
  metrics <accountId>               Get available metrics and breakdowns for account
  report <accountId> [options]      Generate metrics report for account
  async-report <accountId> [options] Generate large async metrics report

Report Options:
  --start-date <date>               Start date (YYYY-MM-DD, default: 2024-01-01)
  --end-date <date>                 End date (YYYY-MM-DD, default: 2024-01-31)
  --timezone <tz>                   Timezone (default: UTC)
  --metrics <metrics>               Comma-separated metrics or "ALL" for all available (default: Impressions)
  --breakdowns <breakdowns>         Comma-separated breakdowns (default: Campaign Name)
  --format <format>                 Output format: json|table (default: json)

General Options:
  --format <format>                 Output format: json|table (default: json)
  --verbose                         Enable verbose logging
  --help, -h                        Show this help

Environment Variables:
  QUANTCAST_API_KEY                 Your Quantcast API key (required)
  QUANTCAST_API_SECRET              Your Quantcast API secret (required)

Examples:
  quantcast-cli accounts
  quantcast-cli account 123456
  quantcast-cli campaigns 123456
  quantcast-cli metrics 123456
  quantcast-cli report 123456 --start-date 2024-01-01 --end-date 2024-01-31
  quantcast-cli async-report 123456 --metrics "Impressions,Budget Delivered" --breakdowns "Campaign Name,Month"
  quantcast-cli async-report 123456 --metrics "ALL" --breakdowns "Campaign Name"
`);
}

function parseArgs(args: string[]): {
  command: string;
  subcommand?: string;
  options: CommandOptions & ReportOptions;
} {
  const options: CommandOptions & ReportOptions = {};
  let command = '';
  let subcommand: string | undefined;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--help' || arg === '-h') {
      showHelp();
      process.exit(0);
    }

    if (arg?.startsWith('--')) {
      const key = arg.slice(2);
      const value = args[i + 1];
      
      switch (key) {
        case 'format':
          if (value) {
            options.format = value as 'json' | 'table';
            i++;
          }
          break;
        case 'start-date':
          if (value) {
            options.startDate = value;
            i++;
          }
          break;
        case 'end-date':
          if (value) {
            options.endDate = value;
            i++;
          }
          break;
        case 'timezone':
          if (value) {
            options.timezone = value;
            i++;
          }
          break;
        case 'metrics':
          if (value) {
            options.metrics = value.split(',').map(m => m.trim());
            i++;
          }
          break;
        case 'breakdowns':
          if (value) {
            options.breakdowns = value.split(',').map(b => b.trim());
            i++;
          }
          break;
        case 'verbose':
          options.verbose = true;
          break;
        default:
          console.error(`Unknown option: ${arg}`);
          process.exit(1);
      }
    } else if (!command && arg) {
      command = arg;
    } else if (!subcommand && arg) {
      subcommand = arg;
    }
  }

  return { command, subcommand, options };
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    showHelp();
    return;
  }

  const { command, subcommand, options } = parseArgs(args);

  try {
    switch (command) {
      case 'accounts':
        await listAccounts(options);
        break;

      case 'account':
        if (!subcommand) {
          console.error('Error: account command requires an account ID');
          process.exit(1);
        }
        await getAccount(subcommand, options);
        break;

      case 'campaigns':
        await listCampaigns(subcommand, options);
        break;

      case 'campaign':
        if (!subcommand) {
          console.error('Error: campaign command requires a campaign ID');
          process.exit(1);
        }
        await getCampaign(subcommand, options);
        break;

      case 'campaigns-with-adsets':
        if (!subcommand) {
          console.error('Error: campaigns-with-adsets command requires an account ID');
          process.exit(1);
        }
        await getCampaignsWithAdsets(subcommand, options);
        break;

      case 'metrics':
        if (!subcommand) {
          console.error('Error: metrics command requires an account ID');
          process.exit(1);
        }
        await getAvailableMetrics(subcommand, options);
        break;

      case 'report':
        if (!subcommand) {
          console.error('Error: report command requires an account ID');
          process.exit(1);
        }
        await generateReport(subcommand, options);
        break;

      case 'async-report':
        if (!subcommand) {
          console.error('Error: async-report command requires an account ID');
          process.exit(1);
        }
        await generateAsyncReport(subcommand, options);
        break;

      default:
        console.error(`Unknown command: ${command}`);
        console.error('Use --help to see available commands');
        process.exit(1);
    }
  } catch (error) {
    console.error('CLI Error:', error);
    process.exit(1);
  }
}

// Only run if this is the main module
if (import.meta.main) {
  main().catch(console.error);
}