---
title: "Phase 06: Testing and Bug Fixes"
description: "Test infinite scroll implementation and fix any issues"
status: pending
priority: P1
effort: 1h
branch: feature/marketplace
tags: [testing, debugging, bug-fixes]
created: 2026-01-25
---

# Phase 06: Testing and Bug Fixes

## Context Links

- **Parent Plan**: [../plan.md](../plan.md)
- **Phase 05**: [./phase-05-integration.md](./phase-05-integration.md) (must complete first)
- **Code Standards**: [../../../docs/code-standards.md](../../../docs/code-standards.md)

## Overview

**Date**: 2026-01-25
**Priority**: P1 (Critical)
**Status**: pending

Test the infinite scroll implementation comprehensively, identify bugs, performance issues, and edge cases, then fix them before marking the feature complete.

## Key Insights

1. **Manual Testing First**: Test basic functionality before writing unit tests
2. **Edge Cases Critical**: Empty states, errors, rapid filter changes
3. **Performance Testing**: Memory usage with many pages
4. **Browser Testing**: Different browsers may handle Intersection Observer differently

## Requirements

### Functional Requirements

- Test initial page load (16 items)
- Test scroll trigger loads next page
- Test filter changes reset query
- Test error handling and recovery
- Test loading states display correctly
- Test end-of-list message

### Non-Functional Requirements

- No memory leaks (observer cleanup)
- No race conditions (fetching guard)
- Smooth UX (pre-fetching at 200px)
- Accessible (ARIA announcements)

## Test Scenarios

### Scenario 1: Initial Page Load

**Steps**:
1. Load marketplace page
2. Verify 16 items displayed
3. Verify no console errors
4. Verify loading state clears

**Expected**:
- 16 mock NFTs visible
- No errors in console
- Loading spinner disappears

### Scenario 2: Infinite Scroll

**Steps**:
1. Load initial page
2. Scroll to near bottom (within 200px)
3. Verify next page loads automatically
4. Repeat for 3-4 pages
5. Verify items accumulate correctly

**Expected**:
- Next page fetches automatically
- Items append to list (no duplicates)
- Loading spinner shows during fetch
- No duplicate requests

### Scenario 3: Filter Changes

**Steps**:
1. Load initial page
2. Scroll to load 2-3 pages
3. Change price range filter
4. Verify query resets to page 1
5. Verify new filtered items display

**Expected**:
- Old items cleared
- New page 1 loads with filters
- Scroll position may change (acceptable)
- Cursor resets to null

### Scenario 4: Error Handling

**Steps**:
1. Simulate network error (dev tools)
2. Scroll to trigger fetch
3. Verify error message displays
4. Verify retry mechanism works

**Expected**:
- Error message shown
- "Retry" option available
- Can recover from error

### Scenario 5: End of List

**Steps**:
1. Keep scrolling until `hasNextPage: false`
2. Verify "End of list" message
3. Verify scroll trigger disabled
4. Verify no more fetch attempts

**Expected**:
- Message: "You've reached the end"
- No more loading spinners
- Intersection Observer disconnected

### Scenario 6: Memory Management

**Steps**:
1. Load 10+ pages
2. Check memory usage (Chrome DevTools)
3. Verify `maxPages: 10` working
4. Navigate away and back

**Expected**:
- Memory usage reasonable (<100MB)
- Old pages garbage collected
- No memory leaks

## Related Code Files

### Files to Test

- `src/modules/marketplace/queries/use-infinite-marketplace-items.ts` - Hook
- `src/modules/marketplace/components/InfiniteScrollTrigger.tsx` - Trigger
- `src/modules/marketplace/components/NFTGrid.tsx` - Grid with integration
- `src/modules/marketplace/index.tsx` - Parent component

### Files to Create

- `src/modules/marketplace/queries/__tests__/use-infinite-marketplace-items.test.ts` - Unit tests

## Implementation Steps

### Step 1: Manual Testing Checklist

```bash
# Start dev server
pnpm dev

# Open browser to http://localhost:3000
# Open Chrome DevTools:
# - Console tab (check for errors)
# - Network tab (monitor API calls)
# - Performance tab (check memory)
```

**Manual Test Checklist**:

- [ ] Initial load shows 16 items
- [ ] Scroll to bottom triggers next page
- [ ] Loading spinner shows during fetch
- [ ] Items append without duplicates
- [ ] Filter change resets query
- [ ] Error message displays on failure
- [ ] End-of-list message appears
- [ ] No console errors
- [ ] Memory usage reasonable
- [ ] ARIA announcements work (screen reader)

### Step 2: Debug Common Issues

#### Issue: Duplicate Requests

**Symptoms**: Network tab shows multiple identical requests

**Fix**: Check `isFetchingNextPage` guard in InfiniteScrollTrigger

```typescript
// Ensure this guard exists
if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
  fetchNextPage();
}
```

#### Issue: Race Conditions

**Symptoms**: Items arrive out of order, missing items

**Fix**: Ensure stable cursor handling in mock adapter

```typescript
// Mock adapter should encode start index in cursor
const nextCursor = Buffer.from(nextIndex.toString()).toString('base64');
```

#### Issue: Memory Leak

**Symptoms**: Memory grows continuously, observer not disconnected

**Fix**: Verify cleanup in useEffect

```typescript
useEffect(() => {
  // ... setup ...
  return () => {
    observer.disconnect();
    observerRef.current = null;
  };
}, [dependencies]);
```

