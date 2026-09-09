import React from 'react';
import { Calendar, Clock, CheckCircle2, Trophy } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SchedulePage = () => {
  const { competitions } = useApp();

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>Jadwal & Milestone Utama FOKRI GAMES XII</h1>
        <p style={{ color: '#64748B' }}>
          Kalender resmi seluruh rangkaian kegiatan kompetisi nasional dari pendaftaran hingga pengumuman juara.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {competitions.map(comp => (
          <div key={comp.id} className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.85rem' }}>
              <Trophy style={{ color: 'var(--ppi-navy)' }} size={24} />
              <div>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--deep-navy)' }}>{comp.name}</h3>
                <span style={{ fontSize: '0.82rem', color: '#64748B' }}>Penyelenggara: {comp.organizer}</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              {comp.schedules.map((sch, idx) => (
                <div key={idx} style={{
                  backgroundColor: 'var(--light-bg)',
                  padding: '1rem',
                  borderRadius: '8px',
                  borderLeft: '4px solid var(--ppi-gold)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--ppi-navy)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                    <Calendar size={14} /> {sch.date}
                  </div>
                  <strong style={{ fontSize: '0.95rem', color: '#332C2B' }}>{sch.label}</strong>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
