# TanStack Query v5: Infinite Queries & Query Options Research Report

**Date**: 2026-01-25
**Researcher**: a89267a
**Context**: Zuno Marketplace UI - Infinite Scroll Implementation
**TanStack Query Version**: 5.90.12

---

## Executive Summary

TanStack Query v5 introduces significant improvements for infinite queries with cursor-based pagination, type-safe query options, and enhanced filter integration. This report provides actionable patterns for implementing infinite scroll in the Zuno Marketplace.

---

## 1. Infinite Queries with useInfiniteQuery

### 1.1 Core Pattern - Cursor-Based Pagination

**Type Signature** (from source):
```typescript
declare function useInfiniteQuery<
  TQueryFnData,
  TError = DefaultError,
  TData = InfiniteData<TQueryFnData>,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = unknown
>(
  options: UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam>,
  queryClient?: QueryClient
): UseInfiniteQueryResult<TData, TError>
```

**Key v5 Changes**:
- **`initialPageParam` is now REQUIRED** (breaking change from v4)
- Generic `TPageParam` for type-safe cursor management
- `InfiniteData<TQueryFnData, TPageParam>` structure includes page params

### 1.2 Proper Implementation Pattern

```typescript
import { useInfiniteQuery } from '@tanstack/react-query'

interface NFTPage {
  items: Nft[]
  nextCursor: string | null
  hasMore: boolean
}

interface NFTQueryParams {
  contractAddress: string
  limit: number
  cursor: string | null
}

const fetchNFTs = async ({
  queryKey,
  pageParam,
}: {
  queryKey: readonly ['nfts', string, NFTQueryParams]
  pageParam: string | null
}): Promise<NFTPage> => {
  const [, contractAddress, params] = queryKey
  const response = await fetch(`/api/nfts/${contractAddress}`, {
    method: 'POST',
    body: JSON.stringify({
      ...params,
      cursor: pageParam,
    }),
  })
  return response.json()
}

export function useInfiniteNFTs(
  contractAddress: string,
  filters: MarketplaceFilter,
  options?: { enabled?: boolean }
) {
  return useInfiniteQuery({
    // Required v5: initialPageParam
    initialPageParam: null as string | null,

    queryKey: ['nfts', contractAddress, filters] as const,

    queryFn: fetchNFTs,

    // Extract next cursor from response
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.nextCursor : undefined
    },

    // Optional: for bi-directional pagination
    getPreviousPageParam: (firstPage) => {
      return firstPage.prevCursor
    },

    // Optional: limit cached pages (memory management)
    maxPages: 10,

    ...options,
  })
}
```

### 1.3 Race Condition Prevention

**Problem**: Multiple rapid fetchNextPage() calls can cause race conditions.

**Solution 1 - Track fetching state**:
```typescript
const { fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({...})

const handleLoadMore = useCallback(() => {
  if (hasNextPage && !isFetchingNextPage) {
    fetchNextPage()
  }
}, [hasNextPage, isFetchingNextPage, fetchNextPage])
```

**Solution 2 - Use fetchNextPage's return Promise**:
```typescript
const [isLoadingMore, setIsLoadingMore] = useState(false)

const loadMore = async () => {
  if (isLoadingMore || !hasNextPage) return

  setIsLoadingMore(true)
  try {
    await fetchNextPage()
  } finally {
    setIsLoadingMore(false)
  }
}
```

**Solution 3 - Debounce intersection callbacks**:
```typescript
const observerCallback = useCallback((entries: IntersectionObserverEntry[]) => {
  const [entry] = entries
  if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
    // Add small delay to prevent rapid triggers
    setTimeout(() => fetchNextPage(), 100)
  }
}, [hasNextPage, isFetchingNextPage, fetchNextPage])
```

---

## 2. Query Options Pattern

### 2.1 Type-Safe Query Definition

**Using `queryOptions()` helper** (from source):
```typescript
type UndefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey> =
  UseQueryOptions<TQueryFnData, TError, TData, TQueryKey> & {
    initialData?: undefined
  }

declare function queryOptions<TQueryFnData, TError, TData, TQueryKey>(
  options: UndefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>
): UndefinedInitialDataOptions<...> & {
  queryKey: DataTag<TQueryKey, TQueryFnData, TError>
}
```

