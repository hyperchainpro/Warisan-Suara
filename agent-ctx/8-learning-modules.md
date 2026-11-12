# Task 8 — Learning Modules Section (`Modul Belajar`)

## Deliverable
- File created: `/home/z/my-project/src/components/sections/learning-modules.tsx`
- Single named export: `export function LearningModulesSection()`
- Wrapped in `<section id="belajar" className="py-16 sm:py-20 border-b border-border">` (with `relative overflow-hidden` for the decorative band + glows).
- Inner container: `<div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">`.

## What it does
Renders the adaptive learning module section for the WARISAN SUARA PWA:

- **Header**: pill badge (`Modul Belajar` with `GraduationCap` icon) + count badge, title "Modul Belajar Bahasa Daerah", and a subtitle explaining adaptive learning with audio playback.
- **Language filter**: shadcn `Select` populated from `GET /api/languages`. "Semua bahasa" option + every language code/name (with region suffix). When changed, refetches modules (and progress) via the dependency effect.
- **Module grid** (1 col mobile, 2 cols lg) of module cards. Each card shows:
  - Bold title (line-clamp-2)
  - Language name badge with `Languages` icon
  - Level badge (A1/A2/B1) with batik earthy colors via inline `oklch` style:
    - A1 = green-ish (oklch 145 hue)
    - A2 = amber/gold (oklch 75 hue)
    - B1 = orange (oklch 50 hue)
  - Description (line-clamp-2)
  - Progress bar (`Progress` from `@/components/ui/progress`) showing `lessonIdx / totalLessons`
  - "Mulai Belajar" / "Lanjut Belajar" / "Ulang Modul" button → opens module player dialog
- **Module player Dialog** (`@/components/ui/dialog`):
  - Header: module title, language badge, level badge, total lessons, description (line-clamp-2)
  - Lesson navigation bar: prev/next buttons + "Pelajaran X dari Y" indicator
  - Current lesson card showing:
    - Lesson title + "Selesai" check badge if completed
    - **Phrase in bahasa daerah** — large, bold, italic, in a terracotta-tinted callout
    - Translation in Bahasa Indonesia (smaller, muted, in secondary panel)
    - Notes (if any) in an accent-tinted callout with `BookOpen` icon
    - **"Dengar Pelafalan" TTS button** — fetches `POST /api/tts` with the phrase + `languageCode`, plays `new Audio(`data:audio/${format};base64,${audioBase64}`)`. Shows spinner during fetch, error toast on failure.
    - **"Tandai Selesai" button** — marks lesson complete, advances to next lesson, persists progress.
  - Footer: progress dots (filled circles for completed lessons, current = elongated primary bar).
- **Progress tracking**:
  - On dialog open (`handleOpenModule` event handler), fetches `GET /api/learn/progress?deviceId=...` and jumps to the saved `lessonIdx`. Lessons before saved index are marked complete.
  - On "Tandai Selesai": `POST /api/learn/progress` with `lessonIdx: currentIdx + 1` (advance) and `completed: true` if last lesson reached.
  - On prev/next navigation: `POST /api/learn/progress` with new `lessonIdx` (saves position).
  - On dialog close: re-fetches progress so card progress bars refresh.
- **Loading skeletons** (4x `ModuleCardSkeleton`) while modules load.
- **Empty state** if no modules for selected language (different messages for "All" vs specific language).
- **Error state** with `AlertTriangle` icon + "Coba lagi" retry button.

## Data sources
- `GET /api/languages` -> filter dropdown.
- `GET /api/learn/modules?languageCode=X` (or all if omitted) -> module list. `lessonsJson` is parsed via `JSON.parse()` into `LessonItem[]` of `{title, phrase, translation, notes}`.
- `GET /api/learn/progress?deviceId=...` -> per-module progress; mapped to `Map<moduleId, {lessonIdx, completed}>` for card display.
- `POST /api/learn/progress` `{ deviceId, moduleId, lessonIdx, completed? }` -> upserts progress (fire-and-forget; errors surfaced via toast).
- `POST /api/tts` `{ text, languageCode }` -> `{ audioBase64, format, durationMs }`. Played via `new Audio(`data:audio/${format};base64,${audioBase64}`)`.

