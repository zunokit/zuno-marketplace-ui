# Create Collection Feature - Implementation Plan

**Created**: 2026-01-27
**Status**: Ready for Implementation
**Priority**: HIGH
**Effort Estimate**: 7-11 days

---

## Overview

This plan details the implementation work required to complete the "Create Collection" feature across all Zuno Marketplace projects, integrating the frontend, backend, indexer, and SDK components.

**Current State**:
- ✅ Backend: Collection service, GraphQL gateway, upload proxy COMPLETE
- ✅ Frontend: UI form, basic hook with SDK integration COMPLETE
- ✅ SDK: Deploy methods COMPLETE
- ❌ Indexer: Webhook system NOT IMPLEMENTED
- ❌ Backend: Webhook endpoint NOT IMPLEMENTED
- ⏳ Frontend: Error handling PARTIALLY COMPLETE

**Goal**: Complete all remaining integration points and ensure robust error handling.

---

## Implementation Phases

### Phase 1: Frontend Error Handling Enhancement

**Repository**: `zuno-marketplace-ui`
**Effort**: 2-3 days
**Status**: Ready to start

#### Tasks

##### 1.1 Step Status Tracking
- [ ] Add detailed error states for each step
- [ ] Store error messages for display
- [ ] Track retry attempts per step
- [ ] Log errors to Sentry

**File**: `src/modules/mint/create-form/hooks/useCreateCollection.ts`

```typescript
interface StepError {
  code: string;
  message: string;
  retryable: boolean;
  attempts: number;
}

interface CreateCollectionState {
  // ... existing
  errors: {
    step1?: StepError;
    step2?: StepError;
    step3?: StepError;
    step4?: StepError;
    step5?: StepError;
  };
}
```

##### 1.2 Wallet Error Handling
- [ ] Detect wallet rejection errors
- [ ] Detect insufficient gas errors
- [ ] Detect wrong network errors
- [ ] Show appropriate recovery UI

**File**: `src/modules/mint/create-form/hooks/useCreateCollection.ts`

```typescript
// In Step 4 error handler
if (err.message.includes('User rejected')) {
  setState(prev => ({
    ...prev,
    step4Status: 'error',
    errors: {
      ...prev.errors,
      step4: {
        code: 'ERR_WALLET_REJECTED',
        message: 'Transaction cancelled',
        retryable: true,
        attempts: 0
      }
    }
  }));
  toast.error('Transaction was cancelled. Please try again.');
}
```

##### 1.3 IPFS Polling with Timeout
- [ ] Implement polling loop with 2s intervals
- [ ] Timeout after 30 seconds (15 attempts)
- [ ] Show "Continue anyway" option
- [ ] Add retry button

**File**: `src/shared/hooks/useMediaUpload.ts`

```typescript
async uploadFile(file: File): Promise<string> {
  const response = await uploadToBackend(file);

  // Poll for IPFS pinning
  let attempts = 0;
  const maxAttempts = 15;

  while (attempts < maxAttempts) {
    const status = await checkPinningStatus(response.id);
    if (status.isPinned) {
      return status.ipfsUrl;
    }
    await new Promise(resolve => setTimeout(resolve, 2000));
    attempts++;
  }

  // Timeout - show options
  throw new UploadTimeoutError(response.ipfsHash);
}
```

##### 1.4 Transaction Status Monitoring
- [ ] Show transaction hash after submission
- [ ] Link to block explorer
- [ ] Monitor confirmation status
- [ ] Update UI on confirmation

**File**: `src/modules/mint/create-form/components/CollectionProcess.tsx`

```typescript
{step4Status === 'loading' && txHash && (
  <div className="transaction-status">
    <Spinner />
    <p>Transaction submitted:</p>
    <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank">
      {txHash.slice(0, 10)}...{txHash.slice(-8)}
    </a>
    <p>Waiting for confirmation...</p>
  </div>
)}
```

##### 1.5 Recovery UI Components
- [ ] Create generic error display component
- [ ] Add retry button
- [ ] Add cancel button
- [ ] Add help links

