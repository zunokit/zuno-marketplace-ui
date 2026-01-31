"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft, Boxes } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Skeleton } from "@/shared/components/ui/skeleton";

// Dynamically import all component sections for code splitting
const ButtonSection = dynamic(
  () => import("./sections/button-section").then(mod => ({ default: mod.ButtonSection })),
  {
    loading: () => <SectionSkeleton />,
  }
);
const InputSection = dynamic(
  () => import("./sections/input-section").then(mod => ({ default: mod.InputSection })),
  {
    loading: () => <SectionSkeleton />,
  }
);
const FormSection = dynamic(
  () => import("./sections/form-section").then(mod => ({ default: mod.FormSection })),
  {
    loading: () => <SectionSkeleton />,
  }
);
const CardSection = dynamic(
  () => import("./sections/card-section").then(mod => ({ default: mod.CardSection })),
  {
    loading: () => <SectionSkeleton />,
  }
);
const AlertSection = dynamic(
  () => import("./sections/alert-section").then(mod => ({ default: mod.AlertSection })),
  {
    loading: () => <SectionSkeleton />,
  }
);
const BadgeSection = dynamic(
  () => import("./sections/badge-section").then(mod => ({ default: mod.BadgeSection })),
  {
    loading: () => <SectionSkeleton />,
  }
);
const TableSection = dynamic(
  () => import("./sections/table-section").then(mod => ({ default: mod.TableSection })),
  {
    loading: () => <SectionSkeleton />,
  }
);
const DialogSection = dynamic(
  () => import("./sections/dialog-section").then(mod => ({ default: mod.DialogSection })),
  {
    loading: () => <SectionSkeleton />,
  }
);
const DrawerSection = dynamic(
  () => import("./sections/drawer-section").then(mod => ({ default: mod.DrawerSection })),
  {
    loading: () => <SectionSkeleton />,
  }
);
const TabsSection = dynamic(
  () => import("./sections/tabs-section").then(mod => ({ default: mod.TabsSection })),
  {
    loading: () => <SectionSkeleton />,
  }
);
const AccordionSection = dynamic(
  () => import("./sections/accordion-section").then(mod => ({ default: mod.AccordionSection })),
  {
    loading: () => <SectionSkeleton />,
  }
);
const TooltipSection = dynamic(
  () => import("./sections/tooltip-section").then(mod => ({ default: mod.TooltipSection })),
  {
    loading: () => <SectionSkeleton />,
  }
);
const OverlaySection = dynamic(
  () => import("./sections/overlay-section").then(mod => ({ default: mod.OverlaySection })),
  {
    loading: () => <SectionSkeleton />,
  }
);
const NavigationSection = dynamic(
  () => import("./sections/navigation-section").then(mod => ({ default: mod.NavigationSection })),
  {
    loading: () => <SectionSkeleton />,
  }
);
const LoadingSection = dynamic(
  () => import("./sections/loading-section").then(mod => ({ default: mod.LoadingSection })),
  {
    loading: () => <SectionSkeleton />,
  }
);
const UtilitySection = dynamic(
  () => import("./sections/utility-section").then(mod => ({ default: mod.UtilitySection })),
  {
    loading: () => <SectionSkeleton />,
  }
);
const ChartSection = dynamic(
  () => import("./sections/chart-section").then(mod => ({ default: mod.ChartSection })),
  {
    loading: () => <SectionSkeleton />,
    ssr: false,
  }
);
const CalendarSection = dynamic(
  () => import("./sections/calendar-section").then(mod => ({ default: mod.CalendarSection })),
  {
    loading: () => <SectionSkeleton />,
  }
);
const InteractiveSection = dynamic(
  () => import("./sections/interactive-section").then(mod => ({ default: mod.InteractiveSection })),
  {
    loading: () => <SectionSkeleton />,
  }
);
const AdvancedLayoutSection = dynamic(
  () =>
    import("./sections/advanced-layout-section").then(mod => ({
      default: mod.AdvancedLayoutSection,
    })),
  {
    loading: () => <SectionSkeleton />,
  }
);
const ToastSection = dynamic(
  () => import("./sections/toast-section").then(mod => ({ default: mod.ToastSection })),
  {
    loading: () => <SectionSkeleton />,
  }
);
const AlertDialogSection = dynamic(
  () =>
    import("./sections/alert-dialog-section").then(mod => ({ default: mod.AlertDialogSection })),
  {
    loading: () => <SectionSkeleton />,
  }
);

function SectionSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}

interface Section {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType;
  category:
    | "input"
    | "display"
    | "feedback"
    | "navigation"
    | "layout"
    | "utility"
    | "data-viz"
    | "interactive";
}

const sections: Section[] = [
  // Input & Forms
  {
    id: "button",
    title: "Button",
    description: "Button variants, sizes, states, and loading animations",
    component: ButtonSection,
    category: "input",
  },
  {
    id: "input",
    title: "Input",
    description: "Text inputs, textarea, input groups, and OTP inputs",
    component: InputSection,
    category: "input",
  },
  {
    id: "form",
    title: "Form Elements",
    description: "Form fields, labels, validation, select, radio, checkbox",
    component: FormSection,
    category: "input",
  },
  // Display
  {
    id: "card",
    title: "Card",
    description: "Card variants, NFT patterns, and content layouts",
    component: CardSection,
    category: "display",
  },
  {
    id: "badge",
    title: "Badge",
    description: "Badge variants, rarity tiers, and status indicators",
    component: BadgeSection,
    category: "display",
  },
  {
    id: "table",
    title: "Table",
    description: "Data tables with sorting, selection, and pagination",
    component: TableSection,
    category: "display",
  },
  // Feedback
  {
    id: "alert",
    title: "Alert",
    description: "Alert messages, notifications, and feedback states",
    component: AlertSection,
    category: "feedback",
  },
  {
    id: "dialog",
    title: "Dialog & Modal",
    description: "Modal dialogs, confirmations, and alert dialogs",
    component: DialogSection,
    category: "feedback",
  },
  {
    id: "alert-dialog",
    title: "Alert Dialog",
    description: "Confirmation dialogs, destructive actions, and critical decisions",
    component: AlertDialogSection,
    category: "feedback",
  },
  {
    id: "drawer",
    title: "Drawer",
    description: "Side panels, slide-outs, and drawer variations",
    component: DrawerSection,
    category: "feedback",
  },
  {
    id: "tooltip",
    title: "Tooltip",
    description: "Tooltips, popovers, and hover cards",
    component: TooltipSection,
    category: "feedback",
  },
  {
    id: "toast",
    title: "Toast Notifications",
    description: "Toast messages, notifications, and real-time feedback",
    component: ToastSection,
    category: "feedback",
  },
  {
    id: "loading",
    title: "Loading States",
    description: "Spinners, skeletons, progress bars, and loading indicators",
    component: LoadingSection,
    category: "feedback",
  },
  // Navigation
  {
    id: "tabs",
    title: "Tabs",
    description: "Tab variants, vertical tabs, and content switching",
    component: TabsSection,
    category: "navigation",
  },
  {
    id: "accordion",
    title: "Accordion",
    description: "Collapsible content, single/multiple mode",
    component: AccordionSection,
    category: "navigation",
  },
  {
    id: "navigation",
    title: "Navigation",
    description: "Breadcrumbs, menus, pagination, and navigation patterns",
    component: NavigationSection,
    category: "navigation",
  },
  {
    id: "overlay",
    title: "Overlay",
    description: "Dropdown menus, context menus, and command palette",
    component: OverlaySection,
    category: "navigation",
  },
  // Data Visualization
  {
    id: "chart",
    title: "Charts",
    description: "Bar, line, area, and pie charts for data visualization",
    component: ChartSection,
    category: "data-viz",
  },
  {
    id: "calendar",
    title: "Calendar",
    description: "Date picker, range selection, and calendar components",
    component: CalendarSection,
    category: "data-viz",
  },
  // Interactive Controls
  {
    id: "interactive",
    title: "Interactive Controls",
    description: "Toggle, slider, keyboard shortcuts, and collapsible",
    component: InteractiveSection,
    category: "interactive",
  },
  // Layout
  {
    id: "advanced-layout",
    title: "Advanced Layout",
    description: "Carousel, aspect ratio, and responsive containers",
    component: AdvancedLayoutSection,
    category: "layout",
  },
  // Utility
  {
    id: "utility",
    title: "Utility Components",
    description: "Avatar, separator, scroll area, and helper components",
    component: UtilitySection,
    category: "utility",
  },
];

