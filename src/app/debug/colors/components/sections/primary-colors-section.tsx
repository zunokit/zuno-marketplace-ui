'use client';

import React from 'react';
import { ColorSwatchSingle } from '../color-swatch-single';
import { ColorSectionWrapper } from '../color-section-wrapper';
import { PRIMARY_SCALE } from '../../data/color-definitions';

export function PrimaryColorsSection() {
  return (
    <ColorSectionWrapper
      title="Primary Colors"
      description="Primary color scale from 50 to 950, used for the main brand identity"
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {PRIMARY_SCALE.map((color) => (
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
