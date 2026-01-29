import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = {
  [_ in K]?: never;
};
export type Incremental<T> =
  | T
  | { [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  Time: { input: string; output: string };
};

export type AddToAllowlistInput = {
  collectionId: Scalars["ID"]["input"];
  maxMintAmount: Scalars["Int"]["input"];
  walletAddresses: Array<Scalars["String"]["input"]>;
};

/**
 * Response from SIWE verification.
 * Note: refreshToken is set as HttpOnly cookie, not returned in response body for security.
 */
export type AuthResponse = {
  __typename?: "AuthResponse";
  accessToken: Scalars["String"]["output"];
  address: Scalars["String"]["output"];
  chainId: Scalars["String"]["output"];
  expiresAt: Scalars["String"]["output"];
  userId: Scalars["String"]["output"];
};

export type Collection = {
  __typename?: "Collection";
  allowlistStageEnd: Maybe<Scalars["Time"]["output"]>;
  bannerUrl: Maybe<Scalars["String"]["output"]>;
  baseUri: Maybe<Scalars["String"]["output"]>;
  category: Maybe<Scalars["String"]["output"]>;
  chainId: Maybe<Scalars["String"]["output"]>;
  contractAddress: Maybe<Scalars["String"]["output"]>;
  createdAt: Scalars["Time"]["output"];
  deployedAt: Maybe<Scalars["Time"]["output"]>;
  deployedBlock: Maybe<Scalars["Int"]["output"]>;
  deployerAddress: Scalars["String"]["output"];
  description: Maybe<Scalars["String"]["output"]>;
  featuredImageUrl: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  imageUrl: Maybe<Scalars["String"]["output"]>;
  indexStatus: Maybe<IndexStatus>;
  isHidden: Scalars["Boolean"]["output"];
  isVerified: Scalars["Boolean"]["output"];
  maxSupply: Maybe<Scalars["Int"]["output"]>;
  metadata: Maybe<CollectionMetadata>;
  metadataStandard: Maybe<Scalars["String"]["output"]>;
  mintLimitPerWallet: Maybe<Scalars["Int"]["output"]>;
  mintPriceAllowlist: Maybe<Scalars["String"]["output"]>;
  mintPricePublic: Maybe<Scalars["String"]["output"]>;
  mintStartTime: Maybe<Scalars["Time"]["output"]>;
  name: Scalars["String"]["output"];
  royaltyFeeBps: Maybe<Scalars["Int"]["output"]>;
  royaltyRecipient: Maybe<Scalars["String"]["output"]>;
  slug: Maybe<Scalars["String"]["output"]>;
  source: Maybe<Scalars["String"]["output"]>;
  stats: Maybe<CollectionStats>;
  status: CollectionStatus;
  symbol: Scalars["String"]["output"];
  tokenStandard: TokenStandard;
  totalMinted: Scalars["Int"]["output"];
  totalSupply: Scalars["Int"]["output"];
  updatedAt: Scalars["Time"]["output"];
  userId: Scalars["ID"]["output"];
  websiteUrl: Maybe<Scalars["String"]["output"]>;
};

export type CollectionAllowlist = {
  __typename?: "CollectionAllowlist";
  addedAt: Scalars["Time"]["output"];
  addedByUserId: Scalars["ID"]["output"];
  collectionId: Scalars["ID"]["output"];
  id: Scalars["ID"]["output"];
  maxMintAmount: Scalars["Int"]["output"];
  walletAddress: Scalars["String"]["output"];
};

export type CollectionConnection = {
  __typename?: "CollectionConnection";
  items: Array<Collection>;
  pageInfo: PageInfo;
};

export type CollectionMetadata = {
  __typename?: "CollectionMetadata";
  backgroundColor: Maybe<Scalars["String"]["output"]>;
  collectionId: Scalars["ID"]["output"];
  discordUrl: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  instagramUrl: Maybe<Scalars["String"]["output"]>;
  ipfsHash: Maybe<Scalars["String"]["output"]>;
  ipfsUrl: Maybe<Scalars["String"]["output"]>;
  mediumUrl: Maybe<Scalars["String"]["output"]>;
  metadataUri: Maybe<Scalars["String"]["output"]>;
  telegramUrl: Maybe<Scalars["String"]["output"]>;
  twitterUrl: Maybe<Scalars["String"]["output"]>;
};

export type CollectionStats = {
  __typename?: "CollectionStats";
  averagePriceWei: Scalars["String"]["output"];
  collectionId: Scalars["ID"]["output"];
  floorPriceWei: Scalars["String"]["output"];
  lastMintAt: Maybe<Scalars["Time"]["output"]>;
  lastSaleAt: Maybe<Scalars["Time"]["output"]>;
  sales24h: Scalars["Int"]["output"];
  totalItems: Scalars["Int"]["output"];
  totalOwners: Scalars["Int"]["output"];
  totalSales: Scalars["Int"]["output"];
  totalVolumeWei: Scalars["String"]["output"];
  updatedAt: Scalars["Time"]["output"];
  volume24hWei: Scalars["String"]["output"];
};

export type CollectionStatus =
  | "ARCHIVED"
  | "DEPLOYED"
  | "FAILED"
  | "PENDING"
  | "%future added value";

export type CreateCollectionInput = {
  allowlistStageEnd?: InputMaybe<Scalars["Time"]["input"]>;
  bannerUrl?: InputMaybe<Scalars["String"]["input"]>;
  baseUri?: InputMaybe<Scalars["String"]["input"]>;
  category?: InputMaybe<Scalars["String"]["input"]>;
  chainId?: InputMaybe<Scalars["String"]["input"]>;
  deployerAddress: Scalars["String"]["input"];
  description?: InputMaybe<Scalars["String"]["input"]>;
  discordUrl?: InputMaybe<Scalars["String"]["input"]>;
  featuredImageUrl?: InputMaybe<Scalars["String"]["input"]>;
  imageUrl?: InputMaybe<Scalars["String"]["input"]>;
  instagramUrl?: InputMaybe<Scalars["String"]["input"]>;
  ipfsHash?: InputMaybe<Scalars["String"]["input"]>;
  maxSupply?: InputMaybe<Scalars["Int"]["input"]>;
  mediumUrl?: InputMaybe<Scalars["String"]["input"]>;
  metadataUri?: InputMaybe<Scalars["String"]["input"]>;
  mintLimitPerWallet?: InputMaybe<Scalars["Int"]["input"]>;
  mintPriceAllowlist?: InputMaybe<Scalars["String"]["input"]>;
  mintPricePublic?: InputMaybe<Scalars["String"]["input"]>;
  mintStartTime?: InputMaybe<Scalars["Time"]["input"]>;
  name: Scalars["String"]["input"];
  royaltyFeeBps?: InputMaybe<Scalars["Int"]["input"]>;
  royaltyRecipient?: InputMaybe<Scalars["String"]["input"]>;
  symbol: Scalars["String"]["input"];
  telegramUrl?: InputMaybe<Scalars["String"]["input"]>;
  tokenStandard: TokenStandard;
  twitterUrl?: InputMaybe<Scalars["String"]["input"]>;
  websiteUrl?: InputMaybe<Scalars["String"]["input"]>;
};

export type IndexStatus = "FAILED" | "NOT_STARTED" | "SYNCED" | "SYNCING" | "%future added value";

export type LinkWalletInput = {
  accountId: Scalars["String"]["input"];
  address: Scalars["String"]["input"];
  chainId: Scalars["String"]["input"];
  connector?: InputMaybe<Scalars["String"]["input"]>;
  isPrimary: Scalars["Boolean"]["input"];
  label?: InputMaybe<Scalars["String"]["input"]>;
  type?: InputMaybe<Scalars["String"]["input"]>;
};

/**
 * Root mutation type.
 * All domain-specific mutations are defined in their respective schema files.
 */
export type Mutation = {
  __typename?: "Mutation";
  _empty: Maybe<Scalars["String"]["output"]>;
  /**
   * Add wallet addresses to collection allowlist.
   * Requires authentication and ownership.
   */
  addToAllowlist: Scalars["Boolean"]["output"];
  /**
   * Create a new collection.
   * Requires authentication.
   */
  createCollection: Collection;
  /**
   * Delete a collection (soft delete - marks as archived).
   * Requires authentication and ownership.
   */
  deleteCollection: Scalars["Boolean"]["output"];
  /** Link a new wallet to the authenticated user. */
  linkWallet: WalletLink;
  /**
   * Logout the current user by revoking the session from refresh_token cookie.
   * Clears the HttpOnly cookie automatically.
   */
  logout: Scalars["Boolean"]["output"];
  /**
   * Refresh the current session to get a new access token.
   * - refreshToken: Optional. If not provided, will use refresh_token from HttpOnly cookie.
   * - userAgent: Optional. User agent string for session tracking.
   * - ipAddress: Optional. IP address for session tracking.
   */
  refreshSession: RefreshResponse;
  /**
   * Revoke a specific session by session ID.
   * Requires the session ID to be known (e.g., from session management UI).
   */
  revokeSession: Scalars["Boolean"]["output"];
  /**
   * Update an existing collection.
   * Requires authentication and ownership.
   */
  updateCollection: Collection;
  /** Update the authenticated user's profile. */
  updateProfile: Profile;
  /**
   * Verify a SIWE signature and create an authenticated session.
   * Returns access token in response body and sets refresh token as HttpOnly cookie.
   */
  verifySiwe: AuthResponse;
};

/**
 * Root mutation type.
 * All domain-specific mutations are defined in their respective schema files.
 */
export type MutationAddToAllowlistArgs = {
  input: AddToAllowlistInput;
};

/**
 * Root mutation type.
 * All domain-specific mutations are defined in their respective schema files.
 */
export type MutationCreateCollectionArgs = {
  input: CreateCollectionInput;
};

/**
 * Root mutation type.
 * All domain-specific mutations are defined in their respective schema files.
 */
export type MutationDeleteCollectionArgs = {
  id: Scalars["ID"]["input"];
};

/**
 * Root mutation type.
 * All domain-specific mutations are defined in their respective schema files.
 */
export type MutationLinkWalletArgs = {
  input: LinkWalletInput;
};

/**
 * Root mutation type.
 * All domain-specific mutations are defined in their respective schema files.
 */
export type MutationRefreshSessionArgs = {
  ipAddress?: InputMaybe<Scalars["String"]["input"]>;
  refreshToken?: InputMaybe<Scalars["String"]["input"]>;
  userAgent?: InputMaybe<Scalars["String"]["input"]>;
};

/**
 * Root mutation type.
 * All domain-specific mutations are defined in their respective schema files.
 */
export type MutationRevokeSessionArgs = {
  sessionId: Scalars["ID"]["input"];
};

/**
 * Root mutation type.
 * All domain-specific mutations are defined in their respective schema files.
 */
export type MutationUpdateCollectionArgs = {
  id: Scalars["ID"]["input"];
  input: UpdateCollectionInput;
};

/**
 * Root mutation type.
 * All domain-specific mutations are defined in their respective schema files.
 */
export type MutationUpdateProfileArgs = {
  input: UpdateProfileInput;
};

/**
 * Root mutation type.
 * All domain-specific mutations are defined in their respective schema files.
 */
export type MutationVerifySiweArgs = {
  accountId: Scalars["String"]["input"];
  message: Scalars["String"]["input"];
  signature: Scalars["String"]["input"];
};

export type Nonce = {
  __typename?: "Nonce";
  expiresAt: Scalars["String"]["output"];
  nonce: Scalars["String"]["output"];
};

export type PageInfo = {
  __typename?: "PageInfo";
  hasNext: Scalars["Boolean"]["output"];
  hasPrevious: Scalars["Boolean"]["output"];
  limit: Scalars["Int"]["output"];
  page: Scalars["Int"]["output"];
  totalCount: Scalars["Int"]["output"];
};

export type Profile = {
  __typename?: "Profile";
  avatarUrl: Maybe<Scalars["String"]["output"]>;
  bannerUrl: Maybe<Scalars["String"]["output"]>;
  bio: Maybe<Scalars["String"]["output"]>;
  displayName: Maybe<Scalars["String"]["output"]>;
  locale: Maybe<Scalars["String"]["output"]>;
  socialsJson: Maybe<Scalars["String"]["output"]>;
  timezone: Maybe<Scalars["String"]["output"]>;
  updatedAt: Maybe<Scalars["String"]["output"]>;
  userId: Scalars["ID"]["output"];
  username: Maybe<Scalars["String"]["output"]>;
};

/**
 * Root query type.
 * All domain-specific queries are defined in their respective schema files.
 */
export type Query = {
  __typename?: "Query";
  _empty: Maybe<Scalars["String"]["output"]>;
  /**
   * Get a single collection by ID, slug, or contract address.
   * Public endpoint - no auth required.
   */
  collection: Maybe<Collection>;
  /**
   * List all collections with optional filters.
   * Public endpoint - no auth required.
   */
  collections: CollectionConnection;
  /**
   * Get a nonce for SIWE authentication.
   * - accountId: Ethereum address (0x...) or CAIP-10 format
   * - chainId: CAIP-2 format (e.g., eip155:1)
   * - domain: Application domain (e.g., localhost:3000)
   */
  getNonce: Nonce;
  /** Get a user by their ID. */
  getUser: Maybe<User>;
  /** Get all wallets linked to a specific user. */
  getWallets: Array<WalletLink>;
  /**
   * Get the currently authenticated user.
   * Returns null if not authenticated (attempts silent session restore via cookie).
   */
  me: Maybe<User>;
  /**
   * Get collections owned by the authenticated user.
   * Requires authentication.
   */
  myCollections: CollectionConnection;
  /** Get all wallets linked to the authenticated user. */
  myWallets: Array<WalletLink>;
};

/**
 * Root query type.
 * All domain-specific queries are defined in their respective schema files.
 */
export type QueryCollectionArgs = {
  chainId?: InputMaybe<Scalars["String"]["input"]>;
  contractAddress?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  slug?: InputMaybe<Scalars["String"]["input"]>;
};

/**
 * Root query type.
 * All domain-specific queries are defined in their respective schema files.
 */
export type QueryCollectionsArgs = {
  category?: InputMaybe<Scalars["String"]["input"]>;
  chainId?: InputMaybe<Scalars["String"]["input"]>;
  isVerified?: InputMaybe<Scalars["Boolean"]["input"]>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
  searchQuery?: InputMaybe<Scalars["String"]["input"]>;
  sortBy?: InputMaybe<Scalars["String"]["input"]>;
  sortOrder?: InputMaybe<Scalars["String"]["input"]>;
};

/**
 * Root query type.
 * All domain-specific queries are defined in their respective schema files.
 */
export type QueryGetNonceArgs = {
  accountId: Scalars["String"]["input"];
  chainId: Scalars["String"]["input"];
  domain: Scalars["String"]["input"];
};

/**
 * Root query type.
 * All domain-specific queries are defined in their respective schema files.
 */
export type QueryGetUserArgs = {
  userId: Scalars["ID"]["input"];
};

/**
 * Root query type.
 * All domain-specific queries are defined in their respective schema files.
 */
export type QueryGetWalletsArgs = {
  userId: Scalars["ID"]["input"];
};

/**
 * Root query type.
 * All domain-specific queries are defined in their respective schema files.
 */
export type QueryMyCollectionsArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
};

