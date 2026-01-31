"use client";

import * as React from "react";
import { Label } from "@/shared/components/ui/label";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import { Switch } from "@/shared/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

export function FormSection() {
  return (
    <div className="space-y-8">
      {/* Checkbox */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Checkbox</h4>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" />
            <Label htmlFor="terms">Accept terms and conditions</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="marketing" defaultChecked />
            <Label htmlFor="marketing">Receive marketing emails</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="disabled" disabled />
            <Label htmlFor="disabled">Disabled checkbox</Label>
          </div>
        </div>
      </div>

      {/* Radio Group */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Radio Group</h4>
        <RadioGroup defaultValue="option-1">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option-1" id="option-1" />
            <Label htmlFor="option-1">Option 1</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option-2" id="option-2" />
            <Label htmlFor="option-2">Option 2</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option-3" id="option-3" disabled />
            <Label htmlFor="option-3">Disabled option</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Switch */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Switch</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between max-w-sm">
            <Label htmlFor="notifications">Email notifications</Label>
            <Switch id="notifications" />
          </div>
          <div className="flex items-center justify-between max-w-sm">
            <Label htmlFor="marketing-switch">Marketing emails</Label>
            <Switch id="marketing-switch" defaultChecked />
          </div>
          <div className="flex items-center justify-between max-w-sm">
            <Label htmlFor="disabled-switch">Disabled switch</Label>
            <Switch id="disabled-switch" disabled />
          </div>
        </div>
      </div>

      {/* Select */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Select</h4>
        <div className="max-w-sm space-y-2">
          <Label>Select blockchain</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select a blockchain" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ethereum">Ethereum</SelectItem>
              <SelectItem value="polygon">Polygon</SelectItem>
              <SelectItem value="base">Base</SelectItem>
              <SelectItem value="arbitrum">Arbitrum</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
