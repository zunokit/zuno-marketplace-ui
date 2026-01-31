"use client";

import * as React from "react";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import {
  Grid3X3,
  Maximize,
  MoveHorizontal,
  BoxSelect,
  Smartphone,
  Ruler,
  Layers,
  Sun,
  LayoutTemplate,
  ChevronLeft,
  Sparkles,
  LayoutDashboard,
  Image as ImageIcon,
  Menu,
  Heart,
  Eye,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

// ============================================
// LAYOUT DEBUG PAGE - Visual Layout System Showcase
// ============================================

// --- Types ---

interface SectionProps {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  description?: string;
}

interface ContainerWidth {
  name: string;
  class: string;
  pixels: string;
}

interface SpacingValue {
  name: string;
  class: string;
  pixels: string;
}

interface RadiusValue {
  name: string;
  class: string;
}

interface ShadowValue {
  name: string;
  class: string;
}

// --- Data Constants ---

const containerWidths: ContainerWidth[] = [
  { name: "xs", class: "max-w-xs", pixels: "320px" },
  { name: "sm", class: "max-w-sm", pixels: "384px" },
  { name: "md", class: "max-w-md", pixels: "448px" },
  { name: "lg", class: "max-w-lg", pixels: "512px" },
  { name: "xl", class: "max-w-xl", pixels: "576px" },
  { name: "2xl", class: "max-w-2xl", pixels: "672px" },
  { name: "3xl", class: "max-w-3xl", pixels: "768px" },
  { name: "4xl", class: "max-w-4xl", pixels: "896px" },
  { name: "5xl", class: "max-w-5xl", pixels: "1024px" },
  { name: "6xl", class: "max-w-6xl", pixels: "1152px" },
  { name: "7xl", class: "max-w-7xl", pixels: "1280px" },
];

const spacingValues: SpacingValue[] = [
  { name: "0", class: "p-0", pixels: "0px" },
  { name: "0.5", class: "p-0.5", pixels: "2px" },
  { name: "1", class: "p-1", pixels: "4px" },
  { name: "1.5", class: "p-1.5", pixels: "6px" },
  { name: "2", class: "p-2", pixels: "8px" },
  { name: "2.5", class: "p-2.5", pixels: "10px" },
  { name: "3", class: "p-3", pixels: "12px" },
  { name: "3.5", class: "p-3.5", pixels: "14px" },
  { name: "4", class: "p-4", pixels: "16px" },
  { name: "5", class: "p-5", pixels: "20px" },
  { name: "6", class: "p-6", pixels: "24px" },
  { name: "7", class: "p-7", pixels: "28px" },
  { name: "8", class: "p-8", pixels: "32px" },
  { name: "9", class: "p-9", pixels: "36px" },
  { name: "10", class: "p-10", pixels: "40px" },
  { name: "11", class: "p-11", pixels: "44px" },
  { name: "12", class: "p-12", pixels: "48px" },
  { name: "14", class: "p-14", pixels: "56px" },
  { name: "16", class: "p-16", pixels: "64px" },
  { name: "20", class: "p-20", pixels: "80px" },
  { name: "24", class: "p-24", pixels: "96px" },
];

const radiusValues: RadiusValue[] = [
  { name: "none", class: "rounded-none" },
  { name: "sm", class: "rounded-sm" },
  { name: "DEFAULT", class: "rounded" },
  { name: "md", class: "rounded-md" },
  { name: "lg", class: "rounded-lg" },
  { name: "xl", class: "rounded-xl" },
  { name: "2xl", class: "rounded-2xl" },
  { name: "3xl", class: "rounded-3xl" },
  { name: "full", class: "rounded-full" },
];

const shadowValues: ShadowValue[] = [
  { name: "none", class: "shadow-none" },
  { name: "sm", class: "shadow-sm" },
  { name: "DEFAULT", class: "shadow" },
  { name: "md", class: "shadow-md" },
  { name: "lg", class: "shadow-lg" },
  { name: "xl", class: "shadow-xl" },
  { name: "2xl", class: "shadow-2xl" },
  { name: "inner", class: "shadow-inner" },
];

const flexJustifyOptions = [
  { name: "start", class: "justify-start" },
  { name: "center", class: "justify-center" },
  { name: "end", class: "justify-end" },
  { name: "between", class: "justify-between" },
  { name: "around", class: "justify-around" },
  { name: "evenly", class: "justify-evenly" },
];

const flexAlignOptions = [
  { name: "start", class: "items-start" },
  { name: "center", class: "items-center" },
  { name: "end", class: "items-end" },
  { name: "stretch", class: "items-stretch" },
  { name: "baseline", class: "items-baseline" },
];

// --- Components ---

const Section: React.FC<SectionProps> = ({ title, icon: Icon, children, description }) => (
  <section className="space-y-4">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-os-gray-400 flex items-center justify-center">
        <Icon className="w-4 h-4 text-os-info" />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
    </div>
    <div className="pl-11">{children}</div>
    <Separator className="bg-os-gray-400/30" />
  </section>
);

const BreakpointIndicator: React.FC = () => {
  const [breakpoint, setBreakpoint] = React.useState<string>("checking...");

  React.useEffect(() => {
    const checkBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 640) setBreakpoint("xs (< 640px)");
      else if (width < 768) setBreakpoint("sm (640px - 767px)");
      else if (width < 1024) setBreakpoint("md (768px - 1023px)");
      else if (width < 1280) setBreakpoint("lg (1024px - 1279px)");
      else if (width < 1536) setBreakpoint("xl (1280px - 1535px)");
      else setBreakpoint("2xl (>= 1536px)");
    };

    checkBreakpoint();
    window.addEventListener("resize", checkBreakpoint);
    return () => window.removeEventListener("resize", checkBreakpoint);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-os-gray-400 border border-os-gray-300 text-foreground px-4 py-2 rounded-lg shadow-lg">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-os-info" />
          <span className="text-sm font-medium">{breakpoint}</span>
        </div>
      </div>
    </div>
  );
};

