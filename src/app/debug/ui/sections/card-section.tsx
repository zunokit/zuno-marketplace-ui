"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Heart, Crown, Zap } from "lucide-react";

export function CardSection() {
  return (
    <div className="space-y-8">
      {/* Card Variants */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Card Variants</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Default Card</CardTitle>
              <CardDescription>Standard card styling</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This is the default card variant with subtle styling.
              </p>
            </CardContent>
          </Card>

          <Card variant="frosted">
            <CardHeader>
              <CardTitle>Frosted Card</CardTitle>
              <CardDescription>With backdrop blur</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Frosted glass effect with backdrop blur.
              </p>
            </CardContent>
          </Card>

          <Card variant="gradient">
            <CardHeader>
              <CardTitle>Gradient Card</CardTitle>
              <CardDescription>With gradient border</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Subtle gradient border effect.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* NFT Cards */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">NFT Card Patterns</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { rarity: "legendary", color: "os-legendary", icon: Crown, label: "Legendary" },
            { rarity: "epic", color: "os-epic", icon: Zap, label: "Epic" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.rarity} className="overflow-hidden">
                <div className={`aspect-square bg-${item.color}/20 relative flex items-center justify-center`}>
                  <Icon className={`w-12 h-12 text-${item.color} opacity-50`} />
                  <div className="absolute top-2 left-2">
                    <Badge variant={item.rarity as "legendary" | "epic"}>{item.label}</Badge>
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">NFT #{Math.floor(Math.random() * 9999)}</CardTitle>
                  <CardDescription>Collection Name</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Floor</span>
                    <span className="text-sm font-medium font-mono">
                      {(Math.random() * 10).toFixed(2)} ETH
                    </span>
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
            );
          })}
        </div>
      </div>

      {/* Card with Footer */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Card with Actions</h4>
        <div className="max-w-md">
          <Card>
            <CardHeader>
              <CardTitle>Complete your profile</CardTitle>
              <CardDescription>
                Add your information to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Your profile is 60% complete. Add more details to improve your visibility.
              </p>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button variant="outline" className="flex-1">Skip</Button>
              <Button className="flex-1">Continue</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
