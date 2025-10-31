/**
 * TypeScript types for the trending carousel component
 * adapted for NFT marketplace usage
 */

export interface TrendingItemData {
  readonly id: string;
  readonly name: string;
  readonly symbol: string;
  readonly price: string;
  readonly change: string;
  readonly imageUrl?: string;
  readonly isPositive: boolean;
  readonly volume?: string;
  readonly marketCap?: string;
}

export interface TrendingCarouselConfig {
  readonly autoplayDelay?: number;
  readonly showNavigation?: boolean;
  readonly showGradients?: boolean;
  readonly itemsPerRow?: {
    readonly mobile?: number;
    readonly tablet?: number;
    readonly desktop?: number;
  };
  readonly gridRows?: number;
  readonly className?: string;
}

export interface TrendingCarouselProps {
  readonly items: TrendingItemData[];
  readonly title?: string;
  readonly subtitle?: string;
  readonly config?: TrendingCarouselConfig;
  readonly onItemClick?: (item: TrendingItemData) => void;
  readonly className?: string;
}

export type CarouselDirection = 'left' | 'right';

export interface DragState {
  readonly isDragging: boolean;
  readonly startX: number;
  readonly scrollLeft: number;
}