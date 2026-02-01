# Brainstorm: Complete Create Collection Logic

## Executive Summary

This document outlines comprehensive create collection flow covering happy paths, edge cases, error handling, and clean code architecture for the Zuno Marketplace ecosystem.

---

## Current Architecture Overview

### 5-Step Creation Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Step 1     │───▶│  Step 2     │───▶│  Step 3     │───▶│  Step 4     │───▶│  Step 5     │
│Upload Media │    │Create DB    │    │Add Allowlist│    │Deploy       │    │Update DB    │
│             │    │Record       │    │(Optional)   │    │Contract     │    │w/ Address   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

### Project Dependencies

| Project | Role in Create Collection |
|---------|---------------------------|
| zuno-marketplace-ui | Form UI, GraphQL client, SDK integration |
| zuno-marketplace-sdk | Contract deployment, blockchain interactions |
| zuno-marketplace-api | GraphQL gateway, collection service (DB) |
| zuno-marketplace-indexer | Event indexing, collection verification |

---

## Happy Path Flow

### Step 1: Upload Media
**Input:** Collection image (File), banner image (optional File)
**Output:** imageUrl, bannerUrl (CDN URLs)

**Success Criteria:**
- File size < 10MB
- Valid image format (jpg, png, gif, webp)
- Upload returns accessible URL

### Step 2: Create Database Record
**Input:** Collection metadata (name, symbol, description, etc.)
**Output:** collectionId (UUID)

**Success Criteria:**
- GraphQL mutation returns valid collection object
- Status set to "PENDING"
- Slug generated from name (unique)

### Step 3: Add Allowlist (Optional)
**Input:** Array of wallet addresses, maxMintAmount
**Output:** Success boolean

**Conditions:**
- Only if presale stage configured
- Max 5000 addresses
- Validates all addresses are valid EVM format

### Step 4: Deploy Smart Contract
**Input:** CollectionParams (SDK)
**Output:** contractAddress, txHash

**Success Criteria:**
- Transaction confirmed on blockchain
- Contract address extracted from event logs
- Factory emits CollectionCreated event

### Step 5: Update Database
**Input:** contractAddress, status="DEPLOYED"
**Output:** Updated collection record

---

## Edge Cases & Error Handling

### Edge Case 1: Media Upload Failure

**Scenario:** User's image upload fails (network error, file too large)

**Current Behavior:** Step 1 fails, entire process stops

**Recommended Improvements:**
```typescript
// Add retry logic with exponential backoff
const uploadWithRetry = async (file: File, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await uploadFile(file);
    } catch (err) {
      if (i === maxRetries - 1) throw err;
      await delay(Math.pow(2, i) * 1000); // 1s, 2s, 4s
    }
  }
};

// Allow proceeding without image (use placeholder)
const imageUrl = formData.collectionImage
  ? await uploadWithRetry(formData.collectionImage)
  : getDefaultCollectionImage();
```

### Edge Case 2: Duplicate Collection Name

**Scenario:** User tries to create collection with existing name

**Current Behavior:** API returns error

**Recommended Improvements:**
```typescript
// Pre-validate name availability
const checkNameAvailability = async (name: string) => {
  const { data } = await client.query({
    query: CHECK_COLLECTION_NAME,
    variables: { name }
  });
  return data.isNameAvailable;
};

// Auto-generate unique slug
const generateUniqueSlug = (name: string, existingSlugs: string[]) => {
  let slug = slugify(name);
  let counter = 1;
  while (existingSlugs.includes(slug)) {
    slug = `${slugify(name)}-${counter}`;
    counter++;
  }
  return slug;
};
```

### Edge Case 3: Insufficient Gas/Funds

**Scenario:** User has insufficient ETH for contract deployment

**Current Behavior:** Transaction fails at Step 4

**Recommended Improvements:**
```typescript
// Pre-check gas requirements
const checkGasRequirements = async (chainId: string) => {
  const provider = getProvider(chainId);
  const gasPrice = await provider.getGasPrice();
  const estimatedGas = 5000000n; // Conservative estimate for factory deployment
  const requiredEth = gasPrice * estimatedGas;

  const balance = await provider.getBalance(address);

  if (balance < requiredEth) {
    const needed = formatEther(requiredEth - balance);
    throw new InsufficientFundsError(
      `Need ${needed} more ETH for deployment. Estimated cost: ${formatEther(requiredEth)} ETH`
    );
  }
};

// Run check before Step 4
await checkGasRequirements(formData.chain);
```

