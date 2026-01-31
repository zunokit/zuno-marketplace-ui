import { fakerEN as faker } from "@faker-js/faker";

let currentSeed: number | undefined;

/**
 * Set a seed for deterministic faker output.
 * Use this in tests to get reproducible results.
 */
export function setFakerSeed(seed: number) {
  currentSeed = seed;
  faker.seed(seed);
}

/**
 * Reset faker to the current seed.
 * Useful for resetting state between test cases.
 */
export function resetFakerSeed() {
  if (currentSeed !== undefined) {
    faker.seed(currentSeed);
  }
}

/**
 * Clear the current seed.
 * Faker will return to non-deterministic mode.
 */
export function clearFakerSeed() {
  currentSeed = undefined;
}

export { faker };
export type Faker = typeof faker;
