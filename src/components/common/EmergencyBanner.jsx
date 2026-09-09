import React from 'react';
import { AlertOctagon, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const EmergencyBanner = ({ setActiveTab }) => {
  const { announcements } = useApp();

  const emergencyAnn = announcements.find(a => a.category === 'Emergency' && a.pinned);

  if (!emergencyAnn) return null;

  return (
    <div className="emergency-banner">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
        <AlertOctagon size={22} style={{ color: '#F7B512', flexShrink: 0 }} />
        <div style={{ flex: 1, fontSize: '0.9rem' }}>
          <strong>PENGUMUMAN DARURAT:</strong> {emergencyAnn.title}
        </div>
        <button 
          className="btn btn-sm"
          onClick={() => setActiveTab('announcements')}
          style={{
            backgroundColor: '#F7B512',
            color: '#332C2B',
            border: 'none',
            fontSize: '0.8rem',
            fontWeight: 700,
            whiteSpace: 'nowrap'
          }}
        >
          Baca Pengumuman <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};
