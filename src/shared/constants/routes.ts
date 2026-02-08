/**
 * Application Routes
 * Must match app directory structure under src/app
 */

export const ROUTES = {
  // Discover (home + chain filter)
  HOME: "/",
  DISCOVER: "/discover",
  DISCOVER_CHAIN: (slug: string) => `/discover/${slug}`,

  // Marketplace
  MARKETPLACE: "/marketplace",
  MARKETPLACE_DETAIL: (slug: string) => `/marketplace/${slug}`,

  // Collections
  COLLECTIONS: "/collections",
  COLLECTION_DETAIL: (id: string) => `/collections/${id}`,

  // NFT
  NFT_DETAIL: (id: string) => `/nft/${id}`,

  // Auctions
  AUCTIONS: "/auctions",
  AUCTION_DETAIL: (id: string) => `/auctions/${id}`,

  // Creator / Mint
  MINT: "/mint",
  MINT_CREATE: "/mint/create",
  MINT_CREATE_OR_MANAGE: "/mint/create-or-manage",

  // Launchpad
  LAUNCHPAD: "/launchpad",
  LAUNCHPAD_DETAIL: (slug: string) => `/launchpad/${slug}`,

  // User
  PROFILE: (address: string) => `/profile/${address}`,
  PROFILE_ME: "/profile/me",
  PROFILE_SETTINGS: "/profile/settings",
  MY_COLLECTIONS: "/my-collections",
  PROFILE_OWNED: (address: string) => `/profile/${address}?tab=owned`,
  PROFILE_CREATED: (address: string) => `/profile/${address}?tab=created`,
  PROFILE_ACTIVITY: (address: string) => `/profile/${address}?tab=activity`,
} as const;

export type RouteKey = keyof typeof ROUTES;
