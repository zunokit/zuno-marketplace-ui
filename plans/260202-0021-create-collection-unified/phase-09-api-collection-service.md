---
title: "Phase 05: API Collection Service"
description: "GraphQL resolvers and gRPC service for collection management"
status: pending
priority: P0
effort: 12-16h
dependencies: ["Phase 02", "Phase 03"]
---

# Phase 05: API Collection Service

## Project
zuno-marketplace-api

## Overview
GraphQL gateway and gRPC service for collection CRUD operations.

## GraphQL Schema

```graphql
type Collection {
  id: ID!
  slug: String!
  name: String!
  symbol: String!
  description: String
  tokenStandard: TokenStandard!
  chainId: String!
  contractAddress: String
  deployerAddress: String!
  status: CollectionStatus!
  imageUrl: String
  maxSupply: Int
  mintPricePublic: String
  royaltyFeeBps: Int
  createdAt: String!
  updatedAt: String!
}

enum TokenStandard {
  ERC721
  ERC1155
}

enum CollectionStatus {
  PENDING
  DEPLOYED
  FAILED
  ARCHIVED
}

type Mutation {
  createCollection(input: CreateCollectionInput!): Collection!
  updateCollection(id: ID!, input: UpdateCollectionInput!): Collection!
  addToAllowlist(input: AddToAllowlistInput!): Boolean!
}
```

## Service Implementation

```go
// internal/service/collection.go
package service

type CollectionService struct {
    repo repository.CollectionRepository
    indexerClient indexer.Client
}

func (s *CollectionService) CreateCollection(ctx context.Context, req *pb.CreateCollectionRequest) (*pb.CreateCollectionResponse, error) {
    // Validate input
    // Generate slug
    // Create DB record with status=PENDING
    // Return collection
}

func (s *CollectionService) UpdateCollection(ctx context.Context, req *pb.UpdateCollectionRequest) (*pb.UpdateCollectionResponse, error) {
    // Update contract address and status
    // Trigger indexer verification
}
```

## Files

| File | Purpose |
|------|---------|
| graph/schema/collection.graphql | GraphQL schema |
| graph/resolver/collection.go | Resolvers |
| internal/service/collection.go | Business logic |
| internal/repository/collection.go | Data access |

## Success Criteria
- [ ] CreateCollection mutation working
- [ ] UpdateCollection mutation working
- [ ] GetCollection query working
- [ ] AddToAllowlist mutation working
- [ ] Slug generation unique
