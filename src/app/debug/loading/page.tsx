"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, RefreshCw, Download, Save } from "lucide-react";
import { Spinner } from "@/shared/components/ui/spinner";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Progress } from "@/shared/components/ui/progress";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/utils/tailwind-utils";

// ============================================
// DEBUG LOADING PAGE - Loading Components Showcase
// ============================================

export default function DebugLoadingPage() {
  const [progress, setProgress] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);

  // Simulate progress for demo
  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + 10;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLoadingClick = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 3000);
  };

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
            <Loader2 className="w-5 h-5 text-os-info animate-spin" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Loading Components
            </h1>
            <p className="text-muted-foreground">
              Spinners, skeletons, progress bars, and loading states
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-8">
        {/* Spinner Variants */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Spinner Variants</CardTitle>
                <CardDescription>Different spinner sizes and styles</CardDescription>
              </div>
              <Badge variant="secondary">Core</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center">
              {/* Default */}
              <div className="flex flex-col items-center gap-3">
                <Spinner className="w-6 h-6" />
                <span className="text-xs text-muted-foreground">Default</span>
              </div>

              {/* Small */}
              <div className="flex flex-col items-center gap-3">
                <Spinner className="w-4 h-4" />
                <span className="text-xs text-muted-foreground">Small</span>
              </div>

              {/* Large */}
              <div className="flex flex-col items-center gap-3">
                <Spinner className="w-10 h-10" />
                <span className="text-xs text-muted-foreground">Large</span>
              </div>

              {/* Glow */}
              <div className="flex flex-col items-center gap-3">
                <Spinner variant="glow" className="w-8 h-8" />
                <span className="text-xs text-muted-foreground">Glow</span>
              </div>

              {/* Info */}
              <div className="flex flex-col items-center gap-3">
                <Spinner variant="info" className="w-8 h-8" />
                <span className="text-xs text-muted-foreground">Info</span>
              </div>

              {/* Warning */}
              <div className="flex flex-col items-center gap-3">
                <Spinner variant="warning" className="w-8 h-8" />
                <span className="text-xs text-muted-foreground">Warning</span>
              </div>
            </div>

            {/* Button Spinners */}
            <div className="mt-8 pt-8 border-t border-border-subtle">
              <h4 className="text-sm font-medium text-foreground mb-4">Button Spinners</h4>
              <div className="flex flex-wrap gap-4">
                <Button disabled>
                  <Spinner className="mr-2" />
                  Loading...
                </Button>
                <Button variant="secondary" disabled>
                  <Spinner className="mr-2" />
                  Processing
                </Button>
                <Button variant="outline" disabled>
                  <Spinner className="mr-2" />
                  Saving
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skeleton Variants */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Skeleton Variants</CardTitle>
                <CardDescription>Loading placeholders with shimmer effects</CardDescription>
              </div>
              <Badge variant="secondary">Core</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Text Skeletons */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-foreground">Text Lines</h4>
              <div className="space-y-2 max-w-md">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[90%]" />
                <Skeleton className="h-4 w-[75%]" />
                <Skeleton className="h-4 w-[60%]" />
              </div>
            </div>

            {/* Card Skeleton */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-foreground">Card Skeleton</h4>
              <div className="p-4 rounded-lg border border-border-subtle bg-frosted-1 max-w-sm">
                <Skeleton className="h-32 w-full rounded-md mb-4" />
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>

            {/* Avatar with Text */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-foreground">Avatar with Text</h4>
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            </div>

            {/* Frosted Glass Variant */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-foreground">Frosted Glass Variant</h4>
              <div className="p-4 rounded-lg border border-border-subtle bg-gradient-to-br from-os-gray-500 to-os-gray-700">
                <div className="flex items-center gap-4">
                  <Skeleton variant="frosted" className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton variant="frosted" className="h-4 w-40" />
                    <Skeleton variant="frosted" className="h-3 w-24" />
                  </div>
                </div>
              </div>
            </div>

            {/* Glow Variant */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-foreground">Glow Variant</h4>
              <div className="p-4 rounded-lg border border-border-subtle bg-frosted-1">
                <div className="flex items-center gap-4">
                  <Skeleton variant="glow" className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton variant="glow" className="h-4 w-40" />
                    <Skeleton variant="glow" className="h-3 w-24" />
                  </div>
                </div>
              </div>
            </div>

            {/* Shimmer Variant */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-foreground">Shimmer Variant</h4>
              <div className="p-4 rounded-lg border border-border-subtle bg-frosted-1">
                <div className="flex items-center gap-4">
                  <Skeleton variant="shimmer" className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton variant="shimmer" className="h-4 w-40" />
                    <Skeleton variant="shimmer" className="h-3 w-24" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Bar */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Progress Bar</CardTitle>
                <CardDescription>Linear progress indicators with animations</CardDescription>
              </div>
              <Badge variant="secondary">Core</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Default Progress */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Default</span>
                <span className="text-foreground font-medium">{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>

            {/* Gradient Progress */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Gradient with Glow</span>
                <span className="text-foreground font-medium">{progress}%</span>
              </div>
              <Progress variant="gradient" value={progress} className="h-3" />
            </div>

            {/* Success Progress */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Success State</span>
                <span className="text-os-success font-medium">{progress}%</span>
              </div>
              <Progress variant="success" value={progress} />
            </div>

            {/* More Variants */}
            <div className="space-y-4 pt-4 border-t border-border-subtle">
              <h4 className="text-sm font-medium text-foreground">More Variants</h4>
              <div className="space-y-4">
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">Info</span>
                  <Progress value={60} variant="info" />
                </div>
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">Warning</span>
                  <Progress value={70} variant="warning" />
                </div>
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">Shimmer</span>
                  <Progress value={80} variant="shimmer" />
                </div>
              </div>
            </div>

            {/* Sizes */}
            <div className="space-y-4 pt-4 border-t border-border-subtle">
              <h4 className="text-sm font-medium text-foreground">Sizes</h4>
              <div className="space-y-4">
                <Progress value={60} size="sm" />
                <Progress value={70} size="default" />
                <Progress value={80} size="lg" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading Button States */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Loading Button States</CardTitle>
                <CardDescription>Buttons with integrated loading indicators</CardDescription>
              </div>
              <Badge variant="secondary">Interactive</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button onClick={handleLoadingClick} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Spinner className="mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 w-4 h-4" />
                    Refresh Data
                  </>
                )}
              </Button>

              <Button variant="secondary" onClick={handleLoadingClick} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Spinner className="mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 w-4 h-4" />
                    Save Changes
                  </>
                )}
              </Button>

              <Button variant="outline" onClick={handleLoadingClick} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Spinner className="mr-2" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 w-4 h-4" />
                    Download
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Page Loader */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Page Loader</CardTitle>
                <CardDescription>Full-page loading overlay</CardDescription>
              </div>
              <Badge variant="secondary">Overlay</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative h-64 rounded-lg border border-border-subtle bg-card overflow-hidden">
              {/* Simulated Page Content */}
              <div className="p-6 space-y-4 opacity-30">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <div className="grid grid-cols-3 gap-4 pt-4">
                  <Skeleton className="h-24" />
                  <Skeleton className="h-24" />
                  <Skeleton className="h-24" />
                </div>
              </div>

              {/* Page Loader Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-os-gray-700/80 backdrop-blur-sm">
                <Spinner variant="glow" className="w-12 h-12 mb-4" />
                <p className="text-foreground font-medium">Loading page...</p>
                <p className="text-sm text-muted-foreground mt-1">Please wait</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Placeholder Shimmer */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Content Placeholder Shimmer</CardTitle>
                <CardDescription>Facebook-style content loading shimmer</CardDescription>
              </div>
              <Badge variant="secondary">Advanced</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Shimmer Card */}
              <div className="p-4 rounded-lg border border-border-subtle bg-frosted-1">
                <div className="flex gap-4">
                  <Skeleton className="h-16 w-16 rounded-md shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-border-subtle">
                  <Skeleton className="h-24 w-full rounded-md" />
                </div>
              </div>

              {/* Shimmer List */}
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-border-subtle bg-frosted-1">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                    <Skeleton className="h-8 w-16 rounded-md" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage Guidelines */}
        <Card className="bg-frosted-1">
          <CardHeader>
            <CardTitle>Usage Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-os-info mt-0.5">•</span>
                <span><strong>Spinners:</strong> Use for indeterminate loading states where duration is unknown</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-os-info mt-0.5">•</span>
                <span><strong>Skeletons:</strong> Use to reduce perceived loading time and prevent layout shift</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-os-info mt-0.5">•</span>
                <span><strong>Progress bars:</strong> Use for determinate operations with known progress (0-100%)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-os-info mt-0.5">•</span>
                <span><strong>Page loaders:</strong> Use for full-page transitions or initial data fetching</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-os-info mt-0.5">•</span>
                <span><strong>Shimmer:</strong> Use for content-heavy pages to create a preview of the layout</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
