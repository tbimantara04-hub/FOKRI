import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Megaphone, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AnnouncementModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Tampilkan hanya sekali per sesi menggunakan sessionStorage
    const hasSeenModal = sessionStorage.getItem('fokri_announcement_seen');
    if (!hasSeenModal) {
      // Kasih sedikit delay agar tidak terlalu agresif saat baru buka halaman
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('fokri_announcement_seen', 'true');
  };

  const handleAction = () => {
    handleClose();
    navigate('/schedule');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 100000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleClose}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.7)',
              backdropFilter: 'blur(4px)'
            }}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '480px',
              backgroundColor: 'white',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}
          >
            {/* Top decorative bar */}
            <div style={{ height: '6px', width: '100%', backgroundColor: 'var(--ppi-gold)' }} />
            
            {/* Close Button */}
            <button 
              onClick={handleClose}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(0,0,0,0.05)',
                border: 'none',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--ink-light)',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(0,0,0,0.1)';
                e.currentTarget.style.color = 'var(--ink)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(0,0,0,0.05)';
                e.currentTarget.style.color = 'var(--ink-light)';
              }}
            >
              <X size={18} />
            </button>

            <div style={{ padding: '40px 32px', textAlign: 'center' }}>
              <div style={{ 
                width: '64px', 
                height: '64px', 
                backgroundColor: 'rgba(247, 181, 18, 0.15)', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '0 auto 24px',
                color: 'var(--brand-orange)'
              }}>
                <Megaphone size={32} />
              </div>

              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--ppi-navy)', marginBottom: '16px', lineHeight: 1.3 }}>
                Deadline Pendaftaran<br/>Semakin Dekat!
              </h2>
              
              <p style={{ color: 'var(--ink-light)', lineHeight: 1.6, marginBottom: '24px', fontSize: '0.95rem' }}>
                Batas akhir pendaftaran peserta untuk seluruh cabang lomba FOKRI GAMES XII adalah <strong style={{ color: 'var(--ink)' }}>31 Oktober 2026</strong>. Pastikan delegasi institusi Anda telah menyelesaikan proses verifikasi berkas tepat waktu.
              </p>

              <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.04)', borderRadius: '12px', padding: '16px', marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                <Calendar size={20} style={{ color: 'var(--ppi-navy)' }} />
                <span style={{ fontWeight: 600, color: 'var(--ppi-navy)', fontSize: '0.95rem' }}>Fase Pendaftaran Gelombang 2</span>
              </div>

              <button 
                onClick={handleAction}
                style={{
                  width: '100%',
                  padding: '16px',
                  backgroundColor: 'var(--ppi-gold)',
                  color: 'var(--ppi-navy)',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(247, 181, 18, 0.3)',
                  transition: 'transform 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                Cek Jadwal Selengkapnya
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
