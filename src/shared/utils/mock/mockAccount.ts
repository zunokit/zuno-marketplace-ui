import type { Platform, PlatformUser } from "@/shared/types/account";
import { accountFaker } from "./fakers";

/**
 * Create a mock account for testing
 * @deprecated Use accountFaker.platformUser() directly
 */
export function makeMockAccount(
  platform: Platform = "opensea",
  overrides: Partial<PlatformUser> = {}
): PlatformUser {
  return accountFaker.platformUser(platform, overrides);
}

/** Convenience wrapper for OpenSea accounts */
export const mockOpenSeaAccount = (overrides: Partial<PlatformUser> = {}) =>
  makeMockAccount("opensea", overrides);

/** Convenience wrapper for Zuno accounts */
export const mockZunoAccount = (overrides: Partial<PlatformUser> = {}) =>
  makeMockAccount("zuno", overrides);
