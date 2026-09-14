"use client";

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import type { FoodItem } from "@/types/food";

interface SavedFoodsContextType {
  savedFoods: FoodItem[];
  saveFood: (food: FoodItem) => void;
  removeFood: (id: string) => void;
  toggleSaveFood: (food: FoodItem) => boolean;
  isSaved: (id: string) => boolean;
  saveMultiple: (foods: FoodItem[]) => void;
  clearSaved: () => void;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

const STORAGE_KEY = "foodlife_saved_meals_v1";

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
    (id: string) => savedFoods.some((item) => item.id === id),
    [savedFoods]
  );

  const saveFood = useCallback((food: FoodItem) => {
    setSavedFoods((prev) => {
      if (prev.some((item) => item.id === food.id)) return prev;
      return [food, ...prev];
    });
  }, []);

  const removeFood = useCallback((id: string) => {
    setSavedFoods((prev) => prev.filter((item) => item.id !== id));
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
      const map = new Map<string, FoodItem>();
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
        calories: acc.calories + (item.nutrition?.calories || 0),
        protein: acc.protein + (item.nutrition?.protein || 0),
        carbs: acc.carbs + (item.nutrition?.carbs || 0),
        fat: acc.fat + (item.nutrition?.fat || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
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
      totalCalories: totals.calories,
      totalProtein: totals.protein,
      totalCarbs: totals.carbs,
      totalFat: totals.fat,
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
