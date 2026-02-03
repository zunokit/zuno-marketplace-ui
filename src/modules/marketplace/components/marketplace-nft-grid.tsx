"use client";

import { Package } from "lucide-react";
import { cn } from "@/shared/utils/tailwind-utils";
import { type Nft } from "@/modules/marketplace/types";
import MarketplaceNFTCard from "@/modules/marketplace/components/marketplace-nft-card";
import { InfiniteScrollTrigger } from "@/shared/components/infinite-scroll-trigger";

interface MarketplaceNFTGridProps {
  type: "buyer" | "seller";
  nfts: Nft[];
  view: "grid" | "compact";
  showFilters: boolean;
  isSliding: boolean;
  onSelect: (id: string) => void;
  onCardClick?: (nft: Nft) => void;
  selectedNFTs: string[];

  // Infinite scroll props
  infiniteScrollProps?: {
    hasNextPage: boolean | undefined;
    isFetchingNextPage: boolean;
    fetchNextPage: () => void;
    isError?: boolean;
  };
}

export default function MarketplaceNFTGrid({
  type,
  nfts,
  view,
  showFilters,
  isSliding,
  onSelect,
  onCardClick,
  selectedNFTs,
  infiniteScrollProps,
}: MarketplaceNFTGridProps) {
  if (!nfts || nfts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <Package className="h-8 w-8 text-muted-foreground" aria-hidden />
        </div>
        <p className="text-sm font-medium text-foreground">No items to show</p>
        <p className="text-xs text-os-gray-300 mt-1">Adjust filters or check back later.</p>
      </div>
    );
  }

  const commonProps = {
    view: view,
    isSliding: isSliding,
    onClick: onCardClick,
  };

  return (
    <div className="flex flex-col">
      <div
        className={cn(
          "grid gap-3 transition-all duration-300 ease-in-out p-3",
          view === "compact"
            ? showFilters
              ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
              : "grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8"
            : showFilters
              ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
              : "grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
        )}
      >
        {nfts.map(nft =>
          type === "buyer" ? (
            <MarketplaceNFTCard
              key={nft.id}
              {...commonProps}
              nft={nft}
              onSelect={() => onSelect(nft.id)}
              isSelected={selectedNFTs.includes(nft.id)}
            />
          ) : (
            <MarketplaceNFTCard
              key={nft.id}
              {...commonProps}
              nft={nft}
              onSelect={() => onSelect(nft.id)}
              isSelected={selectedNFTs.includes(nft.id)}
            />
          )
        )}
      </div>

      {/* Loading indicator for next page */}
      {infiniteScrollProps?.isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

      {/* Error message */}
      {infiniteScrollProps?.isError && (
        <div className="text-center py-4">
          <p className="text-sm text-red-500">Failed to load more items. Please try again.</p>
        </div>
      )}

      {/* End of list message */}
      {!infiniteScrollProps?.hasNextPage && nfts.length > 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">You&apos;ve reached the end</p>
        </div>
      )}

      {/* Infinite scroll trigger */}
      {infiniteScrollProps && (
        <InfiniteScrollTrigger
          hasNextPage={infiniteScrollProps.hasNextPage}
          isFetchingNextPage={infiniteScrollProps.isFetchingNextPage}
          fetchNextPage={infiniteScrollProps.fetchNextPage}
          isError={infiniteScrollProps.isError}
        />
      )}
    </div>
  );
}
