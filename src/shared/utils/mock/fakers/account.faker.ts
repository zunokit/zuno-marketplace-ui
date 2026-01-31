import { faker } from "../faker-instance";
import type {
  Platform,
  PlatformUser,
  UserIdentity,
  UserWalletLink,
  UserSocials,
  UserPreferences,
  UserStats,
  UserGalleries,
  UserRewardsME,
} from "@/shared/types/account";

/**
 * Faker for user identity data
 */
function identity(overrides?: Partial<UserIdentity>): UserIdentity {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  return {
    userId: faker.string.uuid(),
    username: faker.internet.username({ firstName, lastName }),
    displayName: faker.person.fullName({ firstName, lastName }),
    bio: faker.lorem.sentence(3),
    pfpUrl: faker.image.avatar(),
    bannerUrl: faker.image.urlPicsumPhotos({ width: 1200, height: 300 }),
    profileUrl: faker.internet.url(),
    ensName: faker.helpers.maybe(() => `${faker.word.sample()}.eth`, { probability: 0.3 }),
    ...overrides,
  };
}

/**
 * Faker for wallet links
 */
function wallet(chainFamily: "EVM" | "Solana" = "EVM", isPrimary = false): UserWalletLink {
  const address =
    chainFamily === "EVM"
      ? faker.finance.ethereumAddress()
      : faker.string.alphanumeric(44);
  return {
    chainId: chainFamily === "EVM" ? "eip155:1" : "solana:mainnet",
    address,
    isPublic: faker.datatype.boolean(0.8),
    isPrimary,
  };
}

/**
 * Faker for user socials
 */
function socials(platform: Platform): UserSocials {
  return {
    x: faker.helpers.maybe(() => faker.internet.username(), { probability: 0.7 }),
    discord: platform === "zuno" ? faker.internet.username() : undefined,
  };
}

/**
 * Faker for user preferences
 */
function preferences(platform: Platform): UserPreferences {
  return {
    theme: faker.helpers.arrayElement(["light", "dark"]),
    email: {
      enabled: faker.datatype.boolean(0.8),
      itemSold: faker.datatype.boolean(0.9),
      bidActivity: faker.datatype.boolean(0.9),
      priceChange: faker.datatype.boolean(0.7),
      outbid: faker.datatype.boolean(0.9),
      ownedItemUpdates: faker.datatype.boolean(0.8),
      successfulPurchase: faker.datatype.boolean(0.9),
      successfulMint: faker.datatype.boolean(0.9),
      minimumOfferThreshold: faker.finance.amount({ min: 0.01, max: 1, dec: 2 }),
    },
    watchlist: {
      collections: Array.from({ length: faker.number.int({ min: 0, max: 5 }) }, () =>
        faker.word.sample()
      ),
      items: [],
    },
    chainSpecific:
      platform === "zuno"
        ? {
            defaultClick: faker.helpers.arrayElement(["addToCart", "openItem"]),
            feeDisplay: faker.helpers.arrayElement(["includeAllFees", "excludeRoyalties"]),
            raritySource: faker.helpers.arrayElement(["moonrank", "howrare"]),
            explorerPreference: faker.helpers.arrayElement([
              "solscan",
              "solanafm",
              "solanaExplorer",
            ]),
            showInscriptionNumbers: faker.datatype.boolean(),
            mempoolProtection: faker.datatype.boolean(),
          }
        : undefined,
  };
}

/**
 * Faker for user stats
 */
function stats(): UserStats {
  return {
    itemsOwned: faker.number.int({ min: 0, max: 1000 }),
    offersMade: faker.number.int({ min: 0, max: 100 }),
    offersReceived: faker.number.int({ min: 0, max: 50 }),
    createdCollections: faker.number.int({ min: 0, max: 10 }),
    followersCount: faker.number.int({ min: 0, max: 10000 }),
    followingCount: faker.number.int({ min: 0, max: 1000 }),
  };
}

/**
 * Faker for galleries
 */
function galleries(platform: Platform): UserGalleries {
  if (platform === "opensea") {
    return {
      galleries: Array.from({ length: faker.number.int({ min: 0, max: 3 }) }, (_, i) => ({
        id: `gal-${i + 1}`,
        name: faker.word.words(2),
        description: faker.lorem.sentence(),
        itemRefs: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, (_, j) =>
          faker.string.alphanumeric(20)
        ),
      })),
    };
  }
  return {
    showcases: Array.from({ length: faker.number.int({ min: 0, max: 3 }) }, () => ({
      name: faker.word.words(2),
      description: faker.lorem.sentence(),
      itemRefs: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () =>
        faker.string.alphanumeric(20)
      ),
    })),
  };
}

/**
 * Faker for ME rewards
 */
function rewardsME(): UserRewardsME {
  return {
    season: faker.helpers.arrayElement(["S1", "S2", "S3"]),
    meStaked: faker.finance.amount({ min: 100, max: 10000, dec: 0 }),
    points: faker.finance.amount({ min: 1000, max: 100000, dec: 0 }),
    leaderboardRank: faker.number.int({ min: 1, max: 5000 }),
  };
}

/**
 * Create a platform user with faker data
 */
function platformUser(platform: Platform = "opensea", overrides?: Partial<PlatformUser>): PlatformUser {
  const primaryWalletChain = platform === "opensea" ? "EVM" : "Solana";
  const secondaryWalletChain = faker.helpers.arrayElement<"EVM" | "Solana">(["EVM", "Solana"]);

  return {
    platform,
    identity: identity(),
    socials: socials(platform),
    wallets: [wallet(primaryWalletChain, true), wallet(secondaryWalletChain)],
    preferences: preferences(platform),
    galleries: galleries(platform),
    stats: stats(),
    rewards: platform === "zuno" ? { me: rewardsME() } : undefined,
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
    ...overrides,
  };
}

/**
 * Account faker module for generating mock account data
 */
export const accountFaker = {
  identity,
  wallet,
  socials,
  preferences,
  stats,
  galleries,
  rewardsME,
  platformUser,
};
