# Brainstorm Report: Migrate Manual Mocks to Faker.js

## Problem Statement

Current mock system uses hand-crafted mock data generators across 13 files in `src/shared/utils/mock/`. This approach has critical maintainability issues:

1. **High Maintenance Burden**: When domain types change (e.g., `PlatformUser`, `Collection`, `NFTDetail`), every mock file must be manually updated
2. **Inconsistent Data**: Random values generated via `Math.random()` lack realism - addresses, names, and relationships don't follow real-world patterns
3. **No Localization**: Hardcoded English strings, no support for i18n testing
4. **Boilerplate Heavy**: ~800 lines of mock code with repetitive patterns for generating IDs, dates, addresses
5. **Seedability Missing**: Cannot reproduce specific test scenarios since `Math.random()` is non-deterministic

## Current Mock Files Analysis

| File | Lines | Purpose | Issues |
|------|-------|---------|--------|
| `mockAccount.ts` | 141 | Platform user accounts | Hardcoded usernames, addresses, platform-specific branching |
| `mockCollection.ts` | 224 | NFT collections | Custom random generators for EVM/Solana addresses, complex date logic |
| `mockBanner.ts` | 17 | Banner carousel | Simple but uses `Math.random()` for prices |
| `mockChain.ts` | 30 | Chain info | Mostly static, minimal issue |
| `randomImage.ts` | 6 | Image URLs | Static picsum URLs |
| `nft-detail.ts` | 87 | NFT detail page | Activities/offers with repetitive random generation |
| `profile.ts` | 107 | User profiles | Hardcoded user data, activity generation loops |
| `marketplace.ts` | ~200 | Marketplace items | Complex NFT generation with attributes |
| `auction.ts` | ~100 | Auction data | Time-based mock data |
| `wallet.ts` | ~50 | Wallet connections | Address generation |
| `sidebarData.ts` | ~80 | Navigation data | Static with some randomization |
| `url.ts` | ~20 | URL helpers | Minimal |
| `mock-adapter.ts` | 91 | Query adapter | Cursor pagination with mock NFTs |

**Total**: ~1,150 lines of mock code

## Proposed Solution: @faker-js/faker

### Why Faker.js?

1. **Battle-tested**: 25M+ weekly downloads, industry standard
2. **Type-safe**: Full TypeScript support with typed locales
3. **Deterministic**: Seed support for reproducible tests
4. **Comprehensive**: 100+ modules covering addresses, names, crypto, dates, commerce
5. **Localized**: 60+ locales for i18n testing
6. **Tree-shakeable**: Only import what you need

### Migration Strategy

#### Option A: Full Migration (Recommended)
Replace all manual mocks with Faker.js generators

**Pros**:
- Consistent API across all mocks
- Seedable for deterministic tests
- Realistic data patterns (real names, valid address formats)
- Reduced code volume (~60% reduction expected)

**Cons**:
- Initial migration effort (~4-6 hours)
- All consuming tests need validation

#### Option B: Gradual Migration
Migrate file-by-file as features are touched

**Pros**:
- Lower upfront cost
- Incremental validation

**Cons**:
- Inconsistent patterns persist longer
- Technical debt remains

#### Option C: Hybrid with Factory Pattern
Keep structure, replace `Math.random()` with Faker.js

**Pros**:
- Minimal structural changes
- Familiar API for existing devs

**Cons**:
- Misses opportunity to simplify
- Still maintain custom code

## Recommended Approach: Option A - Full Migration

### Implementation Plan

#### Phase 1: Setup & Core Utilities (30 min)
```bash
pnpm add -D @faker-js/faker
```

Create `src/shared/utils/mock/faker-instance.ts`:
```typescript
import { fakerEN as faker } from '@faker-js/faker';

// Configurable seed for deterministic tests
let currentSeed: number | undefined;

export function setFakerSeed(seed: number) {
  currentSeed = seed;
  faker.seed(seed);
}

export function resetFakerSeed() {
  faker.seed(currentSeed);
}

export { faker };
```

#### Phase 2: Domain-Specific Fakers (2 hours)

Create `src/shared/utils/mock/fakers/`:

