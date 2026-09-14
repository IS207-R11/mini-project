"use client";

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFire,
  faBookmark,
  faRotate,
  faWheatAwn,
  faDumbbell,
  faHeartPulse,
  faShieldHalved,
  faTag,
  faQuoteLeft,
  faLeaf,
  faBowlFood,
} from "@fortawesome/free-solid-svg-icons";
import type { FoodItem, Rarity } from "@/types/food";
import { useI18n } from "@/context/I18nContext";
import { useSavedFoods } from "@/context/SavedFoodsContext";
import { formatPrice } from "@/lib/foodData";
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
  const [imgError, setImgError] = useState(false);

  const saved = isSaved(food.id);
  const rarityStyle = rarityColors[food.rarity] || rarityColors.C;
  const formattedPrice = formatPrice(food.price);

  const handleFlip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSaveFood(food);
  };

  // Image path: `/data/images/${food.id}.webp`
  const imageSrc = imgError
    ? "/placeholder-food.png"
    : food.imagePath || `/data/images/${food.id}.webp`;

  return (
    <div
      className={`perspective-1000 w-full max-w-sm h-[520px] select-none cursor-pointer group ${className}`}
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
          {/* Top Bar with Rarity, Price, Veg & Bookmark */}
          <div className="flex items-center justify-between p-3 bg-background/80 backdrop-blur-xs border-b border-border/50 z-10">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Badge
                className={`px-2 py-0.5 text-[11px] rounded-full uppercase tracking-wider ${rarityStyle.badge}`}
              >
                {food.rarity} • {t(`rarity.${food.rarity}`)}
              </Badge>

              {food.veg && (
                <Badge className="bg-emerald-600/90 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                  <FontAwesomeIcon icon={faLeaf} className="text-[9px]" />
                  <span>Chay</span>
                </Badge>
              )}

              <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-950/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                <FontAwesomeIcon icon={faTag} className="text-[9px]" />
                {formattedPrice}
              </span>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleSave}
              className={`h-8 w-8 rounded-full transition-colors shrink-0 ${
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
          <div className="relative h-44 w-full overflow-hidden bg-muted shrink-0">
            <img
              src={imageSrc}
              alt={food.name}
              onError={() => setImgError(true)}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Quick calorie and session overlays on image */}
            <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-xs text-white drop-shadow-sm font-medium">
              <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                <FontAwesomeIcon icon={faFire} className="text-amber-400 text-xs" />
                <span>
                  {food.macros.calories} {t("card.calories")}
                </span>
              </div>
              <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full border border-white/20 text-[10px]">
                <span>{food.sessions?.slice(0, 2).join(" • ")}</span>
              </div>
            </div>
          </div>

          {/* Card Body Content */}
          <div className="p-3.5 flex-1 flex flex-col justify-between overflow-hidden">
            <div className="space-y-1.5">
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="text-base font-black text-foreground leading-snug truncate group-hover:text-emerald-600 transition-colors">
                  {locale === "en" && food.name_en ? food.name_en : food.name}
                </h3>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-medium truncate">
                <span>{food.sub}</span>
                {locale === "en" ? (
                  food.name !== food.name_en && (
                    <>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground italic truncate">
                        {food.name}
                      </span>
                    </>
                  )
                ) : (
                  food.name_en && food.name_en !== food.name && (
                    <>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground italic truncate">
                        {food.name_en}
                      </span>
                    </>
                  )
                )}
              </div>

              {/* Quip Quote Banner */}
              {food.quip && (
                <div className="flex items-start gap-1.5 bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 rounded-xl p-2 my-1 text-xs text-emerald-900 dark:text-emerald-200 italic line-clamp-2">
                  <FontAwesomeIcon
                    icon={faQuoteLeft}
                    className="text-[10px] text-emerald-600 mt-0.5 shrink-0"
                  />
                  <span className="leading-tight">{food.quip}</span>
                </div>
              )}
            </div>

            {/* Mini Macro Preview */}
            <div className="grid grid-cols-3 gap-1.5 py-1.5 px-2 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-xl border border-emerald-100/60 dark:border-emerald-800/40 text-center my-1">
              <div>
                <span className="block text-[10px] text-muted-foreground font-medium">
                  Đạm (Protein)
                </span>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  {food.macros.protein}g
                </span>
              </div>
              <div>
                <span className="block text-[10px] text-muted-foreground font-medium">
                  Carbs
                </span>
                <span className="text-xs font-bold text-amber-700 dark:text-amber-300">
                  {food.macros.carbs}g
                </span>
              </div>
              <div>
                <span className="block text-[10px] text-muted-foreground font-medium">
                  Béo (Fat)
                </span>
                <span className="text-xs font-bold text-sky-700 dark:text-sky-300">
                  {food.macros.fat}g
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
              <h4 className="text-sm font-bold text-foreground line-clamp-1">{food.name}</h4>
            </div>
            <div className="flex items-center gap-1.5">
              <Badge className={`px-2 py-0.5 text-[10px] rounded-full uppercase ${rarityStyle.badge}`}>
                {food.rarity}
              </Badge>
              <Badge variant="outline" className="text-[10px] font-bold text-amber-700 dark:text-amber-300 border-amber-300">
                {formattedPrice}
              </Badge>
            </div>
          </div>

          {/* Calorie Spotlight */}
          <div className="flex items-baseline justify-between py-2 px-3 my-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/60 dark:border-emerald-800/50">
            <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
              {t("card.calories")}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-emerald-700 dark:text-emerald-200">
                {food.macros.calories}
              </span>
              <span className="text-xs text-muted-foreground font-medium">kcal</span>
            </div>
          </div>

          {/* Macro Progress Breakdown */}
          <div className="space-y-1.5 py-1">
            {/* Protein */}
            <div className="space-y-0.5">
              <div className="flex justify-between text-[11px] font-medium">
                <span className="text-foreground flex items-center gap-1">
                  <FontAwesomeIcon icon={faDumbbell} className="text-emerald-600 text-[10px]" />
                  {t("card.protein")}
                </span>
                <span className="font-bold text-emerald-700 dark:text-emerald-300">
                  {food.macros.protein}g
                </span>
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${Math.min(100, (food.macros.protein / 50) * 100)}%` }}
                />
              </div>
            </div>

            {/* Carbs */}
            <div className="space-y-0.5">
              <div className="flex justify-between text-[11px] font-medium">
                <span className="text-foreground flex items-center gap-1">
                  <FontAwesomeIcon icon={faWheatAwn} className="text-amber-600 text-[10px]" />
                  {t("card.carbs")}
                </span>
                <span className="font-bold text-amber-700 dark:text-amber-300">
                  {food.macros.carbs}g
                </span>
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${Math.min(100, (food.macros.carbs / 80) * 100)}%` }}
                />
              </div>
            </div>

            {/* Fat */}
            <div className="space-y-0.5">
              <div className="flex justify-between text-[11px] font-medium">
                <span className="text-foreground flex items-center gap-1">
                  <FontAwesomeIcon icon={faHeartPulse} className="text-sky-600 text-[10px]" />
                  {t("card.fat")}
                </span>
                <span className="font-bold text-sky-700 dark:text-sky-300">
                  {food.macros.fat}g
                </span>
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-sky-500 rounded-full"
                  style={{ width: `${Math.min(100, (food.macros.fat / 30) * 100)}%` }}
                />
              </div>
            </div>

            {/* Fiber */}
            <div className="space-y-0.5">
              <div className="flex justify-between text-[11px] font-medium">
                <span className="text-foreground flex items-center gap-1">
                  <FontAwesomeIcon icon={faShieldHalved} className="text-teal-600 text-[10px]" />
                  {t("card.fiber")}
                </span>
                <span className="font-bold text-teal-700 dark:text-teal-300">
                  {food.macros.fiber}g
                </span>
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal-500 rounded-full"
                  style={{ width: `${Math.min(100, (food.macros.fiber / 15) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Ingredients with detailed portion & nutrition breakdown */}
          <div className="mt-2 pt-2 border-t border-border/50 flex-1">
            <span className="text-[11px] font-bold text-foreground block mb-1.5 flex items-center gap-1">
              <FontAwesomeIcon icon={faBowlFood} className="text-emerald-600 text-xs" />
              <span>{t("card.ingredients")}</span>
            </span>

            <div className="space-y-1 max-h-32 overflow-y-auto pr-1 text-[11px]">
              {food.nutritions?.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-1.5 rounded-lg bg-muted/40 hover:bg-muted/70 transition-colors"
                >
                  <span className="font-medium text-foreground capitalize truncate max-w-[150px]">
                    {item.name}
                  </span>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground shrink-0">
                    {item.calories !== null && item.calories !== undefined && (
                      <span className="text-amber-700 dark:text-amber-300 font-semibold">
                        {item.calories} kcal
                      </span>
                    )}
                    {item.protein_g !== null && item.protein_g !== undefined && item.protein_g > 0 && (
                      <span className="text-emerald-700 dark:text-emerald-300">
                        {item.protein_g}g đạm
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sessions badges */}
          <div className="mt-2 pt-2 border-t border-border/50 flex items-center justify-between text-[10px]">
            <span className="text-muted-foreground font-medium">{t("card.sessions")}:</span>
            <div className="flex gap-1 flex-wrap justify-end">
              {food.sessions?.map((s, idx) => (
                <span
                  key={idx}
                  className="bg-emerald-100/70 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.5 rounded-md font-semibold"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Back button & Bookmark */}
          <div className="mt-2.5 pt-2 border-t border-border/50 flex gap-2">
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
