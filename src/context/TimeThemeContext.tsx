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

/**
 * Determines the time period based on hour:
 * - 05:00 - 10:59: Morning (Buổi sáng)
 * - 11:00 - 13:59: Midday / Lunch (Buổi trưa)
 * - 14:00 - 17:59: Afternoon (Buổi chiều)
 * - 18:00 - 04:59: Evening / Night (Buổi tối)
 */
export function getPeriodFromHour(hour: number): TimePeriod {
  if (hour >= 5 && hour < 11) return "morning";
  if (hour >= 11 && hour < 14) return "midday";
  if (hour >= 14 && hour < 18) return "afternoon";
  return "night";
}

export const TimeThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>("auto");
  const [dateObj, setDateObj] = useState<Date>(() => new Date());
  const [isMounted, setIsMounted] = useState(false);

  // Mark mounted on client (NO localStorage persistence per requirements)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Update clock periodically
  useEffect(() => {
    const timer = setInterval(() => {
      setDateObj(new Date());
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  const realHour = dateObj.getHours();
  const autoPeriod = useMemo(() => getPeriodFromHour(realHour), [realHour]);

  const activePeriod: TimePeriod = themeMode === "auto" ? autoPeriod : themeMode;

  const setThemeMode = useCallback((mode: ThemeMode) => {
    // In-memory state only - no localStorage
    setThemeModeState(mode);
  }, []);

  // Sync data-time-theme on root HTML for instant CSS styling
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
      weekday: "long",
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
