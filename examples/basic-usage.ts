import { QuantcastClient } from '../src/index.js';

async function basicExample() {
  // Initialize the client with your API credentials
  const client = new QuantcastClient({
    credentials: {
      apiKey: process.env.QUANTCAST_API_KEY!,
      apiSecret: process.env.QUANTCAST_API_SECRET!
    }
  });

  try {
    // Get all accounts accessible to your API key
    console.log('Fetching accounts...');
    const accounts = await client.getAccounts({ limit: 5 });
    
    console.log(`Found ${accounts.totalCount} accounts:`);
    accounts.edges.forEach(account => {
      console.log(`- ${account.id}: ${account.name}`);
    });

    if (accounts.edges.length > 0) {
      const firstAccountId = accounts.edges[0]!.id;
      
      // Get campaigns for the first account
      console.log(`\nFetching campaigns for account ${firstAccountId}...`);
      const campaigns = await client.getCampaignsWithAdsets(firstAccountId, {
        campaignLimit: 3,
        adsetLimit: 2
      });

      console.log(`Found ${campaigns.edges.length} campaigns:`);
      campaigns.edges.forEach((campaign: any) => {
        console.log(`- Campaign: ${campaign.name}`);
        campaign.adsets.edges.forEach((adset: any) => {
          console.log(`  - Adset: ${adset.name}`);
        });
      });

      // Get available metrics and breakdowns
      console.log(`\nFetching available metrics for account ${firstAccountId}...`);
      const available = await client.getAvailableBreakdownsAndMetrics({
        accountId: Number(firstAccountId)
      });

      console.log('Available breakdowns:', available.breakdowns.slice(0, 5).map(b => b.name));
      console.log('Available metrics:', available.metrics.slice(0, 5).map(m => m.name));

      // Check rate limit info
      const rateLimitInfo = await client.getRateLimitInfo();
      if (rateLimitInfo) {
        console.log('\nRate limit info:');
        console.log(`- Remaining requests: ${rateLimitInfo.remainingRequests}`);
        console.log(`- Remaining complexity: ${rateLimitInfo.remainingComplexity}`);
      }

      // Check auth token info
      const authInfo = client.getAuthInfo();
      console.log('\nAuth info:');
      console.log(`- Has token: ${authInfo.hasToken}`);
      console.log(`- Is expired: ${authInfo.isExpired}`);
      console.log(`- Expires at: ${authInfo.expiresAt}`);
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the example
basicExample().catch(console.error);