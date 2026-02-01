---
title: "Phase 06: Indexer Event Handlers"
description: "Ponder indexer handlers for collection creation events"
status: pending
priority: P1
effort: 8-10h
dependencies: []
---

# Phase 06: Indexer Event Handlers

## Project
zuno-marketplace-indexer

## Overview
Index ERC721/ERC1155 collection creation events and sync with API.

## Event Handlers

```typescript
// src/domain/collection/erc721-created.handler.ts
import { ponder } from 'ponder';

ponder.on('ERC721CollectionFactory:ERC721CollectionCreated', async ({ event, context }) => {
  const { collectionAddress, creator } = event.args;
  const { db } = context;

  // Insert into events table
  await db.insert(event).values({
    id: `${event.chainId}-${event.block.number}-${event.logIndex}`,
    type: 'collection_created',
    chainId: event.chainId,
    blockNumber: event.block.number,
    transactionHash: event.transaction.hash,
    data: {
      collectionAddress,
      creator,
      tokenStandard: 'ERC721'
    }
  });

  // Notify API via webhook
  await notifyApi({
    type: 'COLLECTION_CREATED',
    chainId: event.chainId,
    contractAddress: collectionAddress,
    creator,
    blockNumber: event.block.number,
    transactionHash: event.transaction.hash
  });
});
```

## API Webhook Handler

```go
// api/internal/webhook/indexer.go
func (h *IndexerWebhookHandler) HandleCollectionCreated(w http.ResponseWriter, r *http.Request) {
  var payload IndexerPayload
  json.NewDecoder(r.Body).Decode(&payload)

  // Update collection status
  h.collectionService.UpdateIndexStatus(
    payload.ContractAddress,
    "INDEXED",
    payload.BlockNumber,
  )
}
```

## Files

| File | Purpose |
|------|---------|
| domain/collection/erc721-created.handler.ts | ERC721 events |
| domain/collection/erc1155-created.handler.ts | ERC1155 events |
| lib/webhook.ts | API notifications |

## Success Criteria
- [ ] ERC721 events indexed
- [ ] ERC1155 events indexed
- [ ] API notified on creation
- [ ] Collection status updated
