"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Mic, BookOpen, MessageCircle, Map as MapIcon, Library } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "#peta-bahasa", label: "Peta Bahasa", icon: MapIcon },
  { href: "#studio-rekam", label: "Studio Rekam", icon: Mic },
  { href: "#belajar", label: "Belajar", icon: BookOpen },
  { href: "#tutor", label: "Tutor AI", icon: MessageCircle },
  { href: "#tradisi", label: "Tradisi Lisan", icon: Library },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300",
        scrolled
          ? "bg-background/85 backdrop-blur-md border-border shadow-sm"
          : "bg-background/60 backdrop-blur-sm border-transparent"
      )}
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="#top" className="flex items-center gap-2.5 group">
            <div className="relative h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-destructive/10" />
              <svg viewBox="0 0 24 24" className="relative h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.2}>
                <path d="M3 12 Q 3 8 6 8 Q 9 8 9 12 Q 9 16 6 16 Q 3 16 3 12 Z" className="text-primary" />
                <path d="M 9.5 12 Q 9.5 5.5 12 5.5 Q 14.5 5.5 14.5 12 Q 14.5 18.5 12 18.5 Q 9.5 18.5 9.5 12 Z" className="text-primary" />
                <path d="M 15 12 Q 15 8 18 8 Q 21 8 21 12 Q 21 16 18 16 Q 15 16 15 12 Z" className="text-primary" />
              </svg>
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                Warisan Suara
              </span>
              <span className="text-[10px] text-muted-foreground font-medium tracking-wide">
                BUDAYA GO! 2026
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-accent/40 rounded-md transition-all"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              asChild
              className="hidden sm:inline-flex bg-primary hover:bg-primary/90"
            >
              <Link href="#studio-rekam">
                <Mic className="h-4 w-4 mr-1.5" />
                Rekam Sekarang
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="md:hidden border-t border-border py-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-foreground hover:bg-accent/40 rounded-md transition-colors"
              >
                <item.icon className="h-4 w-4 text-primary" />
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
