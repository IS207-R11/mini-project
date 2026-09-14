import type { Metadata } from "next";
import "@/index.css";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "FoodLife - Khám phá món ăn & Dinh dưỡng",
  description:
    "Trải nghiệm gacha món ăn, dinh dưỡng cân bằng và lối sống lành mạnh mỗi ngày.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="min-h-screen font-sans antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
