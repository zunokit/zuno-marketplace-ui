"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { ButtonGroup, ButtonGroupText, ButtonGroupSeparator } from "@/shared/components/ui/button-group";
import { Badge } from "@/shared/components/ui/badge";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Copy,
  Download,
  ExternalLink,
  Heart,
  Loader2,
  Plus,
  RefreshCw,
  Share2,
  ShoppingCart,
  Trash2,
  Wallet,
  X,
} from "lucide-react";

// ============================================
// BUTTON DEBUG PAGE - OpenSea Design System
// ============================================

export default function ButtonDebugPage() {
  const [loadingButtons, setLoadingButtons] = React.useState<Record<string, boolean>>({});

  const simulateLoading = (buttonId: string) => {
    setLoadingButtons((prev) => ({ ...prev, [buttonId]: true }));
    setTimeout(() => {
      setLoadingButtons((prev) => ({ ...prev, [buttonId]: false }));
    }, 2000);
  };

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
          Button Component Debug
        </h1>
        <p className="text-muted-foreground">
          Comprehensive showcase of button variants, sizes, states, and patterns with OpenSea design system.
        </p>
      </div>

      <div className="mx-auto max-w-6xl space-y-12">
        {/* Section 1: Button Variants */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-foreground">Button Variants</h2>
            <Badge variant="secondary">7 variants</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Core button styles for different emphasis levels and use cases.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            <div className="space-y-2">
              <Button variant="default" className="w-full">Default</Button>
              <p className="text-xs text-muted-foreground text-center">Primary CTA</p>
            </div>
            <div className="space-y-2">
              <Button variant="secondary" className="w-full">Secondary</Button>
              <p className="text-xs text-muted-foreground text-center">Alternative</p>
            </div>
            <div className="space-y-2">
              <Button variant="outline" className="w-full">Outline</Button>
              <p className="text-xs text-muted-foreground text-center">Subtle</p>
            </div>
            <div className="space-y-2">
              <Button variant="ghost" className="w-full">Ghost</Button>
              <p className="text-xs text-muted-foreground text-center">Minimal</p>
            </div>
            <div className="space-y-2">
              <Button variant="link" className="w-full">Link</Button>
              <p className="text-xs text-muted-foreground text-center">Text action</p>
            </div>
            <div className="space-y-2">
              <Button variant="destructive" className="w-full">Destructive</Button>
              <p className="text-xs text-muted-foreground text-center">Danger</p>
            </div>
            <div className="space-y-2">
              <Button variant="success" className="w-full">Success</Button>
              <p className="text-xs text-muted-foreground text-center">Confirm</p>
            </div>
          </div>
        </section>

        {/* Section 2: Button Sizes */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-foreground">Button Sizes</h2>
            <Badge variant="secondary">4 sizes</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Size variations for different contexts and importance levels.
          </p>

          <div className="flex flex-wrap items-center gap-4 p-6 rounded-lg bg-card border border-border">
            <div className="space-y-2 text-center">
              <Button size="sm">Small</Button>
              <p className="text-xs text-muted-foreground">sm (32px)</p>
            </div>
            <div className="space-y-2 text-center">
              <Button size="default">Default</Button>
              <p className="text-xs text-muted-foreground">default (36px)</p>
            </div>
            <div className="space-y-2 text-center">
              <Button size="lg">Large</Button>
              <p className="text-xs text-muted-foreground">lg (40px)</p>
            </div>
            <div className="space-y-2 text-center">
              <Button size="icon">
                <Plus className="w-4 h-4" />
              </Button>
              <p className="text-xs text-muted-foreground">icon (36px)</p>
            </div>
          </div>

          {/* Size comparison with same variant */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Size Comparison (Default Variant)</p>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">Small Button</Button>
              <Button size="default">Default Button</Button>
              <Button size="lg">Large Button</Button>
            </div>
          </div>
        </section>

        {/* Section 3: Button States */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-foreground">Button States</h2>
            <Badge variant="secondary">Interactive states</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Visual feedback for user interactions and component states.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Default State */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Default State</p>
              <div className="flex flex-wrap gap-2">
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
              </div>
            </div>

            {/* Disabled State */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Disabled State</p>
              <div className="flex flex-wrap gap-2">
                <Button disabled>Default</Button>
                <Button variant="secondary" disabled>Secondary</Button>
                <Button variant="outline" disabled>Outline</Button>
              </div>
            </div>

            {/* Loading State */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Loading State</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  disabled={loadingButtons["load1"]}
                  onClick={() => simulateLoading("load1")}
                >
                  {loadingButtons["load1"] ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Click to Load"
                  )}
                </Button>
                <Button
                  variant="secondary"
                  disabled={loadingButtons["load2"]}
                  onClick={() => simulateLoading("load2")}
                >
                  {loadingButtons["load2"] ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Secondary"
                  )}
                </Button>
                <Button
                  variant="outline"
                  disabled={loadingButtons["load3"]}
                  onClick={() => simulateLoading("load3")}
                >
                  {loadingButtons["load3"] ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing
                    </>
                  ) : (
                    "Outline"
                  )}
                </Button>
              </div>
            </div>

            {/* Active/Pressed State Demo */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Active State (Click & Hold)</p>
              <div className="flex flex-wrap gap-2">
                <Button className="active:scale-95 active:opacity-80">Press Me</Button>
                <Button variant="secondary" className="active:scale-95 active:opacity-80">
                  Secondary
                </Button>
                <Button variant="ghost" className="active:scale-95 active:opacity-80">
                  Ghost
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Icon Buttons */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-foreground">Icon Buttons</h2>
            <Badge variant="secondary">3 patterns</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Leading icons, trailing icons, and icon-only buttons.
          </p>

          {/* Leading Icons */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">Leading Icons</p>
            <div className="flex flex-wrap gap-2">
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
              <Button variant="destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>

          {/* Trailing Icons */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">Trailing Icons</p>
            <div className="flex flex-wrap gap-2">
              <Button>
                Buy Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button variant="secondary">
                Learn More
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
              <Button variant="outline">
                Options
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Icon Only */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">Icon Only</p>
            <div className="flex flex-wrap items-center gap-2">
              <Button size="icon" variant="default">
                <Plus className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="secondary">
                <Heart className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="outline">
                <Share2 className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="ghost">
                <RefreshCw className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="success">
                <Check className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* NFT Marketplace Specific */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">NFT Marketplace Patterns</p>
            <div className="flex flex-wrap gap-2">
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
              <Button variant="ghost" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="secondary" size="sm">
                <Copy className="w-4 h-4 mr-2" />
                Copy Address
              </Button>
            </div>
          </div>
        </section>

        {/* Section 5: Button Groups */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-foreground">Button Groups</h2>
            <Badge variant="secondary">Horizontal & Vertical</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Grouped buttons for related actions and toolbars.
          </p>

          {/* Horizontal Groups */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">Horizontal Groups</p>
            <div className="flex flex-wrap gap-4">
              <ButtonGroup>
                <Button variant="secondary">List</Button>
                <Button variant="secondary">Grid</Button>
                <Button variant="secondary">Map</Button>
              </ButtonGroup>

              <ButtonGroup>
                <Button variant="outline" size="sm">
                  <Copy className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </ButtonGroup>

              <ButtonGroup>
                <ButtonGroupText>View:</ButtonGroupText>
                <Button variant="secondary" size="sm">All</Button>
                <Button variant="secondary" size="sm">Listed</Button>
                <Button variant="secondary" size="sm">Unlisted</Button>
              </ButtonGroup>
            </div>
          </div>

          {/* Vertical Groups */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">Vertical Groups</p>
            <div className="flex flex-wrap gap-8">
              <ButtonGroup orientation="vertical">
                <Button variant="secondary">Profile</Button>
                <Button variant="secondary">Settings</Button>
                <Button variant="secondary">Logout</Button>
              </ButtonGroup>

              <ButtonGroup orientation="vertical">
                <Button variant="outline" size="sm">
                  <Heart className="w-4 h-4 mr-2" />
                  Favorite
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View
                </Button>
              </ButtonGroup>
            </div>
          </div>

          {/* With Separator */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">With Separator</p>
            <div className="flex flex-wrap gap-4">
              <ButtonGroup>
                <Button variant="secondary">
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
                <ButtonGroupSeparator />
                <Button variant="secondary">
                  <ChevronDown className="w-4 h-4" />
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
        </section>

        {/* Section 6: Interactive States & Effects */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-foreground">Interactive States</h2>
            <Badge variant="secondary">Click effects & focus</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Visual feedback for user interactions.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Hover Effects */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Hover Effects</p>
              <div className="flex flex-wrap gap-2">
                <Button className="hover:-translate-y-0.5 hover:shadow-lg transition-all">
                  Lift on Hover
                </Button>
                <Button
                  variant="secondary"
                  className="hover:scale-105 transition-transform"
                >
                  Scale on Hover
                </Button>
                <Button
                  variant="outline"
                  className="hover:bg-os-gray-400 transition-colors"
                >
                  Color Shift
                </Button>
              </div>
            </div>

            {/* Focus Rings */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Focus Rings (Tab to see)</p>
              <div className="flex flex-wrap gap-2">
                <Button className="focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary">
                  Default Ring
                </Button>
                <Button
                  variant="secondary"
                  className="focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-os-info"
                >
                  Info Ring
                </Button>
                <Button
                  variant="outline"
                  className="focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-os-success"
                >
                  Success Ring
                </Button>
              </div>
            </div>

            {/* Press Effects */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Press Effects</p>
              <div className="flex flex-wrap gap-2">
                <Button className="active:scale-95 active:shadow-inner transition-all">
                  Scale Press
                </Button>
                <Button
                  variant="secondary"
                  className="active:bg-os-gray-300 transition-colors"
                >
                  Color Press
                </Button>
              </div>
            </div>

            {/* Width Animation */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Width Animation</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  className="w-32 hover:w-40 transition-all duration-300"
                >
                  Hover Expand
                </Button>
                <Button
                  variant="secondary"
                  className="hover:px-8 transition-all duration-300"
                >
                  Padding Expand
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 7: State Matrix */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-foreground">State Matrix</h2>
            <Badge variant="secondary">All variants × states</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Complete matrix of button variants across different states.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Variant</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Default</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Disabled</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">With Icon</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  { variant: "default", label: "Default" },
                  { variant: "secondary", label: "Secondary" },
                  { variant: "outline", label: "Outline" },
                  { variant: "ghost", label: "Ghost" },
                  { variant: "link", label: "Link" },
                  { variant: "destructive", label: "Destructive" },
                  { variant: "success", label: "Success" },
                ].map(({ variant, label }) => (
                  <tr key={variant} className="hover:bg-card/50">
                    <td className="py-3 px-4 text-muted-foreground capitalize">{label}</td>
                    <td className="py-3 px-4">
                      <Button variant={variant as any} size="sm">Button</Button>
                    </td>
                    <td className="py-3 px-4">
                      <Button variant={variant as any} size="sm" disabled>Button</Button>
                    </td>
                    <td className="py-3 px-4">
                      <Button variant={variant as any} size="sm">
                        <Check className="w-3 h-3 mr-1" />
                        Button
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 8: Real-world Examples */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-foreground">Real-world Examples</h2>
            <Badge variant="secondary">NFT Marketplace use cases</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Common button patterns used in NFT marketplace interfaces.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* NFT Card Actions */}
            <div className="p-4 rounded-lg bg-card border border-border space-y-3">
              <p className="text-sm font-medium text-foreground">NFT Card Actions</p>
              <div className="flex flex-wrap gap-2">
                <Button size="sm">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Buy Now
                </Button>
                <Button size="sm" variant="secondary">Make Offer</Button>
                <Button variant="ghost" size="sm">
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Wallet Actions */}
            <div className="p-4 rounded-lg bg-card border border-border space-y-3">
              <p className="text-sm font-medium text-foreground">Wallet Actions</p>
              <div className="flex flex-wrap gap-2">
                <Button>
                  <Wallet className="w-4 h-4 mr-2" />
                  Connect Wallet
                </Button>
                <Button variant="outline" size="sm">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Address
                </Button>
              </div>
            </div>

            {/* Listing Actions */}
            <div className="p-4 rounded-lg bg-card border border-border space-y-3">
              <p className="text-sm font-medium text-foreground">Listing Actions</p>
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                <Button variant="outline" size="sm">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View on Etherscan
                </Button>
              </div>
            </div>

            {/* Confirmation Dialog */}
            <div className="p-4 rounded-lg bg-card border border-border space-y-3">
              <p className="text-sm font-medium text-foreground">Confirmation Dialog</p>
              <div className="flex flex-wrap gap-2">
                <Button variant="destructive" size="sm">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
                <Button variant="ghost" size="sm">Cancel</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 9: Accessibility */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-foreground">Accessibility</h2>
            <Badge variant="secondary">WCAG 2.2</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Accessible button patterns with proper ARIA attributes.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Icon-only with aria-label */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Icon-Only (with aria-label)</p>
              <div className="flex flex-wrap gap-2">
                <Button size="icon" aria-label="Add to favorites">
                  <Heart className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="secondary" aria-label="Share item">
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="outline" aria-label="Copy link">
                  <Copy className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="ghost" aria-label="Close dialog">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Keyboard Navigation */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Keyboard Navigation</p>
              <div className="flex flex-wrap gap-2">
                <Button>Tab to Focus</Button>
                <Button variant="secondary">Enter to Activate</Button>
                <Button variant="outline">Space to Activate</Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Use Tab to navigate, Enter or Space to activate buttons.
              </p>
            </div>
          </div>
        </section>

        {/* Section 10: Button Improvements */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-foreground">Button Improvements</h2>
            <Badge variant="secondary">Enhanced UX</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Side-by-side comparison of standard shadcn buttons vs. enhanced buttons with improved interactions.
          </p>

          {/* Comparison Grid */}
          <div className="space-y-6">
            {/* Standard Buttons Row */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">Standard shadcn Buttons</p>
              <div className="flex flex-wrap gap-3 p-4 rounded-lg bg-card border border-border">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button size="icon" variant="outline">
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Improved Buttons Row */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-os-success">Improved Buttons</p>
              <div className="flex flex-wrap gap-3 p-4 rounded-lg bg-card border border-border">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button size="icon" variant="outline">
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Improvements Explanation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="p-4 rounded-lg bg-frosted-1 border border-border-subtle space-y-3">
              <h4 className="text-sm font-medium text-foreground">Visual Enhancements</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-os-success mt-0.5">✓</span>
                  <span><strong>Frosted glass effect</strong> on hover with backdrop-blur</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-os-success mt-0.5">✓</span>
                  <span><strong>Improved gradient</strong> for primary variant with subtle glow</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-os-success mt-0.5">✓</span>
                  <span><strong>Glow effect</strong> on hover using box-shadow</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-os-success mt-0.5">✓</span>
                  <span><strong>Enhanced focus rings</strong> with better visibility and offset</span>
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-lg bg-frosted-1 border border-border-subtle space-y-3">
              <h4 className="text-sm font-medium text-foreground">Interaction Improvements</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-os-success mt-0.5">✓</span>
                  <span><strong>Spring animations</strong> using cubic-bezier for natural feel</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-os-success mt-0.5">✓</span>
                  <span><strong>Press state</strong> with scale down effect (0.97)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-os-success mt-0.5">✓</span>
                  <span><strong>Lift effect</strong> on hover with translateY and shadow</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-os-success mt-0.5">✓</span>
                  <span><strong>Smooth transitions</strong> with 200ms duration</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Interactive Demo */}
          <div className="p-4 rounded-lg bg-gradient-to-br from-os-gray-500 to-os-gray-400 border border-border space-y-3">
            <p className="text-sm font-medium text-foreground">Interactive Demo - Try Hovering & Clicking</p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg">
                <ShoppingCart className="w-5 h-5" />
                Buy Now
              </Button>
              <Button size="lg" variant="secondary">
                <Wallet className="w-5 h-5" />
                Connect Wallet
              </Button>
              <Button size="lg" variant="outline">
                Make Offer
              </Button>
              <Button size="icon" variant="outline">
                <Heart className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* Info Section */}
        <div className="mt-10 p-4 rounded-lg bg-frosted-1 border border-border-subtle">
          <h4 className="text-sm font-medium text-foreground mb-2">
            About Button Components
          </h4>
          <p className="text-sm text-muted-foreground">
            All buttons follow the OpenSea design system with a 6px border radius,
            consistent padding, and proper focus indicators. The component supports
            7 variants, 4 sizes, and full keyboard accessibility. Loading states use
            the Lucide Loader2 icon with CSS animation.
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================
// IMPROVED BUTTON COMPONENT
// ============================================

interface DemoButtonProps extends React.ComponentProps<"button"> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "link" | "destructive" | "success";
  size?: "default" | "sm" | "lg" | "icon";
}

function DemoButton({
  className,
  variant = "default",
  size = "default",
  children,
  ...props
}: DemoButtonProps) {
  const baseStyles = "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium cursor-pointer disabled:pointer-events-none disabled:opacity-50 outline-none";

  // Size styles
  const sizeStyles = {
    default: "h-9 px-4 py-2 text-sm [&_svg]:size-4",
    sm: "h-8 gap-1.5 px-3 text-xs [&_svg]:size-4",
    lg: "h-10 px-6 text-base [&_svg]:size-5",
    icon: "size-9 p-2 [&_svg]:size-4",
  };

  // Variant styles with enhancements
  const variantStyles = {
    default: `
      bg-gradient-to-b from-primary to-primary/90
      text-primary-foreground
      border border-primary/50
      rounded-lg
      shadow-[0_1px_2px_rgba(0,0,0,0.1),0_0_0_1px_rgba(255,255,255,0.1)_inset]
      hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.4),0_0_0_1px_rgba(255,255,255,0.15)_inset]
      hover:-translate-y-0.5
      active:scale-[0.97]
      active:translate-y-0
      transition-all
      duration-200
      ease-[cubic-bezier(0.34,1.56,0.64,1)]
      focus-visible:ring-2
      focus-visible:ring-primary/60
      focus-visible:ring-offset-2
      focus-visible:ring-offset-background
    `,
    secondary: `
      bg-secondary/80
      backdrop-blur-md
      text-secondary-foreground
      border border-border-subtle
      rounded-lg
      shadow-[0_1px_2px_rgba(0,0,0,0.05)]
      hover:bg-secondary
      hover:border-border-medium
      hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]
      hover:-translate-y-0.5
      active:scale-[0.97]
      active:translate-y-0
      transition-all
      duration-200
      ease-[cubic-bezier(0.34,1.56,0.64,1)]
      focus-visible:ring-2
      focus-visible:ring-secondary/60
      focus-visible:ring-offset-2
      focus-visible:ring-offset-background
    `,
    outline: `
      bg-card/50
      backdrop-blur-xl
      text-foreground
      border border-border-subtle
      rounded-lg
      hover:bg-accent/80
      hover:border-border-strong
      hover:shadow-[0_4px_12px_rgba(0,0,0,0.08),0_0_0_1px_rgba(255,255,255,0.05)_inset]
      hover:-translate-y-0.5
      active:scale-[0.97]
      active:translate-y-0
      transition-all
      duration-200
      ease-[cubic-bezier(0.34,1.56,0.64,1)]
      focus-visible:ring-2
      focus-visible:ring-accent/60
      focus-visible:ring-offset-2
      focus-visible:ring-offset-background
    `,
    ghost: `
      text-muted-foreground
      rounded-lg
      hover:bg-hover-bg/80
      hover:text-foreground
      hover:shadow-[0_2px_8px_rgba(0,0,0,0.05)]
      hover:-translate-y-0.5
      active:scale-[0.97]
      active:translate-y-0
      transition-all
      duration-200
      ease-[cubic-bezier(0.34,1.56,0.64,1)]
      focus-visible:ring-2
      focus-visible:ring-muted/60
      focus-visible:ring-offset-2
      focus-visible:ring-offset-background
    `,
    link: `
      text-primary
      underline-offset-4
      hover:underline
      transition-colors
      focus-visible:ring-2
      focus-visible:ring-primary/60
      focus-visible:ring-offset-2
      focus-visible:ring-offset-background
    `,
    destructive: `
      bg-destructive
      text-destructive-foreground
      border border-destructive/50
      rounded-lg
      shadow-[0_1px_2px_rgba(0,0,0,0.1)]
      hover:shadow-[0_0_20px_rgba(var(--destructive-rgb),0.4)]
      hover:-translate-y-0.5
      active:scale-[0.97]
      active:translate-y-0
      transition-all
      duration-200
      ease-[cubic-bezier(0.34,1.56,0.64,1)]
      focus-visible:ring-2
      focus-visible:ring-destructive/60
      focus-visible:ring-offset-2
      focus-visible:ring-offset-background
    `,
    success: `
      bg-success
      text-success-foreground
      border border-success/50
      rounded-lg
      shadow-[0_1px_2px_rgba(0,0,0,0.1)]
      hover:shadow-[0_0_20px_rgba(var(--success-rgb),0.4)]
      hover:-translate-y-0.5
      active:scale-[0.97]
      active:translate-y-0
      transition-all
      duration-200
      ease-[cubic-bezier(0.34,1.56,0.64,1)]
      focus-visible:ring-2
      focus-visible:ring-success/60
      focus-visible:ring-offset-2
      focus-visible:ring-offset-background
    `,
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className || ""}`}
      {...props}
    >
      {children}
    </button>
  );
}
