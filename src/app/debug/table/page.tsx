"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Table2, ArrowUpDown, MoreHorizontal, ExternalLink, Copy, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Checkbox } from "@/shared/components/ui/checkbox";

const nftData = [
  { id: "#1234", name: "Crypto Punk #7823", collection: "CryptoPunks", price: "2.5 ETH", usd: "$5,234", seller: "0x1234...5678", rarity: "rare", time: "2 min ago" },
  { id: "#4567", name: "Bored Ape #4567", collection: "BAYC", price: "15.2 ETH", usd: "$31,824", seller: "0xabcd...efgh", rarity: "legendary", time: "5 min ago" },
  { id: "#7890", name: "Art Blocks #1234", collection: "Art Blocks", price: "5.8 ETH", usd: "$12,146", seller: "0x9876...5432", rarity: "epic", time: "12 min ago" },
  { id: "#1111", name: "Doodle #9999", collection: "Doodles", price: "1.2 ETH", usd: "$2,512", seller: "0x2468...1357", rarity: "common", time: "25 min ago" },
  { id: "#2222", name: "Azuki #5678", collection: "Azuki", price: "8.5 ETH", usd: "$17,795", seller: "0xaaaa...bbbb", rarity: "epic", time: "1 hour ago" },
];

const transactionData = [
  { hash: "0x7a8f...3e2d", type: "Purchase", from: "0x1234...5678", to: "0xabcd...efgh", amount: "2.5 ETH", status: "success", time: "2 min ago" },
  { hash: "0x9b2c...4f1e", type: "Sale", from: "0xaaaa...bbbb", to: "0xcccc...dddd", amount: "5.0 ETH", status: "success", time: "15 min ago" },
  { hash: "0x3d4e...5f6a", type: "Transfer", from: "0xeeee...ffff", to: "0x1111...2222", amount: "1.0 ETH", status: "pending", time: "30 min ago" },
  { hash: "0x7g8h...9i0j", type: "Bid", from: "0x3333...4444", to: "Marketplace", amount: "3.2 ETH", status: "pending", time: "1 hour ago" },
  { hash: "0x1k2l...3m4n", type: "List", from: "0x5555...6666", to: "Marketplace", amount: "10.0 ETH", status: "success", time: "2 hours ago" },
];

