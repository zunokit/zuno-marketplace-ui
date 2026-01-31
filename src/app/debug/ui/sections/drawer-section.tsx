"use client";

import * as React from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/shared/components/ui/drawer";

export function DrawerSection() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Drawer Directions</h4>
        <div className="flex flex-wrap gap-3">
          {(["right", "left", "top", "bottom"] as const).map((direction) => (
            <Drawer key={direction} direction={direction}>
              <DrawerTrigger asChild>
                <Button variant="outline" className="capitalize">
                  Open {direction}
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Drawer from {direction}</DrawerTitle>
                  <DrawerDescription>
                    This drawer slides in from the {direction}.
                  </DrawerDescription>
                </DrawerHeader>
                <div className="p-4">
                  <p className="text-sm text-muted-foreground">
                    Drawer content goes here...
                  </p>
                </div>
                <DrawerFooter>
                  <Button>Submit</Button>
                  <DrawerClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          ))}
        </div>
      </div>
    </div>
  );
}
