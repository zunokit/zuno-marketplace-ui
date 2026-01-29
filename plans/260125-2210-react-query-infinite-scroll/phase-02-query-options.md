---
title: "Phase 02: Implement Query Options Pattern"
description: "Create infiniteMarketplaceItemsOptions with TanStack Query v5 queryOptions pattern"
status: pending
priority: P1
effort: 1.5h
branch: feature/marketplace
tags: [tanstack-query, query-options, infinite-query]
created: 2026-01-25
---

# Phase 02: Implement Query Options Pattern

## Context Links

- **Parent Plan**: [../plan.md](../plan.md)
- **Phase 01**: [./phase-01-setup-structure.md](./phase-01-setup-structure.md) (must complete first)
- **TanStack Query Research**: [./research/researcher-tanstack-query.md](./research/researcher-tanstack-query.md)

## Overview

**Date**: 2026-01-25
**Priority**: P1 (Critical)
**Status**: pending

Implement the `queryOptions` pattern for TanStack Query v5 infinite queries, providing type-safe, reusable query configuration with mock adapter support.

## Key Insights

1. **queryOptions Pattern**: Centralized query definitions enable type inference via `DataTag`
2. **initialPageParam Required**: v5 breaking change - must provide initial page param
3. **Filters in QueryKey**: Essential for automatic cache invalidation on filter change
4. **Mock Adapter Integration**: Seamless swap between mock and real API

## Requirements

### Functional Requirements

- Create `infiniteMarketplaceItemsOptions` using `infiniteQueryOptions()`
- Integrate mock adapter for development
- Support cursor-based pagination (16 items per page)
- Include filters in queryKey for cache invalidation

### Non-Functional Requirements

- Type-safe throughout (DataTag for inference)
- Aggressive caching (15s staleTime, 5min gcTime)
- Memory management (maxPages: 10)
- Follow TanStack Query v5 best practices

## Architecture

### Query Options Structure

```typescript
const infiniteMarketplaceItemsOptions = ({ contractAddress, filters }) =>
  infiniteQueryOptions({
    // Required v5
    initialPageParam: null,

    // Cache invalidation
    queryKey: ["marketplace", "infinite", contractAddress, filters],

    // Fetch function
    queryFn: async ({ queryKey, pageParam }) => {
      // Use mock or real API
    },

    // Cursor extraction
    getNextPageParam: lastPage => lastPage.nextCursor ?? undefined,

    // Memory management
    maxPages: 10,

    // Aggressive caching
    staleTime: 15_000,
    gcTime: 5 * 60_000,
  });
```

### Query Key Schema

```
['marketplace', 'infinite', contractAddress, filters]
│          │            │                  │
│          │            │                  └─ Automatically resets query when changed
│          │            └─ Contract identifier
│          └─ Query type
└─ Module namespace
```

## Related Code Files

### Files to Create

- `src/modules/marketplace/queries/infinite-marketplace-items.query.ts` - Main query options

### Files to Reference

- `src/modules/marketplace/queries/types.ts` - Type definitions (from Phase 01)
- `src/modules/marketplace/queries/mock-adapter.ts` - Mock fetcher (from Phase 01)

## Implementation Steps

### Step 1: Import Dependencies

```typescript
import { infiniteQueryOptions } from "@tanstack/react-query";
import type { InfiniteData } from "@tanstack/react-query";
```

### Step 2: Define Query Options Function

Create `src/modules/marketplace/queries/infinite-marketplace-items.query.ts`:

````typescript
/**
 * Infinite marketplace items query options
 * Follows TanStack Query v5 queryOptions pattern for type safety
 */

import { infiniteQueryOptions } from "@tanstack/react-query";
import type { InfiniteData, InfiniteQueryOptions } from "@tanstack/react-query";
import type {
  MarketplaceItemsPage,
  MarketplaceItemsQueryParams,
  InfiniteMarketplaceItemsOptions,
  MarketplaceFilters,
} from "./types";
import { mockFetchMarketplaceItems, USE_MOCK_ADAPTER } from "./mock-adapter";

/**
 * Real API fetcher (to be implemented when backend is ready)
 * Placeholder for future implementation
 */
