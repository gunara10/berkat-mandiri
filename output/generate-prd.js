const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  TableOfContents, PageBreak, AlignmentType, HeadingLevel, WidthType,
  ShadingType, BorderStyle, SectionType, NumberFormat, TableLayoutType,
  Header, Footer, PageNumber, ImageRun,
} = require("docx");

// ═══════════════════════════════════════════════════════════════
// GO-1 PALETTE
// ═══════════════════════════════════════════════════════════════
const P = {
  bg: "1A2330",
  primary: "FFFFFF",
  accent: "D4875A",
  cover: { titleColor: "FFFFFF", subtitleColor: "B0B8C0", metaColor: "90989F", footerColor: "687078" },
  table: { headerBg: "D4875A", headerText: "FFFFFF", accentLine: "D4875A", innerLine: "DDD0C8", surface: "F8F0EB" },
};

// ═══════════════════════════════════════════════════════════════
// BORDER CONSTANTS
// ═══════════════════════════════════════════════════════════════
const NB = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: NB, bottom: NB, left: NB, right: NB };
const allNoBorders = { top: NB, bottom: NB, left: NB, right: NB, insideHorizontal: NB, insideVertical: NB };

// ═══════════════════════════════════════════════════════════════
// PAGE LAYOUT
// ═══════════════════════════════════════════════════════════════
const pgSize = { width: 11906, height: 16838, orientation: 1 }; // A4 portrait
const pgMargin = { top: 1440, bottom: 1440, left: 1701, right: 1417 };

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════
function emptyPara() {
  return new Paragraph({ spacing: { line: 312 }, children: [] });
}

function bodyPara(text) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    indent: { firstLine: 480 },
    spacing: { line: 312, after: 120 },
    children: [new TextRun({ text, size: 24, color: "000000", font: { eastAsia: "SimSun", ascii: "Times New Roman" } })],
  });
}

function bodyParaMulti(runs) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    indent: { firstLine: 480 },
    spacing: { line: 312, after: 120 },
    children: runs.map(r => {
      if (typeof r === "string") return new TextRun({ text: r, size: 24, color: "000000", font: { eastAsia: "SimSun", ascii: "Times New Roman" } });
      return new TextRun({ size: 24, color: "000000", font: { eastAsia: "SimSun", ascii: "Times New Roman" }, ...r });
    }),
  });
}

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 480, after: 240, line: 312 },
    children: [new TextRun({ text, bold: true, size: 32, color: "000000", font: { eastAsia: "SimHei", ascii: "Times New Roman" } })],
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 360, after: 180, line: 312 },
    children: [new TextRun({ text, bold: true, size: 28, color: "000000", font: { eastAsia: "SimHei", ascii: "Times New Roman" } })],
  });
}

function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 240, after: 120, line: 312 },
    children: [new TextRun({ text, bold: true, size: 26, color: "000000", font: { eastAsia: "SimHei", ascii: "Times New Roman" } })],
  });
}

// Table helper - header cell
function headerCell(text, widthPct) {
  return new TableCell({
    width: { size: widthPct, type: WidthType.PERCENTAGE },
    shading: { type: ShadingType.CLEAR, fill: P.table.headerBg },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 2, color: P.table.headerBg },
      bottom: { style: BorderStyle.SINGLE, size: 2, color: P.table.headerBg },
      left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE },
    },
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { line: 312 },
      children: [new TextRun({ text, bold: true, size: 21, color: P.table.headerText, font: { eastAsia: "SimHei", ascii: "Times New Roman" } })],
    })],
  });
}

// Table helper - data cell
function dataCell(text, widthPct, rowIndex) {
  const bg = rowIndex % 2 === 0 ? P.table.surface : "FFFFFF";
  return new TableCell({
    width: { size: widthPct, type: WidthType.PERCENTAGE },
    shading: { type: ShadingType.CLEAR, fill: bg },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: P.table.innerLine },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: P.table.innerLine },
      left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE },
    },
    margins: { top: 60, bottom: 60, left: 120, right: 120 },
    children: [new Paragraph({
      spacing: { line: 312 },
      children: [new TextRun({ text, size: 21, color: "000000", font: { eastAsia: "SimSun", ascii: "Times New Roman" } })],
    })],
  });
}

function dataCellBold(text, widthPct, rowIndex) {
  const bg = rowIndex % 2 === 0 ? P.table.surface : "FFFFFF";
  return new TableCell({
    width: { size: widthPct, type: WidthType.PERCENTAGE },
    shading: { type: ShadingType.CLEAR, fill: bg },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: P.table.innerLine },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: P.table.innerLine },
      left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE },
    },
    margins: { top: 60, bottom: 60, left: 120, right: 120 },
    children: [new Paragraph({
      spacing: { line: 312 },
      children: [new TextRun({ text, bold: true, size: 21, color: "000000", font: { eastAsia: "SimHei", ascii: "Times New Roman" } })],
    })],
  });
}

function tableCaption(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 200, line: 312 },
    children: [new TextRun({ text, italics: true, size: 21, color: "000000", font: { eastAsia: "SimSun", ascii: "Times New Roman" } })],
  });
}

// ═══════════════════════════════════════════════════════════════
// COVER RECIPE R4: Top Color Block
// ═══════════════════════════════════════════════════════════════
function calcTitleLayout(title, maxWidthTwips, preferredPt, minPt) {
  preferredPt = preferredPt || 40;
  minPt = minPt || 24;
  const charWidth = function(pt) { return pt * 20; };
  const charsPerLine = function(pt) { return Math.floor(maxWidthTwips / charWidth(pt)); };
  let titlePt = preferredPt;
  let lines;
  while (titlePt >= minPt) {
    var cpl = charsPerLine(titlePt);
    if (cpl < 2) { titlePt -= 2; continue; }
    lines = splitTitleLines(title, cpl);
    if (lines.length <= 3) break;
    titlePt -= 2;
  }
  if (!lines || lines.length > 3) {
    lines = splitTitleLines(title, charsPerLine(minPt));
    titlePt = minPt;
  }
  return { titlePt: titlePt, titleLines: lines };
}

function splitTitleLines(title, charsPerLine) {
  if (title.length <= charsPerLine) return [title];
  var breakAfter = new Set([
    "\u201c", "\u201d", "\u2018", "\u2019",
  ].join("").split("").concat(
    ",.、;\uff1a!?？-_\u2014\u2013\u00b7/ ".split("")
  ));
  var lines = [];
  var remaining = title;
  while (remaining.length > charsPerLine) {
    var breakAt = -1;
    for (var i = charsPerLine; i >= Math.floor(charsPerLine * 0.6); i--) {
      if (i < remaining.length && breakAfter.has(remaining[i - 1])) { breakAt = i; break; }
    }
    if (breakAt === -1) {
      var limit = Math.min(remaining.length, Math.ceil(charsPerLine * 1.3));
      for (var j = charsPerLine + 1; j < limit; j++) {
        if (breakAfter.has(remaining[j - 1])) { breakAt = j; break; }
      }
    }
    if (breakAt === -1) breakAt = charsPerLine;
    lines.push(remaining.slice(0, breakAt).trim());
    remaining = remaining.slice(breakAt).trim();
  }
  if (remaining) lines.push(remaining);
  if (lines.length > 1 && lines[lines.length - 1].length <= 2) {
    var last = lines.pop();
    lines[lines.length - 1] += last;
  }
  return lines;
}

