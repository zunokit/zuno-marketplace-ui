"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Type, Copy, Check, Heart, ExternalLink } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";

// ============================================
// TYPOGRAPHY DEBUG PAGE
// ============================================

interface TypeSpecimenProps {
  label: string;
  className: string;
  description?: string;
  sampleText?: string;
}

function TypeSpecimen({
  label,
  className,
  description,
  sampleText = "The quick brown fox jumps over the lazy dog",
}: TypeSpecimenProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(className);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group flex items-start gap-4 p-4 rounded-lg border border-border-subtle bg-frosted-1 hover:border-border-medium transition-colors">
      <div className={`flex-1 ${className}`}>{sampleText}</div>
      <div className="flex flex-col items-end gap-2 min-w-[140px]">
        <span className="text-xs text-muted-foreground font-mono">{label}</span>
        {description && (
          <span className="text-xs text-muted-foreground">{description}</span>
        )}
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mt-1"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span className="font-mono">{className}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

interface FontWeightProps {
  weight: string;
  value: number;
  sampleText?: string;
}

function FontWeightSpecimen({
  weight,
  value,
  sampleText = "Aa",
}: FontWeightProps) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-lg border border-border-subtle bg-frosted-1">
      <div
        className="text-3xl text-foreground"
        style={{ fontWeight: value }}
      >
        {sampleText}
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-foreground capitalize">
          {weight}
        </span>
        <span className="text-xs text-muted-foreground font-mono">{value}</span>
      </div>
    </div>
  );
}

interface LineHeightProps {
  label: string;
  className: string;
  value: string;
}

function LineHeightSpecimen({ label, className, value }: LineHeightProps) {
  return (
    <div className="p-4 rounded-lg border border-border-subtle bg-frosted-1">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="text-xs text-muted-foreground font-mono">{value}</span>
      </div>
      <p className={`text-base text-foreground ${className} bg-frosted-2 p-2 rounded`}>
        This is a sample paragraph demonstrating line height. The quick brown fox
        jumps over the lazy dog. Typography is the art and technique of arranging
        type to make written language legible, readable, and appealing.
      </p>
    </div>
  );
}

interface LetterSpacingProps {
  label: string;
  className: string;
  value: string;
}

function LetterSpacingSpecimen({ label, className, value }: LetterSpacingProps) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border border-border-subtle bg-frosted-1">
      <span className={`text-lg text-foreground ${className}`}>ABCDEFG</span>
      <div className="flex flex-col items-end">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="text-xs text-muted-foreground font-mono">{value}</span>
      </div>
    </div>
  );
}

interface TextColorProps {
  label: string;
  className: string;
  usage: string;
}

function TextColorSpecimen({ label, className, usage }: TextColorProps) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border border-border-subtle bg-frosted-1">
      <span className={`text-base ${className}`}>{label}</span>
      <span className="text-xs text-muted-foreground">{usage}</span>
    </div>
  );
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
  description?: string;
}

