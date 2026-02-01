import { cache } from "react";

/**
 * React.cache() wrapper for per-request data deduplication
 *
 * Use this for data that should be fetched only once per request,
 * even if multiple components need it.
 *
 * @example
 * ```typescript
 * const getCurrentUser = createCachedFetcher(async () => {
 *   const session = await auth();
 *   if (!session?.user?.id) return null;
 *   return await db.user.findUnique({ where: { id: session.user.id } });
 * });
 *
 * // In component:
 * const user = await getCurrentUser(); // Fetched once, cached for request
 * ```
 */
export function createCachedFetcher<TArgs extends unknown[], TReturn>(
  fetcher: (...args: TArgs) => Promise<TReturn>
): (...args: TArgs) => Promise<TReturn> {
  return cache(fetcher);
}

/**
 * Pre-defined cached fetchers for common use cases
 */

// Example: Cache user data fetching
// export const getCachedUser = createCachedFetcher(async (userId: string) => {
//   return await db.user.findUnique({ where: { id: userId } });
// });

// Example: Cache configuration
// export const getCachedConfig = createCachedFetcher(async () => {
//   return await db.config.findFirst();
// });
