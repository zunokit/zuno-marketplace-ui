"use client";

import { useEffect, useState } from "react";
import { CollectionMediaShowcase } from "@/modules/launch-pad/mint-nft/components/collection-media-showcase";
import { CollectionInfoSection } from "@/modules/launch-pad/mint-nft/components/collection-info-section";
import MintPanel from "@/modules/launch-pad/mint-nft/components/mint-panel";
import { useTheme } from "next-themes";
import MintNFTSkeleton from "@/modules/launch-pad/mint-nft/components/mint-nft-skeleton";
import { useMintState } from "@/modules/launch-pad/mint-nft/hooks/use-mint-state";
import { collectionFaker } from "@/shared/utils/mock/fakers";
import type { CollectionOverviewData, CollectionUtilityData } from "@/shared/types/collection-info.types";
import type { Collection } from "@/shared/types";

type MintNFTProps = { slug: string };

export default function MintNFT({}: MintNFTProps) {
  const { theme } = useTheme();
  const { currentImage, setCurrentImage } = useMintState();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [overview, setOverview] = useState<CollectionOverviewData | null>(null);
  const [utility, setUtility] = useState<CollectionUtilityData | null>(null);

  useEffect(() => {
    setCollection(collectionFaker.collection());
    setOverview(collectionFaker.collectionOverviewData());
    setUtility(collectionFaker.collectionUtilityData());
  }, []);

  if (false) return <MintNFTSkeleton />;

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
        <div className="relative max-w-7xl mx-auto w-full p-4 lg:px-6 lg:py-8">
          <div className="flex flex-col lg:flex-row items-start gap-4 lg:gap-6">
            <CollectionMediaShowcase
              collection={collection}
              overview={overview}
              utility={utility}
              onImageChange={setCurrentImage}
            />
            <div className="w-full lg:w-[420px] xl:w-[460px] shrink-0">
              <MintPanel currentGalleryImage={currentImage} />
            </div>
          </div>
          {/* Mobile: info section below mint panel */}
          <div className="w-full lg:hidden mt-4">
            <CollectionInfoSection overview={overview} utility={utility} />
          </div>
        </div>
      </div>
    </>
  );
}
