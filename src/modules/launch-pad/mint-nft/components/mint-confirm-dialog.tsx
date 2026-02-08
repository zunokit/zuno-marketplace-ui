"use client";

import { ResponsiveDialogDrawer } from "@/shared/components/responsive-dialog-drawer";
import { Button } from "@/shared/components/ui/button";
import { Sparkles, Loader2, CheckCircle, AlertCircle, ExternalLink } from "lucide-react";
import { useMintState } from "@/modules/launch-pad/mint-nft/hooks/use-mint-state";
import { cn } from "@/shared/utils/tailwind-utils";

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
    // SDK integration additions
    isConnected,
    isInAllowlist,
    isAllowlistOnly,
    isOwner,
    canMint,
    remainingSupply,
    maxMintable,
    mintPrice,
    currencySymbol,
    priceCalculation,
    address,
  } = useMintState();

  // Determine if mint is possible
  const canProceed = isConnected && canMint && remainingSupply > 0;

  // Allowlist restriction message
  const allowlistMessage = isAllowlistOnly && !isInAllowlist && !isOwner
    ? "You are not in the allowlist for this collection."
    : null;

  const footer = (
    <>
      <Button
        variant="outline"
        onClick={() => setShowConfirmModal(false)}
        disabled={isMintingNft}
        className="border-border-subtle text-foreground hover:bg-muted dark:border-border-subtle dark:text-foreground dark:hover:bg-hover"
      >
        Cancel
      </Button>
      <Button
        onClick={submitMint}
        disabled={isMintingNft || isLoading || !canProceed}
        className={cn(
          "bg-primary hover:bg-primary/90 text-foreground dark:bg-primary dark:hover:bg-primary/90",
          (!canProceed || allowlistMessage) && "opacity-50 cursor-not-allowed"
        )}
      >
        {isMintingNft || isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="mr-2 h-4 w-4" />
        )}
        {isMintingNft || isLoading ? "Minting..." : "Confirm Mint"}
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
      {/* Wallet Connection Status */}
      <div className={cn(
        "p-3 rounded-lg border flex items-center gap-3",
        isConnected
          ? "bg-green-500/10 border-green-500/30"
          : "bg-destructive/10 border-destructive/30"
      )}>
        {isConnected ? (
          <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
        ) : (
          <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">
            {isConnected ? "Wallet Connected" : "Wallet Not Connected"}
          </p>
          {isConnected && address && (
            <p className="text-xs text-muted-foreground font-mono truncate">
              {address.slice(0, 6)}...{address.slice(-4)}
            </p>
          )}
        </div>
      </div>

      {/* Allowlist Status */}
      {isAllowlistOnly && (
        <div className={cn(
          "p-3 rounded-lg border",
          isInAllowlist || isOwner
            ? "bg-green-500/10 border-green-500/30"
            : "bg-destructive/10 border-destructive/30"
        )}>
          <div className="flex items-center gap-2">
            {isInAllowlist || isOwner ? (
              <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
            )}
            <p className={cn(
              "text-sm font-medium",
              isInAllowlist || isOwner ? "text-green-600 dark:text-green-400" : "text-destructive"
            )}>
              {isOwner
                ? "Owner Access (Allowlist Exempt)"
                : isInAllowlist
                  ? "Allowlist Verified"
                  : "Not in Allowlist"}
            </p>
          </div>
          {!isInAllowlist && !isOwner && (
            <p className="text-xs text-muted-foreground mt-1">
              This collection is allowlist-only. You cannot mint without being on the allowlist.
            </p>
          )}
        </div>
      )}

      {/* Mint Summary */}
      <p className="text-sm text-foreground dark:text-foreground">
        You are about to mint{" "}
        <span className="font-medium">
          {amount} NFT{amount > 1 ? "s" : ""}
        </span>{" "}
        from
        <span className="font-medium"> {collection?.name}</span>.
      </p>

      {/* Price Breakdown */}
      <div className="bg-secondary dark:bg-dialog p-4 rounded-os-lg border border-border-subtle dark:border-border-subtle space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Mint Price</span>
          <span className="font-medium">{mintPrice} {currencySymbol}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Quantity</span>
          <span className="font-medium">x {amount}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Mint Fee</span>
          <span className="font-medium">{(0.009 * amount).toFixed(4)} {currencySymbol}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Protocol Fee</span>
          <span className="font-medium">{(0.0042 * amount).toFixed(4)} {currencySymbol}</span>
        </div>
        <div className="border-t border-border-subtle my-2" />
        <div className="flex justify-between text-base font-bold">
          <span>Total</span>
          <span>{priceCalculation?.totalPrice || lastMintCost.totalPrice} {currencySymbol}</span>
        </div>
      </div>

      {/* Supply Info */}
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Remaining Supply</span>
        <span className={cn(
          "font-medium",
          remainingSupply <= 10 && "text-orange-500"
        )}>
          {remainingSupply} NFTs
        </span>
      </div>

      {/* Max Mintable Info */}
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Max per Wallet</span>
        <span className="font-medium">{maxMintable} NFTs</span>
      </div>

      {!isSameArtType && (
        <p className="text-sm text-os-gray-300 dark:text-os-gray-300">
          <span className="font-medium">Batch Mint:</span> Potentially multiple NFTs if batch
          provided
        </p>
      )}

      <p className="text-sm text-os-gray-300 dark:text-os-gray-300">
        Please ensure your wallet has sufficient funds. This action cannot be undone.
      </p>

      {/* Transaction Status Note */}
      {(isMintingNft || isLoading) && (
        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
            <p className="text-sm text-blue-600 dark:text-blue-400">
              Transaction in progress...
            </p>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Please confirm the transaction in your wallet and wait for it to be mined.
          </p>
        </div>
      )}
    </ResponsiveDialogDrawer>
  );
}
