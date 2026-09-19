"use client";

import React, { useState, useMemo, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRotate,
  faBookmark,
  faArrowLeft,
  faCheck,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";
import { useTimeTheme } from "@/context/TimeThemeContext";
import { useSavedFoods } from "@/context/SavedFoodsContext";
import type {
  FoodItem,
  Rarity,
  DietaryFilter,
  PriceFilter,
  SessionFilter,
} from "@/types/food";
import { allFoods as defaultFoods } from "@/lib/foodData";
import { BoosterPack } from "@/components/gacha/BoosterPack";
import { RevealAnimation } from "@/components/gacha/RevealAnimation";
import { FoodFlashCard } from "@/components/food/FoodFlashCard";
import { Button } from "@/components/ui/button";

type GachaState = "pack" | "opening" | "revealed";

interface GachaGameProps {
  allFoods?: FoodItem[];
}

export const GachaGame: React.FC<GachaGameProps> = ({ allFoods = defaultFoods }) => {
  const { recommendedSession } = useTimeTheme();
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
  }, [allFoods, effectiveSession, selectedDiet, selectedPrice]);

  // Safe pool fallback
  const safePool = useMemo(() => {
    if (candidatePool.length >= dishCount) return candidatePool;
    // If strict pool has too few items, relax price / diet fallback
    const relaxed = allFoods.filter((f) =>
      effectiveSession !== "all" ? f.sessions.includes(effectiveSession) : true
    );
    return relaxed.length >= dishCount ? relaxed : allFoods;
  }, [allFoods, candidatePool, effectiveSession, dishCount]);

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
    <>
      {/* ================= REVEAL ANIMATION OVERLAY ================= */}
      {gachaState === "opening" && (
        <RevealAnimation
          highestRarity={highestRarity}
          onFinish={handleRevealFinished}
        />
      )}

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
              Số món gợi ý
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
              Chế độ ăn
            </label>
            <select
              value={selectedDiet}
              onChange={(e) => setSelectedDiet(e.target.value as DietaryFilter)}
              className="w-full bg-background border border-border/80 text-foreground text-xs font-medium rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden shadow-xs"
            >
              <option value="all">Tất Cả Chế Độ</option>
              <option value="veg">🌱 Món Chay</option>
              <option value="meat">🍖 Món Mặn</option>
            </select>
          </div>

          {/* Price Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">
              Khoảng giá
            </label>
            <select
              value={selectedPrice}
              onChange={(e) => setSelectedPrice(e.target.value as PriceFilter)}
              className="w-full bg-background border border-border/80 text-foreground text-xs font-medium rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden shadow-xs"
            >
              <option value="all">Tất Cả Mức Giá</option>
              <option value="under_50">&lt; 50.000 ₫ (Tiết kiệm)</option>
              <option value="50_80">50.000 - 80.000 ₫ (Phổ thông)</option>
              <option value="80_120">80.000 - 120.000 ₫ (Đặc sắc)</option>
              <option value="above_120">&gt; 120.000 ₫ (Thượng hạng)</option>
            </select>
          </div>

          {/* Meal Session Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">
              Buổi ăn gợi ý
            </label>
            <select
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value as SessionFilter)}
              className="w-full bg-background border border-border/80 text-foreground text-xs font-medium rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden shadow-xs"
            >
              <option value="auto">
                Tự Động Theo Giờ ({recommendedSession})
              </option>
              <option value="Sáng sớm">Sáng sớm</option>
              <option value="Giữa trưa">Giữa trưa</option>
              <option value="Chiều">Chiều</option>
              <option value="Tối">Tối</option>
              <option value="all">Tất Cả</option>
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
                Khám Phá Thành Công
              </span>
              <h3 className="text-xl font-black text-foreground">
                Đã tìm thấy {revealedDishes.length} món ăn dành riêng cho bạn
              </h3>
              <p className="text-xs text-muted-foreground">
                Nhấn vào thẻ để lật xem bảng dinh dưỡng & nguyên liệu
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
                <span>Gợi Ý Lại</span>
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
                    ? "Đã lưu vào thực đơn!"
                    : "Lưu Tất Cả Vào Thực Đơn"}
                </span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetToPack}
                className="rounded-full text-xs font-semibold text-muted-foreground hover:text-foreground gap-1.5"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
                <span>Mở Gói Khác</span>
              </Button>
            </div>
          </div>

          {/* Flashcards Grid */}
          <div
            className={`grid gap-4 sm:gap-6 justify-items-center ${
              revealedDishes.length === 1
                ? "grid-cols-1 max-w-[220px] mx-auto"
                : revealedDishes.length === 3
                  ? "grid-cols-1 sm:grid-cols-3 max-w-3xl mx-auto"
                  : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 max-w-5xl mx-auto"
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
              <span>Mở Gói Khác</span>
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
