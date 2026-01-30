'use client';

import React from 'react';
import { ColorSwatchDualMode } from '../color-swatch-dual-mode';
import { ColorSwatchSingle } from '../color-swatch-single';
import { ColorSectionWrapper } from '../color-section-wrapper';
import { RARITY_COLORS } from '../../data/color-definitions';

export function RarityColorsCommonSection() {
  return (
    <ColorSectionWrapper
      title="Rarity Colors - Common"
      description="Gray color for common/rarity 1 NFTs"
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <ColorSwatchSingle
          color={RARITY_COLORS.common.main.hex}
          name={RARITY_COLORS.common.main.name}
          hex={RARITY_COLORS.common.main.hex}
          usage="Common NFTs"
        />
        <ColorSwatchSingle
          color={RARITY_COLORS.common.bg.hex}
          name={RARITY_COLORS.common.bg.name}
          hex={RARITY_COLORS.common.bg.hex}
          usage="Common badge bg"
          textColor="black"
        />
        <ColorSwatchSingle
          color={RARITY_COLORS.common.border.hex}
          name={RARITY_COLORS.common.border.name}
          hex={RARITY_COLORS.common.border.hex}
          usage="Common borders"
          textColor="black"
        />
      </div>
    </ColorSectionWrapper>
  );
}

export function RarityColorsUncommonSection() {
  return (
    <ColorSectionWrapper
      title="Rarity Colors - Uncommon"
      description="Green color for uncommon/rarity 2 NFTs"
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <ColorSwatchSingle
          color={RARITY_COLORS.uncommon.main.hex}
          name={RARITY_COLORS.uncommon.main.name}
          hex={RARITY_COLORS.uncommon.main.hex}
          usage="Uncommon NFTs"
        />
        <ColorSwatchSingle
          color={RARITY_COLORS.uncommon.bg.hex}
          name={RARITY_COLORS.uncommon.bg.name}
          hex={RARITY_COLORS.uncommon.bg.hex}
          usage="Uncommon badge bg"
          textColor="black"
        />
        <ColorSwatchSingle
          color={RARITY_COLORS.uncommon.border.hex}
          name={RARITY_COLORS.uncommon.border.name}
          hex={RARITY_COLORS.uncommon.border.hex}
          usage="Uncommon borders"
          textColor="black"
        />
      </div>
    </ColorSectionWrapper>
  );
}

export function RarityColorsRareSection() {
  return (
    <ColorSectionWrapper
      title="Rarity Colors - Rare"
      description="Blue color for rare/rarity 3 NFTs"
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <ColorSwatchDualMode
          name={RARITY_COLORS.rare.main.name}
          hexLight={RARITY_COLORS.rare.main.hexLight}
          hexDark={RARITY_COLORS.rare.main.hexDark}
          usage="Rare NFTs"
        />
        <ColorSwatchDualMode
          name={RARITY_COLORS.rare.bg.name}
          hexLight={RARITY_COLORS.rare.bg.hexLight}
          hexDark={RARITY_COLORS.rare.bg.hexDark}
          usage="Rare badge bg"
        />
        <ColorSwatchDualMode
          name={RARITY_COLORS.rare.bgLight.name}
          hexLight={RARITY_COLORS.rare.bgLight.hexLight}
          hexDark={RARITY_COLORS.rare.bgLight.hexDark}
          usage="Light rare bg"
        />
        <ColorSwatchDualMode
          name={RARITY_COLORS.rare.border.name}
          hexLight={RARITY_COLORS.rare.border.hexLight}
          hexDark={RARITY_COLORS.rare.border.hexDark}
          usage="Rare borders"
        />
      </div>
    </ColorSectionWrapper>
  );
}

export function RarityColorsEpicSection() {
  return (
    <ColorSectionWrapper
      title="Rarity Colors - Epic"
      description="Purple color for epic/rarity 4 NFTs"
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <ColorSwatchDualMode
          name={RARITY_COLORS.epic.main.name}
          hexLight={RARITY_COLORS.epic.main.hexLight}
          hexDark={RARITY_COLORS.epic.main.hexDark}
          usage="Epic NFTs"
        />
        <ColorSwatchDualMode
          name={RARITY_COLORS.epic.bg.name}
          hexLight={RARITY_COLORS.epic.bg.hexLight}
          hexDark={RARITY_COLORS.epic.bg.hexDark}
          usage="Epic badge bg"
        />
        <ColorSwatchDualMode
          name={RARITY_COLORS.epic.bgLight.name}
          hexLight={RARITY_COLORS.epic.bgLight.hexLight}
          hexDark={RARITY_COLORS.epic.bgLight.hexDark}
          usage="Light epic bg"
        />
        <ColorSwatchDualMode
          name={RARITY_COLORS.epic.border.name}
          hexLight={RARITY_COLORS.epic.border.hexLight}
          hexDark={RARITY_COLORS.epic.border.hexDark}
          usage="Epic borders"
        />
      </div>
    </ColorSectionWrapper>
  );
}

export function RarityColorsLegendarySection() {
  return (
    <ColorSectionWrapper
      title="Rarity Colors - Legendary"
      description="Orange/gold color for legendary/rarity 5 NFTs"
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <ColorSwatchDualMode
          name={RARITY_COLORS.legendary.main.name}
          hexLight={RARITY_COLORS.legendary.main.hexLight}
          hexDark={RARITY_COLORS.legendary.main.hexDark}
          usage="Legendary NFTs"
        />
        <ColorSwatchDualMode
          name={RARITY_COLORS.legendary.bg.name}
          hexLight={RARITY_COLORS.legendary.bg.hexLight}
          hexDark={RARITY_COLORS.legendary.bg.hexDark}
          usage="Legendary badge bg"
        />
        <ColorSwatchDualMode
          name={RARITY_COLORS.legendary.bgLight.name}
          hexLight={RARITY_COLORS.legendary.bgLight.hexLight}
          hexDark={RARITY_COLORS.legendary.bgLight.hexDark}
          usage="Light legendary bg"
        />
        <ColorSwatchDualMode
          name={RARITY_COLORS.legendary.border.name}
          hexLight={RARITY_COLORS.legendary.border.hexLight}
          hexDark={RARITY_COLORS.legendary.border.hexDark}
          usage="Legendary borders"
        />
      </div>
    </ColorSectionWrapper>
  );
}
