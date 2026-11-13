#!/usr/bin/env python3
"""Generate 5 Surat Pernyataan for BUDAYA GO! 2026 — Warisan Suara team"""

from docx import Document
from docx.shared import Pt, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.style import WD_STYLE_TYPE
import os

OUT_DIR = "/home/z/my-project/download/surat-pernyataan"
os.makedirs(OUT_DIR, exist_ok=True)

# Team data
TEAM = {
    "ketua": {"name": "Febri Rizki, S.Si., M.Si.", "role": "Ketua Kelompok", "born": "[Tempat, Tgl Lahir]", "address": "[Alamat lengkap ketua]"},
    "anggota1": {"name": "Oki Handinata, S.Si.", "role": "Anggota", "born": "[Tempat, Tgl Lahir]", "address": "[Alamat lengkap anggota 1]"},
    "anggota2": {"name": "Martha Martinni, S.Si.", "role": "Anggota", "born": "[Tempat, Tgl Lahir]", "address": "[Alamat lengkap anggota 2]"},
}
GROUP = "Warisan Suara"
PRODUCT = "WARISAN SUARA — Platform AI Pelestarian Bahasa & Tradisi Lisan Nusantara"
CATEGORY = "Inovasi Digital"
EMAIL = "warisansuara.id@gmail.com"


def set_base_style(doc):
    """Set default font and spacing"""
    style = doc.styles["Normal"]
    style.font.name = "Times New Roman"
    style.font.size = Pt(12)
    style.paragraph_format.line_spacing = 1.5
    style.paragraph_format.space_after = Pt(0)
    # Set margins
    for section in doc.sections:
        section.top_margin = Cm(2.5)
        section.bottom_margin = Cm(2.5)
        section.left_margin = Cm(3)
        section.right_margin = Cm(2.5)


def add_centered_title(doc, text, size=14, bold=True):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = p.add_run(text)
    run.bold = bold
    run.font.size = Pt(size)
    run.font.name = "Times New Roman"
    p.paragraph_format.space_after = Pt(12)
    p.paragraph_format.space_before = Pt(6)
    return p


def add_body(doc, text, indent_first=True):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    run = p.add_run(text)
    run.font.size = Pt(12)
    run.font.name = "Times New Roman"
    p.paragraph_format.line_spacing = 1.5
    if indent_first:
        p.paragraph_format.first_line_indent = Cm(1.0)
    return p


def add_label_value(doc, label, value):
    """Add a labeled line: 'Nama : Febri Rizki'"""
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p.paragraph_format.line_spacing = 1.5
    p.paragraph_format.left_indent = Cm(0.5)
    run_label = p.add_run(f"{label:<20}: ")
    run_label.font.size = Pt(12)
    run_label.font.name = "Times New Roman"
    run_value = p.add_run(value)
    run_value.font.size = Pt(12)
    run_value.font.name = "Times New Roman"
    return p


def add_signature_block(doc, person, city_date="Jakarta, 25 Oktober 2026"):
    # City + date
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    run = p.add_run(city_date)
    run.font.size = Pt(12)
    run.font.name = "Times New Roman"
    p.paragraph_format.space_before = Pt(24)
    p.paragraph_format.space_after = Pt(6)

    # "Yang Menyatakan,"
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    run = p.add_run("Yang Menyatakan,")
    run.font.size = Pt(12)
    run.font.name = "Times New Roman"
    p.paragraph_format.space_after = Pt(6)

    # Materai placeholder
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    run = p.add_run("Tanda tangan bermaterai Rp10.000,-")
    run.font.size = Pt(11)
    run.font.name = "Times New Roman"
    run.italic = True
    p.paragraph_format.space_after = Pt(48)

    # Name
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    run = p.add_run(person["name"])
    run.bold = True
    run.font.size = Pt(12)
    run.font.name = "Times New Roman"

    # Role
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    role_text = f"{person['role']} Kelompok {GROUP}"
    run = p.add_run(role_text)
    run.font.size = Pt(12)
    run.font.name = "Times New Roman"


def add_footer_note(doc, note):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(24)
    run = p.add_run(note)
    run.italic = True
    run.font.size = Pt(10)
    run.font.name = "Times New Roman"
    run.font.color.rgb = RGBColor(0x66, 0x66, 0x66)


# ====== LAMPIRAN 3/4/5: Surat Pernyataan Mengikuti Kegiatan ======

