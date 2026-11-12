# Task 4 — Slide Deck PPT v2 (with Mockups + Role Change) · WARISAN SUARA · BUDAYA GO! 2026

**Status**: ✅ Completed
**Output file**: `/home/z/my-project/download/Slide-Deck-Warisan-Suara-BUDAYAGO2026.pptx` (OVERWRITTEN)
**Slide count**: 10
**File size**: 6.54 MB
**Embedded mockups**: 11 embeds across 5 slides (10 unique mockup files; `06-belajar-modul.png` appears on both slide 5 & 10)
**Format**: 16:9 widescreen PowerPoint .pptx (1280×720 source HTML → rasterized to PPTX)

---

## Two Critical Updates Delivered

### Update 1 — Team Role Change
Oki Handinata's role updated from "Strategi Startup & Model Bisnis" → **"UI/UX Designer"** on:
- ✅ Slide 1 (Cover) — team block visible text
- ✅ Slide 1 speaker notes (mentions "Oki Handinata sebagai UI/UX Designer yang merancang tampilan mobile aplikasi")
- ✅ Slides 5, 7, 8, 10 speaker notes (all reference "UI/UX Designer tim kami")

Final team composition (verified in slide1.xml `<a:t>` runs):
| Member | Role |
|---|---|
| Febri Rizki, S.Si., M.Si. (KETUA) | AI Engineer & Web App Developer |
| **Oki Handinata, S.Si. (ANGGOTA)** | **UI/UX Designer** ✏️ CHANGED |
| Martha Martinni, S.Si. (ANGGOTA) | Strategi Startup & Model Bisnis |

### Update 2 — Application Mockups Embedded
10 source mockups cropped to phone viewport (390×844, rounded corners) and embedded in phone-frame styling across 5 slides:

| Slide | Mockups Embedded | Purpose |
|---|---|---|
| 1 (Cover) | `01-beranda` | Accent visual on right side (phone in maroon frame + gold halo + WS corner mark) |
| 5 (Solusi & Cara Kerja) ⭐ | `02-peta-bahasa`, `04-studio-rekam`, `06-belajar-modul`, `08-tutor-ai`, `09-arsip-tradisi` | 5 phone mockups in single row showing all 5 main feature screens + "5-TAB BOTTOM NAV" indicator (Beranda/Bahasa/Rekam/Belajar/Arsip) |
| 7 (Keunikan) | `05-studio-form-turnstile`, `10-tradisi-detail` | 2 mockups side by side as "BUKTI VISUAL APLIKASI" — proof of Turnstile security & content depth |
| 8 (Dampak & Kondisi) ⭐ | `03-language-detail`, `07-lesson-player` | 2 dialog mockups side by side as "KEDALAMAN UI INTERAKTIF" + caption "Tampilan aplikasi mobile PWA — bottom tab navigation" |
| 10 (Penutup) | `06-belajar-modul` | Phone mockup on left as visual element showing learning experience |

Slides 2, 3, 4, 6, 9 remain data-focused with NO mockups (as specified).

---

## Slide Inventory (Final)

| # | Judul | Layout | Mockups | Page |
|---|---|---|---|---|
| 01 | WARISAN SUARA — Title Slide | Cover + phone accent | 1 (Beranda) | 01/10 |
| 02 | Latar Belakang & Permasalahan | Stats grid + 2-col problem | — | 02/10 |
| 03 | Penyelesaian yang Sudah Ada + Rencana | Comparison + roadmap | — | 03/10 |
| 04 | Unsur Kebudayaan Indonesia | 3-card grid + stat band | — | 04/10 |
| 05 | Solusi, Fungsi & Cara Kerja ⭐ | 5 phone mockups + bottom nav | 5 | 05/10 |
| 06 | Sasaran Pengguna & Pasar | 2×2 quadrant + total band | — | 06/10 |
| 07 | Keunikan dan Nilai Tambah | 5 rows + 2 mockup proof | 2 | 07/10 |
| 08 | Dampak & Kondisi Aktual ⭐ | Impact + kondisi + 2 dialog mockups | 2 | 08/10 |
| 09 | Model Bisnis & Roadmap | BMC 9-block + timeline | — | 09/10 |
| 10 | Penutup & Cultural Power | Closing + phone mockup | 1 | 10/10 |

