"use client";

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import type { TimePeriod, MealSession } from "@/types/food";
import { periodToSession } from "@/lib/foodData";

export type ThemeMode = "auto" | TimePeriod;

interface TimeThemeContextType {
  currentTime: string;
  currentDate: string;
  period: TimePeriod;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  recommendedSession: MealSession;
  isMounted: boolean;
}

const TimeThemeContext = createContext<TimeThemeContextType | undefined>(undefined);

export function getPeriodFromHour(hour: number): TimePeriod {
  if (hour >= 5 && hour < 10) return "morning";
  if (hour >= 10 && hour < 14) return "midday";
  if (hour >= 14 && hour < 18) return "afternoon";
  return "night";
}

export const TimeThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>("auto");
  const [dateObj, setDateObj] = useState<Date>(() => new Date());
  const [isMounted, setIsMounted] = useState(false);

  // Restore saved theme on mount (client-side only)
  useEffect(() => {
    setIsMounted(true);
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
    const hours = String(dateObj.getHours()).padStart(2, "0");
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  }, [dateObj]);

  const currentDate = useMemo(() => {
    return dateObj.toLocaleDateString("vi-VN", {
      weekday: "short",
      day: "numeric",
      month: "numeric",
    });
  }, [dateObj]);

  const recommendedSession = useMemo(() => {
    return periodToSession(activePeriod);
  }, [activePeriod]);

  const value = useMemo(
    () => ({
      currentTime,
      currentDate,
      period: activePeriod,
      themeMode,
      setThemeMode,
      recommendedSession,
      isMounted,
    }),
    [currentTime, currentDate, activePeriod, themeMode, setThemeMode, recommendedSession, isMounted]
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
