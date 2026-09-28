"use client";

import { motion } from "framer-motion";
import { Sparkles, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BoosterPackProps { count: number; onOpen: () => void; isOpening?: boolean; }
export function BoosterPack({ count, onOpen, isOpening = false }: BoosterPackProps) {
  return <div className="flex flex-col items-center"><motion.div animate={isOpening ? { scale: .94, opacity: .45, rotate: 2 } : { y: [0, -6, 0] }} transition={{ duration: 3, repeat: isOpening ? 0 : Infinity, ease: "easeInOut" }} className="relative h-[340px] w-[245px] rounded-3xl border-2 border-primary/60 bg-card p-3 shadow-xl"><div className="flex h-full flex-col items-center justify-between rounded-2xl border border-border bg-secondary/45 p-6 text-center"><span className="rounded-full bg-primary px-3 py-1 text-[10px] font-bold tracking-widest text-primary-foreground">ĂN GÌ? · HÔM NAY</span><div className="flex flex-col items-center gap-4"><div className="flex size-24 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg"><UtensilsCrossed className="size-10" /></div><div><h3 className="font-heading text-2xl tracking-wide text-foreground">GÓI GỢI Ý</h3><p className="mt-2 text-xs leading-relaxed text-muted-foreground">Một lựa chọn ngẫu nhiên, có thể đúng món bạn đang thèm.</p></div></div><span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-foreground">{count} thẻ chờ mở</span></div></motion.div><Button size="lg" onClick={onOpen} disabled={isOpening} className="mt-7 rounded-full px-8 py-6 text-base font-bold"><Sparkles data-icon="inline-start" />{isOpening ? "Đang mở gói..." : "Mở gói ngay"}</Button><p className="mt-3 text-xs text-muted-foreground">Gợi ý được chọn từ sở thích và bộ lọc của bạn</p></div>;
}
