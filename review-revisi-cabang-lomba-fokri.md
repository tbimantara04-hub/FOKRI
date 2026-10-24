# Laporan Review Revisi Cabang Lomba FOKRI GAMES XII

## Ringkasan

Daftar katalog sekarang memuat delapan cabang sesuai tabel acuan dan urutannya. Nama lengkap beserta singkatan ditampilkan dari sumber data bersama `src/data/mockData.js`, yang dipakai oleh halaman publik, wizard peserta, dan panel admin.

`IMPLEMENTATION_REPORT.md` menjelaskan bahwa aplikasi saat ini memakai state mock di frontend dan belum tersambung ke database aktif. Tidak ada migrasi database yang diperlukan atau dijalankan. ID `comp-1` hingga `comp-8` dan slug lama dipertahankan; tidak ada relasi, pendaftaran, hasil, atau riwayat yang dipindahkan.

Gambar referensi tidak tersedia pada lampiran yang dibagikan. Implementasi mengikuti tabel nama, singkatan, dan urutan di permintaan.

## Jadwal terbaru

Satu sumber jadwal resmi bersama digunakan untuk tabel, tampilan timeline, detail cabang, dan ringkasan jadwal per cabang:

| No. | Kegiatan | Tanggal |
|---:|---|---|
| 1 | Pembukaan pendaftaran | 25 Oktober 2026 |
| 2 | Penutupan pendaftaran | 7 November 2026 |
| 3 | Technical Meeting Lomba | 8 November 2026 |
| 4 | Pengumpulan karya | 9–17 November 2026 |
| 5 | Pengumuman finalis | 24 November 2026 |
| 6 | Technical Meeting Hari H | 26 November 2026 |
| 7 | Hari H: registrasi peserta, pembukaan, Grand Final, pengumuman juara serta PTK EXPO | 28 November 2026 |

Halaman jadwal menyediakan tampilan tabel dan timeline, serta ringkasan jadwal pada masing-masing cabang.

## Daftar cabang

| No. | Nama yang ditampilkan | Slug |
|---:|---|---|
| 1 | Musabaqah Azan (MA) | `ma` |
| 2 | Musabaqah Fahmil Quran (MFQ) | `mfq` |
| 3 | Musabaqah Da’i Muda (MDM) | `mdm` |
| 4 | Lomba Film Pendek Islami (LFPI) | `lfpi` |
| 5 | Lomba Desain Media Dakwah Digital (LDMD) | `ldmd` |
| 6 | Lomba Karya Tulis Islami (LKTI) | `lkti` |
| 7 | Musabaqah Nasyid Islami (MNI) | `mni` |
| 8 | Musabaqah Tartil Quran (MTQ) | `mtq` |

## Iterasi pertama — review dan perbaikan

| Temuan | Dampak | Perbaikan |
|---|---|---|
| Nama cabang MTQ masih menggunakan “Musabaqah Tilawatil Quran”. | Nama tidak sesuai acuan dan metadata lama tidak terbukti milik cabang Tartil Quran. | Mengganti nama menjadi “Musabaqah Tartil Quran (MTQ)”; metadata operasional yang tidak terverifikasi untuk entri ini dikosongkan, status dibuat `DRAFT`, dan pendaftaran ditahan sampai informasi resmi tersedia. |
| Slug yang tidak dikenal pada halaman detail jatuh kembali ke cabang pertama. | Pengunjung dapat melihat atau mencoba mendaftar cabang yang salah. | Menghapus fallback dan menampilkan keadaan “Kompetisi tidak ditemukan” dengan tautan kembali ke direktori. |
| Grid kartu menggunakan lebar minimum tetap yang berisiko melampaui layar kecil; judul panjang perlu dapat membungkus. | Nama panjang berpotensi terpotong atau menyebabkan scroll horizontal. | Grid memakai lebar minimum yang responsif dan judul memakai pembungkusan kata yang aman. |
| Kategori awal wizard selalu diambil dari cabang pertama meski cabang yang dipilih dari tautan detail berbeda. | Pilihan kategori dapat tidak sesuai dengan cabang yang dituju. | Inisialisasi kategori mengikuti cabang pada state navigasi. |

**Skor awal: 8,9/10**

