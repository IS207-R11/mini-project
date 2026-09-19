import type { Metadata } from "next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUtensils } from "@fortawesome/free-solid-svg-icons";
import { Badge } from "@/components/ui/badge";
import { ResourcesExplorer } from "@/components/resources/ResourcesExplorer";
import { allFoods } from "@/lib/foodData";

export const metadata: Metadata = {
  title: "Kho Tàng Món Ăn - FoodLife",
  description: "Khám phá danh mục thẻ bài ẩm thực với đầy đủ hình ảnh, nguyên liệu và thông số dinh dưỡng chi tiết.",
};

export default function ResourcesPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] ambient-bg pb-20 transition-colors duration-500">
      {/* ================= PAGE HEADER (SERVER RENDERED) ================= */}
      <section className="border-b border-emerald-900/10 dark:border-emerald-500/15 bg-background/60 backdrop-blur-xs py-10 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl text-center space-y-3">
          <Badge className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold px-3 py-1 rounded-full">
            <FontAwesomeIcon icon={faUtensils} className="mr-1.5 text-xs text-emerald-600" />
            <span>Thư Viện Món Ăn</span>
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            Kho Tàng Món Ăn
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Khám phá danh mục thẻ bài ẩm thực với đầy đủ hình ảnh, nguyên liệu và thông số dinh dưỡng chi tiết.
          </p>
        </div>
      </section>

      {/* ================= RESOURCES EXPLORER ISLAND (CLIENT ISLAND) ================= */}
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 pt-8">
        <ResourcesExplorer foods={allFoods} />
      </div>
    </div>
  );
}
