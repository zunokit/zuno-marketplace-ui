"use client";

import * as React from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/shared/components/ui/drawer";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Badge } from "@/shared/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  ArrowRight,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  X,
  Settings,
  Filter,
  ShoppingCart,
  User,
  Bell,
  CreditCard,
  Shield,
  Palette,
  Globe,
  Check,
} from "lucide-react";
import Link from "next/link";

// ============================================
// DRAWER DEBUG PAGE - OpenSea Design System
// ============================================

export default function DrawerDebugPage() {
  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      {/* Back Link */}
      <div className="mx-auto max-w-5xl mb-6">
        <Link
          href="/debug"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Debug Dashboard
        </Link>
      </div>

      {/* Page Header */}
      <div className="mx-auto max-w-5xl space-y-2 mb-10">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Drawer Component Debug
        </h1>
        <p className="text-muted-foreground">
          Testing all drawer variants, directions, and use cases with OpenSea design system.
        </p>
      </div>

      <div className="mx-auto max-w-5xl space-y-12">
        {/* Section 1: Direction Variants */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-foreground">Direction Variants</h2>
            <Badge variant="secondary">4 directions</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Drawers can slide in from any edge of the screen.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Bottom Drawer (Default) */}
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="secondary" className="w-full">
                  <ArrowUp className="w-4 h-4 mr-2" />
                  Bottom
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader className="border-b border-border-subtle pb-4">
                  <DrawerTitle className="text-foreground">Bottom Drawer</DrawerTitle>
                  <DrawerDescription>
                    Default direction, great for mobile actions and forms.
                  </DrawerDescription>
                </DrawerHeader>
                <div className="p-4 space-y-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input placeholder="Enter your email" />
                  </div>
                </div>
                <DrawerFooter className="border-t border-border-subtle">
                  <Button className="w-full">Continue</Button>
                  <DrawerClose asChild>
                    <Button variant="ghost" className="w-full">Cancel</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>

            {/* Top Drawer */}
            <Drawer direction="top">
              <DrawerTrigger asChild>
                <Button variant="secondary" className="w-full">
                  <ArrowDown className="w-4 h-4 mr-2" />
                  Top
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader className="border-b border-border-subtle pb-4">
                  <DrawerTitle className="text-foreground">Top Drawer</DrawerTitle>
                  <DrawerDescription>
                    Useful for notifications, search bars, or navigation.
                  </DrawerDescription>
                </DrawerHeader>
                <div className="p-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-frosted-1 border border-border-subtle">
                    <Bell className="w-5 h-5 text-os-info" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">New notification</p>
                      <p className="text-xs text-muted-foreground">Someone placed a bid on your item</p>
                    </div>
                  </div>
                </div>
                <DrawerFooter className="border-t border-border-subtle">
                  <DrawerClose asChild>
                    <Button variant="ghost" className="w-full">Dismiss</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>

            {/* Left Drawer */}
            <Drawer direction="left">
              <DrawerTrigger asChild>
                <Button variant="secondary" className="w-full">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Left
                </Button>
              </DrawerTrigger>
              <DrawerContent className="bg-card border-border w-full sm:max-w-sm">
                <DrawerHeader className="border-b border-border-subtle pb-4">
                  <DrawerTitle className="text-foreground">Left Drawer</DrawerTitle>
                  <DrawerDescription>
                    Perfect for side navigation or filter panels.
                  </DrawerDescription>
                </DrawerHeader>
                <div className="p-4 space-y-2">
                  {["Dashboard", "Analytics", "Settings", "Profile"].map((item) => (
                    <button
                      key={item}
                      className="w-full text-left px-3 py-2 rounded-md text-sm text-foreground hover:bg-frosted-1 transition-colors"
                    >
                      {item}
                    </button>
                  ))}
                </div>
                <DrawerFooter className="border-t border-border-subtle mt-auto">
                  <DrawerClose asChild>
                    <Button variant="ghost" className="w-full">Close</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>

            {/* Right Drawer */}
            <Drawer direction="right">
              <DrawerTrigger asChild>
                <Button variant="secondary" className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Right
                </Button>
              </DrawerTrigger>
              <DrawerContent className="bg-card border-border w-full sm:max-w-sm">
                <DrawerHeader className="border-b border-border-subtle pb-4">
                  <DrawerTitle className="text-foreground">Right Drawer</DrawerTitle>
                  <DrawerDescription>
                    Ideal for shopping carts, details panels, or settings.
                  </DrawerDescription>
                </DrawerHeader>
                <div className="p-4 space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-frosted-1 border border-border-subtle">
                    <div className="w-12 h-12 rounded-md bg-os-gray-400" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">Item Name</p>
                      <p className="text-xs text-muted-foreground">0.5 ETH</p>
                    </div>
                  </div>
                </div>
                <DrawerFooter className="border-t border-border-subtle mt-auto">
                  <Button className="w-full">Checkout</Button>
                  <DrawerClose asChild>
                    <Button variant="ghost" className="w-full">Continue Shopping</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
        </section>

        {/* Section 2: Common Use Cases */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-foreground">Common Use Cases</h2>
            <Badge variant="secondary">Real-world examples</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Shopping Cart Drawer */}
            <Drawer direction="right">
              <DrawerTrigger asChild>
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  <span className="text-sm">Shopping Cart</span>
                </Button>
              </DrawerTrigger>
              <DrawerContent className="bg-card border-border w-full sm:max-w-md">
                <DrawerHeader className="border-b border-border-subtle">
                  <div className="flex items-center justify-between">
                    <DrawerTitle className="text-foreground flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5" />
                      Your Cart
                    </DrawerTitle>
                    <Badge variant="secondary">3 items</Badge>
                  </div>
                  <DrawerDescription>
                    Review your items before checkout
                  </DrawerDescription>
                </DrawerHeader>
                <div className="p-4 space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-frosted-1 border border-border-subtle">
                      <div className="w-16 h-16 rounded-md bg-os-gray-400 flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">NFT</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">Cool NFT #{1000 + i}</p>
                        <p className="text-xs text-muted-foreground">Collection Name</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">{(0.5 * i).toFixed(2)} ETH</p>
                        <button className="text-xs text-os-error hover:underline">Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
                <DrawerFooter className="border-t border-border-subtle mt-auto">
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-muted-foreground">Total</span>
                    <span className="text-lg font-semibold text-foreground">3.00 ETH</span>
                  </div>
                  <Button className="w-full">Proceed to Checkout</Button>
                  <DrawerClose asChild>
                    <Button variant="ghost" className="w-full">Continue Shopping</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>

            {/* Filter Drawer */}
            <Drawer direction="left">
              <DrawerTrigger asChild>
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2">
                  <Filter className="w-5 h-5" />
                  <span className="text-sm">Filter Panel</span>
                </Button>
              </DrawerTrigger>
              <DrawerContent className="bg-card border-border w-full sm:max-w-sm">
                <DrawerHeader className="border-b border-border-subtle">
                  <DrawerTitle className="text-foreground flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Filters
                  </DrawerTitle>
                  <DrawerDescription>
                    Refine your search results
                  </DrawerDescription>
                </DrawerHeader>
                <div className="p-4 space-y-6">
                  {/* Price Range */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Price Range</Label>
                    <div className="flex items-center gap-2">
                      <Input placeholder="Min" className="flex-1" />
                      <span className="text-muted-foreground">-</span>
                      <Input placeholder="Max" className="flex-1" />
                    </div>
                  </div>

                  {/* Status */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Status</Label>
                    <div className="space-y-2">
                      {["Buy Now", "On Auction", "New", "Has Offers"].map((status) => (
                        <label key={status} className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="rounded border-os-gray-400 bg-os-gray-500" />
                          <span className="text-sm text-foreground">{status}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Sort */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Sort By</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Recently Listed" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recent">Recently Listed</SelectItem>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                        <SelectItem value="popular">Most Popular</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DrawerFooter className="border-t border-border-subtle mt-auto">
                  <Button className="w-full">Apply Filters</Button>
                  <Button variant="ghost" className="w-full">Reset All</Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>

            {/* User Profile Drawer */}
            <Drawer direction="right">
              <DrawerTrigger asChild>
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2">
                  <User className="w-5 h-5" />
                  <span className="text-sm">User Profile</span>
                </Button>
              </DrawerTrigger>
              <DrawerContent className="bg-card border-border w-full sm:max-w-sm">
                <DrawerHeader className="border-b border-border-subtle">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-os-gray-400 border-2 border-os-rare flex items-center justify-center">
                      <User className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div>
                      <DrawerTitle className="text-foreground">John Doe</DrawerTitle>
                      <DrawerDescription>@johndoe</DrawerDescription>
                    </div>
                  </div>
                </DrawerHeader>
                <div className="p-4 space-y-2">
                  {[
                    { icon: User, label: "Profile" },
                    { icon: ShoppingCart, label: "My Items" },
                    { icon: CreditCard, label: "Payments" },
                    { icon: Bell, label: "Notifications" },
                    { icon: Shield, label: "Security" },
                    { icon: Settings, label: "Settings" },
                  ].map(({ icon: Icon, label }) => (
                    <button
                      key={label}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-foreground hover:bg-frosted-1 transition-colors"
                    >
                      <Icon className="w-4 h-4 text-muted-foreground" />
                      {label}
                    </button>
                  ))}
                </div>
                <DrawerFooter className="border-t border-border-subtle mt-auto">
                  <Button variant="destructive" className="w-full">Disconnect Wallet</Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
        </section>

        {/* Section 3: Size Variants */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-foreground">Size Variants</h2>
            <Badge variant="secondary">Different heights & widths</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Small Drawer */}
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="secondary" className="w-full">Small (Auto)</Button>
              </DrawerTrigger>
              <DrawerContent className="bg-card border-border max-h-[40vh]">
                <DrawerHeader>
                  <DrawerTitle className="text-foreground">Small Drawer</DrawerTitle>
                  <DrawerDescription>Compact size for simple actions</DrawerDescription>
                </DrawerHeader>
                <div className="p-4">
                  <p className="text-sm text-muted-foreground">
                    This drawer has a maximum height of 40vh, perfect for confirmations or quick actions.
                  </p>
                </div>
                <DrawerFooter>
                  <Button className="w-full">Confirm</Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>

            {/* Medium Drawer (Default) */}
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="secondary" className="w-full">Medium (Default)</Button>
              </DrawerTrigger>
              <DrawerContent className="bg-card border-border max-h-[60vh]">
                <DrawerHeader>
                  <DrawerTitle className="text-foreground">Medium Drawer</DrawerTitle>
                  <DrawerDescription>Default size for most use cases</DrawerDescription>
                </DrawerHeader>
                <div className="p-4 space-y-4">
                  <p className="text-sm text-muted-foreground">
                    This is the default drawer size with 60vh max height. Good for forms and moderate content.
                  </p>
                  <div className="space-y-2">
                    <Label>Input Field</Label>
                    <Input placeholder="Type something..." />
                  </div>
                </div>
                <DrawerFooter>
                  <Button className="w-full">Submit</Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>

            {/* Large Drawer */}
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="secondary" className="w-full">Large (80vh)</Button>
              </DrawerTrigger>
              <DrawerContent className="bg-card border-border max-h-[80vh]">
                <DrawerHeader>
                  <DrawerTitle className="text-foreground">Large Drawer</DrawerTitle>
                  <DrawerDescription>Full content drawer</DrawerDescription>
                </DrawerHeader>
                <div className="p-4 space-y-4">
                  <p className="text-sm text-muted-foreground">
                    This drawer uses the maximum 80vh height, suitable for complex forms or content-heavy views.
                  </p>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Label>Field {i + 1}</Label>
                      <Input placeholder={`Input ${i + 1}`} />
                    </div>
                  ))}
                </div>
                <DrawerFooter>
                  <Button className="w-full">Save Changes</Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
        </section>

        {/* Section 4: Styling Variants */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-foreground">Styling Variants</h2>
            <Badge variant="secondary">Different visual styles</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Frosted Glass */}
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="outline" className="w-full">Frosted Glass</Button>
              </DrawerTrigger>
              <DrawerContent className="backdrop-blur-xl bg-frosted-7 border-border-medium">
                <DrawerHeader>
                  <DrawerTitle className="text-foreground">Frosted Glass</DrawerTitle>
                  <DrawerDescription>Uses backdrop blur for modern glass effect</DrawerDescription>
                </DrawerHeader>
                <div className="p-4">
                  <div className="p-4 rounded-lg bg-frosted-1 border border-border-subtle">
                    <p className="text-sm text-foreground">
                      This drawer uses the frosted glass effect with backdrop blur.
                    </p>
                  </div>
                </div>
                <DrawerFooter>
                  <Button className="w-full">Got it</Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>

            {/* Solid Background */}
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="outline" className="w-full">Solid Background</Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle className="text-foreground">Solid Background</DrawerTitle>
                  <DrawerDescription>Clean solid background without transparency</DrawerDescription>
                </DrawerHeader>
                <div className="p-4">
                  <div className="p-4 rounded-lg bg-os-gray-400 border border-border-subtle">
                    <p className="text-sm text-foreground">
                      This drawer uses a solid background color for maximum readability.
                    </p>
                  </div>
                </div>
                <DrawerFooter>
                  <Button className="w-full">Got it</Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
        </section>

        {/* Section 5: Interactive States */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-foreground">Interactive States</h2>
            <Badge variant="secondary">Loading, error, success</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Loading State */}
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="secondary" className="w-full">Loading State</Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle className="text-foreground">Processing</DrawerTitle>
                  <DrawerDescription>Please wait while we process your request</DrawerDescription>
                </DrawerHeader>
                <div className="p-8 flex flex-col items-center justify-center gap-4">
                  <div className="w-8 h-8 border-2 border-os-gray-300 border-t-os-info rounded-full animate-spin" />
                  <p className="text-sm text-muted-foreground">Confirming transaction...</p>
                </div>
              </DrawerContent>
            </Drawer>

            {/* Success State */}
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="secondary" className="w-full">Success State</Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle className="text-foreground flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-os-success flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    Success!
                  </DrawerTitle>
                  <DrawerDescription>Your action was completed successfully</DrawerDescription>
                </DrawerHeader>
                <div className="p-4">
                  <div className="p-4 rounded-lg bg-success-bg-light border border-success-border">
                    <p className="text-sm text-os-success">
                      Transaction confirmed! Your NFT has been successfully transferred.
                    </p>
                  </div>
                </div>
                <DrawerFooter>
                  <DrawerClose asChild>
                    <Button className="w-full">Done</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>

            {/* Error State */}
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="secondary" className="w-full">Error State</Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle className="text-foreground text-os-error">Error</DrawerTitle>
                  <DrawerDescription>Something went wrong</DrawerDescription>
                </DrawerHeader>
                <div className="p-4">
                  <div className="p-4 rounded-lg bg-error-bg-light border border-error-border">
                    <p className="text-sm text-os-error">
                      Insufficient funds. Please add more ETH to your wallet and try again.
                    </p>
                  </div>
                </div>
                <DrawerFooter>
                  <Button variant="destructive" className="w-full">Try Again</Button>
                  <DrawerClose asChild>
                    <Button variant="ghost" className="w-full">Cancel</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
        </section>

        {/* Section 6: OpenSea Design Drawer */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-foreground">OpenSea Design Drawer</h2>
            <Badge variant="default">Styled</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Enhanced drawer with frosted glass effect, spring physics animations, and OpenSea styling.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Bottom Drawer */}
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="secondary" className="w-full">
                  <ArrowUp className="w-4 h-4 mr-2" />
                  Bottom
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Styled Bottom Drawer</DrawerTitle>
                  <DrawerDescription>
                    Features frosted glass backdrop blur and smooth spring animations.
                  </DrawerDescription>
                </DrawerHeader>
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <Input placeholder="Enter your email" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    This drawer uses the semantic color palette with frosted glass effects and subtle borders.
                  </p>
                </div>
                <DrawerFooter>
                  <Button className="w-full">Continue</Button>
                  <DrawerClose asChild>
                    <Button variant="ghost" className="w-full">Cancel</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>

            {/* Top Drawer */}
            <Drawer direction="top">
              <DrawerTrigger asChild>
                <Button variant="secondary" className="w-full">
                  <ArrowDown className="w-4 h-4 mr-2" />
                  Top
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Notifications</DrawerTitle>
                  <DrawerDescription>
                    Real-time updates with elegant presentation.
                  </DrawerDescription>
                </DrawerHeader>
                <div className="p-6 space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-frosted-1 border border-border-subtle">
                      <Bell className="w-5 h-5 text-os-info" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">New bid received</p>
                        <p className="text-xs text-muted-foreground">2 minutes ago</p>
                      </div>
                    </div>
                  ))}
                </div>
                <DrawerFooter>
                  <DrawerClose asChild>
                    <Button variant="ghost" className="w-full">Dismiss All</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>

            {/* Left Drawer */}
            <Drawer direction="left">
              <DrawerTrigger asChild>
                <Button variant="secondary" className="w-full">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Left
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Navigation</DrawerTitle>
                  <DrawerDescription>
                    Quick access to all sections.
                  </DrawerDescription>
                </DrawerHeader>
                <div className="p-6 space-y-1">
                  {["Dashboard", "Marketplace", "Collections", "Profile", "Settings"].map((item) => (
                    <button
                      key={item}
                      className="w-full text-left px-4 py-3 rounded-lg text-sm text-foreground hover:bg-frosted-1 transition-colors"
                    >
                      {item}
                    </button>
                  ))}
                </div>
                <DrawerFooter>
                  <DrawerClose asChild>
                    <Button variant="ghost" className="w-full">Close</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>

            {/* Right Drawer */}
            <Drawer direction="right">
              <DrawerTrigger asChild>
                <Button variant="secondary" className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Right
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Shopping Cart</DrawerTitle>
                  <DrawerDescription>
                    Review your items before checkout.
                  </DrawerDescription>
                </DrawerHeader>
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-frosted-1 border border-border-subtle">
                    <div className="w-16 h-16 rounded-lg bg-frosted-2 flex items-center justify-center border border-border-subtle">
                      <span className="text-xs text-muted-foreground">NFT</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">Digital Art #1234</p>
                      <p className="text-xs text-muted-foreground">0.5 ETH</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-border-subtle">
                    <span className="text-sm text-muted-foreground">Total</span>
                    <span className="text-lg font-semibold text-foreground">0.5 ETH</span>
                  </div>
                </div>
                <DrawerFooter>
                  <Button className="w-full">Checkout</Button>
                  <DrawerClose asChild>
                    <Button variant="ghost" className="w-full">Continue Shopping</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
        </section>

        {/* Section 7: Complex Example */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-foreground">Complex Example</h2>
            <Badge variant="secondary">Multi-step form</Badge>
          </div>

          <Drawer>
            <DrawerTrigger asChild>
              <Button className="w-full md:w-auto">
                <Settings className="w-4 h-4 mr-2" />
                Open Settings
              </Button>
            </DrawerTrigger>
            <DrawerContent className="bg-card border-border w-full sm:max-w-lg">
              <DrawerHeader className="border-b border-border-subtle">
                <DrawerTitle className="text-foreground flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Settings
                </DrawerTitle>
                <DrawerDescription>
                  Manage your account preferences and settings
                </DrawerDescription>
              </DrawerHeader>
              <div className="p-4 space-y-6">
                {/* Profile Section */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    Profile
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-xs">Display Name</Label>
                      <Input placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Username</Label>
                      <Input placeholder="@johndoe" />
                    </div>
                  </div>
                </div>

                {/* Preferences Section */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Palette className="w-4 h-4 text-muted-foreground" />
                    Preferences
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-foreground">Email Notifications</p>
                        <p className="text-xs text-muted-foreground">Receive updates about your items</p>
                      </div>
                      <input type="checkbox" defaultChecked className="rounded border-os-gray-400" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-foreground">Push Notifications</p>
                        <p className="text-xs text-muted-foreground">Get notified about bids and offers</p>
                      </div>
                      <input type="checkbox" defaultChecked className="rounded border-os-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Language Section */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    Language & Region
                  </h3>
                  <Select defaultValue="en">
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="vi">Vietnamese</SelectItem>
                      <SelectItem value="ja">Japanese</SelectItem>
                      <SelectItem value="ko">Korean</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DrawerFooter className="border-t border-border-subtle mt-auto">
                <Button className="w-full">Save Changes</Button>
                <DrawerClose asChild>
                  <Button variant="ghost" className="w-full">Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </section>
      </div>
    </div>
  );
}
