'use client';

import React from 'react';

export function ColorUsageExamples() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Buttons */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Buttons
        </h3>
        <div className="flex flex-wrap gap-3 p-4 bg-card rounded-lg border border-border">
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium">
            Primary Button
          </button>
          <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md font-medium border border-border">
            Secondary Button
          </button>
          <button className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md font-medium">
            Destructive
          </button>
          <button className="px-4 py-2 bg-success text-success-foreground rounded-md font-medium">
            Success
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Cards
        </h3>
        <div className="flex flex-wrap gap-3">
          <div className="p-4 bg-card border border-border rounded-lg w-40">
            <p className="text-card-foreground font-medium">Card Title</p>
            <p className="text-muted-foreground text-sm">Card content</p>
          </div>
          <div className="p-4 bg-muted border border-border rounded-lg w-40">
            <p className="text-foreground font-medium">Muted Card</p>
            <p className="text-muted-foreground text-sm">Muted content</p>
          </div>
          <div className="p-4 bg-accent border border-border rounded-lg w-40">
            <p className="text-accent-foreground font-medium">Accent Card</p>
            <p className="text-sm opacity-80">Accent content</p>
          </div>
        </div>
      </div>

      {/* Tags/Badges */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Tags / Badges
        </h3>
        <div className="flex flex-wrap gap-2 p-4 bg-card rounded-lg border border-border">
          <span className="badge-os-success">Success</span>
          <span className="badge-os-error">Error</span>
          <span className="badge-os-rare">Rare</span>
          <span className="badge-os-epic">Epic</span>
          <span className="badge-os-legendary">Legendary</span>
        </div>
      </div>

      {/* NFT Rarity Indicators */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          NFT Rarity Indicators
        </h3>
        <div className="flex flex-wrap gap-3 p-4 bg-card rounded-lg border border-border">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#9ca3af' }} />
            <span className="text-sm text-foreground">Common</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#22c55e' }} />
            <span className="text-sm text-foreground">Uncommon</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#00a3ff' }} />
            <span className="text-sm text-foreground">Rare</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#d358ff' }} />
            <span className="text-sm text-foreground">Epic</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ff8a00' }} />
            <span className="text-sm text-foreground">Legendary</span>
          </div>
        </div>
      </div>
    </div>
  );
}
