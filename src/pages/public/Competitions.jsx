import React, { useState } from 'react';
import { Search, Filter, ArrowRight, Users, User, Calendar, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';

export const Competitions = ({ setActiveTab, setSelectedCompSlug }) => {
  const { competitions } = useApp();
  const [search, setSearch] = useState('');
  const [modeFilter, setModeFilter] = useState('ALL');

  const filteredCompetitions = competitions.filter(comp => {
    const matchesSearch = comp.name.toLowerCase().includes(search.toLowerCase()) || 
                          comp.shortDescription.toLowerCase().includes(search.toLowerCase());
    const matchesMode = modeFilter === 'ALL' || comp.mode === modeFilter || comp.mode === 'either';
    return matchesSearch && matchesMode;
  });

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>Direktori Kompetisi FOKRI GAMES XII</h1>
        <p style={{ color: '#64748B' }}>
          Temukan dan daftarkan diri atau tim Anda pada cabang kompetisi yang sesuai.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '1rem 1.25rem', marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input 
            type="text"
            placeholder="Cari cabang kompetisi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '0.6rem 0.75rem 0.6rem 2.4rem',
              borderRadius: '6px',
              border: '1px solid #CBD5E1',
              fontSize: '0.9rem',
              fontFamily: 'inherit'
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={16} style={{ color: '#64748B' }} />
          <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>Format:</span>
          
          <button 
            className={`btn btn-sm ${modeFilter === 'ALL' ? 'btn-dark' : 'btn-secondary'}`}
            onClick={() => setModeFilter('ALL')}
          >
            Semua
          </button>
          
          <button 
            className={`btn btn-sm ${modeFilter === 'team' ? 'btn-dark' : 'btn-secondary'}`}
            onClick={() => setModeFilter('team')}
          >
            Tim
          </button>
          
          <button 
            className={`btn btn-sm ${modeFilter === 'individual' ? 'btn-dark' : 'btn-secondary'}`}
            onClick={() => setModeFilter('individual')}
          >
            Individu
          </button>
        </div>
      </div>

      {/* Competitions Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {filteredCompetitions.map(comp => (
          <div key={comp.id} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{
              height: '170px',
              borderRadius: '8px',
              backgroundImage: `url(${comp.coverImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              marginBottom: '1rem',
              position: 'relative'
            }}>
              <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                <StatusBadge status={comp.status} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span className="badge badge-draft" style={{ fontSize: '0.75rem' }}>
                {comp.mode === 'team' ? 'Format Tim' : comp.mode === 'individual' ? 'Format Individu' : 'Individu / Tim'}
              </span>
              <span className="badge badge-draft" style={{ fontSize: '0.75rem' }}>
                Organisator: {comp.organizer.substring(0, 24)}...
              </span>
            </div>

            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--deep-navy)' }}>
              {comp.name}
            </h3>

            <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '1.25rem', flex: 1, lineHeight: 1.5 }}>
              {comp.shortDescription}
            </p>

            {/* Quota bar */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.35rem', fontWeight: 600 }}>
                <span>Kuota Terisi</span>
                <span>{comp.currentRegistrations} / {comp.quota} Slot</span>
              </div>
              <div style={{ height: '6px', backgroundColor: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${(comp.currentRegistrations / comp.quota) * 100}%`,
                  backgroundColor: (comp.currentRegistrations / comp.quota) > 0.8 ? '#D97706' : 'var(--ppi-navy)',
                  transition: 'width 0.3s ease'
                }}></div>
              </div>
            </div>

            <button 
              className="btn btn-primary"
              onClick={() => {
                setSelectedCompSlug(comp.slug);
                setActiveTab('competition-detail');
              }}
              style={{ width: '100%' }}
            >
              Lihat Detail & Daftar <ArrowRight size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
