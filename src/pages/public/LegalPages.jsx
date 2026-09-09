import React from 'react';
import { ShieldCheck, Lock, FileText } from 'lucide-react';

export const LegalPrivacy = () => (
  <div className="card" style={{ padding: '2rem' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: 'var(--ppi-navy)' }}>
      <ShieldCheck size={28} />
      <h1 style={{ fontSize: '2rem' }}>Kebijakan Privasi Data Peserta FOKRI GAMES XII</h1>
    </div>
    <p style={{ lineHeight: 1.7, marginBottom: '1rem' }}>
      Organizing Committee FOKRI GAMES XII berkomitmen penuh untuk melindungi identitas dan dokumen pribadi yang diunggah oleh seluruh peserta kompetisi.
    </p>
    <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>1. Pengumpulan Data</h3>
    <p style={{ lineHeight: 1.6, color: '#475569' }}>
      Data pribadi seperti Nama, NIM/KTP, Nomor Telepon, Instansi, dan Salinan Dokumen identitas dikumpulkan semata-mata untuk verifikasi kelayakan kompetisi FOKRI GAMES XII.
    </p>
    <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>2. Akses & Keamanan Dokumen</h3>
    <p style={{ lineHeight: 1.6, color: '#475569' }}>
      Sesuai arsitektur keamanan PRD Section 16 & 27, seluruh dokumen disimpan dalam media terproteksi (private object storage) dan hanya dapat diakses melalui URL sementara bertanda tangan sah (signed short-lived URL) oleh verifikator yang berwenang.
    </p>
  </div>
);

export const LegalTerms = () => (
  <div className="card" style={{ padding: '2rem' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: 'var(--ppi-navy)' }}>
      <FileText size={28} />
      <h1 style={{ fontSize: '2rem' }}>Syarat & Ketentuan Penggunaan Platform</h1>
    </div>
    <p style={{ lineHeight: 1.7, marginBottom: '1rem' }}>
      Dengan membuat akun dan mendaftar kompetisi pada platform FOKRI GAMES XII, Anda menyatakan bersedia mematuhi aturan berikut:
    </p>
    <ul style={{ paddingLeft: '1.5rem', lineHeight: 1.8, color: '#332C2B' }}>
      <li>Memberikan data identitas yang jujur dan dapat dipertanggungjawabkan.</li>
      <li>Setiap pemalsuan berkas atau kecurangan karya akan berujung diskualifikasi permanen dan pembatalan gelar juara.</li>
      <li>Keputusan verifikasi panitia dan dewan juri bersifat mutlak dan mengikat.</li>
    </ul>
  </div>
);
