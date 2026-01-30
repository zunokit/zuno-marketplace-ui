import { cn } from "@/shared/utils/tailwind-utils";
import { cva, type VariantProps } from "class-variance-authority";

const skeletonVariants = cva(
  "relative overflow-hidden rounded-[6px]",
  {
    variants: {
      variant: {
        default: "bg-frosted-2 animate-pulse",
        frosted: "bg-frosted-1/80 backdrop-blur-sm animate-pulse",
        shimmer: "bg-frosted-2 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent",
        card: "bg-frosted-2 rounded-xl animate-pulse",
        glow: "bg-frosted-2 animate-pulse shadow-[0_0_15px_rgba(var(--primary-rgb),0.15)]",
        dark: "bg-os-gray-600 animate-pulse",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface SkeletonProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof skeletonVariants> {}

function Skeleton({ className, variant, ...props }: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      className={cn(skeletonVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Skeleton, skeletonVariants };
