"use client";

import { useState } from "react";
import { X, Code2, Palette, TrendingUp, Mail, Globe, Cloud, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TeamMember {
  name: string;
  degree: string;
  role: string;
  responsibility: string;
  icon: typeof Code2;
  accent: string;
  skills: string[];
}

const TEAM: TeamMember[] = [
  {
    name: "Febri Rizki",
    degree: "S.Si., M.Si.",
    role: "Ketua · AI Engineer & Web App",
    responsibility: "Arsitektur Next.js 16, integrasi Cloudflare (D1, Workers AI, Pages, Turnstile), AI service layer (Whisper ASR, Llama LLM, MeloTTS), Pages Functions deployment.",
    icon: Code2,
    accent: "text-primary",
    skills: ["Next.js 16", "Cloudflare Workers AI", "TypeScript", "Prisma + D1", "PWA"],
  },
  {
    name: "Oki Handinata",
    degree: "S.Si.",
    role: "Anggota · UI/UX Designer",
    responsibility: "Mobile-app UI/UX design dengan 5-tab bottom navigation, batik earthy color palette (terracotta, gold, maroon, cream), shadcn/ui components, user flow optimization, 10 mockup aplikasi.",
    icon: Palette,
    accent: "text-accent-foreground",
    skills: ["UI/UX Design", "Mobile-first PWA", "shadcn/ui", "Batik Color System", "Figma"],
  },
  {
    name: "Martha Martinni",
    degree: "S.Si.",
    role: "Anggota · Strategi Startup & Model Bisnis",
    responsibility: "Business Model Canvas (9 elemen), B2G/B2B/B2C revenue streams, roadmap 5 tahun, kemitraan pemda & sekolah, strategi komersialisasi & hilirisasi pasca kompetisi.",
    icon: TrendingUp,
    accent: "text-destructive",
    skills: ["Business Model Canvas", "B2G/B2B/B2C Strategy", "Startup Strategy", "Roadmap", "Partnerships"],
  },
];

export function TeamSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Sheet */}
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-background rounded-t-2xl sm:rounded-2xl border border-border shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-background/95 backdrop-blur-md border-b border-border px-5 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">Tim Warisan Suara</h2>
            <p className="text-[11px] text-muted-foreground">BUDAYA GO! 2026 · Kompetisi Inovasi Budaya</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Hero info */}
          <div className="rounded-xl bg-gradient-to-br from-primary/10 via-accent/10 to-destructive/10 p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              <p className="text-sm font-semibold text-foreground">Komposisi Tim (sesuai Juknis)</p>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              1 pengembang produk digital + 1 ahli ekonomi + 1 ahli substansi/disain.
              Wajib 3 anggota, WNI, usia minimal 17 tahun.
            </p>
          </div>

          {/* Team members */}
          {TEAM.map((member, idx) => {
            const Icon = member.icon;
            return (
              <Card key={idx} className="p-4 space-y-3 border-l-4" style={{
                borderLeftColor: idx === 0 ? "oklch(0.52 0.16 45)" : idx === 1 ? "oklch(0.82 0.14 75)" : "oklch(0.5 0.18 25)"
              }}>
                <div className="flex items-start gap-3">
                  <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0", idx === 0 ? "bg-primary/15" : idx === 1 ? "bg-accent/30" : "bg-destructive/10")}>
                    <Icon className={cn("h-5 w-5", member.accent)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <h3 className="font-bold text-foreground text-sm">{member.name}</h3>
                      <span className="text-[10px] text-muted-foreground">{member.degree}</span>
                    </div>
                    <p className={cn("text-xs font-semibold mt-0.5", member.accent)}>{member.role}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {member.responsibility}
                </p>
                <div className="flex flex-wrap gap-1">
                  {member.skills.map((s) => (
                    <Badge key={s} variant="outline" className="text-[9px] py-0.5 px-1.5">
                      {s}
                    </Badge>
                  ))}
                </div>
              </Card>
            );
          })}

          {/* Tech stack summary */}
          <div className="rounded-lg border border-border p-3 space-y-2">
            <div className="flex items-center gap-1.5">
              <Cloud className="h-3.5 w-3.5 text-primary" />
              <p className="text-xs font-semibold text-foreground">Stack Produksi</p>
            </div>
            <div className="grid grid-cols-2 gap-1 text-[10px] text-muted-foreground">
              <span>• Cloudflare Pages (free)</span>
              <span>• Cloudflare D1 (free)</span>
              <span>• Workers AI (free)</span>
              <span>• Cloudflare KV (free)</span>
              <span>• Turnstile (anti-bot)</span>
              <span>• Next.js 16 + TS 5</span>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-1.5 pt-2 border-t border-border">
            <div className="flex items-center gap-2 text-xs">
              <Mail className="h-3.5 w-3.5 text-primary" />
              <span className="text-muted-foreground">warisansuara.id@gmail.com</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Globe className="h-3.5 w-3.5 text-primary" />
              <span className="text-muted-foreground">warisan-suara.pages.dev</span>
            </div>
          </div>

          <Button onClick={onClose} className="w-full bg-primary hover:bg-primary/90 text-sm h-9">
            Tutup
          </Button>
        </div>
      </div>
    </div>
  );
}

export function useTeamSheet() {
  const [open, setOpen] = useState(false);
  return { open, setOpen };
}
