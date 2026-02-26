"use client";

import { Badge } from "@/shared/components/ui/badge";
import { ShoppingCart, Send, Tag, Gavel, Plus, ArrowRight, ExternalLink } from "lucide-react";
import { type NFTActivity } from "@/shared/types/nft-detail";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/shared/utils/tailwind-utils";

interface NFTHistoryProps {
  activities: NFTActivity[];
}

export function NFTHistory({ activities }: NFTHistoryProps) {
  const getActivityIcon = (type: NFTActivity["type"]) => {
    switch (type) {
      case "mint": return <Plus className="h-3.5 w-3.5" />;
      case "transfer": return <Send className="h-3.5 w-3.5" />;
      case "sale": return <ShoppingCart className="h-3.5 w-3.5" />;
      case "listing": return <Tag className="h-3.5 w-3.5" />;
      case "offer": return <Tag className="h-3.5 w-3.5" />;
      case "bid": return <Gavel className="h-3.5 w-3.5" />;
      default: return null;
    }
  };

  const getActivityLabel = (type: NFTActivity["type"]) => {
    switch (type) {
      case "mint": return "Minted";
      case "transfer": return "Transferred";
      case "sale": return "Sold";
      case "listing": return "Listed";
      case "offer": return "Offer";
      case "bid": return "Bid";
      default: return type;
    }
  };

  const getActivityColor = (type: NFTActivity["type"]) => {
    switch (type) {
      case "mint": return "bg-green-500/10 text-green-500";
      case "transfer": return "bg-blue-500/10 text-blue-500";
      case "sale": return "bg-purple-500/10 text-purple-400";
      case "listing": return "bg-yellow-500/10 text-yellow-500";
      case "offer": return "bg-yellow-500/10 text-yellow-500";
      case "bid": return "bg-primary/10 text-primary";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const truncateAddress = (address: string) =>
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        No activity yet
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {activities.map(activity => (
        <div
          key={activity.id}
          className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-muted/30 transition-colors"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <Badge
              variant="secondary"
              className={cn("gap-1 text-[10px] shrink-0", getActivityColor(activity.type))}
            >
              {getActivityIcon(activity.type)}
              {getActivityLabel(activity.type)}
            </Badge>

            <div className="flex items-center gap-1.5 text-xs min-w-0 truncate">
              <span className="font-medium truncate">
                {activity.from.name || truncateAddress(activity.from.address)}
              </span>
              {activity.to && (
                <>
                  <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
                  <span className="font-medium truncate">
                    {activity.to.name || truncateAddress(activity.to.address)}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs shrink-0 ml-3">
            {activity.price && (
              <span className="font-semibold">
                {activity.price} {activity.currency}
              </span>
            )}
            <span className="text-muted-foreground whitespace-nowrap">
              {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
            </span>
            <a
              href={`https://etherscan.io/tx/${activity.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
