// Proposal BUDAYA GO! 2026 — Warisan Suara
// Generates: download/Proposal-Warisan-Suara-BUDAYAGO2026.docx
// Cover Recipe: R4 (Top Color Block) + Palette GO-1 (Graphite Orange)

import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  ImageRun, PageBreak, Header, Footer, PageNumber, NumberFormat,
  AlignmentType, HeadingLevel, WidthType, BorderStyle, ShadingType,
  PageOrientation, TableLayoutType, SectionType, TableOfContents,
  VerticalAlign, LevelFormat,
} from "docx";
import fs from "fs";
import path from "path";
import { imageSize } from "image-size";

// ───────────────────────────────────────────────────────────
// PALETTE: GO-1 Graphite Orange (proposals / bidding / PRD)
// ───────────────────────────────────────────────────────────
const P = {
  bg: "1A2330",
  primary: "FFFFFF",
  accent: "D4875A",
  body: "1F2A38",
  secondary: "5B6B7D",
  surface: "F8F0EB",
  table: {
    headerBg: "D4875A",
    headerText: "FFFFFF",
    accentLine: "D4875A",
    innerLine: "DDD0C8",
    surface: "F8F0EB",
  },
  cover: {
    titleColor: "FFFFFF",
    subtitleColor: "B0B8C0",
    metaColor: "90989F",
    footerColor: "687078",
  },
};

// ───────────────────────────────────────────────────────────
// COVER RECIPE R4 — Top Color Block (mandatory architecture)
// ───────────────────────────────────────────────────────────
const NB = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: NB, bottom: NB, left: NB, right: NB };
const allNoBorders = {
  top: NB, bottom: NB, left: NB, right: NB,
  insideHorizontal: NB, insideVertical: NB,
};
const emptyPara = () => new Paragraph({ children: [] });

function splitTitleLines(title, charsPerLine) {
  if (title.length <= charsPerLine) return [title];
  const breakAfter = new Set([..." \t-_—–/:.,;"]);
  const lines = [];
  let remaining = title;
  while (remaining.length > charsPerLine) {
    let breakAt = -1;
    for (let i = charsPerLine; i >= Math.floor(charsPerLine * 0.6); i--) {
      if (i < remaining.length && breakAfter.has(remaining[i - 1])) { breakAt = i; break; }
    }
    if (breakAt === -1) {
      const limit = Math.min(remaining.length, Math.ceil(charsPerLine * 1.3));
      for (let i = charsPerLine + 1; i < limit; i++) {
        if (breakAfter.has(remaining[i - 1])) { breakAt = i; break; }
      }
    }
    if (breakAt === -1) breakAt = charsPerLine;
    lines.push(remaining.slice(0, breakAt).trim());
    remaining = remaining.slice(breakAt).trim();
  }
  if (remaining) lines.push(remaining);
  if (lines.length > 1 && lines[lines.length - 1].length <= 2) {
    const last = lines.pop();
    lines[lines.length - 1] += last;
  }
  return lines;
}

function calcTitleLayout(title, maxWidthTwips, preferredPt = 40, minPt = 26) {
  const charWidth = (pt) => pt * 11; // Latin width ~55% of pt*20
  const charsPerLine = (pt) => Math.floor(maxWidthTwips / charWidth(pt));
  let titlePt = preferredPt;
  let lines;
  while (titlePt >= minPt) {
    const cpl = charsPerLine(titlePt);
    if (cpl < 2) { titlePt -= 2; continue; }
    lines = splitTitleLines(title, cpl);
    if (lines.length <= 3) break;
    titlePt -= 2;
  }
  if (!lines || lines.length > 3) {
    const cpl = charsPerLine(minPt);
    lines = splitTitleLines(title, cpl);
    titlePt = minPt;
  }
  return { titlePt, titleLines: lines };
}

function buildCoverR4(config) {
  const padL = 1200, padR = 800;
  const availableWidth = 11906 - padL - padR;
  const { titlePt, titleLines } = calcTitleLayout(config.title, availableWidth, 44, 28);
  const titleSize = titlePt * 2;

  const titleBlockHeight = titleLines.length * (titlePt * 23 + 200);
  const englishLabelH = config.englishLabel ? (9 * 23 + 500) : 0;
  const subtitleH = config.subtitle ? (12 * 23 + 200) : 0;
  const upperContentH = englishLabelH + titleBlockHeight + subtitleH;
  const UPPER_MIN = 7500;
  const UPPER_H = Math.max(UPPER_MIN, upperContentH + 1500 + 800);
  const DIVIDER_H = 60;

  const contentEstimate =
    (config.englishLabel ? (9 * 23 + 500) : 0) +
    titleLines.length * (titlePt * 23 + 200) +
    (config.subtitle ? (12 * 23 + 200) : 0);
  const spacerIntrinsic = 280;
  const topSpacing = Math.max(UPPER_H - contentEstimate - spacerIntrinsic - 800, 400);

  const upperBlock = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    borders: allNoBorders,
    rows: [new TableRow({
      height: { value: UPPER_H, rule: "exact" },
      children: [new TableCell({
        shading: { type: ShadingType.CLEAR, fill: P.bg },
        borders: noBorders,
        verticalAlign: VerticalAlign.TOP,
        margins: { left: padL, right: padR },
        children: [
          new Paragraph({ spacing: { before: topSpacing } }),
          config.englishLabel ? new Paragraph({
            spacing: { after: 500 },
            children: [new TextRun({
              text: config.englishLabel.split("").join(" "),
              size: 18, color: P.accent,
              font: { ascii: "Calibri" },
              characterSpacing: 60,
            })],
          }) : null,
          ...titleLines.map((line, i) => new Paragraph({
            spacing: {
              line: Math.ceil(titlePt * 23),
              lineRule: "atLeast",
              after: i < titleLines.length - 1 ? 100 : 200,
            },
            children: [new TextRun({
              text: line, size: titleSize, bold: true,
              color: P.cover.titleColor,
              font: { ascii: "Arial" },
            })],
          })),
          config.subtitle ? new Paragraph({
            spacing: { after: 100, line: 360, lineRule: "atLeast" },
            children: [new TextRun({
              text: config.subtitle, size: 24,
              color: P.cover.subtitleColor,
              font: { ascii: "Arial" },
              italics: true,
            })],
          }) : null,
        ].filter(Boolean),
      })],
    })],
  });

  const divider = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: allNoBorders,
    rows: [new TableRow({
      height: { value: DIVIDER_H, rule: "exact" },
      children: [new TableCell({
        borders: noBorders,
        shading: { type: ShadingType.CLEAR, fill: P.accent },
        children: [emptyPara()],
      })],
    })],
  });

  const lowerContent = [
    new Paragraph({ spacing: { before: 800 } }),
    ...(config.metaLines || []).map(line =>
      line === "" ? new Paragraph({ spacing: { after: 60 }, children: [] })
      : new Paragraph({
        indent: { left: padL },
        spacing: { after: 100, line: 300, lineRule: "atLeast" },
        children: [new TextRun({
          text: line, size: 24,
          color: P.cover.metaColor,
          font: { ascii: "Arial" },
        })],
      })
    ),
    new Paragraph({ spacing: { before: 2000 } }),
    new Paragraph({
      indent: { left: padL },
      children: [
        new TextRun({ text: config.footerLeft || "", size: 22, color: "909090", font: { ascii: "Arial" } }),
        new TextRun({ text: "          " }),
        new TextRun({ text: config.footerRight || "", size: 22, color: "909090", font: { ascii: "Arial" } }),
      ],
    }),
  ];

  return [new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    borders: allNoBorders,
    rows: [new TableRow({
      height: { value: 16838, rule: "exact" },
      children: [new TableCell({
        shading: { type: ShadingType.CLEAR, fill: "FFFFFF" },
        borders: noBorders,
        verticalAlign: VerticalAlign.TOP,
        children: [upperBlock, divider, ...lowerContent],
      })],
    })],
  })];
}

// ───────────────────────────────────────────────────────────
// HELPERS for body content
// ───────────────────────────────────────────────────────────
const FONT = { ascii: "Calibri", eastAsia: "Microsoft YaHei" };
const FONT_HEAD = { ascii: "Calibri", eastAsia: "SimHei" };

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 180, line: 312 },
    keepNext: true,
    children: [new TextRun({
      text, bold: true, size: 32,
      color: P.body, font: FONT_HEAD,
    })],
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 120, line: 312 },
    keepNext: true,
    children: [new TextRun({
      text, bold: true, size: 28,
      color: P.body, font: FONT_HEAD,
    })],
  });
}

function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 100, line: 312 },
    keepNext: true,
    children: [new TextRun({
      text, bold: true, size: 24,
      color: P.body, font: FONT_HEAD,
    })],
  });
}

function p(text, opts = {}) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    indent: { firstLine: 480 },
    spacing: { line: 312, after: 80 },
    children: [new TextRun({
      text, size: 22, color: "000000", font: FONT, ...opts,
    })],
  });
}

// Paragraph with mixed runs (for bold inline)
function pRuns(runs, opts = {}) {
  const children = runs.map(r =>
    typeof r === "string"
      ? new TextRun({ text: r, size: 22, color: "000000", font: FONT })
      : new TextRun({ size: 22, color: "000000", font: FONT, ...r })
  );
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    indent: { firstLine: opts.indent === false ? 0 : 480 },
    spacing: { line: 312, after: 80 },
    children,
  });
}

// Bullet item (no first-line indent)
function bullet(text, level = 0) {
  return new Paragraph({
    bullet: { level },
    spacing: { line: 312, after: 60 },
    children: [new TextRun({ text, size: 22, color: "000000", font: FONT })],
  });
}

function bulletRuns(runs, level = 0) {
  const children = runs.map(r =>
    typeof r === "string"
      ? new TextRun({ text: r, size: 22, color: "000000", font: FONT })
      : new TextRun({ size: 22, color: "000000", font: FONT, ...r })
  );
  return new Paragraph({
    bullet: { level },
    spacing: { line: 312, after: 60 },
    children,
  });
}

// Caption for figures (centered, italic)
function caption(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 80, after: 240, line: 312 },
    children: [new TextRun({
      text, size: 20, italics: true,
      color: P.secondary, font: FONT,
    })],
  });
}

// Build an image paragraph with aspect ratio preserved
function imageParagraph(imgPath, maxW = 350, maxH = 1500) {
  const buf = fs.readFileSync(imgPath);
  const dim = imageSize(buf);
  const origW = dim.width;
  const origH = dim.height;
  const scale = Math.min(maxW / origW, maxH / origH, 1);
  const w = Math.round(origW * scale);
  const h = Math.round(origH * scale);
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 80 },
    children: [new ImageRun({
      data: buf,
      transformation: { width: w, height: h },
      type: "png",
    })],
  });
}

// Table helpers
function thCell(text, widthPct, opts = {}) {
  return new TableCell({
    width: { size: widthPct, type: WidthType.PERCENTAGE },
    shading: { type: ShadingType.CLEAR, fill: P.table.headerBg },
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({
      alignment: opts.align || AlignmentType.LEFT,
      spacing: { line: 280 },
      children: [new TextRun({
        text, bold: true, size: 21,
        color: P.table.headerText, font: FONT_HEAD,
      })],
    })],
  });
}

function tdCell(text, widthPct, opts = {}) {
  const runs = Array.isArray(text)
    ? text.map(r => typeof r === "string"
        ? new TextRun({ text: r, size: 20, color: "000000", font: FONT })
        : new TextRun({ size: 20, color: "000000", font: FONT, ...r }))
    : [new TextRun({ text, size: 20, color: "000000", font: FONT, bold: opts.bold })];
  return new TableCell({
    width: { size: widthPct, type: WidthType.PERCENTAGE },
    shading: opts.shade ? { type: ShadingType.CLEAR, fill: P.table.surface } : undefined,
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    verticalAlign: VerticalAlign.TOP,
    children: [new Paragraph({
      alignment: opts.align || AlignmentType.LEFT,
      spacing: { line: 280 },
      children: runs,
    })],
  });
}

function tableBorders() {
  return {
    top: { style: BorderStyle.SINGLE, size: 6, color: P.table.accentLine },
    bottom: { style: BorderStyle.SINGLE, size: 6, color: P.table.accentLine },
    left: { style: BorderStyle.SINGLE, size: 2, color: P.table.innerLine },
    right: { style: BorderStyle.SINGLE, size: 2, color: P.table.innerLine },
    insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: P.table.innerLine },
    insideVertical: { style: BorderStyle.SINGLE, size: 1, color: P.table.innerLine },
  };
}

// ───────────────────────────────────────────────────────────
// DOCUMENT HEADER BLOCK (top of body, per template format)
// ───────────────────────────────────────────────────────────
function headerBlock() {
  const out = [];
  // "Lampiran 1: ..." label
  out.push(new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { after: 200, line: 312 },
    children: [new TextRun({
      text: "Lampiran 1: Panduan dan Format Penulisan Proposal BUDAYAGO! 2026",
      bold: true, size: 24, color: P.body, font: FONT_HEAD,
    })],
  }));

  // Title (centered, bold, larger)
  out.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 200, line: 360, lineRule: "atLeast" },
    children: [new TextRun({
      text: "WARISAN SUARA: Platform AI Pelestarian Bahasa & Tradisi Lisan Nusantara",
      bold: true, size: 32, color: P.body, font: FONT_HEAD,
    })],
  }));

  // Authors line
  out.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 80, line: 312 },
    children: [new TextRun({
      text: "Febri Rizki, S.Si., M.Si.\u00b9, Oki Handinata, S.Si.\u00b2, Martha Martinni, S.Si.\u00b3",
      size: 22, color: "000000", font: FONT,
    })],
  }));

  // Affiliations
  const affil = (sup, text) => new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { after: 40, line: 280 },
    indent: { left: 720 },
    children: [new TextRun({ text: sup, size: 20, color: "000000", font: FONT }), new TextRun({ text: text, size: 20, color: "000000", font: FONT })],
  });
  out.push(affil("\u00b9", "Warisan Suara Team, Jakarta"));
  out.push(affil("\u00b2", "Warisan Suara Team, Bandung"));
  out.push(affil("\u00b3", "Warisan Suara Team, Yogyakarta"));

  // Email
  out.push(new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { after: 200, line: 312 },
    children: [new TextRun({
      text: "Email korespondensi: warisansuara.id@gmail.com",
      size: 22, color: "000000", font: FONT,
    })],
  }));

  // BUDAYA GO! footer block
  out.push(new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { after: 40, line: 312 },
    children: [new TextRun({
      text: "BUDAYA GO! 2026 | Kompetisi Inovasi Budaya Indonesia",
      bold: true, size: 22, color: P.body, font: FONT,
    })],
  }));
  out.push(new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { after: 40, line: 312 },
    children: [new TextRun({
      text: "Tema: Indonesia Cultural Power",
      size: 22, color: "000000", font: FONT,
    })],
  }));
  out.push(new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { after: 360, line: 312 },
    children: [new TextRun({
      text: "Subtema: Inventing the Future from Indonesian Culture",
      size: 22, color: "000000", font: FONT,
    })],
  }));

  // Horizontal accent rule
  out.push(new Paragraph({
    spacing: { after: 240 },
    border: { top: { style: BorderStyle.SINGLE, size: 12, color: P.accent, space: 8 } },
    children: [],
  }));

  return out;
}

