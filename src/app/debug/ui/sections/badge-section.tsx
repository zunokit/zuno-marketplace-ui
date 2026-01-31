"use client";

import * as React from "react";
import { Badge } from "@/shared/components/ui/badge";
import { Crown, Zap, Star } from "lucide-react";

export function BadgeSection() {
  return (
    <div className="space-y-8">
      {/* Badge Variants */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Badge Variants</h4>
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="destructive">Error</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="info">Info</Badge>
        </div>
      </div>

      {/* Rarity Badges */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Rarity Tiers</h4>
        <div className="flex flex-wrap gap-2">
          <Badge variant="rare">
            <Star className="w-3 h-3 mr-1" />
            Rare
          </Badge>
          <Badge variant="epic">
            <Zap className="w-3 h-3 mr-1" />
            Epic
          </Badge>
          <Badge variant="legendary">
            <Crown className="w-3 h-3 mr-1" />
            Legendary
          </Badge>
        </div>
      </div>

      {/* Badge Sizes */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Sizes</h4>
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="text-xs">Small</Badge>
          <Badge>Default</Badge>
          <Badge className="text-sm px-3 py-1">Large</Badge>
        </div>
      </div>

      {/* Usage Examples */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Usage Examples</h4>
        <div className="space-y-3 max-w-md">
          <div className="flex items-center justify-between p-3 rounded-lg bg-card border border-border-subtle">
            <span className="text-sm">Transaction Status</span>
            <Badge variant="success">Completed</Badge>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-card border border-border-subtle">
            <span className="text-sm">Listing Status</span>
            <Badge variant="warning">Pending</Badge>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-card border border-border-subtle">
            <span className="text-sm">Verification</span>
            <Badge variant="info">In Review</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
