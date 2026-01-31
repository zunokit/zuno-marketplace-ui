"use client";

import * as React from "react";
import { Button } from "@/shared/components/ui/button";
import { ButtonGroup, ButtonGroupSeparator } from "@/shared/components/ui/button-group";
import {
  Heart,
  Share2,
  Download,
  Plus,
  Loader2,
  ShoppingCart,
  Wallet,
  ChevronDown,
} from "lucide-react";

export function ButtonSection() {
  const [loading, setLoading] = React.useState(false);

  const simulateLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Variants */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Button Variants</h4>
        <div className="flex flex-wrap gap-3">
          <Button variant="default">Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="success">Success</Button>
        </div>
      </div>

      {/* Sizes */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Sizes</h4>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* With Icons */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">With Icons</h4>
        <div className="flex flex-wrap gap-3">
          <Button>
            <Wallet className="w-4 h-4 mr-2" />
            Connect Wallet
          </Button>
          <Button variant="secondary">
            <Plus className="w-4 h-4 mr-2" />
            Create
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      {/* Loading State */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Loading State</h4>
        <div className="flex flex-wrap gap-3">
          <Button disabled={loading} onClick={simulateLoading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              "Click to Load"
            )}
          </Button>
          <Button variant="secondary" disabled={loading}>
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Secondary
          </Button>
        </div>
      </div>

      {/* Button Groups */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Button Groups</h4>
        <div className="flex flex-wrap gap-4">
          <ButtonGroup>
            <Button variant="secondary">List</Button>
            <Button variant="secondary">Grid</Button>
            <Button variant="secondary">Map</Button>
          </ButtonGroup>

          <ButtonGroup>
            <Button variant="outline" size="sm">
              <Heart className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4" />
            </Button>
          </ButtonGroup>

          <ButtonGroup>
            <Button variant="default">Buy Now</Button>
            <ButtonGroupSeparator />
            <Button variant="default" size="icon">
              <ChevronDown className="w-4 h-4" />
            </Button>
          </ButtonGroup>
        </div>
      </div>

      {/* NFT Marketplace Patterns */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">NFT Marketplace Patterns</h4>
        <div className="flex flex-wrap gap-3">
          <Button size="lg">
            <ShoppingCart className="w-5 h-5 mr-2" />
            Buy Now
          </Button>
          <Button size="lg" variant="secondary">
            <Wallet className="w-5 h-5 mr-2" />
            Connect Wallet
          </Button>
          <Button variant="outline">
            <Heart className="w-4 h-4 mr-2" />
            Add to Favorites
          </Button>
        </div>
      </div>

      {/* States */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">States</h4>
        <div className="flex flex-wrap gap-3">
          <Button>Normal</Button>
          <Button disabled>Disabled</Button>
          <Button className="pointer-events-none opacity-50">Loading</Button>
        </div>
      </div>
    </div>
  );
}
