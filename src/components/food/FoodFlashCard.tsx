"use client";

import React, { useState, memo } from "react";
import Image from "next/image";
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
import { Skeleton } from "@/components/ui/skeleton";

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
    glow: "shadow-[0_0_15px_rgba(251,191,36,0.3)]",
    gradient: "from-amber-500/10 via-transparent to-yellow-500/5",
  },
  SR: {
    badge: "bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold",
    border: "border-purple-400/70 dark:border-purple-500/80",
    glow: "shadow-[0_0_12px_rgba(168,85,247,0.25)]",
    gradient: "from-purple-500/10 via-transparent to-indigo-500/5",
  },
  UC: {
    badge: "bg-gradient-to-r from-sky-500 to-blue-500 text-white font-semibold",
    border: "border-sky-400/60 dark:border-sky-500/70",
    glow: "shadow-[0_0_10px_rgba(14,165,233,0.2)]",
    gradient: "from-sky-500/10 via-transparent to-blue-500/5",
  },
  C: {
    badge: "bg-emerald-600 text-white font-medium",
    border: "border-emerald-300 dark:border-emerald-800/80",
    glow: "shadow-xs",
    gradient: "from-emerald-500/5 via-transparent to-transparent",
  },
};

const FoodFlashCardComponent: React.FC<FoodFlashCardProps> = ({
  food,
  className = "",
  autoFlipped = false,
}) => {
  const { locale, t } = useI18n();
  const { isSaved, toggleSaveFood } = useSavedFoods();
  const [isFlipped, setIsFlipped] = useState(autoFlipped);
  const [imgError, setImgError] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const saved = isSaved(food.id);
  const rarityStyle = rarityColors[food.rarity] || rarityColors.C;
  const hasPrice = food.price && food.price > 0;
  const formattedPrice = hasPrice ? formatPrice(food.price) : "";

  const handleFlip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSaveFood(food);
  };

  // Image src path fallback
  const imageSrc = imgError
    ? "/vite.svg"
    : food.imagePath || `/data/images/${food.id}.webp`;

  // Check valid macros (> 0)
  const hasCalories = food.macros?.calories > 0;
  const hasProtein = food.macros?.protein > 0;
  const hasCarbs = food.macros?.carbs > 0;
  const hasFat = food.macros?.fat > 0;
  const hasFiber = food.macros?.fiber > 0;
  const hasAnyMacro = hasProtein || hasCarbs || hasFat;

  // Filter nutritions on back side (hide if 0 or null/undefined)
  const validNutritions = (food.nutritions || []).filter((item) => {
    const calValid = item.calories !== null && item.calories !== undefined && item.calories > 0;
    const proValid = item.protein_g !== null && item.protein_g !== undefined && item.protein_g > 0;
    return calValid || proValid;
  });

  return (
    <div
      className={`perspective-1000 w-full max-w-[240px] sm:max-w-[220px] md:max-w-[210px] h-[370px] select-none cursor-pointer group ${className}`}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={`relative w-full h-full duration-500 preserve-3d transition-transform ease-out rounded-2xl ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        {/* ================= FRONT SIDE ================= */}
        <div
          className={`absolute inset-0 w-full h-full backface-hidden rounded-2xl border ${
            rarityStyle.border
          } ${rarityStyle.glow} bg-card text-card-foreground flex flex-col overflow-hidden shadow-md bg-gradient-to-b ${
            rarityStyle.gradient
          }`}
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between p-2 bg-background/80 backdrop-blur-xs border-b border-border/40 z-10">
            <div className="flex items-center gap-1 flex-wrap">
              <Badge
                className={`px-1.5 py-0.2 text-[9px] rounded-full uppercase tracking-wider ${rarityStyle.badge}`}
              >
                {food.rarity}
              </Badge>

              {food.veg && (
                <Badge className="bg-emerald-600/90 text-white text-[9px] px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                  <FontAwesomeIcon icon={faLeaf} className="text-[8px]" />
                  <span>Chay</span>
                </Badge>
              )}

              {hasPrice && (
                <span className="text-[9px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-950/60 px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                  <FontAwesomeIcon icon={faTag} className="text-[8px]" />
                  {formattedPrice}
                </span>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleSave}
              className={`h-6 w-6 rounded-full transition-colors shrink-0 ${
                saved
                  ? "text-emerald-600 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-950/60"
                  : "text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50"
              }`}
              title={saved ? t("card.saved") : t("card.save")}
            >
              <FontAwesomeIcon icon={faBookmark} className="text-xs" />
            </Button>
          </div>

          {/* Dish Image Container with Skeleton */}
          <div className="relative h-28 w-full overflow-hidden bg-muted shrink-0">
            {!isImageLoaded && (
              <Skeleton className="absolute inset-0 z-10 h-full w-full rounded-none bg-muted animate-pulse" />
            )}
            <Image
              src={imageSrc}
              alt={food.name}
              fill
              unoptimized
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 33vw, 20vw"
              onLoad={() => setIsImageLoaded(true)}
              onError={() => {
                setImgError(true);
                setIsImageLoaded(true);
              }}
              className={`h-full w-full object-cover transition-all duration-500 group-hover:scale-105 ${
                isImageLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

            {/* Calorie & Session Overlays (Only if present/non-zero) */}
            <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between text-[10px] text-white drop-shadow-xs font-medium">
              {hasCalories && (
                <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/20">
                  <FontAwesomeIcon icon={faFire} className="text-amber-400 text-[9px]" />
                  <span>{food.macros.calories} kcal</span>
                </div>
              )}
              {food.sessions && food.sessions.length > 0 && (
                <div className="flex items-center gap-0.5 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded-full border border-white/20 text-[9px]">
                  <span>{food.sessions[0]}</span>
                </div>
              )}
            </div>
          </div>

          {/* Card Body */}
          <div className="p-2.5 flex-1 flex flex-col justify-between overflow-hidden">
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-foreground leading-tight truncate group-hover:text-emerald-600 transition-colors">
                {locale === "en" && food.name_en ? food.name_en : food.name}
              </h3>

              {/* Sub description if present */}
              {food.sub && food.sub.trim() !== "" && (
                <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium truncate">
                  {food.sub}
                </div>
              )}

              {/* Quip Quote Banner (Only if non-empty) */}
              {food.quip && food.quip.trim() !== "" && (
                <div className="flex items-start gap-1 bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 rounded-lg p-1 text-[9px] text-emerald-900 dark:text-emerald-200 italic line-clamp-2">
                  <FontAwesomeIcon
                    icon={faQuoteLeft}
                    className="text-[8px] text-emerald-600 mt-0.5 shrink-0"
                  />
                  <span className="leading-tight">{food.quip}</span>
                </div>
              )}
            </div>

            {/* Mini Macro Preview (Only show items > 0) */}
            {hasAnyMacro && (
              <div className="grid grid-cols-3 gap-1 py-1 px-1.5 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-lg border border-emerald-100/60 dark:border-emerald-800/40 text-center my-0.5">
                {hasProtein && (
                  <div>
                    <span className="block text-[8px] text-muted-foreground font-medium">Đạm</span>
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                      {food.macros.protein}g
                    </span>
                  </div>
                )}
                {hasCarbs && (
                  <div>
                    <span className="block text-[8px] text-muted-foreground font-medium">Carbs</span>
                    <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300">
                      {food.macros.carbs}g
                    </span>
                  </div>
                )}
                {hasFat && (
                  <div>
                    <span className="block text-[8px] text-muted-foreground font-medium">Béo</span>
                    <span className="text-[10px] font-bold text-sky-700 dark:text-sky-300">
                      {food.macros.fat}g
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Flip Action Button */}
            <div className="pt-0.5">
              <Button
                variant="outline"
                size="sm"
                onClick={handleFlip}
                className="w-full h-6 text-[10px] font-semibold rounded-lg border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100/70 dark:hover:bg-emerald-900/40 gap-1 px-1"
              >
                <FontAwesomeIcon icon={faRotate} className="text-[9px]" />
                <span>{t("card.flipToNutrition")}</span>
              </Button>
            </div>
          </div>
        </div>

        {/* ================= BACK SIDE (NUTRITION FLASHCARD) ================= */}
        <div
          className={`absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-2xl border ${
            rarityStyle.border
          } ${rarityStyle.glow} bg-card text-card-foreground flex flex-col p-2.5 overflow-y-auto shadow-md bg-gradient-to-b ${
            rarityStyle.gradient
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-1 border-b border-border/50">
            <div>
              <span className="text-[8px] uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400 block">
                {t("card.nutritionFacts")}
              </span>
              <h4 className="text-xs font-bold text-foreground line-clamp-1">{food.name}</h4>
            </div>
            {hasPrice && (
              <Badge variant="outline" className="text-[9px] font-bold text-amber-700 dark:text-amber-300 border-amber-300 px-1 py-0">
                {formattedPrice}
              </Badge>
            )}
          </div>

          {/* Calorie Spotlight (Only if > 0) */}
          {hasCalories && (
            <div className="flex items-baseline justify-between py-1 px-2 my-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/60 dark:border-emerald-800/50">
              <span className="text-[10px] font-semibold text-emerald-800 dark:text-emerald-300">
                {t("card.calories")}
              </span>
              <div className="flex items-baseline gap-0.5">
                <span className="text-sm font-black text-emerald-700 dark:text-emerald-200">
                  {food.macros.calories}
                </span>
                <span className="text-[9px] text-muted-foreground font-medium">kcal</span>
              </div>
            </div>
          )}

          {/* Macro Breakdown (Only show attributes > 0) */}
          <div className="space-y-1 py-0.5 text-[10px]">
            {hasProtein && (
              <div className="space-y-0.5">
                <div className="flex justify-between text-[9px] font-medium">
                  <span className="text-foreground flex items-center gap-0.5">
                    <FontAwesomeIcon icon={faDumbbell} className="text-emerald-600 text-[8px]" />
                    {t("card.protein")}
                  </span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-300">
                    {food.macros.protein}g
                  </span>
                </div>
                <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${Math.min(100, (food.macros.protein / 50) * 100)}%` }}
                  />
                </div>
              </div>
            )}

            {hasCarbs && (
              <div className="space-y-0.5">
                <div className="flex justify-between text-[9px] font-medium">
                  <span className="text-foreground flex items-center gap-0.5">
                    <FontAwesomeIcon icon={faWheatAwn} className="text-amber-600 text-[8px]" />
                    {t("card.carbs")}
                  </span>
                  <span className="font-bold text-amber-700 dark:text-amber-300">
                    {food.macros.carbs}g
                  </span>
                </div>
                <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${Math.min(100, (food.macros.carbs / 80) * 100)}%` }}
                  />
                </div>
              </div>
            )}

            {hasFat && (
              <div className="space-y-0.5">
                <div className="flex justify-between text-[9px] font-medium">
                  <span className="text-foreground flex items-center gap-0.5">
                    <FontAwesomeIcon icon={faHeartPulse} className="text-sky-600 text-[8px]" />
                    {t("card.fat")}
                  </span>
                  <span className="font-bold text-sky-700 dark:text-sky-300">
                    {food.macros.fat}g
                  </span>
                </div>
                <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sky-500 rounded-full"
                    style={{ width: `${Math.min(100, (food.macros.fat / 30) * 100)}%` }}
                  />
                </div>
              </div>
            )}

            {hasFiber && (
              <div className="space-y-0.5">
                <div className="flex justify-between text-[9px] font-medium">
                  <span className="text-foreground flex items-center gap-0.5">
                    <FontAwesomeIcon icon={faShieldHalved} className="text-teal-600 text-[8px]" />
                    {t("card.fiber")}
                  </span>
                  <span className="font-bold text-teal-700 dark:text-teal-300">
                    {food.macros.fiber}g
                  </span>
                </div>
                <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-teal-500 rounded-full"
                    style={{ width: `${Math.min(100, (food.macros.fiber / 15) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Ingredients list (Only valid items > 0) */}
          {validNutritions.length > 0 && (
            <div className="mt-1 pt-1 border-t border-border/40 flex-1">
              <span className="text-[9px] font-bold text-foreground block mb-1 flex items-center gap-0.5">
                <FontAwesomeIcon icon={faBowlFood} className="text-emerald-600 text-[8px]" />
                <span>{t("card.ingredients")}</span>
              </span>

              <div className="space-y-0.5 max-h-20 overflow-y-auto text-[9px]">
                {validNutritions.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-1 rounded bg-muted/40"
                  >
                    <span className="font-medium text-foreground capitalize truncate max-w-[110px]">
                      {item.name}
                    </span>
                    <div className="flex items-center gap-1 text-[8px] text-muted-foreground shrink-0">
                      {item.calories !== null && item.calories !== undefined && item.calories > 0 && (
                        <span className="text-amber-700 dark:text-amber-300 font-semibold">
                          {item.calories} kcal
                        </span>
                      )}
                      {item.protein_g !== null && item.protein_g !== undefined && item.protein_g > 0 && (
                        <span className="text-emerald-700 dark:text-emerald-300 font-semibold">
                          {item.protein_g}g đạm
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Back button & Bookmark */}
          <div className="mt-1.5 pt-1 border-t border-border/40 flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={handleFlip}
              className="flex-1 h-6 text-[10px] font-semibold rounded-lg border-emerald-300 dark:border-emerald-800 text-foreground hover:bg-emerald-50 gap-1 px-1"
            >
              <FontAwesomeIcon icon={faRotate} className="text-[9px]" />
              <span>{t("card.flipToFront")}</span>
            </Button>
            <Button
              variant={saved ? "default" : "secondary"}
              size="sm"
              onClick={handleSave}
              className={`h-6 rounded-lg px-2 text-[10px] font-semibold ${
                saved ? "bg-emerald-600 text-white" : ""
              }`}
            >
              <FontAwesomeIcon icon={faBookmark} className="text-[9px]" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const FoodFlashCard = memo(FoodFlashCardComponent);
