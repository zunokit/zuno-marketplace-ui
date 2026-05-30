---
title: "Phase 4: SDK Mint Integration"
description: "Integrate zuno-marketplace-sdk mint functions for ERC721 and ERC1155 tokens"
phase: 4
status: completed
priority: High
dependencies: ["phase-01-sdk-setup", "phase-02-graphql-integration"]
---

# Phase 4: SDK Mint Integration

## Context Links

- Parent Plan: [plan.md](./plan.md)
- Previous Phase: [Phase 3: Metadata Parsing](./phase-03-metadata-parsing.md)
- Next Phase: [Phase 5: Error Handling](./phase-05-error-handling.md)
- Mint Form: `src/modules/launch-pad/mint-nft/components/mint-form.tsx`
- Mint State Hook: `src/modules/launch-pad/mint-nft/hooks/use-mint-state.ts`
- SDK Package: `zuno-marketplace-sdk`

## Overview

| Field | Value |
|-------|-------|
| **Priority** | High |
| **Status** | Completed |
| **Description** | Integrate SDK mint functions for ERC721 and ERC1155 tokens |
| **Estimated Effort** | 5-6 hours |

## Key Insights

- Current `submitMint` function is mocked with setTimeout
- SDK provides `batchMintERC721.mutateAsync()` and `batchMintERC1155.mutateAsync()`
- Need to handle both token standards based on collection type
- Must integrate with existing wallet connection via Wagmi
- Need signature/nonce for allowlist mints
- Collection data now available from Phase 2
- **Allowlist Support:** Reference zuno-mini implementation using `useIsInAllowlist`, `useIsAllowlistOnly` hooks
- Owner is exempt from allowlist requirement

## Requirements

### Functional Requirements
- Replace mock submitMint with SDK integration
- Support ERC721 batch minting
- Support ERC1155 edition-based minting
- Handle allowlist signature verification
- Update mint cost calculation from real data
- Show transaction progress and confirmation
- Calculate total price based on quantity

### Non-Functional Requirements
- TypeScript strict mode compliance
- Proper transaction state management
- User-friendly error messages
- Loading states during transaction

## Architecture

```
Mint Flow
├── User clicks "Mint Now"
├── Validate (wallet connected, terms accepted, valid amount)
├── Determine token standard (ERC721/ERC1155)
├── Prepare mint params
│   ├── contractAddress (from collection)
│   ├── amount
│   ├── tokenId (for ERC1155)
│   ├── signature/nonce (for allowlist)
│   └── value (calculated price)
├── Call SDK mint function
│   ├── batchMintERC721.mutateAsync() OR
│   └── batchMintERC1155.mutateAsync()
├── Wait for transaction
└── Show success/error toast
```

## Related Code Files

### Files to Modify
| File | Change |
|------|--------|
| `src/modules/launch-pad/mint-nft/hooks/use-mint-state.ts` | Real mint function |
| `src/modules/launch-pad/mint-nft/components/mint-form.tsx` | Connect to real mint |
| `src/modules/launch-pad/mint-nft/components/mint-confirm-dialog.tsx` | Show transaction status |

### Files to Create
| File | Purpose |
|------|---------|
| `src/modules/launch-pad/mint-nft/hooks/use-sdk-mint.ts` | SDK mint hook wrapper |
| `src/modules/launch-pad/mint-nft/utils/calculate-mint-price.ts` | Price calculation |
| `src/modules/launch-pad/mint-nft/utils/handle-sdk-error.ts` | Error handler |

## Implementation Steps

1. **Create useSdkMint hook**
   - Import SDK hooks: `useCollection`, `useWallet`
   - Wrap batchMintERC721 and batchMintERC1155
   - Handle transaction state

2. **Create price calculation utility**
   - Calculate total price from mint price and quantity
   - Convert to wei for transaction value
   - Handle different price for allowlist vs public

3. **Create SDK error handler**
   - Map SDK error codes to user-friendly messages
   - Handle user rejection silently
   - Log errors to Sentry

4. **Update useMintState hook**
   - Replace mock submitMint with SDK integration
   - Accept collection data for pricing
   - Handle transaction state

5. **Update mint-form.tsx**
   - Connect to real mint function
   - Show transaction progress
   - Handle success/error states

6. **Update mint-confirm-dialog.tsx**
   - Show transaction status
   - Display transaction hash
   - Add "View on Explorer" link

