// WARISAN SUARA - Seed Script
// Cloudflare-ready: ini akan di-port ke D1 seed untuk production
// Run: bun run db:seed

import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const languages = [
  {
    code: "sun",
    name: "Bahasa Sunda",
    region: "Tatar Sunda",
    province: "Jawa Barat",
    latitude: -6.9147,
    longitude: 107.6098,
    speakers: 38_000_000,
    vitality: "AMAN",
    isoCode: "sun",
    description:
      "Bahasa Sunda dituturkan oleh masyarakat Sunda di Jawa Barat. Termasuk rumpun Austronesia dengan tradisi sastra lisan kaya seperti pantun Sunda dan wawacan.",
    greetingText: "Sampurasun",
    greetingAudio: null,
    samplePhrase: "Kumaha damang?",
  },
  {
    code: "jav",
    name: "Bahasa Jawa Krama",
    region: "Jawa Tengah & Yogyakarta",
    province: "Jawa Tengah",
    latitude: -7.7956,
    longitude: 110.3695,
    speakers: 75_000_000,
    vitality: "AMAN",
    isoCode: "jav",
    description:
      "Bahasa Jawa dengan tingkatan ngoko, krama, dan krama inggil. Memiliki tradisi sastra lisan macapat dan tembang yang mendalam.",
    greetingText: "Sugeng enjing",
    greetingAudio: null,
    samplePhrase: "Pripun kabaripun?",
  },
  {
    code: "ban",
    name: "Bahasa Bali",
    region: "Bali",
    province: "Bali",
    latitude: -8.3405,
    longitude: 115.092,
    speakers: 3_300_000,
    vitality: "TERTENTU",
    isoCode: "ban",
    description:
      "Bahasa Bali memiliki tingkatan sor, singgih, dan alus. Tradisi lisan mencakup kidung, geguritan, dan kalumasan yang terkait ritual Hindu-Bali.",
    greetingText: "Rahajeng semeng",
    greetingAudio: null,
    samplePhrase: "Becik awakne?",
  },
  {
    code: "min",
    name: "Bahasa Minangkabau",
    region: "Sumatera Barat",
    province: "Sumatera Barat",
    latitude: -0.3056,
    longitude: 100.3695,
    speakers: 5_500_000,
    vitality: "AMAN",
    isoCode: "min",
    description:
      "Bahasa Minangkabau kaya dengan tradisi lisan pendendangan, kaba, dan pantun. Sistem matrilineal memengaruhi pewarisan pengetahuan lisan.",
    greetingText: "Salamaik datang",
    greetingAudio: null,
    samplePhrase: "Apo kabanyo?",
  },
  {
    code: "bug",
    name: "Bahasa Bugis",
    region: "Sulawesi Selatan",
    province: "Sulawesi Selatan",
    latitude: -4.8258,
    longitude: 119.2247,
    speakers: 4_000_000,
    vitality: "TERTENTU",
    isoCode: "bug",
    description:
      "Bahasa Bugis memiliki tradisi sastra lisan La Galigo, epos terpanjang di dunia. Tradisi tudang, pappasan, dan sendratari masih hidup.",
    greetingText: "Salama",
    greetingAudio: null,
    samplePhrase: "Pega ko mappare?",
  },
  {
    code: "sas",
    name: "Bahasa Sasak",
    region: "Lombok",
    province: "Nusa Tenggara Barat",
    latitude: -8.5833,
    longitude: 116.3833,
    speakers: 2_700_000,
    vitality: "TERTENTU",
    isoCode: "sas",
    description:
      "Bahasa Sasak memiliki variasi alokok nggenap-nggenap dengan tradisi lisan denda dan pantun. Melemah di kalangan anak muda urban.",
    greetingText: "Salam",
    greetingAudio: null,
    samplePhrase: "Becang rawe?",
  },
  {
    code: "tgr",
    name: "Bahasa Ternate",
    region: "Maluku Utara",
    province: "Maluku Utara",
    latitude: 0.7833,
    longitude: 127.3833,
    speakers: 80_000,
    vitality: "TERANCAM",
    isoCode: "tgl",
    description:
      "Bahasa Ternate, salah satu bahasa berstatus terancam. Tradisi lisan kabari dan legenda kerajaan Ternate belum terdokumentasi secara sistematis.",
    greetingText: "Salam",
    greetingAudio: null,
    samplePhrase: "Bicara ma ngofa?",
  },
  {
    code: "crb",
    name: "Bahasa Cirebon",
    region: "Cirebon & Indramayu",
    province: "Jawa Barat",
    latitude: -6.7167,
    longitude: 108.55,
    speakers: 1_200_000,
    vitality: "TERANCAM",
    isoCode: "jav", // dialek Jawa
    description:
      "Bahasa Cirebon (Cirebonan) adalah dialek Jawa dengan pengaruh kuat Sunda dan Arab. Status terancam karena anak muda beralih ke Bahasa Indonesia. Tradisi lisan: tembang Cirebonan, dongeng rakyat, mantra Sanduk.",
    greetingText: "Sugeng enjing",
    greetingAudio: null,
    samplePhrase: "Kumaha damang?",
  },
  {
    code: "gor",
    name: "Bahasa Gorontalo",
    region: "Gorontalo",
    province: "Gorontalo",
    latitude: 0.5333,
    longitude: 123.05,
    speakers: 1_000_000,
    vitality: "TERANCAM",
    isoCode: "gor",
    description:
      "Bahasa Gorontalo di Sulawesi Utara, status terancam karena tidak diajarkan secara formal. Kaya tradisi lisan: lumonde (pantun), lojiya (mantra), dongeng Turuntani.",
    greetingText: "Tabea",
    greetingAudio: null,
    samplePhrase: "Oluwo limongoli?",
  },
  {
    code: "nia",
    name: "Bahasa Nias",
    region: "Pulau Nias",
    province: "Sumatera Utara",
    latitude: 0.55,
    longitude: 97.85,
    speakers: 770_000,
    vitality: "TERANCAM",
    isoCode: "nia",
    description:
      "Bahasa Nias, bahasa unik di lepas pantai Sumatera, status terancam. Tradisi lisan: hoho (sastra lisan epik), famaedo (pantun), manata-manata (mantra pengobatan). Budaya megalitik & hombo batu (lompat batu).",
    greetingText: "Ya'ahowu",
    greetingAudio: null,
    samplePhrase: "Haga sibohou?",
  },
];

