"use client";

import React, { useState, memo } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFire,
  faBookmark,
  faRotate,
  faTag,
  faLeaf,
} from "@fortawesome/free-solid-svg-icons";
import type { FoodItem, Rarity } from "@/types/food";
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
    glow: "shadow-[0_0_12px_rgba(251,191,36,0.25)]",
    gradient: "from-amber-500/10 via-transparent to-yellow-500/5",
  },
  SR: {
    badge: "bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold",
    border: "border-purple-400/70 dark:border-purple-500/80",
    glow: "shadow-[0_0_10px_rgba(168,85,247,0.2)]",
    gradient: "from-purple-500/10 via-transparent to-indigo-500/5",
  },
  UC: {
    badge: "bg-gradient-to-r from-sky-500 to-blue-500 text-white font-semibold",
    border: "border-sky-400/60 dark:border-sky-500/70",
    glow: "shadow-[0_0_8px_rgba(14,165,233,0.15)]",
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
  const { isSaved, toggleSaveFood } = useSavedFoods();
  const [isFlipped, setIsFlipped] = useState(autoFlipped);
  const [imgError, setImgError] = useState(false);

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
    const calValid =
      item.calories !== null && item.calories !== undefined && item.calories > 0;
    const proValid =
      item.protein_g !== null && item.protein_g !== undefined && item.protein_g > 0;
    return calValid || proValid;
  });

  return (
    <div
      className={`perspective-1000 w-full max-w-[220px] sm:max-w-[200px] h-[265px] select-none cursor-pointer group ${className}`}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={`relative w-full h-full duration-500 preserve-3d transition-transform ease-out rounded-2xl transform-gpu will-change-transform ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        {/* ================= FRONT SIDE ================= */}
        <div
          className={`absolute inset-0 w-full h-full backface-hidden rounded-2xl border ${
            rarityStyle.border
          } ${rarityStyle.glow} bg-card text-card-foreground flex flex-col overflow-hidden shadow-xs hover:shadow-md transition-shadow bg-gradient-to-b ${
            rarityStyle.gradient
          } ${isFlipped ? "pointer-events-none" : "pointer-events-auto"}`}
        >
          {/* Dish Image Container with Badges Overlaid */}
          <div className="relative h-28 w-full overflow-hidden bg-muted/80 shrink-0">
            <Image
              src={imageSrc}
              alt={food.name}
              fill
              unoptimized
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
              onError={() => setImgError(true)}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-black/40" />

            {/* Top Badges Over Image */}
            <div className="absolute top-1.5 left-1.5 right-1.5 flex items-center justify-between z-10">
              <div className="flex items-center gap-1">
                <Badge
                  className={`px-1.5 py-0 text-[8px] font-black rounded-full uppercase tracking-wider ${rarityStyle.badge}`}
                >
                  {food.rarity}
                </Badge>
                {food.veg && (
                  <Badge className="bg-emerald-600/95 text-white text-[8px] px-1 py-0 rounded-full flex items-center gap-0.5">
                    <FontAwesomeIcon icon={faLeaf} className="text-[7px]" />
                    <span>Chay</span>
                  </Badge>
                )}
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleSave}
                className={`h-5 w-5 rounded-full backdrop-blur-md transition-colors shrink-0 ${
                  saved
                    ? "text-emerald-400 bg-emerald-950/80 border border-emerald-500/50"
                    : "text-white/90 bg-black/40 hover:text-emerald-400 hover:bg-black/60"
                }`}
                title={saved ? "Đã lưu" : "Lưu món"}
              >
                <FontAwesomeIcon icon={faBookmark} className="text-[10px]" />
              </Button>
            </div>

            {/* Bottom Details Over Image */}
            <div className="absolute bottom-1 left-1.5 right-1.5 flex items-center justify-between text-[9px] text-white font-medium drop-shadow-xs">
              {hasCalories ? (
                <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-1.5 py-0.2 rounded-full border border-white/20">
                  <FontAwesomeIcon icon={faFire} className="text-amber-400 text-[8px]" />
                  <span className="font-bold">{food.macros.calories}</span>
                  <span className="text-[8px] text-white/80">kcal</span>
                </div>
              ) : (
                <span />
              )}

              {hasPrice && (
                <span className="text-[9px] font-bold text-amber-300 bg-black/60 backdrop-blur-md px-1.5 py-0.2 rounded-full border border-amber-400/30 flex items-center gap-0.5">
                  <FontAwesomeIcon icon={faTag} className="text-[7px]" />
                  {formattedPrice}
                </span>
              )}
            </div>
          </div>

          {/* Card Body */}
          <div className="p-2 flex-1 flex flex-col justify-between overflow-hidden">
            <div className="space-y-0.5">
              <h3 className="text-xs font-bold text-foreground leading-tight truncate group-hover:text-emerald-600 transition-colors">
                {food.name}
              </h3>

              {food.sub && food.sub.trim() !== "" ? (
                <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium truncate">
                  {food.sub}
                </div>
              ) : (
                food.sessions &&
                food.sessions.length > 0 && (
                  <div className="text-[9px] text-muted-foreground truncate">
                    Buổi: {food.sessions.join(", ")}
                  </div>
                )
              )}
            </div>

            {/* Compact Macro Row */}
            {hasAnyMacro && (
              <div className="flex items-center justify-between text-[9px] py-0.5 px-1.5 bg-muted/50 rounded-lg border border-border/40 font-medium">
                {hasProtein && (
                  <span className="text-emerald-700 dark:text-emerald-300 font-semibold">
                    Đạm {food.macros.protein}g
                  </span>
                )}
                {hasCarbs && (
                  <span className="text-amber-700 dark:text-amber-300 font-semibold">
                    Carbs {food.macros.carbs}g
                  </span>
                )}
                {hasFat && (
                  <span className="text-sky-700 dark:text-sky-300 font-semibold">
                    Béo {food.macros.fat}g
                  </span>
                )}
              </div>
            )}

            {/* Compact Flip Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleFlip}
              className="w-full h-5 text-[9px] font-semibold rounded-md border-emerald-300/80 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/40 gap-1 px-1 mt-0.5"
            >
              <FontAwesomeIcon icon={faRotate} className="text-[8px]" />
              <span>Dinh dưỡng & Nguyên liệu</span>
            </Button>
          </div>
        </div>

        {/* ================= BACK SIDE (NUTRITION FLASHCARD) ================= */}
        <div
          className={`absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-2xl border ${
            rarityStyle.border
          } ${rarityStyle.glow} bg-card text-card-foreground flex flex-col p-2 overflow-hidden shadow-xs bg-gradient-to-b ${
            rarityStyle.gradient
          } ${!isFlipped ? "pointer-events-none" : "pointer-events-auto"}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-1 border-b border-border/50">
            <div className="overflow-hidden">
              <span className="text-[7px] uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400 block">
                Bảng Dinh Dưỡng
              </span>
              <h4 className="text-[11px] font-bold text-foreground truncate">{food.name}</h4>
            </div>
            {hasCalories && (
              <span className="text-[9px] font-black text-amber-700 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-950/60 px-1 py-0.2 rounded shrink-0">
                {food.macros.calories} kcal
              </span>
            )}
          </div>

          {/* Compact Macro Grid */}
          <div className="grid grid-cols-2 gap-1 py-1 text-[9px]">
            {hasProtein && (
              <div className="flex justify-between bg-muted/40 p-0.5 px-1 rounded">
                <span className="text-muted-foreground">Đạm:</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-300">
                  {food.macros.protein}g
                </span>
              </div>
            )}
            {hasCarbs && (
              <div className="flex justify-between bg-muted/40 p-0.5 px-1 rounded">
                <span className="text-muted-foreground">Carbs:</span>
                <span className="font-bold text-amber-700 dark:text-amber-300">
                  {food.macros.carbs}g
                </span>
              </div>
            )}
            {hasFat && (
              <div className="flex justify-between bg-muted/40 p-0.5 px-1 rounded">
                <span className="text-muted-foreground">Béo:</span>
                <span className="font-bold text-sky-700 dark:text-sky-300">
                  {food.macros.fat}g
                </span>
              </div>
            )}
            {hasFiber && (
              <div className="flex justify-between bg-muted/40 p-0.5 px-1 rounded">
                <span className="text-muted-foreground">Xơ:</span>
                <span className="font-bold text-teal-700 dark:text-teal-300">
                  {food.macros.fiber}g
                </span>
              </div>
            )}
          </div>

          {/* Ingredients List */}
          <div className="flex-1 overflow-hidden flex flex-col min-h-0 border-t border-border/40 pt-1">
            <span className="text-[8px] font-bold text-muted-foreground block mb-0.5">
              Nguyên liệu ({validNutritions.length || (food.ingredients || []).length}):
            </span>
            <div className="flex-1 overflow-y-auto space-y-0.5 pr-0.5 text-[8px]">
              {validNutritions.length > 0
                ? validNutritions.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between p-0.5 px-1 rounded bg-muted/30"
                    >
                      <span className="truncate max-w-[100px] text-foreground">
                        {item.name}
                      </span>
                      <span className="text-muted-foreground shrink-0">
                        {item.calories ? `${item.calories} kcal` : ""}
                      </span>
                    </div>
                  ))
                : (food.ingredients || []).map((ing, idx) => (
                    <div
                      key={idx}
                      className="p-0.5 px-1 rounded bg-muted/30 text-foreground truncate"
                    >
                      • {ing}
                    </div>
                  ))}
            </div>
          </div>

          {/* Back button */}
          <div className="pt-1 border-t border-border/40 flex gap-1 mt-0.5">
            <Button
              variant="outline"
              size="sm"
              onClick={handleFlip}
              className="flex-1 h-5 text-[9px] font-semibold rounded border-emerald-300 dark:border-emerald-800 text-foreground hover:bg-emerald-50 gap-1 px-1"
            >
              <FontAwesomeIcon icon={faRotate} className="text-[8px]" />
              <span>Quay Lại</span>
            </Button>
            <Button
              variant={saved ? "default" : "secondary"}
              size="sm"
              onClick={handleSave}
              className={`h-5 rounded px-2 text-[9px] font-semibold ${
                saved ? "bg-emerald-600 text-white" : ""
              }`}
            >
              <FontAwesomeIcon icon={faBookmark} className="text-[8px]" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const FoodFlashCard = memo(FoodFlashCardComponent);
