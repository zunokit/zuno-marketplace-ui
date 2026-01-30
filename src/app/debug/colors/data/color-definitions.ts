// ============================================================================
// COLOR DATA DEFINITIONS
// Based on: plans/reports/ui-ux-designer-260130-0650-color-system-documentation.md
// ============================================================================

export const PRIMARY_SCALE = [
  { name: 'primary-50', hex: '#f8fafc', usage: 'Lightest backgrounds' },
  { name: 'primary-100', hex: '#f1f5f9', usage: 'Hover states (light mode)' },
  { name: 'primary-200', hex: '#e2e8f0', usage: 'Subtle borders' },
  { name: 'primary-300', hex: '#acadae', usage: 'Main primary color' },
  { name: 'primary-400', hex: '#94a3b8', usage: 'Secondary text' },
  { name: 'primary-500', hex: '#64748b', usage: 'Muted elements' },
  { name: 'primary-600', hex: '#475569', usage: 'Dark mode accents' },
  { name: 'primary-700', hex: '#334155', usage: 'Deep backgrounds' },
  { name: 'primary-800', hex: '#1e293b', usage: 'Card backgrounds' },
  { name: 'primary-900', hex: '#0f172a', usage: 'Dark backgrounds' },
  { name: 'primary-950', hex: '#020617', usage: 'Deepest backgrounds' },
];

export const OPENSEA_GRAYS = [
  { name: 'os-gray-50', hex: '#fcfcfc', usage: 'Lightest backgrounds' },
  { name: 'os-gray-100', hex: '#f9f9f9', usage: 'Card backgrounds (light)' },
  { name: 'os-gray-300', hex: '#acadae', usage: 'Primary gray, secondary text' },
  { name: 'os-gray-400', hex: '#34353c', usage: 'Dark mode card bg' },
  { name: 'os-gray-500', hex: '#26272d', usage: 'Dark mode elevated surfaces' },
  { name: 'os-gray-700', hex: '#101010', usage: 'Dark mode backgrounds' },
];

export const SEMANTIC_COLORS = {
  backgrounds: [
    { name: 'background', hexLight: '#ffffff', hexDark: '#0a0a0a', usage: 'Page background' },
    { name: 'card', hexLight: '#f9fafb', hexDark: '#1e1e1e', usage: 'Card surfaces' },
    { name: 'popover', hexLight: '#ffffff', hexDark: '#1e1e1e', usage: 'Dropdown menus' },
    { name: 'dialog', hexLight: '#ffffff', hexDark: '#0e0a1a', usage: 'Modal overlays' },
    { name: 'muted', hexLight: '#f9fafb', hexDark: '#1a1525', usage: 'Muted sections' },
    { name: 'accent', hexLight: '#ddf4ff', hexDark: 'rgba(255,255,255,0.12)', usage: 'Accent backgrounds' },
  ],
  text: [
    { name: 'foreground', hexLight: '#0d1117', hexDark: '#f8fafc', usage: 'Primary text' },
    { name: 'muted-foreground', hexLight: '#374151', hexDark: '#acadae', usage: 'Secondary text' },
    { name: 'card-foreground', hexLight: '#0d1117', hexDark: '#f8fafc', usage: 'Card text' },
    { name: 'popover-foreground', hexLight: '#0d1117', hexDark: '#f8fafc', usage: 'Dropdown text' },
    { name: 'dialog-foreground', hexLight: '#0d1117', hexDark: '#f8fafc', usage: 'Modal text' },
  ],
  borders: [
    { name: 'border', hexLight: '#d1d5db', hexDark: 'rgba(255,255,255,0.08)', usage: 'Default borders' },
    { name: 'border-muted', hexLight: '#e5e7eb', hexDark: 'rgba(255,255,255,0.04)', usage: 'Subtle borders' },
    { name: 'input', hexLight: '#d1d5db', hexDark: 'rgba(255,255,255,0.08)', usage: 'Input borders' },
    { name: 'ring', hexLight: '#0969da', hexDark: 'rgba(255,255,255,0.16)', usage: 'Focus rings' },
  ],
};

