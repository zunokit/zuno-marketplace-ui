"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Boxes,
  ChevronRight,
  Search,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Separator } from "@/shared/components/ui/separator";

// Import all component sections
import { ButtonSection } from "./sections/button-section";
import { InputSection } from "./sections/input-section";
import { FormSection } from "./sections/form-section";
import { CardSection } from "./sections/card-section";
import { AlertSection } from "./sections/alert-section";
import { BadgeSection } from "./sections/badge-section";
import { TabsSection } from "./sections/tabs-section";
import { DrawerSection } from "./sections/drawer-section";
import { DialogSection } from "./sections/dialog-section";
import { AccordionSection } from "./sections/accordion-section";
import { TooltipSection } from "./sections/tooltip-section";
import { OverlaySection } from "./sections/overlay-section";
import { NavigationSection } from "./sections/navigation-section";
import { LoadingSection } from "./sections/loading-section";
import { UtilitySection } from "./sections/utility-section";
import { ChartSection } from "./sections/chart-section";
import { CalendarSection } from "./sections/calendar-section";
import { InteractiveSection } from "./sections/interactive-section";
import { AdvancedLayoutSection } from "./sections/advanced-layout-section";
import { ToastSection } from "./sections/toast-section";
import { AlertDialogSection } from "./sections/alert-dialog-section";
import { TableSection } from "@/app/debug/ui/sections/table-section";

// ============================================
// UI COMPONENTS SHOWCASE - All-in-One Page
// ============================================

interface Section {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType;
  category: "input" | "display" | "feedback" | "navigation" | "layout" | "utility" | "data-viz" | "interactive";
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
  { id: "input", label: "Input & Forms", count: sections.filter(s => s.category === "input").length },
  { id: "display", label: "Display", count: sections.filter(s => s.category === "display").length },
  { id: "feedback", label: "Feedback", count: sections.filter(s => s.category === "feedback").length },
  { id: "navigation", label: "Navigation", count: sections.filter(s => s.category === "navigation").length },
  { id: "data-viz", label: "Data Visualization", count: sections.filter(s => s.category === "data-viz").length },
  { id: "interactive", label: "Interactive", count: sections.filter(s => s.category === "interactive").length },
  { id: "layout", label: "Layout", count: sections.filter(s => s.category === "layout").length },
  { id: "utility", label: "Utility", count: sections.filter(s => s.category === "utility").length },
];

export default function UIComponentsPage() {
  const [activeSection, setActiveSection] = React.useState<string>("button");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  // Filter sections based on search and category
  const filteredSections = React.useMemo(() => {
    return sections.filter((section) => {
      const matchesSearch = section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        section.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || section.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // Scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Header height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setActiveSection(sectionId);
      setSidebarOpen(false);
    }
  };

  // Update active section on scroll
  React.useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Header */}
      <header className="sticky top-0 z-50 border-b border-border-subtle bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
              <Link
                href="/debug"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back to Debug</span>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Boxes className="w-5 h-5 text-os-info" />
              <div>
                <h1 className="text-lg font-semibold text-foreground">
                  UI Components
                </h1>
              </div>
            </div>
            <div className="w-24" /> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8 py-8">
          {/* Sidebar Navigation */}
          <aside
            className={`
              fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-64 shrink-0
              bg-background border-r border-border-subtle lg:border-0
              transition-transform duration-300 z-40
              ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            `}
          >
            <ScrollArea className="h-full py-6 px-4 lg:px-0">
              <div className="space-y-6">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search components..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>

                {/* Category Filter */}
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Categories
                  </p>
                  <div className="space-y-1">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`
                          w-full flex items-center justify-between px-3 py-2 rounded-md text-sm
                          transition-colors
                          ${selectedCategory === category.id
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                          }
                        `}
                      >
                        <span>{category.label}</span>
                        <Badge variant="secondary" className="text-xs">
                          {category.count}
                        </Badge>
                      </button>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Component List */}
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Components
                  </p>
                  <nav className="space-y-1">
                    {filteredSections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`
                          w-full flex items-center justify-between px-3 py-2 rounded-md text-sm
                          transition-all duration-200 group
                          ${activeSection === section.id
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                          }
                        `}
                      >
                        <span className="truncate">{section.title}</span>
                        <ChevronRight
                          className={`
                            w-4 h-4 transition-transform
                            ${activeSection === section.id
                              ? "opacity-100"
                              : "opacity-0 group-hover:opacity-100"
                            }
                          `}
                        />
                      </button>
                    ))}
                  </nav>
                </div>

                {filteredSections.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground">
                      No components found
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </aside>

          {/* Overlay for mobile */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="space-y-16">
              {/* Intro */}
              <div className="space-y-4">
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
                    <p className="text-2xl font-bold text-foreground">
                      {sections.length}
                    </p>
                    <p className="text-sm text-muted-foreground">Components</p>
                  </div>
                  <div className="p-4 rounded-lg bg-card border border-border-subtle">
                    <p className="text-2xl font-bold text-foreground">
                      {categories.length - 1}
                    </p>
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

              <Separator />

              {/* Component Sections */}
              {filteredSections.map((section) => {
                const Component = section.component;
                return (
                  <section
                    key={section.id}
                    id={section.id}
                    className="scroll-mt-20"
                  >
                    <div className="mb-6">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-semibold text-foreground">
                          {section.title}
                        </h3>
                        <Badge variant="outline" className="text-xs">
                          {section.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {section.description}
                      </p>
                    </div>
                    <Component />
                  </section>
                );
              })}
            </div>

            {/* Footer */}
            <footer className="mt-16 pt-8 border-t border-border-subtle">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
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
          </main>
        </div>
      </div>
    </div>
  );
}