---

## Mockup Cropping Pipeline

Source mockups at `/home/z/my-project/download/mockups/` had varying dimensions (390×844 to 390×7916 — the tall ones are screenshot-stitched scrollable pages). All were cropped to a uniform **390×844** phone viewport using Pillow:

```python
from PIL import Image, ImageDraw
# Crop top portion to 1:2.16 aspect (iPhone-like)
# Resize to 390x844 with LANCZOS
# Apply rounded corners (radius=28) on cream background
```

Cropped mockups saved to `/home/z/my-project/download/slides/mockups/` (sibling to slide HTMLs). The batch_html2pptx.js converter then embeds these via `<img src="mockups/XX-name.png">` references as proper PowerPoint media items (`ppt/media/image-N-M.png`).

| Mockup | Original size | Cropped size | Embedded as |
|---|---|---|---|
| 01-beranda | 390×1341 | 390×844 (161 KB) | image-1-6 (282×630, 156 KB) |
| 02-peta-bahasa | 390×4081 | 390×844 (103 KB) | image-5-4 (237×530, 95 KB) |
| 03-language-detail | 390×844 | 390×844 (66 KB) | image-8-4 (237×530, 73 KB) |
| 04-studio-rekam | 390×1752 | 390×844 (51 KB) | image-5-5 (237×530, 59 KB) |
| 05-studio-form-turnstile | 390×844 | 390×844 (47 KB) | image-7-4 (219×491, 42 KB) |
| 06-belajar-modul | 390×3038 | 390×844 (105 KB) | image-5-6 (237×530, 98 KB) + image-10-7 (282×630, 125 KB) |
| 07-lesson-player | 390×844 | 390×844 (105 KB) | image-8-5 (237×530, 98 KB) |
| 08-tutor-ai | 390×1647 | 390×844 (100 KB) | image-5-7 (237×530, 75 KB) |
| 09-arsip-tradisi | 390×7916 | 390×844 (95 KB) | image-5-8 (237×530, 89 KB) |
| 10-tradisi-detail | 390×844 | 390×844 (70 KB) | image-7-5 (219×491, 68 KB) |

Embedded phone-frame styling per slide:
- Maroon `var(--primary) #7a3a28` phone body
- Gold `var(--accent) #c89545` outer ring (box-shadow `0 0 0 3px rgba(200,149,69,0.55)`)
- Cream `var(--bg-soft) #f5ecd9` inner ring (box-shadow `0 0 0 2px`)
- Notch pill (top center, maroon, rounded)
- Drop shadow for depth (`0 12px 26px -8px rgba(44,24,16,0.40)`)
- Caption label below each phone (uppercase terracotta, letterspaced)

---

## Design System (preserved from v1)

### Palette — Earthy Batik (NO blue/indigo)
- `--bg` cream `#fdf8ef`
- `--primary` maroon `#7a3a28`
- `--accent` gold `#c89545`
- `--terracotta` `#a85c32`
- `--ink` deep brown `#2c1810`
- Supporting: `--bg-soft #f5ecd9`, `--bg-deep #efe2c6`, `--muted #8b6f47`, `--line #d9c4a3`

### Typography
- Heading: **Playfair Display** (bold serif 700/800/900)
- Body: **Manrope** (clean sans-serif 300–800)
- Alt italic: **Cormorant Garamond** (subtitle/tagline)
- Numeric: Manrope tabular-nums bold

