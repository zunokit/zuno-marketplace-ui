import { Button } from "@/shared/components/ui/button";
import { redirect } from "next/navigation";

type CarouselHeaderProps = {
  title: string;
  seeAllUrl: string;
};

export function CarouselHeader({ title, seeAllUrl }: CarouselHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <h2 className="text-2xl font-bold tracking-tight text-foreground dark:text-foreground">
        {title}
      </h2>
      <Button
        variant="outline"
        size="sm"
        className="border-border text-foreground dark:text-foreground hover:bg-secondary dark:hover:bg-card/5"
        onClick={() => {
          redirect(seeAllUrl);
        }}
      >
        See all
      </Button>
    </div>
  );
}