/**
 * Response from session refresh.
 * Note: New refreshToken is set as HttpOnly cookie, not returned in response body.
 */
export type RefreshResponse = {
  __typename?: "RefreshResponse";
  accessToken: Scalars["String"]["output"];
  expiresAt: Scalars["String"]["output"];
  userId: Scalars["String"]["output"];
};

export type TokenStandard = "ERC721" | "ERC1155" | "%future added value";

export type UpdateCollectionInput = {
  allowlistStageEnd?: InputMaybe<Scalars["Time"]["input"]>;
  backgroundColor?: InputMaybe<Scalars["String"]["input"]>;
  bannerUrl?: InputMaybe<Scalars["String"]["input"]>;
  baseUri?: InputMaybe<Scalars["String"]["input"]>;
  category?: InputMaybe<Scalars["String"]["input"]>;
  contractAddress?: InputMaybe<Scalars["String"]["input"]>;
  deployedBlock?: InputMaybe<Scalars["Int"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  discordUrl?: InputMaybe<Scalars["String"]["input"]>;
  featuredImageUrl?: InputMaybe<Scalars["String"]["input"]>;
  imageUrl?: InputMaybe<Scalars["String"]["input"]>;
  instagramUrl?: InputMaybe<Scalars["String"]["input"]>;
  mediumUrl?: InputMaybe<Scalars["String"]["input"]>;
  mintLimitPerWallet?: InputMaybe<Scalars["Int"]["input"]>;
  mintPriceAllowlist?: InputMaybe<Scalars["String"]["input"]>;
  mintPricePublic?: InputMaybe<Scalars["String"]["input"]>;
  mintStartTime?: InputMaybe<Scalars["Time"]["input"]>;
  status?: InputMaybe<CollectionStatus>;
  telegramUrl?: InputMaybe<Scalars["String"]["input"]>;
  twitterUrl?: InputMaybe<Scalars["String"]["input"]>;
  websiteUrl?: InputMaybe<Scalars["String"]["input"]>;
};

export type UpdateProfileInput = {
  avatarUrl?: InputMaybe<Scalars["String"]["input"]>;
  bannerUrl?: InputMaybe<Scalars["String"]["input"]>;
  bio?: InputMaybe<Scalars["String"]["input"]>;
  displayName?: InputMaybe<Scalars["String"]["input"]>;
  locale?: InputMaybe<Scalars["String"]["input"]>;
  socialsJson?: InputMaybe<Scalars["String"]["input"]>;
  timezone?: InputMaybe<Scalars["String"]["input"]>;
  username?: InputMaybe<Scalars["String"]["input"]>;
};

export type User = {
  __typename?: "User";
  createdAt: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  profile: Maybe<Profile>;
  status: Scalars["String"]["output"];
};

export type WalletLink = {
  __typename?: "WalletLink";
  accountId: Scalars["String"]["output"];
  address: Scalars["String"]["output"];
  chainId: Scalars["String"]["output"];
  createdAt: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  isPrimary: Scalars["Boolean"]["output"];
  updatedAt: Scalars["String"]["output"];
  userId: Scalars["ID"]["output"];
  verifiedAt: Maybe<Scalars["String"]["output"]>;
};

export type GetNonceQueryVariables = Exact<{
  accountId: Scalars["String"]["input"];
  chainId: Scalars["String"]["input"];
  domain: Scalars["String"]["input"];
}>;

export type GetNonceQuery = {
  __typename?: "Query";
  getNonce: { __typename?: "Nonce"; nonce: string; expiresAt: string };
};

export type VerifySiweMutationVariables = Exact<{
  accountId: Scalars["String"]["input"];
  message: Scalars["String"]["input"];
  signature: Scalars["String"]["input"];
}>;

export type VerifySiweMutation = {
  __typename?: "Mutation";
  verifySiwe: {
    __typename?: "AuthResponse";
    accessToken: string;
    expiresAt: string;
    userId: string;
    address: string;
    chainId: string;
  };
};

export type RefreshSessionMutationVariables = Exact<{
  refreshToken?: InputMaybe<Scalars["String"]["input"]>;
  userAgent?: InputMaybe<Scalars["String"]["input"]>;
  ipAddress?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type RefreshSessionMutation = {
  __typename?: "Mutation";
  refreshSession: {
    __typename?: "RefreshResponse";
    accessToken: string;
    expiresAt: string;
    userId: string;
  };
};

export type RevokeSessionMutationVariables = Exact<{
  sessionId: Scalars["ID"]["input"];
}>;

export type RevokeSessionMutation = { __typename?: "Mutation"; revokeSession: boolean };

export type LogoutMutationVariables = Exact<{ [key: string]: never }>;

export type LogoutMutation = { __typename?: "Mutation"; logout: boolean };

export type CreateCollectionMutationVariables = Exact<{
  input: CreateCollectionInput;
}>;

export type CreateCollectionMutation = {
  __typename?: "Mutation";
  createCollection: {
    __typename?: "Collection";
    id: string;
    slug: string | null;
    userId: string;
    name: string;
    symbol: string;
    description: string | null;
    category: string | null;
    contractAddress: string | null;
    chainId: string | null;
    tokenStandard: TokenStandard;
    deployerAddress: string;
    deployedBlock: number | null;
    status: CollectionStatus;
    deployedAt: string | null;
    indexStatus: IndexStatus | null;
    isVerified: boolean;
    isHidden: boolean;
    source: string | null;
    imageUrl: string | null;
    bannerUrl: string | null;
    featuredImageUrl: string | null;
    websiteUrl: string | null;
    baseUri: string | null;
    maxSupply: number | null;
    mintPriceAllowlist: string | null;
    mintPricePublic: string | null;
    mintStartTime: string | null;
    allowlistStageEnd: string | null;
    mintLimitPerWallet: number | null;
    royaltyFeeBps: number | null;
    royaltyRecipient: string | null;
    totalSupply: number;
    totalMinted: number;
    metadataStandard: string | null;
    createdAt: string;
    updatedAt: string;
    metadata: {
      __typename?: "CollectionMetadata";
      id: string;
      collectionId: string;
      metadataUri: string | null;
      ipfsHash: string | null;
      ipfsUrl: string | null;
      discordUrl: string | null;
      twitterUrl: string | null;
      instagramUrl: string | null;
      mediumUrl: string | null;
      telegramUrl: string | null;
      backgroundColor: string | null;
    } | null;
    stats: {
      __typename?: "CollectionStats";
      collectionId: string;
      totalItems: number;
      totalOwners: number;
      totalSales: number;
      floorPriceWei: string;
      totalVolumeWei: string;
      averagePriceWei: string;
      volume24hWei: string;
      sales24h: number;
      lastSaleAt: string | null;
      lastMintAt: string | null;
      updatedAt: string;
    } | null;
  };
};

export type UpdateCollectionMutationVariables = Exact<{
  id: Scalars["ID"]["input"];
  input: UpdateCollectionInput;
}>;

export type UpdateCollectionMutation = {
  __typename?: "Mutation";
  updateCollection: {
    __typename?: "Collection";
    id: string;
    slug: string | null;
    userId: string;
    name: string;
    symbol: string;
    description: string | null;
    category: string | null;
    contractAddress: string | null;
    chainId: string | null;
    tokenStandard: TokenStandard;
    deployerAddress: string;
    deployedBlock: number | null;
    status: CollectionStatus;
    deployedAt: string | null;
    indexStatus: IndexStatus | null;
    isVerified: boolean;
    isHidden: boolean;
    source: string | null;
    imageUrl: string | null;
    bannerUrl: string | null;
    featuredImageUrl: string | null;
    websiteUrl: string | null;
    baseUri: string | null;
    maxSupply: number | null;
    mintPriceAllowlist: string | null;
    mintPricePublic: string | null;
    mintStartTime: string | null;
    allowlistStageEnd: string | null;
    mintLimitPerWallet: number | null;
    royaltyFeeBps: number | null;
    royaltyRecipient: string | null;
    totalSupply: number;
    totalMinted: number;
    metadataStandard: string | null;
    createdAt: string;
    updatedAt: string;
    metadata: {
      __typename?: "CollectionMetadata";
      id: string;
      collectionId: string;
      metadataUri: string | null;
      ipfsHash: string | null;
      ipfsUrl: string | null;
      discordUrl: string | null;
      twitterUrl: string | null;
      instagramUrl: string | null;
      mediumUrl: string | null;
      telegramUrl: string | null;
      backgroundColor: string | null;
    } | null;
    stats: {
      __typename?: "CollectionStats";
      collectionId: string;
      totalItems: number;
      totalOwners: number;
      totalSales: number;
      floorPriceWei: string;
      totalVolumeWei: string;
      averagePriceWei: string;
      volume24hWei: string;
      sales24h: number;
      lastSaleAt: string | null;
      lastMintAt: string | null;
      updatedAt: string;
    } | null;
  };
};

export type DeleteCollectionMutationVariables = Exact<{
  id: Scalars["ID"]["input"];
}>;

export type DeleteCollectionMutation = { __typename?: "Mutation"; deleteCollection: boolean };

export type AddToAllowlistMutationVariables = Exact<{
  input: AddToAllowlistInput;
}>;

export type AddToAllowlistMutation = { __typename?: "Mutation"; addToAllowlist: boolean };

export type GetCollectionQueryVariables = Exact<{
  id?: InputMaybe<Scalars["ID"]["input"]>;
  slug?: InputMaybe<Scalars["String"]["input"]>;
  contractAddress?: InputMaybe<Scalars["String"]["input"]>;
  chainId?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type GetCollectionQuery = {
  __typename?: "Query";
  collection: {
    __typename?: "Collection";
    id: string;
    slug: string | null;
    userId: string;
    name: string;
    symbol: string;
    description: string | null;
    category: string | null;
    contractAddress: string | null;
    chainId: string | null;
    tokenStandard: TokenStandard;
    deployerAddress: string;
    deployedBlock: number | null;
    status: CollectionStatus;
    deployedAt: string | null;
    indexStatus: IndexStatus | null;
    isVerified: boolean;
    isHidden: boolean;
    source: string | null;
    imageUrl: string | null;
    bannerUrl: string | null;
    featuredImageUrl: string | null;
    websiteUrl: string | null;
    baseUri: string | null;
    maxSupply: number | null;
    mintPriceAllowlist: string | null;
    mintPricePublic: string | null;
    mintStartTime: string | null;
    allowlistStageEnd: string | null;
    mintLimitPerWallet: number | null;
    royaltyFeeBps: number | null;
    royaltyRecipient: string | null;
    totalSupply: number;
    totalMinted: number;
    metadataStandard: string | null;
    createdAt: string;
    updatedAt: string;
    metadata: {
      __typename?: "CollectionMetadata";
      id: string;
      collectionId: string;
      metadataUri: string | null;
      ipfsHash: string | null;
      ipfsUrl: string | null;
      discordUrl: string | null;
      twitterUrl: string | null;
      instagramUrl: string | null;
      mediumUrl: string | null;
      telegramUrl: string | null;
      backgroundColor: string | null;
    } | null;
    stats: {
      __typename?: "CollectionStats";
      collectionId: string;
      totalItems: number;
      totalOwners: number;
      totalSales: number;
      floorPriceWei: string;
      totalVolumeWei: string;
      averagePriceWei: string;
      volume24hWei: string;
      sales24h: number;
      lastSaleAt: string | null;
      lastMintAt: string | null;
      updatedAt: string;
    } | null;
  } | null;
};

export type GetMyCollectionsQueryVariables = Exact<{
  page?: InputMaybe<Scalars["Int"]["input"]>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type GetMyCollectionsQuery = {
  __typename?: "Query";
  myCollections: {
    __typename?: "CollectionConnection";
    items: Array<{
      __typename?: "Collection";
      id: string;
      slug: string | null;
      userId: string;
      name: string;
      symbol: string;
      description: string | null;
      category: string | null;
      contractAddress: string | null;
      chainId: string | null;
      tokenStandard: TokenStandard;
      deployerAddress: string;
      deployedBlock: number | null;
      status: CollectionStatus;
      deployedAt: string | null;
      indexStatus: IndexStatus | null;
      isVerified: boolean;
      isHidden: boolean;
      source: string | null;
      imageUrl: string | null;
      bannerUrl: string | null;
      featuredImageUrl: string | null;
      websiteUrl: string | null;
      baseUri: string | null;
      maxSupply: number | null;
      mintPriceAllowlist: string | null;
      mintPricePublic: string | null;
      mintStartTime: string | null;
      allowlistStageEnd: string | null;
      mintLimitPerWallet: number | null;
      royaltyFeeBps: number | null;
      royaltyRecipient: string | null;
      totalSupply: number;
      totalMinted: number;
      metadataStandard: string | null;
      createdAt: string;
      updatedAt: string;
      metadata: {
        __typename?: "CollectionMetadata";
        id: string;
        collectionId: string;
        metadataUri: string | null;
        ipfsHash: string | null;
        ipfsUrl: string | null;
        discordUrl: string | null;
        twitterUrl: string | null;
        instagramUrl: string | null;
        mediumUrl: string | null;
        telegramUrl: string | null;
        backgroundColor: string | null;
      } | null;
      stats: {
        __typename?: "CollectionStats";
        collectionId: string;
        totalItems: number;
        totalOwners: number;
        totalSales: number;
        floorPriceWei: string;
        totalVolumeWei: string;
        averagePriceWei: string;
        volume24hWei: string;
        sales24h: number;
        lastSaleAt: string | null;
        lastMintAt: string | null;
        updatedAt: string;
      } | null;
    }>;
    pageInfo: {
      __typename?: "PageInfo";
      totalCount: number;
      page: number;
      limit: number;
      hasNext: boolean;
      hasPrevious: boolean;
    };
  };
};

export type GetCollectionsQueryVariables = Exact<{
  page?: InputMaybe<Scalars["Int"]["input"]>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  sortBy?: InputMaybe<Scalars["String"]["input"]>;
  sortOrder?: InputMaybe<Scalars["String"]["input"]>;
  category?: InputMaybe<Scalars["String"]["input"]>;
  chainId?: InputMaybe<Scalars["String"]["input"]>;
  isVerified?: InputMaybe<Scalars["Boolean"]["input"]>;
  searchQuery?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type GetCollectionsQuery = {
  __typename?: "Query";
  collections: {
    __typename?: "CollectionConnection";
    items: Array<{
      __typename?: "Collection";
      id: string;
      slug: string | null;
      userId: string;
      name: string;
      symbol: string;
      description: string | null;
      category: string | null;
      contractAddress: string | null;
      chainId: string | null;
      tokenStandard: TokenStandard;
      deployerAddress: string;
      deployedBlock: number | null;
      status: CollectionStatus;
      deployedAt: string | null;
      indexStatus: IndexStatus | null;
      isVerified: boolean;
      isHidden: boolean;
      source: string | null;
      imageUrl: string | null;
      bannerUrl: string | null;
      featuredImageUrl: string | null;
      websiteUrl: string | null;
      baseUri: string | null;
      maxSupply: number | null;
      mintPriceAllowlist: string | null;
      mintPricePublic: string | null;
      mintStartTime: string | null;
      allowlistStageEnd: string | null;
      mintLimitPerWallet: number | null;
      royaltyFeeBps: number | null;
      royaltyRecipient: string | null;
      totalSupply: number;
      totalMinted: number;
      metadataStandard: string | null;
      createdAt: string;
      updatedAt: string;
    }>;
    pageInfo: {
      __typename?: "PageInfo";
      totalCount: number;
      page: number;
      limit: number;
      hasNext: boolean;
      hasPrevious: boolean;
    };
  };
};

export type MeQueryVariables = Exact<{ [key: string]: never }>;

export type MeQuery = {
  __typename?: "Query";
  me: {
    __typename?: "User";
    id: string;
    status: string;
    createdAt: string;
    profile: {
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

export type UpdateProfileMutationVariables = Exact<{
  input: UpdateProfileInput;
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

export type MyWalletsQueryVariables = Exact<{ [key: string]: never }>;

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

export type LinkWalletMutationVariables = Exact<{
  input: LinkWalletInput;
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

export const GetNonceDocument = gql`
  query GetNonce($accountId: String!, $chainId: String!, $domain: String!) {
    getNonce(accountId: $accountId, chainId: $chainId, domain: $domain) {
      nonce
      expiresAt
    }
  }
`;

/**
 * __useGetNonceQuery__
 *
 * To run a query within a React component, call `useGetNonceQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetNonceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetNonceQuery({
 *   variables: {
 *      accountId: // value for 'accountId'
 *      chainId: // value for 'chainId'
 *      domain: // value for 'domain'
 *   },
 * });
 */
export function useGetNonceQuery(
  baseOptions: Apollo.QueryHookOptions<GetNonceQuery, GetNonceQueryVariables> &
    ({ variables: GetNonceQueryVariables; skip?: boolean } | { skip: boolean })
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetNonceQuery, GetNonceQueryVariables>(GetNonceDocument, options);
}
export function useGetNonceLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetNonceQuery, GetNonceQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetNonceQuery, GetNonceQueryVariables>(GetNonceDocument, options);
}
// @ts-ignore
export function useGetNonceSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<GetNonceQuery, GetNonceQueryVariables>
): Apollo.UseSuspenseQueryResult<GetNonceQuery, GetNonceQueryVariables>;
export function useGetNonceSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetNonceQuery, GetNonceQueryVariables>
): Apollo.UseSuspenseQueryResult<GetNonceQuery | undefined, GetNonceQueryVariables>;
export function useGetNonceSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetNonceQuery, GetNonceQueryVariables>
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetNonceQuery, GetNonceQueryVariables>(GetNonceDocument, options);
}
export type GetNonceQueryHookResult = ReturnType<typeof useGetNonceQuery>;
export type GetNonceLazyQueryHookResult = ReturnType<typeof useGetNonceLazyQuery>;
export type GetNonceSuspenseQueryHookResult = ReturnType<typeof useGetNonceSuspenseQuery>;
export type GetNonceQueryResult = Apollo.QueryResult<GetNonceQuery, GetNonceQueryVariables>;
export const VerifySiweDocument = gql`
  mutation VerifySiwe($accountId: String!, $message: String!, $signature: String!) {
    verifySiwe(accountId: $accountId, message: $message, signature: $signature) {
      accessToken
      expiresAt
      userId
      address
      chainId
    }
  }
`;
export type VerifySiweMutationFn = Apollo.MutationFunction<
  VerifySiweMutation,
  VerifySiweMutationVariables
>;

/**
 * __useVerifySiweMutation__
 *
 * To run a mutation, you first call `useVerifySiweMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVerifySiweMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [verifySiweMutation, { data, loading, error }] = useVerifySiweMutation({
 *   variables: {
 *      accountId: // value for 'accountId'
 *      message: // value for 'message'
 *      signature: // value for 'signature'
 *   },
 * });
 */
export function useVerifySiweMutation(
  baseOptions?: Apollo.MutationHookOptions<VerifySiweMutation, VerifySiweMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<VerifySiweMutation, VerifySiweMutationVariables>(
    VerifySiweDocument,
    options
  );
}
export type VerifySiweMutationHookResult = ReturnType<typeof useVerifySiweMutation>;
export type VerifySiweMutationResult = Apollo.MutationResult<VerifySiweMutation>;
export type VerifySiweMutationOptions = Apollo.BaseMutationOptions<
  VerifySiweMutation,
  VerifySiweMutationVariables
>;
export const RefreshSessionDocument = gql`
  mutation RefreshSession($refreshToken: String, $userAgent: String, $ipAddress: String) {
    refreshSession(refreshToken: $refreshToken, userAgent: $userAgent, ipAddress: $ipAddress) {
      accessToken
      expiresAt
      userId
    }
  }
`;
export type RefreshSessionMutationFn = Apollo.MutationFunction<
  RefreshSessionMutation,
  RefreshSessionMutationVariables
>;

/**
 * __useRefreshSessionMutation__
 *
 * To run a mutation, you first call `useRefreshSessionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRefreshSessionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [refreshSessionMutation, { data, loading, error }] = useRefreshSessionMutation({
 *   variables: {
 *      refreshToken: // value for 'refreshToken'
 *      userAgent: // value for 'userAgent'
 *      ipAddress: // value for 'ipAddress'
 *   },
 * });
 */
export function useRefreshSessionMutation(
  baseOptions?: Apollo.MutationHookOptions<RefreshSessionMutation, RefreshSessionMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<RefreshSessionMutation, RefreshSessionMutationVariables>(
    RefreshSessionDocument,
    options
  );
}
export type RefreshSessionMutationHookResult = ReturnType<typeof useRefreshSessionMutation>;
export type RefreshSessionMutationResult = Apollo.MutationResult<RefreshSessionMutation>;
export type RefreshSessionMutationOptions = Apollo.BaseMutationOptions<
  RefreshSessionMutation,
  RefreshSessionMutationVariables
>;
export const RevokeSessionDocument = gql`
  mutation RevokeSession($sessionId: ID!) {
    revokeSession(sessionId: $sessionId)
  }
`;
export type RevokeSessionMutationFn = Apollo.MutationFunction<
  RevokeSessionMutation,
  RevokeSessionMutationVariables
>;

/**
 * __useRevokeSessionMutation__
 *
 * To run a mutation, you first call `useRevokeSessionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRevokeSessionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [revokeSessionMutation, { data, loading, error }] = useRevokeSessionMutation({
 *   variables: {
 *      sessionId: // value for 'sessionId'
 *   },
 * });
 */
export function useRevokeSessionMutation(
  baseOptions?: Apollo.MutationHookOptions<RevokeSessionMutation, RevokeSessionMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<RevokeSessionMutation, RevokeSessionMutationVariables>(
    RevokeSessionDocument,
    options
  );
}
export type RevokeSessionMutationHookResult = ReturnType<typeof useRevokeSessionMutation>;
export type RevokeSessionMutationResult = Apollo.MutationResult<RevokeSessionMutation>;
export type RevokeSessionMutationOptions = Apollo.BaseMutationOptions<
  RevokeSessionMutation,
  RevokeSessionMutationVariables
>;
export const LogoutDocument = gql`
  mutation Logout {
    logout
  }
`;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(
  baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
}
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<
  LogoutMutation,
  LogoutMutationVariables
>;
export const CreateCollectionDocument = gql`
  mutation CreateCollection($input: CreateCollectionInput!) {
    createCollection(input: $input) {
      id
      slug
      userId
      name
      symbol
      description
      category
      contractAddress
      chainId
      tokenStandard
      deployerAddress
      deployedBlock
      status
      deployedAt
      indexStatus
      isVerified
      isHidden
      source
      imageUrl
      bannerUrl
      featuredImageUrl
      websiteUrl
      baseUri
      maxSupply
      mintPriceAllowlist
      mintPricePublic
      mintStartTime
      allowlistStageEnd
      mintLimitPerWallet
      royaltyFeeBps
      royaltyRecipient
      totalSupply
      totalMinted
      metadataStandard
      createdAt
      updatedAt
      metadata {
        id
        collectionId
        metadataUri
        ipfsHash
        ipfsUrl
        discordUrl
        twitterUrl
        instagramUrl
        mediumUrl
        telegramUrl
        backgroundColor
      }
      stats {
        collectionId
        totalItems
        totalOwners
        totalSales
        floorPriceWei
        totalVolumeWei
        averagePriceWei
        volume24hWei
        sales24h
        lastSaleAt
        lastMintAt
        updatedAt
      }
    }
  }
`;
export type CreateCollectionMutationFn = Apollo.MutationFunction<
  CreateCollectionMutation,
  CreateCollectionMutationVariables
>;

/**
 * __useCreateCollectionMutation__
 *
 * To run a mutation, you first call `useCreateCollectionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCollectionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCollectionMutation, { data, loading, error }] = useCreateCollectionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateCollectionMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateCollectionMutation,
    CreateCollectionMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<CreateCollectionMutation, CreateCollectionMutationVariables>(
    CreateCollectionDocument,
    options
  );
}
export type CreateCollectionMutationHookResult = ReturnType<typeof useCreateCollectionMutation>;
export type CreateCollectionMutationResult = Apollo.MutationResult<CreateCollectionMutation>;
export type CreateCollectionMutationOptions = Apollo.BaseMutationOptions<
  CreateCollectionMutation,
  CreateCollectionMutationVariables
>;
export const UpdateCollectionDocument = gql`
  mutation UpdateCollection($id: ID!, $input: UpdateCollectionInput!) {
    updateCollection(id: $id, input: $input) {
      id
      slug
      userId
      name
      symbol
      description
      category
      contractAddress
      chainId
      tokenStandard
      deployerAddress
      deployedBlock
      status
      deployedAt
      indexStatus
      isVerified
      isHidden
      source
      imageUrl
      bannerUrl
      featuredImageUrl
      websiteUrl
      baseUri
      maxSupply
      mintPriceAllowlist
      mintPricePublic
      mintStartTime
      allowlistStageEnd
      mintLimitPerWallet
      royaltyFeeBps
      royaltyRecipient
      totalSupply
      totalMinted
      metadataStandard
      createdAt
      updatedAt
      metadata {
        id
        collectionId
        metadataUri
        ipfsHash
        ipfsUrl
        discordUrl
        twitterUrl
        instagramUrl
        mediumUrl
        telegramUrl
        backgroundColor
      }
      stats {
        collectionId
        totalItems
        totalOwners
        totalSales
        floorPriceWei
        totalVolumeWei
        averagePriceWei
        volume24hWei
        sales24h
        lastSaleAt
        lastMintAt
        updatedAt
      }
    }
  }
`;
export type UpdateCollectionMutationFn = Apollo.MutationFunction<
  UpdateCollectionMutation,
  UpdateCollectionMutationVariables
>;

/**
 * __useUpdateCollectionMutation__
 *
 * To run a mutation, you first call `useUpdateCollectionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCollectionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCollectionMutation, { data, loading, error }] = useUpdateCollectionMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateCollectionMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateCollectionMutation,
    UpdateCollectionMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<UpdateCollectionMutation, UpdateCollectionMutationVariables>(
    UpdateCollectionDocument,
    options
  );
}
export type UpdateCollectionMutationHookResult = ReturnType<typeof useUpdateCollectionMutation>;
export type UpdateCollectionMutationResult = Apollo.MutationResult<UpdateCollectionMutation>;
export type UpdateCollectionMutationOptions = Apollo.BaseMutationOptions<
  UpdateCollectionMutation,
  UpdateCollectionMutationVariables
>;
export const DeleteCollectionDocument = gql`
  mutation DeleteCollection($id: ID!) {
    deleteCollection(id: $id)
  }
`;
export type DeleteCollectionMutationFn = Apollo.MutationFunction<
  DeleteCollectionMutation,
  DeleteCollectionMutationVariables
>;

/**
 * __useDeleteCollectionMutation__
 *
 * To run a mutation, you first call `useDeleteCollectionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCollectionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCollectionMutation, { data, loading, error }] = useDeleteCollectionMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteCollectionMutation(
  baseOptions?: Apollo.MutationHookOptions<
    DeleteCollectionMutation,
    DeleteCollectionMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<DeleteCollectionMutation, DeleteCollectionMutationVariables>(
    DeleteCollectionDocument,
    options
  );
}
export type DeleteCollectionMutationHookResult = ReturnType<typeof useDeleteCollectionMutation>;
export type DeleteCollectionMutationResult = Apollo.MutationResult<DeleteCollectionMutation>;
export type DeleteCollectionMutationOptions = Apollo.BaseMutationOptions<
  DeleteCollectionMutation,
  DeleteCollectionMutationVariables
>;
export const AddToAllowlistDocument = gql`
  mutation AddToAllowlist($input: AddToAllowlistInput!) {
    addToAllowlist(input: $input)
  }
`;
export type AddToAllowlistMutationFn = Apollo.MutationFunction<
  AddToAllowlistMutation,
  AddToAllowlistMutationVariables
>;

/**
 * __useAddToAllowlistMutation__
 *
 * To run a mutation, you first call `useAddToAllowlistMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddToAllowlistMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addToAllowlistMutation, { data, loading, error }] = useAddToAllowlistMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddToAllowlistMutation(
  baseOptions?: Apollo.MutationHookOptions<AddToAllowlistMutation, AddToAllowlistMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<AddToAllowlistMutation, AddToAllowlistMutationVariables>(
    AddToAllowlistDocument,
    options
  );
}
export type AddToAllowlistMutationHookResult = ReturnType<typeof useAddToAllowlistMutation>;
export type AddToAllowlistMutationResult = Apollo.MutationResult<AddToAllowlistMutation>;
export type AddToAllowlistMutationOptions = Apollo.BaseMutationOptions<
  AddToAllowlistMutation,
  AddToAllowlistMutationVariables
>;
export const GetCollectionDocument = gql`
  query GetCollection($id: ID, $slug: String, $contractAddress: String, $chainId: String) {
    collection(id: $id, slug: $slug, contractAddress: $contractAddress, chainId: $chainId) {
      id
      slug
      userId
      name
      symbol
      description
      category
      contractAddress
      chainId
      tokenStandard
      deployerAddress
      deployedBlock
      status
      deployedAt
      indexStatus
      isVerified
      isHidden
      source
      imageUrl
      bannerUrl
      featuredImageUrl
      websiteUrl
      baseUri
      maxSupply
      mintPriceAllowlist
      mintPricePublic
      mintStartTime
      allowlistStageEnd
      mintLimitPerWallet
      royaltyFeeBps
      royaltyRecipient
      totalSupply
      totalMinted
      metadataStandard
      createdAt
      updatedAt
      metadata {
        id
        collectionId
        metadataUri
        ipfsHash
        ipfsUrl
        discordUrl
        twitterUrl
        instagramUrl
        mediumUrl
        telegramUrl
        backgroundColor
      }
      stats {
        collectionId
        totalItems
        totalOwners
        totalSales
        floorPriceWei
        totalVolumeWei
        averagePriceWei
        volume24hWei
        sales24h
        lastSaleAt
        lastMintAt
        updatedAt
      }
    }
  }
`;

/**
 * __useGetCollectionQuery__
 *
 * To run a query within a React component, call `useGetCollectionQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCollectionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCollectionQuery({
 *   variables: {
 *      id: // value for 'id'
 *      slug: // value for 'slug'
 *      contractAddress: // value for 'contractAddress'
 *      chainId: // value for 'chainId'
 *   },
 * });
 */
export function useGetCollectionQuery(
  baseOptions?: Apollo.QueryHookOptions<GetCollectionQuery, GetCollectionQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetCollectionQuery, GetCollectionQueryVariables>(
    GetCollectionDocument,
    options
  );
}
export function useGetCollectionLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetCollectionQuery, GetCollectionQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetCollectionQuery, GetCollectionQueryVariables>(
    GetCollectionDocument,
    options
  );
}
// @ts-ignore
export function useGetCollectionSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<GetCollectionQuery, GetCollectionQueryVariables>
): Apollo.UseSuspenseQueryResult<GetCollectionQuery, GetCollectionQueryVariables>;
export function useGetCollectionSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetCollectionQuery, GetCollectionQueryVariables>
): Apollo.UseSuspenseQueryResult<GetCollectionQuery | undefined, GetCollectionQueryVariables>;
export function useGetCollectionSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetCollectionQuery, GetCollectionQueryVariables>
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetCollectionQuery, GetCollectionQueryVariables>(
    GetCollectionDocument,
    options
  );
}
export type GetCollectionQueryHookResult = ReturnType<typeof useGetCollectionQuery>;
export type GetCollectionLazyQueryHookResult = ReturnType<typeof useGetCollectionLazyQuery>;
export type GetCollectionSuspenseQueryHookResult = ReturnType<typeof useGetCollectionSuspenseQuery>;
export type GetCollectionQueryResult = Apollo.QueryResult<
  GetCollectionQuery,
  GetCollectionQueryVariables
>;
export const GetMyCollectionsDocument = gql`
  query GetMyCollections($page: Int, $limit: Int) {
    myCollections(page: $page, limit: $limit) {
      items {
        id
        slug
        userId
        name
        symbol
        description
        category
        contractAddress
        chainId
        tokenStandard
        deployerAddress
        deployedBlock
        status
        deployedAt
        indexStatus
        isVerified
        isHidden
        source
        imageUrl
        bannerUrl
        featuredImageUrl
        websiteUrl
        baseUri
        maxSupply
        mintPriceAllowlist
        mintPricePublic
        mintStartTime
        allowlistStageEnd
        mintLimitPerWallet
        royaltyFeeBps
        royaltyRecipient
        totalSupply
        totalMinted
        metadataStandard
        createdAt
        updatedAt
        metadata {
          id
          collectionId
          metadataUri
          ipfsHash
          ipfsUrl
          discordUrl
          twitterUrl
          instagramUrl
          mediumUrl
          telegramUrl
          backgroundColor
        }
        stats {
          collectionId
          totalItems
          totalOwners
          totalSales
          floorPriceWei
          totalVolumeWei
          averagePriceWei
          volume24hWei
          sales24h
          lastSaleAt
          lastMintAt
          updatedAt
        }
      }
      pageInfo {
        totalCount
        page
        limit
        hasNext
        hasPrevious
      }
    }
  }
`;

/**
 * __useGetMyCollectionsQuery__
 *
 * To run a query within a React component, call `useGetMyCollectionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMyCollectionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMyCollectionsQuery({
 *   variables: {
 *      page: // value for 'page'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetMyCollectionsQuery(
  baseOptions?: Apollo.QueryHookOptions<GetMyCollectionsQuery, GetMyCollectionsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetMyCollectionsQuery, GetMyCollectionsQueryVariables>(
    GetMyCollectionsDocument,
    options
  );
}
export function useGetMyCollectionsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetMyCollectionsQuery, GetMyCollectionsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetMyCollectionsQuery, GetMyCollectionsQueryVariables>(
    GetMyCollectionsDocument,
    options
  );
}
// @ts-ignore
export function useGetMyCollectionsSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    GetMyCollectionsQuery,
    GetMyCollectionsQueryVariables
  >
): Apollo.UseSuspenseQueryResult<GetMyCollectionsQuery, GetMyCollectionsQueryVariables>;
export function useGetMyCollectionsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetMyCollectionsQuery, GetMyCollectionsQueryVariables>
): Apollo.UseSuspenseQueryResult<GetMyCollectionsQuery | undefined, GetMyCollectionsQueryVariables>;
export function useGetMyCollectionsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetMyCollectionsQuery, GetMyCollectionsQueryVariables>
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetMyCollectionsQuery, GetMyCollectionsQueryVariables>(
    GetMyCollectionsDocument,
    options
  );
}
export type GetMyCollectionsQueryHookResult = ReturnType<typeof useGetMyCollectionsQuery>;
export type GetMyCollectionsLazyQueryHookResult = ReturnType<typeof useGetMyCollectionsLazyQuery>;
export type GetMyCollectionsSuspenseQueryHookResult = ReturnType<
  typeof useGetMyCollectionsSuspenseQuery
>;
export type GetMyCollectionsQueryResult = Apollo.QueryResult<
  GetMyCollectionsQuery,
  GetMyCollectionsQueryVariables
>;
export const GetCollectionsDocument = gql`
  query GetCollections(
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
        slug
        userId
        name
        symbol
        description
        category
        contractAddress
        chainId
        tokenStandard
        deployerAddress
        deployedBlock
        status
        deployedAt
        indexStatus
        isVerified
        isHidden
        source
        imageUrl
        bannerUrl
        featuredImageUrl
        websiteUrl
        baseUri
        maxSupply
        mintPriceAllowlist
        mintPricePublic
        mintStartTime
        allowlistStageEnd
        mintLimitPerWallet
        royaltyFeeBps
        royaltyRecipient
        totalSupply
        totalMinted
        metadataStandard
        createdAt
        updatedAt
      }
      pageInfo {
        totalCount
        page
        limit
        hasNext
        hasPrevious
      }
    }
  }
`;

/**
 * __useGetCollectionsQuery__
 *
 * To run a query within a React component, call `useGetCollectionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCollectionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCollectionsQuery({
 *   variables: {
 *      page: // value for 'page'
 *      limit: // value for 'limit'
 *      sortBy: // value for 'sortBy'
 *      sortOrder: // value for 'sortOrder'
 *      category: // value for 'category'
 *      chainId: // value for 'chainId'
 *      isVerified: // value for 'isVerified'
 *      searchQuery: // value for 'searchQuery'
 *   },
 * });
 */
export function useGetCollectionsQuery(
  baseOptions?: Apollo.QueryHookOptions<GetCollectionsQuery, GetCollectionsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetCollectionsQuery, GetCollectionsQueryVariables>(
    GetCollectionsDocument,
    options
  );
}
export function useGetCollectionsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetCollectionsQuery, GetCollectionsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetCollectionsQuery, GetCollectionsQueryVariables>(
    GetCollectionsDocument,
    options
  );
}
// @ts-ignore
export function useGetCollectionsSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<GetCollectionsQuery, GetCollectionsQueryVariables>
): Apollo.UseSuspenseQueryResult<GetCollectionsQuery, GetCollectionsQueryVariables>;
export function useGetCollectionsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetCollectionsQuery, GetCollectionsQueryVariables>
): Apollo.UseSuspenseQueryResult<GetCollectionsQuery | undefined, GetCollectionsQueryVariables>;
export function useGetCollectionsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetCollectionsQuery, GetCollectionsQueryVariables>
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetCollectionsQuery, GetCollectionsQueryVariables>(
    GetCollectionsDocument,
    options
  );
}
export type GetCollectionsQueryHookResult = ReturnType<typeof useGetCollectionsQuery>;
export type GetCollectionsLazyQueryHookResult = ReturnType<typeof useGetCollectionsLazyQuery>;
export type GetCollectionsSuspenseQueryHookResult = ReturnType<
  typeof useGetCollectionsSuspenseQuery
