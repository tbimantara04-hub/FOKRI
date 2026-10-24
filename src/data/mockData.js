// Initial state mock store for FOKRI GAMES XII platform

const commonEligibility = "Mahasiswa, taruna, dan praja aktif dari seluruh perguruan tinggi kedinasan di Indonesia, baik anggota FOKRI PTK maupun belum.";

export const JADWAL_PELAKSANAAN = [
  { no: 1, kegiatan: 'Pembukaan pendaftaran', tanggal: '25 Oktober 2026', isMainEvent: false },
  { no: 2, kegiatan: 'Penutupan pendaftaran', tanggal: '7 November 2026', isMainEvent: false },
  { no: 3, kegiatan: 'Technical Meeting Lomba', tanggal: '8 November 2026', isMainEvent: false },
  { no: 4, kegiatan: 'Pengumpulan karya', tanggal: '9–17 November 2026', isMainEvent: false },
  { no: 5, kegiatan: 'Pengumuman finalis', tanggal: '24 November 2026', isMainEvent: false },
  { no: 6, kegiatan: 'Technical Meeting Hari H', tanggal: '26 November 2026', isMainEvent: false },
  { no: 7, kegiatan: 'Hari H: registrasi peserta, pembukaan, Grand Final, pengumuman juara serta PTK EXPO', tanggal: '28 November 2026', isMainEvent: true },
];

const commonSchedules = [
  { label: 'Pembukaan pendaftaran', date: '25 Oktober 2026' },
  { label: 'Penutupan pendaftaran', date: '7 November 2026' },
  { label: 'Technical Meeting Lomba', date: '8 November 2026' },
  { label: 'Pengumpulan karya', date: '9–17 November 2026' },
  { label: 'Pengumuman finalis', date: '24 November 2026' },
  { label: 'Technical Meeting Hari H', date: '26 November 2026' },
  { label: 'Hari H: registrasi peserta, pembukaan, Grand Final, pengumuman juara serta PTK EXPO', date: '28 November 2026' }
];

