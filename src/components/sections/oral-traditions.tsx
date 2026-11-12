"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import {
  Library,
  BookOpen,
  Quote,
  Sparkles,
  MapPin,
  Volume2,
  ChevronRight,
  Filter,
  Inbox,
  AlertTriangle,
  Loader2,
  Languages,
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* ----------------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------------- */

type TraditionType =
  | "pantun"
  | "mantra"
  | "nyanyian"
  | "cerita_rakyat"
  | "peribahasa";

type TypeFilterKey = "ALL" | TraditionType;

interface TraditionLanguage {
  code: string;
  name: string;
  region: string;
}

interface Tradition {
  id: string;
  languageId: string;
  type: TraditionType;
  title: string;
  text: string;
  translation: string;
  meaning: string | null;
  audioUrl: string | null;
  region: string | null;
  language: TraditionLanguage;
}

interface LanguageOption {
  code: string;
  name: string;
  region: string;
}

/* ----------------------------------------------------------------------------
 * Tradition type config — exact oklch values per spec (NO blue/indigo)
 * ------------------------------------------------------------------------- */

interface TypeStyle {
  label: string;
  badgeBg: string;
  badgeText: string;
  /** subtle accent color used for the dialog header band background */
  bandBg: string;
}

const TYPE_CONFIG: Record<TraditionType, TypeStyle> = {
  pantun: {
    label: "Pantun",
    badgeBg: "oklch(0.94 0.05 75)",
    badgeText: "oklch(0.55 0.14 75)",
    bandBg: "oklch(0.96 0.035 75)",
  },
  mantra: {
    label: "Mantra",
    badgeBg: "oklch(0.94 0.06 25)",
    badgeText: "oklch(0.5 0.18 25)",
    bandBg: "oklch(0.96 0.04 25)",
  },
  nyanyian: {
    label: "Nyanyian",
    badgeBg: "oklch(0.94 0.05 145)",
    badgeText: "oklch(0.5 0.13 145)",
    bandBg: "oklch(0.96 0.035 145)",
  },
  cerita_rakyat: {
    label: "Cerita Rakyat",
    badgeBg: "oklch(0.94 0.05 50)",
    badgeText: "oklch(0.5 0.15 50)",
    bandBg: "oklch(0.96 0.035 50)",
  },
  peribahasa: {
    label: "Peribahasa",
    badgeBg: "oklch(0.94 0.04 250)",
    badgeText: "oklch(0.5 0.1 250)",
    bandBg: "oklch(0.96 0.03 250)",
  },
};

const TYPE_ORDER: TraditionType[] = [
  "pantun",
  "mantra",
  "nyanyian",
  "cerita_rakyat",
  "peribahasa",
];

const TYPE_FILTER_OPTIONS: { key: TypeFilterKey; label: string }[] = [
  { key: "ALL", label: "Semua" },
  { key: "pantun", label: "Pantun" },
  { key: "mantra", label: "Mantra" },
  { key: "nyanyian", label: "Nyanyian" },
  { key: "cerita_rakyat", label: "Cerita Rakyat" },
  { key: "peribahasa", label: "Peribahasa" },
];

function typeConfig(type: string): TypeStyle {
  return (
    TYPE_CONFIG[type as TraditionType] ?? {
      label: type.charAt(0).toUpperCase() + type.slice(1),
      badgeBg: "oklch(0.94 0.03 60)",
      badgeText: "oklch(0.45 0.1 60)",
      bandBg: "oklch(0.96 0.02 60)",
    }
  );
}

/* ----------------------------------------------------------------------------
 * Batik decorative band (subtle SVG motif at section top)
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
          <linearGradient id="batik-band-tradisi" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="oklch(0.52 0.16 45)" />
            <stop offset="50%" stopColor="oklch(0.7 0.12 75)" />
            <stop offset="100%" stopColor="oklch(0.5 0.18 25)" />
          </linearGradient>
        </defs>
        {/* kawung-inspired repeating circles */}
        <g fill="url(#batik-band-tradisi)">
          {Array.from({ length: 20 }).map((_, i) => (
            <circle key={i} cx={i * 6 + 3} cy="3" r="2.4" opacity={0.85} />
          ))}
        </g>
      </svg>
    </div>
  );
}

/* ----------------------------------------------------------------------------
 * Type badge (inline oklch colors per spec)
 * ------------------------------------------------------------------------- */

function TypeBadge({
  type,
  className,
}: {
  type: string;
  className?: string;
}) {
  const cfg = typeConfig(type);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5",
        "text-[11px] font-semibold whitespace-nowrap",
        className
      )}
      style={{ backgroundColor: cfg.badgeBg, color: cfg.badgeText }}
    >
      {cfg.label}
    </span>
  );
}

