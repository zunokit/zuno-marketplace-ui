'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Palette } from 'lucide-react';
import { PrimaryColorsSection } from './components/sections/primary-colors-section';
import { GrayScaleSection } from './components/sections/gray-scale-section';
import {
  SemanticColorsBackgroundsSection,
  SemanticColorsTextSection,
  SemanticColorsBordersSection,
} from './components/sections/semantic-colors-section';
import {
  StatusColorsSuccessSection,
  StatusColorsErrorSection,
  StatusColorsWarningSection,
  StatusColorsInfoSection,
} from './components/sections/status-colors-section';
import {
  RarityColorsCommonSection,
  RarityColorsUncommonSection,
  RarityColorsRareSection,
  RarityColorsEpicSection,
  RarityColorsLegendarySection,
} from './components/sections/rarity-colors-section';
import {
  TransparencyFrostedSection,
  TransparencyBordersSection,
  TransparencyOverlaysSection,
} from './components/sections/transparency-effects-section';
import { ColorSectionWrapper } from './components/color-section-wrapper';
import { ColorUsageExamples } from './components/color-usage-examples';
import { ColorUsageImprovements } from './components/color-usage-improvements';
import { ColorCssVariablesReference } from './components/color-css-variables-reference';

export default function ColorsDebugPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/debug"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Debug Dashboard
          </Link>
        </div>

        {/* Header */}
        <header className="mb-10 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-frosted-1 flex items-center justify-center border border-border-subtle">
            <Palette className="w-5 h-5 text-os-info" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Color System Debug</h1>
            <p className="text-muted-foreground">
              Comprehensive showcase of all colors in the Zuno NFT Marketplace design system.
              Based on OpenSea-inspired color palette with dark/light mode support.
            </p>
          </div>
        </header>

        <div className="space-y-12">
          <PrimaryColorsSection />
          <GrayScaleSection />
          <SemanticColorsBackgroundsSection />
          <SemanticColorsTextSection />
          <SemanticColorsBordersSection />
          <StatusColorsSuccessSection />
          <StatusColorsErrorSection />
          <StatusColorsWarningSection />
          <StatusColorsInfoSection />
          <RarityColorsCommonSection />
          <RarityColorsUncommonSection />
          <RarityColorsRareSection />
          <RarityColorsEpicSection />
          <RarityColorsLegendarySection />
          <TransparencyFrostedSection />
          <TransparencyBordersSection />
          <TransparencyOverlaysSection />

          <ColorSectionWrapper
            title="Color Usage Examples"
            description="Practical examples of how colors are used in the UI"
          >
            <ColorUsageExamples />
          </ColorSectionWrapper>

          <ColorSectionWrapper
            title="Color Usage Improvements"
            description="Real-world examples comparing standard vs improved color usage with gradients, glass effects, and semantic colors"
          >
            <ColorUsageImprovements />
          </ColorSectionWrapper>

          <ColorSectionWrapper
            title="CSS Variables Quick Reference"
            description="All CSS variables available in the design system"
          >
            <ColorCssVariablesReference />
          </ColorSectionWrapper>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>Zuno NFT Marketplace - Color System Documentation</p>
          <p className="mt-1">Based on OpenSea-inspired design system with WCAG 2.1 AA compliance</p>
        </footer>
      </div>
    </div>
  );
}
