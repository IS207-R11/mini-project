"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashCan,
  faFire,
  faDumbbell,
  faUtensils,
  faCoins,
  faLeaf,
} from "@fortawesome/free-solid-svg-icons";
import { useI18n } from "@/context/I18nContext";
import { useSavedFoods } from "@/context/SavedFoodsContext";
import { formatPrice } from "@/lib/foodData";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SavedSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SavedSheet: React.FC<SavedSheetProps> = ({ open, onOpenChange }) => {
  const { t } = useI18n();
  const {
    savedFoods,
    removeFood,
    clearSaved,
    totalCalories,
    totalProtein,
    totalCost,
  } = useSavedFoods();

  const formattedTotalCost = formatPrice(totalCost);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="p-5 border-b border-border/60 bg-muted/20">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg font-bold flex items-center gap-2">
              <FontAwesomeIcon icon={faUtensils} className="text-emerald-600" />
              <span>{t("saved.title")}</span>
              <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold">
                {savedFoods.length}
              </Badge>
            </SheetTitle>
          </div>
          <SheetDescription className="text-xs text-muted-foreground">
            {t("saved.subtitle")}
          </SheetDescription>
        </SheetHeader>

        {/* Nutritional & Cost Summary Banner */}
        {savedFoods.length > 0 && (
          <div className="mx-5 my-3 p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/30 rounded-2xl border border-emerald-200/60 dark:border-emerald-800/40 space-y-2">
            <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider block">
              {t("saved.totalNutrition")}
            </span>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-white/70 dark:bg-black/30 rounded-xl">
                <span className="text-[10px] text-muted-foreground flex items-center justify-center gap-1">
                  <FontAwesomeIcon icon={faFire} className="text-amber-500 text-xs" />
                  {t("saved.totalCalories")}
                </span>
                <span className="text-sm font-black text-foreground">{totalCalories} kcal</span>
              </div>
              <div className="p-2 bg-white/70 dark:bg-black/30 rounded-xl">
                <span className="text-[10px] text-muted-foreground flex items-center justify-center gap-1">
                  <FontAwesomeIcon icon={faDumbbell} className="text-emerald-500 text-xs" />
                  {t("saved.totalProtein")}
                </span>
                <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                  {totalProtein} g
                </span>
              </div>
              <div className="p-2 bg-white/70 dark:bg-black/30 rounded-xl">
                <span className="text-[10px] text-muted-foreground flex items-center justify-center gap-1">
                  <FontAwesomeIcon icon={faCoins} className="text-amber-600 text-xs" />
                  {t("saved.totalCost")}
                </span>
                <span className="text-xs font-black text-amber-700 dark:text-amber-300 truncate block">
                  {formattedTotalCost}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Saved List */}
        <div className="flex-1 overflow-y-auto px-5 divide-y divide-border/40">
          {savedFoods.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 text-xl">
                <FontAwesomeIcon icon={faUtensils} />
              </div>
              <h4 className="text-base font-bold text-foreground">{t("saved.emptyTitle")}</h4>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
                {t("saved.emptyDesc")}
              </p>
            </div>
          ) : (
            savedFoods.map((food) => {
              const imageSrc = food.imagePath || `/data/images/${food.id}.webp`;
              const formattedPrice = formatPrice(food.price);

              return (
                <div key={food.id} className="py-3 flex items-center gap-3 group">
                  <img
                    src={imageSrc}
                    alt={food.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 border border-border/60"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 font-bold">
                        {food.rarity}
                      </Badge>
                      {food.veg && (
                        <Badge className="bg-emerald-600 text-white text-[9px] px-1.5 py-0 h-4 flex items-center gap-0.5">
                          <FontAwesomeIcon icon={faLeaf} className="text-[8px]" />
                          <span>Chay</span>
                        </Badge>
                      )}
                      <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300">
                        {formattedPrice}
                      </span>
                    </div>
                    <h5 className="text-sm font-semibold text-foreground truncate mt-0.5">
                      {food.name}
                    </h5>
                    <p className="text-[11px] text-muted-foreground truncate">{food.sub}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                        {food.macros.calories} kcal
                      </span>
                      <span>•</span>
                      <span>{food.macros.protein}g đạm</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFood(food.id)}
                    className="h-8 w-8 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-full"
                    title={t("saved.remove")}
                  >
                    <FontAwesomeIcon icon={faTrashCan} className="text-xs" />
                  </Button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer actions */}
        {savedFoods.length > 0 && (
          <SheetFooter className="p-5 border-t border-border/60 bg-muted/10 flex flex-row items-center justify-between gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={clearSaved}
              className="text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 hover:text-rose-700 rounded-xl"
            >
              <FontAwesomeIcon icon={faTrashCan} className="mr-1.5" />
              {t("saved.btnClearAll")}
            </Button>
            <Button
              size="sm"
              onClick={() => onOpenChange(false)}
              className="bg-emerald-600 text-white hover:bg-emerald-500 rounded-xl text-xs font-semibold px-5"
            >
              {t("card.flipToFront")}
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};
