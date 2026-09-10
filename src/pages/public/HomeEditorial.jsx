import React, { useState } from 'react';
import { ArrowDownRight, ArrowRight, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Reveal, SectionLabel } from '../../components/motion/Reveal';
import { MagneticWrap, StaggerText, MouseParallax } from '../../components/motion/Interactive';
import { CustomCursor } from '../../components/motion/CustomCursor';
import { AnnouncementModal } from '../../components/common/AnnouncementModal';
import CountUp from 'react-countup';

export const HomeEditorial = () => {
  const { competitions, announcements } = useApp();
  const navigate = useNavigate();
  const featuredAnnouncement = announcements.find((announcement) => announcement.pinned) || announcements[0];

  return (
    <div className="editorial-home">
      <AnnouncementModal />
      <section className="hero-split">
        <div className="hero-left">
          <Reveal direction="none" delay={80}>
            <p className="eyebrow eyebrow-gold" style={{ color: 'var(--brand-orange)', marginBottom: '8px' }}>FOKRI GAMES XII</p>
          </Reveal>
          <Reveal delay={200}>
            <h1 className="flight-title" style={{ fontSize: 'clamp(3rem, 7vw, 4.8rem)', lineHeight: '1.1', letterSpacing: '-0.04em' }}>
              Iman, Ilmu, dan<br />
              Integritas<br />
              <span style={{ color: 'var(--ppi-gold)', fontStyle: 'italic', fontWeight: 500, display: 'inline-block', transform: 'translateY(-5px)' }}>untuk Indonesia.</span>
            </h1>
          </Reveal>

          <Reveal delay={400}>
            <div style={{ marginTop: 'clamp(2rem, 5vw, 4rem)', maxWidth: '540px' }}>
              <p style={{ 
                margin: 0, 
                textAlign: 'left',
                fontSize: 'clamp(1rem, 1.5vw, 1.1rem)', 
                lineHeight: '1.7', 
                color: 'var(--ink)'
              }}>
                <strong style={{ fontWeight: 800 }}>Forum Kerja Sama Rohani Islam Perguruan Tinggi Kedinasan (FOKRI PTK)</strong> merupakan sentra dakwah dari Organisasi Islam Perguruan Tinggi Kedinasan seluruh Indonesia.<br/>
                <span style={{ color: 'var(--ppi-gold)', fontStyle: 'italic', fontWeight: 500, display: 'inline-block', marginTop: '12px' }}>
                  FOKRI PTK dibentuk tanggal 5 Juli 1998 / 11 Rabiul Awal 1419 H. Mulai terbentuknya sampai saat ini, anggota FOKRI PTK berjumlah 30 (tiga puluh) Perguruan Tinggi Kedinasan.
                </span>
              </p>
            </div>
          </Reveal>

        </div>
        
        <div className="hero-right">
          <MouseParallax factor={20} reverse style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 0 }}>
            <img 
              className="hero-image" 
              src="/bg.png" 
              alt="Latar FOKRI" 
              style={{ width: '100%', height: '100%', left: '0', objectFit: 'cover', objectPosition: 'center', transform: 'scale(1.1)' }}
            />
          </MouseParallax>
        </div>
      </section>

      <section style={{
        backgroundImage: 'linear-gradient(rgba(34, 51, 0, 0.92), rgba(34, 51, 0, 0.98)), url(/latar-kompetisi.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        color: 'white',
        padding: 'clamp(80px, 10vw, 140px) clamp(24px, 8vw, 132px)',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 'clamp(3rem, 6vw, 6rem)',
        alignItems: 'flex-start'
      }}>
        <div style={{ flex: '1 1 350px' }}>
          <Reveal delay={100}>
            <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, color: 'var(--ppi-gold)', marginBottom: '1.5rem', letterSpacing: '-0.04em' }}>
              Visi
            </h2>
            <p style={{ 
              fontSize: 'clamp(1.2rem, 2vw, 1.6rem)', 
              lineHeight: '1.5', 
              fontWeight: 400, 
              color: 'white',
              fontStyle: 'italic'
            }}>
              "Menjadi wadah organisasi keislaman yang mandiri, kontributif, bersahabat, aspiratif demi kesejahteraan umat."
            </p>
          </Reveal>
        </div>

        <div style={{ flex: '1.8 1 500px' }}>
          <Reveal delay={200}>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: 'var(--ppi-gold)', marginBottom: '2rem', letterSpacing: '-0.03em' }}>
              Misi
            </h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {[
                "Menyelenggarakan kepengurusan Forum Kerja Sama Rohani Islam Perguruan Tinggi Kedinasan (FOKRI PTK) yang aktif dan mandiri;",
                "Turut berkontribusi dalam dunia dakwah kampus dengan melakukan pembinaan dan pengembangan terhadap Lembaga Dakwah Kampus (LDK) perguruan tinggi kedinasan;",
                "Meningkatkan ukhuwah Islamiah antar perguruan tinggi kedinasan;",
                "Memperluas jaringan kerja sama antar perguruan tinggi kedinasan dan elemen organisasi lainya; dan",
                "Memberikan dan menerima arah kebijakan atau pendapat kepada/dari LDK perguruan tinggi kedinasan dalam menyelenggarakan dakwah di perguruan tinggi kedinasan anggota FOKRI PTK."
              ].map((item, i) => (
                <li key={i} style={{ 
                  fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)', 
                  lineHeight: '1.65', 
                  color: 'rgba(255,255,255,0.85)', 
                  display: 'flex', 
                  gap: '20px',
                  alignItems: 'flex-start'
                }}>
                  <span style={{ 
                    color: 'var(--ppi-gold)', 
                    fontWeight: 700, 
                    fontSize: '1.2rem',
                    fontFamily: 'monospace',
                    paddingTop: '2px'
                  }}>
                    0{i+1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="documentation-section" style={{ padding: 'clamp(80px, 10vw, 120px) clamp(24px, 8vw, 132px)', background: 'var(--paper-deep)' }}>
        <Reveal><SectionLabel number="03">DOKUMENTASI</SectionLabel></Reveal>
        <div style={{ marginTop: '30px', marginBottom: '40px' }}>
          <StaggerText 
            text="Jejak Langkah Kebaikan." 
            className="section-title"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'var(--ppi-navy)' }} 
            delay={0.2}
          />
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          padding: '10px 0 40px'
        }}>
          {[1, 2, 3].map((num) => (
             <Reveal delay={num * 100} key={num}>
                <img 
                  src={`/gal${num}.jpg`} 
                  alt={`Dokumentasi FOKRI ${num}`}
                  style={{ 
                    width: '100%', 
                    height: 'clamp(250px, 30vw, 350px)', 
                    objectFit: 'cover', 
                    borderRadius: '16px',
                    boxShadow: '0 10px 30px -10px rgba(0,0,0,0.15)',
                    transition: 'transform 0.4s ease',
                    cursor: 'pointer'
                  }} 
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
             </Reveal>
          ))}
        </div>
      </section>

      <section className="showcase-section" style={{
        backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.95)), url(/bg-showcase.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        color: 'white'
      }}>
        <div className="showcase-heading">
          <Reveal><SectionLabel number="04" light>COMPETITIONS</SectionLabel></Reveal>
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
        <Reveal><SectionLabel number="05" light>BY THE NUMBERS</SectionLabel></Reveal>
        <div className="metrics-editorial-grid">
          <Reveal delay={80}><strong><CountUp end={8} duration={2.5} enableScrollSpy prefix="0" /></strong><span className="metric-label">Cabang kompetisi nasional</span></Reveal>
          <Reveal delay={140}><strong><CountUp end={100} duration={2.5} enableScrollSpy suffix="+" /></strong><span className="metric-label">Kuota tim dan individu</span></Reveal>
          <Reveal delay={200}><strong><CountUp end={1} duration={2.5} enableScrollSpy prefix="0" /></strong><span className="metric-label">Platform terintegrasi</span></Reveal>
          <Reveal delay={260}><strong><CountUp end={24} duration={2.5} enableScrollSpy suffix="/7" /></strong><span className="metric-label">Akses informasi resmi</span></Reveal>
        </div>
      </section>

      <section className="story-section">
        <div className="story-copy"><Reveal><SectionLabel number="06">WHY FOKRI</SectionLabel></Reveal><Reveal delay={100}><h2 className="section-title">Every entry<br /><em>leaves a trace.</em></h2></Reveal></div>
        <div className="story-points">
          {[['01', 'Satu nomor registrasi', 'Setiap pendaftaran memiliki identitas unik untuk pelacakan yang jelas.'], ['02', 'Verifikasi berjenjang', 'Status berkas dan keputusan panitia tersaji dengan alasan yang dapat dipahami.'], ['03', 'Hasil yang terjaga', 'Pengumuman, finalis, dan hasil resmi hadir dalam satu sumber informasi.']].map(([number, title, text], index) => (
            <Reveal key={number} delay={index * 100}><div className="story-point"><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div><CheckCircle size={19} /></div></Reveal>
          ))}
        </div>
      </section>

      <section className="announcement-feature">
        <Reveal><SectionLabel number="07">LATEST UPDATE</SectionLabel></Reveal>
        <Reveal delay={100} className="announcement-feature-inner">
          <div><span className="caption-kicker">{featuredAnnouncement?.category || 'OFFICIAL NOTICE'}</span><h2>{featuredAnnouncement?.title || 'Informasi terbaru FOKRI GAMES XII'}</h2></div>
          <MagneticWrap strength={30}>
            <button className="btn btn-primary btn-arrow" onClick={() => navigate('/announcements')}>Buka pengumuman <ArrowRight size={17} /></button>
          </MagneticWrap>
        </Reveal>
      </section>

      <section className="final-cta">
        <Reveal>
          <p className="eyebrow">FOKRI GAMES XII / 2026</p>
          <h2>Make your mark.</h2>
          <MagneticWrap strength={40}>
            <button className="btn btn-primary btn-arrow" onClick={() => navigate('/competitions')}>Mulai dari sini <ArrowRight size={17} /></button>
          </MagneticWrap>
        </Reveal>
      </section>
    </div>
  );
};

const ArrowUpRight = ({ size = 20 }) => <ArrowRight size={size} className="arrow-up-right" />;
