import type { Metadata } from "next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUtensils } from "@fortawesome/free-solid-svg-icons";
import { Badge } from "@/components/ui/badge";
import { ResourcesExplorer } from "@/components/resources/ResourcesExplorer";
import { allFoods } from "@/lib/foodData";

export const metadata: Metadata = {
  title: "Thư viện món ăn",
  description: "Khám phá danh mục thẻ bài ẩm thực với đầy đủ hình ảnh, nguyên liệu và thông số dinh dưỡng chi tiết.",
};

export default function ResourcesPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] ambient-bg pb-20 transition-colors duration-500">
      {/* ================= PAGE HEADER (SERVER RENDERED) ================= */}
      <section className="border-b border-border/60 bg-card/40 py-10 px-4 backdrop-blur-xs sm:px-6">
        <div className="container mx-auto max-w-6xl text-center">
          <Badge className="mb-3 rounded-full border-border bg-secondary px-3 py-1 font-bold text-secondary-foreground">
            <FontAwesomeIcon icon={faUtensils} className="mr-1.5 text-xs" />
            <span>Thư Viện Món Ăn</span>
          </Badge>
          <h1 className="font-heading text-3xl tracking-wide text-foreground sm:text-5xl">
            Kho Tàng Món Ăn
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
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
