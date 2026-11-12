# WARISAN SUARA — Pelestarian Bahasa & Tradisi Lisan Nusantara

> Platform AI untuk mendokumentasikan, mempelajari, dan mewariskan bahasa daerah serta tradisi lisan Nusantara yang terancam punah.
>
> Dibangun untuk **BUDAYA GO! 2026 — Kompetisi Inovasi Budaya Indonesia**, Kementerian Kebudayaan RI.
> Tema: *Indonesia Cultural Power* · Sub Tema: *Inventing the Future from Indonesian Culture*

---

## Ringkasan Produk

**Warisan Suara** adalah aplikasi PWA (Progressive Web App) berbasis AI yang menjawab persoalan kritis: **lebih dari 25% bahasa daerah Indonesia terancam punah** bersama tetua adatnya, sementara belum ada platform aktif yang menangkap, mentranskripsi, dan mewariskan khazanah lisan tersebut ke generasi muda.

### Fitur Utama

| Fitur | Deskripsi |
|---|---|
| **Peta Bahasa Daerah** | Eksplorasi 7 bahasa daerah dengan status vitalitas UNESCO (Aman → Hampir Punah), statistik penutur, sapaan khas. |
| **Studio Rekam** | Rekam suara penutur asli → AI Whisper ASR otomatis transkripsi → LLM terjemahkan ke Bahasa Indonesia → simpan ke arsip. |
| **Modul Belajar Adaptif** | Micro-learning 5 pelajaran per bahasa dengan TTS pelafalan, progress tracking per-device. |
| **Tutor AI Percakapan** | Chat dengan AI dalam bahasa daerah (Sunda, Jawa, Bali, Minang, Bugis, dll), lengkap dengan terjemahan & koreksi. |
| **Arsip Tradisi Lisan** | 14 tradisi lisan terdokumentasi: pantun, mantra, nyanyian rakyat, cerita rakyat, peribahasa — dari 7 daerah Nusantara. |

### Akar Budaya (Substansi)

