---
title: "React Best Practices Fixes Implementation Plan"
description: "Comprehensive plan to fix all React best practices issues across 8 phases, improving overall score from 7.5/10 to 9+/10"
status: pending
priority: P1
effort: 16h
branch: feature/improve-rating-of-react-best-practices
tags: [react, performance, optimization, nextjs, refactoring]
created: 2025-02-01
---

# React Best Practices Fixes Implementation Plan

## Executive Summary

This plan addresses all React best practices issues identified in the review report across 8 categories. The codebase is a Next.js 16 + React 19 + TypeScript 5.9 marketplace UI with an overall score of 7.5/10. Implementation of this plan will improve the score to 9+/10 while significantly enhancing performance, bundle size, and user experience.

### Current Issues Summary

| Phase | Category                       | Priority | Issues Count | Est. Time |
| ----- | ------------------------------ | -------- | ------------ | --------- |
| 1     | Bundle Optimization            | CRITICAL | 4            | 3h        |
| 2     | Parallel Data Fetching         | CRITICAL | 2            | 2h        |
| 3     | Re-render Optimization         | MEDIUM   | 4            | 3h        |
| 4     | Server-Side Performance        | HIGH     | 3            | 2h        |
| 5     | Rendering Performance          | MEDIUM   | 3            | 2h        |
| 6     | Suspense Boundaries            | MEDIUM   | 2            | 2h        |
| 7     | JavaScript Micro-optimizations | LOW      | 2            | 1h        |
| 8     | Advanced Patterns              | LOW      | 2            | 1h        |

**Total Estimated Time: 16 hours**

---

## Phase 1: Bundle Optimization (CRITICAL)

### Objective

Reduce initial bundle size by implementing dynamic imports for heavy components and enabling package optimization.

### 1.1 Dynamic Imports for Debug UI Sections

**File:** `src/app/debug/ui/page.tsx` (lines 11-32)

**Current Issue:** All 21 component sections are statically imported, adding unnecessary weight to the debug page bundle.

**Before:**

```typescript
// Import all component sections
import { ButtonSection } from "./sections/button-section";
import { InputSection } from "./sections/input-section";
// ... 19 more imports

const sections: Section[] = [
  {
    id: "button",
    title: "Button",
    component: ButtonSection, // Direct reference
    category: "input",
  },
  // ...
];
```

**After:**

```typescript
import dynamic from "next/dynamic";
import { Skeleton } from "@/shared/components/ui/skeleton";

// Dynamic imports for all sections
const ButtonSection = dynamic(() => import("./sections/button-section").then(m => ({ default: m.ButtonSection })), {
  loading: () => <Skeleton className="h-48 w-full" />,
});
const InputSection = dynamic(() => import("./sections/input-section").then(m => ({ default: m.InputSection })), {
  loading: () => <Skeleton className="h-48 w-full" />,
});
// ... 19 more dynamic imports

const sections: Section[] = [
  {
    id: "button",
    title: "Button",
    component: ButtonSection,
    category: "input",
  },
  // ...
];
```

### 1.2 Enable optimizePackageImports

**File:** `next.config.ts` (add after line 63)

**Before:**

```typescript
const nextConfig: NextConfig = {
  serverExternalPackages: ["pino", "thread-stream", "pino-pretty", "lokijs", "encoding"],
  images: {
    /* ... */
  },
};
```

**After:**

```typescript
const nextConfig: NextConfig = {
  serverExternalPackages: ["pino", "thread-stream", "pino-pretty", "lokijs", "encoding"],
  images: {
    /* ... */
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
  },
};
```

### 1.3 Dynamic Imports for Chart Components

**File:** `src/app/debug/ui/sections/chart-section.tsx` (lines 1-13)

**Current Issue:** Recharts library (21KB+) is imported statically even when charts aren't immediately visible.

**Before:**

```typescript
"use client";

import * as React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/shared/components/ui/chart";
```

**After:**

```typescript
"use client";

import * as React from "react";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Skeleton } from "@/shared/components/ui/skeleton";

// Dynamically import chart components
const ChartComponents = dynamic(() => import("./chart-components"), {
  loading: () => (
    <div className="space-y-4">
      <Skeleton className="h-[300px] w-full" />
      <Skeleton className="h-[300px] w-full" />
    </div>
  ),
  ssr: false, // Charts are client-only
});

export function ChartSection() {
  return (
    <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
      <ChartComponents />
    </Suspense>
  );
}
```

