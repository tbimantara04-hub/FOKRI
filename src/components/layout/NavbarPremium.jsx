import React, { useEffect, useState } from 'react';
import { ArrowRight, LayoutDashboard, LogIn, LogOut, Menu, Trophy, UserRound, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export const NavbarPremium = () => {
  const { currentRole, registrations, user, isAuthenticated, logout } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const actionRequiredCount = registrations.filter((registration) => registration.status === 'REVISION_REQUIRED').length;

  const goTo = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  const dashboardTab = currentRole === 'PARTICIPANT' || currentRole === 'TEAM_LEADER' ? '/dashboard' : '/admin/dashboard';
  const isParticipant = currentRole === 'PARTICIPANT' || currentRole === 'TEAM_LEADER';
  const isAdmin = !isParticipant && currentRole !== 'VISITOR';

  useEffect(() => {
    document.body.classList.toggle('menu-is-open', menuOpen);
    return () => document.body.classList.remove('menu-is-open');
  }, [menuOpen]);

  return (
    <header className={`navbar-premium ${menuOpen ? 'is-open' : ''}`}>
      <div className="navbar-content">
        <button className="navbar-brand" onClick={() => goTo('/')} aria-label="Kembali ke beranda" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/fokri.png" alt="Logo FOKRI" style={{ height: '32px', width: 'auto' }} />
          <span>FOKRI <b>GAMES XII</b></span>
        </button>
        <nav className="navbar-links" aria-label="Navigasi utama">
          {[['/', 'Beranda'], ['/competitions', 'Kompetisi'], ['/schedule', 'Jadwal'], ['/announcements', 'Pengumuman'], ['/results', 'Hasil']].map(([path, label]) => <button key={path} className={`navbar-link ${location.pathname === path ? 'active' : ''}`} onClick={() => goTo(path)}>{label}</button>)}
        </nav>
        <div className="navbar-actions">
          {!isAuthenticated ? (
            <div className="nav-auth-actions">
              <button className="nav-cta" onClick={() => goTo('/auth?mode=signup')}>Sign Up <ArrowRight size={15} /></button>
              <button className="nav-login" onClick={() => goTo('/auth?mode=login')}><LogIn size={15} /> Login</button>
            </div>
          ) : isParticipant ? (
            <div className="nav-auth-actions">
              <button className="nav-dashboard" onClick={() => goTo('/dashboard')}><LayoutDashboard size={16} /> Dashboard {actionRequiredCount > 0 && <span className="nav-count">{actionRequiredCount}</span>}</button>
              <button className="nav-profile" onClick={() => goTo('/dashboard')} aria-label={`Profil ${user?.name}`}><UserRound size={16} /> Profile</button>
              <button className="nav-logout" onClick={() => { logout(); goTo('/'); }} aria-label="Logout"><LogOut size={16} /></button>
            </div>
          ) : (
            <div className="nav-auth-actions">
              <button className="nav-dashboard" onClick={() => goTo('/admin/dashboard')}><LayoutDashboard size={16} /> Admin Dashboard</button>
              <button className="nav-logout" onClick={() => { logout(); goTo('/'); }} aria-label="Logout"><LogOut size={16} /></button>
            </div>
          )}
          <button className="menu-toggle" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}>{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
        </div>
      </div>
      <div className="mobile-menu" aria-hidden={!menuOpen}>
        <div className="mobile-menu-inner">
          <span className="eyebrow eyebrow-gold">NAVIGATION / FOKRI XII</span>
          {[['/', 'Beranda'], ['/competitions', 'Kompetisi'], ['/schedule', 'Jadwal'], ['/announcements', 'Pengumuman'], ['/results', 'Hasil Kejuaraan'], ['/faq', 'FAQ & Kontak']].map(([path, label], index) => <button key={path} className="mobile-menu-link" style={{ '--menu-delay': `${index * 60}ms` }} onClick={() => goTo(path)}><span>0{index + 1}</span>{label}<ArrowRight size={19} /></button>)}
          {!isAuthenticated ? (
            <>
              <button className="mobile-menu-link mobile-dashboard-link" onClick={() => goTo('/auth?mode=signup')}><span>+</span>Sign Up<ArrowRight size={18} /></button>
              <button className="mobile-menu-link mobile-dashboard-link" onClick={() => goTo('/auth?mode=login')}><span>+</span>Login<LogIn size={18} /></button>
            </>
          ) : isParticipant ? (
            <>
              <button className="mobile-menu-link mobile-dashboard-link" onClick={() => goTo('/dashboard')}><span>+</span>Dashboard<LayoutDashboard size={18} /></button>
              <button className="mobile-menu-link mobile-dashboard-link" onClick={() => { logout(); goTo('/'); }}><span>+</span>Logout<LogOut size={18} /></button>
            </>
          ) : (
            <>
              <button className="mobile-menu-link mobile-dashboard-link" onClick={() => goTo('/admin/dashboard')}><span>+</span>Admin Dashboard<LayoutDashboard size={18} /></button>
              <button className="mobile-menu-link mobile-dashboard-link" onClick={() => { logout(); goTo('/'); }}><span>+</span>Logout<LogOut size={18} /></button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
