"use client";

import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Volume2,
  Check,
  GraduationCap,
  Languages,
  Loader2,
  Inbox,
  AlertTriangle,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { getDeviceId } from "@/lib/device-id";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

/* ----------------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------------- */

interface LanguageLite {
  code: string;
  name: string;
  region?: string;
  province?: string;
}

interface LessonItem {
  title: string;
  phrase: string;
  translation: string;
  notes?: string | null;
}

interface LearningModule {
  id: string;
  languageId: string;
  title: string;
  description: string;
  level: string; // A1 | A2 | B1
  orderIdx: number;
  totalLessons: number;
  lessonsJson: string;
  language: { code: string; name: string };
}

interface ProgressEntry {
  id: string;
  deviceId: string;
  moduleId: string;
  lessonIdx: number;
  completed: boolean;
  lastStudied: string;
  module: {
    id: string;
    title: string;
    totalLessons: number;
    languageId: string;
  };
}

interface TtsResponse {
  audioBase64?: string;
  format?: string;
  durationMs?: number;
  error?: string;
}

/* ----------------------------------------------------------------------------
 * Level badge config — batik earthy palette (no blue/indigo)
 * A1 = green-ish (safe / starter)
 * A2 = amber (gold-ish intermediate)
 * B1 = orange (advanced)
 * ------------------------------------------------------------------------- */

interface LevelStyle {
  label: string;
  bg: string;
  border: string;
  text: string;
  dot: string;
}

const LEVEL_CONFIG: Record<string, LevelStyle> = {
  A1: {
    label: "A1",
    bg: "oklch(0.95 0.04 145)",
    border: "oklch(0.6 0.13 145)",
    text: "oklch(0.32 0.09 145)",
    dot: "oklch(0.6 0.13 145)",
  },
  A2: {
    label: "A2",
    bg: "oklch(0.95 0.05 75)",
    border: "oklch(0.82 0.14 75)",
    text: "oklch(0.45 0.12 70)",
    dot: "oklch(0.82 0.14 75)",
  },
  B1: {
    label: "B1",
    bg: "oklch(0.94 0.06 50)",
    border: "oklch(0.65 0.18 50)",
    text: "oklch(0.45 0.14 45)",
    dot: "oklch(0.65 0.18 50)",
  },
};

function levelStyle(level: string): LevelStyle {
  return (
    LEVEL_CONFIG[level] ?? {
      label: level,
      bg: "oklch(0.95 0.02 60)",
      border: "oklch(0.55 0.05 60)",
      text: "oklch(0.4 0.04 60)",
      dot: "oklch(0.55 0.05 60)",
    }
  );
}

/* ----------------------------------------------------------------------------
 * Helpers
 * ------------------------------------------------------------------------- */

function parseLessons(lessonsJson: string): LessonItem[] {
  try {
    const parsed = JSON.parse(lessonsJson);
    if (Array.isArray(parsed)) {
      return parsed.filter(
        (it) =>
          it &&
          typeof it.title === "string" &&
          typeof it.phrase === "string"
      ) as LessonItem[];
    }
    return [];
  } catch {
    return [];
  }
}

function normalizeLessons(module: LearningModule): LessonItem[] {
  const parsed = parseLessons(module.lessonsJson);
  if (parsed.length > 0) return parsed;
  // Fallback synthetic lessons so the player is still usable.
  return Array.from({ length: module.totalLessons }).map((_, i) => ({
    title: `Pelajaran ${i + 1}`,
    phrase: "",
    translation: "",
    notes: null,
  }));
}

/* ----------------------------------------------------------------------------
 * Batik decorative band — kawung-inspired repeating circles
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
          <linearGradient id="batik-band-belajar" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="oklch(0.52 0.16 45)" />
            <stop offset="50%" stopColor="oklch(0.82 0.14 75)" />
            <stop offset="100%" stopColor="oklch(0.5 0.18 25)" />
          </linearGradient>
        </defs>
        <g fill="url(#batik-band-belajar)">
          {Array.from({ length: 20 }).map((_, i) => (
            <circle key={i} cx={i * 6 + 3} cy="3" r="2.4" opacity={0.85} />
          ))}
        </g>
      </svg>
    </div>
  );
}

/* ----------------------------------------------------------------------------
 * Level badge
 * ------------------------------------------------------------------------- */

