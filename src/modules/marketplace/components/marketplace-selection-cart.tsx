"use client";

import Image from "next/image";
import { Button } from "@/shared/components/ui/button";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { X, Loader2 } from "lucide-react";
import { useNFTSelectionStore } from "@/shared/stores/use-nft-selection-store";
import { Nft } from "@/modules/marketplace/types";

interface MarketplaceSelectionCartProps {
  /** Optional: resolve IDs to full Nft for image, name, price. When missing, rows show #id… and "Item i". */
  nfts?: Nft[];
  /** e.g. Buy floor / List selected. If set, footer shows this button. */
  onPrimaryAction?: () => void;
  primaryLabel?: string;
  /** When > 0, show processing UI and hide remove/primary. */
  listingStep?: number;
}

/**
 * Cart content only (no Dialog/Sheet). Use as children of ResponsivePopoverDrawer.
 * Reads selectedNFTs, remove, clear, setCartOpen from useNFTSelectionStore.
 */
export default function MarketplaceSelectionCart({
  nfts,
  onPrimaryAction,
  primaryLabel,
  listingStep = 0,
}: MarketplaceSelectionCartProps) {
  const { selectedNFTs, remove, clear, setCartOpen } = useNFTSelectionStore();

  const totalPrice =
    nfts && selectedNFTs.length > 0
      ? selectedNFTs.reduce((sum, id) => {
          const n = nfts.find(x => x.id === id);
          const p = parseFloat(n?.listPrice || n?.mintPrice || "0");
          return sum + p;
        }, 0)
      : 0;
  const hasPrices = nfts && selectedNFTs.length > 0 && totalPrice > 0;
  const isProcessing = listingStep > 0;

  const handleClear = () => {
    clear();
    setCartOpen(false);
  };

  const cartItems = (
    <ScrollArea className="max-h-[min(60vh,400px)] pr-2">
      <div className="space-y-2">
        {selectedNFTs.map((id, i) => {
          const nft = nfts?.find(x => x.id === id);
          return (
            <div
              key={id}
              className="flex items-center gap-3 p-3 rounded-os-xl border border-border-subtle bg-card"
            >
              {nft?.image ? (
                <div className="relative h-12 w-12 rounded overflow-hidden shrink-0">
                  <Image src={nft.image} alt={nft.name || ""} fill className="object-cover" />
                </div>
              ) : (
                <div className="h-12 w-12 rounded bg-muted flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                {nft ? (
                  <>
                    <h4 className="font-medium truncate text-sm">{nft.name}</h4>
                    <p className="text-xs text-os-gray-300">#{nft.tokenId}</p>
                    {(nft.listPrice || nft.mintPrice) && (
                      <p className="text-xs font-medium font-sans">
                        {nft.listPrice || nft.mintPrice} ETH
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <p className="font-mono text-xs truncate">#{id.slice(0, 8)}…</p>
                    <p className="text-xs text-os-gray-300">Item {i + 1}</p>
                  </>
                )}
              </div>
              {!isProcessing && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(id)}
                  className="shrink-0 h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );

  const processingBlock = isProcessing && (
    <div className="space-y-2 py-4">
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">
          {listingStep === 1 && "Preparing items..."}
          {listingStep === 2 && "Creating listings..."}
          {listingStep === 3 && "Finalizing..."}
        </span>
      </div>
      <div className="w-full bg-secondary rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-500"
          style={{ width: `${(listingStep / 3) * 100}%` }}
        />
      </div>
    </div>
  );

  const summary = !isProcessing && (hasPrices || selectedNFTs.length > 0) && (
    <div className="border-t border-border-subtle pt-4">
      <div className="flex justify-between text-sm mb-2">
        <span>Subtotal ({selectedNFTs.length} items)</span>
        {hasPrices ? <span>{totalPrice.toFixed(4)} ETH</span> : <span>—</span>}
      </div>
      {hasPrices && (
        <div className="flex justify-between font-medium font-sans">
          <span>Total</span>
          <span>{totalPrice.toFixed(4)} ETH</span>
        </div>
      )}
    </div>
  );

  const footer = !isProcessing && (
    <div className="flex flex-col gap-2 pt-2">
      {selectedNFTs.length > 0 && (
        <Button variant="outline" size="sm" className="w-full" onClick={handleClear}>
          Clear all
        </Button>
      )}
      {onPrimaryAction && primaryLabel && (
        <Button
          size="sm"
          className="w-full"
          onClick={onPrimaryAction}
          disabled={selectedNFTs.length === 0}
        >
          {primaryLabel}
        </Button>
      )}
    </div>
  );

  return (
    <div className="space-y-3">
      {cartItems}
      {processingBlock}
      {summary}
      {footer}
    </div>
  );
}