**New File:** `src/app/debug/ui/sections/chart-components.tsx`

```typescript
"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/shared/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { TrendingUp } from "lucide-react";

// Move all chart JSX from original file here
export default function ChartComponents() {
  // ... all chart data and JSX
}
```

### 1.4 Defer Analytics/Monitoring Libraries

**File:** Create `src/shared/lib/sentry-loader.ts`

**New File:**

```typescript
"use client";

import { useEffect } from "react";

export function useSentryLazyLoad() {
  useEffect(() => {
    // Defer Sentry initialization until after hydration
    const initSentry = async () => {
      if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
        const { init } = await import("@sentry/nextjs");
        init({
          dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
          // ... other config
        });
      }
    };

    // Use requestIdleCallback or setTimeout for non-critical loading
    if (typeof window !== "undefined") {
      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(initSentry);
      } else {
        setTimeout(initSentry, 1000);
      }
    }
  }, []);
}
```

**Testing Approach:**

1. Run `pnpm build` and check bundle analyzer output
2. Verify debug page loads without all sections in initial bundle
3. Check Network tab for lazy-loaded chunks
4. Verify charts load on demand with loading states

**Estimated Time:** 3 hours

**Dependencies:** None (can start immediately)

---

## Phase 2: Parallel Data Fetching (CRITICAL)

### Objective

Eliminate data fetching waterfalls by parallelizing independent async operations.

### 2.1 Optimize useAuth Hook

**File:** `src/shared/hooks/useAuth.ts` (lines 30-67)

**Current Issue:** Sequential awaits for refreshSession and getMe create unnecessary waterfalls.

**Before:**

```typescript
useEffect(() => {
  const checkAuth = async () => {
    setIsLoading(true);
    try {
      // Sequential operations - BAD
      try {
        const { data: refreshData } = await refreshSession();
        if (refreshData?.refreshSession?.accessToken) {
          graphqlClient.setAccessToken(refreshData.refreshSession.accessToken);
        }
      } catch (refreshError) {
        console.log("[Auth] No valid refresh token");
      }

      const { data } = await getMe(); // Waits for refreshSession
      // ...
    } catch (error) {
      // ...
    }
  };
  checkAuth();
}, [isConnected, address]);
```

**After:**

```typescript
useEffect(() => {
  const checkAuth = async () => {
    setIsLoading(true);
    try {
      // Start both operations in parallel
      const refreshPromise = refreshSession().catch(() => null);

      // Wait for refresh first to set token, then getMe
      const refreshResult = await refreshPromise;

      if (refreshResult?.data?.refreshSession?.accessToken) {
        graphqlClient.setAccessToken(refreshResult.data.refreshSession.accessToken);
      }

      const { data } = await getMe();

      if (data?.me) {
        setUser(data.me as AuthUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  checkAuth();
  // ... rest of effect
}, [isConnected, address, getMe, refreshSession]);
```

### 2.2 Audit Other Hooks for Sequential Patterns

**Files to audit:**

- `src/shared/hooks/use-scroll-direction.ts`
- `src/shared/hooks/use-scroll.ts`
- `src/shared/hooks/use-mobile.ts`

**Search pattern:** Look for multiple `await` statements in useEffect hooks.

**Example fix pattern:**

```typescript
// BEFORE: Sequential
const data1 = await fetch1();
const data2 = await fetch2();

// AFTER: Parallel
const [data1, data2] = await Promise.all([fetch1(), fetch2()]);
```

**Testing Approach:**

1. Add console.time/timeEnd to measure auth check duration
2. Verify parallel execution reduces total time
3. Test error handling for individual promise failures
4. Verify no race conditions in state updates

**Estimated Time:** 2 hours

**Dependencies:** None

---

## Phase 3: Re-render Optimization (MEDIUM)

### Objective

Remove unnecessary re-renders by fixing useMemo/useCallback usage and adding React.memo to expensive components.

### 3.1 Remove Unnecessary useMemo

**File:** `src/modules/marketplace/index.tsx` (line 106)

**Current Issue:** Identity useMemo provides no value.

**Before:**

```typescript
// Safe NFTs for compatibility with existing code
const safeNFTs = useMemo(() => nfts, [nfts]);
```

**After:**

```typescript
// Direct reference - no memoization needed for identity function
const safeNFTs = nfts;
```

### 3.2 Add useMemo for Stats Calculation