function LevelBadge({ level }: { level: string }) {
  const cfg = levelStyle(level);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5",
        "text-[11px] font-semibold whitespace-nowrap"
      )}
      style={{
        backgroundColor: cfg.bg,
        borderColor: cfg.border,
        color: cfg.text,
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
 * Module card skeleton
 * ------------------------------------------------------------------------- */

function ModuleCardSkeleton() {
  return (
    <Card className="p-5 gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-3.5 w-1/2" />
        </div>
        <Skeleton className="h-6 w-12 rounded-full" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-5 w-24 rounded-full" />
      </div>
      <div className="space-y-2 pt-1">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="space-y-2 pt-2">
        <Skeleton className="h-2 w-full rounded-full" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-9 w-32 rounded-md" />
        </div>
      </div>
    </Card>
  );
}

/* ----------------------------------------------------------------------------
 * Empty state
 * ------------------------------------------------------------------------- */

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-card/40 px-6 py-16 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted">
        <Inbox className="h-7 w-7 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-foreground">
        Belum ada modul belajar
      </h3>
      <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">
        {message}
      </p>
    </div>
  );
}

/* ----------------------------------------------------------------------------
 * Module card
 * ------------------------------------------------------------------------- */

function ModuleCard({
  module,
  progressPct,
  lessonIdx,
  completed,
  onOpen,
}: {
  module: LearningModule;
  progressPct: number;
  lessonIdx: number;
  completed: boolean;
  onOpen: (module: LearningModule) => void;
}) {
  const buttonLabel =
    lessonIdx === 0 && !completed
      ? "Mulai Belajar"
      : completed
      ? "Ulang Modul"
      : "Lanjut Belajar";

  return (
    <Card
      className={cn(
        "group flex flex-col gap-4 p-5 transition-all duration-200",
        "hover:-translate-y-1 hover:shadow-lg hover:border-primary/40",
        "border-border"
      )}
    >
      {/* Title + level */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-bold text-foreground leading-tight line-clamp-2">
          {module.title}
        </h3>
        <LevelBadge level={module.level} />
      </div>

      {/* Language badge */}
      <div className="flex flex-wrap items-center gap-2">
        <Badge
          variant="secondary"
          className="bg-accent/30 border-accent/40 text-xs gap-1"
        >
          <Languages className="h-3 w-3" />
          {module.language.name}
        </Badge>
        <span className="text-[11px] text-muted-foreground">
          {module.totalLessons} pelajaran
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
        {module.description}
      </p>

      {/* Progress */}
      <div className="mt-auto space-y-2 pt-1">
        <div className="flex items-center justify-between gap-2 text-xs">
          <span className="text-muted-foreground">Progres belajar</span>
          <span
            className={cn(
              "font-semibold",
              completed ? "text-primary" : "text-foreground"
            )}
          >
            {completed
              ? "Selesai"
              : `${lessonIdx}/${module.totalLessons} pelajaran`}
          </span>
        </div>
        <Progress
          value={progressPct}
          className={cn(
            "h-2",
            completed && "[&>[data-slot=progress-indicator]]:bg-primary"
          )}
        />
        <Button
          size="sm"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-1"
          onClick={() => onOpen(module)}
        >
          <BookOpen className="h-4 w-4" />
          {buttonLabel}
        </Button>
      </div>
    </Card>
  );
}

/* ----------------------------------------------------------------------------
 * Progress dots (bottom of dialog)
 * ------------------------------------------------------------------------- */

function ProgressDots({
  total,
  current,
  completedSet,
}: {
  total: number;
  current: number;
  completedSet: Set<number>;
}) {
  if (total <= 0) return null;
  return (
    <div
      className="flex flex-wrap items-center justify-center gap-1.5"
      role="navigation"
      aria-label={`Pelajaran ${current + 1} dari ${total}`}
    >
      {Array.from({ length: total }).map((_, i) => {
        const isCurrent = i === current;
        const isDone = completedSet.has(i);
        return (
          <span
            key={i}
            className={cn(
              "h-2 rounded-full transition-all duration-200",
              isCurrent ? "w-6 bg-primary" : "w-2",
              !isCurrent && (isDone ? "bg-primary/70" : "bg-border")
            )}
            aria-label={`Pelajaran ${i + 1}${
              isDone ? " (selesai)" : ""
            }${isCurrent ? " (aktif)" : ""}`}
          />
        );
      })}
    </div>
  );
}

/* ----------------------------------------------------------------------------
 * Module player dialog — purely presentational.
 * All state is owned by the parent; this component only renders props and
 * forwards user actions via callbacks. This keeps it free of effects that
 * call setState synchronously (react-hooks/set-state-in-effect).
 * ------------------------------------------------------------------------- */

interface ModulePlayerDialogProps {
  module: LearningModule | null;
  lessons: LessonItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentIdx: number;
  completedSet: Set<number>;
  moduleCompleted: boolean;
  loadingProgress: boolean;
  ttsLoading: boolean;
  marking: boolean;
  onPrev: () => void;
  onNext: () => void;
  onMarkComplete: () => void;
  onPlayTts: () => void;
}

function ModulePlayerDialog({
  module,
  lessons,
  open,
  onOpenChange,
  currentIdx,
  completedSet,
  moduleCompleted,
  loadingProgress,
  ttsLoading,
  marking,
  onPrev,
  onNext,
  onMarkComplete,
  onPlayTts,
}: ModulePlayerDialogProps) {
  if (!module) return null;

  const total = lessons.length;
  const lesson = lessons[currentIdx];
  const isLessonComplete = completedSet.has(currentIdx);
  const isLast = currentIdx >= total - 1;
  const allDone = isLast && moduleCompleted && isLessonComplete;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[92vh] overflow-hidden flex flex-col gap-0 p-0">
        {/* Header band */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border space-y-2 text-left">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="secondary"
              className="bg-accent/30 border-accent/40 text-xs gap-1"
            >
              <Languages className="h-3 w-3" />
              {module.language.name}
            </Badge>
            <LevelBadge level={module.level} />
            <span className="text-[11px] text-muted-foreground ml-auto">
              {total} pelajaran
            </span>
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-bold text-foreground leading-tight pr-6">
            {module.title}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground line-clamp-2">
            {module.description}
          </DialogDescription>
        </DialogHeader>

        {/* Lesson navigation bar */}
        <div className="flex items-center justify-between gap-2 px-6 py-3 border-b border-border bg-secondary/20">
          <Button
            variant="outline"
            size="sm"
            onClick={onPrev}
            disabled={currentIdx <= 0 || loadingProgress}
            className="h-8"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Sebelumnya</span>
          </Button>
          <div className="text-sm font-medium text-foreground text-center">
            {loadingProgress ? (
              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Memuat…
              </span>
            ) : (
              <>
                Pelajaran {currentIdx + 1}{" "}
                <span className="text-muted-foreground">dari {total}</span>
              </>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onNext}
            disabled={currentIdx >= total - 1 || loadingProgress}
            className="h-8"
          >
            <span className="hidden sm:inline">Berikutnya</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Lesson content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {loadingProgress ? (
            <div className="space-y-4">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-10 w-48" />
            </div>
          ) : !lesson ? (
            <div className="rounded-md border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
              Belum ada konten pelajaran untuk modul ini.
            </div>
          ) : (
            <div className="space-y-5">
              {/* Lesson title */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Topik Pelajaran
                  </div>
                  <h3 className="mt-1 text-lg font-bold text-foreground leading-tight">
                    {lesson.title}
                  </h3>
                </div>
                {isLessonComplete && (
                  <Badge
                    variant="default"
                    className="bg-primary/15 border border-primary/30 text-primary gap-1"
                  >
                    <Check className="h-3 w-3" />
                    Selesai
                  </Badge>
                )}
              </div>

              {/* Phrase in bahasa daerah */}
              <div className="rounded-xl border border-primary/20 bg-primary/5 px-5 py-5">
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground mb-2">
                  <Languages className="h-3.5 w-3.5 text-primary" />
                  Frasa dalam {module.language.name}
                </div>
                <p className="text-2xl sm:text-3xl font-bold italic text-foreground leading-snug break-words">
                  &ldquo;{lesson.phrase}&rdquo;
                </p>
              </div>

              {/* Translation */}
              <div className="rounded-lg border border-border bg-secondary/30 px-4 py-3">
                <div className="text-[11px] font-medium text-muted-foreground mb-1">
                  Terjemahan (Bahasa Indonesia)
                </div>
                <p className="text-sm sm:text-base text-foreground leading-relaxed">
                  {lesson.translation || "—"}
                </p>
              </div>

              {/* Notes */}
              {lesson.notes && (
                <div className="rounded-lg border border-accent/30 bg-accent/10 px-4 py-3">
                  <div className="flex items-start gap-2">
                    <BookOpen className="h-4 w-4 text-accent-foreground shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <div className="text-[11px] font-medium text-muted-foreground mb-1">
                        Catatan
                      </div>
                      <p className="text-sm text-foreground leading-relaxed">
                        {lesson.notes}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <Button
                  variant="outline"
                  onClick={onPlayTts}
                  disabled={ttsLoading}
                  className="flex-1 h-10 border-primary/30 text-primary hover:bg-primary/5 hover:text-primary"
                >
                  {ttsLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Menyiapkan audio…
                    </>
                  ) : (
                    <>
                      <Volume2 className="h-4 w-4" />
                      Dengar Pelafalan
                    </>
                  )}
                </Button>
                <Button
                  onClick={onMarkComplete}
                  disabled={marking}
                  className="flex-1 h-10 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {marking ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Menyimpan…
                    </>
                  ) : allDone ? (
                    <>
                      <Check className="h-4 w-4" />
                      Modul Selesai
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Tandai Selesai
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer: progress dots */}
        <div className="px-6 py-4 border-t border-border bg-secondary/20">
          <div className="mb-2 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Kemajuan pelajaran</span>
            <span>
              {completedSet.size}/{total} selesai
            </span>
          </div>
          <ProgressDots
            total={total}
            current={currentIdx}
            completedSet={completedSet}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ----------------------------------------------------------------------------
 * Main section
 * ------------------------------------------------------------------------- */

export function LearningModulesSection() {
  const { toast } = useToast();

  const [languages, setLanguages] = useState<LanguageLite[]>([]);
  const [languagesLoading, setLanguagesLoading] = useState(true);

  const [selectedLanguage, setSelectedLanguage] = useState<string>("ALL");
  const [modules, setModules] = useState<LearningModule[]>([]);
  const [modulesLoading, setModulesLoading] = useState(true);
  const [modulesError, setModulesError] = useState<string | null>(null);
  const [modulesNonce, setModulesNonce] = useState(0);

  const [progress, setProgress] = useState<ProgressEntry[]>([]);
  const [progressLoading, setProgressLoading] = useState(false);

  // Active dialog state — all owned by the parent so the dialog can stay
  // presentational (no setState-in-effect).
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogModule, setDialogModule] = useState<LearningModule | null>(null);
  const [dialogLessons, setDialogLessons] = useState<LessonItem[]>([]);
  const [dialogCurrentIdx, setDialogCurrentIdx] = useState(0);
  const [dialogCompletedSet, setDialogCompletedSet] = useState<Set<number>>(
    new Set()
  );
  const [dialogModuleCompleted, setDialogModuleCompleted] = useState(false);
  const [dialogLoadingProgress, setDialogLoadingProgress] = useState(false);
  const [dialogTtsLoading, setDialogTtsLoading] = useState(false);
  const [dialogMarking, setDialogMarking] = useState(false);

  // Refs to avoid stale closures when posting progress from async callbacks.
  const deviceIdRef = useRef<string>("server");
  const dialogModuleRef = useRef<LearningModule | null>(null);
  const dialogCurrentIdxRef = useRef(0);
  const dialogCompletedSetRef = useRef<Set<number>>(new Set());
  const dialogModuleCompletedRef = useRef(false);
  const dialogLessonsRef = useRef<LessonItem[]>([]);

  useEffect(() => {
    dialogModuleRef.current = dialogModule;
  }, [dialogModule]);
  useEffect(() => {
    dialogCurrentIdxRef.current = dialogCurrentIdx;
  }, [dialogCurrentIdx]);
  useEffect(() => {
    dialogCompletedSetRef.current = dialogCompletedSet;
  }, [dialogCompletedSet]);
  useEffect(() => {
    dialogModuleCompletedRef.current = dialogModuleCompleted;
  }, [dialogModuleCompleted]);
  useEffect(() => {
    dialogLessonsRef.current = dialogLessons;
  }, [dialogLessons]);

  /* ------------------------------------------------------------------
   * Fetch languages list once for the filter dropdown.
   * setState only inside async callbacks (react-hooks/set-state-in-effect).
   * Initial languagesLoading=true covers the first render.
   * ---------------------------------------------------------------- */
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/languages", { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error("Gagal memuat daftar bahasa");
        return r.json();
      })
      .then((data: { languages: LanguageLite[] }) => {
        const langs = (data.languages ?? []).map((l) => ({
          code: l.code,
          name: l.name,
          region: l.region,
          province: l.province,
        }));
        setLanguages(langs);
        setLanguagesLoading(false);
      })
      .catch(() => {
        setLanguages([]);
        setLanguagesLoading(false);
      });
    return () => controller.abort();
  }, []);

  /* ------------------------------------------------------------------
   * Fetch modules + progress when language filter or retry nonce
   * changes. All setState happens inside .then/.catch — the event
   * handlers (handleLanguageChange / handleRetry) are responsible for
   * setting loading=true synchronously before the dependency changes.
   * ---------------------------------------------------------------- */
  useEffect(() => {
    const controller = new AbortController();
    const url =
      selectedLanguage === "ALL"
        ? "/api/learn/modules"
        : `/api/learn/modules?languageCode=${encodeURIComponent(
            selectedLanguage
          )}`;

    fetch(url, { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error("Gagal memuat modul belajar");
        return r.json();
      })
      .then((data: { modules: LearningModule[] }) => {
        const list = data.modules ?? [];
        setModules(list);
        setModulesError(null);
        setModulesLoading(false);

        // Chain progress fetch (only when a real deviceId is available).
        const deviceId = getDeviceId();
        deviceIdRef.current = deviceId;
        if (deviceId === "server" || list.length === 0) {
          setProgress([]);
          setProgressLoading(false);
          return;
        }
        setProgressLoading(true);
        fetch(
          `/api/learn/progress?deviceId=${encodeURIComponent(deviceId)}`,
          { signal: controller.signal }
        )
          .then((pr) => {
            if (!pr.ok) throw new Error("Gagal memuat progres");
            return pr.json();
          })
          .then((pdata: { progress: ProgressEntry[] }) => {
            setProgress(pdata.progress ?? []);
            setProgressLoading(false);
          })
          .catch((err) => {
            if (controller.signal.aborted) return;
            setProgress([]);
            setProgressLoading(false);
            toast({
              variant: "destructive",
              title: "Progres tidak termuat",
              description:
                err?.message ?? "Tidak dapat memuat progres belajar kamu.",
            });
          });
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        setModulesError(err?.message ?? "Gagal memuat modul belajar");
        setModulesLoading(false);
      });

    return () => controller.abort();
  }, [selectedLanguage, modulesNonce, toast]);

  /* ------------------------------------------------------------------
   * Derived: per-module progress map
   * ---------------------------------------------------------------- */
  const progressMap = useMemo(() => {
    const map = new Map<string, { lessonIdx: number; completed: boolean }>();
    for (const p of progress) {
      map.set(p.moduleId, {
        lessonIdx: p.lessonIdx,
        completed: p.completed,
      });
    }
    return map;
  }, [progress]);

  /* ------------------------------------------------------------------
   * Save progress (POST). Fire-and-forget; surface only critical errors.
   * ---------------------------------------------------------------- */
  const saveProgress = useCallback(
    (moduleId: string, lessonIdx: number, completed?: boolean) => {
      const deviceId = deviceIdRef.current;
      if (deviceId === "server" || !moduleId) return;
      fetch("/api/learn/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceId, moduleId, lessonIdx, completed }),
      }).catch((err) => {
        toast({
          variant: "destructive",
          title: "Gagal menyimpan progres",
          description: err?.message ?? "Coba lagi sebentar.",
        });
      });
    },
    [toast]
  );

  /* ------------------------------------------------------------------
   * Open a module player dialog.
   * Event-handler context — synchronous setState is allowed here.
   * Resets dialog state, opens dialog, then async-fetches saved progress.
   * ---------------------------------------------------------------- */
  const handleOpenModule = useCallback(
    (module: LearningModule) => {
      const lessons = normalizeLessons(module);
      const deviceId = getDeviceId();
      deviceIdRef.current = deviceId;

      // Reset dialog state for the new module.
      setDialogModule(module);
      setDialogLessons(lessons);
      setDialogCurrentIdx(0);
      setDialogCompletedSet(new Set());
      setDialogModuleCompleted(false);
      setDialogTtsLoading(false);
      setDialogMarking(false);
      setDialogLoadingProgress(true);
      setDialogOpen(true);

      fetch(
        `/api/learn/progress?deviceId=${encodeURIComponent(deviceId)}`
      )
        .then((r) => {
          if (!r.ok) throw new Error("Gagal memuat progres");
          return r.json();
        })
        .then((data: { progress: ProgressEntry[] }) => {
          // If the user has since opened a different module, ignore.
          if (dialogModuleRef.current?.id !== module.id) return;
          const entry = (data.progress ?? []).find(
            (p) => p.moduleId === module.id
          );
          const savedIdx = entry?.lessonIdx ?? 0;
          const clamped = Math.min(
            Math.max(savedIdx, 0),
            Math.max(lessons.length - 1, 0)
          );
          const seen = new Set<number>();
          for (let i = 0; i < clamped; i++) seen.add(i);
          if (entry?.completed) {
            for (let i = 0; i < lessons.length; i++) seen.add(i);
          }
          setDialogCurrentIdx(clamped);
          setDialogCompletedSet(seen);
          setDialogModuleCompleted(Boolean(entry?.completed));
          setDialogLoadingProgress(false);
        })
        .catch((err) => {
          if (dialogModuleRef.current?.id !== module.id) return;
          setDialogLoadingProgress(false);
          toast({
            variant: "destructive",
            title: "Progres tidak tersimpan",
            description:
              err?.message ??
              "Tidak dapat memuat progres belajar sebelumnya.",
          });
        });
    },
    [toast]
  );

  /* ------------------------------------------------------------------
   * Dialog close: refresh parent progress so cards reflect new state.
   * ---------------------------------------------------------------- */
  const handleDialogChange = useCallback((open: boolean) => {
    setDialogOpen(open);
    if (open) return;
    const deviceId = deviceIdRef.current;
    if (deviceId === "server") return;
    fetch(
      `/api/learn/progress?deviceId=${encodeURIComponent(deviceId)}`
    )
      .then((r) => r.json())
      .then((data: { progress: ProgressEntry[] }) => {
        setProgress(data.progress ?? []);
      })
      .catch(() => {
        /* ignore — non-fatal */
      });
  }, []);

  /* ------------------------------------------------------------------
   * Navigate prev / next within the dialog.
   * ---------------------------------------------------------------- */
  const handlePrev = useCallback(() => {
    const mod = dialogModuleRef.current;
    const lessons = dialogLessonsRef.current;
    if (!mod) return;
    const idx = dialogCurrentIdxRef.current;
    const next = Math.min(Math.max(idx - 1, 0), Math.max(lessons.length - 1, 0));
    if (next === idx) return;
    setDialogCurrentIdx(next);
    saveProgress(mod.id, next);
  }, [saveProgress]);

  const handleNext = useCallback(() => {
    const mod = dialogModuleRef.current;
    const lessons = dialogLessonsRef.current;
    if (!mod) return;
    const idx = dialogCurrentIdxRef.current;
    const next = Math.min(Math.max(idx + 1, 0), Math.max(lessons.length - 1, 0));
    if (next === idx) return;
    setDialogCurrentIdx(next);
    saveProgress(mod.id, next);
  }, [saveProgress]);

  /* ------------------------------------------------------------------
   * Mark current lesson complete, advance, persist.
   * ---------------------------------------------------------------- */
  const handleMarkComplete = useCallback(() => {
    const mod = dialogModuleRef.current;
    const lessons = dialogLessonsRef.current;
    if (!mod) return;

    const idx = dialogCurrentIdxRef.current;
    const total = lessons.length;
    const isLast = idx >= total - 1;
    const nextIdx = isLast ? idx : idx + 1;
    const alreadyCompleted = dialogModuleCompletedRef.current;

    setDialogMarking(true);

    const newCompleted = new Set(dialogCompletedSetRef.current);
    newCompleted.add(idx);
    setDialogCompletedSet(newCompleted);

    // lessonIdx = next index to study; completed = true if last lesson
    // reached (or module was already completed).
    saveProgress(mod.id, nextIdx, {
      completed: isLast || alreadyCompleted,
    });

    if (isLast) {
      setDialogModuleCompleted(true);
      setDialogMarking(false);
      toast({
        title: "Modul selesai!",
        description: `Selamat! Kamu telah menyelesaikan "${mod.title}".`,
      });
    } else {
      setDialogCurrentIdx(nextIdx);
      setDialogMarking(false);
      toast({
        title: "Pelajaran ditandai selesai",
        description: `Lanjut ke pelajaran ${nextIdx + 1} dari ${total}.`,
      });
    }
  }, [saveProgress, toast]);

  /* ------------------------------------------------------------------
   * TTS — fetch audio for the current phrase and play it.
   * ---------------------------------------------------------------- */
  const handlePlayTts = useCallback(() => {
    const mod = dialogModuleRef.current;
    const lessons = dialogLessonsRef.current;
    const idx = dialogCurrentIdxRef.current;
    if (!mod) return;
    const lesson = lessons[idx];
    if (!lesson || !lesson.phrase) {
      toast({
        variant: "destructive",
        title: "Frasa tidak tersedia",
        description: "Pelajaran ini tidak memiliki frasa untuk dilatih.",
      });
      return;
    }

    setDialogTtsLoading(true);
    fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: lesson.phrase,
        languageCode: mod.language.code,
      }),
    })
      .then((r) => {
        if (!r.ok) throw new Error("Gagal membuat audio");
        return r.json();
      })
      .then((data: TtsResponse) => {
        if (!data.audioBase64) {
          throw new Error("Audio belum tersedia untuk frasa ini.");
        }
        const audio = new Audio(
          `data:audio/${data.format ?? "mp3"};base64,${data.audioBase64}`
        );
        audio.play().catch((err) => {
          toast({
            variant: "destructive",
            title: "Tidak dapat memutar audio",
            description:
              err?.message ?? "Periksa pengaturan suara perangkat.",
          });
        });
      })
      .catch((err) => {
        toast({
          variant: "destructive",
          title: "Gagal memutar pelafalan",
          description: err?.message ?? "Coba lagi sebentar.",
        });
      })
      .finally(() => setDialogTtsLoading(false));
  }, [toast]);

  /* ------------------------------------------------------------------
   * Language filter change — synchronous setState in event handler is
   * allowed; this resets loading so the user sees a loading state
   * before the fetch effect runs.
   * ---------------------------------------------------------------- */
  const handleLanguageChange = useCallback((value: string) => {
    setModulesLoading(true);
    setModulesError(null);
    setProgress([]);
    setProgressLoading(false);
    setSelectedLanguage(value);
  }, []);

  const handleRetry = useCallback(() => {
    setModulesLoading(true);
    setModulesError(null);
    setModulesNonce((n) => n + 1);
  }, []);

  return (
    <section
      id="belajar"
      className="relative py-16 sm:py-20 border-b border-border overflow-hidden"
    >
      <BatikDivider />

      {/* Soft background glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-24 right-1/4 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute top-40 -left-24 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/3 h-64 w-64 rounded-full bg-destructive/5 blur-3xl" />
      </div>

      <div className="relative container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <GraduationCap className="h-3.5 w-3.5" />
              Modul Belajar
            </span>
            {!modulesLoading && modules.length > 0 && (
              <Badge
                variant="secondary"
                className="bg-accent/30 border-accent/40"
              >
                {modules.length} modul tersedia
              </Badge>
            )}
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Modul Belajar Bahasa Daerah
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Pelajari bahasa daerah Nusantara langkah demi langkah melalui
            modul adaptif yang menyusun sendiri urutan pelajaran berdasarkan
            progresmu. Setiap pelajaran memuat frasa asli, terjemahan, catatan
            konteks, serta pelafalan audio yang bisa kamu dengar ulang hingga
            lancar.
          </p>
        </div>

        {/* Language filter */}
        <div className="mt-8 flex flex-col sm:flex-row sm:items-end gap-3">
          <div className="space-y-1.5">
            <Label
              htmlFor="language-filter"
              className="text-xs text-muted-foreground"
            >
              Filter bahasa
            </Label>
            <Select
              value={selectedLanguage}
              onValueChange={handleLanguageChange}
              disabled={languagesLoading}
            >
              <SelectTrigger
                id="language-filter"
                className="w-full sm:w-64"
                aria-label="Pilih bahasa daerah"
              >
                <Languages className="h-4 w-4 text-primary/70" />
                <SelectValue placeholder="Semua bahasa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Semua bahasa</SelectItem>
                {languages.map((l) => (
                  <SelectItem key={l.code} value={l.code}>
                    {l.name}
                    {l.region ? ` · ${l.region}` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="text-xs text-muted-foreground sm:ml-auto">
            {modulesLoading ? (
              <span className="inline-flex items-center gap-1.5">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Memuat modul…
              </span>
            ) : (
              modules.length > 0 &&
              `Menampilkan ${modules.length} modul${
                progressLoading ? " · menyelaraskan progres…" : ""
              }`
            )}
          </div>
        </div>

        {/* Content */}
        <div className="mt-8">
          {modulesLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <ModuleCardSkeleton key={i} />
              ))}
            </div>
          ) : modulesError ? (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-6 py-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <h3 className="mt-3 text-base font-semibold text-foreground">
                Gagal memuat modul belajar
              </h3>
              <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">
                {modulesError}
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
          ) : modules.length === 0 ? (
            <EmptyState
              message={
                selectedLanguage === "ALL"
                  ? "Modul belajar sedang disiapkan oleh tim Warisan Suara. Silakan kembali beberapa saat lagi."
                  : "Belum ada modul belajar untuk bahasa yang dipilih. Coba pilih bahasa lain dari daftar filter."
              }
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {modules.map((m) => {
                const p = progressMap.get(m.id);
                const total = m.totalLessons;
                const lessonIdx = p?.lessonIdx ?? 0;
                const completed = p?.completed ?? false;
                const pct = total > 0 ? (lessonIdx / total) * 100 : 0;
                return (
                  <ModuleCard
                    key={m.id}
                    module={m}
                    progressPct={completed ? 100 : pct}
                    lessonIdx={lessonIdx}
                    completed={completed}
                    onOpen={handleOpenModule}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Module player dialog */}
      <ModulePlayerDialog
        module={dialogModule}
        lessons={dialogLessons}
        open={dialogOpen}
        onOpenChange={handleDialogChange}
        currentIdx={dialogCurrentIdx}
        completedSet={dialogCompletedSet}
        moduleCompleted={dialogModuleCompleted}
        loadingProgress={dialogLoadingProgress}
        ttsLoading={dialogTtsLoading}
        marking={dialogMarking}
        onPrev={handlePrev}
        onNext={handleNext}
        onMarkComplete={handleMarkComplete}
        onPlayTts={handlePlayTts}
      />
    </section>
  );
}
