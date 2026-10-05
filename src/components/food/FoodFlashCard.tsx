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
  faCheck,
  faArrowUpRightFromSquare,
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
  }
> = {
  SSR: {
    badge: "bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 font-black",
    border: "border-amber-400/90 hover:border-amber-300",
    glow: "shadow-[0_4px_16px_rgba(251,191,36,0.25)]",
  },
  SR: {
    badge: "bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold",
    border: "border-purple-400/80 hover:border-purple-300",
    glow: "shadow-[0_4px_14px_rgba(168,85,247,0.2)]",
  },
  UC: {
    badge: "bg-gradient-to-r from-sky-500 to-blue-500 text-white font-semibold",
    border: "border-sky-400/70 hover:border-sky-300",
    glow: "shadow-[0_4px_12px_rgba(14,165,233,0.15)]",
  },
  C: {
    badge: "bg-secondary text-white font-semibold",
    border: "border-border hover:border-secondary/60",
    glow: "shadow-sm",
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

  // Encode Google Maps Search URL
  const googleMapUrl = `https://www.google.com/maps/search/${encodeURIComponent(`quán ${food.name}`)}`;

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
    ? "/logos/main-logo.png"
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
      className={`perspective-1000 w-[240px] sm:w-[260px] h-[335px] sm:h-[355px] select-none cursor-pointer group shrink-0 ${className}`}
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
          } ${rarityStyle.glow} bg-card text-card-foreground flex flex-col overflow-hidden shadow-md transition-all duration-300 hover:-translate-y-1 ${
            isFlipped ? "pointer-events-none" : "pointer-events-auto"
          }`}
        >
          {/* Dish Image Container with Badges Overlaid */}
          <div className="relative h-[140px] sm:h-[152px] w-full overflow-hidden bg-muted/80 shrink-0">
            <Image
              src={imageSrc}
              alt={food.name}
              fill
              unoptimized
              draggable={false}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              onError={() => setImgError(true)}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108 select-none"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40" />

            {/* Top Badges Over Image */}
            <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
              <div className="flex items-center gap-1.5">
                <Badge
                  className={`px-2.5 py-0.5 text-[9.5px] font-black rounded-full uppercase tracking-wider shadow-sm ${rarityStyle.badge}`}
                >
                  {food.rarity}
                </Badge>
                {food.veg && (
                  <Badge className="bg-emerald-600/95 text-white text-[9.5px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                    <FontAwesomeIcon icon={faLeaf} className="text-[8.5px]" />
                    <span>Chay</span>
                  </Badge>
                )}
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleSave}
                className={`h-7 w-7 rounded-full backdrop-blur-md transition-all shrink-0 ${
                  saved
                    ? "text-white bg-primary shadow-sm"
                    : "text-white/90 bg-black/50 hover:text-white hover:bg-black/75"
                }`}
                title={saved ? "Đã lưu" : "Lưu món"}
              >
                <FontAwesomeIcon
                  icon={saved ? faCheck : faBookmark}
                  className="text-[12px]"
                />
              </Button>
            </div>

            {/* Bottom Details Over Image */}
            <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-white font-medium drop-shadow-xs">
              {hasCalories ? (
                <div className="flex items-center gap-1 bg-black/65 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/20">
                  <FontAwesomeIcon icon={faFire} className="text-secondary text-[10px]" />
                  <span className="font-bold">{food.macros.calories}</span>
                  <span className="text-[9.5px] text-white/80">kcal</span>
                </div>
              ) : (
                <span />
              )}

              {hasPrice && (
                <span className="text-[11px] font-bold text-amber-300 bg-black/65 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-amber-400/30 flex items-center gap-1">
                  <FontAwesomeIcon icon={faTag} className="text-[9px]" />
                  {formattedPrice}
                </span>
              )}
            </div>
          </div>

          {/* Card Body */}
          <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between overflow-hidden gap-2">
            <div className="space-y-0.5">
              <h3 className="text-[14.5px] sm:text-[15.5px] font-bold text-foreground leading-tight truncate group-hover:text-secondary transition-colors">
                {food.name}
              </h3>

              {food.sub && food.sub.trim() !== "" ? (
                <div className="text-[11px] sm:text-[11.5px] text-secondary font-semibold truncate">
                  {food.sub}
                </div>
              ) : (
                food.sessions &&
                food.sessions.length > 0 && (
                  <div className="text-[10.5px] sm:text-[11px] text-muted-foreground truncate">
                    Buổi: {food.sessions.join(", ")}
                  </div>
                )
              )}
            </div>

            {/* Compact Macro Row + Unit Note */}
            <div>
              {hasAnyMacro && (
                <div className="flex items-center justify-between text-[10px] sm:text-[10.5px] py-1.5 px-2.5 bg-muted/60 rounded-xl border border-border/50 font-medium">
                  {hasProtein && (
                    <span className="text-foreground font-semibold">
                      Đạm <strong className="text-primary">{food.macros.protein}g</strong>
                    </span>
                  )}
                  {hasCarbs && (
                    <span className="text-foreground font-semibold">
                      Carbs <strong className="text-secondary">{food.macros.carbs}g</strong>
                    </span>
                  )}
                  {hasFat && (
                    <span className="text-foreground font-semibold">
                      Béo <strong>{food.macros.fat}g</strong>
                    </span>
                  )}
                </div>
              )}
              <div className="text-[8.5px] sm:text-[9px] text-muted-foreground/85 font-medium text-right italic pt-0.5 pr-0.5">
                Đơn vị tính: 100g
              </div>
            </div>

            {/* Actions: Dinh Dưỡng (Flip) & Google Map */}
            <div className="flex items-center gap-2 pt-0.5">
              <Button
                variant="outline"
                size="sm"
                onClick={handleFlip}
                className="flex-1 h-7.5 sm:h-8 text-[10.5px] sm:text-[11px] font-bold rounded-xl border-border bg-muted/30 text-foreground hover:bg-muted hover:border-secondary/40 gap-1.5 px-2 transition-all shadow-2xs whitespace-nowrap"
                title="Xem chi tiết dinh dưỡng & nguyên liệu"
              >
                <FontAwesomeIcon icon={faRotate} className="text-[9.5px] text-secondary shrink-0" />
                <span className="whitespace-nowrap">Dinh Dưỡng</span>
              </Button>

              <a
                href={googleMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex-1 h-7.5 sm:h-8 text-[10.5px] sm:text-[11px] font-bold rounded-xl bg-muted/30 hover:bg-muted/70 text-foreground border border-border/80 flex items-center justify-center gap-1.5 px-2 transition-all shadow-2xs group/map whitespace-nowrap"
                title={`Tìm quán ${food.name} trên Google Maps`}
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/a/a3/Google_Maps_icon_%282026%29.svg"
                  alt="Google Maps"
                  className="w-3.5 h-3.5 object-contain shrink-0 transition-transform group-hover/map:scale-110"
                />
                <span className="whitespace-nowrap">Maps</span>
                <FontAwesomeIcon
                  icon={faArrowUpRightFromSquare}
                  className="text-[8px] opacity-60 shrink-0"
                />
              </a>
            </div>
          </div>
        </div>

        {/* ================= BACK SIDE (NUTRITION FLASHCARD) ================= */}
        <div
          className={`absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-2xl border ${
            rarityStyle.border
          } ${rarityStyle.glow} bg-card text-card-foreground flex flex-col p-3.5 overflow-hidden shadow-md ${
            !isFlipped ? "pointer-events-none" : "pointer-events-auto"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-border/60">
            <div className="overflow-hidden">
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] uppercase font-bold tracking-wider text-secondary block">
                  Bảng Dinh Dưỡng
                </span>
                <span className="text-[8px] text-muted-foreground/85 font-medium italic">
                  (100g)
                </span>
              </div>
              <h4 className="text-[13px] sm:text-[14px] font-bold text-foreground truncate">{food.name}</h4>
            </div>
            {hasCalories && (
              <span className="text-[11px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-lg border border-primary/20 shrink-0">
                {food.macros.calories} kcal
              </span>
            )}
          </div>

          {/* Macro Grid */}
          <div className="grid grid-cols-2 gap-2 py-2 text-[9.5px] sm:text-[10px]">
            {hasProtein && (
              <div className="flex justify-between bg-muted/50 p-1.5 px-2 rounded-lg">
                <span className="text-muted-foreground">Đạm:</span>
                <span className="font-bold text-foreground">
                  {food.macros.protein}g
                </span>
              </div>
            )}
            {hasCarbs && (
              <div className="flex justify-between bg-muted/50 p-1.5 px-2 rounded-lg">
                <span className="text-muted-foreground">Carbs:</span>
                <span className="font-bold text-foreground">
                  {food.macros.carbs}g
                </span>
              </div>
            )}
            {hasFat && (
              <div className="flex justify-between bg-muted/50 p-1.5 px-2 rounded-lg">
                <span className="text-muted-foreground">Béo:</span>
                <span className="font-bold text-foreground">
                  {food.macros.fat}g
                </span>
              </div>
            )}
            {hasFiber && (
              <div className="flex justify-between bg-muted/50 p-1.5 px-2 rounded-lg">
                <span className="text-muted-foreground">Xơ:</span>
                <span className="font-bold text-foreground">
                  {food.macros.fiber}g
                </span>
              </div>
            )}
          </div>

          {/* Ingredients List */}
          <div className="flex-1 overflow-hidden flex flex-col min-h-0 border-t border-border/50 pt-1.5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] font-bold text-muted-foreground">
                Nguyên liệu ({validNutritions.length || (food.ingredients || []).length}):
              </span>
              <span className="text-[8px] text-muted-foreground/80 italic">
                Đơn vị tính: 100g
              </span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-0.5 text-[9px] sm:text-[9.5px]">
              {validNutritions.length > 0
                ? validNutritions.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between p-1.5 px-2 rounded-md bg-muted/40"
                    >
                      <span className="truncate max-w-[125px] text-foreground font-medium">
                        {item.name}
                      </span>
                      <span className="text-muted-foreground shrink-0 text-[8.5px]">
                        {item.calories ? `${item.calories} kcal` : ""}
                      </span>
                    </div>
                  ))
                : (food.ingredients || []).map((ing, idx) => (
                    <div
                      key={idx}
                      className="p-1.5 px-2 rounded-md bg-muted/40 text-foreground truncate font-medium"
                    >
                      • {ing}
                    </div>
                  ))}
            </div>
          </div>

          {/* Footer Actions: Back, Google Map, Bookmark */}
          <div className="pt-2.5 border-t border-border/60 flex items-center gap-2 mt-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleFlip}
              className="flex-1 h-7.5 sm:h-8 text-[10px] sm:text-[10.5px] font-bold rounded-xl border-border text-foreground hover:bg-muted gap-1.5 px-2 whitespace-nowrap"
            >
              <FontAwesomeIcon icon={faRotate} className="text-[9px] text-secondary shrink-0" />
              <span className="whitespace-nowrap">Quay Lại</span>
            </Button>
            <a
              href={googleMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex-1 h-7.5 sm:h-8 text-[10px] sm:text-[10.5px] font-bold rounded-xl bg-muted/30 hover:bg-muted/70 text-foreground border border-border/80 flex items-center justify-center gap-1.5 px-2 transition-all shadow-2xs group/map whitespace-nowrap"
              title={`Tìm quán ${food.name} trên Google Maps`}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/a/a3/Google_Maps_icon_%282026%29.svg"
                alt="Google Maps"
                className="w-3.5 h-3.5 object-contain shrink-0 transition-transform group-hover/map:scale-110"
              />
              <span className="whitespace-nowrap">Maps</span>
              <FontAwesomeIcon
                icon={faArrowUpRightFromSquare}
                className="text-[8px] opacity-60 shrink-0"
              />
            </a>
            <Button
              variant={saved ? "default" : "secondary"}
              size="sm"
              onClick={handleSave}
              className={`h-7.5 sm:h-8 rounded-xl px-2.5 sm:px-3 text-[10px] sm:text-[10.5px] font-bold shrink-0 ${
                saved ? "bg-primary text-primary-foreground" : ""
              }`}
              title={saved ? "Đã lưu" : "Lưu món"}
            >
              <FontAwesomeIcon
                icon={saved ? faCheck : faBookmark}
                className="text-[10px]"
              />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const FoodFlashCard = memo(FoodFlashCardComponent);