**Key Benefit**: `DataTag` links queryKey to data type for type inference.

### 2.2 Reusable Infinite Query Options

```typescript
// src/modules/marketplace/queries/use-infinite-nfts.ts
import { infiniteQueryOptions } from '@tanstack/react-query'

interface InfiniteNFTsOptions {
  contractAddress: string
  filters: MarketplaceFilter
  enabled?: boolean
}

export const infiniteNFTsOptions = ({
  contractAddress,
  filters,
  enabled = true,
}: InfiniteNFTsOptions) =>
  infiniteQueryOptions({
    initialPageParam: null as string | null,

    queryKey: ['nfts', 'infinite', contractAddress, filters] as const,

    queryFn: async ({ queryKey, pageParam }) => {
      const [, , address, params] = queryKey
      const response = await fetch(`/api/nfts/${address}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...params,
          cursor: pageParam,
          limit: 20,
        }),
      })
      if (!response.ok) throw new Error('Failed to fetch NFTs')
      return response.json()
    },

    getNextPageParam: (lastPage: NFTPage) => {
      return lastPage.hasMore ? lastPage.nextCursor : undefined
    },

    maxPages: 10,
    enabled,
    staleTime: 30_000, // 30 seconds
  })

// Usage in component
export function useNFTList(contractAddress: string, filters: MarketplaceFilter) {
  return useInfiniteQuery(infiniteNFTsOptions({ contractAddress, filters }))
}
```

### 2.3 Type Safety Benefits

**Query result types are automatically inferred**:
```typescript
const { data } = useInfiniteQuery(infiniteNFTsOptions({...}))

// Type is: InfiniteData<NFTPage> | undefined
data?.pages // NFTPage[]

// Type inference works with select transform
const { data: flatNFTs } = useInfiniteQuery({
  ...infiniteNFTsOptions({...}),
  select: (data) => ({
    pages: data.pages,
    flatItems: data.pages.flatMap(page => page.items)
  })
})

// flatNFTs.pages: NFTPage[]
// flatNFTs.flatItems: Nft[]
```

### 2.4 Testing with Mock Adapters

**Pattern 1 - Mock queryClient**:
```typescript
// __tests__/queries/use-infinite-nfts.test.tsx
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { infiniteNFTsOptions } from '@/modules/marketplace/queries/use-infinite-nfts'

const mockNFTPage: NFTPage = {
  items: [{ id: '1', name: 'NFT 1', ... }],
  nextCursor: 'cursor-2',
  hasMore: true,
}

const createMockQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
    logger: {
      log: console.log,
      warn: console.warn,
      error: () => {}, // suppress errors in tests
    },
  })

describe('infiniteNFTsOptions', () => {
  it('fetches first page', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: async () => mockNFTPage,
      } as Response)
    )

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={createMockQueryClient()}>
        {children}
      </QueryClientProvider>
    )

    const { result } = renderHook(
      () => useInfiniteQuery(infiniteNFTsOptions({ contractAddress: '0x123', filters: {} })),
      { wrapper }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.pages[0]).toEqual(mockNFTPage)
  })
})
```

**Pattern 2 - MSW integration**:
```typescript
// __tests__/mocks/handlers.ts
import { http, HttpResponse } from 'msw'

export const handlers = [
  http.post('/api/nfts/:contractAddress', async ({ params, request }) => {
    const { cursor } = await request.json()
    return HttpResponse.json<NFTPage>({
      items: generateMockNFTs(20),
      nextCursor: cursor ? `${cursor}-next` : 'first-cursor',
      hasMore: true,
    })
  }),
]
```

---

## 3. Intersection Observer Integration

### 3.1 Best Practice Implementation

```typescript
// src/modules/marketplace/hooks/use-infinite-scroll.ts
import { useEffect, useRef } from 'react'

interface UseInfiniteScrollOptions {
  hasNextPage: boolean | undefined
  isFetchingNextPage: boolean
  fetchNextPage: () => void
  threshold?: number
  rootMargin?: string
  enabled?: boolean
}

