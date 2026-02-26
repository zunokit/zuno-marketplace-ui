"use client";

import { useState, useMemo } from "react";
import { Input } from "@/shared/components/ui/input";
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
  SlidersHorizontal,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { type Collection } from "@/shared/types/marketplace";
import { mockCollections } from "@/shared/utils/mock/marketplace";
import { cn } from "@/shared/utils/tailwind-utils";

type SortKey = "volume" | "floor" | "change" | "totalVol" | "marketCap" | "topOffer" | "sales" | "owners" | "items";
type SortDir = "asc" | "desc";
type TimeWindow = "10m" | "1h" | "6h" | "1d" | "7d" | "30d";
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

function formatVolume(val: number): string {
  if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
  return val.toFixed(1);
}

function formatUsd(ethVal: number): string {
  const usd = ethVal * 2025;
  if (usd >= 1_000_000) return `$${(usd / 1_000_000).toFixed(1)}M`;
  if (usd >= 1000) return `$${(usd / 1000).toFixed(1)}K`;
  return `$${usd.toFixed(0)}`;
}

interface EnrichedCollection extends Collection {
  rank: number;
  change1d: number;
  volChange1d: number;
  sales1d: number;
  totalVol: number;
  marketCap: number;
  topOffer: number;
  listed: number;
  listedPct: number;
  ownerPct: number;
  sparkline: number[];
  starred: boolean;
  chain: string;
}

