/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

/**
 * Response from SIWE verification.
 * Note: refreshToken is set as HttpOnly cookie, not returned in response body for security.
 */
export type AuthResponse = {
  __typename?: 'AuthResponse';
  accessToken: Scalars['String']['output'];
  address: Scalars['String']['output'];
  chainId: Scalars['String']['output'];
  expiresAt: Scalars['String']['output'];
  userId: Scalars['String']['output'];
};

export type LinkWalletInput = {
  accountId: Scalars['String']['input'];
  address: Scalars['String']['input'];
  chainId: Scalars['String']['input'];
  connector?: InputMaybe<Scalars['String']['input']>;
  isPrimary: Scalars['Boolean']['input'];
  label?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  linkWallet: WalletLink;
  /**
   * Logout the current user by revoking the session from refresh_token cookie.
   * Clears the HttpOnly cookie automatically.
   */
  logout: Scalars['Boolean']['output'];
  /**
   * Refresh the current session to get a new access token.
   * - refreshToken: Optional. If not provided, will use refresh_token from HttpOnly cookie.
   * - userAgent: Optional. User agent string for session tracking.
   * - ipAddress: Optional. IP address for session tracking.
   */
  refreshSession: RefreshResponse;
  revokeSession: Scalars['Boolean']['output'];
  updateProfile: Profile;
  verifySiwe: AuthResponse;
};


export type MutationLinkWalletArgs = {
  input: LinkWalletInput;
};


export type MutationRefreshSessionArgs = {
  ipAddress?: InputMaybe<Scalars['String']['input']>;
  refreshToken?: InputMaybe<Scalars['String']['input']>;
  userAgent?: InputMaybe<Scalars['String']['input']>;
};


export type MutationRevokeSessionArgs = {
  sessionId: Scalars['ID']['input'];
};


export type MutationUpdateProfileArgs = {
  input: UpdateProfileInput;
};


export type MutationVerifySiweArgs = {
  accountId: Scalars['String']['input'];
  message: Scalars['String']['input'];
  signature: Scalars['String']['input'];
};

export type Nonce = {
  __typename?: 'Nonce';
  expiresAt: Scalars['String']['output'];
  nonce: Scalars['String']['output'];
};

export type Profile = {
  __typename?: 'Profile';
  avatarUrl: Maybe<Scalars['String']['output']>;
  bannerUrl: Maybe<Scalars['String']['output']>;
  bio: Maybe<Scalars['String']['output']>;
  displayName: Maybe<Scalars['String']['output']>;
  locale: Maybe<Scalars['String']['output']>;
  socialsJson: Maybe<Scalars['String']['output']>;
  timezone: Maybe<Scalars['String']['output']>;
  updatedAt: Maybe<Scalars['String']['output']>;
  userId: Scalars['ID']['output'];
  username: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  getNonce: Nonce;
  getUser: Maybe<User>;
  getWallets: Array<WalletLink>;
  me: Maybe<User>;
  myWallets: Array<WalletLink>;
};


export type QueryGetNonceArgs = {
  accountId: Scalars['String']['input'];
  chainId: Scalars['String']['input'];
  domain: Scalars['String']['input'];
};


export type QueryGetUserArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryGetWalletsArgs = {
  userId: Scalars['ID']['input'];
};

/**
 * Response from session refresh.
 * Note: New refreshToken is set as HttpOnly cookie, not returned in response body.
 */
export type RefreshResponse = {
  __typename?: 'RefreshResponse';
  accessToken: Scalars['String']['output'];
  expiresAt: Scalars['String']['output'];
  userId: Scalars['String']['output'];
};

export type UpdateProfileInput = {
  avatarUrl?: InputMaybe<Scalars['String']['input']>;
  bannerUrl?: InputMaybe<Scalars['String']['input']>;
  bio?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  locale?: InputMaybe<Scalars['String']['input']>;
  socialsJson?: InputMaybe<Scalars['String']['input']>;
  timezone?: InputMaybe<Scalars['String']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  profile: Maybe<Profile>;
  status: Scalars['String']['output'];
};

export type WalletLink = {
  __typename?: 'WalletLink';
  accountId: Scalars['String']['output'];
  address: Scalars['String']['output'];
  chainId: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isPrimary: Scalars['Boolean']['output'];
  updatedAt: Scalars['String']['output'];
  userId: Scalars['ID']['output'];
  verifiedAt: Maybe<Scalars['String']['output']>;
};
