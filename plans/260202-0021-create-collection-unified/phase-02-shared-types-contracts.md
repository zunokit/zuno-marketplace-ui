---
title: "Phase 02: Shared Types & Contracts (SDK + API)"
description: "Synchronize types between SDK and API via protobuf and TypeScript"
status: pending
priority: P0
effort: 6-8h
dependencies: []
---

# Phase 02: Shared Types & Contracts

## Overview

Ensure type consistency between SDK (TypeScript) and API (Go) via protobuf definitions.

## Protobuf Schema (API)

```protobuf
// api/proto/collection.proto
syntax = "proto3";

package collection;

message Collection {
  string id = 1;
  string name = 2;
  string symbol = 3;
  string description = 4;
  TokenStandard token_standard = 5;
  string chain_id = 6;
  string contract_address = 7;
  string deployer_address = 8;
  CollectionStatus status = 9;
  string image_url = 10;
  string banner_url = 11;
  int32 max_supply = 12;
  string mint_price_public = 13;
  string mint_price_allowlist = 14;
  string royalty_recipient = 15;
  int32 royalty_fee_bps = 16;
}

enum TokenStandard {
  ERC721 = 0;
  ERC1155 = 1;
}

enum CollectionStatus {
  PENDING = 0;
  DEPLOYED = 1;
  FAILED = 2;
  ARCHIVED = 3;
}

message CreateCollectionRequest {
  string name = 1;
  string symbol = 2;
  string description = 3;
  TokenStandard token_standard = 4;
  string chain_id = 5;
  string deployer_address = 6;
  string image_url = 7;
  string banner_url = 8;
  int32 max_supply = 9;
  string mint_price_public = 10;
  string mint_price_allowlist = 11;
  string royalty_recipient = 12;
  int32 royalty_fee_bps = 13;
}

message CreateCollectionResponse {
  Collection collection = 1;
}

service CollectionService {
  rpc CreateCollection(CreateCollectionRequest) returns (CreateCollectionResponse);
  rpc UpdateCollection(UpdateCollectionRequest) returns (UpdateCollectionResponse);
  rpc GetCollection(GetCollectionRequest) returns (GetCollectionResponse);
  rpc AddToAllowlist(AddToAllowlistRequest) returns (AddToAllowlistResponse);
}
```

## TypeScript Types (SDK)

```typescript
// sdk/src/types/collection.ts
export interface Collection {
  id: string;
  name: string;
  symbol: string;
  description?: string;
  tokenStandard: 'ERC721' | 'ERC1155';
  chainId: string;
  contractAddress?: string;
  deployerAddress: string;
  status: 'PENDING' | 'DEPLOYED' | 'FAILED' | 'ARCHIVED';
  imageUrl?: string;
  bannerUrl?: string;
  maxSupply: number;
  mintPricePublic: string;
  mintPriceAllowlist: string;
  royaltyRecipient: string;
  royaltyFeeBps: number;
}

export interface CreateCollectionParams {
  name: string;
  symbol: string;
  description?: string;
  tokenStandard: 'ERC721' | 'ERC1155';
  chainId: string;
  deployerAddress: string;
  imageUrl?: string;
  bannerUrl?: string;
  maxSupply: number;
  mintPricePublic: string;
  mintPriceAllowlist: string;
  royaltyRecipient: string;
  royaltyFeeBps: number;
}
```

## Files to Create/Modify

| Project | Files |
|---------|-------|
| api | proto/collection.proto |
| api | generated/ (proto gen) |
| sdk | src/types/collection.ts |
| sdk | src/types/index.ts |

## Code Generation

```bash
# In api directory
protoc --go_out=. --go-grpc_out=. proto/collection.proto

# In SDK directory (if using protobuf-ts)
npx protoc --ts_out=. ../api/proto/collection.proto
```

## Success Criteria

- [ ] Protobuf schema defined
- [ ] Go types generated
- [ ] TypeScript types match protobuf
- [ ] Types exported correctly
