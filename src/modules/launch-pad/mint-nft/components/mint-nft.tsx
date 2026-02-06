"use client";
import { CollectionMediaShowcase } from "@/modules/launch-pad/mint-nft/components/collection-media-showcase";
import MintPanel from "@/modules/launch-pad/mint-nft/components/mint-panel";
import ExploreCollectionButton from "@/modules/launch-pad/mint-nft/components/explore-collection-button";
import { useTheme } from "next-themes";
import MintNFTSkeleton from "@/modules/launch-pad/mint-nft/components/mint-nft-skeleton";
import { useMintState } from "@/modules/launch-pad/mint-nft/hooks/use-mint-state";

type MintNFTProps = { slug: string };

export default function MintNFT({ }: MintNFTProps) {
  const { theme } = useTheme();
  const { currentImage, setCurrentImage } = useMintState();

  if (false) return <MintNFTSkeleton />;

  return (
    <>
      <div className="relative">
        {currentImage && (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${currentImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              filter: `blur(50px) brightness(${theme === "dark" ? "0.3" : "0.5"})`,
              opacity: theme === "dark" ? "0.7" : "0.5",
            }}
          />
        )}
        <div className="flex xl:flex-row items-center justify-center gap-10 flex-col mb-20">
          <CollectionMediaShowcase onImageChange={setCurrentImage} />
          <div className="flex flex-col gap-5 z-1">
            <MintPanel currentGalleryImage={currentImage} />
            <ExploreCollectionButton />
          </div>
        </div>
      </div>
    </>
  );
}
