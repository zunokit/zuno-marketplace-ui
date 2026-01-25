"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/shared/components/ui/button";
import { Plus, Check, Zap, ImageOff } from "lucide-react";
import { cn } from "@/shared/utils/tailwind-utils";
import type { Nft } from "@/modules/marketplace/types";
import { NftStatus } from "@/modules/marketplace/types";

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

  const handleContentKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.(nft);
    }
  };

  return (
    <div
      className={cn(
        "group relative rounded-[8px] overflow-hidden border border-border-subtle bg-card text-card-foreground shadow-os-sm transition-all duration-300 hover:shadow-md",
        compact ? "p-0.5" : "p-1",
        disabled && "pointer-events-none opacity-50",
        isSelected && "border-primary ring-2 ring-primary/20"
      )}
    >
      {/* Select Button */}
      <button
        type="button"
        onClick={e => {
          e.stopPropagation();
          e.preventDefault();
          onSelect();
        }}
        aria-label={isSelected ? "Deselect" : "Select"}
        className={cn(
          "absolute z-20 cursor-pointer h-10 w-10 rounded-full border flex items-center justify-center transition-all duration-150",
          compact ? "right-2 top-2" : "right-3 top-3",
          isSelected
            ? "opacity-100 bg-primary text-primary-foreground border-primary"
            : "opacity-0 group-hover:opacity-100 bg-background/80 backdrop-blur-sm text-foreground border-border hover:bg-background focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        )}
      >
        {isSelected ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
      </button>

      {/* Status Badge */}
      <div
        className={cn(
          "absolute z-10 bg-background/80 backdrop-blur-sm rounded-md px-2 py-1 transition-opacity duration-150",
          compact ? "left-2 top-2" : "left-3 top-3",
          isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}
      >
        <span className="flex items-center gap-1.5">
          <span
            className={cn(
              "size-1.5 rounded-full shrink-0",
              isListed ? "bg-green-500" : "bg-muted-foreground/60"
            )}
          />
          <span className="text-xs font-medium text-foreground">{isListed ? "Listed" : "Owner"}</span>
        </span>
      </div>

      {/* Card Content */}
      <div
        role="button"
        tabIndex={0}
        onKeyDown={handleContentKeyDown}
        className={cn(
          "cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-[6px]",
          compact ? "p-0.5 pb-12" : "p-1 pb-14"
        )}
        onClick={() => onClick?.(nft)}
        aria-label={`View ${nft.name}`}
      >
        <div className="aspect-square overflow-hidden rounded-[6px] bg-muted">
          {imgError ? (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <ImageOff className="h-8 w-8 text-muted-foreground" aria-hidden />
            </div>
          ) : (
            <Image
              src={nft.image || IMAGE_FALLBACK}
              alt={nft.name}
              width={400}
              height={400}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={() => setImgError(true)}
            />
          )}
        </div>

        <div className={cn("mt-2", compact ? "text-xs" : "text-sm")}>
          <div className="font-medium text-foreground truncate">{nft.name}</div>
          <div className={cn("mt-1", compact ? "text-xs" : "text-sm")}>
            <span className="font-semibold text-foreground">
              {isListed ? <>{nft.mintPrice} ETH</> : <span className="text-muted-foreground">Unlisted</span>}
            </span>
          </div>
        </div>
      </div>

      {/* Action Button - slides up on hover */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 rounded-b-[8px]",
          "translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100",
          "transition-all duration-200 ease-out"
        )}
      >
        <Button
          variant="default"
          className={cn(
            "w-full rounded-none rounded-b-[6px] cursor-pointer",
            compact ? "h-10" : "h-12"
          )}
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
  );
}