```typescript
// fakers/account.faker.ts
import { faker } from '../faker-instance';
import type { PlatformUser, UserIdentity, UserWalletLink } from '@/shared/types/account';

export const accountFaker = {
  identity(overrides?: Partial<UserIdentity>): UserIdentity {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    return {
      userId: faker.string.uuid(),
      username: faker.internet.userName({ firstName, lastName }),
      displayName: faker.person.fullName({ firstName, lastName }),
      bio: faker.lorem.sentence(3),
      pfpUrl: faker.image.avatar(),
      bannerUrl: faker.image.urlPicsumPhotos({ width: 1200, height: 300 }),
      profileUrl: faker.internet.url(),
      ensName: faker.helpers.maybe(() => `${faker.word.sample()}.eth`, { probability: 0.3 }),
      ...overrides
    };
  },

  wallet(chainFamily: 'EVM' | 'Solana' = 'EVM'): UserWalletLink {
    const address = chainFamily === 'EVM'
      ? faker.finance.ethereumAddress()
      : faker.string.alphanumeric(44); // Solana base58
    return {
      chainId: chainFamily === 'EVM' ? 'eip155:1' : 'solana:mainnet',
      address,
      isPublic: faker.datatype.boolean(0.8),
      isPrimary: faker.datatype.boolean(0.3)
    };
  },

  platformUser(platform: Platform = 'opensea', overrides?: Partial<PlatformUser>): PlatformUser {
    return {
      platform,
      identity: this.identity(),
      socials: {
        x: faker.helpers.maybe(() => faker.internet.userName()),
        discord: platform === 'zuno' ? faker.internet.userName() : undefined
      },
      wallets: [
        this.wallet(platform === 'opensea' ? 'EVM' : 'Solana'),
        this.wallet(faker.helpers.arrayElement(['EVM', 'Solana']))
      ],
      preferences: {
        theme: faker.helpers.arrayElement(['light', 'dark']),
        email: {
          enabled: faker.datatype.boolean(),
          itemSold: faker.datatype.boolean(),
          bidActivity: faker.datatype.boolean(),
          priceChange: faker.datatype.boolean(),
          outbid: faker.datatype.boolean(),
          ownedItemUpdates: faker.datatype.boolean(),
          successfulPurchase: faker.datatype.boolean(),
          successfulMint: faker.datatype.boolean(),
          minimumOfferThreshold: faker.finance.amount({ min: 0.01, max: 1, dec: 2 })
        }
      },
      stats: {
        itemsOwned: faker.number.int({ min: 0, max: 1000 }),
        offersMade: faker.number.int({ min: 0, max: 100 }),
        offersReceived: faker.number.int({ min: 0, max: 50 }),
        followersCount: faker.number.int({ min: 0, max: 10000 }),
        followingCount: faker.number.int({ min: 0, max: 1000 })
      },
      createdAt: faker.date.past().toISOString(),
      updatedAt: faker.date.recent().toISOString(),
      ...overrides
    };
  }
};
```

Similar patterns for:
- `collection.faker.ts` - Collections with realistic NFT metadata
- `nft.faker.ts` - NFT tokens with attributes
- `marketplace.faker.ts` - Listings, offers, activities
- `chain.faker.ts` - Chain configurations

#### Phase 3: Legacy File Migration (2 hours)

Replace each existing mock file:

1. `mockAccount.ts` → re-export from `account.faker.ts`
2. `mockCollection.ts` → re-export from `collection.faker.ts`
3. `mockBanner.ts` → use `faker.image.urlPicsumPhotos()`
4. `nft-detail.ts` → `nft.faker.ts` with activity generation
5. `profile.ts` → `account.faker.ts` methods
6. `marketplace.ts` → `marketplace.faker.ts`

#### Phase 4: Test Validation (1 hour)
- Run existing test suite
- Verify no breaking changes in mock shapes
- Check for seed-dependent snapshot tests

### Code Volume Comparison

| Approach | Estimated Lines | Maintainability |
|----------|----------------|-----------------|
| Current Manual | ~1,150 | Poor |
| With Faker.js | ~400 | Excellent |
| **Reduction** | **~65%** | **High** |

### Benefits Summary

1. **Maintainability**: Type changes only need updates in one place per domain
2. **Realism**: Addresses are valid format, names are realistic, dates make sense
3. **Test Reliability**: Seedable for deterministic test runs
4. **Developer Experience**: IntelliSense support, consistent patterns
5. **i18n Ready**: Switch locale for international testing
6. **Community**: Well-documented, actively maintained

### Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Breaking existing tests | Keep legacy exports during transition, run full test suite |
| Faker.js bundle size | Use tree-shaking imports (`@faker-js/faker/locale/en`) |
| Seed conflicts in parallel tests | Use per-test seeds or test runner isolation |
| Data shape changes | Validate against existing TypeScript interfaces |

### Success Criteria

- [ ] All 13 mock files migrated or deprecated
- [ ] Zero TypeScript errors
- [ ] All existing tests pass
- [ ] Mock data volume reduced by 50%+
- [ ] New mock data can be seeded for determinism
- [ ] Documentation updated with faker patterns

## Next Steps

If approved, run `/plan` to create detailed implementation phases with task breakdowns.

---

**Unresolved Questions:**
1. Should we maintain backward compatibility with existing mock exports during transition?
2. Do we need multiple locales (vi, en) for testing i18n features?
3. Should we add custom Faker.js modules for blockchain-specific data (CAIP-2 chain IDs, token standards)?
