'use client';

import React from 'react';

interface ColorSwatchDualModeProps {
  name: string;
  hexLight: string;
  hexDark: string;
  usage?: string;
}

export function ColorSwatchDualMode({ name, hexLight, hexDark, usage }: ColorSwatchDualModeProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="grid grid-cols-2 gap-1">
        <div
          className="h-16 rounded-lg border border-border shadow-sm flex flex-col justify-end p-2"
          style={{ backgroundColor: hexLight }}
        >
          <span className="text-xs font-mono text-foreground">{hexLight}</span>
        </div>
        <div
          className="h-16 rounded-lg border border-border shadow-sm flex flex-col justify-end p-2"
          style={{ backgroundColor: hexDark }}
        >
          <span className="text-xs font-mono text-white">{hexDark}</span>
        </div>
      </div>
      <div className="space-y-0.5">
        <p className="text-xs font-medium text-foreground">--{name}</p>
        <div className="flex gap-2 text-[10px] text-muted-foreground">
          <span>Light: {hexLight}</span>
          <span>Dark: {hexDark}</span>
        </div>
        {usage && <p className="text-[10px] text-muted-foreground">{usage}</p>}
      </div>
    </div>
  );
}
