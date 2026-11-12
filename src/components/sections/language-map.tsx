"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import {
  MapPin,
  Users,
  AlertTriangle,
  BookOpen,
  Mic,
  ScrollText,
  Volume2,
  ChevronRight,
  Loader2,
  Languages,
  Inbox,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";

/* ----------------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------------- */

type Vitality = "AMAN" | "TERTENTU" | "TERANCAM" | "KRITIS" | "HAMPIR_PUNAH";

interface LanguageCount {
  recordings: number;
  traditions: number;
  modules: number;
}

interface Language {
  id: string;
  code: string;
  name: string;
  region: string;
  province: string;
  latitude: number | null;
  longitude: number | null;
  speakers: number;
  vitality: Vitality;
  isoCode: string | null;
  description: string;
  greetingText: string;
  samplePhrase: string;
  _count: LanguageCount;
}

interface Tradition {
  id: string;
  type: string;
  title: string;
  text: string;
  translation: string;
  meaning: string | null;
  audioUrl: string | null;
  region: string | null;
  language: { code: string; name: string; region: string };
}

/* ----------------------------------------------------------------------------
 * Vitality config — exact oklch values per spec
 * ------------------------------------------------------------------------- */

interface VitalityStyle {
  label: string;            // Indonesian label
  short: string;            // English short
  dot: string;              // solid dot color (background of legend chip)
  badgeBg: string;          // badge background
  badgeBorder: string;      // badge border color
  badgeText: string;        // badge text color
  description: string;
}

const VITALITY_CONFIG: Record<Vitality, VitalityStyle> = {
  AMAN: {
    label: "Aman",
    short: "Safe",
    dot: "oklch(0.6 0.13 145)",
    badgeBg: "oklch(0.95 0.04 145)",
    badgeBorder: "oklch(0.6 0.13 145)",
    badgeText: "oklch(0.32 0.09 145)",
    description: "Penutur banyak & diturunkan ke anak",
  },
  TERTENTU: {
    label: "Rentan",
    short: "Vulnerable",
    dot: "oklch(0.75 0.14 75)",
    badgeBg: "oklch(0.95 0.04 75)",
    badgeBorder: "oklch(0.75 0.14 75)",
    badgeText: "oklch(0.4 0.1 60)",
    description: "Sebagian anak tak lagi menggunakannya",
  },
  TERANCAM: {
    label: "Terancam",
    short: "Endangered",
    dot: "oklch(0.65 0.18 50)",
    badgeBg: "oklch(0.94 0.05 50)",
    badgeBorder: "oklch(0.65 0.18 50)",
    badgeText: "oklch(0.45 0.14 45)",
    description: "Anak-anak tidak lagi memakainya",
  },
  KRITIS: {
    label: "Kritis",
    short: "Severely Endangered",
    dot: "oklch(0.55 0.2 35)",
    badgeBg: "oklch(0.94 0.06 35)",
    badgeBorder: "oklch(0.55 0.2 35)",
    badgeText: "oklch(0.4 0.15 30)",
    description: "Hanya dituturkan oleh generasi tua",
  },
  HAMPIR_PUNAH: {
    label: "Hampir Punah",
    short: "Critically Endangered",
    dot: "oklch(0.45 0.2 25)",
    badgeBg: "oklch(0.93 0.07 25)",
    badgeBorder: "oklch(0.45 0.2 25)",
    badgeText: "oklch(0.35 0.16 25)",
    description: "Hanya beberapa tetua tersisa",
  },
};

// Order used for legend + filter display
const VITALITY_ORDER: Vitality[] = [
  "AMAN",
  "TERTENTU",
  "TERANCAM",
  "KRITIS",
  "HAMPIR_PUNAH",
];

/* ----------------------------------------------------------------------------
 * Filter options — All + every vitality status
 * ------------------------------------------------------------------------- */

type FilterKey = "ALL" | Vitality;

const FILTER_OPTIONS: { key: FilterKey; label: string }[] = [
  { key: "ALL", label: "Semua" },
  { key: "AMAN", label: "Aman" },
  { key: "TERTENTU", label: "Rentan" },
  { key: "TERANCAM", label: "Terancam" },
  { key: "KRITIS", label: "Kritis" },
  { key: "HAMPIR_PUNAH", label: "Hampir Punah" },
];

/* ----------------------------------------------------------------------------
 * Helpers
 * ------------------------------------------------------------------------- */

