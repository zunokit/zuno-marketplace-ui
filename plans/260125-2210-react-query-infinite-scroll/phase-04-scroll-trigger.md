---
title: "Phase 04: Build Infinite Scroll Trigger"
description: "Create InfiniteScrollTrigger component with Intersection Observer"
status: pending
priority: P1
effort: 1h
branch: feature/marketplace
tags: [intersection-observer, scroll-trigger, component]
created: 2026-01-25
---

# Phase 04: Build Infinite Scroll Trigger

## Context Links

- **Parent Plan**: [../plan.md](../plan.md)
- **Phase 03**: [./phase-03-hook-wrapper.md](./phase-03-hook-wrapper.md) (should be complete)
- **Infinite Scroll Research**: [./research/researcher-infinite-scroll.md](./research/researcher-infinite-scroll.md)

## Overview

**Date**: 2026-01-25
**Priority**: P1 (Critical)
**Status**: pending

Create `InfiniteScrollTrigger` component using Intersection Observer API to automatically fetch next page when user scrolls near bottom, with race condition prevention and accessibility support.

## Key Insights

1. **Intersection Observer**: Efficient scroll detection, better than scroll event listeners
2. **rootMargin: 200px**: Pre-fetch before user reaches bottom for smooth UX
3. **Race Condition Guard**: Check `hasNextPage && !isFetchingNextPage` before fetching
4. **Cleanup Required**: Disconnect observer on unmount to prevent memory leaks

## Requirements

### Functional Requirements

- Detect when user is 200px from bottom of list
- Call `fetchNextPage()` when trigger element intersects
- Prevent duplicate calls (race condition guard)
- Disable scroll on error or when no more pages
- Support conditional enable/disable

### Non-Functional Requirements

- Proper cleanup on unmount
- Accessibility support (ARIA live region)
- Minimal DOM impact (invisible trigger element)
- Mobile-responsive behavior

## Architecture

### Component Props

```typescript
interface InfiniteScrollTriggerProps {
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  enabled?: boolean;
  rootMargin?: string;
  threshold?: number;
  className?: string;
}
```

### Intersection Observer Setup

```typescript
const observer = new IntersectionObserver(
  (entries) => {
    const [entry] = entries;
    if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  },
  {
    rootMargin: '200px', // Start loading 200px before bottom
    threshold: 0.1,      // Trigger when 10% visible
  }
);
```

## Related Code Files

### Files to Create

- `src/modules/marketplace/components/InfiniteScrollTrigger.tsx` - Main component

### Files to Reference

- `src/modules/marketplace/components/NFTGrid.tsx` - Will use this component
- `src/modules/marketplace/queries/use-infinite-marketplace-items.ts` - Hook that provides props

## Implementation Steps

### Step 1: Install Intersection Observer Library

```bash
# Check if already installed (from Phase 01)
pnpm list react-intersection-observer

# If not installed, install it
pnpm add react-intersection-observer
```

### Step 2: Create Component

Create `src/modules/marketplace/components/InfiniteScrollTrigger.tsx`:

```typescript
/**
 * Infinite scroll trigger component
 * Uses Intersection Observer to auto-fetch next page when scrolling near bottom
 */

import { useEffect, useRef } from 'react';
import { cn } from '@/shared/utils/tailwind-utils';

/**
 * Props for InfiniteScrollTrigger
 */
export interface InfiniteScrollTriggerProps {
  /**
   * Whether there is a next page to fetch
   */
  hasNextPage: boolean | undefined;

  /**
   * Whether currently fetching the next page
   */
  isFetchingNextPage: boolean;

  /**
   * Function to fetch the next page
   */
  fetchNextPage: () => void;

  /**
   * Enable/disable the scroll trigger
   * Useful for disabling on error or when paused
   */
  enabled?: boolean;

  /**
   * Root margin for Intersection Observer
   * Creates buffer zone before actual viewport edge
   * @default '200px'
   */
  rootMargin?: string;

  /**
   * Threshold for Intersection Observer
   * Percentage of element visibility before trigger
   * @default 0.1
   */
  threshold?: number;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Error state - disable trigger when there's an error
   */
  isError?: boolean;
}

/**
 * Infinite scroll trigger component
 *
 * @example
 * ```typescript
 * function Marketplace() {
 *   const { fetchNextPage, hasNextPage, isFetchingNextPage } =
 *     useInfiniteMarketplaceItems(contractAddress, filters)
 *
 *   return (
 *     <div>
 *       <NFTGrid items={items} />
 *       <InfiniteScrollTrigger
 *         hasNextPage={hasNextPage}
 *         isFetchingNextPage={isFetchingNextPage}
 *         fetchNextPage={fetchNextPage}
 *       />
 *     </div>
 *   )
 * }
 * ```
 */
export function InfiniteScrollTrigger({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  enabled = true,
  rootMargin = '200px',
  threshold = 0.1,
  className,
  isError = false,
}: InfiniteScrollTriggerProps) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Don't set up observer if disabled or no more pages
    if (!enabled || !hasNextPage || isError) {
      return;
    }

    const triggerElement = triggerRef.current;
    if (!triggerElement) {
      return;
    }

    // Cleanup previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create new observer
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        // Guard against race conditions
        if (
          entry.isIntersecting &&
          hasNextPage &&
          !isFetchingNextPage
        ) {
          fetchNextPage();
        }
      },
      {
        rootMargin,
        threshold,
      }
    );

    observerRef.current = observer;
    observer.observe(triggerElement);

    // Cleanup on unmount or dependency change
    return () => {
      observer.disconnect();
      observerRef.current = null;
    };
  }, [enabled, hasNextPage, isFetchingNextPage, fetchNextPage, rootMargin, threshold, isError]);

  return (
    <>
      {/* Invisible trigger element */}
      <div
        ref={triggerRef}
        aria-hidden="true"
        className={cn('h-4 w-full', className)}
      />

      {/* ARIA live region for screen readers */}
      <div role="status" aria-live="polite" className="sr-only">
        {isFetchingNextPage && 'Loading more items...'}
        {!hasNextPage && 'You have reached the end of the list'}
      </div>
    </>
  );
}

/**
 * Display name for debugging
 */
InfiniteScrollTrigger.displayName = 'InfiniteScrollTrigger';
```

