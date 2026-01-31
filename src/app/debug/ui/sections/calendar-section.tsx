"use client";

import * as React from "react";
import { Calendar } from "@/shared/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import { Button } from "@/shared/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/shared/utils/tailwind-utils";

export function CalendarSection() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [dateRange, setDateRange] = React.useState<{ from: Date | undefined; to: Date | undefined }>({
    from: new Date(2024, 0, 20),
    to: new Date(2024, 1, 9),
  });
  const [multipleDates, setMultipleDates] = React.useState<Date[] | undefined>([
    new Date(2024, 0, 1),
    new Date(2024, 0, 8),
    new Date(2024, 0, 15),
  ]);

  return (
    <div className="space-y-8">
      {/* Single Date Selection */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Single Date Selection</h4>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Default Calendar</CardTitle>
              <CardDescription>Select a single date</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">With Date Picker</CardTitle>
              <CardDescription>Calendar in a popover</CardDescription>
            </CardHeader>
            <CardContent>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {date && (
                <div className="mt-4 p-3 rounded-md bg-frosted-2 text-sm">
                  <p className="text-muted-foreground">Selected date:</p>
                  <p className="font-medium mt-1">{format(date, "PPPP")}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Date Range Selection */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Date Range Selection</h4>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Range Picker</CardTitle>
            <CardDescription>Select a date range for NFT auction periods</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={(range) => {
                const newFrom = range?.from;
                const newTo = range?.to;
                if (
                  newFrom?.getTime() !== dateRange.from?.getTime() ||
                  newTo?.getTime() !== dateRange.to?.getTime()
                ) {
                  setDateRange({ from: newFrom, to: newTo });
                }
              }}
              numberOfMonths={2}
              className="rounded-md border"
            />
            {dateRange?.from && (
              <div className="w-full p-4 rounded-md bg-frosted-2 text-sm">
                <p className="text-muted-foreground mb-2">Selected range:</p>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{format(dateRange.from, "PPP")}</span>
                  {dateRange.to && (
                    <>
                      <span className="text-muted-foreground">→</span>
                      <span className="font-medium">{format(dateRange.to, "PPP")}</span>
                    </>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Multiple Dates Selection */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Multiple Dates Selection</h4>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Multi-Select Calendar</CardTitle>
            <CardDescription>Select multiple dates for event scheduling</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <Calendar
              mode="multiple"
              selected={multipleDates}
              onSelect={setMultipleDates}
              className="rounded-md border"
            />
            {multipleDates && multipleDates.length > 0 && (
              <div className="w-full p-4 rounded-md bg-frosted-2 text-sm">
                <p className="text-muted-foreground mb-2">
                  Selected {multipleDates.length} date{multipleDates.length !== 1 ? "s" : ""}:
                </p>
                <div className="flex flex-wrap gap-2">
                  {multipleDates.map((d, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium"
                    >
                      {format(d, "MMM d, yyyy")}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Calendar Variants */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Calendar Variants</h4>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">With Dropdown</CardTitle>
              <CardDescription>Month and year selection</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                captionLayout="dropdown"
                fromYear={2020}
                toYear={2030}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Disabled Dates</CardTitle>
              <CardDescription>Past dates disabled</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(date) => date < new Date()}
                className="rounded-md border"
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* NFT Marketplace Use Cases */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">NFT Marketplace Use Cases</h4>
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Auction Schedule</CardTitle>
              <CardDescription>Set auction start and end dates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Auction Period</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dateRange?.from && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange?.from ? (
                          dateRange.to ? (
                            <>
                              {format(dateRange.from, "LLL dd, y")} -{" "}
                              {format(dateRange.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(dateRange.from, "LLL dd, y")
                          )
                        ) : (
                          <span>Pick a date range</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="range"
                        selected={dateRange}
                        onSelect={(range) => {
                          const newFrom = range?.from;
                          const newTo = range?.to;
                          if (
                            newFrom?.getTime() !== dateRange.from?.getTime() ||
                            newTo?.getTime() !== dateRange.to?.getTime()
                          ) {
                            setDateRange({ from: newFrom, to: newTo });
                          }
                        }}
                        numberOfMonths={2}
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="p-3 rounded-md bg-frosted-2 text-sm">
                  <p className="text-muted-foreground">💡 Tip: Select future dates for your NFT auction</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
