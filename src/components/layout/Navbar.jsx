import React from 'react';
import { Shield, Trophy, FileText, Bell, User, LayoutDashboard, Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Navbar = ({ activeTab, setActiveTab }) => {
  const { currentRole, registrations } = useApp();

  // Action required count for participant
  const actionRequiredCount = registrations.filter(r => r.status === 'REVISION_REQUIRED').length;

  return (
    <header className="navbar">
      <div className="navbar-content">
        <div 
          className="navbar-brand" 
          onClick={() => setActiveTab('home')}
          style={{ cursor: 'pointer' }}
        >
          <Trophy className="gold-accent" size={28} />
          <div>
            FOKRI GAMES <span className="gold-accent">XII</span>
          </div>
        </div>

        <nav className="navbar-links">
          <button 
            className={`navbar-link ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Beranda
          </button>
          
          <button 
            className={`navbar-link ${activeTab === 'competitions' ? 'active' : ''}`}
            onClick={() => setActiveTab('competitions')}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Kompetisi
          </button>

          <button 
            className={`navbar-link ${activeTab === 'schedule' ? 'active' : ''}`}
            onClick={() => setActiveTab('schedule')}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Jadwal
          </button>

          <button 
            className={`navbar-link ${activeTab === 'announcements' ? 'active' : ''}`}
            onClick={() => setActiveTab('announcements')}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Pengumuman
          </button>

          <button 
            className={`navbar-link ${activeTab === 'results' ? 'active' : ''}`}
            onClick={() => setActiveTab('results')}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Hasil Kejuaraan
          </button>

          <button 
            className={`navbar-link ${activeTab === 'faq' ? 'active' : ''}`}
            onClick={() => setActiveTab('faq')}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            FAQ & Kontak
          </button>

          {/* Authenticated Dashboard Links */}
          {currentRole !== 'VISITOR' && (
            <button 
              className="btn btn-primary btn-sm"
              onClick={() => {
                if (currentRole === 'PARTICIPANT' || currentRole === 'TEAM_LEADER') setActiveTab('dashboard-participant');
                else if (currentRole === 'VERIFIER') setActiveTab('dashboard-verifier');
                else setActiveTab('dashboard-admin');
              }}
              style={{ position: 'relative' }}
            >
              <LayoutDashboard size={16} />
              {currentRole === 'PARTICIPANT' || currentRole === 'TEAM_LEADER' ? 'Dashboard Saya' :
               currentRole === 'VERIFIER' ? 'Antrean Verifikasi' : 'Admin Panel'}
              
              {currentRole === 'PARTICIPANT' && actionRequiredCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-5px',
                  backgroundColor: '#DC2626',
                  color: '#FFF',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {actionRequiredCount}
                </span>
              )}
            </button>
          )}

          {currentRole === 'VISITOR' && (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-secondary btn-sm" style={{ color: '#FFF', borderColor: '#FFF' }}>
                Masuk
              </button>
              <button className="btn btn-primary btn-sm">
                Daftar Akun
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};
