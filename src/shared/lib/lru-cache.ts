import { LRUCache } from "lru-cache";

/**
 * LRU (Least Recently Used) cache for cross-request data caching
 *
 * Use this for data that should be cached across multiple requests,
 * such as NFT metadata, user profiles, or configuration data.
 *
 * @example
 * ```typescript
 * const nftCache = createLRUCache<NFTMetadata>({
 *   max: 1000,
 *   ttl: 5 * 60 * 1000, // 5 minutes
 * });
 *
 * export async function getNFTMetadata(id: string) {
 *   const cached = nftCache.get(id);
 *   if (cached) return cached;
 *
 *   const data = await fetchNFTMetadata(id);
 *   nftCache.set(id, data);
 *   return data;
 * }
 * ```
 */
export function createLRUCache<V extends Record<string, unknown>>(options: {
  max: number;
  ttl?: number;
}): LRUCache<string, V> {
  return new LRUCache<string, V>({
    max: options.max,
    ttl: options.ttl,
    allowStale: false,
    updateAgeOnGet: true,
    updateAgeOnHas: true,
  });
}

/**
 * Pre-defined LRU caches for common use cases
 */

// Cache for NFT metadata (5 minutes TTL, max 1000 items)
export const nftMetadataCache = createLRUCache<Record<string, unknown>>({
  max: 1000,
  ttl: 5 * 60 * 1000,
});

// Cache for user profiles (1 minute TTL, max 500 items)
export const userProfileCache = createLRUCache<Record<string, unknown>>({
  max: 500,
  ttl: 60 * 1000,
});

// Cache for configuration data (10 minutes TTL, max 100 items)
export const configCache = createLRUCache<Record<string, unknown>>({
  max: 100,
  ttl: 10 * 60 * 1000,
});
