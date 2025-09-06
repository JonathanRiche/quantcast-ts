export const ACCOUNT_FIELDS = `
  id
  name
`;

export const CAMPAIGN_FIELDS = `
  id
  name
`;

export const ADSET_FIELDS = `
  id
  name
`;

export const CREATIVE_FIELDS = `
  id
  name
`;

export const CREATIVE_ASSIGNMENT_FIELDS = `
  creative {
    ${CREATIVE_FIELDS}
  }
`;

export const PAGE_INFO_FIELDS = `
  pageInfo {
    hasMore
  }
  totalCount
`;

export const RATE_LIMIT_FIELDS = `
  extensions {
    rateLimit {
      queryComplexityRemaining
      requestRemaining
      queryComplexityResetTime
      queryComplexityLimit
      requestLimit
      requestResetTime
      queryComplexity
    }
  }
`;