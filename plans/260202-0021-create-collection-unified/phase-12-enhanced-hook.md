---
title: "Phase 12: Enhanced Create Collection Hook"
description: "Refactor useCreateCollection with error handling, persistence, gas checks, and state machine"
status: pending
priority: P0
effort: 10-12h
dependencies: ["Phase 01", "Phase 02", "Phase 03", "Phase 04", "Phase 05", "Phase 06", "Phase 07"]
parallel_group: D
---

# Phase 12: Enhanced Create Collection Hook

## Context Links
- Parent Plan: [plan.md](./plan.md)
- Brainstorm: [brainstorm-260201-1112-create-collection-comprehensive-flow.md](../../reports/brainstorm-260201-1112-create-collection-comprehensive-flow.md)
- Depends On:
  - [Phase 04: UI Error Handling](./phase-04-ui-error-handling.md)
  - [Phase 05: State Persistence](./phase-05-state-persistence.md)
  - [Phase 06: Gas Estimation](./phase-06-gas-estimation.md)
  - [Phase 07: State Machine](./phase-07-transaction-state-machine.md)

## Parallelization Info
- **Can Run Concurrently With:** None
- **Must Complete Before:** Phase 16 (UI Components)
- **File Dependencies:** All previous phases

## Overview

| Attribute | Value |
|-----------|-------|
| Priority | P0 |
| Effort | 10-12 hours |
| Status | pending |
| Review Status | not started |

Refactor the existing `useCreateCollection` hook to integrate all infrastructure: error handling, state persistence, gas estimation, and state machine.

## Key Insights

1. Hook orchestrates all 5 steps with proper error handling
2. State machine provides clear state transitions
3. Persistence enables recovery after refresh
4. Gas estimation prevents failed deployments

## Requirements

### Functional Requirements
- Integrate all 5 steps with error handling
- Retry logic for recoverable failures
- State persistence to localStorage
- Gas estimation before deployment
- Transaction replacement handling

### Non-Functional Requirements
- Maintain backward compatibility
- Clean separation of concerns
- Proper TypeScript types

## Architecture

```
src/modules/launch-pad/create-form/hooks/
└── useCreateCollection.ts        # REFACTORED
```

## Related Code Files

### Files to Modify
1. `src/modules/launch-pad/create-form/hooks/useCreateCollection.ts` (REFACTOR)

## File Ownership

| File | Owner | Purpose |
|------|-------|---------|
| `src/modules/launch-pad/create-form/hooks/useCreateCollection.ts` | Phase 05 | Main orchestration hook |

## Implementation Steps

### Step 1: Refactor useCreateCollection

Refactor `src/modules/launch-pad/create-form/hooks/useCreateCollection.ts`:

