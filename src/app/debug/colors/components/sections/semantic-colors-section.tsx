'use client';

import React from 'react';
import { ColorSwatchDualMode } from '../color-swatch-dual-mode';
import { ColorSectionWrapper } from '../color-section-wrapper';
import { SEMANTIC_COLORS } from '../../data/color-definitions';

export function SemanticColorsBackgroundsSection() {
  return (
    <ColorSectionWrapper
      title="Semantic Colors - Backgrounds"
      description="Background colors for cards, popovers, dialogs, and other UI elements"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SEMANTIC_COLORS.backgrounds.map((color) => (
          <ColorSwatchDualMode
            key={color.name}
            name={color.name}
            hexLight={color.hexLight}
            hexDark={color.hexDark}
            usage={color.usage}
          />
        ))}
      </div>
    </ColorSectionWrapper>
  );
}

export function SemanticColorsTextSection() {
  return (
    <ColorSectionWrapper
      title="Semantic Colors - Text"
      description="Text colors for primary content, secondary content, and muted text"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SEMANTIC_COLORS.text.map((color) => (
          <ColorSwatchDualMode
            key={color.name}
            name={color.name}
            hexLight={color.hexLight}
            hexDark={color.hexDark}
            usage={color.usage}
          />
        ))}
      </div>
    </ColorSectionWrapper>
  );
}

export function SemanticColorsBordersSection() {
  return (
    <ColorSectionWrapper
      title="Semantic Colors - Borders"
      description="Border colors for inputs, dividers, and focus rings"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SEMANTIC_COLORS.borders.map((color) => (
          <ColorSwatchDualMode
            key={color.name}
            name={color.name}
            hexLight={color.hexLight}
            hexDark={color.hexDark}
            usage={color.usage}
          />
        ))}
      </div>
    </ColorSectionWrapper>
  );
}