/* ----------------------------------------------------------------------------
 * Loading skeleton for a tradition card
 * ------------------------------------------------------------------------- */

function TraditionCardSkeleton() {
  return (
    <Card className="p-5 gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2 min-w-0 flex-1">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-3.5 w-1/2" />
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <div className="space-y-2 pt-1">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-3.5 w-2/3" />
      </div>
      <div className="flex justify-end pt-2 border-t border-border">
        <Skeleton className="h-7 w-28 rounded-md" />
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
        Tidak ada tradisi yang cocok
      </h3>
      <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">
        Coba ubah filter jenis atau bahasa daerah. Arsip ini terus bertambah
        seiring dokumentasi lapangan tim Warisan Suara.
      </p>
    </div>
  );
}

/* ----------------------------------------------------------------------------
 * Stat pill
 * ------------------------------------------------------------------------- */

function StatPill({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card/60 backdrop-blur-sm px-4 py-3 flex items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-xl font-bold leading-tight text-primary">
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
 * Tradition card
 * ------------------------------------------------------------------------- */

function TraditionCard({
  tradition,
  onOpen,
}: {
  tradition: Tradition;
  onOpen: (t: Tradition) => void;
}) {
  const cfg = typeConfig(tradition.type);
  return (
    <Card
      className={cn(
        "group relative flex flex-col p-5 gap-4 border-border transition-all duration-200",
        "hover:-translate-y-1 hover:shadow-lg hover:border-primary/40",
        "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
      )}
    >
      {/* Top: type badge */}
      <div className="flex items-start justify-between gap-3">
        <TypeBadge type={tradition.type} />
        {tradition.audioUrl && (
          <span
            className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground"
            title="Memiliki rekaman audio"
          >
            <Volume2 className="h-3 w-3" />
            Audio
          </span>
        )}
      </div>

      {/* Title */}
      <div className="space-y-1 min-w-0">
        <h3
          className={cn(
            "text-base font-bold text-foreground leading-snug",
            "line-clamp-2"
          )}
        >
          {tradition.title}
        </h3>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Languages className="h-3 w-3 shrink-0 text-primary/70" />
          <span className="truncate">{tradition.language.name}</span>
          <span className="opacity-50">·</span>
          <MapPin className="h-3 w-3 shrink-0 text-primary/70" />
          <span className="truncate">
            {tradition.region ?? tradition.language.region}
          </span>
        </div>
      </div>

      {/* Text in original bahasa daerah */}
      <div className="rounded-lg bg-secondary/40 border border-border/60 px-3 py-2.5">
        <p
          className={cn(
            "text-sm italic font-medium text-foreground leading-relaxed",
            "whitespace-pre-line line-clamp-4"
          )}
          style={{ color: cfg.badgeText }}
        >
          {tradition.text}
        </p>
      </div>

      {/* Translation */}
      <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line line-clamp-3">
        {tradition.translation}
      </p>

      {/* Footer: open dialog button */}
      <div className="mt-auto flex items-center justify-end pt-1 border-t border-border">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onOpen(tradition)}
          className="h-8 px-2.5 text-xs font-medium text-primary hover:text-primary hover:bg-primary/10"
        >
          Lihat Selengkapnya
          <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Button>
      </div>
    </Card>
  );
}

/* ----------------------------------------------------------------------------
 * Tradition detail dialog
 * ------------------------------------------------------------------------- */

function TraditionDetailDialog({
  tradition,
  open,
  onOpenChange,
}: {
  tradition: Tradition | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!tradition) return null;
  const cfg = typeConfig(tradition.type);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col gap-0 p-0">
        {/* Header band with type color */}
        <div
          className="px-6 pt-6 pb-4 border-b border-border"
          style={{ backgroundColor: cfg.bandBg }}
        >
          <div className="flex items-start justify-between gap-3 mb-2">
            <TypeBadge type={tradition.type} />
            {tradition.audioUrl && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                <Volume2 className="h-3.5 w-3.5" />
                Rekaman tersedia
              </span>
            )}
          </div>
          <DialogHeader className="gap-1.5">
            <DialogTitle className="text-2xl font-bold text-foreground leading-tight">
              {tradition.title}
            </DialogTitle>
            <DialogDescription className="flex items-center gap-2 mt-1 text-sm flex-wrap">
              <span className="inline-flex items-center gap-1">
                <Languages className="h-3.5 w-3.5" />
                {tradition.language.name}
              </span>
              <span className="opacity-50">·</span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {tradition.region ?? tradition.language.region}
              </span>
            </DialogDescription>
          </DialogHeader>
        </div>

        <ScrollArea className="flex-1 overflow-y-auto max-h-[60vh]">
          <div className="px-6 py-5 space-y-5">
            {/* Full text in bahasa daerah */}
            <section className="space-y-2">
              <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Quote className="h-3.5 w-3.5" />
                Teks Asli (Bahasa Daerah)
              </h4>
              <p
                className="text-lg italic font-medium text-foreground leading-relaxed whitespace-pre-line"
                style={{ color: cfg.badgeText }}
              >
                {tradition.text}
              </p>
            </section>

            {/* Full translation */}
            <section className="space-y-2">
              <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <BookOpen className="h-3.5 w-3.5" />
                Terjemahan (Bahasa Indonesia)
              </h4>
              <p className="text-base text-foreground leading-relaxed whitespace-pre-line">
                {tradition.translation}
              </p>
            </section>

            {/* Meaning / context callout */}
            {tradition.meaning && (
              <section className="space-y-2">
                <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <Sparkles className="h-3.5 w-3.5" />
                  Makna & Konteks
                </h4>
                <div className="rounded-lg border border-accent/30 bg-accent/10 px-4 py-3">
                  <p className="text-sm text-foreground leading-relaxed">
                    {tradition.meaning}
                  </p>
                </div>
              </section>
            )}

            {/* Audio player */}
            {tradition.audioUrl && (
              <section className="space-y-2">
                <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <Volume2 className="h-3.5 w-3.5" />
                  Rekaman Pelafalan
                </h4>
                <div className="rounded-lg border border-border bg-card px-3 py-2.5">
                  <audio
                    controls
                    src={tradition.audioUrl}
                    className="w-full"
                    preload="none"
                  >
                    <track
                      kind="captions"
                      label="Naskah"
                      srcLang="id"
                    />
                    Peramban Anda tidak mendukung pemutaran audio.
                  </audio>
                </div>
              </section>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <DialogFooter className="px-6 py-4 border-t border-border bg-secondary/20">
          <Button
            asChild
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Link href="#belajar" onClick={() => onOpenChange(false)}>
              <BookOpen className="h-4 w-4" />
              Pelajari bahasa ini
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

export function OralTraditionsSection() {
  const [traditions, setTraditions] = useState<Tradition[]>([]);
  const [languages, setLanguages] = useState<LanguageOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingLanguages, setLoadingLanguages] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<TypeFilterKey>("ALL");
  const [languageFilter, setLanguageFilter] = useState<string>("ALL");
  const [selected, setSelected] = useState<Tradition | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [totalTraditions, setTotalTraditions] = useState(0);
  // Bumping this nonce re-triggers the traditions fetch (e.g. on retry).
  const [fetchNonce, setFetchNonce] = useState(0);

  // Fetch languages for the dropdown. setState calls happen only inside
  // async callbacks to avoid cascading renders. Initial loadingLanguages=true
  // covers the first render before data arrives.
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/languages", { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error("Gagal memuat daftar bahasa");
        return r.json();
      })
      .then((data: { languages: LanguageOption[] }) => {
        setLanguages(data.languages ?? []);
        setLoadingLanguages(false);
      })
      .catch(() => {
        // Soft-fail: leave languages empty, dropdown will only show "Semua".
        setLoadingLanguages(false);
      });
    return () => controller.abort();
  }, []);

  // Fetch traditions whenever the type/language filter or retry nonce changes.
  // setState calls happen only inside async callbacks. Initial loading=true
  // covers the first render; subsequent refetches set loading=true inside
  // event handlers (handleTypeChange / handleLanguageChange / handleRetry).
  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams();
    if (typeFilter !== "ALL") params.set("type", typeFilter);
    if (languageFilter !== "ALL") params.set("languageCode", languageFilter);
    const qs = params.toString();
    const url = qs ? `/api/traditions?${qs}` : "/api/traditions";
    fetch(url, { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error("Gagal memuat tradisi lisan");
        return r.json();
      })
      .then((data: { traditions: Tradition[] }) => {
        const list = data.traditions ?? [];
        setTraditions(list);
        // Cache total only when fetching the unfiltered set so the header
        // stat stays stable regardless of the active filter.
        if (typeFilter === "ALL" && languageFilter === "ALL") {
          setTotalTraditions(list.length);
        }
        setError(null);
        setLoading(false);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        setError(err?.message ?? "Gagal memuat tradisi lisan");
        setLoading(false);
      });
    return () => controller.abort();
  }, [typeFilter, languageFilter, fetchNonce]);

  const handleOpen = useCallback((t: Tradition) => {
    setSelected(t);
    setDialogOpen(true);
  }, []);

  const handleTypeChange = useCallback((next: TypeFilterKey) => {
    setTypeFilter(next);
    setLoading(true);
  }, []);

  const handleLanguageChange = useCallback((next: string) => {
    setLanguageFilter(next);
    setLoading(true);
  }, []);

  const handleRetry = useCallback(() => {
    setLoading(true);
    setError(null);
    setFetchNonce((n) => n + 1);
  }, []);

  // Whether any filter is currently active (used for the "Menampilkan X" hint).
  const isFiltered = typeFilter !== "ALL" || languageFilter !== "ALL";

  // Derived: total unique types present in the current result set (for the
  // small "jenis" hint next to the count).
  const typeCount = useMemo(() => {
    const set = new Set(traditions.map((t) => t.type));
    return set.size;
  }, [traditions]);

  return (
    <section
      id="tradisi"
      className="relative py-16 sm:py-20 overflow-hidden"
    >
      {/* Decorative batik band at top */}
      <BatikDivider />

      {/* Soft background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute top-40 -right-24 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-destructive/5 blur-3xl" />
      </div>

      <div className="relative container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Library className="h-3.5 w-3.5" />
              Arsip Tradisi Lisan
            </span>
            {!loading && !error && (
              <Badge variant="secondary" className="bg-accent/30 border-accent/40">
                {isFiltered
                  ? `${traditions.length} dari ${totalTraditions} tradisi`
                  : `${totalTraditions} tradisi terdokumentasi`}
              </Badge>
            )}
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Arsip Tradisi Lisan Nusantara
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Arsip hidup warisan lisan dari pelosok Nusantara — pantun, mantra,
            nyanyian rakyat, cerita rakyat, dan peribahasa yang diturunkan
            turun-temurun dari mulut ke mulut. Setiap teks diawetkan dalam
            bahasa daerah aslinya beserta terjemahan, makna, dan rekaman
            pelafalan bila tersedia.
          </p>
        </div>

        {/* Stats summary */}
        {!loading && !error && traditions.length > 0 && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <StatPill
              icon={<Library className="h-4 w-4 text-primary" />}
              label={
                isFiltered
                  ? "Tradisi pada filter aktif"
                  : "Total Tradisi Terdokumentasi"
              }
              value={String(traditions.length)}
            />
            <StatPill
              icon={<Sparkles className="h-4 w-4 text-primary" />}
              label="Jenis Tradisi Tertampilkan"
              value={String(typeCount)}
            />
            <StatPill
              icon={<Languages className="h-4 w-4 text-primary" />}
              label={
                languageFilter !== "ALL"
                  ? "Bahasa Terpilih"
                  : "Bahasa Daerah Terjaring"
              }
              value={
                languageFilter !== "ALL"
                  ? (languages.find((l) => l.code === languageFilter)?.name ??
                    languageFilter)
                  : String(
                      new Set(traditions.map((t) => t.language.code)).size
                    )
              }
            />
          </div>
        )}

        {/* Filter bar */}
        {!error && (
          <div className="mt-8 space-y-4">
            {/* Type filter pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground mr-1">
                <Filter className="h-3.5 w-3.5" />
                Jenis:
              </span>
              {TYPE_FILTER_OPTIONS.map((opt) => {
                const active = typeFilter === opt.key;
                return (
                  <Button
                    key={opt.key}
                    type="button"
                    size="sm"
                    variant={active ? "default" : "outline"}
                    onClick={() => handleTypeChange(opt.key)}
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
            </div>

            {/* Language filter dropdown */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
                <Languages className="h-3.5 w-3.5" />
                Bahasa:
              </span>
              <Select
                value={languageFilter}
                onValueChange={handleLanguageChange}
                disabled={loadingLanguages}
              >
                <SelectTrigger
                  size="sm"
                  className="h-8 w-full sm:w-[280px] text-xs"
                  aria-label="Filter bahasa daerah"
                >
                  <SelectValue placeholder="Semua bahasa daerah" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Semua bahasa daerah</SelectItem>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name} · {lang.region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {loadingLanguages && (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
              )}
              {!loading && !error && (
                <span className="ml-auto text-xs text-muted-foreground hidden sm:inline">
                  Menampilkan {traditions.length} tradisi
                </span>
              )}
            </div>
          </div>
        )}

        {/* Content: loading / error / empty / grid */}
        <div className="mt-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <TraditionCardSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-6 py-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <h3 className="mt-3 text-base font-semibold text-foreground">
                Gagal memuat tradisi lisan
              </h3>
              <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">
                {error}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={handleRetry}
              >
                Coba lagi
              </Button>
            </div>
          ) : traditions.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {traditions.map((t) => (
                <TraditionCard key={t.id} tradition={t} onOpen={handleOpen} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detail dialog */}
      <TraditionDetailDialog
        tradition={selected}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </section>
  );
}
