---
title: "Phase 3: Migrate Mock Files"
phase: 3
status: pending
effort: 2h
dependencies: [phase-02-create-domain-fakers]
---

# Phase 3: Migrate Mock Files

## Overview

Refactor existing mock files to use new domain fakers while maintaining backward compatibility.

## Context

- **Plan**: [plan.md](./plan.md)
- **Previous Phase**: [phase-02-create-domain-fakers.md](./phase-02-create-domain-fakers.md)
- **Domain Fakers**: `src/shared/utils/mock/fakers/`

## Files to Migrate

| File | Lines | Migration Strategy |
|------|-------|-------------------|
| mockAccount.ts | 141 | Replace internals with accountFaker |
| mockCollection.ts | 224 | Replace internals with collectionFaker |
| mockBanner.ts | 17 | Use faker.image |
| nft-detail.ts | 87 | Use nftFaker + marketplaceFaker |
| profile.ts | 107 | Use accountFaker |
| marketplace.ts | ~200 | Use marketplaceFaker |
| auction.ts | ~100 | Use faker.date + finance |
| wallet.ts | ~50 | Use faker.finance |
| sidebarData.ts | ~80 | Use faker helpers |

## Files Unchanged

| File | Reason |
|------|--------|
| mockChain.ts | Static data, no randomization needed |
| mock-adapter.ts | Complex adapter logic, minimal benefit |
| randomImage.ts | Simple utility, keep as-is |
| url.ts | Static helpers |

## Implementation Steps

### 1. Migrate mockAccount.ts

Replace implementation to use accountFaker:

```typescript
import type { Platform, PlatformUser } from "@/shared/types/account";
import { accountFaker } from "./fakers/account.faker";

// Re-export with same API for backward compatibility
export function makeMockAccount(
  platform: Platform = "opensea",
  overrides: Partial<PlatformUser> = {}
): PlatformUser {
  return accountFaker.platformUser(platform, overrides);
}

export const mockOpenSeaAccount = (overrides: Partial<PlatformUser> = {}) =>
  makeMockAccount("opensea", overrides);

export const mockZunoAccount = (overrides: Partial<PlatformUser> = {}) =>
  makeMockAccount("zuno", overrides);
```

### 2. Migrate mockCollection.ts

```typescript
import type { Collection } from "@/shared/types/collection";
import type { MockCollectionKind } from "./mockCollection";
import { collectionFaker } from "./fakers/collection.faker";

export type { MockCollectionKind };

export function makeMockCollection(
  name = "Sample Collection",
  kind: MockCollectionKind = "ethereum",
  overrides: Partial<Collection> = {}
): Collection {
  return collectionFaker.collection(name, kind, overrides);
}

export const mockCollectionETH = (name = "ETH Legends", overrides: Partial<Collection> = {}) =>
  makeMockCollection(name, "ethereum", overrides);

export const mockCollectionPOL = (name = "POL Pixels", overrides: Partial<Collection> = {}) =>
  makeMockCollection(name, "polygon", overrides);

export const mockCollectionBASE = (name = "Base Buddies", overrides: Partial<Collection> = {}) =>
  makeMockCollection(name, "base", overrides);

export const mockCollectionARB = (name = "Arbi Adventurers", overrides: Partial<Collection> = {}) =>
  makeMockCollection(name, "arbitrum", overrides);

export const mockCollectionSOL = (name = "SOL Spirits", overrides: Partial<Collection> = {}) =>
  makeMockCollection(name, "solana", overrides);

export function makeMockCollections(
  count = 5,
  kind: MockCollectionKind = "ethereum"
): Collection[] {
  return collectionFaker.collections(count, kind);
}
```

### 3. Migrate mockBanner.ts

```typescript
import { Banner } from "@/shared/types/banner";
import { faker } from "./faker-instance";

const VIDEO_URL = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

export const mockBanner = (n: number): Banner[] => {
  return Array.from({ length: n }, (_, index) => ({
    name: `Banner ${index + 1}`,
    author: faker.person.fullName(),
    totalItems: index + 1,
    floorPrice: faker.finance.amount({ min: 2, max: 6, dec: 1 }),
    thumbnailImages: [
      faker.image.urlPicsumPhotos({ width: 400, height: 400 }),
      faker.image.urlPicsumPhotos({ width: 400, height: 400 }),
      faker.image.urlPicsumPhotos({ width: 400, height: 400 })
    ],
    mainBackground: faker.datatype.boolean()
      ? faker.image.urlPicsumPhotos({ width: 1920, height: 1080 })
      : VIDEO_URL,
  }));
};
```

### 4. Migrate nft-detail.ts