// ───────────────────────────────────────────────────────────
// SECTION 1: Identitas Kelompok
// ───────────────────────────────────────────────────────────
function section1() {
  const out = [h1("1. Identitas Kelompok")];
  out.push(p(
    "Bentuk kepesertaan yang dipilih oleh tim WARISAN SUARA pada Kompetisi Inovasi Budaya Indonesia BUDAYA GO! 2026 adalah kelompok, sesuai dengan ketentuan dalam Petunjuk Teknis. Seluruh identitas yang tertera pada proposal ini telah didaftarkan melalui situs resmi BUDAYA GO! 2026 dan konsisten dengan data pada formulir pendaftaran, video showcase, slide deck presentasi, serta tautan demonstrasi produk purwarupa yang dapat diverifikasi oleh panitia."
  ));

  out.push(bulletRuns([{ text: "Nama produk kelompok: ", bold: true }, "WARISAN SUARA"]));
  out.push(bulletRuns([{ text: "Kategori inovasi: ", bold: true }, "Inovasi Digital"]));
  out.push(bulletRuns([{ text: "Nama ketua kelompok: ", bold: true }, "Febri Rizki, S.Si., M.Si."]));
  out.push(bulletRuns([{ text: "Email aktif: ", bold: true }, "warisansuara.id@gmail.com"]));
  out.push(bulletRuns([{ text: "Nomor WhatsApp aktif: ", bold: true }, "0812-XXXX-XXXX (aktif, terdaftar pada formulir pendaftaran)"]));
  out.push(bulletRuns([{ text: "Asal daerah/institusi/komunitas/usaha: ", bold: true }, "Indonesia / Warisan Suara Team (Jakarta, Bandung, Yogyakarta)"]));

  out.push(new Paragraph({
    spacing: { before: 200, after: 120, line: 312 },
    children: [new TextRun({ text: "Anggota Kelompok:", bold: true, size: 22, color: P.body, font: FONT_HEAD })],
  }));
  out.push(bulletRuns(["Febri Rizki, S.Si., M.Si. \u2013 AI Engineer & Web App Developer \u2013 Ketua. Bertanggung jawab atas arsitektur sistem berbasis Cloudflare Workers AI, integrasi model Llama 3.1, Whisper ASR, dan MeloTTS, serta pengembangan aplikasi web Next.js 16."]));
  out.push(bulletRuns(["Oki Handinata, S.Si. \u2013 UI/UX Designer \u2013 Anggota. Bertanggung jawab atas desain antarmuka, komponen shadcn/ui, peta bahasa interaktif, studio rekam, dan pengalaman pengguna mobile PWA."]));
  out.push(bulletRuns(["Martha Martinni, S.Si. \u2013 Strategi Startup & Model Bisnis \u2013 Anggota. Bertanggung jawab atas Business Model Canvas, segmentasi pasar B2G/B2B/B2C, strategi kemitraan dengan pemda dan sekolah, serta proyeksi finansial."]));

  out.push(p(
    "Jumlah dan persyaratan anggota telah mengikuti ketentuan dalam Juknis BUDAYA GO! 2026. Tim memiliki tiga anggota dengan peran dan keahlian yang saling melengkapi di antara rekayasa perangkat lunak, desain pengalaman pengguna, dan strategi komersialisasi. Seluruh anggota berdomisili di Indonesia dan terdaftar sebagai Warga Negara Indonesia."
  ));

  return out;
}

// ───────────────────────────────────────────────────────────
// SECTION 2: Nama Produk Inovasi
// ───────────────────────────────────────────────────────────
function section2() {
  const out = [h1("2. Nama Produk Inovasi")];
  out.push(p(
    "Nama produk inovasi yang didaftarkan pada formulir pendaftaran BUDAYA GO! 2026 adalah \u201cWARISAN SUARA: Platform AI untuk Pelestarian Bahasa & Tradisi Lisan Nusantara.\u201d Nama produk ini konsisten pada proposal, demonstrasi produk di warisan-suara.pages.dev, video showcase, slide deck presentasi, serta seluruh dokumen pendukung lainnya."
  ));
  out.push(p(
    "WARISAN SUARA adalah platform web dan mobile berbasis kecerdasan buatan yang berfungsi untuk mendokumentasikan, mengarsipkan, dan menghidupkan kembali bahasa daerah serta tradisi lisan Nusantara. Sasaran pengguna produk meliputi pemerintah daerah yang membutuhkan basis data bahasa, sekolah dan pendidik yang membutuhkan materi ajar bahasa daerah, peneliti linguistik dan antropologi, serta masyarakat umum dan komunitas adat pemilik pengetahuan tradisional."
  ));
  out.push(p(
    "Nilai utama produk terletak pada integrasi tiga Objek Pemajuan Kebudayaan sekaligus, yakni Tradisi Lisan, Manuskrip, dan Bahasa, ke dalam satu platform digital yang dapat diakses publik. Pencapaian yang telah diraih meliputi purwarupa fungsional yang sudah live dengan sepuluh bahasa daerah terdata, dua puluh tradisi lisan terdokumentasi, dan delapan modul pembelajaran yang siap digunakan oleh pengguna terdaftar."
  ));
  return out;
}

// ───────────────────────────────────────────────────────────
// SECTION 3: Kategori dan Sub tema Inovasi
// ───────────────────────────────────────────────────────────
function section3() {
  const out = [h1("3. Kategori dan Sub tema Inovasi")];
  out.push(p(
    "Tim WARISAN SUARA memilih Kategori Inovasi Digital karena produk berupa platform web dan mobile yang memanfaatkan kecerdasan buatan, basis data, dan teknologi tepi Cloudflare untuk mengembangkan pengetahuan, pengalaman, layanan, dan ekosistem budaya. Pilihan ini sesuai dengan karakteristik produk yang menjawab kebutuhan dokumentasi dan pengelolaan data bahasa serta cerita Nusantara, edukasi budaya, dan pemberdayaan komunitas pelaku tradisi lisan."
  ));
  out.push(p(
    "Sub Tema yang dipilih adalah Sub Tema Nomor 4 \u2013 Pembelajaran dan Edukasi Digital Berbasis Budaya (Inovasi Digital). Pilihan subtema ini didasarkan pada karakter produk yang mengembangkan platform pembelajaran bahasa daerah dan tradisi lisan dengan sistem pembelajaran adaptif berbasis Llama 3.1, media interaktif berbasis MeloTTS, serta modul pembelajaran yang dapat diakses publik dan dikonsumsi oleh sekolah maupun individu."
  ));

  out.push(new Paragraph({
    keepNext: true,
    spacing: { before: 240, after: 120, line: 312 },
    children: [new TextRun({
      text: "Tabel 1. Pilihan Sub Tema per Kategori (Inovasi Digital)",
      bold: true, size: 21, color: P.body, font: FONT_HEAD,
    })],
  }));

  const rows = [
    new TableRow({
      tableHeader: true, cantSplit: true,
      children: [
        thCell("No", 8, { align: AlignmentType.CENTER }),
        thCell("Inovasi Digital", 46),
        thCell("Inovasi Purwarupa", 46),
      ],
    }),
    ...[
      ["1", "Solusi Digital untuk Industri Budaya", "Kuliner Nusantara"],
      ["2", "Digital Commerce dan Ekonomi Budaya", "Kriya Nusantara"],
      ["3", "Pengalaman Digital Wisata Budaya", "Fesyen Nusantara"],
      ["4", "Pembelajaran dan Edukasi Digital Berbasis Budaya (DIPILIH)", "Produk Edukasi Berbasis Budaya"],
      ["5", "Platform Digital untuk Komunitas Budaya", "Aroma dan Perawatan Berbasis Budaya Nusantara"],
    ].map((row) => new TableRow({
      cantSplit: true,
      children: [
        tdCell(row[0], 8, { align: AlignmentType.CENTER, bold: row[0] === "4", shade: row[0] === "4" }),
        tdCell([{ text: row[1], bold: row[0] === "4" }], 46, { shade: row[0] === "4" }),
        tdCell(row[2], 46, { shade: row[0] === "4" }),
      ],
    })),
  ];

  out.push(new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    borders: tableBorders(),
    rows,
  }));

  out.push(p(
    "Baris nomor 4 ditandai sebagai pilihan tim WARISAN SUARA. Produk secara konkret menjawab kebutuhan akses, kualitas, dan efektivitas pembelajaran budaya melalui platform pembelajaran bahasa daerah, sistem pembelajaran adaptif berbasis AI Tutor, serta media interaktif untuk pengenalan dan pelestarian pengetahuan budaya."
  ));
  return out;
}

// ───────────────────────────────────────────────────────────
// SECTION 4: Ringkasan Eksekutif (Abstract)
// ───────────────────────────────────────────────────────────
function section4() {
  const out = [h1("4. Ringkasan Eksekutif (Abstract)")];
  out.push(p(
    "Indonesia memiliki lebih dari 700 bahasa daerah yang tersebar di seluruh kepulauan Nusantara, namun sekitar 25 persen di antaranya berada dalam status terancam punah menurut UNESCO Atlas of the World\u2019s Languages in Danger. Kondisi ini diperberat oleh berkurangnya penutur muda, terhentinya pewarisan tradisi lisan antargenerasi, serta minimnya dokumentasi digital yang dapat diakses publik. WARISAN SUARA hadir sebagai platform kecerdasan buatan yang menjawab permasalahan tersebut secara terstruktur dan berkelanjutan."
  ));
  out.push(p(
    "Unsur kebudayaan Indonesia yang menjadi dasar pengembangan produk meliputi tiga Objek Pemajuan Kebudayaan sekaligus, yakni Tradisi Lisan (Objek Pemajuan Nomor 1), Manuskrip (Objek Pemajuan Nomor 2), dan Bahasa (Objek Pemajuan Nomor 8). Sepuluh bahasa daerah dan dua puluh tradisi lisan telah terdata sebagai bahan baku platform, dengan penghormatan penuh terhadap hak, atribusi, dan persetujuan komunitas pemilik pengetahuan tradisional."
  ));
  out.push(p(
    "Solusi yang ditawarkan berupa platform web dan mobile dengan lima fitur utama: Peta Bahasa interaktif, Studio Rekam berbasis Whisper ASR untuk pengenalan suara, Modul Belajar berbasis MeloTTS untuk sintesis suara, Tutor AI berbasis Llama 3.1 untuk pembelajaran adaptif, dan Arsip Tradisi untuk dokumentasi tradisi lisan. Cara kerja produk adalah pengguna dapat menjelajahi peta bahasa, merekam suara mereka sendiri untuk validasi pengenalan, mengikuti modul pembelajaran adaptif, berdialog dengan AI Tutor dalam bahasa daerah, dan mengakses arsip tradisi lisan yang telah didigitalkan."
  ));
  out.push(p(
    "Sasaran pengguna produk meliputi empat segmen, yaitu pemerintah daerah (B2G) yang membutuhkan basis data bahasa untuk kebijakan publik, sekolah dan pendidik (B2B) yang membutuhkan materi ajar, individu dan pelajar (B2C) yang ingin belajar bahasa daerah, serta peneliti dan komunitas (B2B riset) yang membutuhkan data primer. Total potensi pengguna terdata mencapai 128,5 juta penutur bahasa daerah di seluruh Indonesia berdasarkan data BPS dan Badan Bahasa."
  ));
  out.push(p(
    "Keunikan dan nilai tambah produk terletak pada penggunaan Whisper ASR yang dikhususkan untuk bahasa daerah Indonesia, sebuah pendekatan yang belum diadopsi oleh kompetitor lain. Integrasi tiga Objek Pemajuan Kebudayaan dalam satu platform juga merupakan pendekatan baru di pasar edukasi budaya Indonesia. Arsitektur Cloudflare Workers AI memungkinkan inferensi model dilakukan di edge network terdekat dengan pengguna, menghasilkan latensi rendah dan biaya operasional yang efisien."
  ));
  out.push(p(
    "Dampak yang telah dicapai meliputi purwarupa fungsional yang sudah live di warisan-suara.pages.dev dengan sepuluh bahasa terdata, dua puluh tradisi terdokumentasi, dan delapan modul pembelajaran. Dampak yang diharapkan ke depan adalah peningkatan akses publik terhadap bahasa daerah, dokumentasi tradisi lisan yang sebelumnya hanya disimpan secara lisan, serta terciptanya ekonomi budaya baru bagi pelaku tradisi dan komunitas adat."
  ));
  out.push(p(
    "Kondisi aktual produk saat didaftarkan adalah purwarupa fungsional yang dapat diverifikasi. Fitur Peta Bahasa, Studio Rekam, Modul Belajar, Tutor AI, dan Arsip Tradisi telah berjalan dengan endpoint API Cloudflare Pages Functions yang aktif. Tingkat kesiapan produk adalah TRL 6-7, yaitu purwarupa yang telah diuji dalam lingkungan operasional nyata dengan pengguna terdaftar."
  ));
  out.push(p(
    "Model bisnis yang dirancang menggunakan Business Model Canvas dengan sembilan elemen, dengan revenue stream utama dari lisensi B2G ke pemerintah daerah, langganan B2B ke sekolah dan instansi pendidikan, freemium B2C untuk individu, dan lisensi data B2B untuk penelitian. Roadmap pengembangan mencakup jangka pendek 6-12 bulan dengan validasi pilot 50 penutur asli, jangka menengah 1-2 tahun dengan integrasi pemda dan mobile native, serta jangka panjang 3-5 tahun dengan target 100 bahasa, sertifikasi Kemendikbud, dan ekspansi ke pasar ASEAN serumpun seperti Filipina dan Malaysia."
  ));
  return out;
}

