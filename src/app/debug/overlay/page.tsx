"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Layers,
  MoreVertical,
  User,
  Settings,
  LogOut,
  CreditCard,
  Bell,
  FileText,
  HelpCircle,
  ExternalLink,
  Copy,
  Share2,
  Heart,
  ShoppingCart,
  Check,
  ChevronRight,
  Wallet,
  BarChart3,
} from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/shared/components/ui/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/shared/components/ui/hover-card";

export default function OverlayDebugPage() {
  const [position, setPosition] = React.useState("bottom");

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
            <Layers className="w-5 h-5 text-os-info" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Overlay Components
            </h1>
            <p className="text-muted-foreground">
              Popovers, dropdown menus, and hover cards for interactive UI
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-12">
        {/* Dropdown Menu */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-foreground">Dropdown Menu</h2>
            <Badge variant="secondary">Navigation</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Dropdown menus for navigation and actions.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* User Menu */}
            <div className="p-6 rounded-lg border border-border-subtle bg-frosted-1">
              <p className="text-sm font-medium mb-4">User Menu</p>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <User className="w-4 h-4 mr-2" />
                    Account
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                      <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Billing
                      <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                      <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Actions Menu */}
            <div className="p-6 rounded-lg border border-border-subtle bg-frosted-1">
              <p className="text-sm font-medium mb-4">Actions Menu</p>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary">
                    <MoreVertical className="w-4 h-4 mr-2" />
                    Actions
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Link
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open in New Tab
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* NFT Actions */}
            <div className="p-6 rounded-lg border border-border-subtle bg-frosted-1">
              <p className="text-sm font-medium mb-4">NFT Actions</p>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Buy Options
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Buy Now
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Heart className="mr-2 h-4 w-4" />
                    Add to Favorites
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Activity
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Item
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View on Etherscan
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Checkbox & Radio Dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-lg border border-border-subtle bg-frosted-1">
              <p className="text-sm font-medium mb-4">With Checkboxes</p>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Filter Options</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Categories</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem checked>
                    Art
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked>
                    Collectibles
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>
                    Music
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>
                    Photography
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="p-6 rounded-lg border border-border-subtle bg-frosted-1">
              <p className="text-sm font-medium mb-4">With Radio Items</p>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Sort By</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Sort Order</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
                    <DropdownMenuRadioItem value="top">Price: Low to High</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="bottom">Price: High to Low</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="right">Recently Listed</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="left">Most Viewed</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </section>

        {/* Popover */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-foreground">Popover</h2>
            <Badge variant="secondary">Content</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Popovers for displaying rich content and forms.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* User Profile Popover */}
            <div className="p-6 rounded-lg border border-border-subtle bg-frosted-1">
              <p className="text-sm font-medium mb-4">User Profile</p>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">View Profile</Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/50" />
                    <div className="flex-1">
                      <h4 className="font-semibold">John Doe</h4>
                      <p className="text-sm text-muted-foreground">@johndoe</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Badge variant="success" className="text-xs">
                          <Check className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border-subtle">
                    <div className="text-center">
                      <p className="font-semibold">142</p>
                      <p className="text-xs text-muted-foreground">Items</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold">12.5K</p>
                      <p className="text-xs text-muted-foreground">Followers</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold">89</p>
                      <p className="text-xs text-muted-foreground">Following</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" className="flex-1">Follow</Button>
                    <Button size="sm" variant="outline">Message</Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* NFT Preview Popover */}
            <div className="p-6 rounded-lg border border-border-subtle bg-frosted-1">
              <p className="text-sm font-medium mb-4">NFT Preview</p>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">Preview NFT</Button>
                </PopoverTrigger>
                <PopoverContent className="w-72">
                  <div className="space-y-3">
                    <div className="aspect-square rounded-lg bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500" />
                    <div>
                      <h4 className="font-semibold">Crypto Punk #7823</h4>
                      <p className="text-sm text-muted-foreground">Larva Labs</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="rare">Rare</Badge>
                      <span className="font-medium">2.5 ETH</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">Buy Now</Button>
                      <Button size="sm" variant="outline">Offer</Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Wallet Info Popover */}
            <div className="p-6 rounded-lg border border-border-subtle bg-frosted-1">
              <p className="text-sm font-medium mb-4">Wallet Info</p>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="secondary">
                    <Wallet className="w-4 h-4 mr-2" />
                    Wallet
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Balance</span>
                      <span className="font-semibold">12.45 ETH</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Network</span>
                      <Badge variant="success" className="text-xs">Mainnet</Badge>
                    </div>
                    <div className="p-3 rounded-lg bg-frosted-1">
                      <p className="text-xs text-muted-foreground mb-1">Address</p>
                      <div className="flex items-center gap-2">
                        <code className="text-xs font-mono">0x1234...5678</code>
                        <Button size="icon" variant="ghost" className="h-6 w-6">
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        Disconnect
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </section>

        {/* Hover Card */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-foreground">Hover Card</h2>
            <Badge variant="secondary">Preview</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Hover cards for previewing content on mouse hover.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* User Preview */}
            <div className="p-6 rounded-lg border border-border-subtle bg-frosted-1">
              <p className="text-sm font-medium mb-4">User Preview</p>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="link">@johndoe</Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-64">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/50" />
                    <div>
                      <h4 className="font-semibold">John Doe</h4>
                      <p className="text-sm text-muted-foreground">@johndoe</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    NFT collector and digital art enthusiast. Building the future of web3.
                  </p>
                  <div className="flex gap-3 mt-3 text-sm">
                    <span><strong>142</strong> items</span>
                    <span><strong>12.5K</strong> followers</span>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>

            {/* NFT Preview */}
            <div className="p-6 rounded-lg border border-border-subtle bg-frosted-1">
              <p className="text-sm font-medium mb-4">NFT Preview</p>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="link">Crypto Punk #7823</Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-60">
                  <div className="aspect-square rounded-lg bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 mb-3" />
                  <h4 className="font-semibold">Crypto Punk #7823</h4>
                  <p className="text-sm text-muted-foreground">Larva Labs</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="rare" className="text-xs">Rare</Badge>
                    <span className="text-sm font-medium">2.5 ETH</span>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>

            {/* Transaction Preview */}
            <div className="p-6 rounded-lg border border-border-subtle bg-frosted-1">
              <p className="text-sm font-medium mb-4">Transaction Preview</p>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="link">0x7a8f...3e2d</Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-64">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="success">Success</Badge>
                      <span className="text-xs text-muted-foreground">2 min ago</span>
                    </div>
                    <div className="text-sm">
                      <p><span className="text-muted-foreground">From:</span> 0x1234...5678</p>
                      <p><span className="text-muted-foreground">To:</span> 0xabcd...efgh</p>
                      <p><span className="text-muted-foreground">Amount:</span> 2.5 ETH</p>
                    </div>
                    <Button size="sm" variant="outline" className="w-full">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      View on Etherscan
                    </Button>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
          </div>
        </section>

        {/* NFT Marketplace Examples */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-foreground">NFT Marketplace Patterns</h2>
            <Badge variant="secondary">Real-world</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Common overlay patterns for NFT marketplace interfaces.
          </p>

          <div className="p-6 rounded-lg border border-border-subtle bg-frosted-1">
            <div className="flex flex-wrap items-center gap-4">
              {/* Connected Wallet */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-primary/50" />
                    0x1234...5678
                    <ChevronRight className="w-4 h-4 rotate-90" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Connected Wallet</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="px-2 py-1.5">
                    <p className="text-xs text-muted-foreground">Balance</p>
                    <p className="font-semibold">12.45 ETH</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Heart className="mr-2 h-4 w-4" />
                    Favorites
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileText className="mr-2 h-4 w-4" />
                    My Listings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Disconnect
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Notifications */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Bell className="w-4 h-4" />
                    Notifications
                    <Badge variant="default" className="ml-1 h-5 min-w-5 px-1">3</Badge>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">Notifications</h4>
                      <Button variant="ghost" size="sm">Mark all read</Button>
                    </div>
                    <div className="space-y-2">
                      {[
                        { title: "Bid Accepted", desc: "Your bid on Crypto Punk #7823 was accepted", time: "2 min ago" },
                        { title: "New Follower", desc: "@alice started following you", time: "1 hour ago" },
                        { title: "Price Drop", desc: "An item in your watchlist dropped 10%", time: "3 hours ago" },
                      ].map((notif, i) => (
                        <div key={i} className="flex gap-3 p-2 rounded-lg hover:bg-frosted-1 cursor-pointer">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{notif.title}</p>
                            <p className="text-xs text-muted-foreground truncate">{notif.desc}</p>
                            <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Help */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <HelpCircle className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <FileText className="mr-2 h-4 w-4" />
                    Documentation
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Support Center
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Bell className="mr-2 h-4 w-4" />
                    What's New
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </section>

        {/* Usage Guidelines */}
        <div className="p-4 rounded-lg bg-frosted-1 border border-border-subtle">
          <h4 className="text-sm font-medium text-foreground mb-2">
            Overlay Component Guidelines
          </h4>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• <strong>Dropdown Menu:</strong> Use for navigation menus and action lists</li>
            <li>• <strong>Popover:</strong> Use for displaying rich content, forms, or details on click</li>
            <li>• <strong>Hover Card:</strong> Use for quick previews when hovering over elements</li>
            <li>• All overlays support keyboard navigation and accessibility</li>
            <li>• Use appropriate trigger sizing and clear visual indicators</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