export const STATUS_COLORS = {
  success: {
    main: { name: 'success', hexLight: '#1a7f37', hexDark: '#47bb64' },
    foreground: { name: 'success-foreground', hex: '#ffffff' },
    bgLight: { name: 'success-bg-light', hexLight: '#dafbe1', hexDark: 'rgb(71 187 100/8%)' },
    bgMedium: { name: 'success-bg-medium', hexLight: '#aceebb', hexDark: 'rgb(71 187 100/16%)' },
    border: { name: 'success-border', hexLight: '#1a7f37', hexDark: 'rgba(71, 187, 100, 0.3)' },
  },
  error: {
    main: { name: 'destructive', hexLight: '#cf222e', hexDark: '#e24756' },
    foreground: { name: 'destructive-foreground', hex: '#ffffff' },
    bgLight: { name: 'error-bg-light', hexLight: '#ffebe9', hexDark: 'rgb(226 71 86/8%)' },
    bgMedium: { name: 'error-bg-medium', hexLight: '#ffcecb', hexDark: 'rgb(226 71 86/16%)' },
    border: { name: 'error-border', hexLight: '#cf222e', hexDark: 'rgba(226, 71, 86, 0.3)' },
  },
  warning: {
    main: { name: 'warning', hexLight: '#9a6700', hexDark: '#ffcc00' },
    foreground: { name: 'warning-foreground', hexLight: '#ffffff', hexDark: '#0d1117' },
    bgLight: { name: 'warning-bg-light', hexLight: '#fff8c5', hexDark: 'rgb(255 204 0/8%)' },
    bgMedium: { name: 'warning-bg-medium', hexLight: '#fae17d', hexDark: 'rgb(255 204 0/16%)' },
    border: { name: 'warning-border', hexLight: '#9a6700', hexDark: 'rgba(255, 204, 0, 0.3)' },
  },
  info: {
    main: { name: 'info', hexLight: '#0969da', hexDark: '#83c3ff' },
    foreground: { name: 'info-foreground', hex: '#ffffff' },
    bgLight: { name: 'info-bg-light', hexLight: '#ddf4ff', hexDark: 'rgb(131 195 255/8%)' },
    bgMedium: { name: 'info-bg-medium', hexLight: '#b6e3ff', hexDark: 'rgb(131 195 255/16%)' },
    border: { name: 'info-border', hexLight: '#0969da', hexDark: 'rgba(131, 195, 255, 0.3)' },
  },
};

export const RARITY_COLORS = {
  common: {
    main: { name: 'rarity-common', hex: '#9ca3af' },
    bg: { name: 'rarity-common-bg', hex: '#f3f4f6' },
    border: { name: 'rarity-common-border', hex: '#d1d5db' },
  },
  uncommon: {
    main: { name: 'rarity-uncommon', hex: '#22c55e' },
    bg: { name: 'rarity-uncommon-bg', hex: '#dcfce7' },
    border: { name: 'rarity-uncommon-border', hex: '#86efac' },
  },
  rare: {
    main: { name: 'os-rare', hexLight: '#0969da', hexDark: '#00a3ff' },
    bg: { name: 'rare-bg', hexLight: '#ddf4ff', hexDark: 'rgb(0 163 255/30%)' },
    bgLight: { name: 'rare-bg-light', hexLight: '#eef8ff', hexDark: 'rgb(0 163 255/8%)' },
    border: { name: 'rare-border', hexLight: '#0969da', hexDark: 'rgba(0, 163, 255, 0.5)' },
  },
  epic: {
    main: { name: 'os-epic', hexLight: '#8250df', hexDark: '#d358ff' },
    bg: { name: 'epic-bg', hexLight: '#fbefff', hexDark: 'rgb(211 88 255/30%)' },
    bgLight: { name: 'epic-bg-light', hexLight: '#fdf7ff', hexDark: 'rgb(211 88 255/8%)' },
    border: { name: 'epic-border', hexLight: '#8250df', hexDark: 'rgba(211, 88, 255, 0.5)' },
  },
  legendary: {
    main: { name: 'os-legendary', hexLight: '#bf8700', hexDark: '#ff8a00' },
    bg: { name: 'legendary-bg', hexLight: '#fff8c5', hexDark: 'rgb(255 138 0/30%)' },
    bgLight: { name: 'legendary-bg-light', hexLight: '#fffbdd', hexDark: 'rgb(255 138 0/8%)' },
    border: { name: 'legendary-border', hexLight: '#bf8700', hexDark: 'rgba(255, 138, 0, 0.5)' },
  },
};

export const TRANSPARENCY_EFFECTS = {
  frosted: [
    { name: 'frosted-1', hexDark: 'rgb(255 255 255/4%)', hexLight: '#f3f4f6', usage: 'Subtle backgrounds' },
    { name: 'frosted-2', hexDark: 'rgb(255 255 255/8%)', hexLight: '#e5e7eb', usage: 'Card backgrounds' },
    { name: 'frosted-6', hexDark: 'rgb(255 255 255/32%)', hexLight: '#d1d5db', usage: 'Strong frosted' },
    { name: 'frosted-7', hexDark: 'rgb(255 255 255/50%)', hexLight: '#9ca3af', usage: 'Maximum frosted' },
  ],
  borders: [
    { name: 'border-subtle', hexDark: 'rgba(255, 255, 255, 0.08)', hexLight: '#d1d5db', usage: 'Subtle borders' },
    { name: 'border-medium', hexDark: 'rgba(255, 255, 255, 0.12)', hexLight: '#9ca3af', usage: 'Medium borders' },
    { name: 'border-strong', hexDark: 'rgba(255, 255, 255, 0.16)', hexLight: '#6b7280', usage: 'Strong borders' },
  ],
  overlays: [
    { name: 'overlay-bg', hexDark: 'rgb(0 0 0/60%)', hexLight: 'rgba(0, 0, 0, 0.75)', usage: 'Modal overlays' },
    { name: 'hover-bg', hexDark: 'rgba(255, 255, 255, 0.04)', hexLight: '#f3f4f6', usage: 'Hover states' },
    { name: 'active-bg', hexDark: 'rgba(255, 255, 255, 0.08)', hexLight: '#e5e7eb', usage: 'Active states' },
  ],
};