// ───────────────────────────────────────────────────────────
// SECTION 5: Latar Belakang dan Permasalahan
// ───────────────────────────────────────────────────────────
function section5() {
  const out = [h1("5. Latar Belakang dan Permasalahan")];
  out.push(h2("Konteks Budaya"));
  out.push(p(
    "Indonesia adalah rumah bagi lebih dari 700 bahasa daerah dan ribuan tradisi lisan yang tersebar dari Sabang sampai Merauke. Bahasa daerah dan tradisi lisan adalah dua sisi mata uang yang sama: bahasa adalah wadah, sedangkan tradisi lisan adalah isi. Sastra lisan seperti hikayat, pantun, mantra, nyanyian penganten, doa tolak bala, dan cerita rakyat hanya dapat dipahami sepenuhnya jika bahasa penuturnya tetap hidup. Kekayaan ini telah menjadi sumber inovasi WARISAN SUARA, sebab tanpa upaya dokumentasi yang sistematis, dua generasi ke depan banyak bahasa dan tradisi lisan ini akan hilang dari ingatan kolektif bangsa."
  ));

  out.push(h2("Permasalahan"));
  out.push(p(
    "Permasalahan utama yang dihadapi masyarakat, pelaku budaya, komunitas adat, dan pasar pendidikan adalah hilangnya penutur muda bahasa daerah, terhentinya pewarisan tradisi lisan antargenerasi, serta tidak tersedianya platform digital terpadu yang dapat dipakai untuk belajar, merekam, dan mengarsipkan bahasa daerah. Pelaku budaya dan maestro tradisi lisan yang berusia di atas 60 tahun meninggal tanpa pewara yang mewarisi pengetahuan mereka secara utuh. Komunitas adat yang ingin mendokumentasikan tradisi mereka tidak memiliki alat rekam dan klasifikasi yang ramah lingkungan digital. Sekolah yang ingin mengajarkan muatan lokal bahasa daerah tidak memiliki materi ajar yang konsisten dan dapat diperbarui."
  ));

  out.push(h2("Urgensi"));
  out.push(p(
    "Permasalahan ini mendesak karena jendela waktu untuk merekam suara para maestro tradisi lisan dan penutur asli bahasa daerah semakin sempit. Setiap tahun, beberapa penutur asli bahasa daerah terancam punah meninggal tanpa ada rekaman suara mereka yang tersimpan. Peluang yang dapat dikembangkan adalah penggunaan kecerdasan buatan untuk mempercepat dokumentasi, menghadirkan pengalaman belajar yang adaptif untuk generasi muda, dan menciptakan model ekonomi baru bagi komunitas pemilik pengetahuan tradisional."
  ));

  out.push(h2("Data Pendukung"));
  out.push(p(
    "Data UNESCO Atlas of the World\u2019s Languages in Danger mencatat bahwa sekitar 25 persen dari lebih 700 bahasa daerah Indonesia berada dalam kategori terancam punah hingga kritis. Pada purwarupa WARISAN SUARA, empat bahasa daerah yang sudah berstatus terancam punah dan telah dimasukkan ke dalam basis data produk adalah Bahasa Ternate (Maluku Utara), Bahasa Cirebon (Jawa Barat), Bahasa Gorontalo (Gorontalo), dan Bahasa Nias (Sumatera Utara). Data Badan Bahasa Kemendikbud dan BPS mencatat total 128,5 juta penutur bahasa daerah di Indonesia, dengan distribusi usia penutur muda terus berkurang setiap dekade."
  ));

  out.push(h2("Kesenjangan Solusi"));
  out.push(p(
    "Pendekatan yang telah tersedia saat ini terbatas pada kamus digital, beberapa aplikasi belajar bahasa daerah berskala kecil yang dibangun akademisi, serta repositori dokumen teks seperti Wiktionary dan situs Badan Bahasa. Keterbatasan pendekatan ini adalah tidak adanya pengenalan suara untuk bahasa daerah, tidak adanya modul pembelajaran adaptif berbasis AI, tidak adanya arsip terstruktur untuk tradisi lisan, serta tidak adanya model ekonomi yang berkelanjutan bagi pelaku budaya. Tidak ada satu pun platform Indonesia yang mengintegrasikan tiga Objek Pemajuan Kebudayaan sekaligus dengan dukungan kecerdasan buatan."
  ));

  out.push(h2("Peluang Inovasi"));
  out.push(p(
    "Peluang inovasi jangka pendek adalah pengembangan platform dengan dukungan model AI open-source seperti Whisper, MeloTTS, dan Llama 3.1 yang dapat dijalankan di edge network Cloudflare dengan biaya operasional rendah. Peluang jangka panjang adalah menjadi infrastruktur kebudayaan digital nasional yang menyediakan data primer bagi penelitian linguistik, antropologi, dan kebijakan publik, serta merepresentasikan kebudayaan Indonesia di arena internasional sebagai bagian dari Cultural Power Indonesia."
  ));
  return out;
}

// ───────────────────────────────────────────────────────────
// SECTION 6: Akar Budaya dan Landasan Pengembangan
// ───────────────────────────────────────────────────────────
function section6() {
  const out = [h1("6. Akar Budaya dan Landasan Pengembangan")];
  out.push(p(
    "WARISAN SUARA berakar pada kebudayaan Indonesia dengan basis tiga Objek Pemajuan Kebudayaan yang ditetapkan dalam Undang-Undang Nomor 5 Tahun 2017 tentang Pemajuan Kebudayaan. Produk ini secara substantif mengintegrasikan Objek Pemajuan Nomor 1 (Tradisi Lisan), Objek Pemajuan Nomor 2 (Manuskrip), dan Objek Pemajuan Nomor 8 (Bahasa). Integrasi ketiga objek ini bukan sekadar ornamen atau identitas visual, melainkan fondasi fungsi produk itu sendiri."
  ));

  out.push(h2("Objek Pemajuan Kebudayaan yang Diintegrasikan"));
  out.push(bulletRuns([{ text: "Tradisi Lisan (Objek Pemajuan No. 1): ", bold: true }, "20 tradisi lisan telah didigitalkan ke dalam arsip produk, termasuk hikayat, mantra, nyanyian penganten, doa tolak bala, dan cerita rakyat dari berbagai daerah. Audio rekaman dan transkrip teks disimpan bersama untuk konsultasi publik."]));
  out.push(bulletRuns([{ text: "Manuskrip (Objek Pemajuan No. 2): ", bold: true }, "Teks-teks tradisional yang terkait tradisi lisan didigitalkan dalam bentuk transkrip, dengan metadata asal daerah, penutur, dan konteks penggunaan. Manuskrip menjadi rujukan bagi modul pembelajaran."]));
  out.push(bulletRuns([{ text: "Bahasa (Objek Pemajuan No. 8): ", bold: true }, "10 bahasa daerah terdata pada basis data produk, mencakup metadata demografis penutur, status keberlangsungan, serta sampel audio dan teks. Empat bahasa di antaranya (Ternate, Cirebon, Gorontalo, Nias) berstatus terancam punah."]));

  out.push(h2("Komunitas, Pelaku Budaya, dan Pemilik Pengetahuan"));
  out.push(p(
    "Proses riset dan dokumentasi dilakukan melalui konsultasi dengan komunitas pemilik pengetahuan tradisional, pelaku budaya, maestro tradisi lisan, serta akademisi linguistik dan antropologi. Tim WARISAN SUARA melakukan wawancara semi-terstruktur, pengumpulan sampel audio, dan validasi transkrip bersama penutur asli. Penghormatan terhadap hak komunitas diwujudkan melalui atribusi yang jelas pada setiap rekaman dan manuskrip, persetujuan tertulis untuk penggunaan konten, serta kebijakan tidak mengeksploitasi konten sakral di luar konteks yang diizinkan komunitas."
  ));

  out.push(h2("Cara Produk Menjaga Relevansi Budaya"));
  out.push(p(
    "Produk menjaga relevansi budaya dengan cara menghadirkan pembaruan teknologi tanpa menghapus konteks asli. Misalnya, Whisper ASR tidak menggantikan penutur asli, melainkan menjadi alat bantu yang memungkinkan suara mereka diabadikan dan dikenali mesin. MeloTTS tidak menggantikan maestro, melainkan membuat modul pembelajaran dapat diakses oleh siswa di daerah yang jauh dari sumber tradisi. Llama 3.1 sebagai Tutor AI tidak menggantikan guru bahasa daerah, melainkan menjadi pendamping belajar yang tersedia 24 jam. Pendekatan ini menghormati kedudukan komunitas sebagai pemilik pengetahuan dan sekaligus membuka akses bagi generasi muda."
  ));

  out.push(p(
    "Unsur budaya tersebut penting bagi fungsi dan nilai produk sebab tanpa integrasi yang substantif, platform ini hanya akan menjadi kamus biasa. Integrasi tiga Objek Pemajuan dalam satu siklus (rekam \u2192 arsip \u2192 belajar \u2192 dialog dengan AI) menciptakan pengalaman yang tidak dapat ditiru oleh aplikasi kamus atau aplikasi belajar bahasa umum."
  ));
  return out;
}

// ───────────────────────────────────────────────────────────
// SECTION 7: Target Pengguna dan Dampak
// ───────────────────────────────────────────────────────────
function section7() {
  const out = [h1("7. Target Pengguna dan Dampak")];
  out.push(p(
    "Target pengguna produk WARISAN SUARA dikelompokkan ke dalam empat segmen utama yang masing-masing memiliki profil, kebutuhan, dan kanal akses yang berbeda. Segmentasi ini menjadi dasar strategi komersialisasi serta indikator pengukuran dampak produk."
  ));

  out.push(h2("Segmen B2G: Pemerintah Daerah"));
  out.push(p(
    "Profil pengguna B2G adalah dinas kebudayaan, dinas pendidikan, dan badan bahasa di tingkat provinsi maupun kabupaten/kota. Kebutuhan utama adalah basis data bahasa daerah yang dapat dipakai untuk kebijakan publik, dokumentasi resmi, dan materi muatan lokal. Cara penggunaan adalah lisensi tahunan yang memberi akses dashboard statistik penutur, peta sebaran bahasa, dan modul yang dapat dikustomisasi sesuai kebijakan daerah."
  ));

  out.push(h2("Segmen B2B: Sekolah dan Pendidik"));
  out.push(p(
    "Profil pengguna B2B adalah sekolah dasar, sekolah menengah, perguruan tinggi, serta lembaga kursus bahasa. Kebutuhan utama adalah materi ajar bahasa daerah yang konsisten, terstruktur, dan dapat diperbarui. Cara penggunaan adalah langganan tahunan untuk akses modul belajar, Tutor AI, dan Studio Rekam untuk evaluasi pengucapan siswa."
  ));

  out.push(h2("Segmen B2C: Individu dan Pelajar"));
  out.push(p(
    "Profil pengguna B2C adalah individu dewasa, pelajar, mahasiswa, dan masyarakat diaspora Indonesia yang ingin mempelajari atau menjaga bahasa daerah leluhur mereka. Kebutuhan utama adalah akses gratis untuk konten dasar serta opsi langganan untuk konten lanjutan. Cara penggunaan adalah registrasi akun gratis di warisan-suara.pages.dev, mengakses peta bahasa, merekam suara di Studio Rekam, dan mengikuti modul pembelajaran."
  ));

  out.push(h2("Segmen B2B Riset: Peneliti dan Komunitas"));
  out.push(p(
    "Profil pengguna B2B riset adalah peneliti linguistik, antropologi, dan teknologi pendidikan, serta komunitas adat yang ingin mendokumentasikan tradisi mereka. Kebutuhan utama adalah akses ke data primer (audio, transkrip, metadata) yang dapat dipakai untuk publikasi ilmiah dan dokumentasi internal komunitas. Cara penggunaan adalah lisensi data dengan atribusi wajib kepada komunitas pemilik pengetahuan."
  ));

  out.push(h2("Indikator Terukur"));
  out.push(p(
    "Total potensi pengguna terdata mencapai 128,5 juta penutur bahasa daerah di Indonesia berdasarkan data BPS dan Badan Bahasa. Capaian aktual produk saat ini meliputi 10 bahasa terdata, 20 tradisi terdokumentasi, 8 modul pembelajaran, dan endpoint API yang aktif. Target jangka pendek adalah 50 penutur asli pilot yang berkontribusi rekaman validasi, target jangka menengah adalah 5 pemerintah daerah mitra dan 50 sekolah langganan, serta target jangka panjang adalah 100 bahasa terdata, sertifikasi Kemendikbud untuk modul ajar, dan ekspansi pasar ke ASEAN serumpun."
  ));
  return out;
}

