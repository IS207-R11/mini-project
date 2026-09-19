"use client";

import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import type { Rarity } from "@/types/food";

interface RevealAnimationProps {
  highestRarity: Rarity;
  onFinish: () => void;
}

export const RevealAnimation: React.FC<RevealAnimationProps> = ({
  highestRarity,
  onFinish,
}) => {
  useEffect(() => {
    // Fire confetti blast
    try {
      confetti({
        particleCount: highestRarity === "SSR" ? 100 : 60,
        spread: 80,
        origin: { y: 0.6 },
        colors:
          highestRarity === "SSR"
            ? ["#f59e0b", "#fbbf24", "#10b981", "#3b82f6"]
            : ["#10b981", "#3b82f6", "#8b5cf6", "#ec4899"],
      });
    } catch (e) {
      console.error(e);
    }

    const timer = setTimeout(() => {
      onFinish();
    }, 2200);

    return () => clearTimeout(timer);
  }, [highestRarity, onFinish]);

  const rarityColorClasses: Record<Rarity, { text: string; bg: string }> = {
    SSR: {
      text: "from-amber-200 via-yellow-400 to-amber-500",
      bg: "from-amber-950/70 via-slate-950 to-black",
    },
    SR: {
      text: "from-cyan-200 via-sky-400 to-blue-500",
      bg: "from-indigo-950/80 via-slate-950 to-black",
    },
    UC: {
      text: "from-emerald-200 via-teal-400 to-emerald-500",
      bg: "from-teal-950/80 via-slate-950 to-black",
    },
    C: {
      text: "from-emerald-100 via-emerald-300 to-teal-400",
      bg: "from-emerald-950/80 via-slate-950 to-black",
    },
  };

  const currentRarityStyle = rarityColorClasses[highestRarity] || rarityColorClasses.SR;

  return (
    <div
      onClick={onFinish}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b ${currentRarityStyle.bg} text-white cursor-pointer select-none overflow-hidden transition-all duration-700 animate-in fade-in`}
    >
      {/* Radiant Rotating Beams (Inspired directly by Tham khảo 3.png) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
        <div
          className="w-[1200px] h-[1200px] rounded-full animate-radiant-spin"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.2) 15deg, transparent 30deg, transparent 45deg, rgba(255,255,255,0.2) 60deg, transparent 75deg, transparent 90deg, rgba(255,255,255,0.25) 105deg, transparent 120deg, transparent 135deg, rgba(255,255,255,0.2) 150deg, transparent 165deg, transparent 180deg, rgba(255,255,255,0.25) 195deg, transparent 210deg, transparent 225deg, rgba(255,255,255,0.2) 240deg, transparent 255deg, transparent 270deg, rgba(255,255,255,0.25) 285deg, transparent 300deg, transparent 315deg, rgba(255,255,255,0.2) 330deg, transparent 345deg)",
          }}
        />
      </div>

      {/* Center glowing ring circles */}
      <div className="relative flex flex-col items-center justify-center z-10 scale-95 sm:scale-100 animate-in zoom-in-75 duration-500">
        {/* Decorative thin concentric lines */}
        <div className="absolute -inset-16 sm:-inset-24 rounded-full border border-white/20 pointer-events-none animate-pulse" />
        <div className="absolute -inset-28 sm:-inset-36 rounded-full border border-white/10 pointer-events-none" />

        {/* Small Discovery Tag */}
        <span className="text-xs sm:text-sm font-semibold tracking-[0.3em] uppercase text-white/80 mb-2">
          KHÁM PHÁ MỚI
        </span>

        {/* Big Radiant Rarity Typography */}
        <h1
          className={`text-7xl sm:text-9xl font-black tracking-wider uppercase bg-gradient-to-b ${currentRarityStyle.text} bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(255,255,255,0.6)] my-2`}
        >
          {highestRarity}
        </h1>

        {/* Discovered Subtitle with Stars */}
        <div className="flex items-center gap-3 mt-4">
          <span className="text-xs text-white/60">✦</span>
          <span className="text-lg sm:text-2xl font-bold tracking-[0.25em] uppercase text-white drop-shadow-md">
            ĐÃ XUẤT HIỆN
          </span>
          <span className="text-xs text-white/60">✦</span>
        </div>

        {/* Skip Hint */}
        <span className="text-xs text-white/50 mt-8 animate-bounce font-mono tracking-wider">
          (Nhấn vào màn hình để xem thẻ)
        </span>
      </div>
    </div>
  );
};
