"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Heart, Search, Star, Grid3x3, LayoutGrid, List, RefreshCw } from "lucide-react";
import { type NFT, type Collection } from "@/shared/types/marketplace";
import { cn } from "@/shared/utils/tailwind-utils";

interface CollectionDetailContentProps {
  collection: Collection;
  nfts: NFT[];
}

export function CollectionDetailContent({ collection, nfts }: CollectionDetailContentProps) {
  const [viewMode, setViewMode] = useState<"grid" | "compact" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("price_low");
  const [isStarred, setIsStarred] = useState(false);

  const filteredNfts = nfts.filter(nft =>
    searchQuery ? nft.name.toLowerCase().includes(searchQuery.toLowerCase()) : true
  );

  const tabs = [
    { value: "items", label: "Items" },
    { value: "activity", label: "Activity" },
    { value: "analytics", label: "Analytics" },
  ];
  const [activeTab, setActiveTab] = useState("items");

  return (
    <div className="flex flex-col min-h-0">
      {/* Collection Header - ME style: compact with stats inline */}
      <div className="px-2 sm:px-4 lg:px-6 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          {/* Left: Name + actions */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative h-12 w-12 rounded-lg overflow-hidden shrink-0 ring-1 ring-border/30">
              {collection.image ? (
                <Image src={collection.image} alt={collection.name} fill className="object-cover" sizes="48px" />
              ) : (
                <div className="h-full w-full bg-muted" />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold truncate">{collection.name}</h1>
                {collection.verified && (
                  <svg className="h-5 w-5 fill-blue-500 shrink-0" viewBox="0 -960 960 960">
                    <path d="m344-60-76-128-144-32 14-148-98-112 98-112-14-148 144-32 76-128 136 58 136-58 76 128 144 32-14 148 98 112-98 112 14 148-144 32-76 128-136-58-136 58Zm94-278 226-226-56-58-170 170-86-84-56 56 142 142Z" />
                    <path className="fill-white" d="M438-338 L664-564 L608-622 L438-452 L352-538 L296-482 L438-338 Z" />
                  </svg>
                )}
                <button onClick={() => setIsStarred(!isStarred)} className="hover:opacity-70 transition-opacity">
                  <Star className={cn("h-4 w-4", isStarred ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground")} />
                </button>
              </div>
            </div>
          </div>

          {/* Right: Stats - ME style inline */}
          <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide">
            <StatItem label="Floor Price" value={collection.floorPrice || "—"} suffix="ETH" />
            <StatItem label="Total Volume" value={collection.totalVolume ? `${(parseFloat(collection.totalVolume) / 1000).toFixed(1)}K` : "—"} suffix="ETH" />
            <StatItem label="Items" value={collection.itemCount.toLocaleString()} />
            <StatItem label="Owners" value={collection.ownerCount.toLocaleString()} />
          </div>
        </div>
      </div>

      {/* Tabs - ME style */}
      <div className="px-2 sm:px-4 lg:px-6 border-b border-border/20">
        <div className="flex items-center gap-0">
          {tabs.map(tab => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                "px-4 pb-2.5 pt-1 text-[13px] font-medium transition-colors whitespace-nowrap",
                activeTab === tab.value
                  ? "text-foreground shadow-[inset_0_-2px_0_0_#ec4899]"
                  : "text-muted-foreground/60 hover:text-foreground/80"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      {activeTab === "items" && (
        <div className="px-2 sm:px-4 lg:px-6 py-2.5 flex items-center justify-between gap-3 border-b border-border/10">
          <div className="flex items-center gap-2">
            {/* View toggles */}
            <div className="flex items-center gap-0.5 bg-muted/20 rounded p-0.5">
              <button
                onClick={() => setViewMode("grid")}
                className={cn("p-1.5 rounded transition-colors", viewMode === "grid" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground")}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setViewMode("compact")}
                className={cn("p-1.5 rounded transition-colors", viewMode === "compact" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground")}
              >
                <Grid3x3 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn("p-1.5 rounded transition-colors", viewMode === "list" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground")}
              >
                <List className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="relative w-48">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground/50" />
              <Input
                placeholder="Search by item or trait"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-7 h-7 text-[11px] border-border/30 bg-transparent"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[160px] h-7 text-[11px] border-border/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price_low">Price: Low to High</SelectItem>
                <SelectItem value="price_high">Price: High to Low</SelectItem>
                <SelectItem value="recent">Recently Listed</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
              </SelectContent>
            </Select>
            <button className="p-1.5 rounded hover:bg-muted/20 text-muted-foreground transition-colors">
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      {activeTab === "items" && (
        <div className="px-2 sm:px-4 lg:px-6 py-3">
          <p className="text-[11px] text-muted-foreground/50 mb-2">{filteredNfts.length} items</p>

          {filteredNfts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground/60 text-sm">No NFTs found in this collection</p>
            </div>
          ) : (
            <div className={cn(
              "grid gap-2",
              viewMode === "compact"
                ? "grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10"
                : viewMode === "grid"
                  ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
                  : "grid-cols-1"
            )}>
              {filteredNfts.map(nft => (
                <Link
                  key={nft.id}
                  href={`/nft/${nft.id}`}
                  className="group rounded-lg overflow-hidden border border-border/15 hover:border-border/30 bg-card/50 transition-all duration-200 hover:shadow-md"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={nft.image}
                      alt={nft.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes={viewMode === "compact" ? "120px" : "200px"}
                    />
                  </div>
                  <div className={cn("p-2", viewMode === "compact" && "p-1.5")}>
                    <p className={cn("font-medium truncate", viewMode === "compact" ? "text-[10px]" : "text-[12px]")}>
                      {nft.name}
                    </p>
                    <p className={cn("font-bold mt-0.5", viewMode === "compact" ? "text-[10px]" : "text-[12px]")}>
                      {nft.price} ETH
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "activity" && (
        <div className="px-2 sm:px-4 lg:px-6 py-12 text-center">
          <p className="text-muted-foreground/60 text-sm">Activity feed coming soon</p>
        </div>
      )}

      {activeTab === "analytics" && (
        <div className="px-2 sm:px-4 lg:px-6 py-12 text-center">
          <p className="text-muted-foreground/60 text-sm">Analytics coming soon</p>
        </div>
      )}
    </div>
  );
}

function StatItem({ label, value, suffix }: { label: string; value: string | number; suffix?: string }) {
  return (
    <div className="flex flex-col items-end whitespace-nowrap shrink-0">
      <span className="text-[10px] text-muted-foreground/50 uppercase tracking-wider font-medium">{label}</span>
      <span className="text-[13px] font-semibold">
        {value}{suffix && <span className="text-muted-foreground/60 ml-0.5">{suffix}</span>}
      </span>
    </div>
  );
}
