import Link from "next/link";
import { Cloud, Heart, Github, Mail } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-secondary/30">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Brand & description */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.2}>
                  <path d="M3 12 Q 3 8 6 8 Q 9 8 9 12 Q 9 16 6 16 Q 3 16 3 12 Z" className="text-primary" />
                  <path d="M 9.5 12 Q 9.5 5.5 12 5.5 Q 14.5 5.5 14.5 12 Q 14.5 18.5 12 18.5 Q 9.5 18.5 9.5 12 Z" className="text-primary" />
                  <path d="M 15 12 Q 15 8 18 8 Q 21 8 21 12 Q 21 16 18 16 Q 15 16 15 12 Z" className="text-primary" />
                </svg>
              </div>
              <span className="font-bold text-foreground">Warisan Suara</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
              Platform AI untuk pelestarian bahasa daerah dan tradisi lisan
              Nusantara. Dibangun untuk BUDAYA GO! 2026 — Kompetisi Inovasi
              Budaya Indonesia, Kementerian Kebudayaan RI.
            </p>
          </div>

          {/* Stack info */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Teknologi</h3>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li className="flex items-center gap-2">
                <Cloud className="h-3.5 w-3.5 text-primary" />
                Next.js 16 PWA + Cloudflare Pages
              </li>
              <li className="flex items-center gap-2">
                <Cloud className="h-3.5 w-3.5 text-primary" />
                Cloudflare D1 + R2 Storage
              </li>
              <li className="flex items-center gap-2">
                <Cloud className="h-3.5 w-3.5 text-primary" />
                Cloudflare Workers AI (ASR/TTS/LLM)
              </li>
              <li className="flex items-center gap-2">
                <Cloud className="h-3.5 w-3.5 text-primary" />
                Cloudflare Turnstile + WAF
              </li>
            </ul>
          </div>

          {/* Links & credits */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Tautan</h3>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link
                  href="#peta-bahasa"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Peta Bahasa Daerah
                </Link>
              </li>
              <li>
                <Link
                  href="#studio-rekam"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Studio Rekam
                </Link>
              </li>
              <li>
                <Link
                  href="#belajar"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Modul Belajar
                </Link>
              </li>
              <li>
                <Link
                  href="#tutor"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  AI Tutor
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[11px] text-muted-foreground text-center sm:text-left">
            © 2026 Warisan Suara. Tema: <span className="font-medium text-foreground">Indonesia Cultural Power</span> · Sub Tema: Inventing the Future from Indonesian Culture
          </p>
          <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
            Dibangun dengan <Heart className="h-3 w-3 fill-primary text-primary" /> untuk Nusantara
          </p>
        </div>
      </div>
    </footer>
  );
}
