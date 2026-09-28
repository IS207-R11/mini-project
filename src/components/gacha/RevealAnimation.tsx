"use client";
import { useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import type { Rarity } from "@/types/food";
export function RevealAnimation({ highestRarity, onFinish }: { highestRarity: Rarity; onFinish: () => void }) {
  useEffect(() => { confetti({ particleCount: highestRarity === "SSR" ? 90 : 50, spread: 70, origin: { y: .6 }, colors: ["#f4a261", "#ffc300", "#ff9f1c", "#fff7ed"] }); const timer = window.setTimeout(onFinish, 1800); return () => window.clearTimeout(timer); }, [highestRarity, onFinish]);
  return <button onClick={onFinish} className="fixed inset-0 z-50 flex w-full cursor-pointer flex-col items-center justify-center bg-background/95 text-foreground backdrop-blur-xl"><motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-bold tracking-[.3em]">KHÁM PHÁ MỚI</motion.p><motion.h1 initial={{ scale: .5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 220 }} className="font-heading my-5 text-8xl tracking-wider text-primary sm:text-9xl">{highestRarity}</motion.h1><p className="text-lg font-bold tracking-[.18em]">ĐÃ XUẤT HIỆN</p><span className="mt-10 text-xs text-muted-foreground">Chạm để xem thẻ</span></button>;
}