**File**: `src/shared/components/errors/StepErrorDisplay.tsx`

```typescript
export function StepErrorDisplay({
  step,
  error,
  onRetry,
  onCancel
}: StepErrorDisplayProps) {
  return (
    <div className="error-container">
      <AlertCircle className="error-icon" />
      <h3>Step {step} Failed</h3>
      <p>{error.message}</p>
      {error.retryable && (
        <div className="error-actions">
          <Button onClick={onRetry}>Retry</Button>
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
        </div>
      )}
    </div>
  );
}
```

---

### Phase 2: Indexer Webhook System

**Repository**: `zuno-marketplace-indexer`
**Effort**: 3-5 days
**Status**: Ready to start

#### Tasks

##### 2.1 Webhook Configuration
- [ ] Create webhook config module
- [ ] Add environment variables
- [ ] Implement enable/disable flag
- [ ] Configure event filtering

**File**: `src/infrastructure/webhooks/config.ts`

```typescript
export interface WebhookConfig {
  enabled: boolean;
  url: string;
  secret: string;
  events: string[];
  retryAttempts: number;
  retryDelay: number;
  timeout: number;
}

export const webhookConfig: WebhookConfig = {
  enabled: process.env.WEBHOOK_ENABLED === 'true',
  url: process.env.WEBHOOK_URL || 'http://localhost:8081/api/webhooks/indexer',
  secret: process.env.WEBHOOK_SECRET || '',
  events: ['collection_created', 'nft_minted', 'batch_minted'],
  retryAttempts: 3,
  retryDelay: 30000, // 30s
  timeout: 5000,
};
```

##### 2.2 Webhook Client
- [ ] Implement HTTP webhook sender
- [ ] Add HMAC signature generation
- [ ] Add timeout handling
- [ ] Add retry logic with exponential backoff

**File**: `src/infrastructure/webhooks/client.ts`

```typescript
import { createHmac } from 'crypto';

export class WebhookClient {
  async sendWebhook(payload: WebhookPayload): Promise<Result<void>> {
    const signature = this.generateSignature(payload);

    for (let attempt = 0; attempt < webhookConfig.retryAttempts; attempt++) {
      try {
        const response = await fetch(webhookConfig.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Signature': signature,
            'X-Webhook-Event': payload.event,
          },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(webhookConfig.timeout),
        });

        if (response.ok) {
          return ok(undefined);
        }

        if (response.status >= 500 && attempt < webhookConfig.retryAttempts - 1) {
          await this.delay(webhookConfig.retryDelay * Math.pow(2, attempt));
          continue;
        }

        return err(new Error(`Webhook failed: ${response.status}`));
      } catch (error) {
        if (attempt === webhookConfig.retryAttempts - 1) {
          return err(error);
        }
        await this.delay(webhookConfig.retryDelay * Math.pow(2, attempt));
      }
    }

    return err(new Error('Webhook delivery failed'));
  }

  private generateSignature(payload: WebhookPayload): string {
    const hmac = createHmac('sha256', webhookConfig.secret);
    hmac.update(JSON.stringify(payload));
    return `sha256=${hmac.digest('hex')}`;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

##### 2.3 Webhook Middleware
- [ ] Create middleware wrapper
- [ ] Trigger webhook after event storage
- [ ] Handle webhook failures
- [ ] Log delivery status

**File**: `src/infrastructure/webhooks/middleware.ts`

```typescript
export function withWebhookTrigger(handler: EventHandler): EventHandler {
  return async ({ event, context }) => {
    // Execute original handler first
    const result = await handler({ event, context });

    // After successful event storage, trigger webhook
    if (result.isOk() && webhookConfig.enabled) {
      const shouldTrigger = shouldTriggerWebhook(event.name);

      if (shouldTrigger) {
        const payload = {
          event: mapEventName(event.name),
          chainId: context.network.chainId,
          timestamp: event.block.timestamp,
          data: event.args,
        };

        const webhookResult = await webhookClient.sendWebhook(payload);

        if (webhookResult.isErr()) {
          // Log but don't fail the event processing
          context.logger.error('Webhook delivery failed', {
            error: webhookResult.error,
            payload,
          });
        }
      }
    }

    return result;
  };
}
```

##### 2.4 Event Handler Integration
- [ ] Wrap collection created handler
- [ ] Wrap mint handlers
- [ ] Add webhook delivery tracking
- [ ] Monitor webhook success rate

**File**: `src/domain/collection/handlers/collection-created.handler.ts`

```typescript
import { withWebhookTrigger } from '@/infrastructure/webhooks/middleware';

