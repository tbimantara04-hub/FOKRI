// Initial state mock store for FOKRI GAMES XII platform

export const INITIAL_COMPETITIONS = [
  {
    id: "comp-1",
    name: "Musabaqah Karya Tulis Ilmiah Al-Qur'an (MKTIA)",
    slug: "mktia-2026",
    mode: "team", // individual, team, or either
    status: "REGISTRATION_OPEN",
    organizer: "Panitia Pembina Kerohanian Islam (FOKRI GAMES XII)",
    shortDescription: "Kompetisi penulisan karya ilmiah ilmiah berbasis nilai-nilai Al-Qur'an untuk mahasiswa nasional.",
    fullDescription: "Musabaqah Karya Tulis Ilmiah Al-Qur'an (MKTIA) FOKRI GAMES XII merupakan ajang bergengsi sains dan keislaman yang menantang mahasiswa Indonesia untuk menggali solusi solutif bangsa berdasarkan panduan Al-Qur'an dan Sunnah.",
    coverImage: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
    eligibilityText: "Mahasiswa aktif D3/D4/S1 seluruh Indonesia yang terdaftar di PDDikti. Usia maksimal 24 tahun pada saat pendaftaran.",
    quota: 50,
    currentRegistrations: 34,
    categories: [
      { id: "cat-1a", name: "Sains & Teknologi Hijau", quota: 25, teamMin: 2, teamMax: 3 },
      { id: "cat-1b", name: "Sosial & Humaniora Islam", quota: 25, teamMin: 2, teamMax: 3 }
    ],
    schedules: [
      { label: "Pembukaan Pendaftaran", date: "01 September 2026" },
      { label: "Penutupan Pendaftaran & Batas Unggah Berkas", date: "25 September 2026" },
      { label: "Pengumuman Verifikasi Berkas", date: "05 Oktober 2026" },
      { label: "Technical Meeting Finalis", date: "10 Oktober 2026" },
      { label: "Babak Final & Presentasi", date: "18 Oktober 2026" },
      { label: "Pengumuman Juara", date: "20 Oktober 2026" }
    ],
    documentRequirements: [
      { id: "docreq-1", name: "KTM / Kartu Tanda Mahasiswa (Semua Anggota)", appliesTo: "team", required: true, maxCount: 3, allowedFormats: "PDF, JPG, PNG", maxSizeMb: 5 },
      { id: "docreq-2", name: "Surat Rekomendasi / Keterangan Aktif Kuliah dari Kampus", appliesTo: "team", required: true, maxCount: 1, allowedFormats: "PDF", maxSizeMb: 5 },
      { id: "docreq-3", name: "Naskah Karya Tulis Ilmiah (Abstrak & Full Paper)", appliesTo: "team", required: true, maxCount: 1, allowedFormats: "PDF", maxSizeMb: 10 }
    ],
    prizes: [
      { rank: "Juara 1", prize: "Rp 5.000.000 + Tropi + Sertifikat Nasional" },
      { rank: "Juara 2", prize: "Rp 3.500.000 + Tropi + Sertifikat Nasional" },
      { rank: "Juara 3", prize: "Rp 2.000.000 + Tropi + Sertifikat Nasional" },
      { rank: "Best Presentation", prize: "Rp 1.000.000 + Sertifikat" }
    ],
    rules: "1. Karya bersifat orisinal dan belum pernah menjuarai lomba serupa.\n2. Setiap tim terdiri dari 2-3 mahasiswa perguruan tinggi yang sama.\n3. Format penulisan mengikuti Guidebook FOKRI GAMES XII."
  },
  {
    id: "comp-2",
    name: "Web Application & Algorithm Challenge",
    slug: "web-dev-challenge",
    mode: "either",
    status: "REGISTRATION_OPEN",
    organizer: "Divisi IT & Kompetisi FOKRI GAMES XII",
    shortDescription: "Kompetisi rekayasa perangkat lunak web modern dan penyelesaian algoritma kompleks.",
    fullDescription: "Tunjukkan keahlian coding dan arsitektur sistem web Anda di FOKRI GAMES XII Web Challenge. Bangun aplikasi yang scalable, cepat, dan berdampak nyata.",
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    eligibilityText: "Terbuka untuk umum & mahasiswa. Format individu atau tim (maksimal 2 orang).",
    quota: 40,
    currentRegistrations: 28,
    categories: [
      { id: "cat-2a", name: "Web Fullstack Development", quota: 20, teamMin: 1, teamMax: 2 },
      { id: "cat-2b", name: "UI/UX Product Design", quota: 20, teamMin: 1, teamMax: 2 }
    ],
    schedules: [
      { label: "Pendaftaran Dibuka", date: "05 September 2026" },
      { label: "Batas Akhir Pendaftaran", date: "30 September 2026" },
      { label: "Pengumuman Finalis", date: "12 Oktober 2026" },
      { label: "Live Hackathon Final", date: "24 Oktober 2026" }
    ],
    documentRequirements: [
      { id: "docreq-4", name: "Kartu Identitas (KTP/KTM/SIM)", appliesTo: "both", required: true, maxCount: 2, allowedFormats: "PDF, JPG, PNG", maxSizeMb: 5 },
      { id: "docreq-5", name: "Proposal / Portfolio Singkat Proyek", appliesTo: "both", required: true, maxCount: 1, allowedFormats: "PDF", maxSizeMb: 5 }
    ],
    prizes: [
      { rank: "Juara 1", prize: "Rp 6.000.000 + Medali + Plakat" },
      { rank: "Juara 2", prize: "Rp 4.000.000 + Medali" },
      { rank: "Juara 3", prize: "Rp 2.500.000 + Medali" }
    ],
    rules: "Proyek harus disubmit via Repositori GitHub resmi dan dapat di-host secara publik."
  },
  {
    id: "comp-3",
    name: "E-Sport Esports Championship (Mobile Legends)",
    slug: "esports-mlbb",
    mode: "team",
    status: "REGISTRATION_OPEN",
    organizer: "Divisi Esports FOKRI GAMES XII",
    shortDescription: "Turnamen Esports Mobile Legends antar instansi & kampus se-Indonesia.",
    fullDescription: "Uji kekompakan dan strategi tim kamu di ajang Esports FOKRI GAMES XII MLBB Championship dengan sistem kualifikasi nasional.",
    coverImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
    eligibilityText: "Satu tim terdiri dari 5 pemain inti + 1 cadangan. Anggota harus berasal dari instansi yang sama.",
    quota: 64,
    currentRegistrations: 52,
    categories: [
      { id: "cat-3a", name: "Kategori Mahasiswa / Instansi", quota: 64, teamMin: 5, teamMax: 6 }
    ],
    schedules: [
      { label: "Pendaftaran Dibuka", date: "01 September 2026" },
      { label: "Penutupan Pendaftaran", date: "20 September 2026" },
      { label: "Technical Meeting Squad", date: "22 September 2026" },
      { label: "Kualifikasi Online", date: "26-27 September 2026" },
      { label: "Grand Final Live", date: "04 Oktober 2026" }
    ],
    documentRequirements: [
      { id: "docreq-6", name: "Kartu Tanda Anggota / KTM Roster", appliesTo: "team", required: true, maxCount: 6, allowedFormats: "JPG, PNG, PDF", maxSizeMb: 5 },
      { id: "docreq-7", name: "Screenshot Profil ID Player & Server ID", appliesTo: "team", required: true, maxCount: 6, allowedFormats: "JPG, PNG", maxSizeMb: 5 }
    ],
    prizes: [
      { rank: "Juara 1", prize: "Rp 7.500.000 + Trophy E-Sport + E-Certificate" },
      { rank: "Juara 2", prize: "Rp 5.000.000 + E-Certificate" },
      { rank: "Juara 3", prize: "Rp 3.000.000 + E-Certificate" }
    ],
    rules: "Dilarang keras menggunakan emulator, cheat, atau joki. Pelanggaran berujung diskualifikasi permanen."
  }
];

