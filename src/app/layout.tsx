import type { Metadata } from "next";
import "@/index.css";
import { AppProviders } from "@/components/providers/AppProviders";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

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
      <body className="min-h-screen font-sans antialiased flex flex-col bg-background text-foreground selection:bg-emerald-200 selection:text-emerald-900 dark:selection:bg-emerald-800 dark:selection:text-emerald-100">
        <AppProviders>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
