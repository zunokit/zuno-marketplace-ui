import { type UserProfile, type ProfileActivity } from "@/shared/types/profile";
import { faker } from "./faker-instance";
import { marketplaceFaker } from "./fakers";

// Static mock user profiles for consistent UI testing
export const mockUserProfiles: UserProfile[] = [
  {
    id: "user-1",
    address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1",
    username: "cryptoartist",
    displayName: "Crypto Artist",
    bio: "Digital artist exploring the boundaries of NFT art. Creator of multiple successful collections.",
    avatar: "https://picsum.photos/200/200?random=600",
    banner: "https://picsum.photos/1200/300?random=601",
    email: "artist@example.com",
    website: "https://cryptoartist.com",
    twitter: "@cryptoartist",
    discord: "cryptoartist#1234",
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date(),
    verified: true,
    stats: {
      nftsOwned: 156,
      nftsCreated: 89,
      collections: 5,
      totalVolume: "1,234.56 ETH",
      floorPrice: "0.08 ETH",
      followers: 12456,
      following: 234,
    },
  },
  {
    id: "user-2",
    address: "0x8765432109876543210987654321098765432109",
    username: "nftcollector",
    displayName: "NFT Collector",
    bio: "Passionate NFT collector and curator. Always on the lookout for the next big thing.",
    avatar: "https://picsum.photos/200/200?random=602",
    banner: "https://picsum.photos/1200/300?random=603",
    createdAt: new Date("2023-03-20"),
    updatedAt: new Date(),
    verified: false,
    stats: {
      nftsOwned: 432,
      nftsCreated: 0,
      collections: 28,
      totalVolume: "567.89 ETH",
      floorPrice: "0.05 ETH",
      followers: 5678,
      following: 456,
    },
  },
];

const activityTypes: ProfileActivity["type"][] = [
  "purchase",
  "sale",
  "listing",
  "bid",
  "transfer",
  "mint",
];

/**
 * Generate mock profile activities using faker
 * @deprecated Use marketplaceFaker or nftFaker directly
 */
export const generateMockActivities = (
  userId: string,
  count: number = 20
): ProfileActivity[] => {
  const nfts = marketplaceFaker.nfts(count, faker.finance.ethereumAddress(), 1);

  return nfts
    .map((nft, i) => {
      const type = activityTypes[i % activityTypes.length];
      return {
        id: `activity-${userId}-${i}`,
        type,
        nft: {
          id: nft.id,
          name: nft.name,
          image: nft.image || "",
          tokenId: nft.tokenId,
          collection: "Mock Collection",
        },
        from:
          type === "purchase" || type === "transfer"
            ? faker.finance.ethereumAddress()
            : userId,
        to:
          type === "sale" || type === "transfer"
            ? faker.finance.ethereumAddress()
            : userId,
        price:
          type === "purchase" || type === "sale" || type === "listing" || type === "bid"
            ? faker.finance.amount({ min: 0.01, max: 0.5, dec: 3 })
            : undefined,
        currency:
          type === "purchase" || type === "sale" || type === "listing" || type === "bid"
            ? "ETH"
            : undefined,
        timestamp: faker.date.recent({ days: 30 }),
        txHash: faker.string.hexadecimal({ length: 64 }),
      };
    })
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

// Current user mock data
export const mockCurrentUser: UserProfile = mockUserProfiles[0];

// Mock user activities
export const mockUserActivities = generateMockActivities(mockCurrentUser.id);
