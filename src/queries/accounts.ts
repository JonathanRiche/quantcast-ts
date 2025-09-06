import type { PaginationArgs, AccountsFilterInput, AccountsOrderByInput } from '../types/index.js';
import { ACCOUNT_FIELDS, PAGE_INFO_FIELDS } from './fragments.js';

export interface GetAccountsArgs extends PaginationArgs {
  filter?: AccountsFilterInput;
  order?: AccountsOrderByInput;
}

export const GET_ACCOUNTS_QUERY = `
  query GetAccounts($filter: AccountsFilterInput, $order: AccountsOrderByInput, $limit: Int, $offset: Int) {
    accounts(filter: $filter, order: $order, limit: $limit, offset: $offset) {
      ${PAGE_INFO_FIELDS}
      edges {
        ${ACCOUNT_FIELDS}
      }
    }
  }
`;

export const GET_ACCOUNT_BY_ID_QUERY = `
  query GetAccountById($accountId: Long!) {
    accounts(filter: { id: { eq: $accountId } }, limit: 1) {
      edges {
        ${ACCOUNT_FIELDS}
      }
    }
  }
`;