"use client";

import * as React from "react";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { InputGroup } from "@/shared/components/ui/input-group";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/shared/components/ui/input-otp";
import { Label } from "@/shared/components/ui/label";
import { Search, Mail, Lock, DollarSign } from "lucide-react";

export function InputSection() {
  return (
    <div className="space-y-8">
      {/* Basic Input */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Basic Input</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Enter your name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" />
          </div>
        </div>
      </div>

      {/* Input with Icons */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Input with Icons</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
          <InputGroup>
            <Search className="w-4 h-4" />
            <Input placeholder="Search NFTs..." />
          </InputGroup>
          <InputGroup>
            <Mail className="w-4 h-4" />
            <Input type="email" placeholder="Email address" />
          </InputGroup>
          <InputGroup>
            <Lock className="w-4 h-4" />
            <Input type="password" placeholder="Password" />
          </InputGroup>
          <InputGroup>
            <DollarSign className="w-4 h-4" />
            <Input type="number" placeholder="0.00" />
          </InputGroup>
        </div>
      </div>

      {/* Input States */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Input States</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
          <div className="space-y-2">
            <Label>Normal</Label>
            <Input placeholder="Normal state" />
          </div>
          <div className="space-y-2">
            <Label>Disabled</Label>
            <Input placeholder="Disabled state" disabled />
          </div>
          <div className="space-y-2">
            <Label>With Error</Label>
            <Input placeholder="Error state" className="border-os-error" />
            <p className="text-xs text-os-error">This field is required</p>
          </div>
          <div className="space-y-2">
            <Label>With Success</Label>
            <Input placeholder="Success state" className="border-os-success" />
            <p className="text-xs text-os-success">Looks good!</p>
          </div>
        </div>
      </div>

      {/* Textarea */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Textarea</h4>
        <div className="max-w-2xl space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Enter NFT description..."
            rows={4}
          />
        </div>
      </div>

      {/* OTP Input */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">OTP Input</h4>
        <div className="max-w-md">
          <Label>Enter verification code</Label>
          <InputOTP maxLength={6}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
      </div>

      {/* Input Sizes */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Sizes</h4>
        <div className="max-w-md space-y-3">
          <Input placeholder="Default size" />
          <Input placeholder="Small size" className="h-8 text-sm" />
          <Input placeholder="Large size" className="h-12 text-base" />
        </div>
      </div>
    </div>
  );
}