export const INITIAL_ANNOUNCEMENTS = [
  {
    id: "ann-1",
    title: "⚠️ PENTING: Perpanjangan Waktu Pendaftaran MKTIA & Update Technical Guidebook",
    content: "Diberitahukan kepada seluruh calon peserta MKTIA FOKRI GAMES XII bahwa batas pendaftaran dan unggah naskah diperpanjang hingga tanggal 25 September 2026. Harap mengunduh Guidebook versi 2.0 terbaru di menu Dokumen Publik.",
    category: "Emergency",
    pinned: true,
    publishedAt: "2026-09-07 10:00:00",
    author: "Panitia Pelaksana FOKRI GAMES XII",
    competitionId: "comp-1"
  },
  {
    id: "ann-2",
    title: "Jadwal Technical Meeting & Verifikasi Berkas Tahap 1",
    content: "Verifikasi berkas tahap pertama sedang berlangsung oleh tim sekretariat. Bagi peserta dengan status REVISION_REQUIRED, harap segera memperbaiki berkas di Dashboard Peserta.",
    category: "Technical Meeting",
    pinned: false,
    publishedAt: "2026-09-05 14:30:00",
    author: "Tim Verifikator FOKRI GAMES XII",
    competitionId: null
  }
];

export const INITIAL_REGISTRATIONS = [
  {
    id: "reg-101",
    registrationNumber: "FG12-MKTIA-000101",
    competitionId: "comp-1",
    competitionName: "Musabaqah Karya Tulis Ilmiah Al-Qur'an (MKTIA)",
    categoryId: "cat-1a",
    categoryName: "Sains & Teknologi Hijau",
    mode: "team",
    teamName: "Tim An-Nuur Tech UI",
    leaderUserId: "usr-participant-1",
    leaderName: "Ahmad Fauzi",
    institution: "Universitas Indonesia",
    status: "REVISION_REQUIRED", // DRAFT, SUBMITTED, UNDER_REVIEW, REVISION_REQUIRED, APPROVED, REJECTED, CANCELLED
    submittedAt: "2026-09-04 11:20:00",
    revisionNotes: "Berkas Surat Rekomendasi dari kampus buram dan stempel tidak terlihat jelas. Harap unggah ulang dokumen PDF yang resmi.",
    flaggedDocumentReqId: "docreq-2",
    documents: [
      { id: "doc-1", requirementId: "docreq-1", filename: "KTM_Anggota_AnNuur.pdf", version: 1, uploadedAt: "2026-09-04 11:15:00", scanStatus: "CLEAN" },
      { id: "doc-2", requirementId: "docreq-2", filename: "Surat_Rekomendasi_Kampus.pdf", version: 1, uploadedAt: "2026-09-04 11:18:00", scanStatus: "FLAGGED_REVISION" }
    ],
    members: [
      { userId: "usr-participant-1", name: "Ahmad Fauzi", role: "Leader", email: "fauzi@ui.ac.id", status: "ACCEPTED" },
      { userId: "usr-participant-2", name: "Budi Santoso", role: "Member", email: "budi@ui.ac.id", status: "ACCEPTED" },
      { userId: "usr-participant-3", name: "Siti Rahma", role: "Member", email: "siti@ui.ac.id", status: "PENDING" }
    ]
  },
  {
    id: "reg-102",
    registrationNumber: "FG12-WEB-000102",
    competitionId: "comp-2",
    competitionName: "Web Application & Algorithm Challenge",
    categoryId: "cat-2a",
    categoryName: "Web Fullstack Development",
    mode: "individual",
    teamName: null,
    leaderUserId: "usr-participant-4",
    leaderName: "Rian Hidayat",
    institution: "Institut Teknologi Bandung",
    status: "APPROVED",
    submittedAt: "2026-09-03 09:15:00",
    revisionNotes: null,
    documents: [
      { id: "doc-3", requirementId: "docreq-4", filename: "KTP_Rian_Hidayat.jpg", version: 1, uploadedAt: "2026-09-03 09:10:00", scanStatus: "CLEAN" },
      { id: "doc-4", requirementId: "docreq-5", filename: "Portfolio_Web_Rian.pdf", version: 1, uploadedAt: "2026-09-03 09:12:00", scanStatus: "CLEAN" }
    ],
    members: []
  },
  {
    id: "reg-103",
    registrationNumber: "FG12-MLBB-000103",
    competitionId: "comp-3",
    competitionName: "E-Sport Esports Championship (Mobile Legends)",
    categoryId: "cat-3a",
    categoryName: "Kategori Mahasiswa / Instansi",
    mode: "team",
    teamName: "Squad Garuda Cyber ITS",
    leaderUserId: "usr-participant-5",
    leaderName: "Dimas Saputra",
    institution: "Institut Teknologi Sepuluh Nopember",
    status: "UNDER_REVIEW",
    submittedAt: "2026-09-06 16:45:00",
    revisionNotes: null,
    documents: [
      { id: "doc-5", requirementId: "docreq-6", filename: "KTM_Roster_Garuda.pdf", version: 1, uploadedAt: "2026-09-06 16:40:00", scanStatus: "CLEAN" },
      { id: "doc-6", requirementId: "docreq-7", filename: "ID_Profiles_MLBB.pdf", version: 1, uploadedAt: "2026-09-06 16:42:00", scanStatus: "CLEAN" }
    ],
    members: [
      { userId: "usr-participant-5", name: "Dimas Saputra", role: "Leader", email: "dimas@its.ac.id", status: "ACCEPTED" },
      { userId: "usr-participant-6", name: "Reza Pratama", role: "Member", email: "reza@its.ac.id", status: "ACCEPTED" },
      { userId: "usr-participant-7", name: "Fajar Nugraha", role: "Member", email: "fajar@its.ac.id", status: "ACCEPTED" },
      { userId: "usr-participant-8", name: "Andi Wijaya", role: "Member", email: "andi@its.ac.id", status: "ACCEPTED" },
      { userId: "usr-participant-9", name: "Kevin Kurnia", role: "Member", email: "kevin@its.ac.id", status: "ACCEPTED" }
    ]
  }
];

