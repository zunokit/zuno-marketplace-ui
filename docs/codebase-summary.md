# Zuno Marketplace UI - Codebase Summary

**Version**: 0.1.0
**Last Updated**: 2026-01-31
**Total Files**: ~313 TypeScript/TSX files
**Total LOC**: ~36,314 lines

---

## 1. Architecture Overview

The Zuno Marketplace UI follows a modular architecture built on Next.js 16 with the App Router. The codebase is organized into three primary layers:

```
┌─────────────────────────────────────────────────────────────┐
│                      APP LAYER                               │
│  (Next.js App Router - Pages, Layouts, Loading States)       │
├─────────────────────────────────────────────────────────────┤
│                    MODULE LAYER                              │
│  (Feature Modules - Business Logic, Components, Hooks)       │
├─────────────────────────────────────────────────────────────┤
│                    SHARED LAYER                              │
│  (Cross-cutting - UI Components, Utils, API, Config)         │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Directory Structure

### 2.1 Root Structure

```
/e/zuno-marketplace-ui/
├── src/
│   ├── app/                    # Next.js App Router
│   ├── modules/                # Feature modules
│   └── shared/                 # Shared resources
├── public/                     # Static assets
├── docs/                       # Documentation
├── components.json             # shadcn/ui config
├── next.config.ts              # Next.js configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies
```

### 2.2 App Router Structure (`src/app/`)

The App Router uses route groups for organization:

| Route Group | Purpose | Files |
|-------------|---------|-------|
| `(analytics)` | Analytics & statistics pages | `stats/page.tsx` |
| `(creator)` | NFT creation flows | `create/`, `mint/` |
| `(discover)` | Homepage & discovery | `page.tsx`, `discover/` |
| `(marketplace)` | Core marketplace | `marketplace/`, `collections/`, `auctions/`, `launchpad/`, `nft/[slug]/` |
| `(user)` | User-related pages | `profile/`, `wallets/` |
| `activity/` | Global activity feed | `page.tsx` |
| `debug/` | Development tools | `page.tsx`, `ui/`, `sentry/` |

### 2.3 Module Structure (`src/modules/`)

Each module is self-contained with its own components, hooks, and utilities:

```
src/modules/
├── activity/           # Activity feed functionality
├── auctions/           # Auction system (bidding, timers)
├── chain/              # Blockchain configuration
├── collections/        # Collection browsing & management
├── create/             # NFT creation workflows
├── explore/            # Exploration features
├── launch-pad/         # Collection launchpad
├── launchpad/          # Launchpad components
├── marketplace/        # Core marketplace logic
├── nft-detail/         # NFT detail views
├── product-discovery/  # Homepage & discovery
├── profile/            # User profile management
├── stats/              # Statistics & analytics
└── wallets/            # Wallet integration
```

### 2.4 Shared Structure (`src/shared/`)

```
src/shared/
├── api/                # API client configuration
├── components/         # Shared React components
│   └── ui/             # shadcn/ui components (53 components)
├── config/             # App configuration
│   ├── api-endpoints.config.ts
│   ├── wagmi.ts
│   └── index.ts
├── constants/          # Application constants
├── contexts/           # React contexts
├── debug/              # Debug utilities
├── graphql/            # GraphQL schemas & codegen
├── hooks/              # Custom React hooks
├── lib/                # Library utilities
├── monitoring/         # Sentry & analytics
├── providers/          # Context providers
├── stores/             # Zustand stores
├── theme/              # Theme configuration
├── types/              # TypeScript types
└── utils/              # Utility functions
```

---

## 3. Module Organization

### 3.1 Module Anatomy

Each module follows a consistent structure:

```
modules/{module-name}/
├── components/         # Module-specific components
├── hooks/              # Custom hooks
├── stores/             # Zustand stores (if needed)
├── types/              # Module-specific types
├── utils/              # Module utilities
├── constants/          # Module constants
└── index.ts            # Public API exports
```

### 3.2 Key Modules

#### Marketplace Module
- **Purpose**: Core NFT trading functionality
- **Key Components**: Listing cards, price displays, buy buttons
- **Dependencies**: `shared/api`, `shared/stores`

#### Auctions Module
- **Purpose**: Auction system with bidding
- **Key Components**: Bid forms, countdown timers, bid history
- **Dependencies**: `shared/hooks`, `modules/wallets`

#### Collections Module
- **Purpose**: NFT collection browsing and management
- **Key Components**: Collection cards, grid layouts, filters
- **Dependencies**: `shared/components`, `shared/graphql`

#### Profile Module
- **Purpose**: User profile and portfolio management
- **Key Components**: Profile cards, NFT grids, activity feeds
- **Dependencies**: `modules/activity`, `shared/stores`

---

## 4. Key Patterns

### 4.1 Component Patterns

#### Server Components (Default)
```typescript
// app/page.tsx - Server Component
async function HomePage() {
  const data = await fetchData();
  return <HomeView data={data} />;
}
```

#### Client Components
```typescript
'use client';

