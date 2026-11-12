# Task 10 — Oral Traditions Archive Section (`Arsip Tradisi Lisan`)

## Deliverable
- File created: `/home/z/my-project/src/components/sections/oral-traditions.tsx`
- Single named export: `export function OralTraditionsSection()`
- Wrapped in `<section id="tradisi" className="relative py-16 sm:py-20 overflow-hidden">` (NO `border-b` — last section before footer, per spec). The `relative overflow-hidden` is added for the decorative batik band + soft background glows; the spec's required `py-16 sm:py-20` is preserved.
- Inner container: `<div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">`.

## What it does
Renders the oral traditions archive for the WARISAN SUARA PWA:

- **Header**: pill badge (`Arsip Tradisi Lisan` with `Library` icon) + count badge showing either `N tradisi terdokumentasi` (no filter) or `X dari Y tradisi` (filtered). Title "Arsip Tradisi Lisan Nusantara" + subtitle explaining this is a living archive of pantun, mantra, nyanyian rakyat, cerita rakyat, peribahasa.
- **Stats summary** (3 `StatPill`s): traditions count (filtered vs total), distinct types in current view, distinct/selected language.
- **Filter bar** — two groups:
  - **Type pills**: `Semua`, `Pantun`, `Mantra`, `Nyanyian`, `Cerita Rakyat`, `Peribahasa`. Active = `bg-primary text-primary-foreground`; inactive = outline with `hover:bg-accent/30`.
  - **Language `Select`**: populated from `GET /api/languages` ("Semua bahasa daerah" + every language name · region). Refetches traditions on change. Shows a `Loader2` spinner while languages load. Right-aligned "Menampilkan X tradisi" hint.
- **Responsive grid** (1 col mobile, 2 cols `sm:`, 3 cols `lg:`) of tradition cards. Each card:
  - Top: `TypeBadge` (inline oklch colors per type) + "Audio" indicator if `audioUrl` exists.
  - Title (bold, `line-clamp-2`).
  - Language name + region (small muted, with `Languages` + `MapPin` icons).
  - **Text in original bahasa daerah** — italic, `whitespace-pre-line`, `line-clamp-4`, colored via the type's `badgeText` oklch value, inside a secondary-tinted callout box.
  - **Translation** — smaller, muted, `whitespace-pre-line`, `line-clamp-3`.
  - Footer: "Lihat Selengkapnya" ghost button → opens Dialog.
- **Dialog** (`TraditionDetailDialog`):
  - Header band tinted with the type's `bandBg` oklch color; `TypeBadge` + audio indicator; title; language + region (with `Languages` + `MapPin` icons).
  - Full text in bahasa daerah (large, italic, `whitespace-pre-line`, colored).
  - Full translation (`whitespace-pre-line`).
  - **Makna & Konteks** callout (subtle `bg-accent/10 border-accent/30`) if `meaning` is present, with `Sparkles` icon header.
  - **Audio player** (`<audio controls>`) if `audioUrl` is present, with a `<track kind="captions">` for a11y.
  - Footer: "Pelajari bahasa ini" button → `<Link href="#belajar">`.
- **Loading skeleton**: 6 `TraditionCardSkeleton` cards using `Skeleton`.
- **Empty state**: `Inbox` icon + "Tidak ada tradisi yang cocok" message when filter yields nothing.
- **Error state**: `AlertTriangle` + message + "Coba lagi" retry button (bumps `fetchNonce`).

## Type badge colors (inline `oklch`, NO blue/indigo)
- pantun: bg `oklch(0.94 0.05 75)`, text `oklch(0.55 0.14 75)` — gold
- mantra: bg `oklch(0.94 0.06 25)`, text `oklch(0.5 0.18 25)` — maroon
- nyanyian: bg `oklch(0.94 0.05 145)`, text `oklch(0.5 0.13 145)` — green
- cerita_rakyat: bg `oklch(0.94 0.05 50)`, text `oklch(0.5 0.15 50)` — orange
- peribahasa: bg `oklch(0.94 0.04 250)`, text `oklch(0.5 0.1 250)` — warm teal/sage (hue 250 in oklch is teal, not blue)

