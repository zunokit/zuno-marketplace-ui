'use client';

import React from 'react';
import { ColorSwatchDualMode } from '../color-swatch-dual-mode';
import { ColorSwatchSingle } from '../color-swatch-single';
import { ColorSectionWrapper } from '../color-section-wrapper';
import { STATUS_COLORS } from '../../data/color-definitions';

export function StatusColorsSuccessSection() {
  return (
    <ColorSectionWrapper
      title="Status Colors - Success"
      description="Green color family for success states, confirmations, and positive actions"
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <ColorSwatchDualMode
          name={STATUS_COLORS.success.main.name}
          hexLight={STATUS_COLORS.success.main.hexLight}
          hexDark={STATUS_COLORS.success.main.hexDark}
          usage="Main success color"
        />
        <ColorSwatchSingle
          color="#ffffff"
          name={STATUS_COLORS.success.foreground.name}
          hex={STATUS_COLORS.success.foreground.hex}
          usage="Text on success"
          textColor="black"
        />
        <ColorSwatchDualMode
          name={STATUS_COLORS.success.bgLight.name}
          hexLight={STATUS_COLORS.success.bgLight.hexLight}
          hexDark={STATUS_COLORS.success.bgLight.hexDark}
          usage="Light success bg"
        />
        <ColorSwatchDualMode
          name={STATUS_COLORS.success.bgMedium.name}
          hexLight={STATUS_COLORS.success.bgMedium.hexLight}
          hexDark={STATUS_COLORS.success.bgMedium.hexDark}
          usage="Medium success bg"
        />
        <ColorSwatchDualMode
          name={STATUS_COLORS.success.border.name}
          hexLight={STATUS_COLORS.success.border.hexLight}
          hexDark={STATUS_COLORS.success.border.hexDark}
          usage="Success borders"
        />
      </div>
    </ColorSectionWrapper>
  );
}

export function StatusColorsErrorSection() {
  return (
    <ColorSectionWrapper
      title="Status Colors - Error / Destructive"
      description="Red color family for errors, destructive actions, and warnings"
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <ColorSwatchDualMode
          name={STATUS_COLORS.error.main.name}
          hexLight={STATUS_COLORS.error.main.hexLight}
          hexDark={STATUS_COLORS.error.main.hexDark}
          usage="Main error color"
        />
        <ColorSwatchSingle
          color="#ffffff"
          name={STATUS_COLORS.error.foreground.name}
          hex={STATUS_COLORS.error.foreground.hex}
          usage="Text on error"
          textColor="black"
        />
        <ColorSwatchDualMode
          name={STATUS_COLORS.error.bgLight.name}
          hexLight={STATUS_COLORS.error.bgLight.hexLight}
          hexDark={STATUS_COLORS.error.bgLight.hexDark}
          usage="Light error bg"
        />
        <ColorSwatchDualMode
          name={STATUS_COLORS.error.bgMedium.name}
          hexLight={STATUS_COLORS.error.bgMedium.hexLight}
          hexDark={STATUS_COLORS.error.bgMedium.hexDark}
          usage="Medium error bg"
        />
        <ColorSwatchDualMode
          name={STATUS_COLORS.error.border.name}
          hexLight={STATUS_COLORS.error.border.hexLight}
          hexDark={STATUS_COLORS.error.border.hexDark}
          usage="Error borders"
        />
      </div>
    </ColorSectionWrapper>
  );
}

export function StatusColorsWarningSection() {
  return (
    <ColorSectionWrapper
      title="Status Colors - Warning"
      description="Yellow/amber color family for warnings and caution states"
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <ColorSwatchDualMode
          name={STATUS_COLORS.warning.main.name}
          hexLight={STATUS_COLORS.warning.main.hexLight}
          hexDark={STATUS_COLORS.warning.main.hexDark}
          usage="Main warning color"
        />
        <ColorSwatchDualMode
          name={STATUS_COLORS.warning.foreground.name}
          hexLight={STATUS_COLORS.warning.foreground.hexLight}
          hexDark={STATUS_COLORS.warning.foreground.hexDark}
          usage="Text on warning"
        />
        <ColorSwatchDualMode
          name={STATUS_COLORS.warning.bgLight.name}
          hexLight={STATUS_COLORS.warning.bgLight.hexLight}
          hexDark={STATUS_COLORS.warning.bgLight.hexDark}
          usage="Light warning bg"
        />
        <ColorSwatchDualMode
          name={STATUS_COLORS.warning.bgMedium.name}
          hexLight={STATUS_COLORS.warning.bgMedium.hexLight}
          hexDark={STATUS_COLORS.warning.bgMedium.hexDark}
          usage="Medium warning bg"
        />
        <ColorSwatchDualMode
          name={STATUS_COLORS.warning.border.name}
          hexLight={STATUS_COLORS.warning.border.hexLight}
          hexDark={STATUS_COLORS.warning.border.hexDark}
          usage="Warning borders"
        />
      </div>
    </ColorSectionWrapper>
  );
}

export function StatusColorsInfoSection() {
  return (
    <ColorSectionWrapper
      title="Status Colors - Info"
      description="Blue color family for informational states and notifications"
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <ColorSwatchDualMode
          name={STATUS_COLORS.info.main.name}
          hexLight={STATUS_COLORS.info.main.hexLight}
          hexDark={STATUS_COLORS.info.main.hexDark}
          usage="Main info color"
        />
        <ColorSwatchSingle
          color="#ffffff"
          name={STATUS_COLORS.info.foreground.name}
          hex={STATUS_COLORS.info.foreground.hex}
          usage="Text on info"
          textColor="black"
        />
        <ColorSwatchDualMode
          name={STATUS_COLORS.info.bgLight.name}
          hexLight={STATUS_COLORS.info.bgLight.hexLight}
          hexDark={STATUS_COLORS.info.bgLight.hexDark}
          usage="Light info bg"
        />
        <ColorSwatchDualMode
          name={STATUS_COLORS.info.bgMedium.name}
          hexLight={STATUS_COLORS.info.bgMedium.hexLight}
          hexDark={STATUS_COLORS.info.bgMedium.hexDark}
          usage="Medium info bg"
        />
        <ColorSwatchDualMode
          name={STATUS_COLORS.info.border.name}
          hexLight={STATUS_COLORS.info.border.hexLight}
          hexDark={STATUS_COLORS.info.border.hexDark}
          usage="Info borders"
        />
      </div>
    </ColorSectionWrapper>
  );
}