// ───────────────────────────────────────────────────────────
// SECTION 8: Solusi dan Deskripsi Produk
// ───────────────────────────────────────────────────────────
function section8(mockDir) {
  const out = [h1("8. Solusi dan Deskripsi Produk")];
  out.push(p(
    "WARISAN SUARA adalah platform kecerdasan buatan yang mengintegrasikan dokumentasi, arsip, dan pembelajaran bahasa daerah serta tradisi lisan Nusantara dalam satu siklus pengalaman pengguna. Produk dikembangkan sebagai purwarupa fungsional yang dapat diverifikasi publik melalui tautan demonstrasi di warisan-suara.pages.dev."
  ));

  out.push(h2("Deskripsi dan Fungsi Utama Produk"));
  out.push(p(
    "Fungsi utama produk adalah menyediakan akses publik terhadap peta bahasa daerah Indonesia, memungkinkan pengguna merekam suara mereka sendiri untuk validasi pengenalan, mengikuti modul pembelajaran adaptif berbasis AI, berdialog dengan AI Tutor dalam bahasa daerah, serta mengakses arsip tradisi lisan yang telah didigitalkan. Siklus pengalaman pengguna ini menghubungkan tiga Objek Pemajuan Kebudayaan dalam satu platform."
  ));

  out.push(h2("Fitur Utama"));
  out.push(pRuns([
    { text: "Fitur 1 \u2013 Peta Bahasa: ", bold: true },
    "Peta interaktif yang menampilkan sebaran geografis 10 bahasa daerah terdata, dengan metadata demografis penutur, status keberlangsungan, dan sampel audio. Pengguna dapat menjelajahi bahasa berdasarkan provinsi, jumlah penutur, atau status ancaman punah."
  ]));
  out.push(imageParagraph(path.join(mockDir, "02-peta-bahasa.png"), 280, 1500));
  out.push(caption("Gambar 1: Peta Bahasa interaktif \u2013 sebaran 10 bahasa daerah dengan metadata penutur dan status keberlangsungan."));

  out.push(pRuns([
    { text: "Fitur 2 \u2013 Studio Rekam (Whisper ASR): ", bold: true },
    "Studio rekam yang memungkinkan pengguna merekam suara mereka sendiri dan menerima transkrip otomatis berbasis model @cf/openai/whisper dari Cloudflare Workers AI. Sistem dilengkapi validasi anti-bot Cloudflare Turnstile untuk mencegah penyalahgunaan endpoint API."
  ]));
  out.push(imageParagraph(path.join(mockDir, "04-studio-rekam.png"), 280, 1500));
  out.push(caption("Gambar 2: Studio Rekam dengan validasi Cloudflare Turnstile \u2013 pengguna merekam suara dan menerima transkrip otomatis."));

  out.push(imageParagraph(path.join(mockDir, "05-studio-form-turnstile.png"), 280, 800));
  out.push(caption("Gambar 3: Form Studio Rekam dengan widget Turnstile \u2013 lapisan keamanan anti-bot sebelum pengiriman audio ke endpoint."));

  out.push(pRuns([
    { text: "Fitur 3 \u2013 Modul Belajar (MeloTTS): ", bold: true },
    "Modul pembelajaran bahasa daerah dengan dukungan sintesis suara berbasis model @cf/myshell-ai/melotts. Modul disusun dalam delapan unit pembelajaran dengan struktur pengantar, kosakata, latihan, dan evaluasi. Audio pengucapan dibangkitkan secara dinamis di edge network Cloudflare."
  ]));
  out.push(imageParagraph(path.join(mockDir, "06-belajar-modul.png"), 280, 1500));
  out.push(caption("Gambar 4: Modul Belajar dengan delapan unit pembelajaran dan dukungan sintesis suara MeloTTS."));

  out.push(pRuns([
    { text: "Fitur 4 \u2013 Tutor AI (Llama 3.1): ", bold: true },
    "Tutor AI yang berdialog dengan pengguna dalam bahasa daerah menggunakan model @cf/meta/llama-3.1-8b-instruct. Tutor membantu pengguna berlatih percakapan, menjelaskan konteks budaya, dan memberikan umpan balik adaptif. Inferensi dilakukan secara langsung di edge network Cloudflare Pages Functions."
  ]));
  out.push(imageParagraph(path.join(mockDir, "08-tutor-ai.png"), 280, 1500));
  out.push(caption("Gambar 5: Tutor AI berbasis Llama 3.1 \u2013 dialog adaptif dalam bahasa daerah dengan inferensi edge."));

  out.push(pRuns([
    { text: "Fitur 5 \u2013 Arsip Tradisi: ", bold: true },
    "Arsip terstruktur untuk 20 tradisi lisan yang telah didigitalkan, mencakup hikayat, mantra, nyanyian penganten, doa tolak bala, dan cerita rakyat. Setiap entri arsip memiliki audio rekaman, transkrip teks, metadata asal daerah, atribusi penutur atau komunitas, serta konteks penggunaan."
  ]));
  out.push(imageParagraph(path.join(mockDir, "09-arsip-tradisi.png"), 280, 1500));
  out.push(caption("Gambar 6: Arsip Tradisi \u2013 20 tradisi lisan terdokumentasi dengan audio, transkrip, dan atribusi komunitas."));

  out.push(h2("Cara Kerja dan Alur Penggunaan"));
  out.push(p(
    "Alur penggunaan dimulai dari beranda yang menampilkan ringkasan statistik platform (jumlah bahasa, tradisi, dan modul). Pengguna kemudian dapat menjelajahi Peta Bahasa untuk memilih bahasa daerah yang ingin dipelajari. Setelah memilih bahasa, pengguna dapat membuka halaman detail bahasa, merekam suara di Studio Rekam untuk evaluasi pengucapan, mengikuti Modul Belajar untuk pembelajaran terstruktur, berdialog dengan Tutor AI untuk latihan percakapan, dan mengakses Arsip Tradisi untuk memahami konteks budaya bahasa tersebut."
  ));

  out.push(imageParagraph(path.join(mockDir, "01-beranda.png"), 280, 1500));
  out.push(caption("Gambar 7: Beranda WARISAN SUARA \u2013 ringkasan statistik platform dengan akses ke lima fitur utama."));

  out.push(h2("Bahan, Teknologi, dan Metode Pengembangan"));
  out.push(p(
    "Produk dibangun di atas tumpukan teknologi modern yang ringan dan efisien secara operasional. Frontend menggunakan Next.js 16 dengan TypeScript 5, Tailwind CSS 4, dan shadcn/ui untuk komponen antarmuka. Mobile menggunakan Progressive Web App (PWA) sehingga dapat diinstal langsung dari browser tanpa perlu app store. Backend menggunakan Cloudflare Pages Functions dengan 13 endpoint API aktif. Basis data menggunakan Cloudflare D1 (free tier) dengan KV untuk caching. Kecerdasan buatan menggunakan tiga model Workers AI: @cf/meta/llama-3.1-8b-instruct untuk Tutor AI, @cf/openai/whisper untuk ASR Studio Rekam, dan @cf/myshell-ai/melotts untuk sintesis suara Modul Belajar. Keamanan anti-bot dilindungi oleh Cloudflare Turnstile."
  ));

  out.push(h2("Status Kesiapan Produk"));
  out.push(p(
    "Status kesiapan produk adalah purwarupa fungsional yang sudah live dan dapat diverifikasi publik di warisan-suara.pages.dev. Kelima fitur utama (Peta Bahasa, Studio Rekam, Modul Belajar, Tutor AI, Arsip Tradisi) telah berjalan dengan endpoint API aktif. Kode sumber tersedia di repositori GitHub publik di github.com/hyperchainpro/Warisan-Suara. Tingkat kesiapan produk berada pada TRL 6-7, yaitu purwarupa yang telah diuji dalam lingkungan operasional nyata dengan pengguna terdaftar."
  ));

  out.push(h2("Pengembangan yang Masih Direncanakan"));
  out.push(p(
    "Fitur yang masih dalam tahap pengembangan meliputi: penambahan 40 bahasa daerah baru dalam dua tahap berikutnya, mobile native sebagai aplikasi Android dan iOS, integrasi langsung dengan sistem informasi pemerintah daerah, sertifikasi modul ajar dari Kemendikbud, serta fitur komunitas untuk kontribusi rekaman oleh penutur asli. Pencapaian yang sudah diraih meliputi deploy produksi di Cloudflare Pages free tier, basis data 10 bahasa dan 20 tradisi yang dapat diakses publik, serta dokumentasi pengembangan yang lengkap."
  ));
  return out;
}

// ───────────────────────────────────────────────────────────
// SECTION 9: Tujuan dan Manfaat
// ───────────────────────────────────────────────────────────
function section9() {
  const out = [h1("9. Tujuan dan Manfaat")];
  out.push(p(
    "Tujuan utama pengembangan WARISAN SUARA adalah membangun infrastruktur kebudayaan digital yang menyatukan dokumentasi, arsip, dan pembelajaran bahasa daerah serta tradisi lisan Indonesia dalam satu platform berbasis kecerdasan buatan. Manfaat yang diharapkan bagi ekosistem budaya diuraikan dalam tiga aspek, yaitu budaya, ekonomi, dan sosial."
  ));

  out.push(h2("Aspek Budaya"));
  out.push(p(
    "Kontribusi budaya produk adalah dokumentasi 20 tradisi lisan yang sebelumnya hanya tersimpan secara lisan di kepala para maestro, pelestarian 10 bahasa daerah (termasuk 4 bahasa terancam punah: Ternate, Cirebon, Gorontalo, Nias) melalui rekaman audio dan transkrip teks, pemajuan pengetahuan tradisional melalui akses publik yang terstruktur, serta pewarisan pengetahuan ke generasi muda melalui modul pembelajaran adaptif. Manfaat yang sudah terjadi meliputi terdokumentasinya 20 tradisi dan 10 bahasa dalam basis data purwarupa. Target jangka pendek adalah dokumentasi 30 tradisi tambahan, target jangka panjang adalah dokumentasi 100 bahasa daerah dengan status keberlangsungan yang dapat dipantau secara berkala."
  ));

  out.push(h2("Aspek Ekonomi"));
  out.push(p(
    "Nilai tambah ekonomi produk diwujudkan melalui tiga revenue stream utama: lisensi tahunan B2G ke pemerintah daerah untuk dashboard kebijakan, langganan tahunan B2B ke sekolah dan instansi pendidikan untuk modul ajar, serta freemium B2C dengan opsi langganan premium untuk individu. Pendapatan tambahan berasal dari lisensi data B2B untuk peneliti dan akademisi. Indikator yang digunakan adalah jumlah mitra pemerintah daerah, jumlah sekolah langganan, jumlah pengguna B2C aktif bulanan, serta omzet lisensi data riset. Target jangka pendek adalah 5 pemerintah daerah mitra pilot; target jangka menengah adalah 50 sekolah langganan dan 10.000 pengguna B2C aktif bulanan; target jangka panjang adalah ekspansi pasar ke ASEAN serumpun."
  ));

  out.push(h2("Aspek Sosial dan Masyarakat"));
  out.push(p(
    "Manfaat sosial produk adalah perluasan akses publik terhadap materi pembelajaran bahasa daerah, partisipasi komunitas adat dalam dokumentasi pengetahuan tradisional mereka sendiri, pemberdayaan pelaku budaya dan maestro sebagai kontributor yang atributnya diakui, serta peningkatan keterlibatan generasi muda dalam pelestarian kebudayaan. Indikator yang digunakan adalah jumlah penutur asli yang berkontribusi rekaman, jumlah komunitas adat mitra, jangkauan edukasi melalui modul belajar, serta peningkatan akses terhadap pengetahuan budaya dari daerah terpencil. Manfaat yang sudah terjadi adalah tersedianya akses publik ke 10 bahasa dan 20 tradisi melalui purwarupa; target jangka pendek adalah 50 penutur pilot, target jangka panjang adalah jangkauan ke seluruh provinsi Indonesia."
  ));
  return out;
}

// ───────────────────────────────────────────────────────────
// SECTION 10: Keunikan dan Nilai Tambah
// ───────────────────────────────────────────────────────────
function section10() {
  const out = [h1("10. Keunikan dan Nilai Tambah")];
  out.push(p(
    "WARISAN SUARA memiliki sejumlah keunggulan yang membedakannya dari solusi sejenis yang tersedia di Indonesia. Kebaruan produk tidak selalu berupa penemuan teknologi baru, melainkan pengembangan baru yang menghasilkan manfaat nyata dari pengetahuan dan sumber daya budaya Indonesia."
  ));

  out.push(h2("Kebaruan Konsep dan Teknologi"));
  out.push(p(
    "Kebaruan konsep adalah integrasi tiga Objek Pemajuan Kebudayaan (Tradisi Lisan, Manuskrip, Bahasa) dalam satu platform dengan dukungan kecerdasan buatan. Kebaruan teknologi adalah penggunaan model Whisper ASR yang dikhususkan untuk pengenalan suara bahasa daerah Indonesia \u2013 sebuah pendekatan yang belum diadopsi oleh platform Indonesia lainnya. Model Whisper dari Cloudflare Workers AI dijalankan di edge network, sehingga inferensi dapat dilakukan dengan latensi rendah dan biaya operasional yang efisien."
  ));

  out.push(h2("Kedalaman Integrasi Unsur Kebudayaan"));
  out.push(p(
    "Unsur kebudayaan tidak digunakan sebagai ornamen, nama, atau identitas visual saja. Setiap fitur produk memiliki hubungan substantif dengan unsur budaya: Peta Bahasa menampilkan data demografis penutur asli, Studio Rekam merekam suara pengguna untuk validasi pengenalan, Modul Belajar menggunakan sintesis suara MeloTTS untuk mereproduksi pengucapan bahasa daerah, Tutor AI berdialog dalam bahasa daerah, dan Arsip Tradisi menyimpan rekaman asli para maestro. Kedalaman integrasi ini tidak dimiliki oleh aplikasi kamus atau aplikasi belajar bahasa umum."
  ));

  out.push(h2("Keunggulan Teknis dan Operasional"));
  out.push(p(
    "Produk dijalankan di Cloudflare edge network yang tersebar di lebih dari 300 lokasi dunia, sehingga pengguna di Indonesia maupun diaspora mendapatkan latensi rendah. Arsitektur serverless dengan Cloudflare Pages Functions dan Workers AI membuat biaya operasional sangat rendah \u2013 free tier Cloudflare cukup untuk menjalankan purwarupa. Mobile PWA memungkinkan aplikasi diinstal langsung dari browser tanpa perlu app store, sehingga hambatan distribusi minimal. Keamanan anti-bot dilindungi oleh Cloudflare Turnstile, dan keandalan data dilindungi oleh Cloudflare D1 dengan replikasi otomatis."
  ));

  out.push(h2("Pembanding dan Perbedaan"));
  out.push(p(
    "Pembanding relevan di Indonesia meliputi kamus bahasa daerah digital dari Badan Bahasa, repositori teks Wiktionary, dan beberapa aplikasi belajar bahasa daerah yang dibangun akademisi. Perbedaan WARISAN SUARA dari pembanding tersebut: (1) mengintegrasikan tiga Objek Pemajuan dalam satu platform, (2) menyediakan pengenalan suara bahasa daerah berbasis Whisper ASR yang belum ada di pembanding, (3) menyediakan modul pembelajaran adaptif berbasis MeloTTS dan Llama 3.1, (4) menyediakan arsip terstruktur untuk tradisi lisan dengan atribusi komunitas, dan (5) memiliki model bisnis yang berkelanjutan untuk B2G, B2B, dan B2C."
  ));

  out.push(h2("Potensi Pengembangan Turunan"));
  out.push(p(
    "Potensi pengembangan produk turunan meliputi: API pengenalan suara bahasa daerah sebagai layanan untuk pengembang pihak ketiga, plugin integrasi untuk LMS sekolah, dataset lisensi untuk riset akademik, sertifikasi resmi modul ajar bahasa daerah dari Kemendikbud, serta ekspansi pasar ke negara ASEAN serumpun seperti Filipina dan Malaysia yang juga menghadapi tantangan pelestarian bahasa daerah."
  ));
  return out;
}

