# Research Report: Infinite Scroll Implementation Patterns

**Research Date:** 2026-01-25
**Target:** Modern React/TypeScript applications with React Query v5

---

## Executive Summary

Infinite scroll requires careful coordination between Intersection Observer API, React Query's `useInfiniteQuery`, cursor-based pagination APIs, and accessibility considerations. Key findings: Intersection Observer with `threshold: 0.1-0.5` and `rootMargin: "200px-300px"` provides optimal performance; React Query requires proper cleanup and state management to avoid memory leaks; cursor pagination needs stable sorting with composite keys; accessibility demands ARIA live regions and keyboard fallbacks.

---

## Research Methodology

- **Sources consulted:** Industry best practices, React Query documentation patterns
- **Date range:** Current best practices (2024-2025)
- **Key search terms:** Intersection Observer, useInfiniteQuery, cursor pagination, infinite scroll accessibility

---

## Key Findings

### 1. Intersection Observer API Best Practices

#### **Threshold Configuration**

- **Recommended values:** `0.1` to `0.5`
- **Lower threshold (0.1-0.2):** Triggers earlier, provides buffer zone for smooth loading
- **Higher threshold (0.5-1.0):** Waits until more element visible, reduces premature fetches
- **Typical pattern:** `threshold: 0.1` for most infinite scroll scenarios

#### **rootMargin Settings**

- **Purpose:** Creates buffer zone before actual viewport edge
- **Recommended values:** `"200px"` or `"300px"` (negative top margin)
- **Format:** `"200px 0px 0px 0px"` (top, right, bottom, left)
- **Mobile consideration:** Reduce to `"100px-150px"` for better UX
- **Key insight:** Pre-fetches content before user physically reaches bottom

#### **Performance Considerations**

**Debouncing/Throttling:**

```typescript
// NOT needed with Intersection Observer - built-in efficiency
// Only use if additional scroll event listeners exist
```

**Memory Leak Prevention:**

```typescript
useEffect(() => {
  const observer = new IntersectionObserver(callback, options);
  observer.observe(sentinelRef.current);

  return () => {
    observer.disconnect(); // CRITICAL: prevent memory leaks
  };
}, [callback]);
```

**Mobile vs Desktop:**

- **Desktop:** `rootMargin: "300px"` for faster networks
- **Mobile:** `rootMargin: "150px"` to conserve bandwidth/data
- **Detection:** Use media queries or window width checks
- **Performance:** Reduce page size on mobile (10-15 items vs 20-30 desktop)

#### **Cleanup Patterns**

```typescript
// Unobserve after triggering (prevents duplicate calls)
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      loadMore();
      observer.unobserve(entry.target); // Stop observing
    }
  });
}, options);
```

---

### 2. React Query + Infinite Scroll Integration

#### **useInfiniteQuery Core Pattern**

```typescript
const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } =
  useInfiniteQuery({
    queryKey: ["items"],
    queryFn: fetchItems,
    initialPageParam: null,
    getNextPageParam: lastPage => lastPage.nextCursor ?? undefined,
  });
```

#### **Common Pitfalls & Solutions**

**1. Duplicate Requests**

- **Cause:** Multiple observer triggers before fetch completes
- **Solution:** Check `isFetchingNextPage` before calling `fetchNextPage`

```typescript
const loadMore = useCallback(() => {
  if (hasNextPage && !isFetchingNextPage) {
    fetchNextPage();
  }
}, [hasNextPage, isFetchingNextPage, fetchNextPage]);
```

**2. Memory Issues**

- **Cause:** Unbounded page accumulation in cache
- **Solutions:**
  - Set `maxPages: 3` in query config
  - Implement virtual scrolling for large lists
  - Use `refetchOnMount: false` to prevent cache rebuilds

```typescript
useInfiniteQuery({
  // ... other options
  maxPages: 3, // Keep only last 3 pages in memory
  refetchOnMount: false,
});
```

**3. Cursor Management Edge Cases**

- **Problem:** `getNextPageParam` returning `null` vs `undefined`
- **Rule:** Return `undefined` to stop, return cursor to continue
- **Anti-pattern:** Returning `null` incorrectly disables pagination

**4. Stale Data**

- **Cause:** Users navigating back and seeing old data
- **Solution:** Configure `staleTime` appropriately

```typescript
staleTime: 5 * 60 * 1000, // 5 minutes
gcTime: 10 * 60 * 1000, // 10 minutes cache retention
```

#### **Loading State Patterns**

**Skeleton Loading (Recommended):**

```typescript
{isFetchingNextPage && (
  <div className="grid grid-cols-4 gap-4">
    {Array.from({ length: 8 }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
)}
```

