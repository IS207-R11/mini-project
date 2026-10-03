"use client";

import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRotate,
  faBookmark,
  faArrowLeft,
  faCheck,
  faFilter,
  faStar,
  faFire,
  faWandMagicSparkles,
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
import { TinderCardStack } from "@/components/tinder/TinderCardStack";
import { Button } from "@/components/ui/button";

type GachaState = "pack" | "opening" | "revealed";

interface GachaGameProps {
  allFoods?: FoodItem[];
}

export const GachaGame: React.FC<GachaGameProps> = ({ allFoods = defaultFoods }) => {
  const { recommendedSession } = useTimeTheme();
  const { saveMultiple } = useSavedFoods();

  // Active game mode: "gacha" | "tinder"
  const [activeMode, setActiveMode] = useState<"gacha" | "tinder">("gacha");
  const [isTinderActive, setIsTinderActive] = useState<boolean>(false);
  const [tinderDeck, setTinderDeck] = useState<FoodItem[]>([]);

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
    setIsTinderActive(false);
  }, [safePool, dishCount]);

  // Tinder launch function
  const handleStartTinder = useCallback(() => {
    const pool = [...safePool];
    // Fisher-Yates shuffle
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    const deck = pool.slice(0, 20);
    setTinderDeck(deck);
    setIsTinderActive(true);
    setActiveMode("tinder");
    setGachaState("pack");
  }, [safePool]);

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
    setIsTinderActive(false);
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

      {/* ================= MODE TOGGLE BAR ================= */}
      {!isTinderActive && gachaState !== "revealed" && (
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="inline-flex items-center p-1 bg-muted/80 rounded-2xl border border-border/60 shadow-xs">
            <button
              type="button"
              onClick={() => setActiveMode("gacha")}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                activeMode === "gacha"
                  ? "bg-card text-foreground shadow-xs font-black"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <FontAwesomeIcon icon={faWandMagicSparkles} className="text-secondary" />
              <span>Gacha Mở Thẻ</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMode("tinder")}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                activeMode === "tinder"
                  ? "bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-xs font-black"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <FontAwesomeIcon icon={faFire} className={activeMode === "tinder" ? "text-yellow-200" : "text-rose-500"} />
              <span>Tinder Quẹt Món</span>
            </button>
          </div>
        </div>
      )}

      {/* ================= FILTER BAR (When not in full Tinder swiping) ================= */}
      {!isTinderActive && gachaState !== "revealed" && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto mb-8 p-5 sm:p-6 rounded-3xl bg-card text-card-foreground border border-border shadow-md backdrop-blur-md space-y-4"
        >
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
            <div className="flex items-center gap-2 text-foreground">
              <FontAwesomeIcon icon={faFilter} className="text-secondary" />
              <span>Tùy Chỉnh Bộ Lọc Gợi Ý Món Ăn</span>
            </div>
            <span className="text-[11px] text-muted-foreground font-normal normal-case">
              Kho dữ liệu sẵn sàng ({safePool.length} món)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* Quantity Selector (for Gacha) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground">
                Số món gợi ý
              </label>
              <div className="flex gap-1 bg-muted/60 p-1 rounded-2xl border border-border/40">
                {[1, 3, 5].map((cnt) => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setDishCount(cnt)}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      dishCount === cnt
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {cnt} món
                  </button>
                ))}
              </div>
            </div>

            {/* Dietary Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground">
                Chế độ ăn
              </label>
              <select
                value={selectedDiet}
                onChange={(e) => setSelectedDiet(e.target.value as DietaryFilter)}
                className="w-full bg-background border border-border text-foreground text-xs font-medium rounded-2xl p-2.5 focus:ring-2 focus:ring-primary focus:outline-hidden shadow-xs cursor-pointer"
              >
                <option value="all">Tất Cả Chế Độ</option>
                <option value="veg">🌱 Món Chay</option>
                <option value="meat">🍖 Món Mặn</option>
              </select>
            </div>

            {/* Price Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground">
                Khoảng giá
              </label>
              <select
                value={selectedPrice}
                onChange={(e) => setSelectedPrice(e.target.value as PriceFilter)}
                className="w-full bg-background border border-border text-foreground text-xs font-medium rounded-2xl p-2.5 focus:ring-2 focus:ring-primary focus:outline-hidden shadow-xs cursor-pointer"
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
              <label className="text-xs font-bold text-muted-foreground">
                Khung giờ ăn
              </label>
              <select
                value={selectedSession}
                onChange={(e) => setSelectedSession(e.target.value as SessionFilter)}
                className="w-full bg-background border border-border text-foreground text-xs font-medium rounded-2xl p-2.5 focus:ring-2 focus:ring-primary focus:outline-hidden shadow-xs cursor-pointer"
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

          {/* Action Row with prominent "Tinder món ăn" button */}
          <div className="pt-3 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground text-center sm:text-left">
              Đã tìm thấy <strong className="text-foreground">{safePool.length}</strong> món phù hợp với tiêu chí của bạn.
            </p>

            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
              {/* PRIMARY BUTTON: Tinder Món Ăn */}
              <Button
                type="button"
                onClick={handleStartTinder}
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-full text-xs font-black tracking-wide bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white shadow-md shadow-orange-500/20 hover:shadow-orange-500/30 transition-all gap-2 cursor-pointer"
              >
                <FontAwesomeIcon icon={faFire} className="text-xs text-yellow-200 animate-pulse" />
                <span>Tinder Món Ăn ({safePool.length})</span>
              </Button>

              {/* SECONDARY BUTTON: Gacha */}
              <Button
                type="button"
                variant="outline"
                onClick={handleStartGacha}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-full text-xs font-bold border-border bg-card hover:bg-muted text-foreground gap-1.5 cursor-pointer"
              >
                <FontAwesomeIcon icon={faRotate} className="text-xs text-secondary" />
                <span>Mở Gói ({dishCount} món)</span>
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* ================= TINDER SWIPE ISLAND ================= */}
      <AnimatePresence mode="wait">
        {isTinderActive && (
          <motion.div
            key="tinder-active"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="w-full py-2"
          >
            <TinderCardStack
              key={tinderDeck.map((d) => d.id).join("-")}
              foods={tinderDeck}
              onOpenFilters={() => setIsTinderActive(false)}
              onRestartAll={handleStartTinder}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= GACHA BOOSTER PACK AREA ================= */}
      {!isTinderActive && gachaState === "pack" && (
        <div className="py-4 flex flex-col items-center justify-center">
          <BoosterPack
            onOpen={handleStartGacha}
            count={dishCount}
          />
        </div>
      )}

      {/* ================= REVEALED RESULTS FLASHCARDS GRID ================= */}
      {!isTinderActive && gachaState === "revealed" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Header with count and instructions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-3xl bg-card text-card-foreground border border-border shadow-md">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[10px] font-black text-secondary uppercase tracking-widest flex items-center gap-1 justify-center sm:justify-start">
                <FontAwesomeIcon icon={faStar} className="text-secondary" />
                Gợi Ý Thành Công
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                Đã mở {revealedDishes.length} món ăn phù hợp với bạn
              </h3>
              <p className="text-xs text-muted-foreground">
                Chạm vào thẻ bài để lật xem thông tin dinh dưỡng chi tiết
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 justify-center sm:justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={handleStartGacha}
                className="rounded-full text-xs font-bold gap-1.5 border-border bg-card text-foreground hover:bg-muted"
              >
                <FontAwesomeIcon icon={faRotate} className="text-xs text-secondary" />
                <span>Gợi Ý Lại</span>
              </Button>

              <Button
                size="sm"
                onClick={handleSaveAll}
                className="rounded-full text-xs font-bold gap-1.5 bg-primary text-primary-foreground hover:brightness-105 shadow-sm transition-all"
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
                className="rounded-full text-xs font-bold text-muted-foreground hover:text-foreground gap-1.5"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
                <span>Mở Gói Khác</span>
              </Button>
            </div>
          </div>

          {/* Flashcards Grid with Staggered Framer Motion */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mx-auto max-w-5xl">
            {revealedDishes.map((food, idx) => (
              <motion.div
                key={food.id}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.4,
                  delay: idx * 0.12,
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                }}
              >
                <FoodFlashCard food={food} />
              </motion.div>
            ))}
          </div>

          {/* Bottom Back Button */}
          <div className="text-center pt-4">
            <Button
              variant="outline"
              size="lg"
              onClick={handleResetToPack}
              className="rounded-full px-8 font-bold border-border bg-card text-foreground hover:bg-muted gap-2 shadow-sm"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              <span>Mở Gói Khác</span>
            </Button>
          </div>
        </motion.div>
      )}
    </>
  );
};
