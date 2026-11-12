# Task 5 — Proposal PDF WARISAN SUARA (BUDAYA GO! 2026)

**Task ID**: 5
**Agent**: general-purpose
**Skill used**: `pdf` (Report production line — ReportLab)
**Output file**: `/home/z/my-project/download/Proposal-Warisan-Suara-BUDAYAGO2026.pdf`

---

## Result

| Aspect | Value |
|---|---|
| **File path** | `/home/z/my-project/download/Proposal-Warisan-Suara-BUDAYAGO2026.pdf` |
| **Total pages** | 33 (cover + TOC + 18 sections) |
| **File size** | 405.1 KB |
| **Page format** | A4 (210 × 297 mm) |
| **Margins** | 2.5 cm (left/right/top/bottom) |
| **Language** | Indonesian (Bahasa Indonesia) throughout |
| **QA result** | `pdf_qa.py` → **PASS** (12 passed, 0 errors, 0 warnings) |
| **Metadata** | Title, Author, Subject, Creator, Keywords all set per spec |

### Metadata verified

- **Title**: `Proposal WARISAN SUARA - BUDAYA GO! 2026`
- **Author**: `Febri Rizki, S.Si., M.Si.`
- **Subject**: `Kompetisi Inovasi Budaya Indonesia`
- **Creator**: `WARISAN SUARA Team`
- **Producer**: `ReportLab + Playwright (pdf skill - Report production line)`
- **Keywords**: WARISAN SUARA, BUDAYA GO 2026, Inovasi Digital, Pelestarian Bahasa, Tradisi Lisan, Nusantara, Cloudflare, Next.js, Whisper ASR

---

## Production Pipeline

### Route
- Brief: `briefs/report.md` (ReportLab structured document)
- Cover template: **Template 06 (Institutional)** — white bg + black border frame + structured field slots (suitable for formal proposal submission)
- Cover palette: earthy/batik override (cream `#fdf8ef` bg + maroon `#7a3a28` border + gold `#c89545` accents + terracotta `#a85c32` details)

### Files produced
| File | Purpose |
|---|---|
| `/home/z/my-project/download/proposal-ws/cover.html` | Cover HTML (Template 06 adapted, Indonesian content, earthy palette) |
| `/home/z/my-project/download/proposal-ws/cover.pdf` | Rendered cover PDF (Playwright via `html2poster.js --width 794px`) |
| `/home/z/my-project/download/proposal-ws/build_body.py` | ReportLab body PDF generator (sanitized via `pdf.py code.sanitize`) |
| `/home/z/my-project/download/proposal-ws/body.pdf` | Body PDF (32 pages: TOC + 18 sections) |
| `/home/z/my-project/download/proposal-ws/merge.py` | Cover + body merge script with strict A4 normalization (threshold 0.1pt) |
| `/home/z/my-project/download/Proposal-Warisan-Suara-BUDAYAGO2026.pdf` | **Final deliverable** (33 pages, 405 KB) |

### Validation gates passed
1. `poster_validate.py check-html cover.html` — cover overlap PASS
2. `cover_validate.js cover.html` — no text-line or text-text overlap (gap ≥ 40px)
3. `html2poster.js cover.html --output cover.pdf --width 794px` — render OK (176 KB)
4. `pdf.py code.sanitize build_body.py` — sanitized
5. `pdf.py toc.check body.pdf` — TOC entries auto-populated via TocDocTemplate + multiBuild
6. `pdf.py font.check final.pdf` — 0 issues, all fonts embedded
7. `pdf_qa.py --skip-cover final.pdf` — **PASS, 0 errors, 0 warnings**

---

## Document Structure

### Cover (page 1)
- Institution: BUDAYA GO! 2026 + subtitle "Kompetisi Inovasi Budaya Indonesia"
- Doc type: PROPOSAL INOVASI BUDAYA
- Title: WARISAN SUARA — Platform AI untuk Pelestarian Bahasa & Tradisi Lisan Nusantara
- Theme block: Indonesia Cultural Power / Inventing the Future from Indonesian Culture
- Structured fields: Kategori, Ketua Tim, Anggota 1, Anggota 2, Asal, Korespondensi
- Year badge: 2026
- Design: double maroon border frame + gold corner squares + batik dot-grid background + thick divider

