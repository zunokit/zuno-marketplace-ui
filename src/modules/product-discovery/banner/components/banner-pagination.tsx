import { CarouselApi } from "@/shared/components/ui/carousel";
import React from "react";

type BannerPaginationProps = {
  count: number;
  current: number;
  api: CarouselApi;
};

export default function BannerPagination({ count, current, api }: BannerPaginationProps) {
  return (
    <div
      className="flex justify-between md:justify-center items-center gap-2 mt-4 w-full"
      role="tablist"
      aria-label="Banner slides"
    >
      {Array.from({ length: count }).map((_, index) => (
        <button
          key={index}
          type="button"
          onClick={() => api?.scrollTo(index)}
          aria-label={`Go to slide ${index + 1} of ${count}`}
          aria-current={current === index + 1 ? "true" : undefined}
          className="min-h-[44px] min-w-[44px] flex flex-1 xl:flex-none items-center justify-center p-3 rounded-full transition-all duration-300 cursor-pointer touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <span
            className={`rounded-full transition-all duration-300 ${
              current === index + 1
                ? "bg-black dark:bg-card w-8 h-2"
                : "bg-black/40 dark:bg-card/40 w-2 h-2 hover:bg-black/60 dark:hover:bg-card/60"
            }`}
          />
        </button>
      ))}
    </div>
  );
}
