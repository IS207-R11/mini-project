"use client";

import React, { useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faFilter,
  faArrowDownWideShort,
  faXmark,
  faRotateLeft,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";
import { useI18n } from "@/context/I18nContext";
import type {
  DietaryFilter,
  PriceFilter,
  Rarity,
} from "@/types/food";
import { allFoods } from "@/lib/foodData";
import { FoodFlashCard } from "@/components/food/FoodFlashCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type SortOption =
  | "name"
  | "price_asc"
  | "price_desc"
  | "calories_asc"
  | "calories_desc"
  | "protein_desc"
  | "rarity_desc";

const rarityOrder: Record<Rarity, number> = {
  SSR: 4,
  SR: 3,
  UC: 2,
  C: 1,
};

export const ResourcesPage: React.FC = () => {
  const { t } = useI18n();

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSession, setSelectedSession] = useState<string>("all");
  const [selectedDiet, setSelectedDiet] = useState<DietaryFilter>("all");
  const [selectedPrice, setSelectedPrice] = useState<PriceFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("name");

  // Filter and sort items
  const filteredFoods = useMemo(() => {
    return allFoods
      .filter((food) => {
        const name = (food.name || "").toLowerCase();
        const nameEn = (food.name_en || "").toLowerCase();
        const sub = (food.sub || "").toLowerCase();
        const quip = (food.quip || "").toLowerCase();
        const ingredients = (food.ingredients || []).join(" ").toLowerCase();
        const q = searchQuery.toLowerCase().trim();

        // Search match
        if (
          q &&
          !name.includes(q) &&
          !nameEn.includes(q) &&
          !sub.includes(q) &&
          !quip.includes(q) &&
          !ingredients.includes(q)
        ) {
          return false;
        }

        // Session match
        if (selectedSession !== "all") {
          if (!food.sessions.includes(selectedSession)) {
            return false;
          }
        }

        // Dietary match
        if (selectedDiet === "veg" && !food.veg) {
          return false;
        }
        if (selectedDiet === "meat" && food.veg) {
          return false;
        }

        // Price match
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
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "price_asc":
            return a.price - b.price;
          case "price_desc":
            return b.price - a.price;
          case "calories_asc":
            return a.macros.calories - b.macros.calories;
          case "calories_desc":
            return b.macros.calories - a.macros.calories;
          case "protein_desc":
            return b.macros.protein - a.macros.protein;
          case "rarity_desc":
            return (rarityOrder[b.rarity] || 0) - (rarityOrder[a.rarity] || 0);
          case "name":
          default:
            return a.name.localeCompare(b.name, "vi");
        }
      });
  }, [searchQuery, selectedSession, selectedDiet, selectedPrice, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedSession("all");
    setSelectedDiet("all");
    setSelectedPrice("all");
    setSortBy("name");
  };

  const hasActiveFilters =
    searchQuery ||
    selectedSession !== "all" ||
    selectedDiet !== "all" ||
    selectedPrice !== "all" ||
    sortBy !== "name";

  return (
    <div className="min-h-[calc(100vh-4rem)] ambient-bg pb-20 transition-colors duration-500">
      {/* ================= PAGE HEADER ================= */}
      <section className="border-b border-emerald-900/10 dark:border-emerald-500/15 bg-background/60 backdrop-blur-xs py-10 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl text-center space-y-3">
          <Badge className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold px-3 py-1 rounded-full">
            <FontAwesomeIcon icon={faUtensils} className="mr-1.5 text-xs text-emerald-600" />
            <span>FoodLife Library</span>
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            {t("resources.title")}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t("resources.subtitle")}
          </p>
        </div>
      </section>

      <div className="container mx-auto max-w-6xl px-4 sm:px-6 pt-8 space-y-6">
        {/* ================= SEARCH & CONTROLS BAR ================= */}
        <div className="p-5 rounded-3xl bg-card/80 dark:bg-card/40 border border-emerald-200/60 dark:border-emerald-800/40 shadow-sm backdrop-blur-md space-y-4">
          {/* Top Search Input */}
          <div className="relative w-full">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("resources.searchPlaceholder")}
              className="w-full pl-11 pr-10 py-3 bg-background border border-border/80 text-foreground text-sm rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <FontAwesomeIcon icon={faXmark} className="text-sm" />
              </button>
            )}
          </div>

          {/* Filter & Sort Controls Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Session Filter */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <FontAwesomeIcon icon={faFilter} className="text-emerald-600 text-[10px]" />
                Buổi Ăn
              </label>
              <select
                value={selectedSession}
                onChange={(e) => setSelectedSession(e.target.value)}
                className="w-full bg-background border border-border/80 text-foreground text-xs font-medium rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                <option value="all">{t("resources.sessionAll")}</option>
                <option value="Sáng sớm">{t("filter.morningSession")}</option>
                <option value="Giữa trưa">{t("filter.middaySession")}</option>
                <option value="Chiều">{t("filter.afternoonSession")}</option>
                <option value="Tối">{t("filter.nightSession")}</option>
              </select>
            </div>

            {/* Dietary Type Filter */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                {t("home.filterDietary")}
              </label>
              <select
                value={selectedDiet}
                onChange={(e) => setSelectedDiet(e.target.value as DietaryFilter)}
                className="w-full bg-background border border-border/80 text-foreground text-xs font-medium rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                <option value="all">{t("filter.allDiet")}</option>
                <option value="veg">{t("filter.veg")}</option>
                <option value="meat">{t("filter.meat")}</option>
              </select>
            </div>

            {/* Price Filter */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                {t("home.filterPrice")}
              </label>
              <select
                value={selectedPrice}
                onChange={(e) => setSelectedPrice(e.target.value as PriceFilter)}
                className="w-full bg-background border border-border/80 text-foreground text-xs font-medium rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                <option value="all">{t("filter.allPrice")}</option>
                <option value="under_50">{t("filter.under50")}</option>
                <option value="50_80">{t("filter.price50_80")}</option>
                <option value="80_120">{t("filter.price80_120")}</option>
                <option value="above_120">{t("filter.above120")}</option>
              </select>
            </div>

            {/* Sort Options */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <FontAwesomeIcon
                  icon={faArrowDownWideShort}
                  className="text-emerald-600 text-[10px]"
                />
                {t("resources.sortBy")}
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full bg-background border border-border/80 text-foreground text-xs font-medium rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                <option value="name">{t("resources.sortDefault")}</option>
                <option value="price_asc">{t("resources.sortPriceAsc")}</option>
                <option value="price_desc">{t("resources.sortPriceDesc")}</option>
                <option value="calories_asc">{t("resources.sortCaloriesAsc")}</option>
                <option value="calories_desc">{t("resources.sortCaloriesDesc")}</option>
                <option value="protein_desc">{t("resources.sortProteinDesc")}</option>
                <option value="rarity_desc">{t("resources.sortRarityDesc")}</option>
              </select>
            </div>
          </div>

          {/* Results Count & Reset Filter Badge */}
          <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs">
            <span className="text-muted-foreground font-medium">
              {t("resources.resultsFound", { count: filteredFoods.length })}
            </span>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="h-7 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-full px-2.5"
              >
                <FontAwesomeIcon icon={faRotateLeft} className="mr-1 text-[10px]" />
                {t("resources.btnReset")}
              </Button>
            )}
          </div>
        </div>

        {/* ================= FOOD FLASHCARDS GRID ================= */}
        {filteredFoods.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {filteredFoods.map((food) => (
              <FoodFlashCard key={food.id} food={food} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center space-y-4 rounded-3xl bg-card/60 border border-dashed border-border/80">
            <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center text-muted-foreground text-2xl">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </div>
            <h3 className="text-lg font-bold text-foreground">
              {t("resources.emptyTitle")}
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
              {t("resources.emptyDesc")}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetFilters}
              className="rounded-full text-xs font-semibold mt-2 border-emerald-300 text-emerald-800 dark:text-emerald-300"
            >
              {t("resources.btnReset")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
