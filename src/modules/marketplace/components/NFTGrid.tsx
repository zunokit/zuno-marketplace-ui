"use client";

import { Package } from "lucide-react";
import { cn } from "@/shared/utils/tailwind-utils";
import { type Nft } from "@/modules/marketplace/types";
import NFTCardSeller from "@/modules/marketplace/components/NFTCardSeller";
// import NFTCardBuyer from "@/modules/marketplace/components/NFTCardBuyer"; // Will add when needed

interface NFTGridProps {
  type: "buyer" | "seller";
  nfts: Nft[];
  view: "grid" | "compact";
  showFilters: boolean;
  isSliding: boolean;
  onSelect: (id: string) => void;
  onCardClick?: (nft: Nft) => void;
  selectedNFTs: string[];
}

export default function NFTGrid({
  type,
  nfts,
  view,
  showFilters,
  isSliding,
  onSelect,
  onCardClick,
  selectedNFTs,
}: NFTGridProps) {
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
          // Will use NFTCardBuyer when implemented
          <NFTCardSeller
            key={nft.id}
            {...commonProps}
            nft={nft}
            onSelect={() => onSelect(nft.id)}
            isSelected={selectedNFTs.includes(nft.id)}
          />
        ) : (
          <NFTCardSeller
            key={nft.id}
            {...commonProps}
            nft={nft}
            onSelect={() => onSelect(nft.id)}
            isSelected={selectedNFTs.includes(nft.id)}
          />
        )
      )}
    </div>
  );
}
