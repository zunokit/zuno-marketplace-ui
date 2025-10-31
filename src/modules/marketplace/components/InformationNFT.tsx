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
    <div className="border-b bg-[#0a0a0a] text-white">
      {/* Mobile Header */}
      <div className="md:hidden p-3 border-b border-zinc-800">
        <div className="grid grid-cols-[auto_1fr] gap-2">
          {/* Left Column: Avatar */}
          <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-800">
            <Image
              src={collection?.image || randomImage()}
              alt={collection?.name || "Collection"}
              width={40}
              height={40}
              className="object-cover"
            />
          </div>

          {/* Right Column: Title and Buttons */}
          <div className="flex flex-col gap-1.5">
            {/* Top Row: Title and Badges */}
            <div className="flex items-center gap-2">
              <h1 className="text-base font-semibold">{collection?.name || "Collection"}</h1>
              <div className="w-3.5 h-3.5 rounded-full bg-pink-500 flex items-center justify-center shrink-0">
                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <Star className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <div className="w-3.5 h-3.5 bg-yellow-500 rounded flex items-center justify-center text-xs shrink-0">
                👑
              </div>
            </div>

            {/* Bottom Row: Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowInfo(!showInfo)}
                className="bg-zinc-800 hover:bg-zinc-700 text-white h-6 px-2 text-xs"
              >
                Info
                <ChevronDown className={`w-3 h-3 ml-1 transition-transform ${showInfo ? "rotate-180" : ""}`} />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="bg-zinc-800 hover:bg-zinc-700 text-white h-6 px-2 text-xs"
                onClick={() => {
                  const url = window.location.href;
                  navigator.clipboard.writeText(url);
                  toast.success("Link copied to clipboard!");
                }}
              >
                Share Stats
                <Share2 className="w-3 h-3 ml-1" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-400 hover:text-white">
                <X className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-400 hover:text-white">
                <Globe className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Info Section */}
      {showInfo && (
        <div className="md:hidden p-3 border-t border-zinc-800">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-2.5 mb-3">
            <div>
              <div className="text-zinc-500 text-xs mb-0.5">Floor Price</div>
              <div className="font-semibold text-sm">
                4.708 <span className="text-zinc-400">SOL</span>
              </div>
            </div>
            <div>
              <div className="text-zinc-500 text-xs mb-0.5">24h Vol</div>
              <div className="font-semibold text-sm">
                137.635 <span className="text-zinc-400">SOL</span>
              </div>
            </div>
            <div>
              <div className="text-zinc-500 text-xs mb-0.5">Owners</div>
              <div className="font-semibold text-sm">
                327 <span className="text-zinc-400">32.7%</span>
              </div>
            </div>
            <div>
              <div className="text-zinc-500 text-xs mb-0.5">Market Cap</div>
              <div className="font-semibold text-sm">$867.1K</div>
            </div>
          </div>

          {/* Royalties */}
          <div className="flex items-center gap-2 text-sm mb-3">
            <div className="w-5 h-5 bg-yellow-500 rounded flex items-center justify-center text-xs">👑</div>
            <span className="font-semibold">Royalties: 5%</span>
          </div>

          {/* Description */}
          <p className="text-zinc-400 text-sm mb-3">
            {collection?.description || "Make Gamba Great Again - we're going to win so much, you'll be tired of winning."}
          </p>

          {/* Actions */}
          <Button variant="outline" className="border-zinc-700 hover:bg-zinc-800 bg-transparent w-full">
            <Star className="w-4 h-4 mr-2" />
            Add to Watchlist
          </Button>
        </div>
      )}

      {/* Desktop Layout */}
      <div className="hidden md:block">
        <div className="px-6 py-4 grid grid-cols-[auto_1fr] gap-4 items-start">
          {/* Left Section: Avatar, Title, and Buttons */}
          <div className="flex flex-col gap-3">
            {/* Avatar and Title Row */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-zinc-800 shrink-0">
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
                <div className="w-5 h-5 rounded-full bg-pink-500 flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <Star className="w-5 h-5 text-zinc-400 shrink-0" />
                <div className="w-5 h-5 bg-yellow-500 rounded flex items-center justify-center text-sm shrink-0">
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
                className="bg-zinc-800 hover:bg-zinc-700 text-white h-8 px-3"
              >
                Info
                <ChevronDown className={`w-3 h-3 ml-1 transition-transform ${showInfo ? "rotate-180" : ""}`} />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="bg-zinc-800 hover:bg-zinc-700 text-white h-8 px-3"
                onClick={() => {
                  const url = window.location.href;
                  navigator.clipboard.writeText(url);
                  toast.success("Link copied to clipboard!");
                }}
              >
                Share Stats
                <Share2 className="w-3 h-3 ml-1" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white">
                <Globe className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Middle Section: Stats displayed horizontally */}
          <div className="flex items-center gap-3 text-sm overflow-x-auto">
            <div className="shrink-0">
              <div className="text-zinc-500 text-xs mb-0.5">Floor Price</div>
              <div className="font-semibold whitespace-nowrap">
                4.708 <span className="text-zinc-400">SOL</span>{" "}
                <span className="text-red-500">-4.56%</span>
              </div>
            </div>
            <div className="shrink-0">
              <div className="text-zinc-500 text-xs mb-0.5">Top Offer</div>
              <div className="font-semibold whitespace-nowrap">
                3.807 <span className="text-zinc-400">SOL</span>
              </div>
            </div>
            <div className="shrink-0">
              <div className="text-zinc-500 text-xs mb-0.5">24h Vol</div>
              <div className="font-semibold whitespace-nowrap">
                137.635 <span className="text-zinc-400">SOL</span>
              </div>
            </div>
            <div className="shrink-0">
              <div className="text-zinc-500 text-xs mb-0.5">24h Sales</div>
              <div className="font-semibold">37</div>
            </div>
            <div className="shrink-0">
              <div className="text-zinc-500 text-xs mb-0.5">All Vol</div>
              <div className="font-semibold whitespace-nowrap">
                557.763 <span className="text-zinc-400">SOL</span>
              </div>
            </div>
            <div className="shrink-0">
              <div className="text-zinc-500 text-xs mb-0.5">Market Cap</div>
              <div className="font-semibold whitespace-nowrap">$867.1K</div>
            </div>
            <div className="shrink-0">
              <div className="text-zinc-500 text-xs mb-0.5">Listed / Supply</div>
              <div className="font-semibold whitespace-nowrap">
                38 / 1,000 <span className="text-zinc-400">3.8%</span>
              </div>
            </div>
            <div className="shrink-0">
              <div className="text-zinc-500 text-xs mb-0.5">Owners</div>
              <div className="font-semibold whitespace-nowrap">
                327 <span className="text-zinc-400">32.7%</span>
              </div>
            </div>
          </div>
        </div>

        {showInfo && (
          <div className="mt-4 border-t border-zinc-800 pt-4 relative">
            {/* Flag Collection Button */}
            <div className="absolute top-4 right-0">
              <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white h-8 px-2">
                <Flag className="w-3 h-3 mr-1" />
                <span className="text-xs">Flag Collection</span>
              </Button>
            </div>

            {/* Royalties Section */}
            <div className="flex items-center gap-2 text-sm">
              <div className="w-5 h-5 bg-yellow-500 rounded flex items-center justify-center text-xs">👑</div>
              <span className="font-semibold">Royalties: 5%</span>
            </div>

            {/* Description */}
            <p className="mt-3 text-zinc-400">
              {collection?.description || "Make Gamba Great Again - we're going to win so much, you'll be tired of winning."}
            </p>

            {/* Actions */}
            <div className="mt-4">
              <Button variant="outline" className="border-zinc-700 hover:bg-zinc-800 bg-transparent">
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
