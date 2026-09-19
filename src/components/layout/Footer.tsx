import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeaf, faHeart } from "@fortawesome/free-solid-svg-icons";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-emerald-900/10 dark:border-emerald-500/15 bg-emerald-50/40 dark:bg-emerald-950/20 py-12 transition-colors duration-300">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand info */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
                <FontAwesomeIcon icon={faLeaf} className="text-sm" />
              </div>
              <span className="text-lg font-bold text-foreground">
                Food<span className="text-emerald-600 dark:text-emerald-400">Life</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              FoodLife mang đến niềm vui khám phá ẩm thực lành mạnh mỗi ngày với thông tin dinh dưỡng minh bạch, khoa học và trải nghiệm gacha mở gói độc đáo.
            </p>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-100/60 dark:bg-emerald-900/40 px-3 py-1 rounded-full">
              <span>Lối Sống Xanh • Dinh Dưỡng Chuẩn • Vui Tươi</span>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Liên Kết Nhanh
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/"
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  Trang Chủ
                </Link>
              </li>
              <li>
                <Link
                  href="/tai-nguyen"
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  Tài Nguyên
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-emerald-900/10 dark:border-emerald-500/15 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-3">
          <p>© 2026 FoodLife. Thiết kế vì một lối sống khỏe mạnh và tràn đầy năng lượng.</p>
          <div className="flex items-center gap-1.5">
            <span>Tận tâm</span>
            <FontAwesomeIcon icon={faHeart} className="text-rose-500 text-xs" />
            <span>vì một ngày mai khỏe mạnh</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
