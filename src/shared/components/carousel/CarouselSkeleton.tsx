import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/components/ui/carousel";
import { CarouselItemSkeleton } from "@/shared/components/carousel/CarouselCardSkeleton";

export function CollectionCarouselSkeleton() {
  // Create an array of 5 items for the skeleton
  const skeletonItems = Array.from({ length: 5 }, (_, i) => i);

  return (
    <div className="relative -mx-4 px-4">
      <Carousel className="w-full">
        <CarouselContent className="-ml-2">
          {skeletonItems.map(item => (
            <CarouselItem key={item} className="pl-2 md:basis-1/3 lg:basis-1/5">
              <CarouselItemSkeleton />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute -left-4 bg-background/80 dark:bg-card/80 text-foreground dark:text-foreground backdrop-blur-sm hover:bg-background/90 dark:hover:bg-card/90" />
        <CarouselNext className="absolute -right-4 bg-background/80 dark:bg-card/80 text-foreground dark:text-foreground backdrop-blur-sm hover:bg-background/90 dark:hover:bg-card/90" />
      </Carousel>
    </div>
  );
}
