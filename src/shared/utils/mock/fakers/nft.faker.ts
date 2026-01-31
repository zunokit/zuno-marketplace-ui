import { faker } from "../faker-instance";
import type { NFTActivity, NFTOffer } from "@/shared/types/nft-detail";

const ACTIVITY_TYPES: NFTActivity["type"][] = ["mint", "transfer", "sale", "listing", "offer", "bid"];

const OFFER_STATUSES: NFTOffer["status"][] = ["active", "accepted", "rejected", "expired"];

/**
 * Faker for NFT activity
 */
function activity(tokenId: string, index: number = 0): NFTActivity {
  const type = ACTIVITY_TYPES[index % ACTIVITY_TYPES.length];
  const hasPrice = ["sale", "listing", "offer", "bid"].includes(type);
  const hasTo = type !== "mint" && type !== "listing";

  return {
    id: `activity-${tokenId}-${index}`,
    type,
    from: {
      address: faker.finance.ethereumAddress(),
      name: faker.helpers.maybe(() => faker.internet.username(), { probability: 0.5 }),
    },
    to: hasTo
      ? {
          address: faker.finance.ethereumAddress(),
          name: faker.helpers.maybe(() => faker.internet.username(), { probability: 0.5 }),
        }
      : undefined,
    price: hasPrice
      ? faker.finance.amount({ min: 0.001, max: 2, dec: 3 })
      : undefined,
    currency: hasPrice ? "ETH" : undefined,
    timestamp: faker.date.recent({ days: 30 }),
    txHash: faker.string.hexadecimal({ length: 64 }),
  };
}

/**
 * Generate multiple activities
 */
function activities(tokenId: string, count: number = 10): NFTActivity[] {
  return Array.from({ length: count }, (_, i) => activity(tokenId, i));
}

/**
 * Faker for NFT offer
 */
function offer(tokenId: string, index: number = 0): NFTOffer {
  return {
    id: `offer-${tokenId}-${index}`,
    offerer: {
      address: faker.finance.ethereumAddress(),
      name: faker.helpers.maybe(() => faker.internet.username(), { probability: 0.6 }),
      avatar: faker.helpers.maybe(() => faker.image.avatar(), { probability: 0.6 }),
    },
    price: faker.finance.amount({ min: 0.1, max: 1.5, dec: 3 }),
    currency: "ETH",
    expiresAt: faker.date.future({ years: 0.02 }), // ~7 days
    createdAt: faker.date.recent({ days: 7 }),
    status: OFFER_STATUSES[index % OFFER_STATUSES.length],
  };
}

/**
 * Generate multiple offers
 */
function offers(tokenId: string, count: number = 5): NFTOffer[] {
  return Array.from({ length: count }, (_, i) => offer(tokenId, i));
}

/**
 * Generate rarity info
 */
function rarity(totalSupply: number = 10000) {
  return {
    rank: faker.number.int({ min: 1, max: totalSupply }),
    score: faker.number.float({ min: 0, max: 100 }),
    totalSupply,
  };
}

/**
 * NFT faker module for generating mock NFT detail data
 */
export const nftFaker = {
  activity,
  activities,
  offer,
  offers,
  rarity,
};
