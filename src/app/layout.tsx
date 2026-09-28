import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "@/index.css";
import { AppProviders } from "@/components/providers/AppProviders";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const montserrat = Montserrat({ subsets: ["latin", "vietnamese"], variable: "--font-montserrat", display: "swap", preload: true });
export const metadata: Metadata = { metadataBase: new URL("https://angi.vn"), title: { default: "Ăn gì? | Gợi ý món ăn hôm nay", template: "%s | Ăn gì?" }, description: "ĂN GÌ? biến câu hỏi hôm nay ăn gì thành hành trình khám phá món ăn phù hợp khẩu vị của bạn.", keywords: ["ăn gì", "gợi ý món ăn", "món Việt", "dinh dưỡng"], openGraph: { type: "website", locale: "vi_VN", siteName: "Ăn gì?", title: "Ăn gì? | Gợi ý món ăn hôm nay", description: "Khám phá món ăn phù hợp khẩu vị của bạn." }, twitter: { card: "summary", title: "Ăn gì?", description: "Gợi ý món ăn hôm nay." }, icons: { icon: "/logos/favicon.png", apple: "/logos/favicon.png" }, manifest: "/manifest.webmanifest" };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${montserrat.variable} min-h-screen font-sans antialiased flex flex-col bg-background text-foreground`}>
        <AppProviders>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
