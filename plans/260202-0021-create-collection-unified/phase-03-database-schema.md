---
title: "Phase 03: Database Schema (API)"
description: "Database migrations and models for collection service"
status: pending
priority: P0
effort: 4-6h
dependencies: []
---

# Phase 03: Database Schema

## Overview

Create database schema for collection storage in API service.

## Migration Files

```sql
-- api/migrations/001_create_collections_table.sql
CREATE TABLE collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    symbol VARCHAR(50) NOT NULL,
    description TEXT,
    token_standard VARCHAR(20) NOT NULL,
    chain_id VARCHAR(50) NOT NULL,
    contract_address VARCHAR(42),
    deployer_address VARCHAR(42) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',
    image_url TEXT,
    banner_url TEXT,
    featured_image_url TEXT,
    base_uri TEXT,
    max_supply INTEGER,
    mint_price_public VARCHAR(50),
    mint_price_allowlist VARCHAR(50),
    mint_start_time TIMESTAMP,
    allowlist_stage_end TIMESTAMP,
    mint_limit_per_wallet INTEGER DEFAULT 0,
    royalty_fee_bps INTEGER DEFAULT 0,
    royalty_recipient VARCHAR(42),
    total_supply INTEGER DEFAULT 0,
    total_minted INTEGER DEFAULT 0,
    index_status VARCHAR(20) DEFAULT 'NOT_INDEXED',
    is_verified BOOLEAN DEFAULT FALSE,
    is_hidden BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deployed_at TIMESTAMP
);

CREATE INDEX idx_collections_status ON collections(status);
CREATE INDEX idx_collections_deployer ON collections(deployer_address);
CREATE INDEX idx_collections_contract ON collections(contract_address);
CREATE INDEX idx_collections_chain ON collections(chain_id);

-- Allowlist table
CREATE TABLE collection_allowlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
    wallet_address VARCHAR(42) NOT NULL,
    max_mint_amount INTEGER DEFAULT 1,
    minted_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(collection_id, wallet_address)
);

CREATE INDEX idx_allowlist_collection ON collection_allowlists(collection_id);
CREATE INDEX idx_allowlist_wallet ON collection_allowlists(wallet_address);

-- Collection metadata
CREATE TABLE collection_metadata (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
    metadata_uri TEXT,
    ipfs_hash VARCHAR(100),
    ipfs_url TEXT,
    discord_url TEXT,
    twitter_url TEXT,
    instagram_url TEXT,
    medium_url TEXT,
    telegram_url TEXT,
    background_color VARCHAR(10),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

## Go Models

```go
// api/internal/models/collection.go
package models

import (
    "time"
    "github.com/google/uuid"
)

type Collection struct {
    ID                uuid.UUID  `db:"id" json:"id"`
    Slug              string     `db:"slug" json:"slug"`
    Name              string     `db:"name" json:"name"`
    Symbol            string     `db:"symbol" json:"symbol"`
    Description       *string    `db:"description" json:"description,omitempty"`
    TokenStandard     string     `db:"token_standard" json:"tokenStandard"`
    ChainID           string     `db:"chain_id" json:"chainId"`
    ContractAddress   *string    `db:"contract_address" json:"contractAddress,omitempty"`
    DeployerAddress   string     `db:"deployer_address" json:"deployerAddress"`
    Status            string     `db:"status" json:"status"`
    ImageURL          *string    `db:"image_url" json:"imageUrl,omitempty"`
    BannerURL         *string    `db:"banner_url" json:"bannerUrl,omitempty"`
    MaxSupply         *int32     `db:"max_supply" json:"maxSupply,omitempty"`
    MintPricePublic   *string    `db:"mint_price_public" json:"mintPricePublic,omitempty"`
    MintPriceAllowlist *string   `db:"mint_price_allowlist" json:"mintPriceAllowlist,omitempty"`
    RoyaltyRecipient  *string    `db:"royalty_recipient" json:"royaltyRecipient,omitempty"`
    RoyaltyFeeBps     int32      `db:"royalty_fee_bps" json:"royaltyFeeBps"`
    TotalSupply       int32      `db:"total_supply" json:"totalSupply"`
    TotalMinted       int32      `db:"total_minted" json:"totalMinted"`
    IndexStatus       string     `db:"index_status" json:"indexStatus"`
    IsVerified        bool       `db:"is_verified" json:"isVerified"`
    IsHidden          bool       `db:"is_hidden" json:"isHidden"`
    CreatedAt         time.Time  `db:"created_at" json:"createdAt"`
    UpdatedAt         time.Time  `db:"updated_at" json:"updatedAt"`
    DeployedAt        *time.Time `db:"deployed_at" json:"deployedAt,omitempty"`
}
```

## Files to Create

| Project | Files |
|---------|-------|
| api | migrations/001_create_collections_table.sql |
| api | migrations/002_create_allowlist_table.sql |
| api | internal/models/collection.go |
| api | internal/repository/collection.go |

## Success Criteria

- [ ] Migrations created
- [ ] Models defined
- [ ] Repository layer implemented
- [ ] Indexes created for performance
