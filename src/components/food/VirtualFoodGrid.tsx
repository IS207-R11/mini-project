"use client";

import React, { useState, useEffect, useMemo } from "react";
import { List } from "react-window";
import type { FoodItem } from "@/types/food";
import { FoodFlashCard } from "./FoodFlashCard";

interface VirtualFoodGridProps {
  foods: FoodItem[];
  containerHeight?: number;
}

interface RowPropsData {
  foods: FoodItem[];
  columnCount: number;
}

const RowComponent = ({
  index,
  style,
  foods,
  columnCount,
}: {
  index: number;
  style: React.CSSProperties;
  ariaAttributes?: any;
} & RowPropsData) => {
  const startIndex = index * columnCount;
  const rowItems = foods.slice(startIndex, startIndex + columnCount);

  return (
    <div style={style} className="px-1 py-2 flex justify-center">
      <div
        className={`grid gap-3 sm:gap-4 justify-items-center w-full max-w-6xl ${
          columnCount === 5
            ? "grid-cols-5"
            : columnCount === 3
            ? "grid-cols-3"
            : "grid-cols-1 max-w-xs"
        }`}
      >
        {rowItems.map((food) => (
          <FoodFlashCard key={food.id} food={food} />
        ))}
      </div>
    </div>
  );
};

export const VirtualFoodGrid: React.FC<VirtualFoodGridProps> = ({
  foods,
  containerHeight = 720,
}) => {
  // Screen breakpoint column calculation: md (>=768): 5, sm (>=640): 3, default: 1
  const [columnCount, setColumnCount] = useState<number>(5);

  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width >= 768) {
        setColumnCount(5); // md: 5 cards/row
      } else if (width >= 640) {
        setColumnCount(3); // sm: 3 cards/row
      } else {
        setColumnCount(1); // default: 1 card/row
      }
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  const rowCount = useMemo(() => {
    if (!foods || foods.length === 0) return 0;
    return Math.ceil(foods.length / columnCount);
  }, [foods, columnCount]);

  const rowProps = useMemo<RowPropsData>(
    () => ({ foods, columnCount }),
    [foods, columnCount]
  );

  return (
    <div className="w-full flex justify-center py-2 h-[720px]">
      <List<RowPropsData>
        rowCount={rowCount}
        rowHeight={390}
        rowComponent={RowComponent}
        rowProps={rowProps}
        style={{ height: containerHeight, width: "100%" }}
        className="no-scrollbar scroll-smooth"
      />
    </div>
  );
};
