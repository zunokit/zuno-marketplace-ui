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

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) setTimeLeft(`${days}d ${hours}h`);
      else if (hours > 0) setTimeLeft(`${hours}h ${minutes}m`);
      else setTimeLeft(`${minutes}m`);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 60000);
    return () => clearInterval(interval);
  }, [auction]);

  const getStatusColor = () => {
    switch (auction.status) {
      case "active":
        return "bg-green-500";
      case "upcoming":
        return "bg-blue-500";
      case "ended":
        return "bg-muted-foreground";
      default:
        return "bg-muted-foreground";
    }
  };

  const isUrgent =
    auction.status === "active" &&
    auction.endTime.getTime() - Date.now() < 60 * 60 * 1000;

  const handleCardClick = () => {
    window.location.href = `/auctions/${auction.id}`;
  };

  const handleBidClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBidClick?.(auction);
  };

  return (
    <div
      className={cn(
        "group cursor-pointer rounded-xl border border-border bg-card overflow-hidden transition-all duration-200 hover:border-border/80 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20",
        className
      )}
      onClick={handleCardClick}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={auction.image}
          alt={auction.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Status overlay */}
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
          <Badge
            variant="secondary"
            className="bg-black/60 text-white backdrop-blur-md border-0 text-xs gap-1.5"
          >
            <span className={cn("w-1.5 h-1.5 rounded-full", getStatusColor())} />
            {auction.status}
          </Badge>

          {auction.status !== "ended" && timeLeft && timeLeft !== "Ended" && (
            <Badge
              variant="secondary"
              className={cn(
                "backdrop-blur-md border-0 text-xs gap-1",
                isUrgent
                  ? "bg-red-500/80 text-white"
                  : "bg-black/60 text-white"
              )}
            >
              <Clock className="h-3 w-3" />
              {timeLeft}
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-3.5">
        <h3 className="font-semibold text-sm truncate">{auction.name}</h3>

        <div className="flex items-center gap-2 mt-2">
          <Avatar className="h-5 w-5">
            <AvatarImage src={auction.seller.avatar} alt={auction.seller.name} />
            <AvatarFallback className="text-[10px]">
              {auction.seller.name?.[0] || "?"}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground truncate">
            {auction.seller.name || auction.seller.address.slice(0, 8)}
          </span>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
              {auction.bids.length > 0 ? "Current Bid" : "Starting Price"}
            </p>
            <p className="font-semibold text-sm mt-0.5">
              {auction.currentBid} {auction.currency}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Bids</p>
            <p className="font-medium text-sm mt-0.5">{auction.bids.length}</p>
          </div>
        </div>

        {/* Action button */}
        {auction.status === "active" && (
          <Button
            className="w-full mt-3 h-9 text-sm"
            onClick={handleBidClick}
          >
            <Gavel className="h-3.5 w-3.5 mr-1.5" />
            Place Bid
          </Button>
        )}
        {auction.status === "upcoming" && (
          <Button className="w-full mt-3 h-9 text-sm" variant="secondary" disabled>
            Starting Soon
          </Button>
        )}
        {auction.status === "ended" && (
          <Button className="w-full mt-3 h-9 text-sm" variant="outline" disabled>
            Auction Ended
          </Button>
        )}
      </div>
    </div>
  );
}
