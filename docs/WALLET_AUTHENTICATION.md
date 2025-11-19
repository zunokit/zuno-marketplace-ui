# Wallet Authentication with SIWE

This document explains the wallet authentication implementation using Sign-In with Ethereum (SIWE) and RainbowKit.

## Overview

The authentication flow uses:
- **RainbowKit**: Wallet connection UI
- **Wagmi**: React hooks for Ethereum
- **Viem**: TypeScript Ethereum library
- **SIWE**: Sign-In with Ethereum standard
- **GraphQL**: Backend API communication

## Architecture

### Components

1. **Web3Provider** (`src/shared/providers/Web3Provider.tsx`)
   - Wraps the app with Wagmi and RainbowKit providers
   - Implements SIWE authentication adapter
   - Manages authentication state

2. **Auth Service** (`src/shared/services/auth.service.ts`)
   - Handles all auth-related API calls
   - Methods:
     - `getNonce(walletAddress)` - Get nonce for SIWE message
     - `verifySiwe(signature, message)` - Verify signature and create session
     - `refreshSession()` - Refresh access token
     - `getMe()` - Get current user
     - `logout()` - Clear tokens

3. **GraphQL Client** (`src/shared/lib/graphql-client.ts`)
   - Centralized GraphQL request handler
   - Automatic JWT token injection
   - Auto-refresh on 401 errors
   - HTTP-only cookie support

4. **useAuth Hook** (`src/shared/hooks/useAuth.ts`)
   - React hook for accessing auth state
   - Returns:
     - `user` - Current user data
     - `isAuthenticated` - Auth status
     - `isLoading` - Loading state
     - `logout()` - Logout function
     - `address` - Wallet address
     - `isWalletConnected` - Wallet connection status

## Authentication Flow

### 1. Wallet Connection
```tsx
import { ConnectButton } from '@rainbow-me/rainbowkit';

<ConnectButton />
```

### 2. Sign-In Process
1. User clicks "Sign In" in RainbowKit modal
2. Frontend requests nonce from backend:
   ```graphql
   query GetNonce($walletAddress: String!) {
     getNonce(walletAddress: $walletAddress) {
       nonce
       expiresAt
     }
   }
   ```
3. SIWE message is created with nonce
4. User signs the message with their wallet
5. Signature is sent to backend for verification:
   ```graphql
   mutation VerifySiwe($signature: String!, $message: String!) {
     verifySiwe(signature: $signature, message: $message) {
       success
       user { ... }
       accessToken
     }
   }
   ```
6. Backend returns:
   - Access token (stored in localStorage)
   - Refresh token (HTTP-only cookie)
   - User data

### 3. Token Management

**Access Token**:
- Stored in `localStorage`
- Short-lived (15 minutes)
- Included in Authorization header for API requests

**Refresh Token**:
- Stored in HTTP-only cookie (XSS protection)
- Long-lived (7 days)
- Used to get new access token when expired

### 4. Auto-Refresh on 401

The GraphQL client automatically handles token refresh:

```typescript
// Pseudo-code flow
1. Make API request with access token
2. If response is 401 Unauthorized:
   a. Call refreshSession mutation with cookie
   b. Get new access token
   c. Retry original request
3. If refresh fails:
   a. Clear tokens
   b. Dispatch logout event
   c. User must sign in again
```

## Usage Examples

### Using the Auth Hook

```tsx
"use client";

import { useAuth } from '@/shared/hooks/useAuth';

export function MyComponent() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Please connect your wallet</div>;
  }

  return (
    <div>
      <p>Welcome {user?.username || user?.walletAddress}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Making Authenticated API Calls

```tsx
import { graphqlClient } from '@/shared/lib/graphql-client';

async function updateProfile(bio: string) {
  const result = await graphqlClient.request(
    `
      mutation UpdateProfile($bio: String!) {
        updateProfile(bio: $bio) {
          user {
            id
            bio
          }
        }
      }
    `,
    { bio }
  );

  return result;
}
```

## Configuration

### Environment Variables

Add to `.env`:

```bash
# GraphQL API endpoint
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:8080/graphql

# WalletConnect Project ID
# Get one at https://cloud.walletconnect.com/
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-project-id-here
```

### Supported Chains

Configure in `src/shared/config/wagmi.ts`:

```typescript
import { mainnet, polygon, optimism, arbitrum, base, sepolia } from 'wagmi/chains';

export const wagmiConfig = getDefaultConfig({
  appName: 'Zuno Marketplace',
  projectId,
  chains: [mainnet, polygon, optimism, arbitrum, base, sepolia],
  ssr: true,
});
```

## Security Features

1. **SIWE Standard**: Uses industry-standard authentication
2. **HTTP-Only Cookies**: Refresh tokens protected from XSS
3. **Token Separation**: Access tokens in localStorage, refresh in cookies
4. **Auto-Refresh**: Seamless token renewal
5. **SameSite Protection**: CSRF protection on cookies
6. **Nonce Validation**: Prevents replay attacks

## Testing

### Manual Testing

1. Start the backend:
   ```bash
   cd zuno-marketplace-api
   docker-compose up
   ```

2. Start the frontend:
   ```bash
   cd zuno-marketplace-ui
   pnpm dev
   ```

3. Open http://localhost:3000
4. Click "Connect Wallet"
5. Select a wallet (MetaMask, WalletConnect, etc.)
6. Click "Sign In"
7. Sign the SIWE message
8. Verify you're authenticated

### GraphQL Playground Testing

Access GraphQL Playground at http://localhost:8080/graphql

**Get Nonce**:
```graphql
query {
  getNonce(walletAddress: "0x1234...") {
    nonce
    expiresAt
  }
}
```

**Verify SIWE**:
```graphql
mutation {
  verifySiwe(
    signature: "0xabcd..."
    message: "localhost:3000 wants you to sign in..."
  ) {
    success
    user {
      id
      walletAddress
      username
    }
    accessToken
  }
}
```

## Troubleshooting

### "WalletConnect Project ID not set"
Get a project ID from https://cloud.walletconnect.com/ and add to `.env`

### "Token refresh failed"
Check that:
1. Backend is running
2. Cookies are enabled
3. CORS is configured correctly for credentials

### "Signature verification failed"
Verify:
1. Nonce is fresh (not expired)
2. Message format matches SIWE standard
3. Signature was created with correct message

## Next Steps

- [ ] Add rate limiting for getNonce
- [ ] Implement session management UI
- [ ] Add device fingerprinting
- [ ] Implement email linking
- [ ] Add 2FA support

## References

- [SIWE Specification](https://eips.ethereum.org/EIPS/eip-4361)
- [RainbowKit Docs](https://www.rainbowkit.com/docs/authentication)
- [Wagmi Docs](https://wagmi.sh/)
- [Viem Docs](https://viem.sh/)