export const collectionCreatedHandler = withWebhookTrigger(
  async ({ event, context }) => {
    // Existing handler logic
    const collectionAddress = event.args.collection;
    const creator = event.args.creator;

    // Store in database...
    await context.db.collection.create({
      data: {
        address: collectionAddress,
        creator: creator,
        // ...
      },
    });

    return ok(undefined);
  }
);
```

##### 2.5 Environment Setup
- [ ] Add .env.example entries
- [ ] Update README with webhook config
- [ ] Add webhook status to health check

**File**: `.env.example`

```env
# Webhook Configuration
WEBHOOK_ENABLED=true
WEBHOOK_URL=http://localhost:8081/api/webhooks/indexer
WEBHOOK_SECRET=your-webhook-secret-here
WEBHOOK_EVENTS=collection_created,nft_minted,batch_minted
```

---

### Phase 3: Backend Webhook Endpoint

**Repository**: `zuno-marketplace-api`
**Effort**: 2-3 days
**Status**: Ready to start

#### Tasks

##### 3.1 Webhook Handler Implementation
- [ ] Create webhook handler in collection service
- [ ] Implement HMAC verification
- [ ] Add event processing logic
- [ ] Update index status

**File**: `services/collection-service/internal/server/webhook_handler.go`

```go
func (s *CollectionServer) ProcessIndexerWebhook(
    ctx context.Context,
    req *pb.IndexerWebhookRequest,
) (*pb.IndexerWebhookResponse, error) {
    // 1. Verify HMAC signature
    if !s.verifyWebhookSignature(req) {
        return nil, status.Error(codes.Unauthenticated, "invalid signature")
    }

    // 2. Handle event based on type
    switch req.Event {
    case "collection.created":
        return s.handleCollectionCreated(ctx, req.Data)
    case "collection.minted":
        return s.handleCollectionMinted(ctx, req.Data)
    case "collection.batch_minted":
        return s.handleBatchMinted(ctx, req.Data)
    default:
        return nil, status.Error(codes.InvalidArgument, "unknown event")
    }
}

func (s *CollectionServer) handleCollectionCreated(
    ctx context.Context,
    data *pb.IndexerEventData,
) (*pb.IndexerWebhookResponse, error) {
    collectionAddress := data.CollectionAddress
    chainId := data.ChainId

    // Find collection by contract address
    collection, err := s.collectionRepo.GetByContractAddress(ctx, collectionAddress, chainId)
    if err != nil {
        return nil, status.Error(codes.NotFound, "collection not found")
    }

    // Update index status
    updates := map[string]interface{}{
        "index_status": "INDEXED",
        "indexed_at": time.Now(),
    }

    err = s.collectionRepo.Update(ctx, collection.ID, updates)
    if err != nil {
        return nil, status.Error(codes.Internal, "failed to update collection")
    }

    return &pb.IndexerWebhookResponse{
        Success: true,
        Message: "Collection indexed successfully",
    }, nil
}

