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
      className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-3 md:px-6 py-2 md:py-3 z-50"
      role="navigation"
    >
      <div className="flex items-center justify-between text-xs md:text-sm overflow-x-auto">
        {/* Left Section */}
        <div className="flex items-center gap-2 md:gap-6">
          <button className="flex items-center gap-1 md:gap-2 text-foreground hover:text-muted-foreground transition-colors">
            <span className="w-2 h-2 bg-success rounded-full"></span>
            <span className="font-medium hidden sm:inline">Live</span>
          </button>
          <button className="hidden md:flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <Zap className="w-4 h-4" />
            <span>Aggregating</span>
          </button>
          <button className="hidden lg:flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <Radio className="w-4 h-4" />
            <span>Networks</span>
          </button>
          <div className="w-px h-4 bg-border hidden md:block"></div>
        </div>

        {/* Center Section - Hide on mobile */}
        <div className="hidden lg:flex items-center gap-6">
          <button className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</button>
          <button className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</button>
          <div className="w-px h-4 bg-border"></div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 md:gap-6">
          <div className="flex items-center gap-1 md:gap-2 text-foreground">
            <svg className="w-3 h-3 md:w-4 md:h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span className="font-medium text-xs md:text-sm">$4,085.01</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-muted-foreground">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.77 7.23l.01-.01-3.72-3.72L15 4.56l2.11 2.11c-.94.36-1.61 1.26-1.61 2.33 0 1.38 1.12 2.5 2.5 2.5.36 0 .69-.08 1-.21v7.21c0 .55-.45 1-1 1s-1-.45-1-1V14c0-1.1-.9-2-2-2h-1V5c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v16h10v-7.5h1.5v5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V9c0-.69-.28-1.32-.73-1.77z" />
            </svg>
            <span>1.21 GWEI</span>
          </div>
          <div className="w-px h-4 bg-border hidden md:block"></div>
          <button className="hidden md:flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <Info className="w-4 h-4" />
            <span>Support</span>
          </button>
          {/* Theme toggle - Responsive: Simple on mobile, full on desktop */}
          {mounted && (
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              {/* Mobile: Only show current theme icon */}
              <div className="md:hidden">
                {currentTheme === "dark" ? (
                  <Moon className="w-4 h-4" />
                ) : (
                  <Sun className="w-4 h-4" />
                )}
              </div>

              {/* Desktop: Show full toggle with both icons */}
              <div className="hidden md:flex items-center gap-1">
                <Sun className="w-4 h-4" />
                <Moon className="w-4 h-4" />
                <div className="w-6 h-6 rounded-full border border-border flex items-center justify-center">
                  <div className={`w-3 h-3 rounded-full ${currentTheme === "dark" ? "bg-background" : "bg-muted-foreground"}`}></div>
                </div>
              </div>
            </button>
          )}
          <div className="w-px h-4 bg-border hidden md:block"></div>
          <button className="text-foreground hover:text-muted-foreground transition-colors font-medium">Collector</button>
          <button className="hidden md:block text-muted-foreground hover:text-foreground transition-colors">Pro</button>
          <button className="hidden lg:block text-muted-foreground hover:text-foreground transition-colors">Crypto</button>
          <button className="hidden lg:block text-muted-foreground hover:text-foreground transition-colors">USD</button>
          <button className="hidden md:block text-muted-foreground hover:text-foreground transition-colors">
            <Volume2 className="w-4 h-4" />
          </button>
          {itemCount !== undefined && itemCount > 0 && openCart && (
            <>
              <div className="w-px h-4 bg-border"></div>
              <button
                onClick={openCart}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors relative"
              >
                <div className="relative">
                  <ShoppingCart className="w-4 h-4" />
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-medium">
                    {itemCount}
                  </span>
                </div>
                <span>Cart</span>
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}