A `bandBg` companion color (slightly lighter tint) is also defined per type and used for the dialog header band background.

## Data sources
- `GET /api/languages` → `{ languages: [...] }` (dropdown options).
- `GET /api/traditions` (with optional `?type=X` and `?languageCode=Y`) → `{ traditions: [...] }`. The component builds the query string from active filters and refetches on every filter change.

## Key implementation notes
- `"use client"` directive at top.
- **Batik earthy palette only** — no blue/indigo anywhere. Type badge colors + decorative band use oklch(0.52 0.16 45) terracotta / oklch(0.7 0.12 75) gold / oklch(0.5 0.18 25) maroon + the per-type oklch values from the spec.
- **`BatikDivider`**: kawung-inspired repeating circles in a terracotta→gold→maroon SVG gradient at the section top, plus soft background glow blobs (primary/accent/destructive low opacity).
- **Mobile-first responsive** throughout: grid collapses to 1 col on mobile; dialog header band + scroll area stack on small screens; filter pills wrap.
- **Cards**: consistent `p-5` padding, hover lift (`hover:-translate-y-1 hover:shadow-lg hover:border-primary/40`), `mt-auto` on the footer so cards align regardless of text length.
- **Newline preservation**: both card text/translation and dialog text/translation use `whitespace-pre-line`. Card uses `line-clamp-4`/`line-clamp-3`; dialog shows full text.
- **Total stat caching**: `totalTraditions` state is updated only when fetching the unfiltered set (`typeFilter === "ALL" && languageFilter === "ALL"`) so the header stat stays stable regardless of the active filter.
- Icons from lucide-react: `Library`, `BookOpen`, `Quote`, `Sparkles`, `MapPin`, `Volume2`, `ChevronRight`, `Filter`, `Inbox`, `AlertTriangle`, `Loader2`, `Languages`.
- Uses existing shadcn/ui: `Card`, `Button`, `Badge`, `Dialog` (+ `DialogContent`/`DialogHeader`/`DialogTitle`/`DialogDescription`/`DialogFooter`), `Select` (+ `SelectTrigger`/`SelectValue`/`SelectContent`/`SelectItem`), `Skeleton`, `ScrollArea`.

## Lint / React-hooks compliance
- `bun run lint` passes cleanly (**0 errors, 0 warnings**) after removing an unused `eslint-a11y/media-has-caption` disable directive (added a `<track kind="captions">` element instead for genuine a11y).
- Avoided `react-hooks/set-state-in-effect` violations:
  - **Languages fetch effect**: `useState(true)` for initial loading; all `setState` calls are inside async `.then/.catch` callbacks only. No synchronous `setState` in the effect body.
  - **Traditions fetch effect**: depends on `[typeFilter, languageFilter, fetchNonce]`. Initial `loading=true` covers first render. Subsequent refetches set `loading=true` inside the **event handlers** `handleTypeChange`, `handleLanguageChange`, `handleRetry` (allowed). All other `setState` (`setTraditions`, `setTotalTraditions`, `setError`, `setLoading(false)`) happens inside async `.then/.catch`.
  - **Dialog open** (`handleOpen`): synchronous `setState` in an event handler (allowed).

## Constraints honored
- Did NOT modify any other file.
- Did NOT add new dependencies (uses only existing shadcn/ui + lucide-react + lib/utils + next/link).
- NO indigo/blue colors anywhere.
- Single named export `OralTraditionsSection`.
- Exact wrapper classes per spec (`<section id="tradisi" className="py-16 sm:py-20">` base, augmented with `relative overflow-hidden` for the decorative band).
- No tests written.

## How other agents integrate
In `src/app/page.tsx`:
```tsx
import { OralTraditionsSection } from "@/components/sections/oral-traditions";
// ...
<OralTraditionsSection />
```
The `<section id="tradisi">` is rendered inside the component itself, so `page.tsx` can render `<OralTraditionsSection />` directly — no extra wrapper needed. The `#tradisi` anchor is reachable from the site header/nav, and the dialog footer's "Pelajari bahasa ini" link jumps to `#belajar` (the Learning Modules section built by Task 8).
