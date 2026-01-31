"use client";

import * as React from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/shared/components/ui/hover-card";
import { Info } from "lucide-react";

export function TooltipSection() {
  return (
    <TooltipProvider>
      <div className="space-y-8">
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-foreground">Tooltip Positions</h4>
          <div className="flex flex-wrap gap-4">
            {(["top", "right", "bottom", "left"] as const).map((side) => (
              <Tooltip key={side}>
                <TooltipTrigger asChild>
                  <Button variant="outline" className="capitalize">
                    {side}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side={side}>
                  <p>Tooltip on {side}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-medium text-foreground">With Icon</h4>
          <div className="flex items-center gap-2">
            <span className="text-sm">NFT Floor Price</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-4 h-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>The lowest price for any NFT in this collection</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-medium text-foreground">Hover Card</h4>
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="link">@username</Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">@username</h4>
                <p className="text-sm text-muted-foreground">
                  NFT collector and creator. Member since 2021.
                </p>
                <div className="flex gap-4 text-sm">
                  <div>
                    <span className="font-medium">142</span> Items
                  </div>
                  <div>
                    <span className="font-medium">1.2K</span> Followers
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </div>
    </TooltipProvider>
  );
}