| Aspek | Nilai | Bobot | Kontribusi |
|---|---:|---:|---:|
| Ketepatan daftar cabang | 10,0 | 30% | 3,00 |
| Konsistensi seluruh fitur terkait | 8,5 | 25% | 2,125 |
| Fungsi navigasi dan pendaftaran | 8,0 | 20% | 1,60 |
| UI responsif dan keterbacaan | 8,5 | 15% | 1,275 |
| Integritas data dan kualitas implementasi | 9,0 | 10% | 0,90 |

Nilai awal bersifat sementara. Skor konsistensi dan UI belum maksimal karena review berikutnya masih perlu memeriksa fallback tampilan pada halaman beranda dan keadaan disabled.

## Iterasi kedua — review ulang dan verifikasi

| Temuan review ulang | Dampak | Perbaikan |
|---|---|---|
| Tampilan beranda editorial menganggap `mode` yang kosong sebagai format “Individual / Team”. | Bisa menyampaikan format yang belum dikonfirmasi sebagai fakta. | Menampilkan “DETAILS PENDING” dan membungkus judul panjang dengan aturan yang sama. |
| Penyimpanan konfigurasi admin dapat menghilangkan penanda `detailsPending`. | Admin bisa mengubah status menjadi terbuka sementara informasi resmi masih kosong. | Mempertahankan penanda saat edit dan menambahkan guard pendaftaran kedua pada `AppContext`. |
| Tombol yang dinonaktifkan belum memiliki petunjuk visual/kontekstual cukup jelas. | Pengunjung tidak mengetahui mengapa pendaftaran tidak dapat dilanjutkan. | Menampilkan keterangan informasi resmi belum tersedia serta tampilan disabled yang jelas. |
| Review ulang pencarian, filter, kartu, navigasi detail, dan daftar pilihan peserta/admin. | Diperlukan bukti bahwa nama/slug tetap konsisten di permukaan yang memakai katalog. | Menambah tes kontrak katalog dan melakukan pemeriksaan browser pada ukuran mobile serta desktop. |

### Skor akhir berbobot: 9,4/10

| Aspek | Nilai | Bobot | Kontribusi |
|---|---:|---:|---:|
| Ketepatan daftar cabang | 10,0 | 30% | 3,00 |
| Konsistensi seluruh fitur terkait | 9,5 | 25% | 2,375 |
| Fungsi navigasi dan pendaftaran | 9,0 | 20% | 1,80 |
| UI responsif dan keterbacaan | 9,0 | 15% | 1,35 |
| Integritas data dan kualitas implementasi | 9,0 | 10% | 0,90 |

Perhitungan: `3,00 + 2,375 + 1,80 + 1,35 + 0,90 = 9,425`, dibulatkan menjadi **9,4/10**.

## Hasil pemeriksaan

### Lulus

- `npm test`: 8 file tes, 62 tes lulus.
- `npm run build`: build produksi berhasil.
- Tes katalog memeriksa delapan nama dan slug dalam urutan yang diminta, keunikan ID/slug, serta ketiadaan metadata Tilawatil Quran pada entri Tartil Quran.
- Browser mobile, viewport 390 × 844: delapan kartu dirender; `body.scrollWidth` 375 px, sehingga tidak ada overflow horizontal pada viewport 390 px. Nama LDMD terlihat membungkus pada kartu.
- Browser desktop, viewport 1440 × 960: delapan kartu dirender; `body.scrollWidth` 1425 px, tidak melebihi viewport. Judul detail LDMD terbaca.
- Jadwal browser desktop: tabel memuat 7 kegiatan; beralih ke timeline menampilkan 7 kartu dan acara puncak 28 November 2026.
- Jadwal browser mobile: tabel mempertahankan lebar minimum 580 px di dalam kontainer yang dapat di-scroll horizontal; timeline tetap muat dengan `body.scrollWidth` 375 px pada viewport 390 px.
- Pencarian singkatan `LDMD` menghasilkan satu kartu dengan nama/slug yang benar.
- Filter format “Tim” menghasilkan lima entri yang sesuai dengan konfigurasi mode yang tersedia.
- Direktori → detail LDMD membuka `/competitions/ldmd`; tombol pendaftaran MFQ mengarahkan pengguna yang belum login ke `/auth`.
- Login demo peserta membuka wizard dengan cabang MFQ yang tepat; memilih MTQ menampilkan peringatan dan menonaktifkan langkah lanjutan.
- Slug tidak valid menampilkan “Kompetisi tidak ditemukan”, bukan detail cabang pertama.
- Detail MTQ menampilkan kuota belum diumumkan dan tombol pendaftaran disabled.
- `git diff --check`: tidak ada whitespace error setelah perbaikan.