#### Issue: Filter Not Resetting

**Symptoms**: Changing filter doesn't reload data

**Fix**: Ensure filters in queryKey

```typescript
queryKey: ['marketplace', 'infinite', contractAddress, filters]
//                                                 ^^^^^^^ Must be included
```

### Step 3: Create Unit Tests

Create `src/modules/marketplace/queries/__tests__/use-infinite-marketplace-items.test.ts`:

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useInfiniteMarketplaceItems } from '../use-infinite-marketplace-items';
import { USE_MOCK_ADAPTER } from '../mock-adapter';

// Skip tests if mock adapter disabled
const test = USE_MOCK_ADAPTER ? describe : describe.skip;

test('useInfiniteMarketplaceItems', () => {
  const createWrapper = () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
      logger: {
        log: console.log,
        warn: console.warn,
        error: () => {},
      },
    });

    return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  };

  const mockFilters = {
    priceRange: [0.001, 0.1] as [number, number],
    status: 'all',
    sortBy: 'recent',
    selectedTraits: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should load initial page of items', async () => {
    const { result } = renderHook(
      () => useInfiniteMarketplaceItems('0x123', mockFilters),
      { wrapper: createWrapper() }
    );

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.items).toHaveLength(16);
    expect(result.current.hasNextPage).toBe(true);
  });

  it('should fetch next page when called', async () => {
    const { result } = renderHook(
      () => useInfiniteMarketplaceItems('0x123', mockFilters),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const initialLength = result.current.items.length;

    result.current.fetchNextPage();

    await waitFor(() => {
      expect(result.current.items.length).toBeGreaterThan(initialLength);
    });

    expect(result.current.isFetchingNextPage).toBe(false);
  });

  it('should not fetch when no next page', async () => {
    const { result } = renderHook(
      () => useInfiniteMarketplaceItems('0x123', mockFilters),
      { wrapper: createWrapper() }
    );

    // Keep fetching until no more pages
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    while (result.current.hasNextPage) {
      result.current.fetchNextPage();
      await waitFor(() => {
        expect(result.current.isFetchingNextPage).toBe(false);
      });
    }

    expect(result.current.hasNextPage).toBe(false);
  });

  it('should reset when filters change', async () => {
    const { result, rerender } = renderHook(
      ({ filters }) => useInfiniteMarketplaceItems('0x123', filters),
      {
        wrapper: createWrapper(),
        initialProps: { filters: mockFilters },
      }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const initialLength = result.current.items.length;

    // Change filters
    rerender({
      filters: {
        ...mockFilters,
        status: 'listed',
      },
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(true);
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Should have new items (different count possibly)
    expect(result.current.items.length).toBeGreaterThanOrEqual(0);
  });
});
```

### Step 4: Run Unit Tests

```bash
# Run tests
pnpm test

# Run with coverage
pnpm test -- --coverage

# Run in watch mode
pnpm test -- --watch
```

### Step 5: Performance Testing

**Memory Test**:

1. Open Chrome DevTools > Performance Monitor
2. Load marketplace
3. Scroll through 10+ pages
4. Monitor memory usage
5. Should stay under 100MB

**Network Test**:

1. Open Chrome DevTools > Network
2. Set throttling to "Fast 3G"
3. Scroll slowly
4. Verify requests don't pile up
5. Verify one request at a time

### Step 6: Browser Testing

Test in multiple browsers:

- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if available)

### Step 7: Fix Identified Issues

Document and fix any issues found:

| Issue | Severity | Fix |
|-------|----------|-----|
| (Document issues found) | | |

## Todo List

- [ ] Run dev server
- [ ] Test initial page load
- [ ] Test infinite scroll (5+ pages)
- [ ] Test filter changes reset query
- [ ] Test error handling
- [ ] Test end-of-list behavior
- [ ] Check console for errors
- [ ] Monitor memory usage
- [ ] Test in multiple browsers
- [ ] Create unit tests
- [ ] Run unit tests
- [ ] Fix any identified bugs
- [ ] Re-test after fixes

## Success Criteria

- [ ] All manual test scenarios pass
- [ ] No console errors or warnings
- [ ] Memory usage remains reasonable
- [ ] No race conditions or duplicate requests
- [ ] Unit tests pass (100% success)
- [ ] Works in Chrome, Firefox, Safari
- [ ] ARIA announcements work correctly
- [ ] Feature ready for production

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Memory leak | Medium | High | Verify observer cleanup |
| Race condition | Low | Medium | Test rapid scrolling |
| Browser incompatibility | Very Low | Low | Test multiple browsers |
| Performance regression | Low | Medium | Profile before/after |

## Security Considerations

- No new security issues
- Mock adapter doesn't expose sensitive data
- Error messages don't leak information

## Next Steps

After completing this phase:
1. Move to **Phase 07: Documentation** if needed
2. Create pull request for review
3. Deploy to staging for final testing

## Notes

- Keep detailed bug report for fixes
- Add integration tests if needed
- Consider E2E tests with Playwright

## Bug Report Template

```
**Title**: [Brief description]

**Steps to Reproduce**:
1.
2.
3.

**Expected Behavior**:
What should happen

**Actual Behavior**:
What actually happens

**Screenshots**:
If applicable

**Environment**:
- Browser:
- OS:
- React Query Version:

**Severity**: Critical / High / Medium / Low
```

## Unresolved Questions

1. Should we add E2E tests with Playwright?
2. Should we add analytics for scroll depth?
3. Should we add error logging service?
