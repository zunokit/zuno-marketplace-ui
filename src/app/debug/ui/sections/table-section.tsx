"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { Checkbox } from "@/shared/components/ui/checkbox";

export function TableSection() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Basic Table</h4>
        <div className="rounded-lg border border-border-subtle overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox />
                </TableHead>
                <TableHead>NFT</TableHead>
                <TableHead>Collection</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3, 4, 5].map((i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  <TableCell className="font-medium">NFT #{i}234</TableCell>
                  <TableCell>Bored Apes</TableCell>
                  <TableCell className="font-mono">{(Math.random() * 10).toFixed(2)} ETH</TableCell>
                  <TableCell>
                    <Badge variant={i % 2 === 0 ? "success" : "secondary"}>
                      {i % 2 === 0 ? "Listed" : "Unlisted"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
