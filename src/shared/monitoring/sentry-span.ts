import * as Sentry from "@sentry/nextjs";

/**
 * Sentry span helper module for custom distributed tracing
 *
 * Provides wrapper functions to create descriptive spans for:
 * - Database repository operations
 * - Cache operations (Redis)
 * - External service calls (IPFS, APIs)
 */

/**
 * Wrap repository call with Sentry span
 *
 * Usage:
 * ```typescript
 * const abi = await tracedRepositoryCall(
 *   "nft.findById",
 *   () => this.nftRepository.findById(id)
 * );
 * ```
 */
export async function tracedRepositoryCall<T>(operation: string, fn: () => Promise<T>): Promise<T> {
  // Parse operation: "entity.action" → span name
  const [entity, action] = operation.split(".");

  return await Sentry.startSpan(
    {
      name: `${entity}.${action}`,
      op: "db.query",
      attributes: {
        entity,
        action,
      },
    },
    async span => {
      try {
        const result = await fn();
        span?.setStatus({ code: 1, message: "success" }); // SpanStatus.OK
        return result;
      } catch (error) {
        span?.setStatus({ code: 2, message: "error" }); // SpanStatus.INTERNAL_ERROR
        throw error;
      }
    }
  );
}

/**
 * Wrap cache call with Sentry span
 *
 * Usage:
 * ```typescript
 * const cached = await tracedCacheCall(
 *   "get:nft:123",
 *   () => this.cache.get("nft:123")
 * );
 * ```
 */
export async function tracedCacheCall<T>(operation: string, fn: () => Promise<T>): Promise<T> {
  const [action, ...keyParts] = operation.split(":");
  const key = keyParts.join(":").substring(0, 50); // Truncate long keys

  return await Sentry.startSpan(
    {
      name: `cache.${action}`,
      op: "cache",
      attributes: {
        action, // get, set, delete
        key,
      },
    },
    fn
  );
}

/**
 * Wrap external service call (IPFS, Pinata, etc.)
 *
 * Usage:
 * ```typescript
 * const result = await tracedExternalCall(
 *   "ipfs",
 *   "pin",
 *   () => this.ipfs.pin(data)
 * );
 * ```
 */
export async function tracedExternalCall<T>(
  service: string,
  operation: string,
  fn: () => Promise<T>
): Promise<T> {
  return await Sentry.startSpan(
    {
      name: `${service}.${operation}`,
      op: "http.client",
      attributes: {
        service,
        operation,
      },
    },
    fn
  );
}

/**
 * Wrap GraphQL operation with Sentry span
 *
 * Usage:
 * ```typescript
 * const result = await tracedGraphqlCall(
 *   "GetNFTDetails",
 *   () => apolloClient.query({ query: GET_NFT_DETAILS })
 * );
 * ```
 */
export async function tracedGraphqlCall<T>(
  operationName: string,
  fn: () => Promise<T>
): Promise<T> {
  return await Sentry.startSpan(
    {
      name: `graphql.${operationName}`,
      op: "graphql.query",
      attributes: {
        operationName,
      },
    },
    fn
  );
}

/**
 * Wrap blockchain transaction with Sentry span
 *
 * Usage:
 * ```typescript
 * const result = await tracedBlockchainCall(
 *   "mintNFT",
 *   () => publicClient.mintNFT(params)
 * );
 * ```
 */
export async function tracedBlockchainCall<T>(operation: string, fn: () => Promise<T>): Promise<T> {
  return await Sentry.startSpan(
    {
      name: `blockchain.${operation}`,
      op: "blockchain.transaction",
      attributes: {
        operation,
      },
    },
    fn
  );
}
