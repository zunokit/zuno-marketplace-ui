"use client";

import * as React from "react";
import Link from "next/link";
import { Badge } from "@/shared/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  EnhancedTooltipContent,
} from "@/shared/components/ui/tooltip";
import {
  ArrowLeft,
  Check,
  Info,
  AlertTriangle,
  X,
  Star,
  Zap,
  Crown,
  Gem,
  Shield,
  Clock,
  MousePointer,
  Copy,
  ExternalLink,
  Wallet,
  Heart,
  Share2,
  MoreHorizontal,
  Verified,
} from "lucide-react";

// ============================================
// BADGE & TOOLTIP DEBUG PAGE
// ============================================

export default function BadgeTooltipDebugPage() {
  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      {/* Page Header */}
      <div className="mx-auto max-w-6xl space-y-2 mb-10">
        <div className="flex items-center gap-2 mb-2">
          <Link
            href="/debug"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Debug
          </Link>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Badge & Tooltip Debug
        </h1>
        <p className="text-muted-foreground">
          Comprehensive showcase of badge variants, tooltip positions, and interaction patterns.
        </p>
      </div>

      <div className="mx-auto max-w-6xl space-y-12">
        {/* Section 1: Badge Variants */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-foreground">Badge Variants</h2>
            <Badge variant="secondary">Core variants</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Standard badge styles for different semantic purposes.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 p-6 rounded-lg bg-card border border-border">
            <div className="space-y-2 text-center">
              <Badge variant="default">Default</Badge>
              <p className="text-xs text-muted-foreground">Frosted glass</p>
            </div>
            <div className="space-y-2 text-center">
              <Badge variant="secondary">Secondary</Badge>
              <p className="text-xs text-muted-foreground">Alternative</p>
            </div>
            <div className="space-y-2 text-center">
              <Badge variant="outline">Outline</Badge>
              <p className="text-xs text-muted-foreground">Subtle border</p>
            </div>
            <div className="space-y-2 text-center">
              <Badge variant="destructive">Destructive</Badge>
              <p className="text-xs text-muted-foreground">Error/Danger</p>
            </div>
            <div className="space-y-2 text-center">
              <Badge variant="success">Success</Badge>
              <p className="text-xs text-muted-foreground">Verified/OK</p>
            </div>
            <div className="space-y-2 text-center">
              <Badge variant="info">Info</Badge>
              <p className="text-xs text-muted-foreground">Information</p>
            </div>
          </div>
        </section>

        {/* Section 2: Badge with Icons */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-foreground">Badge with Icons</h2>
            <Badge variant="secondary">Enhanced visual</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Badges with leading and trailing icons for better visual communication.
          </p>

          <div className="space-y-6 p-6 rounded-lg bg-card border border-border">
            {/* Leading Icons */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Leading Icons</p>
              <div className="flex flex-wrap gap-3">
                <Badge variant="success">
                  <Check className="w-3 h-3" />
                  Verified
                </Badge>
                <Badge variant="info">
                  <Info className="w-3 h-3" />
                  Info
                </Badge>
                <Badge variant="warning">
                  <AlertTriangle className="w-3 h-3" />
                  Warning
                </Badge>
                <Badge variant="destructive">
                  <X className="w-3 h-3" />
                  Failed
                </Badge>
              </div>
            </div>

            {/* Trailing Icons */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Trailing Icons</p>
              <div className="flex flex-wrap gap-3">
                <Badge variant="default">
                  New
                  <Star className="w-3 h-3" />
                </Badge>
                <Badge variant="secondary">
                  Featured
                  <Zap className="w-3 h-3" />
                </Badge>
                <Badge variant="outline">
                  External
                  <ExternalLink className="w-3 h-3" />
                </Badge>
              </div>
            </div>

            {/* NFT Marketplace Specific */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">NFT Marketplace Patterns</p>
              <div className="flex flex-wrap gap-3">
                <Badge variant="legendary">
                  <Crown className="w-3 h-3" />
                  Legendary
                </Badge>
                <Badge variant="epic">
                  <Gem className="w-3 h-3" />
                  Epic
                </Badge>
                <Badge variant="rare">
                  <Star className="w-3 h-3" />
                  Rare
                </Badge>
                <Badge variant="success">
                  <Shield className="w-3 h-3" />
                  Authentic
                </Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: New Badge Variants */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-foreground">Enhanced Badge Variants</h2>
            <Badge variant="secondary">New</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            New badge variants with frosted glass, gradient, glow, and subtle styles.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 p-6 rounded-lg bg-card border border-border">
            <div className="space-y-2 text-center">
              <Badge variant="frosted">Frosted</Badge>
              <p className="text-xs text-muted-foreground">Blur effect</p>
            </div>
            <div className="space-y-2 text-center">
              <Badge variant="gradient">Gradient</Badge>
              <p className="text-xs text-muted-foreground">Primary glow</p>
            </div>
            <div className="space-y-2 text-center">
              <Badge variant="glow">Glow</Badge>
              <p className="text-xs text-muted-foreground">Info glow</p>
            </div>
            <div className="space-y-2 text-center">
              <Badge variant="subtle">Subtle</Badge>
              <p className="text-xs text-muted-foreground">Minimal</p>
            </div>
            <div className="space-y-2 text-center">
              <Badge variant="dot" className="text-os-success">Dot</Badge>
              <p className="text-xs text-muted-foreground">Status dot</p>
            </div>
            <div className="space-y-2 text-center">
              <Badge variant="epic">Epic</Badge>
              <p className="text-xs text-muted-foreground">NFT rarity</p>
            </div>
            <div className="space-y-2 text-center">
              <Badge variant="warning">Warning</Badge>
              <p className="text-xs text-muted-foreground">Caution</p>
            </div>
          </div>
        </section>

        {/* Section 4: Badge Groups */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-foreground">Badge Groups</h2>
            <Badge variant="secondary">Grouped badges</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Multiple badges grouped together for status indicators and filters.
          </p>

          <div className="space-y-6 p-6 rounded-lg bg-card border border-border">
            {/* Status Group */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Status Indicators</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="success">Active</Badge>
                <Badge variant="warning">Pending</Badge>
                <Badge variant="destructive">Failed</Badge>
                <Badge variant="info">Processing</Badge>
                <Badge variant="outline">Draft</Badge>
              </div>
            </div>

            {/* NFT Rarity Group */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">NFT Rarity Tiers</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="legendary">Legendary</Badge>
                <Badge variant="epic">Epic</Badge>
                <Badge variant="rare">Rare</Badge>
                <Badge variant="default">Common</Badge>
              </div>
            </div>

            {/* Filter Group */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Filter Tags</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="cursor-pointer hover:bg-os-gray-300">
                  Art
                  <X className="w-3 h-3 ml-1" />
                </Badge>
                <Badge variant="secondary" className="cursor-pointer hover:bg-os-gray-300">
                  Collectibles
                  <X className="w-3 h-3 ml-1" />
                </Badge>
                <Badge variant="secondary" className="cursor-pointer hover:bg-os-gray-300">
                  Music
                  <X className="w-3 h-3 ml-1" />
                </Badge>
                <Badge variant="secondary" className="cursor-pointer hover:bg-os-gray-300">
                  Photography
                  <X className="w-3 h-3 ml-1" />
                </Badge>
              </div>
            </div>

            {/* Inline with Text */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Inline with Text</p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  This NFT collection has <Badge variant="success">5,000 items</Badge> with{" "}
                  <Badge variant="legendary">100 legendary</Badge> pieces.
                </p>
                <p>
                  Transaction status: <Badge variant="warning">Pending confirmation</Badge> {" "}
                  <Badge variant="info">~2 mins</Badge>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Tooltip Positions */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-foreground">Tooltip Positions</h2>
            <Badge variant="secondary">4 positions</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Tooltips can appear on any side of the trigger element.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-8 p-10 rounded-lg bg-card border border-border">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="px-4 py-2 rounded-md bg-frosted-2 border border-border-subtle text-sm hover:bg-os-gray-400 transition-colors">
                    Top Tooltip
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Tooltip on top</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="px-4 py-2 rounded-md bg-frosted-2 border border-border-subtle text-sm hover:bg-os-gray-400 transition-colors">
                    Bottom Tooltip
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Tooltip on bottom</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="px-4 py-2 rounded-md bg-frosted-2 border border-border-subtle text-sm hover:bg-os-gray-400 transition-colors">
                    Left Tooltip
                  </button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>Tooltip on left</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="px-4 py-2 rounded-md bg-frosted-2 border border-border-subtle text-sm hover:bg-os-gray-400 transition-colors">
                    Right Tooltip
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Tooltip on right</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </section>

        {/* Section 5: Tooltip with Rich Content */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-foreground">Rich Content Tooltips</h2>
            <Badge variant="secondary">Complex content</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Tooltips can contain rich content including icons, badges, and formatted text.
          </p>

          <div className="flex flex-wrap items-center gap-6 p-6 rounded-lg bg-card border border-border">
            {/* NFT Card Preview */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-frosted-2 border border-border-subtle text-sm hover:bg-os-gray-400 transition-colors">
                    <Info className="w-4 h-4" />
                    NFT Details
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-gradient-to-br from-purple-500 to-pink-500" />
                      <div>
                        <p className="font-medium text-foreground">Bored Ape #1234</p>
                        <p className="text-xs text-muted-foreground">BAYC Collection</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-2 border-t border-border-subtle">
                      <Badge variant="legendary" className="text-xs">Legendary</Badge>
                      <span className="text-xs text-os-success">2.5 ETH</span>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Wallet Info */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-frosted-2 border border-border-subtle text-sm hover:bg-os-gray-400 transition-colors">
                    <Wallet className="w-4 h-4" />
                    Wallet Info
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Balance</span>
                      <span className="font-medium">12.45 ETH</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Network</span>
                      <Badge variant="success" className="text-xs">Mainnet</Badge>
                    </div>
                    <div className="flex items-center gap-2 pt-2 border-t border-border-subtle">
                      <button className="flex items-center gap-1 text-xs text-os-info hover:underline">
                        <Copy className="w-3 h-3" />
                        Copy Address
                      </button>
                      <button className="flex items-center gap-1 text-xs text-os-info hover:underline">
                        <ExternalLink className="w-3 h-3" />
                        View
                      </button>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Transaction Status */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-frosted-2 border border-border-subtle text-sm hover:bg-os-gray-400 transition-colors">
                    <Clock className="w-4 h-4" />
                    Transaction
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-os-warning animate-pulse" />
                      <span className="font-medium">Pending</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Transaction is being processed on the blockchain.
                    </p>
                    <div className="text-xs text-muted-foreground">
                      Hash: <span className="font-mono">0x7a8f...3e2d</span>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* User Profile */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-frosted-2 border border-border-subtle text-sm hover:bg-os-gray-400 transition-colors">
                    <Verified className="w-4 h-4 text-os-info" />
                    Creator
                  </button>
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-xs">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                        JD
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">John Doe</span>
                          <Badge variant="success" className="text-[10px] px-1 py-0">
                            <Check className="w-2 h-2" />
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">@johndoe</p>
                      </div>
                    </div>
                    <div className="flex gap-3 pt-2 text-xs">
                      <span><strong>1.2K</strong> items</span>
                      <span><strong>45K</strong> followers</span>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </section>

        {/* Section 6: Tooltip Delay */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-foreground">Tooltip Delay</h2>
            <Badge variant="secondary">Timing control</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Tooltips can have custom delay durations for better UX.
          </p>

          <div className="flex flex-wrap items-center gap-6 p-6 rounded-lg bg-card border border-border">
            {/* Instant */}
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-frosted-2 border border-border-subtle text-sm hover:bg-os-gray-400 transition-colors">
                    <Zap className="w-4 h-4" />
                    Instant (0ms)
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Appears immediately</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Fast */}
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-frosted-2 border border-border-subtle text-sm hover:bg-os-gray-400 transition-colors">
                    <MousePointer className="w-4 h-4" />
                    Fast (200ms)
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Quick appearance</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Normal */}
            <TooltipProvider delayDuration={500}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-frosted-2 border border-border-subtle text-sm hover:bg-os-gray-400 transition-colors">
                    <Clock className="w-4 h-4" />
                    Normal (500ms)
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Standard delay</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Slow */}
            <TooltipProvider delayDuration={1000}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-frosted-2 border border-border-subtle text-sm hover:bg-os-gray-400 transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                    Slow (1000ms)
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delayed appearance</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </section>

        {/* Section 7: Badge & Tooltip Combinations */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-foreground">Badge + Tooltip Combinations</h2>
            <Badge variant="secondary">Interactive badges</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Badges enhanced with tooltips for additional context.
          </p>

          <div className="flex flex-wrap items-center gap-6 p-6 rounded-lg bg-card border border-border">
            {/* Verified Badge with Tooltip */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="cursor-help">
                    <Badge variant="success" className="cursor-help">
                      <Verified className="w-3 h-3" />
                      Verified
                    </Badge>
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>This account has been verified by our team</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Legendary Badge with Tooltip */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="cursor-help">
                    <Badge variant="legendary" className="cursor-help">
                      <Crown className="w-3 h-3" />
                      Legendary
                    </Badge>
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="space-y-1">
                    <p className="font-medium">Legendary Rarity</p>
                    <p className="text-xs text-muted-foreground">Only 1% of items have this rarity</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Gas Price Badge */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="cursor-help">
                    <Badge variant="info" className="cursor-help">
                      <Zap className="w-3 h-3" />
                      Low Gas
                    </Badge>
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="space-y-1">
                    <p className="font-medium">Gas Price: 12 Gwei</p>
                    <p className="text-xs text-muted-foreground">Estimated: $2.50</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Network Badge */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="cursor-help">
                    <Badge variant="secondary" className="cursor-help">
                      <div className="w-2 h-2 rounded-full bg-os-success" />
                      Ethereum
                    </Badge>
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="space-y-1">
                    <p className="font-medium">Ethereum Mainnet</p>
                    <p className="text-xs text-muted-foreground">Block: 18,234,567</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </section>

        {/* Section 8: NFT Marketplace Use Cases */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-foreground">NFT Marketplace Use Cases</h2>
            <Badge variant="secondary">Real-world examples</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Common patterns for badges and tooltips in NFT marketplace interfaces.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-lg bg-card border border-border">
            {/* NFT Card */}
            <div className="space-y-4 p-4 rounded-lg bg-os-gray-400 border border-border">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-foreground">Crypto Punk #7823</h3>
                  <p className="text-sm text-muted-foreground">Larva Labs</p>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="p-1.5 rounded-md hover:bg-os-gray-300 transition-colors">
                        <Heart className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add to favorites</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="rare">Rare</Badge>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="cursor-help">
                        <Badge variant="success" className="text-xs cursor-help">
                          <Check className="w-2 h-2" />
                          Verified
                        </Badge>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Verified collection</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div className="flex items-center gap-1">
                  <span className="font-medium">2.5 ETH</span>
                  <span className="text-xs text-muted-foreground">($5,234)</span>
                </div>
                <div className="flex items-center gap-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="p-1.5 rounded-md hover:bg-os-gray-300 transition-colors">
                          <Share2 className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Share item</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="p-1.5 rounded-md hover:bg-os-gray-300 transition-colors">
                          <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>More options</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>

            {/* Transaction Item */}
            <div className="space-y-4 p-4 rounded-lg bg-os-gray-400 border border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500" />
                  <div>
                    <h3 className="font-medium text-foreground">Purchase</h3>
                    <p className="text-sm text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="cursor-help">
                        <Badge variant="warning" className="cursor-help">
                          <Clock className="w-3 h-3" />
                          Pending
                        </Badge>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="space-y-1">
                        <p>Waiting for confirmation</p>
                        <p className="text-xs text-muted-foreground">~3 more blocks</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-medium">1.2 ETH</span>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-border">
                <Badge variant="outline" className="text-xs">
                  Transfer
                </Badge>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="cursor-help">
                        <Badge variant="info" className="text-xs cursor-help">
                          <Info className="w-2 h-2" />
                          Gas: 0.002 ETH
                        </Badge>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Gas fees are estimated</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </section>

        {/* Section 9: Enhanced Tooltip Variants */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-foreground">Enhanced Tooltip Variants</h2>
            <Badge variant="secondary">Colored</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Tooltips with semantic color variants for different contexts.
          </p>

          <div className="flex flex-wrap items-center gap-6 p-6 rounded-lg bg-card border border-border">
            {/* Default */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="px-4 py-2 rounded-md bg-frosted-2 border border-border-subtle text-sm hover:bg-os-gray-400 transition-colors">
                    Default
                  </button>
                </TooltipTrigger>
                <EnhancedTooltipContent>
                  <p>Standard frosted glass tooltip</p>
                </EnhancedTooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Info */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="px-4 py-2 rounded-md bg-frosted-2 border border-border-subtle text-sm hover:bg-os-gray-400 transition-colors">
                    Info
                  </button>
                </TooltipTrigger>
                <EnhancedTooltipContent variant="info">
                  <p>Information tooltip with blue styling</p>
                </EnhancedTooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Success */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="px-4 py-2 rounded-md bg-frosted-2 border border-border-subtle text-sm hover:bg-os-gray-400 transition-colors">
                    Success
                  </button>
                </TooltipTrigger>
                <EnhancedTooltipContent variant="success">
                  <p>Success tooltip with green styling</p>
                </EnhancedTooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Warning */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="px-4 py-2 rounded-md bg-frosted-2 border border-border-subtle text-sm hover:bg-os-gray-400 transition-colors">
                    Warning
                  </button>
                </TooltipTrigger>
                <EnhancedTooltipContent variant="warning">
                  <p>Warning tooltip with amber styling</p>
                </EnhancedTooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Error */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="px-4 py-2 rounded-md bg-frosted-2 border border-border-subtle text-sm hover:bg-os-gray-400 transition-colors">
                    Error
                  </button>
                </TooltipTrigger>
                <EnhancedTooltipContent variant="error">
                  <p>Error tooltip with red styling</p>
                </EnhancedTooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </section>

        {/* Section 10: Accessibility */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-foreground">Accessibility</h2>
            <Badge variant="secondary">WCAG 2.2</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Accessible patterns for badges and tooltips.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-lg bg-card border border-border">
            {/* Keyboard Navigation */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Keyboard Navigation</p>
              <div className="flex flex-wrap gap-3">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="px-4 py-2 rounded-md bg-frosted-2 border border-border-subtle text-sm hover:bg-os-gray-400 transition-colors focus-visible:ring-2 focus-visible:ring-primary">
                        Tab to Focus
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>This tooltip is keyboard accessible</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-xs text-muted-foreground">
                Use Tab to navigate, Enter or Space to activate.
              </p>
            </div>

            {/* Screen Reader Support */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Screen Reader Support</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="success" aria-label="Status: Verified">
                  <Check className="w-3 h-3" />
                  Verified
                </Badge>
                <Badge variant="destructive" aria-label="Status: Error">
                  <X className="w-3 h-3" />
                  Error
                </Badge>
                <Badge variant="warning" aria-label="Status: Warning">
                  <AlertTriangle className="w-3 h-3" />
                  Warning
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Badges include aria-labels for screen reader context.
              </p>
            </div>
          </div>
        </section>

        {/* Info Section */}
        <div className="mt-10 p-4 rounded-lg bg-frosted-1 border border-border-subtle">
          <h4 className="text-sm font-medium text-foreground mb-2">
            About Badge & Tooltip Components
          </h4>
          <p className="text-sm text-muted-foreground">
            Badges use a 6px border radius with consistent padding and support multiple
            semantic variants. Tooltips are built on Radix UI with frosted glass styling,
            smooth animations, and customizable positioning. Both components follow the
            OpenSea design system with proper focus indicators and keyboard accessibility.
          </p>
        </div>
      </div>
    </div>
  );
}
