import React from 'react';
import { Trophy, Mail, Phone, MapPin, ExternalLink, ShieldCheck } from 'lucide-react';

export const Footer = ({ setActiveTab }) => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div>
          <div className="footer-brand" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Trophy style={{ color: '#F7B512' }} size={24} />
            <span>FOKRI GAMES <span style={{ color: '#F7B512' }}>XII</span></span>
          </div>
          <p style={{ fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1rem', color: '#94A3B8' }}>
            Platform Tunggal Manajemen Pendaftaran & Hasil Kompetisi Nasional FOKRI GAMES XII. Terintegrasi, transparan, dan terpercaya.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.85rem', color: '#CBD5E1' }}>
            <ShieldCheck size={16} style={{ color: '#F7B512' }} />
            <span>Sistem Resmi Panitia Pelaksana Kerohanian Islam XII</span>
          </div>
        </div>

        <div>
          <h4 style={{ color: '#FFF', fontSize: '1rem', marginBottom: '1rem' }}>Navigasi Cepat</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
            <li><a href="#competitions" onClick={() => setActiveTab('competitions')} style={{ color: '#CBD5E1' }}>Direktori Kompetisi</a></li>
            <li><a href="#schedule" onClick={() => setActiveTab('schedule')} style={{ color: '#CBD5E1' }}>Jadwal & Milestone</a></li>
            <li><a href="#announcements" onClick={() => setActiveTab('announcements')} style={{ color: '#CBD5E1' }}>Pengumuman Resmi</a></li>
            <li><a href="#results" onClick={() => setActiveTab('results')} style={{ color: '#CBD5E1' }}>Pengumuman Hasil Juara</a></li>
            <li><a href="#faq" onClick={() => setActiveTab('faq')} style={{ color: '#CBD5E1' }}>FAQ & Panduan Berkas</a></li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: '#FFF', fontSize: '1rem', marginBottom: '1rem' }}>Pusat Bantuan & Sekretariat</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem', color: '#CBD5E1' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail size={16} style={{ color: '#F7B512' }} />
              <span>sekretariat@fokrigames12.id</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Phone size={16} style={{ color: '#F7B512' }} />
              <span>+62 812-3456-7890 (Helpdesk WA)</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <MapPin size={16} style={{ color: '#F7B512', marginTop: '3px' }} />
              <span>Gedung Sekretariat FOKRI GAMES XII, Kompleks Kampus Pusat.</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div>
          © 2026 Organizing Committee FOKRI GAMES XII. Hak Cipta Dilindungi Undang-Undang.
        </div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <a href="#legal" onClick={() => setActiveTab('legal-privacy')} style={{ color: '#CBD5E1', fontSize: '0.85rem' }}>Kebijakan Privasi Data Peserta</a>
          <a href="#terms" onClick={() => setActiveTab('legal-terms')} style={{ color: '#CBD5E1', fontSize: '0.85rem' }}>Syarat & Ketentuan Kompetisi</a>
        </div>
      </div>
    </footer>
  );
};
