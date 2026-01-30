'use client';

import React from 'react';
import { ColorSwatchSingle } from '../color-swatch-single';
import { ColorSectionWrapper } from '../color-section-wrapper';
import { OPENSEA_GRAYS } from '../../data/color-definitions';

export function GrayScaleSection() {
  return (
    <ColorSectionWrapper
      title="Gray Scale"
      description="OpenSea-inspired gray palette for backgrounds and UI elements"
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {OPENSEA_GRAYS.map((color) => (
          <ColorSwatchSingle
            key={color.name}
            color={color.hex}
            name={color.name}
            hex={color.hex}
            usage={color.usage}
          />
        ))}
      </div>
    </ColorSectionWrapper>
  );
}
