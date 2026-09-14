"use client";

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFire,
  faClock,
  faBookmark,
  faRotate,
  faCheck,
  faWheatAwn,
  faDumbbell,
  faShieldHalved,
  faHeartPulse,
} from "@fortawesome/free-solid-svg-icons";
import type { FoodItem, Rarity } from "@/types/food";
import { useI18n } from "@/context/I18nContext";
import { useSavedFoods } from "@/context/SavedFoodsContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface FoodFlashCardProps {
  food: FoodItem;
  className?: string;
  autoFlipped?: boolean;
}

const rarityColors: Record<
  Rarity,
  {
    badge: string;
    border: string;
    glow: string;
    gradient: string;
  }
> = {
  SSR: {
    badge: "bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black",
    border: "border-amber-400/80 dark:border-amber-400/90",
    glow: "shadow-[0_0_25px_rgba(251,191,36,0.35)]",
    gradient: "from-amber-500/10 via-transparent to-yellow-500/5",
  },
  SR: {
    badge: "bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold",
    border: "border-purple-400/70 dark:border-purple-500/80",
    glow: "shadow-[0_0_20px_rgba(168,85,247,0.3)]",
    gradient: "from-purple-500/10 via-transparent to-indigo-500/5",
  },
  UC: {
    badge: "bg-gradient-to-r from-sky-500 to-blue-500 text-white font-semibold",
    border: "border-sky-400/60 dark:border-sky-500/70",
    glow: "shadow-[0_0_15px_rgba(14,165,233,0.25)]",
    gradient: "from-sky-500/10 via-transparent to-blue-500/5",
  },
  C: {
    badge: "bg-emerald-600 text-white font-medium",
    border: "border-emerald-300 dark:border-emerald-800/80",
    glow: "shadow-sm",
    gradient: "from-emerald-500/5 via-transparent to-transparent",
  },
};

