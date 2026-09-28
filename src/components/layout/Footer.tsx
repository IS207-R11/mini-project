import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeaf, faHeart } from "@fortawesome/free-solid-svg-icons";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border/70 bg-card/55 py-12 transition-colors duration-300">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand info */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <FontAwesomeIcon icon={faLeaf} className="text-sm" />
              </div>
              <span className="text-lg font-bold text-foreground">
                ĂN GÌ?
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              ĂN GÌ? giúp biến câu hỏi quen thuộc “Hôm nay ăn gì?” thành một hành trình khám phá những món hợp khẩu vị của bạn.
            </p>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary bg-secondary px-3 py-1 rounded-full">
              <span>Khám phá • Gợi ý • Đúng gu</span>
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
                  className="hover:text-primary transition-colors"
                >
                  Trang Chủ
                </Link>
              </li>
              <li>
                <Link
                  href="/tai-nguyen"
                  className="hover:text-primary transition-colors"
                >
                  Tài Nguyên
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-border/70 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-3">
          <p>© 2026 ĂN GÌ? Một gợi ý nhỏ cho mỗi bữa ăn vui hơn.</p>
          <div className="flex items-center gap-1.5">
            <span>Tận tâm</span>
            <FontAwesomeIcon icon={faHeart} className="text-primary text-xs" />
            <span>vì một ngày mai khỏe mạnh</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
