---
title: "Phase 03: Create Hook Wrapper"
description: "Implement useInfiniteMarketplaceItems hook as consumer-friendly wrapper"
status: pending
priority: P1
effort: 1h
branch: feature/marketplace
tags: [hook, wrapper, use-infinite-query]
created: 2026-01-25
---

# Phase 03: Create Hook Wrapper

## Context Links

- **Parent Plan**: [../plan.md](../plan.md)
- **Phase 02**: [./phase-02-query-options.md](./phase-02-query-options.md) (must complete first)
- **TanStack Query Research**: [./research/researcher-tanstack-query.md](./research/researcher-tanstack-query.md)

## Overview

**Date**: 2026-01-25
**Priority**: P1 (Critical)
**Status**: pending

Create `useInfiniteMarketplaceItems` hook as a consumer-friendly wrapper around `useInfiniteQuery` with simplified interface and enhanced type safety.

## Key Insights

1. **Hook Wrapper Pattern**: Simplifies query consumption, hides complexity
2. **Type Inference**: Leverages queryOptions DataTag for automatic typing
3. **Default Behavior**: Sensible defaults for common use cases
4. **Flexibility**: Pass-through options for advanced customization

## Requirements

### Functional Requirements

- Export `useInfiniteMarketplaceItems` hook
- Accept contract address and filters as parameters
- Return typed query result (data, hasNextPage, fetchNextPage, etc.)
- Support enabled option for conditional queries
- Flatten data.pages for easier consumption

### Non-Functional Requirements

- Type-safe return values (inferred from queryOptions)
- Follow React hooks rules
- No additional state management (delegate to React Query)
- Clear JSDoc documentation

## Architecture

### Hook Interface

```typescript
interface UseInfiniteMarketplaceItemsResult {
  // Flattened items array
  items: Nft[];

  // Raw infinite query data
  data: InfiniteData<MarketplaceItemsPage> | undefined;

  // Loading states
  isLoading: boolean;
  isFetchingNextPage: boolean;

  // Pagination control
  hasNextPage: boolean | undefined;
  fetchNextPage: () => void;

  // Error handling
  error: Error | null;
  isError: boolean;
}
```

### Hook Implementation Pattern

```typescript
export function useInfiniteMarketplaceItems(
  contractAddress: string,
  filters: MarketplaceFilters,
  options?: { enabled?: boolean }
): UseInfiniteMarketplaceItemsResult {
  const query = useInfiniteQuery(
    infiniteMarketplaceItemsOptions({ contractAddress, filters, ...options })
  );

  // Flatten pages for convenience
  const items = useMemo(() => query.data?.pages.flatMap(page => page.items) ?? [], [query.data]);

  return {
    items,
    ...query,
  };
}
```

## Related Code Files

### Files to Create

- `src/modules/marketplace/queries/use-infinite-marketplace-items.ts` - Hook implementation

### Files to Update

- `src/modules/marketplace/queries/index.ts` - Export hook from barrel

### Files to Reference

- `src/modules/marketplace/queries/infinite-marketplace-items.query.ts` - Query options
- `src/modules/marketplace/hooks/useMyItems.ts` - Old hook to replace

## Implementation Steps

### Step 1: Create Hook File

Create `src/modules/marketplace/queries/use-infinite-marketplace-items.ts`:

````typescript
/**
 * Infinite marketplace items hook
 * Consumer-friendly wrapper for infinite scroll functionality
 */

import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query";
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
export interface UseInfiniteMarketplaceItemsResult extends Omit<
  UseInfiniteQueryResult<MarketplaceItemsPage, Error>,
  "data"
> {
  /**
   * Flattened array of all NFT items across all pages
   */
  items: Nft[];

  /**
   * Raw infinite query data with page structure
   */
  data: InfiniteData<MarketplaceItemsPage> | undefined;
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
  const items = useMemo(
    () => query.data?.pages.flatMap(page => page.items).filter(Boolean) ?? [],
    [query.data]
  );

  return {
    items,
    data: query.data,
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
````

### Step 2: Update Barrel Export

Update `src/modules/marketplace/queries/index.ts`:

```typescript
/**
 * Marketplace queries barrel export
 * Provides clean import path for all query exports
 */

// Query options
export { infiniteMarketplaceItemsOptions } from "./infinite-marketplace-items.query";

// Hooks
export {
  useInfiniteMarketplaceItems,
  type UseInfiniteMarketplaceItemsOptions,
  type UseInfiniteMarketplaceItemsResult,
} from "./use-infinite-marketplace-items";

// Types
export type {
  MarketplaceItemsPage,
  MarketplaceItemsQueryParams,
  InfiniteMarketplaceItemsOptions,
  MarketplaceFilters,
} from "./types";

// Mock adapter (dev only)
export { mockFetchMarketplaceItems, USE_MOCK_ADAPTER } from "./mock-adapter";
```

### Step 3: Verify Exports

Check that exports are accessible:

```typescript
// Should work:
import { useInfiniteMarketplaceItems } from "@/modules/marketplace/queries";

// Should also work:
import {
  useInfiniteMarketplaceItems,
  infiniteMarketplaceItemsOptions,
} from "@/modules/marketplace/queries";
```

### Step 4: TypeScript Verification

```bash
pnpm tsc --noEmit
```

## Todo List

- [ ] Create `use-infinite-marketplace-items.ts` file
- [ ] Import `useInfiniteQuery` from `@tanstack/react-query`
- [ ] Define hook options and result interfaces
- [ ] Implement hook with query options integration
- [ ] Add useMemo to flatten items array
- [ ] Add comprehensive JSDoc documentation
- [ ] Update barrel export to include hook
- [ ] Verify TypeScript compilation
- [ ] Test hook import paths
- [ ] Verify type inference works

## Success Criteria

- [ ] Hook exported from barrel file
- [ ] Returns flattened `items` array for convenience
- [ ] Includes all standard infinite query properties
- [ ] Type-safe return values (inferred from queryOptions)
- [ ] JSDoc documentation complete
- [ ] TypeScript compiler reports zero errors
- [ ] Ready for component integration

## Risk Assessment

| Risk                     | Probability | Impact | Mitigation                        |
| ------------------------ | ----------- | ------ | --------------------------------- |
| Type inference breaks    | Low         | Medium | Use explicit interface for result |
| Memory leak from useMemo | Low         | Low    | Proper dependency array           |
| Hook violates rules      | Very Low    | High   | Follow React hooks patterns       |

## Security Considerations

- No sensitive data in hook parameters
- Filters validated by query options
- Error handling delegated to React Query

## Next Steps

After completing this phase:

1. Move to **Phase 04: Scroll Trigger** to build Intersection Observer component
2. Hook ready for integration in components
3. Can test with mock data in development

## Notes

- Hook wrapper is thin - most logic in query options
- Flattening items in hook simplifies component code
- JSDoc examples guide proper usage
- Type inference from queryOptions is automatic

## Testing Preview

```typescript
// Example test (for Phase 06)
const { result } = renderHook(() => useInfiniteMarketplaceItems("0x123", mockFilters), {
  wrapper: QueryClientProvider,
});

await waitFor(() => expect(result.current.isSuccess).toBe(true));
expect(result.current.items).toHaveLength(16); // First page
```
