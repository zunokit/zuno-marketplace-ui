import type { GetCollectionsQuery } from "@/shared/graphql/hooks.generated";

/** Collection shape returned by GetCollections query (subset of full Collection). */
export type CollectionListItem =
  GetCollectionsQuery["collections"]["items"][number];
