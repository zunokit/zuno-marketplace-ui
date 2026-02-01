---
title: "Phase 05: State Persistence Layer"
description: "Implement localStorage persistence for collection creation state with resume capability"
status: pending
priority: P0
effort: 4-6h
dependencies: ["Phase 01", "Phase 02", "Phase 03"]
parallel_group: B
---

# Phase 05: State Persistence Layer

## Context Links
- Parent Plan: [plan.md](./plan.md)
- Brainstorm: [brainstorm-260201-1112-create-collection-comprehensive-flow.md](../../reports/brainstorm-260201-1112-create-collection-comprehensive-flow.md)
- Research: [researcher-error-handling-patterns-report.md](../../reports/researcher-error-handling-patterns-report.md)

## Parallelization Info
- **Can Run Concurrently With:** Phase 04 (UI Error Handling)
- **Must Complete Before:** Phase 12 (Enhanced Hook)
- **File Dependencies:** None (creates new files)

## Overview

| Attribute | Value |
|-----------|-------|
| Priority | P0 |
| Effort | 4-6 hours |
| Status | pending |
| Review Status | not started |

Implement localStorage persistence for collection creation state, enabling recovery after browser refresh and resume capability.

## Key Insights

1. TTL support prevents stale data accumulation
2. Zod validation ensures data integrity
3. Hydration state prevents SSR issues
4. 24-hour TTL balances UX with data freshness

## Requirements

### Functional Requirements
- Save creation progress to localStorage
- Restore state after browser refresh
- TTL-based automatic expiration
- Schema validation for type safety
- Clear progress on completion/failure

### Non-Functional Requirements
- localStorage quota awareness
- SSR-safe (check for window)
- No sensitive data storage

## Architecture

```
src/shared/utils/
├── storage.ts                    # Storage utilities
└── index.ts                      # Update exports

src/shared/hooks/
├── use-persisted-creation.ts     # Persistence hook
└── index.ts                      # Update exports
```

## Related Code Files

### Files to Create
1. `src/shared/utils/storage.ts` (NEW)
2. `src/shared/hooks/use-persisted-creation.ts` (NEW)

### Files to Modify
1. `src/shared/utils/index.ts` - Add export
2. `src/shared/hooks/index.ts` - Add export

## File Ownership

| File | Owner | Purpose |
|------|-------|---------|
| `src/shared/utils/storage.ts` | Phase 02 | Storage utilities |
| `src/shared/hooks/use-persisted-creation.ts` | Phase 02 | Persistence hook |

## Implementation Steps

### Step 1: Create Storage Utilities

Create `src/shared/utils/storage.ts`:

```typescript
/**
 * Storage Utilities
 * Type-safe localStorage wrapper with validation
 */

const STORAGE_PREFIX = 'zuno_collection_';

export interface StorageOptions<T> {
  key: string;
  schema: {
    parse: (data: unknown) => T;
  };
  ttl?: number;
}

export class StorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StorageError';
  }
}

export function saveToStorage<T>(key: string, data: T, ttl?: number): void {
  if (typeof window === 'undefined') return;

  try {
    const item = {
      data,
      timestamp: Date.now(),
      ttl,
    };
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(item));
  } catch (error) {
    throw new StorageError(`Failed to save: ${error instanceof Error ? error.message : 'Unknown'}`);
  }
}

export function loadFromStorage<T>(options: StorageOptions<T>): T | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${options.key}`);
    if (!raw) return null;

    const parsed = JSON.parse(raw);

    if (parsed.ttl && Date.now() - parsed.timestamp > parsed.ttl) {
      removeFromStorage(options.key);
      return null;
    }

    return options.schema.parse(parsed.data);
  } catch (error) {
    console.error('Storage load error:', error);
    return null;
  }
}

export function removeFromStorage(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
}

export function hasStorageItem(key: string): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(`${STORAGE_PREFIX}${key}`) !== null;
}

export function getStorageItemAge(key: string): number | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    return Date.now() - (parsed.timestamp || 0);
  } catch {
    return null;
  }
}
```

### Step 2: Create Persistence Hook

Create `src/shared/hooks/use-persisted-creation.ts`:

```typescript
'use client';

import { useState, useEffect, useCallback } from 'react';
import { z } from 'zod';
import { saveToStorage, loadFromStorage, removeFromStorage } from '@/shared/utils/storage';
import type { MintTerminalCreateForm } from '@/shared/types/mint';

export type CreationStatus =
  | 'IDLE'
  | 'UPLOADING_MEDIA'
  | 'CREATING_DB_RECORD'
  | 'ADDING_ALLOWLIST'
  | 'DEPLOYING_CONTRACT'
  | 'UPDATING_DB'
  | 'COMPLETED'
  | 'FAILED';

