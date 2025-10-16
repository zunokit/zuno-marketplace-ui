import type { Collection } from "@/shared/utils/mock/collection";

export const mockCollection: Collection = {
  address: "0x1234567890123456789012345678901234567890",
  name: "Test Collection",
  symbol: "TEST",
  description: "A test collection for unit testing",
  image: "https://picsum.photos/200/200?random=1",
  banner: "https://picsum.photos/1200/400?random=1",
  totalSupply: "10000",
  maxSupply: "10000",
  totalMinted: "5000",
  chainId: "1",
  contractType: "ERC721",
  createdAt: "2024-01-01T00:00:00.000Z",
  verified: true,
  floorPrice: "0.1",
  volume24h: "100",
  totalVolume: "5000",
  itemCount: 10000,
  ownerCount: 3500,
  slug: "test-collection",
};

export const createMockCollection = (overrides: Partial<Collection> = {}): Collection => ({
  ...mockCollection,
  ...overrides,
});
