---
title: "Phase 2: Create Domain Fakers"
phase: 2
status: pending
effort: 2h
dependencies: [phase-01-setup-fakerjs]
---

# Phase 2: Create Domain Fakers

## Overview

Create domain-specific faker modules for accounts, collections, NFTs, and marketplace data.

## Context

- **Plan**: [plan.md](./plan.md)
- **Previous Phase**: [phase-01-setup-fakerjs.md](./phase-01-setup-fakerjs.md)
- **Types**: Review `src/shared/types/account.ts`, `src/shared/types/collection.ts`, `src/shared/types/nft-detail.ts`

## Requirements

### Functional
- Create typed faker functions for each domain
- Support overrides parameter for customization
- Generate realistic blockchain addresses (EVM, Solana)
- Generate realistic NFT metadata

### Non-functional
- Use Faker.js modules (finance, person, image, etc.)
- Keep functions pure and deterministic when seeded

## Implementation Steps

1. **Create account.faker.ts**
   ```typescript
   import { faker } from './faker-instance';
   import type { PlatformUser, UserIdentity, UserWalletLink, Platform } from '@/shared/types/account';

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
         : faker.string.alphanumeric(44);
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

2. **Create collection.faker.ts**
   ```typescript
   import { faker } from './faker-instance';
   import type { Collection, ChainBinding } from '@/shared/types/collection';
   import type { MockCollectionKind } from './mockCollection';

   export const collectionFaker = {
     chainBinding(kind: MockCollectionKind): ChainBinding {
       const bindings: Record<MockCollectionKind, ChainBinding> = {
         ethereum: { chainId: 'eip155:1', tokenStandard: 'ERC721', contractAddress: faker.finance.ethereumAddress(), isPrimary: true },
         polygon: { chainId: 'eip155:137', tokenStandard: 'ERC721', contractAddress: faker.finance.ethereumAddress(), isPrimary: true },
         base: { chainId: 'eip155:8453', tokenStandard: 'ERC721', contractAddress: faker.finance.ethereumAddress(), isPrimary: true },
         arbitrum: { chainId: 'eip155:42161', tokenStandard: 'ERC721', contractAddress: faker.finance.ethereumAddress(), isPrimary: true },
         optimism: { chainId: 'eip155:10', tokenStandard: 'ERC721', contractAddress: faker.finance.ethereumAddress(), isPrimary: true },
         solana: { chainId: 'solana:mainnet', tokenStandard: 'SPL', mintAuthority: faker.string.alphanumeric(44), isPrimary: true }
       };
       return bindings[kind];
     },

     collection(name?: string, kind: MockCollectionKind = 'ethereum', overrides?: Partial<Collection>): Collection {
       const slugBase = faker.helpers.slugify(name || faker.commerce.productName()).toLowerCase();
       const createdAt = faker.date.past().toISOString();

       return {
         id: `col_${faker.string.alphanumeric(12)}`,
         slug: `${slugBase}-${faker.string.alphanumeric(4)}`,
         name: name || faker.commerce.productName(),
         description: faker.lorem.paragraph(),
         imageUrl: faker.image.urlPicsumPhotos({ width: 400, height: 400 }),
         bannerUrl: faker.image.urlPicsumPhotos({ width: 1200, height: 300 }),
         websiteUrl: faker.internet.url(),
         socialLinks: {
           twitter: faker.helpers.maybe(() => `https://x.com/${faker.internet.userName()}`),
           discord: faker.helpers.maybe(() => `https://discord.gg/${faker.string.alphanumeric(6)}`),
           telegram: faker.helpers.maybe(() => `https://t.me/${faker.internet.userName()}`)
         },
         isVerified: faker.datatype.boolean(0.35),
         createdAt,
         updatedAt: createdAt,
         status: faker.helpers.arrayElement(['upcoming', 'live', 'ended', 'paused']),
         mintStartDate: faker.date.future().toISOString(),
         mintEndDate: faker.date.future({ years: 1 }).toISOString(),
         totalMinted: faker.number.int({ min: 0, max: 10000 }),
         maxSupply: faker.number.int({ min: 1000, max: 10000 }),
         mintPrice: faker.helpers.arrayElement(['0.05 ETH', '0.1 ETH', '0.5 ETH', '1 ETH', '2 SOL']),
         ...overrides
       };
     },

     collections(count: number = 5, kind: MockCollectionKind = 'ethereum'): Collection[] {
       return Array.from({ length: count }, () => this.collection(undefined, kind));
     }
   };
   ```

3. **Create nft.faker.ts**
   ```typescript
   import { faker } from './faker-instance';
   import type { NFTDetail, NFTActivity, NFTOffer } from '@/shared/types/nft-detail';

   export const nftFaker = {
     activity(tokenId: string, index: number = 0): NFTActivity {
       const types: NFTActivity['type'][] = ['mint', 'transfer', 'sale', 'listing', 'offer'];
       return {
         id: `activity-${tokenId}-${index}`,
         type: types[index % types.length],
         from: {
           address: faker.finance.ethereumAddress(),
           name: faker.internet.userName()
         },
         to: index % 2 === 0 ? {
           address: faker.finance.ethereumAddress(),
           name: faker.internet.userName()
         } : undefined,
         price: index % 3 === 0 ? faker.finance.amount({ min: 0.001, max: 2, dec: 3 }) : undefined,
         currency: 'ETH',
         timestamp: faker.date.recent({ days: 30 }),
         txHash: faker.string.hexadecimal({ length: 64 })
       };
     },

     offer(tokenId: string, index: number = 0): NFTOffer {
       const statuses: NFTOffer['status'][] = ['active', 'accepted', 'rejected', 'expired'];
       return {
         id: `offer-${tokenId}-${index}`,
         offerer: {
           address: faker.finance.ethereumAddress(),
           name: faker.internet.userName(),
           avatar: faker.image.avatar()
         },
         price: faker.finance.amount({ min: 0.1, max: 1.5, dec: 3 }),
         currency: 'ETH',
         expiresAt: faker.date.future({ days: 7 }),
         createdAt: faker.date.recent({ days: 7 }),
         status: statuses[index % statuses.length]
       };
     },

     activities(tokenId: string, count: number = 10): NFTActivity[] {
       return Array.from({ length: count }, (_, i) => this.activity(tokenId, i));
     },

     offers(tokenId: string, count: number = 5): NFTOffer[] {
       return Array.from({ length: count }, (_, i) => this.offer(tokenId, i));
     }
   };
   ```

4. **Create marketplace.faker.ts**
   ```typescript
   import { faker } from './faker-instance';
   import { NftStatus } from '@/modules/marketplace/types';

   export const marketplaceFaker = {
     nft(contractAddress: string, startId: number, index: number) {
       const id = startId + index;
       return {
         id: `nft-${id}`,
         tokenId: `${id}`,
         name: `NFT #${id}`,
         description: faker.lorem.sentence(),
         image: faker.image.urlPicsumPhotos({ width: 400, height: 400 }),
         contractAddress,
         chainId: '1',
         owner: faker.finance.ethereumAddress(),
         creator: faker.finance.ethereumAddress(),
         status: id % 3 === 0 ? NftStatus.Listed : NftStatus.NotListed,
         mintPrice: faker.finance.amount({ min: 0.01, max: 0.1, dec: 3 }),
         listPrice: id % 3 === 0 ? faker.finance.amount({ min: 0.02, max: 0.1, dec: 3 }) : undefined,
         attributes: [
           { trait_type: 'Background', value: faker.helpers.arrayElement(['Path', 'Orchard', 'Library']) },
           { trait_type: 'Body', value: faker.helpers.arrayElement(['Blue', 'Red', 'Yellow']) },
           { trait_type: 'Rarity', value: faker.helpers.arrayElement(['Common', 'Rare', 'Epic']) }
         ],
         createdAt: faker.date.past().toISOString(),
         updatedAt: faker.date.recent().toISOString()
       };
     },

     nfts(count: number, contractAddress: string, startId: number = 1) {
       return Array.from({ length: count }, (_, i) => this.nft(contractAddress, startId, i));
     }
   };
   ```

## Related Code Files

**Create:**
- `src/shared/utils/mock/fakers/account.faker.ts`
- `src/shared/utils/mock/fakers/collection.faker.ts`
- `src/shared/utils/mock/fakers/nft.faker.ts`
- `src/shared/utils/mock/fakers/marketplace.faker.ts`
- `src/shared/utils/mock/fakers/index.ts` (barrel export)

## Todo

- [ ] Create account.faker.ts with identity, wallet, platformUser methods
- [ ] Create collection.faker.ts with chainBinding, collection methods
- [ ] Create nft.faker.ts with activity, offer methods
- [ ] Create marketplace.faker.ts with nft generation
- [ ] Create index.ts barrel export
- [ ] Run typecheck

## Success Criteria

- [ ] All faker modules compile without errors
- [ ] Functions return correct types
- [ ] Overrides parameter works for all functions
- [ ] Seeded faker produces deterministic output

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Type mismatches | Medium | Validate against existing interfaces |
| Missing edge cases | Low | Port all logic from existing mocks |
