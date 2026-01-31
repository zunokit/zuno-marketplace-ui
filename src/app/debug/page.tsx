"use client";

import * as React from "react";
import Link from "next/link";
import { Badge } from "@/shared/components/ui/badge";
import {
  ChevronRight,
  Bug,
  Palette,
  Boxes,
} from "lucide-react";

// ============================================
// DEBUG DASHBOARD - Component Testing Hub
// ============================================

interface DebugRoute {
  href: string;
  title: string;
  description: string;
  icon: React.ElementType;
  badge?: string;
  status: "ready" | "wip" | "planned";
}

const debugRoutes: DebugRoute[] = [
  {
    href: "/debug/ui",
    title: "UI Components",
    description: "Complete showcase of all UI components in a single page with navigation",
    icon: Boxes,
    badge: "All-in-One",
    status: "ready",
  },
  {
    href: "/debug/colors",
    title: "Colors",
    description: "Color palette, semantic colors, and transparency effects",
    icon: Palette,
    status: "ready",
    badge: "Design System",
  },
  {
    href: "/debug/sentry",
    title: "Sentry",
    description: "Error tracking and monitoring integration",
    icon: Bug,
    status: "ready",
  },
];

export default function DebugDashboardPage() {
  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      {/* Page Header */}
      <div className="mx-auto max-w-5xl space-y-2 mb-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-frosted-6 flex items-center justify-center">
            <Bug className="w-5 h-5 text-os-info" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Debug Dashboard
            </h1>
            <p className="text-muted-foreground">
              Component testing and development environment
            </p>
          </div>
        </div>
      </div>

      {/* Routes Grid */}
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {debugRoutes.map((route) => {
            const Icon = route.icon;
            const isReady = route.status === "ready";

            return (
              <Link
                key={route.href}
                href={route.href}
                className={`
                  group relative flex flex-col p-5 rounded-lg border transition-all duration-200
                  ${isReady
                    ? "bg-card border-border hover:border-os-gray-300 hover:bg-os-gray-400 cursor-pointer"
                    : "bg-card/50 border-border/50 opacity-60 cursor-not-allowed pointer-events-none"
                  }
                `}
              >
                {/* Status Indicator */}
                <div className="absolute top-4 right-4">
                  {route.status === "ready" && (
                    <div className="w-2 h-2 rounded-full bg-os-success" />
                  )}
                  {route.status === "wip" && (
                    <div className="w-2 h-2 rounded-full bg-os-warning" />
                  )}
                  {route.status === "planned" && (
                    <div className="w-2 h-2 rounded-full bg-os-gray-300" />
                  )}
                </div>

                {/* Icon */}
                <div className="w-10 h-10 rounded-lg bg-frosted-1 border border-border-subtle flex items-center justify-center mb-4 group-hover:border-border-medium transition-colors">
                  <Icon className="w-5 h-5 text-muted-foreground" />
                </div>

                {/* Content */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-foreground">{route.title}</h3>
                    {route.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {route.badge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {route.description}
                  </p>
                </div>

                {/* Arrow */}
                {isReady && (
                  <div className="mt-4 flex items-center text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    <span>View</span>
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                )}

                {/* Coming Soon Overlay */}
                {!isReady && (
                  <div className="mt-4">
                    <Badge variant="outline" className="text-xs text-muted-foreground">
                      Coming Soon
                    </Badge>
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="mt-10 p-4 rounded-lg bg-frosted-1 border border-border-subtle">
          <h4 className="text-sm font-medium text-foreground mb-2">
            About Debug Pages
          </h4>
          <p className="text-sm text-muted-foreground">
            These pages are for development and testing purposes only. They showcase
            all component variants, states, and use cases to ensure consistency across
            the application. Components follow the OpenSea design system with custom
            color palette and styling.
          </p>
        </div>
      </div>
    </div>
  );
}
