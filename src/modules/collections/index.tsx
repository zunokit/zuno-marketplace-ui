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
  const pts: number[] = [];
  let v = 50 + Math.random() * 30;
  for (let i = 0; i < 7; i++) { v += (Math.random() - 0.5) * 20; pts.push(Math.max(10, Math.min(90, v))); }
  return pts;
}

function SparklineChart({ data, positive }: { data: number[]; positive: boolean }) {
  const min = Math.min(...data), max = Math.max(...data), range = max - min || 1;
  const h = 28, w = 56;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");
  return (
    <svg width={w} height={h} className="shrink-0">
      <polyline fill="none" stroke={positive ? "#22c55e" : "#ef4444"} strokeWidth="1.5" points={points} />
    </svg>
  );
}

function fmtVol(v: number): string { return v >= 1000 ? `${(v / 1000).toFixed(1)}K` : v.toFixed(1); }
function fmtUsd(eth: number): string {
  const u = eth * 2025;
  if (u >= 1e6) return `$${(u / 1e6).toFixed(1)}M`;
  if (u >= 1000) return `$${(u / 1000).toFixed(1)}K`;
  return `$${u.toFixed(0)}`;
}

interface Row extends Collection {
  rank: number; change1d: number; volChange1d: number; sales1d: number;
  totalVol: number; marketCap: number; topOffer: number; listed: number;
  listedPct: number; ownerPct: number; sparkline: number[]; starred: boolean; chain: string;
}

