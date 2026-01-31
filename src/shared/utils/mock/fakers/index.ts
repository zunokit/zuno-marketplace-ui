/**
 * Domain-specific faker modules for generating mock data
 *
 * Usage:
 * ```typescript
 * import { accountFaker } from './fakers';
 * import { setFakerSeed } from '../faker-instance';
 *
 * // For deterministic tests
 * setFakerSeed(12345);
 * const user = accountFaker.platformUser('opensea');
 * ```
 */

export { accountFaker } from "./account.faker";
export { collectionFaker, type MockCollectionKind } from "./collection.faker";
export { nftFaker } from "./nft.faker";
export { marketplaceFaker } from "./marketplace.faker";