```typescript
import { type NFTDetail } from "@/shared/types/nft-detail";
import { nftFaker } from "./fakers/nft.faker";
import { marketplaceFaker } from "./fakers/marketplace.faker";

export const generateNFTDetail = (
  chain: string,
  contractAddress: string,
  tokenId: string
): NFTDetail => {
  const baseNFT = marketplaceFaker.nft(contractAddress, parseInt(tokenId), 0);

  return {
    ...baseNFT,
    blockchain: {
      chain,
      contractAddress,
      tokenStandard: "ERC-721",
      tokenId,
    },
    metadata: {
      description: faker.lorem.paragraph(),
      externalUrl: faker.internet.url(),
      animationUrl: undefined,
      backgroundColor: faker.color.hex(),
    },
    history: nftFaker.activities(tokenId, 10),
    offers: nftFaker.offers(tokenId, 5).filter(o => o.status === "active"),
    moreFromCollection: marketplaceFaker.nfts(8, contractAddress, 1),
    rarity: {
      rank: faker.number.int({ min: 1, max: 1000 }),
      score: faker.number.float({ min: 0, max: 100 }),
      totalSupply: 10000,
    },
  };
};
```

### 5. Migrate profile.ts

```typescript
import { type UserProfile, type ProfileActivity } from "@/shared/types/profile";
import { faker } from "./faker-instance";
import { marketplaceFaker } from "./fakers/marketplace.faker";

export const mockUserProfiles: UserProfile[] = [
  {
    id: "user-1",
    address: faker.finance.ethereumAddress(),
    username: "cryptoartist",
    displayName: "Crypto Artist",
    bio: faker.lorem.paragraph(),
    avatar: faker.image.avatar(),
    banner: faker.image.urlPicsumPhotos({ width: 1200, height: 300 }),
    email: faker.internet.email(),
    website: faker.internet.url(),
    twitter: "@cryptoartist",
    discord: "cryptoartist#1234",
    createdAt: faker.date.past(),
    updatedAt: new Date(),
    verified: true,
    stats: {
      nftsOwned: 156,
      nftsCreated: 89,
      collections: 5,
      totalVolume: "1,234.56 ETH",
      floorPrice: "0.08 ETH",
      followers: 12456,
      following: 234,
    },
  },
  // ... second profile
];

const activityTypes: ProfileActivity["type"][] = [
  "purchase", "sale", "listing", "bid", "transfer", "mint"
];

export const generateMockActivities = (
  userId: string,
  count: number = 20
): ProfileActivity[] => {
  const nfts = marketplaceFaker.nfts(count, faker.finance.ethereumAddress(), 1);

  return nfts.map((nft, i) => {
    const type = activityTypes[i % activityTypes.length];
    return {
      id: `activity-${userId}-${i}`,
      type,
      nft: {
        id: nft.id,
        name: nft.name,
        image: nft.image,
        tokenId: nft.tokenId,
        collection: "Mock Collection",
      },
      from: type === "purchase" || type === "transfer"
        ? faker.finance.ethereumAddress()
        : userId,
      to: type === "sale" || type === "transfer"
        ? faker.finance.ethereumAddress()
        : userId,
      price: ["purchase", "sale", "listing", "bid"].includes(type)
        ? faker.finance.amount({ min: 0.01, max: 0.5, dec: 3 })
        : undefined,
      currency: ["purchase", "sale", "listing", "bid"].includes(type) ? "ETH" : undefined,
      timestamp: faker.date.recent({ days: 30 }),
      txHash: faker.string.hexadecimal({ length: 64 }),
    };
  }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

export const mockCurrentUser: UserProfile = mockUserProfiles[0];
export const mockUserActivities = generateMockActivities(mockCurrentUser.id);
```

### 6. Migrate marketplace.ts

```typescript
import { marketplaceFaker } from "./fakers/marketplace.faker";

// Generate consistent mock NFTs array
export const mockNFTs = marketplaceFaker.nfts(24, "0x1234567890123456789012345678901234567890", 1);
```

### 7. Migrate auction.ts, wallet.ts, sidebarData.ts

Similar pattern - replace `Math.random()` with faker methods while keeping same exports.

## Related Code Files

**Modify:**
- `src/shared/utils/mock/mockAccount.ts`
- `src/shared/utils/mock/mockCollection.ts`
- `src/shared/utils/mock/mockBanner.ts`
- `src/shared/utils/mock/nft-detail.ts`
- `src/shared/utils/mock/profile.ts`
- `src/shared/utils/mock/marketplace.ts`
- `src/shared/utils/mock/auction.ts`
- `src/shared/utils/mock/wallet.ts`
- `src/shared/utils/mock/sidebarData.ts`

## Todo

- [ ] Migrate mockAccount.ts to use accountFaker
- [ ] Migrate mockCollection.ts to use collectionFaker
- [ ] Migrate mockBanner.ts to use faker.image
- [ ] Migrate nft-detail.ts to use nftFaker + marketplaceFaker
- [ ] Migrate profile.ts to use accountFaker + marketplaceFaker
- [ ] Migrate marketplace.ts to use marketplaceFaker
- [ ] Migrate auction.ts to use faker
- [ ] Migrate wallet.ts to use faker.finance
- [ ] Migrate sidebarData.ts to use faker helpers
- [ ] Run typecheck after each file

## Success Criteria

- [ ] All migrated files use Faker.js internally
- [ ] Public API unchanged (backward compatible)
- [ ] TypeScript compiles without errors
- [ ] No `Math.random()` calls remain in migrated files

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Breaking changes | High | Keep same function signatures |
| Data shape differences | Medium | Validate against existing types |
| Performance | Low | Faker.js is optimized |
