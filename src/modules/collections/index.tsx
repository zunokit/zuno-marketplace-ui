"use client";

import { useState, useMemo, useRef } from "react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/shared/components/ui/table";
import {
  Search,
  Star,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
  Flame,
  Bookmark,
  SlidersHorizontal,
  BadgeCheck,
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

function SparklineChart({ positive }: { data: number[]; positive: boolean }) {
  return positive ? (
    <TrendingUp className="h-4 w-4 text-success" />
  ) : (
    <TrendingDown className="h-4 w-4 text-destructive" />
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

  const baseCollections = useRef<Omit<Row, "starred">[] | null>(null);
  if (baseCollections.current === null) {
    const chains = ["Ethereum", "Polygon", "Solana", "Bitcoin", "Base"];
    const data: Omit<Row, "starred">[] = [];
    for (let i = 0; i < 25; i++) {
      const b = mockCollections[i % mockCollections.length];
      const fl = Math.random() * 5 + 0.01;
      const tv = Math.random() * 500000 + 1000;
      const supply = Math.floor(Math.random() * 20000) + 100;
      const owners = Math.floor(Math.random() * 10000) + 50;
      data.push({
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
        sparkline: generateSparkline(), chain: chains[i % chains.length],
      });
    }
    baseCollections.current = data;
  }

  const rows = useMemo(() => {
    return (baseCollections.current ?? []).map(c => ({ ...c, starred: starredIds.has(c.address) }));
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
      <Button variant="ghost" size="sm" onClick={() => handleSort(k)} className={cn(
        "flex items-center gap-0.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60 hover:text-foreground/80 transition-colors whitespace-nowrap h-auto py-0 px-0",
        on && "text-foreground/80", className
      )}>
        {label}
        {on ? (sortDir === "desc" ? <ChevronDown className="h-2.5 w-2.5" /> : <ChevronUp className="h-2.5 w-2.5" />) : <ArrowUpDown className="h-2.5 w-2.5 opacity-0 group-hover:opacity-30" />}
      </Button>
    );
  };

  return (
    <div className="space-y-2">
      {/* Tabs */}
      <div className="flex items-center gap-0 border-b border-border/30 overflow-x-auto scrollbar-hide">
        {(["top", "trending", "watchlist"] satisfies ActiveTab[]).map(t => (
          <Button
            key={t}
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab(t)}
            className={cn(
              "px-3 pb-2 pt-0.5 text-[13px] font-medium capitalize transition-colors whitespace-nowrap h-auto rounded-none",
              activeTab === t ? "text-foreground shadow-[inset_0_-2px_0_0_hsl(var(--primary))]" : "text-muted-foreground/60 hover:text-foreground/80"
            )}
          >
            {t === "top" && <TrendingUp className="h-3 w-3 inline mr-1 -mt-0.5" />}
            {t === "trending" && <Flame className="h-3 w-3 inline mr-1 -mt-0.5" />}
            {t === "watchlist" && <Bookmark className="h-3 w-3 inline mr-1 -mt-0.5" />}
            {t}
          </Button>
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
          {(["10m","1h","6h","1d","7d","30d"] satisfies TimeWindow[]).map(tw => (
            <Button
              key={tw}
              variant={timeWindow === tw ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setTimeWindow(tw)}
              className="px-1.5 py-0.5 h-auto text-[10px] font-medium transition-colors uppercase rounded"
            >{tw}</Button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border/20">
            <TableHead className="w-14 px-1.5 py-2"></TableHead>
            <TableHead className="text-left px-2 py-2 min-w-[160px]">
              <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60">Name</span>
            </TableHead>
            <TableHead className="px-2 py-2 text-right"><SH label="Floor" k="floor" className="justify-end" /></TableHead>
            <TableHead className="px-2 py-2 text-right hidden lg:table-cell"><SH label="Total Volume" k="totalVol" className="justify-end" /></TableHead>
            <TableHead className="px-2 py-2 text-right hidden xl:table-cell"><SH label="Market Cap" k="marketCap" className="justify-end" /></TableHead>
            <TableHead className="px-2 py-2 text-right hidden xl:table-cell"><SH label="Top Offer" k="topOffer" className="justify-end" /></TableHead>
            <TableHead className="px-2 py-2 text-right"><SH label={`Floor ${timeWindow} %`} k="change" className="justify-end" /></TableHead>
            <TableHead className="px-2 py-2 text-right"><SH label={`Volume ${timeWindow}`} k="volume" className="justify-end" /></TableHead>
            <TableHead className="px-2 py-2 text-right hidden lg:table-cell"><SH label={`Vol ${timeWindow} %`} k="sales" className="justify-end" /></TableHead>
            <TableHead className="px-2 py-2 text-right hidden lg:table-cell"><SH label={`Sales ${timeWindow}`} k="sales" className="justify-end" /></TableHead>
            <TableHead className="px-2 py-2 text-right hidden xl:table-cell">
              <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60">Listed</span>
            </TableHead>
            <TableHead className="px-2 py-2 text-right hidden xl:table-cell"><SH label="Owners" k="owners" className="justify-end" /></TableHead>
            <TableHead className="px-2 py-2 text-right hidden md:table-cell w-16">
              <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60">Last {timeWindow}</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.length === 0 ? (
            <TableRow><TableCell colSpan={13} className="text-center py-12 text-muted-foreground/60 text-xs">
              {activeTab === "watchlist" ? "No collections in watchlist." : "No collections found."}
            </TableCell></TableRow>
          ) : filtered.map((c, i) => {
              const fl = parseFloat(c.floorPrice || "0");
              return (
                <TableRow key={c.address} className="border-b border-border/10 hover:bg-muted/5 transition-colors group">
                  <TableCell className="px-1.5 py-2">
                    <div className="flex items-center gap-1.5">
                      <Button variant="ghost" size="icon" onClick={e => { e.preventDefault(); e.stopPropagation(); toggleStar(c.address); }}
                        className="opacity-20 hover:opacity-100 group-hover:opacity-50 transition-opacity h-auto w-auto p-0.5">
                        <Star className={cn("h-3 w-3", c.starred ? "fill-warning text-warning" : "text-muted-foreground")} />
                      </Button>
                      <span className="text-[11px] text-muted-foreground/50 w-4 text-right font-mono">{i + 1}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-2 py-2">
                    <Link href={`/collections/${slug(c)}`} className="flex items-center gap-2 group/link">
                      <div className="relative h-8 w-8 rounded-full overflow-hidden shrink-0 ring-1 ring-white/10">
                        {c.image ? <Image src={c.image} alt={c.name} fill className="object-cover" sizes="32px" /> : <div className="h-full w-full bg-muted" />}
                      </div>
                      <div className="flex items-center gap-1 min-w-0">
                        <span className="font-medium text-[13px] truncate group-hover/link:text-primary transition-colors">{c.name}</span>
                        {c.verified && (
                          <BadgeCheck className="h-3.5 w-3.5 text-info shrink-0" />
                        )}
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell className="px-2 py-2 text-right">
                    <div className="text-[13px] font-medium">{c.floorPrice} ETH</div>
                    <div className="text-[10px] text-muted-foreground/40">{fmtUsd(fl)}</div>
                  </TableCell>
                  <TableCell className="px-2 py-2 text-right hidden lg:table-cell">
                    <div className="text-[13px] font-medium">{fmtVol(c.totalVol)} ETH</div>
                    <div className="text-[10px] text-muted-foreground/40">{fmtUsd(c.totalVol)}</div>
                  </TableCell>
                  <TableCell className="px-2 py-2 text-right hidden xl:table-cell">
                    <div className="text-[13px] font-medium">{fmtVol(c.marketCap)} ETH</div>
                    <div className="text-[10px] text-muted-foreground/40">{fmtUsd(c.marketCap)}</div>
                  </TableCell>
                  <TableCell className="px-2 py-2 text-right hidden xl:table-cell">
                    <div className="text-[13px] font-medium">{c.topOffer.toFixed(3)} ETH</div>
                    <div className="text-[10px] text-muted-foreground/40">{fmtUsd(c.topOffer)}</div>
                  </TableCell>
                  <TableCell className="px-2 py-2 text-right">
                    <span className={cn("text-[13px] font-medium",
                      c.change1d > 0 ? "text-success" : c.change1d < 0 ? "text-destructive" : "text-muted-foreground/60"
                    )}>{c.change1d > 0 ? "▲" : c.change1d < 0 ? "▼" : ""} {Math.abs(c.change1d)}%</span>
                  </TableCell>
                  <TableCell className="px-2 py-2 text-right">
                    <div className="text-[13px] font-medium">{c.volume24h} ETH</div>
                    <div className="text-[10px] text-muted-foreground/40">{fmtUsd(parseFloat(c.volume24h || "0"))}</div>
                  </TableCell>
                  <TableCell className="px-2 py-2 text-right hidden lg:table-cell">
                    <span className={cn("text-[13px]",
                      c.volChange1d > 0 ? "text-success" : c.volChange1d < 0 ? "text-destructive" : "text-muted-foreground/60"
                    )}>{c.volChange1d > 0 ? "▲" : c.volChange1d < 0 ? "▼" : ""} {Math.abs(c.volChange1d)}%</span>
                  </TableCell>
                  <TableCell className="px-2 py-2 text-right hidden lg:table-cell">
                    <span className="text-[13px] text-muted-foreground/60">{c.sales1d.toLocaleString()}</span>
                  </TableCell>
                  <TableCell className="px-2 py-2 text-right hidden xl:table-cell">
                    <span className="text-[13px] text-muted-foreground/60">{c.listed} ({c.listedPct}%)</span>
                  </TableCell>
                  <TableCell className="px-2 py-2 text-right hidden xl:table-cell">
                    <span className="text-[13px] text-muted-foreground/60">{c.ownerCount.toLocaleString()} ({c.ownerPct}%)</span>
                  </TableCell>
                  <TableCell className="px-2 py-2 text-right hidden md:table-cell">
                    <div className="flex justify-end"><SparklineChart data={c.sparkline} positive={c.change1d >= 0} /></div>
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </div>
  );
}
