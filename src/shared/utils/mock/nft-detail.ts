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
  const baseNFT = marketplaceFaker.nft(contractAddress, parseInt(tokenId), 0);

  return {
    ...(baseNFT as unknown as NFTDetail),
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
    moreFromCollection: marketplaceFaker.nfts(8, contractAddress, 1) as unknown as NFTDetail['moreFromCollection'],
    rarity: nftFaker.rarity(10000),
  };
};
