import { cn } from "@/shared/utils/tailwind-utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-frosted-2 animate-pulse rounded-[6px]", className)}
      {...props}
    />
  );
}

export { Skeleton };
