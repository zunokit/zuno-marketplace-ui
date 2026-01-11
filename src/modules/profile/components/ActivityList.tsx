"use client";

import { Card } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { ShoppingCart, Tag, Send, Gavel, Plus, ArrowRight, ExternalLink } from "lucide-react";
import Image from "next/image";
import { type ProfileActivity } from "@/shared/types/profile";
import { formatDistanceToNow } from "date-fns";

interface ActivityListProps {
  activities: ProfileActivity[];
}

export function ActivityList({ activities }: ActivityListProps) {
  const getActivityIcon = (type: ProfileActivity["type"]) => {
    switch (type) {
      case "purchase":
        return <ShoppingCart className="h-4 w-4" />;
      case "sale":
        return <Tag className="h-4 w-4" />;
      case "listing":
        return <Tag className="h-4 w-4" />;
      case "bid":
        return <Gavel className="h-4 w-4" />;
      case "transfer":
        return <Send className="h-4 w-4" />;
      case "mint":
        return <Plus className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getActivityLabel = (type: ProfileActivity["type"]) => {
    switch (type) {
      case "purchase":
        return "Purchased";
      case "sale":
        return "Sold";
      case "listing":
        return "Listed";
      case "bid":
        return "Bid placed";
      case "transfer":
        return "Transferred";
      case "mint":
        return "Minted";
      default:
        return type;
    }
  };

  const getActivityColor = (type: ProfileActivity["type"]) => {
    switch (type) {
      case "purchase":
        return "bg-success/10 text-success";
      case "sale":
        return "bg-info/10 text-info";
      case "listing":
        return "bg-warning/10 text-warning";
      case "bid":
        return "bg-frosted-2/10 text-accent";
      case "transfer":
        return "bg-warning/10 text-warning";
      case "mint":
        return "bg-primary/10 text-primary";
      default:
        return "bg-secondary/10 text-secondary";
    }
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="space-y-4">
      {activities.map(activity => (
        <Card key={activity.id} className="p-4">
          <div className="flex items-center gap-4">
            {/* NFT Image */}
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-[8px]">
              <Image
                src={activity.nft.image}
                alt={activity.nft.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Activity Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge
                      variant="secondary"
                      className={`gap-1 ${getActivityColor(activity.type)}`}
                    >
                      {getActivityIcon(activity.type)}
                      {getActivityLabel(activity.type)}
                    </Badge>
                  </div>

                  <h4 className="font-medium truncate">{activity.nft.name}</h4>
                  <p className="text-sm text-os-gray-300 truncate">
                    {activity.nft.collection}
                  </p>

                  {/* Transfer Details */}
                  {(activity.from || activity.to) && (
                    <div className="flex items-center gap-2 mt-2 text-sm">
                      {activity.from && (
                        <span className="text-os-gray-300">
                          From: {truncateAddress(activity.from)}
                        </span>
                      )}
                      {activity.from && activity.to && (
                        <ArrowRight className="h-3 w-3 text-os-gray-300" />
                      )}
                      {activity.to && (
                        <span className="text-os-gray-300">
                          To: {truncateAddress(activity.to)}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Price and Time */}
                <div className="text-right">
                  {activity.price && (
                    <p className="font-medium font-sans">
                      {activity.price} {activity.currency}
                    </p>
                  )}
                  <p className="text-sm text-os-gray-300">
                    {formatDistanceToNow(activity.timestamp, {
                      addSuffix: true,
                    })}
                  </p>
                  {activity.txHash && (
                    <a
                      href={`https://etherscan.io/tx/${activity.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1"
                    >
                      View TX
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
