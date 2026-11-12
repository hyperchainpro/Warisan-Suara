# Task 6 — Slide Deck PPT WARISAN SUARA · BUDAYA GO! 2026

**Status**: ✅ Completed
**Output file**: `/home/z/my-project/download/Slide-Deck-Warisan-Suara-BUDAYAGO2026.pptx`
**Slide count**: 10 (sesuai Lampiran 2 Juknis poin C)
**File size**: 5.4 MB
**Format**: 16:9 widescreen PowerPoint .pptx (1280×720 source HTML → rasterized to PPTX)

---

## Deliverable

Slide deck presentasi showcase BUDAYA GO! 2026 untuk produk **WARISAN SUARA** — Platform AI PWA untuk Pelestarian Bahasa & Tradisi Lisan Nusantara. Disusun mengikuti outline 10 slide sesuai Lampiran 2 Juknis poin C, dalam Bahasa Indonesia, dirancang untuk dipresentasikan offline kepada Dewan Juri dalam 5–7 menit.

---

## Slide Inventory

| # | Judul Slide | Layout | Page |
|---|---|---|---|
| 01 | WARISAN SUARA — Title Slide | Cover (medallion + soundwave + batik) | 01/10 |
| 02 | Latar Belakang & Permasalahan | Stats grid (3 big stats) + 2-col problem | 02/10 |
| 03 | Penyelesaan yang Sudah Ada + Rencana | Existing band + 2 plan cards (short/long) | 03/10 |
| 04 | Unsur Kebudayaan Indonesia | 3-card grid (Objek Pemajuan #1/#2/#8) + stat band | 04/10 |
| 05 | Solusi, Fungsi & Cara Kerja | Bento grid 5 fitur + demo flow pipeline | 05/10 |
| 06 | Sasaran Pengguna & Pasar | 2×2 quadrant (B2G/B2B/B2C/B2B Riset) + total band | 06/10 |
| 07 | Keunikan dan Nilai Tambah | 5 numbered rows + tech stack chips | 07/10 |
| 08 | Dampak & Kondisi Aktual Produk | Split: 3 impact cards + kondisi maroon card stat grid | 08/10 |
| 09 | Model Bisnis & Roadmap | BMC 9-block mini grid + vertical timeline 3 fase | 09/10 |
| 10 | Penutup & Cultural Power | Closing hero + 2 pillars + big quote + contact | 10/10 |

Setiap slide dilengkapi **speaker notes** (3–5 kalimat Bahasa Indonesia) yang ter-embed sebagai `<aside data-notes>` di HTML source dan diekstrak sebagai proper PowerPoint Notes pane (`ppt/notesSlides/notesSlideN.xml`).

---

## Design System

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
- **Batik motif**: radial gold/maroon glows + diagonal cross-hatch (CSS gradient) sebagai subtle background di setiap slide; conic-gradient corner motifs di empat sudut slide cover/closing.
- **Soundwave motif**: vertical bar cluster di slide 1 (medallion WS) + slide 10 (bottom strip), warna gold + terracotta.
- **Material Icons**: setiap fitur, stat card, dan impact card punya icon (mic, public, school, chat, auto_stories, translate, record_voice_over, description, account_balance, science, person, cloud, verified_user, dll).
- **Footer konsisten**: brand mark "WS" + "WARISAN SUARA · BUDAYA GO! 2026" + section label + page number `NN / 10` di setiap slide.

### Layout discipline
- Setiap slide ≤5 bullet points, setiap bullet ≤10 kata (sesuai requirement)
- Text density minimal, visual impact maksimal
- Layouts divers: cover, stats+problem grid, comparison+plan, 3-card grid, bento, 4-quadrant, numbered rows, split, BMC+timeline, closing hero — tidak ada layout yang berulang berturut-turut.

---

## Source Files (untuk iterasi lanjutan)

```
/home/z/my-project/download/slides/
├── global.css                    # deck-wide stylesheet (palette + typography tokens)
├── slides_brief.json             # dispatch manifest (10 slides + design metadata)
├── slide_01.html                 # Cover
├── slide_02.html                 # Latar Belakang
├── slide_03.html                 # Status & Rencana
├── slide_04.html                 # Akar Budaya
├── slide_05.html                 # Solusi & Cara Kerja
├── slide_06.html                 # Pasar & Sasaran
├── slide_07.html                 # Keunikan
├── slide_08.html                 # Dampak & Kondisi
├── slide_09.html                 # Bisnis & Roadmap
└── slide_10.html                 # Closing
```

---

## Build Pipeline

1. **Stage 3 — Plan**: Tulis `global.css` (palette + typography tokens) + `slides_brief.json` (10 self-contained briefs dengan verbatim text content + speaker notes requirement).
2. **Stage 4 — Build**: Render 10 slide HTML standalone (1280×720) — satu file per slide, link ke `global.css`, pakai TailwindCSS CDN + Google Fonts + Material Icons.
3. **Export — PPTX**: Jalankan `node /home/z/my-project/skills/pptx/batch_html2pptx.js /home/z/my-project/download/slides /home/z/my-project/download/Slide-Deck-Warisan-Suara-BUDAYAGO2026.pptx` → playwright renders setiap HTML ke PNG, lalu pptxgenjs meng-embed sebagai slide background + mengekstrak `<aside data-notes>` menjadi PowerPoint speaker notes.

### Conversion result
- 10/10 slides rendered successfully (concurrency=8)
- 10 notesSlides generated (speaker notes ter-embed sebagai proper PowerPoint Notes pane)
- 0 critical overflow warnings
- Tailwind CDN production warning adalah non-fatal cosmetic console message

---

## Quality Verification

- ✅ 10 slides sesuai outline Juknis Lampiran 2 poin C
- ✅ Bahasa Indonesia throughout
- ✅ Earthy batik palette (terracotta/gold/maroon/cream) — tidak ada blue/indigo
- ✅ 16:9 widescreen 1280×720
- ✅ Bold serif (Playfair Display) untuk judul + clean sans-serif (Manrope) untuk body
- ✅ Soundwave motif di slide 1 & 10
- ✅ Batik pattern subtle background di setiap slide
- ✅ Material Icons untuk setiap fitur (mic/book/chat/library/map)
- ✅ Stats dengan angka besar bold (60–100px)
- ✅ Roadmap sebagai visual timeline vertikal 3-fase
- ✅ Footer konsisten di setiap slide (WS mark + BUDAYA GO! 2026 + page number)
- ✅ Maksimal 5 bullet per slide, setiap bullet ≤10 kata
- ✅ Speaker notes 3–5 kalimat per slide (proper PowerPoint Notes pane)
- ✅ Tim lengkap & exact: Febri Rizki (Ketua), Oki Handinata, Martha Martinni
- ✅ Semua data verbatim dari brief (700+ bahasa, 25% terancam, 4 bahasa prototype, 20 tradisi, 7 daerah, 10 bahasa, 8 modul, 5 fitur AI, 128.580.000 penutur, kontakt warisansuara.id@gmail.com)

---

## Next Actions (opsional, jika perlu iterasi)

1. **Review visual**: buka .pptx di PowerPoint/Keynote/LibreOffice Impress dan periksa tampilan slide per slide.
2. **Iterasi konten**: jika ada perubahan teks, edit `slide_NN.html` langsung di `/home/z/my-project/download/slides/`, lalu jalankan ulang converter (overwrite in-place).
3. **Iterasi design global**: jika ingin ubah palette/typography deck-wide, edit `global.css` saja — semua slide auto-pickup.
4. **Latihan presentasi**: speaker notes di Notes pane sudah siap; total durasi target 5–7 menit (≈30–40 dtk per slide).
5. **Cetak handout**: export ke PDF via PowerPoint "Save as PDF" untuk handout Dewan Juri (opsional).

---

## Related artifacts in this project

- `/home/z/my-project/download/Proposal-Warisan-Suara-BUDAYAGO2026.pdf` — Proposal lengkap (Task 5)
- `/home/z/my-project/agent-ctx/5-proposal-pdf.md` — Work record proposal
- `/home/z/my-project/agent-ctx/10-oral-traditions.md` — 20 tradisi lisan terdokumentasi
- `/home/z/my-project/agent-ctx/6-language-map.md` — Peta bahasa 10 bahasa daerah
- `/home/z/my-project/agent-ctx/8-learning-modules.md` — 8 modul belajar adaptif
