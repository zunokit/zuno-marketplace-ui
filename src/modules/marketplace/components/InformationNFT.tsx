"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { ChevronDown, Star, Flag, Share2, X, Globe } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { Collection } from "@/shared/utils/mock/collection";
import { randomImage } from "@/shared/utils/mock/randomImage";

interface InformationNFTProps {
  collection?: Collection;
}

export default function InformationNFT({ collection }: InformationNFTProps) {
  const [showInfo, setShowInfo] = useState(true);

  return (
    <div className="border-b text-white">
      {/* Mobile Header */}
      <div className="md:hidden p-2 border-b border-border">
        <div className="flex gap-2">
          {/* Left Column: Avatar */}
          <div className="w-8 h-8 rounded-full overflow-hidden bg-muted shrink-0">
            <Image
              src={collection?.image || randomImage()}
              alt={collection?.name || "Collection"}
              width={32}
              height={32}
              className="object-cover"
            />
          </div>

          {/* Right Column: Title and Buttons */}
          <div className="flex flex-col gap-1 min-w-0 overflow-hidden">
            {/* Top Row: Title and Badges */}
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-semibold truncate">{collection?.name || "Collection"}</h1>
              <div className="w-3 h-3 rounded-full bg-primary flex items-center justify-center shrink-0">
                <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <Star className="w-3 h-3 text-muted-foreground shrink-0" />
              <div className="w-3 h-3 bg-warning rounded flex items-center justify-center text-xs shrink-0">
                👑
              </div>
            </div>

            {/* Bottom Row: Buttons */}
            <div className="flex items-center gap-1 justify-between w-full flex-wrap md:flex-nowrap">
              <div className="flex items-center gap-1">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowInfo(!showInfo)}
                  className="bg-muted hover:bg-hover text-white h-5 px-1 md:px-1.5 text-xs flex-shrink-0"
                >
                  <span className="hidden md:inline">Info</span>
                  <span className="md:hidden">i</span>
                  <ChevronDown className={`w-2.5 h-2.5 ml-0.5 md:ml-1 transition-transform ${showInfo ? "rotate-180" : ""}`} />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-muted hover:bg-hover text-white h-5 px-1 md:px-1.5 text-xs flex-shrink-0"
                  onClick={() => {
                    const url = window.location.href;
                    navigator.clipboard.writeText(url);
                    toast.success("Link copied to clipboard!");
                  }}
                >
                  <span className="hidden md:inline">Share</span>
                  <Share2 className="w-2.5 h-2.5 md:ml-1" />
                </Button>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-5 w-5 text-muted-foreground hover:text-foreground flex-shrink-0">
                  <X className="w-2.5 h-2.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-5 w-5 text-muted-foreground hover:text-foreground flex-shrink-0">
                  <Globe className="w-2.5 h-2.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Info Section */}
      {showInfo && (
        <div className="md:hidden p-3 border-t border-border">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <div className="text-muted-foreground text-xs mb-0.5">Floor Price</div>
              <div className="font-semibold text-xs sm:text-sm">
                4.708 <span className="text-muted-foreground">SOL</span>
              </div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs mb-0.5">24h Vol</div>
              <div className="font-semibold text-xs sm:text-sm">
                137.635 <span className="text-muted-foreground">SOL</span>
              </div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs mb-0.5">Owners</div>
              <div className="font-semibold text-xs sm:text-sm">
                327 <span className="text-muted-foreground">32.7%</span>
              </div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs mb-0.5">Market Cap</div>
              <div className="font-semibold text-xs sm:text-sm">$867.1K</div>
            </div>
          </div>

          {/* Royalties */}
          <div className="flex items-center gap-1.5 text-xs sm:text-sm mb-3">
            <div className="w-4 h-4 bg-warning rounded flex items-center justify-center text-xs">👑</div>
            <span className="font-semibold">Royalties: 5%</span>
          </div>

          {/* Description */}
          <p className="text-muted-foreground text-xs sm:text-sm mb-3">
            {collection?.description || "Make Gamba Great Again - we're going to win so much, you'll be tired of winning."}
          </p>

          {/* Actions */}
          <Button variant="outline" className="border-border hover:bg-muted bg-transparent w-full h-7 text-xs">
            <Star className="w-3 h-3 mr-1.5" />
            Add to Watchlist
          </Button>
        </div>
      )}

      {/* Desktop Layout */}
      <div className="hidden md:block mb-2">
        <div className="px-6 lg:px-8 xl:px-12 py-4 grid grid-cols-[auto_1fr] gap-4 items-start">
          {/* Left Section: Avatar, Title, and Buttons */}
          <div className="flex flex-col gap-3">
            {/* Avatar and Title Row */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-muted shrink-0">
                <Image
                  src={collection?.image || randomImage()}
                  alt={collection?.name || "Collection"}
                  width={48}
                  height={48}
                  className="object-cover"
                />
              </div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold whitespace-nowrap">{collection?.name || "Collection"}</h1>
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <Star className="w-5 h-5 text-muted-foreground shrink-0" />
                <div className="w-5 h-5 bg-warning rounded flex items-center justify-center text-sm shrink-0">
                  👑
                </div>
              </div>
            </div>

            {/* Buttons Row */}
            <div className="flex gap-2 pl-[60px]">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowInfo(!showInfo)}
                className="bg-muted hover:bg-hover text-white h-8 px-3"
              >
                Info
                <ChevronDown className={`w-3 h-3 ml-1 transition-transform ${showInfo ? "rotate-180" : ""}`} />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="bg-muted hover:bg-hover text-white h-8 px-3"
                onClick={() => {
                  const url = window.location.href;
                  navigator.clipboard.writeText(url);
                  toast.success("Link copied to clipboard!");
                }}
              >
                Share Stats
                <Share2 className="w-3 h-3 ml-1" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                <Globe className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Middle Section: Stats displayed horizontally */}
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <div className="flex-shrink-0">
              <div className="text-muted-foreground text-xs mb-0.5">Floor Price</div>
              <div className="font-semibold">
                4.708 <span className="text-muted-foreground">SOL</span>{" "}
                <span className="text-destructive">-4.56%</span>
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="text-muted-foreground text-xs mb-0.5">Top Offer</div>
              <div className="font-semibold">
                3.807 <span className="text-muted-foreground">SOL</span>
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="text-muted-foreground text-xs mb-0.5">24h Vol</div>
              <div className="font-semibold">
                137.635 <span className="text-muted-foreground">SOL</span>
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="text-muted-foreground text-xs mb-0.5">24h Sales</div>
              <div className="font-semibold">37</div>
            </div>
            <div className="flex-shrink-0">
              <div className="text-muted-foreground text-xs mb-0.5">All Vol</div>
              <div className="font-semibold">
                557.763 <span className="text-muted-foreground">SOL</span>
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="text-muted-foreground text-xs mb-0.5">Market Cap</div>
              <div className="font-semibold">$867.1K</div>
            </div>
            <div className="flex-shrink-0">
              <div className="text-muted-foreground text-xs mb-0.5">Listed / Supply</div>
              <div className="font-semibold">
                38 / 1,000 <span className="text-muted-foreground">3.8%</span>
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="text-muted-foreground text-xs mb-0.5">Owners</div>
              <div className="font-semibold">
                327 <span className="text-muted-foreground">32.7%</span>
              </div>
            </div>
          </div>
        </div>

        {showInfo && (
          <div className="mt-4 border-t border-border pt-4 relative mx-6 lg:mx-8 xl:mx-12">
            {/* Flag Collection Button */}
            <div className="absolute top-4 right-6 lg:right-8 xl:right-12">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground h-8 px-2">
                <Flag className="w-3 h-3 mr-1" />
                <span className="text-xs">Flag Collection</span>
              </Button>
            </div>

            {/* Royalties Section */}
            <div className="flex items-center gap-2 text-sm">
              <div className="w-5 h-5 bg-warning rounded flex items-center justify-center text-xs">👑</div>
              <span className="font-semibold">Royalties: 5%</span>
            </div>

            {/* Description */}
            <p className="mt-3 text-muted-foreground">
              {collection?.description || "Make Gamba Great Again - we're going to win so much, you'll be tired of winning."}
            </p>

            {/* Actions */}
            <div className="mt-4">
              <Button variant="outline" className="border-border hover:bg-muted bg-transparent">
                <Star className="w-4 h-4 mr-2" />
                Add to Watchlist
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
