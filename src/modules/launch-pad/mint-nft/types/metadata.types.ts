/**
 * Collection metadata types for parsing settings_json field
 * Uses Zod for type-safe runtime validation
 */

import { z } from "zod";

// ============================================================================
// Zod Schemas
// ============================================================================

/**
 * Schema for overview section items (title + list of items)
 */
export const OverviewSectionSchema = z.object({
  title: z.string(),
  items: z.array(z.string()),
});

/**
 * Schema for overview data structure
 */
export const OverviewMetadataSchema = z.object({
  description: z.string().optional(),
  roleInGameplay: OverviewSectionSchema.optional(),
  rpgProgression: OverviewSectionSchema.optional(),
  flexibleUsage: OverviewSectionSchema.optional(),
  ecosystem: z.string().optional(),
});

/**
 * Schema for individual utility item
 */
export const UtilityItemSchema = z.object({
  label: z.string(),
  description: z.string(),
});

/**
 * Schema for utility data structure
 */
export const UtilityMetadataSchema = z.object({
  title: z.string().optional(),
  items: z.array(UtilityItemSchema).optional(),
});

/**
 * Schema for complete collection metadata in settings_json
 */
export const CollectionMetadataSchema = z.object({
  overview: OverviewMetadataSchema.optional(),
  utility: UtilityMetadataSchema.optional(),
});

// ============================================================================
// TypeScript Types (inferred from Zod schemas)
// ============================================================================

export type OverviewSectionData = z.infer<typeof OverviewSectionSchema>;
export type OverviewMetadata = z.infer<typeof OverviewMetadataSchema>;
export type UtilityItemData = z.infer<typeof UtilityItemSchema>;
export type UtilityMetadata = z.infer<typeof UtilityMetadataSchema>;
export type CollectionMetadata = z.infer<typeof CollectionMetadataSchema>;

// ============================================================================
// Default Values
// ============================================================================

/**
 * Default overview section when metadata is missing or invalid
 */
export const DEFAULT_OVERVIEW_SECTION: OverviewSectionData = {
  title: "Role in Gameplay",
  items: [
    "Access to exclusive in-game content",
    "Participation in community governance",
    "Early access to new features and updates",
  ],
};

/**
 * Default utility items when metadata is missing or invalid
 */
export const DEFAULT_UTILITY_ITEMS: UtilityItemData[] = [
  {
    label: "Exclusive Access",
    description: " Get early access to new drops and special events",
  },
  {
    label: "Community",
    description: " Join a vibrant community of collectors and creators",
  },
  {
    label: "Rewards",
    description: " Earn rewards through holding and participating",
  },
];
