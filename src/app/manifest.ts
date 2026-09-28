import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest { return { name: "Ăn gì?", short_name: "Ăn gì?", description: "Gợi ý món ăn hôm nay.", start_url: "/", display: "standalone", background_color: "#fff3d6", theme_color: "#2e7d32", lang: "vi", icons: [{ src: "/logos/favicon.png", sizes: "192x192", type: "image/png" }] }; }
