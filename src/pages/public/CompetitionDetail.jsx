import React, { useState } from 'react';
import { Trophy, Calendar, FileText, CheckCircle2, Award, ShieldAlert, ArrowLeft, ArrowRight, Users, Clock, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';

export const CompetitionDetail = ({ selectedCompSlug, setActiveTab, setStartRegCompId }) => {
  const { competitions, currentRole, showToast } = useApp();
  const [activeSubTab, setActiveSubTab] = useState('overview');

  const comp = competitions.find(c => c.slug === selectedCompSlug) || competitions[0];

  if (!comp) return <div>Kompetisi tidak ditemukan.</div>;

  const handleStartRegistration = () => {
    if (comp.status !== 'REGISTRATION_OPEN') {
      showToast('Pendaftaran untuk kompetisi ini sedang ditutup.', 'danger');
      return;
    }
    if (comp.currentRegistrations >= comp.quota) {
      showToast('Kuota pendaftaran sudah penuh!', 'danger');
      return;
    }
    setStartRegCompId(comp.id);
    setActiveTab('dashboard-participant');
  };

  return (
    <div>
      <button 
        className="btn btn-secondary btn-sm"
        onClick={() => setActiveTab('competitions')}
        style={{ marginBottom: '1.5rem' }}
      >
        <ArrowLeft size={16} /> Kembali ke Direktori Kompetisi
      </button>

      {/* Hero Header */}
      <div className="card" style={{ padding: '2rem', marginBottom: '2rem', backgroundColor: '#0F172A', color: '#FFF' }}>
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <StatusBadge status={comp.status} />
          <span className="badge badge-draft" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#FFF' }}>
            {comp.mode === 'team' ? 'Format Tim' : comp.mode === 'individual' ? 'Format Individu' : 'Individu / Tim'}
          </span>
        </div>

        <h1 style={{ fontSize: '2.2rem', color: '#FFF', marginBottom: '0.75rem' }}>
          {comp.name}
        </h1>

        <p style={{ fontSize: '1.05rem', color: '#CBD5E1', marginBottom: '1.5rem', maxWidth: '850px' }}>
          {comp.shortDescription}
        </p>

        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.25rem' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#94A3B8', display: 'block' }}>Penyelenggara</span>
            <strong style={{ fontSize: '0.95rem' }}>{comp.organizer}</strong>
          </div>

          <div>
            <span style={{ fontSize: '0.8rem', color: '#94A3B8', display: 'block' }}>Sisa Kuota Pendaftaran</span>
            <strong style={{ fontSize: '0.95rem', color: '#F7B512' }}>{comp.quota - comp.currentRegistrations} dari {comp.quota} Slot Tersedia</strong>
          </div>

          <div style={{ marginLeft: 'auto' }}>
            <button 
              className="btn btn-primary"
              onClick={handleStartRegistration}
              style={{ fontSize: '1rem', padding: '0.75rem 1.5rem' }}
            >
              Daftar Kompetisi Ini Sekarang <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Sub Tabs Navigation */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid #E2E8F0', marginBottom: '1.5rem', overflowX: 'auto' }}>
        {[
          { id: 'overview', label: 'Ringkasan & Syarat Peserta', icon: FileText },
          { id: 'categories', label: 'Kategori & Quota', icon: Users },
          { id: 'schedules', label: 'Jadwal Milestones', icon: Calendar },
          { id: 'documents', label: 'Persyaratan Berkas', icon: CheckCircle2 },
          { id: 'rules', label: 'Aturan & Hadiah', icon: Award }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              style={{
                padding: '0.75rem 1.25rem',
                border: 'none',
                background: 'none',
                borderBottom: activeSubTab === tab.id ? '3px solid var(--ppi-navy)' : '3px solid transparent',
                color: activeSubTab === tab.id ? 'var(--ppi-navy)' : '#64748B',
                fontWeight: activeSubTab === tab.id ? 700 : 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.95rem',
                whiteSpace: 'nowrap'
              }}
            >
              <Icon size={16} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="card" style={{ padding: '2rem' }}>
        {activeSubTab === 'overview' && (
          <div>
            <h3 style={{ marginBottom: '1rem' }}>Deskripsi Lengkap Kompetisi</h3>
            <p style={{ lineHeight: 1.7, marginBottom: '2rem', color: '#332C2B' }}>
              {comp.fullDescription}
            </p>

            <h3 style={{ marginBottom: '1rem' }}>Syarat & Kriteria Kelayakan (Eligibility)</h3>
            <div style={{ backgroundColor: 'var(--light-bg)', padding: '1.25rem', borderRadius: '8px', borderLeft: '4px solid var(--ppi-navy)', marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.95rem', color: '#332C2B' }}>
                {comp.eligibilityText}
              </p>
            </div>
          </div>
        )}

        {activeSubTab === 'categories' && (
          <div>
            <h3 style={{ marginBottom: '1rem' }}>Sub-Kategori Lomba</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {comp.categories.map(cat => (
                <div key={cat.id} style={{ border: '1px solid #E2E8F0', borderRadius: '8px', padding: '1.25rem' }}>
                  <h4 style={{ color: 'var(--ppi-navy)', marginBottom: '0.5rem' }}>{cat.name}</h4>
                  <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '0.5rem' }}>
                    Maksimal Roster Tim: <strong>{cat.teamMin} - {cat.teamMax} Orang</strong>
                  </p>
                  <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
                    Kuota Kategori: <strong>{cat.quota} Slot</strong>
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSubTab === 'schedules' && (
          <div>
            <h3 style={{ marginBottom: '1.5rem' }}>Jadwal & Milestone Penting</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {comp.schedules.map((sch, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderBottom: '1px solid #F1F5F9' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--navy-light-tint)',
                    color: 'var(--ppi-navy)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700
                  }}>
                    {idx + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <strong style={{ display: 'block', fontSize: '1rem', color: 'var(--deep-navy)' }}>{sch.label}</strong>
                    <span style={{ fontSize: '0.85rem', color: '#64748B' }}>{sch.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSubTab === 'documents' && (
          <div>
            <h3 style={{ marginBottom: '1rem' }}>Daftar Dokumen Wajib & Lampiran</h3>
            <p style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: '1.5rem' }}>
              Setiap berkas wajib diunggah dalam format resmi dan ukuran maksimum yang telah ditentukan.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {comp.documentRequirements.map(docReq => (
                <div key={docReq.id} style={{ border: '1px solid #E2E8F0', borderRadius: '8px', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ fontSize: '0.98rem', color: 'var(--deep-navy)' }}>{docReq.name}</strong>
                    <div style={{ fontSize: '0.83rem', color: '#64748B', marginTop: '0.25rem' }}>
                      Format: <code>{docReq.allowedFormats}</code> · Maksimal: <code>{docReq.maxSizeMb} MB</code> per berkas
                    </div>
                  </div>
                  <span className={`badge ${docReq.required ? 'badge-revision' : 'badge-draft'}`}>
                    {docReq.required ? 'WAJIB' : 'OPSIONAL'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSubTab === 'rules' && (
          <div>
            <h3 style={{ marginBottom: '1rem' }}>Penghargaan & Hadiah Kejuaraan</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              {comp.prizes.map((prz, idx) => (
                <div key={idx} style={{ backgroundColor: 'var(--light-bg)', padding: '1.25rem', borderRadius: '8px', borderTop: '3px solid var(--ppi-gold)' }}>
                  <Trophy size={24} style={{ color: 'var(--ppi-gold)', marginBottom: '0.5rem' }} />
                  <strong style={{ display: 'block', fontSize: '1.05rem', color: 'var(--deep-navy)' }}>{prz.rank}</strong>
                  <span style={{ fontSize: '0.9rem', color: '#332C2B', fontWeight: 600 }}>{prz.prize}</span>
                </div>
              ))}
            </div>

            <h3 style={{ marginBottom: '0.75rem' }}>Peraturan Umum Kompetisi</h3>
            <div style={{ whiteSpace: 'pre-line', fontSize: '0.92rem', lineHeight: 1.7, color: '#332C2B', backgroundColor: '#F8FAFC', padding: '1.25rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              {comp.rules}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
