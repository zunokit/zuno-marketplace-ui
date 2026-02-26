"use client";

import { useState, useMemo } from "react";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Search,
  Star,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
  TrendingUp,
  Flame,
  Bookmark,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { type Collection } from "@/shared/types/marketplace";
import { mockCollections } from "@/shared/utils/mock/marketplace";
import { cn } from "@/shared/utils/tailwind-utils";

type SortKey = "volume" | "floor" | "change" | "sales" | "owners" | "items";
type SortDir = "asc" | "desc";
type TimeWindow = "1d" | "7d" | "30d";
type ActiveTab = "top" | "trending" | "watchlist";

function generateSparkline(): number[] {
  const points: number[] = [];
  let val = 50 + Math.random() * 30;
  for (let i = 0; i < 7; i++) {
    val += (Math.random() - 0.5) * 20;
    points.push(Math.max(10, Math.min(90, val)));
  }
  return points;
}

function SparklineChart({ data, positive }: { data: number[]; positive: boolean }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const h = 32;
  const w = 80;
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`)
    .join(" ");

  return (
    <svg width={w} height={h} className="shrink-0">
      <polyline
        fill="none"
        stroke={positive ? "#22c55e" : "#ef4444"}
        strokeWidth="1.5"
        points={points}
      />
    </svg>
  );
}

interface EnrichedCollection extends Collection {
  rank: number;
  change1d: number;
  sales1d: number;
  sparkline: number[];
  starred: boolean;
}

export function CollectionsList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("volume");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [timeWindow, setTimeWindow] = useState<TimeWindow>("1d");
  const [activeTab, setActiveTab] = useState<ActiveTab>("top");
  const [starredIds, setStarredIds] = useState<Set<string>>(new Set());

  const enrichedCollections = useMemo(() => {
    const extended: EnrichedCollection[] = [];
    for (let i = 0; i < 25; i++) {
      const base = mockCollections[i % mockCollections.length];
      const change = (Math.random() - 0.5) * 40;
      extended.push({
        ...base,
        address: `${base.address}-${i}`,
        name: i < 2 ? base.name : `${base.name} #${i}`,
        floorPrice: (Math.random() * 5 + 0.01).toFixed(4),
        volume24h: (Math.random() * 200 + 1).toFixed(2),
        totalVolume: (Math.random() * 50000 + 100).toFixed(0),
        itemCount: Math.floor(Math.random() * 20000) + 100,
        ownerCount: Math.floor(Math.random() * 10000) + 50,
        rank: i + 1,
        change1d: parseFloat(change.toFixed(1)),
        sales1d: Math.floor(Math.random() * 500) + 1,
        sparkline: generateSparkline(),
        starred: starredIds.has(`${base.address}-${i}`),
      });
    }
    return extended;
  }, [starredIds]);

  const toggleStar = (address: string) => {
    setStarredIds(prev => {
      const next = new Set(prev);
      if (next.has(address)) next.delete(address);
      else next.add(address);
      return next;
    });
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const filteredAndSorted = useMemo(() => {
    let list = [...enrichedCollections];

    if (activeTab === "watchlist") {
      list = list.filter(c => starredIds.has(c.address));
    }

    if (searchQuery) {
      list = list.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    const getVal = (c: EnrichedCollection): number => {
      switch (sortKey) {
        case "volume":
          return parseFloat(c.volume24h || "0");
        case "floor":
          return parseFloat(c.floorPrice || "0");
        case "change":
          return c.change1d;
        case "sales":
          return c.sales1d;
        case "owners":
          return c.ownerCount;
        case "items":
          return c.itemCount;
        default:
          return 0;
      }
    };

    list.sort((a, b) => {
      const va = getVal(a);
      const vb = getVal(b);
      return sortDir === "desc" ? vb - va : va - vb;
    });

    return list;
  }, [enrichedCollections, searchQuery, sortKey, sortDir, activeTab, starredIds]);

  const getCollectionSlug = (collection: Collection) =>
    collection.name.toLowerCase().replace(/\s+/g, "-");

  const SortHeader = ({
    label,
    sortKeyVal,
    className,
  }: {
    label: string;
    sortKeyVal: SortKey;
    className?: string;
  }) => {
    const active = sortKey === sortKeyVal;
    return (
      <button
        onClick={() => handleSort(sortKeyVal)}
        className={cn(
          "flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap",
          active && "text-foreground",
          className
        )}
      >
        {label}
        {active ? (
          sortDir === "desc" ? (
            <ChevronDown className="h-3 w-3" />
          ) : (
            <ChevronUp className="h-3 w-3" />
          )
        ) : (
          <ArrowUpDown className="h-3 w-3 opacity-40" />
        )}
      </button>
    );
  };

  const timeWindows: TimeWindow[] = ["1d", "7d", "30d"];

  return (
    <div className="space-y-4">
      {/* Header row with tabs and time filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
          <button
            onClick={() => setActiveTab("top")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
              activeTab === "top"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <TrendingUp className="h-3.5 w-3.5" />
            Top
          </button>
          <button
            onClick={() => setActiveTab("trending")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
              activeTab === "trending"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Flame className="h-3.5 w-3.5" />
            Trending
          </button>
          <button
            onClick={() => setActiveTab("watchlist")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
              activeTab === "watchlist"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Bookmark className="h-3.5 w-3.5" />
            Watchlist
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search collections..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-sm"
            />
          </div>
          <div className="flex items-center gap-0.5 bg-muted/50 rounded-md p-0.5">
            {timeWindows.map(tw => (
              <button
                key={tw}
                onClick={() => setTimeWindow(tw)}
                className={cn(
                  "px-2.5 py-1 rounded text-xs font-medium transition-colors uppercase",
                  timeWindow === tw
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tw}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="w-10 px-3 py-3"></th>
              <th className="w-10 px-2 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground text-center">
                #
              </th>
              <th className="text-left px-3 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground min-w-[200px]">
                Collection
              </th>
              <th className="px-3 py-3 text-right">
                <SortHeader label="Floor Price" sortKeyVal="floor" className="justify-end" />
              </th>
              <th className="px-3 py-3 text-right">
                <SortHeader label={`${timeWindow} Change`} sortKeyVal="change" className="justify-end" />
              </th>
              <th className="px-3 py-3 text-right">
                <SortHeader label={`${timeWindow} Volume`} sortKeyVal="volume" className="justify-end" />
              </th>
              <th className="px-3 py-3 text-right hidden lg:table-cell">
                <SortHeader label={`${timeWindow} Sales`} sortKeyVal="sales" className="justify-end" />
              </th>
              <th className="px-3 py-3 text-right hidden xl:table-cell">
                <SortHeader label="Owners" sortKeyVal="owners" className="justify-end" />
              </th>
              <th className="px-3 py-3 text-right hidden xl:table-cell">
                <SortHeader label="Supply" sortKeyVal="items" className="justify-end" />
              </th>
              <th className="px-3 py-3 text-right hidden md:table-cell w-24">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Last 7d
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSorted.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-12 text-muted-foreground">
                  {activeTab === "watchlist"
                    ? "No collections in your watchlist yet. Star collections to add them."
                    : "No collections found matching your search."}
                </td>
              </tr>
            ) : (
              filteredAndSorted.map((collection, index) => (
                <tr
                  key={collection.address}
                  className="border-b border-border/50 hover:bg-muted/20 transition-colors group"
                >
                  <td className="px-3 py-3">
                    <button
                      onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleStar(collection.address);
                      }}
                      className="opacity-40 hover:opacity-100 group-hover:opacity-70 transition-opacity"
                    >
                      <Star
                        className={cn(
                          "h-4 w-4",
                          collection.starred
                            ? "fill-yellow-400 text-yellow-400 opacity-100"
                            : "text-muted-foreground"
                        )}
                      />
                    </button>
                  </td>
                  <td className="px-2 py-3 text-sm text-muted-foreground text-center font-mono">
                    {index + 1}
                  </td>
                  <td className="px-3 py-3">
                    <Link
                      href={`/collections/${getCollectionSlug(collection)}`}
                      className="flex items-center gap-3 group/link"
                    >
                      <div className="relative h-10 w-10 rounded-lg overflow-hidden shrink-0 ring-1 ring-border">
                        {collection.image ? (
                          <Image
                            src={collection.image}
                            alt={collection.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        ) : (
                          <div className="h-full w-full bg-muted" />
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="font-medium text-sm truncate group-hover/link:text-primary transition-colors">
                          {collection.name}
                        </span>
                        {collection.verified && (
                          <svg
                            className="h-4 w-4 fill-blue-500 shrink-0"
                            viewBox="0 -960 960 960"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="m344-60-76-128-144-32 14-148-98-112 98-112-14-148 144-32 76-128 136 58 136-58 76 128 144 32-14 148 98 112-98 112 14 148-144 32-76 128-136-58-136 58Zm94-278 226-226-56-58-170 170-86-84-56 56 142 142Z" />
                            <path
                              className="fill-white"
                              d="M438-338 L664-564 L608-622 L438-452 L352-538 L296-482 L438-338 Z"
                            />
                          </svg>
                        )}
                      </div>
                    </Link>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <div className="text-sm font-medium">{collection.floorPrice} ETH</div>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <span
                      className={cn(
                        "text-sm font-medium",
                        collection.change1d > 0
                          ? "text-green-500"
                          : collection.change1d < 0
                            ? "text-red-500"
                            : "text-muted-foreground"
                      )}
                    >
                      {collection.change1d > 0 ? "+" : ""}
                      {collection.change1d}%
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <div className="text-sm font-medium">{collection.volume24h} ETH</div>
                  </td>
                  <td className="px-3 py-3 text-right hidden lg:table-cell">
                    <div className="text-sm text-muted-foreground">{collection.sales1d}</div>
                  </td>
                  <td className="px-3 py-3 text-right hidden xl:table-cell">
                    <div className="text-sm text-muted-foreground">
                      {collection.ownerCount.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-3 py-3 text-right hidden xl:table-cell">
                    <div className="text-sm text-muted-foreground">
                      {collection.itemCount.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-3 py-3 text-right hidden md:table-cell">
                    <div className="flex justify-end">
                      <SparklineChart
                        data={collection.sparkline}
                        positive={collection.change1d >= 0}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