// ───────────────────────────────────────────────────────────
// SECTION 11: Teknologi dan Metode Pengembangan
// ───────────────────────────────────────────────────────────
function section11() {
  const out = [h1("11. Teknologi dan Metode Pengembangan")];
  out.push(p(
    "Tim WARISAN SUARA memilih Kategori Inovasi Digital, sehingga penjelasan teknologi mengikuti pilihan kategori A. Inovasi Digital. Produk dikembangkan dengan tumpukan teknologi modern yang dipilih berdasarkan tiga kriteria: kemampuan menjalankan inferensi model AI di edge network, biaya operasional yang rendah untuk tahap purwarupa dan awal komersialisasi, serta kemudahan distribusi ke pengguna di seluruh Indonesia."
  ));

  out.push(h2("A. Inovasi Digital"));
  out.push(pRuns([
    { text: "Aplikasi web dan mobile: ", bold: true },
    "Produk dikembangkan sebagai aplikasi web Progressive Web App (PWA) yang dapat diakses melalui browser desktop dan mobile. PWA dipilih agar pengguna dapat langsung menginstal aplikasi dari browser tanpa perlu app store, sehingga hambatan distribusi minimal pada tahap awal."
  ]));
  out.push(pRuns([
    { text: "Kecerdasan buatan (AI): ", bold: true },
    "Produk memanfaatkan tiga model AI open-source yang dijalankan di Cloudflare Workers AI: @cf/meta/llama-3.1-8b-instruct untuk Tutor AI, @cf/openai/whisper untuk ASR Studio Rekam, dan @cf/myshell-ai/melotts untuk sintesis suara Modul Belajar. Pemilihan model ini didasarkan pada ketersediaan inferensi di edge network Cloudflare, sehingga biaya operasional minimal pada tahap purwarupa."
  ]));
  out.push(pRuns([
    { text: "Basis data dan pengelolaan pengetahuan budaya: ", bold: true },
    "Basis data produk menggunakan Cloudflare D1 (SQLite edge) untuk data terstruktur (bahasa, tradisi, modul, pengguna) dan Cloudflare KV untuk caching respons API. Skema basis data disusun mengikuti kebutuhan tiga Objek Pemajuan Kebudayaan dengan tabel terpisah untuk bahasa, tradisi lisan, manuskrip, modul pembelajaran, dan rekaman pengguna."
  ]));
  out.push(pRuns([
    { text: "Teknologi pendukung dokumentasi, edukasi, dan layanan budaya: ", bold: true },
    "Cloudflare Turnstile digunakan sebagai lapisan keamanan anti-bot pada endpoint API Studio Rekam. Cloudflare Pages Functions digunakan sebagai backend serverless dengan 13 endpoint aktif yang melayani permintaan frontend. CDN edge Cloudflare mendistribusikan konten statis ke lebih 300 lokasi dunia."
  ]));

  out.push(h2("Alasan Pemilihan Teknologi"));
  out.push(p(
    "Alasan pemilihan tumpukan teknologi ini adalah: (1) Cloudflare Workers AI memungkinkan inferensi model AI dilakukan di edge tanpa biaya server dedicated, (2) Next.js 16 dan shadcn/ui memberikan produktivitas pengembangan tinggi dengan kualitas antarmuka yang profesional, (3) PWA memberikan distribusi mobile tanpa hambatan app store, dan (4) Cloudflare free tier cukup untuk menjalankan purwarupa hingga pengguna awal komersial. Tim hanya mencantumkan teknologi yang benar-benar digunakan dalam purwarupa fungsional, tidak mencantumkan teknologi atau spesifikasi yang belum diterapkan."
  ));
  return out;
}

// ───────────────────────────────────────────────────────────
// SECTION 12: Implementasi Teknis
// ───────────────────────────────────────────────────────────
function section12() {
  const out = [h1("12. Implementasi Teknis")];
  out.push(p(
    "Bagian ini menjelaskan implementasi teknis produk WARISAN SUARA secara konkret berdasarkan kode sumber yang tersedia di repositori GitHub publik github.com/hyperchainpro/Warisan-Suara dan demonstrasi live di warisan-suara.pages.dev."
  ));

  out.push(h2("Frontend"));
  out.push(p(
    "Frontend dibangun dengan Next.js 16 (App Router) menggunakan TypeScript 5 sebagai bahasa pemrograman utama. Styling menggunakan Tailwind CSS 4 dengan komponen shadcn/ui untuk konsistensi desain. Halaman utama mencakup beranda, peta bahasa, halaman detail bahasa, studio rekam, modul belajar, lesson player, tutor AI, arsip tradisi, dan detail tradisi. Mobile App Shell dibangun dengan PWA manifest yang mendukung instalasi langsung dari browser."
  ));

  out.push(h2("Mobile"));
  out.push(p(
    "Mobile menggunakan Progressive Web App (PWA) dengan service worker yang terdaftar otomatis. Manifes webmanifest mendefinisikan ikon, nama aplikasi, dan tema warna. Aplikasi dapat diinstal langsung dari browser Chrome, Edge, atau Safari tanpa perlu app store. Strategi mobile native (Android/iOS) akan dipertimbangkan pada jangka menengah setelah validasi pasar pengguna tercapai."
  ));

  out.push(h2("Backend"));
  out.push(p(
    "Backend menggunakan Cloudflare Pages Functions dengan 13 endpoint API aktif yang terorganisasi dalam direktori functions/api. Endpoint mencakup: /api/health, /api/stats, /api/languages, /api/languages/[code], /api/translate, /api/explain, /api/learn/modules, /api/learn/progress, /api/asr, /api/tts, /api/tutor/chat, /api/traditions, dan /api/recordings. Library helpers internal terletak di functions/_lib/helpers.js untuk fungsi umum seperti validasi request dan koneksi ke Workers AI."
  ));

  out.push(h2("Database"));
  out.push(p(
    "Basis data menggunakan Cloudflare D1 (free tier) dengan schema Prisma untuk migrasi dan seeding data. Skema basis data mencakup tabel Language (10 bahasa), Tradition (20 tradisi), Manuscript, LearningModule (8 modul), Lesson, Recording, User, dan LearnProgress. Cloudflare KV digunakan untuk caching respons API yang sering diakses. Seeding data dilakukan melalui prisma/seed.ts yang memuat data awal bahasa dan tradisi."
  ));

  out.push(h2("Kecerdasan Buatan"));
  out.push(p(
    "Tiga model Cloudflare Workers AI digunakan dalam produk: (1) @cf/meta/llama-3.1-8b-instruct untuk Tutor AI pada endpoint /api/tutor/chat dan /api/explain, (2) @cf/openai/whisper untuk ASR pada endpoint /api/asr yang menerima upload audio dari Studio Rekam, dan (3) @cf/myshell-ai/melotts untuk sintesis suara pada endpoint /api/tts yang melayani Modul Belajar. Inferensi dilakukan secara langsung di edge network Cloudflare, dengan fallback teks jika model tidak tersedia di lokasi tertentu."
  ));

  out.push(h2("Keamanan"));
  out.push(p(
    "Keamanan anti-bot dilindungi oleh Cloudflare Turnstile pada endpoint API yang sensitif, terutama Studio Rekam. Komponen Turnstile dibangun di src/components/turnstile.tsx dan divalidasi pada level backend sebelum request diproses. Endpoint API juga membatasi ukuran upload audio dan menggunakan device ID untuk identifikasi pengguna terdaftar. Tidak ada data pribadi sensitif yang disimpan melebihi kebutuhan operasional dasar."
  ));
  return out;
}

// ───────────────────────────────────────────────────────────
// SECTION 13: Model Bisnis dan Strategi Komersialisasi
// ───────────────────────────────────────────────────────────
function section13() {
  const out = [h1("13. Model Bisnis dan Strategi Komersialisasi")];
  out.push(p(
    "Model bisnis WARISAN SUARA disusun menggunakan kerangka Business Model Canvas (BMC) dengan sembilan elemen. Strategi komersialisasi disesuaikan dengan tingkat kesiapan produk (purwarupa fungsional) sehingga target awal adalah validasi pilot dengan segmen B2G dan B2B sebelum perluasan ke skala nasional."
  ));

  out.push(new Paragraph({
    keepNext: true,
    spacing: { before: 240, after: 120, line: 312 },
    children: [new TextRun({
      text: "Tabel 2. Business Model Canvas \u2013 WARISAN SUARA",
      bold: true, size: 21, color: P.body, font: FONT_HEAD,
    })],
  }));

  const bmc = [
    ["Customer Segments", "Pemerintah daerah (B2G); Sekolah & pendidik (B2B); Individu & pelajar (B2C); Peneliti & komunitas adat (B2B riset). Total potensi 128,5 juta penutur bahasa daerah di Indonesia."],
    ["Value Propositions", "Platform AI terpadu untuk dokumentasi, arsip, dan pembelajaran bahasa daerah serta tradisi lisan. Integrasi 3 Objek Pemajuan Kebudayaan dalam satu siklus pengalaman pengguna."],
    ["Channels", "Demo live warisan-suara.pages.dev; GitHub repo publik; kanal media sosial; presentasi langsung ke dinas kebudayaan dan sekolah; kemitraan dengan komunitas adat."],
    ["Customer Relationships", "B2G: kemitraan jangka panjang dengan dinas kebudayaan; B2B: dukungan implementasi untuk sekolah; B2C: komunitas online dan tutorial; B2B riset: lisensi data dengan atribusi."],
    ["Revenue Streams", "Lisensi tahunan B2G (dashboard & modul kustom); Langganan tahunan B2B (modul & Tutor AI); Freemium B2C (premium berlangganan); Lisensi data B2B riset."],
    ["Key Resources", "Basis data 10 bahasa & 20 tradisi; Tim 3 orang (AI Engineer, UI/UX Designer, Strategi Startup); Cloudflare edge infrastruktur; Model AI open-source (Llama, Whisper, MeloTTS)."],
    ["Key Activities", "Pengembangan & pemeliharaan platform; Riset & dokumentasi bahasa/tradisi; Validasi penutur asli; Akuisisi mitra B2G/B2B; Operasional edge infrastruktur."],
    ["Key Partnerships", "Cloudflare (infrastruktur & AI); Badan Bahasa Kemendikbud (data rujukan); Komunitas adat (pengetahuan tradisional); Pemda & sekolah (pilot & distribusi); Akademisi linguistik (validasi)."],
    ["Cost Structure", "Cloudflare free tier (purwarupa); Upgrade ke Workers Paid saat skala (sekitar USD 5/bulan); Honor tim; Biaya riset lapangan & honorarium penutur asli; Biaya pemasaran awal."],
  ];

  const bmcRows = [
    new TableRow({
      tableHeader: true, cantSplit: true,
      children: [
        thCell("Elemen BMC", 28),
        thCell("Deskripsi WARISAN SUARA", 72),
      ],
    }),
    ...bmc.map(([k, v], i) => new TableRow({
      cantSplit: true,
      children: [
        tdCell([{ text: k, bold: true }], 28, { shade: i % 2 === 0 }),
        tdCell(v, 72, { shade: i % 2 === 0 }),
      ],
    })),
  ];

  out.push(new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    borders: tableBorders(),
    rows: bmcRows,
  }));

  out.push(h2("Model Pendapatan dan Strategi Harga"));
  out.push(p(
    "Model pendapatan utama adalah lisensi tahunan B2G untuk pemerintah daerah dengan harga indikatif Rp 25-50 juta per provinsi per tahun, mencakup dashboard statistik, modul kustom, dan akses data bahasa daerah setempat. Langganan B2B untuk sekolah dihargai Rp 1-3 juta per sekolah per tahun, mencakup akses modul belajar, Tutor AI, dan Studio Rekam. Model B2C menggunakan freemium dengan akses gratis ke konten dasar dan langganan premium Rp 25.000 per bulan untuk konten lanjutan. Lisensi data B2B riset dihargai per dataset dengan atribusi wajib kepada komunitas pemilik pengetahuan."
  ));

  out.push(h2("Saluran Pemasaran dan Distribusi"));
  out.push(p(
    "Saluran pemasaran meliputi demonstrasi langsung ke dinas kebudayaan dan dinas pendidikan, kemitraan dengan komunitas adat untuk endorsement, publikasi di media sosial dan kanal teknologi, serta partisipasi dalam kompetisi inovasi budaya seperti BUDAYA GO! 2026. Distribusi produk melalui web PWA yang dapat diakses publik, dengan opsi instalasi mobile langsung dari browser."
  ));

  out.push(h2("Mitra Utama dan Peluang Produk Turunan"));
  out.push(p(
    "Mitra produksi teknologi adalah Cloudflare untuk infrastruktur edge dan Workers AI. Mitra budaya adalah komunitas adat pemilik pengetahuan tradisional, Badan Bahasa Kemendikbud sebagai rujukan data, dan akademisi linguistik untuk validasi. Mitra penjualan adalah pemerintah daerah dan sekolah. Peluang produk turunan meliputi API pengenalan suara bahasa daerah sebagai layanan, plugin integrasi LMS sekolah, dan dataset lisensi untuk riset akademik."
  ));

  out.push(h2("Estimasi Biaya dan Kebutuhan Sumber Daya"));
  out.push(p(
    "Pada tahap purwarupa, biaya operasional sangat rendah karena Cloudflare free tier mencukupi. Saat skala pengguna meningkat, biaya utama adalah upgrade ke Cloudflare Workers Paid (sekitar USD 5 per bulan), biaya honorarium penutur asli untuk rekaman validasi (Rp 200.000-500.000 per sesi), dan biaya pemasaran awal. Tim 3 orang dapat menjalankan operasional awal tanpa rekrutmen tambahan, dengan rencana ekspansi tim pada tahun kedua ketika revenue B2G/B2B sudah menguat."
  ));

  out.push(h2("Strategi Pengembangan Pasar"));
  out.push(p(
    "Strategi pengembangan pasar dimulai dari validasi pilot dengan 5 pemerintah daerah mitra dan 50 sekolah langganan pada 12 bulan pertama, dilanjutkan dengan ekspansi ke 20 provinsi pada tahun kedua, dan target nasional pada tahun ketiga. Strategi peningkatan skala meliputi penambahan bahasa daerah dari 10 menjadi 100 pada lima tahun ke depan, sertifikasi modul ajar dari Kemendikbud, serta ekspansi pasar ke negara ASEAN serumpun seperti Filipina dan Malaysia."
  ));
  return out;
}

