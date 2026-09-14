"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SavedSheet } from "@/components/saved/SavedSheet";
import { I18nProvider } from "@/context/I18nContext";
import { TimeThemeProvider } from "@/context/TimeThemeContext";
import { SavedFoodsProvider } from "@/context/SavedFoodsContext";
import { ThemeProvider } from "@/components/theme-provider";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [savedOpen, setSavedOpen] = useState(false);

  return (
    <ThemeProvider defaultTheme="system" storageKey="foodlife_theme">
      <I18nProvider>
        <TimeThemeProvider>
          <SavedFoodsProvider>
            <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-emerald-200 selection:text-emerald-900 dark:selection:bg-emerald-800 dark:selection:text-emerald-100">
              <Navbar onOpenSaved={() => setSavedOpen(true)} />
              <main className="flex-1">{children}</main>
              <Footer />
              <SavedSheet open={savedOpen} onOpenChange={setSavedOpen} />
            </div>
          </SavedFoodsProvider>
        </TimeThemeProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
