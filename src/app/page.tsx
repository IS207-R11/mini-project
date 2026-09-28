import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TimeGreetingBar } from "@/components/home/TimeGreetingBar";
import { GachaGame } from "@/components/home/GachaGame";
import { allFoods } from "@/lib/foodData";

export const metadata: Metadata = {
  title: "Gợi ý món ăn hôm nay",
  description: "Gợi ý món ăn thông minh theo buổi ăn và dinh dưỡng với trải nghiệm gacha mở thẻ bài độc đáo.",
};

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] ambient-bg pb-16 transition-colors duration-500">
      {/* ================= TOP TIME & GREETING BAR (CLIENT ISLAND) ================= */}
      <TimeGreetingBar />

      <div className="container mx-auto max-w-6xl px-4 sm:px-6 pt-8">
        {/* ================= HERO HEADER (SERVER RENDERED) ================= */}
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <Badge className="mb-4 rounded-full border-border bg-secondary px-3 py-1 font-bold text-secondary-foreground">
            <Sparkles data-icon="inline-start" /> Gợi ý cho hôm nay
          </Badge>
          <h1 className="font-heading text-4xl tracking-wide text-foreground sm:text-6xl">
            HÔM NAY ĂN GÌ?
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            ĂN GÌ? biến những phút phân vân thành hành trình khám phá. Mỗi lần gợi ý là một lựa chọn mới, hợp khẩu vị của riêng bạn.
          </p>
        </div>

        {/* ================= GACHA GAME ISLAND (CLIENT ISLAND) ================= */}
        <GachaGame allFoods={allFoods} />
      </div>
    </div>
  );
}
