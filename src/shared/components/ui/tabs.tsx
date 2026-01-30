"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { motion } from "framer-motion";

import { cn } from "@/shared/utils/tailwind-utils";

function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "bg-muted text-os-gray-300 inline-flex h-9 w-fit items-center justify-center rounded-[8px] p-[3px]",
        className
      )}
      {...props}
    />
  );
}

function TabsTrigger({ className, children, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-[6px] border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-foreground data-[state=inactive]:text-os-gray-300 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        // Frosted glass active state with backdrop blur
        "data-[state=active]:bg-background/80 data-[state=active]:backdrop-blur-md",
        // Subtle shadow for depth
        "data-[state=active]:shadow-[0_2px_8px_rgba(0,0,0,0.12),0_0_0_1px_rgba(255,255,255,0.08)_inset]",
        // Glow effect on active
        "data-[state=active]:shadow-[0_0_20px_rgba(var(--primary-rgb),0.15),0_2px_8px_rgba(0,0,0,0.12)]",
        // Hover states
        "hover:text-foreground data-[state=inactive]:hover:bg-white/5",
        // Press state
        "active:scale-[0.98] data-[state=active]:active:scale-[0.98]",
        // Smooth spring animation
        "ease-[cubic-bezier(0.34,1.56,0.64,1)]",
        className
      )}
      {...props}
    >
      {children}
    </TabsPrimitive.Trigger>
  );
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(
        "flex-1 outline-none",
        // Smooth fade and slide animation
        "data-[state=inactive]:opacity-0 data-[state=inactive]:translate-y-1",
        "data-[state=active]:opacity-100 data-[state=active]:translate-y-0",
        "transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
        className
      )}
      {...props}
    />
  );
}

// ============================================
// ANIMATED TABS WITH SLIDING INDICATOR
// ============================================

interface AnimatedTabsProps extends React.ComponentProps<typeof TabsPrimitive.Root> {
  indicatorClassName?: string;
}

function AnimatedTabs({ className, indicatorClassName, children, ...props }: AnimatedTabsProps) {
  return (
    <TabsPrimitive.Root
      data-slot="animated-tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    >
      {children}
    </TabsPrimitive.Root>
  );
}

interface AnimatedTabsListProps extends React.ComponentProps<typeof TabsPrimitive.List> {
  showIndicator?: boolean;
  indicatorClassName?: string;
}

function AnimatedTabsList({
  className,
  showIndicator = true,
  indicatorClassName,
  children,
  ...props
}: AnimatedTabsListProps) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [indicatorStyle, setIndicatorStyle] = React.useState({ left: 0, width: 0 });
  const listRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!listRef.current || !showIndicator) return;

    const triggers = listRef.current.querySelectorAll('[data-slot="tabs-trigger"]');
    if (triggers[activeIndex]) {
      const trigger = triggers[activeIndex] as HTMLElement;
      const listRect = listRef.current.getBoundingClientRect();
      const triggerRect = trigger.getBoundingClientRect();

      setIndicatorStyle({
        left: triggerRect.left - listRect.left + listRef.current.scrollLeft,
        width: triggerRect.width,
      });
    }
  }, [activeIndex, showIndicator]);

  // Update active index when tab changes
  React.useEffect(() => {
    const handleTabChange = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target?.getAttribute?.("data-state") === "active") {
        const triggers = listRef.current?.querySelectorAll('[data-slot="tabs-trigger"]');
        triggers?.forEach((trigger, index) => {
          if (trigger === target) {
            setActiveIndex(index);
          }
        });
      }
    };

    const list = listRef.current;
    if (list) {
      list.addEventListener("click", handleTabChange);
      // Set initial active index
      const triggers = list.querySelectorAll('[data-slot="tabs-trigger"]');
      triggers.forEach((trigger, index) => {
        if (trigger.getAttribute("data-state") === "active") {
          setActiveIndex(index);
        }
      });
    }

    return () => {
      list?.removeEventListener("click", handleTabChange);
    };
  }, []);

  return (
    <TabsPrimitive.List
      ref={listRef}
      data-slot="animated-tabs-list"
      className={cn(
        "relative bg-muted text-os-gray-300 inline-flex h-9 w-fit items-center justify-center rounded-[8px] p-[3px]",
        className
      )}
      {...props}
    >
      {children}
      {showIndicator && (
        <motion.div
          className={cn(
            "absolute bottom-[3px] h-[calc(100%-6px)] rounded-[6px] bg-background/80 backdrop-blur-md",
            // Glow effect
            "shadow-[0_0_20px_rgba(var(--primary-rgb),0.2),0_2px_8px_rgba(0,0,0,0.12),0_0_0_1px_rgba(255,255,255,0.08)_inset]",
            // Border glow
            "border border-primary/20",
            indicatorClassName
          )}
          initial={false}
          animate={{
            left: indicatorStyle.left,
            width: indicatorStyle.width,
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 30,
          }}
          style={{ zIndex: 0 }}
        />
      )}
    </TabsPrimitive.List>
  );
}

function AnimatedTabsTrigger({ className, children, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "relative z-10 inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 px-2 py-1 text-sm font-medium whitespace-nowrap transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-foreground data-[state=inactive]:text-os-gray-300 hover:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
    </TabsPrimitive.Trigger>
  );
}

export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  AnimatedTabs,
  AnimatedTabsList,
  AnimatedTabsTrigger,
};
