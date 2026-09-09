import React from 'react';
import { Trophy, Users, ShieldCheck, FileCheck, ArrowRight, Calendar, Bell, ChevronRight, Award, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';

export const Home = ({ setActiveTab, setSelectedCompSlug }) => {
  const { competitions, announcements } = useApp();

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        backgroundColor: 'var(--ppi-navy)',
        color: '#FFF',
        padding: '4rem 1.5rem',
        borderRadius: 'var(--border-radius)',
        marginBottom: '2.5rem',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{ maxWidth: '800px', position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: 'rgba(247, 181, 18, 0.15)',
            border: '1px solid var(--ppi-gold)',
            color: 'var(--ppi-gold)',
            padding: '0.35rem 0.85rem',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: 700,
            marginBottom: '1.25rem'
          }}>
            <Trophy size={16} /> PLATFORM MANAJEMEN KOMPETISI RESMI FOKRI GAMES XII
          </div>

          <h1 style={{
            fontSize: '2.8rem',
            color: '#FFF',
            fontWeight: 800,
            marginBottom: '1rem',
            lineHeight: 1.15
          }}>
            Satu Pintu Informasi, Pendaftaran & Hasil Kejuaraan FOKRI GAMES XII
          </h1>

          <p style={{
            fontSize: '1.15rem',
            color: '#E2E8F0',
            marginBottom: '2rem',
            lineHeight: 1.6
          }}>
            Sistem terintegrasi dengan penomoran registrasi otomatis, verifikasi berkas berjenjang, pelacakan status *real-time*, dan pengumuman hasil yang teruji auditabel.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button 
              className="btn btn-primary"
              onClick={() => setActiveTab('competitions')}
              style={{ fontSize: '1.05rem', padding: '0.8rem 1.75rem' }}
            >
              Jelajahi Cabang Lomba <ArrowRight size={18} />
            </button>
            
            <button 
              className="btn btn-secondary"
              onClick={() => setActiveTab('schedule')}
              style={{ color: '#FFF', borderColor: 'rgba(255,255,255,0.4)', fontSize: '1.05rem', padding: '0.8rem 1.5rem' }}
            >
              Lihat Jadwal Milestones
            </button>
          </div>
        </div>
      </section>

      {/* Metrics Counter Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem',
        marginBottom: '3rem'
      }}>
        <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
          <Trophy size={32} style={{ color: 'var(--ppi-navy)', marginBottom: '0.5rem' }} />
          <h3 style={{ fontSize: '2rem', color: 'var(--ppi-navy)' }}>3+</h3>
          <p style={{ fontSize: '0.9rem', color: '#64748B' }}>Cabang Kompetisi Nasional</p>
        </div>

        <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
          <Users size={32} style={{ color: 'var(--ppi-gold)', marginBottom: '0.5rem' }} />
          <h3 style={{ fontSize: '2rem', color: 'var(--ppi-navy)' }}>100+</h3>
          <p style={{ fontSize: '0.9rem', color: '#64748B' }}>Kuota Tim & Individu Terdaftar</p>
        </div>

        <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
          <FileCheck size={32} style={{ color: '#16A34A', marginBottom: '0.5rem' }} />
          <h3 style={{ fontSize: '2rem', color: 'var(--ppi-navy)' }}>100%</h3>
          <p style={{ fontSize: '0.9rem', color: '#64748B' }}>Verifikasi Auditabel & Transparan</p>
        </div>

        <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
          <Award size={32} style={{ color: 'var(--ppi-navy)', marginBottom: '0.5rem' }} />
          <h3 style={{ fontSize: '2rem', color: 'var(--ppi-navy)' }}>Rp 40JT+</h3>
          <p style={{ fontSize: '0.9rem', color: '#64748B' }}>Total Hadiah & Pembinaan</p>
        </div>
      </div>

      {/* Featured Competitions Section */}
      <section style={{ marginBottom: '3.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Kompetisi Pilihan FOKRI GAMES XII</h2>
            <p style={{ color: '#64748B', fontSize: '0.95rem' }}>Pilih cabang lomba sesuai bidang bakat dan minat Anda.</p>
          </div>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => setActiveTab('competitions')}
          >
            Lihat Semua Kompetisi <ChevronRight size={16} />
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}>
          {competitions.slice(0, 3).map(comp => (
            <div key={comp.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{
                height: '160px',
                borderRadius: '8px',
                backgroundImage: `url(${comp.coverImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                marginBottom: '1rem',
                position: 'relative'
              }}>
                <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                  <StatusBadge status={comp.status} />
                </div>
              </div>

              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', lineHeight: 1.3 }}>
                {comp.name}
              </h3>

              <p style={{ fontSize: '0.88rem', color: '#475569', marginBottom: '1rem', flex: 1 }}>
                {comp.shortDescription}
              </p>

              <div style={{
                fontSize: '0.8rem',
                backgroundColor: 'var(--light-bg)',
                padding: '0.6rem 0.85rem',
                borderRadius: '6px',
                marginBottom: '1rem',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span>Format: <strong>{comp.mode === 'team' ? 'Tim' : comp.mode === 'individual' ? 'Individu' : 'Individu / Tim'}</strong></span>
                <span>Kuota: <strong>{comp.currentRegistrations} / {comp.quota}</strong></span>
              </div>

              <button 
                className="btn btn-primary btn-sm"
                onClick={() => {
                  setSelectedCompSlug(comp.slug);
                  setActiveTab('competition-detail');
                }}
                style={{ width: '100%' }}
              >
                Detail & Syarat Pendaftaran <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Platform Advantages */}
      <section className="card" style={{
        backgroundColor: '#0F172A',
        color: '#FFF',
        padding: '2.5rem',
        borderRadius: 'var(--border-radius)',
        marginBottom: '3rem'
      }}>
        <h2 style={{ color: '#FFF', textAlign: 'center', marginBottom: '2rem' }}>
          Mengapa Platform FOKRI GAMES XII Berbeda?
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '2rem'
        }}>
          <div>
            <CheckCircle size={28} style={{ color: 'var(--ppi-gold)', marginBottom: '0.75rem' }} />
            <h4 style={{ color: '#FFF', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Nomor Registrasi Tunggal</h4>
            <p style={{ fontSize: '0.88rem', color: '#94A3B8' }}>
              Setiap pendaftaran mendapatkan format nomor resmi unik (misal: <code>FG12-MKTIA-000101</code>) untuk pelacakan mudah.
            </p>
          </div>

          <div>
            <CheckCircle size={28} style={{ color: 'var(--ppi-gold)', marginBottom: '0.75rem' }} />
            <h4 style={{ color: '#FFF', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Dashboard Status Real-time</h4>
            <p style={{ fontSize: '0.88rem', color: '#94A3B8' }}>
              Peserta selalu tahu posisi berkas (Under Review, Revision Required, Approved) beserta alasan resmi verifikator.
            </p>
          </div>

          <div>
            <CheckCircle size={28} style={{ color: 'var(--ppi-gold)', marginBottom: '0.75rem' }} />
            <h4 style={{ color: '#FFF', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Keamanan & Audit Trail</h4>
            <p style={{ fontSize: '0.88rem', color: '#94A3B8' }}>
              Seluruh keputusan panitia dan perubahan hasil dicatat secara permanen tanpa risiko pemalsuan berkas.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
