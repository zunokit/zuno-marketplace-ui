"use client";

import { useState, useEffect } from "react";
import { Button } from "@/shared/components/ui/button";
import Link from "next/link";
import { BaseCarousel } from "@/shared/components/carousel/BaseCarousel";
import { AuctionCard } from "@/modules/product-discovery/live-auctions/components/AuctionCard";

interface Auction {
  id: string;
  name: string;
  image: string;
  collection: string;
  currentBid: string;
  startingPrice: string;
  currency: string;
  endTime: Date;
  totalBids: number;
  viewers: number;
  seller: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  topBidder: {
    name: string;
    avatar: string;
  };
  reservePrice?: string;
  reserveMet: boolean;
}

const mockAuctions: Auction[] = [
  {
    id: "1",
    name: "Genesis Crystal #001",
    image: "https://picsum.photos/600/600?random=101",
    collection: "Genesis Crystals",
    currentBid: "12.5",
    startingPrice: "5.0",
    currency: "ETH",
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
    totalBids: 45,
    viewers: 234,
    seller: {
      name: "CrystalCreator",
      avatar: "https://picsum.photos/100/100?random=111",
      verified: true,
    },
    topBidder: {
      name: "WhaleCollector",
      avatar: "https://picsum.photos/100/100?random=112",
    },
    reservePrice: "15.0",
    reserveMet: false,
  },
  {
    id: "2",
    name: "Cyber Samurai #777",
    image: "https://picsum.photos/600/600?random=102",
    collection: "Cyber Warriors",
    currentBid: "8.2",
    startingPrice: "2.0",
    currency: "ETH",
    endTime: new Date(Date.now() + 45 * 60 * 1000),
    totalBids: 89,
    viewers: 567,
    seller: {
      name: "SamuraiArt",
      avatar: "https://picsum.photos/100/100?random=113",
      verified: true,
    },
    topBidder: {
      name: "NFTNinja",
      avatar: "https://picsum.photos/100/100?random=114",
    },
    reserveMet: true,
  },
  {
    id: "3",
    name: "Ethereal Dreams #42",
    image: "https://picsum.photos/600/600?random=103",
    collection: "Ethereal Collection",
    currentBid: "25.7",
    startingPrice: "10.0",
    currency: "ETH",
    endTime: new Date(Date.now() + 6 * 60 * 60 * 1000),
    totalBids: 123,
    viewers: 892,
    seller: {
      name: "DreamWeaver",
      avatar: "https://picsum.photos/100/100?random=115",
      verified: false,
    },
    topBidder: {
      name: "ArtLover",
      avatar: "https://picsum.photos/100/100?random=116",
    },
    reservePrice: "30.0",
    reserveMet: false,
  },
  {
    id: "4",
    name: "Neon City #1984",
    image: "https://picsum.photos/600/600?random=104",
    collection: "Neon Dreams",
    currentBid: "4.3",
    startingPrice: "1.0",
    currency: "ETH",
    endTime: new Date(Date.now() + 30 * 60 * 1000),
    totalBids: 67,
    viewers: 445,
    seller: {
      name: "NeonArtist",
      avatar: "https://picsum.photos/100/100?random=117",
      verified: true,
    },
    topBidder: {
      name: "CyberCollector",
      avatar: "https://picsum.photos/100/100?random=118",
    },
    reserveMet: true,
  },
  {
    id: "5",
    name: "Cosmic Voyage #999",
    image: "https://picsum.photos/600/600?random=105",
    collection: "Space Explorers",
    currentBid: "18.9",
    startingPrice: "8.0",
    currency: "ETH",
    endTime: new Date(Date.now() + 4 * 60 * 60 * 1000),
    totalBids: 156,
    viewers: 678,
    seller: {
      name: "CosmicArt",
      avatar: "https://picsum.photos/100/100?random=119",
      verified: true,
    },
    topBidder: {
      name: "StarGazer",
      avatar: "https://picsum.photos/100/100?random=120",
    },
    reservePrice: "20.0",
    reserveMet: false,
  },
  {
    id: "6",
    name: "Digital Phoenix #88",
    image: "https://picsum.photos/600/600?random=106",
    collection: "Mythical Beasts",
    currentBid: "32.1",
    startingPrice: "15.0",
    currency: "ETH",
    endTime: new Date(Date.now() + 8 * 60 * 60 * 1000),
    totalBids: 203,
    viewers: 1024,
    seller: {
      name: "MythCreator",
      avatar: "https://picsum.photos/100/100?random=121",
      verified: true,
    },
    topBidder: {
      name: "LegendHunter",
      avatar: "https://picsum.photos/100/100?random=122",
    },
    reserveMet: true,
  },
  {
    id: "7",
    name: "Abstract Emotions #33",
    image: "https://picsum.photos/600/600?random=107",
    collection: "Modern Art",
    currentBid: "6.7",
    startingPrice: "3.0",
    currency: "ETH",
    endTime: new Date(Date.now() + 1 * 60 * 60 * 1000),
    totalBids: 78,
    viewers: 312,
    seller: {
      name: "AbstractMind",
      avatar: "https://picsum.photos/100/100?random=123",
      verified: false,
    },
    topBidder: {
      name: "ArtCollector99",
      avatar: "https://picsum.photos/100/100?random=124",
    },
    reservePrice: "10.0",
    reserveMet: false,
  },
  {
    id: "8",
    name: "Futuristic Landscape #2077",
    image: "https://picsum.photos/600/600?random=108",
    collection: "Future Visions",
    currentBid: "15.4",
    startingPrice: "7.5",
    currency: "ETH",
    endTime: new Date(Date.now() + 5 * 60 * 60 * 1000),
    totalBids: 134,
    viewers: 589,
    seller: {
      name: "FutureArtist",
      avatar: "https://picsum.photos/100/100?random=125",
      verified: true,
    },
    topBidder: {
      name: "VisionSeeker",
      avatar: "https://picsum.photos/100/100?random=126",
    },
    reserveMet: true,
  },
];

export default function LiveAuctions() {
  const [auctions, setAuctions] = useState<Auction[]>([]);

  useEffect(() => {
    setAuctions(mockAuctions);
  }, []);

  const renderAuctionCard = (
    item: Auction,
    isHovered: boolean,
    onMouseEnter: () => void,
    onMouseLeave: () => void
  ) => (
    <AuctionCard
      item={item}
      isHovered={isHovered}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    />
  );

  return (
    <section className="w-full px-4 md:px-6">
      <div className="mx-auto">
        {/* Section Header - Matching CarouselHeader */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-foreground dark:text-foreground">
            Live Auctions
          </h2>
          <Button
            variant="outline"
            size="sm"
            asChild
            className="border-border-subtle text-foreground dark:text-foreground hover:bg-secondary dark:hover:bg-card/5"
          >
            <Link href="/auctions">See all</Link>
          </Button>
        </div>

        {/* Auction Carousel */}
        <BaseCarousel
          items={auctions}
          renderItem={renderAuctionCard}
          autoplayDelay={3000}
          showNavigation={true}
          loop={true}
          align="start"
          itemsPerView={{
            mobile: 1,
            tablet: 3,
            desktop: 5,
          }}
        />
      </div>
    </section>
  );
}
