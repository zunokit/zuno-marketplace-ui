/**
 * Infinite scroll trigger component
 * Uses Intersection Observer to auto-fetch next page when scrolling near bottom
 */

"use client";

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