export const INITIAL_COMPETITIONS = [
  {
    id: "comp-1",
    name: "Musabaqah Azan (MA)",
    slug: "ma",
    mode: "individual",
    status: "REGISTRATION_OPEN",
    organizer: "Panitia Pelaksana FOKRI GAMES XII",
    shortDescription: "Kompetisi mengumandangkan azan dengan tartil dan suara yang indah.",
    fullDescription: "Musabaqah Azan (MA) merupakan cabang perlombaan untuk menemukan muadzin terbaik dari kalangan mahasiswa kedinasan, yang mampu mengumandangkan panggilan salat dengan tartil, fasih, dan menggetarkan hati.",
    coverImage: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=800&q=80",
    eligibilityText: commonEligibility,
    quota: 100,
    currentRegistrations: 45,
    categories: [
      { id: "cat-ma-1", name: "Kategori Putra", quota: 100, teamMin: 1, teamMax: 1 }
    ],
    schedules: commonSchedules,
    documentRequirements: [
      { id: "docreq-ma-1", name: "Kartu Tanda Mahasiswa (KTM) / Identitas Taruna", appliesTo: "both", required: true, maxCount: 1, allowedFormats: "PDF, JPG, PNG", maxSizeMb: 5 },
      { id: "docreq-ma-2", name: "Surat Keterangan Aktif", appliesTo: "both", required: true, maxCount: 1, allowedFormats: "PDF", maxSizeMb: 5 },
      { id: "docreq-ma-3", name: "Link Video Adzan (Babak Penyisihan)", appliesTo: "both", required: true, maxCount: 1, allowedFormats: "PDF, TXT", maxSizeMb: 2 }
    ],
    prizes: [
      { rank: "Juara 1", prize: "Rp 3.000.000 + Medali + Sertifikat" },
      { rank: "Juara 2", prize: "Rp 2.000.000 + Medali + Sertifikat" },
      { rank: "Juara 3", prize: "Rp 1.000.000 + Medali + Sertifikat" }
    ],
    rules: "1. Peserta mengunggah video azan tanpa proses editing suara (autotune, echo, dsb).\n2. Video diunggah di platform YouTube dan disubmit linknya.\n3. Grand Final dilaksanakan secara luring dan tertutup untuk umum."
  },
  {
    id: "comp-2",
    name: "Musabaqah Fahmil Quran (MFQ)",
    slug: "mfq",
    mode: "team",
    status: "REGISTRATION_OPEN",
    organizer: "Panitia Pelaksana FOKRI GAMES XII",
    shortDescription: "Cerdas cermat beregu mengenai pemahaman Al-Quran dan wawasan keislaman.",
    fullDescription: "Musabaqah Fahmil Quran (MFQ) adalah cabang perlombaan beregu yang menguji pemahaman isi kandungan Al-Quran, hadis, sejarah, dan wawasan keislaman lainnya secara komprehensif.",
    coverImage: "https://images.unsplash.com/photo-1609599006353-e629aaab315d?auto=format&fit=crop&w=800&q=80",
    eligibilityText: commonEligibility,
    quota: 50,
    currentRegistrations: 28,
    categories: [
      { id: "cat-mfq-1", name: "Kategori Beregu (3 Orang)", quota: 50, teamMin: 3, teamMax: 3 }
    ],
    schedules: commonSchedules,
    documentRequirements: [
      { id: "docreq-mfq-1", name: "Kartu Tanda Mahasiswa (KTM) Seluruh Anggota", appliesTo: "team", required: true, maxCount: 3, allowedFormats: "PDF", maxSizeMb: 5 },
      { id: "docreq-mfq-2", name: "Surat Keterangan Aktif", appliesTo: "team", required: true, maxCount: 1, allowedFormats: "PDF", maxSizeMb: 5 }
    ],
    prizes: [
      { rank: "Juara 1", prize: "Rp 5.000.000 + Medali + Sertifikat" },
      { rank: "Juara 2", prize: "Rp 3.500.000 + Medali + Sertifikat" },
      { rank: "Juara 3", prize: "Rp 2.000.000 + Medali + Sertifikat" }
    ],
    rules: "1. Setiap tim terdiri dari 3 orang dari perguruan tinggi yang sama.\n2. Babak penyisihan menggunakan sistem ujian tertulis secara daring.\n3. Grand Final dilaksanakan secara luring melalui cerdas cermat."
  },
  {
    id: "comp-3",
    name: "Musabaqah Da’i Muda (MDM)",
    slug: "mdm",
    mode: "individual",
    status: "REGISTRATION_OPEN",
    organizer: "Panitia Pelaksana FOKRI GAMES XII",
    shortDescription: "Kompetisi pidato/ceramah agama Islam (dakwah) untuk mencetak pendakwah muda.",
    fullDescription: "Musabaqah Da’i Muda (MDM) menantang mahasiswa kedinasan untuk menyampaikan pesan-pesan keislaman secara lugas, inspiratif, dan sesuai dengan tantangan zaman melalui seni pidato dan retorika dakwah.",
    coverImage: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80",
    eligibilityText: commonEligibility,
    quota: 100,
    currentRegistrations: 62,
    categories: [
      { id: "cat-mdm-1", name: "Da'i / Da'iyah", quota: 100, teamMin: 1, teamMax: 1 }
    ],
    schedules: commonSchedules,
    documentRequirements: [
      { id: "docreq-mdm-1", name: "Kartu Tanda Mahasiswa (KTM)", appliesTo: "both", required: true, maxCount: 1, allowedFormats: "PDF", maxSizeMb: 2 },
      { id: "docreq-mdm-2", name: "Link Video Ceramah Babak Penyisihan", appliesTo: "both", required: true, maxCount: 1, allowedFormats: "PDF, TXT", maxSizeMb: 2 }
    ],
    prizes: [
      { rank: "Juara 1", prize: "Rp 4.000.000 + Medali + Sertifikat" },
      { rank: "Juara 2", prize: "Rp 2.500.000 + Medali + Sertifikat" },
      { rank: "Juara 3", prize: "Rp 1.500.000 + Medali + Sertifikat" }
    ],
    rules: "Tema ceramah akan ditentukan oleh panitia. Video ceramah penyisihan maksimal berdurasi 7 menit."
  },
  {
    id: "comp-4",
    name: "Lomba Film Pendek Islami (LFPI)",
    slug: "lfpi",
    mode: "team",
    status: "REGISTRATION_OPEN",
    organizer: "Panitia Pelaksana FOKRI GAMES XII",
    shortDescription: "Kompetisi pembuatan film pendek sinematik yang sarat akan nilai-nilai Islam.",
    fullDescription: "Lomba Film Pendek Islami (LFPI) memadukan seni sinematografi dengan pesan dakwah visual. Peserta dituntut untuk memproduksi film pendek berkualitas tinggi yang mampu menggugah hati penonton.",
    coverImage: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80",
    eligibilityText: commonEligibility,
    quota: 40,
    currentRegistrations: 15,
    categories: [
      { id: "cat-lfpi-1", name: "Tim Produksi (3-5 Orang)", quota: 40, teamMin: 3, teamMax: 5 }
    ],
    schedules: commonSchedules,
    documentRequirements: [
      { id: "docreq-lfpi-1", name: "KTM Seluruh Kru", appliesTo: "team", required: true, maxCount: 5, allowedFormats: "PDF", maxSizeMb: 5 },
      { id: "docreq-lfpi-2", name: "Poster Film & Sinopsis", appliesTo: "team", required: true, maxCount: 1, allowedFormats: "PDF", maxSizeMb: 10 },
      { id: "docreq-lfpi-3", name: "Link Video Resolusi Tinggi (Google Drive/YouTube)", appliesTo: "team", required: true, maxCount: 1, allowedFormats: "PDF", maxSizeMb: 2 }
    ],
    prizes: [
      { rank: "Juara 1", prize: "Rp 7.000.000 + Tropi + Sertifikat" },
      { rank: "Juara 2", prize: "Rp 5.000.000 + Tropi + Sertifikat" },
      { rank: "Juara 3", prize: "Rp 3.000.000 + Tropi + Sertifikat" }
    ],
    rules: "Film orisinal, durasi 5-15 menit. Dilarang mengandung unsur SARA atau melanggar hak cipta musik/visual."
  },
  {
    id: "comp-5",
    name: "Lomba Desain Media Dakwah Digital (LDMD)",
    slug: "ldmd",
    mode: "either",
    status: "REGISTRATION_OPEN",
    organizer: "Panitia Pelaksana FOKRI GAMES XII",
    shortDescription: "Pembuatan poster grafis, infografis, dan aset media sosial islami.",
    fullDescription: "Ajang kreativitas visual digital dalam menyebarkan nilai positif. LDMD mencari desainer grafis terbaik di kalangan PTK yang bisa merancang materi dakwah yang menarik dan estetik.",
    coverImage: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80",
    eligibilityText: commonEligibility,
    quota: 100,
    currentRegistrations: 38,
    categories: [
      { id: "cat-ldmd-1", name: "Individu / Tim Kecil (Maks. 2 Org)", quota: 100, teamMin: 1, teamMax: 2 }
    ],
    schedules: commonSchedules,
    documentRequirements: [
      { id: "docreq-ldmd-1", name: "KTM / Kartu Identitas Taruna", appliesTo: "both", required: true, maxCount: 2, allowedFormats: "PDF", maxSizeMb: 5 },
      { id: "docreq-ldmd-2", name: "Portfolio Desain (Resolusi Tinggi)", appliesTo: "both", required: true, maxCount: 1, allowedFormats: "PDF", maxSizeMb: 20 }
    ],
    prizes: [
      { rank: "Juara 1", prize: "Rp 3.000.000 + Sertifikat" },
      { rank: "Juara 2", prize: "Rp 2.000.000 + Sertifikat" },
      { rank: "Juara 3", prize: "Rp 1.000.000 + Sertifikat" }
    ],
    rules: "Karya digital murni buatan sendiri. Dilarang keras menggunakan asset hasil generate AI (Midjourney, DALL-E, dll) tanpa modifikasi substansial."
  },
  {
    id: "comp-6",
    name: "Lomba Karya Tulis Islami (LKTI)",
    slug: "lkti",
    mode: "team",
    status: "REGISTRATION_OPEN",
    organizer: "Panitia Pelaksana FOKRI GAMES XII",
    shortDescription: "Kompetisi penulisan karya ilmiah gagasan inovatif bernafaskan Al-Quran.",
    fullDescription: "Lomba Karya Tulis Islami (LKTI) bertujuan menggali potensi akademik dan kemampuan riset mahasiswa PTK dalam memecahkan masalah kebangsaan melalui pendekatan Islam komprehensif.",
    coverImage: "https://images.unsplash.com/photo-1455390582262-044cdead2708?auto=format&fit=crop&w=800&q=80",
    eligibilityText: commonEligibility,
    quota: 60,
    currentRegistrations: 20,
    categories: [
      { id: "cat-lkti-1", name: "Tim Peneliti (2-3 Orang)", quota: 60, teamMin: 2, teamMax: 3 }
    ],
    schedules: commonSchedules,
    documentRequirements: [
      { id: "docreq-lkti-1", name: "KTM Semua Anggota", appliesTo: "team", required: true, maxCount: 3, allowedFormats: "PDF", maxSizeMb: 5 },
      { id: "docreq-lkti-2", name: "Naskah LKTI (PDF Full Paper)", appliesTo: "team", required: true, maxCount: 1, allowedFormats: "PDF", maxSizeMb: 15 }
    ],
    prizes: [
      { rank: "Juara 1", prize: "Rp 6.000.000 + Medali + Sertifikat" },
      { rank: "Juara 2", prize: "Rp 4.000.000 + Medali + Sertifikat" },
      { rank: "Juara 3", prize: "Rp 2.500.000 + Medali + Sertifikat" }
    ],
    rules: "Babak penyisihan berdasarkan seleksi naskah. Babak final (luring) adalah presentasi di hadapan dewan juri."
  },
  {
    id: "comp-7",
    name: "Musabaqah Nasyid Islami (MNI)",
    slug: "mni",
    mode: "team",
    status: "REGISTRATION_OPEN",
    organizer: "Panitia Pelaksana FOKRI GAMES XII",
    shortDescription: "Kompetisi tarik suara grup Nasyid akapela maupun dengan instrumen.",
    fullDescription: "Musabaqah Nasyid Islami (MNI) menjadi sarana syiar melalui nada dan suara. Tim nasyid akan berlomba menyajikan harmonisasi vokal terbaik yang membawa pesan moral dan religi.",
    coverImage: "https://images.unsplash.com/photo-1516280440502-62fe83186105?auto=format&fit=crop&w=800&q=80",
    eligibilityText: commonEligibility,
    quota: 30,
    currentRegistrations: 10,
    categories: [
      { id: "cat-mni-1", name: "Grup Nasyid (3-6 Orang)", quota: 30, teamMin: 3, teamMax: 6 }
    ],
    schedules: commonSchedules,
    documentRequirements: [
      { id: "docreq-mni-1", name: "KTM Semua Anggota", appliesTo: "team", required: true, maxCount: 6, allowedFormats: "PDF", maxSizeMb: 5 },
      { id: "docreq-mni-2", name: "Video Audisi Nasyid (Penyisihan)", appliesTo: "team", required: true, maxCount: 1, allowedFormats: "PDF, TXT", maxSizeMb: 2 }
    ],
    prizes: [
      { rank: "Juara 1", prize: "Rp 5.000.000 + Medali + Sertifikat" },
      { rank: "Juara 2", prize: "Rp 3.500.000 + Medali + Sertifikat" },
      { rank: "Juara 3", prize: "Rp 2.000.000 + Medali + Sertifikat" }
    ],
    rules: "Menyanyikan 1 lagu wajib dan 1 lagu pilihan. Aransemen bebas."
  },
  {
    id: "comp-8",
    name: "Musabaqah Tartil Quran (MTQ)",
    slug: "mtq",
    mode: null,
    status: "DRAFT",
    detailsPending: true,
    organizer: "Panitia Pelaksana FOKRI GAMES XII",
    shortDescription: "Informasi resmi cabang ini belum tersedia.",
    fullDescription: "Informasi resmi mengenai deskripsi dan ketentuan cabang ini belum tersedia.",
    coverImage: "https://images.unsplash.com/photo-1519817914152-2a640c0471b7?auto=format&fit=crop&w=800&q=80",
    eligibilityText: "",
    quota: null,
    currentRegistrations: null,
    categories: [],
    schedules: [],
    documentRequirements: [],
    prizes: [],
    rules: ""
  }
];

export const INITIAL_ANNOUNCEMENTS = [
  {
    id: "ann-1",
    title: "Selamat Datang di Portal Resmi FOKRI GAMES XII 2026",
    content: "Pendaftaran babak daring (penyisihan) akan segera dibuka pada tanggal 5 September 2026. Persiapkan tim dan delegasi terbaik dari Perguruan Tinggi Kedinasan Anda!",
    category: "OFFICIAL NOTICE",
    pinned: true,
    publishedAt: "2026-09-01 10:00:00",
    author: "Panitia Pelaksana FOKRI GAMES XII",
    competitionId: null
  }
];

export const INITIAL_REGISTRATIONS = [];
export const INITIAL_FINALISTS = [];
export const INITIAL_RESULTS = [];
export const INITIAL_AUDIT_LOGS = [
  {
    id: "audit-1",
    actor: "System",
    action: "SYSTEM_INIT",
    target: "Platform Initialization",
    details: "FOKRI GAMES XII Portal Live.",
    timestamp: "2026-09-01 00:00:00",
    ip: "127.0.0.1"
  }
];