const traditions = [
  // Sunda
  {
    langCode: "sun",
    type: "pantun",
    title: "Pantun Sunda - Haturan",
    text: "Pantun pantun carita\nSi aing teu nyaho nyarita\nBilih aya nu kadang nyarios\nPunten kangge ngahaturkeun",
    translation: "Pantun adalah carita\nSaya tidak pandai bicara\nJika ada yang berbicara\nMohon untuk menghaturkan",
    meaning: "Pantun Sunda adalah bentuk sastra lisan tradisional yang digunakan untuk penghormatan dan pengantar.",
    region: "Tatar Sunda",
  },
  {
    langCode: "sun",
    type: "peribahasa",
    title: "Ungkara Sunda - Basa Sirah",
    text: "Silih asih, silih asah, silih asuh",
    translation: "Saling kasih, saling tajamkan (bina), saling asuh",
    meaning: "Filosofi Sunda tentang harmoni: saling mengasihi, saling membina, dan saling memelihara.",
    region: "Tatar Sunda",
  },
  // Jawa
  {
    langCode: "jav",
    type: "peribahasa",
    title: "Uga Jawa - Tri Hasta Karana",
    text: "Mikul dhuwur mendhem jero",
    translation: "Mengangkat tinggi-tinggi, merendam dalam-dalam",
    meaning: "Menjunjung tinggi nama baik keluarga dan menyimpan dalam-dalam aib keluarga. Filosofi Jawa tentang kehormatan.",
    region: "Jawa Tengah",
  },
  {
    langCode: "jav",
    type: "nyanyian",
    title: "Tembang Macapat - Dhandhanggula",
    text: "Pocung / Dhandhanggula:\nKang maswangi ratri sih satuhu,\n ginula tuladha tan waras,\n rurasa nora kober dhumawah.",
    translation: "Wanginya malam sungguh sate,\n jadi teladan yang tak terhapus,\n hati rasa tak mampu menumpahkan.",
    meaning: "Tembang macapat adalah puisi lisan Jawa dengan aturan guru gatra, guru wilangan, dan guru lagu.",
    region: "Yogyakarta",
  },
  // Bali
  {
    langCode: "ban",
    type: "mantra",
    title: "Mantra Bali - Panca Yadnya",
    text: "Om, Sang Hyang Widhi Wasa, tityaga masolahaken yadnya ring palemahan, ring pawongan, miwah ring parahyangan.",
    translation: "Om, Sang Hyang Widhi Wasa, melaksanakan yadnya di Palemahan (alam), Pawongan (manusia), dan Parahyangan (Tuhan).",
    meaning: "Mantra Tri Hita Karana, konsep kosmologi Bali tentang tiga sumber kebahagiaan: harmoni dengan alam, sesama, dan Tuhan.",
    region: "Bali",
  },
  {
    langCode: "ban",
    type: "nyanyian",
    title: "Kidung Wukir",
    text: "Wukir agung saking para,\n tonjol ring pahananing jagat,\n wangsa wangsa sampun jumeneng.",
    translation: "Gunung agung dari puncaknya,\n menjulang di bagian dunia,\n satu per satu sudah berdiri.",
    meaning: "Kidung adalah nyanyian sakral Bali yang dilantunkan dalam ritual agama Hindu-Bali.",
    region: "Bali",
  },
  // Minang
  {
    langCode: "min",
    type: "pantun",
    title: "Pantun Minangkabau - Kaba",
    text: "Aia dicinto dek ulu,\n bapaya bumi dituduak.\n Pantun sapantun ameh bugih,\n nan malayang diudaro.",
    translation: "Air dicintai ulu sungai,\n tanah bumi ditegakkan.\n Pantun sepantun emas bugih,\n yang melayang di udara.",
    meaning: "Pantun Minangkabau khas dengan diksi penuh makna tersirat, sering dipakai dalam batagak gala (pengangkatan gelar).",
    region: "Sumatera Barat",
  },
  {
    langCode: "min",
    type: "peribahasa",
    title: "Ungkar Minang - Aia Dalam",
    text: "Anak dipangku, kamanakan dibimbiang",
    translation: "Anak dipangku, keponakan dibimbing",
    meaning: "Filosofi matrilineal Minang: anak urang (anak kemenakan) wajib dibimbing oleh mamak.",
    region: "Sumatera Barat",
  },
  // Bugis
  {
    langCode: "bug",
    type: "cerita_rakyat",
    title: "La Galigo - Sawerigading",
    text: "Nanak tellue cokko' iamo arungnge, nanak matewe tellue cokko, iamo mappoja-passuro lao riyolo.",
    translation: "Ia telah menjadi raja tiga puluh negeri, ia telah menjadi utusan tiga puluh negeri, ia menjadi penyebar ajaran di masa lalu.",
    meaning: "La Galigo adalah epos terpanjang di dunia (panjangnya 6.000 halaman). Tradisi lisan suci Bugis yang diturunkan turun-temurun oleh To Mabber (penyair suci).",
    region: "Sulawesi Selatan",
  },
  {
    langCode: "bug",
    type: "peribahasa",
    title: "Ungkar Bugis - Taro Ada",
    text: "Ripolo taroiwi wisoloe, ripolo taroiwi wiwiwirangngoe",
    translation: "Di muka bawah langit yang baik, di muka bawah langit yang buruk",
    meaning: "Ada kebaikan dan keburukan di dunia. Pesan untuk selalu siap menerima kedua kondisi.",
    region: "Sulawesi Selatan",
  },
  // Sasak
  {
    langCode: "sas",
    type: "peribahasa",
    title: "Sasak - Melembaq Aiq",
    text: "Aiq langue, biyak biyak ngeri, biyak biyak tembeng",
    translation: "Air berembun, sambil-sambil takut, sambil-sambil bersembunyi",
    meaning: "Filosofi Sasak: bertindak hati-hati dan penuh pertimbangan, tidak terburu-buru.",
    region: "Lombok",
  },
  {
    langCode: "sas",
    type: "pantun",
    title: "Pantun Sasak - Denda",
    text: "Lebeng sila silaq biyak, belek jejak toah ruang, biso jaoq batin iai, taoq jaoq batih lemah.",
    translation: "Berpisah sila sambil duduk, lihat jejak tua ruang, bisa jauh batin itu, tahu jauh sejenis tanah.",
    meaning: "Pantun Sasak denda adalah media penyelesaian sengketa adat melalui dialog berpantun antar pihak.",
    region: "Lombok",
  },
  // Ternate (terancam)
  {
    langCode: "tgr",
    type: "mantra",
    title: "Kabari Ternate - Kolano",
    text: "Bismillahi, fofa sengaji, malai ruma dumdum, ngonosi ngana se islam sojaja.",
    translation: "Bismillah, beliau sang sengaji, terbang di rumah dumdum, mohon anak yang Islam tetap jaya.",
    meaning: "Kabari adalah mantra/orasi sakral Ternate yang dibacakan oleh Imam atau Kolano pada upacara adat penting.",
    region: "Ternate",
  },
  {
    langCode: "tgr",
    type: "cerita_rakyat",
    title: "Legenda Kolano Ternate",
    text: "Se sojaja ngofa kapita, cengki-cengki o jadi tamolohinge, se Ngofa Ngase fojo se raha mamo.",
    translation: "Sang jaya anak kepalita, dengan kekuatan jadi tamengnya, sang Ngofa Ngase berdiri sang raya mamo.",
    meaning: "Legenda raja-raja Ternate (Kolano) yang menceritakan asal-usul empat persekutuan se Islam Sojaja (Kampung Arab Melaka-Ternate).",
    region: "Ternate",
  },
  // Cirebon (terancam - baru)
  {
    langCode: "crb",
    type: "pantun",
    title: "Lumonde Cirebon - Panggung",
    text: "Kangjeng sinuhun, pangeran adil, rumaos raja ing ngaluhur, kadiya-dianing ratu pikurung.",
    translation: "Yang dipertuan, pangeran adil, raja di tempat tinggi, seperti ratu pikir-pikir.",
    meaning: "Lumonde adalah pantun Cirebonan yang dilantunkan pada panggung kebudayaan. Mengandung penghormatan kepada pangeran/sultan.",
    region: "Cirebon",
  },
  {
    langCode: "crb",
    type: "mantra",
    title: "Mantra Sanduk Cirebon",
    text: "Bismillahirrohmanirrohim, sanduk-sanduk pindah alam, sing oncor sing padang, sing ghaib sing nyata.",
    translation: "Bismillah, sanduk-sanduk pindah alam, yang terang yang terang, yang ghaib yang nyata.",
    meaning: "Mantra Sanduk adalah tradisi lisan Cirebon untuk pengobatan tradisional & tolak bala. Diucapkan oleh tabib/paranormal.",
    region: "Cirebon",
  },
  // Gorontalo (terancam - baru)
  {
    langCode: "gor",
    type: "pantun",
    title: "Lumonde Gorontalo - Pito Molangi",
    text: "Pito molangi, wolu wadali, limo u bunga, wolu u tolangi.",
    translation: "Tujuh kali berputar, delapan wadali, lima bunga, delapan tolangi.",
    meaning: "Lumonde Gorontalo adalah pantun filosofis dengan angka simbolis. Digunakan pada upacara adat & pelantikan.",
    region: "Gorontalo",
  },
  {
    langCode: "gor",
    type: "cerita_rakyat",
    title: "Turuntani Gorontalo",
    text: "Tilayo hulontalo, taa pilito lo taa, ilowaliya lo eya-eya, ilanggato lo huyula.",
    translation: "Asal Gorontalo, tidak tahu dari mana, jadi seperti apa, naik ke mana.",
    meaning: "Turuntani adalah dongeng rakyat Gorontalo yang menceritakan asal-usul negeri & leluhur. Disampaikan tetua kepada anak sebelum tidur.",
    region: "Gorontalo",
  },
  // Nias (terancam - baru)
  {
    langCode: "nia",
    type: "cerita_rakyat",
    title: "Hoho Nias - Ono Mbalö",
    text: "Ono mbalö, ono zi so ba ifaondragö, hulö nono mbanua si no ara, ba no taya sa'ae.",
    translation: "Anak pemburu, anak yang ada di hadapan, seperti anak negeri yang lama, sudah hilang.",
    meaning: "Hoho adalah sastra lisan epik Nias yang dilantunkan oleh ere (tetua). Cerita Ono Mbalö menceritakan asal manusia & adat berburu.",
    region: "Pulau Nias",
  },
  {
    langCode: "nia",
    type: "peribahasa",
    title: "Famaedo Nias - Haga",
    text: "Haga sibohou, lö mo'angera-ngera, ba hiza no so dödö ba walösökhi.",
    translation: "Harga murah, tidak ada pertimbangan, tetapi ada hati dalam kebaikan.",
    meaning: "Famaedo adalah peribahasa Nias tentang kejujuran: tidak semua yang murah buruk, yang penting hati baik.",
    region: "Pulau Nias",
  },
];