export interface PersistedCreationState {
  currentStep: CreationStatus;
  collectionId: string | null;
  formData: Partial<MintTerminalCreateForm>;
  stepResults: {
    imageUrl?: string;
    bannerUrl?: string;
    contractAddress?: string;
    txHash?: string;
  };
  lockedChain: string | null;
  failedAt: CreationStatus | null;
  errorMessage: string | null;
  timestamp: number;
}

const PersistedStateSchema = z.object({
  currentStep: z.enum([
    'IDLE', 'UPLOADING_MEDIA', 'CREATING_DB_RECORD', 'ADDING_ALLOWLIST',
    'DEPLOYING_CONTRACT', 'UPDATING_DB', 'COMPLETED', 'FAILED'
  ]),
  collectionId: z.string().nullable(),
  formData: z.record(z.unknown()).default({}),
  stepResults: z.object({
    imageUrl: z.string().optional(),
    bannerUrl: z.string().optional(),
    contractAddress: z.string().optional(),
    txHash: z.string().optional(),
  }).default({}),
  lockedChain: z.string().nullable(),
  failedAt: z.enum([
    'IDLE', 'UPLOADING_MEDIA', 'CREATING_DB_RECORD', 'ADDING_ALLOWLIST',
    'DEPLOYING_CONTRACT', 'UPDATING_DB', 'COMPLETED', 'FAILED'
  ]).nullable(),
  errorMessage: z.string().nullable(),
  timestamp: z.number(),
});

const STORAGE_KEY = 'creation_state';
const STORAGE_TTL = 24 * 60 * 60 * 1000; // 24 hours

export function usePersistedCreation() {
  const [state, setState] = useState<PersistedCreationState | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const saved = loadFromStorage({
      key: STORAGE_KEY,
      schema: PersistedStateSchema,
    });

    if (saved) {
      setState(saved);
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (state && isHydrated) {
      saveToStorage(STORAGE_KEY, state, STORAGE_TTL);
    }
  }, [state, isHydrated]);

  const saveProgress = useCallback((update: Partial<PersistedCreationState>) => {
    setState(prev => ({
      ...prev ?? {
        currentStep: 'IDLE',
        collectionId: null,
        formData: {},
        stepResults: {},
        lockedChain: null,
        failedAt: null,
        errorMessage: null,
        timestamp: Date.now(),
      },
      ...update,
      timestamp: Date.now(),
    }));
  }, []);

  const clearProgress = useCallback(() => {
    removeFromStorage(STORAGE_KEY);
    setState(null);
  }, []);

  const canResume = useCallback((): boolean => {
    if (!state) return false;
    if (state.currentStep === 'COMPLETED') return false;
    if (state.currentStep === 'IDLE') return false;
    return true;
  }, [state]);

  const getResumeStep = useCallback((): CreationStatus => {
    if (!canResume()) return 'IDLE';
    return state?.failedAt ?? state?.currentStep ?? 'IDLE';
  }, [canResume, state]);

  return {
    state,
    isHydrated,
    saveProgress,
    clearProgress,
    canResume: canResume(),
    resumeStep: getResumeStep(),
  };
}
```

### Step 3: Update Barrel Exports

Update `src/shared/utils/index.ts`:
```typescript
export * from './storage';
```

Update `src/shared/hooks/index.ts`:
```typescript
export { usePersistedCreation } from './use-persisted-creation';
```

## Todo List

- [ ] Create `src/shared/utils/storage.ts`
- [ ] Create `src/shared/hooks/use-persisted-creation.ts`
- [ ] Update barrel exports
- [ ] Test persistence in browser
- [ ] Verify TTL expiration

## Success Criteria

- [ ] Storage utilities handle serialization/deserialization
- [ ] TTL support for automatic expiration
- [ ] Zod schema validation for type safety
- [ ] Hook provides save/clear/resume functionality
- [ ] Hydration state to prevent SSR issues
- [ ] TypeScript compiles without errors

## Conflict Prevention

This phase creates new files only, in different directories than Phase 01. No file overlap.

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| localStorage quota exceeded | Low | Medium | Implement size checks |
| SSR hydration mismatch | Medium | High | Use 'use client' and isHydrated flag |
| Zod schema mismatch | Low | High | Keep schema in sync with types |

## Security Considerations

- Never store wallet private keys
- No JWT tokens in localStorage
- Form data may contain PII - consider encryption for production

## Next Steps

After completion:
1. Phase 01 can proceed in parallel
2. Phase 05 depends on this phase
3. Review and merge before Phase 05 starts
