"use client";

import * as React from "react";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Switch } from "@/shared/components/ui/switch";
import { Label } from "@/shared/components/ui/label";
import { Badge } from "@/shared/components/ui/badge";
import { ArrowLeft, Check, Minus } from "lucide-react";
import Link from "next/link";

// ============================================
// DEBUG PAGE - Checkbox & Switch Components
// ============================================

export default function CheckboxSwitchDebugPage() {
  // Indeterminate checkbox state
  const [indeterminateChecked, setIndeterminateChecked] = React.useState(false);
  const [indeterminateState, setIndeterminateState] = React.useState<"checked" | "unchecked" | "indeterminate">("indeterminate");

  // Checkbox group state
  const [selectedItems, setSelectedItems] = React.useState<string[]>(["item-1"]);

  const toggleItem = (item: string) => {
    setSelectedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleIndeterminateClick = () => {
    if (indeterminateState === "unchecked") {
      setIndeterminateState("checked");
      setIndeterminateChecked(true);
    } else if (indeterminateState === "checked") {
      setIndeterminateState("indeterminate");
      setIndeterminateChecked(false);
    } else {
      setIndeterminateState("unchecked");
      setIndeterminateChecked(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      {/* Page Header */}
      <div className="mx-auto max-w-5xl space-y-2 mb-10">
        <Link
          href="/debug"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Debug Dashboard
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Checkbox & Switch
          </h1>
          <Badge variant="secondary">Components</Badge>
        </div>
        <p className="text-muted-foreground">
          Interactive checkbox and switch component variants with frosted glass styling
        </p>
      </div>

      <div className="mx-auto max-w-5xl space-y-8">
        {/* Single Checkbox Section */}
        <section className="space-y-4">
          <h2 className="text-lg font-medium text-foreground">Single Checkbox</h2>
          <div className="p-6 rounded-lg bg-frosted-1 border border-border-subtle space-y-6">
            {/* Default */}
            <div className="flex items-center space-x-3">
              <Checkbox id="single-default" />
              <Label htmlFor="single-default" className="text-sm font-normal cursor-pointer">
                Default checkbox
              </Label>
            </div>

            {/* Checked */}
            <div className="flex items-center space-x-3">
              <Checkbox id="single-checked" defaultChecked />
              <Label htmlFor="single-checked" className="text-sm font-normal cursor-pointer">
                Checked by default
              </Label>
            </div>

            {/* Disabled Unchecked */}
            <div className="flex items-center space-x-3">
              <Checkbox id="single-disabled" disabled />
              <Label htmlFor="single-disabled" className="text-sm font-normal text-muted-foreground cursor-not-allowed">
                Disabled unchecked
              </Label>
            </div>

            {/* Disabled Checked */}
            <div className="flex items-center space-x-3">
              <Checkbox id="single-disabled-checked" disabled defaultChecked />
              <Label htmlFor="single-disabled-checked" className="text-sm font-normal text-muted-foreground cursor-not-allowed">
                Disabled checked
              </Label>
            </div>
          </div>
        </section>

        {/* Checkbox Group Section */}
        <section className="space-y-4">
          <h2 className="text-lg font-medium text-foreground">Checkbox Groups</h2>

          {/* Vertical Group */}
          <div className="p-6 rounded-lg bg-frosted-1 border border-border-subtle">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">Vertical Layout</h3>
            <div className="space-y-3">
              {["item-1", "item-2", "item-3"].map((item, index) => (
                <div key={item} className="flex items-center space-x-3">
                  <Checkbox
                    id={`vertical-${item}`}
                    checked={selectedItems.includes(item)}
                    onCheckedChange={() => toggleItem(item)}
                  />
                  <Label htmlFor={`vertical-${item}`} className="text-sm font-normal cursor-pointer">
                    Option {index + 1}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Horizontal Group */}
          <div className="p-6 rounded-lg bg-frosted-1 border border-border-subtle">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">Horizontal Layout</h3>
            <div className="flex flex-wrap gap-6">
              {["horizontal-1", "horizontal-2", "horizontal-3"].map((item, index) => (
                <div key={item} className="flex items-center space-x-3">
                  <Checkbox id={item} defaultChecked={index === 0} />
                  <Label htmlFor={item} className="text-sm font-normal cursor-pointer">
                    Option {index + 1}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Indeterminate Checkbox Section */}
        <section className="space-y-4">
          <h2 className="text-lg font-medium text-foreground">Indeterminate State</h2>
          <div className="p-6 rounded-lg bg-frosted-1 border border-border-subtle space-y-4">
            <p className="text-sm text-muted-foreground">
              Click the checkbox to cycle through states: unchecked → checked → indeterminate
            </p>
            <div className="flex items-center space-x-3">
              <Checkbox
                id="indeterminate"
                checked={indeterminateChecked}
                data-state={indeterminateState === "indeterminate" ? "indeterminate" : indeterminateChecked ? "checked" : "unchecked"}
                onClick={handleIndeterminateClick}
                aria-label={`Current state: ${indeterminateState}`}
              />
              <Label htmlFor="indeterminate" className="text-sm font-normal cursor-pointer">
                Current state: <span className="text-os-info capitalize">{indeterminateState}</span>
              </Label>
            </div>
            <div className="flex gap-2">
              <Badge variant={indeterminateState === "unchecked" ? "default" : "outline"}>
                Unchecked
              </Badge>
              <Badge variant={indeterminateState === "checked" ? "default" : "outline"}>
                Checked
              </Badge>
              <Badge variant={indeterminateState === "indeterminate" ? "default" : "outline"}>
                Indeterminate
              </Badge>
            </div>
          </div>
        </section>

        {/* Switch Section */}
        <section className="space-y-4">
          <h2 className="text-lg font-medium text-foreground">Switch Components</h2>

          {/* Default States */}
          <div className="p-6 rounded-lg bg-frosted-1 border border-border-subtle space-y-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">Default States</h3>

            <div className="flex items-center justify-between max-w-xs">
              <Label htmlFor="switch-default" className="text-sm font-normal cursor-pointer">
                Default (off)
              </Label>
              <Switch id="switch-default" />
            </div>

            <div className="flex items-center justify-between max-w-xs">
              <Label htmlFor="switch-checked" className="text-sm font-normal cursor-pointer">
                Checked (on)
              </Label>
              <Switch id="switch-checked" defaultChecked />
            </div>

            <div className="flex items-center justify-between max-w-xs">
              <Label htmlFor="switch-disabled" className="text-sm font-normal text-muted-foreground cursor-not-allowed">
                Disabled off
              </Label>
              <Switch id="switch-disabled" disabled />
            </div>

            <div className="flex items-center justify-between max-w-xs">
              <Label htmlFor="switch-disabled-checked" className="text-sm font-normal text-muted-foreground cursor-not-allowed">
                Disabled on
              </Label>
              <Switch id="switch-disabled-checked" disabled defaultChecked />
            </div>
          </div>

          {/* Switch Sizes */}
          <div className="p-6 rounded-lg bg-frosted-1 border border-border-subtle space-y-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">Sizes</h3>

            <div className="flex items-center justify-between max-w-xs">
              <Label htmlFor="switch-sm" className="text-sm font-normal cursor-pointer">
                Small
              </Label>
              <Switch id="switch-sm" size="sm" />
            </div>

            <div className="flex items-center justify-between max-w-xs">
              <Label htmlFor="switch-default-size" className="text-sm font-normal cursor-pointer">
                Default
              </Label>
              <Switch id="switch-default-size" />
            </div>

            <div className="flex items-center justify-between max-w-xs">
              <Label htmlFor="switch-lg" className="text-sm font-normal cursor-pointer">
                Large
              </Label>
              <Switch id="switch-lg" size="lg" />
            </div>
          </div>

          {/* Switch with Labels */}
          <div className="p-6 rounded-lg bg-frosted-1 border border-border-subtle space-y-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">With Labels</h3>

            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Off</span>
              <Switch id="switch-labels" />
              <span className="text-sm text-foreground">On</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Dark</span>
              <Switch id="switch-theme" defaultChecked />
              <span className="text-sm text-foreground">Light</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Public</span>
              <Switch id="switch-privacy" defaultChecked />
              <span className="text-sm text-foreground">Private</span>
            </div>
          </div>
        </section>

        {/* Usage Examples */}
        <section className="space-y-4">
          <h2 className="text-lg font-medium text-foreground">Usage Examples</h2>
          <div className="p-6 rounded-lg bg-frosted-1 border border-border-subtle space-y-6">
            {/* Settings Example */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-foreground">Notification Settings</h3>
              <div className="space-y-3 pl-4 border-l-2 border-border-subtle">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notif" className="text-sm font-normal cursor-pointer">
                      Email notifications
                    </Label>
                    <p className="text-xs text-muted-foreground">Receive updates via email</p>
                  </div>
                  <Switch id="email-notif" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-notif" className="text-sm font-normal cursor-pointer">
                      Push notifications
                    </Label>
                    <p className="text-xs text-muted-foreground">Receive push notifications</p>
                  </div>
                  <Switch id="push-notif" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sms-notif" className="text-sm font-normal cursor-pointer">
                      SMS notifications
                    </Label>
                    <p className="text-xs text-muted-foreground">Receive text messages</p>
                  </div>
                  <Switch id="sms-notif" disabled />
                </div>
              </div>
            </div>

            {/* Preferences Example */}
            <div className="space-y-4 pt-4 border-t border-border-subtle">
              <h3 className="text-sm font-medium text-foreground">Preferences</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Checkbox id="pref-1" defaultChecked />
                  <Label htmlFor="pref-1" className="text-sm font-normal cursor-pointer">
                    Auto-save
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox id="pref-2" />
                  <Label htmlFor="pref-2" className="text-sm font-normal cursor-pointer">
                    Dark mode
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox id="pref-3" defaultChecked />
                  <Label htmlFor="pref-3" className="text-sm font-normal cursor-pointer">
                    Compact view
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox id="pref-4" />
                  <Label htmlFor="pref-4" className="text-sm font-normal cursor-pointer">
                    Show hints
                  </Label>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Component Info */}
        <section className="p-4 rounded-lg bg-frosted-1 border border-border-subtle">
          <h4 className="text-sm font-medium text-foreground mb-2">Component Features</h4>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>Frosted glass effect with backdrop blur</li>
            <li>Animated checkmark with smooth transitions</li>
            <li>Glow effect on active/selected state</li>
            <li>Smooth slide animation for switches</li>
            <li>Support for indeterminate state</li>
            <li>Full keyboard accessibility</li>
            <li>Disabled state styling</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