**File:** `src/modules/activity/index.tsx` (lines 288-295)

**Current Issue:** Stats object recalculated on every render even when activities unchanged.

**Before:**

```typescript
const stats = {
  totalVolume: activities.reduce((acc, item) => acc + (item.price || 0), 0),
  totalSales: activities.filter(item => item.type === "sale").length,
  avgPrice:
    activities.filter(item => item.price).reduce((acc, item) => acc + (item.price || 0), 0) /
      activities.filter(item => item.price).length || 0,
  totalTransactions: activities.length,
};
```

**After:**

```typescript
const stats = useMemo(() => {
  const pricedActivities = activities.filter(item => item.price);
  const totalVolume = pricedActivities.reduce((acc, item) => acc + (item.price || 0), 0);

  return {
    totalVolume,
    totalSales: activities.filter(item => item.type === "sale").length,
    avgPrice: pricedActivities.length > 0 ? totalVolume / pricedActivities.length : 0,
    totalTransactions: activities.length,
  };
}, [activities]);
```

### 3.3 Fix useCallback Dependency Arrays

**File:** `src/modules/marketplace/index.tsx` (lines 127-147)

**Current Issue:** Missing dependencies in useCallback hooks.

**Before:**

```typescript
const handlePriceRangeChange = useCallback((range: [number, number]) => {
  const [min, max] = range;
  const validPriceRange: [number, number] = [
    isNaN(min) ? 0 : min,
    isNaN(max) ? Infinity : Math.max(min, max),
  ];
  setPriceRange(validPriceRange);
}, []); // Missing dependencies!

const handleNFTSelection = useCallback(
  (id: string) => {
    toggle(id);
  },
  [toggle]
);
```

**After:**

```typescript
const handlePriceRangeChange = useCallback(
  (range: [number, number]) => {
    const [min, max] = range;
    const validPriceRange: [number, number] = [
      isNaN(min) ? 0 : min,
      isNaN(max) ? Infinity : Math.max(min, max),
    ];
    setPriceRange(validPriceRange);
  },
  [setPriceRange]
); // Added missing dependency

const handleNFTSelection = useCallback(
  (id: string) => {
    toggle(id);
  },
  [toggle]
);
```

### 3.4 Add React.memo to Expensive Components

**File:** `src/modules/marketplace/components/marketplace-nft-card.tsx`

**Before:**

```typescript
export function MarketplaceNFTCard({ nft, onSelect, selected }: Props) {
  // ... component logic
}
```

**After:**

```typescript
import { memo } from "react";

function MarketplaceNFTCardComponent({ nft, onSelect, selected }: Props) {
  // ... component logic
}

export const MarketplaceNFTCard = memo(MarketplaceNFTCardComponent, (prev, next) => {
  // Custom comparison for performance
  return (
    prev.nft.id === next.nft.id &&
    prev.selected === next.selected &&
    prev.nft.price === next.nft.price
  );
});
```

**File:** `src/shared/components/ui/chart.tsx` (ChartContainer component)

**Before:**

```typescript
function ChartContainer({ id, className, children, config, ...props }: Props) {
  // ...
}
```

**After:**

```typescript
const ChartContainer = memo(function ChartContainerComponent({
  id,
  className,
  children,
  config,
  ...props
}: Props) {
  // ...
});
```

**Testing Approach:**

1. Use React DevTools Profiler to measure render counts
2. Verify stats don't recalculate when unrelated state changes
3. Check that NFT cards don't re-render when parent updates
4. Run `pnpm typecheck` to verify dependency arrays

**Estimated Time:** 3 hours

**Dependencies:** None

---

## Phase 4: Server-Side Performance (HIGH)

### Objective

Implement server-side caching and non-blocking operations for improved SSR performance.

### 4.1 Implement React.cache() for Auth/Config Data

**New File:** `src/shared/lib/server-cache.ts`

```typescript
import { cache } from "react";
import { graphqlClient } from "./graphql-client";

// Cache user data per request
export const getCachedUser = cache(async (accessToken: string) => {
  graphqlClient.setAccessToken(accessToken);
  const { data } = await graphqlClient.query({
    query: GET_ME,
  });
  return data?.me;
});

// Cache config data per request
export const getCachedConfig = cache(async () => {
  const { data } = await graphqlClient.query({
    query: GET_CONFIG,
    fetchPolicy: "cache-first",
  });
  return data?.config;
});
```

