/* eslint-disable */
import { gql } from "@apollo/client";
import {
  useQuery,
  useLazyQuery,
  useMutation,
  type QueryHookOptions,
  type LazyQueryHookOptions,
  type MutationHookOptions,
} from "@apollo/client/react";
import type { Exact } from "./graphql";

export type GetNonceQueryVariables = Exact<{
  accountId: string;
  chainId: string;
  domain: string;
}>;

export type GetNonceQuery = {
  __typename?: "Query";
  getNonce: {
    __typename?: "Nonce";
    nonce: string;
    expiresAt: string;
  };
};

export type MeQueryVariables = Exact<Record<string, unknown>>;

export type MeQuery = {
  __typename?: "Query";
  me?: {
    __typename?: "User";
    id: string;
    status: string;
    createdAt: string;
    profile?: {
      __typename?: "Profile";
      userId: string;
      username: string | null;
      displayName: string | null;
      avatarUrl: string | null;
      bannerUrl: string | null;
      bio: string | null;
      locale: string | null;
      timezone: string | null;
      socialsJson: string | null;
      updatedAt: string | null;
    } | null;
  } | null;
};

export type MyWalletsQueryVariables = Exact<Record<string, unknown>>;

export type MyWalletsQuery = {
  __typename?: "Query";
  myWallets: Array<{
    __typename?: "WalletLink";
    id: string;
    userId: string;
    accountId: string;
    address: string;
    chainId: string;
    isPrimary: boolean;
    verifiedAt: string | null;
    createdAt: string;
    updatedAt: string;
  }>;
};

export type VerifySiweMutationVariables = Exact<{
  accountId: string;
  message: string;
  signature: string;
}>;

export type VerifySiweMutation = {
  __typename?: "Mutation";
  verifySiwe: {
    __typename?: "AuthResponse";
    userId: string;
    accessToken: string;
    expiresAt: string;
    address: string;
    chainId: string;
  };
};

export type RefreshSessionMutationVariables = Exact<{
  refreshToken?: string | null;
  userAgent?: string | null;
  ipAddress?: string | null;
}>;

export type RefreshSessionMutation = {
  __typename?: "Mutation";
  refreshSession: {
    __typename?: "RefreshResponse";
    userId: string;
    accessToken: string;
    expiresAt: string;
  };
};

export type RevokeSessionMutationVariables = Exact<{
  sessionId: string;
}>;

export type RevokeSessionMutation = {
  __typename?: "Mutation";
  revokeSession: boolean;
};

export type LogoutMutationVariables = Exact<Record<string, unknown>>;

export type LogoutMutation = {
  __typename?: "Mutation";
  logout: boolean;
};

export type UpdateProfileMutationVariables = Exact<{
  input: {
    username?: string | null;
    displayName?: string | null;
    bio?: string | null;
    avatarUrl?: string | null;
    bannerUrl?: string | null;
    locale?: string | null;
    timezone?: string | null;
    socialsJson?: string | null;
  };
}>;

export type UpdateProfileMutation = {
  __typename?: "Mutation";
  updateProfile: {
    __typename?: "Profile";
    userId: string;
    username: string | null;
    displayName: string | null;
    avatarUrl: string | null;
    bannerUrl: string | null;
    bio: string | null;
    locale: string | null;
    timezone: string | null;
    socialsJson: string | null;
    updatedAt: string | null;
  };
};

export type LinkWalletMutationVariables = Exact<{
  input: {
    accountId: string;
    address: string;
    chainId: string;
    isPrimary: boolean;
    connector?: string | null;
    label?: string | null;
    type?: string | null;
  };
}>;

export type LinkWalletMutation = {
  __typename?: "Mutation";
  linkWallet: {
    __typename?: "WalletLink";
    id: string;
    userId: string;
    accountId: string;
    address: string;
    chainId: string;
    isPrimary: boolean;
    verifiedAt: string | null;
    createdAt: string;
    updatedAt: string;
  };
};

