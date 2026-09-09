import React, { useState } from 'react';
import { HelpCircle, Mail, Phone, MapPin, Send, ChevronDown, ChevronUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FaqContact = () => {
  const { showToast } = useApp();
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: "Bagaimana cara melakukan pendaftaran kompetisi di FOKRI GAMES XII?",
      a: "Anda cukup membuat akun di platform ini, memverifikasi email, melengkapi profil, lalu memilih cabang kompetisi di menu Kompetisi. Ikuti petunjuk unggah dokumen dan tekan Submit untuk mendapatkan Nomor Registrasi resmi."
    },
    {
      q: "Bagaimana jika berkas pendaftaran saya berstatus REVISION_REQUIRED?",
      a: "Masuk ke Dashboard Saya, lihat panel 'Action Required', lalu baca catatan verifikator mengenai berkas mana yang perlu diperbaiki. Unggah ulang berkas perbaikan sebelum batas waktu revisi berakhir."
    },
    {
      q: "Apakah peserta dapat terdaftar di dua tim untuk cabang yang sama?",
      a: "Sesuai Business Rule BR-1 & BR-5, satu akun peserta hanya dapat memiliki 1 status pendaftaran aktif pada cabang kompetisi yang sama untuk mencegah duplikasi roster."
    },
    {
      q: "Bagaimana jika kuota pendaftaran cabang lomba sudah penuh?",
      a: "Sistem mengunci pendaftaran secara otomatis begitu kuota tercapai. Jika ada peserta lain yang dibatalkan atau ditolak, slot kuota akan rilis secara otomatis ke publik."
    }
  ];

  const handleSubmitMessage = (e) => {
    e.preventDefault();
    showToast('Pesan Anda berhasil dikirim ke Helpdesk Panitia!', 'success');
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>FAQ & Layanan Kontak Helpdesk</h1>
        <p style={{ color: '#64748B' }}>
          Pertanyaan umum seputar mekanisme pendaftaran, verifikasi berkas, dan layanan bantuan.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* FAQ Accordion */}
        <div>
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <HelpCircle style={{ color: 'var(--ppi-navy)' }} /> Pertanyaan Sering Diajukan
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {faqs.map((item, idx) => (
              <div key={idx} className="card" style={{ padding: '1rem 1.25rem', cursor: 'pointer' }} onClick={() => setOpenIndex(openIndex === idx ? null : idx)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 600, color: 'var(--deep-navy)', fontSize: '0.95rem' }}>
                  <span>{item.q}</span>
                  {openIndex === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>

                {openIndex === idx && (
                  <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, borderTop: '1px solid #F1F5F9', paddingTop: '0.75rem' }}>
                    {item.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Helpdesk Contact Form */}
        <div className="card">
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Mail style={{ color: 'var(--ppi-navy)' }} /> Kirim Pesan ke Panitia
          </h3>

          <form onSubmit={handleSubmitMessage} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Nama Lengkap</label>
              <input type="text" required placeholder="Nama Anda" style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #CBD5E1' }} />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Email Terdaftar</label>
              <input type="email" required placeholder="email@domain.com" style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #CBD5E1' }} />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Topik Pertanyaan</label>
              <select style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}>
                <option>Kendala Upload Berkas</option>
                <option>Pertanyaan Teknis Lomba</option>
                <option>Permintaan Revisi Data</option>
                <option>Lainnya</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Detail Pesan</label>
              <textarea rows={4} required placeholder="Tuliskan kendala Anda secara jelas..." style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}></textarea>
            </div>

            <button type="submit" className="btn btn-primary">
              <Send size={16} /> Kirim Pesan Helpdesk
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
