"use client";

import { cn } from "@/shared/utils/tailwind-utils";
import { Button } from "@/shared/components/ui/button";
import { Slider } from "@/shared/components/ui/slider";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { ResponsivePopoverDrawer } from "@/shared/components/responsive-popover-drawer";
import { useNFTSelectionStore } from "@/shared/stores/use-nft-selection-store";
import MarketplaceSelectionCart from "@/modules/marketplace/components/marketplace-selection-cart";

type ActionMode = "buy" | "sell";

interface MarketplaceSelectionBarProps {
  mode?: ActionMode;
  onModeChange?: (mode: ActionMode) => void;
  itemCount: number;
  maxItems: number;
  sliderValue: number;
  onSliderChange: (value: number) => void;
  onItemCountChange: (count: number) => void;
  onBuyFloor?: () => void;
  onMakeOffer?: () => void;
  className?: string;
}

export default function MarketplaceSelectionBar({
  mode = "buy",
  onModeChange,
  itemCount,
  maxItems,
  sliderValue,
  onSliderChange,
  onItemCountChange,
  onBuyFloor,
  onMakeOffer,
  className,
}: MarketplaceSelectionBarProps) {
  const { cartOpen, setCartOpen } = useNFTSelectionStore();
  const handleSliderChange = (value: number[]) => {
    onSliderChange(value[0]);
  };

  const decrementCount = () => onItemCountChange(Math.max(0, itemCount - 1));
  const incrementCount = () => onItemCountChange(Math.min(maxItems, itemCount + 1));

  return (
    <div
      className={cn(
        className,
        "flex items-center shrink-0 w-full h-14",
        "border-t border-border bg-background/95 backdrop-blur-sm",
        "scrollbar-hide overflow-y-auto"
      )}
    >
      <div className="mx-auto min-h-0 w-full min-w-0 px-4 lg:px-6 flex items-center">
        <div className="flex items-center justify-between gap-4 w-full min-w-0">
          {/* Left: mode, slider, count, selected */}
          <div className="flex items-center gap-4 min-w-0 shrink-0">
            {/* Buy/Sell Toggle */}
            <div
              className="inline-flex rounded-md gap-1 overflow-hidden bg-muted p-0.5"
              role="group"
            >
              <button
                type="button"
                className={cn(
                  "relative flex items-center rounded-md py-1 outline-hidden",
                  "transition-[scale,colors] duration-200 ease-out active:scale-[0.97]",
                  "text-sm px-3 h-7",
                  mode === "buy"
                    ? "font-medium text-foreground"
                    : "text-os-gray-300 hover:text-foreground"
                )}
                onClick={() => onModeChange?.("buy")}
              >
                <span className="relative z-[1]">Buy</span>
                {mode === "buy" && (
                  <span className="absolute inset-0 size-full rounded-md bg-background" />
                )}
              </button>
              <button
                type="button"
                className={cn(
                  "relative flex items-center rounded-md py-1 outline-hidden",
                  "transition-[scale,colors] duration-200 ease-out active:scale-[0.97]",
                  "text-sm px-3 h-7",
                  mode === "sell"
                    ? "font-medium text-foreground"
                    : "text-os-gray-300 hover:text-foreground"
                )}
                onClick={() => onModeChange?.("sell")}
              >
                <span className="relative z-[1]">Sell</span>
                {mode === "sell" && (
                  <span className="absolute inset-0 size-full rounded-md bg-background" />
                )}
              </button>
            </div>

            {/* Slider - controls NFT selection */}
            <div className="hidden md:flex items-center p-3 w-[140px]">
              <Slider
                value={[sliderValue]}
                onValueChange={handleSliderChange}
                max={maxItems}
                step={1}
                className="w-full"
              />
            </div>

            {/* Item Count Input */}
            <div
              className={cn(
                "inline-flex items-center whitespace-nowrap rounded-md",
                "bg-background hover:bg-muted border border-border",
                "h-8 gap-1 text-sm px-2 font-mono w-[105px] shrink-0"
              )}
            >
              <button
                className="inline-flex items-center text-foreground hover:text-os-gray-300 disabled:opacity-40"
                disabled={itemCount === 0}
                onClick={decrementCount}
                type="button"
              >
                <Minus className="size-4" />
              </button>
              <input
                type="number"
                value={itemCount}
                onChange={e =>
                  onItemCountChange(Math.min(maxItems, Math.max(0, Number(e.target.value) || 0)))
                }
                min={0}
                max={maxItems}
                className="text-sm w-full border-0 bg-transparent outline-hidden text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button
                className="inline-flex items-center text-foreground hover:text-os-gray-300 disabled:opacity-40"
                disabled={itemCount >= maxItems}
                onClick={incrementCount}
                type="button"
              >
                <Plus className="size-4" />
              </button>
            </div>

            {/* Selected count display */}
            <span className="text-sm text-muted-foreground">{itemCount} selected</span>
            <div className="shrink-0 bg-border w-px h-6" />
          </div>

          {/* Right: actions + cart */}
          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3"
              onClick={onMakeOffer}
              disabled={itemCount === 0}
            >
              Make collection offer
            </Button>
            <Button
              size="sm"
              className="h-8 px-3 bg-[#2081E2] hover:bg-[#1868B7] text-white"
              onClick={onBuyFloor}
              disabled={itemCount === 0}
            >
              {mode === "buy" ? "Buy floor" : "List selected"}
            </Button>
            {itemCount > 0 && (
              <>
                <div className="shrink-0 bg-border w-px h-6" />
                <ResponsivePopoverDrawer
                  open={cartOpen}
                  onOpenChange={setCartOpen}
                  title={`Cart (${itemCount})`}
                  closeOnInteractOutside={false}
                  renderTrigger={p => (
                    <button
                      {...p}
                      type="button"
                      className="flex items-center gap-1.5 text-os-gray-300 hover:text-foreground transition-all duration-150 relative whitespace-nowrap shrink-0 h-8 px-3 rounded-md border border-border bg-card hover:border-border hover:bg-muted/50 shadow-sm"
                    >
                      <div className="relative">
                        <ShoppingCart className="w-4 h-4" />
                        <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-medium">
                          {itemCount}
                        </span>
                      </div>
                      <span className="text-xs sm:text-sm">Cart</span>
                    </button>
                  )}
                >
                  <MarketplaceSelectionCart
                    onPrimaryAction={onBuyFloor}
                    primaryLabel={mode === "buy" ? "Buy floor" : "List selected"}
                  />
                </ResponsivePopoverDrawer>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