func (s *CollectionServer) verifyWebhookSignature(req *pb.IndexerWebhookRequest) bool {
    secret := os.Getenv("WEBHOOK_SECRET")
    expectedSignature := generateHMAC(req.Payload, secret)
    return hmac.Equal([]byte(req.Signature), []byte(expectedSignature))
}
```

##### 3.2 GraphQL Gateway Endpoint
- [ ] Create REST endpoint for webhooks
- [ ] Forward to collection service
- [ ] Handle errors gracefully
- [ ] Add rate limiting

**File**: `services/graphql-gateway/internal/handlers/webhook_handler.go`

```go
func (h *WebhookHandler) HandleIndexerWebhook(c *gin.Context) {
    var payload IndexerWebhookPayload
    if err := c.BindJSON(&payload); err != nil {
        c.JSON(400, gin.H{"error": "invalid payload"})
        return
    }

    // Get signature from header
    signature := c.GetHeader("X-Webhook-Signature")
    if signature == "" {
        c.JSON(401, gin.H{"error": "missing signature"})
        return
    }

    // Forward to Collection Service
    _, err := h.collectionClient.ProcessIndexerWebhook(c, &pb.IndexerWebhookRequest{
        Event:     payload.Event,
        ChainId:   payload.ChainId,
        Timestamp: payload.Timestamp,
        Data:      payload.Data,
        Signature: signature,
    })

    if err != nil {
        c.JSON(500, gin.H{"error": err.Error()})
        return
    }

    c.JSON(200, gin.H{"success": true})
}
```

##### 3.3 Route Registration
- [ ] Add webhook route to gateway
- [ ] Add middleware for rate limiting
- [ ] Add authentication check

**File**: `services/graphql-gateway/cmd/main.go`

```go
func setupRoutes(router *gin.Engine, collectionClient pb.CollectionServiceClient) {
    webhookHandler := handlers.NewWebhookHandler(collectionClient)

    // Apply rate limiting
    webhookGroup := router.Group("/api/webhooks")
    webhookGroup.Use(middleware.RateLimit(100)) // 100 req/min
    {
        webhookGroup.POST("/indexer", webhookHandler.HandleIndexerWebhook)
    }
}
```

##### 3.4 Database Migration
- [ ] Add index_status column
- [ ] Add indexed_at column
- [ ] Create webhook_deliveries table
- [ ] Add indexes

**File**: `db/migrations/000005_add_index_status.up.sql`

```sql
-- Add index tracking to collections
ALTER TABLE collections
ADD COLUMN IF NOT EXISTS index_status VARCHAR(20) DEFAULT 'NOT_INDEXED',
ADD COLUMN IF NOT EXISTS indexed_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_collections_index_status
ON collections(index_status);

-- Track webhook deliveries
CREATE TABLE IF NOT EXISTS webhook_deliveries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(50) NOT NULL,
    collection_id UUID REFERENCES collections(id),
    payload JSONB NOT NULL,
    status VARCHAR(20) NOT NULL,
    attempts INT DEFAULT 1,
    last_attempt_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_webhook_deliveries_collection
ON webhook_deliveries(collection_id);

