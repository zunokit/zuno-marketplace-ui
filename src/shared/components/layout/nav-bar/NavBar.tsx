"use client";

import Link from "next/link";
import { cn } from "@/shared/utils/tailwind-utils";
import {
  ChevronDown,
  Grid3x3,
  TrendingUp,
  Sparkles,
  Gavel,
  Layers,
  Trophy,
  BadgeCheck,
  Rocket,
  BarChart3,
  Activity,
  ChartLine,
  FolderPlus,
  Image,
  Download,
  Settings,
  LucideIcon,
} from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { Badge } from "@/shared/components/ui/badge";
import type { DropdownItem } from "@/shared/utils/menu";

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  Grid3x3,
  TrendingUp,
  Sparkles,
  Gavel,
  Layers,
  Trophy,
  BadgeCheck,
  Rocket,
  BarChart3,
  Activity,
  ChartLine,
  FolderPlus,
  Image,
  Download,
  Settings,
};

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
  active?: boolean;
  hasDropdown?: boolean;
  dropdownItems?: DropdownItem[];
};

export default function NavLink({
  href,
  children,
  active = false,
  hasDropdown = false,
  dropdownItems = [],
}: NavLinkProps) {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 100); // Reduced delay for smoother experience
  };

  if (hasDropdown) {
    return (
      <div
        ref={dropdownRef}
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Link
          href={href}
          aria-haspopup="menu"
          aria-expanded={isOpen}
          aria-current={active ? "page" : undefined}
          className={cn(
            "px-3 py-2 rounded-[6px] text-sm font-medium text-foreground hover:text-foreground transition-all duration-150 flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500/60",
            "dark:text-foreground/70 dark:hover:text-foreground",
            active && "bg-secondary text-foreground dark:bg-card/10 dark:text-foreground"
          )}
        >
          {children}
          <ChevronDown
            className={cn("h-3 w-3 transition-transform duration-200", isOpen && "rotate-180")}
          />
        </Link>

        {/* Custom Dropdown */}
        <div
          className={cn(
            "absolute left-0 mt-1 w-64 origin-top-left transition-all duration-200 z-50 nav-dropdown",
            isOpen
              ? "opacity-100 scale-100 translate-y-0 pointer-events-auto dropdown-enter"
              : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
          )}
        >
          <div className="rounded-[8px] bg-background shadow-os-focus ring-1 ring-black ring-opacity-5 dark:bg-card dark:ring-border overflow-hidden">
            <div className="py-1" role="menu">
              {dropdownItems.map(item => {
                const Icon = item.icon ? iconMap[item.icon] : null;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-4 py-3 hover:bg-secondary dark:hover:bg-card/5 transition-all duration-150 group"
                    role="menuitem"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="flex items-start gap-3">
                      {Icon && (
                        <Icon className="h-4 w-4 mt-0.5 text-os-gray-300 group-hover:text-foreground dark:group-hover:text-foreground" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-foreground group-hover:text-foreground dark:group-hover:text-foreground">
                            {item.label}
                          </span>
                          {item.badge && (
                            <Badge
                              variant={
                                (item.badgeVariant as
                                  | "default"
                                  | "secondary"
                                  | "destructive"
                                  | "outline") || "default"
                              }
                              className="ml-2 text-xs py-0 px-1.5 h-5"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        {item.description && (
                          <p className="text-xs text-os-gray-300 mt-0.5">{item.description}</p>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "px-3 py-2 rounded-[6px] text-sm font-medium text-foreground hover:text-foreground  transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500/60",
        "dark:text-foreground/70 dark:hover:text-foreground ",
        active && "bg-secondary text-foreground dark:bg-card/10 dark:text-foreground"
      )}
    >
      {children}
    </Link>
  );
}
