"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/shared/utils/tailwind-utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/shared/components/ui/navigation-menu";
import { Badge } from "@/shared/components/ui/badge";
import type { DropdownItem } from "@/shared/utils/menu";
import {
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

interface NavDropdownProps {
  href: string;
  children: React.ReactNode;
  active?: boolean;
  hasDropdown?: boolean;
  dropdownItems?: DropdownItem[];
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & {
    item: DropdownItem;
  }
>(({ className, item, ...props }, ref) => {
  const Icon = item.icon ? iconMap[item.icon] : null;

  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-[6px] p-2.5 lg:p-3 leading-none no-underline outline-none transition-all duration-150 hover:bg-hover-bg hover:text-white focus:bg-hover-bg focus:text-white group",
            className
          )}
          {...props}
        >
          <div className="flex items-start gap-2 lg:gap-3">
            {Icon && (
              <Icon className="h-3.5 w-3.5 lg:h-4 lg:w-4 mt-0.5 text-os-gray-300 group-hover:text-white transition-all duration-150 shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div className="text-xs lg:text-sm font-medium leading-none truncate">
                  {item.label}
                </div>
                {item.badge && (
                  <Badge
                    variant={
                      (item.badgeVariant as "default" | "secondary" | "destructive" | "outline") ||
                      "default"
                    }
                    className="ml-1 text-[10px] lg:text-xs py-0 px-1 lg:px-1.5 h-4 lg:h-5 shrink-0"
                  >
                    {item.badge}
                  </Badge>
                )}
              </div>
              {item.description && (
                <p className="line-clamp-1 lg:line-clamp-2 text-[10px] lg:text-xs leading-snug text-os-gray-300 mt-0.5 lg:mt-1">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default function NavDropdown({
  href,
  children,
  active = false,
  hasDropdown = false,
  dropdownItems = [],
}: NavDropdownProps) {
  if (!hasDropdown) {
    return (
      <Link
        href={href}
        className={cn(
          navigationMenuTriggerStyle(),
          "bg-transparent hover:bg-hover-bg text-xs lg:text-sm xl:text-base px-1.5 lg:px-2 xl:px-3 h-8 lg:h-9 font-sans transition-all duration-150",
          active && "bg-frosted-2 text-white"
        )}
      >
        {children}
      </Link>
    );
  }

  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={cn(
              "bg-transparent hover:bg-hover-bg text-xs lg:text-sm xl:text-base px-1.5 lg:px-2 xl:px-3 h-8 lg:h-9 font-sans transition-all duration-150",
              active && "bg-frosted-2 text-white"
            )}
          >
            {children}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul
              className={cn(
                "grid gap-0.5 lg:gap-1 p-2 lg:p-3",
                dropdownItems.length <= 4
                  ? "w-[340px] lg:w-[400px] grid-cols-1"
                  : "w-[520px] lg:w-[600px] grid-cols-2"
              )}
            >
              {dropdownItems.map(item => (
                <ListItem key={item.href} item={item} href={item.href} />
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