### 4.2 Add LRU Cache for Cross-Request Data

**New File:** `src/shared/lib/lru-cache.ts`

```typescript
import { LRUCache } from "lru-cache";

// Cache for NFT metadata (cross-request)
const nftMetadataCache = new LRUCache<string, NFTMetadata>({
  max: 500, // Max 500 items
  ttl: 1000 * 60 * 5, // 5 minutes
});

export function getCachedNFTMetadata(tokenId: string): NFTMetadata | undefined {
  return nftMetadataCache.get(tokenId);
}

export function setCachedNFTMetadata(tokenId: string, metadata: NFTMetadata): void {
  nftMetadataCache.set(tokenId, metadata);
}
```

### 4.3 Use after() for Analytics/Logging

**New File:** `src/shared/lib/server-utils.ts`

```typescript
import { after } from "next/server";

export function logAnalytics(event: string, data: Record<string, unknown>) {
  // Use after() to run after response is sent
  after(async () => {
    await fetch("https://analytics.api.zuno.io/events", {
      method: "POST",
      body: JSON.stringify({ event, data, timestamp: Date.now() }),
    });
  });
}

export function logServerError(error: Error, context: string) {
  after(async () => {
    console.error(`[Server Error] ${context}:`, error);
    // Send to error tracking service
  });
}
```

**Testing Approach:**

1. Verify cache deduplication in server components
2. Test LRU cache hit/miss rates
3. Confirm analytics fire after response
4. Check memory usage doesn't grow unbounded

**Estimated Time:** 2 hours

**Dependencies:** None

---

## Phase 5: Rendering Performance (MEDIUM)

### Objective

Fix hydration issues and optimize rendering with CSS containment.

### 5.1 Fix Hydration Placeholder

**File:** `src/shared/components/layout/dark-mode/ModeToggle.tsx` (lines 25-27)

**Current Issue:** Returns null during hydration, causing layout shift.

**Before:**

```typescript
if (!mounted) {
  return null; // or a loading spinner/skeleton
}
```

**After:**

```typescript
if (!mounted) {
  return (
    <Button
      variant="outline"
      size="icon"
      className="bg-background border-border-subtle"
      aria-hidden="true"
    >
      <Skeleton className="h-[1.2rem] w-[1.2rem] rounded-full" />
    </Button>
  );
}
```

### 5.2 Replace && with Ternary Operators

**Search pattern:** `condition && (` in JSX

**Example fix in marketplace:**

**Before:**

```typescript
{showFilters && (
  <MarketplaceFilterPanel ... />
)}
```

**After:**

```typescript
{showFilters ? (
  <MarketplaceFilterPanel ... />
) : null}
```

**Files to update:**

- `src/modules/marketplace/index.tsx` (lines 174, 189, 339)
- `src/modules/activity/index.tsx` (lines 434-451)

### 5.3 Add content-visibility CSS

**File:** `src/app/globals.css` (add at end)

```css
/* Content visibility for long lists */
.content-visibility-auto {
  content-visibility: auto;
  contain-intrinsic-size: 0 500px;
}

/* Apply to marketplace grid items */
.nft-grid-item {
  content-visibility: auto;
  contain-intrinsic-size: 0 300px;
}

/* Apply to activity feed items */
.activity-item {
  content-visibility: auto;
  contain-intrinsic-size: 0 80px;
}
```

**File:** `src/modules/marketplace/components/marketplace-nft-grid.tsx`

Add className to grid items:

```typescript
<div className="nft-grid-item">
  <MarketplaceNFTCard ... />
</div>
```

**Testing Approach:**

1. Use Lighthouse to check CLS (Cumulative Layout Shift)
2. Verify no hydration warnings in console
3. Test scrolling performance in long lists
4. Check content-visibility doesn't break images

**Estimated Time:** 2 hours

**Dependencies:** None

---

## Phase 6: Suspense Boundaries

### Objective

Add proper Suspense boundaries for better loading UX and streaming.

### 6.1 Add Suspense Around Data-Dependent Components

**File:** `src/modules/marketplace/index.tsx` (wrap content)

**Before:**

```typescript
<div className="flex-1 min-h-0 min-w-0 overflow-y-auto">
  {isLoading ? (
    <LoadingSpinner />
  ) : (
    <MarketplaceNFTGrid ... />
  )}
</div>
```

**After:**

