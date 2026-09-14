"use client";

import React, { useState, useMemo, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faSun,
  faMoon,
  faRotate,
  faBookmark,
  faArrowLeft,
  faCheck,
  faFilter,
  faWandMagicSparkles,
} from "@fortawesome/free-solid-svg-icons";
import { useI18n } from "@/context/I18nContext";
import { useTimeTheme } from "@/context/TimeThemeContext";
import type { ThemeMode } from "@/context/TimeThemeContext";
import { useSavedFoods } from "@/context/SavedFoodsContext";
import type {
  FoodItem,
  Rarity,
  DietaryFilter,
  PriceFilter,
  SessionFilter,
} from "@/types/food";
import { allFoods } from "@/lib/foodData";
import { BoosterPack } from "@/components/gacha/BoosterPack";
import { RevealAnimation } from "@/components/gacha/RevealAnimation";
import { FoodFlashCard } from "@/components/food/FoodFlashCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type GachaState = "pack" | "opening" | "revealed";

export const HomePage: React.FC = () => {
  const { t } = useI18n();
  const {
    currentTime,
    period,
    themeMode,
    setThemeMode,
    recommendedSession,
  } = useTimeTheme();
  const { saveMultiple } = useSavedFoods();

  // Filters State
  const [dishCount, setDishCount] = useState<number>(3);
  const [selectedDiet, setSelectedDiet] = useState<DietaryFilter>("all");
  const [selectedPrice, setSelectedPrice] = useState<PriceFilter>("all");
  const [selectedSession, setSelectedSession] = useState<SessionFilter>("auto");

  // Gacha Lifecycle
  const [gachaState, setGachaState] = useState<GachaState>("pack");
  const [revealedDishes, setRevealedDishes] = useState<FoodItem[]>([]);
  const [highestRarity, setHighestRarity] = useState<Rarity>("C");
  const [savedAllSuccess, setSavedAllSuccess] = useState(false);

  // Active meal session determination
  const effectiveSession =
    selectedSession === "auto" ? recommendedSession : selectedSession;

  // Filtered candidates pool
  const candidatePool = useMemo(() => {
    return allFoods.filter((food) => {
      // Session matching
      if (
        effectiveSession !== "all" &&
        !food.sessions.includes(effectiveSession)
      ) {
        return false;
      }

      // Dietary filter
      if (selectedDiet === "veg" && !food.veg) {
        return false;
      }
      if (selectedDiet === "meat" && food.veg) {
        return false;
      }

      // Price filter
      if (selectedPrice === "under_50" && food.price >= 50) return false;
      if (
        selectedPrice === "50_80" &&
        (food.price < 50 || food.price > 80)
      ) {
        return false;
      }
      if (
        selectedPrice === "80_120" &&
        (food.price <= 80 || food.price > 120)
      ) {
        return false;
      }
      if (selectedPrice === "above_120" && food.price <= 120) return false;

      return true;
    });
  }, [effectiveSession, selectedDiet, selectedPrice]);

  // Safe pool fallback
  const safePool = useMemo(() => {
    if (candidatePool.length >= dishCount) return candidatePool;
    // If strict pool has too few items, relax price / diet fallback
    const relaxed = allFoods.filter((f) =>
      effectiveSession !== "all" ? f.sessions.includes(effectiveSession) : true
    );
    return relaxed.length >= dishCount ? relaxed : allFoods;
  }, [candidatePool, effectiveSession, dishCount]);

  // Gacha draw function
  const handleStartGacha = useCallback(() => {
    const pool = [...safePool];
    // Fisher-Yates shuffle
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    const selected = pool.slice(0, dishCount);
    setRevealedDishes(selected);

    // Compute highest rarity for reveal animation
    const rarities: Rarity[] = ["SSR", "SR", "UC", "C"];
    let maxRarity: Rarity = "C";
    for (const r of rarities) {
      if (selected.some((item) => item.rarity === r)) {
        maxRarity = r;
        break;
      }
    }
    setHighestRarity(maxRarity);
    setSavedAllSuccess(false);

    // Trigger reveal sequence
    setGachaState("opening");
  }, [safePool, dishCount]);

  const handleRevealFinished = useCallback(() => {
    setGachaState("revealed");
  }, []);

  const handleSaveAll = useCallback(() => {
    if (revealedDishes.length > 0) {
      saveMultiple(revealedDishes);
      setSavedAllSuccess(true);
      setTimeout(() => setSavedAllSuccess(false), 3000);
    }
  }, [revealedDishes, saveMultiple]);

  const handleResetToPack = useCallback(() => {
    setGachaState("pack");
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] ambient-bg pb-16 transition-colors duration-500">
      {/* ================= REVEAL ANIMATION OVERLAY ================= */}
      {gachaState === "opening" && (
        <RevealAnimation
          highestRarity={highestRarity}
          onFinish={handleRevealFinished}
        />
      )}

      {/* ================= TOP TIME & GREETING BAR ================= */}
      <section className="border-b border-emerald-900/10 dark:border-emerald-500/15 bg-background/60 backdrop-blur-xs py-4 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="h-10 w-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-300/40">
              <FontAwesomeIcon
                icon={period === "night" ? faMoon : faSun}
                className="text-base"
              />
            </div>
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span suppressHydrationWarning className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  {t(`time.${period}Greeting`)}
                </span>
                <span suppressHydrationWarning className="text-[11px] text-muted-foreground font-mono bg-muted/60 px-2 py-0.5 rounded-full">
                  <FontAwesomeIcon icon={faClock} className="mr-1 text-xs" />
                  {currentTime}
                </span>
              </div>
              <p suppressHydrationWarning className="text-xs text-muted-foreground font-medium mt-0.5">
                {t(`time.${period}Sub`)}
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
              {t("filter.auto")}
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
                {t(`time.${mode}`)}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-6xl px-4 sm:px-6 pt-8">
        {/* ================= HERO HEADER ================= */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5 mb-8">
          <Badge className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold px-3 py-1 rounded-full border border-emerald-200/60">
            <FontAwesomeIcon icon={faWandMagicSparkles} className="mr-1.5 text-xs text-amber-500" />
            {t("home.badge")}
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            {t("home.title")}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {t("home.subtitle")}
          </p>
        </div>

        {/* ================= FILTER BAR ================= */}
        <div className="max-w-4xl mx-auto mb-10 p-4 sm:p-5 rounded-3xl bg-card/70 dark:bg-card/40 border border-emerald-200/60 dark:border-emerald-800/40 shadow-sm backdrop-blur-md space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
            <FontAwesomeIcon icon={faFilter} className="text-emerald-600" />
            <span>Tùy Chỉnh Gói Gợi Ý Món Ăn</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* Quantity Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                {t("home.filterCount")}
              </label>
              <div className="flex gap-1 bg-muted/60 p-1 rounded-xl">
                {[1, 3, 5].map((cnt) => (
                  <button
                    key={cnt}
                    onClick={() => setDishCount(cnt)}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      dishCount === cnt
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {cnt} món
                  </button>
                ))}
              </div>
            </div>

            {/* Dietary Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                {t("home.filterDietary")}
              </label>
              <select
                value={selectedDiet}
                onChange={(e) => setSelectedDiet(e.target.value as DietaryFilter)}
                className="w-full bg-background border border-border/80 text-foreground text-xs font-medium rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden shadow-xs"
              >
                <option value="all">{t("filter.allDiet")}</option>
                <option value="veg">{t("filter.veg")}</option>
                <option value="meat">{t("filter.meat")}</option>
              </select>
            </div>

            {/* Price Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                {t("home.filterPrice")}
              </label>
              <select
                value={selectedPrice}
                onChange={(e) => setSelectedPrice(e.target.value as PriceFilter)}
                className="w-full bg-background border border-border/80 text-foreground text-xs font-medium rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden shadow-xs"
              >
                <option value="all">{t("filter.allPrice")}</option>
                <option value="under_50">{t("filter.under50")}</option>
                <option value="50_80">{t("filter.price50_80")}</option>
                <option value="80_120">{t("filter.price80_120")}</option>
                <option value="above_120">{t("filter.above120")}</option>
              </select>
            </div>

            {/* Meal Session Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                {t("home.filterSession")}
              </label>
              <select
                value={selectedSession}
                onChange={(e) => setSelectedSession(e.target.value as SessionFilter)}
                className="w-full bg-background border border-border/80 text-foreground text-xs font-medium rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden shadow-xs"
              >
                <option value="auto">
                  {t("filter.auto")} ({recommendedSession})
                </option>
                <option value="Sáng sớm">{t("filter.morningSession")}</option>
                <option value="Giữa trưa">{t("filter.middaySession")}</option>
                <option value="Chiều">{t("filter.afternoonSession")}</option>
                <option value="Tối">{t("filter.nightSession")}</option>
                <option value="all">{t("filter.all")}</option>
              </select>
            </div>
          </div>
        </div>

        {/* ================= CENTRAL GACHA BOOSTER PACK AREA ================= */}
        {gachaState === "pack" && (
          <div className="py-4 flex flex-col items-center justify-center">
            <BoosterPack
              onOpen={handleStartGacha}
              count={dishCount}
            />
          </div>
        )}

        {/* ================= REVEALED RESULTS FLASHCARDS GRID ================= */}
        {gachaState === "revealed" && (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header with count and instructions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border/60 shadow-xs">
              <div className="space-y-0.5 text-center sm:text-left">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                  {t("home.discoveredTitle")}
                </span>
                <h3 className="text-xl font-black text-foreground">
                  {t("home.discoveredCount", { n: revealedDishes.length })}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {t("home.cardFrontHint")}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 justify-center sm:justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleStartGacha}
                  className="rounded-full text-xs font-semibold gap-1.5 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-50"
                >
                  <FontAwesomeIcon icon={faRotate} className="text-xs" />
                  <span>{t("home.btnReroll")}</span>
                </Button>

                <Button
                  variant="default"
                  size="sm"
                  onClick={handleSaveAll}
                  className="rounded-full text-xs font-semibold gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm"
                >
                  <FontAwesomeIcon
                    icon={savedAllSuccess ? faCheck : faBookmark}
                    className="text-xs"
                  />
                  <span>
                    {savedAllSuccess
                      ? t("home.btnSavedAllSuccess")
                      : t("home.btnSaveAll")}
                  </span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResetToPack}
                  className="rounded-full text-xs font-semibold text-muted-foreground hover:text-foreground gap-1.5"
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
                  <span>{t("home.btnBackToPack")}</span>
                </Button>
              </div>
            </div>

            {/* Flashcards Grid */}
            <div
              className={`grid gap-6 justify-items-center ${
                revealedDishes.length === 1
                  ? "grid-cols-1 max-w-sm mx-auto"
                  : revealedDishes.length === 3
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
              }`}
            >
              {revealedDishes.map((food) => (
                <FoodFlashCard key={food.id} food={food} />
              ))}
            </div>

            {/* Bottom Back Button */}
            <div className="text-center pt-4">
              <Button
                variant="outline"
                size="lg"
                onClick={handleResetToPack}
                className="rounded-full px-8 font-bold border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-50 gap-2 shadow-sm"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
                <span>{t("home.btnBackToPack")}</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