```typescript
'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/shared/hooks/useAuth';
import { useMediaUpload } from '@/shared/hooks/useMediaUpload';
import { useRecovery } from '@/shared/hooks/use-recovery';
import { usePersistedCreation } from '@/shared/hooks/use-persisted-creation';
import { useGasEstimation } from '@/shared/hooks/use-gas-estimation';
import { useTransactionState } from '@/shared/hooks/use-transaction-state';
import { CreationMachine } from '@/shared/machines/creation-machine';
import {
  useCreateCollectionMutation,
  useAddToAllowlistMutation,
  useUpdateCollectionMutation,
} from '@/shared/graphql';
import {
  CollectionError,
  MediaUploadError,
  DatabaseError,
  DeploymentError,
  UserRejectionError,
  getCollectionErrorMessage,
  isRecoverableError,
} from '@/shared/errors/collection-errors';
import type { MintTerminalCreateForm } from '@/shared/types/mint';
import type { CreateCollectionInput, ApiTokenStandard } from '@/shared/types/collection';
import { useCollection } from 'zuno-marketplace-sdk/react';
import type { CollectionParams } from 'zuno-marketplace-sdk';
import { durationToSeconds } from '@/shared/utils/time';

const CHAIN_ID_MAP: Record<string, string> = {
  sepolia: 'eip155:11155111',
  ethereum: 'eip155:1',
  polygon: 'eip155:137',
  bsc: 'eip155:56',
  anvil: 'eip155:31337',
};

export type StepStatus = 'pending' | 'loading' | 'success' | 'error';

interface CreateCollectionState {
  step1Status: StepStatus;
  step2Status: StepStatus;
  step3Status: StepStatus;
  step4Status: StepStatus;
  step5Status: StepStatus;
  collectionId: string | null;
  contractAddress: string | null;
  txHash: string | null;
  error: string | null;
}

export function useCreateCollection() {
  const router = useRouter();
  const { address } = useAccount();
  const chainId = useChainId();
  const { isAuthenticated } = useAuth();
  const { uploadFile } = useMediaUpload();

  const [createCollectionMutation] = useCreateCollectionMutation();
  const [addToAllowlistMutation] = useAddToAllowlistMutation();
  const [updateCollectionMutation] = useUpdateCollectionMutation();

  const sdkCollection = useCollection();
  const machineRef = useRef(new CreationMachine());
  const machine = machineRef.current;

  const recovery = useRecovery({
    maxRetries: 3,
    onRetry: (step, attempt) => {
      toast.info(`Retrying ${step} (attempt ${attempt})...`);
    },
  });

  const persistence = usePersistedCreation();
  const gasEstimation = useGasEstimation({ chainId: chainId ?? 1 });
  const txState = useTransactionState({
    onSuccess: (hash) => toast.success(`Transaction confirmed: ${hash.slice(0, 10)}...`),
    onReplaced: () => toast.info('Transaction was sped up'),
  });

  // Sync machine state with persistence
  useEffect(() => {
    const unsubscribe = machine.subscribe((state, context) => {
      persistence.saveProgress({
        currentStep: state,
        collectionId: context.collectionId,
        stepResults: {
          imageUrl: context.imageUrl ?? undefined,
          contractAddress: context.contractAddress ?? undefined,
          txHash: context.txHash ?? undefined,
        },
      });
    });
    return unsubscribe;
  }, [machine, persistence]);

  // Step 1: Upload Media
  const uploadMedia = useCallback(async (formData: MintTerminalCreateForm) => {
    if (!formData.collectionImage) {
      return { imageUrl: undefined, bannerUrl: undefined };
    }

    const operation = async () => {
      const imageUrl = await uploadFile(formData.collectionImage!);
      const bannerUrl = formData.bannerImage
        ? await uploadFile(formData.bannerImage)
        : undefined;
      return { imageUrl, bannerUrl };
    };

    try {
      return await operation();
    } catch (error) {
      if (isRecoverableError(error)) {
        return await recovery.retry('UPLOAD_MEDIA', operation);
      }
      throw new MediaUploadError(error instanceof Error ? error.message : 'Upload failed');
    }
  }, [uploadFile, recovery]);

  // Step 2: Create DB Record
  const createDbRecord = useCallback(async (
    formData: MintTerminalCreateForm,
    imageUrl?: string,
    bannerUrl?: string
  ) => {
    const chainId = CHAIN_ID_MAP[formData.chain] || 'eip155:31337';
    const tokenStandard: ApiTokenStandard =
      formData.artworkMode === 'ERC721' ? 'ERC721' : 'ERC1155';

    const stage = formData.stages?.[0];
    const allowlistAddresses = stage?.presale?.allowlistAddresses || [];
    const mintStartTime = formData.mintStartAt
      ? new Date(formData.mintStartAt)
      : new Date();

    let allowlistStageEnd: string | undefined;
    let allowlistStageDurationSeconds: number | undefined;

    if (stage?.presale?.duration && allowlistAddresses.length > 0) {
      allowlistStageDurationSeconds = durationToSeconds(stage.presale.duration);
      allowlistStageEnd = new Date(
        mintStartTime.getTime() + allowlistStageDurationSeconds * 1000
      ).toISOString();
    }

    const input: CreateCollectionInput = {
      name: formData.name,
      symbol: formData.symbol,
      description: formData.description || '',
      chainId,
      tokenStandard,
      deployerAddress: address!,
      imageUrl: imageUrl || '',
      bannerUrl,
      baseUri: formData.metadataBaseUrl || `https://metadata.example.com/${formData.symbol}/`,
      maxSupply: formData.maxSupply ? Number(formData.maxSupply) : 10000,
      mintPriceAllowlist: stage?.presale?.price || '0',
      mintPricePublic: stage?.public?.price || formData.mintPrice || '0',
      mintStartTime: mintStartTime.toISOString(),
      allowlistStageEnd,
      mintLimitPerWallet: formData.mintLimitPerWallet || 10,
      royaltyFeeBps: formData.royaltyPercent ? formData.royaltyPercent * 100 : 500,
      royaltyRecipient: address!,
    };

    const result = await createCollectionMutation({ variables: { input } });

    if (!result.data?.createCollection) {
      throw new DatabaseError('Failed to create collection', true);
    }

    return result.data.createCollection.id;
  }, [address, createCollectionMutation]);

  // Step 3: Add Allowlist
  const addAllowlist = useCallback(async (
    collectionId: string,
    formData: MintTerminalCreateForm
  ) => {
    const stage = formData.stages?.[0];
    const allowlistAddresses = stage?.presale?.allowlistAddresses || [];

    if (allowlistAddresses.length === 0) return;

    const maxMintAmount = formData.mintLimitPerWallet || 10;

    await addToAllowlistMutation({
      variables: {
        input: {
          collectionId,
          walletAddresses: allowlistAddresses,
          maxMintAmount,
        },
      },
    });
  }, [addToAllowlistMutation]);

  // Step 4: Deploy Contract
  const deployContract = useCallback(async (
    formData: MintTerminalCreateForm,
    collectionId: string
  ) => {
    // Pre-flight gas check
    await gasEstimation.estimateGas();

    txState.startTransaction();

    try {
      const stage = formData.stages?.[0];
      const publicPrice = stage?.public?.price || formData.mintPrice || '0';
      const allowlistPrice = stage?.presale?.price || publicPrice;
      const allowlistAddresses = stage?.presale?.allowlistAddresses || [];

      const collectionParams: CollectionParams = {
        name: formData.name,
        symbol: formData.symbol,
        description: formData.description || '',
        mintPrice: publicPrice,
        royaltyFee: Math.round((formData.royaltyPercent || 0) * 100),
        maxSupply: formData.maxSupply || 10000,
        mintLimitPerWallet: formData.mintLimitPerWallet || 0,
        allowlistMintPrice: allowlistPrice,
        publicMintPrice: publicPrice,
        allowlistStageDuration: allowlistAddresses.length > 0
          ? (stage?.presale?.duration ? durationToSeconds(stage.presale.duration) : 0)
          : 0,
        tokenURI: formData.metadataBaseUrl || '',
      };

      const deployResult = formData.artworkMode === 'ERC721'
        ? await sdkCollection.createERC721.mutateAsync(collectionParams)
        : await sdkCollection.createERC1155.mutateAsync(collectionParams);

      txState.setSubmitted(deployResult.tx.hash, deployResult.tx.nonce);

      // Add to blockchain allowlist if needed
      if (allowlistAddresses.length > 0) {
        await sdkCollection.addToAllowlist.mutateAsync({
          collectionAddress: deployResult.address,
          addresses: allowlistAddresses,
        });
        await sdkCollection.setAllowlistOnly.mutateAsync({
          collectionAddress: deployResult.address,
          enabled: true,
        });
      }

      return deployResult;
    } catch (error) {
      txState.setFailed(error instanceof Error ? error : new Error('Deployment failed'));

      if (error instanceof Error && error.message.includes('rejected')) {
        throw new UserRejectionError();
      }
      throw new DeploymentError(error instanceof Error ? error.message : 'Deployment failed');
    }
  }, [sdkCollection, gasEstimation, txState]);

  // Step 5: Update DB
  const updateDbRecord = useCallback(async (
    collectionId: string,
    contractAddress: string
  ) => {
    await updateCollectionMutation({
      variables: {
        id: collectionId,
        input: {
          contractAddress,
          status: 'DEPLOYED' as const,
        },
      },
    });
  }, [updateCollectionMutation]);

  // Main submit function
  const submit = useCallback(async (formData: MintTerminalCreateForm) => {
    if (!isAuthenticated) {
      toast.error('Please sign in first');
      return;
    }
    if (!address) {
      toast.error('Wallet not connected');
      return;
    }

    machine.transition({ type: 'START' });

    try {
      // Step 1
      const { imageUrl, bannerUrl } = await uploadMedia(formData);
      machine.transition({ type: 'MEDIA_UPLOADED', imageUrl: imageUrl!, bannerUrl });

      // Step 2
      const collectionId = await createDbRecord(formData, imageUrl, bannerUrl);
      machine.transition({ type: 'DB_RECORD_CREATED', collectionId });

      // Step 3
      await addAllowlist(collectionId, formData);
      machine.transition({ type: 'ALLOWLIST_ADDED' });

      // Step 4
      const { address: contractAddress, tx } = await deployContract(formData, collectionId);
      machine.transition({
        type: 'CONTRACT_DEPLOYED',
        contractAddress,
        txHash: tx.hash,
      });

      // Step 5
      await updateDbRecord(collectionId, contractAddress);
      machine.transition({ type: 'DB_UPDATED' });

      // Success
      persistence.clearProgress();
      toast.success('Collection deployed successfully!');
      router.push('/my-collections');
    } catch (error) {
      const message = getCollectionErrorMessage(error);
      toast.error(message);

      if (error instanceof CollectionError) {
        recovery.setFailure(error, error.step);
        machine.transition({
          type: `${error.step}_FAILED` as any,
          error,
        });
      }
    }
  }, [
    isAuthenticated,
    address,
    machine,
    uploadMedia,
    createDbRecord,
    addAllowlist,
    deployContract,
    updateDbRecord,
    persistence,
    recovery,
    router,
  ]);

  const retry = useCallback(async () => {
    if (!recovery.canRetry || !recovery.failedStep) return;

    // Retry logic based on failed step
    toast.info(`Retrying from ${recovery.failedStep}...`);
    // Implementation depends on which step failed
  }, [recovery]);

  const reset = useCallback(() => {
    machine.transition({ type: 'RESET' });
    persistence.clearProgress();
    recovery.reset();
    txState.reset();
  }, [machine, persistence, recovery, txState]);

  return {
    state: machine.currentState,
    context: machine.currentContext,
    submit,
    retry,
    reset,
    isProcessing: !machine.isTerminal && machine.currentState !== 'IDLE',
    canRetry: recovery.canRetry,
    failedStep: recovery.failedStep,
    error: recovery.error,
    gasEstimate: gasEstimation.formattedCost,
    txStatus: txState.status,
    txHash: txState.hash,
  };
}
```

## Todo List

- [ ] Refactor `useCreateCollection.ts`
- [ ] Integrate error handling
- [ ] Add persistence sync
- [ ] Add gas estimation
- [ ] Add state machine
- [ ] Test all 5 steps
- [ ] Run TypeScript check

## Success Criteria

- [ ] All 5 steps integrated with error handling
- [ ] Retry logic works for recoverable steps
- [ ] State persisted to localStorage
- [ ] Gas estimation runs before deployment
- [ ] Transaction replacement handled
- [ ] TypeScript compiles without errors

## Conflict Prevention

This phase modifies the main hook. Must wait for all infrastructure phases (01-04) to complete.

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Breaking changes | Medium | High | Maintain return type compatibility |
| Integration issues | Medium | High | Test each integration point |
| Performance degradation | Low | Medium | Memoize callbacks |

## Security Considerations

- Validate all addresses before use
- Check authentication before operations
- No sensitive data in persistence

## Next Steps

After completion:
1. Phase 06 (UI Components) can proceed
2. Review and merge before Phase 06 starts
