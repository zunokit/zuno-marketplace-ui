"use client";

import * as React from "react";
import Link from "next/link";
import { Badge } from "@/shared/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/ui/accordion";
import {
  ArrowLeft,
  LayoutGrid,
  List,
  Settings,
  User,
  CreditCard,
  Bell,
  Shield,
  Palette,
  Globe,
  Wallet,
  ImageIcon,
  BarChart3,
  Heart,
  Share2,
  ExternalLink,
  Copy,
  Check,
  Info,
  AlertCircle,
  Sparkles,
  Zap,
  TrendingUp,
  Users,
  Clock,
  MoreHorizontal,
} from "lucide-react";

// ============================================
// TABS & ACCORDION DEBUG PAGE
// ============================================

export default function TabsAccordionDebugPage() {
  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      {/* Page Header */}
      <div className="mx-auto max-w-6xl space-y-2 mb-10">
        <div className="flex items-center gap-2 mb-2">
          <Link
            href="/debug"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Debug
          </Link>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Tabs & Accordion Debug
        </h1>
        <p className="text-muted-foreground">
          Comprehensive showcase of tab and accordion variants, animations, and patterns.
        </p>
      </div>

      <div className="mx-auto max-w-6xl space-y-12">
        {/* Section 1: Tabs Variants */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-foreground">Tabs Variants</h2>
            <Badge variant="secondary">3 variants</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Core tab styles for different navigation patterns and use cases.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Default Tabs */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Default</p>
              <Tabs defaultValue="account" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="account">Account</TabsTrigger>
                  <TabsTrigger value="password">Password</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="account" className="mt-4 p-4 rounded-lg bg-card border border-border">
                  <p className="text-sm text-muted-foreground">Account settings content here.</p>
                </TabsContent>
                <TabsContent value="password" className="mt-4 p-4 rounded-lg bg-card border border-border">
                  <p className="text-sm text-muted-foreground">Password settings content here.</p>
                </TabsContent>
                <TabsContent value="settings" className="mt-4 p-4 rounded-lg bg-card border border-border">
                  <p className="text-sm text-muted-foreground">General settings content here.</p>
                </TabsContent>
              </Tabs>
            </div>

            {/* Pills Tabs */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Pills</p>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-transparent p-0 gap-1">
                  <TabsTrigger
                    value="overview"
                    className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Overview
                  </TabsTrigger>
                  <TabsTrigger
                    value="analytics"
                    className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Analytics
                  </TabsTrigger>
                  <TabsTrigger
                    value="reports"
                    className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Reports
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="mt-4 p-4 rounded-lg bg-card border border-border">
                  <p className="text-sm text-muted-foreground">Overview content with pills style.</p>
                </TabsContent>
                <TabsContent value="analytics" className="mt-4 p-4 rounded-lg bg-card border border-border">
                  <p className="text-sm text-muted-foreground">Analytics content with pills style.</p>
                </TabsContent>
                <TabsContent value="reports" className="mt-4 p-4 rounded-lg bg-card border border-border">
                  <p className="text-sm text-muted-foreground">Reports content with pills style.</p>
                </TabsContent>
              </Tabs>
            </div>

            {/* Underline Tabs */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Underline</p>
              <Tabs defaultValue="active" className="w-full">
                <TabsList className="w-full bg-transparent border-b border-border rounded-none p-0 h-auto gap-6">
                  <TabsTrigger
                    value="active"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-2"
                  >
                    Active
                  </TabsTrigger>
                  <TabsTrigger
                    value="pending"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-2"
                  >
                    Pending
                  </TabsTrigger>
                  <TabsTrigger
                    value="completed"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-2"
                  >
                    Completed
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="active" className="mt-4 p-4 rounded-lg bg-card border border-border">
                  <p className="text-sm text-muted-foreground">Active items content.</p>
                </TabsContent>
                <TabsContent value="pending" className="mt-4 p-4 rounded-lg bg-card border border-border">
                  <p className="text-sm text-muted-foreground">Pending items content.</p>
                </TabsContent>
                <TabsContent value="completed" className="mt-4 p-4 rounded-lg bg-card border border-border">
                  <p className="text-sm text-muted-foreground">Completed items content.</p>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>

        {/* Section 2: Tabs with Icons */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-foreground">Tabs with Icons</h2>
            <Badge variant="secondary">Icon combinations</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Tabs enhanced with icons for better visual recognition and UX.
          </p>

          <div className="space-y-6">
            {/* Icons with Text */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Icons with Text</p>
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-4 lg:grid-cols-5">
                  <TabsTrigger value="profile">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </TabsTrigger>
                  <TabsTrigger value="wallet">
                    <Wallet className="w-4 h-4 mr-2" />
                    Wallet
                  </TabsTrigger>
                  <TabsTrigger value="notifications">
                    <Bell className="w-4 h-4 mr-2" />
                    Notifications
                  </TabsTrigger>
                  <TabsTrigger value="security">
                    <Shield className="w-4 h-4 mr-2" />
                    Security
                  </TabsTrigger>
                  <TabsTrigger value="billing" className="hidden lg:flex">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Billing
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="profile" className="mt-4 p-4 rounded-lg bg-card border border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Profile Settings</p>
                      <p className="text-sm text-muted-foreground">Manage your profile information.</p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="wallet" className="mt-4 p-4 rounded-lg bg-card border border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-os-success/20 flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-os-success" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Wallet Connection</p>
                      <p className="text-sm text-muted-foreground">Connect and manage wallets.</p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="notifications" className="mt-4 p-4 rounded-lg bg-card border border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-os-warning/20 flex items-center justify-center">
                      <Bell className="w-5 h-5 text-os-warning" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Notification Preferences</p>
                      <p className="text-sm text-muted-foreground">Customize your notifications.</p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="security" className="mt-4 p-4 rounded-lg bg-card border border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-os-info/20 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-os-info" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Security Settings</p>
                      <p className="text-sm text-muted-foreground">Two-factor auth and more.</p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="billing" className="mt-4 p-4 rounded-lg bg-card border border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-os-error/20 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-os-error" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Billing Information</p>
                      <p className="text-sm text-muted-foreground">Manage payment methods.</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Icon Only (Compact) */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Icon Only (Compact)</p>
              <Tabs defaultValue="grid">
                <TabsList>
                  <TabsTrigger value="grid">
                    <LayoutGrid className="w-4 h-4" />
                  </TabsTrigger>
                  <TabsTrigger value="list">
                    <List className="w-4 h-4" />
                  </TabsTrigger>
                  <TabsTrigger value="settings">
                    <Settings className="w-4 h-4" />
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="grid" className="mt-4">
                  <div className="p-8 rounded-lg bg-card border border-border flex items-center justify-center">
                    <LayoutGrid className="w-12 h-12 text-muted-foreground" />
                  </div>
                </TabsContent>
                <TabsContent value="list" className="mt-4">
                  <div className="p-8 rounded-lg bg-card border border-border flex items-center justify-center">
                    <List className="w-12 h-12 text-muted-foreground" />
                  </div>
                </TabsContent>
                <TabsContent value="settings" className="mt-4">
                  <div className="p-8 rounded-lg bg-card border border-border flex items-center justify-center">
                    <Settings className="w-12 h-12 text-muted-foreground" />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>

        {/* Section 3: Vertical Tabs */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-foreground">Vertical Tabs</h2>
            <Badge variant="secondary">Side navigation</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Vertical tab layout ideal for settings pages and complex configurations.
          </p>

          <Tabs defaultValue="general" orientation="vertical" className="flex gap-6">
            <TabsList className="flex-col h-auto w-48 bg-transparent gap-1">
              <TabsTrigger
                value="general"
                className="w-full justify-start data-[state=active]:bg-os-gray-400"
              >
                <Settings className="w-4 h-4 mr-2" />
                General
              </TabsTrigger>
              <TabsTrigger
                value="appearance"
                className="w-full justify-start data-[state=active]:bg-os-gray-400"
              >
                <Palette className="w-4 h-4 mr-2" />
                Appearance
              </TabsTrigger>
              <TabsTrigger
                value="language"
                className="w-full justify-start data-[state=active]:bg-os-gray-400"
              >
                <Globe className="w-4 h-4 mr-2" />
                Language
              </TabsTrigger>
              <TabsTrigger
                value="nft"
                className="w-full justify-start data-[state=active]:bg-os-gray-400"
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                NFT Display
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="w-full justify-start data-[state=active]:bg-os-gray-400"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </TabsTrigger>
            </TabsList>
            <div className="flex-1">
              <TabsContent value="general" className="mt-0">
                <div className="p-6 rounded-lg bg-card border border-border space-y-4">
                  <h3 className="font-medium text-foreground">General Settings</h3>
                  <p className="text-sm text-muted-foreground">
                    Configure your general account preferences. These settings apply across all devices.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-os-gray-400/50">
                      <span className="text-sm">Auto-save changes</span>
                      <Check className="w-4 h-4 text-os-success" />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-os-gray-400/50">
                      <span className="text-sm">Show notifications</span>
                      <Check className="w-4 h-4 text-os-success" />
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="appearance" className="mt-0">
                <div className="p-6 rounded-lg bg-card border border-border space-y-4">
                  <h3 className="font-medium text-foreground">Appearance</h3>
                  <p className="text-sm text-muted-foreground">
                    Customize the look and feel of your interface.
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-lg bg-os-gray-400 border border-primary text-center">
                      <div className="w-8 h-8 mx-auto mb-2 rounded bg-background" />
                      <span className="text-xs">Dark</span>
                    </div>
                    <div className="p-3 rounded-lg bg-os-gray-400/50 text-center opacity-60">
                      <div className="w-8 h-8 mx-auto mb-2 rounded bg-white" />
                      <span className="text-xs">Light</span>
                    </div>
                    <div className="p-3 rounded-lg bg-os-gray-400/50 text-center opacity-60">
                      <div className="w-8 h-8 mx-auto mb-2 rounded bg-gradient-to-br from-white to-gray-800" />
                      <span className="text-xs">Auto</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="language" className="mt-0">
                <div className="p-6 rounded-lg bg-card border border-border space-y-4">
                  <h3 className="font-medium text-foreground">Language & Region</h3>
                  <p className="text-sm text-muted-foreground">
                    Select your preferred language and regional settings.
                  </p>
                  <div className="space-y-2">
                    {["English (US)", "Spanish", "French", "German"].map((lang) => (
                      <div
                        key={lang}
                        className="flex items-center justify-between p-3 rounded-lg bg-os-gray-400/50"
                      >
                        <span className="text-sm">{lang}</span>
                        {lang === "English (US)" && <Check className="w-4 h-4 text-primary" />}
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="nft" className="mt-0">
                <div className="p-6 rounded-lg bg-card border border-border space-y-4">
                  <h3 className="font-medium text-foreground">NFT Display Settings</h3>
                  <p className="text-sm text-muted-foreground">
                    Configure how NFTs are displayed in your collection.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="analytics" className="mt-0">
                <div className="p-6 rounded-lg bg-card border border-border space-y-4">
                  <h3 className="font-medium text-foreground">Analytics Preferences</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage your analytics and data tracking preferences.
                  </p>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </section>

        {/* Section 4: Accordion Single */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-foreground">Accordion Single</h2>
            <Badge variant="secondary">One item at a time</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Single-expand accordion where only one item can be open at a time.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>What is an NFT?</AccordionTrigger>
                <AccordionContent>
                  An NFT (Non-Fungible Token) is a unique digital identifier that cannot be copied,
                  substituted, or subdivided, that is recorded in a blockchain, and that is used to
                  certify authenticity and ownership.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>How do I buy an NFT?</AccordionTrigger>
                <AccordionContent>
                  To buy an NFT, you need a digital wallet and cryptocurrency. Connect your wallet,
                  browse the marketplace, and place a bid or buy instantly at the listed price.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>What wallets are supported?</AccordionTrigger>
                <AccordionContent>
                  We support MetaMask, WalletConnect, Coinbase Wallet, and other major Ethereum-compatible
                  wallets. Make sure your wallet is connected to the correct network.
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* NFT-Specific FAQ */}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="fees-1">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-os-info" />
                    What are the platform fees?
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <p>Our fee structure is transparent:</p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                      <li>2.5% marketplace fee on sales</li>
                      <li>Creator royalties (set by collection)</li>
                      <li>Gas fees (network dependent)</li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="fees-2">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-os-warning" />
                    Are there any gas fees?
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  Gas fees are determined by the blockchain network (Ethereum, Polygon, etc.) and vary
                  based on network congestion. We do not control or receive gas fees.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="fees-3">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-os-success" />
                    How do royalties work?
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  Creators can set royalties up to 10% on their collections. Every time an NFT is resold,
                  the creator automatically receives their royalty percentage.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* Section 5: Accordion Multiple */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-foreground">Accordion Multiple</h2>
            <Badge variant="secondary">Multiple items open</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Multi-expand accordion allowing multiple items to be open simultaneously.
          </p>

          <Accordion type="multiple" className="w-full">
            <AccordionItem value="collection-1">
              <AccordionTrigger>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500" />
                  <div className="text-left">
                    <p className="font-medium">CryptoPunks</p>
                    <p className="text-xs text-muted-foreground font-normal">10,000 items</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 gap-4 py-2">
                  <div className="p-3 rounded-lg bg-os-gray-400/50">
                    <p className="text-xs text-muted-foreground">Floor Price</p>
                    <p className="font-medium">64.5 ETH</p>
                  </div>
                  <div className="p-3 rounded-lg bg-os-gray-400/50">
                    <p className="text-xs text-muted-foreground">Volume</p>
                    <p className="font-medium">1.2M ETH</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="collection-2">
              <AccordionTrigger>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500" />
                  <div className="text-left">
                    <p className="font-medium">Bored Ape Yacht Club</p>
                    <p className="text-xs text-muted-foreground font-normal">9,999 items</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 gap-4 py-2">
                  <div className="p-3 rounded-lg bg-os-gray-400/50">
                    <p className="text-xs text-muted-foreground">Floor Price</p>
                    <p className="font-medium">28.2 ETH</p>
                  </div>
                  <div className="p-3 rounded-lg bg-os-gray-400/50">
                    <p className="text-xs text-muted-foreground">Volume</p>
                    <p className="font-medium">890K ETH</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="collection-3">
              <AccordionTrigger>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500" />
                  <div className="text-left">
                    <p className="font-medium">Azuki</p>
                    <p className="text-xs text-muted-foreground font-normal">10,000 items</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 gap-4 py-2">
                  <div className="p-3 rounded-lg bg-os-gray-400/50">
                    <p className="text-xs text-muted-foreground">Floor Price</p>
                    <p className="font-medium">5.8 ETH</p>
                  </div>
                  <div className="p-3 rounded-lg bg-os-gray-400/50">
                    <p className="text-xs text-muted-foreground">Volume</p>
                    <p className="font-medium">456K ETH</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Section 6: Accordion with Rich Content */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-foreground">Accordion with Rich Content</h2>
            <Badge variant="secondary">Complex layouts</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Accordions containing rich content like cards, stats, and interactive elements.
          </p>

          <Accordion type="single" collapsible className="w-full">
            {/* NFT Details Accordion */}
            <AccordionItem value="nft-details">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  NFT Details
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 py-2">
                  {/* NFT Card Preview */}
                  <div className="p-4 rounded-lg bg-os-gray-400/30 border border-border">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <h4 className="font-medium">Cosmic Explorer #1337</h4>
                        <p className="text-sm text-muted-foreground">
                          A rare cosmic explorer from the Galactic Voyagers collection.
                          Features unique traits including Nebula Background and Quantum Armor.
                        </p>
                        <div className="flex gap-2">
                          <Badge variant="secondary">Legendary</Badge>
                          <Badge variant="outline">#1337</Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Properties Grid */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "Background", value: "Nebula", rarity: "5%" },
                      { label: "Armor", value: "Quantum", rarity: "12%" },
                      { label: "Helmet", value: "Void", rarity: "8%" },
                      { label: "Weapon", value: "Plasma", rarity: "15%" },
                      { label: "Accessory", value: "Cloak", rarity: "20%" },
                      { label: "Eyes", value: "Glow", rarity: "25%" },
                    ].map((prop) => (
                      <div
                        key={prop.label}
                        className="p-3 rounded-lg bg-os-gray-400/30 text-center"
                      >
                        <p className="text-xs text-muted-foreground uppercase">{prop.label}</p>
                        <p className="font-medium text-sm">{prop.value}</p>
                        <p className="text-xs text-os-success">{prop.rarity} have this</p>
                      </div>
                    ))}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Activity History */}
            <AccordionItem value="activity">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-os-info" />
                  Activity History
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 py-2">
                  {[
                    { action: "Listed", price: "2.5 ETH", time: "2 hours ago", icon: TrendingUp },
                    { action: "Transfer", price: "—", time: "5 days ago", icon: Users },
                    { action: "Sale", price: "1.8 ETH", time: "2 weeks ago", icon: Zap },
                    { action: "Minted", price: "0.08 ETH", time: "1 year ago", icon: Sparkles },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-lg bg-os-gray-400/30"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-os-gray-400 flex items-center justify-center">
                          <item.icon className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{item.action}</p>
                          <p className="text-xs text-muted-foreground">{item.time}</p>
                        </div>
                      </div>
                      <span className="font-medium text-sm">{item.price}</span>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Offers */}
            <AccordionItem value="offers">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-os-warning" />
                  Current Offers
                  <Badge variant="secondary" className="ml-2">3</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 py-2">
                  {[
                    { user: "0x7a23...9f4a", offer: "2.3 ETH", expires: "2 hours", status: "active" },
                    { user: "0x3b45...1c8d", offer: "2.1 ETH", expires: "1 day", status: "active" },
                    { user: "0x9c12...4e7b", offer: "1.9 ETH", expires: "3 days", status: "active" },
                  ].map((offer, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-lg bg-os-gray-400/30"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-600" />
                        <div>
                          <p className="font-medium text-sm">{offer.user}</p>
                          <p className="text-xs text-muted-foreground">Expires in {offer.expires}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{offer.offer}</span>
                        <button className="p-1.5 rounded-md bg-os-success/20 text-os-success hover:bg-os-success/30 transition-colors">
                          <Check className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Actions */}
            <AccordionItem value="actions">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                  Quick Actions
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 gap-2 py-2">
                  <button className="flex items-center gap-2 p-3 rounded-lg bg-os-gray-400/30 hover:bg-os-gray-400/50 transition-colors text-left">
                    <Heart className="w-4 h-4 text-os-error" />
                    <span className="text-sm">Add to Favorites</span>
                  </button>
                  <button className="flex items-center gap-2 p-3 rounded-lg bg-os-gray-400/30 hover:bg-os-gray-400/50 transition-colors text-left">
                    <Share2 className="w-4 h-4 text-os-info" />
                    <span className="text-sm">Share</span>
                  </button>
                  <button className="flex items-center gap-2 p-3 rounded-lg bg-os-gray-400/30 hover:bg-os-gray-400/50 transition-colors text-left">
                    <ExternalLink className="w-4 h-4 text-os-success" />
                    <span className="text-sm">View on Etherscan</span>
                  </button>
                  <button className="flex items-center gap-2 p-3 rounded-lg bg-os-gray-400/30 hover:bg-os-gray-400/50 transition-colors text-left">
                    <Copy className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Copy Token ID</span>
                  </button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Section 7: Combined Tabs + Accordion */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-foreground">Combined Pattern</h2>
            <Badge variant="secondary">Tabs + Accordion</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Using tabs for top-level navigation and accordions for expandable content within each section.
          </p>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-4">
              <Accordion type="single" collapsible defaultValue="about">
                <AccordionItem value="about">
                  <AccordionTrigger>About This Collection</AccordionTrigger>
                  <AccordionContent>
                    This is a premium NFT collection featuring unique digital art pieces.
                    Each NFT is one-of-a-kind and stored on the Ethereum blockchain.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="stats">
                  <AccordionTrigger>Collection Statistics</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 rounded-lg bg-card">
                        <p className="text-xs text-muted-foreground">Items</p>
                        <p className="font-medium">10,000</p>
                      </div>
                      <div className="p-3 rounded-lg bg-card">
                        <p className="text-xs text-muted-foreground">Owners</p>
                        <p className="font-medium">5,420</p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>

            <TabsContent value="details" className="mt-4">
              <Accordion type="single" collapsible>
                <AccordionItem value="traits">
                  <AccordionTrigger>Traits & Attributes</AccordionTrigger>
                  <AccordionContent>
                    View all the unique traits and attributes that make this NFT special.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="contract">
                  <AccordionTrigger>Contract Details</AccordionTrigger>
                  <AccordionContent>
                    Contract address, token standard (ERC-721), and blockchain information.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>

            <TabsContent value="history" className="mt-4">
              <Accordion type="multiple">
                <AccordionItem value="transfers">
                  <AccordionTrigger>Transfer History</AccordionTrigger>
                  <AccordionContent>
                    Complete history of all transfers and ownership changes.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="sales">
                  <AccordionTrigger>Sales History</AccordionTrigger>
                  <AccordionContent>
                    Record of all sales including prices and timestamps.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="bids">
                  <AccordionTrigger>Bid History</AccordionTrigger>
                  <AccordionContent>
                    Historical bids placed on this NFT.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>
          </Tabs>
        </section>

        {/* Info Section */}
        <div className="mt-10 p-4 rounded-lg bg-frosted-1 border border-border-subtle">
          <h4 className="text-sm font-medium text-foreground mb-2">
            About Tabs & Accordion Components
          </h4>
          <p className="text-sm text-muted-foreground">
            Tabs and accordions are essential navigation and content organization components.
            Tabs are ideal for switching between related content sections at the same level of hierarchy,
            while accordions excel at progressive disclosure of detailed information.
            Both components feature smooth animations, frosted glass effects, and full keyboard accessibility.
          </p>
        </div>
      </div>
    </div>
  );
}