function buildCoverR4(config) {
  var padL = 1200, padR = 800;
  var availableWidth = 11906 - padL - padR;
  var titleLayout = calcTitleLayout(config.title, availableWidth, 40, 26);
  var titlePt = titleLayout.titlePt;
  var titleLines = titleLayout.titleLines;
  var titleSize = titlePt * 2;

  var titleBlockHeight = titleLines.length * (titlePt * 23 + 200);
  var englishLabelH = config.englishLabel ? (9 * 23 + 500) : 0;
  var subtitleH = config.subtitle ? (12 * 23 + 200) : 0;
  var upperContentH = englishLabelH + titleBlockHeight + subtitleH;
  var UPPER_MIN = 7500;
  var UPPER_H = Math.max(UPPER_MIN, upperContentH + 1500 + 800);
  var DIVIDER_H = 60;

  var contentEstimate =
    (config.englishLabel ? (9 * 23 + 500) : 0) +
    titleLines.length * (titlePt * 23 + 200) +
    (config.subtitle ? (12 * 23 + 200) : 0);
  var spacerIntrinsic = 280;
  var topSpacing = Math.max(UPPER_H - contentEstimate - spacerIntrinsic - 800, 400);

  // Upper dark block
  var upperBlock = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    borders: allNoBorders,
    rows: [new TableRow({
      height: { value: UPPER_H, rule: "exact" },
      children: [new TableCell({
        shading: { type: ShadingType.CLEAR, fill: P.bg }, borders: noBorders,
        verticalAlign: "top",
        margins: { left: padL, right: padR },
        children: [
          new Paragraph({ spacing: { before: topSpacing } }),
          config.englishLabel ? new Paragraph({
            spacing: { after: 500 },
            children: [new TextRun({ text: config.englishLabel.split("").join(" "),
              size: 18, color: P.accent, font: { ascii: "Calibri" }, characterSpacing: 60 })],
          }) : null,
        ].concat(titleLines.map(function(line, i) {
          return new Paragraph({
            spacing: { after: i < titleLines.length - 1 ? 100 : 200, line: Math.ceil(titlePt * 23), lineRule: "atLeast" },
            children: [new TextRun({ text: line, size: titleSize, bold: true,
              color: P.cover.titleColor, font: { eastAsia: "SimHei", ascii: "Arial" } })],
          });
        })).concat([
          config.subtitle ? new Paragraph({
            spacing: { after: 100 },
            children: [new TextRun({ text: config.subtitle, size: 24, color: P.cover.subtitleColor,
              font: { eastAsia: "Microsoft YaHei", ascii: "Arial" } })],
          }) : null,
        ]).filter(Boolean),
      })],
    })],
  });

  // Accent divider
  var divider = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: allNoBorders,
    rows: [new TableRow({
      height: { value: DIVIDER_H, rule: "exact" },
      children: [new TableCell({ borders: noBorders,
        shading: { type: ShadingType.CLEAR, fill: P.accent }, children: [emptyPara()] })],
    })],
  });

  // Lower white area
  var lowerContent = [
    new Paragraph({ spacing: { before: 800 } }),
  ];
  (config.metaLines || []).forEach(function(line) {
    lowerContent.push(new Paragraph({
      indent: { left: padL }, spacing: { after: 100 },
      children: [new TextRun({ text: line, size: 28, color: P.cover.metaColor,
        font: { eastAsia: "Microsoft YaHei", ascii: "Arial" } })],
    }));
  });
  lowerContent.push(new Paragraph({ spacing: { before: 2000 } }));
  lowerContent.push(new Paragraph({
    indent: { left: padL },
    children: [
      new TextRun({ text: config.footerLeft || "", size: 22, color: P.cover.footerColor }),
      new TextRun({ text: "          " }),
      new TextRun({ text: config.footerRight || "", size: 22, color: P.cover.footerColor }),
    ],
  }));

  // Outer wrapper
  return [new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    borders: allNoBorders,
    rows: [new TableRow({
      height: { value: 16838, rule: "exact" },
      children: [new TableCell({
        shading: { type: ShadingType.CLEAR, fill: "FFFFFF" }, borders: noBorders,
        verticalAlign: "top",
        children: [upperBlock, divider].concat(lowerContent),
      })],
    })],
  })];
}

// ═══════════════════════════════════════════════════════════════
// COVER CONFIG
// ═══════════════════════════════════════════════════════════════
var coverConfig = {
  title: "Product Requirements Document Website Berkat Mandiri Pendingin",
  englishLabel: "PRODUCT REQUIREMENTS DOCUMENT",
  subtitle: "Website E-Commerce HVAC dengan Static Export untuk Shared Hosting",
  metaLines: [
    "Disiapkan untuk: PT Berkat Mandiri Pendingin",
    "Kontak: Encep Sihabudin \u2014 (021) 2268-2617",
    "Tanggal: 16 Agustus 2025",
    "Versi: 1.0",
  ],
  footerLeft: "PT Digital Bisnis Manajemen (DIGIMAN)",
  footerRight: "Dokumen Rahasia",
};

// ═══════════════════════════════════════════════════════════════
// DOCUMENT CONTENT
// ═══════════════════════════════════════════════════════════════
var bodyChildren = [];

// ═══════════════════════════════════════════════════════════════
// 1. RINGKASAN EKSEKUTIF
// ═══════════════════════════════════════════════════════════════
bodyChildren.push(h1("1. Ringkasan Eksekutif"));

bodyChildren.push(bodyPara(
  "Dokumen Product Requirements Document (PRD) ini menyajikan spesifikasi teknis dan bisnis untuk website e-commerce PT Berkat Mandiri Pendingin (BMP), perusahaan distributor produk pendingin (HVAC) yang berlokasi di Glodok, Jakarta Barat. Website telah dibangun menggunakan pendekatan static export berbasis Next.js 16 dengan TypeScript, dan telah berhasil dideploy sebagai kumpulan file HTML, CSS, dan JavaScript murni yang dapat dihosting pada layanan shared hosting konvensional."
));

bodyChildren.push(bodyPara(
  "Website ini menampilkan katalog 70 produk dari 10 kategori HVAC dengan fitur pencarian, filter, sort, dan paginasi yang sepenuhnya berjalan di sisi klien tanpa memerlukan server atau database. Sistem keranjang belanja terintegrasi langsung dengan WhatsApp untuk proses checkout, menghilangkan kebutuhan payment gateway atau backend processing. Total ukuran output hanya 2,9 megabyte, menjadikannya sangat ringan dan cepat dimuat pada koneksi internet apapun."
));

bodyChildren.push(bodyPara(
  "Dokumen ini juga menyajikan analisis perbandingan mendalam antara pendekatan static export yang telah diterapkan dengan alternatif WordPress, sebuah platform Content Management System (CMS) yang umum digunakan di Indonesia. Berdasarkan analisis keamanan, performa, kemudahan pemeliharaan, dan biaya operasional, dokumen ini merekomendasikan agar solusi static export dipertahankan sebagai pendekatan utama untuk website BMP. Rekomendasi ini didasarkan pada fakta bahwa static export menghasilkan performa Core Web Vitals yang lebih baik, bebas risiko keamanan dari celah plugin, dan tidak memerlukan biaya bulanan di luar shared hosting."
));

// ═══════════════════════════════════════════════════════════════
// 2. LATAR BELAKANG & ANALISIS MASALAH
// ═══════════════════════════════════════════════════════════════
bodyChildren.push(h1("2. Latar Belakang dan Analisis Masalah"));

bodyChildren.push(h2("2.1 Profil Perusahaan"));

