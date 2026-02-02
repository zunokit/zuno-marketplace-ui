import { describe, it, expect } from 'vitest';
import {
  CHAIN_GAS_CONFIG,
  DEFAULT_DEPLOYMENT_GAS,
  calculateGasWithBuffer,
  hasSufficientBalance,
  formatGasCost,
  getRecommendedGasSettings,
  calculateDeploymentCost,
} from './gas';

describe('Gas Utilities', () => {
  describe('Constants', () => {
    it('should have chain configs for supported chains', () => {
      expect(CHAIN_GAS_CONFIG[1]).toBeDefined(); // Ethereum
      expect(CHAIN_GAS_CONFIG[11155111]).toBeDefined(); // Sepolia
      expect(CHAIN_GAS_CONFIG[137]).toBeDefined(); // Polygon
      expect(CHAIN_GAS_CONFIG[56]).toBeDefined(); // BSC
      expect(CHAIN_GAS_CONFIG[31337]).toBeDefined(); // Anvil
    });

    it('should have default deployment gas', () => {
      expect(DEFAULT_DEPLOYMENT_GAS).toBe(BigInt(5000000));
    });
  });

  describe('calculateGasWithBuffer', () => {
    it('should add buffer for Ethereum mainnet', () => {
      const result = calculateGasWithBuffer(BigInt(1000000), 1);
      expect(result.estimate).toBe(BigInt(1000000));
      expect(result.buffer).toBe(BigInt(250000)); // 25%
      expect(result.total).toBe(BigInt(1250000));
    });

    it('should add buffer for Polygon', () => {
      const result = calculateGasWithBuffer(BigInt(1000000), 137);
      expect(result.buffer).toBe(BigInt(200000)); // 20%
      expect(result.total).toBe(BigInt(1200000));
    });

    it('should default to Ethereum config for unknown chain', () => {
      const result = calculateGasWithBuffer(BigInt(1000000), 999999);
      expect(result.buffer).toBe(BigInt(250000)); // 25% default
    });
  });

  describe('hasSufficientBalance', () => {
    it('should return true when balance is sufficient', () => {
      expect(hasSufficientBalance(BigInt(100), BigInt(50), 10)).toBe(true);
      expect(hasSufficientBalance(BigInt(100), BigInt(90), 0)).toBe(true);
    });

    it('should return false when balance is insufficient', () => {
      expect(hasSufficientBalance(BigInt(100), BigInt(100), 10)).toBe(false); // needs 110
      expect(hasSufficientBalance(BigInt(50), BigInt(100), 0)).toBe(false);
    });

    it('should use default 10% buffer', () => {
      expect(hasSufficientBalance(BigInt(109), BigInt(100))).toBe(false); // needs 110
      expect(hasSufficientBalance(BigInt(110), BigInt(100))).toBe(true);
    });
  });

  describe('formatGasCost', () => {
    it('should format wei to string', () => {
      const result = formatGasCost(BigInt(1000000000000000000));
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('getRecommendedGasSettings', () => {
    it('should return settings for known chain', () => {
      const settings = getRecommendedGasSettings(1);
      expect(settings.maxFeePerGasMultiplier).toBe(1.5);
      expect(settings.priorityFeeMultiplier).toBe(1.1);
    });

    it('should default to Ethereum settings for unknown chain', () => {
      const settings = getRecommendedGasSettings(999999);
      expect(settings.maxFeePerGasMultiplier).toBe(1.5);
    });
  });

  describe('calculateDeploymentCost', () => {
    it('should calculate cost with 25% buffer', () => {
      const result = calculateDeploymentCost(BigInt(100000), BigInt(10));
      expect(result.cost).toBe(BigInt(1000000));
      expect(result.costWithBuffer).toBe(BigInt(1250000));
      expect(typeof result.formatted).toBe('string');
    });
  });
});
