"use client";

import { Card } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { ShoppingCart, Send, Tag, Gavel, Plus, ArrowRight, ExternalLink } from "lucide-react";
import { type NFTActivity } from "@/shared/types/nft-detail";
import { formatDistanceToNow } from "date-fns";

interface NFTHistoryProps {
  activities: NFTActivity[];
}

export function NFTHistory({ activities }: NFTHistoryProps) {
  const getActivityIcon = (type: NFTActivity["type"]) => {
    switch (type) {
      case "mint":
        return <Plus className="h-4 w-4" />;
      case "transfer":
        return <Send className="h-4 w-4" />;
      case "sale":
        return <ShoppingCart className="h-4 w-4" />;
      case "listing":
        return <Tag className="h-4 w-4" />;
      case "offer":
        return <Tag className="h-4 w-4" />;
      case "bid":
        return <Gavel className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getActivityLabel = (type: NFTActivity["type"]) => {
    switch (type) {
      case "mint":
        return "Minted";
      case "transfer":
        return "Transferred";
      case "sale":
        return "Sold";
      case "listing":
        return "Listed";
      case "offer":
        return "Offer";
      case "bid":
        return "Bid";
      default:
        return type;
    }
  };

  const getActivityColor = (type: NFTActivity["type"]) => {
    switch (type) {
      case "mint":
        return "bg-success/10 text-success";
      case "transfer":
        return "bg-info/10 text-info";
      case "sale":
        return "bg-frosted-2/10 text-accent";
      case "listing":
        return "bg-warning/10 text-warning";
      case "offer":
        return "bg-warning/10 text-warning";
      case "bid":
        return "bg-primary/10 text-primary";
      default:
        return "bg-muted/10 text-os-gray-300";
    }
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="space-y-3">
      {activities.map(activity => (
        <Card key={activity.id} className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className={`gap-1 ${getActivityColor(activity.type)}`}>
                {getActivityIcon(activity.type)}
                {getActivityLabel(activity.type)}
              </Badge>

              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">
                  {activity.from.name || truncateAddress(activity.from.address)}
                </span>
                {activity.to && (
                  <>
                    <ArrowRight className="h-3 w-3 text-os-gray-300" />
                    <span className="font-medium">
                      {activity.to.name || truncateAddress(activity.to.address)}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm">
              {activity.price && (
                <span className="font-medium font-sans">
                  {activity.price} {activity.currency}
                </span>
              )}
              <span className="text-os-gray-300">
                {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
              </span>
              <a
                href={`https://etherscan.io/tx/${activity.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