bodyChildren.push(bodyPara(
  "PT Berkat Mandiri Pendingin merupakan perusahaan distributor resmi produk Heating, Ventilation, Air Conditioning, and Refrigeration (HVAC) yang didirikan pada tahun 2010. Berkantor pusat di Jl. Hayam Wuruk No. 2-5 Gedung New Harco, Glodok Lantai 1 Blok C 45, Jakarta Barat 11180, perusahaan ini melayani kebutuhan pendingin untuk proyek-proyek komersial dan residensial di seluruh Indonesia. Dengan pengalaman lebih dari 13 tahun di industri HVAC, BMP telah menangani lebih dari 5.000 proyek di 34 provinsi dan menjalin kemitraan dengan lebih dari 50 merek terkemuka dunia seperti Daikin, Mitsubishi Electric, Panasonic, LG, Samsung, Toshiba, Fujitsu, dan lainnya."
));

bodyChildren.push(bodyPara(
  "Jangkauan layanan BMP mencakup wilayah strategis di seluruh Indonesia, meliputi kota-kota besar di Pulau Jawa (Jakarta, Bekasi, Tangerang, Bandung, Semarang, Surabaya), Sumatera (Medan, Palembang, Pekanbaru, Batam), Kalimantan (Balikpapan, Pontianak, Banjarmasin), Sulawesi (Makassar, Manado), Bali, hingga Papua (Jayapura, Sorong). Perusahaan juga memiliki cabang di Surabaya untuk melayani kawasan Indonesia Timur secara lebih dekat."
));

bodyChildren.push(h2("2.2 Identifikasi Masalah"));

bodyChildren.push(bodyPara(
  "BMP memerlukan sebuah website e-commerce yang mampu menampilkan katalog produk secara profesional, memfasilitasi komunikasi penjualan melalui WhatsApp, dan berfungsi optimal pada infrastruktur shared hosting yang terjangkau. Beberapa kebutuhan spesifik yang teridentifikasi meliputi: pertama, website harus mendukung Search Engine Optimization (SEO) penuh agar mudah ditemukan oleh calon pelanggan melalui mesin pencari; kedua, website harus dapat dikelola oleh tim non-teknis, bahkan dengan bantuan kecerdasan buatan (AI); ketiga, pemeliharaan harus seminimal mungkin karena perusahaan tidak memiliki tim IT internal yang dedicated."
));

bodyChildren.push(bodyPara(
  "Dalam konteks pasar Indonesia, WordPress merupakan pilihan paling populer untuk membangun website bisnis karena kemudahan penggunaannya dan ekosistem plugin yang luas. Namun, WordPress memiliki kebutuhan mendasar akan database MySQL, pembaruan rutin, dan ketergantungan pada plugin pihak ketiga yang seringkali menjadi vektor serangan keamanan. Oleh karena itu, perlu dilakukan analisis mendalam untuk menentukan apakah WordPress benar-benar merupakan pilihan terbaik, atau terdapat pendekatan alternatif yang lebih sesuai dengan kebutuhan spesifik BMP."
));

// ═══════════════════════════════════════════════════════════════
// 3. TUJUAN & SASARAN
// ═══════════════════════════════════════════════════════════════
bodyChildren.push(h1("3. Tujuan dan Sasaran"));

bodyChildren.push(h2("3.1 Tujuan Utama"));

bodyChildren.push(bodyPara(
  "Tujuan utama dari pengembangan website ini adalah menyediakan platform digital profesional untuk PT Berkat Mandiri Pendingin yang mampu menampilkan seluruh katalog produk HVAC secara komprehensif, memfasilitasi proses penjualan melalui integrasi WhatsApp, serta meningkatkan visibilitas online perusahaan melalui optimasi mesin pencari. Website ini dirancang untuk menjadi representasi digital yang kredibel dari BMP, membantu calon pelanggan menemukan informasi produk yang dibutuhkan dan menghubungi tim penjualan dengan mudah."
));

bodyChildren.push(h2("3.2 Sasaran Teknis"));

bodyChildren.push(bodyPara(
  "Dari sisi teknis, website harus memenuhi beberapa sasaran penting. Website harus sepenuhnya statis, artinya seluruh halaman di-generate pada saat build dan tidak memerlukan server-side processing saat runtime. Hal ini memungkinkan website dihosting pada layanan shared hosting standar tanpa kebutuhan Node.js, PHP, atau database di sisi server. Selain itu, website harus memiliki skor Core Web Vitals yang baik (Largest Contentful Paint di bawah 2,5 detik, First Input Delay di bawah 100 milidetik, Cumulative Layout Shift di bawah 0,1), memiliki ukuran total di bawah 5 megabyte, dan dapat diakses dengan baik pada perangkat mobile maupun desktop."
));

bodyChildren.push(h2("3.3 Sasaran Bisnis"));

bodyChildren.push(bodyPara(
  "Sasaran bisnis meliputi peningkatan jumlah inquiry pelanggan melalui kanal digital, penguatan brand image BMP sebagai distributor HVAC profesional, dan penyederhanaan proses komunikasi penjualan melalui integrasi WhatsApp. Website juga diharapkan dapat mengurangi beban tim penjualan dalam menjelaskan spesifikasi produk secara berulang, karena informasi produk yang lengkap sudah tersedia secara online. Dengan jangkauan layanan ke lebih dari 50 kota di Indonesia, website ini menjadi katalis penting bagi ekspansi bisnis BMP ke pasar digital."
));

// ═══════════════════════════════════════════════════════════════
// 4. FITUR WEBSITE YANG TELAH DIBANGUN
// ═══════════════════════════════════════════════════════════════
bodyChildren.push(h1("4. Fitur Website yang Telah Dibangun"));

bodyChildren.push(bodyPara(
  "Website BMP dibangun sebagai single-page application dengan arsitektur smooth scroll, di mana seluruh konten berada pada satu URL utama (/) dan navigasi antar seksi dilakukan melalui scroll halus. Berikut adalah detail dari 9 seksi utama beserta fitur-fitur di dalamnya."
));

bodyChildren.push(h2("4.1 Hero Section"));

bodyChildren.push(bodyPara(
  "Hero section merupakan bagian pertama yang dilihat pengunjung, menampilkan headline utama yang menonjolkan keunggulan BMP sebagai distributor HVAC terlengkap di Indonesia. Desain menggunakan gradien warna profesional dengan efek animasi masuk menggunakan Framer Motion. Terdapat tombol Call to Action (CTA) yang mengarahkan pengunjung langsung ke katalog produk dan tombol kontak WhatsApp yang selalu terlihat. Pada hero section juga ditampilkan informasi singkat mengenai kredensial perusahaan seperti jumlah brand partner dan jangkauan layanan nasional."
));

bodyChildren.push(h2("4.2 Tentang Perusahaan (About Section)"));

bodyChildren.push(bodyPara(
  "Seksi ini menyajikan profil perusahaan secara visual dengan layout dua kolom. Kolom kiri menampilkan kartu dekoratif dengan gradien warna teal yang memuat informasi utama perusahaan (tahun didirikan, lokasi, status distributor resmi) beserta statistik kunci: 13+ tahun pengalaman, 5.000+ proyek, 50+ brand partner, dan 34 provinsi terlayani. Kolom kanan memuat narasi cerita perusahaan serta kartu visi dan misi yang terstruktur. Animasi masuk menggunakan pola staggered fade-in dari kedua sisi untuk memberikan kesan profesional dan dinamis."
));

bodyChildren.push(h2("4.3 Kategori Produk"));

