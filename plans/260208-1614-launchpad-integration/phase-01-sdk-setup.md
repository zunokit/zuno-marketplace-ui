---
title: "Phase 1: SDK Setup & Provider Configuration"
description: "Configure zuno-marketplace-sdk provider and ensure proper initialization with existing Web3/Wagmi setup"
phase: 1
status: completed
priority: High
dependencies: []
---

# Phase 1: SDK Setup & Provider Configuration

## Context Links

- Parent Plan: [plan.md](./plan.md)
- SDK Package: `zuno-marketplace-sdk` v2.1.2 (already installed)
- Provider Pattern: Reference `Web3Provider` in `src/shared/providers/web3-provider.tsx`
- App Wrapper: `src/app/app-wrapper.tsx`
- Next Phase: [Phase 2: GraphQL Integration](./phase-02-graphql-integration.md)

## Overview

| Field | Value |
|-------|-------|
| **Priority** | High |
| **Status** | Completed |
| **Description** | Configure SDK provider and ensure proper initialization with existing Web3/Wagmi setup |
| **Estimated Effort** | 2-3 hours |

## Key Insights

- SDK is already installed in package.json (v2.1.2)
- Wagmi/RainbowKit already configured in `Web3Provider`
- Need to wrap app with `ZunoProvider` from SDK
- SDK hooks (`useCollection`, `useWallet`) will be used in Phase 4
- Must ensure SDK uses same Wagmi configuration as existing setup

## Requirements

### Functional Requirements
- Add `ZunoProvider` wrapper around existing providers
- Configure SDK with proper API endpoints via environment variables
- Ensure SDK uses same Wagmi configuration
- SDK initializes without errors on app startup

### Non-Functional Requirements
- No breaking changes to existing wallet connection flow
- Maintain TypeScript strict mode compliance
- Follow existing provider pattern conventions

## Architecture

```
AppWrapper
├── ApolloProvider
├── ThemeProvider
├── Web3Provider (Wagmi + RainbowKit)
└── ZunoProvider (NEW) - wraps children
    ├── WagmiProviderSync
    ├── StoreProvider
    └── ZunoDevTools (dev only)
```

## Related Code Files

### Files to Modify
| File | Change |
|------|--------|
| `src/app/app-wrapper.tsx` | Add ZunoProvider wrapper |
| `src/shared/config/index.ts` | Export SDK config |

### Files to Create
| File | Purpose |
|------|---------|
| `src/shared/providers/zuno-sdk-provider.tsx` | SDK provider wrapper component |
| `src/shared/config/zuno-sdk-config.ts` | SDK configuration |

## Implementation Steps

1. **Create SDK configuration file**
   - File: `src/shared/config/zuno-sdk-config.ts`
   - Define `ZunoSDKConfig` with environment variables
   - Add validation function for required env vars

2. **Create ZunoProvider wrapper component**
   - File: `src/shared/providers/zuno-sdk-provider.tsx`
   - Import `ZunoProvider`, `WagmiProviderSync`, `ZunoDevTools` from SDK
   - Wrap children with providers
   - Add dev tools for development environment

3. **Integrate into app-wrapper.tsx**
   - Import ZunoSdkProvider
   - Wrap existing providers
   - Ensure proper nesting order

4. **Add environment variables**
   - Add to `.env.example`:
     - `NEXT_PUBLIC_ZUNO_API_KEY`
     - `NEXT_PUBLIC_ZUNO_API_URL`
     - `NEXT_PUBLIC_DEFAULT_CHAIN_ID`
     - `NEXT_PUBLIC_RPC_URL`

5. **Test SDK initialization**
   - Verify no console errors
   - Check `useWallet` hook returns connected state
   - Validate SDK config loaded correctly

## Todo List

- [x] Create `src/shared/config/zuno-sdk-config.ts` with SDK configuration
- [x] Create `src/shared/providers/zuno-sdk-provider.tsx` wrapper component
- [x] Modify `src/app/app-wrapper.tsx` to integrate ZunoProvider
- [x] Update `.env.example` with required environment variables
- [x] Test SDK initialization in browser
- [x] Verify no conflicts with existing Wagmi setup
- [x] Document SDK provider usage

## Success Criteria

- [x] SDK provider initializes without errors
- [x] `useWallet` hook from SDK returns connected wallet state
- [x] No console errors from SDK
- [x] Existing wallet connection flow still works
- [x] Environment variables properly loaded

## Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| SDK version conflict with Wagmi | High | Low | Pin versions, test thoroughly |
| Provider nesting order issues | Medium | Medium | Follow SDK documentation, test all flows |
| Missing environment variables | Medium | High | Add validation, clear error messages |

## Security Considerations

- Ensure API keys are from environment variables (NEXT_PUBLIC_*)
- No hardcoded endpoints or credentials
- Validate SDK config before initialization
- Do not expose sensitive config to client

## Code Snippets

### SDK Configuration
```typescript
// src/shared/config/zuno-sdk-config.ts
import type { ZunoSDKConfig } from "zuno-marketplace-sdk";

export const zunoSdkConfig: ZunoSDKConfig = {
  apiKey: process.env.NEXT_PUBLIC_ZUNO_API_KEY || "",
  network: parseInt(process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID || "31337"),
  apiUrl: process.env.NEXT_PUBLIC_ZUNO_API_URL,
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || "http://127.0.0.1:8545",
  cache: {
    ttl: 300000,
    gcTime: 600000,
  },
  retryPolicy: {
    maxRetries: 3,
    backoff: "exponential",
  },
  logger: {
    level: process.env.NODE_ENV === "development" ? "debug" : "info",
  },
};

export function validateSdkConfig(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!process.env.NEXT_PUBLIC_ZUNO_API_KEY) {
    errors.push("NEXT_PUBLIC_ZUNO_API_KEY is required");
  }
  if (!process.env.NEXT_PUBLIC_ZUNO_API_URL) {
    errors.push("NEXT_PUBLIC_ZUNO_API_URL is required");
  }
  return { isValid: errors.length === 0, errors };
}
```

### Provider Wrapper
```typescript
// src/shared/providers/zuno-sdk-provider.tsx
"use client";

import { ZunoProvider, WagmiProviderSync, ZunoDevTools } from "zuno-marketplace-sdk/react";
import { zunoSdkConfig } from "@/shared/config/zuno-sdk-config";

interface ZunoSdkProviderProps {
  children: React.ReactNode;
}

export function ZunoSdkProvider({ children }: ZunoSdkProviderProps) {
  return (
    <ZunoProvider config={zunoSdkConfig}>
      <WagmiProviderSync
        reconnectDelay={500}
        clearOnDisconnect={true}
      />
      {children}
      {process.env.NODE_ENV === "development" && (
        <ZunoDevTools
          config={{
            showLogger: true,
            showTransactions: true,
            showCache: true,
            position: "bottom-right",
            defaultCollapsed: true,
          }}
        />
      )}
    </ZunoProvider>
  );
}
```

## Next Steps

After completing this phase:
1. Proceed to [Phase 2: GraphQL Integration](./phase-02-graphql-integration.md)
2. SDK will be ready for mint integration in Phase 4
3. Test wallet connection flows

## Unresolved Questions

1. What is the exact `ZunoSDKConfig` type structure beyond the fields used?
2. Should `WagmiProviderSync` props be customized for our use case?
3. Are there any SDK initialization options we should consider?
