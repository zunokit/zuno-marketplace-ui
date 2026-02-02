/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = {
  [_ in K]?: never;
};
export type Incremental<T> =
  | T
  | { [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never };
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