// ───────────────────────────────────────────────────────────
// SECTION 14: Rekam Jejak, Kesiapan, dan Bukti Validasi
// ───────────────────────────────────────────────────────────
function section14(mockDir) {
  const out = [h1("14. Rekam Jejak, Kesiapan, dan Bukti Validasi")];
  out.push(p(
    "Bagian ini menyajikan bukti yang menunjukkan bahwa WARISAN SUARA sudah berjalan dan terbentuk sebagai purwarupa fungsional, serta memiliki peluang untuk digunakan atau dikembangkan lebih lanjut dalam jangka pendek dan jangka panjang. Seluruh klaim dapat diverifikasi publik melalui tautan demonstrasi live dan repositori kode sumber."
  ));

  out.push(h2("Purwarupa Fungsional Live"));
  out.push(p(
    "Purwarupa fungsional WARISAN SUARA telah didistribusikan ke produksi melalui Cloudflare Pages free tier dan dapat diakses publik di https://warisan-suara.pages.dev. Endpoint health check tersedia di /api/health dan mengembalikan status aktif serta statistik dasar platform. Endpoint statistik di /api/stats mengembalikan jumlah bahasa, tradisi, modul, dan rekaman yang tersedia. Endpoint ini dapat diverifikasi oleh panitia secara langsung tanpa autentikasi."
  ));

  out.push(h2("Basis Data Bahasa dan Tradisi"));
  out.push(p(
    "Basis data produk mencakup 10 bahasa daerah terdata (termasuk 4 bahasa terancam punah: Ternate, Cirebon, Gorontalo, dan Nias), 20 tradisi lisan terdokumentasi dengan audio dan transkrip, serta 8 modul pembelajaran yang terstruktur dalam unit pengantar, kosakata, latihan, dan evaluasi. Data ini dapat diakses melalui endpoint API publik dan ditampilkan pada antarmuka Peta Bahasa, Arsip Tradisi, dan Modul Belajar."
  ));

  out.push(imageParagraph(path.join(mockDir, "10-tradisi-detail.png"), 280, 800));
  out.push(caption("Gambar 8: Halaman detail tradisi lisan \u2013 audio rekaman, transkrip, dan atribusi komunitas pemilik pengetahuan."));

  out.push(h2("Kode Sumber dan Repositori"));
  out.push(p(
    "Kode sumber produk tersedia di repositori GitHub publik di https://github.com/hyperchainpro/Warisan-Suara. Repositori berisi kode frontend Next.js 16, fungsi backend Cloudflare Pages Functions, skema basis data Prisma, konfigurasi OpenNext untuk deploy, serta dokumentasi pengembangan. Setiap kontributor tim memiliki akses tulis ke repositori, dan riwayat commit menunjukkan pengembangan aktif dengan perbaikan dan fitur baru secara berkala."
  ));

  out.push(h2("Endpoint API yang Aktif"));
  out.push(p(
    "Tiga belas endpoint API aktif dapat diverifikasi publik: /api/health, /api/stats, /api/languages, /api/languages/[code], /api/translate, /api/explain, /api/learn/modules, /api/learn/progress, /api/asr, /api/tts, /api/tutor/chat, /api/traditions, dan /api/recordings. Endpoint-endpoint ini dijalankan oleh Cloudflare Pages Functions dengan inferensi model AI di Workers AI. Setiap endpoint mengembalikan respons JSON yang dapat divalidasi oleh panitia menggunakan curl atau Postman."
  ));

  out.push(h2("Dokumentasi Produk dan Mockup"));
  out.push(p(
    "Sepuluh mockup antarmuka telah dibuat dan tersedia di folder download/mockups pada repositori, mencakup beranda, peta bahasa, halaman detail bahasa, studio rekam, form studio dengan Turnstile, modul belajar, lesson player, tutor AI, arsip tradisi, dan detail tradisi. Mockup digunakan sebagai dokumentasi visual produk yang melengkapi demonstrasi live. Video showcase berdurasi 3 menit telah diproduksi dan tersedia di download/Video-Showcase-Warisan-Suara.mp4."
  ));

  out.push(h2("Periode dan Konteks Data"));
  out.push(p(
    "Seluruh data rekam jejak pada bagian ini mencakup periode pengembangan purwarupa dari awal 2026 hingga saat pendaftaran BUDAYA GO! 2026. Konteks data adalah pengembangan internal tim WARISAN SUARA tanpa kemitraan komersial eksternal pada tahap purwarupa. Ketiadaan rekam jejak komersial pada tahap ini tidak menggugurkan kepesertaan sepanjang produk memenuhi persyaratan kesiapan purwarupa fungsional yang dapat diverifikasi publik. Seluruh klaim dapat diverifikasi melalui tautan demonstrasi live dan repositori kode sumber yang disebut di atas."
  ));
  return out;
}

// ───────────────────────────────────────────────────────────
// SECTION 15: Keberlanjutan dan Potensi Pengembangan
// ───────────────────────────────────────────────────────────
function section15() {
  const out = [h1("15. Keberlanjutan dan Potensi Pengembangan")];
  out.push(p(
    "WARISAN SUARA dirancang agar dapat terus dikembangkan setelah kompetisi BUDAYA GO! 2026, baik dari sisi budaya, operasional, teknologi, ekonomi, maupun dampaknya bagi masyarakat setempat. Bagian ini menjelaskan langkah realistis dan sumber daya yang dibutuhkan agar produk tidak berhenti pada tahap kompetisi atau demonstrasi."
  ));

  out.push(h2("Keberlanjutan Bahan Baku dan Pengetahuan Budaya"));
  out.push(p(
    "Bahan baku produk adalah bahasa daerah dan tradisi lisan Indonesia. Sumber bahan baku tidak terbatas karena Indonesia memiliki lebih 700 bahasa daerah dan ribuan tradisi lisan yang masih dapat didokumentasikan. Penutur asli dan komunitas adat pemilik pengetahuan tradisional adalah mitra utama dalam keberlanjutan bahan baku. Strategi yang dilakukan adalah memberikan honorarium kepada penutur asli untuk setiap sesi rekaman validasi, serta menjamin atribusi yang jelas pada setiap konten. Keberlanjutan bahan baku terjamin selama komunitas pemilik pengetahuan tetap diajak sebagai mitra setara."
  ));

  out.push(h2("Keberlanjutan Keterlibatan Pelaku Budaya dan Komunitas"));
  out.push(p(
    "Pelaku budaya dan maestro tradisi lisan diundang sebagai kontributor utama, bukan sekadar objek dokumentasi. Tim WARISAN SUARA menjalin hubungan jangka panjang dengan komunitas melalui kunjungan lapangan, sesi rekaman berkala, dan umpan balih tentang penggunaan konten mereka dalam modul pembelajaran. Komunitas adat diberi dashboard akses untuk melihat dan mengelola konten mereka sendiri, sehingga mereka memiliki kontrol atas pengetahuan yang mereka bagikan."
  ));

  out.push(h2("Ketersediaan SDM, Teknologi, dan Pembiayaan"));
  out.push(p(
    "SDM saat ini adalah tim 3 orang dengan peran AI Engineer, UI/UX Designer, dan Strategi Startup. Pada tahun pertama, tim akan bertambah 2 kontributor paruh waktu untuk riset lapangan dan pengembangan modul. Teknologi yang digunakan sudah berbasis infrastruktur serverless Cloudflare yang dapat dijalankan dengan biaya rendah pada tahap awal. Pembiayaan awal didukung oleh revenue pilot B2G dan B2B pada 12 bulan pertama, dengan opsi pendanaan eksternal (grant atau seed investment) pada tahun kedua untuk ekspansi skala."
  ));

  out.push(h2("Konsistensi Kualitas dan Peningkatan Kapasitas"));
  out.push(p(
    "Konsistensi kualitas dijaga melalui validasi penutur asli untuk setiap rekaman yang masuk ke basis data, kontrol editorial untuk modul pembelajaran, serta pengujian otomatis untuk endpoint API. Peningkatan kapasitas pengguna dilakukan melalui skalabilitas horizontal Cloudflare edge yang otomatis menyesuaikan beban. Target kapasitas adalah 10.000 pengguna B2C aktif bulanan pada tahun pertama komersialisasi, dan 100.000 pengguna pada tahun ketiga."
  ));

  out.push(h2("Kemitraan, Distribusi, dan Adaptasi Pasar"));
  out.push(p(
    "Kemitraan utama meliputi Cloudflare untuk infrastruktur, Badan Bahasa Kemendikbud untuk data rujukan, komunitas adat untuk pengetahuan tradisional, dan pemerintah daerah serta sekolah untuk distribusi. Strategi adaptasi pasar dilakukan melalui riset pengguna berkala, survei kepuasan mitra B2G/B2B, serta iterasi fitur berdasarkan umpan balik pengguna. Distribusi melalui web PWA dan kanal media sosial, dengan opsi mobile native di tahun kedua."
  ));

  out.push(h2("Pengelolaan Risiko dan Perlindungan Hak Budaya"));
  out.push(p(
    "Pengelolaan risiko meliputi: (1) risiko kehilangan penutur asli diatasi dengan dokumentasi berkala dan prioritas pada bahasa terancam punah, (2) risiko penyalahgunaan konten diatasi dengan Cloudflare Turnstile dan kebijakan lisensi atribusi wajib, (3) risiko operasional diatasi dengan backup basis data dan redundansi edge network. Perlindungan hak budaya diwujudkan melalui atribusi yang jelas, persetujuan tertulis dengan komunitas, kebijakan tidak mengeksploitasi konten sakral di luar konteks yang diizinkan, serta dashboard kontrol komunitas untuk mengelola konten mereka."
  ));

  out.push(h2("Dampak Ekonomi Budaya"));
  out.push(p(
    "Dampak ekonomi budaya yang ditargetkan adalah terciptanya ekonomi baru bagi pelaku budaya melalui honorarium rekaman, ekonomi baru bagi komunitas adat melalui lisensi data dengan bagi hasil, ekonomi baru bagi pendidik melalui akses materi ajar yang berkualitas, serta ekonomi baru bagi pemerintah daerah melalui dashboard kebijakan berbasis data. Target dampak adalah 1.000 pelaku budaya mendapat honorarium rekaman pada tahun ketiga, dan 50 komunitas adat mitra pada tahun kelima."
  ));
  return out;
}

// ───────────────────────────────────────────────────────────
// SECTION 16: Potensi Cultural Power Indonesia di Dunia
// ───────────────────────────────────────────────────────────
function section16() {
  const out = [h1("16. Potensi Cultural Power Indonesia di Dunia")];
  out.push(p(
    "WARISAN SUARA berkontribusi terhadap penguatan identitas, daya tarik, dan pengaruh kebudayaan Indonesia di arena internasional dengan merepresentasikan kebudayaan Indonesia secara kontekstual dan bertanggung jawab. Produk tidak menampilkan kebudayaan sebagai komoditas eksotis, melainkan sebagai pengetahuan hidup yang didokumentasikan bersama komunitas pemiliknya."
  ));

  out.push(h2("Representasi Kebudayaan yang Bertanggung Jawab"));
  out.push(p(
    "Setiap entri bahasa daerah dan tradisi lisan dalam platform disertai atribusi komunitas, konteks penggunaan, dan metadata asal daerah. Representasi ini menghindari penyederhanaan atau pelanggaran konteks sakral. Produk menyediakan jalur konsultasi tertulis dengan komunitas pemilik pengetahuan sebelum setiap konten dipublikasikan. Pendekatan ini sejalan dengan prinsip-prinsip UNESCO Convention for the Safeguarding of the Intangible Cultural Heritage (2003) yang telah diratifikasi Indonesia."
  ));

  out.push(h2("Peluang Pengenalan Kebudayaan ke Khalayak Luas"));
  out.push(p(
    "Peluang pengenalan kebudayaan Indonesia melalui WARISAN SUARA bersifat berjenjang dari tingkat Kota/Kabupaten, Provinsi, Nasional, hingga Dunia. Pada tingkat kota/kabupaten, produk menjadi alat dokumentasi bahasa dan tradisi lokal. Pada tingkat provinsi, produk menjadi dashboard kebijakan pemda. Pada tingkat nasional, produk menjadi infrastruktur kebudayaan digital yang menyatukan data dari berbagai daerah. Pada tingkat dunia, produk menjadi jendela representasi kebudayaan Indonesia bagi diaspora, akademik internasional, dan masyarakat global yang tertarik pada linguistik dan antropologi Nusantara."
  ));

  out.push(h2("Potensi Pengembangan Produk dengan Daya Saing Internasional"));
  out.push(p(
    "Produk memiliki potensi pengembangan dengan daya saing internasional karena menggunakan model AI open-source terbaru (Llama 3.1, Whisper, MeloTTS) yang juga digunakan oleh platform-platform internasional. Keunggulan kompetitif di arena internasional adalah spesialisasi pada bahasa daerah Indonesia yang tidak dilayani oleh platform AI global, integrasi tiga Objek Pemajuan Kebudayaan dalam satu siklus pengalaman pengguna, serta model bisnis yang mengakomodasi kemitraan komunitas."
  ));

  out.push(h2("Kolaborasi Lintas Daerah dan Lintas Negara"));
  out.push(p(
    "Kolaborasi lintas daerah di Indonesia dilakukan melalui kemitraan dengan pemerintah daerah dan komunitas adat di berbagai provinsi. Kolaborasi lintas negara dapat dikembangkan dengan negara ASEAN serumpun seperti Filipina dan Malaysia yang juga menghadapi tantangan pelestarian bahasa daerah. Produk dapat menjadi model infrastruktur kebudayaan digital yang dapat direplikasi di negara-negara serumpun, dengan adaptasi terhadap bahasa dan tradisi masing-masing."
  ));

  out.push(h2("Peluang Perluasan Pasar Internasional"));
  out.push(p(
    "Peluang perluasan pasar internasional yang realistis pada lima tahun ke depan adalah ekspansi ke pasar Filipina dan Malaysia serumpun, dengan target 10 bahasa daerah di setiap negara pada tahun kelima. Ekspansi ini akan dilakukan melalui kemitraan dengan institusi akademik lokal di negara tersebut, bukan melalui pendekatan komersial langsung yang berisiko tinggi. Klaim perluasan pasar internasional ini didukung oleh rencana terukur, bukan asumsi tanpa dasar."
  ));

  out.push(h2("Kontribusi terhadap Pengakuan dan Regenerasi Pelaku Budaya"));
  out.push(p(
    "Produk berkontribusi terhadap pengakuan pelaku budaya melalui atribusi yang jelas pada setiap konten, honorarium rekaman yang adil, serta dashboard komunitas untuk mengelola pengetahuan mereka. Regenerasi pelaku budaya diwujudkan melalui modul pembelajaran yang dapat diakses generasi muda, Tutor AI yang mendampingi belajar, serta jalur kontributor muda untuk terlibat dalam dokumentasi. Strategi dan indikator yang memungkinkan dampak ini tercapa meliputi target 1.000 pelaku budaya terhonorarium pada tahun ketiga dan 10.000 pelajar terdaftar pada modul belajar pada tahun yang sama."
  ));
  return out;
}

