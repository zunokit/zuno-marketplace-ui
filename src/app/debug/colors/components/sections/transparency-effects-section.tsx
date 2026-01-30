'use client';

import React from 'react';
import { ColorSwatchDualMode } from '../color-swatch-dual-mode';
import { ColorSectionWrapper } from '../color-section-wrapper';
import { TRANSPARENCY_EFFECTS } from '../../data/color-definitions';

export function TransparencyFrostedSection() {
  return (
    <ColorSectionWrapper
      title="Transparency Effects - Frosted Glass"
      description="Frosted glass effect levels for modern UI depth"
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {TRANSPARENCY_EFFECTS.frosted.map((effect) => (
          <ColorSwatchDualMode
            key={effect.name}
            name={effect.name}
            hexLight={effect.hexLight}
            hexDark={effect.hexDark}
            usage={effect.usage}
          />
        ))}
      </div>
    </ColorSectionWrapper>
  );
}

export function TransparencyBordersSection() {
  return (
    <ColorSectionWrapper
      title="Transparency Effects - Border Transparency"
      description="Transparent border colors for subtle dividers"
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {TRANSPARENCY_EFFECTS.borders.map((effect) => (
          <ColorSwatchDualMode
            key={effect.name}
            name={effect.name}
            hexLight={effect.hexLight}
            hexDark={effect.hexDark}
            usage={effect.usage}
          />
        ))}
      </div>
    </ColorSectionWrapper>
  );
}

export function TransparencyOverlaysSection() {
  return (
    <ColorSectionWrapper
      title="Transparency Effects - Overlays"
      description="Overlay effects for modals, hover states, and active states"
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {TRANSPARENCY_EFFECTS.overlays.map((effect) => (
          <ColorSwatchDualMode
            key={effect.name}
            name={effect.name}
            hexLight={effect.hexLight}
            hexDark={effect.hexDark}
            usage={effect.usage}
          />
        ))}
      </div>
    </ColorSectionWrapper>
  );
}
