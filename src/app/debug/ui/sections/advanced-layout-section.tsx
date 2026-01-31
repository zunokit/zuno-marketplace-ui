"use client";

import * as React from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/shared/components/ui/carousel";
import { AspectRatio } from "@/shared/components/ui/aspect-ratio";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Image } from "lucide-react";

export function AdvancedLayoutSection() {
  const nftImages = [
    { id: 1, name: "Cosmic Ape #1234", rarity: "Legendary" },
    { id: 2, name: "Pixel Punk #5678", rarity: "Epic" },
    { id: 3, name: "Cool Cat #9012", rarity: "Rare" },
    { id: 4, name: "Doodle #3456", rarity: "Epic" },
    { id: 5, name: "Azuki #7890", rarity: "Legendary" },
  ];

  return (
    <div className="space-y-8">
      {/* Carousel - Basic */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Carousel - NFT Gallery</h4>
        <div className="max-w-xl mx-auto">
          <Carousel className="w-full">
            <CarouselContent>
              {nftImages.map((nft) => (
                <CarouselItem key={nft.id}>
                  <Card>
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <div className="text-center space-y-2">
                        <div className="w-full h-48 rounded-md bg-gradient-to-br from-os-rare/20 to-os-epic/20 flex items-center justify-center">
                          <Image className="w-16 h-16 text-muted-foreground" aria-hidden="true" />
                        </div>
                        <h3 className="font-semibold">{nft.name}</h3>
                        <Badge variant="outline">{nft.rarity}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>

      {/* Carousel - Multiple Items */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Carousel - Multiple Items Per View</h4>
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full"
        >
          <CarouselContent>
            {nftImages.map((nft, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card>
                    <CardContent className="flex aspect-square items-center justify-center p-4">
                      <div className="text-center space-y-2">
                        <div className="w-full h-32 rounded-md bg-gradient-to-br from-os-info/20 to-os-legendary/20 flex items-center justify-center">
                          <Image className="w-12 h-12 text-muted-foreground" aria-hidden="true" />
                        </div>
                        <p className="text-sm font-medium">{nft.name}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>

      {/* Carousel - Vertical */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Carousel - Vertical Orientation</h4>
        <div className="max-w-xs mx-auto">
          <Carousel
            opts={{
              align: "start",
            }}
            orientation="vertical"
            className="w-full max-w-xs"
          >
            <CarouselContent className="h-[400px]">
              {nftImages.slice(0, 3).map((nft, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex items-center justify-center p-6">
                        <div className="text-center space-y-2">
                          <div className="w-full h-24 rounded-md bg-gradient-to-br from-os-epic/20 to-os-rare/20 flex items-center justify-center">
                            <Image className="w-10 h-10 text-muted-foreground" aria-hidden="true" />
                          </div>
                          <p className="text-sm font-medium">{nft.name}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>

      {/* Aspect Ratio */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Aspect Ratio</h4>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Square (1:1)</p>
            <AspectRatio ratio={1 / 1}>
              <div className="w-full h-full rounded-md bg-gradient-to-br from-os-rare/20 to-os-epic/20 flex items-center justify-center">
                <div className="text-center">
                  <Image className="w-12 h-12 mx-auto text-muted-foreground" aria-hidden="true" />
                  <p className="text-sm mt-2">1:1</p>
                </div>
              </div>
            </AspectRatio>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Portrait (3:4)</p>
            <AspectRatio ratio={3 / 4}>
              <div className="w-full h-full rounded-md bg-gradient-to-br from-os-info/20 to-os-legendary/20 flex items-center justify-center">
                <div className="text-center">
                  <Image className="w-12 h-12 mx-auto text-muted-foreground" aria-hidden="true" />
                  <p className="text-sm mt-2">3:4</p>
                </div>
              </div>
            </AspectRatio>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Landscape (16:9)</p>
            <AspectRatio ratio={16 / 9}>
              <div className="w-full h-full rounded-md bg-gradient-to-br from-os-epic/20 to-os-success/20 flex items-center justify-center">
                <div className="text-center">
                  <Image className="w-12 h-12 mx-auto text-muted-foreground" aria-hidden="true" />
                  <p className="text-sm mt-2">16:9</p>
                </div>
              </div>
            </AspectRatio>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Wide (21:9)</p>
            <AspectRatio ratio={21 / 9}>
              <div className="w-full h-full rounded-md bg-gradient-to-br from-os-legendary/20 to-os-rare/20 flex items-center justify-center">
                <div className="text-center">
                  <Image className="w-12 h-12 mx-auto text-muted-foreground" aria-hidden="true" />
                  <p className="text-sm mt-2">21:9</p>
                </div>
              </div>
            </AspectRatio>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Golden Ratio (1.618:1)</p>
            <AspectRatio ratio={1.618 / 1}>
              <div className="w-full h-full rounded-md bg-gradient-to-br from-os-success/20 to-os-info/20 flex items-center justify-center">
                <div className="text-center">
                  <Image className="w-12 h-12 mx-auto text-muted-foreground" aria-hidden="true" />
                  <p className="text-sm mt-2">φ</p>
                </div>
              </div>
            </AspectRatio>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Custom (2:3)</p>
            <AspectRatio ratio={2 / 3}>
              <div className="w-full h-full rounded-md bg-gradient-to-br from-os-rare/20 to-os-legendary/20 flex items-center justify-center">
                <div className="text-center">
                  <Image className="w-12 h-12 mx-auto text-muted-foreground" aria-hidden="true" />
                  <p className="text-sm mt-2">2:3</p>
                </div>
              </div>
            </AspectRatio>
          </div>
        </div>
      </div>

      {/* NFT Card with Aspect Ratio */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">NFT Card with Aspect Ratio</h4>
        <div className="grid gap-4 md:grid-cols-3">
          {nftImages.slice(0, 3).map((nft) => (
            <Card key={nft.id}>
              <CardContent className="p-0">
                <AspectRatio ratio={1 / 1}>
                  <div className="w-full h-full rounded-t-md bg-gradient-to-br from-os-rare/20 via-os-epic/20 to-os-legendary/20 flex items-center justify-center">
                    <Image className="w-16 h-16 text-muted-foreground" />
                  </div>
                </AspectRatio>
                <div className="p-4 space-y-2">
                  <h3 className="font-semibold">{nft.name}</h3>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{nft.rarity}</Badge>
                    <span className="text-sm font-medium">2.5 ETH</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Combined: Carousel + Aspect Ratio */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Featured Collections Carousel</h4>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {nftImages.map((nft, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card>
                    <CardContent className="p-0">
                      <AspectRatio ratio={4 / 3}>
                        <div className="w-full h-full rounded-t-md bg-gradient-to-br from-os-info/20 via-os-epic/20 to-os-rare/20 flex items-center justify-center">
                          <Image className="w-16 h-16 text-muted-foreground" aria-hidden="true" />
                        </div>
                      </AspectRatio>
                      <div className="p-4 space-y-2">
                        <h3 className="font-semibold text-sm">{nft.name}</h3>
                        <div className="flex items-center justify-between text-xs">
                          <Badge variant="outline" className="text-xs">{nft.rarity}</Badge>
                          <span className="font-medium">Floor: 2.5 ETH</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
}
