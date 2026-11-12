# Q&A Preparation — WARISAN SUARA
## Panduan Sesi Juri BUDAYA GO! 2026 (Showcase 4-5 Desember 2026)

Dokumen ini berisi 20 pertanyaan antisipasi dari Dewan Juri + jawaban terstruktur untuk sesi showcase.

---

## Kategori 1: Akar Budaya & Substansi (Bobot 25%)

### Q1: Bahasa daerah apa yang menjadi prioritas pertama dan mengapa?
**A:** Prioritas adalah 4 bahasa berstatus TERANCAM yang sudah ada di prototype: **Ternate (80K penutur), Cirebon (1.2M), Gorontalo (1M), Nias (770K)**. Alasannya: (1) penutur asli mayoritas lansia — waktu terbatas, (2) belum ada platform digital yang mendokumentasikan secara sistematis, (3) masing-masing memiliki tradisi lisan unik (Hoho Nias, Lumonde Gorontalo, Kabari Ternate, Mantra Sanduk Cirebon) yang belum terarsip digital.

### Q2: Bagaimana produk menghormati hak komunitas pemilik pengetahuan tradisional?
**A:** Sesuai UU 5/2017 Pasal 28-30, kami menerapkan: (1) **attribution wajib** — setiap rekaman mencatat nama penutur, peran, konteks; (2) **informed consent** — form metadata mencatat persetujuan penutur; (3) **no commercial exploitation tanpa PKS** dengan komunitas; (4) HKI tetap milik peserta/komunitas (Juknis poin H.1); (5) tradisi lisan ditampilkan dengan konteks budaya lengkap, bukan diambil sebagai ornamen.

