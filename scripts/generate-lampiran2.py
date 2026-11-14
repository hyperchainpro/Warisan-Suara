#!/usr/bin/env python3
"""Lampiran 2 PDF v3 - Optimized for jury readability"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib.colors import HexColor, white
from reportlab.platypus import (
    Paragraph, Spacer, Image, PageBreak, Table, TableStyle,
    KeepTogether, Frame, PageTemplate, BaseDocTemplate, NextPageTemplate
)
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
import os

OUT = "/home/z/my-project/download/Lampiran-2-Bukti-Produk-Materi-Presentasi.pdf"
MOCKUPS_DIR = "/tmp/mockups-viewport"
SLIDES_DIR = "/tmp/slide-images"

TERRACOTTA = HexColor("#a85c32")
GOLD = HexColor("#c89545")
MAROON = HexColor("#7a3a28")
CREAM = HexColor("#fdf8ef")
DARK = HexColor("#2a1f18")
LIGHT_BG = HexColor("#f8f0e8")

# Styles
s_title = ParagraphStyle("T", fontName="Helvetica-Bold", fontSize=26, textColor=white, alignment=TA_CENTER, leading=30)
s_sub = ParagraphStyle("S", fontName="Helvetica", fontSize=13, textColor=white, alignment=TA_CENTER, leading=16)
s_section = ParagraphStyle("SE", fontName="Helvetica-Bold", fontSize=16, textColor=white, backColor=TERRACOTTA, borderPadding=(6,10,6,10), spaceAfter=8, leading=20)
s_h2 = ParagraphStyle("H2", fontName="Helvetica-Bold", fontSize=12, textColor=MAROON, spaceAfter=4, spaceBefore=8)
s_body = ParagraphStyle("B", fontName="Helvetica", fontSize=10, textColor=DARK, alignment=TA_JUSTIFY, leading=14, spaceAfter=4)
s_caption = ParagraphStyle("C", fontName="Helvetica-Bold", fontSize=10, textColor=TERRACOTTA, alignment=TA_CENTER, spaceAfter=2, spaceBefore=4)
s_desc = ParagraphStyle("D", fontName="Helvetica", fontSize=9, textColor=DARK, alignment=TA_LEFT, leading=12, spaceAfter=4)
s_tc = ParagraphStyle("TC", fontName="Helvetica", fontSize=9, textColor=DARK, leading=12)
s_th = ParagraphStyle("TH", fontName="Helvetica-Bold", fontSize=9, textColor=white, alignment=TA_CENTER, leading=12)
s_yt = ParagraphStyle("YT", fontName="Helvetica-Bold", fontSize=11, textColor=white, backColor=TERRACOTTA, alignment=TA_CENTER, borderPadding=(6,10,6,10), spaceBefore=8, spaceAfter=8)
s_feat = ParagraphStyle("F", fontName="Helvetica", fontSize=9, textColor=MAROON, alignment=TA_LEFT, leading=12, leftIndent=8)

def P(text, style=s_body):
    return Paragraph(text, style)

def page_dec(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(TERRACOTTA)
    canvas.rect(0, A4[1]-0.6*cm, A4[0], 0.6*cm, fill=1, stroke=0)
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(MAROON)
    canvas.drawString(2*cm, 1*cm, "WARISAN SUARA · Lampiran 2 · BUDAYA GO! 2026")
    canvas.drawRightString(A4[0]-2*cm, 1*cm, f"{doc.page}")
    canvas.setStrokeColor(GOLD)
    canvas.setLineWidth(0.5)
    canvas.line(2*cm, 1.3*cm, A4[0]-2*cm, 1.3*cm)
    canvas.restoreState()

def cover_dec(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(CREAM)
    canvas.rect(0, 0, A4[0], A4[1], fill=1, stroke=0)
    # Top banner
    canvas.setFillColor(TERRACOTTA)
    canvas.rect(0, A4[1]-4*cm, A4[0], 4*cm, fill=1, stroke=0)
    canvas.setFillColor(GOLD)
    canvas.rect(0, A4[1]-4.2*cm, A4[0], 0.2*cm, fill=1, stroke=0)
    # Bottom banner
    canvas.setFillColor(MAROON)
    canvas.rect(0, 0, A4[0], 2*cm, fill=1, stroke=0)
    canvas.setFillColor(GOLD)
    canvas.rect(0, 2*cm, A4[0], 0.2*cm, fill=1, stroke=0)
    # Soundwave logo
    cx, cy = A4[0]/2, A4[1]/2 + 0.5*cm
    canvas.setStrokeColor(TERRACOTTA)
    canvas.setLineWidth(3)
    for i, h in enumerate([25, 45, 20, 40, 30]):
        x = cx - 35 + i*17
        canvas.line(x, cy-h/2, x, cy+h/2)
    canvas.setFillColor(TERRACOTTA)
    canvas.circle(cx, cy, 7, fill=1, stroke=0)
    # Footer
    canvas.setFont("Helvetica-Bold", 9)
    canvas.setFillColor(white)
    canvas.drawCentredString(cx, 1*cm, "BUDAYA GO! 2026 · Indonesia Cultural Power")
    canvas.restoreState()

doc = BaseDocTemplate(OUT, pagesize=A4, topMargin=1.8*cm, bottomMargin=1.8*cm, leftMargin=2*cm, rightMargin=2*cm,
    title="Lampiran 2 - Bukti Produk - WARISAN SUARA", author="Febri Rizki, S.Si., M.Si.", subject="BUDAYA GO! 2026")

cover_frame = Frame(2*cm, 2.5*cm, A4[0]-4*cm, A4[1]-7*cm, id="cover")
content_frame = Frame(2*cm, 1.5*cm, A4[0]-4*cm, A4[1]-3.5*cm, id="content")
doc.addPageTemplates([
    PageTemplate(id="Cover", frames=cover_frame, onPage=cover_dec),
    PageTemplate(id="Content", frames=content_frame, onPage=page_dec),
])

story = []

# COVER
story.append(Spacer(1, 0.5*cm))
story.append(P("LAMPIRAN 2", s_title))
story.append(Spacer(1, 0.2*cm))
story.append(P("Bukti Produk dan Materi Presentasi", s_sub))
story.append(Spacer(1, 1.5*cm))

cover_info = [
    [P("Produk", s_th), P("<b>WARISAN SUARA</b> — Platform AI Pelestarian Bahasa & Tradisi Lisan Nusantara", s_tc)],
    [P("Kategori", s_th), P("Inovasi Digital · Sub-tema #4 Pembelajaran dan Edukasi Digital Berbasis Budaya", s_tc)],
    [P("Tim", s_th), P("<b>Febri Rizki, S.Si., M.Si.</b> (Ketua — Pengembangan Produk)<br/><b>Oki Handinata, S.Si.</b> (Anggota — Kebudayaan)<br/><b>Martha Martinni, S.Si.</b> (Anggota — Ekonomi)", s_tc)],
    [P("Email", s_th), P("hyperchain.project@gmail.com", s_tc)],
    [P("Demo", s_th), P("warisan-suara.pages.dev", s_tc)],
    [P("GitHub", s_th), P("github.com/hyperchainpro/Warisan-Suara", s_tc)],
    [P("Video", s_th), P("youtu.be/UrVE7wZEo2U", s_tc)],
]
ct = Table(cover_info, colWidths=[3*cm, 12.5*cm])
ct.setStyle(TableStyle([
    ("GRID", (0,0), (-1,-1), 0.5, HexColor("#dddddd")),
    ("BACKGROUND", (0,0), (0,-1), LIGHT_BG),
    ("VALIGN", (0,0), (-1,-1), "TOP"),
    ("TOPPADDING", (0,0), (-1,-1), 6),
    ("BOTTOMPADDING", (0,0), (-1,-1), 6),
    ("LEFTPADDING", (0,0), (-1,-1), 8),
]))
story.append(ct)
story.append(NextPageTemplate("Content"))
story.append(PageBreak())

# SECTION A
story.append(P("A. Bukti Produk Inovasi Digital", s_section))
story.append(P("WARISAN SUARA adalah PWA (Progressive Web App) mobile dengan 5-tab bottom navigation: Beranda, Bahasa, Rekam, Belajar, Arsip. Aplikasi live di Cloudflare Pages dengan integrasi Workers AI (Llama 3.1, Whisper ASR, MeloTTS). Berikut bukti keberadaan dan fungsi produk:", s_body))
story.append(Spacer(1, 0.3*cm))

# Links table
links = [
    [P("Live Demo", s_th), P("https://warisan-suara.pages.dev", s_tc)],
    [P("Source Code", s_th), P("github.com/hyperchainpro/Warisan-Suara", s_tc)],
    [P("API Health", s_th), P("warisan-suara.pages.dev/api/health", s_tc)],
    [P("Platform", s_th), P("Cloudflare Pages (free tier) + D1 + Workers AI", s_tc)],
]
lt = Table(links, colWidths=[3*cm, 12.5*cm])
lt.setStyle(TableStyle([("GRID",(0,0),(-1,-1),0.5,HexColor("#ddd")),("BACKGROUND",(0,0),(0,-1),LIGHT_BG),("VALIGN",(0,0),(-1,-1),"MIDDLE"),("TOPPADDING",(0,0),(-1,-1),4),("BOTTOMPADDING",(0,0),(-1,-1),4),("LEFTPADDING",(0,0),(-1,-1),8)]))
story.append(lt)
story.append(Spacer(1, 0.4*cm))
story.append(P("Tangkapan Layar Antarmuka (10 Mockup)", s_h2))
story.append(Spacer(1, 0.2*cm))

# Mockups: 1 per page, image LEFT (8cm) + description RIGHT (7.5cm)
mockups = [
    ("01-beranda.png", "1. Beranda", "Hero section dengan statistik real-time dan quick access cards.", ["Statistik: 10 bahasa, 20 tradisi", "128.5M penutur terdata", "5 quick access cards ke fitur", "Bottom tab navigation 5 menu"]),
    ("02-peta-bahasa.png", "2. Peta Bahasa", "Grid 10 bahasa dengan filter vitality status.", ["Filter: Aman/Tertentu/Terancam", "4 bahasa TERANCAM highlight", "Card per bahasa dengan stats", "Search by province"]),
    ("03-language-detail.png", "3. Detail Bahasa", "Dialog detail bahasa dengan tradisi & modul.", ["Daftar tradisi lisan", "Modul belajar tersedia", "Rekaman audio penutur asli", "Info vitality & penutur"]),
    ("04-studio-rekam.png", "4. Studio Rekam", "Audio recorder dengan Whisper ASR.", ["Tombol mic besar", "Waveform visualizer", "Form metadata penutur", "Auto-transkripsi AI"]),
    ("05-studio-form-turnstile.png", "5. Form + Turnstile", "Cloudflare Turnstile anti-bot protection.", ["Verifikasi keamanan", "Server-side validation", "Input length limits", "UU PDP 27/2022 compliance"]),
    ("06-belajar-modul.png", "6. Modul Belajar", "8 modul pembelajaran adaptif.", ["Progress tracking per device", "Level A1/A2/B1", "5 bahasa: Sunda/Jawa/Bali/Minang/Bugis", "TTS pelafalan audio"]),
    ("07-lesson-player.png", "7. Pemutar Pelajaran", "Dialog pelajaran dengan frasa & TTS.", ["Frasa bahasa daerah", "Terjemahan Indonesia", "TTS pelafalan MeloTTS", "Progress dots indicator"]),
    ("08-tutor-ai.png", "8. Tutor AI", "Chat dengan Llama 3.1 dalam bahasa daerah.", ["Reply dalam bahasa daerah", "Auto-terjemahan [ID:]", "TTS playback per pesan", "Session tracking"]),
    ("09-arsip-tradisi.png", "9. Arsip Tradisi", "Gallery 20 tradisi lisan Nusantara.", ["Filter by type & bahasa", "5 jenis: pantun/mantra/nyanyian/cerita/peribahasa", "7 daerah Nusantara", "Card dengan teks asli"]),
    ("10-tradisi-detail.png", "10. Detail Tradisi", "Dialog detail tradisi dengan makna budaya.", ["Teks asli bahasa daerah", "Terjemahan Indonesia", "Makna & konteks budaya", "Link ke bahasa terkait"]),
]

for img_file, caption, desc, features in mockups:
    img_path = os.path.join(MOCKUPS_DIR, img_file)
    if not os.path.exists(img_path):
        continue
    # Image: 13cm wide (large & readable), cap height at 16cm
    from PIL import Image as PILImage
    pil_img = PILImage.open(img_path)
    img_w, img_h = pil_img.size
    aspect = img_h / img_w
    display_w = 9*cm
    display_h = display_w * aspect
    if display_h > 18*cm:
        ratio = 18*cm / display_h
        display_w *= ratio
        display_h = 18*cm
    img = Image(img_path, width=display_w, height=display_h)
    
    # Description below image
    feat_items = [P(f"• {f}", s_feat) for f in features]
    layout = Table([[img], [P(caption, s_caption)], [P(desc, s_desc)], [P("Fitur: " + " · ".join(features), s_feat)]], colWidths=[15.5*cm])
    layout.setStyle(TableStyle([
        ("VALIGN", (0,0), (-1,-1), "TOP"),
        ("ALIGN", (0,0), (-1,-1), "CENTER"),
        ("TOPPADDING", (0,0), (-1,-1), 2),
        ("BOTTOMPADDING", (0,0), (-1,-1), 2),
    ]))
    story.append(KeepTogether([layout, Spacer(1, 0.5*cm)]))

story.append(PageBreak())

# SECTION B
story.append(P("B. Video Showcase", s_section))
story.append(P("Video showcase berdurasi 4 menit 9 detik (sesuai syarat Juknis 3-5 menit) yang menunjukkan kegunaan dan manfaat produk WARISAN SUARA bagi pengguna, pelaku budaya, komunitas, dan masyarakat.", s_body))
story.append(Spacer(1, 0.3*cm))

vid = [
    [P("YouTube", s_th), P("https://youtu.be/UrVE7wZEo2U", s_tc)],
    [P("Durasi", s_th), P("4:09 menit (syarat Juknis: 3-5 menit)", s_tc)],
    [P("Narasi", s_th), P("Bahasa Indonesia, suara laki-laki dewasa professional", s_tc)],
    [P("Resolusi", s_th), P("1280x720 (16:9), H.264 + AAC, 4.6 MB", s_tc)],
    [P("Scene", s_th), P("16 scene + outro dengan 10 mockup aplikasi", s_tc)],
]
vt = Table(vid, colWidths=[3*cm, 12.5*cm])
vt.setStyle(TableStyle([("GRID",(0,0),(-1,-1),0.5,HexColor("#ddd")),("BACKGROUND",(0,0),(0,-1),LIGHT_BG),("VALIGN",(0,0),(-1,-1),"MIDDLE"),("TOPPADDING",(0,0),(-1,-1),4),("BOTTOMPADDING",(0,0),(-1,-1),4),("LEFTPADDING",(0,0),(-1,-1),8)]))
story.append(vt)
story.append(Spacer(1, 0.3*cm))
story.append(P("Akses Video Showcase: youtu.be/UrVE7wZEo2U", s_yt))
story.append(Spacer(1, 0.2*cm))

# 6 poin konten
story.append(P("Konten Video (6 Poin sesuai Juknis)", s_h2))
content_data = [
    [P("No", s_th), P("Poin Konten", s_th), P("Scene", s_th)],
    [P("1", s_tc), P("Pengenalan Produk: Nama, konsep, fungsi utama, unsur kebudayaan", s_tc), P("1-3", s_tc)],
    [P("2", s_tc), P("Demonstrasi Produk: Peragaan cara kerja, fitur, proses penggunaan", s_tc), P("4-13", s_tc)],
    [P("3", s_tc), P("Kegunaan dan Manfaat: Nilai guna bagi pengguna, pelaku budaya, masyarakat", s_tc), P("4, 9, 11", s_tc)],
    [P("4", s_tc), P("Keunikan dan Nilai Tambah: Keunggulan dibanding solusi sejenis", s_tc), P("7-8, 15", s_tc)],
    [P("5", s_tc), P("Bukti Penggunaan: Dokumentasi uji coba, tanggapan pengguna", s_tc), P("6, 10, 13", s_tc)],
    [P("6", s_tc), P("Potensi Pengembangan: Keberlanjutan, pasar, Cultural Power", s_tc), P("14, 16", s_tc)],
]
ct2 = Table(content_data, colWidths=[1*cm, 12*cm, 2.5*cm])
ct2.setStyle(TableStyle([("GRID",(0,0),(-1,-1),0.5,HexColor("#ddd")),("BACKGROUND",(0,0),(-1,0),TERRACOTTA),("VALIGN",(0,0),(-1,-1),"MIDDLE"),("ALIGN",(0,0),(0,-1),"CENTER"),("ALIGN",(2,0),(2,-1),"CENTER"),("TOPPADDING",(0,0),(-1,-1),4),("BOTTOMPADDING",(0,0),(-1,-1),4)]))
story.append(ct2)
story.append(PageBreak())

# SECTION C
story.append(P("C. Slide Deck Presentasi", s_section))
story.append(P("Slide deck presentasi berisi 10 slide (format 16:9 widescreen) untuk mendukung Proposal Produk. Slide deck dipersiapkan untuk peserta yang lolos seleksi ke 20 besar finalis yang akan dipaparkan pada saat Showcase.", s_body))
story.append(Spacer(1, 0.3*cm))

si = [
    [P("Format", s_th), P("PDF 16:9 widescreen (1280x720)", s_tc)],
    [P("Jumlah", s_th), P("10 slide", s_tc)],
    [P("Palette", s_th), P("Batik earthy (terracotta, gold, maroon, cream)", s_tc)],
    [P("File", s_th), P("Slide-Deck-Warisan-Suara-BUDAYAGO2026.pdf (820 KB)", s_tc)],
]
st = Table(si, colWidths=[3*cm, 12.5*cm])
st.setStyle(TableStyle([("GRID",(0,0),(-1,-1),0.5,HexColor("#ddd")),("BACKGROUND",(0,0),(0,-1),LIGHT_BG),("VALIGN",(0,0),(-1,-1),"MIDDLE"),("TOPPADDING",(0,0),(-1,-1),4),("BOTTOMPADDING",(0,0),(-1,-1),4),("LEFTPADDING",(0,0),(-1,-1),8)]))
story.append(st)
story.append(Spacer(1, 0.3*cm))

# 10 slide content
story.append(P("Konten 10 Slide (sesuai Juknis)", s_h2))
sp = [
    [P("Slide", s_th), P("Judul", s_th), P("Konten", s_th)],
    [P("1", s_tc), P("Title", s_tc), P("WARISAN SUARA, tim, BUDAYA GO! 2026", s_tc)],
    [P("2", s_tc), P("Latar Belakang", s_tc), P("700+ bahasa, 25% terancam, 4 TERANCAM", s_tc)],
    [P("3", s_tc), P("Penyelesaian", s_tc), P("Existing gap + roadmap rencana", s_tc)],
    [P("4", s_tc), P("Unsur Kebudayaan", s_tc), P("3 Objek Pemajuan (tradisi, manuskrip, bahasa)", s_tc)],
    [P("5", s_tc), P("Solusi", s_tc), P("5 fitur dengan mockup aplikasi", s_tc)],
    [P("6", s_tc), P("Sasaran", s_tc), P("B2G/B2B/B2C, 128.5M penutur", s_tc)],
    [P("7", s_tc), P("Keunikan", s_tc), P("AI Whisper, Cloudflare, Turnstile", s_tc)],
    [P("8", s_tc), P("Dampak", s_tc), P("Live, 10 bahasa, 20 tradisi, 8 modul", s_tc)],
    [P("9", s_tc), P("Model Bisnis", s_tc), P("BMC 9 elemen + timeline 5 tahun", s_tc)],
    [P("10", s_tc), P("Penutup", s_tc), P("Cultural Power + kontak + YouTube", s_tc)],
]
spt = Table(sp, colWidths=[1.2*cm, 3.5*cm, 10.8*cm])
spt.setStyle(TableStyle([("GRID",(0,0),(-1,-1),0.5,HexColor("#ddd")),("BACKGROUND",(0,0),(-1,0),TERRACOTTA),("VALIGN",(0,0),(-1,-1),"MIDDLE"),("ALIGN",(0,0),(0,-1),"CENTER"),("TOPPADDING",(0,0),(-1,-1),4),("BOTTOMPADDING",(0,0),(-1,-1),4),("LEFTPADDING",(0,0),(-1,-1),6)]))
story.append(spt)
story.append(Spacer(1, 0.4*cm))

# Slide previews: 2 per page at 8cm wide (large & readable)
story.append(P("Preview 10 Slide", s_h2))
slide_files = sorted([f for f in os.listdir(SLIDES_DIR) if f.endswith(".png")])
for i in range(0, len(slide_files), 2):
    row = []
    for j in range(2):
        if i+j < len(slide_files):
            img_path = os.path.join(SLIDES_DIR, slide_files[i+j])
            if os.path.exists(img_path):
                img = Image(img_path, width=7.5*cm, height=7.5*cm*9/16)
                row.append([img, P(f"Slide {i+j+1}", s_caption)])
            else:
                row.append([""])
        else:
            row.append([""])
    sp_table = Table([row], colWidths=[7.75*cm, 7.75*cm])
    sp_table.setStyle(TableStyle([("VALIGN",(0,0),(-1,-1),"TOP"),("ALIGN",(0,0),(-1,-1),"CENTER"),("TOPPADDING",(0,0),(-1,-1),4),("BOTTOMPADDING",(0,0),(-1,-1),4)]))
    story.append(KeepTogether([sp_table, Spacer(1, 0.2*cm)]))

doc.build(story)
print(f"✓ Lampiran 2 v3: {OUT}")
print(f"  Size: {os.path.getsize(OUT)//1024} KB")
