"use client";

import React, { useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faFilter,
  faArrowDownWideShort,
  faXmark,
  faRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import type {
  FoodItem,
  DietaryFilter,
  PriceFilter,
  Rarity,
} from "@/types/food";
import { allFoods as defaultFoods } from "@/lib/foodData";
import { FoodFlashCard } from "@/components/food/FoodFlashCard";
import { Button } from "@/components/ui/button";

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

const viCollator = new Intl.Collator("vi", { sensitivity: "base", numeric: true });

interface ResourcesExplorerProps {
  foods?: FoodItem[];
}

export const ResourcesExplorer: React.FC<ResourcesExplorerProps> = ({
  foods = defaultFoods,
}) => {
  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSession, setSelectedSession] = useState<string>("all");
  const [selectedDiet, setSelectedDiet] = useState<DietaryFilter>("all");
  const [selectedPrice, setSelectedPrice] = useState<PriceFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("name");

  // Filter and sort items
  const filteredFoods = useMemo(() => {
    return foods
      .filter((food) => {
        const name = (food.name || "").toLowerCase();
        const sub = (food.sub || "").toLowerCase();
        const quip = (food.quip || "").toLowerCase();
        const ingredients = (food.ingredients || []).join(" ").toLowerCase();
        const q = searchQuery.toLowerCase().trim();

        // Search match
        if (
          q &&
          !name.includes(q) &&
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
            return viCollator.compare(a.name, b.name);
        }
      });
  }, [foods, searchQuery, selectedSession, selectedDiet, selectedPrice, sortBy]);

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
    <div className="space-y-6 min-h-[calc(100vh-14rem)]">
      {/* ================= SEARCH & CONTROLS BAR ================= */}
      <div className="p-4 sm:p-5 rounded-3xl bg-card/80 dark:bg-card/40 border border-emerald-200/60 dark:border-emerald-800/40 shadow-xs backdrop-blur-md space-y-3.5">
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
            placeholder="Tìm theo tên món, mô tả, nguyên liệu..."
            className="w-full pl-11 pr-10 py-2.5 bg-background border border-border/80 text-foreground text-sm rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden transition-all shadow-xs"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {/* Session Filter */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <FontAwesomeIcon icon={faFilter} className="text-emerald-600 text-[10px]" />
              Buổi Ăn
            </label>
            <select
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
              className="w-full bg-background border border-border/80 text-foreground text-xs font-medium rounded-xl p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden shadow-xs"
            >
              <option value="all">Tất Cả Buổi</option>
              <option value="Sáng sớm">Sáng sớm</option>
              <option value="Giữa trưa">Giữa trưa</option>
              <option value="Chiều">Chiều</option>
              <option value="Tối">Tối</option>
            </select>
          </div>

          {/* Dietary Type Filter */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Chế độ ăn
            </label>
            <select
              value={selectedDiet}
              onChange={(e) => setSelectedDiet(e.target.value as DietaryFilter)}
              className="w-full bg-background border border-border/80 text-foreground text-xs font-medium rounded-xl p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden shadow-xs"
            >
              <option value="all">Tất Cả Chế Độ</option>
              <option value="veg">🌱 Món Chay</option>
              <option value="meat">🍖 Món Mặn</option>
            </select>
          </div>

          {/* Price Filter */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Khoảng giá
            </label>
            <select
              value={selectedPrice}
              onChange={(e) => setSelectedPrice(e.target.value as PriceFilter)}
              className="w-full bg-background border border-border/80 text-foreground text-xs font-medium rounded-xl p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden shadow-xs"
            >
              <option value="all">Tất Cả Mức Giá</option>
              <option value="under_50">&lt; 50.000 ₫ (Tiết kiệm)</option>
              <option value="50_80">50.000 - 80.000 ₫ (Phổ thông)</option>
              <option value="80_120">80.000 - 120.000 ₫ (Đặc sắc)</option>
              <option value="above_120">&gt; 120.000 ₫ (Thượng hạng)</option>
            </select>
          </div>

          {/* Sort Options */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <FontAwesomeIcon
                icon={faArrowDownWideShort}
                className="text-emerald-600 text-[10px]"
              />
              Sắp xếp
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="w-full bg-background border border-border/80 text-foreground text-xs font-medium rounded-xl p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden shadow-xs"
            >
              <option value="name">Tên (A - Z)</option>
              <option value="price_asc">Giá: Thấp đến Cao</option>
              <option value="price_desc">Giá: Cao đến Thấp</option>
              <option value="calories_asc">Calo: Thấp đến Cao</option>
              <option value="calories_desc">Calo: Cao đến Thấp</option>
              <option value="protein_desc">Đạm (Protein) Cao Nhất</option>
              <option value="rarity_desc">Độ Hiếm Cao Nhất</option>
            </select>
          </div>
        </div>

        {/* Results Count & Reset Filter Badge */}
        <div className="flex items-center justify-between pt-1.5 border-t border-border/40 text-xs">
          <span className="text-muted-foreground font-medium">
            Tìm thấy {filteredFoods.length} món ăn
          </span>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="h-6 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-full px-2.5"
            >
              <FontAwesomeIcon icon={faRotateLeft} className="mr-1 text-[10px]" />
              Đặt Lại Bộ Lọc
            </Button>
          )}
        </div>
      </div>

      {/* ================= NATURAL FLOW FOOD FLASHCARDS GRID ================= */}
      {filteredFoods.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 justify-items-center">
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
            Chưa tìm thấy món ăn phù hợp
          </h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
            Hãy thử thay đổi từ khóa hoặc đặt lại bộ lọc để khám phá thêm nhiều món ngon khác.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetFilters}
            className="rounded-full text-xs font-semibold mt-2 border-emerald-300 text-emerald-800 dark:text-emerald-300"
          >
            Đặt Lại Bộ Lọc
          </Button>
        </div>
      )}
    </div>
  );
};
