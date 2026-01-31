"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/shared/utils/tailwind-utils";

interface NavItem {
  label: string;
  href: string;
  id: string;
}

interface MarketplaceCollectionTabsProps {
  collectionSlug?: string;
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Explore", href: "/explore", id: "explore" },
  { label: "Items", href: "", id: "items" },
  { label: "Offers", href: "/offers", id: "offers" },
  { label: "Holders", href: "/holders", id: "holders" },
  { label: "Traits", href: "/traits", id: "traits" },
  { label: "Activity", href: "/activity", id: "activity" },
];

export default function MarketplaceCollectionTabs({
  collectionSlug = "collection",
  activeTab = "items",
  onTabChange,
}: MarketplaceCollectionTabsProps) {
  const [currentTab, setCurrentTab] = useState(activeTab);

  const handleTabClick = (tabId: string) => {
    setCurrentTab(tabId);
    onTabChange?.(tabId);
  };

  const getTabHref = (item: NavItem) => {
    const basePath = `/collection/${collectionSlug}`;
    return item.href ? `${basePath}${item.href}` : basePath;
  };

  return (
    <div
      className={cn(
        "-mx-4 lg:-mx-6 w-full",
        "sticky z-[1] top-0 lg:top-[calc(theme(spacing.lg-top-nav,64px)+32px)]",
        "flex h-14 items-center overflow-x-auto overflow-y-hidden",
        "bg-background scrollbar-hide"
      )}
    >
      <nav
        className="flex gap-6 mx-auto min-h-0 w-full min-w-0  px-4 lg:px-6"
        aria-label="Collection"
      >
        {NAV_ITEMS.map(item => {
          const isActive = currentTab === item.id;

          return (
            <div key={item.id}>
              <Link
                href={getTabHref(item)}
                className={cn(
                  "cursor-pointer no-underline",
                  "disabled:pointer-events-none disabled:opacity-40",
                  "flex items-center gap-3 border-0 p-0",
                  "relative w-fit whitespace-nowrap pb-2 pt-1.5",
                  "hover:text-foreground focus-visible:text-foreground focus-visible:outline-hidden",
                  "transition-colors duration-150",
                  isActive ? "font-medium text-foreground" : "font-normal text-os-gray-300"
                )}
                aria-current={isActive ? "page" : undefined}
                onClick={e => {
                  e.preventDefault();
                  handleTabClick(item.id);
                }}
              >
                <span className="leading-normal text-sm relative font-inherit">{item.label}</span>

                {/* Active indicator underline */}
                {isActive && (
                  <div
                    className="absolute top-0 left-0 flex size-full items-end justify-center"
                    style={{ transformOrigin: "50% top 0px" }}
                  >
                    <span className="z-0 h-0.5 w-full bg-foreground" />
                  </div>
                )}
              </Link>
            </div>
          );
        })}
      </nav>
    </div>
  );
}
