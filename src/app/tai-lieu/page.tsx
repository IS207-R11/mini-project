import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tài liệu | Food Life",
  description:
    "Tài liệu mô tả nguồn dữ liệu, luồng hoạt động và quy tắc làm giàu dữ liệu món ăn cho dự án Food Life.",
  openGraph: {
    title: "Tài liệu | Food Life",
    description:
      "Nguồn dữ liệu, luồng hoạt động và quy tắc làm giàu dữ liệu món ăn.",
    type: "website",
    locale: "vi_VN",
  },
};

const dataSources = [
  {
    name: "foods.json",
    vi: "Dữ liệu món ăn đầu vào cần được làm giàu dinh dưỡng và phân loại khung giờ ăn.",
    en: "Input dishes data to be enriched with nutrition and meal-session classification.",
  },
  {
    name: "viendinhduong-nutritions.json",
    vi: "Dinh dưỡng chuẩn Viện Dinh Dưỡng Việt Nam. Ưu tiên tra cứu theo tên tiếng Việt.",
    en: "Vietnam National Institute of Nutrition data. Looked up first, by Vietnamese name.",
  },
  {
    name: "Gemini API (model lite)",
    vi: "Trích xuất thành phần chính của món ăn (Việt + Anh) và phân loại khung giờ ăn. Chỉ trích xuất, không bịa số liệu.",
    en: "Extracts main ingredients (VI + EN) and classifies meal sessions. Extraction only — never fabricates numbers.",
  },
  {
    name: "API Ninjas",
    vi: "Nguồn dinh dưỡng dự phòng, tra theo tên tiếng Anh khi Viện Dinh Dưỡng thiếu calories hoặc protein.",
    en: "Fallback nutrition source, queried by English name when VDD lacks calories or protein.",
  },
];

const modules = [
  "os, re, sys, json, time, difflib, unicodedata (thư viện chuẩn / standard library)",
  "requests — gọi HTTP API",
  "google-genai / google.generativeai — SDK gọi Gemini",
];

const flowSteps = [
  {
    vi: "Nạp foods.json và viendinhduong-nutritions.json từ đĩa.",
    en: "Load foods.json and viendinhduong-nutritions.json from disk.",
  },
  {
    vi: "Xây chỉ mục tra cứu VDD (VDDMatcher): chuẩn hóa tên, đồng nghĩa, fuzzy match.",
    en: "Build VDD lookup index (VDDMatcher): normalize names, synonyms, fuzzy matching.",
  },
  {
    vi: "Chia món ăn thành từng batch 12 món, gọi Gemini để trích xuất thành phần và sessions.",
    en: "Split dishes into batches of 12, call Gemini to extract ingredients and sessions.",
  },
  {
    vi: "Với mỗi thành phần: tra VDD trước (theo tiếng Việt), thiếu thì fallback API Ninjas (theo tiếng Anh).",
    en: "For each ingredient: look up VDD first (Vietnamese), fallback to API Ninjas (English) if missing.",
  },
  {
    vi: "Gộp kết quả: VDD ưu tiên, Ninjas bù phần thiếu; cả hai thiếu thì để null.",
    en: "Merge results: VDD first, Ninjas fills gaps; both missing → null.",
  },
  {
    vi: "Cache theo từng thành phần để tránh gọi API trùng lặp; nghỉ 0.3s giữa các request Ninjas.",
    en: "Cache per ingredient to avoid duplicate calls; sleep 0.3s between Ninja requests.",
  },
  {
    vi: "Gán nutritions và sessions vào từng món, lưu backup rồi ghi đè foods.json.",
    en: "Attach nutritions and sessions to each dish, back up, then overwrite foods.json.",
  },
];

const rules = [
  {
    vi: "Không bịa số liệu: cả hai nguồn không có thì để null.",
    en: "Never fabricate numbers: null when both sources lack data.",
  },
  {
    vi: "Không để lộ API KEY trong code, comment hay tài liệu.",
    en: "Never expose API keys in code, comments, or documentation.",
  },
  {
    vi: 'Sessions chỉ nhận 4 giá trị: "Sáng sớm", "Giữa trưa", "Chiều", "Tối".',
    en: 'Sessions allow only 4 values: "Sáng sớm", "Giữa trưa", "Chiều", "Tối".',
  },
  {
    vi: "Gemini chỉ trích xuất thành phần, không sáng tác số liệu dinh dưỡng.",
    en: "Gemini only extracts ingredients — no invented nutrition numbers.",
  },
  {
    vi: "Dùng cache và batch để giảm số request và token tiêu thụ.",
    en: "Use cache and batching to reduce requests and token usage.",
  },
];

