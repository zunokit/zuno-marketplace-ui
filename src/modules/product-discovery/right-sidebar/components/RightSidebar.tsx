"use client";

import { useState } from "react";
import { CheckCircle2, ChevronDown, LayoutList, LayoutGrid, ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/shared/utils/tailwind-utils";
import Link from "next/link";
import Image from "next/image";
import type { Collection } from "@/shared/types/collection";

interface TrendingToken {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  price: number;
  priceChange: number;
  verified?: boolean;
}

interface RightSidebarProps {
  collections: Collection[];
  tokens?: TrendingToken[];
  isCollapsed?: boolean;
  onToggle?: () => void;
}

type TabType = "nfts" | "tokens";
type ViewMode = "compact" | "expanded";
type TimePeriod = "1d" | "7d" | "30d" | "all";

export function RightSidebar({ collections, tokens = [], isCollapsed: externalIsCollapsed, onToggle }: RightSidebarProps) {
  const [activeTab, setActiveTab] = useState<TabType>("nfts");
  const [viewMode, setViewMode] = useState<ViewMode>("compact");
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("1d");
  const [showTimePeriodDropdown, setShowTimePeriodDropdown] = useState(false);

  // Use external collapsed state if provided, otherwise use internal
  const isCollapsed = externalIsCollapsed ?? false;
  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    }
  };

  const timePeriodLabels: Record<TimePeriod, string> = {
    "1d": "1d",
    "7d": "7d",
    "30d": "30d",
    all: "All",
  };

  return (
    <>
      <button
        onClick={handleToggle}
        className={cn(
          "fixed right-0 top-1/2 z-50 -translate-y-1/2 rounded-l-lg border border-r-0 border-border bg-card p-2 shadow-lg transition-all duration-700 ease-in-out hover:bg-secondary hover:shadow-xl",
          isCollapsed ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
        )}
        aria-label="Expand sidebar"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <aside
        className={cn(
          "fixed top-[108px] md:top-[124px] xl:top-[117px] right-0 hidden h-[calc(100vh-108px)] md:h-[calc(100vh-124px)] xl:h-[calc(100vh-117px)] flex-shrink-0 border-l border-border bg-card transition-all duration-700 ease-in-out lg:flex lg:flex-col overflow-hidden z-30",
          isCollapsed ? "w-0 border-l-0" : "w-[420px]"
        )}
        role="complementary"
      >
        {/* Fixed Header */}
        <div className={cn("flex-shrink-0 border-b border-border px-5 py-3 bg-card", isCollapsed ? "w-0" : "w-[420px]")}>
          <div className="flex items-center justify-between gap-3">
            {/* Tabs */}
            <div className="flex items-center gap-1 rounded-lg border border-border p-1">
              <button
                onClick={() => setActiveTab("nfts")}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  activeTab === "nfts"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
                NFTs
              </button>
              <button
                onClick={() => setActiveTab("tokens")}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  activeTab === "tokens"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="9" />
                </svg>
                Tokens
              </button>
            </div>

            {/* Controls: Time period dropdown (only for NFTs) + View controls */}
            <div className="flex items-center gap-1.5">
              {activeTab === "nfts" && (
                <div className="relative">
                  <button
                    onClick={() => setShowTimePeriodDropdown(!showTimePeriodDropdown)}
                    className="flex items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium transition-colors hover:bg-secondary"
                  >
                    {timePeriodLabels[timePeriod]}
                    <ChevronDown className="h-3 w-3" />
                  </button>
                  {showTimePeriodDropdown && (
                    <div className="absolute left-0 top-full z-10 mt-1 w-24 rounded-lg border border-border bg-card shadow-lg">
                      {(Object.keys(timePeriodLabels) as TimePeriod[]).map((period) => (
                        <button
                          key={period}
                          onClick={() => {
                            setTimePeriod(period);
                            setShowTimePeriodDropdown(false);
                          }}
                          className={cn(
                            "w-full px-3 py-2 text-left text-sm transition-colors hover:bg-secondary",
                            timePeriod === period && "bg-primary/10 text-primary"
                          )}
                        >
                          {timePeriodLabels[period]}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* View controls */}
              <div className="flex items-center gap-0.5 rounded-md border border-border p-0.5">
                <button
                  onClick={() => setViewMode("compact")}
                  className={cn(
                    "rounded p-1 transition-colors",
                    viewMode === "compact" ? "bg-background text-foreground" : "text-muted-foreground hover:bg-secondary"
                  )}
                  aria-label="Compact view"
                >
                  <LayoutList className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setViewMode("expanded")}
                  className={cn(
                    "rounded p-1 transition-colors",
                    viewMode === "expanded" ? "bg-background text-foreground" : "text-muted-foreground hover:bg-secondary"
                  )}
                  aria-label="Expanded view"
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={handleToggle}
                  className="rounded p-1 text-muted-foreground transition-colors hover:bg-secondary"
                  aria-label="Collapse sidebar"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Column Headers */}
        {viewMode === "compact" ? (
          <div className={cn("flex-shrink-0 flex items-center justify-between border-b border-border px-5 py-2.5 bg-card", isCollapsed ? "w-0 overflow-hidden" : "w-[420px]")}>
            <h2 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {activeTab === "nfts" ? "Collection" : "Token"}
            </h2>
            <div className="flex items-center gap-12">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {activeTab === "nfts" ? "Floor" : "Price"}
              </span>
              <span className="w-14 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Change
              </span>
            </div>
          </div>
        ) : (
          <div className={cn("flex-shrink-0 flex items-center justify-between border-b border-border px-5 py-2.5 bg-card", isCollapsed ? "w-0 overflow-hidden" : "w-[420px]")}>
            <h2 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {activeTab === "nfts" ? "Collection" : "Token"}
            </h2>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {activeTab === "nfts" ? "Floor" : "Price"}
            </span>
          </div>
        )}

        {/* Scrollable Content */}
        <div
          className={cn("flex-1 overflow-y-auto overflow-x-hidden px-4 py-2 scrollbar-hide", isCollapsed ? "w-0" : "w-[420px]")}
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <div className={cn("space-y-0.5", viewMode === "expanded" && "space-y-1")}>
            {activeTab === "nfts"
              ? collections.map((collection) => {
                  const floorPrice = 0.5 + Math.random() * 5;
                  const priceChange = (Math.random() - 0.5) * 50;
                  const currency = "ETH";

                  return viewMode === "compact" ? (
                    <Link
                      key={collection.id}
                      href={`/collections/${collection.slug}`}
                      className="flex items-center justify-between rounded-md p-2 transition-colors hover:bg-secondary/50"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div className="relative h-10 w-10 flex-shrink-0">
                          <Image
                            src={collection.imageUrl || "/placeholder.svg"}
                            alt={collection.name}
                            fill
                            className="rounded-md object-cover"
                          />
                        </div>
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-sm font-medium truncate">{collection.name}</span>
                          {collection.isVerified && <CheckCircle2 className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />}
                        </div>
                      </div>

                      <div className="flex items-center gap-10 flex-shrink-0">
                        <div className="flex flex-col items-end">
                          <span className="text-sm font-semibold whitespace-nowrap">
                            {floorPrice.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                          <span className="text-xs text-muted-foreground">{currency}</span>
                        </div>
                        <span
                          className={cn(
                            "w-14 text-right text-xs font-medium",
                            priceChange >= 0 ? "text-green-500" : "text-red-500"
                          )}
                        >
                          {priceChange >= 0 ? "+" : ""}
                          {priceChange.toFixed(1)}%
                        </span>
                      </div>
                    </Link>
                  ) : (
                    <Link
                      key={collection.id}
                      href={`/collections/${collection.slug}`}
                      className="flex items-center justify-between rounded-md p-2.5 transition-colors hover:bg-secondary/50"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="relative h-12 w-12 flex-shrink-0">
                          <Image
                            src={collection.imageUrl || "/placeholder.svg"}
                            alt={collection.name}
                            fill
                            className="rounded-md object-cover"
                          />
                        </div>
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-sm font-medium truncate">{collection.name}</span>
                          {collection.isVerified && <CheckCircle2 className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />}
                        </div>
                      </div>

                      <div className="flex flex-col items-end flex-shrink-0">
                        <span className="text-sm font-semibold whitespace-nowrap">
                          {floorPrice.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-muted-foreground">{currency}</span>
                          <span
                            className={cn(
                              "text-xs font-medium",
                              priceChange >= 0 ? "text-green-500" : "text-red-500"
                            )}
                          >
                            {priceChange >= 0 ? "+" : ""}
                            {priceChange.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })
              : tokens.map((token) =>
                  viewMode === "compact" ? (
                    <div
                      key={token.id}
                      className="flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-secondary/50"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="relative h-9 w-9">
                          <Image
                            src={token.icon || "/placeholder.svg"}
                            alt={token.name}
                            fill
                            className="rounded-full object-cover"
                          />
                          <div className="absolute -bottom-0.5 -right-0.5 rounded-full bg-primary p-0.5">
                            <svg className="h-2 w-2 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
                              <circle cx="12" cy="12" r="10" />
                            </svg>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-medium">{token.name}</span>
                          {token.verified && <CheckCircle2 className="h-3.5 w-3.5 text-primary" />}
                        </div>
                      </div>

                      <div className="flex items-center gap-12">
                        <span className="text-sm font-semibold">
                          {token.price < 0.01 ? "< " : ""}$
                          {token.price < 0.01
                            ? token.price.toFixed(6)
                            : token.price.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 4,
                              })}
                        </span>
                        <span
                          className={cn(
                            "w-16 text-right text-xs font-medium",
                            token.priceChange >= 0 ? "text-green-500" : "text-red-500"
                          )}
                        >
                          {token.priceChange >= 0 ? "+" : ""}
                          {token.priceChange}%
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div
                      key={token.id}
                      className="flex items-center justify-between rounded-lg p-2.5 transition-colors hover:bg-secondary/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12">
                          <Image
                            src={token.icon || "/placeholder.svg"}
                            alt={token.name}
                            fill
                            className="rounded-full object-cover"
                          />
                          <div className="absolute -bottom-0.5 -right-0.5 rounded-full bg-primary p-1">
                            <svg
                              className="h-2.5 w-2.5 text-primary-foreground"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <circle cx="12" cy="12" r="10" />
                            </svg>
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-medium">{token.name}</span>
                            {token.verified && <CheckCircle2 className="h-3.5 w-3.5 text-primary" />}
                          </div>
                          <span className="text-xs text-muted-foreground">{token.symbol}</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end">
                        <span className="text-sm font-semibold">
                          {token.price < 0.01 ? "< " : ""}$
                          {token.price < 0.01
                            ? token.price.toFixed(6)
                            : token.price.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 4,
                              })}
                        </span>
                        <span
                          className={cn(
                            "text-xs font-medium",
                            token.priceChange >= 0 ? "text-green-500" : "text-red-500"
                          )}
                        >
                          {token.priceChange >= 0 ? "+" : ""}
                          {token.priceChange}%
                        </span>
                      </div>
                    </div>
                  )
                )}
          </div>
        </div>
      </aside>
    </>
  );
}