bodyChildren.push(bodyPara(
  "Grid kategori menampilkan 10 kategori produk HVAC dalam format kartu interaktif: Split Wall Mounted AC, Split Ducting AC, VRV/VRF, Chiller, Cassette AC, Floor Standing AC, Pipa dan Fitting, Oli dan Cairan, Aksesoris AC, serta Evaporator dan Kondensor. Setiap kartu menampilkan ikon representatif, nama kategori, dan jumlah produk di dalamnya. Kartu-kartu ini memiliki efek hover (perubahan elevasi dan warna border) serta animasi masuk menggunakan viewport-triggered spring animation dari Framer Motion. Klik pada kategori akan mengarahkan pengunjung ke seksi katalog produk dengan filter yang sesuai."
));

bodyChildren.push(h2("4.4 Katalog Produk"));

bodyChildren.push(bodyPara(
  "Katalog produk merupakan fitur utama website, menampilkan 70 produk dari seluruh kategori. Fitur pencarian dan filter berjalan sepenuhnya di sisi klien menggunakan hook useMemo dari React, tanpa memerlukan permintaan ke server. Pengunjung dapat memfilter produk berdasarkan kategori dan merek, mengurutkan berdasarkan harga (terendah ke tertinggi atau sebaliknya) dan nama produk, serta menavigasi halaman menggunakan sistem paginasi. Seluruh data produk telah di-bake ke dalam HTML statis pada saat build, sehingga mesin pencari dapat mengindeks seluruh konten produk tanpa perlu mengeksekusi JavaScript."
));

bodyChildren.push(bodyPara(
  "Setiap produk ditampilkan dalam kartu yang memuat gambar produk, nama, merek, harga (dengan format Rupiah), rating bintang, dan badge diskon jika berlaku. Klik pada kartu produk membuka modal detail yang menampilkan informasi lengkap termasuk deskripsi, spesifikasi teknis, dan tombol untuk menambahkan ke keranjang belanja. Sistem keranjang belanja menggunakan penyimpanan lokal (localStorage) melalui library Zustand dengan fitur persist, sehingga keranjang tetap terisi meskipun pengunjung menutup browser."
));

bodyChildren.push(h2("4.5 Brand Partners"));

bodyChildren.push(bodyPara(
  "Seksi brand partners menampilkan 21 merek HVAC terkemuka yang didistribusikan oleh BMP, ditampilkan dalam format marquee (teks berjalan) dengan dua baris. Baris pertama bergerak dari kanan ke kiri dan baris kedua dari kiri ke kanan, menciptakan efek visual yang dinamis dan menarik perhatian. Marquee akan berhenti bergerak saat pengunjung mengarahkan kursor (hover) ke area brand, memudahkan pembacaan. Merek-merek yang ditampilkan antara lain Daikin, Mitsubishi Electric, Panasonic, LG, Samsung, Toshiba, Fujitsu, Sharp, Gree, Midea, Haier, Carrier, York, McQuay, Trane, Danfoss, Emerson, Refcomp, Bitzer, Copeland, dan Sanden."
));

bodyChildren.push(h2("4.6 Keunggulan (Why Choose Us)"));

bodyChildren.push(bodyPara(
  "Seksi keunggulan menampilkan empat pilar utama value proposition BMP. Setiap pilar ditampilkan dalam kartu dengan ikon representatif dan statistik pendukung: Distributor Resmi dengan jaminan produk asli dan garansi resmi dari pabrikan; Harga Kompetitif dengan penawaran khusus untuk pembelian proyek dalam jumlah besar; Layanan Nasional yang mencakup pengiriman dan instalasi di seluruh Indonesia; serta Dukungan Teknis yang tersedia sebelum dan sesudah penjualan. Kartu-kartu ini menggunakan gradien warna gelap dengan teks putih untuk memberikan kontras visual yang kuat, dilengkapi animasi masuk yang terkoordinasi."
));

bodyChildren.push(h2("4.7 Testimoni Pelanggan"));

bodyChildren.push(bodyPara(
  "Seksi testimoni menampilkan tujuh ulasan pelanggan yang terverifikasi, masing-masing dalam kartu dengan nama, jabatan atau perusahaan, rating bintang, dan teks testimoni. Testimoni mencakup berbagai segmen pelanggan mulai dari kontraktor MEP, pengelola gedung perkantoran, hingga pemilik usaha. Format testimoni dirancang untuk membangun kepercayaan calon pelanggan dengan menampilkan pengalaman nyata dari pengguna produk dan jasa BMP. Setiap kartu memiliki animasi masuk menggunakan staggered spring animation yang memberikan kesan dinamis namun tetap profesional."
));

bodyChildren.push(h2("4.8 Jangkauan Layanan"));

bodyChildren.push(bodyPara(
  "Seksi ini menampilkan peta cakupan layanan BMP yang dibagi ke dalam enam wilayah regional: Jawa (9 kota), Sumatera (5 kota), Kalimantan (4 kota), Sulawesi (3 kota), Bali dan Nusa Tenggara (3 kota), serta Papua (2 kota). Total 26 kota ditampilkan dalam format grid kartu yang responsif, masing-masing dengan daftar kota dalam format badge (label kecil berwarna). Terdapat juga Call to Action untuk pengunjung yang kota tempat tinggalnya belum tercantum, mengarahkan mereka untuk menghubungi tim BMP melalui telepon."
));

bodyChildren.push(h2("4.9 Formulir Kontak dan FAQ"));

bodyChildren.push(bodyPara(
  "Seksi kontak menyediakan tiga kanal komunikasi: formulir kontak, nomor telepon, dan WhatsApp. Formulir kontak dirancang dengan field nama, email, nomor telepon, subjek, dan pesan. Ketika pengunjung mengirimkan formulir, data otomatis diformat dan dikirimkan melalui WhatsApp ke nomor customer service BMP, sehingga tidak diperlukan server-side form processing atau email gateway. Seksi FAQ (Frequently Asked Questions) menampilkan jawaban atas pertanyaan umum mengenai produk, layanan, pengiriman, dan garansi dalam format akordeon yang dapat diperluas dan dilipat."
));

// ═══════════════════════════════════════════════════════════════
// 5. PERBANDINGAN TEKNOLOGI
// ═══════════════════════════════════════════════════════════════
bodyChildren.push(h1("5. Perbandingan Teknologi: Static Export versus WordPress"));

bodyChildren.push(bodyPara(
  "Bagian ini menyajikan analisis perbandingan komprehensif antara dua pendekatan teknologi untuk membangun website BMP: static export menggunakan Next.js (pendekatan yang telah diterapkan) dan WordPress dengan plugin e-commerce (pendekatan alternatif). Perbandingan mencakup delapan dimensi kritis yang relevan dengan kebutuhan BMP."
));

// Comparison table
var compHeaders = ["Dimensi", "Static Export (Next.js)", "WordPress + WooCommerce"];
var compData = [
  ["Kebutuhan Server", "Hanya hosting file statis (HTML/CSS/JS). Tidak perlu PHP, Node.js, atau database.", "Membutuhkan PHP 7.4+, MySQL/MariaDB, dan modul server seperti mod_rewrite."],
  ["Keamanan", "Tidak ada database yang bisa diretas. Tidak ada celah plugin. Tidak ada form login admin.", "Risiko SQL injection, brute force login, dan celah keamanan dari plugin pihak ketiga."],
  ["Performa Loading", "Halaman sudah pre-rendered. Tidak ada query database. Waktu muat rata-rata di bawah 1 detik.", "Setiap halaman memerlukan query PHP + database. Waktu muat biasanya 2-5 detik."],
  ["Core Web Vitals", "Skor LCP, FID, dan CLS sangat baik karena konten sudah final saat HTML dimuat.", "Skor sering kali buruk karena render-blocking CSS/JS dan layout shift dari iklan/plugin."],
  ["SEO", "Meta tags dan structured data lengkap di dalam HTML statis. 100% terindeks oleh Googlebot.", "SEO bergantung pada plugin (Yoast/RankMath). Tambahkan beban dan potensi konflik."],
  ["Pemeliharaan", "Tidak perlu update plugin, tema, atau patch keamanan. Build ulang hanya saat konten berubah.", "Update rutin: WordPress core, tema, dan plugin setiap bulan. Risiko breakage setelah update."],
  ["Biaya Bulanan", "Hanya biaya shared hosting (mulai Rp15.000-50.000/bulan). Tanpa biaya tambahan.", "Shared hosting + biaya plugin premium (Rp300.000-1.000.000/bulan untuk fitur lengkap)."],
  ["Skalabilitas", "File statis dapat di-serve oleh CDN global tanpa batasan concurrent user.", "Batasan concurrent PHP process dan database connection pada shared hosting."],
];

