"use client";

import { Zap, Radio, Info, Sun, Moon, Volume2, ShoppingCart } from "lucide-react";
import { useState } from "react";

interface AppFooterProps {
  itemCount?: number;
  openCart?: () => void;
}

export function AppFooter({ itemCount, openCart }: AppFooterProps) {
  const [isDark, setIsDark] = useState(true);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-[#1a1a1a] border-t border-[#2a2a2a] px-6 py-3 z-50"
      role="navigation"
    >
      <div className="flex items-center justify-between text-sm">
        {/* Left Section */}
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span className="font-medium">Live</span>
          </button>
          <button className="flex items-center gap-2 text-gray-400 hover:text-gray-300 transition-colors">
            <Zap className="w-4 h-4" />
            <span>Aggregating</span>
          </button>
          <button className="flex items-center gap-2 text-gray-400 hover:text-gray-300 transition-colors">
            <Radio className="w-4 h-4" />
            <span>Networks</span>
          </button>
          <div className="w-px h-4 bg-[#3a3a3a]"></div>
        </div>

        {/* Center Section */}
        <div className="flex items-center gap-6">
          <button className="text-gray-400 hover:text-gray-300 transition-colors">Terms of Service</button>
          <button className="text-gray-400 hover:text-gray-300 transition-colors">Privacy Policy</button>
          <div className="w-px h-4 bg-[#3a3a3a]"></div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-white">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span className="font-medium">$4,085.01</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.77 7.23l.01-.01-3.72-3.72L15 4.56l2.11 2.11c-.94.36-1.61 1.26-1.61 2.33 0 1.38 1.12 2.5 2.5 2.5.36 0 .69-.08 1-.21v7.21c0 .55-.45 1-1 1s-1-.45-1-1V14c0-1.1-.9-2-2-2h-1V5c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v16h10v-7.5h1.5v5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V9c0-.69-.28-1.32-.73-1.77z" />
            </svg>
            <span>1.21 GWEI</span>
          </div>
          <div className="w-px h-4 bg-[#3a3a3a]"></div>
          <button className="flex items-center gap-2 text-gray-400 hover:text-gray-300 transition-colors">
            <Info className="w-4 h-4" />
            <span>Support</span>
          </button>
          <button
            onClick={() => setIsDark(!isDark)}
            className="flex items-center gap-1 text-gray-400 hover:text-gray-300 transition-colors"
          >
            <Sun className="w-4 h-4" />
            <Moon className="w-4 h-4" />
            <div className="w-6 h-6 rounded-full border border-gray-600 flex items-center justify-center">
              <div className={`w-3 h-3 rounded-full ${isDark ? "bg-white" : "bg-gray-600"}`}></div>
            </div>
          </button>
          <div className="w-px h-4 bg-[#3a3a3a]"></div>
          <button className="text-white hover:text-gray-300 transition-colors font-medium">Collector</button>
          <button className="text-gray-400 hover:text-gray-300 transition-colors">Pro</button>
          <button className="text-gray-400 hover:text-gray-300 transition-colors">Crypto</button>
          <button className="text-gray-400 hover:text-gray-300 transition-colors">USD</button>
          <button className="text-gray-400 hover:text-gray-300 transition-colors">
            <Volume2 className="w-4 h-4" />
          </button>
          {itemCount !== undefined && itemCount > 0 && openCart && (
            <>
              <div className="w-px h-4 bg-[#3a3a3a]"></div>
              <button
                onClick={openCart}
                className="flex items-center gap-2 text-gray-400 hover:text-gray-300 transition-colors relative"
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