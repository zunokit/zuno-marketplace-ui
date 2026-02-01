---
title: "Phase 09: API Indexer Sync"
description: "Webhook handlers for indexer events"
status: pending
priority: P1
effort: 6-8h
dependencies: ["Phase 05", "Phase 06"]
---

# Phase 09: API Indexer Sync

## Project
zuno-marketplace-api

## Overview
Handle webhooks from indexer to update collection status.

## Webhook Handler

```go
// internal/webhook/indexer.go
func (h *Handler) HandleCollectionCreated(w http.ResponseWriter, r *http.Request) {
  var payload struct {
    Type            string `json:"type"`
    ChainID         int    `json:"chainId"`
    ContractAddress string `json:"contractAddress"`
    BlockNumber     int64  `json:"blockNumber"`
    TransactionHash string `json:"transactionHash"`
  }

  json.NewDecoder(r.Body).Decode(&payload)

  // Update collection
  h.collectionRepo.UpdateByContractAddress(
    payload.ContractAddress,
    map[string]interface{}{
      "status": "DEPLOYED",
      "index_status": "INDEXED",
      "deployed_block": payload.BlockNumber,
    },
  )
}
```

## Files

| File | Purpose |
|------|---------|
| internal/webhook/indexer.go | Webhook handlers |
| internal/middleware/webhook-auth.go | Auth middleware |

## Success Criteria
- [ ] Webhook endpoint secured
- [ ] Collection status updated
- [ ] Index status synchronized