bodyChildren.push(tableCaption("Tabel 1. Perbandingan Static Export Next.js versus WordPress"));

var compTableRows = [
  new TableRow({
    tableHeader: true,
    cantSplit: true,
    children: [
      headerCell(compHeaders[0], 18),
      headerCell(compHeaders[1], 41),
      headerCell(compHeaders[2], 41),
    ],
  }),
];
compData.forEach(function(row, idx) {
  compTableRows.push(new TableRow({
    cantSplit: true,
    children: [
      dataCellBold(row[0], 18, idx),
      dataCell(row[1], 41, idx),
      dataCell(row[2], 41, idx),
    ],
  }));
});

bodyChildren.push(new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  borders: {
    top: { style: BorderStyle.SINGLE, size: 2, color: P.table.accentLine },
    bottom: { style: BorderStyle.SINGLE, size: 2, color: P.table.accentLine },
    left: { style: BorderStyle.NONE },
    right: { style: BorderStyle.NONE },
    insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: P.table.innerLine },
    insideVertical: { style: BorderStyle.NONE },
  },
  rows: compTableRows,
}));

bodyChildren.push(bodyPara(
  "Berdasarkan tabel di atas, terlihat jelas bahwa pendekatan static export unggul pada hampir seluruh dimensi yang dibandingkan. Keunggulan paling signifikan terletak pada aspek keamanan dan performa. Tanpa database dan tanpa plugin, permukaan serangan (attack surface) static export hampir nol. Sementara itu, performa loading yang konsisten cepat tidak hanya meningkatkan pengalaman pengguna tetapi juga secara langsung berdampak positif pada peringkat SEO di Google."
));

bodyChildren.push(h2("5.1 Keunggulan Spesifik Static Export"));

bodyChildren.push(bodyPara(
  "Pendekatan static export memiliki beberapa keunggulan fundamental yang perlu dipahami secara mendalam. Pertama, file HTML yang dihasilkan sudah dalam bentuk final yang siap ditampilkan oleh browser, tanpa perlu diproses ulang oleh server. Ini berarti waktu respons server secara teoritis mendekati nol karena web server hanya perlu mengirimkan file yang sudah ada. Kedua, karena seluruh data produk sudah ter-embed di dalam HTML, mesin pencari seperti Google dapat mengindeks seluruh konten tanpa perlu mengeksekusi JavaScript, sebuah keuntungan besar dibandingkan Single Page Application (SPA) konvensional. Ketiga, ukuran total output yang hanya 2,9 megabyte memungkinkan seluruh website diunggah melalui FTP dalam hitungan detik ke shared hosting manapun."
));

bodyChildren.push(h2("5.2 Kelemahan WordPress untuk Kasus Ini"));

bodyChildren.push(bodyPara(
  "Meskipun WordPress merupakan platform yang populer dan mudah digunakan, terdapat beberapa kelemahan signifikan ketika digunakan untuk kasus penggunaan BMP. Pertama, WordPress memerlukan database MySQL yang berarti ada risiko keamanan tambahan berupa SQL injection, meskipun risiko ini dapat diminimalkan dengan praktik keamanan yang baik. Kedua, untuk mendapatkan fitur yang setara dengan website BMP saat ini (filter produk, keranjang belanja, formulir kontak, SEO), diperlukan minimal 5-8 plugin yang masing-masing memerlukan update rutin dan berpotensi saling konflik. Ketiga, performa WordPress cenderung menurun seiring bertambahnya konten dan plugin, terutama pada shared hosting dengan sumber daya terbatas. Keempat, kurva pembelajaran WordPress untuk pengguna non-teknis tidaklah sekecil yang sering diklaim, terutama ketika terjadi masalah teknis seperti plugin conflict atau error database."
));

// ═══════════════════════════════════════════════════════════════
// 6. REKOMENDASI SOLUSI
// ═══════════════════════════════════════════════════════════════
bodyChildren.push(h1("6. Rekomendasi Solusi"));

bodyChildren.push(bodyPara(
  "Berdasarkan analisis mendalam yang disajikan pada bagian sebelumnya, dokumen ini dengan tegas merekomendasikan agar solusi static export berbasis Next.js yang telah dibangun dipertahankan sebagai platform utama website PT Berkat Mandiri Pendingin. Rekomendasi ini didasarkan pada lima alasan utama yang saling terkait dan membentuk argumen yang kuat untuk pendekatan ini."
));

bodyChildren.push(h2("6.1 Keamanan Maksimal dengan Permukaan Serangan Nol"));

bodyChildren.push(bodyPara(
  "Static export tidak memiliki database, tidak memiliki form login administrator, dan tidak menjalankan kode server-side. Ini berarti tidak ada SQL injection, tidak ada brute force attack, tidak ada cross-site scripting (XSS) dari sisi server, dan tidak ada celah keamanan dari plugin pihak ketiga. Satu-satunya vektor serangan yang tersisa adalah pada level web server itu sendiri (Apache atau Nginx), yang merupakan tanggung jawab penyedia hosting dan sudah di-mitigasi secara standar. Dalam konteks BMP yang tidak memiliki tim keamanan siber dedicated, eliminasi seluruh vektor serangan aplikasi merupakan keuntungan yang sangat besar."
));

bodyChildren.push(h2("6.2 Performa Konsisten Tanpa Degradasi"));

bodyChildren.push(bodyPara(
  "Website statis memiliki performa yang deterministik: waktu muat hari ini sama dengan waktu muat enam bulan dari sekarang, karena tidak ada akumulasi data di database yang memperlambat query, tidak ada cache yang perlu dibersihkan, dan tidak ada plugin baru yang menambahkan JavaScript berat. Hal ini sangat penting untuk bisnis HVAC di mana calon pelanggan sering kali mengakses website dari perangkat mobile dengan koneksi internet yang tidak stabil di area proyek. Waktu muat yang konsisten di bawah 1 detik memastikan pengalaman pengguna yang andal dalam setiap kondisi."
));

bodyChildren.push(h2("6.3 Biaya Operasional Minimal"));

bodyChildren.push(bodyPara(
  "Total biaya operasional untuk website static export hanyalah biaya shared hosting, yang berkisar antara Rp15.000 hingga Rp50.000 per bulan. Tidak ada biaya tambahan untuk plugin premium, tidak ada biaya untuk layanan keamanan, dan tidak ada biaya untuk konsultan IT untuk pemeliharaan rutin. Sebagai perbandingan, website WordPress dengan fitur e-commerce yang setara memerlukan biaya plugin premium (WooCommerce, Yoast SEO, Wordfence Security, dan lain-lain) yang totalnya dapat mencapai Rp300.000 hingga Rp1.000.000 per bulan. Selisih biaya ini, meskipun tampak kecil, akan menjadi signifikan dalam jangka panjang dan dapat dialokasikan untuk aktivitas pemasaran yang lebih produktif."
));

