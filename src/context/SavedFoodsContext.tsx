"use client";

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import type { FoodItem } from "@/types/food";

interface SavedFoodsContextType {
  savedFoods: FoodItem[];
  saveFood: (food: FoodItem) => void;
  removeFood: (id: number | string) => void;
  toggleSaveFood: (food: FoodItem) => boolean;
  isSaved: (id: number | string) => boolean;
  saveMultiple: (foods: FoodItem[]) => void;
  clearSaved: () => void;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalCost: number; // in thousands VND
}

const STORAGE_KEY = "foodlife_saved_meals_v2";

const SavedFoodsContext = createContext<SavedFoodsContextType | undefined>(undefined);

export const SavedFoodsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedFoods, setSavedFoods] = useState<FoodItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSavedFoods(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to load saved foods from localStorage", e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save back to localStorage whenever savedFoods changes after initialization
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedFoods));
    } catch (e) {
      console.error("Failed to save foods to localStorage", e);
    }
  }, [savedFoods, isInitialized]);

  const isSaved = useCallback(
    (id: number | string) => savedFoods.some((item) => item.id === Number(id) || String(item.id) === String(id)),
    [savedFoods]
  );

  const saveFood = useCallback((food: FoodItem) => {
    setSavedFoods((prev) => {
      if (prev.some((item) => item.id === food.id)) return prev;
      return [food, ...prev];
    });
  }, []);

  const removeFood = useCallback((id: number | string) => {
    setSavedFoods((prev) => prev.filter((item) => item.id !== Number(id) && String(item.id) !== String(id)));
  }, []);

  const toggleSaveFood = useCallback((food: FoodItem): boolean => {
    let nowSaved = false;
    setSavedFoods((prev) => {
      const exists = prev.some((item) => item.id === food.id);
      if (exists) {
        nowSaved = false;
        return prev.filter((item) => item.id !== food.id);
      } else {
        nowSaved = true;
        return [food, ...prev];
      }
    });
    return nowSaved;
  }, []);

  const saveMultiple = useCallback((foods: FoodItem[]) => {
    setSavedFoods((prev) => {
      const map = new Map<number | string, FoodItem>();
      // Preserve newest first
      foods.forEach((f) => map.set(f.id, f));
      prev.forEach((f) => {
        if (!map.has(f.id)) map.set(f.id, f);
      });
      return Array.from(map.values());
    });
  }, []);

  const clearSaved = useCallback(() => {
    setSavedFoods([]);
  }, []);

  const totals = useMemo(() => {
    return savedFoods.reduce(
      (acc, item) => ({
        calories: acc.calories + (item.macros?.calories || 0),
        protein: acc.protein + (item.macros?.protein || 0),
        carbs: acc.carbs + (item.macros?.carbs || 0),
        fat: acc.fat + (item.macros?.fat || 0),
        cost: acc.cost + (item.price || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0, cost: 0 }
    );
  }, [savedFoods]);

  const value = useMemo(
    () => ({
      savedFoods,
      saveFood,
      removeFood,
      toggleSaveFood,
      isSaved,
      saveMultiple,
      clearSaved,
      totalCalories: Math.round(totals.calories),
      totalProtein: Math.round(totals.protein * 10) / 10,
      totalCarbs: Math.round(totals.carbs * 10) / 10,
      totalFat: Math.round(totals.fat * 10) / 10,
      totalCost: totals.cost,
    }),
    [savedFoods, saveFood, removeFood, toggleSaveFood, isSaved, saveMultiple, clearSaved, totals]
  );

  return <SavedFoodsContext.Provider value={value}>{children}</SavedFoodsContext.Provider>;
};

export const useSavedFoods = () => {
  const context = useContext(SavedFoodsContext);
  if (!context) {
    throw new Error("useSavedFoods must be used within a SavedFoodsProvider");
  }
  return context;
};
