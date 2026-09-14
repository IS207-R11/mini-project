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
import type { FoodItem, DietaryType, MealTime, Rarity } from "@/types/food";
import foodsDataRaw from "@/data/foods.json";
import { FoodFlashCard } from "@/components/food/FoodFlashCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const allFoods: FoodItem[] = foodsDataRaw as FoodItem[];

type SortOption =
  | "name"
  | "calories_asc"
  | "calories_desc"
  | "protein_desc"
  | "time_asc"
  | "rarity_desc";

const rarityOrder: Record<Rarity, number> = {
  SSR: 4,
  SR: 3,
  UC: 2,
  C: 1,
};

export const ResourcesPage: React.FC = () => {
  const { locale, t } = useI18n();

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDiet, setSelectedDiet] = useState<DietaryType>("all");
  const [selectedMealTime, setSelectedMealTime] = useState<MealTime | "all">("all");
  const [sortBy, setSortBy] = useState<SortOption>("name");

  // Extract unique categories based on current locale
  const categories = useMemo(() => {
    const set = new Set<string>();
    allFoods.forEach((item) => {
      const cat = item.category[locale] || item.category.vi;
      if (cat) set.add(cat);
    });
    return Array.from(set);
  }, [locale]);

  // Filter and sort items
  const filteredFoods = useMemo(() => {
    return allFoods
      .filter((food) => {
        const name = (food.name[locale] || food.name.vi).toLowerCase();
        const sub = (food.subtitle[locale] || food.subtitle.vi).toLowerCase();
        const desc = (food.description[locale] || food.description.vi).toLowerCase();
        const ingredients = (food.ingredients[locale] || food.ingredients.vi).join(" ").toLowerCase();
        const q = searchQuery.toLowerCase().trim();

        // Search match
        if (q && !name.includes(q) && !sub.includes(q) && !desc.includes(q) && !ingredients.includes(q)) {
          return false;
        }

        // Category match
        if (selectedCategory !== "all") {
          const cat = food.category[locale] || food.category.vi;
          if (cat !== selectedCategory) return false;
        }

        // Diet match
        if (selectedDiet !== "all") {
          if (selectedDiet === "vegan" && food.dietaryType !== "vegan") return false;
          if (selectedDiet === "vegetarian" && !["vegetarian", "vegan"].includes(food.dietaryType)) return false;
          if (selectedDiet === "meat" && food.dietaryType !== "meat") return false;
          if (selectedDiet === "eatclean" && food.dietaryType !== "eatclean") return false;
          if (selectedDiet === "keto" && !["keto", "lowcarb"].includes(food.dietaryType)) return false;
        }

        // Meal time match
        if (selectedMealTime !== "all") {
          if (!food.mealTime.includes(selectedMealTime) && !food.mealTime.includes("all")) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        const nameA = a.name[locale] || a.name.vi;
        const nameB = b.name[locale] || b.name.vi;

        switch (sortBy) {
          case "calories_asc":
            return a.nutrition.calories - b.nutrition.calories;
          case "calories_desc":
            return b.nutrition.calories - a.nutrition.calories;
          case "protein_desc":
            return b.nutrition.protein - a.nutrition.protein;
          case "time_asc":
            return a.prepTimeMinutes - b.prepTimeMinutes;
          case "rarity_desc":
            return (rarityOrder[b.rarity] || 0) - (rarityOrder[a.rarity] || 0);
          case "name":
          default:
            return nameA.localeCompare(nameB);
        }
      });
  }, [locale, searchQuery, selectedCategory, selectedDiet, selectedMealTime, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedDiet("all");
    setSelectedMealTime("all");
    setSortBy("name");
  };

  const hasActiveFilters =
    searchQuery || selectedCategory !== "all" || selectedDiet !== "all" || selectedMealTime !== "all";

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
            {/* Category Filter */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <FontAwesomeIcon icon={faFilter} className="text-emerald-600 text-[10px]" />
                Phân Loại
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-background border border-border/80 text-foreground text-xs font-medium rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                <option value="all">{t("resources.categoryAll")}</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Dietary Type Filter */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                {t("home.filterDietary")}
              </label>
              <select
                value={selectedDiet}
                onChange={(e) => setSelectedDiet(e.target.value as DietaryType)}
                className="w-full bg-background border border-border/80 text-foreground text-xs font-medium rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                <option value="all">{t("filter.all")}</option>
                <option value="eatclean">{t("filter.eatclean")}</option>
                <option value="vegetarian">{t("filter.vegetarian")}</option>
                <option value="vegan">{t("filter.vegan")}</option>
                <option value="meat">{t("filter.meat")}</option>
                <option value="keto">{t("filter.keto")}</option>
              </select>
            </div>

            {/* Meal Time Filter */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                {t("home.filterMealTime")}
              </label>
              <select
                value={selectedMealTime}
                onChange={(e) => setSelectedMealTime(e.target.value as MealTime | "all")}
                className="w-full bg-background border border-border/80 text-foreground text-xs font-medium rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                <option value="all">{t("filter.all")}</option>
                <option value="breakfast">{t("filter.breakfast")}</option>
                <option value="lunch">{t("filter.lunch")}</option>
                <option value="afternoon">{t("filter.afternoon")}</option>
                <option value="dinner">{t("filter.dinner")}</option>
              </select>
            </div>

            {/* Sort Options */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <FontAwesomeIcon icon={faArrowDownWideShort} className="text-emerald-600 text-[10px]" />
                {t("resources.sortBy")}
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full bg-background border border-border/80 text-foreground text-xs font-medium rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                <option value="name">{t("resources.sortDefault")}</option>
                <option value="calories_asc">{t("resources.sortCaloriesAsc")}</option>
                <option value="calories_desc">{t("resources.sortCaloriesDesc")}</option>
                <option value="protein_desc">{t("resources.sortProteinDesc")}</option>
                <option value="time_asc">{t("resources.sortTimeAsc")}</option>
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