bodyChildren.push(h2("6.4 Kemudahan Deploy yang Setara dengan WordPress"));

bodyChildren.push(bodyPara(
  "Salah satu keunggulan WordPress yang sering diklaim adalah kemudahan deploy pada shared hosting. Namun, pendekatan static export yang digunakan BMP memiliki kemudahan deploy yang setara. Proses deploy sama sederhananya: unggah seluruh file dari folder output melalui FTP atau File Manager di cPanel ke direktori public_html. Tidak perlu konfigurasi database, tidak perlu menjalankan installer, dan tidak perlu setting permission file. Bahkan, proses deploy static export lebih sederhana dari WordPress karena tidak memerlukan tahap instalasi dan konfigurasi awal."
));

bodyChildren.push(h2("6.5 Solusi Sudah Dibangun dan Berfungsi"));

bodyChildren.push(bodyPara(
  "Argumen terkuat untuk mempertahankan static export adalah bahwa solusi ini sudah dibangun, sudah diuji, dan sudah berfungsi dengan baik. Seluruh 70 produk sudah terindeks di dalam HTML statis, seluruh fitur pencarian dan filter berfungsi optimal, dan integrasi WhatsApp sudah bekerja dengan benar. Memigrasikan ke WordPress pada tahap ini akan memerlukan investasi waktu dan biaya yang signifikan tanpa memberikan keuntungan substantif. Risiko regressi (fitur yang sudah berfungsi menjadi bermasalah setelah migrasi) juga sangat tinggi. Prinsip utama dalam rekayasa perangkat lunak adalah: jika sesuatu sudah bekerja dengan baik, jangan ubah tanpa alasan yang kuat."
));

// ═══════════════════════════════════════════════════════════════
// 7. PANDUAN DEPLOY KE SHARED HOSTING
// ═══════════════════════════════════════════════════════════════
bodyChildren.push(h1("7. Panduan Deploy ke Shared Hosting"));

bodyChildren.push(bodyPara(
  "Berikut adalah panduan langkah demi langkah untuk mendeploy website BMP static export ke shared hosting konvensional. Panduan ini mengasumsikan pengguna memiliki akses ke cPanel atau panel kontrol hosting yang setara."
));

bodyChildren.push(h2("7.1 Persiapan File"));

bodyChildren.push(bodyPara(
  "Setelah proses build selesai, seluruh file website terdapat dalam folder output (out/). Folder ini berisi file index.html, folder _next/ yang memuat aset JavaScript dan CSS, serta file pendukung lainnya. Pastikan seluruh konten folder ini siap untuk diunggah. Jika menggunakan kompresi, buat arsip ZIP dari seluruh isi folder out/ tanpa menyertakan folder out/ itu sendiri, sehingga saat di-extract di server, file-file langsung berada di document root."
));

bodyChildren.push(h2("7.2 Upload melalui cPanel File Manager"));

bodyChildren.push(bodyPara(
  "Langkah pertama adalah login ke cPanel hosting melalui browser. Buka File Manager dan navigasikan ke direktori public_html. Hapus seluruh konten lama di direktori tersebut jika ini adalah deploy pertama atau jika ingin mengganti seluruh website. Kemudian, unggah file ZIP yang berisi website ke direktori public_html. Setelah upload selesai, extract file ZIP langsung di File Manager. Pastikan file index.html berada tepat di root directory public_html, bukan di dalam sub-folder. Verifikasi dengan membuka nama domain di browser."
));

bodyChildren.push(h2("7.3 Upload melalui FTP"));

bodyChildren.push(bodyPara(
  "Alternatif kedua adalah menggunakan klien FTP seperti FileZilla. Download dan install FileZilla, kemudian buat koneksi baru dengan memasukkan hostname (biasanya ftp.namadomain.com), username dan password FTP yang diberikan oleh penyedia hosting, dan port 21. Setelah terhubung, navigasikan di panel remote ke direktori public_html. Pada panel local, buka folder out/ yang berisi hasil build. Unggah seluruh isi folder out/ ke direktori public_html. Pastikan transfer mode diatur ke Auto atau Binary untuk menghindari korupsi file. Tunggu hingga seluruh file selesai diunggah, kemudian verifikasi dengan mengakses nama domain di browser."
));

bodyChildren.push(h2("7.4 Konfigurasi URL Rewriting"));

bodyChildren.push(bodyPara(
  "Untuk memastikan navigasi halaman berfungsi dengan baik, perlu dikonfigurasi URL rewriting pada web server. Untuk server Apache, tambahkan file .htaccess di root directory dengan konfigurasi yang mengarahkan semua request ke index.html. Untuk server Nginx, konfigurasi ditambahkan pada blok server di file konfigurasi Nginx. Sebagian besar shared hosting menggunakan Apache secara default sehingga file .htaccess sudah cukup. Konfigurasi ini memastikan bahwa ketika pengunjung merefresh halaman pada URL tertentu, server akan tetap menyajikan halaman yang benar."
));

// ═══════════════════════════════════════════════════════════════
// 8. STRATEGI SEO
// ═══════════════════════════════════════════════════════════════
bodyChildren.push(h1("8. Strategi SEO"));

bodyChildren.push(bodyPara(
  "Search Engine Optimization (SEO) merupakan aspek kritis bagi keberhasilan website BMP dalam menarik pengunjung organik dari mesin pencari. Berikut adalah strategi SEO yang telah diimplementasikan dan yang direkomendasikan untuk pengembangan selanjutnya."
));

bodyChildren.push(h2("8.1 SEO On-Page yang Telah Diimplementasikan"));

bodyChildren.push(bodyPara(
  "Website BMP telah dilengkapi dengan SEO on-page yang komprehensif. Setiap halaman memiliki meta title dan meta description yang dioptimalkan dengan kata kunci relevan seperti \"distributor AC Jakarta\", \"jual AC split\", \"supplier HVAC Indonesia\", dan lainnya. Seluruh konten menggunakan HTML semantik (heading hierarchy yang benar, alt text pada gambar, structured data JSON-LD untuk produk dan organisasi). Internal linking antar seksi memastikan mesin pencari dapat menemukan dan mengindeks seluruh konten. Karena static export menghasilkan HTML lengkap tanpa dependensi pada JavaScript rendering, seluruh konten termasuk data 70 produk sepenuhnya terindeks oleh Googlebot pada crawl pertama."
));

bodyChildren.push(h2("8.2 Structured Data"));

bodyChildren.push(bodyPara(
  "Website menggunakan schema.org structured data dalam format JSON-LD untuk memberikan konteks tambahan kepada mesin pencari. Terdapat dua jenis structured data yang diimplementasikan. Pertama, Organization schema yang mendefinisikan BMP sebagai organisasi bisnis dengan informasi nama, alamat, nomor telepon, dan email. Kedua, Product schema untuk setiap produk dalam katalog, yang memuat nama produk, deskripsi, harga, ketersediaan (in stock), dan rating. Implementasi structured data ini memungkinkan Google menampilkan rich snippets di hasil pencarian, seperti informasi harga langsung di halaman hasil pencarian, yang secara terbukti meningkatkan Click-Through Rate (CTR)."
));

bodyChildren.push(h2("8.3 Rekomendasi SEO Lanjutan"));