CREATE INDEX idx_webhook_deliveries_status
ON webhook_deliveries(status);
```

##### 3.5 Environment Setup
- [ ] Add WEBHOOK_SECRET to .env
- [ ] Update docker-compose.yml
- [ ] Update deployment docs

**File**: `.env`

```env
# Webhook Configuration
WEBHOOK_SECRET=your-webhook-secret-here
```

---

### Phase 4: Integration Testing

**Repository**: All projects
**Effort**: 2-3 days
**Status**: Blocked by Phases 1-3

#### Tasks

##### 4.1 End-to-End Tests
- [ ] Happy path test
- [ ] Wallet rejection test
- [ ] Insufficient gas test
- [ ] IPFS timeout test
- [ ] Webhook failure test
- [ ] Reorg handling test

**File**: `zuno-marketplace-ui/e2e/create-collection.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Create Collection', () => {
  test('happy path - ERC721 collection', async ({ page }) => {
    await page.goto('/create-collection');

    // Fill form
    await page.fill('[name="name"]', 'Test Collection');
    await page.fill('[name="symbol"]', 'TEST');
    await page.fill('[name="description"]', 'Test description');

    // Upload image
    await page.setInputFiles('[type="file"]', 'test-assets/logo.png');

    // Submit
    await page.click('button[type="submit"]');

    // Wait for success
    await expect(page.locator('.success-message')).toBeVisible();

    // Verify redirect
    expect(page.url()).toContain('/my-collections');
  });

  test('wallet rejection handling', async ({ page, context }) => {
    // Mock wallet rejection
    await context.addInitScript(() => {
      window.ethereum = {
        request: async ({ method }) => {
          if (method === 'eth_sendTransaction') {
            throw new Error('User rejected transaction');
          }
        },
      };
    });

    await page.goto('/create-collection');
    // ... fill form and submit

    // Should show retry button
    await expect(page.locator('button:has-text("Retry")')).toBeVisible();
  });
});
```

##### 4.2 Backend Integration Tests
- [ ] Webhook signature verification
- [ ] Webhook processing
- [ ] Index status updates
- [ ] Retry logic

**File**: `zuno-marketplace-api/services/collection-service/internal/server/webhook_handler_test.go`

```go
func TestProcessIndexerWebhook(t *testing.T) {
    tests := []struct {
        name       string
        event      string
        setupMock  func(*MockCollectionRepo)
        wantStatus codes.Code
    }{
        {
            name:  "successful collection indexing",
            event: "collection.created",
            setupMock: func(m *MockCollectionRepo) {
                m.On("GetByContractAddress", mock.Anything, "0x123", "11155111").
                    Return(&models.Collection{ID: "uuid"}, nil)
                m.On("Update", mock.Anything, "uuid", mock.Anything).
                    Return(nil)
            },
            wantStatus: codes.OK,
        },
        {
            name:  "collection not found",
            event: "collection.created",
            setupMock: func(m *MockCollectionRepo) {
                m.On("GetByContractAddress", mock.Anything, "0x123", "11155111").
                    Return(nil, ErrNotFound)
            },
            wantStatus: codes.NotFound,
        },
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            mockRepo := new(MockCollectionRepo)
            tt.setupMock(mockRepo)

            server := &CollectionServer{
                collectionRepo: mockRepo,
            }

            req := &pb.IndexerWebhookRequest{
                Event: tt.event,
                Data: &pb.IndexerEventData{
                    CollectionAddress: "0x123",
                    ChainId:          "11155111",
                },
            }

            _, err := server.ProcessIndexerWebhook(context.Background(), req)

            assert.Equal(t, tt.wantStatus, status.Code(err))
        })
    }
}
```

##### 4.3 Indexer Tests
- [ ] Webhook delivery
- [ ] Retry logic
- [ ] Signature generation

**File**: `zuno-marketplace-indexer/tests/webhook.test.ts`

```typescript
import { describe, it, expect, vi } from 'vitest';
import { WebhookClient } from '@/infrastructure/webhooks/client';

describe('WebhookClient', () => {
  it('should successfully deliver webhook', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
    });
    global.fetch = mockFetch;

    const client = new WebhookClient();
    const result = await client.sendWebhook({
      event: 'collection.created',
      chainId: 11155111,
      timestamp: Date.now(),
      data: {},
    });

    expect(result.isOk()).toBe(true);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'X-Webhook-Signature': expect.stringMatching(/^sha256=/),
        }),
      })
    );
  });

  it('should retry on 500 error', async () => {
    const mockFetch = vi.fn()
      .mockResolvedValueOnce({ ok: false, status: 500 })
      .mockResolvedValueOnce({ ok: true });
    global.fetch = mockFetch;

    const client = new WebhookClient();
    const result = await client.sendWebhook({
      event: 'collection.created',
      chainId: 11155111,
      timestamp: Date.now(),
      data: {},
    });

    expect(result.isOk()).toBe(true);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});