export function CollectionsList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("volume");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [timeWindow, setTimeWindow] = useState<TimeWindow>("1d");
  const [activeTab, setActiveTab] = useState<ActiveTab>("top");
  const [starredIds, setStarredIds] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);

  const enrichedCollections = useMemo(() => {
    const chains = ["Ethereum", "Polygon", "Solana", "Bitcoin", "Base"];
    const extended: EnrichedCollection[] = [];
    for (let i = 0; i < 25; i++) {
      const base = mockCollections[i % mockCollections.length];
      const change = (Math.random() - 0.5) * 40;
      const volChange = (Math.random() - 0.5) * 100;
      const floor = Math.random() * 5 + 0.01;
      const totalVol = Math.random() * 500000 + 1000;
      const supply = Math.floor(Math.random() * 20000) + 100;
      const owners = Math.floor(Math.random() * 10000) + 50;
      extended.push({
        ...base,
        address: `${base.address}-${i}`,
        name: i < 2 ? base.name : `${base.name} #${i}`,
        floorPrice: floor.toFixed(3),
        volume24h: (Math.random() * 200 + 1).toFixed(2),
        totalVolume: totalVol.toFixed(0),
        itemCount: supply,
        ownerCount: owners,
        rank: i + 1,
        change1d: parseFloat(change.toFixed(1)),
        volChange1d: parseFloat(volChange.toFixed(1)),
        sales1d: Math.floor(Math.random() * 2000) + 1,
        totalVol,
        marketCap: floor * supply,
        topOffer: floor * (0.85 + Math.random() * 0.1),
        listed: Math.floor(Math.random() * 500) + 1,
        listedPct: parseFloat((Math.random() * 10).toFixed(1)),
        ownerPct: parseFloat(((owners / supply) * 100).toFixed(1)),
        sparkline: generateSparkline(),
        starred: starredIds.has(`${base.address}-${i}`),
        chain: chains[i % chains.length],
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
    if (activeTab === "watchlist") list = list.filter(c => starredIds.has(c.address));
    if (searchQuery) list = list.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const getVal = (c: EnrichedCollection): number => {
      switch (sortKey) {
        case "volume": return parseFloat(c.volume24h || "0");
        case "floor": return parseFloat(c.floorPrice || "0");
        case "change": return c.change1d;
        case "totalVol": return c.totalVol;
        case "marketCap": return c.marketCap;
        case "topOffer": return c.topOffer;
        case "sales": return c.sales1d;
        case "owners": return c.ownerCount;
        case "items": return c.itemCount;
        default: return 0;
      }
    };

    list.sort((a, b) => sortDir === "desc" ? getVal(b) - getVal(a) : getVal(a) - getVal(b));
    return list;
  }, [enrichedCollections, searchQuery, sortKey, sortDir, activeTab, starredIds]);

  const getCollectionSlug = (collection: Collection) =>
    collection.name.toLowerCase().replace(/\s+/g, "-");

  const SortHeader = ({ label, sortKeyVal, className }: { label: string; sortKeyVal: SortKey; className?: string }) => {
    const active = sortKey === sortKeyVal;
    return (
      <button
        onClick={() => handleSort(sortKeyVal)}
        className={cn(
          "flex items-center gap-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70 hover:text-foreground transition-colors whitespace-nowrap",
          active && "text-foreground",
          className
        )}
      >
        {label}
        {active ? (
          sortDir === "desc" ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />
        ) : (
          <ArrowUpDown className="h-3 w-3 opacity-30" />
        )}
      </button>
    );
  };

  const timeWindows: TimeWindow[] = ["10m", "1h", "6h", "1d", "7d", "30d"];

  return (
    <div className="space-y-3">
      {/* Tab row */}
      <div className="flex items-center gap-6 border-b border-border/50">
        {(["top", "trending", "watchlist"] as ActiveTab[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "pb-2.5 text-sm font-medium capitalize transition-colors relative",
              activeTab === tab ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab === "top" && <TrendingUp className="h-3.5 w-3.5 inline mr-1.5 -mt-0.5" />}
            {tab === "trending" && <Flame className="h-3.5 w-3.5 inline mr-1.5 -mt-0.5" />}
            {tab === "watchlist" && <Bookmark className="h-3.5 w-3.5 inline mr-1.5 -mt-0.5" />}
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-pink-500 rounded-t" />
            )}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs gap-1.5"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filters
          </Button>
          <div className="relative w-56">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search collection"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-8 h-8 text-xs border-border/50"
            />
          </div>
        </div>
        <div className="flex items-center gap-1 bg-muted/30 rounded-md p-0.5">
          {timeWindows.map(tw => (
            <button
              key={tw}
              onClick={() => setTimeWindow(tw)}
              className={cn(
                "px-2 py-1 rounded text-[11px] font-medium transition-colors uppercase",
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

      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/30">
              <th className="w-8 px-2 py-2.5"></th>
              <th className="text-left px-3 py-2.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70 min-w-[200px]">
                Name
              </th>
              <th className="px-3 py-2.5 text-right">
                <SortHeader label="Floor" sortKeyVal="floor" className="justify-end" />
              </th>
              <th className="px-3 py-2.5 text-right hidden lg:table-cell">
                <SortHeader label="Total Volume" sortKeyVal="totalVol" className="justify-end" />
              </th>
              <th className="px-3 py-2.5 text-right hidden xl:table-cell">
                <SortHeader label="Market Cap" sortKeyVal="marketCap" className="justify-end" />
              </th>
              <th className="px-3 py-2.5 text-right hidden xl:table-cell">
                <SortHeader label="Top Offer" sortKeyVal="topOffer" className="justify-end" />
              </th>
              <th className="px-3 py-2.5 text-right">
                <SortHeader label={`Floor ${timeWindow} %`} sortKeyVal="change" className="justify-end" />
              </th>
              <th className="px-3 py-2.5 text-right">
                <SortHeader label={`Volume ${timeWindow}`} sortKeyVal="volume" className="justify-end" />
              </th>
              <th className="px-3 py-2.5 text-right hidden lg:table-cell">
                <SortHeader label={`Vol ${timeWindow} %`} sortKeyVal="sales" className="justify-end" />
              </th>
              <th className="px-3 py-2.5 text-right hidden lg:table-cell">
                <SortHeader label={`Sales ${timeWindow}`} sortKeyVal="sales" className="justify-end" />
              </th>
              <th className="px-3 py-2.5 text-right hidden xl:table-cell">
                <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">Listed</span>
              </th>
              <th className="px-3 py-2.5 text-right hidden xl:table-cell">
                <SortHeader label="Owners" sortKeyVal="owners" className="justify-end" />
              </th>
              <th className="px-3 py-2.5 text-right hidden md:table-cell w-24">
                <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
                  Last {timeWindow}
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSorted.length === 0 ? (
              <tr>
                <td colSpan={13} className="text-center py-16 text-muted-foreground text-sm">
                  {activeTab === "watchlist"
                    ? "No collections in your watchlist. Star collections to add them."
                    : "No collections found."}
                </td>
              </tr>
            ) : (
              filteredAndSorted.map((collection, index) => {
                const floor = parseFloat(collection.floorPrice || "0");
                return (
                  <tr
                    key={collection.address}
                    className="border-b border-border/20 hover:bg-muted/10 transition-colors group"
                  >
                    {/* Star + Rank */}
                    <td className="px-2 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={e => { e.preventDefault(); e.stopPropagation(); toggleStar(collection.address); }}
                          className="opacity-30 hover:opacity-100 group-hover:opacity-60 transition-opacity"
                        >
                          <Star className={cn("h-3.5 w-3.5", collection.starred ? "fill-yellow-400 text-yellow-400 !opacity-100" : "text-muted-foreground")} />
                        </button>
                        <span className="text-xs text-muted-foreground w-4 text-right">{index + 1}</span>
                      </div>
                    </td>
                    {/* Name */}
                    <td className="px-3 py-3">
                      <Link href={`/collections/${getCollectionSlug(collection)}`} className="flex items-center gap-2.5 group/link">
                        <div className="relative h-9 w-9 rounded-full overflow-hidden shrink-0 ring-1 ring-border/50">
                          {collection.image ? (
                            <Image src={collection.image} alt={collection.name} fill className="object-cover" sizes="36px" />
                          ) : (
                            <div className="h-full w-full bg-muted" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-medium text-sm truncate group-hover/link:text-primary transition-colors">
                              {collection.name}
                            </span>
                            {collection.verified && (
                              <svg className="h-4 w-4 fill-blue-500 shrink-0" viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg">
                                <path d="m344-60-76-128-144-32 14-148-98-112 98-112-14-148 144-32 76-128 136 58 136-58 76 128 144 32-14 148 98 112-98 112 14 148-144 32-76 128-136-58-136 58Zm94-278 226-226-56-58-170 170-86-84-56 56 142 142Z" />
                                <path className="fill-white" d="M438-338 L664-564 L608-622 L438-452 L352-538 L296-482 L438-338 Z" />
                              </svg>
                            )}
                          </div>
                        </div>
                      </Link>
                    </td>
                    {/* Floor */}
                    <td className="px-3 py-3 text-right">
                      <div className="text-sm font-medium">{collection.floorPrice} ETH</div>
                      <div className="text-[10px] text-muted-foreground">{formatUsd(floor)}</div>
                    </td>
                    {/* Total Volume */}
                    <td className="px-3 py-3 text-right hidden lg:table-cell">
                      <div className="text-sm font-medium">{formatVolume(collection.totalVol)} ETH</div>
                      <div className="text-[10px] text-muted-foreground">{formatUsd(collection.totalVol)}</div>
                    </td>
                    {/* Market Cap */}
                    <td className="px-3 py-3 text-right hidden xl:table-cell">
                      <div className="text-sm font-medium">{formatVolume(collection.marketCap)} ETH</div>
                      <div className="text-[10px] text-muted-foreground">{formatUsd(collection.marketCap)}</div>
                    </td>
                    {/* Top Offer */}
                    <td className="px-3 py-3 text-right hidden xl:table-cell">
                      <div className="text-sm font-medium">{collection.topOffer.toFixed(3)} ETH</div>
                      <div className="text-[10px] text-muted-foreground">{formatUsd(collection.topOffer)}</div>
                    </td>
                    {/* Floor Change % */}
                    <td className="px-3 py-3 text-right">
                      <span className={cn("text-sm font-medium",
                        collection.change1d > 0 ? "text-green-500" : collection.change1d < 0 ? "text-red-500" : "text-muted-foreground"
                      )}>
                        {collection.change1d > 0 ? "▲" : collection.change1d < 0 ? "▼" : ""}{" "}
                        {Math.abs(collection.change1d)}%
                      </span>
                    </td>
                    {/* Volume */}
                    <td className="px-3 py-3 text-right">
                      <div className="text-sm font-medium">{collection.volume24h} ETH</div>
                      <div className="text-[10px] text-muted-foreground">{formatUsd(parseFloat(collection.volume24h || "0"))}</div>
                    </td>
                    {/* Vol Change % */}
                    <td className="px-3 py-3 text-right hidden lg:table-cell">
                      <span className={cn("text-sm",
                        collection.volChange1d > 0 ? "text-green-500" : collection.volChange1d < 0 ? "text-red-500" : "text-muted-foreground"
                      )}>
                        {collection.volChange1d > 0 ? "▲" : collection.volChange1d < 0 ? "▼" : ""}{" "}
                        {Math.abs(collection.volChange1d)}%
                      </span>
                    </td>
                    {/* Sales */}
                    <td className="px-3 py-3 text-right hidden lg:table-cell">
                      <div className="text-sm text-muted-foreground">{collection.sales1d.toLocaleString()}</div>
                    </td>
                    {/* Listed */}
                    <td className="px-3 py-3 text-right hidden xl:table-cell">
                      <div className="text-sm text-muted-foreground">{collection.listed} ({collection.listedPct}%)</div>
                    </td>
                    {/* Owners */}
                    <td className="px-3 py-3 text-right hidden xl:table-cell">
                      <div className="text-sm text-muted-foreground">
                        {collection.ownerCount.toLocaleString()} ({collection.ownerPct}%)
                      </div>
                    </td>
                    {/* Sparkline */}
                    <td className="px-3 py-3 text-right hidden md:table-cell">
                      <div className="flex justify-end">
                        <SparklineChart data={collection.sparkline} positive={collection.change1d >= 0} />
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