### Table of Contents (pages 2-3)
- Auto-generated via `TocDocTemplate.afterFlowable` + `TableOfContents()` flowable
- 2-level hierarchy: section (1-18) + sub-section (e.g. 5.1, 5.2)
- Clickable bookmarks (`<a name="key"/>` + `bookmark_key` attribute)
- Page numbers auto-populated by `multiBuild()`

### Body content (pages 4-33)
All 18 mandatory sections present with substantive Indonesian content:
1. Identitas Kelompok (with identity tables + team table)
2. Nama Produk Inovasi (with 4-metric callout row)
3. Kategori dan Sub Tema
4. Ringkasan Eksekutif (Abstract, ~470 words, within 500-word limit)
5. Latar Belakang dan Permasalahan (5.1, 5.2, 5.3)
6. Akar Budaya dan Landasan Pengembangan (6.1, 6.2, 6.3 + FPIC)
7. Target Pengguna dan Dampak (4-segment table + metrics row)
8. Solusi dan Deskripsi Produk (5-feature table + status)
9. Tujuan dan Manfaat (3 aspek: Budaya/Ekonomi/Sosial)
10. Keunikan dan Nilai Tambah (competitor comparison table)
11. Teknologi dan Metode Pengembangan (Next.js/Cloudflare/Prisma/AI)
12. Implementasi Teknis (6-layer architecture table = diagram)
13. Model Bisnis (BMC 9-element table + 3-fase strategy)
14. Rekam Jejak (table of 10 bahasa daerah + metrics row)
15. Keberlanjutan (bahan baku, SDM, teknologi, kemitraan)
16. Potensi Cultural Power (ASEAN serumpun, diplomasi budaya)
17. Roadmap (short/medium/long + 5-year roadmap table)
18. Lampiran Pendukung (12 referensi [1]-[12], demo links, closing)

### Tables included
- Identity table (Section 1)
- Team roles table (Section 1)
- Segmen pengguna table (Section 7)
- Fitur inti platform table (Section 8)
- Kompetitor comparison table (Section 10)
- Storage/Hosting/Security/Cache table (Section 11)
- **Architecture diagram table** (Section 12, 6 lapisan end-to-end)
- **Business Model Canvas table** (Section 13, 9 elemen)
- Bahasa & tradisi table (Section 14, 10 bahasa with UNESCO status)
- Roadmap 5-year table (Section 17)
- Demo & access table (Section 18)

### Visual elements
- Header (every body page): "WARISAN SUARA · Proposal Inovasi Budaya BUDAYA GO! 2026" + "Kategori: Inovasi Digital" + maroon/gold accent rule
- Footer: "Febri Rizki, S.Si., M.Si. · warisansuara.id@gmail.com" + "Halaman X" + thin maroon rule
- Section headings: maroon serif with terracotta + gold underline rule
- Quote blocks: terracotta left border + cream tint background
- Metric callouts: cream card with terracotta border + vertical accent bars
- All tables: maroon header (white text), gold border, alternating cream/white rows

---

## Quality Checks Run

| Check | Tool | Result |
|---|---|---|
| Cover HTML validation | `poster_validate.py check-html` | PASS |
| Cover overlap detection | `cover_validate.js` | PASS (gap ≥ 40px) |
| Code sanitization | `pdf.py code.sanitize` | Sanitized |
| TOC validation | `pdf.py toc.check` | PASS (entries auto-populated) |
| Font embedding | `pdf.py font.check` | 0 issues, all embedded |
| Blank page cleanup | `pdf.py pages.clean` | 0 blank pages found |
| **Final QA** | **`pdf_qa.py --skip-cover`** | **PASS — 0 errors, 0 warnings** |

