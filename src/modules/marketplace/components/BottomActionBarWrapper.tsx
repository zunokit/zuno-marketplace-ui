"use client";

import { usePathname } from "next/navigation";
import { useNFTSelectionStore } from "@/shared/stores/use-nft-selection-store";
import BottomActionBar from "@/modules/marketplace/components/BottomActionBar";

/**
 * BottomActionBarWrapper Component
 *
 * Wraps BottomActionBar with visibility logic. In document flow (không fixed/sticky).
 * Renders the bar only on marketplace routes or when items are selected.
 */
export default function BottomActionBarWrapper() {
  const pathname = usePathname();
  const {
    selectedNFTs,
    sliderValue,
    actionMode,
    setSliderValue,
    setActionMode,
    setMaxItems,
    maxItems,
  } = useNFTSelectionStore();

  // Show on marketplace routes or when items are selected
  const showBar = pathname?.startsWith("/marketplace") || selectedNFTs.length > 0;

  if (!showBar) return null;

  const handleItemCountChange = (count: number) => {
    // Update slider value when count changes via +/- buttons
    // This triggers bulk selection via slider
    setSliderValue(count);

    // Update selected NFTs based on count
    // We need to get the NFTs from somewhere - for now just update slider
    // The actual selection logic will be handled by the slider change
  };

  return (
    <div className="w-full shrink-0 lg:ml-[52px] lg:w-[calc(100%-52px)]">
      <BottomActionBar
        mode={actionMode}
        onModeChange={setActionMode}
        itemCount={selectedNFTs.length}
        maxItems={maxItems}
        sliderValue={sliderValue}
        onSliderChange={setSliderValue}
        onItemCountChange={handleItemCountChange}
        onBuyFloor={() => console.log("Buy floor clicked")}
        onMakeOffer={() => console.log("Make offer clicked")}
      />
    </div>
  );
}