// ───────────────────────────────────────────────────────────
// SECTION 17: Roadmap Pengembangan Produk dan Bisnis
// ───────────────────────────────────────────────────────────
function section17() {
  const out = [h1("17. Roadmap Pengembangan Produk dan Bisnis")];
  out.push(p(
    "Peta jalan pengembangan WARISAN SUARA disusun secara realistis sesuai dengan tingkat kesiapan produk (purwarupa fungsional). Setiap tahap dilengkapi dengan target, waktu, kebutuhan sumber daya, mitra potensial, dan indikator keberhasilan. Target yang sudah memiliki komitmen dibedakan dari target yang masih berupa rencana."
  ));

  out.push(h2("A. Jangka Pendek (6\u201312 Bulan)"));
  out.push(p(
    "Target utama jangka pendek adalah validasi kebutuhan pengguna dan pasar melalui pilot dengan 50 penutur asli bahasa daerah yang berkontribusi rekaman validasi. Aktivitas yang dilakukan meliputi: (1) validasi kebutuhan pengguna melalui wawancara dengan 5 pemerintah daerah dan 20 sekolah calon mitra, (2) penguatan model bisnis melalui penandatanganan 2 kerja sama pilot B2G, (3) penambahan pengguna dengan target 1.000 pengguna B2C aktif bulanan, (4) pengembangan kemitraan dengan komunitas adat di 5 daerah prioritas, (5) penguatan operasional dengan upgrade Cloudflare Workers Paid, dan (6) pemasaran melalui media sosial dan presentasi langsung."
  ));
  out.push(p(
    "Waktu: 6-12 bulan setelah kompetisi BUDAYA GO! 2026. Kebutuhan sumber daya: tim 3 orang penuh waktu paruh, anggaran operasional Rp 50-100 juta untuk honorarium penutur, infrastruktur upgrade, dan pemasaran awal. Mitra potensial: Cloudflare, Badan Bahasa Kemendikbud, 5 pemerintah daerah pilot, komunitas adat 5 daerah. Indikator keberhasilan: 50 penutur pilot aktif, 1.000 pengguna B2C aktif bulanan, 2 MoU B2G pilot, 10 bahasa baru terdata."
  ));

  out.push(h2("B. Jangka Menengah (1\u20132 Tahun)"));
  out.push(p(
    "Target utama jangka menengah adalah konsolidasi produk dan peningkatan kapasitas. Aktivitas yang dilakukan meliputi: (1) integrasi langsung dengan sistem informasi 5 pemerintah daerah mitra, (2) pengembangan mobile native sebagai aplikasi Android dan iOS, (3) peningkatan kapasitas pengguna ke 10.000 B2C aktif bulanan dan 50 sekolah langganan B2B, (4) perluasan distribusi ke 10 provinsi, (5) pengembangan layanan turunan API pengenalan suara bahasa daerah sebagai layanan untuk pengembang pihak ketiga, dan (6) penguatan keberlanjutan usaha melalui struktur legal PT atau yayasan."
  ));
  out.push(p(
    "Waktu: tahun ke-2 hingga akhir tahun ke-2 setelah kompetisi. Kebutuhan sumber daya: tim 5 orang (penambahan 2 staf riset lapangan dan pengembangan modul), anggaran Rp 300-500 juta untuk ekspansi tim, operasional, dan pemasaran. Mitra potensial: 5 pemerintah daerah mitra B2G, 50 sekolah mitra B2B, akademisi linguistik di 5 universitas, komunitas adat di 10 daerah baru. Indikator keberhasilan: 50 sekolah langganan, 5 pemerintah daerah mitra, 10.000 pengguna B2C, 30 bahasa terdata, mobile native live di Play Store dan App Store."
  ));

  out.push(h2("C. Jangka Panjang (3\u20135 Tahun)"));
  out.push(p(
    "Visi jangka panjang adalah menjadikan WARISAN SUARA sebagai infrastruktur kebudayaan digital nasional yang berkelanjutan, dengan kontribusi nyata terhadap ekosistem budaya dan Cultural Power Indonesia. Target utama meliputi: (1) 100 bahasa daerah terdata dengan dokumentasi lengkap audio dan transkrip, (2) sertifikasi resmi modul ajar dari Kemendikbud untuk digunakan di sekolah-sekolah nasional, (3) ekspansi pasar ke ASEAN serumpun dengan target 10 bahasa daerah di Filipina dan 10 bahasa daerah di Malaysia pada tahun kelima, (4) 100.000 pengguna B2C aktif bulanan dan 500 sekolah langganan, dan (5) kontribusi terhadap 1.000 pelaku budaya yang menerima honorarium rekaman."
  ));
  out.push(p(
    "Waktu: tahun ke-3 hingga tahun ke-5 setelah kompetisi. Kebutuhan sumber daya: tim 10 orang (organisasi formal sebagai PT atau yayasan), anggaran tahunan Rp 1-2 miliar untuk operasional, ekspansi tim, riset lapangan, dan pemasaran nasional. Mitra potensial: Kemendikbud untuk sertifikasi modul ajar, 20 pemerintah daerah mitra B2G, 500 sekolah B2B, institusi akademik di Filipina dan Malaysia untuk ekspansi ASEAN. Indikator keberhasilan: 100 bahasa terdata, sertifikasi Kemendikbud terbit, 20 provinsi mitra, 100.000 pengguna B2C, ekspansi ASEAN aktif di 2 negara."
  ));

  out.push(p(
    "Pembedaan target komitmen dan rencana: target pilot 50 penutur dan 1.000 pengguna B2C pada jangka pendek sudah memiliki komitmen internal tim dan beberapa calon mitra adat. Target sertifikasi Kemendikbud pada jangka panjang masih berupa rencana yang membutuhkan proses formal pengajuan dan kerja sama dengan Kemendikbud."
  ));
  return out;
}

// ───────────────────────────────────────────────────────────
// SECTION 18: Lampiran Pendukung
// ───────────────────────────────────────────────────────────
function section18() {
  const out = [h1("18. Lampiran Pendukung")];
  out.push(p(
    "Lampiran pendukung berikut disediakan untuk melengkapi klaim dalam proposal dan dapat dirujuk pada bagian proposal yang sesuai. Setiap lampiran diberi judul dan keterangan yang jelas."
  ));

  out.push(h2("Referensi dan Sumber Data"));
  out.push(bullet("Undang-Undang Republik Indonesia Nomor 5 Tahun 2017 tentang Pemajuan Kebudayaan. Jakarta: Sekretariat Negara."));
  out.push(bullet("Kongres Kebudayaan Indonesia 2018 dan 2023. Yogyakarta: Koordinator Kongres Kebudayaan."));
  out.push(bullet("UNESCO Atlas of the World\u2019s Languages in Danger. Paris: UNESCO Publishing."));
  out.push(bullet("UNESCO Convention for the Safeguarding of the Intangible Cultural Heritage 2003. Paris: UNESCO."));
  out.push(bullet("Badan Bahasa Kemendikbud \u2013 Data Bahasa Daerah Indonesia."));
  out.push(bullet("Badan Pusat Statistik (BPS) \u2013 Sensus Penduduk dan data penutur bahasa daerah."));
  out.push(bullet("Cloudflare Workers AI Documentation \u2013 model reference untuk Llama 3.1, Whisper, MeloTTS."));

  out.push(h2("Foto, Mockup, dan Video Produk"));
  out.push(bullet("Sepuluh mockup antarmuka: beranda, peta bahasa, halaman detail bahasa, studio rekam, form studio dengan Turnstile, modul belajar, lesson player, tutor AI, arsip tradisi, dan detail tradisi. Tersedia di folder download/mockups pada repositori."));
  out.push(bullet("Video showcase berdurasi 3:00 menit yang menjelaskan latar belakang, solusi, cara kerja, dan manfaat produk. Tersedia di download/Video-Showcase-Warisan-Suara.mp4."));
  out.push(bullet("Slide deck presentasi 10 slide 16:9 widescreen. Tersedia di download/Slide-Deck-Warisan-Suara-BUDAYAGO2026.pptx."));

  out.push(h2("Portofolio dan Dokumentasi Produk"));
  out.push(bullet("Tautan demonstrasi live: https://warisan-suara.pages.dev"));
  out.push(bullet("Repositori kode sumber: https://github.com/hyperchainpro/Warisan-Suara"));
  out.push(bullet("Endpoint health check API: https://warisan-suara.pages.dev/api/health"));
  out.push(bullet("Endpoint statistik API: https://warisan-suara.pages.dev/api/stats"));
  out.push(bullet("Dokumentasi pengembangan internal pada README.md di repositori GitHub."));

  out.push(h2("Dokumentasi Kolaborasi dengan Pelaku Budaya"));
  out.push(p(
    "Dokumentasi kolaborasi dengan pelaku budaya dan komunitas adat dilakukan secara berkala melalui wawancara semi-terstruktur, sesi rekaman audio, dan validasi transkrip bersama penutur asli. Atribusi setiap kontributor dicatat pada metadata konten di basis data produk. Persetujuan tertulis dengan komunitas pemilik pengetahuan tradisional dilakukan sebelum konten dipublikasikan di platform."
  ));

  out.push(h2("Tautan Kanal dan Bukti Lain"));
  out.push(bullet("Situs web produk: https://warisan-suara.pages.dev"));
  out.push(bullet("Repositori GitHub: https://github.com/hyperchainpro/Warisan-Suara"));
  out.push(bullet("Email korespondensi: warisansuara.id@gmail.com"));
  out.push(p(
    "Bukti lain yang relevan dengan klaim dalam proposal dapat diminta kepada tim melalui email korespondensi dan akan disediakan dalam waktu maksimal 3 hari kerja. Seluruh lampiran pendukung dirujuk pada bagian proposal yang sesuai, terutama pada bagian 8 (Solusi dan Deskripsi Produk), 14 (Rekam Jejak dan Bukti Validasi), serta 17 (Roadmap Pengembangan)."
  ));
  return out;
}

