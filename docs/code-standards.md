# Zuno Marketplace UI - Code Standards

**Version**: 0.1.0
**Last Updated**: 2026-01-31
**TypeScript**: Strict Mode Enabled

---

## 1. File Naming Conventions

### 1.1 General Rules

- Use **kebab-case** for all file names
- Use descriptive names that explain the file's purpose
- Long file names are preferred over ambiguous short names

### 1.2 File Type Patterns

| File Type | Naming Pattern | Example |
|-----------|----------------|---------|
| React Components | `pascal-case.tsx` | `nft-card.tsx`, `connect-wallet-button.tsx` |
| Custom Hooks | `use-description.ts` | `use-wallet.ts`, `use-nft-listing.ts` |
| Utilities | `descriptive-name.ts` | `format-ether.ts`, `truncate-address.ts` |
| Types | `name.types.ts` | `nft.types.ts`, `api.types.ts` |
| Constants | `SCOPE-constants.ts` or `descriptive-constants.ts` | `api-constants.ts`, `chain-constants.ts` |
| Config | `descriptive-config.ts` | `wagmi-config.ts`, `apollo-config.ts` |
| Styles | `globals.css`, `component.module.css` | `globals.css` |

### 1.3 Directory Naming

- Use **kebab-case** for directories
- Group related files in descriptive folders
- Example: `src/modules/nft-detail/components/`, `src/shared/hooks/web3/`

---

## 2. TypeScript Standards

### 2.1 Strict Mode Requirements

The project uses TypeScript strict mode. All code must comply:

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noEmit": true,
    "skipLibCheck": true,
    "esModuleInterop": true
  }
}
```

### 2.2 Type Declaration Rules

```typescript
// GOOD: Explicit return types for functions
function formatPrice(value: bigint, decimals: number = 18): string {
  return (Number(value) / 10 ** decimals).toFixed(4);
}

// GOOD: Interface for object shapes
interface NFTListing {
  id: string;
  tokenId: bigint;
  price: bigint;
  seller: `0x${string}`;
}

// GOOD: Type for unions
type ListingStatus = 'active' | 'sold' | 'cancelled' | 'expired';

// AVOID: Implicit any
function badFunction(data) {  // Error: Parameter 'data' implicitly has an 'any' type
  return data.value;
}
```

### 2.3 Type Exports

```typescript
// Export types from module index
export type { NFTListing, ListingStatus } from './types';
export { ListingCard } from './listing-card';
```

---

## 3. Component Patterns

### 3.1 Server Components (Default)

Most components should be Server Components by default:

```typescript
// app/page.tsx - Server Component (no 'use client')
import { Suspense } from 'react';
import { NFTGrid } from '@/modules/marketplace/components/nft-grid';

export default async function HomePage() {
  return (
    <main>
      <h1>Discover NFTs</h1>
      <Suspense fallback={<NFTGridSkeleton />}>
        <NFTGrid />
      </Suspense>
    </main>
  );
}
```

### 3.2 Client Components

Add `'use client'` only when necessary:

```typescript
'use client';

// modules/marketplace/components/buy-button.tsx
import { useAccount, useWriteContract } from 'wagmi';

interface BuyButtonProps {
  listingId: string;
  price: bigint;
}

export function BuyButton({ listingId, price }: BuyButtonProps) {
  const { isConnected } = useAccount();
  const { writeContract, isPending } = useWriteContract();

  const handleBuy = () => {
    writeContract({
      address: MARKETPLACE_ADDRESS,
      abi: MARKETPLACE_ABI,
      functionName: 'buy',
      args: [listingId],
      value: price,
    });
  };

  return (
    <Button onClick={handleBuy} disabled={!isConnected || isPending}>
      {isPending ? 'Processing...' : 'Buy Now'}
    </Button>
  );
}
```

### 3.3 Component Props Interface

```typescript
// Always define props interface
interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

// Use React.FC sparingly, prefer explicit props
export function Card({ children, className, onClick }: CardProps) {
  return (
    <div className={cn('rounded-lg border', className)} onClick={onClick}>
      {children}
    </div>
  );
}
```

---

## 4. Import Conventions

### 4.1 Import Order

```typescript
// 1. React and Next.js imports
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// 2. Third-party library imports
import { useAccount } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { formatEther } from 'viem';

