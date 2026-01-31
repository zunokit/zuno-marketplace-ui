/**
 * Infinite marketplace items hook
 * Consumer-friendly wrapper for infinite scroll functionality
 */

import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { InfiniteData } from "@tanstack/react-query";
import { infiniteMarketplaceItemsOptions } from "./infinite-marketplace-items.query";
import type { MarketplaceFilters, MarketplaceItemsPage } from "./types";
import type { Nft } from "@/modules/marketplace/types";

/**
 * Hook options
 */
export interface UseInfiniteMarketplaceItemsOptions {
  /**
   * Enable/disable the query
   * Useful for conditional queries (e.g., when wallet is connected)
   */
  enabled?: boolean;
}

/**
 * Hook result with flattened items
 */
export interface UseInfiniteMarketplaceItemsResult {
  /**
   * Flattened array of all NFT items across all pages
   */
  items: Nft[];

  /**
   * Raw infinite query data with page structure
   */
  data: InfiniteData<MarketplaceItemsPage> | undefined;

  // Loading states
  isLoading: boolean;
  isFetchingNextPage: boolean;
  isFetching: boolean;
  isPaused: boolean;

  // Pagination control
  hasNextPage: boolean | undefined;
  hasPreviousPage: boolean | undefined;
  fetchNextPage: () => void;
  fetchPreviousPage: () => void;

  // Error handling
  error: Error | null;
  isError: boolean;
  isRefetchError: boolean;

  // Status
  status: "pending" | "error" | "success";
  isRefetching: boolean;

  // Refetch
  refetch: () => void;
  isFetchingPreviousPage: boolean;
}

/**
 * Hook for fetching infinite marketplace items with cursor pagination
 *
 * @example
 * ```typescript
 * function Marketplace() {
 *   const [filters, setFilters] = useState({
 *     priceRange: [0.001, 0.1],
 *     status: 'all',
 *     sortBy: 'recent',
 *     selectedTraits: [],
 *   })
 *
 *   const { items, fetchNextPage, hasNextPage, isLoading } =
 *     useInfiniteMarketplaceItems(contractAddress, filters, {
 *       enabled: isConnected
 *     })
 *
 *   return (
 *     <NFTGrid
 *       nfts={items}
 *       onLoadMore={() => hasNextPage && fetchNextPage()}
 *       isLoading={isLoading}
 *     />
 *   )
 * }
 * ```
 *
 * @param contractAddress - NFT contract address
 * @param filters - Filter state from parent component
 * @param options - Hook options (enabled, etc.)
 * @returns Infinite query result with flattened items
 */
export function useInfiniteMarketplaceItems(
  contractAddress: string,
  filters: MarketplaceFilters,
  options?: UseInfiniteMarketplaceItemsOptions
): UseInfiniteMarketplaceItemsResult {
  // Get infinite query result
  const query = useInfiniteQuery(
    infiniteMarketplaceItemsOptions({
      contractAddress,
      filters,
      enabled: options?.enabled ?? true,
    })
  );

  // Flatten pages for convenient consumption
  const items = useMemo(() => {
    if (!query.data) return [];
    return query.data.pages
      .flatMap(page => {
        // Type guard to ensure page is MarketplaceItemsPage
        if (!page || typeof page !== "object") return [];
        if (!("items" in page)) return [];
        return (page as MarketplaceItemsPage).items;
      })
      .filter(Boolean);
  }, [query.data]);

  return {
    items,
    data: query.data as InfiniteData<MarketplaceItemsPage> | undefined,
    isLoading: query.isLoading,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    error: query.error,
    isError: query.isError,
    isFetching: query.isFetching,
    isPaused: query.isPaused,
    isRefetchError: query.isRefetchError,
    isRefetching: query.isRefetching,
    refetch: query.refetch,
    status: query.status,
    fetchPreviousPage: query.fetchPreviousPage,
    hasPreviousPage: query.hasPreviousPage,
    isFetchingPreviousPage: query.isFetchingPreviousPage,
  };
}
