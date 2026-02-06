"use client";

import { useMemo } from "react";
import { BaseCarousel } from "@/shared/components/carousel/base-carousel";
import { CollectionCard } from "@/modules/product-discovery/collection-carousel/components/collection-card";
import { useGetCollectionsQuery } from "@/shared/graphql/hooks.generated";
import type { Collection } from "@/shared/graphql/schema.generated";

export function CollectionCarousel() {
  // Fetch collections from backend
  const { data, loading, error, refetch } = useGetCollectionsQuery({
    variables: {
      page: 1,
      limit: 10,
      sortBy: "createdAt",
      sortOrder: "desc",
    },
  });

  // Use useMemo to avoid re-renders
  const collections = useMemo(() => {
    return data?.collections?.items ?? [];
  }, [data]);

  const renderCollectionCard = (
    item: Collection,
    isHovered: boolean,
    onMouseEnter: () => void,
    onMouseLeave: () => void
  ) => (
    <CollectionCard
      item={item}
      isHovered={isHovered}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    />
  );

  // Loading state - show skeleton cards
  if (loading) {
    return (
      <BaseCarousel
        items={Array.from({ length: 5 }) as Collection[]}
        renderItem={() => (
          <div className="animate-pulse bg-muted rounded-lg h-64 w-full" />
        )}
        autoplayDelay={undefined}
        showNavigation={false}
        loop={false}
        align="start"
        itemsPerView={{
          mobile: 1,
          tablet: 3,
          desktop: 5,
        }}
      />
    );
  }

  // Error state - show retry button
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <p className="text-lg text-muted-foreground mb-2">Failed to load collections</p>
        <p className="text-sm text-muted-foreground mb-4">Please try again later</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  // Empty state - no collections available
  if (collections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <p className="text-lg text-muted-foreground mb-2">No collections available</p>
        <p className="text-sm text-muted-foreground">Check back later for new collections</p>
      </div>
    );
  }

  return (
    <BaseCarousel
      items={collections as any}
      renderItem={renderCollectionCard}
      autoplayDelay={2000}
      showNavigation={true}
      loop={true}
      align="start"
      itemsPerView={{
        mobile: 1,
        tablet: 3,
        desktop: 5,
      }}
    />
  );
}