export const GetNonceDocument = gql(`
  query GetNonce($accountId: String!, $chainId: String!, $domain: String!) {
    getNonce(accountId: $accountId, chainId: $chainId, domain: $domain) {
      nonce
      expiresAt
    }
  }
`);

export const MeDocument = gql(`
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

export const MyWalletsDocument = gql(`
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

export const VerifySiweDocument = gql(`
  mutation VerifySiwe($accountId: String!, $message: String!, $signature: String!) {
    verifySiwe(accountId: $accountId, message: $message, signature: $signature) {
      userId
      accessToken
      expiresAt
      address
      chainId
    }
  }
`);

export const RefreshSessionDocument = gql(`
  mutation RefreshSession($refreshToken: String, $userAgent: String, $ipAddress: String) {
    refreshSession(refreshToken: $refreshToken, userAgent: $userAgent, ipAddress: $ipAddress) {
      userId
      accessToken
      expiresAt
    }
  }
`);

export const RevokeSessionDocument = gql(`
  mutation RevokeSession($sessionId: ID!) {
    revokeSession(sessionId: $sessionId)
  }
`);

export const LogoutDocument = gql(`
  mutation Logout {
    logout
  }
`);

export const UpdateProfileDocument = gql(`
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

export const LinkWalletDocument = gql(`
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

export function useGetNonceQuery(
  baseOptions?: QueryHookOptions<GetNonceQuery, GetNonceQueryVariables>
) {
  const options = baseOptions ?? {};
  return useQuery<GetNonceQuery, GetNonceQueryVariables>(
    GetNonceDocument,
    options as QueryHookOptions<GetNonceQuery, GetNonceQueryVariables>
  );
}

export function useGetNonceLazyQuery(
  baseOptions?: LazyQueryHookOptions<GetNonceQuery, GetNonceQueryVariables>
) {
  return useLazyQuery<GetNonceQuery, GetNonceQueryVariables>(GetNonceDocument, baseOptions);
}

export function useMeQuery(options?: QueryHookOptions<MeQuery, MeQueryVariables>) {
  return useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
}

export function useMeLazyQuery(options?: LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
  return useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
}

export function useMyWalletsQuery(
  options?: QueryHookOptions<MyWalletsQuery, MyWalletsQueryVariables>
) {
  return useQuery<MyWalletsQuery, MyWalletsQueryVariables>(MyWalletsDocument, options);
}

export function useMyWalletsLazyQuery(
  options?: LazyQueryHookOptions<MyWalletsQuery, MyWalletsQueryVariables>
) {
  return useLazyQuery<MyWalletsQuery, MyWalletsQueryVariables>(MyWalletsDocument, options);
}

export function useVerifySiweMutation(
  baseOptions?: MutationHookOptions<VerifySiweMutation, VerifySiweMutationVariables>
) {
  return useMutation<VerifySiweMutation, VerifySiweMutationVariables>(
    VerifySiweDocument,
    baseOptions
  );
}

export function useRefreshSessionMutation(
  options?: MutationHookOptions<RefreshSessionMutation, RefreshSessionMutationVariables>
) {
  return useMutation<RefreshSessionMutation, RefreshSessionMutationVariables>(
    RefreshSessionDocument,
    options
  );
}

export function useRevokeSessionMutation(
  options?: MutationHookOptions<RevokeSessionMutation, RevokeSessionMutationVariables>
) {
  return useMutation<RevokeSessionMutation, RevokeSessionMutationVariables>(
    RevokeSessionDocument,
    options
  );
}

export function useLogoutMutation(
  options?: MutationHookOptions<LogoutMutation, LogoutMutationVariables>
) {
  return useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
}

export function useUpdateProfileMutation(
  options?: MutationHookOptions<UpdateProfileMutation, UpdateProfileMutationVariables>
) {
  return useMutation<UpdateProfileMutation, UpdateProfileMutationVariables>(
    UpdateProfileDocument,
    options
  );
}

export function useLinkWalletMutation(
  options?: MutationHookOptions<LinkWalletMutation, LinkWalletMutationVariables>
) {
  return useMutation<LinkWalletMutation, LinkWalletMutationVariables>(LinkWalletDocument, options);
}