>;
export type GetCollectionsQueryResult = Apollo.QueryResult<
  GetCollectionsQuery,
  GetCollectionsQueryVariables
>;
export const MeDocument = gql`
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
`;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
}
export function useMeLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
}
// @ts-ignore
export function useMeSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<MeQuery, MeQueryVariables>
): Apollo.UseSuspenseQueryResult<MeQuery, MeQueryVariables>;
export function useMeSuspenseQuery(
  baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MeQuery, MeQueryVariables>
): Apollo.UseSuspenseQueryResult<MeQuery | undefined, MeQueryVariables>;
export function useMeSuspenseQuery(
  baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MeQuery, MeQueryVariables>
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<MeQuery, MeQueryVariables>(MeDocument, options);
}
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeSuspenseQueryHookResult = ReturnType<typeof useMeSuspenseQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const UpdateProfileDocument = gql`
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
`;
export type UpdateProfileMutationFn = Apollo.MutationFunction<
  UpdateProfileMutation,
  UpdateProfileMutationVariables
>;

/**
 * __useUpdateProfileMutation__
 *
 * To run a mutation, you first call `useUpdateProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProfileMutation, { data, loading, error }] = useUpdateProfileMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateProfileMutation(
  baseOptions?: Apollo.MutationHookOptions<UpdateProfileMutation, UpdateProfileMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<UpdateProfileMutation, UpdateProfileMutationVariables>(
    UpdateProfileDocument,
    options
  );
}
export type UpdateProfileMutationHookResult = ReturnType<typeof useUpdateProfileMutation>;
export type UpdateProfileMutationResult = Apollo.MutationResult<UpdateProfileMutation>;
export type UpdateProfileMutationOptions = Apollo.BaseMutationOptions<
  UpdateProfileMutation,
  UpdateProfileMutationVariables
>;
export const MyWalletsDocument = gql`
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
`;

/**
 * __useMyWalletsQuery__
 *
 * To run a query within a React component, call `useMyWalletsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyWalletsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyWalletsQuery({
 *   variables: {
 *   },
 * });
 */
