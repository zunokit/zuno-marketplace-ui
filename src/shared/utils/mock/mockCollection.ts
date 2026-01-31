import type { Collection } from "@/shared/types/collection";
import { collectionFaker } from "./fakers";

export type MockCollectionKind =
  | "ethereum"
  | "polygon"
  | "base"
  | "arbitrum"
  | "optimism"
  | "solana";

/**
 * Create a mock collection for testing
 * @deprecated Use collectionFaker.collection() directly
 */
export function makeMockCollection(
  name = "Sample Collection",
  kind: MockCollectionKind = "ethereum",
  overrides: Partial<Collection> = {}
): Collection {
  return collectionFaker.collection(name, kind, overrides);
}

/** Convenience wrapper for Ethereum collections */
export const mockCollectionETH = (name = "ETH Legends", overrides: Partial<Collection> = {}) =>
  makeMockCollection(name, "ethereum", overrides);

/** Convenience wrapper for Polygon collections */
export const mockCollectionPOL = (name = "POL Pixels", overrides: Partial<Collection> = {}) =>
  makeMockCollection(name, "polygon", overrides);

/** Convenience wrapper for Base collections */
export const mockCollectionBASE = (name = "Base Buddies", overrides: Partial<Collection> = {}) =>
  makeMockCollection(name, "base", overrides);

/** Convenience wrapper for Arbitrum collections */
export const mockCollectionARB = (name = "Arbi Adventurers", overrides: Partial<Collection> = {}) =>
  makeMockCollection(name, "arbitrum", overrides);

/** Convenience wrapper for Solana collections */
export const mockCollectionSOL = (name = "SOL Spirits", overrides: Partial<Collection> = {}) =>
  makeMockCollection(name, "solana", overrides);

/**
 * Generate multiple mock collections
 * @deprecated Use collectionFaker.collections() directly
 */
export function makeMockCollections(
  count = 5,
  kind: MockCollectionKind = "ethereum"
): Collection[] {
  return collectionFaker.collections(count, kind);
}
