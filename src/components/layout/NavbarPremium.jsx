import React, { useEffect, useState } from 'react';
import { ArrowRight, LayoutDashboard, Menu, Trophy, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NavbarPremium = ({ activeTab, setActiveTab }) => {
  const { currentRole, registrations } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const actionRequiredCount = registrations.filter((registration) => registration.status === 'REVISION_REQUIRED').length;
  const goTo = (tab) => { setActiveTab(tab); setMenuOpen(false); };
  const dashboardTab = currentRole === 'PARTICIPANT' || currentRole === 'TEAM_LEADER' ? 'dashboard-participant' : currentRole === 'VERIFIER' ? 'dashboard-verifier' : 'dashboard-admin';

  useEffect(() => {
    document.body.classList.toggle('menu-is-open', menuOpen);
    return () => document.body.classList.remove('menu-is-open');
  }, [menuOpen]);

  return (
    <header className={`navbar-premium ${menuOpen ? 'is-open' : ''}`}>
      <div className="navbar-content">
        <button className="navbar-brand" onClick={() => goTo('home')} aria-label="Kembali ke beranda">
          <Trophy className="gold-accent" size={24} /><span>FOKRI <b>GAMES XII</b></span>
        </button>
        <nav className="navbar-links" aria-label="Navigasi utama">
          {[['home', 'Beranda'], ['competitions', 'Kompetisi'], ['schedule', 'Jadwal'], ['announcements', 'Pengumuman'], ['results', 'Hasil']].map(([tab, label]) => <button key={tab} className={`navbar-link ${activeTab === tab ? 'active' : ''}`} onClick={() => goTo(tab)}>{label}</button>)}
        </nav>
        <div className="navbar-actions">
          {currentRole === 'VISITOR' ? <button className="nav-cta" onClick={() => goTo('competitions')}>Mulai eksplorasi <ArrowRight size={15} /></button> : <button className="nav-dashboard" onClick={() => goTo(dashboardTab)}><LayoutDashboard size={16} /> Dashboard {actionRequiredCount > 0 && <span className="nav-count">{actionRequiredCount}</span>}</button>}
          <button className="menu-toggle" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}>{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
        </div>
      </div>
      <div className="mobile-menu" aria-hidden={!menuOpen}>
        <div className="mobile-menu-inner">
          <span className="eyebrow eyebrow-gold">NAVIGATION / FOKRI XII</span>
          {[['home', 'Beranda'], ['competitions', 'Kompetisi'], ['schedule', 'Jadwal'], ['announcements', 'Pengumuman'], ['results', 'Hasil Kejuaraan'], ['faq', 'FAQ & Kontak']].map(([tab, label], index) => <button key={tab} className="mobile-menu-link" style={{ '--menu-delay': `${index * 60}ms` }} onClick={() => goTo(tab)}><span>0{index + 1}</span>{label}<ArrowRight size={19} /></button>)}
          {currentRole !== 'VISITOR' && <button className="mobile-menu-link mobile-dashboard-link" onClick={() => goTo(dashboardTab)}><span>+</span>Buka dashboard<LayoutDashboard size={18} /></button>}
        </div>
      </div>
    </header>
  );
};