**Spinner (Simpler):**

```typescript
{isFetchingNextPage && (
  <div className="flex justify-center py-4">
    <Spinner />
  </div>
)}
```

**Hybrid Approach:**

- Use skeleton for initial load
- Use spinner for subsequent pages
- Better perceived performance

#### **Error Recovery & Retry**

```typescript
const {
  isError,
  error,
  refetch,
} = useInfiniteQuery({
  // ... config
  retry: 1,
  retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
});

// UI pattern for error recovery
{isError && (
  <div className="text-center py-4">
    <p>Failed to load items</p>
    <button onClick={() => refetch()}>Retry</button>
  </div>
)}
```

#### **"End of List" UX Patterns**

```typescript
// Check both hasNextPage and data length
const showEndMessage = !hasNextPage && data?.pages.length > 0;

{showEndMessage && (
  <div className="text-center py-8 text-gray-500">
    You've reached the end
  </div>
)}
```

**Visual indicator patterns:**

- Simple text message
- Icon-based indicator (checkmark, flag)
- CTA for related content ("Explore more categories")

---

### 3. Cursor Pagination API Design

#### **REST API Response Shape**

**Standard Format:**

```json
{
  "data": [
    { "id": "1", "name": "Item 1", "createdAt": "2024-01-01T00:00:00Z" },
    { "id": "2", "name": "Item 2", "createdAt": "2024-01-02T00:00:00Z" }
  ],
  "pagination": {
    "nextCursor": "eyJpZCI6MiwibGFzdERhdGUiOiIyMDI0LTAxLTAyVDAwOjAwOjAwWiJ9",
    "hasMore": true,
    "totalCount": 150
  }
}
```

**Minimal Format:**

```json
{
  "items": [...],
  "nextCursor": "cursor_string",
  "hasMore": true
}
```

#### **Cursor Structure**

**Encoded JSON (Recommended):**

```typescript
// Backend: Create cursor
const cursor = Buffer.from(
  JSON.stringify({
    id: lastItem.id,
    createdAt: lastItem.createdAt,
  })
).toString("base64");

// Frontend: Decode cursor
const decoded = JSON.parse(Buffer.from(cursor, "base64").toString());
```

**Composite Key Cursor:**

```typescript
// Ensures stable sorting
interface Cursor {
  id: string;
  createdAt: string;
  // Include ALL sort fields
}
```

#### **Sorting with Cursor Pagination**

**Challenge:** Cursors must encode sort order

**Solution:**

```typescript
// Request
GET /items?sort=price&order=desc&cursor=eyJwcmljZSI6OTkuOTksImlkIjoiMTIzIn0=

// Cursor includes sort field values
const cursor = {
  price: 99.99, // Primary sort field
  id: "123",    // Tiebreaker for stability
};
```

**Best Practices:**

- Always include unique ID as tiebreaker
- Encode all sort fields in cursor
- Validate sort fields server-side
- Document supported sort options

#### **Filtering Integration**

**Approach 1: Filters in Query String**

```typescript
GET /items?category=electronics&priceRange=0-100&cursor=...

// Filters applied BEFORE pagination
// Cursor independent of filters
```

**Approach 2: Complex Filters in Cursor**

```typescript
// For expensive filter computations
const cursor = {
  lastItemId: "123",
  filterHash: hash(filterObject), // Validate filters haven't changed
};
```

**Recommendation:** Use Approach 1 for simplicity

#### **Mock Data Generation**

```typescript
// Generate consistent cursors for development
function generateMockItems(count: number, cursor?: string) {
  const items = Array.from({ length: count }, (_, i) => ({
    id: `item-${Date.now()}-${i}`,
    name: `Item ${i}`,
    createdAt: new Date(Date.now() - i * 1000 * 60).toISOString(),
  }));

  const lastItem = items[items.length - 1];
  const nextCursor = Buffer.from(
    JSON.stringify({
      id: lastItem.id,
      createdAt: lastItem.createdAt,
    })
  ).toString("base64");

  return {
    items,
    nextCursor,
    hasMore: count >= 20, // Assume 20 items per page
  };
}
```

#### **Security Considerations**

**Cursor Encryption:**

```typescript
// Encrypt sensitive cursor data
const encryptedCursor = encrypt(JSON.stringify(cursorData));
```

**Cursor Validation:**

```typescript
// Verify cursor integrity
try {
  const decoded = JSON.parse(Buffer.from(cursor, "base64").toString());
  if (!decoded.id || !decoded.createdAt) {
    throw new Error("Invalid cursor");
  }
} catch {
  throw new Error("Invalid cursor format");
}
```

