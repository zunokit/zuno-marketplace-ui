---
title: "Phase 04: SDK Collection Module"
description: "Complete SDK implementation for collection creation"
status: pending
priority: P0
effort: 10-12h
dependencies: ["Phase 02"]
---

# Phase 04: SDK Collection Module

## Project
zuno-marketplace-sdk

## Overview
Complete CollectionModule with error handling, retry logic, and event parsing.

## Key Methods

```typescript
class CollectionModule extends BaseModule {
  // Core deployment
  async createERC721Collection(params: CreateERC721CollectionParams)
  async createERC1155Collection(params: CreateERC1155CollectionParams)

  // Allowlist management
  async addToAllowlist(collectionAddress: string, addresses: string[])
  async removeFromAllowlist(collectionAddress: string, addresses: string[])
  async setAllowlistOnly(collectionAddress: string, enabled: boolean)

  // Verification
  async verifyCollection(address: string): Promise<{isValid: boolean; tokenType: TokenStandard}>
  async getCollectionInfo(address: string): Promise<CollectionInfo>

  // Events
  async getCreatedCollections(options?: FilterOptions): Promise<CreatedCollection[]>
}
```

## Error Handling

```typescript
// Retry with exponential backoff
const deployWithRetry = async (params: CollectionParams, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await this.deploy(params);
    } catch (err) {
      if (isUserRejection(err)) throw err;
      if (i === maxRetries - 1) throw new SDKCollectionError({
        code: 'DEPLOYMENT_FAILED',
        message: err.message,
        step: 'DEPLOY_CONTRACT',
        recoverable: false
      });
      await delay(Math.pow(2, i) * 1000);
    }
  }
};
```

## Files

| File | Purpose |
|------|---------|
| src/modules/CollectionModule.ts | Main module |
| src/errors/CollectionError.ts | Error types |
| src/types/collection.ts | TypeScript types |
| src/react/useCollection.ts | React hook |

## Success Criteria
- [ ] ERC721 deployment working
- [ ] ERC1155 deployment working
- [ ] Allowlist operations working
- [ ] Retry logic implemented
- [ ] Events parsed correctly
