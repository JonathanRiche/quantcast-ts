import { QuantcastClient } from '../../index';
import { getConfig, formatOutput, logError } from '../utils';
import type { CommandOptions } from '../types';

export async function listCampaigns(accountId?: string, options: CommandOptions = {}): Promise<void> {
  try {
    const config = getConfig();
    const client = new QuantcastClient({ credentials: config });

    if (accountId) {
      console.log(`Fetching campaigns for account ${accountId}...`);
      const campaigns = await client.getCampaignsWithAdsets(accountId, {
        campaignLimit: 50,
        adsetLimit: 0 // Don't fetch adsets for list view
      });

      const formattedData = campaigns.edges.map((campaign: any) => ({
        id: campaign.id,
        name: campaign.name
      }));

      console.log(`Found ${campaigns.edges.length} campaigns:\n`);
      console.log(formatOutput(formattedData, options.format));
    } else {
      console.log('Fetching all campaigns...');
      const campaigns = await client.getCampaigns({ limit: 50 });

      const formattedData = campaigns.edges.map(campaign => ({
        id: campaign.id,
        name: campaign.name
      }));

      console.log(`Found ${campaigns.totalCount} campaigns:\n`);
      console.log(formatOutput(formattedData, options.format));
    }

  } catch (error) {
    logError(error);
    process.exit(1);
  }
}

export async function getCampaign(campaignId: string, options: CommandOptions = {}): Promise<void> {
  try {
    const config = getConfig();
    const client = new QuantcastClient({ credentials: config });

    console.log(`Fetching campaign ${campaignId}...`);
    const campaign = await client.getCampaignById(campaignId);

    if (!campaign) {
      console.log(`Campaign ${campaignId} not found`);
      return;
    }

    console.log(formatOutput(campaign, options.format));

  } catch (error) {
    logError(error);
    process.exit(1);
  }
}

export async function getCampaignsWithAdsets(accountId: string, options: CommandOptions = {}): Promise<void> {
  try {
    const config = getConfig();
    const client = new QuantcastClient({ credentials: config });

    console.log(`Fetching campaigns with adsets for account ${accountId}...`);
    const campaigns = await client.getCampaignsWithAdsets(accountId, {
      campaignLimit: 10,
      adsetLimit: 5
    });

    const formattedData = campaigns.edges.map((campaign: any) => ({
      id: campaign.id,
      name: campaign.name,
      adsets: campaign.adsets.edges.map((adset: any) => ({
        id: adset.id,
        name: adset.name
      }))
    }));

    console.log(formatOutput(formattedData, options.format));

  } catch (error) {
    logError(error);
    process.exit(1);
  }
}