// 3. Absolute imports (@/* aliases)
import { Button } from '@/shared/components/ui/button';
import { useWallet } from '@/shared/hooks/use-wallet';
import { cn } from '@/shared/utils/tailwind-utils';

// 4. Relative imports (only within same module)
import { useListing } from '../hooks/use-listing';
import { ListingCard } from './listing-card';
```

### 4.2 Path Aliases

| Alias | Target | Usage Example |
|-------|--------|---------------|
| `@/*` | `./src/*` | `import { X } from '@/shared/components'` |
| `@/shared/*` | `./src/shared/*` | `import { Button } from '@/shared/components/ui/button'` |
| `@/modules/*` | `./src/modules/*` | `import { NFTCard } from '@/modules/marketplace/components'` |

### 4.3 Import Organization

```typescript
// Group and separate with blank lines
import { useState } from 'react';

import { useAccount } from 'wagmi';
import { useQuery } from '@tanstack/react-query';

import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';

import { useLocalStorage } from './use-local-storage';
```

---

## 5. Styling Standards

### 5.1 Tailwind CSS Usage

```typescript
// Use cn() utility for conditional classes
import { cn } from '@/shared/utils/tailwind-utils';

function Button({ variant, className, children }: ButtonProps) {
  return (
    <button
      className={cn(
        // Base styles
        'inline-flex items-center justify-center rounded-md px-4 py-2',
        'text-sm font-medium transition-colors',
        // Variant styles
        variant === 'primary' && 'bg-primary text-primary-foreground',
        variant === 'secondary' && 'bg-secondary text-secondary-foreground',
        // Custom overrides
        className
      )}
    >
      {children}
    </button>
  );
}
```

### 5.2 Custom CSS Classes

Use OpenSea-inspired utility classes from `globals.css`:

```typescript
// OpenSea-style components
<div className="card-os-frosted">
  <button className="btn-os-primary">Buy Now</button>
  <span className="badge-os-success">Active</span>
</div>
```

---

## 6. Error Handling

### 6.1 Try-Catch Patterns

```typescript
async function fetchNFTData(tokenId: string): Promise<NFT | null> {
  try {
    const response = await fetch(`/api/nfts/${tokenId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    // Log to Sentry in production
    console.error('Failed to fetch NFT:', error);
    return null;
  }
}
```

### 6.2 Error Boundaries

```typescript
'use client';

import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div role="alert">
      <h2>Something went wrong</h2>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

// Usage
<ErrorBoundary FallbackComponent={ErrorFallback}>
  <NFTGrid />
</ErrorBoundary>
```

---

## 7. Testing Approach

### 7.1 Testing Philosophy

- Write tests for business logic and utilities
- Focus on integration tests for Web3 interactions
- Use React Testing Library for component tests

### 7.2 Test File Location

```
Component file: src/shared/components/ui/button.tsx
Test file:      src/shared/components/ui/button.test.tsx
```

### 7.3 Test Naming

```typescript
// Descriptive test names
describe('formatPrice', () => {
  it('should format wei to ether with 4 decimals', () => {
    expect(formatPrice(1000000000000000000n)).toBe('1.0000');
  });

  it('should handle zero value', () => {
    expect(formatPrice(0n)).toBe('0.0000');
  });
});
```

---

## 8. Code Quality Checklist

Before submitting code:

- [ ] TypeScript compiles without errors (`pnpm typecheck`)
- [ ] ESLint passes (`pnpm lint`)
- [ ] Code is formatted (`pnpm format`)
- [ ] No `console.log` statements (use `console.error` for errors)
- [ ] No `any` types without justification
- [ ] Components have proper prop types
- [ ] Error handling is implemented
- [ ] Loading states are handled
- [ ] Responsive design is considered

---

## 9. Security Standards

### 9.1 Environment Variables

```typescript
// Use NEXT_PUBLIC_ prefix only for client-side variables
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Server-only variables (no prefix)
const PRIVATE_KEY = process.env.ADMIN_PRIVATE_KEY; // Never expose to client
```

### 9.2 Web3 Security

- Always validate contract addresses
- Use try-catch for all contract interactions
- Display confirmation dialogs for transactions
- Show clear error messages for failed transactions