### Edge Case 4: Transaction Replaced/Speed Up

**Scenario:** User speeds up transaction in MetaMask

**Current Behavior:** Original txHash becomes invalid

**Recommended Improvements:**
```typescript
// Track transaction by nonce, not just hash
const waitForDeployment = async (txHash: string, expectedNonce: number) => {
  const provider = getProvider();

  return new Promise((resolve, reject) => {
    const checkReplacement = setInterval(async () => {
      const currentNonce = await provider.getTransactionCount(address);

      // Check if nonce was used by different tx
      if (currentNonce > expectedNonce) {
        // Find replacement transaction
        const block = await provider.getBlock('latest');
        for (const txHash of block.transactions) {
          const tx = await provider.getTransaction(txHash);
          if (tx?.from === address && tx.nonce === expectedNonce) {
            clearInterval(checkReplacement);
            resolve(txHash);
            return;
          }
        }
      }
    }, 2000);

    // Timeout after 10 minutes
    setTimeout(() => {
      clearInterval(checkReplacement);
      reject(new Error('Transaction timeout'));
    }, 600000);
  });
};
```

### Edge Case 5: Database Record Created but Contract Deployment Fails

**Scenario:** Step 2 succeeds, Step 4 fails (network issues, user rejection)

**Current Behavior:** Collection stuck in "PENDING" state

**Recommended Improvements:**
```typescript
// Implement retry mechanism for deployment
const deployWithRetry = async (params: CollectionParams, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await sdkCollection.createERC721.mutateAsync(params);
    } catch (err) {
      if (isUserRejection(err)) {
        throw err; // Don't retry user rejections
      }
      if (i === maxRetries - 1) {
        // Mark as FAILED in DB
        await updateCollectionMutation({
          variables: {
            id: collectionId,
            input: { status: 'FAILED', errorMessage: err.message }
          }
        });
        throw err;
      }
      await delay(Math.pow(2, i) * 5000);
    }
  }
};

// Allow users to retry failed deployments
const retryDeployment = async (collectionId: string) => {
  const { data } = await getCollection({ variables: { id: collectionId } });
  if (data.collection.status !== 'FAILED') {
    throw new Error('Can only retry failed collections');
  }
  // Re-run Step 4 with existing params
};
```

### Edge Case 6: Allowlist Too Large

**Scenario:** User tries to add >5000 addresses to allowlist

**Current Behavior:** Validation error

**Recommended Improvements:**
```typescript
// Batch large allowlists
const MAX_ALLOWLIST_BATCH = 100; // Contract limit per tx

const addAllowlistInBatches = async (
  collectionAddress: string,
  addresses: string[]
) => {
  const batches = chunk(addresses, MAX_ALLOWLIST_BATCH);
  const results = [];

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    const result = await sdkCollection.addToAllowlist.mutateAsync({
      collectionAddress,
      addresses: batch
    });
    results.push(result);

    // Add delay between batches to avoid rate limiting
    if (i < batches.length - 1) {
      await delay(1000);
    }
  }

  return results;
};
```

### Edge Case 7: Network Switch During Creation

**Scenario:** User switches wallet network mid-process

**Current Behavior:** Deployment fails or deploys to wrong chain

**Recommended Improvements:**
```typescript
// Lock chain selection at start
const [lockedChain, setLockedChain] = useState<string | null>(null);

useEffect(() => {
  if (currentStep === 'deploying' && !lockedChain) {
    setLockedChain(currentChain);
  }
}, [currentStep]);

useEffect(() => {
  if (lockedChain && currentChain !== lockedChain) {
    toast.error(`Please switch back to ${lockedChain} to continue`);
    // Or auto-switch back
    switchChain({ chainId: lockedChain });
  }
}, [currentChain, lockedChain]);
```

### Edge Case 8: Browser Refresh During Process

**Scenario:** User refreshes page during 5-step process

