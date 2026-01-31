"use client";

import * as React from "react";
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Volume2, VolumeX } from "lucide-react";
import { Toggle } from "@/shared/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/shared/components/ui/toggle-group";
import { Slider } from "@/shared/components/ui/slider";
import { Label } from "@/shared/components/ui/label";
import { Kbd, KbdGroup } from "@/shared/components/ui/kbd";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/shared/components/ui/collapsible";
import { Button } from "@/shared/components/ui/button";
import { ChevronDown } from "lucide-react";

export function InteractiveSection() {
  const [isBold, setIsBold] = React.useState(false);
  const [isItalic, setIsItalic] = React.useState(false);
  const [alignment, setAlignment] = React.useState("left");
  const [volume, setVolume] = React.useState([50]);
  const [priceRange, setPriceRange] = React.useState([20, 80]);
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="space-y-8">
      {/* Toggle Buttons */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Toggle Buttons</h4>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-3">Default Variant</p>
            <div className="flex flex-wrap gap-3">
              <Toggle pressed={isBold} onPressedChange={setIsBold}>
                <Bold className="h-4 w-4" />
              </Toggle>
              <Toggle pressed={isItalic} onPressedChange={setIsItalic}>
                <Italic className="h-4 w-4" />
              </Toggle>
              <Toggle>
                <Underline className="h-4 w-4" />
              </Toggle>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-3">Outline Variant</p>
            <div className="flex flex-wrap gap-3">
              <Toggle variant="outline">
                <Bold className="h-4 w-4 mr-2" />
                Bold
              </Toggle>
              <Toggle variant="outline">
                <Italic className="h-4 w-4 mr-2" />
                Italic
              </Toggle>
              <Toggle variant="outline">
                <Underline className="h-4 w-4 mr-2" />
                Underline
              </Toggle>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-3">Sizes</p>
            <div className="flex items-center flex-wrap gap-3">
              <Toggle size="sm">
                <Bold className="h-3 w-3" />
              </Toggle>
              <Toggle size="default">
                <Bold className="h-4 w-4" />
              </Toggle>
              <Toggle size="lg">
                <Bold className="h-5 w-5" />
              </Toggle>
            </div>
          </div>
        </div>
      </div>

      {/* Toggle Groups */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Toggle Groups</h4>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-3">Single Selection</p>
            <ToggleGroup type="single" value={alignment} onValueChange={setAlignment}>
              <ToggleGroupItem value="left" aria-label="Align left">
                <AlignLeft className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="center" aria-label="Align center">
                <AlignCenter className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="right" aria-label="Align right">
                <AlignRight className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-3">Multiple Selection</p>
            <ToggleGroup type="multiple">
              <ToggleGroupItem value="bold">
                <Bold className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="italic">
                <Italic className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="underline">
                <Underline className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-3">Outline Variant</p>
            <ToggleGroup type="single" variant="outline">
              <ToggleGroupItem value="left">Left</ToggleGroupItem>
              <ToggleGroupItem value="center">Center</ToggleGroupItem>
              <ToggleGroupItem value="right">Right</ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      </div>

      {/* Sliders */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Sliders</h4>
        <div className="space-y-6 max-w-md">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Volume</Label>
              <span className="text-sm text-muted-foreground">{volume[0]}%</span>
            </div>
            <Slider
              value={volume}
              onValueChange={setVolume}
              max={100}
              step={1}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Price Range (ETH)</Label>
              <span className="text-sm text-muted-foreground">
                {priceRange[0]} - {priceRange[1]}
              </span>
            </div>
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              max={100}
              step={1}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label>Disabled Slider</Label>
            <Slider defaultValue={[33]} max={100} step={1} disabled />
          </div>

          <div className="space-y-2">
            <Label>Vertical Slider</Label>
            <div className="flex justify-center pt-4">
              <Slider
                defaultValue={[50]}
                max={100}
                step={1}
                orientation="vertical"
                className="h-44"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Keyboard Shortcuts (Kbd)</h4>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-3">Single Keys</p>
            <div className="flex flex-wrap gap-2">
              <Kbd>⌘</Kbd>
              <Kbd>Shift</Kbd>
              <Kbd>Ctrl</Kbd>
              <Kbd>Alt</Kbd>
              <Kbd>Tab</Kbd>
              <Kbd>Enter</Kbd>
              <Kbd>Esc</Kbd>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-3">Key Combinations</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <KbdGroup>
                  <Kbd>⌘</Kbd>
                  <Kbd>K</Kbd>
                </KbdGroup>
                <span className="text-sm text-muted-foreground">Open command palette</span>
              </div>
              <div className="flex items-center gap-2">
                <KbdGroup>
                  <Kbd>Ctrl</Kbd>
                  <Kbd>Shift</Kbd>
                  <Kbd>P</Kbd>
                </KbdGroup>
                <span className="text-sm text-muted-foreground">Open command menu</span>
              </div>
              <div className="flex items-center gap-2">
                <KbdGroup>
                  <Kbd>⌘</Kbd>
                  <Kbd>B</Kbd>
                </KbdGroup>
                <span className="text-sm text-muted-foreground">Toggle sidebar</span>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-3">Arrow Keys</p>
            <div className="flex flex-wrap gap-2">
              <Kbd>↑</Kbd>
              <Kbd>↓</Kbd>
              <Kbd>←</Kbd>
              <Kbd>→</Kbd>
            </div>
          </div>
        </div>
      </div>

      {/* Collapsible */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Collapsible</h4>
        <div className="space-y-4 max-w-md">
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <div className="rounded-md border p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">NFT Collection Details</h4>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                    <span className="sr-only">Toggle</span>
                  </Button>
                </CollapsibleTrigger>
              </div>
              <p className="text-sm text-muted-foreground">
                @bored-ape-yacht-club • 10,000 items
              </p>
              <CollapsibleContent className="space-y-2 pt-2">
                <div className="rounded-md bg-frosted-2 px-3 py-2 text-sm">
                  Floor Price: 45.2 ETH
                </div>
                <div className="rounded-md bg-frosted-2 px-3 py-2 text-sm">
                  Total Volume: 1.2M ETH
                </div>
                <div className="rounded-md bg-frosted-2 px-3 py-2 text-sm">
                  Owners: 6,234 (62.3%)
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>

          <Collapsible>
            <div className="rounded-md border p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">Advanced Filters</h4>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent className="space-y-3 pt-2">
                <div className="space-y-2">
                  <Label>Price Range</Label>
                  <Slider defaultValue={[0, 100]} max={100} step={1} />
                </div>
                <div className="space-y-2">
                  <Label>Rarity Score</Label>
                  <Slider defaultValue={[50]} max={100} step={1} />
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        </div>
      </div>

      {/* NFT Marketplace Patterns */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">NFT Marketplace Patterns</h4>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-md border p-4 space-y-4">
            <h5 className="font-medium">Audio Player Controls</h5>
            <div className="flex items-center gap-4">
              <Toggle>
                {volume[0] > 0 ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Toggle>
              <Slider
                value={volume}
                onValueChange={setVolume}
                max={100}
                step={1}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground w-12 text-right">{volume[0]}%</span>
            </div>
          </div>

          <div className="rounded-md border p-4 space-y-4">
            <h5 className="font-medium">View Mode Toggle</h5>
            <ToggleGroup type="single" defaultValue="grid" variant="outline">
              <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
              <ToggleGroupItem value="list">List</ToggleGroupItem>
              <ToggleGroupItem value="compact">Compact</ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      </div>
    </div>
  );
}