function formatSpeakers(n: number): string {
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    // 38M, 2.7M
    return `${m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)}M`;
  }
  if (n >= 1_000) {
    const k = n / 1_000;
    return `${k % 1 === 0 ? k.toFixed(0) : k.toFixed(0)}K`;
  }
  return String(n);
}

// Tradisi type label translation
const TRADITION_TYPE_LABEL: Record<string, string> = {
  pantun: "Pantun",
  mantra: "Mantra",
  nyanyian: "Nyanyian Rakyat",
  cerita_rakyat: "Cerita Rakyat",
  peribahasa: "Peribahasa",
};

function traditionTypeLabel(type: string): string {
  return TRADITION_TYPE_LABEL[type] ?? type.charAt(0).toUpperCase() + type.slice(1);
}

/* ----------------------------------------------------------------------------
 * Batik decorative band (subtle SVG pattern at section top)
 * ------------------------------------------------------------------------- */

function BatikDivider() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 h-1.5 overflow-hidden"
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 120 6"
        preserveAspectRatio="repeat-x"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="batik-band" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="oklch(0.52 0.16 45)" />
            <stop offset="50%" stopColor="oklch(0.7 0.12 75)" />
            <stop offset="100%" stopColor="oklch(0.5 0.18 25)" />
          </linearGradient>
        </defs>
        {/* kawung-inspired repeating circles */}
        <g fill="url(#batik-band)">
          {Array.from({ length: 20 }).map((_, i) => (
            <circle key={i} cx={i * 6 + 3} cy="3" r="2.4" opacity={0.85} />
          ))}
        </g>
      </svg>
    </div>
  );
}

/* ----------------------------------------------------------------------------
 * Vitality badge component (inline style colors)
 * ------------------------------------------------------------------------- */

function VitalityBadge({ vitality }: { vitality: Vitality }) {
  const cfg = VITALITY_CONFIG[vitality];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5",
        "text-xs font-semibold whitespace-nowrap"
      )}
      style={{
        backgroundColor: cfg.badgeBg,
        borderColor: cfg.badgeBorder,
        color: cfg.badgeText,
      }}
    >
      <span
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: cfg.dot }}
        aria-hidden="true"
      />
      {cfg.label}
    </span>
  );
}

/* ----------------------------------------------------------------------------
 * Vitality legend
 * ------------------------------------------------------------------------- */

function VitalityLegend() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium text-muted-foreground mr-1">
        Skala vitalitas:
      </span>
      {VITALITY_ORDER.map((v) => {
        const cfg = VITALITY_CONFIG[v];
        return (
          <span
            key={v}
            className="inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] font-medium"
            style={{
              backgroundColor: cfg.badgeBg,
              borderColor: cfg.badgeBorder,
              color: cfg.badgeText,
            }}
          >
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: cfg.dot }}
              aria-hidden="true"
            />
            {cfg.label}
            <span className="opacity-70 hidden sm:inline">· {cfg.short}</span>
          </span>
        );
      })}
    </div>
  );
}

/* ----------------------------------------------------------------------------
 * Stats summary card row
 * ------------------------------------------------------------------------- */

function StatPill({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: "primary" | "accent" | "destructive";
}) {
  const accentClass = {
    primary: "text-primary",
    accent: "text-accent-foreground",
    destructive: "text-destructive",
  }[accent];

  return (
    <div className="rounded-lg border border-border bg-card/60 backdrop-blur-sm px-4 py-3 flex items-center gap-3">
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-md",
          accent === "primary" && "bg-primary/10",
          accent === "accent" && "bg-accent/30",
          accent === "destructive" && "bg-destructive/10"
        )}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <div className={cn("text-xl font-bold leading-tight", accentClass)}>
          {value}
        </div>
        <div className="text-[11px] text-muted-foreground leading-tight truncate">
          {label}
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------------
 * Loading skeleton for a language card
 * ------------------------------------------------------------------------- */

function LanguageCardSkeleton() {
  return (
    <Card className="p-5 gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-3.5 w-24" />
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <Skeleton className="h-4 w-20" />
      <div className="space-y-2 pt-1">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3.5 w-28" />
      </div>
      <div className="flex gap-3 pt-2 border-t border-border">
        <Skeleton className="h-3.5 w-16" />
        <Skeleton className="h-3.5 w-16" />
        <Skeleton className="h-3.5 w-16" />
      </div>
    </Card>
  );
}

/* ----------------------------------------------------------------------------
 * Empty state
 * ------------------------------------------------------------------------- */