**Current Behavior:** All progress lost

**Recommended Improvements:**
```typescript
// Persist state to localStorage
const PERSIST_KEY = 'collection_creation_state';

const usePersistedCreation = () => {
  const [state, setState] = useState(() => {
    const saved = localStorage.getItem(PERSIST_KEY);
    return saved ? JSON.parse(saved) : initialState;
  });

  useEffect(() => {
    localStorage.setItem(PERSIST_KEY, JSON.stringify(state));
  }, [state]);

  const clearPersisted = () => {
    localStorage.removeItem(PERSIST_KEY);
  };

  return { state, setState, clearPersisted };
};

// Recovery on mount
useEffect(() => {
  if (state.step > 1 && state.collectionId) {
    // Check current status from API
    checkCollectionStatus(state.collectionId).then(status => {
      if (status === 'DEPLOYED') {
        clearPersisted();
        router.push(`/collection/${state.collectionId}`);
      } else {
        // Resume from last step
        setCurrentStep(getStepFromStatus(status));
      }
    });
  }
}, []);
```

### Edge Case 9: Invalid Contract Address Returned

**Scenario:** SDK returns invalid/zero address after deployment

**Current Behavior:** Step 5 updates DB with bad address

**Recommended Improvements:**
```typescript
// Validate contract address before DB update
const validateContractAddress = (address: string): boolean => {
  return (
    isAddress(address) &&
    address !== ZeroAddress &&
    address.toLowerCase() !== '0x0000000000000000000000000000000000000000'
  );
};

// Verify contract exists on-chain
const verifyContractDeployment = async (address: string, provider: Provider) => {
  const code = await provider.getCode(address);
  if (code === '0x') {
    throw new Error('Contract not deployed at address');
  }

  // Verify it's a valid collection contract
  const contract = new Contract(address, MINIMAL_COLLECTION_ABI, provider);
  try {
    await Promise.all([
      contract.name(),
      contract.symbol(),
      contract.owner()
    ]);
  } catch {
    throw new Error('Invalid collection contract at address');
  }
};
```

### Edge Case 10: Rate Limiting on API

**Scenario:** API returns 429 during creation

**Current Behavior:** Generic error shown

**Recommended Improvements:**
```typescript
// Implement exponential backoff for API calls
const apiCallWithBackoff = async <T>(
  operation: () => Promise<T>,
  maxRetries = 3
): Promise<T> => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (err) {
      if (err.status === 429) {
        const delayMs = Math.pow(2, i) * 1000 + Math.random() * 1000;
        await delay(delayMs);
        continue;
      }
      throw err;
    }
  }
  throw new Error('Max retries exceeded');
};
```

---

## Clean Code Architecture Recommendations

### 1. Separate Concerns with Service Layer

```typescript
// services/collectionCreationService.ts
export class CollectionCreationService {
  constructor(
    private mediaService: MediaService,
    private apiClient: ApiClient,
    private sdk: ZunoSDK,
    private persistence: PersistenceLayer
  ) {}

  async execute(params: CreateCollectionParams): Promise<Collection> {
    const orchestrator = new CreationOrchestrator(
      this.mediaService,
      this.apiClient,
      this.sdk,
      this.persistence
    );

    return orchestrator.execute(params);
  }
}

// orchestrator with step pattern
class CreationOrchestrator {
  private steps: CreationStep[] = [
    new UploadMediaStep(),
    new CreateDatabaseRecordStep(),
    new AddAllowlistStep(),
    new DeployContractStep(),
    new UpdateDatabaseStep()
  ];

  async execute(params: CreateCollectionParams): Promise<Collection> {
    const context: CreationContext = { params };

    for (const step of this.steps) {
      try {
        await step.execute(context);
        this.persistence.saveProgress(context);
      } catch (err) {
        await this.handleStepFailure(step, err, context);
        throw err;
      }
    }

    return context.collection!;
  }
}
```

### 2. State Machine Pattern