### Q3: Produk ini menyentuh Objek Pemajuan Kebudayaan mana saja?
**A:** Tiga dari 10 Objek Pemajuan (UU 5/2017 Pasal 1): (1) **Tradisi lisan** (#1) — pantun, mantra, nyanyian rakyat, cerita rakyat; (2) **Manuskrip** (#2) — transkripsi naskah lisan yang sebelumnya hanya oral; (3) **Bahasa** (#8) — 10 bahasa daerah Nusantara. Kedalaman integrasi ini menjadi pembeda utama dari kompetitor yang hanya menyentuh 1 objek.

---

## Kategori 2: Kelayakan Teknis & Implementasi (Bobot 25%)

### Q4: Mengapa menggunakan Cloudflare, bukan Vercel atau AWS?
**A:** Empat alasan: (1) **FREE tier mencakup semua kebutuhan** — Pages (100k req/hari), D1 (5GB), Workers AI (10k neurons/hari), KV (100k reads/hari); (2) **Workers AI terintegrasi** — Whisper ASR, Llama 3.1 LLM, MeloTTS multilingual dalam satu platform; (3) **Edge global** — 300+ PoP, latency <50ms di Indonesia; (4) **Security built-in** — Turnstile anti-bot, WAF, DDoS protection tanpa konfigurasi tambahan.

### Q5: Bagaimana akurasi Whisper ASR untuk bahasa daerah yang bukan Bahasa Indonesia?
**A:** Whisper dilatih pada 680k jam audio multilingual termasuk bahasa Austronesia. Untuk bahasa daerah, akurasi bergantung pada kedekatan fonetik dengan bahasa training. Strategi mitigasi: (1) **human-in-the-loop** — pengguna dapat koreksi transkripsi sebelum disimpan; (2) **fine-tuning roadmap** — jangka menengah kami akan fine-tune Whisper dengan korpus bahasa daerah spesifik; (3) **LLM post-processing** — Llama 3.1 membersihkan noise transkripsi berdasarkan konteks bahasa.

### Q6: Apakah aplikasi bisa berjalan offline?
**A:** Ya, sebagai PWA. Service worker (`/sw.js`) meng-cache: (1) static assets (HTML, CSS, JS, icons); (2) modul belajar yang sudah diakses; (3) tradisi lisan yang sudah dibuka. Fitur AI (ASR/TTS/Tutor) tetap butuh internet karena memanggil Workers AI edge. Strategi hybrid ini cocok untuk daerah dengan koneksi terbatas.

### Q7: Bagaimana keamanan data pengguna, terutama rekaman audio?
**A:** Multi-layer security: (1) **Cloudflare Turnstile** — anti-bot pada form upload, server-side verification via `challenges.cloudflare.com/turnstile/v0/siteverify`; (2) **input validation** — length limits (title ≤200, speakerName ≤100, context ≤1000 chars); (3) **no PII leak** — deviceId anonym (tidak terkait identitas); (4) **UU PDP 27/2022 compliance** — data publik saja, rekaman dengan informed consent; (5) **HTTPS only** via Cloudflare edge.

### Q8: Berapa latensi response AI di produksi?
**A:** Berdasarkan pengujian live di `warisan-suara.pages.dev`: (1) **TTS MeloTTS** 1.8-2.5 detik untuk frasa pendek; (2) **Translate Llama 3.1** 0.3-0.4 detik; (3) **Tutor chat** 0.6-0.9 detik; (4) **ASR Whisper** 2-4 detik untuk audio 10 detik. Latency dapat dioptimasi dengan KV caching untuk response yang sering diminta.

---

## Kategori 3: Model Bisnis & Komersialisasi (Bobot 20%)

### Q9: Bagaimana model pendapatan jika pakai free tier Cloudflare?
**A:** Biaya infrastruktur Rp0 (free tier). Pendapatan dari: (1) **B2G Pemda** — lisensi pelestarian bahasa daerah, APBD (Rp50-200jt/kabupaten/tahun); (2) **B2B Sekolah** — langganan Kurikulum Merdeka muatan bahasa daerah (Rp5-15jt/sekolah/tahun); (3) **B2C freemium** — langganan premium Rp25rb/bln untuk akses tak terbatas; (4) **B2B Riset** — API access korpus bahasa daerah untuk akademisi (Rp100rb-1jt/bulan).

### Q10: Siapa pesaing utama dan apa keunggulan Warisan Suara?
**A:** Existing: (1) Kamus digital Bahasa Sunda/Jawa (pasif, tidak ada AI); (2) Aplikasi bahasa daerah Kemendikbud (sebatas PDF/ebook); (3) Duolingo (tidak ada bahasa daerah Indonesia). **Keunggulan kami**: (1) AI Whisper ASR khusus bahasa daerah ( belum ada di pasar); (2) 3 Objek Pemajuan sekaligus; (3) mobile-app UX dengan bottom tab nav; (4) Cloudflare edge (latency rendah); (5) harga terjangkau untuk institusi Indonesia.

### Q11: Bagaimana strategi hilirisasi pasca kompetisi?
**A:** Sesuai Juknis poin H, PKS dengan mitra strategis: (1) **Pemda** — kerjasama dinas kebudayaan untuk program regenerasi bahasa; (2) **Kemendikbud** — integrasi Kurikulum Merdeka; (3) **Universitas** — riset korpus bahasa (UI, ITB, UGM, Unud); (4) **Komunitas adat** — dokumentasi partisipatif. Target: 50+ penutur asli terlibat dalam 12 bulan pertama.

### Q12: Berapa Market Size yang realistis?
**A:** TAM: 128.5M penutur bahasa daerah di Indonesia. SAM: 34M siswa SD-SMP yang wajib muatan bahasa daerah (Kurikulum Merdeka). SOM tahun 1: 10.000 pengguna aktif (freemium) + 50 sekolah B2B + 5 pemda B2G. Revenue tahun 1 proyeksi: Rp750jt-1.5M (asumsi konservatif).

---

## Kategori 4: Proposal & Dampak (Bobot 30%)

### Q13: Apakah produk sudah punya pengguna/pelanggan?
**A:** Saat didaftarkan, prototype sudah live di `warisan-suara.pages.dev` dengan 10 bahasa, 20 tradisi, 8 modul fungsional. Pengguna early adopter: tim pengembang + jaringan akademik. Target 6 bulan: 50+ penutur asli pilot di 3 daerah (Jawa Barat, Bali, Ternate). Bukti validasi: API health check live, 16+ endpoint berfungsi, semua AI models returning valid responses.

### Q14: Dampak budaya yang sudah tercapai?
**A:** (1) 20 tradisi lisan terdokumentasi digital — sebelumnya 0; (2) 10 bahasa daerah dengan metadata lengkap (greeting, sample phrase, vitality status); (3) 8 modul pembelajaran siap dipakai sekolah; (4) 4 bahasa TERANCAM (Ternate, Cirebon, Gorontalo, Nias) mendapat platform dokumentasi pertama; (5) arsip audio-ready untuk peneliti.

### Q15: Dampak ekonomi yang ditargetkan?
**A:** Jangka pendek (6-12 bln): pelaku budaya (penutur asli, sanggar) dapat pendapatan tambahan dari kontribusi rekaman. Jangka menengah (1-2 thn): 50+ sekolah berlangganan = Rp250-750jt revenue. Jangka panjang (3-5 thn): 100+ bahasa terdokumentasi, ekspansi ASEAN (Filipina, Malaysia serumpun), sertifikasi Kemendikbud.

### Q16: Bagaimana keberlanjutan tim pasca kompetisi?
**A:** Tim 3 orang dengan peran komplementer: Febri (engineer) mengembangkan produk, Oki (UI/UX) menjaga kualitas pengalaman pengguna, Martha (bisnis) mengurus kemitraan & revenue. Struktur ini sustainable untuk startup 3 orang. Roadmap: tahun 1 bootstrapping + grant pemda, tahun 2 seed funding, tahun 3 Series A.

---

## Kategori 5: Pertanyaan Teknis Spesifik

### Q17: Kenapa mobile PWA, bukan native app (Flutter/Kotlin)?
**A:** (1) **Cross-platform** — satu codebase untuk Android, iOS, desktop; (2) **no app store friction** — langsung install dari browser, tidak perlu review Google Play/App Store; (3) **lower barrier** — pengguna tidak perlu download 50MB+ APK; (4) **SEO friendly** — indexable by Google; (5) **faster iteration** — deploy dalam menit, bukan hari. Juknis BUDAYA GO! 2026 eksplisit menyebut "Web Application" sebagai teknologi yang diperbolehkan.

### Q18: Bagaimana cara kerja AI Tutor bahasa daerah?
**A:** Llama 3.1 8B Instruct di-prompt dengan system message: "Anda adalah tutor {bahasa}. Jawab dalam {bahasa} dengan ejaan benar. Setelah jawaban, berikan terjemahan [ID: ...]." AI memahami konteks bahasa karena Llama dilatih pada corpus multilingual. Limitasi: ejaan tidak selalu perfect (bahasa daerah tidak standar). Mitigasi: human review untuk konten pembelajaran formal.

### Q19: Apakah ada risiko bias atau hallucination pada AI?
**A:** Ya, ada risiko: (1) Whisper bisa hallucinate pada audio noise/silent; (2) Llama bisa salah ejaan bahasa daerah; (3) TTS MeloTTS mungkin tidak natural untuk semua bahasa. Mitigasi: (1) **disclaimer di UI** — "Hasil AI mungkin perlu koreksi"; (2) **human-in-the-loop** — pengguna edit transkripsi; (3) **feedback loop** — pengguna laporkan kesalahan; (4) **fine-tuning roadmap** jangka menengah dengan korpus bahasa daerah.

### Q20: Bagaimana scalability jika 1000+ pengguna concurrent?
**A:** Cloudflare Pages auto-scales di edge (300+ PoP global). Workers AI juga auto-scale. D1 free tier: 5M rows read/hari — cukup untuk 1000+ DAU. Bottleneck potensial: Workers AI neurons quota (10k/hari di free). Mitigasi: (1) upgrade ke Workers Paid ($5/bln) untuk 50M neurons; (2) KV caching untuk response berulang; (3) queue-based processing untuk ASR batch.

---

## Tips Presentasi Showcase

1. **Buka dengan demo live** — tunjukkan `warisan-suara.pages.dev` di handphone
2. **Soroti 4 bahasa TERANCAM** — ini hook emosional juri
3. **Tunjukkan AI real-time** — rekam audio → transkripsi → translate dalam 5 detik
4. **Kaitkan dengan UU 5/2017** — akar budaya kuat = 3 Objek Pemajuan
5. **Sebutkan Cloudflare free tier** — showcase teknis cerdas, hemat biaya
6. **Tutup dengan visi** — "Membuka Masa Depan Budaya Indonesia"

## Backup Jika Internet Lambat
- Siapkan video showcase 3:00 menit (`Video-Showcase-Warisan-Suara.mp4`) sebagai fallback
- Screenshot mockup di slide deck PPT
- QR code ke live demo di slide terakhir

---

*Dokumen ini disusun untuk tim: Febri Rizki (Ketua), Oki Handinata (UI/UX), Martha Martinni (Strategi).*
*Kontak: warisansuara.id@gmail.com · Live: warisan-suara.pages.dev*