export default function TableDebugPage() {
  const [selectedRows, setSelectedRows] = React.useState<string[]>([]);

  const toggleRow = (id: string) => {
    setSelectedRows(prev =>
      prev.includes(id) ? prev.filter(row => row !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedRows.length === nftData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(nftData.map(d => d.id));
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      {/* Page Header */}
      <div className="mx-auto max-w-6xl space-y-2 mb-10">
        <Link
          href="/debug"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Debug Dashboard
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-os-gray-400 flex items-center justify-center">
            <Table2 className="w-5 h-5 text-os-info" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Table Component
            </h1>
            <p className="text-muted-foreground">
              Data tables with sorting, selection, and pagination patterns
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-12">
        {/* Basic Table */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-foreground">Basic Table</h2>
            <Badge variant="secondary">Core</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Standard table with header, body, and caption.
          </p>

          <div className="rounded-lg border border-border-subtle overflow-hidden">
            <Table>
              <TableCaption>A list of recent NFT sales</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Collection</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Seller</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {nftData.slice(0, 3).map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.collection}</TableCell>
                    <TableCell>{item.price}</TableCell>
                    <TableCell className="font-mono text-xs">{item.seller}</TableCell>
                    <TableCell className="text-muted-foreground">{item.time}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        {/* Table with Badges */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-foreground">With Badges & Status</h2>
            <Badge variant="secondary">Enhanced</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Tables with status badges and action buttons.
          </p>

          <div className="rounded-lg border border-border-subtle overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactionData.map((tx) => (
                  <TableRow key={tx.hash}>
                    <TableCell className="font-mono text-xs">{tx.hash}</TableCell>
                    <TableCell>{tx.type}</TableCell>
                    <TableCell className="font-mono text-xs">{tx.from}</TableCell>
                    <TableCell className="font-mono text-xs">{tx.to}</TableCell>
                    <TableCell className="font-medium">{tx.amount}</TableCell>
                    <TableCell>
                      <Badge variant={tx.status === "success" ? "success" : "warning"}>
                        {tx.status === "success" ? (
                          <Check className="w-3 h-3 mr-1" />
                        ) : null}
                        {tx.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        {/* Selectable Table */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-foreground">Selectable Table</h2>
            <Badge variant="secondary">Interactive</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Table with row selection using checkboxes.
          </p>

          <div className="rounded-lg border border-border-subtle overflow-hidden">
            <div className="p-3 border-b border-border-subtle bg-frosted-1 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {selectedRows.length} of {nftData.length} selected
              </span>
              {selectedRows.length > 0 && (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">Export</Button>
                  <Button size="sm" variant="destructive">Delete</Button>
                </div>
              )}
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedRows.length === nftData.length}
                      onCheckedChange={toggleAll}
                    />
                  </TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Collection</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      Price
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </TableHead>
                  <TableHead>Rarity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {nftData.map((item) => (
                  <TableRow
                    key={item.id}
                    data-state={selectedRows.includes(item.id) ? "selected" : undefined}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.includes(item.id)}
                        onCheckedChange={() => toggleRow(item.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.collection}</TableCell>
                    <TableCell>
                      <div>
                        <span className="font-medium">{item.price}</span>
                        <span className="text-xs text-muted-foreground ml-1">({item.usd})</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.rarity as any}>{item.rarity}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        {/* NFT Marketplace Table */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-foreground">NFT Listings Table</h2>
            <Badge variant="secondary">Marketplace</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Full-featured table for NFT marketplace listings.
          </p>

          <div className="rounded-lg border border-border-subtle overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Image</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Rarity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>USD Value</TableHead>
                  <TableHead>Seller</TableHead>
                  <TableHead>Listed</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {nftData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="w-10 h-10 rounded bg-gradient-to-br from-primary/30 to-primary/10" />
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.collection}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.rarity as any} className="capitalize">
                        {item.rarity}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{item.price}</TableCell>
                    <TableCell className="text-muted-foreground">{item.usd}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs">{item.seller}</span>
                        <button className="text-muted-foreground hover:text-foreground">
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{item.time}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button size="sm">Buy</Button>
                        <Button size="sm" variant="ghost">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing 1-5 of 128 items
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </section>

        {/* Compact Table */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-foreground">Compact Table</h2>
            <Badge variant="secondary">Dense</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Smaller padding for data-dense views.
          </p>

          <div className="rounded-lg border border-border-subtle overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="h-8">
                  <TableHead className="py-2 text-xs">Rank</TableHead>
                  <TableHead className="py-2 text-xs">Collection</TableHead>
                  <TableHead className="py-2 text-xs text-right">Volume (24h)</TableHead>
                  <TableHead className="py-2 text-xs text-right">Floor</TableHead>
                  <TableHead className="py-2 text-xs text-right">Change</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { rank: 1, name: "CryptoPunks", volume: "1,250 ETH", floor: "65 ETH", change: "+12%" },
                  { rank: 2, name: "BAYC", volume: "890 ETH", floor: "45 ETH", change: "+5%" },
                  { rank: 3, name: "Azuki", volume: "650 ETH", floor: "12 ETH", change: "-3%" },
                  { rank: 4, name: "Doodles", volume: "420 ETH", floor: "8 ETH", change: "+8%" },
                  { rank: 5, name: "CloneX", volume: "380 ETH", floor: "6.5 ETH", change: "-1%" },
                ].map((item) => (
                  <TableRow key={item.rank} className="h-8">
                    <TableCell className="py-2 text-xs font-medium">{item.rank}</TableCell>
                    <TableCell className="py-2 text-xs">{item.name}</TableCell>
                    <TableCell className="py-2 text-xs text-right">{item.volume}</TableCell>
                    <TableCell className="py-2 text-xs text-right">{item.floor}</TableCell>
                    <TableCell className={`py-2 text-xs text-right ${item.change.startsWith("+") ? "text-os-success" : "text-os-error"}`}>
                      {item.change}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        {/* Empty State */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-foreground">Empty State</h2>
            <Badge variant="secondary">No Data</Badge>
          </div>

          <div className="rounded-lg border border-border-subtle overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={3} className="h-32 text-center">
                    <p className="text-muted-foreground">No items found</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Create Listing
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </section>

        {/* Table Features */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-foreground">Table Features</h2>
            <Badge variant="secondary">Summary</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-frosted-1 border border-border-subtle">
              <h4 className="font-medium mb-1">Row Selection</h4>
              <p className="text-sm text-muted-foreground">Checkbox-based row selection with batch actions</p>
            </div>
            <div className="p-4 rounded-lg bg-frosted-1 border border-border-subtle">
              <h4 className="font-medium mb-1">Hover States</h4>
              <p className="text-sm text-muted-foreground">Row hover effects for better interaction feedback</p>
            </div>
            <div className="p-4 rounded-lg bg-frosted-1 border border-border-subtle">
              <h4 className="font-medium mb-1">Responsive</h4>
              <p className="text-sm text-muted-foreground">Horizontal scroll on mobile devices</p>
            </div>
            <div className="p-4 rounded-lg bg-frosted-1 border border-border-subtle">
              <h4 className="font-medium mb-1">Accessible</h4>
              <p className="text-sm text-muted-foreground">Proper ARIA attributes and keyboard navigation</p>
            </div>
          </div>
        </section>

        {/* Usage Guidelines */}
        <div className="p-4 rounded-lg bg-frosted-1 border border-border-subtle">
          <h4 className="text-sm font-medium text-foreground mb-2">
            Table Component Guidelines
          </h4>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• Use tables for structured data with multiple columns</li>
            <li>• Include TableCaption for table descriptions</li>
            <li>• Use hover states for better interaction feedback</li>
            <li>• Implement row selection for bulk actions</li>
            <li>• Consider compact variant for data-dense views</li>
            <li>• Always handle empty states gracefully</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
