"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/shared/components/ui/button";

export function ModeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Use useEffect for client-side mounting detection
  // This is a valid pattern for hydration mismatch prevention
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const currentTheme = theme === "system" ? systemTheme : theme;

  if (!mounted) {
    return null; // or a loading spinner/skeleton
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="bg-background border-border-subtle hover:bg-secondary text-foreground dark:bg-card dark:border-border-subtle dark:hover:bg-card/80 dark:text-foreground/70 transition-all duration-150"
    >
      {currentTheme === "dark" ? (
        <Sun className="h-[1.2rem] w-[1.2rem] text-amber-500" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] text-indigo-500" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