def generate_surat_mengikuti(filename, person, lampiran_num):
    doc = Document()
    set_base_style(doc)

    add_centered_title(doc, "SURAT PERNYATAAN MENGIKUTI KEGIATAN", size=14, bold=True)

    add_body(doc, "Yang bertanda tangan dibawah ini:", indent_first=False)

    add_label_value(doc, "Nama", person["name"])
    add_label_value(doc, "Tempat/Tgl lahir", person["born"])
    add_label_value(doc, "Jabatan", person["role"])
    add_label_value(doc, "Kategori", CATEGORY)
    add_label_value(doc, "Nama Kelompok", GROUP)
    add_label_value(doc, "Nama Produk", PRODUCT)
    add_label_value(doc, "Alamat", person["address"])

    add_body(doc, f'Menyatakan bahwa saya {person["name"]} akan mengikuti kegiatan BUDAYA GO! tahun 2026 dalam setiap tahapan sampai selesai, dan apabila hal tersebut di atas tidak benar adanya, maka kami bersedia menerima sanksi sesuai ketentuan yang berlaku dan mengembalikan dana yang diterima.')

    add_body(doc, 'Demikian surat pernyataan ini dibuat dengan sebenarnya, agar dapat dipergunakan sebagai kelengkapan administrasi calon peserta BUDAYA GO! tahun 2026, Direktorat Pengembangan Budaya Digital, Direktorat Jenderal Pengembangan, Pemanfaatan, dan Pembinaan Kebudayaan, Kementerian Kebudayaan Republik Indonesia.')

    add_signature_block(doc, person)

    add_footer_note(doc, f"*Coret yang tidak perlu\n*Setiap peserta (termasuk anggota kelompok) wajib mengisi Surat Pernyataan Mengikuti Kegiatan\n*File ini adalah Lampiran {lampiran_num} dari Juknis BUDAYA GO! 2026")

    doc.save(os.path.join(OUT_DIR, filename))
    print(f"  ✓ {filename}")


# ====== LAMPIRAN 6: Surat Pernyataan Orisinalitas Produk ======

def generate_surat_orisinalitas():
    doc = Document()
    set_base_style(doc)
    person = TEAM["ketua"]

    add_centered_title(doc, "SURAT PERNYATAAN ORISINALITAS PRODUK PESERTA", size=14, bold=True)

    add_body(doc, "Yang bertanda tangan dibawah ini:", indent_first=False)

    add_label_value(doc, "Nama", person["name"])
    add_label_value(doc, "Tempat/Tgl lahir", person["born"])
    add_label_value(doc, "Jabatan", "Ketua Kelompok")
    add_label_value(doc, "Kategori", CATEGORY)
    add_label_value(doc, "Nama Kelompok", GROUP)
    add_label_value(doc, "Nama Produk", PRODUCT)
    add_label_value(doc, "Alamat", person["address"])

    add_body(doc, f'Menyatakan bahwa saya {person["name"]} bertanggung jawab terhadap hak intelektual terkait produk budaya yang diajukan pada kegiatan BUDAYA GO! tahun 2026, dan apabila dikemudian hari ternyata ditemukan pelanggaran hak intelektual atas produk tersebut, maka sepenuhnya akan menjadi tanggung jawab kelompok.')

    add_body(doc, 'Demikian surat pernyataan ini dibuat dengan sebenarnya, agar dapat dipergunakan sebagai kelengkapan administrasi calon peserta BUDAYA GO! tahun 2026, Direktorat Pengembangan Budaya Digital, Direktorat Jenderal Pengembangan, Pemanfaatan, dan Pembinaan Kebudayaan, Kementerian Kebudayaan Republik Indonesia.')

    add_signature_block(doc, person)

    add_footer_note(doc, "*File ini adalah Lampiran 6 dari Juknis BUDAYA GO! 2026")

    doc.save(os.path.join(OUT_DIR, "Lampiran-6-Surat-Pernyataan-Orisinalitas-Produk.docx"))
    print("  ✓ Lampiran-6-Surat-Pernyataan-Orisinalitas-Produk.docx")


# ====== LAMPIRAN 7: Surat Pernyataan Bebas Konflik Kepentingan dan Lisensi ======