export function useInfiniteScroll({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  threshold = 0.1,
  rootMargin = '200px', // Start loading before reaching bottom
  enabled = true,
}: UseInfiniteScrollOptions) {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const triggerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!enabled || !triggerRef.current) return

    // Cleanup previous observer
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    // Create new observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (
          entry.isIntersecting &&
          hasNextPage &&
          !isFetchingNextPage
        ) {
          fetchNextPage()
        }
      },
      {
        threshold,
        rootMargin,
      }
    )

    observerRef.current.observe(triggerRef.current)

    return () => {
      observerRef.current?.disconnect()
    }
  }, [enabled, hasNextPage, isFetchingNextPage, fetchNextPage, threshold, rootMargin])

  return triggerRef
}
```

### 3.2 Usage in Component

```typescript
// src/modules/marketplace/components/NFTGrid.tsx
import { useInfiniteScroll } from '@/modules/marketplace/hooks/use-infinite-scroll'

export function NFTGrid({ contractAddress, filters }: NFTGridProps) {
  const {
    data,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteNFTs(contractAddress, filters)

  const scrollTriggerRef = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    enabled: !error, // Disable scroll on error
  })

  const allNFTs = data?.pages.flatMap(page => page.items) ?? []

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {allNFTs.map(nft => (
        <NFTCard key={nft.id} nft={nft} />
      ))}

      {/* Loading spinner */}
      {isFetchingNextPage && (
        <div className="col-span-full flex justify-center p-4">
          <Spinner />
        </div>
      )}

      {/* Scroll trigger element */}
      <div ref={scrollTriggerRef} className="h-10" />
    </div>
  )
}
```

### 3.3 Performance Optimizations

**1. Throttle scroll events**:
```typescript
const THROTTLE_DELAY = 200
const lastFetchTime = useRef(0)

useEffect(() => {
  const observer = new IntersectionObserver((entries) => {
    const [entry] = entries
    if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
      const now = Date.now()
      if (now - lastFetchTime.current > THROTTLE_DELAY) {
        lastFetchTime.current = now
        fetchNextPage()
      }
    }
  }, { rootMargin: '200px' })
  // ...
}, [hasNextPage, isFetchingNextPage, fetchNextPage])
```

**2. Virtual scrolling for large lists**:
Consider `@tanstack/virtual` for 1000+ items:
```typescript
import { useVirtualizer } from '@tanstack/virtual'

const virtualizer = useVirtualizer({
  count: allNFTs.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 300, // Estimated NFT card height
  overscan: 5, // Render 5 extra items
})
```

**3. Memory management**:
```typescript
// Limit cached pages to prevent memory bloat
maxPages: 10, // Keep only last 10 pages

// Cleanup old data when filters change
useEffect(() => {
  queryClient.removeQueries({ queryKey: ['nfts', 'infinite'] })
}, [filters])
```

---

## 4. Filter Integration

### 4.1 Include Filters in QueryKey

**CRITICAL**: Filters must be in queryKey for proper cache invalidation.

```typescript
interface MarketplaceFilter {
  priceRange?: [number, number]
  status?: string
  sortBy?: string
  search?: string
  selectedTraits?: string[]
}

export function useInfiniteNFTs(
  contractAddress: string,
  filters: MarketplaceFilter
) {
  return useInfiniteQuery({
    // ✅ Filters in queryKey - triggers refetch on change
    queryKey: ['nfts', 'infinite', contractAddress, filters] as const,

    queryFn: async ({ queryKey, pageParam }) => {
      const [, , , params] = queryKey
      // Filters are available in queryKey, no need to pass separately
      const response = await fetchNFTsFromAPI(contractAddress, {
        ...params,
        cursor: pageParam,
      })
      return response
    },

    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  })
}
```

### 4.2 Filter Change Behavior

**Automatic reset behavior** (recommended):
```typescript
// When filters change, query automatically:
// 1. Invalidates cache (queryKey changed)
// 2. Resets to page 1
// 3. Fetches fresh data

function Marketplace() {
  const [filters, setFilters] = useState<MarketplaceFilter>({})

  const { data, fetchNextPage } = useInfiniteNFTs(contractAddress, filters)

  // ✅ This triggers fresh fetch from page 1
  const handlePriceChange = (range: [number, number]) => {
    setFilters(prev => ({ ...prev, priceRange: range }))
  }
}
```

**Manual reset** (if needed):
```typescript
const queryClient = useQueryClient()