### Visual Elements
- Phone-frame mockups with maroon body + gold ring + notch (NEW in v2)
- Batik motif: radial gold/maroon glows + diagonal cross-hatch background
- Soundwave motif: vertical bar cluster (slide 1 right column + slide 10 bottom strip)
- Material Icons for features, stats, impact cards
- Footer: WS mark + "WARISAN SUARA · BUDAYA GO! 2026" + section label + page number

### Layout discipline
- 16:9 widescreen 1280×720
- ≤5 bullets per slide, ≤10 words per bullet
- Phone mockups sized to fit slide grid: 156–200px wide (aspect 1:2.16)
- 5-tab bottom nav indicator on slide 5 showing app structure

---

## Source Files Updated

```
/home/z/my-project/download/slides/
├── global.css                          # unchanged
├── slides_brief.json                   # UPDATED with v2 task briefs (mockups + role change)
├── slide_01.html                       # UPDATED — Oki role + Beranda phone accent
├── slide_02.html                       # unchanged
├── slide_03.html                       # unchanged
├── slide_04.html                       # unchanged
├── slide_05.html                       # REWRITTEN — 5 phone mockups grid + bottom nav
├── slide_06.html                       # unchanged
├── slide_07.html                       # REWRITTEN — 5 rows + 2 mockups (05, 10) side by side
├── slide_08.html                       # REWRITTEN — impact + kondisi + 2 dialog mockups (03, 07)
├── slide_09.html                       # unchanged
├── slide_10.html                       # REWRITTEN — phone mockup 06 on left + hero on right
└── mockups/                            # NEW — 10 cropped phone-viewport PNGs
    ├── 01-beranda.png                  (390×844, 161 KB)
    ├── 02-peta-bahasa.png              (390×844, 103 KB)
    ├── 03-language-detail.png          (390×844, 66 KB)
    ├── 04-studio-rekam.png             (390×844, 51 KB)
    ├── 05-studio-form-turnstile.png    (390×844, 47 KB)
    ├── 06-belajar-modul.png            (390×844, 105 KB)
    ├── 07-lesson-player.png            (390×844, 105 KB)
    ├── 08-tutor-ai.png                 (390×844, 100 KB)
    ├── 09-arsip-tradisi.png            (390×844, 95 KB)
    └── 10-tradisi-detail.png           (390×844, 70 KB)
```

---

## Build Pipeline

1. **Stage A — Mockup prep**: Cropped 10 source mockups (varying heights up to 7916px) to uniform 390×844 phone viewport with rounded corners (radius=28) using Pillow. Saved to `/home/z/my-project/download/slides/mockups/`.

2. **Stage B — Slide HTML updates**: Updated 5 slide HTML files (01, 05, 07, 08, 10) with phone-frame mockup embeds. Each phone uses consistent styling: maroon `var(--primary)` body + gold ring + notch + drop shadow + caption.

3. **Stage C — Brief sync**: Rewrote `slides_brief.json` with updated task_briefs reflecting the new layouts and mockup integration (rewrote whole file fresh to fix a JSON-key issue encountered mid-edit).

4. **Stage D — Export PPTX**: Ran `node /home/z/my-project/skills/pptx/batch_html2pptx.js /home/z/my-project/download/slides /home/z/my-project/download/Slide-Deck-Warisan-Suara-BUDAYAGO2026.pptx` (concurrency=8). All 10 slides + 10 notes slides generated successfully. 46 PNG media files embedded (10 mockups + slide rasterized backgrounds + batik decorations).

---

## Quality Verification