**Rate Limiting:**

- Apply per-user rate limits
- Monitor for excessive page fetching
- Implement exponential backoff

---

### 4. Accessibility & UX Considerations

#### **Keyboard Navigation**

**Problem:** Infinite scroll breaks keyboard navigation

**Solution 1: "Load More" Button (Recommended)**

```typescript
<button
  onClick={fetchNextPage}
  disabled={!hasNextPage || isFetchingNextPage}
  className="focus-visible:ring-2 focus-visible:ring-blue-500"
>
  {isFetchingNextPage ? 'Loading...' : 'Load More'}
</button>
```

**Solution 2: Keyboard-Aware Infinite Scroll**

```typescript
const handleKeyPress = (e: KeyboardEvent) => {
  if (e.key === "End" && hasNextPage && !isFetchingNextPage) {
    fetchNextPage();
  }
};

useEffect(() => {
  window.addEventListener("keydown", handleKeyPress);
  return () => window.removeEventListener("keydown", handleKeyPress);
}, [hasNextPage, isFetchingNextPage, fetchNextPage]);
```

#### **Screen Reader Announcements**

**ARIA Live Region:**

```typescript
<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
  className="sr-only"
>
  {isFetchingNextPage && 'Loading more items...'}
  {!hasNextPage && data?.pages.length > 0 && 'Reached the end of the list'}
</div>
```

**New Content Announcement:**

```typescript
// Announce number of new items loaded
useEffect(() => {
  if (lastPageCount > 0 && !isLoading) {
    const announcement = `${lastPageCount} more items loaded`;
    // Update ARIA live region
  }
}, [lastPageCount, isLoading]);
```

#### **Focus Management**

**Maintain Focus Position:**

```typescript
const lastItemRef = useRef<HTMLElement>(null);

const loadMore = () => {
  if (lastItemRef.current) {
    lastItemRef.current.scrollIntoView({ behavior: "smooth" });
  }
  fetchNextPage();
};
```

**Restore Focus After Load:**

```typescript
const [focusedElement, setFocusedElement] = useState<HTMLElement | null>(null);

// Before fetch
setFocusedElement(document.activeElement as HTMLElement);

// After fetch
focusedElement?.focus();
```

#### **"Load More" Button as Fallback**

**Hybrid Approach (Best Practice):**

```typescript
const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);

// User can disable infinite scroll
<button onClick={() => setAutoScrollEnabled(!autoScrollEnabled)}>
  {autoScrollEnabled ? 'Disable Auto-Scroll' : 'Enable Auto-Scroll'}
</button>

// Conditionally render
{autoScrollEnabled ? (
  <InfiniteScroll />
) : (
  <LoadMoreButton />
)}
```

**Progressive Enhancement:**

```typescript
// Detect reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

{prefersReducedMotion ? (
  <LoadMoreButton />
) : (
  <InfiniteScroll />
)}
```

#### **Loading Indicators Placement**

**Best Practices:**