const learningModules = [
  {
    langCode: "sun",
    title: "Sapaan & Perkenalan dalam Bahasa Sunda",
    description: "Pelajari sapaan dasar, ungkapan sopan, dan perkenalan diri dalam Bahasa Sunda Krama.",
    level: "A1",
    orderIdx: 1,
    totalLessons: 5,
    lessonsJson: JSON.stringify([
      { title: "Sapaan Umum", phrase: "Sampurasun", translation: "Selamat datang/Salam", notes: "Sapaan sopan, digunakan kapan saja." },
      { title: "Menanyakan Kabar", phrase: "Kumaha damang?", translation: "Apa kabar?", notes: "Untuk bertanya kabar orang dewasa." },
      { title: "Menyebut Nama", phrase: "Nami abdi Budi", translation: "Nama saya Budi", notes: "Abdi = saya (sopan)." },
      { title: "Terima Kasih", phrase: "Hatur nuhun", translation: "Terima kasih", notes: "Ungkapan terima kasih formal." },
      { title: "Permisi", phrase: "Punten", translation: "Permisi/Maaf", notes: "Sebelum menyela atau meminta tolong." },
    ]),
  },
  {
    langCode: "jav",
    title: "Krama Inggil untuk Pemula",
    description: "Tingkatan bahasa Jawa paling sopan, digunakan untuk berbicara dengan orang yang lebih tua atau dihormati.",
    level: "A1",
    orderIdx: 1,
    totalLessons: 5,
    lessonsJson: JSON.stringify([
      { title: "Sapaan Pagi", phrase: "Sugeng enjing", translation: "Selamat pagi", notes: "Krama inggil untuk pagi hari." },
      { title: "Menanyakan Kabar", phrase: "Pripun kabaripun?", translation: "Bagaimana kabarnya?", notes: "Bentuk sopan menanyakan kabar." },
      { title: "Menyebut Nama", phrase: "Asma kula Andi", translation: "Nama saya Andi", notes: "Kula = saya (krama)." },
      { title: "Terima Kasih", phrase: "Matur nuwun", translation: "Terima kasih", notes: "Bentuk krama inggil." },
      { title: "Permisi Pergi", phrase: "Nyuwun pamit", translation: "Permisi pergi dulu", notes: "Sebelum meninggalkan tempat." },
    ]),
  },
  {
    langCode: "ban",
    title: "Bahasa Bali Alus - Dasar",
    description: "Tingkatan bahasa Bali alus untuk percakapan sehari-hari yang sopan.",
    level: "A1",
    orderIdx: 1,
    totalLessons: 5,
    lessonsJson: JSON.stringify([
      { title: "Sapaan Pagi", phrase: "Rahajeng semeng", translation: "Selamat pagi", notes: "Sapaan pagi dalam bahasa Bali alus." },
      { title: "Menanyakan Kabar", phrase: "Becik awakne?", translation: "Baik-baik saja?", notes: "Menanyakan kondisi tubuh." },
      { title: "Menyebut Nama", phrase: "Tiang adan madé", translation: "Saya bernama Made", notes: "Tiang = saya (alus)." },
      { title: "Terima Kasih", phrase: "Matur suksme", translation: "Terima kasih", notes: "Bentuk alus dari terima kasih." },
      { title: "Permisi", phrase: "Nyuwun pamie", translation: "Permisi", notes: "Sopan untuk meminta izin." },
    ]),
  },
  {
    langCode: "min",
    title: "Bahasa Minangkabau untuk Percakapan",
    description: "Modul pembelajaran Bahasa Minangkabau untuk komunikasi dasar sehari-hari.",
    level: "A1",
    orderIdx: 1,
    totalLessons: 5,
    lessonsJson: JSON.stringify([
      { title: "Sapaan", phrase: "Salamaik datang", translation: "Selamat datang", notes: "Sapaan ketika menyambut tamu." },
      { title: "Menanyakan Kabar", phrase: "Apo kabanyo?", translation: "Apa kabar?", notes: "Untuk bertanya kabar." },
      { title: "Menyebut Nama", phrase: "Namo saya Sari", translation: "Nama saya Sari", notes: "Saya = saya (kasual)." },
      { title: "Terima Kasih", phrase: "Tarimo kasih", translation: "Terima kasih", notes: "Ungkapan terima kasih umum." },
      { title: "Sampai Jumpa", phrase: "Sampai batamu", translation: "Sampai jumpa", notes: "Untuk perpisahan." },
    ]),
  },
  {
    langCode: "bug",
    title: "Bahasa Bugis - Sapaan dan Sopan",
    description: "Modul dasar Bahasa Bugis untuk komunikasi dengan masyarakat Sulawesi Selatan.",
    level: "A1",
    orderIdx: 1,
    totalLessons: 5,
    lessonsJson: JSON.stringify([
      { title: "Sapaan", phrase: "Salama", translation: "Salam/Damai", notes: "Sapaan umum dalam Bahasa Bugis." },
      { title: "Menanyakan Kabar", phrase: "Pega ko mappare?", translation: "Apa kabarmu?", notes: "Untuk menanyakan kabar." },
      { title: "Menyebut Nama", phrase: "Aseng iyya Rahman", translation: "Nama saya Rahman", notes: "Untuk memperkenalkan diri." },
      { title: "Terima Kasih", phrase: "Mappiar ko", translation: "Terima kasih", notes: "Ungkapan terima kasih." },
      { title: "Permisi Pergi", phrase: "Mappasi ore", translation: "Permisi dulu", notes: "Sebelum meninggalkan tempat." },
    ]),
  },
  // Cirebon (terancam - baru)
  {
    langCode: "crb",
    title: "Bahasa Cirebonan untuk Pemula",
    description: "Modul dasar Bahasa Cirebon untuk percakapan sehari-hari.",
    level: "A1",
    orderIdx: 1,
    totalLessons: 5,
    lessonsJson: JSON.stringify([
      { title: "Sapaan Pagi", phrase: "Sugeng enjing", translation: "Selamat pagi", notes: "Sapaan pagi Cirebonan." },
      { title: "Menanyakan Kabar", phrase: "Kumaha damang?", translation: "Apa kabar?", notes: "Pengaruh Sunda pada Cirebonan." },
      { title: "Menyebut Nama", phrase: "Asma kula Andi", translation: "Nama saya Andi", notes: "Kula = saya (sopan)." },
      { title: "Terima Kasih", phrase: "Matur nuwun", translation: "Terima kasih", notes: "Pengaruh Jawa krama." },
      { title: "Permisi", phrase: "Nyuwun pamit", translation: "Permisi", notes: "Sebelum meninggalkan tempat." },
    ]),
  },
  // Gorontalo (terancam - baru)
  {
    langCode: "gor",
    title: "Bahasa Gorontalo - Sapaan Dasar",
    description: "Modul pembelajaran Bahasa Gorontalo untuk pemula.",
    level: "A1",
    orderIdx: 1,
    totalLessons: 5,
    lessonsJson: JSON.stringify([
      { title: "Sapaan", phrase: "Tabea", translation: "Salam/Hormat", notes: "Sapaan sopan Gorontalo." },
      { title: "Menanyakan Kabar", phrase: "Oluwo limongoli?", translation: "Apa kabarmu?", notes: "Untuk menanyakan kabar." },
      { title: "Menyebut Nama", phrase: "Tanggulo u Ana", translation: "Nama saya Ana", notes: "Untuk perkenalan diri." },
      { title: "Terima Kasih", phrase: "Mahuwu limongoli", translation: "Terima kasih", notes: "Ungkapan terima kasih." },
      { title: "Sampai Jumpa", phrase: "Tohipi u dada'a", translation: "Sampai ketemu lagi", notes: "Untuk perpisahan." },
    ]),
  },
  // Nias (terancam - baru)
  {
    langCode: "nia",
    title: "Bahasa Nias - Sapaan dan Hormat",
    description: "Modul pembelajaran Bahasa Nias, bahasa unik di lepas pantai Sumatera.",
    level: "A1",
    orderIdx: 1,
    totalLessons: 5,
    lessonsJson: JSON.stringify([
      { title: "Sapaan", phrase: "Ya'ahowu", translation: "Salam/Terima kasih", notes: "Sapaan serbaguna Nias." },
      { title: "Menanyakan Kabar", phrase: "Haga sibohou?", translation: "Apa kabarmu?", notes: "Untuk menanyakan kabar." },
      { title: "Menyebut Nama", phrase: "Töigu Yuli", translation: "Nama saya Yuli", notes: "Töigu = namaku." },
      { title: "Terima Kasih", phrase: "Saohagölö", translation: "Terima kasih", notes: "Ungkapan terima kasih formal." },
      { title: "Permisi", phrase: "U'onrö", translation: "Permisi/Saya pergi", notes: "Sebelum meninggalkan tempat." },
    ]),
  },
];

