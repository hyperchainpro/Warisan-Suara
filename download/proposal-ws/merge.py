#!/usr/bin/env python3
"""Merge cover PDF + body PDF into final proposal, set metadata."""
from pypdf import PdfReader, PdfWriter

A4_W, A4_H = 595.28, 841.89  # A4 in points

COVER = '/home/z/my-project/download/proposal-ws/cover.pdf'
BODY  = '/home/z/my-project/download/proposal-ws/body.pdf'
OUT   = '/home/z/my-project/download/Proposal-Warisan-Suara-BUDAYAGO2026.pdf'

def normalize(page):
    box = page.mediabox
    w, h = float(box.width), float(box.height)
    # Always normalize when off by more than 0.1pt — strict consistency
    if abs(w - A4_W) > 0.1 or abs(h - A4_H) > 0.1:
        page.scale_to(A4_W, A4_H)
    return page

writer = PdfWriter()
cover_page = PdfReader(COVER).pages[0]
writer.add_page(normalize(cover_page))
for p in PdfReader(BODY).pages:
    writer.add_page(normalize(p))

writer.add_metadata({
    '/Title':    'Proposal WARISAN SUARA - BUDAYA GO! 2026',
    '/Author':   'Febri Rizki, S.Si., M.Si.',
    '/Subject':  'Kompetisi Inovasi Budaya Indonesia',
    '/Creator':  'WARISAN SUARA Team',
    '/Producer': 'ReportLab + Playwright (pdf skill - Report production line)',
    '/Keywords': 'WARISAN SUARA, BUDAYA GO 2026, Inovasi Digital, Pelestarian Bahasa, Tradisi Lisan, Nusantara, Cloudflare, Next.js, Whisper ASR',
})

with open(OUT, 'wb') as f:
    writer.write(f)
print(f'[ok] Final PDF: {OUT}')

# Page count + size
reader = PdfReader(OUT)
import os
size_kb = os.path.getsize(OUT) / 1024
print(f'[ok] Total pages: {len(reader.pages)}')
print(f'[ok] File size: {size_kb:.1f} KB')
