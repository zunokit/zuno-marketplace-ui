"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDownIcon, PlusIcon, MinusIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/shared/utils/tailwind-utils";

function Accordion({ ...props }: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(
        "border-b last:border-b-0",
        // Frosted glass background on hover
        "hover:bg-white/[0.02] transition-colors duration-200",
        className
      )}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group flex flex-1 items-center justify-between gap-4 rounded-[6px] py-4 text-left text-sm font-medium transition-all outline-none disabled:pointer-events-none disabled:opacity-50",
          // Focus states
          "focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          // Hover state with frosted glass effect
          "hover:bg-white/5",
          // Press state
          "active:scale-[0.995]",
          className
        )}
        {...props}
      >
        {children}
        <div className="relative w-5 h-5 flex items-center justify-center">
          {/* Default Chevron with rotation animation */}
          <ChevronDownIcon
            className="absolute size-4 shrink-0 text-os-gray-300 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-data-[state=open]:rotate-180 group-data-[state=open]:text-primary group-hover:text-foreground"
          />
        </div>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className={cn(
        "overflow-hidden text-sm",
        // Smooth height animation with data attributes
        "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
        className
      )}
      {...props}
    >
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        transition={{
          duration: 0.2,
          ease: [0.34, 1.56, 0.64, 1],
        }}
        className={cn("pt-0 pb-4", className)}
      >
        {children}
      </motion.div>
    </AccordionPrimitive.Content>
  );
}

// ============================================
// ENHANCED ACCORDION VARIANTS
// ============================================

// Accordion with Plus/Minus icon variant
function AccordionPlusTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger-plus"
        className={cn(
          "group flex flex-1 items-center justify-between gap-4 rounded-[6px] py-4 text-left text-sm font-medium transition-all outline-none disabled:pointer-events-none disabled:opacity-50",
          // Focus states
          "focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          // Hover state with frosted glass
          "hover:bg-white/5",
          // Press state
          "active:scale-[0.995]",
          className
        )}
        {...props}
      >
        {children}
        <div
          className={cn(
            "relative size-5 flex items-center justify-center rounded-full",
            // Frosted glass background
            "bg-white/5 backdrop-blur-sm",
            // Border glow
            "border border-white/10",
            // Transition
            "transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
            // Open state
            "group-data-[state=open]:bg-primary/20 group-data-[state=open]:border-primary/30 group-data-[state=open]:shadow-[0_0_12px_rgba(var(--primary-rgb),0.2)]"
          )}
        >
          <PlusIcon className="absolute size-3 text-os-gray-300 transition-all duration-300 group-data-[state=open]:opacity-0 group-data-[state=open]:rotate-90 group-hover:text-foreground" />
          <MinusIcon className="absolute size-3 text-primary opacity-0 transition-all duration-300 group-data-[state=open]:opacity-100" />
        </div>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

// Accordion with frosted glass card style
function GlassAccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="glass-accordion-item"
      className={cn(
        "mb-2 rounded-lg border border-white/10 overflow-hidden",
        // Frosted glass background
        "bg-white/[0.03] backdrop-blur-md",
        // Glow on hover
        "hover:border-white/20 hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.05)]",
        // Transition
        "transition-all duration-300",
        "data-[state=open]:border-primary/30 data-[state=open]:shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)]",
        className
      )}
      {...props}
    />
  );
}

function GlassAccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="glass-accordion-trigger"
        className={cn(
          "group flex flex-1 items-center justify-between gap-4 px-4 py-4 text-left text-sm font-medium transition-all outline-none",
          // Focus states
          "focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-inset",
          // Hover gradient
          "hover:bg-gradient-to-r hover:from-white/5 hover:to-transparent",
          // Active state
          "active:bg-white/10",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon
          className="size-4 shrink-0 text-os-gray-300 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-data-[state=open]:rotate-180 group-data-[state=open]:text-primary group-hover:text-foreground"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function GlassAccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="glass-accordion-content"
      className={cn(
        "overflow-hidden",
        "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
      )}
      {...props}
    >
      <div
        className={cn(
          "px-4 pb-4",
          // Subtle top border for separation
          "border-t border-white/5 pt-4",
          className
        )}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.05 }}
        >
          {children}
        </motion.div>
      </div>
    </AccordionPrimitive.Content>
  );
}

// Animated accordion content with framer motion
function AnimatedAccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="animated-accordion-content"
      className="overflow-hidden"
      {...props}
    >
      <AnimatePresence initial={false}>
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{
            height: { duration: 0.3, ease: [0.34, 1.56, 0.64, 1] },
            opacity: { duration: 0.2 },
          }}
          className={cn("pt-0 pb-4", className)}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </AccordionPrimitive.Content>
  );
}

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  // Enhanced variants
  AccordionPlusTrigger,
  GlassAccordionItem,
  GlassAccordionTrigger,
  GlassAccordionContent,
  AnimatedAccordionContent,
};
