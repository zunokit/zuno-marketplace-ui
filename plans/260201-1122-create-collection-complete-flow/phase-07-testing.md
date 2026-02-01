---
title: "Phase 07: Testing & Validation"
description: "Unit tests and integration tests for collection creation flow"
status: pending
priority: P2
effort: 12-16h
dependencies: ["Phase 01", "Phase 02", "Phase 03", "Phase 04", "Phase 05", "Phase 06"]
parallel_group: E
---

# Phase 07: Testing & Validation

## Context Links
- Parent Plan: [plan.md](./plan.md)
- Brainstorm: [brainstorm-260201-1112-create-collection-comprehensive-flow.md](../../reports/brainstorm-260201-1112-create-collection-comprehensive-flow.md)
- Depends On: All implementation phases (01-06)

## Parallelization Info
- **Can Run Concurrently With:** None
- **Must Complete Before:** None (final phase)
- **File Dependencies:** All previous phases

## Overview

| Attribute | Value |
|-----------|-------|
| Priority | P2 |
| Effort | 12-16 hours |
| Status | pending |
| Review Status | not started |

Comprehensive testing for the collection creation flow including unit tests for hooks and integration tests for end-to-end flow.

## Key Insights

1. Unit tests verify individual hook behavior
2. Integration tests verify complete flow
3. Mock Web3 interactions for reliability
4. Test error scenarios and recovery

## Requirements

### Functional Requirements
- Unit tests for useCreateCollection hook
- Integration tests for end-to-end flow
- Error scenario testing
- Retry logic testing
- State persistence testing

### Non-Functional Requirements
- >80% test coverage
- Fast test execution
- Reliable mocks
- Clear test descriptions

## Architecture

```
__tests__/
├── useCreateCollection.test.ts   # Unit tests
└── collection-creation.integration.test.ts  # Integration tests
```

## Related Code Files

### Files to Create
1. `__tests__/useCreateCollection.test.ts` (NEW)
2. `__tests__/collection-creation.integration.test.ts` (NEW)

## File Ownership

| File | Owner | Purpose |
|------|-------|---------|
| `__tests__/useCreateCollection.test.ts` | Phase 07 | Unit tests |
| `__tests__/collection-creation.integration.test.ts` | Phase 07 | Integration tests |

## Implementation Steps

### Step 1: Create Unit Tests

Create `__tests__/useCreateCollection.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useCreateCollection } from '@/modules/launch-pad/create-form/hooks/useCreateCollection';

vi.mock('wagmi');
vi.mock('next/navigation');
vi.mock('@/shared/hooks/useAuth');
vi.mock('zuno-marketplace-sdk/react');

describe('useCreateCollection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should complete all 5 steps successfully', async () => {
    const { result } = renderHook(() => useCreateCollection());

    const formData = {
      name: 'Test Collection',
      symbol: 'TEST',
      artworkMode: 'ERC721',
      chain: 'sepolia',
      mintStartAt: new Date().toISOString(),
      agreeTos: true,
    } as const;

    await act(async () => {
      await result.current.submit(formData);
    });

    await waitFor(() => {
      expect(result.current.state).toBe('COMPLETED');
    });
  });

  it('should handle media upload failure with retry', async () => {
    const mockUpload = vi.fn()
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce('https://cdn.example.com/image.jpg');

    vi.mocked(useMediaUpload).mockReturnValue({
      uploadFile: mockUpload,
      uploading: false,
      progress: 0,
      error: null,
      reset: vi.fn(),
    });

    const { result } = renderHook(() => useCreateCollection());

    const formData = {
      name: 'Test Collection',
      symbol: 'TEST',
      artworkMode: 'ERC721',
      chain: 'sepolia',
      mintStartAt: new Date().toISOString(),
      agreeTos: true,
      collectionImage: new File([''], 'test.jpg', { type: 'image/jpeg' }),
    } as const;

    await act(async () => {
      await result.current.submit(formData);
    });

    expect(mockUpload).toHaveBeenCalledTimes(2);
  });

  it('should handle user rejection during deployment', async () => {
    const mockDeploy = vi.fn().mockRejectedValue(new Error('User rejected'));

    vi.mocked(useCollection).mockReturnValue({
      createERC721: { mutateAsync: mockDeploy },
    } as any);

    const { result } = renderHook(() => useCreateCollection());

    await act(async () => {
      await result.current.submit(mockFormData);
    });

    expect(result.current.failedStep).toBe('DEPLOY_CONTRACT');
    expect(result.current.error?.code).toBe('USER_REJECTION');
  });

  it('should allow retry after deployment failure', async () => {
    const mockDeploy = vi.fn()
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce({ address: '0x123...', tx: { hash: '0xabc...' } });

    const { result } = renderHook(() => useCreateCollection());

    await act(async () => {
      await result.current.submit(mockFormData);
    });

    expect(result.current.failedStep).toBe('DEPLOY_CONTRACT');

    await act(async () => {
      await result.current.retry();
    });

    expect(result.current.state).toBe('COMPLETED');
  });

  it('should persist state to localStorage', async () => {
    const { result } = renderHook(() => useCreateCollection());

    await act(async () => {
      await result.current.submit(mockFormData);
    });

    const saved = localStorage.getItem('zuno_collection_creation_state');
    expect(saved).toBeTruthy();
    expect(JSON.parse(saved!).currentStep).toBeDefined();
  });
});
```

