#!/usr/bin/env python3
"""Generate Lampiran 2: Bukti Produk dan Materi Presentasi PDF"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm, mm
from reportlab.lib.colors import HexColor
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Image, PageBreak,
    Table, TableStyle, KeepTogether
)
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.pdfgen import canvas
import os

OUT = "/home/z/my-project/download/Lampiran-2-Bukti-Produk-Materi-Presentasi.pdf"
MOCKUPS_DIR = "/home/z/my-project/download/mockups"
SLIDES_DIR = "/tmp/slide-images"

# Colors (batik earthy palette)
TERRACOTTA = HexColor("#a85c32")
GOLD = HexColor("#c89545")
MAROON = HexColor("#7a3a28")
CREAM = HexColor("#fdf8ef")
DARK = HexColor("#2a1f18")

# Styles
styles = getSampleStyleSheet()

style_title = ParagraphStyle(
    "CustomTitle", parent=styles["Title"],
    fontName="Helvetica-Bold", fontSize=20, textColor=TERRACOTTA,
    alignment=TA_CENTER, spaceAfter=12, spaceBefore=20
)
style_subtitle = ParagraphStyle(
    "Subtitle", parent=styles["Normal"],
    fontName="Helvetica", fontSize=12, textColor=MAROON,
    alignment=TA_CENTER, spaceAfter=20
)
style_h1 = ParagraphStyle(
    "H1", parent=styles["Heading1"],
    fontName="Helvetica-Bold", fontSize=16, textColor=TERRACOTTA,
    spaceAfter=10, spaceBefore=20, borderWidth=0,
    borderPadding=5, borderColor=TERRACOTTA
)
style_h2 = ParagraphStyle(
    "H2", parent=styles["Heading2"],
    fontName="Helvetica-Bold", fontSize=13, textColor=MAROON,
    spaceAfter=8, spaceBefore=14
)
style_body = ParagraphStyle(
    "Body", parent=styles["Normal"],
    fontName="Helvetica", fontSize=11, textColor=DARK,
    alignment=TA_JUSTIFY, spaceAfter=8, leading=16,
    firstLineIndent=12
)
style_caption = ParagraphStyle(
    "Caption", parent=styles["Normal"],
    fontName="Helvetica-Oblique", fontSize=9, textColor=MAROON,
    alignment=TA_CENTER, spaceAfter=12, spaceBefore=4
)
style_link = ParagraphStyle(
    "Link", parent=styles["Normal"],
    fontName="Courier", fontSize=10, textColor=TERRACOTTA,
    alignment=TA_LEFT, spaceAfter=6, leftIndent=20
)

# Page numbering
def add_page_number(canvas, doc):
    canvas.saveState()
    canvas.setFont("Helvetica", 9)
    canvas.setFillColor(MAROON)
    canvas.drawRightString(A4[0] - 2*cm, 1.5*cm, f"Halaman {doc.page}")
    canvas.drawString(2*cm, 1.5*cm, "WARISAN SUARA · Lampiran 2 · BUDAYA GO! 2026")
    # Top accent line
    canvas.setStrokeColor(TERRACOTTA)
    canvas.setLineWidth(2)
    canvas.line(2*cm, A4[1] - 1.5*cm, A4[0] - 2*cm, A4[1] - 1.5*cm)
    canvas.restoreState()

# Build document
doc = SimpleDocTemplate(
    OUT, pagesize=A4,
    topMargin=2.5*cm, bottomMargin=2.5*cm,
    leftMargin=2.5*cm, rightMargin=2.5*cm,
    title="Lampiran 2 - Bukti Produk dan Materi Presentasi - WARISAN SUARA",
    author="Febri Rizki, S.Si., M.Si.",
    subject="BUDAYA GO! 2026"
)

story = []

# === COVER / HEADER ===
story.append(Spacer(1, 3*cm))
story.append(Paragraph("LAMPIRAN 2", style_title))
story.append(Paragraph("Bukti Produk dan Materi Presentasi", style_subtitle))
story.append(Spacer(1, 1*cm))

# Product info box
info_data = [
    ["Produk", "WARISAN SUARA"],
    ["Kategori", "Inovasi Digital"],
    ["Sub-tema", "#4 Pembelajaran dan Edukasi Digital Berbasis Budaya"],
    ["Tim", "Febri Rizki (Pengembangan Produk), Oki Handinata (Kebudayaan), Martha Martinni (Ekonomi)"],
    ["Email", "hyperchain.project@gmail.com"],
    ["Live Demo", "https://warisan-suara.pages.dev"],
    ["Source Code", "https://github.com/hyperchainpro/Warisan-Suara"],
    ["Video Showcase", "https://youtu.be/UrVE7wZEo2U"],
]
info_table = Table(info_data, colWidths=[4*cm, 12*cm])
info_table.setStyle(TableStyle([
    ("FONTNAME", (0,0), (0,-1), "Helvetica-Bold"),
    ("FONTNAME", (1,0), (1,-1), "Helvetica"),
    ("FONTSIZE", (0,0), (-1,-1), 10),
    ("TEXTCOLOR", (0,0), (0,-1), TERRACOTTA),
    ("TEXTCOLOR", (1,0), (1,-1), DARK),
    ("ALIGN", (0,0), (-1,-1), "LEFT"),
    ("VALIGN", (0,0), (-1,-1), "TOP"),
    ("GRID", (0,0), (-1,-1), 0.5, HexColor("#dddddd")),
    ("BACKGROUND", (0,0), (0,-1), HexColor("#f8f0e8")),
    ("TOPPADDING", (0,0), (-1,-1), 6),
    ("BOTTOMPADDING", (0,0), (-1,-1), 6),
    ("LEFTPADDING", (0,0), (-1,-1), 8),
    ("RIGHTPADDING", (0,0), (-1,-1), 8),
]))
story.append(info_table)
story.append(PageBreak())

# === SECTION A: BUKTI PRODUK ===
story.append(Paragraph("A. Bukti Produk Inovasi Digital", style_h1))
story.append(Paragraph(
    "Berikut adalah bukti keberadaan, fungsi, dan potensi produk WARISAN SUARA berupa tangkapan layar antarmuka aplikasi mobile PWA, tautan demo live, dan dokumentasi source code.",
    style_body
))
story.append(Spacer(1, 0.5*cm))

# Demo links
story.append(Paragraph("Tautan Produk", style_h2))
links_data = [
    ["Live Demo", "https://warisan-suara.pages.dev"],
    ["Source Code (GitHub)", "https://github.com/hyperchainpro/Warisan-Suara"],
    ["API Health Check", "https://warisan-suara.pages.dev/api/health"],
    ["Cloudflare Pages", "warisan-suara.pages.dev (free tier)"],
]
links_table = Table(links_data, colWidths=[5*cm, 11*cm])
links_table.setStyle(TableStyle([
    ("FONTNAME", (0,0), (0,-1), "Helvetica-Bold"),
    ("FONTNAME", (1,0), (1,-1), "Courier"),
    ("FONTSIZE", (0,0), (-1,-1), 10),
    ("TEXTCOLOR", (0,0), (0,-1), TERRACOTTA),
    ("TEXTCOLOR", (1,0), (1,-1), MAROON),
    ("GRID", (0,0), (-1,-1), 0.5, HexColor("#dddddd")),
    ("TOPPADDING", (0,0), (-1,-1), 5),
    ("BOTTOMPADDING", (0,0), (-1,-1), 5),
    ("LEFTPADDING", (0,0), (-1,-1), 8),
]))
story.append(links_table)
story.append(Spacer(1, 0.8*cm))

# Mockup gallery
story.append(Paragraph("Tangkapan Layar Antarmuka Aplikasi (10 Mockup)", style_h2))
story.append(Paragraph(
    "Aplikasi WARISAN SUARA adalah PWA (Progressive Web App) dengan mobile-app style menggunakan 5-tab bottom navigation (Beranda, Bahasa, Rekam, Belajar, Arsip). Berikut tangkapan layar dari berbagai fitur:",
    style_body
))
story.append(Spacer(1, 0.5*cm))

mockups = [
    ("01-beranda.png", "Gambar 1: Beranda", "Hero section dengan statistik (10 bahasa, 20 tradisi, 128.5M penutur) dan quick access cards ke semua fitur."),
    ("02-peta-bahasa.png", "Gambar 2: Peta Bahasa Daerah", "Grid 10 bahasa dengan filter vitality status (Aman, Tertentu, Terancam, Kritis, Hampir Punah)."),
    ("03-language-detail.png", "Gambar 3: Detail Bahasa", "Dialog detail bahasa menampilkan tradisi lisan, modul belajar, dan rekaman audio tersedia."),
    ("04-studio-rekam.png", "Gambar 4: Studio Rekam", "Audio recorder dengan tombol mic, visualizer waveform, dan metadata form penutur."),
    ("05-studio-form-turnstile.png", "Gambar 5: Form Upload + Turnstile", "Cloudflare Turnstile anti-bot protection pada form upload rekaman."),
    ("06-belajar-modul.png", "Gambar 6: Modul Belajar", "Daftar 8 modul pembelajaran adaptif dengan progress tracking per bahasa."),
    ("07-lesson-player.png", "Gambar 7: Pemutar Pelajaran", "Dialog pemutar pelajaran dengan frasa bahasa daerah, terjemahan, TTS pelafalan."),
    ("08-tutor-ai.png", "Gambar 8: Tutor AI Percakapan", "Chat interface dengan AI Llama 3.1 dalam bahasa Sunda/Jawa/Bali + terjemahan otomatis."),
    ("09-arsip-tradisi.png", "Gambar 9: Arsip Tradisi Lisan", "Gallery 20 tradisi lisan (pantun, mantra, nyanyian, cerita rakyat, peribahasa) dengan filter."),
    ("10-tradisi-detail.png", "Gambar 10: Detail Tradisi", "Dialog detail tradisi dengan teks asli bahasa daerah, terjemahan, dan makna konteks budaya."),
]

for img_file, caption, desc in mockups:
    img_path = os.path.join(MOCKUPS_DIR, img_file)
    if os.path.exists(img_path):
        # Scale image to fit page width (max 14cm)
        img = Image(img_path, width=14*cm, height=14*cm * 844/390)  # mobile aspect ratio
        # Cap height at 12cm
        if img.drawHeight > 12*cm:
            ratio = 12*cm / img.drawHeight
            img.drawWidth *= ratio
            img.drawHeight = 12*cm
        story.append(KeepTogether([
            img,
            Paragraph(f"<b>{caption}</b>", style_caption),
            Paragraph(desc, style_body),
            Spacer(1, 0.5*cm)
        ]))

story.append(PageBreak())

# === SECTION B: VIDEO SHOWCASE ===
story.append(Paragraph("B. Video Showcase", style_h1))
story.append(Paragraph(
    "Video showcase berdurasi 4 menit 9 detik (sesuai syarat Juknis 3-5 menit) yang menunjukkan kegunaan dan manfaat produk WARISAN SUARA bagi pengguna, pelaku budaya, komunitas, dan masyarakat.",
    style_body
))
story.append(Spacer(1, 0.5*cm))

# Video info
vid_data = [
    ["Judul Video", "WARISAN SUARA - Platform AI Pelestarian Bahasa & Tradisi Lisan Nusantara"],
    ["Durasi", "4:09 menit (sesuai syarat 3-5 menit)"],
    ["YouTube URL", "https://youtu.be/UrVE7wZEo2U"],
    ["Narasi", "Bahasa Indonesia, suara laki-laki dewasa (professional)"],
    ["Resolusi", "1280x720 (16:9 widescreen)"],
    ["Format", "MP4 H.264 + AAC"],
    ["Jumlah Scene", "16 scene + outro"],
]
vid_table = Table(vid_data, colWidths=[4*cm, 12*cm])
vid_table.setStyle(TableStyle([
    ("FONTNAME", (0,0), (0,-1), "Helvetica-Bold"),
    ("FONTNAME", (1,0), (1,-1), "Helvetica"),
    ("FONTSIZE", (0,0), (-1,-1), 10),
    ("TEXTCOLOR", (0,0), (0,-1), TERRACOTTA),
    ("TEXTCOLOR", (1,0), (1,-1), DARK),
    ("GRID", (0,0), (-1,-1), 0.5, HexColor("#dddddd")),
    ("BACKGROUND", (0,0), (0,-1), HexColor("#f8f0e8")),
    ("TOPPADDING", (0,0), (-1,-1), 5),
    ("BOTTOMPADDING", (0,0), (-1,-1), 5),
    ("LEFTPADDING", (0,0), (-1,-1), 8),
]))
story.append(vid_table)
story.append(Spacer(1, 0.8*cm))

# Video content (6 poin per Juknis)
story.append(Paragraph("Konten Video (6 Poin sesuai Juknis)", style_h2))
content_data = [
    ["No", "Poin Konten", "Scene"],
    ["1", "Pengenalan Produk: Nama, konsep, fungsi utama, unsur kebudayaan", "Scene 1-3"],
    ["2", "Demonstrasi Produk: Peragaan cara kerja, fitur, proses penggunaan", "Scene 4-13"],
    ["3", "Kegunaan dan Manfaat: Nilai guna bagi pengguna, pelaku budaya, masyarakat", "Scene 4, 9, 11"],
    ["4", "Keunikan dan Nilai Tambah: Keunggulan dibanding solusi sejenis", "Scene 7-8, 15"],
    ["5", "Bukti Penggunaan/Pengujian: Dokumentasi uji coba, tanggapan pengguna", "Scene 6, 10, 13"],
    ["6", "Potensi Pengembangan: Keberlanjutan, pengembangan pasar, Cultural Power", "Scene 14, 16"],
]
content_table = Table(content_data, colWidths=[1*cm, 11*cm, 3*cm])
content_table.setStyle(TableStyle([
    ("FONTNAME", (0,0), (-1,0), "Helvetica-Bold"),
    ("FONTNAME", (0,1), (-1,-1), "Helvetica"),
    ("FONTSIZE", (0,0), (-1,-1), 10),
    ("TEXTCOLOR", (0,0), (-1,0), CREAM),
    ("BACKGROUND", (0,0), (-1,0), TERRACOTTA),
    ("TEXTCOLOR", (0,1), (-1,-1), DARK),
    ("ALIGN", (0,0), (0,-1), "CENTER"),
    ("ALIGN", (2,0), (2,-1), "CENTER"),
    ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
    ("GRID", (0,0), (-1,-1), 0.5, HexColor("#dddddd")),
    ("TOPPADDING", (0,0), (-1,-1), 5),
    ("BOTTOMPADDING", (0,0), (-1,-1), 5),
    ("LEFTPADDING", (0,0), (-1,-1), 6),
]))
story.append(content_table)
story.append(Spacer(1, 0.5*cm))

# YouTube link prominent
story.append(Paragraph(
    '<b>Link Video Showcase:</b> <font color="#a85c32">https://youtu.be/UrVE7wZEo2U</font>',
    ParagraphStyle("YTLink", parent=style_body, fontSize=12, alignment=TA_CENTER,
                   spaceBefore=10, spaceAfter=10, firstLineIndent=0)
))
story.append(PageBreak())

# === SECTION C: SLIDE DECK PPT ===
story.append(Paragraph("C. Slide Deck Presentasi", style_h1))
story.append(Paragraph(
    "Slide deck presentasi berisi 10 slide (format 16:9 widescreen) untuk mendukung Proposal Produk. Slide deck dipersiapkan untuk peserta yang lolos seleksi administrasi dan substansi ke 20 besar finalis yang akan dipaparkan pada saat Showcase.",
    style_body
))
story.append(Spacer(1, 0.5*cm))

# Slide deck info
slide_info = [
    ["Format", "PDF (16:9 widescreen, 1280x720)"],
    ["Jumlah Slide", "10 slide"],
    ["File", "Slide-Deck-Warisan-Suara-BUDAYAGO2026.pdf"],
    ["Tema Visual", "Batik earthy palette (terracotta, gold, maroon, cream)"],
]
slide_table = Table(slide_info, colWidths=[4*cm, 12*cm])
slide_table.setStyle(TableStyle([
    ("FONTNAME", (0,0), (0,-1), "Helvetica-Bold"),
    ("FONTNAME", (1,0), (1,-1), "Helvetica"),
    ("FONTSIZE", (0,0), (-1,-1), 10),
    ("TEXTCOLOR", (0,0), (0,-1), TERRACOTTA),
    ("TEXTCOLOR", (1,0), (1,-1), DARK),
    ("GRID", (0,0), (-1,-1), 0.5, HexColor("#dddddd")),
    ("BACKGROUND", (0,0), (0,-1), HexColor("#f8f0e8")),
    ("TOPPADDING", (0,0), (-1,-1), 5),
    ("BOTTOMPADDING", (0,0), (-1,-1), 5),
    ("LEFTPADDING", (0,0), (-1,-1), 8),
]))
story.append(slide_table)
story.append(Spacer(1, 0.8*cm))

# 10 slide content points (per Juknis)
story.append(Paragraph("Konten 10 Slide (sesuai Juknis Lampiran 2 poin C)", style_h2))
slide_points = [
    ["Slide 1: Title Slide", "Judul WARISAN SUARA, tim, BUDAYA GO! 2026"],
    ["Slide 2: Latar Belakang", "700+ bahasa, 25% terancam, 4 bahasa TERANCAM"],
    ["Slide 3: Penyelesaian", "Existing solutions gap + roadmap rencana"],
    ["Slide 4: Unsur Kebudayaan", "3 Objek Pemajuan (tradisi lisan, manuskrip, bahasa)"],
    ["Slide 5: Solusi & Cara Kerja", "5 fitur utama dengan mockup aplikasi"],
    ["Slide 6: Sasaran Pengguna", "B2G/B2B/B2C, 128.5M penutur terdata"],
    ["Slide 7: Keunikan", "AI Whisper, Cloudflare edge, anti-bot Turnstile"],
    ["Slide 8: Dampak & Kondisi", "Prototype live, 10 bahasa, 20 tradisi, 8 modul"],
    ["Slide 9: Model Bisnis & Roadmap", "BMC 9 elemen + timeline 5 tahun"],
    ["Slide 10: Penutup", "Visi Cultural Power + kontak + YouTube link"],
]
points_table = Table(slide_points, colWidths=[5*cm, 11*cm])
points_table.setStyle(TableStyle([
    ("FONTNAME", (0,0), (0,-1), "Helvetica-Bold"),
    ("FONTNAME", (1,0), (1,-1), "Helvetica"),
    ("FONTSIZE", (0,0), (-1,-1), 10),
    ("TEXTCOLOR", (0,0), (0,-1), TERRACOTTA),
    ("TEXTCOLOR", (1,0), (1,-1), DARK),
    ("GRID", (0,0), (-1,-1), 0.5, HexColor("#dddddd")),
    ("TOPPADDING", (0,0), (-1,-1), 5),
    ("BOTTOMPADDING", (0,0), (-1,-1), 5),
    ("LEFTPADDING", (0,0), (-1,-1), 8),
]))
story.append(points_table)
story.append(Spacer(1, 0.8*cm))

# Embed all 10 slides as images
story.append(Paragraph("Preview 10 Slide", style_h2))
slide_files = sorted([f for f in os.listdir(SLIDES_DIR) if f.endswith(".png")])
for i, sf in enumerate(slide_files, 1):
    img_path = os.path.join(SLIDES_DIR, sf)
    if os.path.exists(img_path):
        img = Image(img_path, width=16*cm, height=16*cm * 9/16)  # 16:9
        story.append(KeepTogether([
            img,
            Paragraph(f"<b>Slide {i}</b>", style_caption),
            Spacer(1, 0.3*cm)
        ]))

# Build
doc.build(story, onFirstPage=add_page_number, onLaterPages=add_page_number)
print(f"✓ Lampiran 2 PDF created: {OUT}")
print(f"  Size: {os.path.getsize(OUT)//1024} KB")
