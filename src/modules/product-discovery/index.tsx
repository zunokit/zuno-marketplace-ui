"use client";

import { HomeBanner } from "@/modules/product-discovery/banner";
import CarouselCollection from "@/modules/product-discovery/collection-carousel";
import { TrendingCarousel } from "@/shared/components/carousel/trending";
import MarketplaceStats from "@/modules/product-discovery/marketplace-stats";
import NFTCategories from "@/modules/product-discovery/nft-categories";
import LiveAuctions from "@/modules/product-discovery/live-auctions";
import { makeMockTrendingItems } from "@/shared/utils/mock/mockTrending";

export default function ProductDiscovery() {
  // Generate mock trending data for the carousel
  const trendingItems = makeMockTrendingItems(20);

  const handleTrendingItemClick = (item: any) => {
    console.log("Trending item clicked:", item);
    // TODO: Navigate to collection/item details page
  };

  return (
    <div className="pt-4 space-y-8">
      <HomeBanner />
      <LiveAuctions />

      <TrendingCarousel
        items={trendingItems}
        title="Trending Collections"
        subtitle="Top performing collections today"
        onItemClick={handleTrendingItemClick}
      />

      <CarouselCollection />
      <MarketplaceStats />
      <NFTCategories />
    </div>
  );
}