export const INITIAL_FINALISTS = [
  {
    id: "fin-1",
    competitionId: "comp-2",
    categoryName: "Web Fullstack Development",
    registrationNumber: "FG12-WEB-000102",
    participantOrTeamName: "Rian Hidayat",
    institution: "Institut Teknologi Bandung",
    status: "PUBLISHED"
  }
];

export const INITIAL_RESULTS = [
  {
    id: "res-1",
    competitionId: "comp-2",
    competitionName: "Web Application & Algorithm Challenge",
    categoryName: "Web Fullstack Development",
    status: "PUBLISHED", // DRAFT, PREVIEW, PUBLISHED
    entries: [
      { rankLabel: "Juara 1", participantName: "Rian Hidayat", institution: "Institut Teknologi Bandung", score: "94.50", scoreVisible: true },
      { rankLabel: "Juara 2", participantName: "Tim CodeNinja UG", institution: "Universitas Gunadarma", score: "89.20", scoreVisible: true },
      { rankLabel: "Juara 3", participantName: "Tim ByteCraft UGM", institution: "Universitas Gadjah Mada", score: "86.75", scoreVisible: true }
    ]
  }
];

export const INITIAL_AUDIT_LOGS = [
  {
    id: "audit-1",
    actor: "Ahmad Fauzi (Participant)",
    action: "SUBMIT_REGISTRATION",
    target: "Registration FG12-MKTIA-000101",
    details: "Peserta mengajukan pendaftaran tim MKTIA",
    timestamp: "2026-09-04 11:20:00",
    ip: "182.253.11.4"
  },
  {
    id: "audit-2",
    actor: "Dra. Nurul Hidayah (Verifier)",
    action: "REQUEST_REVISION",
    target: "Registration FG12-MKTIA-000101",
    details: "Diminta perbaikan dokumen Surat Rekomendasi Kampus",
    timestamp: "2026-09-05 09:30:00",
    ip: "103.22.180.12"
  },
  {
    id: "audit-3",
    actor: "Super Admin FOKRI",
    action: "PUBLISH_RESULT",
    target: "Web Application & Algorithm Challenge Results",
    details: "Hasil resmi kejuaraan Web Challenge dipublikasikan ke publik",
    timestamp: "2026-09-07 16:00:00",
    ip: "10.0.0.1"
  }
];
