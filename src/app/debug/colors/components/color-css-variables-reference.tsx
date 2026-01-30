'use client';

import React from 'react';

export function ColorCssVariablesReference() {
  return (
    <div className="bg-card border border-border rounded-lg p-4 overflow-x-auto">
      <pre className="text-xs text-muted-foreground font-mono whitespace-pre">
{`/* Base Theme */
--background, --foreground
--card, --card-foreground
--popover, --popover-foreground
--dialog, --dialog-foreground
--primary, --primary-foreground
--secondary, --secondary-foreground
--muted, --muted-foreground
--accent, --accent-foreground
--destructive, --destructive-foreground
--success, --success-foreground
--warning, --warning-foreground
--info, --info-foreground
--border, --border-muted, --input, --ring

/* OpenSea Colors */
--color-os-gray-50/100/300/400/500/700
--color-os-success/error/info/warning
--color-os-rare/epic/legendary

/* Transparency */
--color-frosted-1/2/6/7
--color-border-subtle/medium/strong
--color-hover-bg, --color-active-bg
--color-overlay

/* Status Backgrounds */
--color-success-bg-light/medium, --color-success-border
--color-error-bg-light/medium, --color-error-border
--color-warning-bg-light/medium, --color-warning-border
--color-info-bg-light/medium, --color-info-border

/* Rarity */
--color-rare-bg/light/border
--color-epic-bg/light/border
--color-legendary-bg/light/border`}
      </pre>
    </div>
  );
}