export function useMyWalletsQuery(
  baseOptions?: Apollo.QueryHookOptions<MyWalletsQuery, MyWalletsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<MyWalletsQuery, MyWalletsQueryVariables>(MyWalletsDocument, options);
}
export function useMyWalletsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<MyWalletsQuery, MyWalletsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<MyWalletsQuery, MyWalletsQueryVariables>(MyWalletsDocument, options);
}
// @ts-ignore
export function useMyWalletsSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<MyWalletsQuery, MyWalletsQueryVariables>
): Apollo.UseSuspenseQueryResult<MyWalletsQuery, MyWalletsQueryVariables>;
export function useMyWalletsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<MyWalletsQuery, MyWalletsQueryVariables>
): Apollo.UseSuspenseQueryResult<MyWalletsQuery | undefined, MyWalletsQueryVariables>;
export function useMyWalletsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<MyWalletsQuery, MyWalletsQueryVariables>
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<MyWalletsQuery, MyWalletsQueryVariables>(
    MyWalletsDocument,
    options
  );
}
export type MyWalletsQueryHookResult = ReturnType<typeof useMyWalletsQuery>;
export type MyWalletsLazyQueryHookResult = ReturnType<typeof useMyWalletsLazyQuery>;
export type MyWalletsSuspenseQueryHookResult = ReturnType<typeof useMyWalletsSuspenseQuery>;
export type MyWalletsQueryResult = Apollo.QueryResult<MyWalletsQuery, MyWalletsQueryVariables>;
export const LinkWalletDocument = gql`
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
`;
export type LinkWalletMutationFn = Apollo.MutationFunction<
  LinkWalletMutation,
  LinkWalletMutationVariables
>;

/**
 * __useLinkWalletMutation__
 *
 * To run a mutation, you first call `useLinkWalletMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLinkWalletMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [linkWalletMutation, { data, loading, error }] = useLinkWalletMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useLinkWalletMutation(
  baseOptions?: Apollo.MutationHookOptions<LinkWalletMutation, LinkWalletMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<LinkWalletMutation, LinkWalletMutationVariables>(
    LinkWalletDocument,
    options
  );
}
export type LinkWalletMutationHookResult = ReturnType<typeof useLinkWalletMutation>;
export type LinkWalletMutationResult = Apollo.MutationResult<LinkWalletMutation>;
export type LinkWalletMutationOptions = Apollo.BaseMutationOptions<
  LinkWalletMutation,
  LinkWalletMutationVariables
>;
