import React from 'react';
import { Trophy, Award, CheckCircle2, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ResultsPage = () => {
  const { results, finalists } = useApp();

  const publishedResults = results.filter(r => r.status === 'PUBLISHED');

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>Pengumuman Hasil Resmi Kejuaraan</h1>
        <p style={{ color: '#64748B' }}>
          Daftar pemenang dan finalis resmi FOKRI GAMES XII yang telah ditetapkan panitia dan diverifikasi sistem.
        </p>
      </div>

      {publishedResults.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <Trophy size={48} style={{ color: '#CBD5E1', marginBottom: '1rem' }} />
          <h3>Hasil Kejuaraan Belum Diterbitkan</h3>
          <p style={{ color: '#64748B' }}>Pengumuman pemenang akan ditampilkan secara otomatis setelah seluruh babak final selesai diselenggarakan.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {publishedResults.map(res => (
            <div key={res.id} className="card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.85rem' }}>
                <div>
                  <span className="badge badge-approved" style={{ marginBottom: '0.35rem' }}>
                    <ShieldCheck size={12} /> HASIL RESMI TERVERIFIKASI
                  </span>
                  <h3 style={{ fontSize: '1.3rem', color: 'var(--deep-navy)' }}>{res.competitionName}</h3>
                  <span style={{ fontSize: '0.85rem', color: '#64748B' }}>Kategori: {res.categoryName}</span>
                </div>
              </div>

              {/* Winners Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.92rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#0F172A', color: '#FFF', textAlign: 'left' }}>
                      <th style={{ padding: '0.75rem 1rem', borderRadius: '6px 0 0 6px' }}>Peringkat / Gelar</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Nama Peserta / Tim</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Asal Instansi</th>
                      <th style={{ padding: '0.75rem 1rem', borderRadius: '0 6px 6px 0', textAlign: 'right' }}>Nilai Akhir</th>
                    </tr>
                  </thead>
                  <tbody>
                    {res.entries.map((entry, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9', backgroundColor: idx === 0 ? 'rgba(247, 181, 18, 0.08)' : 'transparent' }}>
                        <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Award size={18} style={{ color: idx === 0 ? '#F7B512' : idx === 1 ? '#94A3B8' : '#D97706' }} />
                            {entry.rankLabel}
                          </div>
                        </td>
                        <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--ppi-navy)' }}>
                          {entry.participantName}
                        </td>
                        <td style={{ padding: '0.85rem 1rem', color: '#475569' }}>
                          {entry.institution}
                        </td>
                        <td style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: 700 }}>
                          {entry.scoreVisible ? (
                            <span style={{ color: '#16A34A' }}>{entry.score}</span>
                          ) : (
                            <span style={{ color: '#94A3B8', fontSize: '0.8rem', fontStyle: 'italic', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.25rem' }}>
                              <EyeOff size={14} /> Rahasia Panitia
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