export const FoodFlashCard: React.FC<FoodFlashCardProps> = ({
  food,
  className = "",
  autoFlipped = false,
}) => {
  const { locale, t } = useI18n();
  const { isSaved, toggleSaveFood } = useSavedFoods();
  const [isFlipped, setIsFlipped] = useState(autoFlipped);

  const name = food.name[locale] || food.name.vi;
  const subtitle = food.subtitle[locale] || food.subtitle.vi;
  const description = food.description[locale] || food.description.vi;
  const category = food.category[locale] || food.category.vi;
  const benefits = food.healthBenefits[locale] || food.healthBenefits.vi;
  const ingredients = food.ingredients[locale] || food.ingredients.vi;

  const saved = isSaved(food.id);
  const rarityStyle = rarityColors[food.rarity] || rarityColors.C;

  const handleFlip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSaveFood(food);
  };

  return (
    <div
      className={`perspective-1000 w-full max-w-sm h-[490px] select-none cursor-pointer group ${className}`}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={`relative w-full h-full duration-500 preserve-3d transition-transform ease-out rounded-3xl ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        {/* ================= FRONT SIDE ================= */}
        <div
          className={`absolute inset-0 w-full h-full backface-hidden rounded-3xl border-2 ${
            rarityStyle.border
          } ${rarityStyle.glow} bg-card text-card-foreground flex flex-col overflow-hidden shadow-lg bg-gradient-to-b ${
            rarityStyle.gradient
          }`}
        >
          {/* Top Bar with Rarity & Bookmark */}
          <div className="flex items-center justify-between p-3.5 bg-background/70 backdrop-blur-xs border-b border-border/50 z-10">
            <div className="flex items-center gap-2">
              <Badge className={`px-2.5 py-0.5 text-xs rounded-full uppercase tracking-wider ${rarityStyle.badge}`}>
                {food.rarity} • {t(`rarity.${food.rarity}`)}
              </Badge>
              <span className="text-[11px] font-medium text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full">
                {category}
              </span>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleSave}
              className={`h-8 w-8 rounded-full transition-colors ${
                saved
                  ? "text-emerald-600 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-950/60"
                  : "text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50"
              }`}
              title={saved ? t("card.saved") : t("card.save")}
            >
              <FontAwesomeIcon icon={faBookmark} className="text-sm" />
            </Button>
          </div>

          {/* Dish Image Container */}
          <div className="relative h-48 w-full overflow-hidden bg-muted">
            <img
              src={food.image}
              alt={name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Quick badges on image */}
            <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs text-white drop-shadow-sm font-medium">
              <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full">
                <FontAwesomeIcon icon={faFire} className="text-amber-400 text-xs" />
                <span>{food.nutrition.calories} {t("card.calories")}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full">
                <FontAwesomeIcon icon={faClock} className="text-emerald-300 text-xs" />
                <span>{food.prepTimeMinutes} {t("card.prepTime")}</span>
              </div>
            </div>
          </div>

          {/* Card Body Content */}
          <div className="p-4 flex-1 flex flex-col justify-between">
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-foreground leading-snug line-clamp-1 group-hover:text-emerald-600 transition-colors">
                {name}
              </h3>
              <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium line-clamp-1">
                {subtitle}
              </p>
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed pt-1">
                {description}
              </p>
            </div>

            {/* Mini Macro Preview */}
            <div className="grid grid-cols-3 gap-2 py-2 px-2.5 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-xl border border-emerald-100/60 dark:border-emerald-800/40 text-center my-2">
              <div>
                <span className="block text-[10px] text-muted-foreground font-medium">Đạm (Protein)</span>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  {food.nutrition.protein}g
                </span>
              </div>
              <div>
                <span className="block text-[10px] text-muted-foreground font-medium">Carbs</span>
                <span className="text-xs font-bold text-amber-700 dark:text-amber-300">
                  {food.nutrition.carbs}g
                </span>
              </div>
              <div>
                <span className="block text-[10px] text-muted-foreground font-medium">Béo (Fat)</span>
                <span className="text-xs font-bold text-sky-700 dark:text-sky-300">
                  {food.nutrition.fat}g
                </span>
              </div>
            </div>

            {/* Flip Action Button */}
            <div className="pt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={handleFlip}
                className="w-full text-xs font-semibold rounded-xl border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100/70 dark:hover:bg-emerald-900/40 gap-1.5"
              >
                <FontAwesomeIcon icon={faRotate} className="text-xs" />
                <span>{t("card.flipToNutrition")}</span>
              </Button>
            </div>
          </div>
        </div>

        {/* ================= BACK SIDE (NUTRITION FLASHCARD) ================= */}
        <div
          className={`absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-3xl border-2 ${
            rarityStyle.border
          } ${rarityStyle.glow} bg-card text-card-foreground flex flex-col p-4 overflow-y-auto shadow-lg bg-gradient-to-b ${
            rarityStyle.gradient
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-border/60">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400">
                {t("card.nutritionFacts")}
              </span>
              <h4 className="text-sm font-bold text-foreground line-clamp-1">{name}</h4>
            </div>
            <Badge className={`px-2 py-0.5 text-[10px] rounded-full uppercase ${rarityStyle.badge}`}>
              {food.rarity}
            </Badge>
          </div>

          {/* Calorie Spotlight */}
          <div className="flex items-baseline justify-between py-2.5 px-3 my-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/60 dark:border-emerald-800/50">
            <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
              {t("card.calories")}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-emerald-700 dark:text-emerald-200">
                {food.nutrition.calories}
              </span>
              <span className="text-xs text-muted-foreground font-medium">kcal</span>
            </div>
          </div>

          {/* Macro Progress Breakdown */}
          <div className="space-y-2 py-1">
            {/* Protein */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-medium">
                <span className="text-foreground flex items-center gap-1">
                  <FontAwesomeIcon icon={faDumbbell} className="text-emerald-600 text-[10px]" />
                  {t("card.protein")}
                </span>
                <span className="font-bold text-emerald-700 dark:text-emerald-300">
                  {food.nutrition.protein}g
                </span>
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${Math.min(100, (food.nutrition.protein / 50) * 100)}%` }}
                />
              </div>
            </div>

            {/* Carbs */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-medium">
                <span className="text-foreground flex items-center gap-1">
                  <FontAwesomeIcon icon={faWheatAwn} className="text-amber-600 text-[10px]" />
                  {t("card.carbs")}
                </span>
                <span className="font-bold text-amber-700 dark:text-amber-300">
                  {food.nutrition.carbs}g
                </span>
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${Math.min(100, (food.nutrition.carbs / 80) * 100)}%` }}
                />
              </div>
            </div>

            {/* Fat */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-medium">
                <span className="text-foreground flex items-center gap-1">
                  <FontAwesomeIcon icon={faHeartPulse} className="text-sky-600 text-[10px]" />
                  {t("card.fat")}
                </span>
                <span className="font-bold text-sky-700 dark:text-sky-300">
                  {food.nutrition.fat}g
                </span>
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-sky-500 rounded-full"
                  style={{ width: `${Math.min(100, (food.nutrition.fat / 30) * 100)}%` }}
                />
              </div>
            </div>

            {/* Fiber */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-medium">
                <span className="text-foreground flex items-center gap-1">
                  <FontAwesomeIcon icon={faShieldHalved} className="text-teal-600 text-[10px]" />
                  {t("card.fiber")}
                </span>
                <span className="font-bold text-teal-700 dark:text-teal-300">
                  {food.nutrition.fiber}g
                </span>
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal-500 rounded-full"
                  style={{ width: `${Math.min(100, (food.nutrition.fiber / 15) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Health Benefits Section */}
          <div className="mt-2.5 pt-2 border-t border-border/50">
            <span className="text-[11px] font-bold text-foreground block mb-1">
              {t("card.benefits")}
            </span>
            <ul className="space-y-1">
              {benefits.slice(0, 3).map((benefit, idx) => (
                <li key={idx} className="text-[11px] text-muted-foreground flex items-start gap-1.5 leading-tight">
                  <FontAwesomeIcon icon={faCheck} className="text-emerald-500 text-[10px] mt-0.5 shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Ingredients pills */}
          <div className="mt-2 pt-2 border-t border-border/50">
            <span className="text-[10px] font-semibold text-muted-foreground block mb-1">
              {t("card.ingredients")}
            </span>
            <div className="flex flex-wrap gap-1">
              {ingredients.slice(0, 4).map((ing, idx) => (
                <span
                  key={idx}
                  className="text-[10px] bg-muted px-2 py-0.5 rounded-md text-foreground font-medium"
                >
                  {ing}
                </span>
              ))}
            </div>
          </div>

          {/* Back button */}
          <div className="mt-auto pt-3 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleFlip}
              className="flex-1 text-xs font-semibold rounded-xl border-emerald-300 dark:border-emerald-800 text-foreground hover:bg-emerald-50 gap-1.5"
            >
              <FontAwesomeIcon icon={faRotate} className="text-xs" />
              <span>{t("card.flipToFront")}</span>
            </Button>
            <Button
              variant={saved ? "default" : "secondary"}
              size="sm"
              onClick={handleSave}
              className={`rounded-xl px-3 text-xs font-semibold ${
                saved ? "bg-emerald-600 text-white" : ""
              }`}
            >
              <FontAwesomeIcon icon={faBookmark} className="text-xs" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