async function realFetchMarketplaceItems(
  params: MarketplaceItemsQueryParams
): Promise<MarketplaceItemsPage> {
  // TODO: Implement real API call
  const response = await fetch(`/api/marketplace/${params.contractAddress}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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
      "marketplace",
      "infinite",
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
        ? await mockFetchMarketplaceItems({
            queryKey: ["marketplace", "infinite", contractAddress, params] as const,
          })
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
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30_000),

    // Refetch on window focus (disabled to prevent unnecessary refetches)
    refetchOnWindowFocus: false,

    // Refetch on mount (use cache if fresh)
    refetchOnMount: "always",
  }) as InfiniteQueryOptions<
    MarketplaceItemsPage,
    Error,
    InfiniteData<MarketplaceItemsPage>,
    readonly ["marketplace", "infinite", string, typeof queryParams],
    string | null
  >;
}
````

### Step 3: Verify Type Inference

Create a test type check (can be in a comment):

```typescript
/**
 * Type inference test
 * Uncomment to verify types are working correctly
 *
 * const options = infiniteMarketplaceItemsOptions({
 *   contractAddress: '0x123',
 *   filters: { priceRange: [0, 1], status: 'all', sortBy: 'recent', selectedTraits: [] }
 * })
 *
 * // These should be correctly inferred:
 * type QueryKey = typeof options.queryKey
 * // Expected: readonly ['marketplace', 'infinite', string, MarketplaceItemsQueryParams]
 *
 * type Data = InfiniteData<MarketplaceItemsPage>
 */
```

### Step 4: Update Mock Adapter Export

Ensure mock adapter exports the fetch function properly (from Phase 01).

### Step 5: Build Verification

```bash
# Run TypeScript compiler
pnpm tsc --noEmit

# Build project
pnpm build
```

## Todo List

- [ ] Import `infiniteQueryOptions` from `@tanstack/react-query`
- [ ] Create `infinite-marketplace-items.query.ts` file
- [ ] Define `infiniteMarketplaceItemsOptions` function
- [ ] Implement queryFn with mock adapter integration
- [ ] Configure getNextPageParam for cursor extraction
- [ ] Set aggressive caching (15s staleTime, 5min gcTime)
- [ ] Add maxPages: 10 for memory management
- [ ] Include filters in queryKey for auto-invalidation
- [ ] Add placeholder `realFetchMarketplaceItems` function
- [ ] Run TypeScript compiler to verify types
- [ ] Test build process

## Success Criteria

- [ ] `infiniteMarketplaceItemsOptions` exported from query file
- [ ] Query key includes contract address and all filters
- [ ] `initialPageParam: null` set (v5 requirement)
- [ ] Mock adapter integrated via `USE_MOCK_ADAPTER` flag
- [ ] `getNextPageParam` extracts cursor correctly
- [ ] Cache settings: 15s staleTime, 5min gcTime
- [ ] `maxPages: 10` limits memory usage
- [ ] TypeScript compiler reports zero errors
- [ ] Ready for hook wrapper implementation

## Risk Assessment

| Risk                        | Probability | Impact | Mitigation                               |
| --------------------------- | ----------- | ------ | ---------------------------------------- |
| Type inference failure      | Low         | Medium | Use `as` cast for complex types          |
| Mock adapter not working    | Medium      | High   | Test mock adapter separately             |
| Filter serialization issues | Medium      | Low    | Filters in queryKey must be serializable |
| v5 API mismatch             | Low         | High   | Verify queryOptions signature            |

## Security Considerations

- Validate cursor from API (null check in getNextPageParam)
- Sanitize search query before sending to API
- Ensure filters are serializable for queryKey
- Add error handling for malformed API responses

## Next Steps

After completing this phase:

1. Move to **Phase 03: Hook Wrapper** to create `useInfiniteMarketplaceItems`
2. Query options pattern ready for consumption by hook
3. Mock adapter provides development data

## Notes

- `gcTime` renamed from `cacheTime` in v5
- `initialPageParam` is required in v5 (breaking change)
- Query key structure critical for filter invalidation
- Type inference depends on `as const` in queryKey

## Unresolved Questions

1. Should we include more detailed error messages in queryFn?
2. Do we need retry logic customization for specific error codes?
3. Should `maxPages` be configurable per use case?
