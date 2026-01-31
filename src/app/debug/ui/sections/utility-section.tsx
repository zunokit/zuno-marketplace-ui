"use client";

import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Separator } from "@/shared/components/ui/separator";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Kbd } from "@/shared/components/ui/kbd";

export function UtilitySection() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Avatar</h4>
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
          <Avatar className="w-16 h-16">
            <AvatarFallback>XL</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Separator</h4>
        <div className="space-y-4 max-w-md">
          <div>
            <p className="text-sm">Section 1</p>
            <Separator className="my-4" />
            <p className="text-sm">Section 2</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Scroll Area</h4>
        <ScrollArea className="h-48 w-full max-w-md rounded-lg border border-border-subtle p-4">
          <div className="space-y-2">
            {Array.from({ length: 20 }).map((_, i) => (
              <p key={i} className="text-sm">
                Item {i + 1}
              </p>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Keyboard Shortcut</h4>
        <div className="flex items-center gap-2">
          <span className="text-sm">Search:</span>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </div>
      </div>
    </div>
  );
}