bodyChildren.push(bodyPara(
  "Untuk memaksimalkan potensi SEO, beberapa langkah lanjutan direkomendasikan. Pertama, pendaftaran website ke Google Search Console dan Bing Webmaster Tools untuk memantau indeksasi dan performa pencarian. Kedua, pembuatan sitemap XML yang memuat seluruh URL produk dan seksi untuk mempercepat proses indeksasi. Ketiga, optimasi gambar produk dengan format WebP dan ukuran yang tepat untuk meningkatkan kecepatan loading. Keempat, pembuatan konten blog atau artikel seputar tips pemilihan AC, perawatan HVAC, dan berita industri untuk menargetkan kata kunci long-tail yang memiliki tingkat kompetisi lebih rendah. Kelima, pendaftaran bisnis ke Google Business Profile untuk mendapatkan tampilan di Google Maps dan Local Pack."
));

// ═══════════════════════════════════════════════════════════════
// 9. ANALISIS BIAYA & SUMBER DAYA
// ═══════════════════════════════════════════════════════════════
bodyChildren.push(h1("9. Analisis Biaya dan Sumber Daya"));

bodyChildren.push(bodyPara(
  "Analisis biaya berikut membandingkan total biaya kepemilikan (Total Cost of Ownership) antara pendekatan static export dan WordPress dalam periode tiga tahun. Perhitungan mencakup biaya pengembangan awal, biaya hosting, biaya pemeliharaan, dan biaya sumber daya manusia."
));

bodyChildren.push(tableCaption("Tabel 2. Perbandingan Biaya Tahunan: Static Export versus WordPress"));

var costHeaders = ["Komponen Biaya", "Static Export", "WordPress + WooCommerce"];
var costData = [
  ["Pengembangan Awal", "Sudah selesai (sunk cost)", "Rp8.000.000 - Rp15.000.000"],
  ["Shared Hosting", "Rp15.000 - Rp50.000/bulan", "Rp50.000 - Rp150.000/bulan"],
  ["Domain (.co.id)", "Rp100.000 - Rp150.000/tahun", "Rp100.000 - Rp150.000/tahun"],
  ["SSL Certificate", "Gratis (Let\'s Encrypt / hosting)", "Gratis (Let\'s Encrypt / hosting)"],
  ["Plugin Premium", "Tidak diperlukan", "Rp300.000 - Rp1.000.000/bulan"],
  ["Pemeliharaan IT", "Hanya saat update konten", "Rp500.000 - Rp2.000.000/bulan"],
  ["Update Konten", "Build ulang + re-upload (AI assist)", "Edit via dashboard (built-in)"],
  ["Estimasi Biaya Tahunan", "Rp280.000 - Rp750.000", "Rp11.800.000 - Rp38.300.000"],
];

var costTableRows = [
  new TableRow({
    tableHeader: true,
    cantSplit: true,
    children: [
      headerCell(costHeaders[0], 25),
      headerCell(costHeaders[1], 37),
      headerCell(costHeaders[2], 38),
    ],
  }),
];
costData.forEach(function(row, idx) {
  costTableRows.push(new TableRow({
    cantSplit: true,
    children: [
      dataCellBold(row[0], 25, idx),
      dataCell(row[1], 37, idx),
      dataCell(row[2], 38, idx),
    ],
  }));
});

bodyChildren.push(new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  borders: {
    top: { style: BorderStyle.SINGLE, size: 2, color: P.table.accentLine },
    bottom: { style: BorderStyle.SINGLE, size: 2, color: P.table.accentLine },
    left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE },
    insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: P.table.innerLine },
    insideVertical: { style: BorderStyle.NONE },
  },
  rows: costTableRows,
}));

bodyChildren.push(bodyPara(
  "Data pada Tabel 2 menunjukkan perbedaan biaya yang sangat signifikan. Static export memiliki estimasi biaya tahunan antara Rp280.000 hingga Rp750.000, yang sebagian besar merupakan biaya hosting dan domain. Sementara itu, WordPress memerlukan biaya tahunan antara Rp11.800.000 hingga Rp38.300.000 ketika memperhitungkan kebutuhan plugin premium, pemeliharaan rutin oleh tenaga IT, dan hosting dengan spesifikasi yang lebih tinggi untuk menangani beban PHP dan database. Dalam periode tiga tahun, selisih biaya ini dapat mencapai puluhan juta rupiah yang dapat dialokasikan untuk kegiatan pemasaran digital seperti Google Ads atau kampanye media sosial."
));

bodyChildren.push(bodyPara(
  "Perlu dicatat bahwa biaya pengembangan awal untuk static export sudah merupakan sunk cost (biaya yang sudah dikeluarkan dan tidak dapat dikembalikan), sehingga biaya yang relevan untuk keputusan going forward hanyalah biaya operasional dan pemeliharaan. Dengan demikian, argumen biaya semakin menguatkan rekomendasi untuk mempertahankan solusi static export yang sudah ada."
));

// ═══════════════════════════════════════════════════════════════
// 10. ANALISIS RISIKO & MITIGASI
// ═══════════════════════════════════════════════════════════════
bodyChildren.push(h1("10. Analisis Risiko dan Mitigasi"));

bodyChildren.push(bodyPara(
  "Setiap solusi teknologi memiliki risiko yang perlu diidentifikasi dan dimitigasi. Berikut adalah analisis risiko untuk solusi static export beserta strategi mitigasi yang direkomendasikan."
));

bodyChildren.push(tableCaption("Tabel 3. Matriks Risiko dan Mitigasi"));

var riskHeaders = ["Risiko", "Dampak", "Probabilitas", "Strategi Mitigasi"];
var riskData = [
  ["Update konten memerlukan build ulang", "Rendah", "Tinggi", "Gunakan bantuan AI (chat.z.ai) untuk proses rebuild. Buat dokumentasi langkah demi langkah. Latih satu staf untuk prosedur build sederhana."],
  ["Keterbatasan fitur dinamis (tanpa backend)", "Rendah", "Sedang", "Integrasikan layanan pihak ketiga (Google Forms, WhatsApp API) untuk fitur yang memerlukan server-side processing."],
  ["Ketergantungan pada developer untuk perubahan kode", "Sedang", "Sedang", "Dokumentasikan seluruh arsitektur dan konfigurasi. Simpan source code di repository Git. Gunakan layanan AI coding untuk perubahan kecil."],
  ["Shared hosting mengalami downtime", "Sedang", "Rendah", "Pilih penyedia hosting dengan uptime SLA minimal 99,5%. Pertimbangkan upgrade ke VPS jika trafik meningkat signifikan."],
  ["Konten tidak ter-update secara real-time", "Rendah", "Tinggi", "Untuk bisnis HVAC, informasi produk berubah relatif jarang (bulanan atau kuartalan). Real-time update bukan kebutuhan kritis."],
  ["Scalability terbatas pada shared hosting", "Rendah", "Rendah", "File statis dapat di-serve oleh CDN global (CloudFlare, BunnyCDN) tanpa perubahan infrastruktur hosting."],
];

var riskTableRows = [
  new TableRow({
    tableHeader: true,
    cantSplit: true,
    children: [
      headerCell(riskHeaders[0], 25),
      headerCell(riskHeaders[1], 10),
      headerCell(riskHeaders[2], 10),
      headerCell(riskHeaders[3], 55),
    ],
  }),
];
riskData.forEach(function(row, idx) {
  riskTableRows.push(new TableRow({
    cantSplit: true,
    children: [
      dataCell(row[0], 25, idx),
      dataCell(row[1], 10, idx),
      dataCell(row[2], 10, idx),
      dataCell(row[3], 55, idx),
    ],
  }));
});

bodyChildren.push(new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  borders: {
    top: { style: BorderStyle.SINGLE, size: 2, color: P.table.accentLine },
    bottom: { style: BorderStyle.SINGLE, size: 2, color: P.table.accentLine },
    left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE },
    insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: P.table.innerLine },
    insideVertical: { style: BorderStyle.NONE },
  },
  rows: riskTableRows,
}));

