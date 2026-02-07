"use client";
import { CollectionMediaShowcase } from "@/modules/launch-pad/mint-nft/components/collection-media-showcase";
import MintPanel from "@/modules/launch-pad/mint-nft/components/mint-panel";
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
            className="absolute inset-0 pointer-events-none"
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
        <div className="flex flex-col lg:flex-row items-start justify-center gap-6 lg:gap-10 p-4 lg:p-10">
          <CollectionMediaShowcase onImageChange={setCurrentImage} />
          <div className="w-full lg:w-[380px] flex-shrink-0">
            <MintPanel currentGalleryImage={currentImage} />
          </div>
        </div>
      </div>
    </>
  );
}
