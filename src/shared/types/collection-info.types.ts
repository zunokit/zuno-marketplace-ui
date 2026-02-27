/**
 * Collection info content types for accordion components
 * Based on Meta Racing Pilots NFT collection structure
 */

// ============================================================================
// Overview Section Types
// ============================================================================

/**
 * Ordered list items with title and description for accordion content
 */
export interface OverviewSectionData {
  title: string;
  items: string[];
}

/**
 * Complete overview content data structure
 */
export interface CollectionOverviewData {
  /** Main description paragraph */
  description: string;

  /** Role in gameplay section */
  roleInGameplay: OverviewSectionData;

  /** RPG progression section */
  rpgProgression: OverviewSectionData;

  /** Flexible usage section */
  flexibleUsage: OverviewSectionData;

  /** Ecosystem description paragraph */
  ecosystem: string;
}

// ============================================================================
// Utility Section Types
// ============================================================================

/**
 * Individual utility item with label and description
 */
export interface UtilityItemData {
  label: string;
  description: string;
}

/**
 * Complete utility content data structure
 */
export interface CollectionUtilityData {
  /** Section heading (default: "Utility") */
  title: string;

  /** List of utility items */
  items: UtilityItemData[];
}

// ============================================================================
// Combined Types
// ============================================================================

/**
 * Props for overview accordion component
 */
export interface CollectionOverviewProps {
  data: CollectionOverviewData;
  className?: string;
}

/**
 * Props for utility accordion component
 */
export interface CollectionUtilityProps {
  data: CollectionUtilityData;
  className?: string;
}
