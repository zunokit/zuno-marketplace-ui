"use client";

import Image from "next/image";
import { Button } from "@/shared/components/ui/button";
import { Plus, Check, Zap } from "lucide-react";
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

  return (
    <div
      className={cn(
        "group relative rounded-[8px] border bg-card text-card-foreground shadow-os-sm transition-all duration-300 hover:shadow-md",
        compact ? "p-0.5" : "p-1",
        disabled && "pointer-events-none opacity-50",
        isSelected && "border-primary ring-2 ring-primary/20"
      )}
    >
      {/* Select Button - Always clickable, visible on hover or when selected */}
      <button
        type="button"
        onClick={e => {
          e.stopPropagation();
          e.preventDefault();
          onSelect();
        }}
        className={cn(
          "absolute z-20 cursor-pointer h-10 w-10 rounded-full border flex items-center justify-center transition-all duration-150",
          compact ? "right-2 top-2" : "right-3 top-3",
          isSelected
            ? "opacity-100 bg-primary text-primary-foreground border-primary"
            : "opacity-0 group-hover:opacity-100 bg-background/80 backdrop-blur-sm text-foreground border-border hover:bg-background"
        )}
      >
        {isSelected ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
      </button>

      {/* Status Badge - visible on hover or when selected */}
      <div
        className={cn(
          "absolute z-10 bg-background/80 backdrop-blur-sm rounded-md px-2 py-1 transition-opacity duration-150",
          compact ? "left-2 top-2" : "left-3 top-3",
          isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}
      >
        <p className="text-xs font-medium text-foreground">{isListed ? "Listed" : "Owner"}</p>
      </div>

      {/* Card Content */}
      <div
        className={cn(
          "cursor-pointer",
          compact ? "p-0.5 pb-12" : "p-1 pb-14"
        )}
        onClick={() => onClick?.(nft)}
      >
        <div className="aspect-square overflow-hidden rounded-[6px] bg-muted">
          <Image
            src={nft.image || "https://picsum.photos/seed/nft-default/400/400"}
            alt={`${nft.name} ${nft.id}`}
            width={400}
            height={400}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <div className={cn("mt-2", compact ? "text-xs" : "text-sm")}>
          <div className="flex items-center justify-between gap-1">
            <div className="font-medium text-foreground truncate">{nft.name}</div>
          </div>
          <div
            className={cn(
              "mt-1 flex items-center justify-between",
              compact ? "text-xs" : "text-sm"
            )}
          >
            <div className="font-semibold text-foreground">
              {isListed ? <>{nft.mintPrice} ETH</> : <span className="text-muted-foreground">Unlisted</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Action Button - slides up on hover */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 overflow-hidden rounded-b-[8px]",
          "translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100",
          "transition-all duration-200 ease-out"
        )}
      >
        <Button
          variant="default"
          className={cn(
            "w-full rounded-none rounded-b-[6px]",
            compact ? "h-10" : "h-12"
          )}
          onClick={e => {
            e.stopPropagation();
          }}
        >
          <Zap className="w-4 h-4 mr-2" />
          <span className="text-sm font-medium">
            {isListed ? "Edit Listing" : "List Now"}
          </span>
        </Button>
      </div>
    </div>
  );
}
