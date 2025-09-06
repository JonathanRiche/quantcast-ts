import { QuantcastClient } from '../../index';
import { getConfig, formatOutput, logError } from '../utils';
import type { CommandOptions } from '../types';

export async function listAccounts(options: CommandOptions = {}): Promise<void> {
  try {
    const config = getConfig();
    const client = new QuantcastClient({ credentials: config });

    console.log('Fetching accounts...');
    const accounts = await client.getAccounts({ limit: 100 });

    const formattedData = accounts.edges.map(account => ({
      id: account.id,
      name: account.name
    }));

    console.log(`Found ${accounts.totalCount} accounts:\n`);
    console.log(formatOutput(formattedData, options.format));

  } catch (error) {
    logError(error);
    process.exit(1);
  }
}

export async function getAccount(accountId: string, options: CommandOptions = {}): Promise<void> {
  try {
    const config = getConfig();
    const client = new QuantcastClient({ credentials: config });

    console.log(`Fetching account ${accountId}...`);
    const account = await client.getAccountById(accountId);

    if (!account) {
      console.log(`Account ${accountId} not found`);
      return;
    }

    console.log(formatOutput(account, options.format));

  } catch (error) {
    logError(error);
    process.exit(1);
  }
}