const notes = [
  {
    vi: "API key đặt qua biến môi trường: GEMINI_API_KEY, API_NINJAS_KEY.",
    en: "API keys are provided via env vars: GEMINI_API_KEY, API_NINJAS_KEY.",
  },
  {
    vi: "Cờ CLI hỗ trợ: --debug, --debug-vdd, --dry-run, --limit N.",
    en: "Supported CLI flags: --debug, --debug-vdd, --dry-run, --limit N.",
  },
  {
    vi: "Luôn tạo backup foods.json.bak trước khi ghi đè.",
    en: "Always create foods.json.bak backup before overwriting.",
  },
];

export default function TaiLieuPage() {
  return (
    <main className="container mx-auto max-w-4xl px-4 py-12 md:py-16">
      <header className="mb-12 border-b border-border pb-8">
        <p className="mb-2 text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Documentation / Tài liệu
        </p>
        <h1 className="mb-3 text-4xl font-bold tracking-tight">
          Tài liệu dự án
        </h1>
        <p className="text-lg text-muted-foreground">
          Mô tả nguồn dữ liệu, luồng hoạt động và quy tắc làm giàu dữ liệu món ăn.
        </p>
        <p className="mt-1 text-base italic text-muted-foreground">
          Data sources, processing flow, and enrichment rules for Food Life.
        </p>
      </header>

      {/* 1. Tổng quan */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold">1. Tổng quan / Overview</h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          Script <code className="rounded bg-muted px-1.5 py-0.5 text-sm">get-name.py</code>{" "}
          làm giàu dữ liệu món ăn bằng cách bổ sung thông tin dinh dưỡng theo từng
          thành phần và phân loại khung giờ nên ăn.
        </p>
        <p className="mb-6 text-sm italic leading-relaxed text-muted-foreground">
          The script get-name.py enriches dish data by adding per-ingredient
          nutrition and classifying meal sessions.
        </p>

        <h3 className="mb-3 text-lg font-semibold">
          Module &amp; thư viện / Modules &amp; libraries
        </h3>
        <ul className="ml-5 list-disc space-y-1.5 text-sm text-muted-foreground">
          {modules.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
      </section>

      {/* 2. Nguồn dữ liệu */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold">
          2. Nguồn dữ liệu / Data Sources
        </h2>
        <div className="space-y-4">
          {dataSources.map((src) => (
            <div
              key={src.name}
              className="rounded-lg border border-border bg-card p-5"
            >
              <h3 className="mb-2 font-mono text-sm font-semibold text-primary">
                {src.name}
              </h3>
              <p className="text-sm leading-relaxed">{src.vi}</p>
              <p className="mt-1 text-sm italic leading-relaxed text-muted-foreground">
                {src.en}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Flow chi tiết */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold">
          3. Flow chi tiết / Detailed Flow
        </h2>
        <ol className="space-y-4">
          {flowSteps.map((step, i) => (
            <li key={i} className="flex gap-4">
              <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                {i + 1}
              </span>
              <div className="pt-0.5">
                <p className="text-sm leading-relaxed">{step.vi}</p>
                <p className="mt-1 text-sm italic leading-relaxed text-muted-foreground">
                  {step.en}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* 4. Quy tắc */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold">
          4. Quy tắc / Rules
        </h2>
        <ul className="space-y-3">
          {rules.map((r, i) => (
            <li
              key={i}
              className="rounded-lg border border-border bg-card p-4"
            >
              <p className="text-sm leading-relaxed">• {r.vi}</p>
              <p className="mt-1 text-sm italic leading-relaxed text-muted-foreground">
                • {r.en}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* 5. Ghi chú */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold">
          5. Ghi chú / Notes
        </h2>
        <ul className="ml-5 list-disc space-y-2 text-sm text-muted-foreground">
          {notes.map((n, i) => (
            <li key={i}>
              <p>{n.vi}</p>
              <p className="italic">{n.en}</p>
            </li>
          ))}
        </ul>
      </section>

      <footer className="border-t border-border pt-6 text-sm text-muted-foreground">
        <p>
          Cập nhật lần cuối: theo phiên bản mới nhất của{" "}
          <code className="rounded bg-muted px-1.5 py-0.5">get-name.py</code>.
        </p>
        <p className="italic">Last updated: latest revision of get-name.py.</p>
      </footer>
    </main>
  );
}