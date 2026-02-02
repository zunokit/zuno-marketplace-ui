import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  saveToStorage,
  loadFromStorage,
  removeFromStorage,
  hasStorageItem,
  getStorageItemAge,
  StorageError,
} from './storage';

describe('Storage Utilities', () => {
  const TEST_KEY = 'test_key';
  const STORAGE_PREFIX = 'zuno_collection_';
  let storage: Record<string, string> = {};

  beforeEach(() => {
    storage = {};
    vi.stubGlobal('localStorage', {
      getItem: vi.fn((key: string) => storage[key] || null),
      setItem: vi.fn((key: string, value: string) => { storage[key] = value; }),
      removeItem: vi.fn((key: string) => { delete storage[key]; }),
    });
  });

  describe('saveToStorage', () => {
    it('should save data to localStorage', () => {
      const data = { name: 'test', value: 123 };
      saveToStorage(TEST_KEY, data);

      const stored = storage[`${STORAGE_PREFIX}${TEST_KEY}`];
      expect(stored).toBeDefined();

      const parsed = JSON.parse(stored);
      expect(parsed.data).toEqual(data);
      expect(parsed.timestamp).toBeDefined();
    });

    it('should save with TTL', () => {
      const data = { test: true };
      const ttl = 3600000;
      saveToStorage(TEST_KEY, data, ttl);

      const stored = JSON.parse(storage[`${STORAGE_PREFIX}${TEST_KEY}`]);
      expect(stored.ttl).toBe(ttl);
    });

    it('should throw StorageError on failure', () => {
      vi.stubGlobal('localStorage', {
        setItem: vi.fn(() => { throw new Error('Storage full'); }),
        getItem: vi.fn(),
        removeItem: vi.fn(),
      });

      expect(() => saveToStorage(TEST_KEY, {})).toThrow(StorageError);
    });
  });

  describe('loadFromStorage', () => {
    it('should load and parse data', () => {
      const data = { name: 'test' };
      storage[`${STORAGE_PREFIX}${TEST_KEY}`] = JSON.stringify({
        data,
        timestamp: Date.now(),
      });

      const result = loadFromStorage({
        key: TEST_KEY,
        schema: { parse: (d) => d as typeof data },
      });

      expect(result).toEqual(data);
    });

    it('should return null for non-existent key', () => {
      const result = loadFromStorage({
        key: 'nonexistent',
        schema: { parse: (d) => d },
      });
      expect(result).toBeNull();
    });

    it('should return null for expired TTL', () => {
      storage[`${STORAGE_PREFIX}${TEST_KEY}`] = JSON.stringify({
        data: { test: true },
        timestamp: Date.now() - 2000,
        ttl: 1,
      });

      const result = loadFromStorage({
        key: TEST_KEY,
        schema: { parse: (d) => d },
      });
      expect(result).toBeNull();
    });
  });

  describe('removeFromStorage', () => {
    it('should remove item from localStorage', () => {
      storage[`${STORAGE_PREFIX}${TEST_KEY}`] = JSON.stringify({ data: {} });
      expect(hasStorageItem(TEST_KEY)).toBe(true);

      removeFromStorage(TEST_KEY);
      expect(hasStorageItem(TEST_KEY)).toBe(false);
    });
  });

  describe('hasStorageItem', () => {
    it('should return true if item exists', () => {
      storage[`${STORAGE_PREFIX}${TEST_KEY}`] = JSON.stringify({ data: {} });
      expect(hasStorageItem(TEST_KEY)).toBe(true);
    });

    it('should return false if item does not exist', () => {
      expect(hasStorageItem('nonexistent')).toBe(false);
    });
  });

  describe('getStorageItemAge', () => {
    it('should return age of item', () => {
      const timestamp = Date.now() - 1000;
      storage[`${STORAGE_PREFIX}${TEST_KEY}`] = JSON.stringify({
        data: {},
        timestamp,
      });

      const age = getStorageItemAge(TEST_KEY);
      expect(age).toBeGreaterThanOrEqual(1000);
    });

    it('should return null for non-existent item', () => {
      expect(getStorageItemAge('nonexistent')).toBeNull();
    });
  });
});
