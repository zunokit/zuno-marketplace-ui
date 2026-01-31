import { faker } from "./faker-instance";
import { type NFT, type Collection } from "@/shared/types/marketplace";

// Static collections for consistent UI testing
export const mockCollections: Collection[] = [
  {
    address: "0x1234567890abcdef",
    name: "Cosmic Dreams",
    description: "A collection of abstract cosmic art pieces",
    image: "https://picsum.photos/200/200?random=1",
    banner: "https://picsum.photos/1200/400?random=1",
    verified: true,
    floorPrice: "0.05",
    volume24h: "125.5",
    totalVolume: "3250.75",
    itemCount: 10000,
    ownerCount: 2456,
    creator: {
      address: "0xCreator123",
      name: "CosmicArtist",
    },
  },
  {
    address: "0xabcdef1234567890",
    name: "Pixel Warriors",
    description: "8-bit style warrior NFT collection",
    image: "https://picsum.photos/200/200?random=2",
    banner: "https://picsum.photos/1200/400?random=2",
    verified: true,
    floorPrice: "0.08",
    volume24h: "89.2",
    totalVolume: "1890.30",
    itemCount: 5000,
    ownerCount: 1234,
    creator: {
      address: "0xCreator456",
      name: "PixelMaster",
    },
  },
];

/**
 * Generate a single mock NFT using faker
 * @deprecated Use marketplaceFaker.nft() directly
 */
const generateMockNFT = (index: number): NFT => {
  const collection = mockCollections[index % mockCollections.length];
  const statuses: NFT["status"][] = ["available", "sold", "reserved", "cancelled"];
  const listingTypes: NFT["listingType"][] = ["fixed", "auction", "offer"];

  return {
    id: `nft-${index}`,
    tokenId: `${1000 + index}`,
    name: `${collection.name} #${1000 + index}`,
    description: `A unique piece from the ${collection.name} collection`,
    image: faker.image.urlPicsumPhotos({ width: 400, height: 400 }),
    price: faker.finance.amount({ min: 0.01, max: 0.5, dec: 3 }),
    currency: "ETH",
    owner: {
      address: faker.finance.ethereumAddress(),
      name: faker.helpers.maybe(() => faker.internet.username(), { probability: 0.7 }),
      avatar: faker.helpers.maybe(() => faker.image.avatar(), { probability: 0.7 }),
    },
    collection: {
      address: collection.address,
      name: collection.name,
      verified: collection.verified,
    },
    attributes: [
      {
        trait_type: "Background",
        value: faker.helpers.arrayElement(["Blue", "Red", "Green", "Purple"]),
      },
      {
        trait_type: "Rarity",
        value: faker.helpers.arrayElement(["Common", "Uncommon", "Rare", "Legendary"]),
      },
      {
        trait_type: "Power",
        value: faker.number.int({ min: 1, max: 100 }),
        display_type: "number",
      },
    ],
    status: statuses[index % statuses.length],
    listingType: listingTypes[index % listingTypes.length],
    createdAt: faker.date.recent({ days: 30 }),
    updatedAt: faker.date.recent({ days: 7 }),
    likes: faker.number.int({ min: 0, max: 500 }),
    views: faker.number.int({ min: 0, max: 5000 }),
  };
};

// Generate array of mock NFTs
export const mockNFTs: NFT[] = Array.from({ length: 48 }, (_, i) => generateMockNFT(i));

// Mock marketplace stats
export const mockMarketplaceStats = {
  totalVolume: "12,345.67 ETH",
  totalSales: "45,678",
  totalUsers: "23,456",
  avgPrice: "0.27 ETH",
  collections: mockCollections.length,
  nfts: mockNFTs.length,
};
