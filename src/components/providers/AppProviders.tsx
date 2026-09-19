"use client";

import React, { createContext, useContext, useState } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { TimeThemeProvider } from "@/context/TimeThemeContext";
import { SavedFoodsProvider } from "@/context/SavedFoodsContext";
import { SavedSheet } from "@/components/saved/SavedSheet";

interface SavedSheetContextType {
  openSaved: () => void;
  closeSaved: () => void;
}

const SavedSheetContext = createContext<SavedSheetContextType>({
  openSaved: () => {},
  closeSaved: () => {},
});

export const useSavedSheet = () => useContext(SavedSheetContext);

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [savedOpen, setSavedOpen] = useState(false);

  return (
    <ThemeProvider defaultTheme="system" storageKey="foodlife_theme">
      <TimeThemeProvider>
        <SavedFoodsProvider>
          <SavedSheetContext.Provider
            value={{
              openSaved: () => setSavedOpen(true),
              closeSaved: () => setSavedOpen(false),
            }}
          >
            {children}
            <SavedSheet open={savedOpen} onOpenChange={setSavedOpen} />
          </SavedSheetContext.Provider>
        </SavedFoodsProvider>
      </TimeThemeProvider>
    </ThemeProvider>
  );
}