```typescript
// state machine for clear state management
type CreationState =
  | { type: 'IDLE' }
  | { type: 'UPLOADING_MEDIA' }
  | { type: 'CREATING_DB_RECORD'; imageUrl?: string }
  | { type: 'ADDING_ALLOWLIST'; collectionId: string }
  | { type: 'DEPLOYING_CONTRACT'; collectionId: string }
  | { type: 'UPDATING_DB'; collectionId: string; contractAddress: string }
  | { type: 'COMPLETED'; collection: Collection }
  | { type: 'FAILED'; step: string; error: Error; recoverable: boolean };

const creationMachine = createMachine({
  initial: 'IDLE',
  states: {
    IDLE: { on: { START: 'UPLOADING_MEDIA' } },
    UPLOADING_MEDIA: {
      on: {
        SUCCESS: 'CREATING_DB_RECORD',
        FAILURE: { target: 'FAILED', actions: 'setError' }
      }
    },
    CREATING_DB_RECORD: {
      on: {
        SUCCESS: 'ADDING_ALLOWLIST',
        FAILURE: { target: 'FAILED', actions: 'setError' }
      }
    },
    // ... more states
    FAILED: {
      on: {
        RETRY: { target: 'UPLOADING_MEDIA', actions: 'clearError' },
        ABORT: 'IDLE'
      }
    }
  }
});
```

### 3. Comprehensive Error Types

```typescript
// errors/collectionErrors.ts
export class CollectionError extends Error {
  constructor(
    message: string,
    public code: string,
    public step: string,
    public recoverable: boolean,
    public context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'CollectionError';
  }
}

export class MediaUploadError extends CollectionError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'MEDIA_UPLOAD_FAILED', 'UPLOAD_MEDIA', true, context);
  }
}

export class DatabaseError extends CollectionError {
  constructor(message: string, recoverable: boolean, context?: Record<string, unknown>) {
    super(message, 'DB_OPERATION_FAILED', 'CREATE_DB_RECORD', recoverable, context);
  }
}

export class DeploymentError extends CollectionError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'CONTRACT_DEPLOYMENT_FAILED', 'DEPLOY_CONTRACT', true, context);
  }
}

export class InsufficientFundsError extends CollectionError {
  constructor(required: string, available: string) {
    super(
      `Insufficient funds. Required: ${required}, Available: ${available}`,
      'INSUFFICIENT_FUNDS',
      'DEPLOY_CONTRACT',
      false,
      { required, available }
    );
  }
}

export class UserRejectionError extends CollectionError {
  constructor() {
    super(
      'Transaction rejected by user',
      'USER_REJECTION',
      'DEPLOY_CONTRACT',
      true
    );
  }
}
```

### 4. Comprehensive Logging

```typescript
// utils/creationLogger.ts
export class CreationLogger {
  private startTime: number;

  constructor(private collectionId?: string) {
    this.startTime = Date.now();
  }

  stepStart(step: string, metadata?: Record<string, unknown>) {
    console.log(`[${this.collectionId}] Step ${step} started`, {
      timestamp: new Date().toISOString(),
      elapsed: Date.now() - this.startTime,
      ...metadata
    });
  }

  stepComplete(step: string, result?: Record<string, unknown>) {
    console.log(`[${this.collectionId}] Step ${step} completed`, {
      timestamp: new Date().toISOString(),
      elapsed: Date.now() - this.startTime,
      ...result
    });
  }

  stepError(step: string, error: Error, context?: Record<string, unknown>) {
    console.error(`[${this.collectionId}] Step ${step} failed`, {
      timestamp: new Date().toISOString(),
      elapsed: Date.now() - this.startTime,
      error: error.message,
      stack: error.stack,
      ...context
    });
  }

  metric(name: string, value: number) {
    // Send to analytics/monitoring
    analytics.track(`collection_creation_${name}`, {
      value,
      collectionId: this.collectionId
    });
  }
}
```

### 5. Optimistic UI Updates

