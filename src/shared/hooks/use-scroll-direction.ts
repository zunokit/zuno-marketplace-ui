"use client";

import { useState, useEffect } from "react";

interface UseScrollDirectionOptions {
  threshold?: number;
}

export function useScrollDirection(options: UseScrollDirectionOptions = {}) {
  const { threshold = 10 } = options;
  const [scrollDirection, setScrollDirection] = useState<"up" | "down" | null>(null);
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      const direction = scrollY > lastScrollY ? "down" : "up";

      if (Math.abs(scrollY - lastScrollY) > threshold) {
        setScrollDirection(direction);
        setIsAtTop(scrollY < threshold);
        lastScrollY = scrollY > 0 ? scrollY : 0;
      }
    };

    window.addEventListener("scroll", updateScrollDirection, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateScrollDirection);
    };
  }, [threshold]);

  return { scrollDirection, isAtTop };
}
