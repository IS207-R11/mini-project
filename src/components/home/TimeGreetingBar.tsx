"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { useTimeTheme } from "@/context/TimeThemeContext";
import type { ThemeMode } from "@/context/TimeThemeContext";

const periodGreetings: Record<string, { title: string; desc: string }> = {
  morning: {
    title: "Chào Buổi Sáng Tươi Mới!",
    desc: "Khởi đầu ngày mới với nguồn năng lượng tinh sạch và sảng khoái.",
  },
  midday: {
    title: "Nạp Năng Lượng Giữa Trưa!",
    desc: "Bữa trưa đầy đủ dưỡng chất giúp duy trì sự tỉnh táo và tập trung.",
  },
  afternoon: {
    title: "Thư Thái Buổi Xế Chiều!",
    desc: "Món ăn nhẹ thanh mát giải tỏa căng thẳng cho ngày dài.",
  },
  night: {
    title: "Buổi Tối An Yên & Nhẹ Bụng!",
    desc: "Thực đơn dịu lành nuôi dưỡng cơ thể và cho giấc ngủ sâu.",
  },
};

const periodLabels: Record<string, string> = {
  morning: "Sáng Sớm",
  midday: "Giữa Trưa",
  afternoon: "Buổi Chiều",
  night: "Buổi Tối",
};

export const TimeGreetingBar: React.FC = () => {
  const { currentTime, period, themeMode, setThemeMode } = useTimeTheme();
  const currentGreeting = periodGreetings[period] || periodGreetings.morning;

  return (
    <section className="border-b border-emerald-900/10 dark:border-emerald-500/15 bg-background/60 backdrop-blur-xs py-4 px-4 sm:px-6">
      <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Current Greeting & Live Clock */}
        <div className="flex items-center gap-3 text-center md:text-left">
          <div className="h-10 w-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-300/40">
            <FontAwesomeIcon
              icon={period === "night" ? faMoon : faSun}
              className="text-base"
            />
          </div>
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span
                suppressHydrationWarning
                className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400"
              >
                {currentGreeting.title}
              </span>
              <span
                suppressHydrationWarning
                className="text-[11px] text-muted-foreground font-mono bg-muted/60 px-2 py-0.5 rounded-full"
              >
                <FontAwesomeIcon icon={faClock} className="mr-1 text-xs" />
                {currentTime}
              </span>
            </div>
            <p
              suppressHydrationWarning
              className="text-xs text-muted-foreground font-medium mt-0.5"
            >
              {currentGreeting.desc}
            </p>
          </div>
        </div>

        {/* Quick Time Theme Selector */}
        <div className="flex items-center gap-1.5 bg-emerald-100/50 dark:bg-emerald-950/50 p-1 rounded-full border border-emerald-200/50 dark:border-emerald-800/40">
          <button
            onClick={() => setThemeMode("auto")}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              themeMode === "auto"
                ? "bg-white dark:bg-emerald-800 text-emerald-800 dark:text-emerald-100 shadow-xs font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Tự Động
          </button>
          {(["morning", "midday", "afternoon", "night"] as ThemeMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setThemeMode(mode)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all capitalize ${
                themeMode === mode
                  ? "bg-white dark:bg-emerald-800 text-emerald-800 dark:text-emerald-100 shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {periodLabels[mode]}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
