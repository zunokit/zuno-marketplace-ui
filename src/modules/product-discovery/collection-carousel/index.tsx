"use client";
import { CollectionCarousel } from "@/modules/product-discovery/collection-carousel/components/collection-carousel";
import { CarouselHeader } from "@/shared/components/carousel/carousel-header";

export default function CarouselCollection() {
  return (
    <div className="px-4 md:px-6">
      <CarouselHeader title="Collections" seeAllUrl="/collections" />
      <CollectionCarousel />
    </div>
  );
}
