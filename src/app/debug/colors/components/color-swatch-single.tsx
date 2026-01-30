'use client';

import React from 'react';

interface ColorSwatchSingleProps {
  color: string;
  name: string;
  hex: string;
  usage?: string;
  textColor?: string;
}

function isLightColor(hex: string): boolean {
  if (!hex.startsWith('#')) return false;
  const hexValue = hex.replace('#', '');
  const r = parseInt(hexValue.substring(0, 2), 16);
  const g = parseInt(hexValue.substring(2, 4), 16);
  const b = parseInt(hexValue.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128;
}

export function ColorSwatchSingle({ color, name, hex, usage, textColor = 'white' }: ColorSwatchSingleProps) {
  const displayTextColor = hex.startsWith('#') && isLightColor(hex) ? 'black' : textColor;

  return (
    <div className="flex flex-col gap-1">
      <div
        className="h-16 w-full rounded-lg border border-border shadow-sm flex flex-col justify-end p-2 transition-transform hover:scale-105"
        style={{ backgroundColor: color }}
      >
        <span
          className="text-xs font-mono opacity-90"
          style={{ color: displayTextColor }}
        >
          {hex}
        </span>
      </div>
      <div className="space-y-0.5">
        <p className="text-xs font-medium text-foreground">--{name}</p>
        {usage && <p className="text-[10px] text-muted-foreground">{usage}</p>}
      </div>
    </div>
  );
}