function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-border bg-card/40 px-6 py-16 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted">
        <Inbox className="h-7 w-7 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-foreground">
        Belum ada bahasa pada filter ini
      </h3>
      <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">
        Coba ubah filter vitalitas atau muat ulang halaman. Data bahasa daerah
        ditambahkan seiring dokumentasi tim Warisan Suara.
      </p>
    </div>
  );
}

/* ----------------------------------------------------------------------------
 * Language card
 * ------------------------------------------------------------------------- */

function LanguageCard({
  language,
  onOpen,
}: {
  language: Language;
  onOpen: (lang: Language) => void;
}) {
  return (
    <Card
      role="button"
      tabIndex={0}
      aria-label={`Buka detail ${language.name}`}
      onClick={() => onOpen(language)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(language);
        }
      }}
      className={cn(
        "group relative cursor-pointer p-5 gap-4 transition-all duration-200",
        "hover:-translate-y-1 hover:shadow-lg hover:border-primary/40",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "border-border"
      )}
    >
      {/* Top: name + vitality */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <h3 className="text-lg font-bold text-foreground leading-tight truncate">
            {language.name}
          </h3>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 shrink-0 text-primary/70" />
            <span className="truncate">
              {language.region} · {language.province}
            </span>
          </div>
        </div>
        <VitalityBadge vitality={language.vitality} />
      </div>

      {/* Speakers */}
      <div className="flex items-center gap-1.5 text-sm">
        <Users className="h-3.5 w-3.5 text-primary/70" />
        <span className="font-semibold text-foreground">
          {formatSpeakers(language.speakers)}
        </span>
        <span className="text-xs text-muted-foreground">penutur</span>
      </div>

      {/* Greeting + sample phrase */}
      <div className="space-y-2 rounded-lg bg-secondary/40 px-3 py-3 border border-border/60">
        <div className="flex items-start gap-2">
          <Volume2 className="h-3.5 w-3.5 shrink-0 text-primary mt-0.5" />
          <div className="min-w-0">
            <p className="text-sm italic font-medium text-foreground leading-snug">
              &ldquo;{language.greetingText}&rdquo;
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Sapaan khas
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2 pt-1.5 border-t border-border/40">
          <Languages className="h-3.5 w-3.5 shrink-0 text-accent-foreground mt-0.5" />
          <div className="min-w-0">
            <p className="text-sm text-foreground leading-snug">
              {language.samplePhrase}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Frasa contoh
            </p>
          </div>
        </div>
      </div>

      {/* Footer counts */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-border">
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Mic className="h-3 w-3" />
            {language._count.recordings} rekaman
          </span>
          <span className="inline-flex items-center gap-1">
            <ScrollText className="h-3 w-3" />
            {language._count.traditions} tradisi
          </span>
          <span className="inline-flex items-center gap-1">
            <BookOpen className="h-3 w-3" />
            {language._count.modules} modul
          </span>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
      </div>
    </Card>
  );
}

/* ----------------------------------------------------------------------------
 * Detail dialog
 * ------------------------------------------------------------------------- */

