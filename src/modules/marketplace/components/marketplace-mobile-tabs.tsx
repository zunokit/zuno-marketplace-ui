"use client";

import { ShoppingBag, Tag, BarChart2, Users, type LucideIcon } from "lucide-react";
import { cn } from "@/shared/utils/tailwind-utils";
import { Button } from "@/shared/components/ui/button";

const MOBILE_TABS: { id: string; label: string; icon: LucideIcon }[] = [
  { id: "items", label: "Items", icon: ShoppingBag },
  { id: "offers", label: "Offers", icon: Tag },
  { id: "activity", label: "Activity", icon: BarChart2 },
  { id: "holders", label: "More", icon: Users },
];

interface MarketplaceMobileTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function MarketplaceMobileTabs({ activeTab, onTabChange }: MarketplaceMobileTabsProps) {
  return (
    <div className="flex items-center justify-around h-17 px-2 py-1.5 gap-1 md:hidden">
      {MOBILE_TABS.map(({ id, label, icon: Icon }) => {
        const isActive = activeTab === id;
        return (
          <Button
            key={id}
            variant="ghost"
            onClick={() => onTabChange(id)}
            className={cn(
              "flex flex-col flex-1 h-full gap-1.5 transition-all rounded-md",
              isActive
                ? "text-primary bg-primary/12 shadow-inner shadow-primary/10"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <Icon className="size-7 shrink-0" />
            <span className="text-[12px] font-semibold leading-none">{label}</span>
          </Button>
        );
      })}
    </div>
  );
}