### Lulus dengan catatan

- Build menampilkan peringatan ukuran bundle JavaScript di atas 500 kB (sekitar 717 kB sebelum gzip). Build tetap berhasil; optimasi pemecahan bundle tidak termasuk ruang lingkup revisi cabang.
- Permintaan gambar dari Unsplash diblokir di lingkungan browser pemeriksaan (`ERR_BLOCKED_BY_ORB`). Teks, navigasi, pembungkusan judul, dan layout tetap dapat diperiksa.

### Belum dijalankan

- Lint dan type-check terpisah: tidak tersedia sebagai script di `package.json`.
- Pengiriman pendaftaran sampai submit final: tidak dilakukan; aplikasi menggunakan data mock dan informasi resmi untuk MTQ sengaja belum tersedia.
- Perubahan skema atau database Supabase: tidak diperlukan untuk arsitektur saat ini dan tidak dijalankan ke produksi.

## Catatan data dan migrasi

- Entri MTQ tidak mewarisi kuota, kategori, jadwal khusus, persyaratan dokumen, hadiah, aturan, maupun status pendaftaran dari label Tilawatil Quran yang sebelumnya ada. Informasi tersebut perlu dikonfirmasi panitia sebelum cabang dibuka.
- Data operasional tujuh cabang lain tidak dibuat ulang atau dipindahkan; nama dan ID cabang yang sama tetap dipakai. Karena katalog bersumber dari mock frontend dan tidak ada referensi resmi yang disertakan, panitia tetap perlu mengonfirmasi kuota, format tim, jadwal, persyaratan, hadiah, dan pedoman sebelum publikasi/pendaftaran produksi.
- Tidak ada migrasi database. `supabase/seed.sql` hanya menyediakan kompetisi demo dan aplikasi belum memuat katalog aktif dari database.
- Tidak ada data registrasi, peserta, tim, dokumen, finalis, maupun hasil yang dihapus atau diubah.

## File yang disentuh untuk revisi ini

- `src/data/mockData.js`
- `src/data/mockData.test.js`
- `src/context/AppContext.jsx`
- `src/pages/public/Competitions.jsx`
- `src/pages/public/CompetitionDetail.jsx`
- `src/pages/public/Home.jsx`
- `src/pages/public/HomeEditorial.jsx`
- `src/pages/public/SchedulePage.jsx`
- `src/pages/participant/ParticipantDashboard.jsx`
- `src/pages/admin/AdminDashboard.jsx`
- `src/styles/index.css`

Perubahan jadwal mencakup `JADWAL_PELAKSANAAN`, tampilan tabel/timeline, dan sinkronisasi ringkasan per cabang.

Beberapa file tersebut (`src/data/mockData.js`, `src/pages/public/CompetitionDetail.jsx`, `src/pages/public/SchedulePage.jsx`, dan `src/styles/index.css`) sudah memiliki perubahan lokal sebelum revisi. Perubahan yang ada dipertahankan dan diintegrasikan; perubahan auth/storage serta gambar PNG tidak termasuk cakupan push ini.c/SchedulePage.jsx`, dan `src/styles/index.css`) sudah memiliki perubahan lokal sebelum revisi ini. Perubahan yang ada dipertahankan dan diintegrasikan; file lokal lain yang tidak terkait tidak diubah sebagai bagian dari pekerjaan ini.

## Bukti visual

Screenshot katalog mobile 390 × 844 px dan tampilan detail desktop 1440 × 960 px diambil saat review browser dan dilampirkan pada percakapan. Screenshot tambahan halaman detail MTQ menunjukkan status draft, kuota belum diumumkan, dan tombol pendaftaran disabled.