Produk ini menyentuh **3 dari 10 Objek Pemajuan Kebudayaan** (UU No. 5/2017):
1. **Tradisi lisan** (Objek #1) — pantun, mantra, cerita rakyat
2. **Manuskrip** (Objek #2) — naskah lisan yang ditranskripsi
3. **Bahasa** (Objek #8) — 7 bahasa daerah Nusantara

---

## Teknologi Stack

### Cloudflare (Production)

| Layanan | Fungsi |
|---|---|
| **Cloudflare Pages** | Hosting PWA (via `@opennextjs/cloudflare`) |
| **Cloudflare D1** | Database SQLite at edge (menggantikan SQLite lokal) |
| **Cloudflare R2** | Object storage untuk file audio rekaman |
| **Cloudflare Workers AI** | AI inference — Whisper ASR, Llama/Mistral LLM, TTS |
| **Cloudflare KV** | Cache response untuk stats & daftar bahasa |
| **Cloudflare Turnstile** | Bot protection pada form upload rekaman |
| **Cloudflare WAF** | Web Application Firewall + rate limiting |
| **Cloudflare Access** | Zero-trust auth untuk admin panel (opsional) |

### Local Dev (Sandbox)

| Komponen | Teknologi |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript 5 |
| Styling | Tailwind CSS 4 + shadcn/ui (New York) |
| Database | Prisma ORM + SQLite (swappable ke D1) |
| AI (dev) | `z-ai-web-dev-sdk` (swappable ke Workers AI) |
| Storage | Local `/public/uploads` (swappable ke R2) |
| Icons | Lucide React |
| State | React hooks + TanStack Query ready |

---

## Development

```bash
# Install dependencies
bun install

# Run database migrations & seed
bun run db:push
bun run db:seed

# Start dev server
bun run dev    # http://localhost:3000

# Lint
bun run lint
```

### Environment Variables

Local dev tidak memerlukan env vars khusus (SQLite + z-ai-web-dev-sdk otomatis).

Production deployment memerlukan:
```
USE_CLOUDFLARE_AI=1
DATABASE_URL=<Cloudflare D1 connection string (jika pakai Prisma Accelerate)>
```

---

## Deployment ke Cloudflare

### Prasyarat
1. Akun Cloudflare dengan Workers Paid Plan (untuk Workers AI & D1)
2. `wrangler` CLI: `npm install -g wrangler`
3. Login: `wrangler login`

### Langkah Deployment

```bash
# 1. Buat D1 database
wrangler d1 create warisan-suara-db
# → catat database_id, masukkan ke wrangler.jsonc

# 2. Buat R2 bucket untuk audio
wrangler r2 bucket create warisan-suara-audio

# 3. Buat KV namespace untuk cache
wrangler kv namespace create CACHE
# → catat id, masukkan ke wrangler.jsonc

# 4. Generate D1 migrations dari Prisma schema
#    (gunakan prisma-d1 adapter atau wrangler d1 migrations)
npx wrangler d1 migrations create warisan-suara-db init
# copy SQL dari prisma/schema.prisma (via prisma migrate diff)
npx wrangler d1 migrations apply warisan-suara-db --remote

# 5. Seed D1 (jalankan script seed ts via wrangler)
wrangler d1 execute warisan-suara-db --remote --file=./migrations/seed.sql

# 6. Build & deploy via OpenNext
npx opennextjs-cloudflare && wrangler deploy
```

### Custom Domain
1. Tambah domain di Cloudflare dashboard
2. Routes di `wrangler.jsonc` sudah dikonfigurasi: `warisansuara.id`
3. SSL otomatis via Cloudflare edge

---

## Arsitektur AI (Cloudflare-Ready)

File `src/lib/ai.ts` mengabstraksi semua pemanggilan AI:

```typescript
// Saat ini (dev): z-ai-web-dev-sdk
const zai = await ZAI.create();
await zai.audio.asr.create({ file_base64 });
await zai.chat.completions.create({ messages });
await zai.audio.tts.create({ input });

// Production (Cloudflare): gunakan env.AI binding
// Tinggal swap implementasi dengan:
// await env.AI.run('@cf/openai/whisper', { audio: base64 });
// await env.AI.run('@cf/meta/llama-3.1-8b-instruct', { messages });
// await env.AI.run('@cf/myshell-ai/vits-seen-pual-...', { text });
```

API routes di `src/app/api/*` sudah terstruktur sehingga mudah swap:
- `/api/asr` — Whisper ASR
- `/api/translate` — LLM translation
- `/api/tts` — TTS synthesis
- `/api/tutor/chat` — Conversational LLM
- `/api/recordings` — Upload audio ke R2 + ASR + translate

---

## Tim (sesuai Juknis BUDAYA GO! 2026)

Wajib 3 anggota dengan peran:
1. **Ketua** — Febri Rizki, S.Si., M.Si. — AI Engineer & Web App Developer
2. **Anggota** — Oki Handinata, S.Si. — UI/UX Designer
3. **Anggota** — Martha Martinni, S.Si. — Strategi Startup & Model Bisnis

---

## Model Bisnis

| Segmen | Value Proposition | Channel |
|---|---|---|
| **B2G (Pemda)** | Pelestarian bahasa daerah sesuai UU 5/2017 + APBD mandate | Kerjasama dinas kebudayaan |
| **B2B Sekolah** | Kurikulum Merdeka wajibkan muatan bahasa daerah SD-SMP | Lisensi langganan per sekolah |
| **B2C Individu** | Anak perantau belajar bahasa daerah leluhur | Freemium PWA + langganan premium |
| **B2B Riset** | Korpus bahasa daerah untuk akademisi & peneliti | API access berbayar |

---

## Roadmap

### Jangka Pendek (6-12 bulan)
- Validasi dengan 50+ penutur asli di 3 daerah pilot (Jawa Barat, Bali, Ternate)
- Migrasi penuh ke Cloudflare D1/R2/Workers AI
- Tambah 10 bahasa daerah prioritas terancam

### Jangka Menengah (1-2 tahun)
- Integrasi dengan Pemda untuk program regenerasi bahasa
- Mobile apps native via Capacitor (reuse PWA codebase)
- API publik untuk peneliti & developer

### Jangka Panjang (3-5 tahun)
- 100+ bahasa daerah terdokumentasi
- Sertifikasi resmi Kemendikbud untuk pembelajaran bahasa daerah
- Ekspansi ke ASEAN (Filipina, Malaysia) untuk bahasa serumpun

---

## Lisensi

Kode: MIT
Konten budaya: menghormati hak komunitas pemilik pengetahuan tradisional (UU 5/2017, Pasal 28-30).

---

## Kontak

- **Laman**: www.budayago.id (kompetisi) · warisansuara.id (produk)
- **Instagram**: @kemenkebud @budayadigital.id
- **Email**: info@budayago.id

---

*Dibangun dengan ❤️ untuk masa depan budaya Indonesia.*
