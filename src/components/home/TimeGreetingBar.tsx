"use client";

import { Clock3, Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useTimeTheme } from "@/context/TimeThemeContext";

const copy = { morning: ["Chào ngày mới", "Bắt đầu thật nhẹ nhàng, ngon lành."], midday: ["Đến giờ nạp năng lượng", "Một bữa trưa vừa vị để tiếp tục ngày dài."], afternoon: ["Chút hứng khởi buổi chiều", "Khám phá một món mới cho giờ xế."], night: ["Tối nay ăn gì nhỉ?", "Chọn một món ấm bụng, khép lại ngày thật ngon."] } as const;
export function TimeGreetingBar() {
  const { currentTime, currentDate, period } = useTimeTheme(); const [title, subtitle] = copy[period]; const Icon = period === "night" ? Moon : Sun;
  return <section className="border-b border-border/60 bg-card/40 px-4 py-4 backdrop-blur-sm sm:px-6"><div className="container mx-auto flex max-w-6xl items-center justify-between gap-4"><motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3"><div className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground"><Icon /></div><div><p className="text-sm font-bold text-foreground">{title}</p><p className="text-xs text-muted-foreground">{subtitle}</p></div></motion.div><div className="hidden text-right sm:block"><p className="text-xs font-semibold capitalize text-muted-foreground">{currentDate}</p><p className="mt-1 flex items-center justify-end gap-1.5 text-sm font-bold text-foreground"><Clock3 className="size-3.5" />{currentTime}</p></div></div></section>;
}