- ✅ 10 slides sesuai outline Juknis Lampiran 2 poin C
- ✅ Bahasa Indonesia throughout (verified speaker notes content)
- ✅ Earthy batik palette preserved (terracotta/gold/maroon/cream) — NO blue/indigo
- ✅ 16:9 widescreen 1280×720
- ✅ Playfair Display headings + Manrope body
- ✅ **Oki Handinata role = "UI/UX Designer" on slide 1** (verified in slide1.xml `<a:t>` text runs)
- ✅ Martha Martinni role = "Strategi Startup & Model Bisnis" (correctly retained)
- ✅ Speaker notes mention UI/UX Designer across multiple slides (1, 5, 7, 8, 10)
- ✅ 11 mockup embeds across 5 slides (10 unique mockup files)
- ✅ Phone-frame styling applied: maroon body + gold ring + notch + drop shadow + caption labels
- ✅ Slide 5: 5 mockups in row + "5-TAB BOTTOM NAV" indicator (Beranda/Bahasa/Rekam/Belajar/Arsip)
- ✅ Slide 7: 2 mockups as visual proof (Turnstile + Detail Tradisi)
- ✅ Slide 8: 2 dialog mockups + caption "Tampilan aplikasi mobile PWA — bottom tab navigation"
- ✅ Slide 10: 1 mockup on left + live demo URL `https://warisan-suara.pages.dev` added to contact
- ✅ Footer konsisten di setiap slide (WS mark + BUDAYA GO! 2026 + page number)
- ✅ Maksimal 5 bullet per slide, setiap bullet ≤10 kata
- ✅ Speaker notes 3–5 kalimat per slide (proper PowerPoint Notes pane)
- ✅ All data verbatim: 700+ bahasa, 25% terancam, 4 bahasa prototype, 20 tradisi, 7 daerah, 10 bahasa, 8 modul, 5 fitur AI, 128.580.000 penutur, warisansuara.id@gmail.com

### File size note
Final PPTX is **6.54 MB** (slightly below the expected 8–15 MB range). This is because mockups were cropped to phone viewport (390×844) before embedding — original tall screenshots (some up to 390×7916) would have produced the expected larger file size, but cropping was necessary to fit multiple phone mockups per slide in the 1280×720 canvas.

---

## Next Actions (opsional, jika perlu iterasi)

1. **Review visual**: buka .pptx di PowerPoint/Keynote/LibreOffice Impress dan periksa tampilan slide per slide — fokus pada slide 5 (5 mockups grid), slide 7 (Turnstile proof), slide 8 (dialog mockups), dan slide 10 (Belajar Modul accent).
2. **Iterasi mockup crops**: jika juri ingin melihat bagian lain dari halaman panjang (e.g. mid-section of Peta Bahasa alih-alih top), edit `crop_y` di script cropping dan re-run `batch_html2pptx.js`.
3. **Iterasi konten**: edit `slide_NN.html` langsung di `/home/z/my-project/download/slides/`, lalu jalankan ulang converter (overwrite in-place).
4. **Latihan presentasi**: speaker notes di Notes pane sudah siap; total durasi target 5–7 menit (≈30–40 dtk per slide). Mockup embeds memberi juri visual nyata aplikasi selama demo.
5. **Live demo URL**: slide 10 sekarang menampilkan `https://warisan-suara.pages.dev` sebagai CTA demo — siap dipresentasikan live jika juri meminta.

---

## Related artifacts in this project

- `/home/z/my-project/download/Proposal-Warisan-Suara-BUDAYAGO2026.pdf` — Proposal lengkap (Task 5)
- `/home/z/my-project/download/mockups/` — Original 10 mockup PNGs (uncropped, source of truth)
- `/home/z/my-project/agent-ctx/5-proposal-pdf.md` — Work record proposal
- `/home/z/my-project/agent-ctx/6-slide-deck.md` — Work record v1 slide deck (without mockups)
- `/home/z/my-project/agent-ctx/4-slide-deck-v2.md` — THIS FILE (v2 with mockups + role change)
- `/home/z/my-project/agent-ctx/10-oral-traditions.md` — 20 tradisi lisan terdokumentasi
- `/home/z/my-project/agent-ctx/6-language-map.md` — Peta bahasa 10 bahasa daerah
- `/home/z/my-project/agent-ctx/8-learning-modules.md` — 8 modul belajar adaptif