```typescript
// hooks/useOptimisticCreation.ts
export const useOptimisticCreation = () => {
  const queryClient = useQueryClient();

  const createOptimisticCollection = (params: CreateCollectionParams) => {
    const optimisticCollection: Collection = {
      id: `temp-${Date.now()}`,
      name: params.name,
      symbol: params.symbol,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      // ... other fields
    };

    // Add to cache immediately
    queryClient.setQueryData(
      ['collections', 'my'],
      (old: Collection[] = []) => [optimisticCollection, ...old]
    );

    return optimisticCollection.id;
  };

  const updateOptimisticCollection = (tempId: string, updates: Partial<Collection>) => {
    queryClient.setQueryData(
      ['collections', 'my'],
      (old: Collection[] = []) =>
        old.map(c => c.id === tempId ? { ...c, ...updates } : c)
    );
  };

  const removeOptimisticCollection = (tempId: string) => {
    queryClient.setQueryData(
      ['collections', 'my'],
      (old: Collection[] = []) => old.filter(c => c.id !== tempId)
    );
  };

  return {
    createOptimisticCollection,
    updateOptimisticCollection,
    removeOptimisticCollection
  };
};
```

---

## Testing Strategy

### Unit Tests

```typescript
// __tests__/useCreateCollection.test.ts
describe('useCreateCollection', () => {
  it('should complete all 5 steps successfully', async () => {
    // Mock all dependencies
    const { result } = renderHook(() => useCreateCollection());

    await act(async () => {
      await result.current.submit(mockFormData);
    });

    expect(result.current.step5Status).toBe('success');
    expect(result.current.collectionId).toBeDefined();
    expect(result.current.contractAddress).toBeDefined();
  });

  it('should handle media upload failure with retry', async () => {
    mockUploadFile
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce('https://cdn.example.com/image.jpg');

    const { result } = renderHook(() => useCreateCollection());

    await act(async () => {
      await result.current.submit(mockFormData);
    });

    expect(mockUploadFile).toHaveBeenCalledTimes(2);
    expect(result.current.step1Status).toBe('success');
  });

  it('should handle user rejection during deployment', async () => {
    mockCreateERC721.mockRejectedValue(new Error('User rejected'));

    const { result } = renderHook(() => useCreateCollection());

    await act(async () => {
      await result.current.submit(mockFormData);
    });

    expect(result.current.step4Status).toBe('error');
    expect(result.current.error).toContain('rejected');
  });

  it('should allow retry after deployment failure', async () => {
    mockCreateERC721
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce({ address: '0x123...', tx: { hash: '0xabc...' } });

    const { result } = renderHook(() => useCreateCollection());

    await act(async () => {
      await result.current.submit(mockFormData);
    });

    expect(result.current.step4Status).toBe('error');

    // Retry
    await act(async () => {
      await result.current.retry();
    });

    expect(result.current.step4Status).toBe('success');
  });
});
```

### Integration Tests

```typescript
// __tests__/collectionCreation.integration.test.ts
describe('Collection Creation Integration', () => {
  it('should create collection end-to-end', async () => {
    const formData = generateValidFormData();

    // Execute creation
    const collection = await createCollectionService.execute(formData);

    // Verify database state
    const dbRecord = await db.collections.findById(collection.id);
    expect(dbRecord.status).toBe('DEPLOYED');
    expect(dbRecord.contractAddress).toBeValidAddress();

    // Verify blockchain state
    const contract = await sdk.getCollectionInfo(collection.contractAddress);
    expect(contract.name).toBe(formData.name);
    expect(contract.symbol).toBe(formData.symbol);

    // Verify indexer picked up the event
    await waitForIndexer(collection.contractAddress);
    const indexedCollection = await indexer.getCollection(collection.contractAddress);
    expect(indexedCollection).toBeDefined();
  });

  it('should handle partial failure and allow recovery', async () => {
    // Simulate failure after DB record created
    blockchain.simulateFailure('deploy');

    const result = await createCollectionService.execute(formData);
    expect(result.status).toBe('FAILED');

    // Recovery
    blockchain.reset();
    const recovered = await createCollectionService.retry(result.id);
    expect(recovered.status).toBe('DEPLOYED');
  });
});
```

---

## Security Considerations

### 1. Input Validation

