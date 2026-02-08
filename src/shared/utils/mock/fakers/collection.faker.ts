import { faker } from "../faker-instance";
import type { Collection, ChainBinding, PublicMint } from "@/shared/types/collection";
import type { CollectionOverviewData, CollectionUtilityData, OverviewSectionData, UtilityItemData } from "@/shared/types/collection-info.types";

export type MockCollectionKind =
  | "ethereum"
  | "polygon"
  | "base"
  | "arbitrum"
  | "optimism"
  | "solana";

const CHAIN_CONFIG: Record<
  MockCollectionKind,
  { chainId: string; tokenStandard: "ERC721" | "SPL" }
> = {
  ethereum: { chainId: "eip155:1", tokenStandard: "ERC721" },
  polygon: { chainId: "eip155:137", tokenStandard: "ERC721" },
  base: { chainId: "eip155:8453", tokenStandard: "ERC721" },
  arbitrum: { chainId: "eip155:42161", tokenStandard: "ERC721" },
  optimism: { chainId: "eip155:10", tokenStandard: "ERC721" },
  solana: { chainId: "solana:mainnet", tokenStandard: "SPL" },
};

/**
 * Generate a Solana base58-style address
 */
function solanaAddress(): string {
  const base58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  return Array.from({ length: 44 }, () => faker.helpers.arrayElement(base58.split(""))).join("");
}

/**
 * Faker for chain bindings
 */
function chainBinding(kind: MockCollectionKind, isPrimary = true): ChainBinding {
  const config = CHAIN_CONFIG[kind];
  return {
    chainId: config.chainId,
    tokenStandard: config.tokenStandard,
    contractAddress: kind === "solana" ? undefined : faker.finance.ethereumAddress(),
    mintAuthority: kind === "solana" ? solanaAddress() : undefined,
    isPrimary,
  };
}

/**
 * Faker for public mint info
 */
function publicMint(): PublicMint {
  const startDate = faker.date.future();
  const endDate = faker.date.future({ years: 1, refDate: startDate });
  return {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    mintPrice: faker.helpers.arrayElement(["0.05 ETH", "0.1 ETH", "0.5 ETH", "1 ETH", "2 SOL", "5 SOL"]),
  };
}

/**
 * Faker for overview sections (old type - for backward compatibility)
 */
function overviewSections() {
  const titles = [
    "Gameplay Integration",
    "RPG Progression",
    "Strategic Building",
    "Ecosystem Benefits",
  ];

  return titles.map(title => ({
    title,
    content: faker.lorem.paragraphs(2),
    listItems: Array.from({ length: faker.number.int({ min: 2, max: 4 }) }, () =>
      faker.lorem.sentence()
    ),
  }));
}

/**
 * Faker for collection overview (old type - for backward compatibility)
 */
function collectionOverview() {
  return {
    description: faker.lorem.paragraph(),
    sections: overviewSections(),
  };
}

/**
 * Faker for utility items (old type - for backward compatibility)
 */
function utilityItems() {
  const utilityTitles = [
    "Gameplay Access",
    "Performance Boosts",
    "Skill Progression",
    "Team Building",
    "Passive Income",
    "Exclusive Rewards",
    "Community Access",
    "PFP Display",
  ];

  return utilityTitles.slice(0, faker.number.int({ min: 4, max: 8 })).map(title => ({
    title,
    description: faker.lorem.sentence(),
  }));
}

/**
 * Faker for collection utility (old type - for backward compatibility)
 */
function collectionUtility() {
  return {
    items: utilityItems(),
  };
}

/**
 * Faker for social links
 */
function socialLinks() {
  const slug = faker.internet.username();
  return {
    twitter: faker.helpers.maybe(() => `https://x.com/${slug}`, { probability: 0.8 }),
    discord: faker.helpers.maybe(() => `https://discord.gg/${faker.string.alphanumeric(6)}`, { probability: 0.6 }),
    telegram: faker.helpers.maybe(() => `https://t.me/${slug}`, { probability: 0.5 }),
    instagram: faker.helpers.maybe(() => `https://www.instagram.com/${slug}`, { probability: 0.4 }),
    facebook: faker.helpers.maybe(() => `https://www.facebook.com/${slug}`, { probability: 0.3 }),
    youtube: faker.helpers.maybe(() => `https://www.youtube.com/${slug}`, { probability: 0.2 }),
    tiktok: faker.helpers.maybe(() => `https://www.tiktok.com/${slug}`, { probability: 0.2 }),
  };
}

