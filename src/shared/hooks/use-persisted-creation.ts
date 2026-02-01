'use client';

import { useState, useEffect, useCallback } from 'react';
import { z } from 'zod';
import { saveToStorage, loadFromStorage, removeFromStorage, type StorageOptions } from '@/shared/utils/storage';
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
  formData: z.record(z.string(), z.unknown()).default({}),
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
    } as StorageOptions<PersistedCreationState>);

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
