/**
 * Marketplace queries barrel export
 * Provides clean import path for all query exports
 */

// Query options
export { infiniteMarketplaceItemsOptions } from './infinite-marketplace-items.query';

// Hooks
export {
  useInfiniteMarketplaceItems,
  type UseInfiniteMarketplaceItemsOptions,
  type UseInfiniteMarketplaceItemsResult,
} from './use-infinite-marketplace-items';

// Types
export type {
  MarketplaceItemsPage,
  MarketplaceItemsQueryParams,
  InfiniteMarketplaceItemsOptions,
  MarketplaceFilters,
} from './types';

// Mock adapter (dev only)
export { mockFetchMarketplaceItems, USE_MOCK_ADAPTER } from './mock-adapter';
