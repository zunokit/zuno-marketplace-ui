import type { Nft } from "@/modules/marketplace/types";
import { NftStatus } from "@/modules/marketplace/types";

export const mockNFT: Nft = {
  id: "1",
  tokenId: "1",
  name: "Test NFT #1",
  description: "A test NFT for unit testing",
  image: "https://picsum.photos/400/400?random=1",
  contractAddress: "0x1234567890123456789012345678901234567890",
  chainId: "1",
  owner: "0x1111111111111111111111111111111111111111",
  creator: "0x2222222222222222222222222222222222222222",
  status: NftStatus.Listed,
  mintPrice: "0.1",
  listPrice: "0.15",
  attributes: [
    { trait_type: "Background", value: "Blue" },
    { trait_type: "Rarity", value: "Common" },
    { trait_type: "Level", value: 5 },
  ],
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-02T00:00:00.000Z",
};

export const mockNFTs: Nft[] = [
  {
    ...mockNFT,
    id: "1",
    tokenId: "1",
    name: "Test NFT #1",
    mintPrice: "0.1",
    status: NftStatus.Listed,
  },
  {
    ...mockNFT,
    id: "2",
    tokenId: "2",
    name: "Test NFT #2",
    mintPrice: "0.2",
    status: NftStatus.Listed,
  },
  {
    ...mockNFT,
    id: "3",
    tokenId: "3",
    name: "Test NFT #3",
    mintPrice: "0.05",
    status: NftStatus.NotListed,
  },
  {
    ...mockNFT,
    id: "4",
    tokenId: "4",
    name: "Test NFT #4",
    mintPrice: "0.3",
    status: NftStatus.Listed,
  },
  {
    ...mockNFT,
    id: "5",
    tokenId: "5",
    name: "Test NFT #5",
    mintPrice: "0.08",
    status: NftStatus.NotListed,
  },
];

export const createMockNFT = (overrides: Partial<Nft> = {}): Nft => ({
  ...mockNFT,
  ...overrides,
});

export const createMockNFTs = (count: number): Nft[] => {
  return Array.from({ length: count }, (_, i) => ({
    ...mockNFT,
    id: `${i + 1}`,
    tokenId: `${i + 1}`,
    name: `Test NFT #${i + 1}`,
    mintPrice: `${(0.1 + Math.random() * 0.5).toFixed(3)}`,
    status: i % 3 === 0 ? NftStatus.Listed : NftStatus.NotListed,
  }));
};
