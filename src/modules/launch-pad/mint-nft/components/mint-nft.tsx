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
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 p-10">
          <CollectionMediaShowcase onImageChange={setCurrentImage} />
          <div className="mb-auto w-1/3">
            <MintPanel currentGalleryImage={currentImage} />
          </div>
        </div>
      </div>
    </>
  );
}
