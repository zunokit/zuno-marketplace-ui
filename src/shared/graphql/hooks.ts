/**
 * Custom GraphQL hooks for Apollo Client 4
 *
 * This file provides convenient hooks that wrap Apollo Client's native hooks
 * with generated TypedDocumentNodes for full type safety.
 */

import { useQuery, useLazyQuery, useMutation } from '@apollo/client/react';
import { gql, type TypedDocumentNode } from '@apollo/client';
import type {
  ApiCollection,
  ApiCollectionConnection,
  CreateCollectionInput,
  UpdateCollectionInput,
  AddToAllowlistInput,
} from '@/shared/types/collection';

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
`) as TypedDocumentNode<
  {
    me: {
      id: string;
      status: string;
      createdAt: string;
      profile: {
        userId: string;
        username: string;
        displayName: string;
        avatarUrl: string;
        bannerUrl: string;
        bio: string;
        locale: string;
        timezone: string;
        socialsJson: string;
        updatedAt: string;
      };
    };
  },
  {}
>;

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
`) as TypedDocumentNode<
  {
    myWallets: Array<{
      id: string;
      userId: string;
      accountId: string;
      address: string;
      chainId: string;
      isPrimary: boolean;
      verifiedAt: string;
      createdAt: string;
      updatedAt: string;
    }>;
  },
  {}
>;

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
`) as TypedDocumentNode<
  {
    verifySiwe: {
      userId: string;
      accessToken: string;
      expiresAt: string;
      address: string;
      chainId: string;
    };
  },
  {
    accountId: string;
    signature: string;
    message: string;
  }
>;

// Export as RefreshSessionDocument to match old generated name
export const RefreshSessionDocument = gql(`
  mutation RefreshSession {
    refreshSession {
      userId
      accessToken
      expiresAt
    }
  }
`) as TypedDocumentNode<
  {
    refreshSession: {
      userId: string;
      accessToken: string;
      expiresAt: string;
    };
  },
  {}
>;

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

export function useGetNonceLazyQuery() {
  return useLazyQuery(GET_NONCE_DOCUMENT);
}

export function useMeQuery(options?: { skip?: boolean }) {
  return useQuery(ME_DOCUMENT, options);
}

export function useMeLazyQuery(options?: { fetchPolicy?: 'cache-first' | 'network-only' | 'cache-only' | 'no-cache' | 'standby' }) {
  return useLazyQuery(ME_DOCUMENT, options);
}

export function useMyWalletsQuery(options?: { skip?: boolean }) {
  return useQuery(MY_WALLETS_DOCUMENT, options);
}

export function useMyWalletsLazyQuery() {
  return useLazyQuery(MY_WALLETS_DOCUMENT);
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

// ============================================================================
// Collection Documents
// ============================================================================

// Create Collection Mutation
const CREATE_COLLECTION_DOCUMENT = gql(`
  mutation CreateCollection($input: CreateCollectionInput!) {
    createCollection(input: $input) {
      id
      name
      symbol
      slug
      status
      chainId
      imageUrl
      createdAt
    }
  }
`) as TypedDocumentNode<
  { createCollection: ApiCollection },
  { input: CreateCollectionInput }
>;

// Update Collection Mutation
const UPDATE_COLLECTION_DOCUMENT = gql(`
  mutation UpdateCollection($id: ID!, $input: UpdateCollectionInput!) {
    updateCollection(id: $id, input: $input) {
      id
      status
      contractAddress
      deployedAt
      updatedAt
    }
  }
`) as TypedDocumentNode<
  { updateCollection: ApiCollection },
  { id: string; input: UpdateCollectionInput }
>;

// Add to Allowlist Mutation
const ADD_TO_ALLOWLIST_DOCUMENT = gql(`
  mutation AddToAllowlist($input: AddToAllowlistInput!) {
    addToAllowlist(input: $input)
  }
`) as TypedDocumentNode<
  { addToAllowlist: boolean },
  { input: AddToAllowlistInput }
>;

// Delete Collection Mutation
const DELETE_COLLECTION_DOCUMENT = gql(`
  mutation DeleteCollection($id: ID!) {
    deleteCollection(id: $id)
  }
