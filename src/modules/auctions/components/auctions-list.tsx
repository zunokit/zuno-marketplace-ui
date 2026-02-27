"use client";

import { useState, useMemo } from "react";
import { AuctionCard } from "@/modules/auctions/components/auction-card";
import { AuctionsFilter } from "@/modules/auctions/components/auctions-filter";
import { type Auction, type AuctionFilter } from "@/shared/types/auction";
import { mockAuctions } from "@/shared/utils/mock/auction";
import { cn } from "@/shared/utils/tailwind-utils";

interface AuctionsListProps {
  initialAuctions?: Auction[];
}

export function AuctionsList({ initialAuctions = mockAuctions }: AuctionsListProps) {
  const [filter, setFilter] = useState<AuctionFilter>({
    status: "active",
    sortBy: "ending_soon",
  });

  const filteredAndSortedAuctions = useMemo(() => {
    let filtered = [...initialAuctions];
    if (filter.status) filtered = filtered.filter(a => a.status === filter.status);
    if (filter.priceRange) {
      filtered = filtered.filter(a => {
        const bid = parseFloat(a.currentBid);
        return bid >= filter.priceRange![0] && bid <= filter.priceRange![1];
      });
    }

    switch (filter.sortBy) {
      case "ending_soon":
        filtered.sort((a, b) => {
          if (a.status !== "active" && b.status !== "active") return 0;
          if (a.status !== "active") return 1;
          if (b.status !== "active") return -1;
          return a.endTime.getTime() - b.endTime.getTime();
        });
        break;
      case "newly_listed":
        filtered.sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
        break;
      case "highest_bid":
        filtered.sort((a, b) => parseFloat(b.currentBid) - parseFloat(a.currentBid));
        break;
      case "most_bids":
        filtered.sort((a, b) => b.bids.length - a.bids.length);
        break;
    }
    return filtered;
  }, [initialAuctions, filter]);

  const handleFilterChange = (newFilter: AuctionFilter) => setFilter(newFilter);
  const handleBidClick = (auction: Auction) => console.log("Place bid on:", auction);

  const activeCount = initialAuctions.filter(a => a.status === "active").length;
  const upcomingCount = initialAuctions.filter(a => a.status === "upcoming").length;
  const endedCount = initialAuctions.filter(a => a.status === "ended").length;

  const tabs = [
    { value: "active", label: "Active", count: activeCount },
    { value: "upcoming", label: "Upcoming", count: upcomingCount },
    { value: "ended", label: "Ended", count: endedCount },
  ] as const;

  return (
    <div className="space-y-5">
      <AuctionsFilter filter={filter} onFilterChange={handleFilterChange} />

      <div className="flex items-center gap-0 border-b border-border/50 overflow-x-auto scrollbar-hide">
        {tabs.map(tab => (
          <button
            key={tab.value}
            onClick={() => handleFilterChange({ ...filter, status: tab.value as AuctionFilter["status"] })}
            className={cn(
              "px-4 pb-2.5 pt-1 text-sm font-medium transition-colors whitespace-nowrap",
              filter.status === tab.value ? "text-foreground shadow-[inset_0_-2px_0_0_#ec4899]" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
            <span className="ml-1.5 text-xs text-muted-foreground">({tab.count})</span>
          </button>
        ))}
      </div>

      {filteredAndSortedAuctions.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-sm">No auctions found in this category</p>
        </div>
      ) : (
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filteredAndSortedAuctions.map(auction => (
            <AuctionCard key={auction.id} auction={auction} onBidClick={handleBidClick} />
          ))}
        </div>
      )}
    </div>
  );
}