## Device ID
- `import { getDeviceId } from "@/lib/device-id"` — called inside event handlers / async callbacks (never during initial render). Ref `deviceIdRef` keeps the latest value for stable async callbacks.

## Key implementation notes
- `"use client"` directive at top.
- **Batik earthy palette only** — no blue/indigo anywhere. Level badge colors + decorative band use oklch(0.52 0.16 45) terracotta / oklch(0.82 0.14 75) gold / oklch(0.5 0.18 25) maroon.
- **Level badge colors** (per spec): A1=green-ish (oklch 145), A2=amber (oklch 75), B1=orange (oklch 50). Applied via inline `style` so any level string falls back gracefully.
- **Decorative batik band** (`BatikDivider`): kawung-inspired repeating circles in a terracotta→gold→maroon gradient, plus soft background glow blobs (primary/accent/destructive low opacity).
- **Mobile-first responsive** throughout: grid collapses to 1 col on mobile, dialog content stacks buttons vertically on small screens (`flex-col sm:flex-row`).
- Long lists (lessons) handled inside the dialog scroll area (`flex-1 overflow-y-auto`).
- Cards: consistent `p-5` padding, hover lift (`hover:-translate-y-1 hover:shadow-lg hover:border-primary/40`), mt-auto progress section so cards align footer regardless of description length.
- Icons from lucide-react: BookOpen, ChevronLeft, ChevronRight, Volume2, Check, GraduationCap, Languages, Loader2, Inbox, AlertTriangle.
- Toast via `useToast` from `@/hooks/use-toast` for TTS errors, save errors, completion celebrations.

## Lint / React-hooks compliance
- `bun run lint` passes cleanly (**0 errors, 0 warnings**).
- Avoided `react-hooks/set-state-in-effect` violations with this architecture:
  - **`ModulePlayerDialog` is purely presentational** — all dialog state (currentIdx, completedSet, moduleCompleted, loadingProgress, ttsLoading, marking) lives in the parent. The dialog only renders props and forwards actions via callbacks (`onPrev`, `onNext`, `onMarkComplete`, `onPlayTts`). Zero internal effects → zero setState-in-effect.
  - **Languages fetch effect**: `useState(true)` for initial loading; all setState inside `.then/.catch` only.
  - **Modules + progress fetch effect**: chained — modules fetch resolves first (setState in `.then`), then progress fetch (setState in nested `.then/.catch`). The synchronous "loading=true" reset happens in the `handleLanguageChange` and `handleRetry` **event handlers**, not in the effect body.
  - **Dialog open** (`handleOpenModule`): synchronous reset setState happens in an event handler (allowed). Progress fetch setState is inside `.then/.catch`.
  - **Refs** (`dialogModuleRef`, `dialogCurrentIdxRef`, `dialogCompletedSetRef`, etc.) mirror state for stable async callbacks, preventing stale closures when posting progress.

## Constraints honored
- Did NOT modify any other file.
- Did NOT add new dependencies (uses only existing shadcn/ui + lucide-react + lib/utils + lib/device-id + hooks/use-toast).
- NO indigo/blue colors anywhere.
- Single named export `LearningModulesSection`.
- Exact wrapper classes per spec (`<section id="belajar" className="py-16 sm:py-20 border-b border-border">` + `container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8`).
- No tests written.

## How other agents integrate
In `src/app/page.tsx`:
```tsx
import { LearningModulesSection } from "@/components/sections/learning-modules";
// ...
<LearningModulesSection />
```
The `<section id="belajar">` is rendered inside the component itself, so `page.tsx` can render `<LearningModulesSection />` directly — no extra wrapper needed. The `#belajar` anchor is reachable from the hero CTA and from language-map cards' "Mulai Belajar" link.
