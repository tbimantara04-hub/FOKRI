import React, { useState } from 'react';
import { ArrowDownRight, ArrowRight, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Reveal, SectionLabel } from '../../components/motion/Reveal';

export const HomeEditorial = () => {
  const { competitions, announcements } = useApp();
  const navigate = useNavigate();
  const featuredAnnouncement = announcements.find((announcement) => announcement.pinned) || announcements[0];

  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('');

  const handleSearch = () => {
    // In a real app we could pass these as query params
    if (selectedBranch) {
      navigate(`/competitions/${selectedBranch}`);
    } else {
      navigate('/competitions');
    }
  };

  return (
    <div className="editorial-home">
      <section className="hero-split">
        <div className="hero-left">
          <Reveal direction="none" delay={80}>
            <p className="eyebrow eyebrow-gold" style={{ color: 'var(--brand-orange)', marginBottom: '8px' }}>FOKRI GAMES XII</p>
          </Reveal>
          <Reveal delay={200}>
            <h1 className="flight-title">
              Terbang Meraih<br />
              Prestasi.
            </h1>
          </Reveal>

          <Reveal delay={400}>
            <div className="booking-form">
              <h3 style={{ fontSize: '1rem', marginBottom: '16px', color: 'var(--ink)' }}>Cari Jadwal Perlombaan</h3>
              <div className="booking-row">
                <div className="input-group">
                  <label>Cabang Lomba</label>
                  <select value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)}>
                    <option value="">Semua Cabang</option>
                    {competitions.map(c => (
                      <option key={c.id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="input-group">
                  <label>Format</label>
                  <select value={selectedFormat} onChange={(e) => setSelectedFormat(e.target.value)}>
                    <option value="">Individu / Tim</option>
                    <option value="individual">Individu</option>
                    <option value="team">Tim Beregu</option>
                  </select>
                </div>
              </div>
              <div className="booking-row">
                <div className="input-group">
                  <label>Status</label>
                  <select>
                    <option>Pendaftaran Terbuka</option>
                  </select>
                </div>
                <button className="btn-search" onClick={handleSearch} aria-label="Search">
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </Reveal>

          <Reveal delay={600}>
            <div className="popular-destinations">
              <h3 className="destinations-title">Kategori Lomba Populer</h3>
              <div className="destinations-grid">
                <div className="destination-card" onClick={() => navigate('/competitions/mtq')}>
                  <img src="https://images.unsplash.com/photo-1519817914152-2a640c0471b7?q=80&w=600&auto=format&fit=crop" alt="MTQ" />
                  <div className="destination-info">
                    <h4>MTQ</h4>
                    <p>Seni Baca Al-Quran</p>
                  </div>
                </div>
                <div className="destination-card" onClick={() => navigate('/competitions/lkti')}>
                  <img src="https://images.unsplash.com/photo-1455390582262-044cdead2708?q=80&w=600&auto=format&fit=crop" alt="Karya Tulis Ilmiah" />
                  <div className="destination-info">
                    <h4>LKTI</h4>
                    <p>Karya Tulis Ilmiah</p>
                  </div>
                </div>
                <div className="destination-card" onClick={() => navigate('/competitions/mfq')}>
                  <img src="https://images.unsplash.com/photo-1609599006353-e629aaab315d?q=80&w=600&auto=format&fit=crop" alt="Fahmil Quran" />
                  <div className="destination-info">
                    <h4>MFQ</h4>
                    <p>Fahmil Quran</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
        
        <div className="hero-right">
          <img 
            className="hero-image" 
            src="/pesawat-realistis.jpg" 
            alt="Pesawat PPI Curug" 
          />
        </div>
      </section>

      <section className="intro-band" style={{
        backgroundImage: 'linear-gradient(rgba(34, 51, 0, 0.85), rgba(34, 51, 0, 0.95)), url(/latar-kompetisi.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        color: 'white'
      }}>
        <Reveal><SectionLabel number="01" light>THE PLATFORM</SectionLabel></Reveal>
        <Reveal delay={100} className="intro-statement-wrap">
          <h2 className="display-statement" style={{ color: 'white' }}>Built for the moment<br /><em style={{ color: 'var(--ppi-gold)' }}>you step forward.</em></h2>
        </Reveal>
        <Reveal delay={180} className="intro-support" style={{ borderTop: '1px solid rgba(255,255,255,0.2)' }}>
          <p style={{ color: 'rgba(255,255,255,0.85)' }}>FOKRI GAMES XII mempertemukan talenta, gagasan, dan institusi dalam pengalaman kompetisi yang transparan dari awal hingga hasil akhir.</p>
          <button className="text-link text-link-light" onClick={() => navigate('/faq')}>Kenali platform <ArrowRight size={16} /></button>
        </Reveal>
      </section>

      <section className="showcase-section" style={{
        backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.95)), url(/bg-showcase.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        color: 'white'
      }}>
        <div className="showcase-heading">
          <Reveal><SectionLabel number="02" light>COMPETITIONS</SectionLabel></Reveal>
          <Reveal delay={100}><h2 className="section-title" style={{ color: 'white' }}>Choose your<br /><em style={{ color: 'var(--ppi-gold)' }}>field of play.</em></h2></Reveal>
          <Reveal delay={180}><p className="section-note" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Cabang kompetisi terkurasi untuk peserta individu maupun tim. Temukan arena yang paling sesuai dengan kemampuanmu.</p></Reveal>
          <button className="text-link text-link-light" onClick={() => navigate('/competitions')}>Lihat semua cabang <ArrowRight size={16} /></button>
        </div>
        <div className="competition-showcase-list">
          {competitions.slice(0, 3).map((comp, index) => (
            <Reveal key={comp.id} delay={index * 110} className="showcase-item-wrap">
              <button className="showcase-item" onClick={() => navigate(`/competitions/${comp.slug}`)}>
                <div className="showcase-image" style={{ backgroundImage: `url(${comp.coverImage})` }}>
                  <div className="showcase-overlay" />
                  <span className="showcase-index">0{index + 1}</span>
                  <StatusBadge status={comp.status} />
                </div>
                <div className="showcase-caption" style={{ borderBottomColor: 'rgba(255,255,255,0.2)' }}>
                  <div><span className="caption-kicker" style={{ color: 'var(--ppi-gold)' }}>{comp.mode === 'team' ? 'TEAM FORMAT' : 'INDIVIDUAL / TEAM'}</span><h3 style={{ color: 'white' }}>{comp.name}</h3></div>
                  <ArrowUpRight size={22} style={{ color: 'white' }} />
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="metrics-section">
        <Reveal><SectionLabel number="03" light>BY THE NUMBERS</SectionLabel></Reveal>
        <div className="metrics-editorial-grid">
          <Reveal delay={80}><strong>03</strong><span>Cabang kompetisi nasional</span></Reveal>
          <Reveal delay={140}><strong>100+</strong><span>Kuota tim dan individu</span></Reveal>
          <Reveal delay={200}><strong>01</strong><span>Platform terintegrasi</span></Reveal>
          <Reveal delay={260}><strong>24/7</strong><span>Akses informasi resmi</span></Reveal>
        </div>
      </section>

      <section className="story-section">
        <div className="story-copy"><Reveal><SectionLabel number="04">WHY FOKRI</SectionLabel></Reveal><Reveal delay={100}><h2 className="section-title">Every entry<br /><em>leaves a trace.</em></h2></Reveal></div>
        <div className="story-points">
          {[['01', 'Satu nomor registrasi', 'Setiap pendaftaran memiliki identitas unik untuk pelacakan yang jelas.'], ['02', 'Verifikasi berjenjang', 'Status berkas dan keputusan panitia tersaji dengan alasan yang dapat dipahami.'], ['03', 'Hasil yang terjaga', 'Pengumuman, finalis, dan hasil resmi hadir dalam satu sumber informasi.']].map(([number, title, text], index) => (
            <Reveal key={number} delay={index * 100}><div className="story-point"><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div><CheckCircle size={19} /></div></Reveal>
          ))}
        </div>
      </section>

      <section className="announcement-feature">
        <Reveal><SectionLabel number="05">LATEST UPDATE</SectionLabel></Reveal>
        <Reveal delay={100} className="announcement-feature-inner">
          <div><span className="caption-kicker">{featuredAnnouncement?.category || 'OFFICIAL NOTICE'}</span><h2>{featuredAnnouncement?.title || 'Informasi terbaru FOKRI GAMES XII'}</h2></div>
          <button className="btn btn-primary btn-arrow" onClick={() => navigate('/announcements')}>Buka pengumuman <ArrowRight size={17} /></button>
        </Reveal>
      </section>

      <section className="final-cta">
        <Reveal><p className="eyebrow">FOKRI GAMES XII / 2026</p><h2>Make your mark.</h2><button className="btn btn-primary btn-arrow" onClick={() => navigate('/competitions')}>Mulai dari sini <ArrowRight size={17} /></button></Reveal>
      </section>
    </div>
  );
};

const ArrowUpRight = ({ size = 20 }) => <ArrowRight size={size} className="arrow-up-right" />;
