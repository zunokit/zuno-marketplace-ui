"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import {
  Clock,
  Gavel,
  Users,
  TrendingUp,
  AlertCircle,
  Trophy,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  User,
} from "lucide-react";
import { type Auction } from "@/shared/types/auction";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/shared/utils/tailwind-utils";

interface AuctionDetailProps {
  auction: Auction;
}

function CollapsibleSection({
  title,
  icon,
  children,
  defaultOpen = false,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full p-4 hover:bg-muted/30 transition-colors h-auto font-normal"
      >
        <div className="flex items-center gap-2.5">
          {icon}
          <span className="font-medium text-sm">{title}</span>
        </div>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </Button>
      {isOpen && <div className="px-4 pb-4 border-t border-border">{children}</div>}
    </div>
  );
}

export function AuctionDetail({ auction }: AuctionDetailProps) {
  const [bidAmount, setBidAmount] = useState("");
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
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (days > 0) setTimeLeft(`${days}d ${hours}h ${minutes}m`);
      else if (hours > 0) setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      else setTimeLeft(`${minutes}m ${seconds}s`);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [auction]);

  const handlePlaceBid = () => {
    console.log("Place bid:", bidAmount);
  };

  const minBidAmount = parseFloat(auction.currentBid) * 1.05;
  const leadingBidder = auction.bids[0]?.bidder;
  const isReserveMet = auction.reservePrice
    ? parseFloat(auction.currentBid) >= parseFloat(auction.reservePrice)
    : true;

  return (
    <div className="mx-auto py-4 sm:py-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Left - Image */}
        <div className="space-y-3">
          <div className="relative aspect-square rounded-xl overflow-hidden border border-border bg-muted/20">
            <Image src={auction.image} alt={auction.name} fill className="object-cover" />
            {auction.status === "active" && (
              <div className="absolute top-3 right-3">
                <Badge className="bg-red-500/90 text-white border-0 backdrop-blur-sm animate-pulse">
                  <Clock className="h-3 w-3 mr-1" />
                  LIVE
                </Badge>
              </div>
            )}
          </div>

          <CollapsibleSection
            title="Description"
            icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
            defaultOpen
          >
            <p className="text-sm text-muted-foreground pt-3">{auction.description}</p>
          </CollapsibleSection>

          <CollapsibleSection
            title="Seller"
            icon={<User className="h-4 w-4 text-muted-foreground" />}
          >
            <div className="flex items-center gap-3 pt-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={auction.seller.avatar} />
                <AvatarFallback>{auction.seller.name?.[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">
                  {auction.seller.name || auction.seller.address.slice(0, 8)}
                </p>
                <p className="text-xs text-muted-foreground font-mono">
                  {auction.seller.address.slice(0, 6)}...{auction.seller.address.slice(-4)}
                </p>
              </div>
            </div>
          </CollapsibleSection>
        </div>

        {/* Right - Details */}
        <div className="space-y-4">
          {/* Title */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{auction.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge
                variant={auction.status === "active" ? "default" : "secondary"}
                className="capitalize"
              >
                {auction.status}
              </Badge>
              {!isReserveMet && (
                <Badge variant="outline" className="text-warning border-warning/30">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Reserve not met
                </Badge>
              )}
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-border p-3">
              <div className="flex items-center gap-1.5 text-muted-foreground mb-1.5">
                <Clock className="h-3.5 w-3.5" />
                <span className="text-[10px] uppercase tracking-wider">Time Left</span>
              </div>
              <p className="text-lg font-bold">{timeLeft}</p>
            </div>
            <div className="rounded-xl border border-border p-3">
              <div className="flex items-center gap-1.5 text-muted-foreground mb-1.5">
                <Users className="h-3.5 w-3.5" />
                <span className="text-[10px] uppercase tracking-wider">Bidders</span>
              </div>
              <p className="text-lg font-bold">{auction.bids.length}</p>
            </div>
            <div className="rounded-xl border border-border p-3">
              <div className="flex items-center gap-1.5 text-muted-foreground mb-1.5">
                <TrendingUp className="h-3.5 w-3.5" />
                <span className="text-[10px] uppercase tracking-wider">Min Step</span>
              </div>
              <p className="text-lg font-bold">5%</p>
            </div>
          </div>

          {/* Current Bid section */}
          <div className="rounded-xl border border-border p-5 space-y-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                {auction.bids.length > 0 ? "Current Bid" : "Starting Price"}
              </p>
              <p className="text-3xl font-bold tracking-tight">
                {auction.currentBid} {auction.currency}
              </p>
              {leadingBidder && (
                <div className="flex items-center gap-2 mt-2">
                  <Trophy className="h-4 w-4 text-warning" />
                  <span className="text-sm text-muted-foreground">
                    Leading: {leadingBidder.name || leadingBidder.address.slice(0, 8)}
                  </span>
                </div>
              )}
            </div>

            {auction.status === "active" && (
              <div className="space-y-2.5">
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder={`Min: ${minBidAmount.toFixed(3)} ${auction.currency}`}
                    value={bidAmount}
                    onChange={e => setBidAmount(e.target.value)}
                    step="0.001"
                    min={minBidAmount}
                    className="h-11"
                  />
                  <Button
                    onClick={handlePlaceBid}
                    disabled={!bidAmount || parseFloat(bidAmount) < minBidAmount}
                    className="min-w-[120px] h-11 font-semibold"
                  >
                    <Gavel className="h-4 w-4 mr-2" />
                    Place Bid
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Minimum bid: {minBidAmount.toFixed(3)} {auction.currency}
                </p>
              </div>
            )}

            {auction.status === "ended" && auction.winner && (
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  Winner
                </p>
                <p className="font-medium">{auction.winner.name || auction.winner.address}</p>
                <p className="text-xl font-bold mt-1">
                  {auction.currentBid} {auction.currency}
                </p>
              </div>
            )}
          </div>

          {/* Bid History */}
          <CollapsibleSection
            title={`Bid History (${auction.bids.length})`}
            icon={<Gavel className="h-4 w-4 text-muted-foreground" />}
            defaultOpen
          >
            <div className="pt-3 space-y-2 max-h-[300px] overflow-y-auto">
              {auction.bids.length === 0 ? (
                <p className="text-center text-muted-foreground text-sm py-4">No bids yet</p>
              ) : (
                auction.bids.map((bid, index) => (
                  <div
                    key={bid.id}
                    className={cn(
                      "flex items-center justify-between p-2.5 rounded-lg",
                      index === 0
                        ? "bg-primary/5 border border-primary/10"
                        : "bg-muted/20"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={bid.bidder.avatar} />
                        <AvatarFallback className="text-[10px]">
                          {bid.bidder.name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-xs">
                          {bid.bidder.name || bid.bidder.address.slice(0, 8)}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {formatDistanceToNow(bid.timestamp, { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">
                        {bid.amount} {auction.currency}
                      </p>
                      {index === 0 && (
                        <Badge variant="default" className="text-[10px] h-4">
                          Leading
                        </Badge>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CollapsibleSection>

          {/* Contract details */}
          <CollapsibleSection
            title="Details"
            icon={<ExternalLink className="h-4 w-4 text-muted-foreground" />}
          >
            <div className="pt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Contract</span>
                <span className="font-mono text-xs">
                  {auction.contractAddress.slice(0, 6)}...
                  {auction.contractAddress.slice(-4)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Token ID</span>
                <span className="text-xs">{auction.tokenId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Start</span>
                <span className="text-xs">{auction.startTime.toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">End</span>
                <span className="text-xs">{auction.endTime.toLocaleDateString()}</span>
              </div>
              {auction.reservePrice && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reserve</span>
                  <span className="text-xs">
                    {auction.reservePrice} {auction.currency}
                  </span>
                </div>
              )}
            </div>
          </CollapsibleSection>
        </div>
      </div>
    </div>
  );
}
