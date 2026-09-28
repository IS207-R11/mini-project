"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { MealSession, TimePeriod } from "@/types/food";
import { periodToSession } from "@/lib/foodData";

interface TimeThemeContextType { currentTime: string; currentDate: string; period: TimePeriod; recommendedSession: MealSession; isMounted: boolean; }
const TimeThemeContext = createContext<TimeThemeContextType | undefined>(undefined);
export function getPeriodFromHour(hour: number): TimePeriod { if (hour >= 5 && hour < 10) return "morning"; if (hour < 14) return "midday"; if (hour < 18) return "afternoon"; return "night"; }
export function TimeThemeProvider({ children }: { children: React.ReactNode }) {
  const [now, setNow] = useState(() => new Date()); const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); const timer = window.setInterval(() => setNow(new Date()), 30_000); return () => window.clearInterval(timer); }, []);
  const period = getPeriodFromHour(now.getHours());
  useEffect(() => { document.documentElement.setAttribute("data-time-theme", period); }, [period]);
  const value = useMemo(() => ({ currentTime: now.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }), currentDate: now.toLocaleDateString("vi-VN", { weekday: "long", day: "numeric", month: "long" }), period, recommendedSession: periodToSession(period), isMounted }), [now, period, isMounted]);
  return <TimeThemeContext.Provider value={value}>{children}</TimeThemeContext.Provider>;
}
export function useTimeTheme() { const context = useContext(TimeThemeContext); if (!context) throw new Error("useTimeTheme must be used within a TimeThemeProvider"); return context; }
