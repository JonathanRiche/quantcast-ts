import type { PaginationArgs, CampaignsFilterInput, CampaignsOrderByInput } from '../types/index.js';
import { CAMPAIGN_FIELDS, ADSET_FIELDS, PAGE_INFO_FIELDS } from './fragments.js';

export interface GetCampaignsArgs extends PaginationArgs {
  filter?: CampaignsFilterInput;
  order?: CampaignsOrderByInput;
}

export const GET_CAMPAIGNS_QUERY = `
  query GetCampaigns($filter: CampaignsFilterInput, $order: CampaignsOrderByInput, $limit: Int, $offset: Int) {
    campaigns(filter: $filter, order: $order, limit: $limit, offset: $offset) {
      ${PAGE_INFO_FIELDS}
      edges {
        ${CAMPAIGN_FIELDS}
      }
    }
  }
`;

export const GET_CAMPAIGNS_WITH_ADSETS_QUERY = `
  query GetCampaignsWithAdsets($accountId: Long!, $campaignLimit: Int, $adsetLimit: Int) {
    accounts(filter: { id: { eq: $accountId } }) {
      edges {
        campaigns(limit: $campaignLimit) {
          edges {
            ${CAMPAIGN_FIELDS}
            adsets(limit: $adsetLimit) {
              edges {
                ${ADSET_FIELDS}
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_CAMPAIGN_BY_ID_QUERY = `
  query GetCampaignById($campaignId: Long!) {
    campaigns(filter: { id: { eq: $campaignId } }, limit: 1) {
      edges {
        ${CAMPAIGN_FIELDS}
      }
    }
  }
`;