## Todo List

- [x] Create `useSdkMint` hook wrapping SDK mint functions
- [x] Import and configure SDK mint hooks
- [x] Create `calculateMintPrice` utility
- [x] Implement ERC721 batch mint
- [x] Implement ERC1155 edition mint
- [x] **Add allowlist support** with `useIsInAllowlist`, `useIsAllowlistOnly` hooks
- [x] **Add owner exemption** from allowlist requirement
- [x] Create `handleSdkError` utility
- [x] Update `useMintState` with real mint function
- [x] Update `mint-form.tsx` button handlers
- [x] Add transaction state management
- [x] Update `mint-confirm-dialog.tsx`
- [x] Add success/error toasts
- [x] Test on testnet

## Success Criteria

- [x] Mint transaction submits to blockchain
- [x] Transaction state tracked (pending, success, error)
- [x] Correct amount calculated from collection data
- [x] Both ERC721 and ERC1155 supported
- [x] **Allowlist minting works correctly**
- [x] **Owner exemption from allowlist works**
- [x] Error messages user-friendly
- [x] Transaction hash displayed
- [x] Success toast shown after confirmation

## Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Failed transactions | High | Medium | Test on testnet, add confirmation dialogs |
| Wrong price calculation | Critical | Low | Double-check math, use BigNumber |
| Allowlist signature issues | Medium | Medium | Test with allowlist accounts |
| Network congestion | Medium | Medium | Add gas estimation, retry logic |

## Security Considerations

- Verify contract address matches collection
- Validate mint price before transaction
- Ensure wallet has sufficient funds
- Protect against reentrancy (handled by SDK)
- Never trust client-side price calculation alone

## Code Snippets

### useSdkMint Hook
```typescript
// src/modules/launch-pad/mint-nft/hooks/use-sdk-mint.ts
"use client";

import { useCollection, useWallet } from "zuno-marketplace-sdk/react";
import { useState } from "react";

interface MintParams {
  collectionAddress: string;
  amount: number;
  value: string;
  isERC1155: boolean;
}

export function useSdkMint() {
  const { batchMintERC721, batchMintERC1155 } = useCollection();
  const { address } = useWallet();
  const [isPending, setIsPending] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const mint = async (params: MintParams) => {
    if (!address) {
      throw new Error("Wallet not connected");
    }

    setIsPending(true);
    setTxHash(null);

    try {
      const mintFn = params.isERC1155 ? batchMintERC1155 : batchMintERC721;
      const result = await mintFn.mutateAsync({
        collectionAddress: params.collectionAddress,
        recipient: address,
        amount: params.amount,
        value: params.value,
      });

      setTxHash(result.tx.hash);
      return result;
    } finally {
      setIsPending(false);
    }
  };

  return { mint, isPending, txHash };
}
```

### Price Calculation
```typescript
// src/modules/launch-pad/mint-nft/utils/calculate-mint-price.ts
import { parseEther } from "viem";

interface CalculateMintPriceParams {
  mintPrice: string; // in wei
  quantity: number;
}

export function calculateMintPrice({ mintPrice, quantity }: CalculateMintPriceParams): string {
  const priceBigInt = BigInt(mintPrice);
  const total = priceBigInt * BigInt(quantity);
  return total.toString();
}

export function formatMintPrice(wei: string): string {
  const ether = Number(wei) / 1e18;
  return ether.toFixed(4);
}
```

### Error Handler
```typescript
// src/modules/launch-pad/mint-nft/utils/handle-sdk-error.ts
import { toast } from "sonner";

export function handleSdkError(error: unknown, fallbackMessage = "Transaction failed"): void {
  if (isUserRejected(error)) {
    return; // Silent for user rejection
  }

  const message = error instanceof Error ? error.message : fallbackMessage;
  toast.error(message);
}

function isUserRejected(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      message.includes("user rejected") ||
      message.includes("user denied") ||
      message.includes("action rejected")
    );
  }
  return false;
}
```

## Next Steps

After completing this phase:
1. Proceed to [Phase 5: Error Handling](./phase-05-error-handling.md)
2. Mint functionality will be fully integrated
3. Ready for comprehensive error handling

## Unresolved Questions

1. How is allowlist signature generated? Is there a separate API endpoint?
2. Should we implement transaction status polling?
3. Do we need to handle specific error codes from the smart contract?
4. Should we add a "max" button for quantity selection?
