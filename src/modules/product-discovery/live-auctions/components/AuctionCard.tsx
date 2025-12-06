"use client";

import { Clock, Eye, TrendingUp } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Progress } from "@/shared/components/ui/progress";
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
      return "bg-red-500/90 text-white border-red-400/20 shadow-os-focus shadow-red-500/30";
    }
    if (urgency === "warning") {
      return "bg-orange-500/90 text-white border-orange-400/20 shadow-os-focus shadow-orange-500/30";
    }
    return "bg-black/60 text-white border-white/10 shadow-os-focus";
  };

  return (
    <Badge
      className={`flex items-center gap-1.5 font-bold backdrop-blur-xl ${getBadgeStyles()}`}
    >
      <Clock className="h-3 w-3" />
      <span className="tracking-tight text-xs">{timeLeft}</span>
    </Badge>
  );
}

export function AuctionCard({ item: auction, isHovered, onMouseEnter, onMouseLeave }: AuctionCardProps) {
  return (
    <Card
      className="overflow-hidden border-2 border-border-subtle/50 flex flex-col bg-card transition-all duration-300"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Image Section */}
      <CardHeader className="p-0">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={auction.image}
            alt={auction.name}
            fill
            className={`object-cover transition-transform duration-500 ${
              isHovered ? "scale-110" : "scale-100"
            }`}
          />

          {/* Dark Gradient Overlay for better text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
            <TimeRemaining endTime={auction.endTime} />
            <Badge
              variant="secondary"
              className="backdrop-blur-xl bg-black/60 border-white/10 text-white font-medium font-sans shadow-os-focus"
            >
              <Eye className="h-3 w-3 mr-1" />
              {auction.viewers}
            </Badge>
          </div>

          {/* Live Indicator */}
          <div className="absolute bottom-3 left-3">
            <Badge className="bg-red-500 text-white border-0 shadow-os-focus shadow-red-500/50 font-bold px-2.5 py-1">
              <span className="relative flex h-2 w-2 mr-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              LIVE
            </Badge>
          </div>
        </div>
      </CardHeader>

      {/* Content Section */}
      <CardContent className="pt-3 pb-2 px-3 flex-1 flex flex-col">
        {/* Collection & Title */}
        <div className="mb-2">
          <p className="text-[10px] font-medium font-sans text-os-gray-300 uppercase tracking-wide mb-1">
            {auction.collection}
          </p>
          <h3 className="font-bold text-sm leading-tight line-clamp-1 text-white">
            {auction.name}
          </h3>
        </div>

        {/* Seller Info */}
        <div className="flex items-center gap-1.5 mb-3 pb-2 border-b border-border-subtle/30">
          <Avatar className="h-5 w-5 border border-border-subtle/50">
            <AvatarImage src={auction.seller.avatar} />
            <AvatarFallback className="text-[8px] bg-muted">{auction.seller.name[0]}</AvatarFallback>
          </Avatar>
          <span className="text-[10px] text-os-gray-300 truncate flex-1">
            @{auction.seller.name}
          </span>
          {auction.seller.verified && (
            <div className="flex-shrink-0 w-3.5 h-3.5 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary text-[8px] font-bold">✓</span>
            </div>
          )}
        </div>

        {/* Bid Information */}
        <div className="space-y-2 mb-2">
          {/* Current Bid with Growth */}
          <div>
            <div className="flex items-center justify-between mb-0.5">
              <p className="text-[10px] font-medium text-os-gray-300">Current Bid</p>
              <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-emerald-500/10 dark:bg-emerald-500/5 rounded">
                <TrendingUp className="h-2.5 w-2.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                  +{((parseFloat(auction.currentBid) / parseFloat(auction.startingPrice) - 1) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <p className="font-bold text-xl tracking-tight text-white">
                {auction.currentBid}
              </p>
              <span className="text-xs font-medium text-os-gray-300">{auction.currency}</span>
            </div>
          </div>

          {/* Bids & Top Bidder */}
          <div className="flex items-center justify-between py-1.5 px-2 bg-muted/30 rounded-[6px]">
            <div className="flex items-center gap-1.5">
              <Avatar className="h-4 w-4 border border-border-subtle/50">
                <AvatarImage src={auction.topBidder.avatar} />
                <AvatarFallback className="text-[7px] bg-background">{auction.topBidder.name[0]}</AvatarFallback>
              </Avatar>
              <span className="text-[10px] font-medium text-white">@{auction.topBidder.name}</span>
            </div>
            <span className="text-[10px] font-medium font-sans text-os-gray-300">{auction.totalBids} bids</span>
          </div>

          {/* Reserve Price */}
          <div className="h-[28px] flex flex-col justify-center">
            {auction.reservePrice && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-os-gray-300 font-medium">Reserve</span>
                  <span className={`font-bold ${auction.reserveMet ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
                    {auction.reserveMet ? "✓ Met" : `${auction.reservePrice} ${auction.currency}`}
                  </span>
                </div>
                <Progress
                  value={(parseFloat(auction.currentBid) / parseFloat(auction.reservePrice)) * 100}
                  className="h-1 bg-muted"
                />
              </div>
            )}
          </div>
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="pt-0 pb-3 px-3">
        <Button className="w-full font-bold text-xs shadow-md shadow-primary/20 hover:shadow-primary/30 transition-all h-8">
          Place Bid
        </Button>
      </CardFooter>
    </Card>
  );
}