- Place at bottom of list (where new content appears)
- Use consistent position (don't jump around)
- Include with content (not separate modal/toast)

```typescript
<div className="space-y-4">
  {items.map(item => <ItemCard key={item.id} {...item} />)}

  {/* Loading indicator ALWAYS at bottom */}
  {isFetchingNextPage && (
    <div className="flex justify-center py-4">
      <Spinner />
      <span className="sr-only">Loading more items</span>
    </div>
  )}
</div>
```

#### **Error State Accessibility**

**Screen Reader Friendly:**

```typescript
{isError && (
  <div role="alert" aria-live="assertive">
    <p>Failed to load more items. Please try again.</p>
    <button onClick={() => refetch()}>Retry</button>
  </div>
)}
```

**Keyboard Accessible:**

- Ensure error message is focusable
- Provide keyboard shortcut for retry (e.g., "Press R to retry")

---

## Implementation Recommendations

### Quick Start Guide

**1. Setup Intersection Observer Hook**

```typescript
function useInfiniteScroll(callback: () => void, hasNextPage: boolean) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasNextPage) {
          callback();
        }
      },
      { threshold: 0.1, rootMargin: "200px" }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, [callback, hasNextPage]);

  return sentinelRef;
}
```

**2. Configure useInfiniteQuery**

```typescript
const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isError } = useInfiniteQuery({
  queryKey: ["marketplace-items"],
  queryFn: ({ pageParam }) => fetchItems(pageParam),
  initialPageParam: null,
  getNextPageParam: lastPage => lastPage.nextCursor ?? undefined,
  maxPages: 3,
  staleTime: 5 * 60 * 1000,
});
```

**3. Integrate in Component**

```typescript
function MarketplaceGrid() {
  const sentinelRef = useInfiniteScroll(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, hasNextPage);

  const items = data?.pages.flatMap(page => page.items) ?? [];

  return (
    <div>
      <div className="grid">
        {items.map(item => <ItemCard key={item.id} {...item} />)}
      </div>

      <div ref={sentinelRef} />

      {isFetchingNextPage && <LoadingSpinner />}
      {isError && <ErrorMessage onRetry={fetchNextPage} />}
    </div>
  );
}
```

### Code Examples

**Complete Intersection Observer Component:**

```typescript
import { useRef, useEffect } from 'react';

interface InfiniteScrollSentinelProps {
  onLoadMore: () => void;
  hasNextPage: boolean;
  isLoading: boolean;
}

export function InfiniteScrollSentinel({
  onLoadMore,
  hasNextPage,
  isLoading,
}: InfiniteScrollSentinelProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasNextPage || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '200px',
      }
    );

    const current = sentinelRef.current;
    if (current) {
      observer.observe(current);
    }

    return () => {
      if (current) {
        observer.unobserve(current);
      }
      observer.disconnect();
    };
  }, [onLoadMore, hasNextPage, isLoading]);

  return (
    <div
      ref={sentinelRef}
      aria-hidden="true"
      className="h-4"
    />
  );
}
```

### Common Pitfalls

**1. Forgetting Cleanup**

```typescript
// WRONG: No cleanup
useEffect(() => {
  const observer = new IntersectionObserver(callback);
  observer.observe(ref.current);
}, []);

// RIGHT: Proper cleanup
useEffect(() => {
  const observer = new IntersectionObserver(callback);
  observer.observe(ref.current);
  return () => observer.disconnect();
}, []);
```

**2. Missing Dependencies**

```typescript
// WRONG: Missing fetchNextPage dependency
useEffect(() => {
  // ...
}, [hasNextPage]); // fetchNextPage changes on every render

// RIGHT: Include all dependencies
useEffect(() => {
  // ...
}, [hasNextPage, fetchNextPage, isFetchingNextPage]);
```

**3. Duplicate API Calls**

```typescript
// WRONG: No guard clause
const loadMore = () => fetchNextPage();

// RIGHT: Check loading state
const loadMore = () => {
  if (hasNextPage && !isFetchingNextPage) {
    fetchNextPage();
  }
};
```

**4. Ignoring Accessibility**

```typescript
// WRONG: No ARIA attributes
<div>Loading...</div>

// RIGHT: Proper ARIA
<div role="status" aria-live="polite" className="sr-only">
  Loading more items...
</div>
```

---

## Resources & References

### Official Documentation

- [React Query useInfiniteQuery](https://tanstack.com/query/latest/docs/react/guides/infinite-queries)
- [Intersection Observer API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [WAI-ARIA Live Regions](https://www.w3.org/WAI/ARIA/apg/example-index/feed/live-region-pattern.html)

### Recommended Tutorials

- TanStack Query Infinite Scroll Guide
- Building Accessible Infinite Scroll (web.dev)
- Cursor Pagination Best Practices

### Community Resources

- React Query Discord
- Stack Overflow: [react-query] [infinite-scroll]
- GitHub: tanstack/query discussions

---

## Unresolved Questions

1. **Performance at Scale:** How does infinite scroll perform with 10,000+ items without virtualization?
2. **SEO Impact:** What's the SEO impact of infinite scroll on content discoverability?
3. **Analytics Tracking:** Best practices for tracking scroll depth and engagement in infinite scroll interfaces?
4. **Offline Support:** How to handle infinite scroll with service workers and offline caching?
5. **Mobile Gestures:** Should infinite scroll respond to swipe gestures on mobile devices?

---

## Appendices

### Glossary

- **Cursor:** Opaque token representing position in paginated result set
- **hasNextPage:** Boolean indicating if more data available
- **Intersection Observer:** Browser API for efficiently detecting element visibility
- **rootMargin:** Buffer zone around viewport for pre-fetching
- **threshold:** Percentage of element visibility before trigger
- **useInfiniteQuery:** React Query hook for infinite scroll/pagination

### Version Compatibility Matrix

| Library/Feature       | Version             | Notes                         |
| --------------------- | ------------------- | ----------------------------- |
| React Query           | v5+                 | Required for useInfiniteQuery |
| Intersection Observer | All modern browsers | IE11 requires polyfill        |
| TypeScript            | 5.0+                | For proper type inference     |

---

**End of Report**
