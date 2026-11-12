"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Mic, BookOpen, Sparkles, AlertTriangle, Map as MapIcon, Library, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Stats {
  totalLanguages: number;
  totalTraditions: number;
  totalModules: number;
  totalSpeakersCovered: number;
  vitalities: Record<string, number>;
}

type TabId = "beranda" | "bahasa" | "rekam" | "belajar" | "arsip";

export function HeroSection({ onNavigate }: { onNavigate?: (t: TabId) => void }) {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  const go = (t: TabId) => onNavigate?.(t);

  return (
    <section className="relative overflow-hidden bg-batik-pattern pb-6">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 h-56 w-56 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute top-32 -left-20 h-64 w-64 rounded-full bg-accent/15 blur-3xl" />
      </div>

      <div className="relative px-4 py-8 sm:py-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/30 border border-accent/40 text-[11px] font-medium text-foreground mb-4">
          <Sparkles className="h-3 w-3 text-primary" />
          BUDAYA GO! 2026 · Indonesia Cultural Power
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-[1.1] mb-3">
          <span className="text-foreground">Menyelamatkan</span>{" "}
          <span className="text-gradient-batik">Bahasa & Tradisi</span>{" "}
          <span className="text-foreground">Lisan Nusantara</span>
        </h1>

        <p className="text-sm text-muted-foreground leading-relaxed mb-5">
          Indonesia punya <strong className="text-foreground">700+ bahasa daerah</strong>, banyak
          kini <strong className="text-destructive">terancam punah</strong>. Warisan Suara adalah
          platform AI untuk merekam, mempelajari, dan mewariskan khazanah lisan — sebelum hilang.
        </p>

        {/* CTA buttons - mobile stack */}
        <div className="flex flex-col gap-2 mb-5">
          <Button
            size="lg"
            onClick={() => go("rekam")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground w-full"
          >
            <Mic className="h-4 w-4 mr-2" />
            Mulai Rekam Suara
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <Button
              size="default"
              variant="outline"
              onClick={() => go("bahasa")}
              className="border-primary/30 hover:bg-accent/20"
            >
              <MapIcon className="h-4 w-4 mr-1.5" />
              Peta Bahasa
            </Button>
            <Button
              size="default"
              variant="outline"
              onClick={() => go("belajar")}
              className="border-primary/30 hover:bg-accent/20"
            >
              <BookOpen className="h-4 w-4 mr-1.5" />
              Belajar
            </Button>
          </div>
        </div>

        {/* Stats grid */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
            <StatCard
              label="Bahasa"
              value={stats.totalLanguages.toString()}
              accent="primary"
            />
            <StatCard
              label="Tradisi"
              value={stats.totalTraditions.toString()}
              accent="accent"
            />
            <StatCard
              label="Penutur"
              value={formatMillions(stats.totalSpeakersCovered)}
              accent="primary"
            />
            <StatCard
              label="Terancam"
              value={(stats.vitalities.TERANCAM ?? 0).toString()}
              accent="destructive"
              icon={<AlertTriangle className="h-3 w-3" />}
            />
          </div>
        )}

        {/* Quick access cards - mobile grid */}
        <div className="grid grid-cols-2 gap-2.5 mt-6">
          <QuickCard
            icon={<Mic className="h-4 w-4" />}
            title="Studio Rekam"
            desc="Rekam & transkripsi AI"
            onClick={() => go("rekam")}
          />
          <QuickCard
            icon={<BookOpen className="h-4 w-4" />}
            title="Modul Belajar"
            desc="8 modul bahasa daerah"
            onClick={() => go("belajar")}
          />
          <QuickCard
            icon={<MapIcon className="h-4 w-4" />}
            title="Peta Bahasa"
            desc="10 bahasa, 4 terancam"
            onClick={() => go("bahasa")}
          />
          <QuickCard
            icon={<Library className="h-4 w-4" />}
            title="Arsip Lisan"
            desc="20 tradisi Nusantara"
            onClick={() => go("arsip")}
          />
        </div>

        {/* Featured: Bahasa Ternate (terancam) */}
        <Card className="mt-5 relative overflow-hidden border-primary/30">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-accent/8 to-destructive/8" />
          <div className="relative p-4 space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="bg-destructive/15 text-destructive border-destructive/30 text-[10px]">
                <AlertTriangle className="h-2.5 w-2.5 mr-1" />
                Terancam Punah
              </Badge>
              <span className="text-[10px] text-muted-foreground">Maluku Utara</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Bahasa Ternate</h3>
              <p className="text-xs text-muted-foreground">
                Penutur: <span className="font-semibold text-destructive">±80.000</span>
              </p>
            </div>
            {/* Waveform */}
            <div className="flex items-center gap-1 h-10 px-2 rounded-md bg-secondary/40">
              {[40, 70, 90, 60, 100, 75, 45, 80, 95, 55, 35, 65, 85, 50, 70, 60, 80, 45].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-full bg-primary/50"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-foreground italic">
                &ldquo;Bicara ma ngofa, salam se jadi tamu&rdquo;
              </p>
              <p className="text-[10px] text-muted-foreground">
                ID: Berbicara dengan anak, salam jadi tamu
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-primary hover:bg-primary/10 text-xs h-8"
              onClick={() => go("bahasa")}
            >
              Lihat semua bahasa
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </Card>

        {/* Tutor promo */}
        <Button
          variant="outline"
          className="w-full mt-3 border-accent/40 hover:bg-accent/15 text-foreground"
          onClick={() => go("belajar")}
        >
          <MessageCircle className="h-4 w-4 mr-2 text-primary" />
          Coba Tutor AI Bahasa Daerah
          <ArrowRight className="h-3.5 w-3.5 ml-auto" />
        </Button>
      </div>
    </section>
  );
}

function StatCard({
  label,
  value,
  accent,
  icon,
}: {
  label: string;
  value: string;
  accent: "primary" | "accent" | "destructive";
  icon?: React.ReactNode;
}) {
  const colors = {
    primary: "text-primary",
    accent: "text-accent-foreground",
    destructive: "text-destructive",
  };
  return (
    <div className="rounded-lg border border-border bg-card/60 backdrop-blur-sm px-2.5 py-2">
      <div className={`flex items-center gap-1 text-xl font-bold ${colors[accent]}`}>
        {icon}
        {value}
      </div>
      <div className="text-[10px] text-muted-foreground mt-0.5 leading-tight">
        {label}
      </div>
    </div>
  );
}

function QuickCard({
  icon,
  title,
  desc,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="text-left rounded-xl border border-border bg-card p-3 hover:border-primary/40 hover:shadow-sm transition-all active:scale-[0.98]"
    >
      <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-2">
        {icon}
      </div>
      <p className="text-sm font-semibold text-foreground leading-tight">{title}</p>
      <p className="text-[10px] text-muted-foreground mt-0.5">{desc}</p>
    </button>
  );
}

function formatMillions(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}
