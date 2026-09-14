"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeaf, faBolt, faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons";
import { useI18n } from "@/context/I18nContext";
import { Button } from "@/components/ui/button";

interface BoosterPackProps {
  onOpen: () => void;
  isOpening?: boolean;
  count?: number;
}

export const BoosterPack: React.FC<BoosterPackProps> = ({
  onOpen,
  isOpening = false,
  count = 3,
}) => {
  const { t } = useI18n();

  return (
    <div className="flex flex-col items-center justify-center py-6 select-none">
      {/* 2D Foil Booster Pack Container */}
      <div
        onClick={!isOpening ? onOpen : undefined}
        className={`relative w-64 sm:w-72 h-[390px] sm:h-[430px] rounded-2xl cursor-pointer transition-all duration-500 group animate-gentle-float ${
          isOpening ? "scale-95 opacity-50 blur-xs rotate-2" : "hover:scale-103 hover:-translate-y-2"
        }`}
        style={{ perspective: "1000px" }}
      >
        {/* Glow ambient background aura */}
        <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 opacity-40 blur-xl group-hover:opacity-70 transition-opacity duration-500 -z-10" />

        {/* Foil Pouch Body */}
        <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border-2 border-emerald-300/60 dark:border-emerald-500/40 bg-gradient-to-br from-emerald-100 via-slate-100 to-teal-100 dark:from-emerald-950 dark:via-slate-900 dark:to-teal-950 flex flex-col justify-between">
          {/* Hologram Rainbow Foil Sheen Overlay */}
          <div className="absolute inset-0 opacity-40 dark:opacity-30 bg-gradient-to-tr from-rose-400/20 via-amber-300/30 via-emerald-400/30 to-sky-400/20 pointer-events-none animate-holo mix-blend-overlay" />

          {/* Diagonal Foil Reflection Highlight */}
          <div className="absolute -inset-full w-[200%] h-[200%] bg-gradient-to-r from-transparent via-white/40 dark:via-white/15 to-transparent rotate-45 pointer-events-none group-hover:translate-x-full transition-transform duration-1000" />

          {/* Top Crimped / Zigzag Edge */}
          <div className="h-6 w-full bg-gradient-to-b from-emerald-300/70 to-emerald-200/50 dark:from-emerald-800 dark:to-emerald-900 flex items-center justify-center border-b border-emerald-400/40 relative">
            <div className="flex gap-1">
              {Array.from({ length: 18 }).map((_, i) => (
                <div key={i} className="w-2.5 h-1.5 bg-emerald-400/60 dark:bg-emerald-700/60 rounded-xs" />
              ))}
            </div>
            {/* Tear Notch Indicator */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[9px] font-bold text-emerald-800 dark:text-emerald-200 tracking-wider">
              <span>TEAR</span>
              <div className="w-2 h-0.5 bg-emerald-600 dark:bg-emerald-400" />
            </div>
          </div>

          {/* Pack Center Branding & Graphics */}
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center z-10 space-y-4">
            {/* Emblem Circle */}
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center shadow-lg border-4 border-white dark:border-emerald-900 group-hover:scale-105 transition-transform">
                <FontAwesomeIcon icon={faLeaf} className="text-3xl sm:text-4xl drop-shadow-md text-emerald-100" />
              </div>
              <div className="absolute -bottom-2 -right-1 bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">
                x{count}
              </div>
            </div>

            {/* Pack Title */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/60 px-2.5 py-0.5 rounded-full">
                FOODLIFE EDITION
              </span>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                {t("home.packTitle")}
              </h3>
              <p className="text-xs text-muted-foreground font-medium max-w-[200px] mx-auto line-clamp-2">
                {t("home.packDesc")}
              </p>
            </div>

            {/* Rarity Chance Teaser */}
            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground bg-background/60 dark:bg-black/40 px-3 py-1 rounded-full border border-border/40">
              <span className="text-amber-500 font-bold">SSR</span>
              <span>•</span>
              <span className="text-purple-500 font-bold">SR</span>
              <span>•</span>
              <span className="text-sky-500 font-bold">UC</span>
              <span>•</span>
              <span className="text-emerald-600 font-bold">C</span>
            </div>
          </div>

          {/* Bottom Crimped Edge */}
          <div className="h-6 w-full bg-gradient-to-t from-emerald-300/70 to-emerald-200/50 dark:from-emerald-800 dark:to-emerald-900 flex items-center justify-center border-t border-emerald-400/40 relative">
            <div className="flex gap-1">
              {Array.from({ length: 18 }).map((_, i) => (
                <div key={i} className="w-2.5 h-1.5 bg-emerald-400/60 dark:bg-emerald-700/60 rounded-xs" />
              ))}
            </div>
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[8px] font-mono text-emerald-800 dark:text-emerald-300 uppercase tracking-widest">
              100% HEALTHY
            </span>
          </div>
        </div>
      </div>

      {/* Button Under Pack */}
      <div className="mt-6 flex flex-col items-center gap-2">
        <Button
          size="lg"
          onClick={onOpen}
          disabled={isOpening}
          className="rounded-full px-8 py-6 text-base font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/50 transition-all hover:scale-103 cursor-pointer"
        >
          <FontAwesomeIcon icon={faWandMagicSparkles} className="mr-2 text-amber-300" />
          <span>{isOpening ? t("home.discoveredTitle") : t("home.btnOpenPack")}</span>
        </Button>
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <FontAwesomeIcon icon={faBolt} className="text-amber-500 text-[10px]" />
          {t("home.packTearHint")}
        </span>
      </div>
    </div>
  );
};
