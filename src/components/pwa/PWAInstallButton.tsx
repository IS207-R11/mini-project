"use client";

import { Download } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface InstallPromptEvent extends Event { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }>; }
export function PWAInstallButton() {
  const [prompt, setPrompt] = useState<InstallPromptEvent | null>(null);
  useEffect(() => { const handler = (event: Event) => { event.preventDefault(); setPrompt(event as InstallPromptEvent); }; window.addEventListener("beforeinstallprompt", handler); if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => undefined); return () => window.removeEventListener("beforeinstallprompt", handler); }, []);
  const install = async () => { if (!prompt) return; await prompt.prompt(); await prompt.userChoice; setPrompt(null); };
  return <Button variant="outline" size="sm" onClick={install} disabled={!prompt} className="hidden rounded-full sm:inline-flex"><Download data-icon="inline-start" />Tải xuống</Button>;
}
