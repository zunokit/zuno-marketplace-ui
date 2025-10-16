import type { Collection } from "@/shared/utils/mock/collection";

export const mockCollection: Collection = {
  id: "test-collection-id",
  name: "Test Collection",
  description: "A test collection for unit testing",
  contractAddress: "0x1234567890123456789012345678901234567890",
  chainId: "1",
  symbol: "TEST",
  totalSupply: 10000,
  floorPrice: "0.1",
  volume24h: "100",
  owners: 3500,
  items: 10000,
  image: "https://picsum.photos/200/200?random=1",
  banner: "https://picsum.photos/1200/400?random=1",
  verified: true,
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-02T00:00:00.000Z",
};

export const createMockCollection = (overrides: Partial<Collection> = {}): Collection => ({
  ...mockCollection,
  ...overrides,
});
