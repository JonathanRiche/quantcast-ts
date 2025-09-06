import type { Connection, FilterInput, OrderByInput } from './common.js';

// Base types
export interface Account {
  id: string;
  name: string;
  organizationId?: string;
  timezone?: string;
  currency?: string;
  status?: string;
}

export interface Campaign {
  id: string;
  name: string;
  accountId: string;
  status?: string;
  budget?: number;
  startDate?: string;
  endDate?: string;
  objective?: string;
  bidStrategy?: string;
}

export interface Adset {
  id: string;
  name: string;
  campaignId: string;
  status?: string;
  budget?: number;
  bidAmount?: number;
  targetingCriteria?: Record<string, any>;
  schedule?: Record<string, any>;
}

export interface Creative {
  id: string;
  name: string;
  accountId: string;
  type?: string;
  format?: string;
  status?: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  dimensions?: {
    width: number;
    height: number;
  };
}

export interface CreativeAssignment {
  id: string;
  adsetId: string;
  creative: Creative;
  status?: string;
}

export interface Organization {
  id: string;
  name: string;
  status?: string;
  timezone?: string;
}

export interface Member {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  status?: string;
}

// Geographic entities
export interface Country {
  id: string;
  name: string;
  code: string;
}

export interface State {
  id: string;
  name: string;
  countryId: string;
  code: string;
}

export interface City {
  id: string;
  name: string;
  stateId?: string;
  countryId: string;
}

export interface Postcode {
  id: string;
  code: string;
  cityId?: string;
  stateId?: string;
  countryId: string;
}

export interface MetroArea {
  id: string;
  name: string;
  code: string;
  countryId: string;
}

export interface Isp {
  id: string;
  name: string;
  countryId?: string;
}

// Connection types
export interface AccountsConnections extends Connection<Account> {}
export interface CampaignsConnections extends Connection<Campaign> {}
export interface AdsetsConnections extends Connection<Adset> {}
export interface CreativesConnections extends Connection<Creative> {}
export interface CreativeAssignmentsConnections extends Connection<CreativeAssignment> {}
export interface OrganizationsConnections extends Connection<Organization> {}
export interface CountriesConnections extends Connection<Country> {}
export interface StatesConnections extends Connection<State> {}
export interface CitiesConnections extends Connection<City> {}

// Filter input types
export interface AccountsFilterInput {
  id?: FilterInput;
  name?: FilterInput;
  organizationId?: FilterInput;
  status?: FilterInput;
}

export interface CampaignsFilterInput {
  id?: FilterInput;
  name?: FilterInput;
  accountId?: FilterInput;
  status?: FilterInput;
}

export interface AdsetsFilterInput {
  id?: FilterInput;
  name?: FilterInput;
  campaignId?: FilterInput;
  status?: FilterInput;
}

export interface CreativesFilterInput {
  id?: FilterInput;
  name?: FilterInput;
  accountId?: FilterInput;
  type?: FilterInput;
  status?: FilterInput;
}

// Order by input types
export interface AccountsOrderByInput extends OrderByInput {
  ACCOUNTS_NAME?: 'asc' | 'desc';
  ACCOUNTS_ID?: 'asc' | 'desc';
}

export interface CampaignsOrderByInput extends OrderByInput {
  CAMPAIGNS_NAME?: 'asc' | 'desc';
  CAMPAIGNS_ID?: 'asc' | 'desc';
}

export interface AdsetsOrderByInput extends OrderByInput {
  ADSETS_NAME?: 'asc' | 'desc';
  ADSETS_ID?: 'asc' | 'desc';
}