import React from 'react';
import { ArrowDownRight, ArrowRight, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Reveal, SectionLabel } from '../../components/motion/Reveal';

export const HomeEditorial = ({ setActiveTab, setSelectedCompSlug }) => {
  const { competitions, announcements } = useApp();
  const featuredAnnouncement = announcements.find((announcement) => announcement.pinned) || announcements[0];

  return (
    <div className="editorial-home">
      <section className="home-hero">
        <div className="hero-grid-lines" aria-hidden="true" />
        <div className="hero-copy">
          <Reveal direction="none" delay={80}>
            <p className="eyebrow eyebrow-gold">FOKRI GAMES XII / OFFICIAL PLATFORM</p>
          </Reveal>
          <h1 className="hero-title">
            <span className="hero-line">The arena</span>
            <span className="hero-line hero-line-accent">for ideas.</span>
            <span className="hero-line">for impact.</span>
          </h1>
          <Reveal delay={500}>
            <p className="hero-description">Satu pintu informasi, pendaftaran, verifikasi, dan hasil kejuaraan nasional yang terstruktur dan dapat ditelusuri.</p>
          </Reveal>
          <Reveal delay={650}>
            <div className="hero-actions">
              <button className="btn btn-primary btn-arrow" onClick={() => setActiveTab('competitions')}>Jelajahi kompetisi <ArrowRight size={17} /></button>
              <button className="text-link text-link-light" onClick={() => setActiveTab('schedule')}>Lihat rangkaian acara <ArrowDownRight size={17} /></button>
            </div>
          </Reveal>
        </div>
        <div className="hero-aside">
          <div className="hero-mark">XII</div>
          <div className="hero-meta"><span>01</span><span>National competition platform</span></div>
        </div>
      </section>

      <section className="intro-band">
        <Reveal><SectionLabel number="01">THE PLATFORM</SectionLabel></Reveal>
        <Reveal delay={100} className="intro-statement-wrap">
          <h2 className="display-statement">Built for the moment<br /><em>you step forward.</em></h2>
        </Reveal>
        <Reveal delay={180} className="intro-support">
          <p>FOKRI GAMES XII mempertemukan talenta, gagasan, dan institusi dalam pengalaman kompetisi yang transparan dari awal hingga hasil akhir.</p>
          <button className="text-link" onClick={() => setActiveTab('faq')}>Kenali platform <ArrowRight size={16} /></button>
        </Reveal>
      </section>

      <section className="showcase-section">
        <div className="showcase-heading">
          <Reveal><SectionLabel number="02">COMPETITIONS</SectionLabel></Reveal>
          <Reveal delay={100}><h2 className="section-title">Choose your<br /><em>field of play.</em></h2></Reveal>
          <Reveal delay={180}><p className="section-note">Cabang kompetisi terkurasi untuk peserta individu maupun tim. Temukan arena yang paling sesuai dengan kemampuanmu.</p></Reveal>
          <button className="text-link" onClick={() => setActiveTab('competitions')}>Lihat semua cabang <ArrowRight size={16} /></button>
        </div>
        <div className="competition-showcase-list">
          {competitions.slice(0, 3).map((comp, index) => (
            <Reveal key={comp.id} delay={index * 110} className="showcase-item-wrap">
              <button className="showcase-item" onClick={() => { setSelectedCompSlug(comp.slug); setActiveTab('competition-detail'); }}>
                <div className="showcase-image" style={{ backgroundImage: `url(${comp.coverImage})` }}>
                  <div className="showcase-overlay" />
                  <span className="showcase-index">0{index + 1}</span>
                  <StatusBadge status={comp.status} />
                </div>
                <div className="showcase-caption">
                  <div><span className="caption-kicker">{comp.mode === 'team' ? 'TEAM FORMAT' : 'INDIVIDUAL / TEAM'}</span><h3>{comp.name}</h3></div>
                  <ArrowUpRight size={22} />
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
          <button className="btn btn-primary btn-arrow" onClick={() => setActiveTab('announcements')}>Buka pengumuman <ArrowRight size={17} /></button>
        </Reveal>
      </section>

      <section className="final-cta">
        <Reveal><p className="eyebrow">FOKRI GAMES XII / 2026</p><h2>Make your mark.</h2><button className="btn btn-primary btn-arrow" onClick={() => setActiveTab('competitions')}>Mulai dari sini <ArrowRight size={17} /></button></Reveal>
      </section>
    </div>
  );
};

const ArrowUpRight = ({ size = 20 }) => <ArrowRight size={size} className="arrow-up-right" />;