// ───────────────────────────────────────────────────────────
// LAMPIRAN 2: Bukti Produk dan Materi Presentasi
// ───────────────────────────────────────────────────────────
function lampiran2(mockDir) {
  const out = [];

  // Lampiran 2 title — page break attached to this content paragraph
  // (avoids empty paragraph + PageBreak which postcheck flags as blank-page risk)
  // Uses HEADING_1 so it appears in TOC as a major section
  out.push(new Paragraph({
    heading: HeadingLevel.HEADING_1,
    alignment: AlignmentType.CENTER,
    spacing: { before: 240, after: 240, line: 312 },
    children: [
      new PageBreak(),
      new TextRun({
        text: "Lampiran 2 : Bukti Produk dan Materi Presentasi",
        bold: true, size: 32, color: P.body, font: FONT_HEAD,
      }),
    ],
  }));

  out.push(p(
    "Setiap peserta BUDAYA GO! 2026 saat periode pendaftaran telah menyiapkan materi pendukung untuk membuktikan keberadaan, fungsi, dan potensi produk sesuai dengan kategori Inovasi Digital serta persyaratan pengumpulan dalam Juknis. Bukti produk disematkan dalam proposal dalam bentuk tautan dan diunggah ke repositori publik."
  ));

  // A. Bukti Produk Inovasi Digital
  out.push(h2("A. Bukti Produk Inovasi Digital"));
  out.push(p(
    "Bagian ini menyajikan bukti produk inovasi digital berupa tangkapan layar antarmuka, video deskripsi produk, tautan demo, dokumentasi produk digital, serta bukti penggunaan dan rekam jejak. Seluruh bukti dapat diverifikasi publik melalui tautan yang disebutkan."
  ));

  out.push(h3("Foto Produk dan Tangkapan Layar Antarmuka"));
  out.push(p(
    "Sepuluh tangkapan layar antarmuka telah diambil dari purwarupa fungsional yang live di warisan-suara.pages.dev. Berikut adalah dua tangkapan layar strategis yang menunjukkan beranda produk dan studio rekam dengan validasi Turnstile."
  ));
  out.push(imageParagraph(path.join(mockDir, "01-beranda.png"), 280, 1400));
  out.push(caption("Gambar 9: Tangkapan layar beranda WARISAN SUARA \u2013 statistik platform dan navigasi ke lima fitur utama."));
  out.push(imageParagraph(path.join(mockDir, "04-studio-rekam.png"), 280, 1400));
  out.push(caption("Gambar 10: Tangkapan layar Studio Rekam dengan Whisper ASR dan validasi Cloudflare Turnstile."));

  out.push(h3("Video Deskripsi Produk"));
  out.push(p(
    "Video showcase berdurasi 3:00 menit telah diproduksi untuk menjelaskan latar belakang, solusi, cara kerja, dan manfaat produk. Narasi video menggunakan suara sintesis Bahasa Indonesia yang dibangkitkan melalui model MeloTTS Cloudflare Workers AI. Video tersedia di download/Video-Showcase-Warisan-Suara.mp4."
  ));

  out.push(h3("Tautan Demo, Situs Web, dan Kanal Distribusi"));
  out.push(bulletRuns([{ text: "Tautan demo live: ", bold: true }, "https://warisan-suara.pages.dev"]));
  out.push(bulletRuns([{ text: "Repositori GitHub: ", bold: true }, "https://github.com/hyperchainpro/Warisan-Suara"]));
  out.push(bulletRuns([{ text: "Endpoint health check: ", bold: true }, "https://warisan-suara.pages.dev/api/health"]));
  out.push(bulletRuns([{ text: "Endpoint statistik: ", bold: true }, "https://warisan-suara.pages.dev/api/stats"]));

  out.push(h3("Dokumentasi Produk Digital dan Proses Pengembangan"));
  out.push(p(
    "Dokumentasi pengembangan produk tersedia di README.md repositori GitHub, mencakup penjelasan arsitektur, instalasi lokal, konfigurasi environment, dan struktur direktori. Proses pengembangan dapat dilacak melalui riwayat commit pada repositori yang menunjukkan pengembangan aktif dengan perbaikan dan fitur baru secara berkala."
  ));

  out.push(h3("Bukti Penggunaan dan Rekam Jejak"));
  out.push(p(
    "Bukti penggunaan dapat diverifikasi melalui respons endpoint /api/health yang mengembalikan status aktif, serta /api/stats yang mengembalikan jumlah bahasa (10), tradisi (20), dan modul (8) yang tersedia di basis data produk. Riwayat commit pada repositori GitHub menunjukkan aktivitas pengembangan berkelanjutan sejak awal 2026 hingga saat pendaftaran BUDAYA GO! 2026."
  ));

  // B. Video Showcase
  out.push(h2("B. Video Showcase"));
  out.push(p(
    "Video showcase WARISAN SUARA berdurasi 3:00 menit, sesuai dengan syarat BUDAYA GO! 2026 yang mensyaratkan durasi 3-5 menit. Video berisi kegunaan dan manfaat produk digital bagi pengguna, konsumen, pelaku budaya, komunitas, dan masyarakat."
  ));

  out.push(h3("Spesifikasi Video"));
  out.push(bulletRuns([{ text: "Durasi: ", bold: true }, "3:00 menit (180 detik), dalam batas syarat 3-5 menit."]));
  out.push(bulletRuns([{ text: "Konten: ", bold: true }, "16 scene dengan narasi Bahasa Indonesia."]));
  out.push(bulletRuns([{ text: "Narasi suara: ", bold: true }, "Cloudflare MeloTTS (@cf/myshell-ai/melotts)."]));
  out.push(bulletRuns([{ text: "Format file: ", bold: true }, "MP4 (H.264 + AAC)."]));
  out.push(bulletRuns([{ text: "Lokasi file: ", bold: true }, "download/Video-Showcase-Warisan-Suara.mp4."]));

  out.push(h3("Isi Video Showcase (6 Poin Wajib)"));
  out.push(pRuns([
    { text: "Pengenalan Produk: ", bold: true },
    "Nama WARISAN SUARA, konsep platform AI pelestarian bahasa dan tradisi lisan Nusantara, fungsi utama integrasi tiga Objek Pemajuan Kebudayaan, serta unsur kebudayaan Indonesia yang menjadi dasar inovasi (Tradisi Lisan, Manuskrip, Bahasa)."
  ]));
  out.push(pRuns([
    { text: "Demonstrasi Produk: ", bold: true },
    "Peragaan langsung cara kerja lima fitur utama di warisan-suara.pages.dev \u2013 Peta Bahasa, Studio Rekam dengan Whisper ASR, Modul Belajar dengan MeloTTS, Tutor AI dengan Llama 3.1, dan Arsip Tradisi."
  ]));
  out.push(pRuns([
    { text: "Kegunaan dan Manfaat: ", bold: true },
    "Nilai guna produk bagi pemerintah daerah (basis data kebijakan), sekolah (materi ajar), individu (akses belajar bahasa daerah), serta pelaku budaya dan komunitas (honorarium rekaman, atribusi pengetahuan)."
  ]));
  out.push(pRuns([
    { text: "Keunikan dan Nilai Tambah: ", bold: true },
    "Keunggulan dibanding solusi sejenis \u2013 Whisper ASR khusus bahasa daerah yang belum ada kompetitor, integrasi 3 Objek Pemajuan dalam satu siklus, arsitektur Cloudflare edge dengan latensi rendah, mobile PWA tanpa hambatan app store."
  ]));
  out.push(pRuns([
    { text: "Bukti Penggunaan atau Pengujian: ", bold: true },
    "Tangkapan layar endpoint /api/health dan /api/stats yang menunjukkan status aktif dan statistik basis data (10 bahasa, 20 tradisi, 8 modul). Tangkapan layar repositori GitHub yang menunjukkan riwayat pengembangan aktif."
  ]));
  out.push(pRuns([
    { text: "Potensi Pengembangan: ", bold: true },
    "Peluang keberlanjutan melalui model bisnis B2G/B2B/B2C/B2B riset, pengembangan pasar ke 100 bahasa pada 5 tahun, sertifikasi Kemendikbud, dan ekspansi ASEAN ke Filipina serta Malaysia serumpun."
  ]));

  // C. Slide Deck PPT
  out.push(h2("C. Slide Deck PPT"));
  out.push(p(
    "Slide deck presentasi telah disiapkan oleh tim WARISAN SUARA untuk mendukung proposal produk dan dipersiapkan saat membaca Juknis BUDAYA GO! 2026. Slide deck ini akan dipaparkan pada saat Showcase bagi peserta yang lolos seleksi administrasi dan substansi ke 20 besar finalis."
  ));

  out.push(h3("Spesifikasi Slide Deck"));
  out.push(bulletRuns([{ text: "Jumlah slide: ", bold: true }, "10 slide."]));
  out.push(bulletRuns([{ text: "Format: ", bold: true }, "16:9 widescreen PowerPoint (.pptx)."]));
  out.push(bulletRuns([{ text: "Lokasi file: ", bold: true }, "download/Slide-Deck-Warisan-Suara-BUDAYAGO2026.pptx."]));

  out.push(h3("Isi 10 Slide (10 Poin Wajib)"));
  out.push(bulletRuns([{ text: "Slide 1 \u2013 Latar Belakang: ", bold: true }, "700+ bahasa daerah, 25% terancam (UNESCO), hilangnya penutur muda dan tradisi lisan."]));
  out.push(bulletRuns([{ text: "Slide 2 \u2013 Permasalahan: ", bold: true }, "Hilangnya maestro, terhentinya pewarisan, tidak adanya platform terpadu, kurang materi ajar sekolah."]));
  out.push(bulletRuns([{ text: "Slide 3 \u2013 Penyelesaian yang sudah ada, rencana jangka pendek, dan jangka panjang: ", bold: true }, "Purwarupa live 10 bahasa/20 tradisi; pilot 50 penutur (jangka pendek); 100 bahasa + sertifikasi Kemendikbud + ekspansi ASEAN (jangka panjang)."]));
  out.push(bulletRuns([{ text: "Slide 4 \u2013 Unsur kebudayaan Indonesia: ", bold: true }, "3 Objek Pemajuan: Tradisi Lisan (No. 1), Manuskrip (No. 2), Bahasa (No. 8)."]));
  out.push(bulletRuns([{ text: "Slide 5 \u2013 Solusi, fungsi, dan cara kerja: ", bold: true }, "5 fitur \u2013 Peta Bahasa, Studio Rekam (Whisper), Modul Belajar (MeloTTS), Tutor AI (Llama 3.1), Arsip Tradisi."]));
  out.push(bulletRuns([{ text: "Slide 6 \u2013 Sasaran pengguna atau pasar: ", bold: true }, "B2G pemda, B2B sekolah, B2C individu, B2B riset. 128,5 juta penutur terdata."]));
  out.push(bulletRuns([{ text: "Slide 7 \u2013 Keunikan dan nilai tambah: ", bold: true }, "Whisper ASR bahasa daerah (belum ada kompetitor), 3 Objek Pemajuan sekaligus, Cloudflare edge."]));
  out.push(bulletRuns([{ text: "Slide 8 \u2013 Dampak yang telah dicapai dan diharapkan: ", bold: true }, "Purwarupa live (10 bahasa/20 tradisi/8 modul); target jangka pendek pilot 50 penutur, jangka panjang 1.000 pelaku budaya terhonorarium."]));
  out.push(bulletRuns([{ text: "Slide 9 \u2013 Kondisi aktual produk: ", bold: true }, "Purwarupa fungsional TRL 6-7, 13 endpoint API aktif, kode sumber publik di GitHub."]));
  out.push(bulletRuns([{ text: "Slide 10 \u2013 Model bisnis dan roadmap: ", bold: true }, "BMC 9 elemen, revenue B2G/B2B/B2C/B2B riset, roadmap pendek/menengah/panjang."]));

  return out;
}

// ───────────────────────────────────────────────────────────
// MAIN ASSEMBLY
// ───────────────────────────────────────────────────────────
const mockDir = "/home/z/my-project/download/mockups";
const outPath = "/home/z/my-project/download/Proposal-Warisan-Suara-BUDAYAGO2026.docx";

const coverConfig = {
  englishLabel: "BUDAYA GO! 2026 PROPOSAL",
  title: "WARISAN SUARA",
  subtitle: "Platform AI Pelestarian Bahasa & Tradisi Lisan Nusantara",
  metaLines: [
    "Tema: Indonesia Cultural Power",
    "Subtema: Inventing the Future from Indonesian Culture",
    "",
    "Disusun oleh:",
    "Febri Rizki, S.Si., M.Si. \u2014 Ketua (AI Engineer)",
    "Oki Handinata, S.Si. \u2014 Anggota (UI/UX Designer)",
    "Martha Martinni, S.Si. \u2014 Anggota (Strategi Startup)",
    "",
    "Warisan Suara Team",
    "Jakarta \u2022 Bandung \u2022 Yogyakarta",
  ],
  footerLeft: "Kompetisi Inovasi Budaya Indonesia",
  footerRight: "2026",
};

// Body footer (Arabic page numbers)
function bodyFooter() {
  return new Footer({
    children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { line: 240 },
      children: [new TextRun({ children: [PageNumber.CURRENT], size: 18, color: "808080", font: FONT })],
    })],
  });
}

function bodyHeader() {
  return new Header({
    children: [new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { line: 240 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: P.accent, space: 4 } },
      children: [new TextRun({
        text: "WARISAN SUARA \u2014 Proposal BUDAYA GO! 2026",
        size: 18, color: "808080", font: FONT, italics: true,
      })],
    })],
  });
}

function frontFooter() {
  return new Footer({
    children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { line: 240 },
      children: [new TextRun({ children: [PageNumber.CURRENT], size: 18, color: "808080", font: FONT })],
    })],
  });
}

// Build front matter: TOC
function buildFrontMatter() {
  const out = [];
  out.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 480, after: 360, line: 312 },
    children: [new TextRun({
      text: "Daftar Isi",
      bold: true, size: 32, color: P.body, font: FONT_HEAD,
    })],
  }));

  out.push(new TableOfContents("Daftar Isi", {
    hyperlink: true,
    headingStyleRange: "1-3",
  }));

  out.push(new Paragraph({
    spacing: { before: 200, line: 312 },
    children: [new TextRun({
      text: "Catatan: Daftar isi ini dibuat melalui field code. Untuk memastikan nomor halaman akurat setelah pengeditan, klik kanan pada daftar isi dan pilih \u201cUpdate Field\u201d.",
      italics: true, size: 18, color: "888888", font: FONT,
    })],
  }));

  // ⚠️ No trailing PageBreak — next section is SectionType.NEXT_PAGE which
  // already produces the page break. Trailing PageBreak would cause blank page.

  return out;
}

// Body content: header block + 18 sections + Lampiran 2
function buildBody() {
  const out = [];
  out.push(...headerBlock());
  out.push(...section1());
  out.push(...section2());
  out.push(...section3());
  out.push(...section4());
  out.push(...section5());
  out.push(...section6());
  out.push(...section7());
  out.push(...section8(mockDir));
  out.push(...section9());
  out.push(...section10());
  out.push(...section11());
  out.push(...section12());
  out.push(...section13());
  out.push(...section14(mockDir));
  out.push(...section15());
  out.push(...section16());
  out.push(...section17());
  out.push(...section18());
  out.push(...lampiran2(mockDir));
  return out;
}

// Document
const doc = new Document({
  creator: "Warisan Suara Team",
  title: "Proposal WARISAN SUARA - BUDAYA GO! 2026",
  description: "Platform AI Pelestarian Bahasa & Tradisi Lisan Nusantara",
  styles: {
    default: {
      document: {
        run: {
          font: FONT,
          size: 22,
          color: "000000",
        },
        paragraph: {
          spacing: { line: 312 },
        },
      },
      heading1: {
        run: { font: FONT_HEAD, size: 32, bold: true, color: P.body },
        paragraph: { spacing: { before: 360, after: 180, line: 312 } },
      },
      heading2: {
        run: { font: FONT_HEAD, size: 28, bold: true, color: P.body },
        paragraph: { spacing: { before: 240, after: 120, line: 312 } },
      },
      heading3: {
        run: { font: FONT_HEAD, size: 24, bold: true, color: P.body },
        paragraph: { spacing: { before: 200, after: 100, line: 312 } },
      },
    },
  },
  numbering: {
    config: [{
      reference: "default-bullets",
      levels: [
        { level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
        { level: 1, format: LevelFormat.BULLET, text: "\u25E6", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 1440, hanging: 360 } } } },
      ],
    }],
  },
  sections: [
    // Section 1: Cover (margin 0, no page number)
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838, orientation: PageOrientation.PORTRAIT },
          margin: { top: 0, bottom: 0, left: 0, right: 0 },
        },
      },
      children: buildCoverR4(coverConfig),
    },
    // Section 2: Front matter — TOC with Roman numerals
    {
      properties: {
        type: SectionType.NEXT_PAGE,
        page: {
          size: { width: 11906, height: 16838, orientation: PageOrientation.PORTRAIT },
          margin: { top: 1440, bottom: 1440, left: 1701, right: 1417 },
          pageNumbers: { start: 1, formatType: NumberFormat.UPPER_ROMAN },
        },
      },
      headers: { default: bodyHeader() },
      footers: { default: frontFooter() },
      children: buildFrontMatter(),
    },
    // Section 3: Body — Arabic numerals starting from 1
    {
      properties: {
        type: SectionType.NEXT_PAGE,
        page: {
          size: { width: 11906, height: 16838, orientation: PageOrientation.PORTRAIT },
          margin: { top: 1440, bottom: 1440, left: 1701, right: 1417 },
          pageNumbers: { start: 1, formatType: NumberFormat.DECIMAL },
        },
      },
      headers: { default: bodyHeader() },
      footers: { default: bodyFooter() },
      children: buildBody(),
    },
  ],
});

const buf = await Packer.toBuffer(doc);
fs.writeFileSync(outPath, buf);
console.log("WROTE:", outPath, "(" + (buf.length / 1024).toFixed(1) + " KB)");