async function seed() {
  console.log("Seeding WARISAN SUARA data...\n");

  // Clear existing
  await db.aiUsageLog.deleteMany();
  await db.userProgress.deleteMany();
  await db.tutorSession.deleteMany();
  await db.oralTradition.deleteMany();
  await db.learningModule.deleteMany();
  await db.recording.deleteMany();
  await db.language.deleteMany();

  // Seed languages
  const langMap: Record<string, string> = {};
  for (const lang of languages) {
    const created = await db.language.create({ data: lang });
    langMap[lang.code] = created.id;
    console.log(`  Language: ${lang.name} [${lang.vitality}]`);
  }

  // Seed traditions
  for (const t of traditions) {
    const langId = langMap[t.langCode];
    if (!langId) continue;
    await db.oralTradition.create({
      data: {
        languageId: langId,
        type: t.type,
        title: t.title,
        text: t.text,
        translation: t.translation,
        meaning: t.meaning,
        region: t.region,
      },
    });
  }
  console.log(`  Traditions: ${traditions.length} inserted`);

  // Seed learning modules
  for (const m of learningModules) {
    const langId = langMap[m.langCode];
    if (!langId) continue;
    await db.learningModule.create({
      data: {
        languageId: langId,
        title: m.title,
        description: m.description,
        level: m.level,
        orderIdx: m.orderIdx,
        totalLessons: m.totalLessons,
        lessonsJson: m.lessonsJson,
      },
    });
  }
  console.log(`  Learning modules: ${learningModules.length} inserted`);

  console.log("\nSeed complete!");
  console.log(`Total: ${languages.length} languages, ${traditions.length} traditions, ${learningModules.length} modules`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
