'use client';

import React from 'react';

// ============================================================================
// COLOR USAGE IMPROVEMENTS SECTION
// Shows real-world examples comparing standard vs improved color usage
// ============================================================================

export function ColorUsageImprovements() {
  return (
    <div className="space-y-12">
      {/* Section Header */}
      <div className="border-b border-border pb-4">
        <h2 className="text-2xl font-semibold text-foreground">Color Usage Improvements</h2>
        <p className="text-muted-foreground mt-2">
          Real-world examples comparing standard color usage with enhanced implementations featuring
          better gradients, frosted glass overlays, improved contrast, and semantic color application.
        </p>
      </div>

      {/* Cards Comparison */}
      <CardsComparison />

      {/* Buttons Comparison */}
      <ButtonsComparison />

      {/* Tags/Badges Comparison */}
      <TagsComparison />

      {/* NFT Cards with Rarity Colors */}
      <NFTCardsComparison />

      {/* Background Layering */}
      <BackgroundLayeringComparison />
    </div>
  );
}

// ============================================================================
// CARDS COMPARISON
// ============================================================================

function CardsComparison() {
  return (
    <section className="space-y-6">
      <h3 className="text-lg font-medium text-foreground">Cards</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Standard Cards */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Standard Usage
          </h4>
          <div className="p-6 bg-card border border-border rounded-lg space-y-4">
            {/* Basic Card */}
            <div className="p-4 bg-muted rounded-md">
              <p className="text-foreground font-medium">Basic Card</p>
              <p className="text-muted-foreground text-sm">Simple muted background</p>
            </div>

            {/* Card with Border */}
            <div className="p-4 bg-card border border-border rounded-md">
              <p className="text-foreground font-medium">Bordered Card</p>
              <p className="text-muted-foreground text-sm">Card background with border</p>
            </div>

            {/* Accent Card */}
            <div className="p-4 bg-accent rounded-md">
              <p className="text-accent-foreground font-medium">Accent Card</p>
              <p className="text-sm opacity-80">Using accent background</p>
            </div>
          </div>
        </div>

        {/* Improved Cards */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Improved Usage
          </h4>
          <div className="p-6 bg-gradient-to-br from-card via-card to-muted border border-border rounded-lg space-y-4">
            {/* Gradient Card with Glass Effect */}
            <div className="p-4 bg-gradient-to-r from-frosted-2 to-frosted-1 border border-border-medium rounded-md backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-os-rare to-os-epic flex items-center justify-center text-white font-bold text-sm">
                  N
                </div>
                <div>
                  <p className="text-foreground font-medium">Gradient Glass Card</p>
                  <p className="text-muted-foreground text-sm">Frosted glass with gradient bg</p>
                </div>
              </div>
            </div>

            {/* Card with Glow Border */}
            <div className="p-4 bg-card rounded-md border border-os-rare/30 shadow-[0_0_15px_rgba(0,163,255,0.1)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-foreground font-medium">Glow Border Card</p>
                  <p className="text-os-rare text-sm">Rare rarity indicator</p>
                </div>
                <span className="badge-os-rare">Rare</span>
              </div>
            </div>

            {/* Layered Card with Depth */}
            <div className="p-4 bg-gradient-to-b from-frosted-2 to-transparent border border-border-subtle rounded-md relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-os-epic/50 to-transparent" />
              <p className="text-foreground font-medium">Layered Depth Card</p>
              <p className="text-muted-foreground text-sm">Top border glow with gradient fade</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// BUTTONS COMPARISON
// ============================================================================

function ButtonsComparison() {
  return (
    <section className="space-y-6">
      <h3 className="text-lg font-medium text-foreground">Buttons</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Standard Buttons */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Standard Usage
          </h4>
          <div className="p-6 bg-card border border-border rounded-lg">
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium">
                Primary
              </button>
              <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md font-medium border border-border">
                Secondary
              </button>
              <button className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md font-medium">
                Destructive
              </button>
              <button className="px-4 py-2 bg-success text-success-foreground rounded-md font-medium">
                Success
              </button>
            </div>
          </div>
        </div>

        {/* Improved Buttons */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Improved Usage
          </h4>
          <div className="p-6 bg-card border border-border rounded-lg">
            <div className="flex flex-wrap gap-3">
              {/* Gradient Primary Button */}
              <button className="px-4 py-2 bg-gradient-to-r from-primary to-primary-600 text-primary-foreground rounded-md font-medium hover:shadow-lg hover:shadow-primary/20 transition-all">
                Gradient Primary
              </button>

              {/* Glass Secondary Button */}
              <button className="px-4 py-2 bg-frosted-2 text-foreground rounded-md font-medium border border-border-medium backdrop-blur-sm hover:bg-frosted-6 transition-all">
                Glass Button
              </button>

              {/* Gradient Destructive */}
              <button className="px-4 py-2 bg-gradient-to-r from-os-error to-red-600 text-white rounded-md font-medium hover:shadow-lg hover:shadow-os-error/20 transition-all">
                Gradient Alert
              </button>

              {/* Success with Glow */}
              <button className="px-4 py-2 bg-gradient-to-r from-os-success to-green-600 text-white rounded-md font-medium shadow-[0_0_15px_rgba(71,187,100,0.3)] hover:shadow-[0_0_20px_rgba(71,187,100,0.4)] transition-all">
                Success Glow
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Gradient Variants */}
      <div className="p-6 bg-gradient-to-br from-card to-muted border border-border rounded-lg">
        <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
          Advanced Gradient Combinations
        </h4>
        <div className="flex flex-wrap gap-3">
          {/* Rarity Gradient Buttons */}
          <button className="px-4 py-2 bg-gradient-to-r from-os-rare to-blue-600 text-white rounded-md font-medium border border-os-rare/30 shadow-[0_0_10px_rgba(0,163,255,0.2)]">
            Rare Gradient
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-os-epic to-purple-600 text-white rounded-md font-medium border border-os-epic/30 shadow-[0_0_10px_rgba(211,88,255,0.2)]">
            Epic Gradient
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-os-legendary to-amber-600 text-white rounded-md font-medium border border-os-legendary/30 shadow-[0_0_10px_rgba(255,138,0,0.2)]">
            Legendary Gradient
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-gray-500 via-os-rare to-os-epic text-white rounded-md font-medium">
            Multi-Color
          </button>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// TAGS/BADGES COMPARISON
// ============================================================================

function TagsComparison() {
  return (
    <section className="space-y-6">
      <h3 className="text-lg font-medium text-foreground">Tags / Badges</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Standard Tags */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Standard Usage
          </h4>
          <div className="p-6 bg-card border border-border rounded-lg">
            <div className="flex flex-wrap gap-2">
              <span className="badge-os-success">Success</span>
              <span className="badge-os-error">Error</span>
              <span className="badge-os-rare">Rare</span>
              <span className="badge-os-epic">Epic</span>
              <span className="badge-os-legendary">Legendary</span>
            </div>
          </div>
        </div>

        {/* Improved Tags with Glass Effect */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Improved with Glass Effect
          </h4>
          <div className="p-6 bg-card border border-border rounded-lg">
            <div className="flex flex-wrap gap-2">
              {/* Glass Success */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success-bg-light/50 text-os-success border border-success-border/50 backdrop-blur-sm text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-os-success animate-pulse" />
                Live
              </span>

              {/* Glass Error */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-error-bg-light/50 text-os-error border border-error-border/50 backdrop-blur-sm text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-os-error" />
                Failed
              </span>

              {/* Gradient Rare */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-os-rare/20 to-os-rare/5 text-os-rare border border-os-rare/40 backdrop-blur-sm text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-os-rare shadow-[0_0_6px_rgba(0,163,255,0.8)]" />
                Rare
              </span>

              {/* Gradient Epic */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-os-epic/20 to-os-epic/5 text-os-epic border border-os-epic/40 backdrop-blur-sm text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-os-epic shadow-[0_0_6px_rgba(211,88,255,0.8)]" />
                Epic
              </span>

              {/* Gradient Legendary with Shine */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-os-legendary/30 via-os-legendary/10 to-os-legendary/30 text-os-legendary border border-os-legendary/50 backdrop-blur-sm text-xs font-medium relative overflow-hidden">
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer" />
                <span className="w-1.5 h-1.5 rounded-full bg-os-legendary shadow-[0_0_8px_rgba(255,138,0,1)]" />
                Legendary
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="p-6 bg-gradient-to-br from-card to-muted border border-border rounded-lg">
        <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
          Status Indicators with Semantic Colors
        </h4>
        <div className="flex flex-wrap gap-4">
          {/* Online Status */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-frosted-1 border border-border-subtle">
            <div className="relative">
              <div className="w-2.5 h-2.5 rounded-full bg-os-success" />
              <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-os-success animate-ping opacity-75" />
            </div>
            <span className="text-sm text-foreground">Online</span>
          </div>

          {/* Warning Status */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-warning-bg-light/30 border border-warning-border/50">
            <div className="w-2.5 h-2.5 rounded-full bg-os-warning" />
            <span className="text-sm text-os-warning">Pending</span>
          </div>

          {/* Info Status */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-info-bg-light/30 border border-info-border/50">
            <div className="w-2.5 h-2.5 rounded-full bg-os-info" />
            <span className="text-sm text-os-info">Processing</span>
          </div>

          {/* Verified Badge */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-os-rare/20 to-os-epic/20 border border-os-rare/30">
            <svg className="w-4 h-4 text-os-rare" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-foreground">Verified</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// NFT CARDS COMPARISON
// ============================================================================

function NFTCardsComparison() {
  const nfts = [
    { id: 1, name: 'Cosmic Cube #001', rarity: 'common', price: '0.05 ETH', color: '#9ca3af' },
    { id: 2, name: 'Digital Dragon #042', rarity: 'uncommon', price: '0.15 ETH', color: '#22c55e' },
    { id: 3, name: 'Neon Phoenix #777', rarity: 'rare', price: '0.5 ETH', color: '#00a3ff' },
    { id: 4, name: 'Galaxy Guardian #001', rarity: 'epic', price: '2.0 ETH', color: '#d358ff' },
    { id: 5, name: 'Ethereal Crown #001', rarity: 'legendary', price: '10.0 ETH', color: '#ff8a00' },
  ];

  return (
    <section className="space-y-6">
      <h3 className="text-lg font-medium text-foreground">NFT Cards with Rarity Colors</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Standard NFT Cards */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Standard Usage
          </h4>
          <div className="p-6 bg-card border border-border rounded-lg space-y-3">
            {nfts.map((nft) => (
              <div key={nft.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <div
                  className="w-12 h-12 rounded-lg flex-shrink-0"
                  style={{ backgroundColor: nft.color }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-foreground font-medium truncate">{nft.name}</p>
                  <p className="text-muted-foreground text-sm capitalize">{nft.rarity}</p>
                </div>
                <span className="text-foreground font-medium">{nft.price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Improved NFT Cards */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Improved Usage
          </h4>
          <div className="p-6 bg-gradient-to-br from-card to-muted border border-border rounded-lg space-y-3">
            {nfts.map((nft) => (
              <NFTCardImproved key={nft.id} nft={nft} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function NFTCardImproved({ nft }: { nft: { id: number; name: string; rarity: string; price: string; color: string } }) {
  const rarityStyles: Record<string, { bg: string; border: string; glow: string; badge: string }> = {
    common: {
      bg: 'from-gray-500/10 to-transparent',
      border: 'border-gray-500/20',
      glow: '',
      badge: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    },
    uncommon: {
      bg: 'from-green-500/10 to-transparent',
      border: 'border-green-500/20',
      glow: '',
      badge: 'bg-green-500/20 text-green-400 border-green-500/30',
    },
    rare: {
      bg: 'from-os-rare/15 to-transparent',
      border: 'border-os-rare/30',
      glow: 'shadow-[0_0_15px_rgba(0,163,255,0.1)]',
      badge: 'bg-os-rare/20 text-os-rare border-os-rare/40',
    },
    epic: {
      bg: 'from-os-epic/15 to-transparent',
      border: 'border-os-epic/30',
      glow: 'shadow-[0_0_15px_rgba(211,88,255,0.1)]',
      badge: 'bg-os-epic/20 text-os-epic border-os-epic/40',
    },
    legendary: {
      bg: 'from-os-legendary/20 via-os-legendary/5 to-transparent',
      border: 'border-os-legendary/40',
      glow: 'shadow-[0_0_20px_rgba(255,138,0,0.15)]',
      badge: 'bg-gradient-to-r from-os-legendary/30 to-os-legendary/10 text-os-legendary border-os-legendary/50',
    },
  };

  const style = rarityStyles[nft.rarity] || rarityStyles.common;

  return (
    <div
      className={`flex items-center gap-3 p-3 bg-gradient-to-r ${style.bg} border ${style.border} rounded-lg ${style.glow} backdrop-blur-sm hover:border-opacity-50 transition-all group`}
    >
      <div
        className="w-12 h-12 rounded-lg flex-shrink-0 relative overflow-hidden"
        style={{ backgroundColor: nft.color }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        {nft.rarity === 'legendary' && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-foreground font-medium truncate">{nft.name}</p>
        <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium border ${style.badge} backdrop-blur-sm`}>
          {nft.rarity}
        </span>
      </div>
      <div className="text-right">
        <p className="text-foreground font-semibold">{nft.price}</p>
        <p className="text-muted-foreground text-xs">$1,234</p>
      </div>
    </div>
  );
}

// ============================================================================
// BACKGROUND LAYERING COMPARISON
// ============================================================================

function BackgroundLayeringComparison() {
  return (
    <section className="space-y-6">
      <h3 className="text-lg font-medium text-foreground">Background Layering</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Standard Background */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Standard Usage
          </h4>
          <div className="p-6 bg-background border border-border rounded-lg space-y-4">
            <div className="p-4 bg-card rounded-lg">
              <p className="text-foreground font-medium">Card on Background</p>
              <p className="text-muted-foreground text-sm">Simple layering</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-foreground font-medium">Muted Section</p>
              <p className="text-muted-foreground text-sm">Subtle distinction</p>
            </div>
          </div>
        </div>

        {/* Improved Background Layering */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Improved Usage
          </h4>
          <div className="p-6 bg-gradient-to-br from-background via-card to-muted border border-border rounded-lg space-y-4 relative overflow-hidden">
            {/* Decorative gradient orbs */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-os-rare/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-os-epic/10 rounded-full blur-3xl" />

            {/* Layered Card with Depth */}
            <div className="p-4 bg-frosted-2 border border-border-medium rounded-lg backdrop-blur-md relative">
              <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-os-rare/50 to-transparent" />
              <p className="text-foreground font-medium">Layered Card with Depth</p>
              <p className="text-muted-foreground text-sm">Frosted glass with top accent</p>
            </div>

            {/* Nested Layering */}
            <div className="p-4 bg-gradient-to-b from-frosted-1 to-transparent border border-border-subtle rounded-lg">
              <p className="text-foreground font-medium mb-2">Nested Sections</p>
              <div className="p-3 bg-frosted-2/50 border border-border-subtle rounded-md">
                <p className="text-sm text-muted-foreground">Inner content with subtle border</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Layering Example */}
      <div className="p-6 bg-card border border-border rounded-lg">
        <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
          Advanced Layering with All Techniques
        </h4>
        <div className="relative p-6 rounded-xl bg-gradient-to-br from-card via-muted to-background border border-border overflow-hidden">
          {/* Background effects */}
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-os-rare/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-os-epic/5 rounded-full blur-3xl" />

          {/* Content */}
          <div className="relative space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-os-rare to-os-epic flex items-center justify-center text-white font-bold shadow-lg shadow-os-rare/20">
                  Z
                </div>
                <div>
                  <h5 className="text-foreground font-semibold">Zuno Collection</h5>
                  <p className="text-muted-foreground text-sm">Created by @artist</p>
                </div>
              </div>
              <span className="badge-os-legendary">Featured</span>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Items', value: '10K', color: 'os-rare' },
                { label: 'Owners', value: '3.2K', color: 'os-epic' },
                { label: 'Floor', value: '0.5 ETH', color: 'os-legendary' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="p-3 bg-frosted-1 border border-border-subtle rounded-lg text-center backdrop-blur-sm"
                >
                  <p className={`text-${stat.color} font-semibold`}>{stat.value}</p>
                  <p className="text-muted-foreground text-xs">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-3 pt-2">
              <button className="flex-1 px-4 py-2 bg-gradient-to-r from-os-rare to-blue-600 text-white rounded-lg font-medium shadow-lg shadow-os-rare/20 hover:shadow-os-rare/30 transition-all">
                Buy Now
              </button>
              <button className="px-4 py-2 bg-frosted-2 text-foreground rounded-lg font-medium border border-border-medium backdrop-blur-sm hover:bg-frosted-6 transition-all">
                Make Offer
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
