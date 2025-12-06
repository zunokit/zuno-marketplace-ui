"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/shared/utils/tailwind-utils";
import Image from "next/image";
import { mockChains } from "@/shared/utils/mock/mockChain";
import { useScroll } from "@/shared/hooks/use-scroll";

interface ChainMenuProps {
  onToggleSidebar?: () => void;
  isSidebarCollapsed?: boolean;
}

export default function ChainMenu({ onToggleSidebar, isSidebarCollapsed = false }: ChainMenuProps = {}) {
  const pathname = usePathname();
  const [selectedChain, setSelectedChain] = useState<string>("all");
  const isScrolled = useScroll(10);

  useEffect(() => {
    const pathSegments = pathname.split("/");
    if (pathSegments.length >= 3 && pathSegments[1] === "discover") {
      const slugFromPath = pathSegments[2];
      const supportedChains = mockChains();
      const isValidChain = supportedChains.some(chain => chain.slug === slugFromPath);

      if (isValidChain) {
        setSelectedChain(slugFromPath);
      } else {
        setSelectedChain("all");
      }
    } else {
      setSelectedChain("all");
    }
  }, [pathname]);

  const baseButtonStyles = cn(
    "inline-flex items-center justify-center gap-1.5 whitespace-nowrap text-sm",
    "transition-[transform,background,border] duration-200 ease-out active:scale-[0.97]",
    "h-8 rounded-md px-2.5 backdrop-blur-2xl cursor-pointer",
    "border focus-visible:outline-none"
  );

  const activeButtonStyles = cn(
    "font-medium text-foreground",
    "bg-frosted-2 hover:bg-frosted-6 focus:bg-frosted-6 active:bg-frosted-6",
    "border-border-medium hover:border-border-strong focus:border-border-strong active:border-border-strong"
  );

  const inactiveButtonStyles = cn(
    "text-os-gray-300",
    "bg-transparent hover:bg-frosted-1 focus:bg-frosted-1 active:bg-frosted-1",
    "border-border-subtle hover:border-border-medium focus:border-border-medium active:border-border-medium"
  );

  return (
    <div
      className={cn(
        "fixed left-0 right-0 top-[56px] md:top-[65px] xl:top-[60px] z-40 border-b transition-all duration-300",
        isScrolled
          ? "bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/70 dark:bg-card/80 dark:supports-[backdrop-filter]:bg-card/70 border-border-subtle/70 dark:border-border-subtle"
          : "bg-background dark:bg-card border-border-subtle dark:border-border-subtle"
      )}
    >
      <div className="w-full mx-auto py-2 md:py-3 px-2 md:px-6 lg:px-8">
        <div className="flex justify-between relative z-10 w-full items-center gap-4">
          {/* Chain Navigation */}
          <nav
            aria-label="Chains"
            className="flex items-center gap-2 overflow-x-auto flex-1 scrollbar-hidden"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <div className="flex items-center gap-1.5">
              {/* All Chains Button */}
              <Link
                href="/"
                className={cn(
                  baseButtonStyles,
                  selectedChain === "all" ? activeButtonStyles : inactiveButtonStyles
                )}
                role="switch"
                aria-checked={selectedChain === "all"}
              >
                All
              </Link>

              {/* Chain Buttons */}
              {mockChains().map(chain => {
                const isActive = String(selectedChain) === String(chain.slug);
                return (
                  <Link
                    key={chain.id}
                    href={`/discover/${chain.slug}`}
                    className={cn(
                      baseButtonStyles,
                      isActive ? activeButtonStyles : inactiveButtonStyles
                    )}
                    role="switch"
                    aria-checked={isActive}
                  >
                    <div className="flex items-center justify-center w-4 h-4 flex-shrink-0">
                      <Image
                        src={chain.icon}
                        alt={`${chain.name}`}
                        width={16}
                        height={16}
                        className="w-4 h-4 rounded-full object-cover"
                      />
                    </div>
                    {isActive && (
                      <span className="font-medium">{chain.name}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Sidebar Toggle Button */}
          {onToggleSidebar && (
            <button
              type="button"
              onClick={onToggleSidebar}
              className={cn(
                "hidden lg:inline-flex items-center justify-center",
                "whitespace-nowrap rounded-md font-medium",
                "transition-[transform,background,border] duration-200 ease-out",
                "focus-visible:outline-none active:scale-[0.97]",
                "backdrop-blur-2xl h-8 w-8 p-1.5 cursor-pointer",
                "bg-transparent hover:bg-frosted-1 focus:bg-frosted-1 active:bg-frosted-1",
                "border border-border-subtle hover:border-border-medium focus:border-border-medium active:border-border-medium"
              )}
              aria-label={isSidebarCollapsed ? "Show Chart" : "Hide Chart"}
            >
              <div className="flex pointer-events-none" aria-hidden="true">
                <svg
                  aria-label={isSidebarCollapsed ? "Show Chart" : "Hide Chart"}
                  className="fill-current text-os-gray-300"
                  fill="currentColor"
                  height="20"
                  role="img"
                  viewBox="0 -960 960 960"
                  width="20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="m140-220-60-60 300-300 160 160 284-320 56 56-340 384-160-160-240 240Z" />
                </svg>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
