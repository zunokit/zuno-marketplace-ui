"use client";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { redirect } from "next/navigation";

export default function NewCollection() {
  return (
    <Card className="bg-background dark:bg-card border-border text-foreground dark:text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-medium">New Collection</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-6">
          Create a Single Edition (ERC-1155) or a Unique Edition (ERC-721) collection
        </p>

        <Button
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer transition-colors"
          onClick={() => {
            redirect("/mint/create");
          }}
        >
          Create New Collection
        </Button>
      </CardContent>
    </Card>
  );
}
