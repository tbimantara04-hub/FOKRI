import React, { useState } from 'react';
import { Calendar, Clock, Trophy, Sparkles, Table, LayoutGrid, Info, CheckCircle2, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { JADWAL_PELAKSANAAN } from '../../data/mockData';

export const SchedulePage = () => {
  const { competitions } = useApp();
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'timeline'

  // Ensure schedules always match the 7 official activities even if cached in state
  const getCompSchedules = (comp) => {
    if (comp?.schedules && comp.schedules.length === 7) {
      return comp.schedules;
    }
    return JADWAL_PELAKSANAAN.map(item => ({ label: item.kegiatan, date: item.tanggal }));
  };

  return (
    <div className="schedule-page-container">
      {/* Header Banner */}
      <section className="jadwal-header-card">
        <div style={{ maxWidth: '820px', position: 'relative', zIndex: 1 }}>
          <div className="jadwal-badge-top">
            <Calendar size={15} /> AGENDA RESMI FOKRI GAMES XII
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', color: '#FFFFFF', fontWeight: 800, marginBottom: '0.75rem', lineHeight: 1.2 }}>
            Jadwal Pelaksanaan FOKRI GAMES XII
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '1.05rem', lineHeight: 1.6, margin: 0 }}>
            Kalender resmi seluruh rangkaian kegiatan kompetisi nasional dari pembukaan pendaftaran hingga Grand Final dan PTK EXPO.
          </p>
        </div>
      </section>

      {/* Main Section Jadwal */}
      <section id="jadwal" className="jadwal-section" style={{ scrollMarginTop: '100px' }} aria-label="Jadwal Pelaksanaan">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.6rem', color: 'var(--deep-navy)', marginBottom: '0.25rem' }}>
              Jadwal Pelaksanaan
            </h2>
            <p style={{ color: '#64748B', fontSize: '0.92rem' }}>
              Rangkaian 7 kegiatan utama kompetisi yang disusun secara kronologis.
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="jadwal-view-tabs" role="tablist" aria-label="Pilihan Tampilan Jadwal">
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === 'table'}
              className={`jadwal-view-tab ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
            >
              <Table size={16} /> Tabel Jadwal
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === 'timeline'}
              className={`jadwal-view-tab ${viewMode === 'timeline' ? 'active' : ''}`}
              onClick={() => setViewMode('timeline')}
            >
              <LayoutGrid size={16} /> Timeline Alur
            </button>
          </div>
        </div>

        {/* View 1: Table Representation */}
        {viewMode === 'table' && (
          <div className="jadwal-table-container">
            <div className="jadwal-table-scroll">
              <table className="jadwal-table" style={{ minWidth: '580px' }} aria-label="Tabel Jadwal Pelaksanaan FOKRI GAMES XII">
                <thead>
                  <tr>
                    <th scope="col" className="col-no">No.</th>
                    <th scope="col" className="col-kegiatan" style={{ minWidth: '280px' }}>Kegiatan</th>
                    <th scope="col" className="col-date" style={{ minWidth: '190px' }}>Hari/Tanggal</th>
                  </tr>
                </thead>
                <tbody>
                  {JADWAL_PELAKSANAAN.map((item) => (
                    <tr
                      key={item.no}
                      className={item.isMainEvent ? 'main-event-row' : ''}
                    >
                      <td className="no-cell">
                        <span className="no-badge">{item.no}</span>
                      </td>
                      <td>
                        <div className="jadwal-activity-title">
                          {item.kegiatan}
                        </div>
                        {item.isMainEvent && (
                          <div>
                            <span className="main-event-tag">
                              <Sparkles size={12} /> Hari H & Puncak Acara
                            </span>
                          </div>
                        )}
                      </td>
                      <td>
                        <div className="jadwal-date-box" style={item.isMainEvent ? { color: '#B45309' } : {}}>
                          <Calendar size={16} style={{ color: item.isMainEvent ? '#D97706' : 'var(--ppi-navy)', flexShrink: 0 }} />
                          <span>{item.tanggal}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* View 2: Timeline Cards Representation */}
        {viewMode === 'timeline' && (
          <div className="jadwal-timeline-grid">
            {JADWAL_PELAKSANAAN.map((item) => (
              <div
                key={item.no}
                className={`jadwal-timeline-card ${item.isMainEvent ? 'is-main' : ''}`}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                    <span className="no-badge" style={item.isMainEvent ? { background: 'var(--ppi-gold)', color: '#172404', fontWeight: 800 } : {}}>
                      {item.no}
                    </span>
                    {item.isMainEvent ? (
                      <span className="main-event-tag">
                        <Sparkles size={12} /> Hari H
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>Tahap 0{item.no}</span>
                    )}
                  </div>

                  <p className="jadwal-activity-title" style={{ fontSize: '1rem', marginBottom: '1rem' }}>
                    {item.kegiatan}
                  </p>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid #F1F5F9',
                  color: item.isMainEvent ? '#B45309' : 'var(--ppi-navy)',
                  fontWeight: 700,
                  fontSize: '0.92rem'
                }}>
                  <Calendar size={15} style={{ color: item.isMainEvent ? '#D97706' : 'var(--ppi-navy)', flexShrink: 0 }} />
                  <span>{item.tanggal}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Informative Note / Callout */}
        <div style={{
          backgroundColor: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderLeft: '4px solid var(--ppi-gold)',
          borderRadius: '8px',
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.75rem',
          fontSize: '0.88rem',
          color: '#475569',
          marginBottom: '3rem'
        }}>
          <Info size={18} style={{ color: 'var(--ppi-gold)', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong style={{ color: 'var(--deep-navy)', display: 'block', marginBottom: '0.2rem' }}>
              Catatan Penting Pelaksanaan:
            </strong>
            Seluruh peserta diharapkan memperhatikan tenggat waktu pendaftaran (7 November 2026) dan pengumpulan karya (9–17 November 2026). Puncak acara Grand Final dan pameran PTK EXPO diselenggarakan secara luring pada tanggal <strong>28 November 2026</strong>.
          </div>
        </div>
      </section>

      {/* Secondary Section: Synchronized Milestones Per Competition */}
      <section style={{ marginTop: '2rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--deep-navy)', marginBottom: '0.35rem' }}>
            Jadwal per Cabang Lomba
          </h2>
          <p style={{ color: '#64748B', fontSize: '0.92rem' }}>
            Jadwal pelaksanaan berlaku serentak untuk seluruh cabang kompetisi resmi FOKRI GAMES XII.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {competitions.map((comp) => {
            const compSchedules = getCompSchedules(comp);
            return (
              <div key={comp.id} className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.85rem' }}>
                  <Trophy style={{ color: 'var(--ppi-navy)' }} size={24} />
                  <div>
                    <h3 className="competition-title" style={{ fontSize: '1.15rem', color: 'var(--deep-navy)' }}>{comp.name}</h3>
                    <span style={{ fontSize: '0.82rem', color: '#64748B' }}>Penyelenggara: {comp.organizer}</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                  {compSchedules.map((sch, idx) => {
                    const isLast = idx === compSchedules.length - 1;
                    return (
                      <div key={idx} style={{
                        backgroundColor: isLast ? 'rgba(242, 182, 53, 0.1)' : 'var(--light-bg)',
                        padding: '1rem',
                        borderRadius: '8px',
                        borderLeft: isLast ? '4px solid var(--ppi-gold)' : '4px solid var(--ppi-navy)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: isLast ? '#B45309' : 'var(--ppi-navy)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                          <Calendar size={14} /> {sch.date}
                        </div>
                        <strong style={{ fontSize: '0.92rem', color: '#332C2B', display: 'block', lineHeight: 1.4 }}>{sch.label}</strong>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