```

---

### Phase 5: Monitoring & Documentation

**Repository**: All projects
**Effort**: 1-2 days
**Status**: Blocked by Phases 1-3

#### Tasks

##### 5.1 Monitoring Setup
- [ ] Add Sentry error tracking
- [ ] Add webhook delivery metrics
- [ ] Add performance monitoring
- [ ] Set up alerts

**File**: `zuno-marketplace-indexer/src/infrastructure/monitoring/metrics.ts`

```typescript
export class WebhookMetrics {
  private successCounter: Counter;
  private failureCounter: Counter;
  private deliveryTime: Histogram;

  constructor() {
    this.successCounter = new Counter({
      name: 'webhook_delivery_success_total',
      help: 'Total successful webhook deliveries',
    });

    this.failureCounter = new Counter({
      name: 'webhook_delivery_failure_total',
      help: 'Total failed webhook deliveries',
    });

    this.deliveryTime = new Histogram({
      name: 'webhook_delivery_duration_seconds',
      help: 'Webhook delivery duration in seconds',
    });
  }

  recordSuccess(event: string) {
    this.successCounter.inc({ event });
  }

  recordFailure(event: string, error: string) {
    this.failureCounter.inc({ event, error });
  }

  recordDuration(duration: number) {
    this.deliveryTime.observe(duration);
  }
}
```

##### 5.2 Documentation Updates
- [ ] Update API documentation
- [ ] Add error handling guide
- [ ] Add troubleshooting guide
- [ ] Update README files

**File**: `zuno-marketplace-api/docs/create-collection/05-ERROR-HANDLING.md`

```markdown
# Error Handling Guide

## Common Errors

### ERR_WALLET_REJECTED
**Cause**: User rejected the transaction in MetaMask
**Recovery**: Show "Retry" button to allow user to try again

### ERR_INSUFFICIENT_GAS
**Cause**: User doesn't have enough ETH for gas
**Recovery**: Show link to Sepolia faucet

### ERR_IPFS_TIMEOUT
**Cause**: IPFS pinning took longer than 30 seconds
**Recovery**: Offer to "Continue anyway" with IPFS hash or retry upload

## Troubleshooting

### Collection stuck in PENDING status
1. Check if transaction was submitted to blockchain
2. Check Etherscan for transaction receipt
3. If transaction failed, user can retry deployment
4. If no transaction exists, delete and recreate collection

### Indexer webhook not received
1. Check webhook logs in indexer
2. Verify WEBHOOK_SECRET matches
3. Check backend webhook endpoint is accessible
4. Manually trigger webhook if needed
```

##### 5.5 Deployment Configuration
- [ ] Update docker-compose.yml
- [ ] Add environment variables to production
- [ ] Update deployment scripts
- [ ] Create rollback plan

---

## Success Criteria

- [ ] User can create collection from start to finish
- [ ] All error scenarios handled gracefully
- [ ] Webhook system working with retry logic
- [ ] Indexer updates collection status
- [ ] All integration tests passing
- [ ] Documentation complete
- [ ] Monitoring and alerts configured

---

## Risk Assessment

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| SDK breaking changes | HIGH | LOW | Pin SDK version, add tests |
| Webhook security breach | HIGH | LOW | Use HMAC, add rate limiting |
| IPFS Pinata outage | MEDIUM | MEDIUM | Add multiple IPFS gateways |
| Blockchain reorg | MEDIUM | LOW | Add reorg detection |
| Database migration failure | HIGH | LOW | Test migrations, add rollback |

---

## Timeline

- Week 1: Phase 1 (Frontend Error Handling)
- Week 2: Phase 2 (Indexer Webhook) + Phase 3 (Backend Webhook)
- Week 3: Phase 4 (Integration Testing) + Phase 5 (Monitoring & Docs)

---

## Dependencies

- `zuno-marketplace-sdk` - Already implemented, no changes needed
- `zuno-marketplace-contracts` - Already deployed, no changes needed
- `zuno-marketplace-metadata` - Already implemented, no changes needed
- `zuno-marketplace-indexer` - Needs webhook implementation
- `zuno-marketplace-api` - Needs webhook endpoint

---

**Plan Version**: 1.0
**Last Updated**: 2026-01-27
**Next Review**: After Phase 1 completion