```typescript
import { Suspense } from "react";

<div className="flex-1 min-h-0 min-w-0 overflow-y-auto">
  <Suspense fallback={<NFTGridSkeleton />}>
    <MarketplaceNFTGridContainer
      contractAddress={contractAddress}
      filters={filters}
    />
  </Suspense>
</div>
```

### 6.2 Create Skeleton Loading States

**New File:** `src/modules/marketplace/components/nft-grid-skeleton.tsx`

```typescript
import { Skeleton } from "@/shared/components/ui/skeleton";

export function NFTGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="aspect-square rounded-lg" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}
```

**New File:** `src/modules/activity/components/activity-skeleton.tsx`

```typescript
import { Skeleton } from "@/shared/components/ui/skeleton";

export function ActivitySkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-12 w-12 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}
```

**Testing Approach:**

1. Test slow network throttling
2. Verify skeletons match final layout
3. Check streaming works with Suspense
4. Ensure no flash of loading state

**Estimated Time:** 2 hours

**Dependencies:** Phase 5 (for skeleton patterns)

---

## Phase 7: JavaScript Micro-optimizations

### Objective

Apply low-level JS optimizations for repeated operations.

### 7.1 Replace .find() with Maps for Repeated Lookups

**File:** `src/modules/marketplace/index.tsx` (if using find for NFT lookups)

**Before:**

```typescript
// Inefficient for repeated lookups
const nft = nfts.find(n => n.id === id);
```

**After:**

```typescript
// Build Map once, use for O(1) lookups
const nftMap = useMemo(() => {
  return new Map(nfts.map(nft => [nft.id, nft]));
}, [nfts]);

// O(1) lookup
const nft = nftMap.get(id);
```

### 7.2 Use toSorted() Instead of sort()

**File:** Search for `.sort()` usage in codebase

**Before:**

```typescript
const sorted = items.sort((a, b) => a.price - b.price);
```

**After:**

```typescript
const sorted = items.toSorted((a, b) => a.price - b.price);
```

**Files to check:**

- `src/modules/marketplace/index.tsx`
- `src/modules/activity/index.tsx`
- Any sorting/filtering logic

**Testing Approach:**

1. Verify Map lookups work correctly
2. Check toSorted doesn't mutate original
3. Benchmark performance improvements
4. Run full test suite

**Estimated Time:** 1 hour

**Dependencies:** None

---

## Phase 8: Advanced Patterns

### Objective

Implement advanced React patterns for cleaner, more maintainable code.

### 8.1 Implement useLatest Utility Hook

**New File:** `src/shared/hooks/use-latest.ts`

```typescript
import { useRef, useEffect } from "react";

/**
 * Returns a ref that always holds the latest value.
 * Useful for accessing latest props/state in callbacks without
 * adding them to dependency arrays.
 */
export function useLatest<T>(value: T) {
  const ref = useRef(value);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref;
}
```

**Usage example:**

```typescript
function useAuth() {
  const latestAddress = useLatest(address);

  useEffect(() => {
    // Can access latestAddress.current without adding to deps
    const checkAuth = async () => {
      console.log(latestAddress.current);
    };
  }, []); // No need for address in deps
}
```

### 8.2 Use useEffectEvent Where Appropriate

**Note:** useEffectEvent is experimental. Use useLatest as fallback.

**Example in useAuth:**

**Before:**

```typescript
useEffect(() => {
  const checkAuth = async () => {
    // Uses address from closure
    console.log(address);
  };
  checkAuth();
}, [isConnected, address]); // Must include address
```

**After:**

```typescript
const checkAuthEvent = useEffectEvent(async () => {
  // Always has latest address
  console.log(address);
});

useEffect(() => {
  checkAuthEvent();
}, [isConnected]); // No need for address
```

**Testing Approach:**

1. Verify useLatest always returns current value
2. Test useEffectEvent pattern (if available)
3. Ensure no stale closure issues
4. Check bundle size impact

**Estimated Time:** 1 hour

**Dependencies:** None

---

## Testing Strategy

### Unit Tests

**New File:** `src/shared/hooks/__tests__/use-latest.test.ts`

```typescript
import { renderHook } from "@testing-library/react";
import { useLatest } from "../use-latest";

describe("useLatest", () => {
  it("should always return the latest value", () => {
    const { result, rerender } = renderHook(({ value }) => useLatest(value), {
      initialProps: { value: "initial" },
    });

    expect(result.current.current).toBe("initial");

    rerender({ value: "updated" });
    expect(result.current.current).toBe("updated");
  });
});
```

