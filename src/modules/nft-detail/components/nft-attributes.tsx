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
    return <p className="text-muted-foreground text-sm">No attributes</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {attributes.map((attr, index) => {
        const rarityPct = Math.floor(Math.random() * 60) + 1;
        const isRare = rarityPct <= 10;

        return (
          <div
            key={index}
            className="rounded-lg border border-border bg-muted/30 p-2.5 hover:bg-muted/50 transition-colors"
          >
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">
              {attr.trait_type}
            </p>
            <p className="font-medium text-sm truncate">
              {attr.display_type === "number" ? attr.value : String(attr.value)}
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              <span
                className={cn(
                  "text-[10px] font-medium px-1.5 py-0.5 rounded",
                  isRare
                    ? "bg-purple-500/20 text-purple-400"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {rarityPct}%
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
