"use client";

import { useEffect, useState } from "react";
import { CollectionMediaShowcase } from "@/modules/launch-pad/mint-nft/components/collection-media-showcase";
import { CollectionInfoSection } from "@/modules/launch-pad/mint-nft/components/collection-info-section";
import MintPanel from "@/modules/launch-pad/mint-nft/components/mint-panel";
import { useTheme } from "next-themes";
import MintNFTSkeleton from "@/modules/launch-pad/mint-nft/components/mint-nft-skeleton";
import { useMintState } from "@/modules/launch-pad/mint-nft/hooks/use-mint-state";
import { parseCollectionMetadata } from "@/modules/launch-pad/mint-nft/utils/parse-collection-metadata";
import type { CollectionOverviewData, CollectionUtilityData } from "@/shared/types/collection-info.types";
import type { Collection } from "@/shared/types";
import type { GetCollectionQuery } from "@/shared/graphql/hooks.generated";

type MintNFTProps = {
  slug: string;
  collection: GetCollectionQuery["collection"];
};

export default function MintNFT({ collection: initialCollection }: MintNFTProps) {
  const { theme } = useTheme();
  const { currentImage, setCurrentImage, setCollection: setMintCollection } = useMintState();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [overview, setOverview] = useState<CollectionOverviewData | null>(null);
  const [utility, setUtility] = useState<CollectionUtilityData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (initialCollection) {
      // Convert GraphQL collection to Collection type
      const collectionData: Collection = {
        id: initialCollection.id,
        slug: initialCollection.slug || "",
        name: initialCollection.name,
        description: initialCollection.description || undefined,
        category: initialCollection.category || undefined,
        imageUrl: initialCollection.imageUrl || undefined,
        bannerUrl: initialCollection.bannerUrl || undefined,
        websiteUrl: initialCollection.websiteUrl || undefined,
        isVerified: initialCollection.isVerified,
        totalSupply: initialCollection.totalSupply,
        createdAt: initialCollection.createdAt,
        updatedAt: initialCollection.updatedAt,
        status: mapStatusToUI(initialCollection.status),
        totalMinted: initialCollection.totalMinted,
        maxSupply: initialCollection.maxSupply || undefined,
        mintPrice: initialCollection.mintPricePublic || undefined,
      };

      setCollection(collectionData);
      setMintCollection(collectionData);

      // Parse metadata for overview and utility sections
      // Note: settings_json field from metadata will be used when available
      // Using type assertion since settingsJson is not yet in GraphQL schema
      const metadata = initialCollection.metadata as Record<string, unknown> | undefined;
      const settingsJson = metadata?.settingsJson as string | undefined;
      const { overviewData, utilityData } = parseCollectionMetadata(
        settingsJson,
        initialCollection.description,
        initialCollection.name
      );
      setOverview(overviewData);
      setUtility(utilityData);
    }
    setIsLoading(false);
  }, [initialCollection, setMintCollection]);

  if (isLoading || !initialCollection) return <MintNFTSkeleton />;

  return (
    <>
      <div className="relative min-h-[60vh] bg-background">
        {/* Base: theme-aware background. Layer 1: blurred collection image. Layer 2: soft gradient so content sits on a readable base. */}
        {currentImage && (
          <>
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `url(${currentImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                filter: `blur(48px) brightness(${theme === "dark" ? "0.35" : "0.55"})`,
                opacity: theme === "dark" ? "0.65" : "0.45",
              }}
            />
            <div
              className="absolute inset-0 pointer-events-none bg-linear-to-b from-background/70 via-background/40 to-background"
              aria-hidden
            />
          </>
        )}
        <div className="relative flex flex-col lg:flex-row items-start justify-center gap-6 lg:gap-10 p-4 lg:p-10">
          <CollectionMediaShowcase
            collection={collection}
            overview={overview}
            utility={utility}
            onImageChange={setCurrentImage}
          />
          <div className="w-full lg:w-[380px] shrink-0">
            <MintPanel currentGalleryImage={currentImage} />
          </div>
          {/* Mobile: info section below mint panel */}
          <div className="w-full lg:hidden">
            <CollectionInfoSection overview={overview} utility={utility} />
          </div>
        </div>
      </div>
    </>
  );
}

// Helper function to map API status to UI status
function mapStatusToUI(status: string): "upcoming" | "live" | "ended" | "paused" {
  switch (status) {
    case "PENDING":
      return "upcoming";
    case "DEPLOYED":
      return "live";
    case "FAILED":
      return "paused";
    case "ARCHIVED":
      return "ended";
    default:
      return "upcoming";
  }
}
