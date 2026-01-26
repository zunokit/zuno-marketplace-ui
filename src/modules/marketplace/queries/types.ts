/**
 * Marketplace infinite query types
 * Follows project TypeScript strict mode standards
 */

import { type Nft } from '@/modules/marketplace/types';

/**
 * API Response shape for paginated marketplace items
 * Matches cursor pagination pattern
 * Includes totalCount for ControlBar display
 */
export interface MarketplaceItemsPage {
  items: Nft[];
  nextCursor: string | null;
  hasMore: boolean;
  totalCount?: number;
}

/**
 * Query parameters sent to API
 * Includes pagination and filters
 */
export interface MarketplaceItemsQueryParams {
  contractAddress: string;
  cursor: string | null;
  limit: number;
  priceRange?: [number, number];
  status?: string;
  sortBy?: string;
  search?: string;
  selectedTraits?: string[];
}

/**
 * Options for infinite marketplace items query
 */
export interface InfiniteMarketplaceItemsOptions {
  contractAddress: string;
  filters: MarketplaceFilters;
  enabled?: boolean;
}

/**
 * Filter state from parent component
 * Must match FilterSidebar interface
 */
export interface MarketplaceFilters {
  priceRange: [number, number];
  status: string;
  sortBy: string;
  selectedTraits: string[];
  search?: string;
}
