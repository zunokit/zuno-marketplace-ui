"use client";

import { Search } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/utils/tailwind-utils";
import { useRef, useState, useEffect } from "react";
import SearchModal from "@/shared/components/layout/search/search-modal";

type SearchBarProps = {
  isMobile: boolean;
};

export default function SearchBar({ isMobile }: SearchBarProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Handle keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsModalOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <div ref={searchRef} className="relative w-full min-w-0">
        <div className="relative">
          <Search className="absolute left-2 sm:left-2.5 md:left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-os-gray-300 pointer-events-none" />
          <Input
            type="search"
            placeholder={isMobile ? "Search..." : "Search collections"}
            className={cn(
              "w-full pl-7 sm:pl-9 md:pl-10 pr-2 md:pr-16 lg:pr-20 h-8 sm:h-9 rounded-[6px] bg-secondary/80 border border-border-subtle focus:border-border-subtle text-foreground placeholder-muted-foreground cursor-pointer text-xs sm:text-sm",
              "dark:bg-card/80 dark:border-border-subtle dark:focus:border-border-subtle dark:text-foreground dark:placeholder-muted-foreground",
              "transition-all duration-200 truncate"
            )}
            onClick={() => setIsModalOpen(true)}
            onFocus={e => {
              e.target.blur();
              setIsModalOpen(true);
            }}
            readOnly
          />
          {!isMobile && (
            <kbd className="absolute right-2 md:right-2.5 top-1/2 transform -translate-y-1/2 hidden md:inline-flex h-5 select-none items-center gap-0.5 md:gap-1 rounded border border-border-subtle bg-muted px-1 md:px-1.5 font-mono text-[9px] md:text-[10px] font-medium text-os-gray-300 opacity-100">
              <span className="text-[10px] md:text-xs">⌘</span>K
            </kbd>
          )}
        </div>
      </div>

      {/* Search Modal */}
      <SearchModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