### pdf_qa.py detail
- ✅ Title metadata present
- ✅ Author metadata present
- ✅ Creator metadata present
- ✅ Page size consistent (595.28 × 841.89pt across all 33 pages)
- ✅ No blank pages
- ✅ Punctuation placement check passed
- ✅ All fonts embedded (FreeSerif, FreeSerifBold, FreeSerifItalic, FreeSerifBoldItalic, FreeSans, FreeSansBold)
- ✅ No content overflow
- ✅ Content fill ratio adequate on all pages
- ✅ Cover page (p1) content extends to page edges (full-bleed)
- ✅ Left/right margins symmetric (2.5cm both sides)
- ✅ Table centering check complete

---

## Tech Stack Mentioned in Proposal (per spec)

- **Frontend**: Next.js 16 (App Router) + TypeScript 5 + Tailwind CSS 4 + shadcn/ui ✓
- **Mobile UX**: PWA with bottom tab navigation (5 tab: Beranda, Bahasa, Rekam, Belajar, Arsip) ✓
- **Database**: Prisma ORM + SQLite (dev) → Cloudflare D1 (production) ✓
- **AI**: z-ai-web-dev-sdk (dev) → Cloudflare Workers AI (production): Whisper ASR, Llama LLM, TTS ✓
- **Storage**: Cloudflare R2 ✓
- **Hosting**: Cloudflare Pages via @opennextjs/cloudflare ✓
- **Security**: Cloudflare Turnstile (anti-bot), Cloudflare WAF, server-side token verification ✓
- **Cache**: Cloudflare KV ✓

---

## Data Points Used (per spec)

- 10 bahasa daerah: Sunda, Jawa Krama, Bali, Minangkabau, Bugis, Sasak, Ternate, Cirebon, Gorontalo, Nias (4 TERANCAM) ✓
- 20 tradisi lisan: pantun, mantra, nyanyian, cerita rakyat, peribahasa ✓
- 8 modul pembelajaran adaptif ✓
- 128.580.000 penutur terdata ✓
- 3 dari 10 Objek Pemajuan Kebudayaan (UU 5/2017): Tradisi lisan (#1), Manuskrip (#2), Bahasa (#8) ✓

---

## Indikator Penilaian Coverage

| Bobot | Indikator | Coverage in proposal |
|---|---|---|
| 25% | Akar Budaya | Section 6 (3 sub-bagian: komunitas sumber, pengetahuan/teknik/material, FPIC & governance) |
| 25% | Kelayakan Teknis | Section 11 (teknologi) + Section 12 (implementasi + arsitektur 6-lapis) |
| 20% | Model Bisnis | Section 13 (BMC 9 elemen + 3-fase strategi komersialisasi) |
| 30% | Kejelasan & Kualitas | Sections 1-5 + 7-10 + 14-18 (data, solusi, validasi, roadmap) |

---

## Next Actions

1. **Final review by Ketua Tim** — Febri Rizki to read through proposal and confirm all factual claims (especially angka 128.580.000 penutur, 50+ sekolah pilot targets, partnership status).
2. **Live demo deployment** — Currently demo link `https://warisansuara.id` is placeholder; deploy MVP to Cloudflare Pages before submission deadline.
3. **Verify GitHub repo access for juri** — Make `github.com/warisansuara` repository visibility decision (private with grant-on-request is current plan).
4. **Submit to BUDAYA GO! 2026 portal** — Upload final PDF + accompanying materials per Juknis submission requirements.
5. **Prepare pitch deck** — Slide version (separate task) can reuse content from Sections 4 (Abstract), 8 (Solusi), 11-12 (Tech), 13 (BMC), 17 (Roadmap).

---

## Files Snapshot

```
/home/z/my-project/download/
├── Proposal-Warisan-Suara-BUDAYAGO2026.pdf   (405 KB, 33 pages)  ← FINAL DELIVERABLE
└── proposal-ws/
    ├── cover.html        (cover source HTML)
    ├── cover.pdf         (rendered cover PDF, 176 KB)
    ├── body.pdf          (body PDF, 32 pages)
    ├── build_body.py     (ReportLab body generator)
    └── merge.py          (cover+body merge with strict A4 normalization)
```

---

**Status**: ✅ Complete. Proposal PDF generated, QA PASS, all 18 sections present, all metadata set, all tech stack and data points included per spec.