// modules/marketplace/components/listing-card.tsx
import { useWallet } from '@/shared/hooks/use-wallet';

export function ListingCard({ listing }: ListingCardProps) {
  const { address } = useWallet();
  // Client-side logic
}
```

### 4.2 Data Fetching Patterns

#### GraphQL with Apollo
```typescript
// Using generated hooks
import { useGetNftsQuery } from '@/shared/graphql/generated';

function NFTList() {
  const { data, loading } = useGetNftsQuery();
  // ...
}
```

#### TanStack Query for Server State
```typescript
import { useQuery } from '@tanstack/react-query';

function useMarketData() {
  return useQuery({
    queryKey: ['market-data'],
    queryFn: fetchMarketData,
  });
}
```

### 4.3 State Management Patterns

#### Zustand Store
```typescript
// shared/stores/wallet-store.ts
import { create } from 'zustand';

interface WalletState {
  address: string | null;
  setAddress: (address: string | null) => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  address: null,
  setAddress: (address) => set({ address }),
}));
```

### 4.4 Web3 Integration Pattern

```typescript
// Using Wagmi hooks
import { useAccount, useWriteContract } from 'wagmi';

function BuyButton({ listing }: BuyButtonProps) {
  const { address, isConnected } = useAccount();
  const { writeContract } = useWriteContract();

  const handleBuy = () => {
    writeContract({
      address: MARKETPLACE_CONTRACT,
      abi: MARKETPLACE_ABI,
      functionName: 'buy',
      args: [listing.id],
    });
  };
}
```

---

## 5. Import Conventions

### 5.1 Path Aliases

| Alias | Target | Usage |
|-------|--------|-------|
| `@/*` | `src/*` | Primary import alias |
| `@/shared/*` | `src/shared/*` | Shared resources |
| `@/modules/*` | `src/modules/*` | Feature modules |
| `@/app/*` | `src/app/*` | App router files |

### 5.2 Import Order

```typescript
// 1. React/Next.js imports
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// 2. Third-party imports
import { useAccount } from 'wagmi';
import { useQuery } from '@tanstack/react-query';

// 3. Absolute imports (@/*)
import { Button } from '@/shared/components/ui/button';
import { useWallet } from '@/shared/hooks/use-wallet';

// 4. Relative imports (same module only)
import { ListingCard } from './listing-card';
```

---

## 6. File Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Components | PascalCase | `ListingCard.tsx` |
| Hooks | camelCase with `use` prefix | `use-wallet.ts` |
| Utilities | camelCase | `format-price.ts` |
| Constants | UPPER_SNAKE_CASE or camelCase | `API_ENDPOINTS.ts` |
| Types | PascalCase with suffix | `nft.types.ts` |
| Config | camelCase | `wagmi.ts` |
| Styles | camelCase with suffix | `globals.css` |

---

## 7. Code Statistics

```
Language           Files        Lines         Code     Comments       Blank
────────────────────────────────────────────────────────────────────────────
TypeScript/TSX       313       36,314       28,500        3,200        4,614
CSS                    1          808          650           50          108
JSON                   5          450          450            0            0
Markdown               1           50           40            5            5
────────────────────────────────────────────────────────────────────────────
Total                320       37,622       29,640        3,255        4,727
```

---

## 8. Dependencies Overview

### Production Dependencies: 39
### Development Dependencies: 18

Key dependency categories:
- **UI Framework**: Next.js, React, Tailwind CSS
- **Web3**: Wagmi, Viem, RainbowKit, SIWE
- **Data**: Apollo Client, GraphQL, TanStack Query
- **State**: Zustand, React Hook Form
- **Monitoring**: Sentry