export function CollectionsList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("volume");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [timeWindow, setTimeWindow] = useState<TimeWindow>("1d");
  const [activeTab, setActiveTab] = useState<ActiveTab>("top");
  const [starredIds, setStarredIds] = useState<Set<string>>(new Set());

  const rows = useMemo(() => {
    const chains = ["Ethereum", "Polygon", "Solana", "Bitcoin", "Base"];
    const out: Row[] = [];
    for (let i = 0; i < 25; i++) {
      const b = mockCollections[i % mockCollections.length];
      const fl = Math.random() * 5 + 0.01;
      const tv = Math.random() * 500000 + 1000;
      const supply = Math.floor(Math.random() * 20000) + 100;
      const owners = Math.floor(Math.random() * 10000) + 50;
      out.push({
        ...b, address: `${b.address}-${i}`, name: i < 2 ? b.name : `${b.name} #${i}`,
        floorPrice: fl.toFixed(3), volume24h: (Math.random() * 200 + 1).toFixed(2),
        totalVolume: tv.toFixed(0), itemCount: supply, ownerCount: owners,
        rank: i + 1, change1d: parseFloat(((Math.random() - 0.5) * 40).toFixed(1)),
        volChange1d: parseFloat(((Math.random() - 0.5) * 100).toFixed(1)),
        sales1d: Math.floor(Math.random() * 2000) + 1, totalVol: tv,
        marketCap: fl * supply, topOffer: fl * (0.85 + Math.random() * 0.1),
        listed: Math.floor(Math.random() * 500) + 1,
        listedPct: parseFloat((Math.random() * 10).toFixed(1)),
        ownerPct: parseFloat(((owners / supply) * 100).toFixed(1)),
        sparkline: generateSparkline(), starred: starredIds.has(`${b.address}-${i}`),
        chain: chains[i % chains.length],
      });
    }
    return out;
  }, [starredIds]);

  const toggleStar = (addr: string) => {
    setStarredIds(p => { const n = new Set(p); n.has(addr) ? n.delete(addr) : n.add(addr); return n; });
  };
  const handleSort = (k: SortKey) => { sortKey === k ? setSortDir(d => d === "desc" ? "asc" : "desc") : (setSortKey(k), setSortDir("desc")); };

  const filtered = useMemo(() => {
    let l = [...rows];
    if (activeTab === "watchlist") l = l.filter(c => starredIds.has(c.address));
    if (searchQuery) l = l.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const gv = (c: Row): number => {
      switch (sortKey) {
        case "volume": return parseFloat(c.volume24h || "0"); case "floor": return parseFloat(c.floorPrice || "0");
        case "change": return c.change1d; case "totalVol": return c.totalVol; case "marketCap": return c.marketCap;
        case "topOffer": return c.topOffer; case "sales": return c.sales1d; case "owners": return c.ownerCount;
        case "items": return c.itemCount; default: return 0;
      }
    };
    l.sort((a, b) => sortDir === "desc" ? gv(b) - gv(a) : gv(a) - gv(b));
    return l;
  }, [rows, searchQuery, sortKey, sortDir, activeTab, starredIds]);

  const slug = (c: Collection) => c.name.toLowerCase().replace(/\s+/g, "-");

  const SH = ({ label, k, className }: { label: string; k: SortKey; className?: string }) => {
    const on = sortKey === k;
    return (
      <button onClick={() => handleSort(k)} className={cn(
        "flex items-center gap-0.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60 hover:text-foreground/80 transition-colors whitespace-nowrap",
        on && "text-foreground/80", className
      )}>
        {label}
        {on ? (sortDir === "desc" ? <ChevronDown className="h-2.5 w-2.5" /> : <ChevronUp className="h-2.5 w-2.5" />) : <ArrowUpDown className="h-2.5 w-2.5 opacity-0 group-hover:opacity-30" />}
      </button>
    );
  };

  return (
    <div className="space-y-2">
      {/* Tabs */}
      <div className="flex items-center gap-0 border-b border-border/30 overflow-x-auto scrollbar-hide">
        {(["top", "trending", "watchlist"] as ActiveTab[]).map(t => (
          <button key={t} onClick={() => setActiveTab(t)} className={cn(
            "px-3 pb-2 pt-0.5 text-[13px] font-medium capitalize transition-colors whitespace-nowrap",
            activeTab === t ? "text-foreground shadow-[inset_0_-2px_0_0_#ec4899]" : "text-muted-foreground/60 hover:text-foreground/80"
          )}>
            {t === "top" && <TrendingUp className="h-3 w-3 inline mr-1 -mt-0.5" />}
            {t === "trending" && <Flame className="h-3 w-3 inline mr-1 -mt-0.5" />}
            {t === "watchlist" && <Bookmark className="h-3 w-3 inline mr-1 -mt-0.5" />}
            {t}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Button variant="outline" size="sm" className="h-7 text-[11px] gap-1 px-2 border-border/30">
            <SlidersHorizontal className="h-3 w-3" /> Filters
          </Button>
          <div className="relative w-48">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground/50" />
            <Input placeholder="Search collection" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="pl-7 h-7 text-[11px] border-border/30 bg-transparent" />
          </div>
        </div>
        <div className="flex items-center gap-0.5 bg-muted/20 rounded p-0.5">
          {(["10m","1h","6h","1d","7d","30d"] as TimeWindow[]).map(tw => (
            <button key={tw} onClick={() => setTimeWindow(tw)} className={cn(
              "px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors uppercase",
              timeWindow === tw ? "bg-background text-foreground shadow-sm" : "text-muted-foreground/50 hover:text-foreground/70"
            )}>{tw}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/20">
              <th className="w-14 px-1.5 py-2"></th>
              <th className="text-left px-2 py-2 min-w-[160px]">
                <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60">Name</span>
              </th>
              <th className="px-2 py-2 text-right"><SH label="Floor" k="floor" className="justify-end" /></th>
              <th className="px-2 py-2 text-right hidden lg:table-cell"><SH label="Total Volume" k="totalVol" className="justify-end" /></th>
              <th className="px-2 py-2 text-right hidden xl:table-cell"><SH label="Market Cap" k="marketCap" className="justify-end" /></th>
              <th className="px-2 py-2 text-right hidden xl:table-cell"><SH label="Top Offer" k="topOffer" className="justify-end" /></th>
              <th className="px-2 py-2 text-right"><SH label={`Floor ${timeWindow} %`} k="change" className="justify-end" /></th>
              <th className="px-2 py-2 text-right"><SH label={`Volume ${timeWindow}`} k="volume" className="justify-end" /></th>
              <th className="px-2 py-2 text-right hidden lg:table-cell"><SH label={`Vol ${timeWindow} %`} k="sales" className="justify-end" /></th>
              <th className="px-2 py-2 text-right hidden lg:table-cell"><SH label={`Sales ${timeWindow}`} k="sales" className="justify-end" /></th>
              <th className="px-2 py-2 text-right hidden xl:table-cell">
                <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60">Listed</span>
              </th>
              <th className="px-2 py-2 text-right hidden xl:table-cell"><SH label="Owners" k="owners" className="justify-end" /></th>
              <th className="px-2 py-2 text-right hidden md:table-cell w-16">
                <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60">Last {timeWindow}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={13} className="text-center py-12 text-muted-foreground/60 text-xs">
                {activeTab === "watchlist" ? "No collections in watchlist." : "No collections found."}
              </td></tr>
            ) : filtered.map((c, i) => {
              const fl = parseFloat(c.floorPrice || "0");
              return (
                <tr key={c.address} className="border-b border-border/10 hover:bg-muted/5 transition-colors group">
                  <td className="px-1.5 py-2">
                    <div className="flex items-center gap-1.5">
                      <button onClick={e => { e.preventDefault(); e.stopPropagation(); toggleStar(c.address); }}
                        className="opacity-20 hover:opacity-100 group-hover:opacity-50 transition-opacity">
                        <Star className={cn("h-3 w-3", c.starred ? "fill-yellow-400 text-yellow-400 !opacity-100" : "text-muted-foreground")} />
                      </button>
                      <span className="text-[11px] text-muted-foreground/50 w-4 text-right font-mono">{i + 1}</span>
                    </div>
                  </td>
                  <td className="px-2 py-2">
                    <Link href={`/collections/${slug(c)}`} className="flex items-center gap-2 group/link">
                      <div className="relative h-8 w-8 rounded-full overflow-hidden shrink-0 ring-1 ring-white/10">
                        {c.image ? <Image src={c.image} alt={c.name} fill className="object-cover" sizes="32px" /> : <div className="h-full w-full bg-muted" />}
                      </div>
                      <div className="flex items-center gap-1 min-w-0">
                        <span className="font-medium text-[13px] truncate group-hover/link:text-primary transition-colors">{c.name}</span>
                        {c.verified && (
                          <svg className="h-3.5 w-3.5 fill-blue-500 shrink-0" viewBox="0 -960 960 960"><path d="m344-60-76-128-144-32 14-148-98-112 98-112-14-148 144-32 76-128 136 58 136-58 76 128 144 32-14 148 98 112-98 112 14 148-144 32-76 128-136-58-136 58Zm94-278 226-226-56-58-170 170-86-84-56 56 142 142Z" /><path className="fill-white" d="M438-338 L664-564 L608-622 L438-452 L352-538 L296-482 L438-338 Z" /></svg>
                        )}
                      </div>
                    </Link>
                  </td>
                  <td className="px-2 py-2 text-right">
                    <div className="text-[13px] font-medium">{c.floorPrice} ETH</div>
                    <div className="text-[10px] text-muted-foreground/40">{fmtUsd(fl)}</div>
                  </td>
                  <td className="px-2 py-2 text-right hidden lg:table-cell">
                    <div className="text-[13px] font-medium">{fmtVol(c.totalVol)} ETH</div>
                    <div className="text-[10px] text-muted-foreground/40">{fmtUsd(c.totalVol)}</div>
                  </td>
                  <td className="px-2 py-2 text-right hidden xl:table-cell">
                    <div className="text-[13px] font-medium">{fmtVol(c.marketCap)} ETH</div>
                    <div className="text-[10px] text-muted-foreground/40">{fmtUsd(c.marketCap)}</div>
                  </td>
                  <td className="px-2 py-2 text-right hidden xl:table-cell">
                    <div className="text-[13px] font-medium">{c.topOffer.toFixed(3)} ETH</div>
                    <div className="text-[10px] text-muted-foreground/40">{fmtUsd(c.topOffer)}</div>
                  </td>
                  <td className="px-2 py-2 text-right">
                    <span className={cn("text-[13px] font-medium",
                      c.change1d > 0 ? "text-green-500" : c.change1d < 0 ? "text-red-500" : "text-muted-foreground/60"
                    )}>{c.change1d > 0 ? "▲" : c.change1d < 0 ? "▼" : ""} {Math.abs(c.change1d)}%</span>
                  </td>
                  <td className="px-2 py-2 text-right">
                    <div className="text-[13px] font-medium">{c.volume24h} ETH</div>
                    <div className="text-[10px] text-muted-foreground/40">{fmtUsd(parseFloat(c.volume24h || "0"))}</div>
                  </td>
                  <td className="px-2 py-2 text-right hidden lg:table-cell">
                    <span className={cn("text-[13px]",
                      c.volChange1d > 0 ? "text-green-500" : c.volChange1d < 0 ? "text-red-500" : "text-muted-foreground/60"
                    )}>{c.volChange1d > 0 ? "▲" : c.volChange1d < 0 ? "▼" : ""} {Math.abs(c.volChange1d)}%</span>
                  </td>
                  <td className="px-2 py-2 text-right hidden lg:table-cell">
                    <span className="text-[13px] text-muted-foreground/60">{c.sales1d.toLocaleString()}</span>
                  </td>
                  <td className="px-2 py-2 text-right hidden xl:table-cell">
                    <span className="text-[13px] text-muted-foreground/60">{c.listed} ({c.listedPct}%)</span>
                  </td>
                  <td className="px-2 py-2 text-right hidden xl:table-cell">
                    <span className="text-[13px] text-muted-foreground/60">{c.ownerCount.toLocaleString()} ({c.ownerPct}%)</span>
                  </td>
                  <td className="px-2 py-2 text-right hidden md:table-cell">
                    <div className="flex justify-end"><SparklineChart data={c.sparkline} positive={c.change1d >= 0} /></div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
