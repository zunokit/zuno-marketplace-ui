import { type NFTDetail } from "@/shared/types/nft-detail";
import { nftFaker } from "./fakers";
import { marketplaceFaker } from "./fakers";
import { faker } from "./faker-instance";

/**
 * Generate NFT detail with related data
 */
export const generateNFTDetail = (
  chain: string,
  contractAddress: string,
  tokenId: string
): NFTDetail => {
  const numericId = parseInt(tokenId) || Math.abs(tokenId.split('').reduce((a, c) => a + c.charCodeAt(0), 0));
  const baseNFT = marketplaceFaker.nft(contractAddress, numericId, 0);

  return {
    id: baseNFT.id,
    tokenId: baseNFT.tokenId,
    name: baseNFT.name || `NFT #${numericId}`,
    description: baseNFT.description,
    image: baseNFT.image || faker.image.urlPicsumPhotos({ width: 600, height: 600 }),
    price: baseNFT.listPrice || baseNFT.mintPrice || faker.finance.amount({ min: 0.01, max: 5, dec: 3 }),
    currency: "ETH",
    owner: {
      address: typeof baseNFT.owner === 'string' ? baseNFT.owner : faker.finance.ethereumAddress(),
      name: faker.helpers.maybe(() => faker.internet.username(), { probability: 0.7 }),
      avatar: faker.helpers.maybe(() => faker.image.avatar(), { probability: 0.7 }),
    },
    collection: {
      address: contractAddress,
      name: faker.helpers.arrayElement(["Cosmic Dreams", "Pixel Warriors", "Abstract Visions", "Digital Genesis"]),
      verified: faker.datatype.boolean({ probability: 0.8 }),
    },
    attributes: (baseNFT.attributes || []).map(a => ({
      trait_type: a.trait_type,
      value: a.value,
      display_type: a.display_type,
    })),
    status: "available",
    listingType: "fixed",
    createdAt: new Date(baseNFT.createdAt || Date.now()),
    updatedAt: new Date(baseNFT.updatedAt || Date.now()),
    likes: faker.number.int({ min: 0, max: 500 }),
    views: faker.number.int({ min: 50, max: 5000 }),
    blockchain: {
      chain,
      contractAddress,
      tokenStandard: "ERC-721",
      tokenId,
    },
    metadata: {
      description: faker.lorem.paragraph(),
      externalUrl: faker.internet.url(),
      animationUrl: undefined,
      backgroundColor: faker.string.hexadecimal({ length: 6, casing: 'lower' }),
    },
    history: nftFaker.activities(tokenId, 10),
    offers: nftFaker.offers(tokenId, 5).filter(o => o.status === "active"),
    moreFromCollection: Array.from({ length: 8 }, (_, i) => {
      const mNft = marketplaceFaker.nft(contractAddress, 1, i);
      return {
        id: mNft.id,
        tokenId: mNft.tokenId,
        name: mNft.name,
        image: mNft.image || faker.image.urlPicsumPhotos({ width: 300, height: 300 }),
        price: mNft.listPrice || mNft.mintPrice || faker.finance.amount({ min: 0.01, max: 1, dec: 3 }),
        currency: "ETH",
        owner: {
          address: typeof mNft.owner === 'string' ? mNft.owner : faker.finance.ethereumAddress(),
        },
        collection: {
          address: contractAddress,
          name: "Collection",
          verified: true,
        },
        status: "available" as const,
        listingType: "fixed" as const,
        createdAt: new Date(),
        updatedAt: new Date(),
        likes: 0,
        views: 0,
      };
    }),
    rarity: nftFaker.rarity(10000),
  };
};
