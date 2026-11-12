# Task 6 — Language Map Section (`Peta Bahasa Daerah`)

## Deliverable
- File created: `src/components/sections/language-map.tsx`
- Single named export: `export function LanguageMapSection()`
- Wrapped in `<section id="peta-bahasa" className="py-16 sm:py-20 border-b border-border">` with `<div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">` inside.

## What it does
Renders the language map section for the WARISAN SUARA PWA:
- Header: title "Peta Bahasa Daerah Nusantara", subtitle explaining UNESCO-based vitality taxonomy, count badge (e.g. "7 bahasa terdata").
- Stats summary: total languages, total speakers covered (formatted), count of endangered languages (TERANCAM + KRITIS + HAMPIR_PUNAH) with AlertTriangle icon.
- Vitality legend: 5 colored chips (AMAN / TERTENTU / TERANCAM / KRITIS / HAMPIR_PUNAH) using exact oklch values from the spec.
- Filter bar: All + every vitality status, active state styled with primary background; shows "Menampilkan X dari Y".
- Responsive grid (1 / sm:2 / lg:3) of language cards.
- Card content: name, region+province, vitality badge, speaker count (38M / 80K / 2.7M), italic greeting in quotes, sample phrase, footer counts (recordings / traditions / modules), hover lift + border-primary/40.
- Loading skeleton (6x LanguageCardSkeleton using Skeleton component).
- Empty state when filter yields nothing.
- Error state with "Coba lagi" retry button.
- Click a card opens a Dialog showing: full description, quick facts (speakers, vitality), greeting, sample phrase, traditions list (fetch `/api/traditions?languageCode=X`) with type badges + translation + meaning, and a "Mulai Belajar" button linking to `#belajar`.

## Data sources
- `GET /api/languages` -> `{ languages: [...] }` (already exists).
- `GET /api/traditions?languageCode=X` -> `{ traditions: [...] }` (already exists).

## Key implementation notes
- `"use client"` directive at top.
- Vitality colors applied via inline `style` (oklch) per spec; everything else uses Tailwind classes / shadcn tokens.
- `formatSpeakers(n)` helper: 38,000,000 -> "38M", 80,000 -> "80K", 2,700,000 -> "2.7M".
- Used existing shadcn/ui: Card, Button, Badge, Skeleton, ScrollArea, Dialog (+ DialogContent/Description/Footer/Title).
- Icons from lucide-react: MapPin, Users, AlertTriangle, BookOpen, Mic, ScrollText, Volume2, ChevronRight, Loader2, Languages, Inbox.
- Decorative batik-inspired SVG band (kawung-style repeating circles + terracotta->gold->maroon gradient) at the section top, plus soft background glows.
- Long traditions list uses `max-h-96 overflow-y-auto`.
- Mobile-first responsive throughout.

## Lint / React-hooks compliance
- `bun run lint` passes cleanly (0 errors, 0 warnings).
- Avoided `react-hooks/set-state-in-effect` violations:
  - Languages fetch effect uses a `fetchNonce` state + AbortController; all `setState` calls are inside async `.then`/`.catch` callbacks only (no synchronous setState in effect body). Initial `loading=true` covers first render; retry button (event handler) sets `loading=true` and bumps the nonce.
  - Traditions fetch is moved into the `handleOpen` event handler (not an effect), so synchronous `setState` there is allowed. Traditions state + loading + error live in the parent and are passed as props to `LanguageDetailDialog`.

## Constraints honored
- Did NOT modify any other file.
- Did NOT add new dependencies.
- NO indigo/blue colors anywhere (only terracotta/gold/maroon/earth + vitality oklch values).
- Single named export `LanguageMapSection`.
- Exact wrapper classes per spec.

## How other agents integrate
In `src/app/page.tsx`:
```tsx
import { LanguageMapSection } from "@/components/sections/language-map";
// ...
<section id="peta-bahasa"><LanguageMapSection /></section>
```
(The section element is actually rendered inside the component itself with id="peta-bahasa", so page.tsx can simply render `<LanguageMapSection />` directly — no extra wrapper needed.)