const categories = [
  { id: "all", label: "All Components", count: sections.length },
  {
    id: "input",
    label: "Input & Forms",
    count: sections.filter(s => s.category === "input").length,
  },
  { id: "display", label: "Display", count: sections.filter(s => s.category === "display").length },
  {
    id: "feedback",
    label: "Feedback",
    count: sections.filter(s => s.category === "feedback").length,
  },
  {
    id: "navigation",
    label: "Navigation",
    count: sections.filter(s => s.category === "navigation").length,
  },
  {
    id: "data-viz",
    label: "Data Visualization",
    count: sections.filter(s => s.category === "data-viz").length,
  },
  {
    id: "interactive",
    label: "Interactive",
    count: sections.filter(s => s.category === "interactive").length,
  },
  { id: "layout", label: "Layout", count: sections.filter(s => s.category === "layout").length },
  { id: "utility", label: "Utility", count: sections.filter(s => s.category === "utility").length },
];

export default function UIComponentsPage() {
  return (
    <div className="min-h-screen bg-background overflow-visible">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Intro */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-os-info/20 to-os-epic/20 flex items-center justify-center">
              <Boxes className="w-6 h-6 text-os-info" />
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                UI Component Library
              </h2>
              <p className="text-muted-foreground">
                Complete showcase of all UI components with OpenSea design system
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-card border border-border-subtle">
              <p className="text-2xl font-bold text-foreground">{sections.length}</p>
              <p className="text-sm text-muted-foreground">Components</p>
            </div>
            <div className="p-4 rounded-lg bg-card border border-border-subtle">
              <p className="text-2xl font-bold text-foreground">{categories.length - 1}</p>
              <p className="text-sm text-muted-foreground">Categories</p>
            </div>
            <div className="p-4 rounded-lg bg-card border border-border-subtle">
              <p className="text-2xl font-bold text-foreground">53+</p>
              <p className="text-sm text-muted-foreground">UI Elements</p>
            </div>
            <div className="p-4 rounded-lg bg-card border border-border-subtle">
              <p className="text-2xl font-bold text-os-success">100%</p>
              <p className="text-sm text-muted-foreground">Coverage</p>
            </div>
          </div>
        </div>

        {/* Tabs: block layout only, no flex — tránh scroll lồng trong main */}
        <Tabs defaultValue="all" className="w-full !block">
          <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto gap-2 bg-transparent p-0 mb-8">
            {categories.map(category => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {category.label}
                <Badge variant="secondary" className="ml-2 text-xs">
                  {category.count}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map(category => {
            const categorySections =
              category.id === "all" ? sections : sections.filter(s => s.category === category.id);

            return (
              <TabsContent
                key={category.id}
                value={category.id}
                className="space-y-12 mt-8 !block flex-none min-h-0 overflow-visible"
              >
                {categorySections.map(section => {
                  const Component = section.component;
                  return (
                    <section key={section.id} id={section.id}>
                      <div className="mb-6">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl font-semibold text-foreground">
                            {section.title}
                          </h3>
                          <Badge variant="outline" className="text-xs">
                            {section.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{section.description}</p>
                      </div>
                      <Component />
                    </section>
                  );
                })}
              </TabsContent>
            );
          })}
        </Tabs>

        {/* Footer */}
        <footer className="mt-12 pt-6 pb-8 border-t border-border-subtle">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center sm:text-left">
              Built with OpenSea design system • {sections.length} components
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Back to top
            </Button>
          </div>
        </footer>
      </div>
    </div>
  );
}
