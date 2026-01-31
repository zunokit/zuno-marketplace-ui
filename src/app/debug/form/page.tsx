"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Lock,
  Search,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  User,
  CreditCard,
  ChevronDown,
} from "lucide-react";

import { cn } from "@/shared/utils/tailwind-utils";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import { Switch } from "@/shared/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
} from "@/shared/components/ui/input-group";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/shared/components/ui/field";

// ============================================
// FORM ELEMENTS DEBUG PAGE
// ============================================

export default function FormElementsDebugPage() {
  // State for interactive examples
  const [showPassword, setShowPassword] = useState(false);
  const [indeterminateChecked, setIndeterminateChecked] = useState<"unchecked" | "indeterminate" | "checked">("indeterminate");
  const [switchStates, setSwitchStates] = useState({
    notifications: true,
    marketing: false,
    darkMode: true,
  });

  // Toggle indeterminate state for demo
  const toggleIndeterminate = () => {
    setIndeterminateChecked((prev) => {
      if (prev === "unchecked") return "indeterminate";
      if (prev === "indeterminate") return "checked";
      return "unchecked";
    });
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      {/* Page Header */}
      <div className="mx-auto max-w-6xl space-y-2 mb-10">
        <Link
          href="/debug"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Debug Dashboard
        </Link>
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Form Elements
            </h1>
            <p className="text-muted-foreground">
              Input fields, selects, checkboxes, radio buttons, and validation states
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-8">
        {/* Section 1: Input Fields */}
        <Card>
          <CardHeader>
            <CardTitle>Input Fields</CardTitle>
            <CardDescription>
              Text inputs with various states, types, and configurations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Basic Input States */}
            <FieldSet>
              <FieldLegend>Basic States</FieldLegend>
              <FieldGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Default */}
                <Field>
                  <FieldLabel htmlFor="input-default">Default</FieldLabel>
                  <Input id="input-default" placeholder="Enter text..." />
                  <FieldDescription>Standard input field</FieldDescription>
                </Field>

                {/* Focused (auto-focused) */}
                <Field>
                  <FieldLabel htmlFor="input-focused">Focused</FieldLabel>
                  <Input id="input-focused" placeholder="Focused state..." autoFocus />
                  <FieldDescription>Input with focus ring</FieldDescription>
                </Field>

                {/* Disabled */}
                <Field>
                  <FieldLabel htmlFor="input-disabled">Disabled</FieldLabel>
                  <Input id="input-disabled" placeholder="Disabled input" disabled />
                  <FieldDescription>Cannot be interacted with</FieldDescription>
                </Field>

                {/* Error State */}
                <Field>
                  <FieldLabel htmlFor="input-error">Error State</FieldLabel>
                  <Input
                    id="input-error"
                    placeholder="Error example"
                    aria-invalid="true"
                    className="border-os-error focus:border-os-error"
                    defaultValue="invalid@email"
                  />
                  <FieldError>Please enter a valid email address</FieldError>
                </Field>

                {/* Success State */}
                <Field>
                  <FieldLabel htmlFor="input-success">Success State</FieldLabel>
                  <div className="relative">
                    <Input
                      id="input-success"
                      placeholder="Success example"
                      className="border-os-success pr-10"
                      defaultValue="valid@email.com"
                    />
                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-os-success" />
                  </div>
                  <FieldDescription className="text-os-success">
                    Email address is valid
                  </FieldDescription>
                </Field>

                {/* With Helper Text */}
                <Field>
                  <FieldLabel htmlFor="input-helper">
                    With Helper
                    <span className="text-os-error ml-1">*</span>
                  </FieldLabel>
                  <Input id="input-helper" placeholder="username" />
                  <FieldDescription>
                    3-20 characters, letters and numbers only
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </FieldSet>

            {/* Input Types */}
            <FieldSet>
              <FieldLegend>Input Types</FieldLegend>
              <FieldGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Text */}
                <Field>
                  <FieldLabel htmlFor="type-text">Text</FieldLabel>
                  <Input id="type-text" type="text" placeholder="Regular text input" />
                </Field>

                {/* Email */}
                <Field>
                  <FieldLabel htmlFor="type-email">Email</FieldLabel>
                  <Input
                    id="type-email"
                    type="email"
                    placeholder="user@example.com"
                    autoComplete="email"
                  />
                </Field>

                {/* Password with Toggle */}
                <Field>
                  <FieldLabel htmlFor="type-password">Password</FieldLabel>
                  <InputGroup>
                    <InputGroupAddon align="inline-start">
                      <Lock className="w-4 h-4" />
                    </InputGroupAddon>
                    <InputGroupInput
                      id="type-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      autoComplete="current-password"
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupButton
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
                </Field>

                {/* Number */}
                <Field>
                  <FieldLabel htmlFor="type-number">Number</FieldLabel>
                  <Input
                    id="type-number"
                    type="number"
                    placeholder="0"
                    min={0}
                    max={100}
                  />
                </Field>

                {/* Search */}
                <Field>
                  <FieldLabel htmlFor="type-search">Search</FieldLabel>
                  <InputGroup>
                    <InputGroupAddon align="inline-start">
                      <Search className="w-4 h-4" />
                    </InputGroupAddon>
                    <InputGroupInput
                      id="type-search"
                      type="search"
                      placeholder="Search..."
                    />
                  </InputGroup>
                </Field>

                {/* Tel */}
                <Field>
                  <FieldLabel htmlFor="type-tel">Phone</FieldLabel>
                  <Input
                    id="type-tel"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    autoComplete="tel"
                  />
                </Field>
              </FieldGroup>
            </FieldSet>

            {/* Inputs with Icons */}
            <FieldSet>
              <FieldLegend>With Icons</FieldLegend>
              <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Leading Icon */}
                <Field>
                  <FieldLabel htmlFor="icon-leading">Leading Icon</FieldLabel>
                  <InputGroup>
                    <InputGroupAddon align="inline-start">
                      <User className="w-4 h-4" />
                    </InputGroupAddon>
                    <InputGroupInput id="icon-leading" placeholder="Username" />
                  </InputGroup>
                </Field>

                {/* Trailing Icon */}
                <Field>
                  <FieldLabel htmlFor="icon-trailing">Trailing Icon</FieldLabel>
                  <InputGroup>
                    <InputGroupInput id="icon-trailing" placeholder="Card number" />
                    <InputGroupAddon align="inline-end">
                      <CreditCard className="w-4 h-4" />
                    </InputGroupAddon>
                  </InputGroup>
                </Field>

                {/* Both Icons */}
                <Field>
                  <FieldLabel htmlFor="icon-both">Both Icons</FieldLabel>
                  <InputGroup>
                    <InputGroupAddon align="inline-start">
                      <Mail className="w-4 h-4" />
                    </InputGroupAddon>
                    <InputGroupInput id="icon-both" placeholder="Email address" />
                    <InputGroupAddon align="inline-end">
                      <CheckCircle2 className="w-4 h-4 text-os-success" />
                    </InputGroupAddon>
                  </InputGroup>
                </Field>

                {/* With Button */}
                <Field>
                  <FieldLabel htmlFor="with-button">With Button</FieldLabel>
                  <InputGroup>
                    <InputGroupInput id="with-button" placeholder="Enter code" />
                    <InputGroupAddon align="inline-end">
                      <InputGroupButton type="button">Verify</InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
                </Field>
              </FieldGroup>
            </FieldSet>

            {/* Textarea */}
            <FieldSet>
              <FieldLegend>Textarea</FieldLegend>
              <FieldGroup className="grid grid-cols-1 gap-6">
                <Field>
                  <FieldLabel htmlFor="textarea-default">Description</FieldLabel>
                  <Textarea
                    id="textarea-default"
                    placeholder="Enter a detailed description..."
                    rows={4}
                  />
                  <FieldDescription>
                    Supports multi-line text input with auto-resize
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </FieldSet>
          </CardContent>
        </Card>

        {/* Section 2: Select Dropdowns */}
        <Card>
          <CardHeader>
            <CardTitle>Select Dropdowns</CardTitle>
            <CardDescription>
              Single select dropdowns with various configurations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <FieldGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Basic Select */}
              <Field>
                <FieldLabel>Single Select</FieldLabel>
                <Select defaultValue="ethereum">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select blockchain" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ethereum">Ethereum</SelectItem>
                    <SelectItem value="polygon">Polygon</SelectItem>
                    <SelectItem value="solana">Solana</SelectItem>
                    <SelectItem value="arbitrum">Arbitrum</SelectItem>
                    <SelectItem value="optimism">Optimism</SelectItem>
                  </SelectContent>
                </Select>
                <FieldDescription>Choose your preferred network</FieldDescription>
              </Field>

              {/* With Placeholder */}
              <Field>
                <FieldLabel>With Placeholder</FieldLabel>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="art">Art</SelectItem>
                    <SelectItem value="music">Music</SelectItem>
                    <SelectItem value="gaming">Gaming</SelectItem>
                    <SelectItem value="photography">Photography</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                  </SelectContent>
                </Select>
                <FieldDescription>No default selection</FieldDescription>
              </Field>

              {/* Disabled */}
              <Field>
                <FieldLabel>Disabled</FieldLabel>
                <Select disabled defaultValue="ethereum">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select blockchain" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ethereum">Ethereum</SelectItem>
                    <SelectItem value="polygon">Polygon</SelectItem>
                  </SelectContent>
                </Select>
                <FieldDescription>Cannot be changed</FieldDescription>
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>

        {/* Section 3: Checkboxes */}
        <Card>
          <CardHeader>
            <CardTitle>Checkboxes</CardTitle>
            <CardDescription>
              Single checkboxes, checkbox groups, and indeterminate state
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Single Checkbox */}
            <FieldSet>
              <FieldLegend>Single Checkbox</FieldLegend>
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <Checkbox id="terms" />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Accept terms and conditions
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      You agree to our Terms of Service and Privacy Policy
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox id="newsletter" defaultChecked />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor="newsletter"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Subscribe to newsletter
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receive updates about new features and promotions
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox id="disabled-check" disabled />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor="disabled-check"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Disabled checkbox
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      This option cannot be selected
                    </p>
                  </div>
                </div>
              </div>
            </FieldSet>

            {/* Checkbox Group */}
            <FieldSet>
              <FieldLegend>Checkbox Group</FieldLegend>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <Checkbox id="feature-wallet" defaultChecked />
                  <Label htmlFor="feature-wallet">Wallet Connection</Label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox id="feature-notifications" />
                  <Label htmlFor="feature-notifications">Push Notifications</Label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox id="feature-analytics" defaultChecked />
                  <Label htmlFor="feature-analytics">Analytics Dashboard</Label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox id="feature-api" />
                  <Label htmlFor="feature-api">API Access</Label>
                </div>
              </div>
            </FieldSet>

            {/* Indeterminate State */}
            <FieldSet>
              <FieldLegend>Indeterminate State</FieldLegend>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="parent-check"
                    checked={indeterminateChecked === "checked"}
                    data-state={indeterminateChecked}
                    onClick={toggleIndeterminate}
                  />
                  <Label htmlFor="parent-check" className="cursor-pointer">
                    Select All Items (Click to cycle states)
                  </Label>
                </div>
                <div className="ml-6 space-y-2 border-l-2 border-border-subtle pl-4">
                  <div className="flex items-center gap-3">
                    <Checkbox id="child-1" defaultChecked />
                    <Label htmlFor="child-1">Item 1</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox id="child-2" />
                    <Label htmlFor="child-2">Item 2</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox id="child-3" defaultChecked />
                    <Label htmlFor="child-3">Item 3</Label>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Current state: <span className="text-foreground font-medium">{indeterminateChecked}</span>
                </p>
              </div>
            </FieldSet>
          </CardContent>
        </Card>

        {/* Section 4: Radio Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Radio Buttons</CardTitle>
            <CardDescription>
              Radio groups with horizontal and vertical layouts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Vertical Layout (Default) */}
            <FieldSet>
              <FieldLegend>Vertical Layout</FieldLegend>
              <RadioGroup defaultValue="standard" className="gap-3">
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="standard" id="shipping-standard" />
                  <Label htmlFor="shipping-standard" className="cursor-pointer">
                    Standard Shipping (3-5 days)
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="express" id="shipping-express" />
                  <Label htmlFor="shipping-express" className="cursor-pointer">
                    Express Shipping (1-2 days)
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="overnight" id="shipping-overnight" />
                  <Label htmlFor="shipping-overnight" className="cursor-pointer">
                    Overnight Shipping
                  </Label>
                </div>
              </RadioGroup>
            </FieldSet>

            {/* Horizontal Layout */}
            <FieldSet>
              <FieldLegend>Horizontal Layout</FieldLegend>
              <RadioGroup defaultValue="monthly" className="flex flex-row gap-6">
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="monthly" id="billing-monthly" />
                  <Label htmlFor="billing-monthly" className="cursor-pointer">
                    Monthly
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="quarterly" id="billing-quarterly" />
                  <Label htmlFor="billing-quarterly" className="cursor-pointer">
                    Quarterly
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="yearly" id="billing-yearly" />
                  <Label htmlFor="billing-yearly" className="cursor-pointer">
                    Yearly
                  </Label>
                </div>
              </RadioGroup>
            </FieldSet>

            {/* With Descriptions */}
            <FieldSet>
              <FieldLegend>With Descriptions</FieldLegend>
              <RadioGroup defaultValue="basic" className="gap-4">
                <div className="flex items-start gap-3">
                  <RadioGroupItem value="basic" id="plan-basic" className="mt-1" />
                  <div className="grid gap-1">
                    <Label htmlFor="plan-basic" className="font-medium cursor-pointer">
                      Basic Plan
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Essential features for individuals and small projects
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <RadioGroupItem value="pro" id="plan-pro" className="mt-1" />
                  <div className="grid gap-1">
                    <Label htmlFor="plan-pro" className="font-medium cursor-pointer">
                      Pro Plan
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Advanced features with priority support
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <RadioGroupItem value="enterprise" id="plan-enterprise" className="mt-1" />
                  <div className="grid gap-1">
                    <Label htmlFor="plan-enterprise" className="font-medium cursor-pointer">
                      Enterprise
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Custom solutions for large organizations
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </FieldSet>
          </CardContent>
        </Card>

        {/* Section 5: Switches */}
        <Card>
          <CardHeader>
            <CardTitle>Switches</CardTitle>
            <CardDescription>
              Toggle switches for binary settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Basic Switches */}
            <FieldSet>
              <FieldLegend>Basic States</FieldLegend>
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="switch-default" className="cursor-pointer">
                    Default (Off)
                  </Label>
                  <Switch
                    id="switch-default"
                    checked={switchStates.marketing}
                    onCheckedChange={(checked) =>
                      setSwitchStates((prev) => ({ ...prev, marketing: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="switch-checked" className="cursor-pointer">
                    Checked (On)
                  </Label>
                  <Switch
                    id="switch-checked"
                    checked={switchStates.notifications}
                    onCheckedChange={(checked) =>
                      setSwitchStates((prev) => ({ ...prev, notifications: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="switch-disabled" className="cursor-pointer opacity-50">
                    Disabled
                  </Label>
                  <Switch id="switch-disabled" disabled />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="switch-disabled-on" className="cursor-pointer opacity-50">
                    Disabled (On)
                  </Label>
                  <Switch id="switch-disabled-on" disabled defaultChecked />
                </div>
              </div>
            </FieldSet>

            {/* With Labels */}
            <FieldSet>
              <FieldLegend>With Labels</FieldLegend>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border border-border-subtle bg-frosted-1">
                  <div className="space-y-0.5">
                    <Label htmlFor="dark-mode" className="text-base font-medium cursor-pointer">
                      Dark Mode
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Use dark theme throughout the application
                    </p>
                  </div>
                  <Switch
                    id="dark-mode"
                    checked={switchStates.darkMode}
                    onCheckedChange={(checked) =>
                      setSwitchStates((prev) => ({ ...prev, darkMode: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border border-border-subtle bg-frosted-1">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notif" className="text-base font-medium cursor-pointer">
                      Email Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receive email updates about your account
                    </p>
                  </div>
                  <Switch id="email-notif" defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border border-border-subtle bg-frosted-1">
                  <div className="space-y-0.5">
                    <Label htmlFor="two-factor" className="text-base font-medium cursor-pointer">
                      Two-Factor Authentication
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch id="two-factor" />
                </div>
              </div>
            </FieldSet>
          </CardContent>
        </Card>

        {/* Section 6: Form Layouts */}
        <Card>
          <CardHeader>
            <CardTitle>Form Layouts</CardTitle>
            <CardDescription>
              Different form layout patterns and arrangements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Single Column */}
            <FieldSet>
              <FieldLegend>Single Column</FieldLegend>
              <div className="max-w-md space-y-4">
                <Field>
                  <FieldLabel htmlFor="single-first">First Name</FieldLabel>
                  <Input id="single-first" placeholder="John" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="single-last">Last Name</FieldLabel>
                  <Input id="single-last" placeholder="Doe" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="single-email">Email</FieldLabel>
                  <Input id="single-email" type="email" placeholder="john@example.com" />
                </Field>
              </div>
            </FieldSet>

            {/* Two Column Grid */}
            <FieldSet>
              <FieldLegend>Two Column Grid</FieldLegend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="grid-first">First Name</FieldLabel>
                  <Input id="grid-first" placeholder="John" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="grid-last">Last Name</FieldLabel>
                  <Input id="grid-last" placeholder="Doe" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="grid-email">Email</FieldLabel>
                  <Input id="grid-email" type="email" placeholder="john@example.com" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="grid-phone">Phone</FieldLabel>
                  <Input id="grid-phone" type="tel" placeholder="+1 (555) 000-0000" />
                </Field>
              </div>
            </FieldSet>

            {/* Inline Form */}
            <FieldSet>
              <FieldLegend>Inline Form</FieldLegend>
              <div className="flex flex-col sm:flex-row gap-3 items-end">
                <Field className="flex-1">
                  <FieldLabel htmlFor="inline-email">Subscribe to updates</FieldLabel>
                  <Input id="inline-email" type="email" placeholder="Enter your email" />
                </Field>
                <Button type="button" className="h-10">
                  Subscribe
                </Button>
              </div>
            </FieldSet>

            {/* Mixed Layout */}
            <FieldSet>
              <FieldLegend>Mixed Layout Example</FieldLegend>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="mixed-first">First Name</FieldLabel>
                    <Input id="mixed-first" placeholder="John" />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="mixed-last">Last Name</FieldLabel>
                    <Input id="mixed-last" placeholder="Doe" />
                  </Field>
                </div>
                <Field>
                  <FieldLabel htmlFor="mixed-address">Street Address</FieldLabel>
                  <Input id="mixed-address" placeholder="123 Main St" />
                </Field>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Field>
                    <FieldLabel htmlFor="mixed-city">City</FieldLabel>
                    <Input id="mixed-city" placeholder="New York" />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="mixed-state">State</FieldLabel>
                    <Select>
                      <SelectTrigger id="mixed-state">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ny">New York</SelectItem>
                        <SelectItem value="ca">California</SelectItem>
                        <SelectItem value="tx">Texas</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="mixed-zip">ZIP Code</FieldLabel>
                    <Input id="mixed-zip" placeholder="10001" />
                  </Field>
                </div>
              </div>
            </FieldSet>
          </CardContent>
        </Card>

        {/* Section 7: Validation States */}
        <Card>
          <CardHeader>
            <CardTitle>Validation States</CardTitle>
            <CardDescription>
              Form validation patterns and error handling
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <FieldSet>
              <FieldLegend>Error States</FieldLegend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field>
                  <FieldLabel htmlFor="error-username">Username</FieldLabel>
                  <Input
                    id="error-username"
                    placeholder="Username"
                    aria-invalid="true"
                    className="border-os-error focus:border-os-error"
                    defaultValue="ab"
                  />
                  <FieldError>Username must be at least 3 characters</FieldError>
                </Field>

                <Field>
                  <FieldLabel htmlFor="error-password">Password</FieldLabel>
                  <Input
                    id="error-password"
                    type="password"
                    placeholder="Password"
                    aria-invalid="true"
                    className="border-os-error focus:border-os-error"
                    defaultValue="123"
                  />
                  <FieldError>
                    Password must contain at least 8 characters, one uppercase, and one number
                  </FieldError>
                </Field>

                <Field>
                  <FieldLabel htmlFor="error-email">Email</FieldLabel>
                  <div className="relative">
                    <Input
                      id="error-email"
                      type="email"
                      placeholder="Email"
                      aria-invalid="true"
                      className="border-os-error focus:border-os-error pr-10"
                      defaultValue="invalid-email"
                    />
                    <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-os-error" />
                  </div>
                  <FieldError>Please enter a valid email address</FieldError>
                </Field>

                <Field>
                  <FieldLabel htmlFor="error-select">Country</FieldLabel>
                  <Select>
                    <SelectTrigger
                      id="error-select"
                      className="border-os-error focus:border-os-error"
                    >
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldError>Please select a country</FieldError>
                </Field>
              </div>
            </FieldSet>

            <FieldSet>
              <FieldLegend>Success States</FieldLegend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field>
                  <FieldLabel htmlFor="success-username">Username</FieldLabel>
                  <div className="relative">
                    <Input
                      id="success-username"
                      placeholder="Username"
                      className="border-os-success pr-10"
                      defaultValue="johndoe"
                    />
                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-os-success" />
                  </div>
                  <FieldDescription className="text-os-success">
                    Username is available
                  </FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor="success-email">Email</FieldLabel>
                  <div className="relative">
                    <Input
                      id="success-email"
                      type="email"
                      placeholder="Email"
                      className="border-os-success pr-10"
                      defaultValue="john@example.com"
                    />
                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-os-success" />
                  </div>
                  <FieldDescription className="text-os-success">
                    Email verified successfully
                  </FieldDescription>
                </Field>
              </div>
            </FieldSet>
          </CardContent>
        </Card>

        {/* Section 8: Form Improvements Comparison */}
        <FormImprovementsSection />
      </div>
    </div>
  );
}

// ============================================
// FORM IMPROVEMENTS SECTION
// ============================================

function FormImprovementsSection() {
  const [improvedText, setText] = useState("");
  const [improvedEmail, setEmail] = useState("");
  const [improvedPassword, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [improvedSelect, setSelect] = useState("");
  const [improvedCheckbox, setCheckbox] = useState(false);
  const [improvedRadio, setRadio] = useState("option1");
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  // Validation states for demo
  const isEmailValid = improvedEmail === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(improvedEmail);
  const isPasswordValid = improvedPassword.length >= 8;

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
        <CardTitle className="flex items-center gap-2">
          <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Form Improvements
          </span>
          <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-primary/10 text-primary">
            New
          </span>
        </CardTitle>
        <CardDescription>
          Side-by-side comparison of standard vs enhanced form elements with frosted glass,
          animated focus states, and improved validation feedback
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-10 pt-6">
        {/* Input Comparison */}
        <FieldSet>
          <FieldLegend className="text-lg">Text Input Comparison</FieldLegend>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Standard Input */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Standard
              </h4>
              <Field>
                <FieldLabel htmlFor="standard-input">Email Address</FieldLabel>
                <Input id="standard-input" type="email" placeholder="Enter email..." />
                <FieldDescription>Basic input styling</FieldDescription>
              </Field>
            </div>

            {/*  Input */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-primary uppercase tracking-wider">
                
              </h4>
              <Field>
                <FieldLabel htmlFor="improved-input">Email Address</FieldLabel>
                <div className="relative group">
                  <input
                    id="improved-input"
                    type="email"
                    value={improvedEmail}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email..."
                    className={cn(
                      "w-full h-10 px-4 rounded-lg bg-white/5 backdrop-blur-sm",
                      "border transition-all duration-300 ease-out",
                      "placeholder:text-muted-foreground/50",
                      "focus:outline-none focus:ring-0",
                      improvedEmail && !isEmailValid
                        ? "border-os-error/50 focus:border-os-error shadow-[0_0_0_3px_rgba(239,68,68,0.1)]"
                        : improvedEmail && isEmailValid
                          ? "border-os-success/50 focus:border-os-success shadow-[0_0_0_3px_rgba(34,197,94,0.1)]"
                          : "border-border-subtle focus:border-primary/50 focus:shadow-[0_0_20px_rgba(var(--primary-rgb),0.15)]"
                    )}
                  />
                  {/* Status Icons */}
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 transition-all duration-300">
                    {improvedEmail && isEmailValid && (
                      <CheckCircle2 className="w-5 h-5 text-os-success animate-in fade-in zoom-in duration-200" />
                    )}
                    {improvedEmail && !isEmailValid && (
                      <AlertCircle className="w-5 h-5 text-os-error animate-in fade-in zoom-in duration-200" />
                    )}
                  </div>
                  {/* Animated glow effect on focus */}
                  <div className="absolute inset-0 rounded-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 blur-xl" />
                  </div>
                </div>
                <FieldDescription
                  className={cn(
                    "transition-colors duration-300",
                    improvedEmail && !isEmailValid && "text-os-error",
                    improvedEmail && isEmailValid && "text-os-success"
                  )}
                >
                  {improvedEmail && !isEmailValid
                    ? "Please enter a valid email address"
                    : improvedEmail && isEmailValid
                      ? "Email looks good!"
                      : "Frosted glass with animated glow"}
                </FieldDescription>
              </Field>
            </div>
          </div>
        </FieldSet>

        {/* Password Input Comparison */}
        <FieldSet>
          <FieldLegend className="text-lg">Password Input Comparison</FieldLegend>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Standard Password */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Standard
              </h4>
              <Field>
                <FieldLabel htmlFor="standard-password">Password</FieldLabel>
                <InputGroup>
                  <InputGroupAddon align="inline-start">
                    <Lock className="w-4 h-4" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="standard-password"
                    type="password"
                    placeholder="Enter password"
                  />
                </InputGroup>
                <FieldDescription>Standard password field</FieldDescription>
              </Field>
            </div>

            {/*  Password */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-primary uppercase tracking-wider">
                
              </h4>
              <Field>
                <FieldLabel htmlFor="improved-password">Password</FieldLabel>
                <div className="relative group">
                  <div
                    className={cn(
                      "flex items-center h-10 rounded-lg bg-white/5 backdrop-blur-sm",
                      "border transition-all duration-300 ease-out",
                      "focus-within:border-primary/50 focus-within:shadow-[0_0_20px_rgba(var(--primary-rgb),0.15)]"
                    )}
                  >
                    <div className="pl-3 text-muted-foreground">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="improved-password"
                      type={showPassword ? "text" : "password"}
                      value={improvedPassword}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="flex-1 h-full px-3 bg-transparent border-none outline-none placeholder:text-muted-foreground/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="pr-3 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {/* Strength indicator */}
                  {improvedPassword && (
                    <div className="mt-2 flex gap-1 animate-in slide-in-from-top-1 duration-200">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={cn(
                            "h-1 flex-1 rounded-full transition-all duration-300",
                            improvedPassword.length >= i * 2
                              ? improvedPassword.length >= 8
                                ? "bg-os-success"
                                : "bg-os-warning"
                              : "bg-border-subtle"
                          )}
                        />
                      ))}
                    </div>
                  )}
                </div>
                <FieldDescription
                  className={cn(
                    "transition-colors duration-300",
                    improvedPassword.length > 0 &&
                      improvedPassword.length < 8 &&
                      "text-os-warning",
                    improvedPassword.length >= 8 && "text-os-success"
                  )}
                >
                  {improvedPassword.length > 0 && improvedPassword.length < 8
                    ? "Password must be at least 8 characters"
                    : improvedPassword.length >= 8
                      ? "Strong password!"
                      : "With strength indicator and toggle"}
                </FieldDescription>
              </Field>
            </div>
          </div>
        </FieldSet>

        {/* Select Dropdown Comparison */}
        <FieldSet>
          <FieldLegend className="text-lg">Select Dropdown Comparison</FieldLegend>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Standard Select */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Standard
              </h4>
              <Field>
                <FieldLabel>Blockchain Network</FieldLabel>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select network..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ethereum">Ethereum</SelectItem>
                    <SelectItem value="polygon">Polygon</SelectItem>
                    <SelectItem value="solana">Solana</SelectItem>
                    <SelectItem value="arbitrum">Arbitrum</SelectItem>
                  </SelectContent>
                </Select>
                <FieldDescription>Default select styling</FieldDescription>
              </Field>
            </div>

            {/*  Select */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-primary uppercase tracking-wider">
                
              </h4>
              <Field>
                <FieldLabel>Blockchain Network</FieldLabel>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsSelectOpen(!isSelectOpen)}
                    className={cn(
                      "w-full h-10 px-4 rounded-lg bg-white/5 backdrop-blur-sm",
                      "border transition-all duration-300 ease-out",
                      "flex items-center justify-between",
                      "hover:bg-white/10",
                      isSelectOpen
                        ? "border-primary/50 shadow-[0_0_20px_rgba(var(--primary-rgb),0.15)]"
                        : "border-border-subtle"
                    )}
                  >
                    <span
                      className={improvedSelect ? "text-foreground" : "text-muted-foreground/50"}
                    >
                      {improvedSelect || "Select network..."}
                    </span>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 text-muted-foreground transition-transform duration-300",
                        isSelectOpen && "rotate-180"
                      )}
                    />
                  </button>

                  {/* Custom Dropdown */}
                  {isSelectOpen && (
                    <div className="absolute z-50 w-full mt-2 rounded-lg bg-frosted-2 backdrop-blur-xl border border-border-subtle shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                      <div className="p-1">
                        {["Ethereum", "Polygon", "Solana", "Arbitrum"].map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => {
                              setSelect(option);
                              setIsSelectOpen(false);
                            }}
                            className={cn(
                              "w-full px-3 py-2 text-left rounded-md text-sm transition-all duration-200",
                              "hover:bg-primary/10 hover:text-primary",
                              improvedSelect === option && "bg-primary/10 text-primary"
                            )}
                          >
                            <div className="flex items-center justify-between">
                              {option}
                              {improvedSelect === option && (
                                <CheckCircle2 className="w-4 h-4" />
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <FieldDescription>Frosted glass dropdown with animations</FieldDescription>
              </Field>
            </div>
          </div>
        </FieldSet>

        {/* Checkbox Comparison */}
        <FieldSet>
          <FieldLegend className="text-lg">Checkbox Comparison</FieldLegend>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Standard Checkbox */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Standard
              </h4>
              <div className="flex items-start gap-3">
                <Checkbox id="standard-check" />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor="standard-check"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Accept terms and conditions
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    You agree to our Terms of Service
                  </p>
                </div>
              </div>
            </div>

            {/*  Checkbox */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-primary uppercase tracking-wider">
                
              </h4>
              <label className="flex items-start gap-4 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={improvedCheckbox}
                    onChange={(e) => setCheckbox(e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className={cn(
                      "w-6 h-6 rounded-lg border-2 transition-all duration-300 ease-out",
                      "flex items-center justify-center",
                      improvedCheckbox
                        ? "bg-primary border-primary shadow-[0_0_12px_rgba(var(--primary-rgb),0.4)]"
                        : "bg-white/5 border-border-subtle group-hover:border-primary/30"
                    )}
                  >
                    {improvedCheckbox && (
                      <svg
                        className="w-4 h-4 text-primary-foreground animate-in zoom-in duration-200"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  {/* Glow effect */}
                  {improvedCheckbox && (
                    <div className="absolute inset-0 rounded-lg bg-primary/30 blur-md -z-10 animate-pulse" />
                  )}
                </div>
                <div className="grid gap-1 leading-none">
                  <span
                    className={cn(
                      "text-sm font-medium transition-colors duration-300",
                      improvedCheckbox ? "text-primary" : "text-foreground"
                    )}
                  >
                    Accept terms and conditions
                  </span>
                  <p className="text-sm text-muted-foreground">
                    You agree to our Terms of Service
                  </p>
                </div>
              </label>
            </div>
          </div>
        </FieldSet>

        {/* Radio Button Comparison */}
        <FieldSet>
          <FieldLegend className="text-lg">Radio Button Comparison</FieldLegend>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Standard Radio */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Standard
              </h4>
              <RadioGroup defaultValue="option1" className="gap-3">
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="option1" id="radio-standard-1" />
                  <Label htmlFor="radio-standard-1">Standard Shipping</Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="option2" id="radio-standard-2" />
                  <Label htmlFor="radio-standard-2">Express Shipping</Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="option3" id="radio-standard-3" />
                  <Label htmlFor="radio-standard-3">Overnight Shipping</Label>
                </div>
              </RadioGroup>
            </div>

            {/*  Radio */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-primary uppercase tracking-wider">
                
              </h4>
              <div className="space-y-2">
                {[
                  { value: "option1", label: "Standard Shipping", desc: "3-5 business days" },
                  { value: "option2", label: "Express Shipping", desc: "1-2 business days" },
                  { value: "option3", label: "Overnight Shipping", desc: "Next day delivery" },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={cn(
                      "flex items-center gap-4 p-3 rounded-xl cursor-pointer",
                      "border transition-all duration-300 ease-out",
                      "hover:bg-white/5",
                      improvedRadio === option.value
                        ? "border-primary/50 bg-primary/5 shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)]"
                        : "border-border-subtle"
                    )}
                  >
                    <div className="relative">
                      <input
                        type="radio"
                        name="improved-radio"
                        value={option.value}
                        checked={improvedRadio === option.value}
                        onChange={(e) => setRadio(e.target.value)}
                        className="sr-only"
                      />
                      <div
                        className={cn(
                          "w-5 h-5 rounded-full border-2 transition-all duration-300",
                          "flex items-center justify-center",
                          improvedRadio === option.value
                            ? "border-primary"
                            : "border-os-gray-300 group-hover:border-primary/50"
                        )}
                      >
                        {improvedRadio === option.value && (
                          <div className="w-2.5 h-2.5 rounded-full bg-primary animate-in zoom-in duration-200" />
                        )}
                      </div>
                      {/* Glow effect */}
                      {improvedRadio === option.value && (
                        <div className="absolute inset-0 rounded-full bg-primary/30 blur-md -z-10" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div
                        className={cn(
                          "font-medium transition-colors duration-300",
                          improvedRadio === option.value
                            ? "text-primary"
                            : "text-foreground"
                        )}
                      >
                        {option.label}
                      </div>
                      <div className="text-sm text-muted-foreground">{option.desc}</div>
                    </div>
                    {improvedRadio === option.value && (
                      <CheckCircle2 className="w-5 h-5 text-primary animate-in fade-in duration-200" />
                    )}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </FieldSet>

        {/* Summary */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border border-primary/20">
          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Improvements Summary
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: "✨", title: "Frosted Glass", desc: "Backdrop blur with subtle transparency" },
              { icon: "🎨", title: "Animated Focus", desc: "Smooth glow effects on focus" },
              { icon: "✓", title: "Status Icons", desc: "Visual feedback for validation" },
              { icon: "↔", title: "Transitions", desc: "Smooth state changes" },
              { icon: "▼", title: "Custom Select", desc: "Enhanced dropdown styling" },
              { icon: "◉", title: "Better Controls", desc: " checkbox/radio styling" },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-3 p-3 rounded-xl bg-background/50 backdrop-blur-sm"
              >
                <span className="text-lg">{item.icon}</span>
                <div>
                  <div className="font-medium text-sm">{item.title}</div>
                  <div className="text-xs text-muted-foreground">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
