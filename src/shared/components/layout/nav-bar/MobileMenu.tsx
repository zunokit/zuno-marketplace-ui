"use client";

import { Button } from "@/shared/components/ui/button";
import { MenuIcon, ChevronRight } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/shared/components/ui/sheet";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/shared/components/ui/badge";

type DropdownItem = {
  label: string;
  href: string;
  description?: string;
  icon?: string;
  badge?: string;
  badgeVariant?: "default" | "secondary" | "success" | "warning" | "destructive";
};

type NavItem = {
  id: string;
  label: string;
  href: string;
  hasDropdown?: boolean;
  dropdownItems?: DropdownItem[];
};

type MobileMenuProps = {
  navItems: NavItem[];
};

export default function MobileMenu({ navItems }: MobileMenuProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const toggleExpand = (itemId: string) => {
    setExpandedItems(prev =>
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  const handleLinkClick = () => {
    setIsOpen(false);
    setExpandedItems([]);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-secondary dark:text-white dark:hover:bg-white/5 shrink-0 h-8 w-8 sm:h-9 sm:w-9"
          aria-label="Open menu"
        >
          <MenuIcon className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[85vw] max-w-sm bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-l border-border-subtle pt-16 px-4 overflow-y-auto dark:bg-card/95 dark:supports-[backdrop-filter]:bg-card/80 dark:border-border-subtle"
      >
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <nav className="flex flex-col space-y-1">
          {navItems
            .filter(item => item.id !== "stats")
            .map(item => (
              <div key={item.id} className="flex flex-col">
                {/* Parent link with expand/collapse */}
                <div className="flex items-center">
                  <Link
                    href={item.href}
                    onClick={handleLinkClick}
                    className="flex-1 px-3 py-2.5 text-base font-medium text-white hover:text-white hover:bg-secondary rounded-[6px] transition-all duration-150 dark:text-white/80 dark:hover:text-white dark:hover:bg-white/5"
                  >
                    {item.label}
                  </Link>
                  {item.hasDropdown && item.dropdownItems && item.dropdownItems.length > 0 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleExpand(item.id)}
                      className="h-9 w-9 shrink-0 text-os-gray-300 hover:text-white dark:hover:text-white"
                      aria-label={`Toggle ${item.label} submenu`}
                    >
                      <ChevronRight
                        className={`h-4 w-4 transition-transform duration-200 ${
                          expandedItems.includes(item.id) ? "rotate-90" : ""
                        }`}
                      />
                    </Button>
                  )}
                </div>

                {/* Dropdown items with accordion animation */}
                {item.hasDropdown && expandedItems.includes(item.id) && (
                  <div className="pl-3 pt-1 pb-2 space-y-1 animate-in slide-in-from-top-2 duration-200">
                    {item.dropdownItems?.map(dropItem => (
                      <Link
                        key={dropItem.href}
                        href={dropItem.href}
                        onClick={handleLinkClick}
                        className="flex items-start gap-2 px-3 py-2 text-sm text-white hover:text-white hover:bg-secondary/50 rounded-[6px] transition-all duration-150 dark:text-white/60 dark:hover:text-white dark:hover:bg-white/5 group"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium truncate">{dropItem.label}</span>
                            {dropItem.badge && (
                              <Badge
                                variant={
                                  (dropItem.badgeVariant as
                                    | "default"
                                    | "secondary"
                                    | "destructive"
                                    | "outline") || "default"
                                }
                                className="text-[10px] px-1.5 py-0 h-4 shrink-0"
                              >
                                {dropItem.badge}
                              </Badge>
                            )}
                          </div>
                          {dropItem.description && (
                            <p className="text-xs text-os-gray-300 mt-0.5 line-clamp-1">
                              {dropItem.description}
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
