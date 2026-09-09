import React, { useState } from 'react';
import { Bell, AlertOctagon, Calendar, User, Search, Filter } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AnnouncementsPage = () => {
  const { announcements } = useApp();
  const [selectedCat, setSelectedCat] = useState('ALL');
  const [search, setSearch] = useState('');

  const filtered = announcements.filter(a => {
    const matchesCat = selectedCat === 'ALL' || a.category === selectedCat;
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase()) || 
                          a.content.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>Pengumuman & Berita Resmi</h1>
        <p style={{ color: '#64748B' }}>
          Informasi terkini, edaran teknis, dan pembaruan penting FOKRI GAMES XII.
        </p>
      </div>

      <div className="card" style={{ padding: '1rem 1.25rem', marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input 
            type="text"
            placeholder="Cari pengumuman..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '0.6rem 0.75rem 0.6rem 2.4rem',
              borderRadius: '6px',
              border: '1px solid #CBD5E1',
              fontSize: '0.9rem'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['ALL', 'Emergency', 'Technical Meeting', 'Registration', 'General'].map(cat => (
            <button
              key={cat}
              className={`btn btn-sm ${selectedCat === cat ? 'btn-dark' : 'btn-secondary'}`}
              onClick={() => setSelectedCat(cat)}
            >
              {cat === 'ALL' ? 'Semua Kategori' : cat}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {filtered.map(ann => (
          <div key={ann.id} className="card" style={{
            borderLeft: ann.category === 'Emergency' ? '4px solid #DC2626' : '4px solid var(--ppi-navy)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span className={`badge ${ann.category === 'Emergency' ? 'badge-rejected' : 'badge-submitted'}`}>
                {ann.category}
              </span>
              {ann.pinned && (
                <span className="badge badge-revision">PINNED / PENTING</span>
              )}
              <span style={{ fontSize: '0.8rem', color: '#64748B', marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Calendar size={14} /> {ann.publishedAt}
              </span>
            </div>

            <h3 style={{ fontSize: '1.25rem', color: 'var(--deep-navy)', marginBottom: '0.75rem' }}>
              {ann.title}
            </h3>

            <p style={{ fontSize: '0.95rem', color: '#332C2B', lineHeight: 1.6, marginBottom: '1rem', whiteSpace: 'pre-line' }}>
              {ann.content}
            </p>

            <div style={{ fontSize: '0.82rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.4rem', borderTop: '1px solid #F1F5F9', paddingTop: '0.75rem' }}>
              <User size={14} /> Diterbitkan oleh: <strong>{ann.author}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