function LanguageDetailDialog({
  language,
  open,
  onOpenChange,
  traditions,
  loadingTraditions,
  traditionsError,
}: {
  language: Language | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  traditions: Tradition[];
  loadingTraditions: boolean;
  traditionsError: string | null;
}) {
  if (!language) return null;
  const cfg = VITALITY_CONFIG[language.vitality];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col gap-0 p-0">
        {/* Header band with vitality color */}
        <div
          className="px-6 pt-6 pb-4 border-b border-border"
          style={{ backgroundColor: cfg.badgeBg }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <VitalityBadge vitality={language.vitality} />
                {language.isoCode && (
                  <Badge variant="outline" className="text-[10px] font-mono">
                    ISO {language.isoCode}
                  </Badge>
                )}
              </div>
              <DialogTitle className="text-2xl font-bold text-foreground">
                {language.name}
              </DialogTitle>
              <DialogDescription className="flex items-center gap-1 mt-1 text-sm">
                <MapPin className="h-3.5 w-3.5" />
                {language.region} · {language.province}
              </DialogDescription>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 overflow-y-auto max-h-[60vh]">
          <div className="px-6 py-5 space-y-5">
            {/* Description */}
            <section className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Tentang Bahasa
              </h4>
              <p className="text-sm text-foreground leading-relaxed">
                {language.description}
              </p>
            </section>

            {/* Quick facts */}
            <section className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-border bg-secondary/30 px-3 py-2.5">
                <div className="text-[11px] text-muted-foreground">Penutur</div>
                <div className="text-base font-bold text-foreground">
                  {formatSpeakers(language.speakers)}
                </div>
              </div>
              <div className="rounded-lg border border-border bg-secondary/30 px-3 py-2.5">
                <div className="text-[11px] text-muted-foreground">
                  Status Vitalitas
                </div>
                <div className="text-base font-semibold" style={{ color: cfg.badgeText }}>
                  {cfg.label} · {cfg.short}
                </div>
              </div>
            </section>

            {/* Greeting + sample phrase */}
            <section className="space-y-3">
              <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
                <div className="text-[11px] font-medium text-muted-foreground mb-1">
                  Sapaan Khas
                </div>
                <p className="text-lg italic font-semibold text-foreground">
                  &ldquo;{language.greetingText}&rdquo;
                </p>
              </div>
              <div className="rounded-lg border border-accent/30 bg-accent/10 px-4 py-3">
                <div className="text-[11px] font-medium text-muted-foreground mb-1">
                  Frasa Contoh
                </div>
                <p className="text-base text-foreground">
                  {language.samplePhrase}
                </p>
              </div>
            </section>

            {/* Traditions */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Tradisi Lisan Terdokumentasi
                </h4>
                {loadingTraditions ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                ) : (
                  <span className="text-[11px] text-muted-foreground">
                    {traditions.length} tradisi
                  </span>
                )}
              </div>

              {loadingTraditions ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : traditionsError ? (
                <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
                  {traditionsError}
                </div>
              ) : traditions.length === 0 ? (
                <div className="rounded-md border border-dashed border-border px-3 py-4 text-center text-xs text-muted-foreground">
                  Belum ada tradisi lisan terdokumentasi untuk bahasa ini.
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto pr-1 space-y-2 -mr-1">
                  {traditions.map((t) => (
                    <article
                      key={t.id}
                      className="rounded-lg border border-border bg-card px-3 py-2.5"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h5 className="text-sm font-semibold text-foreground truncate">
                          {t.title}
                        </h5>
                        <Badge
                          variant="secondary"
                          className="shrink-0 text-[10px] bg-accent/30 border-accent/40"
                        >
                          {traditionTypeLabel(t.type)}
                        </Badge>
                      </div>
                      <p className="text-sm italic text-foreground leading-snug">
                        &ldquo;{t.text}&rdquo;
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {t.translation}
                      </p>
                      {t.meaning && (
                        <p className="text-[11px] text-muted-foreground mt-1 italic">
                          Makna: {t.meaning}
                        </p>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        </ScrollArea>

        {/* Footer */}
        <DialogFooter className="px-6 py-4 border-t border-border bg-secondary/20">
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="#belajar" onClick={() => onOpenChange(false)}>
              <BookOpen className="h-4 w-4" />
              Mulai Belajar
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ----------------------------------------------------------------------------
 * Main section component
 * ------------------------------------------------------------------------- */

export function LanguageMapSection() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterKey>("ALL");
  const [selected, setSelected] = useState<Language | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [traditions, setTraditions] = useState<Tradition[]>([]);
  const [loadingTraditions, setLoadingTraditions] = useState(false);
  const [traditionsError, setTraditionsError] = useState<string | null>(null);
  // Bumping this nonce re-triggers the languages fetch (e.g. on retry).
  const [fetchNonce, setFetchNonce] = useState(0);

  // Fetch languages whenever the nonce changes.
  // setState calls happen only inside async callbacks to avoid cascading
  // renders (react-hooks/set-state-in-effect). Initial loading=true covers
  // the first render before data arrives.
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/languages", { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error("Gagal memuat daftar bahasa");
        return r.json();
      })
      .then((data: { languages: Language[] }) => {
        setLanguages(data.languages ?? []);
        setError(null);
        setLoading(false);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        setError(err?.message ?? "Gagal memuat daftar bahasa");
        setLoading(false);
      });
    return () => controller.abort();
  }, [fetchNonce]);

  // Open a language detail dialog and start fetching its traditions.
  // Runs in an event-handler context, so synchronous setState is allowed.
  const handleOpen = useCallback((lang: Language) => {
    setSelected(lang);
    setDialogOpen(true);
    setTraditions([]);
    setTraditionsError(null);
    setLoadingTraditions(true);
    fetch(`/api/traditions?languageCode=${encodeURIComponent(lang.code)}`)
      .then((r) => {
        if (!r.ok) throw new Error("Gagal memuat tradisi");
        return r.json();
      })
      .then((data: { traditions: Tradition[] }) => {
        setTraditions(data.traditions ?? []);
        setLoadingTraditions(false);
      })
      .catch((err) => {
        setTraditionsError(err?.message ?? "Gagal memuat tradisi");
        setLoadingTraditions(false);
      });
  }, []);

  // Derived stats
  const stats = useMemo(() => {
    const totalSpeakers = languages.reduce((sum, l) => sum + l.speakers, 0);
    const endangeredCount = languages.filter(
      (l) =>
        l.vitality === "TERANCAM" ||
        l.vitality === "KRITIS" ||
        l.vitality === "HAMPIR_PUNAH"
    ).length;
    return {
      total: languages.length,
      totalSpeakers,
      endangered: endangeredCount,
    };
  }, [languages]);

  // Filtered languages
  const filtered = useMemo(() => {
    if (filter === "ALL") return languages;
    return languages.filter((l) => l.vitality === filter);
  }, [languages, filter]);

  return (
    <section
      id="peta-bahasa"
      className="relative py-16 sm:py-20 border-b border-border overflow-hidden"
    >
      {/* Decorative batik band at top */}
      <BatikDivider />

      {/* Soft background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-20 left-1/4 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute top-32 -right-24 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-destructive/5 blur-3xl" />
      </div>

      <div className="relative container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <MapPin className="h-3.5 w-3.5" />
              Peta Bahasa
            </span>
            {!loading && (
              <Badge variant="secondary" className="bg-accent/30 border-accent/40">
                {stats.total} bahasa terdata
              </Badge>
            )}
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Peta Bahasa Daerah Nusantara
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Jelajahi khazanah bahasa daerah Indonesia berdasarkan status
            vitalitasnya. Taksonomi mengacu pada kerangka{" "}
            <span className="font-medium text-foreground">UNESCO Atlas of the World&apos;s Languages in Danger</span>{" "}
            — dari <span className="font-medium text-foreground">Aman</span> hingga{" "}
            <span className="font-medium text-destructive">Hampir Punah</span>.
            Setiap bahasa menyimpan sapaan, frasa, dan tradisi lisan yang
            menunggu untuk didengar dan dipelajari.
          </p>
        </div>

        {/* Stats summary */}
        {!loading && !error && languages.length > 0 && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <StatPill
              icon={<Languages className="h-4 w-4 text-primary" />}
              label="Total Bahasa Terdokumentasi"
              value={String(stats.total)}
              accent="primary"
            />
            <StatPill
              icon={<Users className="h-4 w-4 text-primary" />}
              label="Total Penutur Tercakup"
              value={formatSpeakers(stats.totalSpeakers)}
              accent="primary"
            />
            <StatPill
              icon={<AlertTriangle className="h-4 w-4 text-destructive" />}
              label="Bahasa dalam Status Terancam+"
              value={String(stats.endangered)}
              accent="destructive"
            />
          </div>
        )}

        {/* Vitality legend */}
        {!loading && !error && languages.length > 0 && (
          <div className="mt-8">
            <VitalityLegend />
          </div>
        )}

        {/* Filter bar */}
        {!loading && !error && languages.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground mr-1">Filter:</span>
            {FILTER_OPTIONS.map((opt) => {
              const active = filter === opt.key;
              return (
                <Button
                  key={opt.key}
                  size="sm"
                  variant={active ? "default" : "outline"}
                  onClick={() => setFilter(opt.key)}
                  className={cn(
                    "h-8 rounded-full px-3.5 text-xs font-medium transition-all",
                    active
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                      : "border-border text-muted-foreground hover:text-foreground hover:bg-accent/30"
                  )}
                >
                  {opt.label}
                </Button>
              );
            })}
            <span className="ml-auto text-xs text-muted-foreground hidden sm:inline">
              Menampilkan {filtered.length} dari {languages.length}
            </span>
          </div>
        )}

        {/* Content: loading / error / empty / grid */}
        <div className="mt-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <LanguageCardSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-6 py-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <h3 className="mt-3 text-base font-semibold text-foreground">
                Gagal memuat data bahasa
              </h3>
              <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">
                {error}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => {
                  setLoading(true);
                  setError(null);
                  setFetchNonce((n) => n + 1);
                }}
              >
                Coba lagi
              </Button>
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filtered.map((lang) => (
                <LanguageCard
                  key={lang.id}
                  language={lang}
                  onOpen={handleOpen}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detail dialog */}
      <LanguageDetailDialog
        language={selected}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        traditions={traditions}
        loadingTraditions={loadingTraditions}
        traditionsError={traditionsError}
      />
    </section>
  );
}
