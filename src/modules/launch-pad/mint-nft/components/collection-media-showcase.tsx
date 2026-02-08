"use client";

import { useState } from "react";
import CollectionGallery from "@/modules/launch-pad/mint-nft/components/collection-gallery";
import CollectionImageCarousel from "@/modules/launch-pad/mint-nft/components/collection-image-carousel";
import { CollectionInfoSection } from "@/modules/launch-pad/mint-nft/components/collection-info-section";
import type { Collection } from "@/shared/types";
import type { CollectionOverviewData, CollectionUtilityData } from "@/shared/types/collection-info.types";

interface CollectionMediaShowcaseProps {
  collection?: Collection | null;
  overview?: CollectionOverviewData | null;
  utility?: CollectionUtilityData | null;
  onImageChange?: (imageUrl: string) => void;
}

export function CollectionMediaShowcase({
  collection,
  overview,
  utility,
  onImageChange,
}: CollectionMediaShowcaseProps) {
  const [showCarousel, setShowCarousel] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const handleOpenCarousel = (index: number) => {
    setCarouselIndex(index);
    setShowCarousel(true);
  };
  const handleCloseCarousel = () => {
    setShowCarousel(false);
  };

  if (!collection) return null;

  return (
    <div className="flex flex-1 w-full lg:w-2/3 flex-col gap-5 xl:max-w-2xl">
      <CollectionGallery onOpenCarousel={handleOpenCarousel} onImageChange={onImageChange} />
      {showCarousel && (
        <CollectionImageCarousel initialIndex={carouselIndex} onClose={handleCloseCarousel} />
      )}
      {/* Desktop: info section stays here; hidden on mobile (shown below panel in mint-nft) */}
      <div className="hidden lg:block">
        <CollectionInfoSection overview={overview} utility={utility} />
      </div>
    </div>
  );
}
