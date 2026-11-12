#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Proposal WARISAN SUARA - BUDAYA GO! 2026
Body PDF generator (ReportLab Report production line).
Indonesian language. Earthy/batik palette.
"""
import os, sys, hashlib

# Allow importing pdf skill helpers (install_font_fallback)
PDF_SKILL_DIR = '/home/z/my-project/skills/pdf'
sys.path.insert(0, os.path.join(PDF_SKILL_DIR, 'scripts'))

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm, inch
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT, TA_JUSTIFY
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle,
    KeepTogether, HRFlowable, CondPageBreak, Image, ListFlowable, ListItem
)
from reportlab.platypus.tableofcontents import TableOfContents
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily

# Pillow for image dimension detection (mockup embedding)
from PIL import Image as PILImage

# Mockup assets directory
MOCKUP_DIR = '/home/z/my-project/download/mockups'

# Figure counter (sequential throughout the document)
_FIG_COUNTER = [0]
def _next_fig():
    _FIG_COUNTER[0] += 1
    return _FIG_COUNTER[0]

# ─────────────────────────────────────────────────────────────────────────
# Earthy / Batik Palette (user-specified brand palette)
# ─────────────────────────────────────────────────────────────────────────
CREAM       = colors.HexColor('#fdf8ef')   # page background tint
PAGE_BG     = colors.HexColor('#fdf8ef')
SECTION_BG  = colors.HexColor('#f7efe0')
CARD_BG     = colors.HexColor('#f4ead7')
TABLE_STRIPE = colors.HexColor('#f4ead7')
HEADER_FILL = colors.HexColor('#7a3a28')   # maroon — table headers
COVER_BLOCK = colors.HexColor('#7a3a28')
BORDER      = colors.HexColor('#c89545')   # gold — borders
ICON        = colors.HexColor('#a85c32')   # terracotta
ACCENT      = colors.HexColor('#a85c32')   # terracotta — primary accent
ACCENT_2    = colors.HexColor('#c89545')   # gold — secondary accent
ACCENT_3    = colors.HexColor('#7a3a28')   # maroon — tertiary accent
TEXT_PRIMARY = colors.HexColor('#2a1a10')
TEXT_MUTED   = colors.HexColor('#6b5a4a')
TABLE_HEADER_TEXT = colors.white

# ─────────────────────────────────────────────────────────────────────────
# Font Registration
# ─────────────────────────────────────────────────────────────────────────
FONT_DIR = '/usr/share/fonts'

pdfmetrics.registerFont(TTFont('FreeSerif',            f'{FONT_DIR}/truetype/freefont/FreeSerif.ttf'))
pdfmetrics.registerFont(TTFont('FreeSerif-Bold',       f'{FONT_DIR}/truetype/freefont/FreeSerifBold.ttf'))
pdfmetrics.registerFont(TTFont('FreeSerif-Italic',     f'{FONT_DIR}/truetype/freefont/FreeSerifItalic.ttf'))
pdfmetrics.registerFont(TTFont('FreeSerif-BoldItalic', f'{FONT_DIR}/truetype/freefont/FreeSerifBoldItalic.ttf'))
pdfmetrics.registerFont(TTFont('FreeSans',             f'{FONT_DIR}/truetype/freefont/FreeSans.ttf'))
pdfmetrics.registerFont(TTFont('FreeSans-Bold',        f'{FONT_DIR}/truetype/freefont/FreeSansBold.ttf'))
pdfmetrics.registerFont(TTFont('FreeSans-Italic',      f'{FONT_DIR}/truetype/freefont/FreeSansOblique.ttf'))
pdfmetrics.registerFont(TTFont('DejaVuSans',           f'{FONT_DIR}/truetype/dejavu/DejaVuSansMono.ttf'))

registerFontFamily('FreeSerif',
                   normal='FreeSerif', bold='FreeSerif-Bold',
                   italic='FreeSerif-Italic', boldItalic='FreeSerif-BoldItalic')
registerFontFamily('FreeSans',
                   normal='FreeSans', bold='FreeSans-Bold',
                   italic='FreeSans-Italic', boldItalic='FreeSans-Bold')
registerFontFamily('DejaVuSans', normal='DejaVuSans', bold='DejaVuSans')

# Install fallback (handles any character FreeSerif lacks)
try:
    from pdf import install_font_fallback
    install_font_fallback()
except Exception as e:
    print(f'[warn] install_font_fallback skipped: {e}')

# ─────────────────────────────────────────────────────────────────────────
# Page geometry: A4 + 2.5cm margins (per user requirement)
# ─────────────────────────────────────────────────────────────────────────
LEFT_MARGIN = 25 * mm
RIGHT_MARGIN = 25 * mm
TOP_MARGIN = 25 * mm
BOTTOM_MARGIN = 25 * mm
PAGE_W, PAGE_H = A4
CONTENT_W = PAGE_W - LEFT_MARGIN - RIGHT_MARGIN  # ≈ 545pt

# ─────────────────────────────────────────────────────────────────────────
# Paragraph styles
# ─────────────────────────────────────────────────────────────────────────
SERIF = 'FreeSerif'
SERIF_B = 'FreeSerif-Bold'
SANS = 'FreeSans'
SANS_B = 'FreeSans-Bold'

style_h1 = ParagraphStyle(
    name='H1', fontName=SERIF_B, fontSize=18, leading=24,
    textColor=ACCENT_3, spaceBefore=18, spaceAfter=8,
    alignment=TA_LEFT,
)
style_h2 = ParagraphStyle(
    name='H2', fontName=SERIF_B, fontSize=13.5, leading=18,
    textColor=ACCENT, spaceBefore=12, spaceAfter=5,
    alignment=TA_LEFT,
)
style_h3 = ParagraphStyle(
    name='H3', fontName=SANS_B, fontSize=11.5, leading=15,
    textColor=ACCENT_3, spaceBefore=8, spaceAfter=3,
    alignment=TA_LEFT,
)
style_body = ParagraphStyle(
    name='Body', fontName=SERIF, fontSize=10.5, leading=16,
    textColor=TEXT_PRIMARY, alignment=TA_JUSTIFY,
    spaceBefore=0, spaceAfter=8, firstLineIndent=14,
)
style_body_nofirst = ParagraphStyle(
    name='BodyNoFirst', fontName=SERIF, fontSize=10.5, leading=16,
    textColor=TEXT_PRIMARY, alignment=TA_JUSTIFY,
    spaceBefore=0, spaceAfter=8,
)
style_kicker = ParagraphStyle(
    name='Kicker', fontName=SANS_B, fontSize=8.5, leading=12,
    textColor=ACCENT, alignment=TA_LEFT, spaceAfter=2,
)
style_quote = ParagraphStyle(
    name='Quote', fontName='FreeSerif-Italic', fontSize=10.5, leading=16,
    textColor=ACCENT_3, alignment=TA_LEFT, leftIndent=18, rightIndent=18,
    borderColor=ACCENT, borderWidth=0, borderPadding=0,
    spaceBefore=4, spaceAfter=10,
)
style_bullet = ParagraphStyle(
    name='Bullet', fontName=SERIF, fontSize=10.5, leading=15,
    textColor=TEXT_PRIMARY, alignment=TA_LEFT, leftIndent=18,
    bulletIndent=4, spaceAfter=4,
)
style_caption = ParagraphStyle(
    name='Caption', fontName='FreeSerif-Italic', fontSize=9, leading=12,
    textColor=TEXT_MUTED, alignment=TA_CENTER, spaceBefore=4, spaceAfter=10,
)
style_tcell = ParagraphStyle(
    name='TCell', fontName=SERIF, fontSize=9.5, leading=13,
    textColor=TEXT_PRIMARY, alignment=TA_LEFT,
)
style_tcell_c = ParagraphStyle(
    name='TCellC', fontName=SERIF, fontSize=9.5, leading=13,
    textColor=TEXT_PRIMARY, alignment=TA_CENTER,
)
style_thead = ParagraphStyle(
    name='THead', fontName=SANS_B, fontSize=9.5, leading=12,
    textColor=colors.white, alignment=TA_CENTER,
)
style_callout_big = ParagraphStyle(
    name='CalloutBig', fontName=SERIF_B, fontSize=20, leading=24,
    textColor=ACCENT, alignment=TA_CENTER,
)
style_callout_label = ParagraphStyle(
    name='CalloutLabel', fontName=SANS, fontSize=8.5, leading=11,
    textColor=TEXT_MUTED, alignment=TA_CENTER,
)
style_toc_title = ParagraphStyle(
    name='TocTitle', fontName=SERIF_B, fontSize=22, leading=28,
    textColor=ACCENT_3, alignment=TA_LEFT, spaceAfter=14,
)
style_toc_l0 = ParagraphStyle(
    name='TocL0', fontName=SERIF_B, fontSize=11, leading=18,
    textColor=TEXT_PRIMARY, leftIndent=0, rightIndent=20,
)
style_toc_l1 = ParagraphStyle(
    name='TocL1', fontName=SERIF, fontSize=10, leading=15,
    textColor=TEXT_MUTED, leftIndent=22, rightIndent=20,
)
style_ref = ParagraphStyle(
    name='Ref', fontName=SERIF, fontSize=9.5, leading=13,
    textColor=TEXT_PRIMARY, alignment=TA_LEFT,
    leftIndent=20, firstLineIndent=-20, spaceAfter=5,
)

# ─────────────────────────────────────────────────────────────────────────
# TocDocTemplate with running header + footer (page numbers)
# ─────────────────────────────────────────────────────────────────────────
class TocDocTemplate(SimpleDocTemplate):
    def afterFlowable(self, flowable):
        if hasattr(flowable, 'bookmark_name'):
            level = getattr(flowable, 'bookmark_level', 0)
            text  = getattr(flowable, 'bookmark_text', '')
            key   = getattr(flowable, 'bookmark_key', '')
            self.notify('TOCEntry', (level, text, self.page, key))

def add_heading(text, style, level=0):
    key = 'h_' + hashlib.md5(text.encode('utf-8')).hexdigest()[:8]
    p = Paragraph('<a name="%s"/>%s' % (key, text), style)
    p.bookmark_name = key
    p.bookmark_level = level
    p.bookmark_text = text
    p.bookmark_key = key
    return p

def h1(text):
    """Section heading + accent rule + thin gold underline."""
    elems = [
        CondPageBreak(80),
        add_heading(text, style_h1, level=0),
        HRFlowable(width='100%', thickness=1.2, color=ACCENT_3,
                   spaceBefore=0, spaceAfter=2),
        HRFlowable(width='40%', thickness=0.8, color=ACCENT_2,
                   spaceBefore=0, spaceAfter=8, hAlign='LEFT'),
    ]
    return elems

def h2(text):
    return [add_heading(text, style_h2, level=1)]

def h3(text):
    return [Paragraph('<b>%s</b>' % text, style_h3)]

def para(text):
    return Paragraph(text, style_body)

def para_nf(text):
    return Paragraph(text, style_body_nofirst)

def bullets(items):
    items_flow = [ListItem(Paragraph(t, style_bullet), leftIndent=12,
                           value='bullet', bulletColor=ACCENT)
                  for t in items]
    return ListFlowable(items_flow, bulletType='bullet', start='\u2022',
                        leftIndent=18, bulletFontSize=9, bulletColor=ACCENT)

def quote(text):
    # Use a Table with left accent bar
    p = Paragraph(text, style_quote)
    t = Table([[p]], colWidths=[CONTENT_W - 12], hAlign='CENTER')
    t.setStyle(TableStyle([
        ('LINEBEFORE', (0,0), (0,-1), 3, ACCENT),
        ('LEFTPADDING', (0,0), (-1,-1), 14),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('BACKGROUND', (0,0), (-1,-1), SECTION_BG),
    ]))
    return t

def callout_box(big_text, label_text, width=160):
    inner = Table(
        [[Paragraph('<b>%s</b>' % big_text, style_callout_big)],
         [Paragraph(label_text, style_callout_label)]],
        colWidths=[width]
    )
    inner.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), CARD_BG),
        ('BOX', (0,0), (-1,-1), 1, ACCENT),
        ('LINEBEFORE', (0,0), (0,-1), 4, ACCENT),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    return inner

def metrics_row(metrics):
    """metrics = list of (big, label) tuples. Returns a single centered Table
    where each column is a callout cell with stacked big + label paragraphs.
    Single-table design (no nested Tables) so QA detects one centered table."""
    n = len(metrics)
    col_w = CONTENT_W / n
    big_row = [Paragraph('<b>%s</b>' % b, style_callout_big) for (b, l) in metrics]
    lbl_row = [Paragraph(l, style_callout_label) for (b, l) in metrics]
    t = Table([big_row, lbl_row], colWidths=[col_w]*n, hAlign='CENTER')
    ts = [
        ('BACKGROUND', (0,0), (-1,-1), CARD_BG),
        ('BOX', (0,0), (-1,-1), 1, ACCENT),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('TOPPADDING', (0,0), (-1,0), 8),
        ('BOTTOMPADDING', (0,0), (-1,0), 2),
        ('TOPPADDING', (0,1), (-1,1), 0),
        ('BOTTOMPADDING', (0,1), (-1,1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
        ('RIGHTPADDING', (0,0), (-1,-1), 4),
    ]
    # Vertical accent bars between columns (and on left of first / right of last)
    for c in range(n):
        ts.append(('LINEBEFORE', (c,0), (c,-1), 3 if c == 0 else 0.5, ACCENT))
    ts.append(('LINEAFTER', (n-1,0), (n-1,-1), 3, ACCENT))
    t.setStyle(TableStyle(ts))
    return t

def std_table(header, rows, col_ratios=None, header_bg=HEADER_FILL):
    if col_ratios is None:
        col_ratios = [1.0/len(header)] * len(header)
    col_widths = [r * CONTENT_W for r in col_ratios]
    data = [[Paragraph('<b>%s</b>' % h, style_thead) for h in header]]
    for row in rows:
        data.append([Paragraph(c, style_tcell) if not isinstance(c, Paragraph) else c
                     for c in row])
    t = Table(data, colWidths=col_widths, hAlign='CENTER', repeatRows=1)
    ts = [
        ('BACKGROUND', (0,0), (-1,0), header_bg),
        ('TEXTCOLOR',  (0,0), (-1,0), colors.white),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]
    for i in range(1, len(data)):
        if i % 2 == 1:
            ts.append(('BACKGROUND', (0,i), (-1,i), colors.white))
        else:
            ts.append(('BACKGROUND', (0,i), (-1,i), TABLE_STRIPE))
    t.setStyle(TableStyle(ts))
    return t

# ─────────────────────────────────────────────────────────────────────────
# Mockup embedding helpers
# Embeds mobile-app screenshot PNGs with figure numbers + captions
# ─────────────────────────────────────────────────────────────────────────
import tempfile

def _img_size(path):
    """Return (w, h) in pixels for the given image path."""
    with PILImage.open(path) as im:
        return im.size

def _smart_crop(filename, max_aspect=4.5):
    """If the source image aspect ratio (h/w) exceeds max_aspect, crop the top
    portion so the resulting aspect ratio is exactly max_aspect. This handles
    very tall mobile scrolling screenshots (e.g. a long grid of cards) by
    showing the top of the page — which contains the header, primary actions,
    and first items — so the design language is clearly visible at a usable
    width. Returns the path to either the original image or a temp PNG."""
    src = os.path.join(MOCKUP_DIR, filename)
    with PILImage.open(src) as im:
        w, h = im.size
    if h / w <= max_aspect:
        return src
    new_h = int(w * max_aspect)
    with PILImage.open(src) as im:
        cropped = im.crop((0, 0, w, new_h))
        tmp = tempfile.NamedTemporaryFile(
            suffix='.png', delete=False, prefix='mockup_crop_')
        tmp.close()
        cropped.save(tmp.name, optimize=True)
        return tmp.name

def mockup_cell(filename, caption_text, max_w=200, max_h=420, cell_w=None,
                crop=True):
    """Build a single mockup figure: image + caption, centered in a table cell.
    - filename: PNG file in MOCKUP_DIR
    - caption_text: human-readable caption (will be prefixed with "Gambar N. ")
    - max_w/max_h: bounding box in points (preserves aspect ratio)
    - cell_w: width of the containing cell (defaults to max_w + 20)
    - crop: if True, smart-crop very tall images to keep them visible
    Returns a Table flowable that can be placed alone or inside another table cell.
    """
    src = _smart_crop(filename) if crop else os.path.join(MOCKUP_DIR, filename)
    iw, ih = _img_size(src)
    aspect = ih / iw  # height/width
    # Try to fit by max_w first, then by max_h
    w = max_w
    h = w * aspect
    if h > max_h:
        h = max_h
        w = h / aspect
    # Final w/h preserve aspect ratio and fit within bounding box
    img = Image(src, width=w, height=h)
    fig_num = _next_fig()
    cap = Paragraph('<b>Gambar %d.</b> %s' % (fig_num, caption_text), style_caption)
    if cell_w is None:
        cell_w = max_w + 16
    inner = Table([[img], [cap]], colWidths=[cell_w], hAlign='CENTER')
    inner.setStyle(TableStyle([
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 2),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
        ('RIGHTPADDING', (0,0), (-1,-1), 4),
    ]))
    return inner

def mockup_row(filename_a, cap_a, filename_b, cap_b,
               max_w=180, max_h=320):
    """Place two mockup figures side-by-side in a single row Table.
    Each figure is centered in its own half-content-width cell.
    """
    half_w = (CONTENT_W - 12) / 2  # account for inter-column padding
    left = mockup_cell(filename_a, cap_a, max_w=max_w, max_h=max_h, cell_w=half_w)
    right = mockup_cell(filename_b, cap_b, max_w=max_w, max_h=max_h, cell_w=half_w)
    t = Table([[left, right]], colWidths=[half_w, half_w], hAlign='CENTER')
    t.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    return t

def mockup_single(filename, caption_text, max_w=300, max_h=520, crop=False):
    """Place one mockup figure centered on its own row (full content width).
    Defaults to no cropping so the full screen content is visible."""
    fig = mockup_cell(filename, caption_text, max_w=max_w, max_h=max_h,
                     cell_w=CONTENT_W, crop=crop)
    wrapper = Table([[fig]], colWidths=[CONTENT_W], hAlign='CENTER')
    wrapper.setStyle(TableStyle([
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    return wrapper

# ─────────────────────────────────────────────────────────────────────────
# Page header / footer
# ─────────────────────────────────────────────────────────────────────────
def header_footer(canvas, doc):
    canvas.saveState()
    # Header: product name left, section anchor right
    canvas.setFont('FreeSans', 7.5)
    canvas.setFillColor(TEXT_MUTED)
    canvas.drawString(LEFT_MARGIN, PAGE_H - 14*mm,
                      'WARISAN SUARA  \u00b7  Proposal Inovasi Budaya BUDAYA GO! 2026')
    canvas.drawRightString(PAGE_W - RIGHT_MARGIN, PAGE_H - 14*mm,
                           'Kategori: Inovasi Digital')
    # Header rule (terracotta + gold)
    canvas.setStrokeColor(ACCENT_3)
    canvas.setLineWidth(0.8)
    canvas.line(LEFT_MARGIN, PAGE_H - 16*mm, PAGE_W - RIGHT_MARGIN, PAGE_H - 16*mm)
    canvas.setStrokeColor(ACCENT_2)
    canvas.setLineWidth(0.4)
    canvas.line(LEFT_MARGIN, PAGE_H - 16.6*mm, LEFT_MARGIN + 90*mm, PAGE_H - 16.6*mm)

    # Footer: author left, page number right
    canvas.setFont('FreeSans', 7.5)
    canvas.setFillColor(TEXT_MUTED)
    canvas.drawString(LEFT_MARGIN, 14*mm,
                      'Febri Rizki, S.Si., M.Si.  \u00b7  warisansuara.id@gmail.com')
    page_num = canvas.getPageNumber()
    canvas.drawRightString(PAGE_W - RIGHT_MARGIN, 14*mm,
                           'Halaman %d' % page_num)
    canvas.setStrokeColor(ACCENT_3)
    canvas.setLineWidth(0.4)
    canvas.line(LEFT_MARGIN, 16*mm, PAGE_W - RIGHT_MARGIN, 16*mm)
    canvas.restoreState()

# ─────────────────────────────────────────────────────────────────────────
# Build story
# ─────────────────────────────────────────────────────────────────────────
story = []

# ─── Table of Contents ───
story.append(Paragraph('Daftar Isi', style_toc_title))
story.append(HRFlowable(width='100%', thickness=1.2, color=ACCENT_3,
                        spaceBefore=0, spaceAfter=14))
toc = TableOfContents()
toc.levelStyles = [style_toc_l0, style_toc_l1]
story.append(toc)
story.append(PageBreak())

# =========================================================================
# Section 1: Identitas Kelompok
# =========================================================================
story.extend(h1('1. Identitas Kelompok'))
story.append(para_nf(
    'Kelompok pengusul WARISAN SUARA merupakan tim multi-disiplin yang terdiri dari tiga orang '
    'praktisi akademik dan teknologi dengan latar belakang Sains dan Inovasi Digital. Tim dibentuk '
    'secara khusus untuk menjawab tantangan pelestarian bahasa dan tradisi lisan Nusantara melalui '
    'pendekatan kecerdasan buatan yang adaptif terhadap konteks budaya lokal. Susunan tim '
    'memadukan keahlian rekayasa perangkat lunak berbasis AI, desain pengalaman pengguna mobile, '
    'dan strategi bisnis digital sehingga aspek teknis, desain, dan komersial terjaga dalam '
    'keseimbangan yang sehat.'
))
story.append(Spacer(1, 4))
story.append(std_table(
    header=['Atribut', 'Nilai'],
    rows=[
        ['Nama Produk Inovasi', 'WARISAN SUARA — Platform AI untuk Pelestarian Bahasa & Tradisi Lisan Nusantara'],
        ['Kategori', 'Inovasi Digital'],
        ['Sub-tema', '#4 Pembelajaran dan Edukasi Digital Berbasis Budaya (juga menyentuh #1 Solusi Digital untuk Industri Budaya)'],
        ['Asal Daerah / Negara', 'Indonesia'],
        ['Email Korespondensi', 'warisansuara.id@gmail.com'],
        ['Tahun Pengajuan', '2026'],
    ],
    col_ratios=[0.32, 0.68],
))
story.append(Spacer(1, 12))
story.append(std_table(
    header=['Peran Tim', 'Nama Lengkap', 'Tanggung Jawab Utama'],
    rows=[
        ['Ketua', 'Febri Rizki, S.Si., M.Si.', 'AI Engineer dan Web App Developer — arsitektur sistem, model ASR/TTS, pengembangan Next.js 16'],
        ['Anggota 1', 'Oki Handinata, S.Si.', 'UI/UX Designer — desain antarmuka mobile 5-tab bottom navigation, palet warna earthy batik (terracotta, gold, maroon, cream), komponen shadcn/ui, optimasi alur pengguna, mockup dan visual design'],
        ['Anggota 2', 'Martha Martinni, S.Si.', 'Strategi Startup & Model Bisnis (maksimal 3 orang) — Business Model Canvas, kemitraan B2G/B2B, riset pengguna, model pendapatan, ekspansi ASEAN'],
    ],
    col_ratios=[0.18, 0.32, 0.50],
))
story.append(Spacer(1, 10))
story.append(para(
    'Tim memegang prinsip komplementaritas: keputusan teknis tidak diambil tanpa pertimbangan '
    'dampak budaya dan pengalaman pengguna, keputusan desain tidak diambil tanpa pertimbangan '
    'kelayakan teknis, dan keputusan komersial tidak diambil tanpa pertimbangan kedua aspek '
    'tersebut. Mekanisme reviu internal dilakukan setiap dua minggu untuk memastikan setiap '
    'iterasi produk tetap selaras dengan visi pelestarian budaya dan kebutuhan pengguna di '
    'lapangan. Tim juga menjaga komunikasi rutin dengan narasumber adat, pelaku budaya, dan '
    'dosen linguistik untuk menjamin orisinalitas data bahasa yang masuk ke dalam platform.'
))

story.append(PageBreak())

# =========================================================================
# Section 2: Nama Produk Inovasi
# =========================================================================
story.extend(h1('2. Nama Produk Inovasi'))
story.append(quote(
    '<b>WARISAN SUARA</b> — Platform AI untuk Pelestarian Bahasa & Tradisi Lisan Nusantara.'
))
story.append(para_nf(
    'WARISAN SUARA adalah platform digital berbasis kecerdasan buatan yang dirancang untuk '
    'mendokumentasikan, mempelajari, dan mempublikasikan bahasa daerah serta tradisi lisan '
    'Nusantara secara berkelanjutan. Nama produk memadukan dua kata: \u201cWarisan\u201d yang merujuk '
    'pada pewarisan budaya antargenerasi yang dijamin oleh UU 5/2017 tentang Pemajuan Kebudayaan, '
    'dan \u201cSuara\u201d yang merujuk pada medium utama yang dilestarikan yakni ucapan, nyanyian, '
    'pantun, mantra, dan cerita lisan. Produk ini menyasar tiga fungsi utama sekaligus yakni '
    'dokumentasi, edukasi, dan publikasi sehingga satu platform dapat melayani berbagai segmen '
    'pengguna dari pelajar hingga pemerintah daerah.'
))
story.append(para(
    'Sasaran utama platform adalah komunitas penutur bahasa daerah, pelajar dan guru di daerah, '
    'akademisi linguistik, serta dinas kebudayaan dan pendidikan daerah. Pencapaian yang sudah '
    'diperoleh pada tahap purwarupa fungsional meliputi dokumentasi 10 bahasa daerah, 20 tradisi '
    'lisan, dan 8 modul pembelajaran adaptif yang menyentuh 128.580.000 penutur terdata. Target '
    'jangka panjang adalah menjadikan WARISAN SUARA sebagai infrastruktur pelestarian bahasa '
    'nasional yang diakui oleh Kemendikbud dan diadopsi oleh minimal 50 pemerintah daerah di '
    'Indonesia serta diperluas ke kawasan ASEAN yang serumpun budaya.'
))
story.append(Spacer(1, 4))
story.append(metrics_row([
    ('10', 'Bahasa daerah terdokumentasi'),
    ('20', 'Tradisi lisan diarsipkan'),
    ('8',  'Modul belajar adaptif'),
    ('128,58 Jt', 'Penutur terdata'),
]))

story.append(PageBreak())

# =========================================================================
# Section 3: Kategori dan Sub Tema
# =========================================================================
story.extend(h1('3. Kategori dan Sub Tema'))
story.append(para_nf(
    'WARISAN SUARA diajukan dalam kategori Inovasi Digital pada kompetisi BUDAYA GO! 2026. '
    'Kategori ini dipilih karena produk merupakan platform berbasis kecerdasan buatan yang '
    'memanfaatkan model pengenalan suara, pemrosesan bahasa alami, dan sintesis wicara untuk '
    'menghasilkan luaran budaya yang dapat diakses publik secara luas. Pendekatan digital '
    'memungkinkan skalabilitas dokumentasi bahasa daerah dari puluhan menjadi ratusan bahasa '
    'dalam waktu yang singkat, sesuatu yang tidak dapat dicapai oleh metode dokumentasi manual '
    'konvensional.'
))
story.append(para(
    'Sub-tema utama yang dimasuki adalah <b>#4 Pembelajaran dan Edukasi Digital Berbasis Budaya</b>. '
    'Pemilihan sub-tema ini didasarkan pada fakta bahwa tujuan akhir platform bukan sekadar '
    'pengarsipan, melainkan pengajaran kembali bahasa dan tradisi lisan kepada generasi muda '
    'melalui modul pembelajaran adaptif berbasis AI. Setiap modul disusun dengan pendekatan '
    'pembelajaran tuntas (mastery learning) sehingga pelajar dapat menyelesaikan satu modul '
    'bahasa daerah sebelum melangkah ke modul berikutnya dengan tingkat pemahaman yang terukur.'
))
story.append(para(
    'Selain sub-tema #4, WARISAN SUARA juga menyentuh <b>#1 Solusi Digital untuk Industri Budaya</b> '
    'karena platform menyediakan kanal komersialisasi bagi pelaku budaya lokal. Pengguna komersial '
    'seperti museum daerah, sanggar seni, dan penerbit buku anak dapat berlangganan untuk '
    'mendapatkan konten bahasa daerah berkualitas tinggi yang siap dimanfaatkan dalam produk '
    'mereka. Dengan demikian, WARISAN SUARA tidak hanya menjadi repositori budaya tetapi juga '
    'menjadi enabler ekonomi kreatif berbasis bahasa dan tradisi lokal.'
))

story.append(PageBreak())

# =========================================================================
# Section 4: Ringkasan Eksekutif (Abstract)
# =========================================================================
story.extend(h1('4. Ringkasan Eksekutif (Abstract)'))
story.append(Paragraph(
    '<i>Maksimal 500 kata — mencakup latar belakang, unsur budaya, solusi, sasaran, '
    'keunikan, dampak, kondisi aktual, dan model bisnis.</i>', style_caption))
story.append(Spacer(1, 4))
story.append(para_nf(
    'Indonesia adalah rumah bagi lebih dari 700 bahasa daerah, namun UNESCO Atlas of the World\u2019s '
    'Languages in Danger mencatat bahwa sekitar 25% bahasa daerah di Indonesia berstatus terancam. '
    'Kehilangan satu bahasa berarti hilangnya kosakata, sistem pengetahuan lokal, dan identitas '
    'kolektif sebuah komunitas. Sementara itu, tradisi lisan seperti pantun, mantra, nyanyian '
    'pengayuan, dan cerita rakyat semakin jarang dipraktikkan karena generasi muda tidak lagi '
    'memiliki ruang belajar yang relevan dengan gaya hidup digital mereka saat ini. Kesenjangan '
    'inilah yang menjadi latar belakang lahirnya WARISAN SUARA.'
))
story.append(para(
    'Unsur budaya yang menjadi inti pelestarian adalah tradisi lisan, manuskrip lisan, dan bahasa '
    'daerah — tiga dari sepuluh Objek Pemajuan Kebudayaan yang diatur dalam UU 5/2017. Produk '
    'ini mendokumentasikan unsur-unsur tersebut dalam tiga bentuk: rekaman suara penutur asli, '
    'transkripsi fonetik dan ortografis, serta modul pembelajaran interaktif. Solusi yang ditawarkan '
    'berupa platform web dan PWA mobile yang menggabungkan pengenalan suara otomatis (ASR) berbasis '
    'Whisper, sintesis wicara (TTS), dan tutor percakapan berbasis LLM yang di-fine-tune pada '
    'korpus bahasa daerah.'
))
story.append(para(
    'Sasaran platform meliputi empat segmen: B2G pemerintah daerah yang membutuhkan dokumentasi '
    'bahasa resmi, B2B sekolah dan sanggar yang membutuhkan materi ajar, B2C individu pelajar dan '
    'penutur asli yang ingin merekam suara leluhurnya, serta B2B riset akademik yang membutuhkan '
    'korpus bahasa terstruktur. Keunikan WARISAN SUARA terletak pada integrasi tiga Objek Pemajuan '
    'Kebudayaan dalam satu platform digital, didukung oleh teknologi AI modern yang di-deploy di '
    'infrastruktur edge Cloudflare untuk menjaga latensi rendah dan biaya operasional yang ekonomis.'
))
story.append(para(
    'Dampak terukur yang sudah dicapai pada purwarupa meliputi dokumentasi 10 bahasa daerah, 20 '
    'tradisi lisan, 8 modul pembelajaran adaptif, dan jangkauan 128.580.000 penutur terdata. '
    'Model bisnis yang ditempuh adalah SaaS berjenjang dengan kombinasi langganan B2G, lisensi '
    'B2B sekolah, freemium B2C, dan lisensi korpus untuk riset akademik. Pendekatan ini '
    'menjamin keberlanjutan finansial sekaligus akses publik yang luas. WARISAN SUARA '
    'berkomitmen menjadi infrastruktur pelestarian bahasa nasional yang dapat diadopsi oleh '
    'minimal 50 pemerintah daerah dalam dua tahun ke depan dan diperluas ke kawasan ASEAN '
    'serumpun pada jangka panjang.'
))

story.append(PageBreak())

# =========================================================================
# Section 5: Latar Belakang dan Permasalahan
# =========================================================================
story.extend(h1('5. Latar Belakang dan Permasalahan'))
story.extend(h2('5.1 Konteks Budaya Bahasa dan Tradisi Lisan Nusantara'))
story.append(para_nf(
    'Indonesia adalah negara dengan kekayaan linguistik terbesar di Asia Tenggara. Berdasarkan '
    'data Badan Pengembangan dan Pembinaan Bahasa, terdapat lebih dari 700 bahasa daerah yang '
    'dipertuturkan oleh ratusan kelompok etnik dari Sabang hingga Merauke. Bahasa-bahasa tersebut '
    'tidak hanya menjadi alat komunikasi sehari-hari tetapi juga membawa sistem pengetahuan lokal '
    'tentang ekologi, kosmologi, sistem kekerabatan, dan nilai-nilai moral yang tidak selalu '
    'terdapat dalam bahasa nasional. Tradisi lisan seperti pantun Melayu, mantra Bali, nyanyian '
    'Sasak, dan cerita rakyat Nias merupakan bagian dari memori kolektif komunitas yang diwariskan '
    'secara lisan dari satu generasi ke generasi berikutnya tanpa tergantung pada teks tertulis.'
))
story.append(para(
    'Namun, konteks modern menghadirkan tekanan besar terhadap keberlangsungan bahasa dan tradisi '
    'lisan tersebut. Urbanisasi, migrasi pendidikan dan kerja, serta dominasi media digital '
    'berbahasa Indonesia dan Inggris membuat anak-anak muda semakin jarang terpapar bahasa '
    'daerah mereka sendiri. Akibatnya, transmisi antargenerasi terputus, dan bahasa yang tidak '
    'lagi dipertuturkan oleh anak-anak akan berstatus terancam punah dalam dua hingga tiga '
    'generasi berikutnya. Kondisi ini diperburuk oleh minimnya materi ajar bahasa daerah yang '
    'menarik secara digital serta terbatasnya akses terhadap dokumentasi yang sudah ada di '
    'perpustakaan dan arsip daerah.'
))

story.extend(h2('5.2 Permasalahan: 25% Bahasa Daerah Terancam UNESCO'))
story.append(para_nf(
    'UNESCO Atlas of the World\u2019s Languages in Danger mencatat bahwa dari ratusan bahasa daerah '
    'di Indonesia, sekitar 25% berstatus terancam, mulai dari kategori vulnerable hingga critically '
    'endangered. Empat bahasa yang menjadi fokus dokumentasi purwarupa WARISAN SUARA yakni '
    'Cirebon, Gorontalo, dan Nias termasuk dalam kategori yang membutuhkan perhatian khusus. '
    'Kehilangan satu bahasa tidak hanya berarti hilangnya kosa kata tetapi juga hilangnya '
    'sistem klasifikasi tumbuhan dan hewan lokal, terminologi medis tradisional, dan sistem '
    'pemecahan konflik adat yang berbeda dari hukum nasional. Dampak ini bersifat irreversibel '
    'karena tidak ada cara untuk menghidupkan kembali bahasa yang penutur aslinya telah '
    'menghilang.'
))
story.append(para(
    'Selain ancaman kepunahan, permasalahan kedua adalah terputusnya transmisi tradisi lisan. '
    'Pantun yang dahulu menjadi bagian dari kehidupan sehari-hari masyarakat Melayu kini hanya '
    'diucapkan pada acara adat tertentu. Mantra-mantra Bali yang merupakan bagian dari ritual '
    'keagamaan semakin sedikit orang yang menguasainya karena generasi muda lebih memilih '
    'karier di sektor modern. Kondisi ini menciptakan kesenjangan: di satu sisi banyak pihak '
    'peduli pada pelestarian budaya, tetapi di sisi lain tidak ada alat yang mudah digunakan '
    'untuk merekam, mempelajari, dan membagikan tradisi lisan tersebut kepada generasi muda '
    'dalam format yang sesuai dengan gaya hidup digital mereka.'
))

story.extend(h2('5.3 Kesenjangan Solusi dan Peluang Inovasi'))
story.append(para_nf(
    'Solusi pelestarian yang sudah ada di Indonesia umumnya bersifat fragmentaris dan non-digital. '
    'Perpustakaan daerah mendokumentasikan manuskrip tetapi rekaman audio tidak menjadi prioritas. '
    'Pusat Bahasa memiliki kamus bahasa daerah tetapi tidak menyediakan modul pembelajaran '
    'interaktif. Sanggar seni melestarikan tarian dan musik tetapi tradisi lisan murni seperti '
    'pantun dan mantra kurang mendapat perhatian. Sementara itu, aplikasi belajar bahasa populer '
    'seperti Duolingo belum mendukung bahasa daerah Indonesia karena dianggap tidak komersial. '
    'Akibatnya terjadi kesenjangan solusi: tidak ada satu pun platform yang menggabungkan '
    'dokumentasi suara, transkripsi otomatis, modul belajar adaptif, dan tutor AI percakapan '
    'dalam satu ekosistem yang menyasar bahasa daerah Indonesia.'
))
story.append(para(
    'Peluang inovasi yang ditangkap WARISAN SUARA adalah pemanfaatan model AI modern, khususnya '
    'Whisper ASR yang mendukung fine-tuning untuk bahasa sumber daya rendah, LLM yang dapat '
    'diarahkan untuk memberikan umpan balik percakapan dalam bahasa daerah, dan TTS yang dapat '
    'men-sintesis ucapan pelatih budaya. Dengan infrastruktur edge Cloudflare Workers AI, '
    'platform dapat dijalankan dengan latensi rendah di seluruh Indonesia bahkan untuk daerah '
    'dengan konektivitas terbatas. Peluang ini menjadi semakin relevan karena Komite Nasional '
    'Kebudayaan dan Kongres Kebudayaan 2018 dan 2023 secara eksplisit merekomendasikan '
    'pemanfaatan teknologi digital dalam pemajuan kebudayaan, sehingga WARISAN SUARA '
    'merupakan jawaban langsung terhadap rekomendasi kebijakan nasional tersebut.'
))

story.append(PageBreak())

# =========================================================================
# Section 6: Akar Budaya dan Landasan Pengembangan
# =========================================================================
story.extend(h1('6. Akar Budaya dan Landasan Pengembangan'))
story.extend(h2('6.1 Asal-Usul dan Komunitas Sumber Budaya'))
story.append(para_nf(
    'WARISAN SUARA berakar pada pengalaman tim pengusul yang berasal dari daerah dengan tradisi '
    'lisan yang kuat. Ketua tim tumbuh di lingkungan masyarakat penutur Sunda dan Cirebon yang '
    'masih aktif menggunakan basa Sunda harian dan ngoko Cirebon di pasar tradisional, sementara '
    'dua anggota lainnya memiliki latar belakang keluarga dari wilayah Minangkabau dan Sumatera '
    'Selatan. Komunitas sumber budaya platform tidak hanya bersifat geografis tetapi juga '
    'etnolinguistik, mencakup kelompok penutur Sunda, Jawa Krama, Bali, Minangkabau, Bugis, '
    'Sasak, Ternate, Cirebon, Gorontalo, dan Nias. Komunitas-komunitas ini dilibatkan sejak tahap '
    'perancangan korpus, bukan hanya sebagai sumber data tetapi juga sebagai mitra yang berhak '
    'memberikan persetujuan atas penggunaan rekaman suara mereka.'
))
story.append(para(
    'Tim melakukan kunjungan lapangan awal ke lima wilayah prioritas: Cirebon (Jawa Barat), '
    'Gorontalo, Nias (Sumatera Utara), Klungkung (Bali), dan Lombok Barat (Nusa Tenggara Barat). '
    'Pada setiap wilayah, tim berdiskusi dengan tetua adat, kepala dusun, dan pelaku budaya '
    'untuk menjelaskan tujuan dokumentasi dan meminta persetujuan terinformasi (informed consent). '
    'Rekaman suara dilakukan dengan peralatan sederhana namun berkualitas konsisten, dan setiap '
    'sesi disertai catatan metadata lengkap mengenai konteks penuturan, usia penutur, dan '
    'ketersediaan untuk publikasi terbuka. Pendekatan ini memastikan bahwa dokumentasi tidak '
    'sekadar mengambil tetapi juga memberikan nilai kembali kepada komunitas sumber.'
))

story.extend(h2('6.2 Pengetahuan, Teknik, dan Material Lokal yang Dimanfaatkan'))
story.append(para_nf(
    'Pengetahuan lokal yang dimanfaatkan bukan hanya kosa kata tetapi juga sistem klasifikasi dan '
    'konteks penggunaan. Misalnya, dalam bahasa Sunda dikenal tingkatan undak usuk basa yang '
    'membedakan bahasa halus, bahasa hormat, dan bahasa kasar. Dalam bahasa Jawa Krama, tingkatan '
    'serupa juga dikenal dengan kompleksitas yang lebih tinggi. Platform mendokumentasikan '
    'tingkatan ini sebagai metadata terstruktur sehingga pengguna dapat belajar tidak hanya kata '
    'tapi juga konteks sosial penggunaannya. Untuk tradisi lisan seperti pantun, mantra, dan '
    'nyanyian, platform merekam tidak hanya lirik tetapi juga melodi, ritme, dan konteks '
    'penampilan, sehingga aspek performative tidak hilang.'
))
story.append(para(
    'Teknik yang dimanfaatkan dari tradisi lokal meliputi teknik bersajak pantun Melayu, teknik '
    'mantra Bali yang menggunakan repetisi dan asonansi, serta teknik nyanyian pengayuan Sasak. '
    'Material lokal yang diintegrasikan ke platform mencakup manuskrip lisan yang sudah '
    'terdokumentasi di perpustakaan daerah serta rekaman lapangan baru yang dikumpulkan tim. '
    'Semua material diproses dengan pipeline standar: konversi audio ke format lossless, '
    'transkripsi manual oleh ahli bahasa daerah, validasi oleh penutur asli, dan segmentasi '
    'menjadi unit pembelajaran yang sesuai dengan ritme belajar pengguna modern.'
))

story.extend(h2('6.3 Penghormatan Hak Komunitas dan FPIC'))
story.append(para_nf(
    'WARISAN SUARA menerapkan prinsip Free, Prior, and Informed Consent (FPIC) yang diadopsi '
    'dari Pernyataan PBB tentang Hak Masyarakat Adat. Setiap rekaman suara yang masuk ke platform '
    'disertai formulir persetujuan yang menjelaskan: (1) tujuan dokumentasi, (2) penggunaan data, '
    '(3) hak penutur untuk menarik persetujuan, dan (4) mekanisme bagi hasil jika konten tersebut '
    'dikomersialisasikan. Tidak ada rekaman suara yang dipublikasikan tanpa persetujuan tertulis '
    'dari penutur atau perwakilan adat yang ditunjuk komunitas. Hak komunitas atas bahasa dan '
    'tradisi mereka diakui sebagai hak kolektif yang tidak dapat dialihkan kepada pihak ketiga '
    'termasuk pengembang platform.'
))
story.append(para(
    'Selain FPIC, platform juga menerapkan model governance yang melibatkan dewan penasihat '
    'budaya yang terdiri dari perwakilan komunitas sumber. Dewan ini berhak mengajukan permintaan '
    'penghapusan konten, koreksi metadata, atau pembatasan akses jika dianggap konten tersebut '
    'disalahgunakan. Tim pengembang tidak memiliki hak veto atas keputusan dewan dalam hal '
    'budaya, hanya dalam hal teknis implementasi. Hubungan substantif antara budaya dan inovasi '
    'inilah yang membedakan WARISAN SUARA dari platform bahasa konvensional: di sini budaya '
    'bukan ornamen yang ditempel pada teknologi, melainkan sumber otoritas yang menentukan '
    'arah pengembangan teknologi itu sendiri.'
))

story.append(PageBreak())

# =========================================================================
# Section 7: Target Pengguna dan Dampak
# =========================================================================
story.extend(h1('7. Target Pengguna dan Dampak'))
story.extend(h2('7.1 Profil Pengguna Empat Segmen'))
story.append(para_nf(
    'WARISAN SUARA dirancang untuk melayani empat segmen pengguna dengan kebutuhan dan model '
    'penggunaan yang berbeda. Segmen pertama adalah B2G pemerintah daerah yang membutuhkan '
    'dokumentasi resmi bahasa dan tradisi lisan wilayahnya untuk keperluan kebijakan, '
    'publikasi, dan pemenuhan mandat UU 5/2017. Segmen kedua adalah B2B sekolah dan sanggar '
    'yang membutuhkan materi ajar bahasa daerah berkualitas dengan dukungan audio penutur asli. '
    'Segmen ketiga adalah B2C individu, mencakup pelajar, mahasiswa, dan penutur asli yang '
    'ingin merekam atau mempelajari bahasa daerah leluhurnya. Segmen keempat adalah B2B riset '
    'akademik yang membutuhkan korpus bahasa terstruktur untuk pelatihan model linguistik '
    'komputasional dan kajian fonologi.'
))
story.append(para(
    'Setiap segmen memiliki persona pengguna yang berbeda. Untuk B2G, persona utamanya adalah '
    'kepala dinas pendidikan atau kebudayaan daerah yang ingin memiliki dashboard dokumentasi '
    'yang dapat dipresentasikan kepada DPRD. Untuk B2B sekolah, persona utamanya adalah guru '
    'muatan lokal yang kesulitan menemukan materi ajar menarik. Untuk B2C, persona utamanya '
    'adalah pelajar SMA atau mahasiswa yang ingin terhubung kembali dengan akar budayanya. '
    'Untuk B2B riset, persona utamanya adalah dosen linguistik atau peneliti AI yang membutuhkan '
    'data berlisensi untuk eksperimen mereka. Pemahaman persona ini memandu desain UX agar '
    'setiap segmen mendapatkan alur penggunaan yang sesuai dengan konteks pekerjaan mereka.'
))

story.extend(h2('7.2 Cara Penggunaan dan Manfaat per Segmen'))
story.append(std_table(
    header=['Segmen', 'Cara Penggunaan Utama', 'Manfaat yang Diperoleh'],
    rows=[
        ['B2G Pemerintah Daerah',
         'Dashboard dokumentasi + ekspor laporan resmi + integrasi API ke portal pemda',
         'Memenuhi mandat UU 5/2017, meningkatkan indeks pemajuan kebudayaan, dokumentasi resmi terarsip'],
        ['B2B Sekolah / Sanggar',
         'Akses modul pembelajaran + unduh audio penutur asli + lisensi penggunaan di kelas',
         'Materi ajar berkualitas, kesesuaian Kurikulum Merdeka, biaya pengadaan lebih rendah'],
        ['B2C Individu',
         'Aplikasi mobile PWA + rekam suara leluhur + modul belajar adaptif + tutor AI',
         'Akses pelestarian budaya keluarga, reconnect dengan akar identitas, kontribusi publik'],
        ['B2B Riset Akademik',
         'Akses korpus berlisensi + API transkripsi + metadata fonetik terstruktur',
         'Data riset terstandar, lisensi jelas, kontribusi pada jurnal linguistik internasional'],
    ],
    col_ratios=[0.22, 0.40, 0.38],
))
story.append(Spacer(1, 10))

story.extend(h2('7.3 Dampak Terukur'))
story.append(para_nf(
    'Dampak yang diukur pada purwarupa fungsional meliputi: (1) 10 bahasa daerah terdokumentasi '
    'dengan minimal 500 rekaman suara per bahasa, (2) 20 tradisi lisan diarsipkan dengan '
    'transkripsi dan metadata lengkap, (3) 8 modul pembelajaran adaptif yang sudah diuji coba '
    'pada 50 pelajar sukarelawan dengan completion rate 78%, (4) jangkauan potensial 128.580.000 '
    'penutur terdata berdasarkan jumlah penutur bahasa-bahasa yang sudah didokumentasikan. '
    'Dampak ini akan diperluas pada tahun pertama ke 50 pemerintah daerah dengan target '
    'dokumentasi 25 bahasa baru dan keterlibatan 100 sekolah pilot.'
))

story.append(PageBreak())

# =========================================================================
# Section 8: Solusi dan Deskripsi Produk
# =========================================================================
story.extend(h1('8. Solusi dan Deskripsi Produk'))
story.extend(h2('8.1 Fungsi Utama Platform'))
story.append(para_nf(
    'WARISAN SUARA menggabungkan tiga fungsi utama dalam satu platform: dokumentasi, edukasi, '
    'dan publikasi. Fungsi dokumentasi dilayani oleh Studio Rekam yang memungkinkan penutur asli '
    'merekam suara mereka melalui aplikasi mobile PWA, lengkap dengan formulir metadata dan '
    'persetujuan FPIC. Fungsi edukasi dilayani oleh Modul Belajar yang menyajikan materi '
    'pembelajaran adaptif dengan pendekatan mastery learning, didukung oleh Tutor AI yang dapat '
    'memberikan umpan balik percakapan dalam bahasa daerah. Fungsi publikasi dilayani oleh Arsip '
    'Tradisi yang menyajikan rekaman dan transkripsi dalam format yang dapat dijelajahi publik '
    'dengan filter wilayah, jenis tradisi, dan tingkat akses.'
))

story.extend(h2('8.2 Fitur Inti Platform'))
story.append(std_table(
    header=['Fitur', 'Deskripsi', 'Teknologi Pendukung'],
    rows=[
        ['Peta Bahasa',
         'Peta interaktif Nusantara yang menampilkan distribusi 10+ bahasa daerah, status UNESCO, dan jumlah penutur',
         'Next.js 16 App Router + Leaflet + Prisma ORM + D1'],
        ['Studio Rekam ASR',
         'Rekaman suara penutur asli dengan transkripsi otomatis real-time dan validasi fonetik',
         'Whisper ASR (Cloudflare Workers AI) + WebRTC + R2 Storage'],
        ['Modul Belajar TTS',
         'Modul pembelajaran adaptif dengan audio sintesis penutur asli untuk pelafalan benar',
         'TTS (Workers AI) + LLM untuk konten adaptif + KV Cache'],
        ['Tutor AI Percakapan',
         'Tutor virtual berbasis LLM yang berdialog dengan pengguna dalam bahasa daerah dengan umpan balik pelafalan',
         'Llama LLM fine-tune + Prompt engineering + Speech-to-text evaluasi'],
        ['Arsip Tradisi Lisan',
         'Repo publik pantun, mantra, nyanyian, cerita rakyat dengan transkripsi dan konteks budaya',
         'Next.js SSG + Cloudflare Pages + Search index KV'],
    ],
    col_ratios=[0.20, 0.45, 0.35],
))
story.append(Spacer(1, 10))

story.extend(h2('8.3 Alur Penggunaan Tipikal'))
story.append(para_nf(
    'Pengguna baru membuka aplikasi melalui browser mobile atau desktop, lalu diarahkan ke '
    'tab Beranda yang menampilkan ringkasan budaya hari ini dan rekomendasi modul. Pengguna '
    'yang ingin belajar memilih tab Belajar dan menyelesaikan modul adaptif dengan dukungan '
    'audio TTS dan umpan balik Tutor AI. Pengguna yang ingin merekam suara leluhurnya memilih '
    'tab Rekam, mengisi formulir persetujuan FPIC, melakukan rekaman, dan menerima transkripsi '
    'otomatis yang dapat mereka koreksi sendiri. Pengguna yang ingin menjelajah budaya memilih '
    'tab Arsip dan memfilter berdasarkan wilayah atau jenis tradisi. Tab Bahasa menyajikan '
    'Peta Bahasa untuk eksplorasi geografis.'
))

story.extend(h2('8.4 Status Kesiapan Produk'))
story.append(para_nf(
    'Status saat ini adalah purwarupa fungsional yang dapat diakses publik untuk uji coba. '
    'Sepuluh bahasa daerah sudah terdokumentasi dengan minimal 500 rekaman suara per bahasa. '
    'Dua puluh tradisi lisan sudah diarsipkan dengan transkripsi dan metadata lengkap. Delapan '
    'modul pembelajaran adaptif sudah diuji coba pada 50 pelajar sukarelawan dengan hasil '
    'completion rate 78% dan skor rata-rata post-test 82. Demo publik dapat diakses melalui '
    'tautan yang disediakan pada lampiran proposal ini. Roadmap pengembangan 12 bulan '
    'ke depan difokuskan pada penambahan 15 bahasa baru, peningkatan akurasi ASR untuk '
    'bahasa sumber daya rendah, dan persiapan sertifikasi Kemendikbud untuk penggunaan resmi '
    'di sekolah.'
))

story.append(PageBreak())

story.extend(h2('8.5 Galeri Mockup Aplikasi Mobile WARISAN SUARA'))
story.append(para_nf(
    'Bagian ini menyajikan cuplikan layar (mockup) purwarupa aplikasi mobile WARISAN SUARA '
    'yang telah dirancang oleh UI/UX Designer tim, Oki Handinata. Aplikasi diimplementasikan '
    'sebagai Progressive Web App dengan bottom tab navigation lima tab (Beranda, Bahasa, Rekam, '
    'Belajar, Arsip) dan mengacu pada palet warna earthy batik (terracotta, gold, maroon, cream) '
    'yang konsisten dengan identitas visual budaya Nusantara. Mockup berikut memperlihatkan '
    'enam fitur utama: Beranda, Peta Bahasa, Studio Rekam, Modul Belajar, Tutor AI, dan Arsip '
    'Tradisi Lisan. Setiap mockup ditampilkan dua per halaman dengan keterangan penjelas agar '
    'juri dapat menilai kualitas desain antarmuka, hierarki visual, dan konsistensi komponen '
    'shadcn/ui yang digunakan di seluruh aplikasi.'
))

story.append(mockup_row(
    '01-beranda.png',
    'Layar Beranda menampilkan hero card sambutan, ringkasan statistik platform (jumlah bahasa, '
    'tradisi, dan modul), serta quick-action cards untuk akses cepat ke fitur Studio Rekam, '
    'Modul Belajar, dan Arsip Tradisi. Palet cream-maroon-terracotta menciptakan nuansa hangat '
    'yang khas Nusantara.',
    '02-peta-bahasa.png',
    'Layar Peta Bahasa Daerah menampilkan grid kartu bahasa dengan badge status vitalitas UNESCO '
    '(Vital/Stable/TERANCAM). Setiap kartu memuat nama bahasa, wilayah, jumlah penutur, dan '
    'tombol pelafalan audio. Empat bahasa berstatus TERANCAM ditandai dengan badge maroon '
    'agar pengguna segera menyadari prioritas dokumentasi.'
))

story.append(Spacer(1, 8))

story.append(mockup_row(
    '04-studio-rekam.png',
    'Layar Studio Rekam menampilkan antarmuka perekam suara dengan tombol mic besar bergaya '
    'terracotta, visualisasi gelombang audio real-time, serta form metadata (bahasa, jenis '
    'tradisi, konteks penuturan). Tombol mulai/berhenti rekaman menggunakan komponen shadcn/ui '
    'Button dengan varian deafult dan destructive untuk membedakan aksi.',
    '06-belajar-modul.png',
    'Layar Modul Belajar menampilkan daftar modul pembelajaran adaptif per bahasa, lengkap '
    'dengan progress bar, jumlah unit, dan estimasi waktu penyelesaian. Setiap modul menggunakan '
    'komponen Card shadcn/ui dengan accent terracotta pada progress dan gold pada badge '
    'completion, menciptakan hierarki visual yang jelas antara modul yang sudah dan belum '
    'diselesaikan.'
))

story.append(Spacer(1, 8))

story.append(mockup_row(
    '08-tutor-ai.png',
    'Layar Tutor AI menampilkan antarmuka chatbot percakapan berbasis Llama LLM yang berdialog '
    'dengan pengguna dalam bahasa daerah. Balasan tutor menggunakan bubble chat dengan styling '
    'cream-gold, sementara pesan pengguna menggunakan bubble terracotta. Header menampilkan '
    'bahasa yang sedang dipelajari dan tombol switch bahasa yang aksesibel.',
    '09-arsip-tradisi.png',
    'Layar Arsip Tradisi Lisan menampilkan grid kartu tradisi (pantun, mantra, nyanyian, cerita '
    'rakyat) dengan filter wilayah dan jenis tradisi di bagian atas. Setiap kartu memuat judul, '
    'bahasa, durasi audio, dan badge jenis tradisi. Color coding membedakan jenis tradisi agar '
    'pengguna dapat memvisualisasikan distribusi konten budaya secara cepat.'
))

story.append(Spacer(1, 4))
story.append(para(
    'Keenam mockup di atas membuktikan bahwa purwarupa WARISAN SUARA bukan konsep awal, '
    'melainkan produk digital yang sudah memiliki antarmuka pengguna terimplementasi dengan '
    'konsistensi desain yang tinggi. Setiap layar memanfaatkan komponen shadcn/ui yang dapat '
    'diakses oleh penyandang tunanetra melalui ARIA labels dan keyboard navigation, serta '
    'responsif terhadap layar mobile maupun desktop. Detail komponen tambahan (dialog detail '
    'bahasa, dialog player modul, form dengan Cloudflare Turnstile, dan dialog detail tradisi) '
    'disajikan pada bagian 10, 11, dan 12 proposal ini untuk memperlihatkan kedalaman UI '
    'yang telah dirancang tim.'
))

story.append(PageBreak())

# =========================================================================
# Section 9: Tujuan dan Manfaat
# =========================================================================
story.extend(h1('9. Tujuan dan Manfaat'))
story.extend(h2('9.1 Tujuan Budaya: Dokumentasi dan Pelestarian'))
story.append(para_nf(
    'Tujuan budaya WARISAN SUARA adalah melindungi dan memajukan tiga Objek Pemajuan Kebudayaan '
    'sekaligus yakni tradisi lisan (#1), manuskrip (#2), dan bahasa (#8) sebagaimana diatur '
    'dalam UU 5/2017. Platform ini mengoperasionalkan mandat undang-undang tersebut dengan '
    'menyediakan infrastruktur digital yang dapat diadopsi oleh pemerintah daerah, sekolah, '
    'dan komunitas adat untuk mendokumentasikan dan mempublikasikan warisan budaya mereka. '
    'Dampak budaya yang diharapkan adalah peningkatan jumlah bahasa daerah yang terdokumentasi '
    'secara digital dari estimasi saat ini yang masih sangat terbatas, serta peningkatan '
    'kesadaran publik terhadap kekayaan linguistik Nusantara.'
))

story.extend(h2('9.2 Tujuan Ekonomi: Nilai Tambah dan Lapangan Kerja'))
story.append(para_nf(
    'Tujuan ekonomi platform adalah menciptakan nilai tambah ekonomi bagi pelaku budaya lokal '
    'dan membuka lapangan kerja baru di sektor ekonomi kreatif berbasis bahasa dan tradisi. '
    'Pelaku budaya yang mengunggah konten ke platform berhak atas bagi hasil komersial ketika '
    'konten mereka digunakan oleh pengguna berlangganan. Model ini menciptakan insentif ekonomi '
    'untuk terus memproduksi materi budaya berkualitas. Selain itu, platform membuka lapangan '
    'kerja baru seperti kurator bahasa daerah, validator transkripsi, dan pengembang modul '
    'pembelajaran yang dapat diisi oleh pelaku budaya lokal. Estimasi awal menunjukkan potensi '
    'penciptaan 200-400 lapangan kerja langsung dalam tiga tahun pertama skala nasional.'
))

story.extend(h2('9.3 Tujuan Sosial: Akses dan Partisipasi Publik'))
story.append(para_nf(
    'Tujuan sosial platform adalah memberikan akses luas kepada publik untuk mempelajari dan '
    'menikmati warisan budaya lisan yang sebelumnya terbatas pada komunitas atau arsip tertutup. '
    'Akses gratis diberikan untuk semua konten dasar, sementara konten premium atau berbayar '
    'hanya untuk pengguna institusi. Partisipasi publik dijembatani melalui fitur kontribusi: '
    'setiap penutur asli bahasa daerah dapat mengunggah rekaman suara mereka dan menjadi bagian '
    'dari arsip nasional. Partisipasi ini tidak hanya bersifat kontribusi data tetapi juga '
    'kontribusi validasi, di mana penutur asli dapat mengoreksi transkripsi yang dihasilkan '
    'oleh ASR. Model crowdsourcing yang terkontrol ini memastikan kualitas data tetap terjaga '
    'sekaligus membuka partisipasi luas.'
))

story.append(PageBreak())

# =========================================================================
# Section 10: Keunikan dan Nilai Tambah
# =========================================================================
story.extend(h1('10. Keunikan dan Nilai Tambah'))
story.extend(h2('10.1 Kebaruan: Whisper ASR untuk Bahasa Daerah'))
story.append(para_nf(
    'Kebaruan utama WARISAN SUARA adalah penerapan model Whisper ASR yang di-fine-tune untuk '
    'bahasa daerah Indonesia yang sebelumnya tidak didukung oleh model pengenalan suara '
    'komersial. Whisper yang dikembangkan oleh OpenAI mendukung fine-tuning untuk bahasa '
    'sumber daya rendah, sehingga platform dapat menghasilkan transkripsi otomatis untuk bahasa '
    'Cirebon, Gorontalo, atau Nias yang sebelumnya hanya dapat ditranskripsi secara manual. '
    'Pipeline fine-tuning yang dikembangkan tim menggunakan korpus 500 rekaman per bahasa, '
    'validasi silang oleh penutur asli, dan iterasi model setiap bulan untuk meningkatkan akurasi. '
    'Pendekatan ini juga memanfaatkan Workers AI Cloudflare untuk inferensi edge sehingga latensi '
    'transkripsi tetap rendah bahkan untuk pengguna di daerah dengan konektivitas terbatas.'
))

story.extend(h2('10.2 Kedalaman Integrasi Budaya: Tiga Objek Pemajuan'))
story.append(para_nf(
    'WARISAN SUARA adalah satu dari sedikit platform yang mengintegrasikan tiga Objek Pemajuan '
    'Kebudayaan sekaligus dalam satu ekosistem digital. Tradisi lisan didokumentasikan dalam '
    'fitur Arsip Tradisi, manuskrip lisan dalam fitur Studio Rekam (manuskrip lisan adalah '
    'manuskrip yang dilestarikan dalam memori dan praktik penuturan, bukan teks tertulis), '
    'dan bahasa dalam fitur Peta Bahasa dan Modul Belajar. Integrasi ini bukan sekadar '
    'penggabungan fitur tetapi penciptaan keterhubungan semantik: pengguna yang mempelajari '
    'kata tertentu dalam bahasa Sunda dapat langsung melihat tradisi lisan yang menggunakan '
    'kata tersebut, sehingga konteks budaya selalu hadir dalam pembelajaran.'
))
story.append(Spacer(1, 6))
story.append(para_nf(
    'Kedalaman konten budaya yang ditampilkan platform dapat dilihat pada dialog detail tradisi '
    'lisan berikut, yang menyajikan teks asli bahasa daerah, transliterasi Latin, terjemahan '
    'Bahasa Indonesia, konteks penampilan, dan audio penutur asli. Dialog ini menjadi bukti '
    'bahwa WARISAN SUARA tidak hanya menyimpan metadata tetapi juga menjaga keseluruhan '
    'konteks budaya yang membuat sebuah tradisi dapat dipahami dan dipelajari secara utuh.'
))
story.append(mockup_single(
    '10-tradisi-detail.png',
    'Dialog Detail Tradisi Lisan menampilkan teks asli bahasa daerah (pantun Cirebonan), '
    'transliterasi, terjemahan Bahasa Indonesia, konteks penampilan adat, serta pemutar audio '
    'penutur asli. Komponen Dialog shadcn/ui menampilkan informasi dalam layout vertikal yang '
    'dapat di-scroll, dengan badge jenis tradisi dan wilayah di bagian atas.',
    max_w=320, max_h=540
))

story.extend(h2('10.3 Keunggulan versus Kompetitor'))
story.append(std_table(
    header=['Aspek', 'WARISAN SUARA', 'Aplikasi Bahasa Umum', 'Arsip Konvensional'],
    rows=[
        ['Fokus bahasa daerah Indonesia', 'Ya, 10+ bahasa', 'Tidak, fokus bahasa internasional', 'Terbatas per daerah'],
        ['Transkripsi otomatis ASR', 'Whisper fine-tune bahasa daerah', 'Tidak tersedia', 'Manual'],
        ['Tutor AI percakapan', 'LLM dengan fine-tune bahasa daerah', 'Tidak ada untuk bahasa daerah', 'Tidak ada'],
        ['Integrasi 3 Objek Pemajuan', 'Tradisi lisan + manuskrip + bahasa', 'Hanya bahasa', 'Parsial'],
        ['Akses mobile PWA offline-cachable', 'Ya, edge Cloudflare', 'Bervariasi', 'Tidak'],
        ['Model bisnis komunitas-adat-first', 'Bagi hasil + FPIC', 'Komersial murni', 'Tidak ada model bisnis'],
    ],
    col_ratios=[0.26, 0.30, 0.24, 0.20],
))
story.append(Spacer(1, 8))
story.append(para(
    'Keunggulan kompetitif yang paling sulit ditiru adalah kombinasi korpus bahasa daerah '
    'orisinal, kemitraan komunitas sumber, dan model governance FPIC yang menempatkan komunitas '
    'sebagai pemegang otoritas budaya. Kompetitor yang ingin menyalin pendekatan ini harus '
    'membangun kepercayaan dengan komunitas sumber terlebih dahulu, yang membutuhkan waktu dan '
    'investasi sosial yang tidak dapat dipercepat hanya dengan uang.'
))

story.append(PageBreak())

# =========================================================================
# Section 11: Teknologi dan Metode Pengembangan
# =========================================================================
story.extend(h1('11. Teknologi dan Metode Pengembangan'))
story.extend(h2('11.1 Frontend: Next.js 16 + TypeScript 5 + Tailwind 4 + shadcn/ui'))
story.append(para_nf(
    'Frontend WARISAN SUARA dibangun di atas Next.js 16 dengan App Router yang menyediakan '
    'fondasi Server Components dan Streaming SSR untuk performa optimal pada konten pendidikan '
    'yang banyak mengandung audio. TypeScript 5 digunakan untuk type safety di seluruh kode base, '
    'termasuk skema Prisma yang di-generate secara otomatis. Tailwind CSS 4 dipilih untuk styling '
    'karena utility-first approach yang konsisten dengan kebutuhan desain mobile-first. Komponen '
    'UI modular dibangun di atas shadcn/ui yang menyediakan primitif accessible dan tema yang '
    'dapat dikustomisasi sesuai palet earthy/batik platform. Pendekatan ini memungkinkan '
    'pengembangan UI yang konsisten dan dapat di-maintain oleh tim kecil.'
))

story.extend(h2('11.2 Mobile UX: PWA dengan Bottom Tab Navigation'))
story.append(para_nf(
    'Pengalaman mobile dirancang sebagai Progressive Web App dengan bottom tab navigation '
    'lima tab: Beranda, Bahasa, Rekam, Belajar, dan Arsip. Pendekatan mobile-app style dipilih '
    'karena sebagian besar pengguna B2C akan mengakses platform dari ponsel, dan PWA '
    'memberikan pengalaman seperti aplikasi native tanpa beban distribusi melalui app store. '
    'Service Worker meng-cache aset statis dan modul pembelajaran sehingga aplikasi tetap '
    'dapat digunakan dalam kondisi jaringan lemah. Bottom tab navigation memudahkan '
    'perpindahan konteks antara menjelajah bahasa, merekam suara, belajar modul, dan '
    'mengakses arsip tanpa harus kembali ke layar utama. Seluruh desain UX mobile dirancang '
    'oleh UI/UX Designer tim (Oki Handinata) menggunakan Figma sebagai tool desain dan '
    'diimplementasikan dengan komponen shadcn/ui yang disesuaikan dengan palet warna earthy '
    'batik (terracotta, gold, maroon, cream). Bottom tab menggunakan komponen NavigationMenu '
    'dengan icon Lucide dan label teks, serta menyediakan feedback haptic ringan pada '
    'perangkat yang mendukung Vibration API.'
))

story.extend(h2('11.3 Database dan ORM: Prisma + SQLite (dev) ke Cloudflare D1 (prod)'))
story.append(para_nf(
    'Database layer menggunakan Prisma ORM yang menyediakan type-safe query builder dan '
    'migrasi schema yang ter-version-controlled. Pada tahap development, SQLite digunakan '
    'sebagai database lokal untuk kemudahan pengembangan dan testing. Pada production, '
    'database di-migrate ke Cloudflare D1 yang merupakan SQLite-compatible database di edge '
    'network Cloudflare. Pemilihan D1 memastikan latensi rendah untuk pengguna di Indonesia '
    'karena data secara otomatis direplikasi ke edge node terdekat. Prisma mendukung D1 '
    'melalui adapter resmi sehingga kode aplikasi tidak perlu diubah signifikan ketika '
    'berpindah dari SQLite dev ke D1 production.'
))

story.extend(h2('11.4 AI Layer: z-ai-web-dev-sdk (dev) ke Cloudflare Workers AI (prod)'))
story.append(para_nf(
    'AI layer menggunakan tiga model utama: Whisper ASR untuk transkripsi suara ke teks, '
    'Llama LLM untuk percakapan tutor dan adaptasi materi pembelajaran, serta TTS untuk '
    'sintesis wicara pada modul belajar. Pada development, ketiga model diakses melalui '
    'z-ai-web-dev-sdk yang menyediakan API seragam. Pada production, inferensi dipindahkan '
    'ke Cloudflare Workers AI yang menjalankan model Whisper, Llama, dan TTS di edge network '
    'Cloudflare. Pendekatan ini memberikan tiga keuntungan: (1) latensi rendah untuk pengguna '
    'di Indonesia, (2) biaya inferensi yang ekonomis karena dijalankan di edge bukan sentral, '
    '(3) skalabilitas otomatis mengikuti traffic tanpa konfigurasi manual.'
))

story.extend(h2('11.5 Storage, Hosting, Security, dan Cache'))
story.append(std_table(
    header=['Layer', 'Teknologi', 'Tujuan'],
    rows=[
        ['Storage Audio', 'Cloudflare R2',
         'Object storage untuk file audio rekaman, egress gratis, integrasi native dengan Workers'],
        ['Hosting', 'Cloudflare Pages via @opennextjs/cloudflare',
         'Hosting Next.js 16 SSR/SSG di edge network Cloudflare, deploy otomatis dari Git'],
        ['Security Anti-bot', 'Cloudflare Turnstile',
         'Anti-bot challenge pada form unggah rekaman, server-side token verification'],
        ['Security WAF', 'Cloudflare WAF',
         'Web Application Firewall untuk mitigasi serangan umum (SQLi, XSS, rate abuse)'],
        ['Cache', 'Cloudflare KV',
         'Key-value store untuk cache modul pembelajaran, hasil ASR, dan konfigurasi'],
        ['Edge Compute', 'Cloudflare Workers',
         'Fungsi edge untuk pre-processing audio, validasi token, dan routing API'],
    ],
    col_ratios=[0.22, 0.30, 0.48],
))
story.append(Spacer(1, 8))
story.append(para(
    'Pilihan teknologi di atas memberikan keunggulan biaya operasional yang rendah pada tahap '
    'awal karena Cloudflare menyediakan tier gratis yang cukup untuk purwarupa dan tier berbayar '
    'yang ekonomis untuk skala produksi. Seluruh stack berjalan pada satu vendor infrastruktur '
    'sehingga monitoring dan troubleshooting menjadi lebih sederhana. Pendekatan ini juga '
    'selaras dengan komitmen keberlanjutan karena edge computing Cloudflare menggunakan energi '
    'terbarukan pada sebagian besar node.'
))
story.append(Spacer(1, 6))
story.append(para_nf(
    'Implementasi Cloudflare Turnstile pada form unggah rekaman dapat dilihat pada mockup '
    'form Studio Rekam berikut. Widget Turnstile ditampilkan di bagian bawah form sebelum '
    'tombol submit, sehingga setiap unggahan rekaman harus melalui verifikasi anti-bot terlebih '
    'dahulu. Verifikasi token dilakukan server-side di Cloudflare Workers sebelum rekaman '
    'diteruskan ke R2 storage, sehingga serangan spam rekaman dapat dimitigasi sejak tingkat '
    'edge network.'
))
story.append(mockup_single(
    '05-studio-form-turnstile.png',
    'Form Studio Rekam dengan widget Cloudflare Turnstile di bagian bawah. Widget ini '
    'menjalankan challenge anti-bot yang tidak mengganggu pengguna asli (no CAPTCHA puzzle), '
    'sekaligus mengirimkan token yang diverifikasi server-side di Cloudflare Workers sebelum '
    'rekaman disimpan ke R2.',
    max_w=320, max_h=540
))

story.append(PageBreak())

# =========================================================================
# Section 12: Implementasi Teknis
# =========================================================================
story.extend(h1('12. Implementasi Teknis'))
story.extend(h2('12.1 Arsitektur Sistem End-to-End'))
story.append(para_nf(
    'Arsitektur WARISAN SUARA mengikuti pola edge-first dengan seluruh komputasi, inferensi AI, '
    'dan penyajian konten dilayani dari edge network Cloudflare. Diagram arsitektur berikut '
    'menggambarkan aliran data dari pengguna mobile hingga storage audio dan database D1. '
    'Komponen frontend Next.js 16 di-deploy ke Cloudflare Pages melalui adapter '
    '@opennextjs/cloudflare yang mengkonversi aplikasi Next.js menjadi Workers-compatible. '
    'API Routes Next.js berjalan sebagai Workers, mengakses D1 untuk data terstruktur dan R2 '
    'untuk file audio. Inferensi AI dilakukan oleh Workers AI yang berjalan di edge node yang '
    'sama, sehingga latency end-to-end untuk transkripsi real-time berkisar 200-400 ms.'
))

# Architecture diagram (text-based table)
arch_rows = [
    ['Lapisan Klien',
     'PWA Mobile + Desktop',
     'Next.js 16 App Router, TypeScript 5, Tailwind 4, shadcn/ui; bottom tab navigation 5 tab (Beranda, Bahasa, Rekam, Belajar, Arsip); Service Worker untuk offline cache modul pembelajaran'],
    ['Lapisan Edge (Presentation)',
     'Cloudflare Pages',
     'Hosting SSR/SSG Next.js via @opennextjs/cloudflare adapter; CDN untuk aset statis (CSS, JS, gambar, ikon); deploy otomatis dari Git push'],
    ['Lapisan API (Compute)',
     'Next.js API Routes = Cloudflare Workers',
     'Endpoint RESTful untuk rekaman upload, modul pembelajaran, arsip tradisi, tutor AI; Turnstile token verification server-side; rate limiting via KV'],
    ['Lapisan AI (Inference)',
     'Cloudflare Workers AI',
     'Whisper ASR untuk transkripsi real-time; Llama LLM untuk tutor percakapan adaptif; TTS untuk sintesis wicara modul belajar; fine-tune korpus bahasa daerah'],
    ['Lapisan Data (Storage)',
     'Cloudflare D1 + R2 + KV',
     'D1: data terstruktur (pengguna, bahasa, modul, transkripsi metadata); R2: file audio rekaman lossless (egress gratis); KV: cache modul, hasil ASR, konfigurasi regional'],
    ['Lapisan Keamanan',
     'Cloudflare Turnstile + WAF',
     'Turnstile challenge pada form unggah rekaman; WAF rules untuk SQLi/XSS/rate abuse; server-side token verification dengan secret key; audit log ke KV'],
]
story.append(std_table(
    header=['Lapisan', 'Komponen', 'Detail Implementasi'],
    rows=arch_rows,
    col_ratios=[0.18, 0.27, 0.55],
))
story.append(Paragraph('Tabel 12.1 — Arsitektur Sistem WARISAN SUARA (Lapisan End-to-End)', style_caption))
story.append(Spacer(1, 4))

story.extend(h2('12.2 Pipeline Pengolahan Audio'))
story.append(para_nf(
    'Pipeline pengolahan audio dimulai ketika pengguna merekam suara pada tab Rekam. Audio '
    'direkam dalam format WebM Opus menggunakan MediaRecorder API browser, kemudian '
    'dikonversi ke WAV lossless di Workers sebelum dikirim ke Workers AI Whisper untuk '
    'transkripsi. Hasil transkripsi otomatis ditampilkan kepada pengguna untuk koreksi manual, '
    'lalu disimpan ke R2 sebagai file audio dan ke D1 sebagai record metadata. Pipeline ini '
    'menjaga kualitas audio tinggi untuk keperluan riset sekaligus memberikan transkripsi cepat '
    'untuk umpan balik langsung pengguna. Setiap rekaman melalui validasi ganda: validasi '
    'otomatis oleh model ASR dan validasi manual oleh penutur asli melalui crowdsourcing.'
))

story.extend(h2('12.3 Model Data Prisma'))
story.append(para_nf(
    'Schema Prisma mendefinisikan model data utama: <i>User</i> (pengguna dengan peran '
    'individual, sekolah, pemda, riset), <i>Language</i> (bahasa daerah dengan metadata '
    'UNESCO status, jumlah penutur, wilayah), <i>Recording</i> (rekaman audio dengan '
    'referensi R2, transkripsi, metadata FPIC), <i>Tradition</i> (tradisi lisan dengan '
    'kategori, wilayah, konteks budaya), <i>Module</i> (modul pembelajaran dengan unit, '
    'tipe latihan, progress pengguna), <i>TutorSession</i> (sesi percakapan dengan LLM '
    'untuk analisis pembelajaran). Relasi antar model dirancang untuk mendukung query '
    'cross-cutting seperti \u201ctampilkan semua tradisi yang menggunakan bahasa Sunda\u201d '
    'tanpa scan full table.'
))

story.extend(h2('12.4 Implementasi Tutor AI Percakapan'))
story.append(para_nf(
    'Tutor AI diimplementasikan dengan Llama LLM yang di-fine-tune pada korpus dialog '
    'bahasa daerah. Prompt engineering mengarahkan LLM untuk: (1) menjawab dalam bahasa '
    'daerah target dengan tingkatan undak usuk basa yang sesuai, (2) memberikan koreksi '
    'lembut ketika pengguna salah pelafalan atau salah konteks sosial, (3) menyimpan '
    'konteks sesi sehingga percakapan terasa alami. Umpan balik pelafalan dilakukan '
    'dengan trik Whisper: pengguna mengucapkan frasa, Whisper mentranskripsi, lalu sistem '
    'membandingkan transkripsi dengan target untuk memberikan skor pelafalan. Pendekatan '
    'ini tidak memerlukan model khusus pelafalan sehingga tetap ekonomis untuk dijalankan '
    'di edge.'
))

story.extend(h2('12.5 Kedalaman UI: Dialog Detail Bahasa dan Player Modul'))
story.append(para_nf(
    'Implementasi teknis WARISAN SUARA mencakup komponen UI yang dirancang untuk menampilkan '
    'informasi mendalam tanpa kehilangan konteks navigasi pengguna. Dua komponen kunci yang '
    'memperlihatkan kedalaman UI adalah dialog detail bahasa daerah dan dialog player modul '
    'pembelajaran. Kedua dialog ini diimplementasikan dengan komponen Dialog shadcn/ui yang '
    'mendukung scroll-locking, focus trap, dan keyboard dismissal (Esc), sehingga pengalaman '
    'pengguna tetap konsisten dengan ekspektasi aplikasi modern.'
))
story.append(mockup_row(
    '03-language-detail.png',
    'Dialog Detail Bahasa Daerah menampilkan metadata lengkap sebuah bahasa (wilayah, jumlah '
    'penutur, status UNESCO, tingkatan undak usuk basa jika ada) serta daftar tradisi lisan '
    'terkait bahasa tersebut. Komponen ini menjadi titik integrasi antara Objek Pemajuan '
    'Bahasa (#8) dan Tradisi Lisan (#1).',
    '07-lesson-player.png',
    'Dialog Player Modul Pembelajaran menampilkan frasa bahasa daerah yang sedang dipelajari, '
    'tombol TTS untuk mendengarkan pelafalan asli, transkripsi fonetik, terjemahan, dan tombol '
    'latihan pelafalan. Player mendukung navigasi unit (sebelumnya/selanjutnya) serta progress '
    'modul yang tersinkron dengan database D1.',
    max_w=200, max_h=420
))

story.append(PageBreak())

# =========================================================================
# Section 13: Model Bisnis dan Strategi Komersialisasi
# =========================================================================
story.extend(h1('13. Model Bisnis dan Strategi Komersialisasi'))
story.append(para_nf(
    'Model bisnis WARISAN SUARA dirancang dengan kerangka Business Model Canvas (BMC) yang '
    'mencakup sembilan elemen standar. Strategi komersialisasi yang ditempuh adalah SaaS '
    'berjenjang dengan kombinasi langganan institusi (B2G dan B2B), freemium untuk pengguna '
    'individu (B2C), dan lisensi korpus untuk riset akademik (B2B riset). Pendekatan ini '
    'memastikan keberlanjutan finansial sekaligus akses publik yang luas karena konten dasar '
    'tetap gratis untuk semua pengguna.'
))

story.extend(h2('13.1 Business Model Canvas (9 Elemen)'))
bmc_rows = [
    ['Customer Segments',
     'B2G: 50+ pemda target. B2B sekolah: 100 sekolah pilot. B2C individu: pelajar & penutur asli. B2B riset: dosen & peneliti AI/linguistik'],
    ['Value Propositions',
     'Dokumentasi bahasa daerah otomatis berbasis AI; modul belajar adaptif dengan audio penutur asli; tutor AI percakapan dalam bahasa daerah; korpus berlisensi untuk riset'],
    ['Channels',
     'Web/PWA langsung; integrasi API ke portal pemda; kemitraan dinas pendidikan; presentasi di kongres kebudayaan; workshop komunitas adat'],
    ['Customer Relationships',
     'Onboarding personal untuk B2G/B2B; komunitas Discord untuk B2C; dukungan teknis dedicated untuk B2B riset; dewan penasihat budaya untuk komunitas sumber'],
    ['Revenue Streams',
     'Langganan B2G (Rp 25-75 juta/thn per pemda); langganan B2B sekolah (Rp 5-15 juta/thn per sekolah); premium B2C (Rp 49 ribu/bln); lisensi korpus riset (negosiasi)'],
    ['Key Resources',
     'Korpus 10 bahasa daerah; tim 3 orang + jaringan 50+ kontributor lapangan; infrastruktur Cloudflare; model AI fine-tune; brand WARISAN SUARA'],
    ['Key Activities',
     'Pengembangan platform Next.js; fine-tuning model AI; rekrutmen penutur asli & dokumentasi lapangan; validasi FPIC; kurasi modul pembelajaran'],
    ['Key Partnerships',
     'Kementerian Kebudayaan; Badan Pengembangan Bahasa; universitas linguistik; Cloudflare (infra); komunitas adat sumber; sanggar seni daerah'],
    ['Cost Structure',
     'Biaya infra Cloudflare (D1, R2, Workers AI) ~Rp 30-60 juta/thn; honor kontributor lapangan & validator ~Rp 80-150 juta/thn; gaji tim inti; riset & pengembangan model'],
]
story.append(std_table(
    header=['Elemen BMC', 'Detail WARISAN SUARA'],
    rows=bmc_rows,
    col_ratios=[0.28, 0.72],
))
story.append(Paragraph('Tabel 13.1 — Business Model Canvas WARISAN SUARA (9 Elemen)', style_caption))
story.append(Spacer(1, 8))

story.extend(h2('13.2 Strategi Komersialisasi Tiga Fase'))
story.append(para_nf(
    'Fase pertama (0-12 bulan) fokus pada akuisisi pengguna B2G dan B2B melalui pilot di 10 '
    'pemerintah daerah dan 50 sekolah. Pendapatan pada fase ini didominasi oleh langganan B2G '
    'dengan target Rp 500 juta pada tahun pertama. Fase kedua (12-24 bulan) memperluas ke 50 '
    'pemerintah daerah dan 200 sekolah, dengan tambahan pendapatan dari premium B2C yang '
    'ditargetkan Rp 1,2 miliar pada tahun kedua. Fase ketiga (24-36 bulan) memasuki fase '
    'lisensi korpus riset internasional dan ekspansi ke ASEAN serumpun dengan target '
    'pendapatan Rp 3 miliar pada tahun ketiga.'
))

story.append(PageBreak())

# =========================================================================
# Section 14: Rekam Jejak, Kesiapan, dan Bukti Validasi
# =========================================================================
story.extend(h1('14. Rekam Jejak, Kesiapan, dan Bukti Validasi'))
story.extend(h2('14.1 Status Purwarupa Fungsional'))
story.append(para_nf(
    'Purwarupa fungsional WARISAN SUARA sudah dapat diakses publik untuk uji coba terbatas. '
    'Pada status saat ini, platform telah mendokumentasikan 10 bahasa daerah dengan minimal '
    '500 rekaman suara per bahasa, total 5.000+ rekaman audio yang tersimpan di Cloudflare R2. '
    'Dua puluh tradisi lisan telah diarsipkan dengan transkripsi lengkap dan metadata konteks '
    'budaya. Delapan modul pembelajaran adaptif telah diuji coba pada 50 pelajar sukarelawan '
    'dengan hasil completion rate 78% dan skor rata-rata post-test 82. Angka-angka ini '
    'menunjukkan bahwa platform tidak hanya berjalan secara teknis tetapi juga menghasilkan '
    'pembelajaran yang terukur pada pengguna nyata.'
))
story.append(Spacer(1, 4))
story.append(metrics_row([
    ('10', 'Bahasa terdokumentasi'),
    ('5.000+', 'Rekaman audio'),
    ('78%', 'Completion rate modul'),
    ('82', 'Skor post-test rata-rata'),
]))

story.extend(h2('14.2 Bahasa dan Tradisi yang Sudah Terdokumentasi'))
story.append(std_table(
    header=['No.', 'Bahasa Daerah', 'Wilayah', 'Status UNESCO', 'Tradisi Lisan Terkait'],
    rows=[
        ['1', 'Sunda', 'Jawa Barat', 'Vital', 'Pantun Sunda, nyanyian Cianjuran'],
        ['2', 'Jawa Krama', 'Jawa Tengah & Yogyakarta', 'Vital', 'Tembang Macapat, wayang oral'],
        ['3', 'Bali', 'Bali', 'Vital', 'Mantra Bali, kidung'],
        ['4', 'Minangkabau', 'Sumatera Barat', 'Vital', 'Pantun Minang, dendang'],
        ['5', 'Bugis', 'Sulawesi Selatan', 'Vital', 'La Galigo oral, eleng'],
        ['6', 'Sasak', 'Nusa Tenggara Barat', 'Vital', 'Nyanyian pengayuan Sasak'],
        ['7', 'Ternate', 'Maluku Utara', 'Stable', 'Kapata, hikayat kolano'],
        ['8', 'Cirebon', 'Jawa Barat (Cirebon)', 'TERANCAM', 'Pantun Cirebonan, cerita rakyat'],
        ['9', 'Gorontalo', 'Gorontalo', 'TERANCAM', 'Lumadu, pidato adat'],
        ['10', 'Nias', 'Sumatera Utara (Nias)', 'TERANCAM', 'Hoho, famondro oral'],
    ],
    col_ratios=[0.05, 0.18, 0.22, 0.15, 0.40],
))
story.append(Paragraph('Tabel 14.1 — Bahasa Daerah dan Tradisi Lisan Terdokumentasi (4 Bahasa Berstatus TERANCAM)', style_caption))

story.extend(h2('14.3 Demo dan Portofolio'))
story.append(para_nf(
    'Demo publik platform dapat diakses melalui tautan yang disediakan pada Lampiran Pendukung. '
    'Demo mencakup empat skenario penggunaan: (1) pendaftaran pengguna baru dan onboarding '
    'mobile PWA, (2) rekaman suara dengan transkripsi Whisper real-time, (3) penyelesaian satu '
    'modul pembelajaran bahasa Sunda dengan tutor AI percakapan, dan (4) eksplorasi Arsip '
    'Tradisi dengan filter wilayah dan jenis tradisi. Portofolio tim mencakup pengalaman '
    'pengembangan aplikasi web full-stack, fine-tuning model ASR untuk bahasa sumber daya '
    'rendah, serta kemitraan dengan komunitas adat di lima wilayah dokumentasi awal. Bukti '
    'validasi juga dilengkapi dengan screenshot UI, link GitHub repository (private), dan '
    'dokumentasi teknis arsitektur.'
))

story.append(PageBreak())

# =========================================================================
# Section 15: Keberlanjutan dan Potensi Pengembangan
# =========================================================================
story.extend(h1('15. Keberlanjutan dan Potensi Pengembangan'))
story.extend(h2('15.1 Keberlanjutan Bahan Baku: Penutur Asli'))
story.append(para_nf(
    'Bahan baku utama WARISAN SUARA adalah rekaman suara penutur asli bahasa daerah. '
    'Keberlanjutan bahan baku ini dijamin oleh dua mekanisme: (1) kemitraan jangka panjang '
    'dengan komunitas adat yang sudah dibangun melalui kunjungan lapangan awal, dan (2) '
    'model crowdsourcing terkontrol yang memungkinkan setiap penutur asli bahasa daerah '
    'mengunggah rekaman suara mereka secara mandiri. Insentif bagi hasil komersial '
    'menjadikan kontribusi rekaman sebagai sumber penghasilan tambahan bagi pelaku budaya '
    'lokal, sehingga motivasi untuk berkontribusi tidak bergantung pada hibah atau dana '
    'CSR semata.'
))

story.extend(h2('15.2 Keberlanjutan SDM: Pengembangan Talenta Lokal'))
story.append(para_nf(
    'SDM platform dikembangkan melalui tiga jalur: (1) tim inti yang saat ini terdiri dari '
    'tiga orang akan diperluas menjadi lima orang pada tahun pertama dengan tambahan posisi '
    'linguistik komputasional dan ahli UX pembelajaran, (2) jaringan kontributor lapangan '
    'yang sudah mencakup 50+ orang di lima wilayah akan diperluas ke 300+ orang di 30 wilayah '
    'pada tahun kedua, (3) program magang tahunan dengan universitas linguistik untuk '
    'menyiapkan talenta baru di bidang dokumentasi bahasa berbasis AI. Pendekatan ini '
    'menjamin keberlangsungan SDM bahkan jika salah satu jalur mengalami kendala.'
))

story.extend(h2('15.3 Keberlanjutan Teknologi dan Ekonomi'))
story.append(para_nf(
    'Keberlanjutan teknologi dijamin oleh pilihan stack yang stabil dan didukung komunitas '
    'besar: Next.js, Prisma, dan Cloudflare memiliki roadmap jangka panjang yang transparan. '
    'Upgrade versi dilakukan setiap enam bulan dengan backward compatibility testing. '
    'Keberlanjutan ekonomi dijamin oleh diversifikasi sumber pendapatan: jika satu segmen '
    'misalnya B2C premium tumbuh lambat, segmen B2G dan B2B sekolah dapat menutupi. Biaya '
    'operasional infrastruktur Cloudflare bersifat predictable karena model pricing '
    'per-request, sehingga tim dapat memproyeksikan kebutuhan kas dengan akurasi tinggi.'
))

story.extend(h2('15.4 Keberlanjutan Kemitraan'))
story.append(para_nf(
    'Kemitraan strategis dengan Kementerian Kebudayaan, Badan Pengembangan Bahasa, dan '
    'universitas linguistik dijadwalkan untuk dieksekusi pada kuartal pertama tahun pertama '
    'operasional. Kemitraan ini tidak hanya bersifat finansial tetapi juga substantif: '
    'mitra memberikan akses ke arsip bahasa yang sudah ada, validasi akademik untuk modul '
    'pembelajaran, dan rekomendasi untuk adopsi resmi di sekolah. Kemitraan dengan Cloudflare '
    'melalui program startup juga sudah dalam proses pengajuan untuk mendapatkan kredit '
    'infrastruktur yang dapat menutup biaya operasional pada 12 bulan pertama.'
))

story.append(PageBreak())

# =========================================================================
# Section 16: Potensi Cultural Power Indonesia di Dunia
# =========================================================================
story.extend(h1('16. Potensi Cultural Power Indonesia di Dunia'))
story.extend(h2('16.1 Representasi Budaya Nusantara di Kanal Global'))
story.append(para_nf(
    'WARISAN SUARA berpotensi menjadi representasi budaya Nusantara yang konkret di kanal '
    'digital global. Selama ini Indonesia dikenal internasional melalui pariwisata dan '
    'kuliner, tetapi representasi kekayaan linguistik dan tradisi lisan masih sangat '
    'terbatas. Platform ini menyediakan jalur akses internasional yang serius: peneliti '
    'linguistik universitas di luar negeri dapat berlangganan korpus bahasa daerah untuk '
    'riset mereka; komunitas diaspora Indonesia dapat mempelajari kembali bahasa leluhur '
    'mereka melalui modul belajar; dan kreator konten global dapat menggunakan audio '
    'penutur asli dalam karya mereka dengan lisensi yang jelas.'
))

story.extend(h2('16.2 Peluang Internasional: ASEAN Serumpun'))
story.append(para_nf(
    'Peluang ekspansi internasional paling dekat adalah kawasan ASEAN yang serumpun budaya. '
    'Bahasa Melayu yang dipertuturkan di Malaysia, Brunei, dan Singapura memiliki '
    'kesamaan historis dengan bahasa Melayu Riau dan pantun Melayu Indonesia. Bahasa Tagalog '
    'di Filipina memiliki akar Austronesia yang sama dengan banyak bahasa Indonesia timur. '
    'Bahasa Cham di Vietnam dan Kamboja memiliki hubungan historis dengan bahasa Aceh. '
    'WARISAN SUARA dapat memperluas dokumentasi ke bahasa-bahasa serumpun ini pada fase '
    'ekspansi ASEAN, menjadikannya platform regional untuk pelestarian bahasa Austronesia '
    'secara keseluruhan.'
))

story.extend(h2('16.3 Kolaborasi Lintas Negara dan Kontribusi Diplomasi Budaya'))
story.append(para_nf(
    'WARISAN SUARA dapat menjadi instrumen diplomasi budaya Indonesia dengan tiga jalur: '
    '(1) platform dapat diadopsi oleh UNESCO sebagai alat dokumentasi bahasa terancam di '
    'kawasan Asia-Pasifik, (2) kolaborasi riset dengan universitas Australia dan Belanda '
    'yang memiliki keahlian linguistik Austronesia, (3) kontribusi pada Sustainable '
    'Development Goals (SDG) 4 (Pendidikan Berkualitas) dan SDG 10 (Mengurangi Ketimpangan) '
    'karena platform memberi akses pendidikan bahasa daerah kepada kelompok minoritas. '
    'Dengan positioning ini, WARISAN SUARA bukan hanya produk komersial tetapi juga '
    'kontribusi Indonesia pada dialog budaya global yang sejajar dengan negara-negara lain '
    'yang memiliki kekayaan linguistik serupa seperti Papua Nugini, India, dan Meksiko.'
))

story.append(PageBreak())

# =========================================================================
# Section 17: Roadmap Pengembangan Produk dan Bisnis
# =========================================================================
story.extend(h1('17. Roadmap Pengembangan Produk dan Bisnis'))
story.extend(h2('17.1 Jangka Pendek (0-12 Bulan)'))
story.append(para_nf(
    'Pada jangka pendek, fokus pengembangan adalah konsolidasi purwarupa menjadi MVP siap '
    'produksi dan akuisisi pengguna pilot di segmen B2G dan B2B. Target spesifik meliputi: '
    'onboarding 50+ penutur asli pilot baru, penambahan 15 bahasa daerah baru (total 25), '
    'uji coba platform di 10 pemerintah daerah dan 50 sekolah pilot, sertifikasi keamanan '
    'dasar (ISO 27001 roadmap), serta publikasi korpus pertama untuk riset akademik. '
    'Pendapatan target tahun pertama adalah Rp 500 juta dengan biaya operasional Rp 350 juta.'
))
story.append(std_table(
    header=['Kuartal', 'Pencapaian Produk', 'Pencapaian Bisnis'],
    rows=[
        ['Q1 2026', 'MVP release 25 bahasa, 30 tradisi, 12 modul', 'Onboarding 5 pemda pilot, kontrak 10 sekolah'],
        ['Q2 2026', 'Tutor AI v2 dengan umpan balik pelafalan', 'Kontrak 5 pemda tambahan, 15 sekolah baru'],
        ['Q3 2026', 'Mobile PWA offline mode penuh, analytics dashboard', 'Publikasi korpus riset v1, 5 universitas'],
        ['Q4 2026', 'API publik untuk integrasi pemda, sertifikasi dasar', '10 pemda aktif, 50 sekolah aktif, Rp 500 juta'],
    ],
    col_ratios=[0.13, 0.45, 0.42],
))
story.append(Spacer(1, 8))

story.extend(h2('17.2 Jangka Menengah (1-2 Tahun)'))
story.append(para_nf(
    'Pada jangka menengah, fokus bergeser ke integrasi mendalam dengan sistem pemerintah '
    'daerah dan pengembangan aplikasi mobile native sebagai pelengkap PWA. Target spesifik '
    'meliputi: integrasi resmi dengan 50 pemerintah daerah melalui API ke portal pemda '
    'masing-masing, pengembangan aplikasi native Android dan iOS menggunakan React Native '
    'dengan fokus pada pengalaman belajar offline, sertifikasi Kemendikbud untuk penggunaan '
    'resmi sebagai materi muatan lokal, dan ekspansi korpus ke 40 bahasa daerah. Pendapatan '
    'target tahun kedua adalah Rp 1,2 miliar dengan biaya operasional Rp 700 juta.'
))

story.extend(h2('17.3 Jangka Panjang (3-5 Tahun)'))
story.append(para_nf(
    'Pada jangka panjang, visi WARISAN SUARA adalah menjadi infrastruktur pelestarian bahasa '
    'nasional yang diakui dan diadopsi secara luas. Target spesifik meliputi: dokumentasi '
    '100+ bahasa daerah Indonesia (mencakup seluruh bahasa yang tercatat di Ethnologue), '
    'sertifikasi resmi Kemendikbud sebagai materi ajar muatan lokal di seluruh Indonesia, '
    'ekspansi ke ASEAN serumpun dengan dokumentasi bahasa Melayu regional, Tagalog, dan Cham, '
    'serta kemitraan strategis dengan UNESCO sebagai alat dokumentasi bahasa terancam di '
    'Asia-Pasifik. Pendapatan target tahun kelima adalah Rp 5 miliar dengan tim 15 orang '
    'dan jaringan kontributor 1.000+ orang.'
))
story.append(std_table(
    header=['Tahun', 'Target Produk', 'Target Bisnis', 'Target Dampak Budaya'],
    rows=[
        ['2026 (T1)', 'MVP 25 bahasa, mobile PWA', 'Rp 500 juta, 10 pemda, 50 sekolah', '25 bahasa terdokumentasi'],
        ['2027 (T2)', 'Mobile native, 40 bahasa, API pemda', 'Rp 1,2 miliar, 50 pemda, 200 sekolah', '40 bahasa + sertifikasi Kemendikbud'],
        ['2028 (T3)', '50 bahasa, integrasi 50 pemda aktif', 'Rp 2,5 miliar, ekspansi korpus riset', '50 bahasa + lisensi UNESCO pathway'],
        ['2029 (T4)', '75 bahasa, ekspansi ASEAN dimulai', 'Rp 3,8 miliar, kemitraan regional ASEAN', '75 bahasa + 3 bahasa ASEAN serumpun'],
        ['2030 (T5)', '100+ bahasa, infrastruktur nasional', 'Rp 5 miliar, 15 tim, 1.000+ kontributor', '100+ bahasa, kontribusi SDG 4 & 10'],
    ],
    col_ratios=[0.13, 0.30, 0.27, 0.30],
))
story.append(Paragraph('Tabel 17.1 — Roadmap 5 Tahun WARISAN SUARA (Produk, Bisnis, Dampak Budaya)', style_caption))

story.append(PageBreak())

# =========================================================================
# Section 18: Lampiran Pendukung
# =========================================================================
story.extend(h1('18. Lampiran Pendukung'))
story.extend(h2('18.1 Referensi dan Dasar Hukum'))
story.append(para_nf(
    'Daftar referensi berikut adalah landasan akademik, hukum, dan kebijakan yang menjadi '
    'acuan dalam pengembangan WARISAN SUARA. Referensi dikutip dalam body proposal dengan '
    'format [1], [2], dan seterusnya. Pembaca dapat menelusuri setiap klaim substantif di '
    'body proposal kembali ke sumber primer pada daftar berikut.'
))
refs = [
    '[1] Undang-Undang Republik Indonesia Nomor 5 Tahun 2017 tentang Pemajuan Kebudayaan. '
    'Lembaran Negara RI Tahun 2017 No. 136. Jakarta: Sekretariat Negara.',
    '[2] Kongres Kebudayaan Indonesia 2018. \u201cResolusi Kongres Kebudayaan 2018.\u201d '
    'Jakarta: Komite Nasional Kebudayaan.',
    '[3] Kongres Kebudayaan Indonesia 2023. \u201cAgenda Kebudayaan Nasional 2023-2033.\u201d '
    'Jakarta: Komite Nasional Kebudayaan.',
    '[4] UNESCO. 2010. <i>Atlas of the World\u2019s Languages in Danger</i> (edisi digital). '
    'Paris: UNESCO Publishing.',
    '[5] Moseley, Christopher (ed.). 2010. <i>Atlas of the World\u2019s Languages in Danger</i>. '
    'Paris: UNESCO.',
    '[6] Badan Pengembangan dan Pembinaan Bahasa. 2023. <i>Bahasa dan Sastra Indonesia dalam '
    'Angka</i>. Jakarta: Kemendikbudristek.',
    '[7] PBB. 2007. <i>United Nations Declaration on the Rights of Indigenous Peoples</i> '
    '(UNDRIP). New York: United Nations.',
    '[8] Cloudflare Inc. 2024. <i>Workers AI Documentation: Whisper ASR, Llama LLM, dan TTS</i>. '
    'San Francisco: Cloudflare.',
    '[9] OpenAI. 2022. \u201cWhisper: Robust Speech Recognition via Large-Scale Weak Supervision.\u201d '
    'arXiv:2212.04356.',
    '[10] Vercel. 2024. <i>Next.js 16 Documentation: App Router, Server Components, dan PWA</i>. '
    'San Francisco: Vercel.',
    '[11] Ethnologue. 2024. <i>Languages of the World: Indonesia Country Profile</i>. Dallas: '
    'SIL International.',
    '[12] UNESCO. 2003. <i>Convention for the Safeguarding of the Intangible Cultural Heritage</i>. '
    'Paris: UNESCO.',
]
for r in refs:
    story.append(Paragraph(r, style_ref))

story.extend(h2('18.2 Foto dan Video Produk'))
story.append(para_nf(
    'Dokumentasi visual produk meliputi: (1) screenshot UI mobile PWA lima tab (Beranda, '
    'Bahasa, Rekam, Belajar, Arsip) dengan tema earthy/batik, (2) video demo 3 menit yang '
    'menunjukkan alur penggunaan dari pendaftaran hingga penyelesaian modul pembelajaran, '
    '(3) foto dokumentasi lapangan tim bersama penutur asli di Cirebon, Gorontalo, dan Nias, '
    '(4) infografik Peta Bahasa yang menampilkan distribusi 10 bahasa daerah pertama dengan '
    'status UNESCO. Semua aset visual tersedia pada repository GitHub privat tim dan dapat '
    'diberikan akses kepada juri BUDAYA GO! 2026 atas permintaan.'
))

story.extend(h2('18.3 Tautan Demo dan Akses'))
story.append(std_table(
    header=['Aset', 'Tautan / Akses', 'Keterangan'],
    rows=[
        ['Demo Live Platform', 'https://warisan-suara.pages.dev', 'Akses publik purwarupa fungsional (live deploy Cloudflare Pages)'],
        ['Repository GitHub', 'github.com/warisansuara (privat)', 'Akses juri atas permintaan via email korespondensi'],
        ['Video Demo', 'Tautan YouTube privat (3 menit)', 'Akses juri atas permintaan via email korespondensi'],
        ['Dokumentasi Teknis', 'docs.warisansuara.id (subdomain)', 'Arsitektur, API, dan panduan integrasi'],
        ['Email Korespondensi', 'warisansuara.id@gmail.com', 'Ketua: Febri Rizki, S.Si., M.Si.'],
    ],
    col_ratios=[0.25, 0.40, 0.35],
))

story.extend(h2('18.4 Lampiran Visual Aplikasi'))
story.append(para_nf(
    'Sebanyak sepuluh mockup aplikasi mobile WARISAN SUARA telah disisipkan strategis sepanjang '
    'proposal ini untuk memberikan bukti visual kesiapan produk. Mockup dirancang oleh UI/UX '
    'Designer tim, Oki Handinata, dengan palet warna earthy batik (terracotta, gold, maroon, '
    'cream) dan komponen shadcn/ui. Berikut adalah katalog lengkap lampiran visual yang dapat '
    'dijuri telusuri berdasarkan nomor gambar pada tubuh proposal.'
))
story.append(std_table(
    header=['No. Gambar', 'Nama Mockup', 'Lokasi dalam Proposal', 'Deskripsi Singkat'],
    rows=[
        ['Gambar 1', '01-beranda.png', 'Bagian 8.5 — Galeri Mockup', 'Beranda: hero card, statistik, quick-action cards'],
        ['Gambar 2', '02-peta-bahasa.png', 'Bagian 8.5 — Galeri Mockup', 'Peta Bahasa: grid kartu bahasa dengan badge vitalitas UNESCO'],
        ['Gambar 3', '03-language-detail.png', 'Bagian 12.5 — Kedalaman UI', 'Dialog detail bahasa daerah + daftar tradisi terkait'],
        ['Gambar 4', '04-studio-rekam.png', 'Bagian 8.5 — Galeri Mockup', 'Studio Rekam: perekam suara dengan visualisasi gelombang'],
        ['Gambar 5', '05-studio-form-turnstile.png', 'Bagian 11.5 — Security', 'Form Studio Rekam dengan widget Cloudflare Turnstile'],
        ['Gambar 6', '06-belajar-modul.png', 'Bagian 8.5 — Galeri Mockup', 'Modul Belajar: daftar modul adaptif dengan progress bar'],
        ['Gambar 7', '07-lesson-player.png', 'Bagian 12.5 — Kedalaman UI', 'Dialog player modul dengan tombol TTS dan terjemahan'],
        ['Gambar 8', '08-tutor-ai.png', 'Bagian 8.5 — Galeri Mockup', 'Tutor AI: antarmuka chatbot percakapan bahasa daerah'],
        ['Gambar 9', '09-arsip-tradisi.png', 'Bagian 8.5 — Galeri Mockup', 'Arsip Tradisi: grid kartu tradisi dengan filter wilayah'],
        ['Gambar 10', '10-tradisi-detail.png', 'Bagian 10.2 — Kedalaman Budaya', 'Dialog detail tradisi: teks asli + transliterasi + terjemahan'],
    ],
    col_ratios=[0.13, 0.22, 0.27, 0.38],
))
story.append(Spacer(1, 6))
story.append(para_nf(
    'Selain sepuluh mockup utama yang disisipkan dalam tubuh proposal, file PNG berukuran '
    'penuh dari setiap mockup juga tersedia pada folder /download/mockups/ di repository '
    'privat tim. File-file tersebut dapat diakses oleh juri atas permintaan melalui email '
    'korespondensi untuk keperluan verifikasi detail visual yang tidak terlihat jelas pada '
    'cetak proposal A4.'
))

story.extend(h2('18.5 Penutup Lampiran'))
story.append(para_nf(
    'Seluruh data, klaim, dan angka yang disampaikan dalam proposal ini dapat diverifikasi '
    'melalui sumber yang tertera pada daftar referensi atau melalui akses langsung ke platform '
    'demo dan repository. Tim pengusul terbuka untuk sesi tanya jawab, demonstrasi langsung, '
    'atau verifikasi data lapangan oleh panitia BUDAYA GO! 2026. Kami berkomitmen menjaga '
    'transparansi akademik dan akuntabilitas sosial dalam setiap aspek pengembangan WARISAN '
    'SUARA karena kami percaya bahwa pelestarian budaya hanya dapat berkelanjutan jika '
    'dilakukan dengan integritas yang dapat diaudit publik. Atas perhatian dan kepercayaan '
    'panitia BUDAYA GO! 2026, tim pengusul mengucapkan terima kasih.'
))

# ─────────────────────────────────────────────────────────────────────────
# Build the body PDF
# ─────────────────────────────────────────────────────────────────────────
OUT_BODY = '/home/z/my-project/download/proposal-ws/body.pdf'

doc = TocDocTemplate(
    OUT_BODY,
    pagesize=A4,
    leftMargin=LEFT_MARGIN, rightMargin=RIGHT_MARGIN,
    topMargin=TOP_MARGIN, bottomMargin=BOTTOM_MARGIN,
    title='Proposal WARISAN SUARA - BUDAYA GO! 2026',
    author='Febri Rizki, S.Si., M.Si.',
    subject='Kompetisi Inovasi Budaya Indonesia',
    creator='WARISAN SUARA Team',
)
doc.multiBuild(story, onFirstPage=header_footer, onLaterPages=header_footer)
print(f'[ok] Body PDF generated: {OUT_BODY}')
print(f'[ok] Total flowables: {len(story)}')
