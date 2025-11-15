"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Globe, PanelRightClose, PanelRightOpen } from "lucide-react";
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

  // Đồng bộ giá trị selectedChain với route hiện tại khi component mount
  useEffect(() => {
    // Kiểm tra xem có phải đang ở route /discover/[slug] không
    const pathSegments = pathname.split("/");
    if (pathSegments.length >= 3 && pathSegments[1] === "discover") {
      const slugFromPath = pathSegments[2];
      // Kiểm tra xem slug có hợp lệ không
      const supportedChains = mockChains();
      const isValidChain = supportedChains.some(chain => chain.slug === slugFromPath);

      if (isValidChain) {
        setSelectedChain(slugFromPath);
      } else {
        setSelectedChain("all");
      }
    } else {
      // Nếu không phải route discover thì set về "all"
      setSelectedChain("all");
    }
  }, [pathname]);

  return (
    <div
      className={cn(
        "fixed left-0 right-0 top-[56px] md:top-[65px] xl:top-[60px] z-40 border-b transition-all duration-300",
        isScrolled
          ? "bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/70 dark:bg-card/80 dark:supports-[backdrop-filter]:bg-card/70 border-border/70 dark:border-border"
          : "bg-background dark:bg-card border-border dark:border-border"
      )}
    >
      <div className="w-full mx-auto py-2 md:py-3 px-2 md:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 md:gap-4">
          <div className="flex space-x-0.5 md:space-x-1 overflow-x-auto flex-1 scrollbar-hide"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
          <Link
            href="/"
            className={cn(
              "flex items-center h-8 md:h-10 px-2 md:px-3 rounded-md md:rounded-lg cursor-pointer transition-all duration-200 flex-shrink-0",
              selectedChain === "all"
                ? "bg-primary text-primary-foreground"
                : isScrolled
                  ? "bg-secondary/70 text-foreground hover:bg-muted/70 dark:bg-card/70 dark:text-white/70 dark:hover:bg-card/50"
                  : "bg-secondary text-foreground hover:bg-muted dark:bg-card dark:text-white/70 dark:hover:bg-card/80"
            )}
          >
            <Globe className="w-4 h-4 md:w-[18px] md:h-[18px]" />
            <span
              className={cn(
                "ml-1.5 md:ml-2 text-xs md:text-sm font-medium transition-opacity duration-150 whitespace-nowrap",
                selectedChain === "all" ? "hidden md:block" : "opacity-0 w-0 overflow-hidden"
              )}
            >
              All Chains
            </span>
          </Link>

          {mockChains().map(chain => (
            <Link
              key={chain.id}
              href={`/discover/${chain.slug}`}
              className={cn(
                "flex items-center h-8 md:h-10 px-2 md:px-3 rounded-md md:rounded-lg cursor-pointer transition-all duration-200 flex-shrink-0",
                String(selectedChain) === String(chain.slug)
                  ? "bg-primary text-primary-foreground"
                  : isScrolled
                    ? "bg-secondary/70 text-foreground hover:bg-muted/70 dark:bg-card/70 dark:text-white/70 dark:hover:bg-card/50"
                    : "bg-secondary text-foreground hover:bg-muted dark:bg-card dark:text-white/70 dark:hover:bg-card/80"
              )}
            >
              <div
                className={cn(
                  "w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center",
                  String(chain.slug) === String(selectedChain)
                    ? "bg-primary-foreground/20"
                    : "bg-transparent"
                )}
              >
                <Image src={chain.icon} alt={`${chain.name} icon`} width={20} height={20} className="md:w-6 md:h-6" />
              </div>
              <span
                className={cn(
                  "ml-1.5 md:ml-2 text-xs md:text-sm font-medium transition-opacity duration-150 whitespace-nowrap",
                  String(chain.slug) === String(selectedChain)
                    ? "opacity-100"
                    : "opacity-0 w-0 overflow-hidden"
                )}
              >
                {chain.name}
              </span>
            </Link>
          ))}
          </div>

          {/* Sidebar Toggle Button */}
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className={cn(
                "hidden lg:flex items-center justify-center h-8 md:h-10 w-8 md:w-10 rounded-md md:rounded-lg transition-all duration-200 flex-shrink-0",
                isScrolled
                  ? "bg-secondary/70 text-foreground hover:bg-muted/70 dark:bg-card/70 dark:text-white/70 dark:hover:bg-card/50"
                  : "bg-secondary text-foreground hover:bg-muted dark:bg-card dark:text-white/70 dark:hover:bg-card/80"
              )}
              aria-label={isSidebarCollapsed ? "Show sidebar" : "Hide sidebar"}
            >
              {isSidebarCollapsed ? (
                <PanelRightOpen className="w-4 h-4 md:w-[18px] md:h-[18px]" />
              ) : (
                <PanelRightClose className="w-4 h-4 md:w-[18px] md:h-[18px]" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
