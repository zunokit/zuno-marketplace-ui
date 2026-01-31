import { faker } from "../faker-instance";
import { NftStatus, type Nft, type NftAttribute } from "@/modules/marketplace/types";

const BACKGROUNDS = ["Path", "Orchard", "Library", "Garden", "Street", "Mountain"];
const BODIES = ["Blue", "Red", "Yellow", "Green", "Purple", "Orange"];
const RARITIES = ["Common", "Rare", "Epic", "Legendary"];

/**
 * Faker for NFT attributes
 */
function attribute(index: number): NftAttribute {
  const types = [
    { trait_type: "Background", values: BACKGROUNDS },
    { trait_type: "Body", values: BODIES },
    { trait_type: "Rarity", values: RARITIES },
  ];
  const type = types[index % types.length];
  return {
    trait_type: type.trait_type,
    value: faker.helpers.arrayElement(type.values),
  };
}

/**
 * Generate multiple attributes
 */
function attributes(count: number = 3): NftAttribute[] {
  return Array.from({ length: count }, (_, i) => attribute(i));
}

/**
 * Faker for a single NFT
 */
function nft(
  contractAddress: string,
  startId: number,
  index: number
): Nft {
  const id = startId + index;
  const status = faker.helpers.arrayElement<NftStatus>([
    NftStatus.Listed,
    NftStatus.NotListed,
    NftStatus.Sold,
    NftStatus.Cancelled,
  ]);
  const isListed = status === "LISTED";

  return {
    id: `nft-${id}`,
    tokenId: `${id}`,
    name: `NFT #${id}`,
    description: faker.lorem.sentence(),
    image: faker.image.urlPicsumPhotos({ width: 400, height: 400 }),
    contractAddress,
    chainId: "1",
    owner: faker.finance.ethereumAddress(),
    creator: faker.finance.ethereumAddress(),
    status,
    mintPrice: faker.finance.amount({ min: 0.01, max: 0.1, dec: 3 }),
    listPrice: isListed
      ? faker.finance.amount({ min: 0.02, max: 0.2, dec: 3 })
      : undefined,
    lastSalePrice: faker.helpers.maybe(
      () => faker.finance.amount({ min: 0.01, max: 0.5, dec: 3 }),
      { probability: 0.3 }
    ),
    attributes: attributes(),
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
    selected: false,
  };
}

/**
 * Generate multiple NFTs
 */
function nfts(
  count: number,
  contractAddress: string,
  startId: number = 1
): Nft[] {
  return Array.from({ length: count }, (_, i) =>
    nft(contractAddress, startId, i)
  );
}

/**
 * Faker for marketplace NFTs
 */
export const marketplaceFaker = {
  attribute,
  attributes,
  nft,
  nfts,
};