bodyChildren.push(bodyPara(
  "Analisis menunjukkan bahwa seluruh risiko yang teridentifikasi memiliki dampak rendah hingga sedang, dengan strategi mitigasi yang jelas dan dapat diimplementasikan. Risiko dengan probabilitas tertinggi adalah keterbatasan dalam proses update konten dan tidak adanya pembaruan real-time. Namun, kedua risiko ini memiliki dampak yang rendah karena frekuensi perubahan konten produk HVAC relatif rendah, dan kebutuhan pembaruan real-time tidak relevan untuk model bisnis distributor yang transaksinya dilakukan melalui WhatsApp."
));

// ═══════════════════════════════════════════════════════════════
// 11. MANFAAT YANG DIHARAPKAN
// ═══════════════════════════════════════════════════════════════
bodyChildren.push(h1("11. Manfaat yang Diharapkan"));

bodyChildren.push(h2("11.1 Manfaat Jangka Pendek (0-6 Bulan)"));

bodyChildren.push(bodyPara(
  "Dalam jangka pendek, implementasi website ini diharapkan memberikan beberapa manfaat langsung. Pertama, peningkatan kredibilitas digital perusahaan karena calon pelanggan dapat mengecek katalog produk dan profil perusahaan secara online sebelum menghubungi tim penjualan. Kedua, efisiensi proses penjualan karena tim sales tidak perlu mengirimkan brosur atau pricelist secara manual melalui WhatsApp; mereka cukup mengarahkan calon pelanggan ke website. Ketiga, peningkatan jangkauan pasar karena website dapat diakses dari seluruh Indonesia 24 jam sehari, 7 hari seminggu, berbeda dengan toko fisik yang memiliki jam operasional terbatas."
));

bodyChildren.push(h2("11.2 Manfaat Jangka Menengah (6-18 Bulan)"));

bodyChildren.push(bodyPara(
  "Dalam jangka menengah, website yang telah terindeks dengan baik oleh mesin pencari akan mulai menghasilkan trafik organik yang konsisten. Dengan strategi SEO yang tepat, website BMP berpotensi muncul di halaman pertama Google untuk kata kunci spesifik seperti \"distributor AC Daikin Jakarta\", \"jual chiller harga grosir\", atau \"supplier VRF Indonesia\". Trafik organik ini memiliki nilai yang sangat tinggi karena pengunjung yang datang dari pencarian sudah memiliki intent (niat) pembelian yang jelas, sehingga tingkat konversi ke inquiry cenderung lebih tinggi dibandingkan trafik dari iklan berbayar."
));

bodyChildren.push(h2("11.3 Manfaat Jangka Panjang (18+ Bulan)"));

bodyChildren.push(bodyPara(
  "Dalam jangka panjang, website berfungsi sebagai aset digital yang terus bertambah nilainya seiring waktu. Konten yang terindeks di mesin pencari menjadi akumulasi yang semakin sulit ditandingi oleh kompetitor baru. Website juga menjadi fondasi untuk ekspansi digital lebih lanjut, seperti penambahan fitur quoting otomatis, integrasi dengan sistem ERP perusahaan, atau pengembangan platform e-commerce transaksional penuh. Arsitektur static export yang digunakan tidak membatasi kemungkinan ekspansi ini; ketika kebutuhan bisnis berkembang dan memerlukan fitur dinamis, website dapat secara bertahap di-migrasikan ke platform yang lebih canggih tanpa membuang investasi yang sudah dikeluarkan untuk konten dan desain."
));

// ═══════════════════════════════════════════════════════════════
// BUILD DOCUMENT
// ═══════════════════════════════════════════════════════════════
var coverChildren = buildCoverR4(coverConfig);

// Footer helper for page numbers
function romanPageFooter() {
  return new Footer({
    children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ children: [PageNumber.CURRENT], size: 18, color: "808080", font: { ascii: "Times New Roman" } }),
      ],
    })],
  });
}

function arabicPageFooter() {
  return new Footer({
    children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ children: [PageNumber.CURRENT], size: 18, color: "808080", font: { ascii: "Times New Roman" } }),
      ],
    })],
  });
}

var doc = new Document({
  styles: {
    default: {
      document: {
        run: {
          font: { ascii: "Times New Roman", eastAsia: "SimSun" },
          size: 24,
          color: "000000",
        },
        paragraph: {
          spacing: { line: 312 },
        },
      },
      heading1: {
        run: {
          font: { ascii: "Times New Roman", eastAsia: "SimHei" },
          size: 32,
          bold: true,
          color: "000000",
        },
        paragraph: {
          spacing: { line: 312 },
        },
      },
      heading2: {
        run: {
          font: { ascii: "Times New Roman", eastAsia: "SimHei" },
          size: 28,
          bold: true,
          color: "000000",
        },
        paragraph: {
          spacing: { line: 312 },
        },
      },
      heading3: {
        run: {
          font: { ascii: "Times New Roman", eastAsia: "SimHei" },
          size: 26,
          bold: true,
          color: "000000",
        },
        paragraph: {
          spacing: { line: 312 },
        },
      },
    },
  },
  sections: [
    // SECTION 1: COVER (no page number, no header/footer)
    {
      properties: {
        page: {
          size: pgSize,
          margin: { top: 0, bottom: 0, left: 0, right: 0 },
        },
      },
      children: coverChildren,
    },
    // SECTION 2: TOC (Roman numerals)
    {
      properties: {
        type: SectionType.NEXT_PAGE,
        page: {
          size: pgSize,
          margin: pgMargin,
          pageNumbers: { start: 1, formatType: NumberFormat.UPPER_ROMAN },
        },
      },
      footers: { default: romanPageFooter() },
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 480, after: 360, line: 312 },
          children: [new TextRun({
            text: "Daftar Isi",
            bold: true, size: 32, color: "000000",
            font: { eastAsia: "SimHei", ascii: "Times New Roman" },
          })],
        }),
        new TableOfContents("Table of Contents", {
          hyperlink: true,
          headingStyleRange: "1-3",
        }),
        new Paragraph({
          spacing: { before: 200, line: 312 },
          children: [new TextRun({
            text: "Catatan: Daftar Isi ini dibuat melalui field codes. Untuk memastikan akurasi nomor halaman setelah pengeditan, silakan klik kanan pada Daftar Isi dan pilih \"Update Field.\"",
            italics: true, size: 18, color: "888888",
          })],
        }),
        new Paragraph({ children: [new PageBreak()] }),
      ],
    },
    // SECTION 3: BODY (Arabic numerals starting at 1)
    {
      properties: {
        type: SectionType.NEXT_PAGE,
        page: {
          size: pgSize,
          margin: pgMargin,
          pageNumbers: { start: 1, formatType: NumberFormat.DECIMAL },
        },
      },
      footers: { default: arabicPageFooter() },
      children: bodyChildren,
    },
  ],
});

// ═══════════════════════════════════════════════════════════════
// GENERATE FILE
// ═══════════════════════════════════════════════════════════════
var OUTPUT_PATH = "/home/z/my-project/output/PRD-Berkat-Mandiri-Pendingin.docx";

Packer.toBuffer(doc).then(function(buffer) {
  fs.writeFileSync(OUTPUT_PATH, buffer);
  console.log("Generated: " + OUTPUT_PATH);
  console.log("Size: " + (buffer.length / 1024).toFixed(1) + " KB");
}).catch(function(err) {
  console.error("Error:", err);
  process.exit(1);
});
