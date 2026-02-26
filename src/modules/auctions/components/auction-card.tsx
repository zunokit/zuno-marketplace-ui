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
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const target = auction.status === "upcoming" ? auction.startTime : auction.endTime;
      const diff = target.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft(auction.status === "upcoming" ? "Starting soon" : "Ended");
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      if (hours > 24) setTimeLeft(`${Math.floor(hours / 24)}d ${hours % 24}h`);
      else if (hours > 0) setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      else setTimeLeft(`${minutes}m ${seconds}s`);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [auction]);

  const isUrgent = auction.status === "active" && auction.endTime.getTime() - Date.now() < 60 * 60 * 1000;

  const handleCardClick = () => { window.location.href = `/auctions/${auction.id}`; };
  const handleBidClick = (e: React.MouseEvent) => { e.stopPropagation(); onBidClick?.(auction); };

  return (
    <div
      className={cn(
        "group cursor-pointer rounded-xl overflow-hidden transition-all duration-200 bg-card border border-border/50 hover:border-border hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20",
        className
      )}
      onClick={handleCardClick}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Image
          src={auction.image}
          alt={auction.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
          <Badge variant="secondary" className="bg-black/60 text-white backdrop-blur-md border-0 text-[10px] gap-1.5 uppercase tracking-wider font-medium">
            <span className={cn("w-1.5 h-1.5 rounded-full",
              auction.status === "active" ? "bg-green-400" : auction.status === "upcoming" ? "bg-blue-400" : "bg-gray-400"
            )} />
            {auction.status}
          </Badge>

          {auction.status !== "ended" && timeLeft && timeLeft !== "Ended" && (
            <Badge variant="secondary" className={cn(
              "backdrop-blur-md border-0 text-[10px] gap-1 font-mono font-medium",
              isUrgent ? "bg-red-500/80 text-white" : "bg-black/60 text-white"
            )}>
              <Clock className="h-3 w-3" />
              {timeLeft}
            </Badge>
          )}
        </div>

        {auction.description && (
          <div className="absolute bottom-3 left-3">
            <Badge variant="secondary" className="bg-black/60 text-white backdrop-blur-md border-0 text-[10px] max-w-[150px] truncate">
              {auction.description.slice(0, 30)}
            </Badge>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-[15px] truncate">{auction.name}</h3>

        <div className="flex items-center gap-2 mt-2">
          <Avatar className="h-5 w-5">
            <AvatarImage src={auction.seller.avatar} alt={auction.seller.name} />
            <AvatarFallback className="text-[9px]">{auction.seller.name?.[0] || "?"}</AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground truncate">
            {auction.seller.name || auction.seller.address.slice(0, 8)}
          </span>
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/30">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
              {auction.bids.length > 0 ? "Current Bid" : "Starting Price"}
            </p>
            <p className="font-bold text-base mt-0.5">{auction.currentBid} ETH</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Bids</p>
            <p className="font-semibold text-base mt-0.5">{auction.bids.length}</p>
          </div>
        </div>

        {auction.status === "active" && (
          <Button className="w-full mt-4 h-10 text-sm font-semibold bg-pink-600 hover:bg-pink-700 text-white" onClick={handleBidClick}>
            <Gavel className="h-3.5 w-3.5 mr-1.5" />
            Place Bid
          </Button>
        )}
        {auction.status === "upcoming" && (
          <Button className="w-full mt-4 h-10 text-sm" variant="secondary" disabled>Starting Soon</Button>
        )}
        {auction.status === "ended" && (
          <Button className="w-full mt-4 h-10 text-sm" variant="outline" disabled>Auction Ended</Button>
        )}
      </div>
    </div>
  );
}
