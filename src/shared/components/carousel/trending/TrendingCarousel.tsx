/**
 * TrendingCarousel Component
 *
 * Exact replica of v0-carousel-with-navigation-main design
 * adapted for NFT marketplace usage with dark theme and token-style cards
 */

'use client';

import type React from 'react';
import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import type { TrendingItemData } from './trending-carousel.types';

interface TrendingCarouselProps {
  readonly items: TrendingItemData[];
  readonly title?: string;
  readonly subtitle?: string;
  readonly onItemClick?: (item: TrendingItemData) => void;
}

export default function TrendingCarousel({
  items,
  title = 'Trending Tokens',
  subtitle = 'Largest price change in the past day',
  onItemClick
}: TrendingCarouselProps) {
  const [scrollIndex, setScrollIndex] = useState(0);
  const [isLargeScreen, setIsLargeScreen] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const prevSlide = () => {
    const scrollAmount = isLargeScreen ? 3 : 1;
    const newIndex = Math.max(scrollIndex - scrollAmount, 0);
    if (newIndex < scrollIndex) {
      setScrollIndex(newIndex);
    }
  };

  const nextSlide = () => {
    const scrollAmount = isLargeScreen ? 3 : 1;
    const totalColumns = Math.ceil(items.length / 2);
    const visibleColumns = isLargeScreen ? 3 : 1;
    const maxScrollIndex = totalColumns - visibleColumns;

    const newIndex = Math.min(scrollIndex + scrollAmount, maxScrollIndex);
    if (newIndex > scrollIndex) {
      setScrollIndex(newIndex);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX);
    setScrollLeft(scrollIndex);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();

    const x = e.pageX;
    const sensitivity = isLargeScreen ? 150 : 100; // Better mobile sensitivity
    const walk = (startX - x) / sensitivity;
    const totalColumns = Math.ceil(items.length / 2);
    const visibleColumns = isLargeScreen ? 3 : 1;
    const maxScrollIndex = totalColumns - visibleColumns;

    const newIndex = Math.max(0, Math.min(scrollLeft + walk, maxScrollIndex));
    setScrollIndex(newIndex);
  };

  // Touch event handlers for mobile support
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    console.log('Touch start:', touch.clientX);
    setIsDragging(true);
    setStartX(touch.clientX);
    setScrollLeft(scrollIndex);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    const touch = e.touches[0];
    const sensitivity = isLargeScreen ? 150 : 50; // Much better mobile sensitivity
    const walk = (startX - touch.clientX) / sensitivity;
    const totalColumns = Math.ceil(items.length / 2);
    const visibleColumns = isLargeScreen ? 3 : 1;
    const maxScrollIndex = totalColumns - visibleColumns;

    const newIndex = Math.max(0, Math.min(scrollLeft + walk, maxScrollIndex));
    console.log('Touch move:', touch.clientX, 'walk:', walk, 'newIndex:', newIndex);
    setScrollIndex(newIndex);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    const totalColumns = Math.ceil(items.length / 2);
    const visibleColumns = isLargeScreen ? 3 : 1;
    const maxScrollIndex = totalColumns - visibleColumns;
    const snappedIndex = Math.max(0, Math.min(Math.round(scrollIndex), maxScrollIndex));
    setScrollIndex(snappedIndex);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      const totalColumns = Math.ceil(items.length / 2);
      const visibleColumns = isLargeScreen ? 3 : 1;
      const maxScrollIndex = totalColumns - visibleColumns;
      const snappedIndex = Math.max(0, Math.min(Math.round(scrollIndex), maxScrollIndex));
      setScrollIndex(snappedIndex);
    }
  };

  const handleTouchEnd = () => {
    if (isDragging) {
      setIsDragging(false);
      const totalColumns = Math.ceil(items.length / 2);
      const visibleColumns = isLargeScreen ? 3 : 1;
      const maxScrollIndex = totalColumns - visibleColumns;
      const snappedIndex = Math.max(0, Math.min(Math.round(scrollIndex), maxScrollIndex));
      setScrollIndex(snappedIndex);
    }
  };

  const totalColumns = Math.ceil(items.length / 2);
  const visibleColumns = isLargeScreen ? 3 : 1;
  const maxScrollIndex = totalColumns - visibleColumns;

  const showLeftGradient = scrollIndex > 0;
  const showRightGradient = scrollIndex < maxScrollIndex;

  return (
    <div className="bg-[#0a0a0a] text-white p-3 md:p-4 lg:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-3 md:mb-4">
          <h1 className="text-lg md:text-xl lg:text-2xl font-bold mb-1 md:mb-2">{title}</h1>
          <p className="text-xs md:text-sm text-muted-foreground">{subtitle}</p>
        </div>

        {/* Mobile navigation buttons */}
        <div className="flex justify-between items-center mb-4 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={prevSlide}
            disabled={scrollIndex === 0}
            className="h-8 w-8 rounded-full bg-[#1a1a1a]/80 hover:bg-[#2a2a2a]/90 border border-[#2a2a2a] transition-opacity disabled:opacity-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-xs text-muted-foreground">
            {Math.min(scrollIndex + visibleColumns, totalColumns)}/{totalColumns}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={nextSlide}
            disabled={!showRightGradient}
            className="h-8 w-8 rounded-full bg-[#1a1a1a]/80 hover:bg-[#2a2a2a]/90 border border-[#2a2a2a] transition-opacity disabled:opacity-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="relative group">
          <Button
            variant="ghost"
            size="icon"
            onClick={prevSlide}
            disabled={scrollIndex === 0}
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-[#1a1a1a]/80 hover:bg-[#2a2a2a]/90 border border-[#2a2a2a] opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 backdrop-blur-sm"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          {showLeftGradient && (
            <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent z-[5] pointer-events-none" />
          )}

          {showRightGradient && (
            <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent z-[5] pointer-events-none" />
          )}

          <div
            ref={carouselRef}
            className="overflow-hidden select-none py-2 touch-pan-y"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              cursor: isDragging ? 'grabbing' : 'grab',
              touchAction: 'pan-y'
            }}
          >
            <div
              className="grid grid-rows-2 auto-cols-[calc(60%-0.6rem)] sm:auto-cols-[calc(50%-0.5rem)] md:auto-cols-[calc(40%-0.6rem)] lg:auto-cols-[calc(33.333%-0.667rem)] xl:auto-cols-[calc(30%-0.6rem)] grid-flow-col gap-2 md:gap-3 transition-transform ease-out px-2 select-none"
              style={{
                transform: `translateX(-${scrollIndex * (isLargeScreen ? 33.333 : 60)}%)`,
                transitionDuration: isDragging ? '0ms' : '400ms',
              }}
            >
              {items.map((item) => (
                <Card
                  key={item.id}
                  className="relative bg-[#1a1a1a] border-[#2a2a2a] p-2 sm:p-3 md:p-4 hover:bg-[#222] hover:scale-105 hover:z-10 transition-all duration-300 select-none cursor-pointer"
                  onClick={() => onItemClick?.(item)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                      <div className="relative flex-shrink-0">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                            <span className="text-sm sm:text-base md:text-lg font-bold">{item.symbol.charAt(0)}</span>
                          </div>
                        )}
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 rounded-full bg-blue-600 border-2 border-[#1a1a1a] flex items-center justify-center">
                          <span className="text-[6px] sm:text-[8px] md:text-[10px]">≡</span>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 sm:gap-2 mb-1">
                          <span className="font-semibold text-xs sm:text-sm md:text-base truncate">{item.name}</span>
                          <span className="text-muted-foreground text-[10px] sm:text-xs md:text-sm flex-shrink-0">{item.symbol}</span>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
                          <span className="text-xs sm:text-sm md:text-base font-semibold">{item.price}</span>
                          <span className={`text-[10px] sm:text-xs md:text-sm ${item.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                            {item.change}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="w-12 h-8 sm:w-16 sm:h-10 md:w-24 md:h-12 flex-shrink-0 ml-1 sm:ml-2">
                      <svg viewBox="0 0 100 50" className="w-full h-full" preserveAspectRatio="none">
                        <polyline
                          points={item.isPositive
                            ? "0,40 20,35 40,25 60,30 80,15 100,10"
                            : "0,10 20,15 40,25 60,20 80,35 100,40"
                          }
                          fill="none"
                          stroke={item.isPositive ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)'}
                          strokeWidth="2"
                          vectorEffect="non-scaling-stroke"
                        />
                      </svg>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={nextSlide}
            disabled={!showRightGradient}
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-[#1a1a1a]/80 hover:bg-[#2a2a2a]/90 border border-[#2a2a2a] opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 backdrop-blur-sm"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}