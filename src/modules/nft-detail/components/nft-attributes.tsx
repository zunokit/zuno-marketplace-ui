"use client";

import { cn } from "@/shared/utils/tailwind-utils";

interface NFTAttributesProps {
  attributes: Array<{
    trait_type: string;
    value: string | number;
    display_type?: string;
  }>;
}

export function NFTAttributes({ attributes }: NFTAttributesProps) {
  if (attributes.length === 0) {
    return <p className="text-muted-foreground/60 text-xs">No attributes</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
      {attributes.map((attr, index) => {
        const pct = Math.floor(Math.random() * 60) + 1;
        const rare = pct <= 10;

        return (
          <div
            key={index}
            className="rounded-md border border-border/20 bg-muted/10 p-2 hover:bg-muted/20 transition-colors"
          >
            <p className="text-[9px] text-muted-foreground/50 uppercase tracking-wider font-medium">
              {attr.trait_type}
            </p>
            <p className="font-semibold text-[13px] truncate mt-0.5 leading-tight">
              {attr.display_type === "number" ? attr.value : String(attr.value)}
            </p>
            <div className="flex items-center justify-between mt-1">
              <span className={cn(
                "text-[9px] font-semibold px-1 py-0.5 rounded",
                rare ? "bg-purple-500/20 text-purple-400" : "bg-muted/30 text-muted-foreground/50"
              )}>
                {pct}%
              </span>
              <span className="text-[10px] text-muted-foreground/40">
                {attr.display_type === "number" ? "" : `${(parseFloat(attributes[0]?.value?.toString() || "0.1") || 0.123).toFixed(3)} ETH`}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
