"use client";

import * as React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, Line, LineChart, Pie, PieChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/shared/components/ui/chart";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card";

export function ChartSection() {
  // NFT Sales Data
  const salesData = [
    { month: "Jan", sales: 186, volume: 80 },
    { month: "Feb", sales: 305, volume: 200 },
    { month: "Mar", sales: 237, volume: 120 },
    { month: "Apr", sales: 273, volume: 190 },
    { month: "May", sales: 209, volume: 130 },
    { month: "Jun", sales: 314, volume: 140 },
  ];

  const salesConfig = {
    sales: {
      label: "Sales",
      color: "hsl(var(--color-os-info))",
    },
    volume: {
      label: "Volume",
      color: "hsl(var(--color-os-epic))",
    },
  } satisfies ChartConfig;

  // NFT Collection Distribution
  const collectionData = [
    { category: "Art", value: 275, fill: "hsl(var(--color-os-rare))" },
    { category: "Gaming", value: 200, fill: "hsl(var(--color-os-epic))" },
    { category: "Music", value: 187, fill: "hsl(var(--color-os-legendary))" },
    { category: "Sports", value: 173, fill: "hsl(var(--color-os-info))" },
    { category: "Other", value: 90, fill: "hsl(var(--color-os-gray-600))" },
  ];

  const collectionConfig = {
    value: {
      label: "Collections",
    },
  } satisfies ChartConfig;

  // Price Trend Data
  const priceData = [
    { date: "Mon", price: 2.5 },
    { date: "Tue", price: 3.2 },
    { date: "Wed", price: 2.8 },
    { date: "Thu", price: 4.1 },
    { date: "Fri", price: 3.9 },
    { date: "Sat", price: 4.5 },
    { date: "Sun", price: 5.2 },
  ];

  const priceConfig = {
    price: {
      label: "Floor Price (ETH)",
      color: "hsl(var(--color-os-success))",
    },
  } satisfies ChartConfig;

  return (
    <div className="space-y-8">
      {/* Bar Chart - NFT Sales */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Bar Chart - NFT Sales & Volume</h4>
        <Card>
          <CardHeader>
            <CardTitle>Monthly NFT Sales</CardTitle>
            <CardDescription>January - June 2024</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={salesConfig}>
              <BarChart accessibilityLayer data={salesData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="sales" fill="var(--color-sales)" radius={4} />
                <Bar dataKey="volume" fill="var(--color-volume)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4 text-os-success" />
            </div>
            <div className="leading-none text-muted-foreground">
              Showing total sales and volume for the last 6 months
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Line Chart - Price Trend */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Line Chart - Floor Price Trend</h4>
        <Card>
          <CardHeader>
            <CardTitle>Collection Floor Price</CardTitle>
            <CardDescription>Last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={priceConfig}>
              <LineChart accessibilityLayer data={priceData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  dataKey="price"
                  type="monotone"
                  stroke="var(--color-price)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
          <CardFooter>
            <div className="flex w-full items-start gap-2 text-sm">
              <div className="grid gap-2">
                <div className="flex items-center gap-2 font-medium leading-none">
                  Floor price up 108% this week <TrendingUp className="h-4 w-4 text-os-success" />
                </div>
                <div className="flex items-center gap-2 leading-none text-muted-foreground">
                  Current floor: 5.2 ETH
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Area Chart - Stacked */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Area Chart - Sales vs Volume</h4>
        <Card>
          <CardHeader>
            <CardTitle>Sales & Volume Comparison</CardTitle>
            <CardDescription>Stacked area chart showing market activity</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={salesConfig}>
              <AreaChart accessibilityLayer data={salesData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Area
                  dataKey="volume"
                  type="natural"
                  fill="var(--color-volume)"
                  fillOpacity={0.4}
                  stroke="var(--color-volume)"
                  stackId="a"
                />
                <Area
                  dataKey="sales"
                  type="natural"
                  fill="var(--color-sales)"
                  fillOpacity={0.4}
                  stroke="var(--color-sales)"
                  stackId="a"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Pie Chart - Collection Distribution */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Pie Chart - Collection Categories</h4>
        <Card>
          <CardHeader>
            <CardTitle>NFT Collection Distribution</CardTitle>
            <CardDescription>By category</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ChartContainer config={collectionConfig} className="mx-auto aspect-square max-h-[300px]">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie data={collectionData} dataKey="value" nameKey="category" />
              </PieChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 font-medium leading-none">
              Art collections dominate with 30% market share
            </div>
            <div className="leading-none text-muted-foreground">
              Total: 925 collections across all categories
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Multiple Charts Grid */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Dashboard Grid - Multiple Charts</h4>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Weekly Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={salesConfig} className="h-[200px]">
                <BarChart data={salesData}>
                  <Bar dataKey="sales" fill="var(--color-sales)" radius={4} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Price Movement</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={priceConfig} className="h-[200px]">
                <LineChart data={priceData}>
                  <Line
                    dataKey="price"
                    type="monotone"
                    stroke="var(--color-price)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
