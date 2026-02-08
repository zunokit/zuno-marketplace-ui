"use client";

import { ResponsiveDialogDrawer } from "@/shared/components/responsive-dialog-drawer";
import { Button } from "@/shared/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { useMintState } from "@/modules/launch-pad/mint-nft/hooks/use-mint-state";

export function MintConfirmDialog() {
  const {
    collection,
    isSameArtType,
    mintCostData,
    lastMintCost,
    amount,
    showConfirmModal,
    setShowConfirmModal,
    isMintingNft,
    isLoading,
    submitMint,
  } = useMintState();

  const footer = (
    <>
      <Button
        variant="outline"
        onClick={() => setShowConfirmModal(false)}
        className="border-border-subtle text-foreground hover:bg-muted dark:border-border-subtle dark:text-foreground dark:hover:bg-hover"
      >
        Cancel
      </Button>
      <Button
        onClick={submitMint}
        disabled={isMintingNft || isLoading}
        className="bg-primary hover:bg-primary/90 text-foreground dark:bg-primary dark:hover:bg-primary/90"
      >
        {isMintingNft || isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="mr-2 h-4 w-4" />
        )}
        {isMintingNft || isLoading ? "Calculating..." : "Confirm Mint"}
      </Button>
    </>
  );

  return (
    <ResponsiveDialogDrawer
      open={showConfirmModal}
      onOpenChange={setShowConfirmModal}
      title="Confirm Mint"
      footer={footer}
      contentClassName="space-y-4"
    >
      <p className="text-sm text-foreground dark:text-foreground">
        You are about to mint{" "}
        <span className="font-medium">
          {amount} NFT{amount > 1 ? "s" : ""}
        </span>{" "}
        from
        <span className="font-medium"> {collection?.name}</span>.
      </p>
      <div className="bg-secondary dark:bg-dialog p-4 rounded-os-lg border border-border-subtle dark:border-border-subtle">
        <p className="text-sm text-os-gray-300 dark:text-os-gray-300">
          <span className="font-medium">Total Cost:</span>{" "}
          {mintCostData?.getMintCost?.success
            ? `${mintCostData.getMintCost.totalPrice} ETH`
            : `${lastMintCost.totalPrice} ETH`}
        </p>
        <p className="text-sm text-os-gray-300 dark:text-os-gray-300">
          <span className="font-medium">Estimated Gas:</span>{" "}
          {mintCostData?.getMintCost?.success
            ? `${mintCostData.getMintCost.estimatedGas} ETH`
            : `${lastMintCost.estimatedGas} ETH`}
        </p>
        {!isSameArtType && (
          <p className="text-sm text-os-gray-300 dark:text-os-gray-300">
            <span className="font-medium">Batch Mint:</span> Potentially multiple NFTs if batch
            provided
          </p>
        )}
      </div>
      <p className="text-sm text-os-gray-300 dark:text-os-gray-300">
        Please ensure your wallet has sufficient funds. This action cannot be undone.
      </p>
    </ResponsiveDialogDrawer>
  );
}
