import { faker } from "./faker-instance";
import { type Auction, type AuctionBid } from "@/shared/types/auction";

/**
 * Generate mock bids using faker
 */
const generateMockBids = (auctionId: string, count: number): AuctionBid[] => {
  const bids: AuctionBid[] = [];
  let currentAmount = 0.1;

  for (let i = 0; i < count; i++) {
    currentAmount += faker.number.float({ min: 0.01, max: 0.05 });
    bids.push({
      id: `bid-${auctionId}-${i}`,
      bidder: {
        address: faker.finance.ethereumAddress(),
        name: faker.helpers.maybe(() => faker.internet.username(), { probability: 0.7 }),
        avatar: faker.helpers.maybe(() => faker.image.avatar(), { probability: 0.7 }),
      },
      amount: currentAmount.toFixed(3),
      timestamp: faker.date.recent({ days: 1 }),
      txHash: faker.string.hexadecimal({ length: 64 }),
    });
  }

  return bids.reverse();
};

/**
 * Generate a single mock auction using faker
 */
const generateMockAuction = (index: number): Auction => {
  const statuses: Auction["status"][] = ["upcoming", "active", "ended", "active"];
  const status = statuses[index % statuses.length];
  const bids =
    status === "active" || status === "ended"
      ? generateMockBids(`auction-${index}`, faker.number.int({ min: 1, max: 15 }))
      : [];

  const now = new Date();
  let startTime: Date;
  let endTime: Date;

  if (status === "upcoming") {
    startTime = new Date(now.getTime() + (index + 1) * 24 * 60 * 60 * 1000);
    endTime = new Date(startTime.getTime() + 7 * 24 * 60 * 60 * 1000);
  } else if (status === "active") {
    startTime = new Date(now.getTime() - (index + 1) * 24 * 60 * 60 * 1000);
    endTime = new Date(now.getTime() + (7 - index) * 24 * 60 * 60 * 1000);
  } else {
    startTime = new Date(now.getTime() - (index + 7) * 24 * 60 * 60 * 1000);
    endTime = new Date(now.getTime() - index * 24 * 60 * 60 * 1000);
  }

  const startingPrice = faker.finance.amount({ min: 0.1, max: 0.6, dec: 3 });
  const currentBid = bids.length > 0 ? bids[0].amount : startingPrice;

  return {
    id: `auction-${index}`,
    nftId: `nft-${index}`,
    tokenId: `${2000 + index}`,
    contractAddress: faker.finance.ethereumAddress(),
    name: `Auction NFT #${2000 + index}`,
    description: faker.lorem.sentence(),
    image: faker.image.urlPicsumPhotos({ width: 400, height: 400 }),
    seller: {
      address: faker.finance.ethereumAddress(),
      name: faker.helpers.maybe(() => faker.internet.username(), { probability: 0.7 }),
      avatar: faker.helpers.maybe(() => faker.image.avatar(), { probability: 0.7 }),
    },
    startingPrice,
    currentBid,
    reservePrice: (parseFloat(startingPrice) * 2).toFixed(3),
    currency: "ETH",
    startTime,
    endTime,
    bids,
    status,
    winner:
      status === "ended" && bids.length > 0
        ? {
            address: bids[0].bidder.address,
            name: bids[0].bidder.name,
          }
        : undefined,
  };
};

// Generate array of mock auctions
export const mockAuctions: Auction[] = Array.from({ length: 24 }, (_, i) => generateMockAuction(i));

// Auction statistics
export const mockAuctionStats = {
  totalAuctions: mockAuctions.length,
  activeAuctions: mockAuctions.filter((a) => a.status === "active").length,
  totalVolume:
    mockAuctions
      .filter((a) => a.status === "ended")
      .reduce((sum, a) => sum + parseFloat(a.currentBid), 0)
      .toFixed(2) + " ETH",
  avgBidsPerAuction: Math.floor(
    mockAuctions.reduce((sum, a) => sum + a.bids.length, 0) / mockAuctions.length
  ),
};