def generate_surat_bebas_konflik():
    doc = Document()
    set_base_style(doc)
    person = TEAM["ketua"]

    add_centered_title(doc, "SURAT PERNYATAAN BEBAS KONFLIK KEPENTINGAN DAN LISENSI", size=13, bold=True)

    add_body(doc, "Saya yang bertanda tangan dibawah ini:", indent_first=False)

    add_label_value(doc, "Nama", person["name"])
    add_label_value(doc, "Tempat/Tgl lahir", person["born"])
    add_label_value(doc, "Jabatan", "Ketua Kelompok")
    add_label_value(doc, "Kategori", CATEGORY)
    add_label_value(doc, "Nama Kelompok", GROUP)
    add_label_value(doc, "Nama Produk", PRODUCT)
    add_label_value(doc, "Alamat", person["address"])

    # Bagian 1
    add_centered_title(doc, "Bagian 1: Pernyataan Konflik Kepentingan (KIK)", size=12, bold=True)

    add_body(doc, 'Kami, yang bertanda tangan di bawah ini ("Peserta"), dengan ini menyatakan pemahaman penuh bahwa konflik kepentingan (KIK) mencakup situasi apa pun di mana kepentingan finansial, profesional, atau pribadi (termasuk hubungan keluarga atau pertemanan dekat) dapat memengaruhi atau tampak memengaruhi objektivitas dan penilaian yang tidak memihak dalam kompetisi ini. Ini termasuk, namun tidak terbatas pada, hubungan dengan:')

    bullets = [
        "Anggota Dewan Juri",
        "Panitia Penyelenggara",
        "Karyawan atau pejabat dari entitas penyelenggara",
        "Bagian Teknologi, Hak Kekayaan Intelektual dan perangkat yang digunakan",
    ]
    for b in bullets:
        p = doc.add_paragraph(b, style="List Bullet")
        p.paragraph_format.line_spacing = 1.5
        for run in p.runs:
            run.font.size = Pt(12)
            run.font.name = "Times New Roman"

    add_body(doc, 'Untuk menjaga integritas, keadilan, dan transparansi kompetisi, Kami dengan ini menyatakan (beri tanda centang [√] atau [X] pada salah satu kotak):')

    # Checkbox options
    add_body(doc, '[ ] TIDAK MEMILIKI', indent_first=False)
    add_body(doc, 'Saya menyatakan bahwa, sepanjang pengetahuan Saya, tidak ada anggota tim Saya/Kami yang memiliki konflik kepentingan, baik yang aktual, potensial, maupun yang dipersepsikan, dengan pihak-pihak yang disebutkan di atas.')

    add_body(doc, '[ ] MEMILIKI', indent_first=False)
    add_body(doc, 'Saya menyatakan bahwa terdapat potensi konflik kepentingan. Saya wajib menjelaskan secara rinci sifat dari hubungan atau situasi tersebut di bawah ini agar dapat ditinjau oleh Panitia:')
    add_body(doc, '(Gunakan ruang ini untuk menjelaskan potensi KIK. Jika tidak cukup, gunakan lampiran terpisah)')

    add_body(doc, 'Saya memahami bahwa kegagalan untuk mengungkapkan konflik kepentingan yang relevan secara jujur dan lengkap dapat mengakibatkan diskualifikasi dari kompetisi.')

    # Bagian 2
    add_centered_title(doc, "Bagian 2: Perjanjian Lisensi dan Pembebasan Tuntutan", size=12, bold=True)

    add_body(doc, 'Dengan berpartisipasi dalam kompetisi ini, Peserta menyetujui ketentuan-ketentuan berikut:')

    # Pasal 1
    add_body(doc, 'Pasal 1: Kepemilikan Hak Kekayaan Intelektual (HKI)', indent_first=False)
    add_body(doc, 'Peserta dengan ini menyatakan dan menjamin bahwa Peserta adalah pemilik sah, atau memiliki izin yang sah untuk menggunakan, semua Hak Kekayaan Intelektual (HKI) yang terkait dengan proyek/inovasi yang diajukan. Penyelenggara tidak mengklaim kepemilikan atas HKI inti dari proyek/inovasi yang dikompetisikan oleh Peserta. Kepemilikan HKI tetap menjadi milik Peserta.')

    # Pasal 2
    add_body(doc, 'Pasal 2: Pemberian Lisensi Promosi', indent_first=False)
    add_body(doc, 'Peserta memberikan kepada Penyelenggara dan afiliasinya lisensi yang bersifat non-eksklusif, bebas royalti (royalty-free), berlaku di seluruh dunia, dan tidak dapat ditarik kembali untuk menggunakan, memproduksi, mendistribusikan, dan menampilkan materi-materi berikut:')
    for b in [
        "Nama produk peserta Kelompok, logo produk Kelompok (jika ada), dan foto/video/gambar Peserta.",
        "Judul dan deskripsi singkat proyek/inovasi (yang bersifat non-rahasia).",
        "Materi video, foto, atau presentasi yang diambil selama berlangsungnya acara kompetisi (termasuk sesi penjurian dan penganugerahan).",
    ]:
        p = doc.add_paragraph(b, style="List Bullet")
        p.paragraph_format.line_spacing = 1.5
        for run in p.runs:
            run.font.size = Pt(12)
            run.font.name = "Times New Roman"
    add_body(doc, 'Penggunaan ini terbatas untuk tujuan promosi, publikasi, dokumentasi, edukasi, dan pelaporan media terkait kompetisi ini dan kompetisi serupa di masa depan, baik dalam format cetak maupun digital (termasuk situs web dan media sosial).')

    # Pasal 3
    add_body(doc, 'Pasal 3: Pernyataan Keaslian dan Ganti Rugi', indent_first=False)
    add_body(doc, 'Peserta menjamin bahwa seluruh materi, ide, dan komponen proyek/inovasi yang diajukan adalah karya asli peserta atau telah memperoleh izin yang sah dari pihak ketiga, dan tidak melanggar hak cipta, paten, merek dagang, rahasia dagang, atau HKI lainnya milik pihak ketiga mana pun.')
    add_body(doc, 'Peserta setuju untuk membela, mengganti rugi, dan membebaskan penyelenggara, juri, sponsor, dan mitra terkait ("Pihak Terkait") dari dan terhadap segala klaim, tuntutan, kerugian, kerusakan, biaya (termasuk biaya hukum yang wajar) yang timbul dari atau terkait dengan pelanggaran HKI pihak ketiga yang disebabkan oleh proyek/inovasi Peserta.')

    # Pasal 4
    add_body(doc, 'Pasal 4: Pembebasan dari Tuntutan (Sanggahan)', indent_first=False)
    add_body(doc, 'Peserta memahami dan menerima risiko yang terkait dengan partisipasi dalam kompetisi. Peserta dengan ini melepaskan dan membebaskan Pihak Terkait dari segala bentuk tuntutan, klaim, kewajiban, kerusakan, atau kerugian (baik langsung maupun tidak langsung), termasuk namun tidak terbatas pada:')
    for b in [
        "Kehilangan data, kerusakan prototipe, atau kerugian finansial yang mungkin timbul selama partisipasi.",
        "Cedera pribadi atau kerusakan properti yang terjadi selama acara kompetisi.",
        "Tuntutan terkait pencemaran nama baik, pelanggaran privasi, atau publisitas.",
        "Pengungkapan informasi rahasia yang tidak disengaja oleh pihak ketiga (misalnya, peserta lain atau audiens).",
    ]:
        p = doc.add_paragraph(b, style="List Bullet")
        p.paragraph_format.line_spacing = 1.5
        for run in p.runs:
            run.font.size = Pt(12)
            run.font.name = "Times New Roman"
    add_body(doc, 'Pembebasan ini berlaku sejauh yang diizinkan oleh hukum dan tidak berlaku untuk kerugian yang disebabkan oleh kelalaian berat (gross negligence) atau kesalahan yang disengaja (wilful misconduct) oleh pihak penyelenggara.')

    # Pasal 5
    add_body(doc, 'Pasal 5: Kerahasiaan', indent_first=False)
    add_body(doc, 'Penyelenggara akan berupaya wajar untuk menangani materi yang ditandai "Rahasia" oleh peserta dengan hati-hati. Namun, peserta memahami bahwa beberapa aspek kompetisi (seperti presentasi final) mungkin bersifat publik. Penyelenggara tidak bertanggung jawab atas pengungkapan informasi rahasia yang terjadi di luar kendali wajar penyelenggara atau yang diungkapkan oleh peserta sendiri dan atau oleh pihak ketiga.')

    # Persetujuan
    add_centered_title(doc, "Persetujuan dan Tanda Tangan", size=12, bold=True)
    add_body(doc, 'Kami, sebagai perwakilan sah dari peserta kelompok yang disebutkan di atas, menyatakan bahwa Kami telah membaca, memahami, dan menyetujui seluruh ketentuan yang tercantum dalam dokumen ini, termasuk pernyataan Konflik Kepentingan dan Perjanjian Lisensi serta Pembebasan Tuntutan.')
    add_body(doc, 'Kami menyatakan bahwa informasi yang diberikan adalah benar dan akurat.')

    add_signature_block(doc, person)

    add_footer_note(doc, "*File ini adalah Lampiran 7 dari Juknis BUDAYA GO! 2026\n*Format dan substansi mengikuti Juknis BUDAYA GO! 2026 Lampiran 7")

    doc.save(os.path.join(OUT_DIR, "Lampiran-7-Surat-Pernyataan-Bebas-Konflik-Kepentingan-Lisensi.docx"))
    print("  ✓ Lampiran-7-Surat-Pernyataan-Bebas-Konflik-Kepentingan-Lisensi.docx")


# Generate all 5
print("Generating 5 Surat Pernyataan for BUDAYA GO! 2026...")

generate_surat_mengikuti("Lampiran-3-Surat-Pernyataan-Ketua-Febri-Rizki.docx", TEAM["ketua"], 3)
generate_surat_mengikuti("Lampiran-4-Surat-Pernyataan-Anggota1-Oki-Handinata.docx", TEAM["anggota1"], 4)
generate_surat_mengikuti("Lampiran-5-Surat-Pernyataan-Anggota2-Martha-Martinni.docx", TEAM["anggota2"], 5)
generate_surat_orisinalitas()
generate_surat_bebas_konflik()

print("\nAll 5 Surat Pernyataan generated successfully!")
print(f"Output: {OUT_DIR}")
