"use client";

import { Carousel, CarouselApi, CarouselNext } from "@/shared/components/ui/carousel";
import { CarouselContent, CarouselPrevious } from "@/shared/components/ui/carousel";
import { CarouselItem } from "@/shared/components/ui/carousel";
import { mockBanner } from "@/shared/utils/mock/mockBanner";
import { useEffect, useState } from "react";
import BannerItem from "@/modules/product-discovery/banner/components/BannerItem";
import BannerPagination from "@/modules/product-discovery/banner/components/BannerPagination";
import { Banner } from "@/shared/types/banner";

export function HomeBanner() {
  const [slides, setSlides] = useState<Banner[]>([]);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  // Generate banner data on client side to prevent hydration mismatch
  useEffect(() => {
    setSlides(mockBanner(3));
  }, []);

  useEffect(() => {
    if (!api) {
      return;
    }
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  // Show loading state while slides are being generated
  if (slides.length === 0) {
    return (
      <div
        className="w-full h-[200px] sm:h-[240px] md:h-[280px] lg:h-[320px] xl:h-[360px] rounded-[8px] md:rounded-[12px] overflow-hidden mb-3 md:mb-5 bg-secondary dark:bg-card border border-border-subtle animate-pulse"
        aria-busy="true"
        aria-label="Banner loading"
      />
    );
  }

  return (
    <div className="w-full px-2 md:px-0">
      <Carousel
        setApi={setApi}
        className="w-full h-[200px] sm:h-[240px] md:h-[280px] lg:h-[320px] xl:h-[360px] rounded-[8px] md:rounded-[12px] overflow-hidden mb-3 md:mb-5 group bg-secondary dark:bg-card border border-border-subtle"
        plugins={
          [
            // Autoplay({
            //   delay: 2000,
            // }),
          ]
        }
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent className="h-[200px] sm:h-[240px] md:h-[280px] lg:h-[320px] xl:h-[360px]">
          {slides.map((slide, index) => (
            <CarouselItem
              key={index}
              className="h-[200px] sm:h-[240px] md:h-[280px] lg:h-[320px] xl:h-[360px]"
            >
              <BannerItem {...slide} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          className="hidden md:group-hover:flex absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-30 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/50 hover:bg-black/70 border-white/30 hover:border-white/50 text-foreground hover:text-foreground w-8 h-8 md:w-12 md:h-12 rounded-full items-center justify-center shadow-os-focus hover:shadow-xl cursor-pointer"
          aria-label="Previous slide"
        />
        <CarouselNext
          className="hidden md:group-hover:flex absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-30 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/50 hover:bg-black/70 border-white/30 hover:border-white/50 text-foreground hover:text-foreground w-8 h-8 md:w-12 md:h-12 rounded-full items-center justify-center shadow-os-focus hover:shadow-xl cursor-pointer"
          aria-label="Next slide"
        />
      </Carousel>

      <BannerPagination count={count} current={current} api={api} />
    </div>
  );
}