`) as TypedDocumentNode<
  { deleteCollection: boolean },
  { id: string }
>;

// Get Single Collection Query
const GET_COLLECTION_DOCUMENT = gql(`
  query GetCollection($id: ID, $slug: String, $contractAddress: String) {
    collection(id: $id, slug: $slug, contractAddress: $contractAddress) {
      id
      userId
      name
      symbol
      slug
      description
      contractAddress
      chainId
      tokenStandard
      status
      indexStatus
      creatorAddress
      deployerAddress
      imageUrl
      bannerImageUrl
      featuredImageUrl
      baseUri
      maxSupply
      mintPrice
      mintPriceAllowlist
      mintPricePublic
      mintStartTime
      allowlistStageEnd
      royaltyFeeBps
      royaltyRecipient
      metadata {
        websiteUrl
        discordUrl
        twitterUrl
        instagramUrl
        ipfsHash
        ipfsUrl
      }
      stats {
        totalItems
        totalOwners
        totalVolumeWei
        floorPriceWei
        totalSales
      }
      createdAt
      updatedAt
      deployedAt
    }
  }
`) as TypedDocumentNode<
  { collection: ApiCollection | null },
  { id?: string; slug?: string; contractAddress?: string }
>;

// My Collections Query
const MY_COLLECTIONS_DOCUMENT = gql(`
  query MyCollections($page: Int, $limit: Int) {
    myCollections(page: $page, limit: $limit) {
      items {
        id
        name
        symbol
        slug
        imageUrl
        chainId
        status
        tokenStandard
        stats {
          totalItems
          totalVolumeWei
          floorPriceWei
        }
        createdAt
      }
      pageInfo {
        page
        limit
        totalCount
        hasNext
        hasPrevious
      }
    }
  }
`) as TypedDocumentNode<
  { myCollections: ApiCollectionConnection },
  { page?: number; limit?: number }
>;

// List Collections Query (public browse)
const LIST_COLLECTIONS_DOCUMENT = gql(`
  query ListCollections(
    $page: Int
    $limit: Int
    $sortBy: String
    $sortOrder: String
    $category: String
    $chainId: String
    $isVerified: Boolean
    $searchQuery: String
  ) {
    collections(
      page: $page
      limit: $limit
      sortBy: $sortBy
      sortOrder: $sortOrder
      category: $category
      chainId: $chainId
      isVerified: $isVerified
      searchQuery: $searchQuery
    ) {
      items {
        id
        name
        symbol
        slug
        imageUrl
        bannerImageUrl
        chainId
        status
        tokenStandard
        stats {
          totalItems
          totalOwners
          totalVolumeWei
          floorPriceWei
          totalSales
        }
        createdAt
      }
      pageInfo {
        page
        limit
        totalCount
        hasNext
        hasPrevious
      }
    }
  }
`) as TypedDocumentNode<
  { collections: ApiCollectionConnection },
  {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
    category?: string;
    chainId?: string;
    isVerified?: boolean;
    searchQuery?: string;
  }
>;

// ============================================================================
// Collection Mutation Hooks
// ============================================================================

export function useCreateCollectionMutation() {
  return useMutation(CREATE_COLLECTION_DOCUMENT);
}

export function useUpdateCollectionMutation() {
  return useMutation(UPDATE_COLLECTION_DOCUMENT);
}

export function useAddToAllowlistMutation() {
  return useMutation(ADD_TO_ALLOWLIST_DOCUMENT);
}

export function useDeleteCollectionMutation() {
  return useMutation(DELETE_COLLECTION_DOCUMENT);
}

// ============================================================================
// Collection Query Hooks
// ============================================================================

export function useGetCollectionQuery(variables: {
  id?: string;
  slug?: string;
  contractAddress?: string;
}) {
  return useQuery(GET_COLLECTION_DOCUMENT, {
    variables,
    skip: !variables.id && !variables.slug && !variables.contractAddress,
  });
}

export function useGetCollectionLazyQuery() {
  return useLazyQuery(GET_COLLECTION_DOCUMENT);
}

export function useMyCollectionsQuery(variables?: { page?: number; limit?: number }) {
  return useQuery(MY_COLLECTIONS_DOCUMENT, { variables });
}

export function useListCollectionsQuery(variables?: {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
  category?: string;
  chainId?: string;
  isVerified?: boolean;
  searchQuery?: string;
}) {
  return useQuery(LIST_COLLECTIONS_DOCUMENT, { variables });
}
