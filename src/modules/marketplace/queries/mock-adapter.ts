/**
 * Mock fetcher for development before backend is ready
 * Simulates cursor-based pagination with consistent data
 */

import type { MarketplaceItemsPage, MarketplaceItemsQueryParams } from "./types";
import { NftStatus } from "@/modules/marketplace/types";

// Track mock data state in memory
const MOCK_STATE = new Map<string, { items: any[]; nextId: number }>();

/**
 * Generate consistent mock NFTs
 */
function generateMockNFTs(count: number, contractAddress: string, startId: number): any[] {
  return Array.from({ length: count }, (_, i) => {
    const id = startId + i;
    return {
      id: `nft-${id}`,
      tokenId: `${id}`,
      name: `NFT #${id}`,
      description: `Mock NFT ${id}`,
      image: `https://picsum.photos/400/400?random=${id}`,
      contractAddress,
      chainId: "1",
      owner: "0x1234567890123456789012345678901234567890",
      creator: "0x0987654321098765432109876543210987654321",
      status: id % 3 === 0 ? NftStatus.Listed : NftStatus.NotListed,
      mintPrice: (0.01 + Math.random() * 0.09).toFixed(3),
      listPrice: id % 3 === 0 ? (0.02 + Math.random() * 0.08).toFixed(3) : undefined,
      attributes: [
        { trait_type: "Background", value: ["Path", "Orchard", "Library"][id % 3] },
        { trait_type: "Body", value: ["Blue", "Red", "Yellow"][id % 3] },
        { trait_type: "Rarity", value: ["Common", "Rare", "Epic"][id % 3] },
      ],
      createdAt: new Date(Date.now() - id * 1000 * 60).toISOString(),
      updatedAt: new Date(Date.now() - id * 1000 * 30).toISOString(),
    };
  });
}

/**
 * Mock fetcher function
 * Simulates API call with cursor pagination
 */
export async function mockFetchMarketplaceItems({
  queryKey,
}: {
  queryKey: readonly ["marketplace", "infinite", string, MarketplaceItemsQueryParams];
}): Promise<MarketplaceItemsPage> {
  const [, , contractAddress, params] = queryKey;
  const { cursor, limit = 16 } = params;

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Initialize or get state
  if (!MOCK_STATE.has(contractAddress)) {
    MOCK_STATE.set(contractAddress, {
      items: generateMockNFTs(100, contractAddress, 1),
      nextId: 101,
    });
  }

  const state = MOCK_STATE.get(contractAddress)!;

  // Parse cursor to get start index
  const startIndex = cursor ? parseInt(Buffer.from(cursor, "base64").toString(), 10) : 0;

  // Get page of items
  const items = state.items.slice(startIndex, startIndex + limit);
  const nextIndex = startIndex + items.length;

  // Create next cursor
  const nextCursor =
    nextIndex < state.items.length ? Buffer.from(nextIndex.toString()).toString("base64") : null;

  return {
    items,
    nextCursor,
    hasMore: nextIndex < state.items.length,
    totalCount: state.items.length,
  };
}

/**
 * Flag to enable/disable mock mode
 * Set to false when real API is ready
 */
export const USE_MOCK_ADAPTER = true;