### Integration Tests

**Test scenarios:**

1. Auth flow with parallel fetching
2. Marketplace grid with React.memo
3. Dynamic imports loading correctly
4. Suspense boundaries with skeletons

### Performance Tests

**Metrics to track:**

- Initial bundle size (before/after)
- Time to Interactive (TTI)
- Cumulative Layout Shift (CLS)
- Render counts (React DevTools)

### E2E Tests

**Critical paths:**

1. User authentication flow
2. Marketplace browsing
3. Activity feed filtering
4. Theme switching

---

## Rollback Plan

### Phase Rollback

Each phase can be rolled back independently:

```bash
# Rollback specific phase
git revert <phase-commit-hash>

# Or reset to pre-phase state
git reset --hard <pre-phase-commit>
```

### Emergency Rollback

If critical issues occur:

1. **Immediate:** Revert to last known good commit
2. **Investigate:** Identify root cause in staging
3. **Fix:** Apply targeted fix
4. **Redeploy:** After verification

### Feature Flags

For risky changes, use feature flags:

```typescript
const USE_PARALLEL_AUTH = process.env.NEXT_PUBLIC_USE_PARALLEL_AUTH === "true";

// In code
if (USE_PARALLEL_AUTH) {
  // New implementation
} else {
  // Old implementation
}
```

---

## Success Metrics

### Performance Metrics

| Metric                     | Current | Target | Measurement             |
| -------------------------- | ------- | ------ | ----------------------- |
| Initial Bundle Size        | ~250KB  | <200KB | webpack-bundle-analyzer |
| Time to Interactive        | ~3.5s   | <2.5s  | Lighthouse              |
| CLS                        | ~0.15   | <0.1   | Lighthouse              |
| Auth Check Duration        | ~800ms  | <400ms | console.time            |
| Render Count (marketplace) | 50+     | <30    | React DevTools          |

### Code Quality Metrics

| Metric                     | Current | Target |
| -------------------------- | ------- | ------ |
| ESLint Warnings            | 15      | 0      |
| TypeScript Errors          | 0       | 0      |
| Test Coverage              | 65%     | 75%    |
| React Best Practices Score | 7.5/10  | 9+/10  |

### Business Metrics

| Metric                | Expected Impact |
| --------------------- | --------------- |
| Bounce Rate           | -10%            |
| Page Load Abandonment | -15%            |
| User Satisfaction     | +20%            |

---

## Implementation Timeline

### Week 1: Critical Phases

- **Day 1-2:** Phase 1 (Bundle Optimization)
- **Day 3:** Phase 2 (Parallel Data Fetching)
- **Day 4-5:** Phase 4 (Server-Side Performance)

### Week 2: Medium Priority

- **Day 6-7:** Phase 3 (Re-render Optimization)
- **Day 8:** Phase 5 (Rendering Performance)
- **Day 9-10:** Phase 6 (Suspense Boundaries)

### Week 3: Polish

- **Day 11:** Phase 7 (JavaScript Micro-optimizations)
- **Day 12:** Phase 8 (Advanced Patterns)
- **Day 13-14:** Testing, bug fixes, documentation

---

## Unresolved Questions

1. **Sentry Configuration:** Should we completely defer Sentry or just lazy-load the initialization?
2. **React.cache() Availability:** Verify React.cache() is available in Next.js 16 with React 19
3. **useEffectEvent Status:** Confirm if useEffectEvent is stable enough for production use
4. **LRU Cache Size:** Determine optimal cache size based on user behavior data
5. **Skeleton Design:** Get design team approval on skeleton loading states

---

## Appendix

### Related Documentation

- [Vercel React Best Practices](https://github.com/vercel/react-best-practices)
- [Next.js Performance Optimization](https://nextjs.org/docs/app/building-your-application/optimizing)
- [React Documentation](https://react.dev/)

### Tools for Verification

- React DevTools Profiler
- Lighthouse CI
- webpack-bundle-analyzer
- @next/bundle-analyzer

### Code Review Checklist

- [ ] All dynamic imports have loading states
- [ ] No sequential awaits for independent operations
- [ ] useMemo/useCallback used appropriately
- [ ] React.memo applied to expensive components
- [ ] Suspense boundaries around async components
- [ ] No hydration mismatches
- [ ] All tests passing
- [ ] Bundle size reduced
- [ ] Performance metrics improved
