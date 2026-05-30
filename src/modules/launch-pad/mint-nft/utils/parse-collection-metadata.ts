/**
 * Collection metadata parser utility
 * Parses settings_json field from collection metadata to populate
 * Overview and Utility accordion data structures
 */

import type {
  CollectionMetadata,
  OverviewMetadata,
  UtilityMetadata,
} from "../types/metadata.types";
import {
  CollectionMetadataSchema,
  DEFAULT_OVERVIEW_SECTION,
  DEFAULT_UTILITY_ITEMS,
} from "../types/metadata.types";
import type { CollectionOverviewData, CollectionUtilityData } from "@/shared/types/collection-info.types";

/**
 * Safely parses JSON string, returns null on failure
 */
function safeJsonParse(jsonString: string | null | undefined): unknown | null {
  if (!jsonString) return null;
  try {
    return JSON.parse(jsonString);
  } catch {
    return null;
  }
}

/**
 * Validates and parses collection metadata using Zod schema
 */
function parseMetadata(settingsJson: string | null | undefined): CollectionMetadata | null {
  const parsed = safeJsonParse(settingsJson);
  if (!parsed) return null;

  const result = CollectionMetadataSchema.safeParse(parsed);
  return result.success ? result.data : null;
}

/**
 * Builds overview data from parsed metadata with fallback to defaults
 */
function buildOverviewData(
  metadata: OverviewMetadata | undefined,
  collectionDescription: string | null | undefined,
  collectionName: string
): CollectionOverviewData {
  const description = metadata?.description || collectionDescription || "No description available.";

  return {
    description,
    roleInGameplay: metadata?.roleInGameplay || {
      ...DEFAULT_OVERVIEW_SECTION,
      title: "Role in Gameplay",
    },
    rpgProgression: metadata?.rpgProgression || {
      ...DEFAULT_OVERVIEW_SECTION,
      title: "RPG Progression",
      items: [
        "Level up your NFT through engagement",
        "Unlock special abilities and traits",
        "Earn rewards based on participation",
      ],
    },
    flexibleUsage: metadata?.flexibleUsage || {
      ...DEFAULT_OVERVIEW_SECTION,
      title: "Flexible Usage",
      items: [
        "Trade on secondary markets",
        "Use across multiple platforms",
        "Stake for additional benefits",
      ],
    },
    ecosystem:
      metadata?.ecosystem ||
      `Join the ${collectionName} ecosystem and be part of a growing community of collectors and enthusiasts.`,
  };
}

/**
 * Builds utility data from parsed metadata with fallback to defaults
 */
function buildUtilityData(metadata: UtilityMetadata | undefined): CollectionUtilityData {
  return {
    title: metadata?.title || "Utility",
    items: metadata?.items?.length ? metadata.items : DEFAULT_UTILITY_ITEMS,
  };
}

/**
 * Parses collection metadata from settings_json field
 * Returns overview and utility data for accordions
 *
 * @param settingsJson - The raw settings_json string from collection metadata
 * @param collectionDescription - Fallback description if metadata doesn't provide one
 * @param collectionName - Collection name for default ecosystem text
 * @returns Object containing overviewData and utilityData
 */
export function parseCollectionMetadata(
  settingsJson: string | null | undefined,
  collectionDescription: string | null | undefined,
  collectionName: string
): {
  overviewData: CollectionOverviewData;
  utilityData: CollectionUtilityData;
} {
  // Parse and validate metadata
  const metadata = parseMetadata(settingsJson);

  // Build data structures with fallbacks
  const overviewData = buildOverviewData(
    metadata?.overview,
    collectionDescription,
    collectionName
  );

  const utilityData = buildUtilityData(metadata?.utility);

  return { overviewData, utilityData };
}

/**
 * Type guard to check if a value is a valid CollectionMetadata object
 */
export function isValidCollectionMetadata(value: unknown): value is CollectionMetadata {
  return CollectionMetadataSchema.safeParse(value).success;
}
