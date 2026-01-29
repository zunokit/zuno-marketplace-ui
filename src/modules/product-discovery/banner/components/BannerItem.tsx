"use client";

import { Banner } from "@/shared/types/banner";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function BannerItem(banner: Banner) {
  const isVideo =
    banner.mainBackground?.endsWith(".mp4") ||
    banner.mainBackground?.endsWith(".webm") ||
    banner.mainBackground?.endsWith(".mov");

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const fn = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  const useStaticImage = isVideo && prefersReducedMotion;
  const staticImageSrc = banner.thumbnailImages?.[0];

  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-0 z-0 overflow-hidden">
        {useStaticImage ? (
          staticImageSrc ? (
            <Image src={staticImageSrc} alt={banner.name} fill className="object-cover" />
          ) : (
            <div className="w-full h-full bg-muted" aria-hidden="true" />
          )
        ) : isVideo ? (
          <video
            src={banner.mainBackground}
            autoPlay
            muted
            loop
            playsInline
            className="object-cover w-full h-full"
            aria-label={banner.name}
          />
        ) : (
          <Image src={banner.mainBackground} alt={banner.name} fill className="object-cover" />
        )}
      </div>

      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/50 to-transparent" aria-hidden="true" />

      <div className="relative z-20 flex flex-col justify-end h-full p-3 sm:p-4 md:p-6 lg:p-8 xl:p-12 gap-1.5 sm:gap-2 md:gap-3 xl:gap-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1 sm:gap-1.5 md:gap-2 xl:gap-3">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground dark:text-foreground truncate max-w-[200px] sm:max-w-[250px] md:max-w-none">
              {banner.name}
            </h1>

            <span className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-foreground/80 dark:text-foreground/80">
              By {banner.author}
            </span>

            <div className="bg-card/20 backdrop-blur-sm rounded-[6px] sm:rounded-[8px] md:rounded-[12px] p-1.5 sm:p-2 md:p-3 xl:p-4 border border-white/10 w-fit">
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4 xl:gap-8">
                <div className="text-center">
                  <p className="text-[9px] sm:text-[10px] md:text-xs text-foreground/70 uppercase tracking-wider mb-0.5 sm:mb-1 md:mb-1.5 xl:mb-2 font-medium">
                    Floor Price
                  </p>
                  <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-bold text-foreground">
                    {banner.floorPrice ? `${banner.floorPrice}%` : "—"}
                  </p>
                </div>

                <div className="w-px h-6 sm:h-8 md:h-10 xl:h-12 bg-card/20" aria-hidden="true" />

                <div className="text-center">
                  <p className="text-[9px] sm:text-[10px] md:text-xs text-foreground/70 uppercase tracking-wider mb-0.5 sm:mb-1 md:mb-1.5 xl:mb-2 font-medium">
                    Listed
                  </p>
                  <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-bold text-foreground">
                    {banner.totalItems}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="items-center gap-2 mt-auto hidden xl:flex">
            {banner.thumbnailImages.map((image, index) => (
              <Image
                key={index}
                src={image}
                alt={`${banner.name} thumbnail ${index + 1}`}
                width={100}
                height={150}
                className="rounded-[8px]"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