/**
 * Create a collection with faker data
 */
function collection(
  name?: string,
  kind: MockCollectionKind = "ethereum",
  overrides?: Partial<Collection>
): Collection {
  const collectionName = name || faker.commerce.productName();
  const slugBase = faker.helpers.slugify(collectionName).toLowerCase() || faker.word.sample();
  const createdAt = faker.date.past();
  const status = faker.helpers.arrayElement(["upcoming", "live", "ended", "paused"] as const);
  const maxSupply = faker.number.int({ min: 1000, max: 10000 });
  const hasPublicMint = faker.datatype.boolean(0.7);

  // Calculate totalMinted based on status
  let totalMinted = 0;
  if (status === "live") {
    totalMinted = faker.number.int({ min: 0, max: Math.floor(maxSupply * 0.8) });
  } else if (status === "ended") {
    totalMinted = faker.number.int({ min: Math.floor(maxSupply * 0.5), max: maxSupply });
  }

  return {
    id: `col_${faker.string.alphanumeric(12)}`,
    slug: `${slugBase}-${faker.string.alphanumeric(4)}`,
    name: collectionName,
    description: faker.lorem.paragraph(),
    category: faker.helpers.arrayElement(["pfp", "art", "gaming", "music", "photography"]),
    imageUrl: faker.image.urlPicsumPhotos({ width: 400, height: 400 }),
    bannerUrl: faker.image.urlPicsumPhotos({ width: 1200, height: 300 }),
    websiteUrl: faker.internet.url(),
    socialLinks: socialLinks(),
    isVerified: faker.datatype.boolean(0.35),
    totalSupply: maxSupply,
    royaltyBps: faker.number.int({ min: 0, max: 1000 }),
    createdAt: createdAt.toISOString(),
    updatedAt: createdAt.toISOString(),
    status,
    mintStartDate: faker.date.future().toISOString(),
    mintEndDate: faker.date.future({ years: 1 }).toISOString(),
    publicMint: hasPublicMint ? publicMint() : undefined,
    totalMinted,
    maxSupply,
    mintPrice: faker.helpers.arrayElement(["0.05 ETH", "0.1 ETH", "0.5 ETH", "1 ETH", "2 SOL", "5 SOL"]),
    ...overrides,
  };
}

/**
 * Generate multiple collections
 */
function collections(count: number = 5, kind: MockCollectionKind = "ethereum"): Collection[] {
  return Array.from({ length: count }, () => collection(undefined, kind));
}

// ============================================================================
// Collection Info Faker Methods (for accordion components)
// ============================================================================

/**
 * Generate overview section with list items
 */
function overviewSectionData(title: string, itemCount: number = 3): OverviewSectionData {
  return {
    title,
    items: Array.from({ length: itemCount }, () => faker.lorem.sentence()),
  };
}

/**
 * Generate collection overview data
 * Content based on Meta Racing Pilots NFT collection
 */
function collectionOverviewData(): CollectionOverviewData {
  return {
    description: faker.lorem.paragraphs(2),
    roleInGameplay: overviewSectionData("The Role of Pilots in Gameplay", 3),
    rpgProgression: overviewSectionData("RPG Progression & Custom Builds", 3),
    flexibleUsage: overviewSectionData("Flexible Usage & Team Play", 3),
    ecosystem: faker.lorem.paragraph(),
  };
}

/**
 * Generate utility item with label and description
 */
function utilityItemData(): UtilityItemData {
  const labels = [
    "Necessary Gameplay Asset",
    "Performance Boosts",
    "RPG-Style Progression System",
    "Rarity-Based Progression Depth",
    "Team & Roster Building",
    "Passive Utility via Rental",
  ];
  return {
    label: faker.helpers.arrayElement(labels),
    description: faker.lorem.sentence(),
  };
}

/**
 * Generate collection utility data
 */
function collectionUtilityData(): CollectionUtilityData {
  return {
    title: "Utility",
    items: Array.from({ length: faker.number.int({ min: 5, max: 8 }) }, utilityItemData),
  };
}

/**
 * Collection faker module for generating mock collection data
 */
export const collectionFaker = {
  chainBinding,
  publicMint,
  socialLinks,
  collection,
  collections,
  overview: collectionOverview,
  utility: collectionUtility,
  // Collection info accordion data generators
  collectionOverviewData,
  collectionUtilityData,
};
