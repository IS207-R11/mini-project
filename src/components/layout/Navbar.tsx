"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLeaf,
  faMoon,
  faSun,
  faClock,
  faBookmark,
  faBars,
  faXmark,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { useTimeTheme } from "@/context/TimeThemeContext";
import type { ThemeMode } from "@/context/TimeThemeContext";
import { useTheme } from "@/components/theme-provider";
import { useSavedFoods } from "@/context/SavedFoodsContext";
import { useSavedSheet } from "@/components/providers/AppProviders";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const timePeriodLabels: Record<string, string> = {
  morning: "Sáng Sớm",
  midday: "Giữa Trưa",
  afternoon: "Buổi Chiều",
  night: "Buổi Tối",
};

const timePeriodDetailLabels: Record<string, string> = {
  morning: "Sáng Sớm (05:00 - 10:00)",
  midday: "Giữa Trưa (10:00 - 14:00)",
  afternoon: "Buổi Chiều (14:00 - 18:00)",
  night: "Buổi Tối (18:00 - 05:00)",
};

interface NavItem {
  href: string;
  label: string;
  segment: string | null;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Trang Chủ", segment: null },
  { href: "/tai-nguyen", label: "Tài Nguyên", segment: "tai-nguyen" },
];

export const Navbar: React.FC = () => {
  const segment = useSelectedLayoutSegment();
  const { period, themeMode, setThemeMode, currentTime } = useTimeTheme();
  const { theme, setTheme } = useTheme();
  const { savedFoods } = useSavedFoods();
  const { openSaved } = useSavedSheet();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-emerald-950/10 dark:border-emerald-500/15 bg-background/80 backdrop-blur-md transition-colors duration-300">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 transition-transform hover:scale-102"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm shadow-emerald-500/20">
            <FontAwesomeIcon icon={faLeaf} className="text-lg" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-foreground flex items-center gap-1.5">
              Food<span className="text-emerald-600 dark:text-emerald-400">Life</span>
            </span>
            <span className="hidden sm:block text-[10px] text-muted-foreground font-medium -mt-1 tracking-wider uppercase">
              Khám Phá & Gợi Ý Món Ăn Lành Mạnh
            </span>
          </div>
        </Link>

        {/* Desktop Directory-based Nav Links */}
        <nav className="hidden md:flex items-center gap-1 bg-emerald-50/70 dark:bg-emerald-950/30 p-1.5 rounded-full border border-emerald-200/50 dark:border-emerald-800/40">
          {NAV_ITEMS.map((item) => {
            const isActive = segment === item.segment;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${
                  isActive
                    ? "bg-white dark:bg-emerald-900/80 text-emerald-700 dark:text-emerald-200 shadow-sm font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Group */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Saved Dishes Drawer Trigger */}
          <Button
            variant="ghost"
            size="sm"
            onClick={openSaved}
            className="relative flex items-center gap-1.5 text-sm font-medium hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-700 dark:hover:text-emerald-300 rounded-full px-3"
            title="Món Đã Lưu"
          >
            <FontAwesomeIcon icon={faBookmark} className="text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">Món Đã Lưu</span>
            {savedFoods.length > 0 && (
              <Badge
                variant="default"
                className="ml-0.5 h-5 min-w-5 px-1.5 text-xs bg-emerald-600 text-white hover:bg-emerald-600 rounded-full"
              >
                {savedFoods.length}
              </Badge>
            )}
          </Button>

          {/* Theme & Time of Day Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full gap-1.5 border-emerald-200 dark:border-emerald-800 text-xs sm:text-sm font-medium hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                >
                  <FontAwesomeIcon
                    icon={theme === "dark" ? faMoon : faSun}
                    className="text-amber-500 dark:text-emerald-400"
                  />
                  <span className="hidden sm:inline capitalize">
                    {timePeriodLabels[period] || period}
                  </span>
                  <span suppressHydrationWarning className="text-[11px] text-muted-foreground font-mono hidden md:inline">
                    {currentTime}
                  </span>
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel suppressHydrationWarning className="text-xs text-muted-foreground">
                Giao Diện ({currentTime})
              </DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => setThemeMode("auto")}
                className="flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faClock} className="text-emerald-600" />
                  <span>Theo Thời Gian Thực</span>
                </div>
                {themeMode === "auto" && <FontAwesomeIcon icon={faCheck} className="text-emerald-600" />}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {(["morning", "midday", "afternoon", "night"] as ThemeMode[]).map((mode) => (
                <DropdownMenuItem
                  key={mode}
                  onClick={() => setThemeMode(mode)}
                  className="flex items-center justify-between text-xs capitalize"
                >
                  <span>{timePeriodDetailLabels[mode]}</span>
                  {themeMode === mode && <FontAwesomeIcon icon={faCheck} className="text-emerald-600" />}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Sáng / Tối
              </DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="flex items-center justify-between text-xs"
              >
                <span className="flex items-center gap-2">
                  <FontAwesomeIcon icon={theme === "dark" ? faSun : faMoon} />
                  {theme === "dark" ? "Sáng" : "Tối"}
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden rounded-full h-9 w-9"
          >
            <FontAwesomeIcon icon={mobileMenuOpen ? faXmark : faBars} className="text-base" />
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-emerald-900/10 dark:border-emerald-500/20 bg-background/95 px-4 py-4 backdrop-blur-md animate-in slide-in-from-top-2">
          <div className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => {
              const isActive = segment === item.segment;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                    isActive
                      ? "bg-emerald-100/80 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 font-semibold"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
