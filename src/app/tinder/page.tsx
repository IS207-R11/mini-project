import type { Metadata } from "next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFire, faHeart } from "@fortawesome/free-solid-svg-icons";
import { Badge } from "@/components/ui/badge";
import { TinderGame } from "@/components/tinder/TinderGame";
import { allFoods } from "@/lib/foodData";

export const metadata: Metadata = {
  title: "Tinder Món Ăn | Ăn gì? - Quẹt Chọn Món Ăn Định Mệnh",
  description:
    "Trải nghiệm quẹt thẻ kiểu Tinder độc đáo. Chọn bộ lọc, quẹt phải chốt ngay món yêu thích, quẹt trái bỏ qua. Dinh dưỡng chuẩn hóa và calo khoa học.",
};

export default function TinderPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] pb-16 transition-colors duration-500">
      {/* Header Intro */}
      <section className="py-6 sm:py-8 px-4 border-b border-border/60 bg-card/60 backdrop-blur-md">
        <div className="container mx-auto max-w-4xl text-center space-y-2.5">
          <Badge className="bg-gradient-to-r from-rose-500/15 via-orange-500/15 to-amber-500/15 text-foreground font-black px-3.5 py-1 rounded-full border border-orange-500/30 text-xs shadow-xs">
            <FontAwesomeIcon icon={faFire} className="mr-1.5 text-xs text-rose-500 animate-pulse" />
            <span>Tinder Ẩm Thực Thông Minh</span>
          </Badge>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground flex items-center justify-center gap-2">
            <span>Quẹt Phải Chốt Món Ngay</span>
            <FontAwesomeIcon icon={faHeart} className="text-emerald-500 text-xl sm:text-2xl" />
          </h1>

          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Chọn bộ lọc theo bữa ăn, ngân sách hoặc chế độ chay/mặn, sau đó nhấn nút để bắt đầu quẹt chọn món ăn ưng ý nhất cho hôm nay.
          </p>
        </div>
      </section>

      {/* Main Tinder Game Area */}
      <div className="container mx-auto max-w-5xl px-3 sm:px-6 pt-6 sm:pt-8">
        <TinderGame allFoods={allFoods} />
      </div>
    </div>
  );
}
