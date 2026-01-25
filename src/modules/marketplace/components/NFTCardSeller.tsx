"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Plus, Check, Zap, ImageOff } from "lucide-react";
import { cn } from "@/shared/utils/tailwind-utils";
import type { Nft } from "@/modules/marketplace/types";
import { NftStatus } from "@/modules/marketplace/types";
import { formatTokenId, formatPriceShort, ETH_SYMBOL } from "@/shared/utils/format";
import { getPriceDisplay, getStatusMeta } from "@/modules/marketplace/utils";

interface NFTCardProps {
  nft: Nft;
  view?: "compact" | "grid" | "list";
  isSliding?: boolean;
  onSelect: () => void;
  onClick?: (nft: Nft) => void;
  isSelected: boolean;
  disabled?: boolean;
}

const IMAGE_FALLBACK = "/placeholder.svg";

export default function NFTCardSeller({
  nft,
  view = "grid",
  isSliding = false,
  onSelect,
  onClick,
  isSelected,
  disabled = false,
}: NFTCardProps) {
  const compact = view === "compact";
  const isListed = nft.status === NftStatus.Listed;
  const [imgError, setImgError] = useState(false);
  const statusMeta = getStatusMeta(nft);
  const priceStr = getPriceDisplay(nft);
  const tokenStr = formatTokenId(nft.tokenId);

  const handleContentKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.(nft);
    }
  };

  return (
    <div
      className={cn(
        "group relative h-full",
        disabled && "pointer-events-none opacity-50",
        isSelected && "ring-2 ring-primary/20 ring-offset-2 rounded-os-xl"
      )}
    >
      <Card
        className={cn(
          "overflow-hidden border border-border-subtle dark:border-border-subtle bg-background dark:bg-card text-foreground dark:text-foreground text-sm h-full p-0 transition-all duration-300 hover:shadow-md",
          isSelected && "border-primary"
        )}
      >
        <div className="flex flex-col h-full relative">
          {/* Select Button */}
          <Button
            type="button"
            size="icon"
            variant={isSelected ? "default" : "outline"}
            aria-label={isSelected ? "Deselect" : "Select"}
            className={cn(
              "absolute z-20 rounded-full transition-all duration-150",
              compact ? "right-2 top-2" : "right-3 top-3",
              isSelected
                ? "border-primary"
                : "opacity-0 group-hover:opacity-100 bg-background/80 backdrop-blur-sm border-border hover:bg-background focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            )}
            onClick={e => {
              e.stopPropagation();
              e.preventDefault();
              onSelect();
            }}
          >
            {isSelected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </Button>

          {/* Status Badge */}
          <div
            className={cn(
              "absolute z-10 bg-background/80 backdrop-blur-sm rounded-md px-2 py-1 transition-opacity duration-150",
              compact ? "left-2 top-2" : "left-3 top-3",
              isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            )}
          >
            <span className="flex items-center gap-1.5">
              <span className={cn("size-1.5 rounded-full shrink-0", statusMeta.color)} />
              <span className="text-xs font-medium text-foreground">{statusMeta.label}</span>
            </span>
          </div>

          {/* Image: compact dùng aspect-square (gọn), grid dùng aspect-4/3 (đồng bộ CollectionCard) */}
          <div
            role="button"
            tabIndex={0}
            onKeyDown={handleContentKeyDown}
            className={cn(
              "relative w-full overflow-hidden cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
              compact ? "aspect-square" : "aspect-4/3"
            )}
            onClick={() => onClick?.(nft)}
            aria-label={`View ${nft.name}`}
          >
            {imgError ? (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <ImageOff className="h-8 w-8 text-muted-foreground" aria-hidden />
              </div>
            ) : (
              <Image
                src={nft.image || IMAGE_FALLBACK}
                alt={nft.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                onError={() => setImgError(true)}
              />
            )}
          </div>

          {/* Content: bố cục riêng — compact (view 1) vs grid (view 2) */}
          <CardContent
            className={cn(
              "flex flex-col justify-between",
              compact ? "p-2" : "p-3 h-32"
            )}
          >
            {compact ? (
              /* View 1 (compact): bố cục riêng, gọn — Name, Price | Token, Status */
              <>
                <h3 className="font-medium font-sans truncate text-sm text-foreground dark:text-foreground mb-1 shrink-0">
                  {nft.name}
                </h3>
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span
                    className="font-medium text-xs text-foreground dark:text-foreground truncate min-w-0"
                    title={isListed ? (priceStr !== "—" ? `${priceStr} ETH` : "—") : priceStr !== "—" ? `${priceStr} (mint)` : "Unlisted"}
                  >
                    {isListed
                      ? priceStr === "—"
                        ? "—"
                        : `${formatPriceShort(priceStr)}${ETH_SYMBOL}`
                      : priceStr === "—"
                        ? "Unlisted"
                        : `${formatPriceShort(priceStr)} (mint)`}
                  </span>
                  <span className="text-xs text-os-gray-300 dark:text-os-gray-300 shrink-0" title={nft.tokenId}>
                    {tokenStr}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-1.5 shrink-0">
                  <span className={cn("size-1.5 rounded-full shrink-0", statusMeta.color)} />
                  <span className="text-xs text-foreground dark:text-foreground truncate" title={statusMeta.label}>
                    {statusMeta.label}
                  </span>
                </div>
              </>
            ) : (
              /* View 2 (grid): layout đầy đủ — Price full, Token | Last sale, Status */
              <>
                <h3 className="font-medium font-sans truncate text-base text-foreground dark:text-foreground mb-2 shrink-0">
                  {nft.name}
                </h3>
                <div className="space-y-1.5 mb-auto">
                  <div className="min-w-0 overflow-hidden">
                    <p className="text-xs uppercase font-medium text-os-gray-300 dark:text-os-gray-300">Price</p>
                    <p className="font-medium text-sm text-foreground dark:text-foreground truncate" title={isListed ? (priceStr !== "—" ? `${priceStr} ETH` : "—") : priceStr !== "—" ? `${priceStr} (mint)` : "Unlisted"}>
                      {isListed
                        ? priceStr === "—"
                          ? "—"
                          : `${formatPriceShort(priceStr)}${ETH_SYMBOL}`
                        : priceStr === "—"
                          ? "Unlisted"
                          : `${formatPriceShort(priceStr)} (mint)`}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
                    <div className="min-w-0 overflow-hidden">
                      <p className="text-xs uppercase font-medium text-os-gray-300 dark:text-os-gray-300">Token</p>
                      <p className="font-medium text-sm text-foreground dark:text-foreground truncate" title={nft.tokenId}>
                        {tokenStr}
                      </p>
                    </div>
                    <div className="min-w-0 overflow-hidden">
                      <p className="text-xs uppercase font-medium text-os-gray-300 dark:text-os-gray-300">Last sale</p>
                      <p className="font-medium text-sm text-foreground dark:text-foreground truncate" title={nft.lastSalePrice ? `${nft.lastSalePrice} ETH` : undefined}>
                        {nft.lastSalePrice ? `${formatPriceShort(nft.lastSalePrice)}${ETH_SYMBOL}` : "—"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 mt-2 pt-1.5 border-t border-border-subtle dark:border-border-subtle shrink-0">
                  <span className={cn("w-2 h-2 rounded-full shrink-0", statusMeta.color)} />
                  <span className="text-xs text-foreground dark:text-foreground truncate" title={statusMeta.label}>
                    {statusMeta.label}
                  </span>
                </div>
              </>
            )}
          </CardContent>

          {/* Action Button - slides up on hover */}
          <div
            className={cn(
              "absolute bottom-0 left-0 right-0",
              "translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100",
              "transition-all duration-200 ease-out z-10"
            )}
          >
            <Button
              variant="default"
              className={cn("w-full rounded-none cursor-pointer", compact ? "h-10" : "h-11")}
              aria-label={isListed ? "Edit listing" : "List for sale"}
              onClick={e => {
                e.stopPropagation();
                onClick?.(nft);
              }}
            >
              <Zap className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">{isListed ? "Edit Listing" : "List Now"}</span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
