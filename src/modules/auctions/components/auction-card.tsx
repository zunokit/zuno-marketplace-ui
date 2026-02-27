"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Clock, Gavel } from "lucide-react";
import Image from "next/image";
import { type Auction } from "@/shared/types/auction";
import { cn } from "@/shared/utils/tailwind-utils";

interface AuctionCardProps {
  auction: Auction;
  onBidClick?: (auction: Auction) => void;
  className?: string;
}

export function AuctionCard({ auction, onBidClick, className }: AuctionCardProps) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calc = () => {
      const diff = (auction.status === "upcoming" ? auction.startTime : auction.endTime).getTime() - Date.now();
      if (diff <= 0) { setTimeLeft(auction.status === "upcoming" ? "Soon" : "Ended"); return; }
      const h = Math.floor(diff / 3.6e6), m = Math.floor((diff % 3.6e6) / 6e4), s = Math.floor((diff % 6e4) / 1e3);
      setTimeLeft(h > 24 ? `${Math.floor(h / 24)}d ${h % 24}h` : h > 0 ? `${h}h ${m}m ${s}s` : `${m}m ${s}s`);
    };
    calc();
    const iv = setInterval(calc, 1000);
    return () => clearInterval(iv);
  }, [auction]);

  const urgent = auction.status === "active" && auction.endTime.getTime() - Date.now() < 3.6e6;

  return (
    <div
      className={cn(
        "group cursor-pointer rounded-lg overflow-hidden transition-all duration-200",
        "bg-card border border-border/20 hover:border-border/40 hover:shadow-lg hover:shadow-black/10 dark:hover:shadow-black/30",
        className
      )}
      onClick={() => (window.location.href = `/auctions/${auction.id}`)}
    >
      <div className="relative aspect-square overflow-hidden bg-muted/10">
        <Image src={auction.image} alt={auction.name} fill
          className="object-cover transition-transform duration-300 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
          <Badge variant="secondary" className="bg-black/70 text-white backdrop-blur-md border-0 text-[9px] gap-1 uppercase tracking-wider font-semibold px-1.5 py-0.5">
            <span className={cn("w-1.5 h-1.5 rounded-full",
              auction.status === "active" ? "bg-green-400" : auction.status === "upcoming" ? "bg-blue-400" : "bg-gray-400"
            )} />
            {auction.status}
          </Badge>
          {auction.status !== "ended" && timeLeft && timeLeft !== "Ended" && (
            <Badge variant="secondary" className={cn(
              "backdrop-blur-md border-0 text-[9px] gap-0.5 font-mono font-semibold px-1.5 py-0.5",
              urgent ? "bg-red-500/80 text-white" : "bg-black/70 text-white"
            )}>
              <Clock className="h-2.5 w-2.5" /> {timeLeft}
            </Badge>
          )}
        </div>
      </div>

      <div className="p-3">
        <h3 className="font-semibold text-[13px] truncate leading-tight">{auction.name}</h3>
        <div className="flex items-center gap-1.5 mt-1.5">
          <Avatar className="h-4 w-4">
            <AvatarImage src={auction.seller.avatar} />
            <AvatarFallback className="text-[8px]">{auction.seller.name?.[0] || "?"}</AvatarFallback>
          </Avatar>
          <span className="text-[11px] text-muted-foreground/60 truncate">
            {auction.seller.name || auction.seller.address.slice(0, 8)}
          </span>
        </div>

        <div className="flex items-end justify-between mt-3 pt-2.5 border-t border-border/15">
          <div>
            <p className="text-[9px] text-muted-foreground/50 uppercase tracking-wider font-medium">
              {auction.bids.length > 0 ? "Current Bid" : "Start"}
            </p>
            <p className="font-bold text-[15px] leading-tight mt-0.5">{auction.currentBid} ETH</p>
          </div>
          <div className="text-right">
            <p className="text-[9px] text-muted-foreground/50 uppercase tracking-wider font-medium">Bids</p>
            <p className="font-semibold text-[15px] leading-tight mt-0.5">{auction.bids.length}</p>
          </div>
        </div>

        {auction.status === "active" && (
          <Button className="w-full mt-3 h-9 text-[12px] font-semibold bg-pink-600 hover:bg-pink-700 text-white rounded-md"
            onClick={e => { e.stopPropagation(); onBidClick?.(auction); }}>
            <Gavel className="h-3 w-3 mr-1" /> Place Bid
          </Button>
        )}
        {auction.status === "upcoming" && (
          <Button className="w-full mt-3 h-9 text-[12px] rounded-md" variant="secondary" disabled>Starting Soon</Button>
        )}
        {auction.status === "ended" && (
          <Button className="w-full mt-3 h-9 text-[12px] rounded-md" variant="outline" disabled>Ended</Button>
        )}
      </div>
    </div>
  );
}