```typescript
// validation/collectionValidation.ts
export const validateCreateCollectionInput = (input: CreateCollectionInput) => {
  const errors: ValidationError[] = [];

  // Name validation
  if (!input.name || input.name.length < 3) {
    errors.push({ field: 'name', message: 'Name must be at least 3 characters' });
  }
  if (input.name.length > 100) {
    errors.push({ field: 'name', message: 'Name must be less than 100 characters' });
  }

  // Symbol validation
  if (!input.symbol || !/^[A-Z0-9]{2,10}$/.test(input.symbol)) {
    errors.push({ field: 'symbol', message: 'Symbol must be 2-10 uppercase alphanumeric characters' });
  }

  // Address validation
  if (!isAddress(input.deployerAddress)) {
    errors.push({ field: 'deployerAddress', message: 'Invalid deployer address' });
  }

  // Royalty validation
  if (input.royaltyFeeBps && (input.royaltyFeeBps < 0 || input.royaltyFeeBps > 10000)) {
    errors.push({ field: 'royaltyFeeBps', message: 'Royalty must be between 0% and 100%' });
  }

  // Supply validation
  if (input.maxSupply && input.maxSupply <= 0) {
    errors.push({ field: 'maxSupply', message: 'Max supply must be positive' });
  }

  return errors;
};
```

### 2. Rate Limiting

```typescript
// middleware/rateLimit.ts
export const createCollectionRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 collections per hour per user
  keyGenerator: (req) => req.user.id,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many collections created. Please try again later.'
    });
  }
});
```

### 3. Authorization Checks

```typescript
// Ensure user can only update their own collections
const authorizeCollectionUpdate = async (userId: string, collectionId: string) => {
  const collection = await db.collections.findById(collectionId);

  if (!collection) {
    throw new NotFoundError('Collection not found');
  }

  if (collection.userId !== userId) {
    throw new ForbiddenError('You can only update your own collections');
  }

  if (collection.status === 'DEPLOYED') {
    throw new ConflictError('Cannot update deployed collection');
  }

  return collection;
};
```

---

## Monitoring & Alerting

### Key Metrics to Track

| Metric | Threshold | Alert |
|--------|-----------|-------|
| Creation success rate | < 95% | PagerDuty |
| Average creation time | > 5 min | Slack |
| Step failure rate | > 10% | Slack |
| Gas cost spikes | > 2x avg | Slack |
| API error rate | > 5% | PagerDuty |

### Implementation

```typescript
// monitoring/collectionMetrics.ts
export const trackCreationMetrics = {
  start: (userId: string) => {
    metrics.increment('collection.creation.started');
    metrics.histogram('collection.creation.active_users', userId);
  },

  stepComplete: (step: string, duration: number) => {
    metrics.timing(`collection.creation.step.${step}`, duration);
  },

  stepError: (step: string, error: Error) => {
    metrics.increment(`collection.creation.step.${step}.error`, {
      error_type: error.name
    });
  },

  complete: (totalDuration: number, success: boolean) => {
    metrics.timing('collection.creation.total_duration', totalDuration);
    metrics.increment('collection.creation.completed', { success: String(success) });
  }
};
```

---

## Summary

### Critical Improvements Needed

1. **Recovery Mechanism**: Allow retry of failed deployments
2. **State Persistence**: Save progress to localStorage for recovery
3. **Pre-flight Checks**: Validate gas requirements before deployment
4. **Better Error Handling**: Distinguish between user rejection vs network errors
5. **Optimistic UI**: Show immediate feedback while operations complete
6. **Comprehensive Logging**: Track every step for debugging
7. **Rate Limiting**: Prevent abuse of creation endpoint
8. **Input Sanitization**: Validate all inputs server-side

### Implementation Priority

| Priority | Feature | Effort | Impact |
|----------|---------|--------|--------|
| P0 | Recovery mechanism | Medium | High |
| P0 | State persistence | Low | High |
| P0 | Better error handling | Medium | High |
| P1 | Pre-flight checks | Low | Medium |
| P1 | Optimistic UI | Medium | Medium |
| P2 | Comprehensive logging | Low | Low |
| P2 | Rate limiting | Low | Medium |

---

## Unresolved Questions

1. Should we support "draft" collections that can be edited before deployment?
2. How should we handle collections that fail deployment after multiple retries?
3. Should we implement a "deployment queue" for high-traffic periods?
4. How do we handle contract verification on Etherscan/block explorers?
5. What's the rollback strategy if Step 5 (DB update) fails after deployment?
