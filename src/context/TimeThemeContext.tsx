"use client";

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import type { TimePeriod, MealTime } from "@/types/food";

export type ThemeMode = "auto" | TimePeriod;

interface TimeThemeContextType {
  currentTime: string;
  currentDate: string;
  period: TimePeriod;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  recommendedMealTime: MealTime;
}

const TimeThemeContext = createContext<TimeThemeContextType | undefined>(undefined);

export function getPeriodFromHour(hour: number): TimePeriod {
  if (hour >= 5 && hour < 10) return "morning";
  if (hour >= 10 && hour < 14) return "midday";
  if (hour >= 14 && hour < 18) return "afternoon";
  return "night";
}

export function getMealTimeFromPeriod(period: TimePeriod): MealTime {
  switch (period) {
    case "morning":
      return "breakfast";
    case "midday":
      return "lunch";
    case "afternoon":
      return "afternoon";
    case "night":
      return "dinner";
  }
}

export const TimeThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>("auto");
  const [dateObj, setDateObj] = useState<Date>(() => new Date());

  // Restore saved theme on mount (client-side only)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("foodlife_theme_mode");
      if (saved && ["auto", "morning", "midday", "afternoon", "night"].includes(saved)) {
        setThemeModeState(saved as ThemeMode);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Clock tick every 30 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setDateObj(new Date());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  const realHour = dateObj.getHours();
  const autoPeriod = useMemo(() => getPeriodFromHour(realHour), [realHour]);

  const activePeriod: TimePeriod = themeMode === "auto" ? autoPeriod : themeMode;

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      localStorage.setItem("foodlife_theme_mode", mode);
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Update HTML data attribute for contextual styling
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-time-theme", activePeriod);
  }, [activePeriod]);

  const currentTime = useMemo(() => {
    return dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }, [dateObj]);

  const currentDate = useMemo(() => {
    return dateObj.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });
  }, [dateObj]);

  const recommendedMealTime = useMemo(() => {
    return getMealTimeFromPeriod(activePeriod);
  }, [activePeriod]);

  const value = useMemo(
    () => ({
      currentTime,
      currentDate,
      period: activePeriod,
      themeMode,
      setThemeMode,
      recommendedMealTime,
    }),
    [currentTime, currentDate, activePeriod, themeMode, setThemeMode, recommendedMealTime]
  );

  return <TimeThemeContext.Provider value={value}>{children}</TimeThemeContext.Provider>;
};

export const useTimeTheme = () => {
  const context = useContext(TimeThemeContext);
  if (!context) {
    throw new Error("useTimeTheme must be used within a TimeThemeProvider");
  }
  return context;
};
