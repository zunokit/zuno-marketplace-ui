import ms from 'ms';

export interface StageDuration {
  days: number;
  hours: number;
}

/**
 * Convert StageDuration to seconds
 */
export function durationToSeconds(duration: StageDuration): number {
  const durationMs = ms(`${duration.days}d`) + ms(`${duration.hours}h`);
  return Math.floor(durationMs / 1000);
}

/**
 * Convert seconds to milliseconds
 */
export function secondsToMs(seconds: number): number {
  return seconds * 1000;
}

/**
 * Convert seconds to human-readable format
 */
export function secondsToHuman(seconds: number): string {
  return ms(seconds * 1000, { long: true });
}

/**
 * Check if duration is valid (> 0)
 */
export function isValidDuration(duration: StageDuration): boolean {
  return durationToSeconds(duration) > 0;
}

/**
 * Parse duration string to milliseconds
 * Wrapper around ms() for type safety
 */
export function parseMs(value: string): number {
  const result = ms(value as ms.StringValue);
  if (result === undefined) {
    throw new Error(`Invalid duration string: ${value}`);
  }
  return result;
}
