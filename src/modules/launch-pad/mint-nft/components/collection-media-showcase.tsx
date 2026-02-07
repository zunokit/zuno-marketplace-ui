"use client";

import { useEffect, useState } from "react";
import CollectionGallery from "@/modules/launch-pad/mint-nft/components/collection-gallery";
import CollectionImageCarousel from "@/modules/launch-pad/mint-nft/components/collection-image-carousel";
import { CollectionInfoSection } from "@/modules/launch-pad/mint-nft/components/collection-info-section";
import { Collection } from "@/shared/types";
import { collectionFaker } from "@/shared/utils/mock/fakers";
import type { CollectionOverviewData, CollectionUtilityData } from "@/shared/types/collection-info.types";

interface CollectionMediaShowcaseProps {
  onImageChange?: (imageUrl: string) => void;
}

export function CollectionMediaShowcase({ onImageChange }: CollectionMediaShowcaseProps) {
  const [showCarousel, setShowCarousel] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [collection, setCollection] = useState<Collection | null>(null);
  const [overview, setOverview] = useState<CollectionOverviewData | null>(null);
  const [utility, setUtility] = useState<CollectionUtilityData | null>(null);

  useEffect(() => {
    setCollection(collectionFaker.collection());
    setOverview(collectionFaker.collectionOverviewData());
    setUtility(collectionFaker.collectionUtilityData());
  }, []);

  const handleOpenCarousel = (index: number) => {
    setCarouselIndex(index);
    setShowCarousel(true);
  };
  const handleCloseCarousel = () => {
    console.log("Closing carousel, showCarousel set to false");
    setShowCarousel(false);
  };
  if (!collection) return null;
  return (
    <div className="flex flex-1 w-2/3 flex-col gap-5 max-w-2xl">
      <CollectionGallery onOpenCarousel={handleOpenCarousel} onImageChange={onImageChange} />
      {showCarousel && (
        <CollectionImageCarousel initialIndex={carouselIndex} onClose={handleCloseCarousel} />
      )}
      <CollectionInfoSection overview={overview} utility={utility} />
    </div>
  );
}
