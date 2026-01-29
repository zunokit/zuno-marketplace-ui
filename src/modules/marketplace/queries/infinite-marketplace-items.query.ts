/**
 * Infinite marketplace items query options
 * Follows TanStack Query v5 queryOptions pattern for type safety
 */

import { infiniteQueryOptions } from '@tanstack/react-query';
import type {
  InfiniteData,
} from '@tanstack/react-query';
import type {
  MarketplaceItemsPage,
  MarketplaceItemsQueryParams,
  InfiniteMarketplaceItemsOptions,
  MarketplaceFilters,
} from './types';
import { mockFetchMarketplaceItems, USE_MOCK_ADAPTER } from './mock-adapter';

/**
 * Real API fetcher (to be implemented when backend is ready)
 * Placeholder for future implementation
 */
async function realFetchMarketplaceItems(params: MarketplaceItemsQueryParams): Promise<MarketplaceItemsPage> {
  // TODO: Implement real API call
  const response = await fetch(`/api/marketplace/${params.contractAddress}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch marketplace items: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Query options for infinite marketplace items
 *
 * @example
 * ```typescript
 * const { data, fetchNextPage, hasNextPage } = useInfiniteQuery(
 *   infiniteMarketplaceItemsOptions({
 *     contractAddress: '0x123...',
 *     filters: { priceRange: [0, 1], status: 'all', sortBy: 'recent', selectedTraits: [] }
 *   })
 * )
 * ```
 */
export function infiniteMarketplaceItemsOptions({
  contractAddress,
  filters,
  enabled = true,
}: InfiniteMarketplaceItemsOptions) {
  // Build query parameters
  const queryParams: MarketplaceItemsQueryParams = {
    contractAddress,
    cursor: null, // Will be set by queryFn via pageParam
    limit: 16,
    priceRange: filters.priceRange,
    status: filters.status,
    sortBy: filters.sortBy,
    search: filters.search,
    selectedTraits: filters.selectedTraits,
  };

  return infiniteQueryOptions({
    // REQUIRED in v5: Initial page parameter
    initialPageParam: null as string | null,

    // Query key - includes filters for auto-invalidation
    queryKey: [
      'marketplace',
      'infinite',
      contractAddress,
      {
        priceRange: filters.priceRange,
        status: filters.status,
        sortBy: filters.sortBy,
        search: filters.search,
        selectedTraits: filters.selectedTraits,
      },
    ] as const,

    // Query function
    queryFn: async ({ pageParam }) => {
      // Update cursor in params
      const params = { ...queryParams, cursor: pageParam };

      // Use mock or real API
      const data = USE_MOCK_ADAPTER
        ? await mockFetchMarketplaceItems({ queryKey: ['marketplace', 'infinite', contractAddress, params] as const })
        : await realFetchMarketplaceItems(params);

      return data;
    },

    // Extract next cursor from response
    getNextPageParam: (lastPage: MarketplaceItemsPage) => {
      return lastPage.hasMore ? lastPage.nextCursor : undefined;
    },

    // Memory management: Keep only last 10 pages
    maxPages: 10,

    // Aggressive caching to reduce refetches
    staleTime: 15_000, // 15 seconds
    gcTime: 5 * 60_000, // 5 minutes (formerly cacheTime)

    // Query enabled state
    enabled,

    // Retry configuration
    retry: 1,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30_000),

    // Refetch on window focus (disabled to prevent unnecessary refetches)
    refetchOnWindowFocus: false,

    // Refetch on mount (use cache if fresh)
    refetchOnMount: 'always',
  });
}

/**
 * Type export for hook result inference
 */
export type InfiniteMarketplaceItemsResult = InfiniteData<MarketplaceItemsPage>;
