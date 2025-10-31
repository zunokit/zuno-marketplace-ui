/**
 * Mock data generator for trending NFT collections/tokens
 * follows existing project patterns
 */

import type { TrendingItemData } from '@/shared/components/carousel/trending/trending-carousel.types';
import { randomImage } from '@/shared/utils/mock/randomImage';

/** Helper functions */
const rand = (n = 8) =>
  Math.random()
    .toString(16)
    .slice(2, 2 + n);
const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

/** Trending collection names pool */
const TRENDING_NAMES = [
  'Cosmic Creatures',
  'Pixel Warriors',
  'Meta Legends',
  'Cyber Punks',
  'Digital Dreams',
  'NFT Nexus',
  'Token Titans',
  'Art Blocks',
  'Crypto Chimps',
  'Virtual Visions',
  'DeFi Dinos',
  'Web3 Wizards',
  'Blockchain Beasts',
  'Ether Eagles',
  'Solana Sharks',
  'Polygon Panthers',
  'Base Bears',
  'Arbi Apes',
  'Op Optimists',
  'Chain Champions'
];

/** Token symbol pool */
const TOKEN_SYMBOLS = [
  'COSMIC', 'PIXEL', 'META', 'CYBER', 'DIGI', 'NFTX', 'TITAN', 'ART',
  'CHIMP', 'VIRT', 'DEFI', 'WIZ', 'BEAST', 'ETHR', 'SOL', 'POLY',
  'BASE', 'ARB', 'OP', 'CHAIN'
];

/** Price generation */
function generateRandomPrice(): string {
  const priceRanges = [
    { min: 0.001, max: 0.01, symbol: 'ETH' },
    { min: 0.01, max: 0.5, symbol: 'ETH' },
    { min: 0.5, max: 5, symbol: 'ETH' },
    { min: 5, max: 50, symbol: 'SOL' },
    { min: 50, max: 200, symbol: 'SOL' },
  ];

  const range = priceRanges[randInt(0, priceRanges.length - 1)];
  const price = (Math.random() * (range.max - range.min) + range.min).toFixed(randInt(2, 4));
  return `${price} ${range.symbol}`;
}

/** Change percentage generation */
function generateRandomChange(): { value: string; isPositive: boolean } {
  const isPositive = Math.random() > 0.3; // 70% chance of positive change
  const change = (Math.random() * 100).toFixed(1);

  return {
    value: `${isPositive ? '+' : '-'}${change}%`,
    isPositive
  };
}

/** Volume generation */
function generateRandomVolume(): string {
  const volumes = [
    `${(Math.random() * 100).toFixed(1)} ETH`,
    `${(Math.random() * 1000).toFixed(0)} SOL`,
    `${(Math.random() * 50000).toFixed(0)} USD`
  ];

  return volumes[randInt(0, volumes.length - 1)];
}

/** Main factory function */
export function makeMockTrendingItem(
  name?: string,
  overrides: Partial<TrendingItemData> = {}
): TrendingItemData {
  const nameIndex = randInt(0, TRENDING_NAMES.length - 1);
  const symbolIndex = randInt(0, TOKEN_SYMBOLS.length - 1);

  const itemName = name ?? `${TRENDING_NAMES[nameIndex]} #${randInt(1, 9999)}`;
  const symbol = TOKEN_SYMBOLS[symbolIndex];
  const { value: change, isPositive } = generateRandomChange();

  const base: TrendingItemData = {
    id: `trending_${rand(16)}`,
    name: itemName,
    symbol,
    price: generateRandomPrice(),
    change,
    isPositive,
    imageUrl: randomImage(),
    volume: generateRandomVolume(),
    marketCap: `${(Math.random() * 1000000).toFixed(0)} USD`
  };

  return { ...base, ...overrides };
}

/** Generate multiple trending items */
export function makeMockTrendingItems(count = 10): TrendingItemData[] {
  return Array.from({ length: count }, (_, i) =>
    makeMockTrendingItem()
  );
}

/** Pre-configured trending collections */
export const mockTrendingCollections = () => makeMockTrendingItems(12);
export const mockTrendingTokens = () => makeMockTrendingItems(20);

/** Specific themed collections */
export const mockTrendingArtCollections = () =>
  Array.from({ length: 8 }, (_, i) =>
    makeMockTrendingItem(`${TRENDING_NAMES[i % 5]} Art #${i + 1}`)
  );

export const mockTrendingGamingCollections = () =>
  Array.from({ length: 6 }, (_, i) =>
    makeMockTrendingItem(`Game Asset #${i + 1}`, {
      symbol: 'GAME',
      volume: `${(Math.random() * 500).toFixed(1)} ETH`
    })
  );