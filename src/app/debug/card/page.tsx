"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, CreditCard, Heart, Share2, ExternalLink, MoreHorizontal, Star, Zap, Crown } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/shared/components/ui/card";

export default function CardDebugPage() {
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
            <CreditCard className="w-5 h-5 text-os-info" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Card Component
            </h1>
            <p className="text-muted-foreground">
              Card variants, layouts, and content patterns with OpenSea design
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-12">
        {/* Card Variants */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-foreground">Card Variants</h2>
            <Badge variant="secondary">3 variants</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Core card styles for different contexts and emphasis levels.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Default Card */}
            <Card>
              <CardHeader>
                <CardTitle>Default Card</CardTitle>
                <CardDescription>Standard card with subtle styling</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  The default card uses bg-card with border-subtle. Perfect for most content.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm">Action</Button>
              </CardFooter>
            </Card>

            {/* Frosted Card */}
            <Card variant="frosted">
              <CardHeader>
                <CardTitle>Frosted Card</CardTitle>
                <CardDescription>With backdrop blur effect</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  The frosted variant uses backdrop-blur for a glass-like appearance.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm">Action</Button>
              </CardFooter>
            </Card>

            {/* Gradient Card */}
            <Card variant="gradient">
              <CardHeader>
                <CardTitle>Gradient Card</CardTitle>
                <CardDescription>With gradient border effect</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  The gradient variant adds a subtle colorful border effect.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm">Action</Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* NFT Card Examples */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-foreground">NFT Card Patterns</h2>
            <Badge variant="secondary">Marketplace</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Common card patterns for NFT marketplace interfaces.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* NFT Card 1 */}
            <Card className="overflow-hidden">
              <div className="aspect-square bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500" />
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Crypto Punk #7823</CardTitle>
                <CardDescription>Larva Labs</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center gap-2">
                  <Badge variant="rare">Rare</Badge>
                  <span className="text-xs text-muted-foreground">2.5 ETH</span>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button size="sm" className="w-full">Buy Now</Button>
              </CardFooter>
            </Card>

            {/* NFT Card 2 */}
            <Card className="overflow-hidden">
              <div className="aspect-square bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500" />
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Bored Ape #4567</CardTitle>
                <CardDescription>BAYC</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center gap-2">
                  <Badge variant="legendary">
                    <Crown className="w-3 h-3" />
                    Legendary
                  </Badge>
                  <span className="text-xs text-muted-foreground">15.2 ETH</span>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <div className="flex gap-2 w-full">
                  <Button size="sm" className="flex-1">Buy</Button>
                  <Button size="sm" variant="outline">
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>

            {/* NFT Card 3 */}
            <Card className="overflow-hidden">
              <div className="aspect-square bg-gradient-to-br from-emerald-500 via-green-500 to-lime-500" />
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Art Blocks #1234</CardTitle>
                <CardDescription>Art Blocks</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center gap-2">
                  <Badge variant="epic">
                    <Zap className="w-3 h-3" />
                    Epic
                  </Badge>
                  <span className="text-xs text-muted-foreground">5.8 ETH</span>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button size="sm" variant="secondary" className="w-full">Make Offer</Button>
              </CardFooter>
            </Card>

            {/* NFT Card 4 */}
            <Card className="overflow-hidden">
              <div className="aspect-square bg-gradient-to-br from-red-500 via-rose-500 to-pink-500" />
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Doodle #9999</CardTitle>
                <CardDescription>Doodles</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Common</Badge>
                  <span className="text-xs text-muted-foreground">1.2 ETH</span>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button size="sm" variant="outline" className="w-full">View Details</Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Card with Actions */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-foreground">Cards with Actions</h2>
            <Badge variant="secondary">Interactive</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Cards with header actions and interactive elements.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* With Header Action */}
            <Card>
              <CardHeader>
                <CardTitle>Settings Card</CardTitle>
                <CardDescription>Manage your preferences</CardDescription>
                <CardAction>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </CardAction>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive updates about your items</p>
                  </div>
                  <div className="w-11 h-6 rounded-full bg-primary relative">
                    <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Public Profile</p>
                    <p className="text-sm text-muted-foreground">Make your profile visible</p>
                  </div>
                  <div className="w-11 h-6 rounded-full bg-muted relative">
                    <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card variant="frosted">
              <CardHeader>
                <CardTitle>Collection Stats</CardTitle>
                <CardDescription>Performance overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-frosted-1">
                    <p className="text-2xl font-semibold">2.5K</p>
                    <p className="text-sm text-muted-foreground">Items</p>
                  </div>
                  <div className="p-3 rounded-lg bg-frosted-1">
                    <p className="text-2xl font-semibold">1.2K</p>
                    <p className="text-sm text-muted-foreground">Owners</p>
                  </div>
                  <div className="p-3 rounded-lg bg-frosted-1">
                    <p className="text-2xl font-semibold text-os-success">+12%</p>
                    <p className="text-sm text-muted-foreground">Floor Price</p>
                  </div>
                  <div className="p-3 rounded-lg bg-frosted-1">
                    <p className="text-2xl font-semibold">850 ETH</p>
                    <p className="text-sm text-muted-foreground">Volume</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Content Patterns */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-foreground">Content Patterns</h2>
            <Badge variant="secondary">Layouts</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Different card content layouts and patterns.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* User Profile */}
            <Card>
              <CardHeader className="text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/50 mx-auto mb-4" />
                <CardTitle>John Doe</CardTitle>
                <CardDescription>@johndoe</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center gap-6 text-center">
                  <div>
                    <p className="font-semibold">142</p>
                    <p className="text-xs text-muted-foreground">Items</p>
                  </div>
                  <div>
                    <p className="font-semibold">12.5K</p>
                    <p className="text-xs text-muted-foreground">Followers</p>
                  </div>
                  <div>
                    <p className="font-semibold">89</p>
                    <p className="text-xs text-muted-foreground">Following</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-center gap-2">
                <Button size="sm">Follow</Button>
                <Button size="sm" variant="outline">
                  <Share2 className="w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>

            {/* Pricing Card */}
            <Card variant="gradient">
              <CardHeader className="text-center">
                <Badge variant="gradient" className="mx-auto mb-2">Pro</Badge>
                <CardTitle className="text-3xl">$29</CardTitle>
                <CardDescription>per month</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {["Unlimited listings", "Priority support", "Analytics dashboard", "Custom branding"].map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-os-success" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Get Started</Button>
              </CardFooter>
            </Card>

            {/* Activity Card */}
            <Card variant="frosted">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: "Purchased", item: "Crypto Punk #123", time: "2 min ago", price: "2.5 ETH" },
                    { action: "Sold", item: "Bored Ape #456", time: "1 hour ago", price: "15 ETH" },
                    { action: "Listed", item: "Art Block #789", time: "3 hours ago", price: "1.2 ETH" },
                  ].map((activity, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-gradient-to-br from-primary/30 to-primary/10" />
                        <div>
                          <p className="text-sm font-medium">{activity.item}</p>
                          <p className="text-xs text-muted-foreground">{activity.action} • {activity.time}</p>
                        </div>
                      </div>
                      <span className="text-sm font-medium">{activity.price}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Horizontal Cards */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-foreground">Horizontal Layouts</h2>
            <Badge variant="secondary">List view</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Horizontal card layouts for lists and tables.
          </p>

          <div className="space-y-4">
            <Card className="flex flex-col sm:flex-row">
              <div className="w-full sm:w-48 h-48 sm:h-auto bg-gradient-to-br from-violet-500 to-purple-500 shrink-0" />
              <div className="flex-1 p-6">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">Featured Collection</h3>
                    <p className="text-sm text-muted-foreground">By Artist Name</p>
                  </div>
                  <Badge variant="legendary">Featured</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  A curated collection of unique digital art pieces exploring the intersection of technology and creativity.
                </p>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-2xl font-semibold">5.2K</p>
                    <p className="text-xs text-muted-foreground">Items</p>
                  </div>
                  <div>
                    <p className="text-2xl font-semibold">2.1K</p>
                    <p className="text-xs text-muted-foreground">Owners</p>
                  </div>
                  <div className="ml-auto flex gap-2">
                    <Button variant="outline">View Collection</Button>
                    <Button>Follow</Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Card States */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-foreground">Card States</h2>
            <Badge variant="secondary">Interactive</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Cards with different interaction states.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Hoverable (default) */}
            <Card>
              <CardHeader>
                <CardTitle>Hoverable</CardTitle>
                <CardDescription>Default with hover effect</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Hover over this card to see the default hover effect.
                </p>
              </CardContent>
            </Card>

            {/* Non-hoverable */}
            <Card hoverable={false}>
              <CardHeader>
                <CardTitle>Static</CardTitle>
                <CardDescription>No hover effect</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  This card has hoverable=false and stays static.
                </p>
              </CardContent>
            </Card>

            {/* Selected State */}
            <Card className="ring-2 ring-primary">
              <CardHeader>
                <CardTitle>Selected</CardTitle>
                <CardDescription>With selection ring</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  This card demonstrates a selected state with ring.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Usage Guidelines */}
        <div className="p-4 rounded-lg bg-frosted-1 border border-border-subtle">
          <h4 className="text-sm font-medium text-foreground mb-2">
            Card Component Guidelines
          </h4>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• Use default variant for standard content containers</li>
            <li>• Use frosted variant for overlay panels and floating content</li>
            <li>• Use gradient variant for featured/premium content</li>
            <li>• All cards support hoverable prop for interaction control</li>
            <li>• CardHeader, CardContent, CardFooter provide consistent spacing</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