useEffect(() => {
  // Manually reset when filters change
  queryClient.resetQueries({
    queryKey: ['nfts', 'infinite', contractAddress],
  })
}, [filters, contractAddress, queryClient])
```

### 4.3 Server-Side Filter Construction

**Query parameter serialization**:
```typescript
// src/shared/utils/serialize-filters.ts
export function serializeFilters(filters: MarketplaceFilter): URLSearchParams {
  const params = new URLSearchParams()

  if (filters.priceRange) {
    params.set('minPrice', filters.priceRange[0].toString())
    params.set('maxPrice', filters.priceRange[1].toString())
  }

  if (filters.status) {
    params.set('status', filters.status)
  }

  if (filters.sortBy) {
    params.set('sort', filters.sortBy)
  }

  if (filters.search) {
    params.set('search', filters.search)
  }

  if (filters.selectedTraits?.length) {
    params.set('traits', filters.selectedTraits.join(','))
  }

  return params
}

// Usage in queryFn
queryFn: async ({ queryKey, pageParam }) => {
  const [, , contractAddress, filters] = queryKey
  const params = serializeFilters(filters)
  params.set('cursor', pageParam ?? '')
  params.set('limit', '20')

  const response = await fetch(
    `/api/nfts/${contractAddress}?${params.toString()}`
  )
  return response.json()
}
```

### 4.4 Preserve Scroll Position on Filter Change

```typescript
import { useEffect, useRef } from 'react'

function Marketplace() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [filters, setFilters] = useState<MarketplaceFilter>({})
  const scrollPosition = useRef(0)

  const handleFilterChange = (newFilters: MarketplaceFilter) => {
    // Save scroll position
    if (scrollContainerRef.current) {
      scrollPosition.current = scrollContainerRef.current.scrollTop
    }

    setFilters(newFilters)
  }

  useEffect(() => {
    // Restore scroll position after data loads
    if (data?.pages.length && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollPosition.current
    }
  }, [data])

  return (
    <div ref={scrollContainerRef} className="overflow-y-auto">
      <FilterSidebar onChange={handleFilterChange} />
      <NFTGrid {...} />
    </div>
  )
}
```

---

## 5. Current Codebase Analysis

### 5.1 Existing Implementation

**File**: `src/modules/marketplace/hooks/useMyItems.ts`
- **Status**: Mock implementation using useState + useEffect
- **Issue**: Not using TanStack Query, no pagination
- **Action Required**: Migrate to useInfiniteQuery pattern

**File**: `src/modules/marketplace/components/FilterSidebar.tsx`
- **Filters**: priceRange, status, traits, sort (not integrated with query)
- **Issue**: Filter changes don't trigger data refetch
- **Action Required**: Move filter state to parent component, include in queryKey

### 5.2 Migration Path

**Phase 1**: Replace useMyItems with infinite query
```typescript
// Before (current)
export function useMyItems({ contractAddress, address, isConnected }) {
  const [nfts, setNfts] = useState<Nft[]>([])
  const [isLoading, setIsLoading] = useState(true)
  // ... mock implementation
}

// After (proposed)
export function useInfiniteMyItems(
  contractAddress: string,
  filters: MarketplaceFilter,
  options: { enabled?: boolean }
) {
  return useInfiniteQuery(infiniteNFTsOptions({ contractAddress, filters, ...options }))
}
```

**Phase 2**: Integrate filter state in parent
```typescript
// src/modules/marketplace/index.tsx
const [filters, setFilters] = useState<MarketplaceFilter>({
  priceRange: [0.001, 0.1],
  status: 'all',
  sortBy: 'recent',
  selectedTraits: [],
})

const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
  useInfiniteMyItems(contractAddress, filters, {
    enabled: isConnected && !!address,
  })
```

**Phase 3**: Add infinite scroll trigger
```typescript
const scrollTriggerRef = useInfiniteScroll({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
})

