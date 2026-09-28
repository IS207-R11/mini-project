"use client";

import Image from "next/image";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { Menu, Bookmark, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSavedFoods } from "@/context/SavedFoodsContext";
import { useSavedSheet } from "@/components/providers/AppProviders";
import { PWAInstallButton } from "@/components/pwa/PWAInstallButton";

const links = [{ href: "/", label: "Khám phá", segment: null }, { href: "/tai-nguyen", label: "Thư viện món", segment: "tai-nguyen" }, { href: "/tai-lieu", label: "Về dự án", segment: "tai-lieu" }];
export function Navbar() {
  const segment = useSelectedLayoutSegment(); const [open, setOpen] = useState(false); const { savedFoods } = useSavedFoods(); const { openSaved } = useSavedSheet();
  return <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-xl">
    <div className="container mx-auto flex h-18 max-w-6xl items-center justify-between px-4 sm:px-6">
      <Link href="/" className="flex items-center gap-3" aria-label="Ăn gì? — trang chủ"><Image src="/logos/main-logo.png" alt="Ăn gì?" width={42} height={52} priority className="h-11 w-auto rounded-lg" /><span className="font-heading text-xl tracking-wide text-foreground">ĂN GÌ?</span></Link>
      <nav className="hidden items-center gap-1 rounded-full border border-border bg-card/70 p-1 md:flex">{links.map((link) => <Link key={link.href} href={link.href} className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${segment === link.segment ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}>{link.label}</Link>)}</nav>
      <div className="flex items-center gap-1.5">
        <PWAInstallButton />
        <Button variant="ghost" size="icon" className="relative rounded-full" onClick={openSaved} aria-label="Món đã lưu"><Bookmark /><span className="sr-only">Món đã lưu</span>{savedFoods.length > 0 && <Badge className="absolute -right-1 -top-1 size-5 justify-center rounded-full p-0 text-[10px]">{savedFoods.length}</Badge>}</Button>
        <Button variant="ghost" size="icon" className="rounded-full md:hidden" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Mở menu">{open ? <X /> : <Menu />}</Button>
      </div>
    </div>
    <AnimatePresence>{open && <motion.nav initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden border-t border-border bg-card px-4 md:hidden"><div className="flex flex-col gap-1 py-3">{links.map((link) => <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className={`rounded-xl px-4 py-3 text-sm font-semibold ${segment === link.segment ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary"}`}>{link.label}</Link>)}</div></motion.nav>}</AnimatePresence>
  </header>;
}
