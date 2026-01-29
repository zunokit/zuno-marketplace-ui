"use client";

import { Clock, Eye } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import Image from "next/image";
import { useState, useEffect } from "react";

interface Auction {
  id: string;
  name: string;
  image: string;
  collection: string;
  currentBid: string;
  startingPrice: string;
  currency: string;
  endTime: Date;
  totalBids: number;
  viewers: number;
  seller: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  topBidder: {
    name: string;
    avatar: string;
  };
  reservePrice?: string;
  reserveMet: boolean;
}

interface AuctionCardProps {
  item: Auction;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

function TimeRemaining({ endTime }: { endTime: Date }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = endTime.getTime();
      const distance = end - now;

      if (distance < 0) {
        setTimeLeft("Ended");
        clearInterval(timer);
      } else {
        const hours = Math.floor(distance / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  const getUrgency = () => {
    const now = new Date().getTime();
    const end = endTime.getTime();
    const distance = end - now;
    const oneHour = 60 * 60 * 1000;

    if (distance < oneHour) return "urgent";
    if (distance < oneHour * 3) return "warning";
    return "normal";
  };

  const urgency = getUrgency();

  const getBadgeStyles = () => {
    if (urgency === "urgent") {
      return "bg-red-500/90 text-foreground border-red-400/20 shadow-os-focus shadow-red-500/30";
    }
    if (urgency === "warning") {
      return "bg-orange-500/90 text-foreground border-orange-400/20 shadow-os-focus shadow-orange-500/30";
    }
    return "bg-black/60 text-foreground border-white/10 shadow-os-focus";
  };

  return (
    <Badge className={`flex items-center gap-1.5 font-bold backdrop-blur-xl ${getBadgeStyles()}`}>
      <Clock className="h-3 w-3" />
      <span className="tracking-tight text-xs">{timeLeft}</span>
    </Badge>
  );
}

export function AuctionCard({
  item: auction,
  isHovered,
  onMouseEnter,
  onMouseLeave,
}: AuctionCardProps) {
  return (
    <div
      className="relative group cursor-pointer h-full min-w-0"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Card className="overflow-hidden border border-border-subtle dark:border-border-subtle bg-background dark:bg-card text-foreground dark:text-foreground text-sm h-full p-0 min-w-0">
        <div className="flex flex-col h-full min-w-0">
          <div className="relative aspect-[4/3] w-full overflow-hidden">
            <Image
              src={auction.image}
              alt={auction.name}
              fill
              className={`object-cover transition-transform duration-500 ${
                isHovered ? "scale-110" : "scale-100"
              }`}
            />

            <div className="absolute top-2 left-2 right-2 flex items-start justify-between gap-2">
              <TimeRemaining endTime={auction.endTime} />
              <Badge
                variant="secondary"
                className="backdrop-blur-xl bg-black/60 border-white/10 text-foreground font-medium font-sans shadow-os-focus"
              >
                <Eye className="h-3 w-3 mr-1" />
                {auction.viewers}
              </Badge>
            </div>

            <div
              className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-2 h-16 flex items-end transform transition-transform duration-300 ${
                isHovered ? "translate-y-0" : "translate-y-full"
              }`}
            >
              <div className="flex items-center justify-between w-full gap-2">
                <Badge className="bg-red-500 text-foreground border-0 shadow-os-focus font-bold px-2 py-1 shrink-0">
                  <span className="relative flex h-1.5 w-1.5 mr-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-card opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-card" />
                  </span>
                  LIVE
                </Badge>
                <Button
                  className="flex-1 text-xs cursor-pointer bg-background/90 hover:bg-background text-foreground dark:bg-background/90 dark:hover:bg-background dark:text-foreground"
                  variant="secondary"
                  size="sm"
                  type="button"
                >
                  Place Bid
                </Button>
              </div>
            </div>
          </div>

          <CardContent className="p-3 flex flex-col h-[120px] justify-between min-w-0 overflow-hidden">
            <h3 className="font-medium font-sans truncate text-base text-foreground dark:text-foreground mb-2 min-w-0 shrink-0 w-full">
              {auction.name}
            </h3>

            <div className="grid grid-cols-[repeat(3,minmax(0,1fr))] gap-1 mb-auto min-w-0 shrink-0 overflow-hidden">
              <div className="min-w-0 overflow-hidden">
                <p className="text-[10px] uppercase font-medium text-os-gray-300 dark:text-os-gray-300 truncate">
                  CURRENT BID
                </p>
                <p className="font-medium text-sm text-foreground dark:text-foreground truncate">
                  {auction.currentBid} {auction.currency}
                </p>
              </div>
              <div className="min-w-0 overflow-hidden">
                <p className="text-[10px] uppercase font-medium text-os-gray-300 dark:text-os-gray-300 truncate">
                  BIDS
                </p>
                <p className="font-medium text-sm text-foreground dark:text-foreground truncate">
                  {auction.totalBids}
                </p>
              </div>
              <div className="min-w-0 overflow-hidden">
                <p className="text-[10px] uppercase font-medium text-os-gray-300 dark:text-os-gray-300 truncate">
                  RESERVE
                </p>
                <p className="font-medium text-sm text-foreground dark:text-foreground truncate">
                  {auction.reservePrice
                    ? auction.reserveMet
                      ? "Met"
                      : `${auction.reservePrice}`
                    : "—"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 mt-2 pt-1.5 border-t border-border-subtle dark:border-border-subtle min-w-0 shrink-0 overflow-hidden">
              <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
              <span className="text-xs text-foreground dark:text-foreground truncate min-w-0">
                {auction.collection}
              </span>
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}
