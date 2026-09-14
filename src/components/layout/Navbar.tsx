"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLeaf,
  faGlobe,
  faMoon,
  faSun,
  faClock,
  faBookmark,
  faBars,
  faXmark,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { useI18n } from "@/context/I18nContext";
import type { Locale } from "@/context/I18nContext";
import { useTimeTheme } from "@/context/TimeThemeContext";
import type { ThemeMode } from "@/context/TimeThemeContext";
import { useTheme } from "@/components/theme-provider";
import { useSavedFoods } from "@/context/SavedFoodsContext";
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

interface NavbarProps {
  onOpenSaved: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSaved }) => {
  const { locale, setLocale, t, getLocalizedPath } = useI18n();
  const { period, themeMode, setThemeMode, currentTime } = useTimeTheme();
  const { theme, setTheme } = useTheme();
  const { savedFoods } = useSavedFoods();
  const pathname = usePathname() || "/";

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHome = pathname === "/" || pathname === "/en";
  const isResources =
    pathname.startsWith("/tai-nguyen") ||
    pathname.startsWith("/en/resources");

  const handleLanguageChange = (lang: Locale) => {
    setLocale(lang);
  };

  const timePeriodLabels: Record<string, string> = {
    morning: t("time.morning"),
    midday: t("time.midday"),
    afternoon: t("time.afternoon"),
    night: t("time.night"),
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-emerald-950/10 dark:border-emerald-500/15 bg-background/80 backdrop-blur-md transition-colors duration-300">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link
          href={getLocalizedPath("/")}
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
              {t("app.tagline")}
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 bg-emerald-50/70 dark:bg-emerald-950/30 p-1.5 rounded-full border border-emerald-200/50 dark:border-emerald-800/40">
          <Link
            href={getLocalizedPath("/")}
            className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${
              isHome
                ? "bg-white dark:bg-emerald-900/80 text-emerald-700 dark:text-emerald-200 shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("nav.home")}
          </Link>
          <Link
            href={getLocalizedPath("/tai-nguyen")}
            className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${
              isResources
                ? "bg-white dark:bg-emerald-900/80 text-emerald-700 dark:text-emerald-200 shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("nav.resources")}
          </Link>
        </nav>

        {/* Right action group */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Saved Meals Badge Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenSaved}
            className="relative flex items-center gap-1.5 text-sm font-medium hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-700 dark:hover:text-emerald-300 rounded-full px-3"
            title={t("nav.saved")}
          >
            <FontAwesomeIcon icon={faBookmark} className="text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">{t("nav.saved")}</span>
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
                  <span className="text-[11px] text-muted-foreground font-mono hidden md:inline">
                    {currentTime}
                  </span>
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                {t("nav.theme")} ({currentTime})
              </DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => setThemeMode("auto")}
                className="flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faClock} className="text-emerald-600" />
                  <span>{t("nav.autoTheme")}</span>
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
                  <span>{t(`nav.${mode}`)}</span>
                  {themeMode === mode && <FontAwesomeIcon icon={faCheck} className="text-emerald-600" />}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                {t("nav.light")} / {t("nav.dark")}
              </DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="flex items-center justify-between text-xs"
              >
                <span className="flex items-center gap-2">
                  <FontAwesomeIcon icon={theme === "dark" ? faSun : faMoon} />
                  {theme === "dark" ? t("nav.light") : t("nav.dark")}
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Language Switcher Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full px-2.5 sm:px-3 text-xs sm:text-sm font-medium text-foreground hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                >
                  <FontAwesomeIcon icon={faGlobe} className="text-emerald-600 dark:text-emerald-400" />
                  <span className="ml-1 uppercase font-semibold text-xs">
                    {locale}
                  </span>
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                {t("nav.language")}
              </DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => handleLanguageChange("vi")}
                className="flex items-center justify-between text-xs font-medium"
              >
                <span>🇻🇳 Tiếng Việt</span>
                {locale === "vi" && <FontAwesomeIcon icon={faCheck} className="text-emerald-600" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleLanguageChange("en")}
                className="flex items-center justify-between text-xs font-medium"
              >
                <span>🇬🇧 English</span>
                {locale === "en" && <FontAwesomeIcon icon={faCheck} className="text-emerald-600" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile menu toggle */}
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

      {/* Mobile nav drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-emerald-900/10 dark:border-emerald-500/20 bg-background/95 px-4 py-4 backdrop-blur-md animate-in slide-in-from-top-2">
          <div className="flex flex-col gap-2">
            <Link
              href={getLocalizedPath("/")}
              onClick={() => setMobileMenuOpen(false)}
              className={`px-4 py-2.5 text-sm font-medium rounded-xl ${
                isHome
                  ? "bg-emerald-100/80 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {t("nav.home")}
            </Link>
            <Link
              href={getLocalizedPath("/tai-nguyen")}
              onClick={() => setMobileMenuOpen(false)}
              className={`px-4 py-2.5 text-sm font-medium rounded-xl ${
                isResources
                  ? "bg-emerald-100/80 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {t("nav.resources")}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