// Render trigger at bottom
<div ref={scrollTriggerRef} className="h-10" />
```

---

## 6. Key Recommendations

### 6.1 Immediate Actions

1. **Migrate useMyItems to useInfiniteQuery**
   - Replace useState pattern with useInfiniteQuery
   - Implement initialPageParam (v5 requirement)
   - Add getNextPageParam for cursor extraction

2. **Create reusable query options**
   - Extract infiniteNFTsOptions() to separate file
   - Leverage DataTag for type inference
   - Enable testability through options export

3. **Implement useInfiniteScroll hook**
   - Create Intersection Observer wrapper
   - Add throttling for performance
   - Handle race conditions with fetching state

4. **Integrate filters with queryKey**
   - Move filter state to parent component
   - Include all filter params in queryKey
   - Ensure filter changes trigger cache invalidation

### 6.2 Best Practices

✅ **DO**:
- Always provide `initialPageParam` in v5
- Include filters in queryKey for cache invalidation
- Limit `maxPages` to prevent memory bloat
- Use `isFetchingNextPage` to prevent race conditions
- Extract query options for reusability and testing
- Set `staleTime` to reduce unnecessary refetches

❌ **DON'T**:
- Call fetchNextPage() without checking hasNextPage
- Put filter state inside the query hook (should be external)
- Forget to disconnect IntersectionObserver in cleanup
- Use infinite scroll for small datasets (<50 items)
- Ignore error handling in queryFn

---

## 7. Unresolved Questions

1. **API Backend**:
   - Does the backend support cursor-based pagination?
   - What cursor format does the API use (offset, ID, timestamp)?
   - Are there rate limits to consider for rapid page fetching?

2. **Performance**:
   - What's the expected total number of NFTs per collection?
   - Should we implement virtual scrolling for 1000+ items?
   - What's the target page size (current mock uses 20)?

3. **Filter Behavior**:
   - Should selectedTraits be sent as comma-separated or multiple params?
   - Does the backend support server-side sorting?
   - Are there any expensive filters requiring debouncing?

4. **State Persistence**:
   - Should filters persist across navigation?
   - Do we need to save scroll position in URL/history?
   - Should we implement optimistic updates for better UX?

---

## 8. References

**TanStack Query v5 Documentation** (web access limited - see type definitions):
- `node_modules/@tanstack/react-query/build/modern/useInfiniteQuery.d.ts`
- `node_modules/@tanstack/react-query/build/modern/queryOptions.d.ts`
- `node_modules/@tanstack/react-query/build/modern/infiniteQueryOptions.d.ts`

**Related Source Files**:
- `src/modules/marketplace/hooks/useMyItems.ts` - Current mock implementation
- `src/modules/marketplace/components/FilterSidebar.tsx` - Filter UI
- `src/modules/marketplace/index.tsx` - Parent component (needs migration)
- `src/modules/marketplace/types/index.ts` - Type definitions

**External Resources** (reviewed during research):
- TanStack Query v5 migration guide
- Cursor-based pagination best practices
- Intersection Observer API documentation

---

## Appendix: Type Definitions Reference

### A. InfiniteData Structure
```typescript
interface InfiniteData<TData, TPageParam = unknown> {
  pages: TData[]
  pageParams: TPageParam[]
}
```

### B. UseInfiniteQueryResult
```typescript
interface UseInfiniteQueryResult<TData, TError> {
  data: InfiniteData<TData> | undefined
  error: TError | null
  isLoading: boolean
  isFetchingNextPage: boolean
  hasNextPage: boolean | undefined
  hasPreviousPage: boolean | undefined
  fetchNextPage: (options?: { cancelRefetch?: boolean }) => void
  fetchPreviousPage: (options?: { cancelRefetch?: boolean }) => void
  // ... other properties
}
```

### C. InfiniteQueryOptions
```typescript
interface UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam> {
  queryKey: TQueryKey
  queryFn: QueryFunction<TQueryFnData, TQueryKey, TPageParam>
  initialPageParam: TPageParam
  getNextPageParam: (lastPage: TQueryFnData, allPages: TQueryFnData[]) => TPageParam | undefined
  getPreviousPageParam?: (firstPage: TQueryFnData, allPages: TQueryFnData[]) => TPageParam | undefined
  maxPages?: number
  // ... other query options
}
```

---

**End of Report**

**Next Steps**: Create implementation plan in `E:\zuno-marketplace-ui\plans\260125-2158-react-query-infinite-scroll\plan.md`