// --- Main Page Component ---

export default function LayoutDebugPage() {
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background p-6 md:p-10">
        <BreakpointIndicator />

        {/* Page Header */}
        <div className="mx-auto max-w-7xl space-y-2 mb-10">
          <Link
            href="/debug"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Debug Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-os-gray-400 flex items-center justify-center">
              <Grid3X3 className="w-5 h-5 text-os-info" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Layout System
              </h1>
              <p className="text-muted-foreground">
                Container widths, grid system, spacing, flexbox, and responsive breakpoints
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl space-y-10">
          {/* 1. Container Widths */}
          <Section
            title="Container Widths"
            icon={Maximize}
            description="Max-width utilities for controlling the width of elements"
          >
            <div className="space-y-3 overflow-x-auto">
              {containerWidths.map((container) => (
                <Tooltip key={container.name}>
                  <TooltipTrigger asChild>
                    <div
                      className={`${container.class} bg-os-info/20 border-2 border-os-info/50 h-12 rounded flex items-center px-4 cursor-help`}
                    >
                      <span className="text-sm font-medium text-os-info whitespace-nowrap">
                        {container.class} ({container.pixels})
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Max width: {container.pixels}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </Section>

          {/* 2. Grid System */}
          <Section
            title="Grid System"
            icon={Grid3X3}
            description="CSS Grid utilities for creating responsive layouts"
          >
            <div className="space-y-6">
              {/* Column variations */}
              {[1, 2, 3, 4, 6, 12].map((cols) => (
                <div key={cols} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">
                      grid-cols-{cols}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {cols} columns
                    </Badge>
                  </div>
                  <div className={`grid grid-cols-${cols} gap-2`}>
                    {Array.from({ length: cols }).map((_, i) => (
                      <div
                        key={i}
                        className="bg-os-success/20 border border-os-success/50 h-10 rounded flex items-center justify-center text-xs text-os-success"
                      >
                        {i + 1}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Responsive grid */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    Responsive Grid
                  </span>
                  <Badge variant="outline" className="text-xs">
                    1 col (mobile) → 2 col (sm) → 3 col (md) → 4 col (lg)
                  </Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-os-warning/20 border border-os-warning/50 h-10 rounded flex items-center justify-center text-xs text-os-warning"
                    >
                      Item {i + 1}
                    </div>
                  ))}
                </div>
              </div>

              {/* Gap variations */}
              <div className="space-y-2">
                <span className="text-sm font-medium text-foreground">Gap Variations</span>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[0, 2, 4, 8].map((gap) => (
                    <div key={gap} className="space-y-1">
                      <span className="text-xs text-muted-foreground">gap-{gap}</span>
                      <div className={`grid grid-cols-2 gap-${gap}`}>
                        <div className="bg-os-gray-400 h-8 rounded" />
                        <div className="bg-os-gray-400 h-8 rounded" />
                        <div className="bg-os-gray-400 h-8 rounded" />
                        <div className="bg-os-gray-400 h-8 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          {/* 3. Spacing Scale */}
          <Section
            title="Spacing Scale"
            icon={MoveHorizontal}
            description="Padding, margin, and gap utilities (0-24)"
          >
            <div className="space-y-2">
              {spacingValues.map((spacing) => (
                <div key={spacing.name} className="flex items-center gap-4">
                  <div className="w-16 text-xs text-muted-foreground font-mono">
                    {spacing.class}
                  </div>
                  <div className="w-12 text-xs text-muted-foreground">{spacing.pixels}</div>
                  <div className="flex-1 bg-card/50 rounded overflow-hidden">
                    <div
                      className={`${spacing.class} bg-os-rare/30 border border-os-rare/50 inline-block`}
                    >
                      <div className="w-4 h-4 bg-os-rare rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* 4. Flexbox Patterns */}
          <Section
            title="Flexbox Patterns"
            icon={BoxSelect}
            description="Flex container utilities for layout control"
          >
            <div className="space-y-6">
              {/* Direction */}
              <div className="space-y-2">
                <span className="text-sm font-medium text-foreground">Direction</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">flex-row</span>
                    <div className="flex flex-row gap-2 bg-card/30 p-3 rounded">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="w-12 h-12 bg-os-legendary/30 border border-os-legendary/50 rounded flex items-center justify-center text-os-legendary"
                        >
                          {i}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">flex-col</span>
                    <div className="flex flex-col gap-2 bg-card/30 p-3 rounded">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="w-full h-8 bg-os-legendary/30 border border-os-legendary/50 rounded flex items-center justify-center text-os-legendary"
                        >
                          {i}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Justify Content */}
              <div className="space-y-2">
                <span className="text-sm font-medium text-foreground">Justify Content</span>
                <div className="space-y-3">
                  {flexJustifyOptions.map((option) => (
                    <div key={option.name} className="space-y-1">
                      <span className="text-xs text-muted-foreground">{option.class}</span>
                      <div
                        className={`flex ${option.class} gap-2 bg-card/30 p-3 rounded h-16`}
                      >
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="w-10 h-10 bg-os-epic/30 border border-os-epic/50 rounded flex items-center justify-center text-os-epic text-sm"
                          >
                            {i}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Align Items */}
              <div className="space-y-2">
                <span className="text-sm font-medium text-foreground">Align Items</span>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {flexAlignOptions.map((option) => (
                    <div key={option.name} className="space-y-1">
                      <span className="text-xs text-muted-foreground">{option.class}</span>
                      <div
                        className={`flex ${option.class} gap-2 bg-card/30 p-3 rounded h-24`}
                      >
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className={`w-8 bg-os-success/30 border border-os-success/50 rounded flex items-center justify-center text-os-success text-sm ${
                              i === 2 ? "h-12" : "h-8"
                            }`}
                          >
                            {i}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Wrap */}
              <div className="space-y-2">
                <span className="text-sm font-medium text-foreground">Wrap Behavior</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">flex-nowrap</span>
                    <div className="flex flex-nowrap gap-2 bg-card/30 p-3 rounded overflow-hidden">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div
                          key={i}
                          className="w-16 h-10 bg-os-error/30 border border-os-error/50 rounded flex items-center justify-center text-os-error text-sm shrink-0"
                        >
                          {i + 1}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">flex-wrap</span>
                    <div className="flex flex-wrap gap-2 bg-card/30 p-3 rounded">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div
                          key={i}
                          className="w-16 h-10 bg-os-error/30 border border-os-error/50 rounded flex items-center justify-center text-os-error text-sm"
                        >
                          {i + 1}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Section>

          {/* 5. Responsive Breakpoints */}
          <Section
            title="Responsive Breakpoints"
            icon={Smartphone}
            description="Show/hide elements at different screen sizes"
          >
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="hidden xs:block p-4 bg-card/50 rounded border border-border text-center">
                  <span className="text-xs text-muted-foreground block">xs</span>
                  <span className="text-sm font-medium text-foreground">Always visible</span>
                </div>
                <div className="hidden sm:block p-4 bg-os-success/20 rounded border border-os-success/50 text-center">
                  <span className="text-xs text-os-success block">sm</span>
                  <span className="text-sm font-medium text-foreground">&gt;= 640px</span>
                </div>
                <div className="hidden md:block p-4 bg-os-info/20 rounded border border-os-info/50 text-center">
                  <span className="text-xs text-os-info block">md</span>
                  <span className="text-sm font-medium text-foreground">&gt;= 768px</span>
                </div>
                <div className="hidden lg:block p-4 bg-os-warning/20 rounded border border-os-warning/50 text-center">
                  <span className="text-xs text-os-warning block">lg</span>
                  <span className="text-sm font-medium text-foreground">&gt;= 1024px</span>
                </div>
                <div className="hidden xl:block p-4 bg-os-legendary/20 rounded border border-os-legendary/50 text-center">
                  <span className="text-xs text-os-legendary block">xl</span>
                  <span className="text-sm font-medium text-foreground">&gt;= 1280px</span>
                </div>
                <div className="hidden 2xl:block p-4 bg-os-epic/20 rounded border border-os-epic/50 text-center">
                  <span className="text-xs text-os-epic block">2xl</span>
                  <span className="text-sm font-medium text-foreground">&gt;= 1536px</span>
                </div>
              </div>

              <div className="p-4 bg-frosted-1 border border-border-subtle rounded">
                <p className="text-sm text-muted-foreground">
                  Resize your browser window to see the breakpoint indicator (bottom-right)
                  change and different boxes appear/disappear above.
                </p>
              </div>
            </div>
          </Section>

          {/* 6. Border Radius */}
          <Section
            title="Border Radius"
            icon={Sun}
            description="Rounded corner utilities"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {radiusValues.map((radius) => (
                <div key={radius.name} className="space-y-2 text-center">
                  <div
                    className={`${radius.class} w-full h-20 bg-os-gray-400 border border-os-gray-300 flex items-center justify-center`}
                  >
                    <span className="text-xs text-muted-foreground font-mono">{radius.class}</span>
                  </div>
                  <span className="text-xs text-foreground">{radius.name}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* 7. Shadows */}
          <Section
            title="Shadows"
            icon={Layers}
            description="Box shadow utilities for depth and elevation"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {shadowValues.map((shadow) => (
                <div key={shadow.name} className="space-y-2 text-center">
                  <div
                    className={`${shadow.class} w-full h-24 bg-card rounded-lg border border-border flex items-center justify-center`}
                  >
                    <span className="text-xs text-muted-foreground font-mono">{shadow.class}</span>
                  </div>
                  <span className="text-xs text-foreground">{shadow.name}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* 8. Common Layout Patterns */}
          <Section
            title="Common Layout Patterns"
            icon={LayoutTemplate}
            description="Reusable layout patterns for common UI scenarios"
          >
            <div className="space-y-8">
              {/* Card Grid */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Card Grid</span>
                  <Badge variant="outline" className="text-xs">
                    Common pattern for NFT collections
                  </Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-card/30 rounded">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-card rounded-lg border border-border overflow-hidden"
                    >
                      <div className="aspect-square bg-os-gray-400/50" />
                      <div className="p-3 space-y-2">
                        <div className="h-3 bg-os-gray-400 rounded w-3/4" />
                        <div className="h-3 bg-os-gray-400/50 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sidebar Layout */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Sidebar Layout</span>
                  <Badge variant="outline" className="text-xs">
                    Dashboard / Admin layouts
                  </Badge>
                </div>
                <div className="flex h-48 rounded overflow-hidden border border-border">
                  <div className="w-48 bg-os-gray-400 p-4 space-y-2 hidden md:block">
                    <div className="h-3 bg-os-gray-300/50 rounded" />
                    <div className="h-3 bg-os-gray-300/30 rounded w-3/4" />
                    <div className="h-3 bg-os-gray-300/30 rounded w-1/2" />
                  </div>
                  <div className="flex-1 bg-card/50 p-4">
                    <div className="h-full bg-card rounded border border-border p-4">
                      <div className="h-4 bg-os-gray-400/50 rounded w-1/3 mb-4" />
                      <div className="space-y-2">
                        <div className="h-3 bg-os-gray-400/30 rounded" />
                        <div className="h-3 bg-os-gray-400/30 rounded" />
                        <div className="h-3 bg-os-gray-400/30 rounded w-2/3" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Header + Content */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Header + Content</span>
                  <Badge variant="outline" className="text-xs">
                    Standard page layout
                  </Badge>
                </div>
                <div className="rounded overflow-hidden border border-border">
                  <div className="h-12 bg-os-gray-400 px-4 flex items-center justify-between">
                    <div className="h-4 bg-os-gray-300/50 rounded w-24" />
                    <div className="flex gap-2">
                      <div className="w-8 h-8 bg-os-gray-300/30 rounded" />
                      <div className="w-8 h-8 bg-os-gray-300/30 rounded" />
                    </div>
                  </div>
                  <div className="h-32 bg-card/50 p-4">
                    <div className="max-w-3xl mx-auto space-y-3">
                      <div className="h-4 bg-os-gray-400/50 rounded w-1/2" />
                      <div className="h-3 bg-os-gray-400/30 rounded" />
                      <div className="h-3 bg-os-gray-400/30 rounded" />
                      <div className="h-3 bg-os-gray-400/30 rounded w-3/4" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Split Screen */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Split Screen</span>
                  <Badge variant="outline" className="text-xs">
                    Landing pages / Auth
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 h-48 rounded overflow-hidden border border-border">
                  <div className="bg-os-info/20 p-6 flex flex-col justify-center items-center text-center">
                    <div className="w-16 h-16 bg-os-info/30 rounded-full mb-4" />
                    <div className="h-4 bg-os-info/40 rounded w-32 mb-2" />
                    <div className="h-3 bg-os-info/20 rounded w-48" />
                  </div>
                  <div className="bg-card p-6 flex flex-col justify-center">
                    <div className="h-4 bg-os-gray-400/50 rounded w-24 mb-4" />
                    <div className="space-y-2">
                      <div className="h-10 bg-os-gray-400/30 rounded" />
                      <div className="h-10 bg-os-gray-400/30 rounded" />
                      <div className="h-10 bg-os-success/30 rounded mt-4" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sticky Header with Scrollable Content */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    Sticky Header Pattern
                  </span>
                  <Badge variant="outline" className="text-xs">
                    Tables / Lists
                  </Badge>
                </div>
                <div className="h-48 rounded overflow-hidden border border-border">
                  <div className="h-10 bg-os-gray-400 px-4 flex items-center sticky top-0">
                    <div className="flex-1 h-3 bg-os-gray-300/50 rounded mr-4" />
                    <div className="w-24 h-3 bg-os-gray-300/50 rounded" />
                  </div>
                  <div className="overflow-y-auto h-[calc(12rem-2.5rem)]">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-12 px-4 flex items-center border-b border-border/30 bg-card/30"
                      >
                        <div className="flex-1 h-3 bg-os-gray-400/30 rounded mr-4" />
                        <div className="w-24 h-3 bg-os-gray-400/30 rounded" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Section>

          {/* 9. Layout Pattern Improvements */}
          <Section
            title="Layout Pattern Improvements"
            icon={Sparkles}
            description="Real-world layout patterns comparing standard vs improved implementations"
          >
            <div className="space-y-12">
              {/* NFT Grid Comparison */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">NFT Card Grid</span>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs">Standard</Badge>
                    <span className="text-muted-foreground">vs</span>
                    <Badge variant="success" className="text-xs"></Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Standard Layout */}
                  <div className="space-y-2">
                    <span className="text-xs text-muted-foreground font-mono">Standard: Basic grid with inconsistent spacing</span>
                    <div className="p-4 bg-card/30 rounded border border-border">
                      <div className="grid grid-cols-2 gap-2">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div key={i} className="bg-card rounded border border-border overflow-hidden">
                            <div className="aspect-square bg-os-gray-400/50" />
                            <div className="p-2 space-y-1">
                              <div className="h-2 bg-os-gray-400 rounded w-3/4" />
                              <div className="h-2 bg-os-gray-400/50 rounded w-1/2" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/*  Layout */}
                  <div className="space-y-2">
                    <span className="text-xs text-os-success font-mono">: 8px rhythm, visual hierarchy, hover states</span>
                    <div className="p-4 bg-card/30 rounded border border-os-success/30">
                      <div className="grid grid-cols-2 gap-3">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div
                            key={i}
                            className="group bg-card rounded-lg border border-border overflow-hidden transition-all duration-200 hover:border-os-success/50 hover:shadow-md hover:-translate-y-0.5"
                          >
                            <div className="relative aspect-square bg-os-gray-400/50 overflow-hidden">
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="w-6 h-6 rounded-full bg-background/90 flex items-center justify-center">
                                  <Heart className="w-3 h-3 text-os-error" />
                                </div>
                              </div>
                            </div>
                            <div className="p-3 space-y-2">
                              <div className="h-2.5 bg-os-gray-400 rounded w-3/4" />
                              <div className="flex items-center justify-between">
                                <div className="h-2 bg-os-success/50 rounded w-12" />
                                <div className="h-2 bg-os-gray-400/30 rounded w-8" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Improvements */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-os-success/10 rounded border border-os-success/20">
                    <span className="text-os-success font-medium">Spacing Rhythm</span>
                    <p className="text-muted-foreground mt-1">Consistent 8px base unit (gap-3 = 12px)</p>
                  </div>
                  <div className="p-3 bg-os-success/10 rounded border border-os-success/20">
                    <span className="text-os-success font-medium">Visual Hierarchy</span>
                    <p className="text-muted-foreground mt-1">Larger padding, clearer text sizing</p>
                  </div>
                  <div className="p-3 bg-os-success/10 rounded border border-os-success/20">
                    <span className="text-os-success font-medium">Hover Feedback</span>
                    <p className="text-muted-foreground mt-1">Lift, shadow, and action reveal</p>
                  </div>
                  <div className="p-3 bg-os-success/10 rounded border border-os-success/20">
                    <span className="text-os-success font-medium">Border Radius</span>
                    <p className="text-muted-foreground mt-1">rounded-lg for modern feel</p>
                  </div>
                </div>
              </div>

              <Separator className="bg-os-gray-400/30" />

              {/* Dashboard Sidebar Comparison */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Dashboard Sidebar Layout</span>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs">Standard</Badge>
                    <span className="text-muted-foreground">vs</span>
                    <Badge variant="success" className="text-xs"></Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Standard Layout */}
                  <div className="space-y-2">
                    <span className="text-xs text-muted-foreground font-mono">Standard: Fixed sidebar, no responsive behavior</span>
                    <div className="h-56 rounded overflow-hidden border border-border">
                      <div className="flex h-full">
                        <div className="w-40 bg-os-gray-400 p-3 space-y-2">
                          <div className="h-8 bg-os-gray-300/30 rounded" />
                          <div className="h-6 bg-os-gray-300/20 rounded" />
                          <div className="h-6 bg-os-gray-300/20 rounded" />
                          <div className="h-6 bg-os-gray-300/20 rounded" />
                        </div>
                        <div className="flex-1 bg-card/50 p-3">
                          <div className="h-full bg-card rounded border border-border p-3 space-y-2">
                            <div className="h-4 bg-os-gray-400/50 rounded w-1/3" />
                            <div className="h-20 bg-os-gray-400/30 rounded" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/*  Layout */}
                  <div className="space-y-2">
                    <span className="text-xs text-os-success font-mono">: Collapsible, responsive, better spacing</span>
                    <div className="h-56 rounded overflow-hidden border border-os-success/30">
                      <div className="flex h-full">
                        {/* Collapsible Sidebar */}
                        <div className="hidden md:flex w-48 bg-os-gray-400/80 backdrop-blur flex-col p-4 space-y-4 border-r border-border/50">
                          <div className="flex items-center gap-2 pb-4 border-b border-border/50">
                            <LayoutDashboard className="w-5 h-5 text-os-info" />
                            <span className="text-sm font-medium">Dashboard</span>
                          </div>
                          <div className="space-y-1">
                            {['Overview', 'Analytics', 'Sales', 'Settings'].map((item, i) => (
                              <div
                                key={item}
                                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                                  i === 0 ? 'bg-os-info/20 text-os-info' : 'hover:bg-os-gray-400/50 text-muted-foreground'
                                }`}
                              >
                                <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-os-info' : 'bg-os-gray-300'}`} />
                                {item}
                              </div>
                            ))}
                          </div>
                        </div>
                        {/* Mobile Menu Button */}
                        <div className="md:hidden absolute top-2 left-2 z-10">
                          <div className="w-8 h-8 bg-os-gray-400 rounded flex items-center justify-center">
                            <Menu className="w-4 h-4" />
                          </div>
                        </div>
                        {/* Main Content */}
                        <div className="flex-1 bg-card/30 p-4 md:p-6">
                          <div className="h-full space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="h-5 bg-os-gray-400/50 rounded w-32" />
                              <div className="flex gap-2">
                                <div className="h-8 w-20 bg-os-success/30 rounded" />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="h-20 bg-card rounded-lg border border-border/50 p-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <TrendingUp className="w-4 h-4 text-os-success" />
                                  <span className="text-xs text-muted-foreground">Revenue</span>
                                </div>
                                <div className="h-4 bg-os-success/30 rounded w-20" />
                              </div>
                              <div className="h-20 bg-card rounded-lg border border-border/50 p-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <Eye className="w-4 h-4 text-os-info" />
                                  <span className="text-xs text-muted-foreground">Views</span>
                                </div>
                                <div className="h-4 bg-os-info/30 rounded w-20" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Improvements */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-os-success/10 rounded border border-os-success/20">
                    <span className="text-os-success font-medium">Collapsible</span>
                    <p className="text-muted-foreground mt-1">Hidden on mobile, visible on md+</p>
                  </div>
                  <div className="p-3 bg-os-success/10 rounded border border-os-success/20">
                    <span className="text-os-success font-medium">Visual Cues</span>
                    <p className="text-muted-foreground mt-1">Active state, icons, dividers</p>
                  </div>
                  <div className="p-3 bg-os-success/10 rounded border border-os-success/20">
                    <span className="text-os-success font-medium">Content Spacing</span>
                    <p className="text-muted-foreground mt-1">Proper padding (p-6) for breathing room</p>
                  </div>
                  <div className="p-3 bg-os-success/10 rounded border border-os-success/20">
                    <span className="text-os-success font-medium">Card Layout</span>
                    <p className="text-muted-foreground mt-1">Stats in organized card grid</p>
                  </div>
                </div>
              </div>

              <Separator className="bg-os-gray-400/30" />

              {/* Mobile Responsive Patterns */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Mobile-Responsive Patterns</span>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs">Standard</Badge>
                    <span className="text-muted-foreground">vs</span>
                    <Badge variant="success" className="text-xs"></Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Standard Layout */}
                  <div className="space-y-2">
                    <span className="text-xs text-muted-foreground font-mono">Standard: Same layout, breaks on mobile</span>
                    <div className="p-4 bg-card/30 rounded border border-border">
                      <div className="max-w-[200px] mx-auto bg-card rounded-lg border border-border overflow-hidden">
                        <div className="p-2 space-y-2">
                          <div className="grid grid-cols-3 gap-1">
                            {Array.from({ length: 6 }).map((_, i) => (
                              <div key={i} className="aspect-square bg-os-gray-400/50 rounded" />
                            ))}
                          </div>
                          <div className="h-16 bg-os-gray-400/30 rounded" />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground text-center mt-2">Grid too dense, text unreadable</p>
                    </div>
                  </div>

                  {/*  Layout */}
                  <div className="space-y-2">
                    <span className="text-xs text-os-success font-mono">: Adaptive grid, touch-friendly</span>
                    <div className="p-4 bg-card/30 rounded border border-os-success/30">
                      <div className="max-w-[200px] mx-auto bg-card rounded-lg border border-border overflow-hidden">
                        <div className="p-3 space-y-3">
                          <div className="grid grid-cols-2 gap-2">
                            {Array.from({ length: 4 }).map((_, i) => (
                              <div key={i} className="aspect-square bg-os-gray-400/50 rounded-md" />
                            ))}
                          </div>
                          <div className="h-20 bg-os-gray-400/30 rounded-md p-2 space-y-2">
                            <div className="h-3 bg-os-gray-400/50 rounded w-3/4" />
                            <div className="h-2 bg-os-gray-400/30 rounded w-1/2" />
                            <div className="pt-1">
                              <div className="h-7 bg-os-success/30 rounded w-full" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-os-success text-center mt-2">2-column grid, larger touch targets</p>
                    </div>
                  </div>
                </div>

                {/* Responsive Breakpoints Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border/30">
                        <th className="text-left py-2 text-muted-foreground font-medium">Pattern</th>
                        <th className="text-left py-2 text-muted-foreground font-medium">Mobile (&lt;640px)</th>
                        <th className="text-left py-2 text-muted-foreground font-medium">Tablet (640-1024px)</th>
                        <th className="text-left py-2 text-muted-foreground font-medium">Desktop (&gt;1024px)</th>
                      </tr>
                    </thead>
                    <tbody className="text-foreground">
                      <tr className="border-b border-border/20">
                        <td className="py-2">NFT Grid</td>
                        <td className="py-2 text-os-success">2 cols, gap-3</td>
                        <td className="py-2 text-os-success">3 cols, gap-4</td>
                        <td className="py-2 text-os-success">4-6 cols, gap-6</td>
                      </tr>
                      <tr className="border-b border-border/20">
                        <td className="py-2">Sidebar</td>
                        <td className="py-2 text-os-success">Hidden, hamburger</td>
                        <td className="py-2 text-os-success">Collapsed icon-only</td>
                        <td className="py-2 text-os-success">Full expanded</td>
                      </tr>
                      <tr className="border-b border-border/20">
                        <td className="py-2">Typography</td>
                        <td className="py-2 text-os-success">text-sm base</td>
                        <td className="py-2 text-os-success">text-base base</td>
                        <td className="py-2 text-os-success">text-lg headers</td>
                      </tr>
                      <tr>
                        <td className="py-2">Spacing</td>
                        <td className="py-2 text-os-success">p-3, gap-3</td>
                        <td className="py-2 text-os-success">p-4, gap-4</td>
                        <td className="py-2 text-os-success">p-6, gap-6</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <Separator className="bg-os-gray-400/30" />

              {/* Card Layouts with Hover Effects */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Card Layouts with Hover Effects</span>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs">Standard</Badge>
                    <span className="text-muted-foreground">vs</span>
                    <Badge variant="success" className="text-xs"></Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Standard Layout */}
                  <div className="space-y-2">
                    <span className="text-xs text-muted-foreground font-mono">Standard: Static cards, no interaction</span>
                    <div className="p-4 bg-card/30 rounded border border-border">
                      <div className="grid grid-cols-2 gap-2">
                        {Array.from({ length: 2 }).map((_, i) => (
                          <div key={i} className="bg-card rounded border border-border overflow-hidden">
                            <div className="aspect-video bg-os-gray-400/50" />
                            <div className="p-2 space-y-1">
                              <div className="h-2 bg-os-gray-400 rounded w-2/3" />
                              <div className="h-2 bg-os-gray-400/50 rounded w-1/2" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/*  Layout */}
                  <div className="space-y-2">
                    <span className="text-xs text-os-success font-mono">: Rich hover states, layered effects</span>
                    <div className="p-4 bg-card/30 rounded border border-os-success/30">
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { label: 'Legendary', color: 'bg-os-legendary', badge: 'legendary' },
                          { label: 'Epic', color: 'bg-os-epic', badge: 'epic' },
                        ].map((item, i) => (
                          <div
                            key={i}
                            className="group relative bg-card rounded-lg border border-border overflow-hidden transition-all duration-300 hover:border-os-success/50 hover:shadow-lg hover:-translate-y-1"
                          >
                            <div className="relative aspect-video bg-os-gray-400/50 overflow-hidden">
                              <div className={`absolute inset-0 ${item.color}/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                              <div className="absolute top-2 left-2">
                                <Badge variant={item.badge as 'legendary' | 'epic'} className="text-[10px]">{item.label}</Badge>
                              </div>
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="w-10 h-10 rounded-full bg-background/90 flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform">
                                  <Eye className="w-5 h-5 text-foreground" />
                                </div>
                              </div>
                            </div>
                            <div className="p-3 space-y-2">
                              <div className="h-2.5 bg-os-gray-400 rounded w-2/3" />
                              <div className="flex items-center justify-between">
                                <div className="h-2 bg-os-success/50 rounded w-12" />
                                <Heart className="w-3 h-3 text-muted-foreground group-hover:text-os-error transition-colors" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hover Effect Breakdown */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-os-success/10 rounded border border-os-success/20">
                    <span className="text-os-success font-medium">Transform</span>
                    <p className="text-muted-foreground mt-1">hover:-translate-y-1 for lift effect</p>
                  </div>
                  <div className="p-3 bg-os-success/10 rounded border border-os-success/20">
                    <span className="text-os-success font-medium">Shadow</span>
                    <p className="text-muted-foreground mt-1">hover:shadow-lg for depth</p>
                  </div>
                  <div className="p-3 bg-os-success/10 rounded border border-os-success/20">
                    <span className="text-os-success font-medium">Border</span>
                    <p className="text-muted-foreground mt-1">Color transition on hover</p>
                  </div>
                  <div className="p-3 bg-os-success/10 rounded border border-os-success/20">
                    <span className="text-os-success font-medium">Content Reveal</span>
                    <p className="text-muted-foreground mt-1">opacity-0 group-hover:opacity-100</p>
                  </div>
                </div>
              </div>
            </div>
          </Section>

          {/* Quick Reference */}
          <section className="p-6 bg-frosted-1 border border-border-subtle rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <Ruler className="w-5 h-5 text-os-info" />
              <h3 className="text-lg font-semibold text-foreground">Quick Reference</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
              <div>
                <h4 className="font-medium text-foreground mb-2">Container</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>max-w-xs to max-w-7xl</li>
                  <li>container (responsive)</li>
                  <li>mx-auto for centering</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-2">Grid</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>grid-cols-1 to grid-cols-12</li>
                  <li>col-span-1 to col-span-12</li>
                  <li>gap-0 to gap-24</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-2">Flexbox</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>flex-row, flex-col</li>
                  <li>justify-start to justify-evenly</li>
                  <li>items-start to items-baseline</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-2">Responsive</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>sm:, md:, lg:, xl:, 2xl:</li>
                  <li>hidden, block, flex, grid</li>
                  <li>Resize browser to test</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </TooltipProvider>
  );
}
