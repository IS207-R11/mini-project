"use client";

import React, { createContext, useContext, useMemo, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import viDict from "@/locales/vi.json";
import enDict from "@/locales/en.json";

export type Locale = "vi" | "en";

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  getLocalizedPath: (path: string) => string;
}

const dictionaries: Record<Locale, Record<string, unknown>> = {
  vi: viDict,
  en: enDict,
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname() || "/";
  const router = useRouter();

  // Purely derive locale from URL path
  const locale: Locale = pathname.startsWith("/en") ? "en" : "vi";

  const setLocale = useCallback((newLocale: Locale) => {
    if (newLocale === locale) return;

    const currentPath = pathname;
    let targetPath: string;

    if (newLocale === "en") {
      if (currentPath === "/tai-nguyen") {
        targetPath = "/en/resources";
      } else if (currentPath === "/mon-da-luu") {
        targetPath = "/en/saved";
      } else {
        targetPath = "/en";
      }
    } else {
      // Switch to VI (no slug)
      if (currentPath.includes("/resources")) {
        targetPath = "/tai-nguyen";
      } else if (currentPath.includes("/saved")) {
        targetPath = "/mon-da-luu";
      } else {
        targetPath = "/";
      }
    }

    router.replace(targetPath);
  }, [locale, pathname, router]);

  const getLocalizedPath = useCallback((path: string) => {
    if (locale === "en") {
      if (path === "/") return "/en";
      if (path === "/tai-nguyen" || path === "/resources") return "/en/resources";
      if (path === "/mon-da-luu" || path === "/saved") return "/en/saved";
      return `/en${path.startsWith("/") ? path : `/${path}`}`;
    } else {
      if (path === "/resources" || path === "/en/resources") return "/tai-nguyen";
      if (path === "/saved" || path === "/en/saved") return "/mon-da-luu";
      if (path === "/en") return "/";
      return path;
    }
  }, [locale]);

  const t = useCallback((keyPath: string, params?: Record<string, string | number>): string => {
    const keys = keyPath.split(".");
    let value: unknown = dictionaries[locale];

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        // Fallback to vi
        let fallback: unknown = dictionaries.vi;
        for (const fk of keys) {
          if (fallback && typeof fallback === "object" && fk in fallback) {
            fallback = (fallback as Record<string, unknown>)[fk];
          } else {
            fallback = undefined;
            break;
          }
        }
        value = fallback !== undefined ? fallback : keyPath;
        break;
      }
    }

    if (typeof value === "string" && params) {
      return Object.entries(params).reduce((str, [paramKey, paramVal]) => {
        return str.replace(new RegExp(`\\{${paramKey}\\}`, "g"), String(paramVal));
      }, value);
    }

    return typeof value === "string" ? value : keyPath;
  }, [locale]);

  const value = useMemo(() => ({
    locale,
    setLocale,
    t,
    getLocalizedPath,
  }), [locale, setLocale, t, getLocalizedPath]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
};
