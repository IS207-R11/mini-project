import type { Metadata } from "next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons";
import { Badge } from "@/components/ui/badge";
import { TimeGreetingBar } from "@/components/home/TimeGreetingBar";
import { GachaGame } from "@/components/home/GachaGame";
import { allFoods } from "@/lib/foodData";

export const metadata: Metadata = {
  title: "FoodLife - Gacha Ẩm Thực Thông Minh",
  description: "Gợi ý món ăn thông minh theo buổi ăn và dinh dưỡng với trải nghiệm gacha mở thẻ bài độc đáo.",
};

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] ambient-bg pb-16 transition-colors duration-500">
      {/* ================= TOP TIME & GREETING BAR (CLIENT ISLAND) ================= */}
      <TimeGreetingBar />

      <div className="container mx-auto max-w-6xl px-4 sm:px-6 pt-8">
        {/* ================= HERO HEADER (SERVER RENDERED) ================= */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5 mb-8">
          <Badge className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold px-3 py-1 rounded-full border border-emerald-200/60">
            <FontAwesomeIcon
              icon={faWandMagicSparkles}
              className="mr-1.5 text-xs text-amber-500"
            />
            Trải Nghiệm Gacha Ẩm Thực
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Hôm Nay Bạn Muốn Ăn Gì?
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Mở gói thẻ bài ẩm thực để nhận gợi ý món ăn dinh dưỡng ngẫu nhiên được tinh chọn riêng cho bạn.
          </p>
        </div>

        {/* ================= GACHA GAME ISLAND (CLIENT ISLAND) ================= */}
        <GachaGame allFoods={allFoods} />
      </div>
    </div>
  );
}
