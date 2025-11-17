"use client";

import { HomeBanner } from "@/modules/product-discovery/banner";
import CarouselCollection from "@/modules/product-discovery/collection-carousel";
import TrendingNFTs from "@/modules/product-discovery/trending-nfts";
import LiveAuctions from "@/modules/product-discovery/live-auctions";

export default function ProductDiscovery() {
  return (
    <div className="pt-4 space-y-8">
      <HomeBanner />
      <LiveAuctions />
      <TrendingNFTs />
      <CarouselCollection />
    </div>
  );
}
