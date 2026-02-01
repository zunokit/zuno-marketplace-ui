/**
 * Storage Utilities
 * Type-safe localStorage wrapper with validation
 */

const STORAGE_PREFIX = 'zuno_collection_';

export interface StorageOptions<T> {
  key: string;
  schema: {
    parse: (data: unknown) => T;
  };
  ttl?: number;
}

export class StorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StorageError';
  }
}

export function saveToStorage<T>(key: string, data: T, ttl?: number): void {
  if (typeof window === 'undefined') return;

  try {
    const item = {
      data,
      timestamp: Date.now(),
      ttl,
    };
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(item));
  } catch (error) {
    throw new StorageError(`Failed to save: ${error instanceof Error ? error.message : 'Unknown'}`);
  }
}

export function loadFromStorage<T>(options: StorageOptions<T>): T | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${options.key}`);
    if (!raw) return null;

    const parsed = JSON.parse(raw);

    if (parsed.ttl && Date.now() - parsed.timestamp > parsed.ttl) {
      removeFromStorage(options.key);
      return null;
    }

    return options.schema.parse(parsed.data);
  } catch (error) {
    console.error('Storage load error:', error);
    return null;
  }
}

export function removeFromStorage(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
}

export function hasStorageItem(key: string): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(`${STORAGE_PREFIX}${key}`) !== null;
}

export function getStorageItemAge(key: string): number | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    return Date.now() - (parsed.timestamp || 0);
  } catch {
    return null;
  }
}
