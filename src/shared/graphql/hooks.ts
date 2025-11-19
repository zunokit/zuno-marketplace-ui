/**
 * Custom GraphQL hooks for Apollo Client 4
 *
 * This file provides convenient hooks that wrap Apollo Client's native hooks
 * with generated TypedDocumentNodes for full type safety.
 */

import { useQuery, useLazyQuery, useMutation } from '@apollo/client/react';
import { gql, type TypedDocumentNode } from '@apollo/client';

// ============================================================================
// Query Documents
// ============================================================================

const GET_NONCE_DOCUMENT = gql(`
  query GetNonce($accountId: String!, $chainId: String!, $domain: String!) {
    getNonce(accountId: $accountId, chainId: $chainId, domain: $domain) {
      nonce
      expiresAt
    }
  }
`) as TypedDocumentNode<
  {
    getNonce: {
      nonce: string;
      expiresAt: string;
    };
  },
  {
    accountId: string;
    chainId: string;
    domain: string;
  }
>;

const ME_DOCUMENT = gql(`
  query Me {
    me {
      id
      status
      createdAt
      profile {
        userId
        username
        displayName
        avatarUrl
        bannerUrl
        bio
        locale
        timezone
        socialsJson
        updatedAt
      }
    }
  }
`);

const MY_WALLETS_DOCUMENT = gql(`
  query MyWallets {
    myWallets {
      id
      userId
      accountId
      address
      chainId
      isPrimary
      verifiedAt
      createdAt
      updatedAt
    }
  }
`);

// ============================================================================
// Mutation Documents
// ============================================================================

const VERIFY_SIWE_DOCUMENT = gql(`
  mutation VerifySiwe($accountId: String!, $signature: String!, $message: String!) {
    verifySiwe(accountId: $accountId, signature: $signature, message: $message) {
      userId
      accessToken
      expiresAt
      address
      chainId
    }
  }
`);

// Export as RefreshSessionDocument to match old generated name
export const RefreshSessionDocument = gql(`
  mutation RefreshSession {
    refreshSession {
      userId
      accessToken
      expiresAt
    }
  }
`);

const REFRESH_SESSION_DOCUMENT = RefreshSessionDocument;

const REVOKE_SESSION_DOCUMENT = gql(`
  mutation RevokeSession($sessionId: ID!) {
    revokeSession(sessionId: $sessionId)
  }
`);

const LOGOUT_DOCUMENT = gql(`
  mutation Logout {
    logout
  }
`);

const UPDATE_PROFILE_DOCUMENT = gql(`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      userId
      username
      displayName
      avatarUrl
      bannerUrl
      bio
      locale
      timezone
      socialsJson
      updatedAt
    }
  }
`);

const LINK_WALLET_DOCUMENT = gql(`
  mutation LinkWallet($input: LinkWalletInput!) {
    linkWallet(input: $input) {
      id
      userId
      accountId
      address
      chainId
      isPrimary
      verifiedAt
      createdAt
      updatedAt
    }
  }
`);

// ============================================================================
// Query Hooks
// ============================================================================

export function useGetNonceQuery(options: {
  variables: {
    accountId: string;
    chainId: string;
    domain: string;
  };
  skip?: boolean;
}) {
  return useQuery(GET_NONCE_DOCUMENT, options);
}

export function useGetNonceLazyQuery(options?: any) {
  return useLazyQuery(GET_NONCE_DOCUMENT, options);
}

export function useMeQuery(options?: { skip?: boolean }) {
  return useQuery(ME_DOCUMENT, options);
}

export function useMeLazyQuery(options?: any) {
  return useLazyQuery(ME_DOCUMENT, options);
}

export function useMyWalletsQuery(options?: { skip?: boolean }) {
  return useQuery(MY_WALLETS_DOCUMENT, options);
}

export function useMyWalletsLazyQuery(options?: Parameters<typeof useLazyQuery>[1]) {
  return useLazyQuery(MY_WALLETS_DOCUMENT, options);
}

// ============================================================================
// Mutation Hooks
// ============================================================================

export function useVerifySiweMutation() {
  return useMutation(VERIFY_SIWE_DOCUMENT);
}

export function useRefreshSessionMutation() {
  return useMutation(REFRESH_SESSION_DOCUMENT);
}

export function useRevokeSessionMutation() {
  return useMutation(REVOKE_SESSION_DOCUMENT);
}

export function useLogoutMutation() {
  return useMutation(LOGOUT_DOCUMENT);
}

export function useUpdateProfileMutation() {
  return useMutation(UPDATE_PROFILE_DOCUMENT);
}

export function useLinkWalletMutation() {
  return useMutation(LINK_WALLET_DOCUMENT);
}