### Step 3: Create Usage Example (Documentation)

Add example usage in component comments (see JSDoc in Step 2).

### Step 4: TypeScript Verification

```bash
pnpm tsc --noEmit
```

### Step 5: Build Verification

```bash
pnpm build
```

## Todo List

- [ ] Install `react-intersection-observer` if not present
- [ ] Create `InfiniteScrollTrigger.tsx` component
- [ ] Define props interface with JSDoc
- [ ] Implement Intersection Observer setup
- [ ] Add race condition guard (hasNextPage && !isFetchingNextPage)
- [ ] Add cleanup in useEffect return
- [ ] Add ARIA live region for accessibility
- [ ] Add invisible trigger element with aria-hidden
- [ ] Set default rootMargin to '200px'
- [ ] Set default threshold to 0.1
- [ ] Verify TypeScript compilation
- [ ] Test component builds successfully

## Success Criteria

- [ ] Component exported from file
- [ ] Uses Intersection Observer API
- [ ] rootMargin defaults to '200px'
- [ ] Prevents duplicate calls with fetching guard
- [ ] Proper cleanup on unmount
- [ ] ARIA live region announces loading state
- [ ] Invisible trigger element (h-4, aria-hidden)
- [ ] TypeScript compiler reports zero errors
- [ ] Component builds without issues
- [ ] Ready for integration with NFTGrid

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Memory leak (no cleanup) | Low | High | useEffect cleanup function |
| Race condition (multiple calls) | Medium | Medium | Guard check before fetch |
| Missing accessibility | Low | Medium | ARIA live region included |
| Browser compatibility | Very Low | Low | Intersection Observer widely supported |

## Security Considerations

- No user input handling
- No XSS risk (aria-live uses controlled strings)
- Observer cleanup prevents memory issues

## Next Steps

After completing this phase:
1. Move to **Phase 05: Integration** to integrate with NFTGrid and marketplace
2. Component ready to be placed at bottom of scrollable list
3. Can test scroll behavior in development

## Notes

- Component is intentionally minimal - no loading spinner
- Loading UI should be handled by parent component
- ARIA live region uses sr-only class (assumes Tailwind)
- Root margin of 200px provides smooth pre-loading

## Usage Example

```typescript
// In NFTGrid.tsx
import { InfiniteScrollTrigger } from './InfiniteScrollTrigger';

function NFTGrid({ items, fetchNextPage, hasNextPage, isFetchingNextPage }) {
  return (
    <div>
      <div className="grid">
        {items.map(item => <NFTCard key={item.id} {...item} />)}
      </div>

      {/* Loading indicator (shown by parent) */}
      {isFetchingNextPage && <LoadingSpinner />}

      {/* Invisible scroll trigger */}
      <InfiniteScrollTrigger
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
      />
    </div>
  );
}
```

## Unresolved Questions

1. Should we use `react-intersection-observer` library or native API? (Native chosen for simplicity)
2. Should rootMargin be configurable per viewport size? (Desktop: 200px, Mobile: 100px)
3. Should we throttle the callback to prevent rapid triggers? (Observer is already efficient)