### Step 2: Create Integration Tests

Create `__tests__/collection-creation.integration.test.ts`:

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { ApolloProvider } from '@apollo/client';
import { WagmiProvider } from 'wagmi';
import { createConfig } from 'wagmi';
import { http } from 'viem';
import { mainnet, sepolia } from 'viem/chains';

const testConfig = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

describe('Collection Creation Integration', () => {
  it('should create collection end-to-end', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <WagmiProvider config={testConfig}>
        <ApolloProvider client={testClient}>
          {children}
        </ApolloProvider>
      </WagmiProvider>
    );

    const { result } = renderHook(() => useCreateCollection(), { wrapper });

    const formData = generateValidFormData();

    await act(async () => {
      await result.current.submit(formData);
    });

    await waitFor(() => {
      expect(result.current.state).toBe('COMPLETED');
      expect(result.current.context.contractAddress).toBeTruthy();
    }, { timeout: 60000 });
  });

  it('should handle partial failure and allow recovery', async () => {
    const { result } = renderHook(() => useCreateCollection());

    blockchain.simulateFailure('deploy');

    await act(async () => {
      await result.current.submit(formData);
    });

    expect(result.current.state).toBe('FAILED');

    blockchain.reset();

    await act(async () => {
      await result.current.retry();
    });

    expect(result.current.state).toBe('COMPLETED');
  });

  it('should resume from persisted state after refresh', async () => {
    const { result, unmount } = renderHook(() => useCreateCollection());

    await act(async () => {
      await result.current.submit(formData);
    });

    unmount();

    const { result: newResult } = renderHook(() => useCreateCollection());

    expect(newResult.current.canResume).toBe(true);
  });
});
```

## Todo List

- [ ] Create `__tests__/useCreateCollection.test.ts`
- [ ] Create `__tests__/collection-creation.integration.test.ts`
- [ ] Set up test mocks
- [ ] Run tests and verify coverage
- [ ] Fix any failing tests

## Success Criteria

- [ ] Unit tests cover all error scenarios
- [ ] Integration tests verify end-to-end flow
- [ ] Retry logic tested
- [ ] Persistence tested
- [ ] Gas estimation tested
- [ ] >80% test coverage
- [ ] All tests passing

## Conflict Prevention

This phase creates test files only. No conflicts with implementation phases.

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Flaky tests | Medium | Medium | Proper mocking |
| Slow test execution | Medium | Low | Parallel execution |
| Coverage gaps | Low | Medium | Coverage reports |

## Security Considerations

- No real private keys in tests
- Mock all external API calls

## Next Steps

After completion:
1. All phases complete
2. Final review and merge
3. Deploy to staging
