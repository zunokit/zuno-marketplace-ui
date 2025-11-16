"use client";

import { Zap, Radio, Info, Sun, Moon, Volume2, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

interface AppFooterProps {
  itemCount?: number;
  openCart?: () => void;
}

export function AppFooter({ itemCount, openCart }: AppFooterProps) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, systemTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-2 sm:px-3 md:px-4 lg:px-6 py-2 md:py-2.5 z-50"
      role="navigation"
    >
      <div className="flex items-center justify-between gap-1 sm:gap-2 text-xs md:text-sm max-w-[1920px] mx-auto">
        {/* Left Section */}
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-4 lg:gap-6 shrink-0">
          <button className="flex items-center gap-1 md:gap-1.5 text-foreground hover:text-muted-foreground transition-colors whitespace-nowrap">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-success rounded-full"></span>
            <span className="font-medium text-[10px] sm:text-xs md:text-sm">Live</span>
          </button>
          <button className="hidden md:flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
            <Zap className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
            <span className="hidden lg:inline">Aggregating</span>
          </button>
          <button className="hidden xl:flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
            <Radio className="w-4 h-4" />
            <span>Networks</span>
          </button>
          <div className="w-px h-3 sm:h-4 bg-border hidden md:block"></div>
        </div>

        {/* Center Section - Hide on mobile/tablet */}
        <div className="hidden xl:flex items-center gap-4 lg:gap-6 shrink-0">
          <button className="text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
            Terms of Service
          </button>
          <button className="text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
            Privacy Policy
          </button>
          <div className="w-px h-4 bg-border"></div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 lg:gap-4 shrink-0 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-1 md:gap-1.5 text-foreground shrink-0">
            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span className="font-medium text-[10px] sm:text-xs md:text-sm whitespace-nowrap">$4,085.01</span>
          </div>
          <div className="hidden sm:flex items-center gap-1 md:gap-1.5 text-muted-foreground shrink-0">
            <svg className="w-3 h-3 md:w-4 md:h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.77 7.23l.01-.01-3.72-3.72L15 4.56l2.11 2.11c-.94.36-1.61 1.26-1.61 2.33 0 1.38 1.12 2.5 2.5 2.5.36 0 .69-.08 1-.21v7.21c0 .55-.45 1-1 1s-1-.45-1-1V14c0-1.1-.9-2-2-2h-1V5c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v16h10v-7.5h1.5v5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V9c0-.69-.28-1.32-.73-1.77z" />
            </svg>
            <span className="text-[10px] sm:text-xs md:text-sm whitespace-nowrap">1.21 GWEI</span>
          </div>
          <div className="w-px h-3 sm:h-4 bg-border hidden md:block"></div>
          <button className="hidden lg:flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
            <Info className="w-4 h-4" />
            <span>Support</span>
          </button>
          {/* Theme toggle - Responsive */}
          {mounted && (
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors shrink-0"
              aria-label="Toggle theme"
            >
              {/* Mobile/Tablet: Only show current theme icon */}
              <div className="lg:hidden">
                {currentTheme === "dark" ? (
                  <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                ) : (
                  <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                )}
              </div>

              {/* Desktop: Show full toggle with both icons */}
              <div className="hidden lg:flex items-center gap-1">
                <Sun className="w-4 h-4" />
                <Moon className="w-4 h-4" />
                <div className="w-6 h-6 rounded-full border border-border flex items-center justify-center">
                  <div className={`w-3 h-3 rounded-full ${currentTheme === "dark" ? "bg-background" : "bg-muted-foreground"}`}></div>
                </div>
              </div>
            </button>
          )}
          <div className="w-px h-3 sm:h-4 bg-border hidden lg:block"></div>
          <button className="text-foreground hover:text-muted-foreground transition-colors font-medium text-[10px] sm:text-xs md:text-sm whitespace-nowrap shrink-0">
            Collector
          </button>
          <button className="hidden lg:block text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap shrink-0">
            Pro
          </button>
          <button className="hidden xl:block text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap shrink-0">
            Crypto
          </button>
          <button className="hidden xl:block text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap shrink-0">
            USD
          </button>
          <button className="hidden lg:block text-muted-foreground hover:text-foreground transition-colors shrink-0">
            <Volume2 className="w-4 h-4" />
          </button>
          {itemCount !== undefined && itemCount > 0 && openCart && (
            <>
              <div className="w-px h-3 sm:h-4 bg-border shrink-0"></div>
              <button
                onClick={openCart}
                className="flex items-center gap-1 sm:gap-1.5 text-muted-foreground hover:text-foreground transition-colors relative whitespace-nowrap shrink-0"
              >
                <div className="relative">
                  <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[9px] sm:text-[10px] rounded-full h-3.5 w-3.5 sm:h-4 sm:w-4 flex items-center justify-center font-medium">
                    {itemCount}
                  </span>
                </div>
                <span className="hidden sm:inline text-xs md:text-sm">Cart</span>
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}