function Section({ title, children, description }: SectionProps) {
  return (
    <section className="space-y-4">
      <div className="border-b border-border-subtle pb-2">
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}

export default function TypographyDebugPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border-subtle bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/debug"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Back to Debug</span>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Type className="w-5 h-5 text-os-info" />
              <h1 className="text-lg font-semibold text-foreground">
                Typography System
              </h1>
              <Badge variant="secondary" className="text-xs">
                OpenSea Inspired
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="space-y-12">
          {/* Font Families */}
          <Section
            title="Font Families"
            description="Primary and monospace font stacks used throughout the application"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-6 rounded-lg border border-border-subtle bg-frosted-1">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-foreground">
                    Sans Serif (Primary)
                  </span>
                  <Badge variant="outline" className="text-xs">
                    Default
                  </Badge>
                </div>
                <p className="text-2xl text-foreground mb-2">
                  GT America / Inter
                </p>
                <p className="text-sm text-muted-foreground font-mono">
                  var(--font-sans)
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Used for all UI text, headings, and body content
                </p>
              </div>

              <div className="p-6 rounded-lg border border-border-subtle bg-frosted-1">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-foreground">
                    Monospace
                  </span>
                  <Badge variant="outline" className="text-xs">
                    Code / Numbers
                  </Badge>
                </div>
                <p className="text-2xl text-foreground font-mono mb-2">
                  0x1234...ABCD
                </p>
                <p className="text-sm text-muted-foreground font-mono">
                  var(--font-mono)
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Used for wallet addresses, token IDs, and prices
                </p>
              </div>
            </div>
          </Section>

          {/* Type Scale - Display & Headings */}
          <Section
            title="Type Scale - Display & Headings"
            description="Hierarchical heading sizes from display to h6"
          >
            <div className="space-y-3">
              <TypeSpecimen
                label="text-6xl"
                className="text-6xl font-bold tracking-tight"
                description="64px - Hero headlines"
                sampleText="Display XL"
              />
              <TypeSpecimen
                label="text-5xl"
                className="text-5xl font-bold tracking-tight"
                description="48px - Major headlines"
                sampleText="Display Large"
              />
              <TypeSpecimen
                label="text-4xl"
                className="text-4xl font-semibold tracking-tight"
                description="36px - Hero sections"
                sampleText="Heading 1"
              />
              <TypeSpecimen
                label="text-3xl"
                className="text-3xl font-semibold tracking-tight"
                description="30px - Page titles"
                sampleText="Heading 2"
              />
              <TypeSpecimen
                label="text-2xl"
                className="text-2xl font-semibold tracking-tight"
                description="24px - Section headers"
                sampleText="Heading 3"
              />
              <TypeSpecimen
                label="text-xl"
                className="text-xl font-medium"
                description="20px - Card titles"
                sampleText="Heading 4"
              />
              <TypeSpecimen
                label="text-lg"
                className="text-lg font-medium"
                description="18px - Subsection headers"
                sampleText="Heading 5"
              />
              <TypeSpecimen
                label="text-base"
                className="text-base font-medium"
                description="16px - Widget titles"
                sampleText="Heading 6"
              />
            </div>
          </Section>

          {/* Type Scale - Body Text */}
          <Section
            title="Type Scale - Body Text"
            description="Body text sizes for different content densities"
          >
            <div className="space-y-3">
              <TypeSpecimen
                label="text-lg"
                className="text-lg leading-relaxed"
                description="18px - Lead paragraphs"
              />
              <TypeSpecimen
                label="text-base"
                className="text-base leading-normal"
                description="16px - Default body text"
              />
              <TypeSpecimen
                label="text-sm"
                className="text-sm leading-normal"
                description="14px - Secondary text"
              />
              <TypeSpecimen
                label="text-xs"
                className="text-xs leading-normal"
                description="12px - Captions, metadata"
              />
            </div>
          </Section>

          {/* Type Scale - UI Elements */}
          <Section
            title="Type Scale - UI Elements"
            description="Specialized sizes for buttons, labels, and overlines"
          >
            <div className="space-y-3">
              <TypeSpecimen
                label="text-sm font-medium"
                className="text-sm font-medium"
                description="14px - Buttons, navigation"
                sampleText="Button Text"
              />
              <TypeSpecimen
                label="text-xs uppercase tracking-wider"
                className="text-xs uppercase tracking-wider font-medium"
                description="12px - Labels, tags"
                sampleText="LABEL TEXT"
              />
              <TypeSpecimen
                label="text-xs uppercase tracking-widest"
                className="text-xs uppercase tracking-widest font-medium"
                description="12px - Overlines, badges"
                sampleText="OVERLINE"
              />
            </div>
          </Section>

          {/* Font Weights */}
          <Section
            title="Font Weights"
            description="Available font weights and their typical usage"
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <FontWeightSpecimen weight="Light" value={300} />
              <FontWeightSpecimen weight="Normal" value={400} />
              <FontWeightSpecimen weight="Medium" value={500} />
              <FontWeightSpecimen weight="Semibold" value={600} />
              <FontWeightSpecimen weight="Bold" value={700} />
            </div>
            <div className="mt-4 p-4 rounded-lg bg-frosted-1 border border-border-subtle">
              <h4 className="text-sm font-medium text-foreground mb-2">
                Weight Guidelines
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Light (300): Large display text, elegant headings</li>
                <li>• Normal (400): Body text, descriptions, UI elements</li>
                <li>• Medium (500): Headings, buttons, emphasis (default)</li>
                <li>• Semibold (600): Strong emphasis, active states</li>
                <li>• Bold (700): Headlines, prices, CTAs</li>
              </ul>
            </div>
          </Section>

          {/* Line Heights */}
          <Section
            title="Line Heights"
            description="Vertical spacing for different text contexts"
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <LineHeightSpecimen
                label="Tight (1.25)"
                className="leading-tight"
                value="leading-tight"
              />
              <LineHeightSpecimen
                label="Normal (1.5)"
                className="leading-normal"
                value="leading-normal"
              />
              <LineHeightSpecimen
                label="Relaxed (1.625)"
                className="leading-relaxed"
                value="leading-relaxed"
              />
            </div>
          </Section>

          {/* Letter Spacing */}
          <Section
            title="Letter Spacing"
            description="Horizontal spacing adjustments for different text styles"
          >
            <div className="space-y-3">
              <LetterSpacingSpecimen
                label="Tighter"
                className="tracking-tighter"
                value="-0.05em"
              />
              <LetterSpacingSpecimen
                label="Tight"
                className="tracking-tight"
                value="-0.025em"
              />
              <LetterSpacingSpecimen
                label="Normal"
                className="tracking-normal"
                value="0"
              />
              <LetterSpacingSpecimen
                label="Wide"
                className="tracking-wide"
                value="0.025em"
              />
              <LetterSpacingSpecimen
                label="Wider"
                className="tracking-wider"
                value="0.05em"
              />
              <LetterSpacingSpecimen
                label="Widest"
                className="tracking-widest"
                value="0.1em"
              />
            </div>
          </Section>

          {/* Typography Hierarchy */}
          <Section
            title="Typography Hierarchy"
            description="Complete visual hierarchy in context"
          >
            <div className="p-6 rounded-lg border border-border-subtle bg-frosted-1 space-y-6">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                  Collection
                </p>
                <h1 className="text-4xl font-bold tracking-tight text-foreground">
                  Bored Ape Yacht Club
                </h1>
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                A collection of 10,000 unique Bored Ape NFTs living on the
                Ethereum blockchain. Each Bored Ape doubles as a Yacht Club
                membership card and grants access to members-only benefits.
              </p>

              <div className="grid grid-cols-3 gap-6 pt-4 border-t border-border-subtle">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                    Floor Price
                  </p>
                  <p className="text-2xl font-bold text-foreground font-mono">
                    24.5 ETH
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                    Volume
                  </p>
                  <p className="text-2xl font-bold text-foreground font-mono">
                    1.2M ETH
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                    Items
                  </p>
                  <p className="text-2xl font-bold text-foreground font-mono">
                    10,000
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-border-subtle">
                <div className="w-10 h-10 rounded-full bg-frosted-2" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Created by YugaLabs
                  </p>
                  <p className="text-xs text-muted-foreground">
                    2 years ago • 6.2K owners
                  </p>
                </div>
              </div>
            </div>
          </Section>

          {/* Text Colors */}
          <Section
            title="Text Colors"
            description="Semantic color tokens for text elements"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <TextColorSpecimen
                label="Primary (text-foreground)"
                className="text-foreground"
                usage="Main content, headings"
              />
              <TextColorSpecimen
                label="Secondary (text-muted-foreground)"
                className="text-muted-foreground"
                usage="Secondary text, descriptions"
              />
              <TextColorSpecimen
                label="Muted (text-muted-foreground)"
                className="text-muted-foreground"
                usage="Disabled states, hints"
              />
              <TextColorSpecimen
                label="Primary Accent (text-primary)"
                className="text-primary"
                usage="Links, interactive elements"
              />
              <TextColorSpecimen
                label="Success (text-os-success)"
                className="text-os-success"
                usage="Success states, positive values"
              />
              <TextColorSpecimen
                label="Error (text-os-error)"
                className="text-os-error"
                usage="Errors, destructive actions"
              />
              <TextColorSpecimen
                label="Info (text-os-info)"
                className="text-os-info"
                usage="Informational text"
              />
              <TextColorSpecimen
                label="Warning (text-os-warning)"
                className="text-os-warning"
                usage="Warnings, caution"
              />
            </div>
          </Section>

          {/* Special Text Styles */}
          <Section
            title="Special Text Styles"
            description="Utility styles for specific use cases"
          >
            <div className="space-y-4">
              {/* Monospace / Code */}
              <div className="p-4 rounded-lg border border-border-subtle bg-frosted-1">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-foreground">
                    Monospace / Code
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">
                    font-mono
                  </span>
                </div>
                <div className="space-y-2">
                  <p className="font-mono text-sm text-foreground">
                    0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
                  </p>
                  <p className="font-mono text-sm text-foreground tabular-nums">
                    1,234.567890 ETH
                  </p>
                </div>
              </div>

              {/* Uppercase */}
              <div className="p-4 rounded-lg border border-border-subtle bg-frosted-1">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-foreground">
                    Uppercase with Tracking
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">
                    uppercase tracking-wider
                  </span>
                </div>
                <p className="text-sm uppercase tracking-wider text-foreground font-medium">
                  Live Auction • 2h 34m left
                </p>
              </div>

              {/* Truncated Text */}
              <div className="p-4 rounded-lg border border-border-subtle bg-frosted-1">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-foreground">
                    Truncated Text
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">
                    truncate
                  </span>
                </div>
                <p className="text-sm text-foreground truncate max-w-md">
                  This is a very long text that will be truncated with ellipsis
                  when it exceeds the container width
                </p>
              </div>

              {/* Line Clamp */}
              <div className="p-4 rounded-lg border border-border-subtle bg-frosted-1">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-foreground">
                    Line Clamp
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">
                    line-clamp-2
                  </span>
                </div>
                <p className="text-sm text-foreground line-clamp-2 max-w-md">
                  This is a longer description that demonstrates line clamping.
                  It will show only two lines of text and then truncate with an
                  ellipsis. This is useful for card descriptions and summaries
                  where space is limited.
                </p>
              </div>

              {/* Balance Text */}
              <div className="p-4 rounded-lg border border-border-subtle bg-frosted-1">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-foreground">
                    Balanced Text
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">
                    text-balance
                  </span>
                </div>
                <p className="text-lg font-medium text-foreground text-balance max-w-sm">
                  This heading text is balanced for better readability
                </p>
              </div>

              {/* Tabular Numbers */}
              <div className="p-4 rounded-lg border border-border-subtle bg-frosted-1">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-foreground">
                    Tabular Numbers
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">
                    tabular-nums
                  </span>
                </div>
                <div className="font-mono text-sm space-y-1">
                  <p className="tabular-nums text-foreground">1,234.56 ETH</p>
                  <p className="tabular-nums text-foreground">9,876.54 ETH</p>
                  <p className="tabular-nums text-foreground">111.11 ETH</p>
                </div>
              </div>
            </div>
          </Section>

          {/* Best Practices */}
          <Section title="Best Practices" description="Typography guidelines">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 rounded-lg border border-os-success/30 bg-os-success/5">
                <h4 className="text-sm font-medium text-os-success mb-2">
                  Do&apos;s
                </h4>
                <ul className="text-sm text-foreground space-y-1">
                  <li>✓ Use font-medium (500) for headings</li>
                  <li>✓ Apply tabular-nums to numeric values</li>
                  <li>✓ Use monospace for wallet addresses</li>
                  <li>✓ Maintain consistent line-height ratios</li>
                  <li>✓ Use negative letter-spacing for large display</li>
                  <li>✓ Apply uppercase + wide tracking for labels</li>
                </ul>
              </div>

              <div className="p-4 rounded-lg border border-os-error/30 bg-os-error/5">
                <h4 className="text-sm font-medium text-os-error mb-2">
                  Don&apos;ts
                </h4>
                <ul className="text-sm text-foreground space-y-1">
                  <li>✗ Don&apos;t use weights below 400 for body</li>
                  <li>✗ Don&apos;t use line-height below 1.2</li>
                  <li>✗ Don&apos;t mix more than 2 font families</li>
                  <li>✗ Don&apos;t use sizes below 12px for UI</li>
                  <li>✗ Don&apos;t apply letter-spacing to paragraphs</li>
                  <li>✗ Don&apos;t use bold (700) for body text</li>
                </ul>
              </div>
            </div>
          </Section>

          {/* Typography in Practice */}
          <Section
            title="Typography in Practice"
            description="Visual comparison of standard vs improved typography usage"
          >
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Standard Typography */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium text-foreground">Standard Typography</h3>
                  <Badge variant="outline" className="text-xs text-muted-foreground">Basic</Badge>
                </div>
                <div className="p-4 rounded-lg border border-border-subtle bg-frosted-1">
                  {/* NFT Card - Standard */}
                  <div className="rounded-lg border border-border-subtle overflow-hidden bg-background max-w-sm mx-auto">
                    {/* Image Placeholder */}
                    <div className="aspect-square bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                      <span className="text-6xl">🎨</span>
                    </div>
                    {/* Content */}
                    <div className="p-4 space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Bored Ape Yacht Club</p>
                        <p className="text-base">BAYC #1234</p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        A unique bored ape with rare traits including golden fur and laser eyes.
                      </p>
                      <div className="flex items-center justify-between pt-2 border-t border-border-subtle">
                        <div>
                          <p className="text-xs text-muted-foreground">Price</p>
                          <p className="text-base">24.5 ETH</p>
                        </div>
                        <button className="px-4 py-2 bg-primary text-primary-foreground rounded text-sm">
                          Buy Now
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Issues List */}
                  <div className="mt-4 p-3 rounded bg-os-error/5 border border-os-error/20">
                    <p className="text-xs font-medium text-os-error mb-2">Issues:</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Inconsistent hierarchy (collection same weight as name)</li>
                      <li>• Poor line height makes description hard to read</li>
                      <li>• No letter spacing on uppercase labels</li>
                      <li>• Weak color contrast on secondary text</li>
                      <li>• Price lacks visual prominence</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/*  Typography */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium text-foreground"> Typography</h3>
                  <Badge variant="outline" className="text-xs text-os-success">Enhanced</Badge>
                </div>
                <div className="p-4 rounded-lg border border-os-success/30 bg-os-success/5">
                  {/* NFT Card -  */}
                  <div className="rounded-lg border border-border-subtle overflow-hidden bg-background max-w-sm mx-auto shadow-sm">
                    {/* Image Placeholder */}
                    <div className="aspect-square bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center relative group">
                      <span className="text-6xl">🎨</span>
                      <div className="absolute top-3 right-3">
                        <button className="p-2 rounded-full bg-background/80 backdrop-blur hover:bg-background transition-colors">
                          <Heart className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>
                    </div>
                    {/* Content */}
                    <div className="p-4 space-y-4">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">
                          Bored Ape Yacht Club
                        </p>
                        <h3 className="text-xl font-semibold tracking-tight text-foreground">
                          BAYC #1234
                        </h3>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        A unique bored ape with rare traits including golden fur and laser eyes.
                      </p>
                      <div className="flex items-center justify-between pt-3 border-t border-border-subtle">
                        <div>
                          <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                            Current Price
                          </p>
                          <p className="text-2xl font-bold text-foreground font-mono tabular-nums">
                            24.5 ETH
                          </p>
                        </div>
                        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
                          Buy Now
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Improvements List */}
                  <div className="mt-4 p-3 rounded bg-os-success/10 border border-os-success/30">
                    <p className="text-xs font-medium text-os-success mb-2">Improvements:</p>
                    <ul className="text-xs text-foreground space-y-1">
                      <li>✓ Clear hierarchy with tracking-tight on title</li>
                      <li>✓ Relaxed line height (1.625) for readability</li>
                      <li>✓ Uppercase + tracking-wider for labels</li>
                      <li>✓ Semantic color contrast (foreground/os-gray-300)</li>
                      <li>✓ Bold + tabular-nums for price prominence</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Header Comparison */}
            <div className="mt-8">
              <h3 className="text-sm font-medium text-foreground mb-4">Profile Header Comparison</h3>
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Standard Profile */}
                <div className="p-4 rounded-lg border border-border-subtle bg-frosted-1">
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl">CryptoCollector</h2>
                      <p className="text-sm text-muted-foreground">0x742d...bEb</p>
                      <p className="text-sm mt-2 text-gray-600">
                        Digital art enthusiast and NFT collector. Building the future of web3.
                      </p>
                      <div className="flex gap-4 mt-3">
                        <span className="text-sm">1.2K followers</span>
                        <span className="text-sm">342 following</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/*  Profile */}
                <div className="p-4 rounded-lg border border-os-success/30 bg-os-success/5">
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex-shrink-0 ring-2 ring-border-subtle" />
                    <div className="flex-1 min-w-0">
                      <h2 className="text-2xl font-bold tracking-tight text-foreground">
                        CryptoCollector
                      </h2>
                      <p className="text-sm font-mono text-muted-foreground mt-0.5">
                        0x742d...bEb
                      </p>
                      <p className="text-sm mt-3 text-muted-foreground leading-relaxed">
                        Digital art enthusiast and NFT collector. Building the future of web3.
                      </p>
                      <div className="flex gap-6 mt-4">
                        <div>
                          <span className="text-lg font-semibold text-foreground tabular-nums">1.2K</span>
                          <span className="text-sm text-muted-foreground ml-1">followers</span>
                        </div>
                        <div>
                          <span className="text-lg font-semibold text-foreground tabular-nums">342</span>
                          <span className="text-sm text-muted-foreground ml-1">following</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Takeaways */}
            <div className="mt-6 p-4 rounded-lg bg-frosted-2 border border-border-subtle">
              <h4 className="text-sm font-medium text-foreground mb-3">Key Typography Principles</h4>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-os-info">Hierarchy</p>
                  <p className="text-xs text-muted-foreground">
                    Use size, weight, and tracking to create clear visual hierarchy
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-os-info">Readability</p>
                  <p className="text-xs text-muted-foreground">
                    Apply relaxed line-height (1.625) for body text and descriptions
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-os-info">Labels</p>
                  <p className="text-xs text-muted-foreground">
                    Use uppercase + tracking-wider for labels and metadata
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-os-info">Numbers</p>
                  <p className="text-xs text-muted-foreground">
                    Apply tabular-nums and monospace for prices and addresses
                  </p>
                </div>
              </div>
            </div>
          </Section>

          {/* Token Reference */}
          <Section
            title="Design Token Reference"
            description="Quick reference for typography tokens"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border-subtle">
                    <th className="text-left py-2 px-4 text-muted-foreground font-medium">
                      Token
                    </th>
                    <th className="text-left py-2 px-4 text-muted-foreground font-medium">
                      Size
                    </th>
                    <th className="text-left py-2 px-4 text-muted-foreground font-medium">
                      Line Height
                    </th>
                    <th className="text-left py-2 px-4 text-muted-foreground font-medium">
                      Usage
                    </th>
                  </tr>
                </thead>
                <tbody className="text-foreground">
                  <tr className="border-b border-border-subtle/50">
                    <td className="py-2 px-4 font-mono">text-2xs</td>
                    <td className="py-2 px-4">10px</td>
                    <td className="py-2 px-4">12px</td>
                    <td className="py-2 px-4 text-muted-foreground">Fine print</td>
                  </tr>
                  <tr className="border-b border-border-subtle/50">
                    <td className="py-2 px-4 font-mono">text-xs</td>
                    <td className="py-2 px-4">12px</td>
                    <td className="py-2 px-4">16px</td>
                    <td className="py-2 px-4 text-muted-foreground">Captions</td>
                  </tr>
                  <tr className="border-b border-border-subtle/50">
                    <td className="py-2 px-4 font-mono">text-sm</td>
                    <td className="py-2 px-4">14px</td>
                    <td className="py-2 px-4">20px</td>
                    <td className="py-2 px-4 text-muted-foreground">Body small</td>
                  </tr>
                  <tr className="border-b border-border-subtle/50">
                    <td className="py-2 px-4 font-mono">text-base</td>
                    <td className="py-2 px-4">16px</td>
                    <td className="py-2 px-4">24px</td>
                    <td className="py-2 px-4 text-muted-foreground">Body</td>
                  </tr>
                  <tr className="border-b border-border-subtle/50">
                    <td className="py-2 px-4 font-mono">text-lg</td>
                    <td className="py-2 px-4">18px</td>
                    <td className="py-2 px-4">28px</td>
                    <td className="py-2 px-4 text-muted-foreground">Lead</td>
                  </tr>
                  <tr className="border-b border-border-subtle/50">
                    <td className="py-2 px-4 font-mono">text-xl</td>
                    <td className="py-2 px-4">20px</td>
                    <td className="py-2 px-4">30px</td>
                    <td className="py-2 px-4 text-muted-foreground">Card titles</td>
                  </tr>
                  <tr className="border-b border-border-subtle/50">
                    <td className="py-2 px-4 font-mono">text-2xl</td>
                    <td className="py-2 px-4">24px</td>
                    <td className="py-2 px-4">32px</td>
                    <td className="py-2 px-4 text-muted-foreground">Subtitles</td>
                  </tr>
                  <tr className="border-b border-border-subtle/50">
                    <td className="py-2 px-4 font-mono">text-3xl</td>
                    <td className="py-2 px-4">30px</td>
                    <td className="py-2 px-4">40px</td>
                    <td className="py-2 px-4 text-muted-foreground">Page titles</td>
                  </tr>
                  <tr className="border-b border-border-subtle/50">
                    <td className="py-2 px-4 font-mono">text-4xl</td>
                    <td className="py-2 px-4">36px</td>
                    <td className="py-2 px-4">44px</td>
                    <td className="py-2 px-4 text-muted-foreground">Hero</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Section>
        </div>
      </main>
    </div>
  );
}
