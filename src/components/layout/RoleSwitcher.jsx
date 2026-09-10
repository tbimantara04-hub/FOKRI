import React, { useState } from 'react';
import { ShieldCheck, UserCheck, Users, CheckCircle2, UserCog, Crown, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

export const RoleSwitcher = () => {
  const { currentRole, setCurrentRole, user } = useApp();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const roles = [
    { id: 'VISITOR', label: 'Pengunjung Publik', icon: ShieldCheck, targetTab: '/' },
    { id: 'PARTICIPANT', label: 'Peserta Individu', icon: UserCheck, targetTab: '/dashboard-participant' },
    { id: 'TEAM_LEADER', label: 'Ketua Tim', icon: Users, targetTab: '/dashboard-participant' },
    { id: 'VERIFIER', label: 'Verifikasi Panitia', icon: CheckCircle2, targetTab: '/dashboard-verifier' },
    { id: 'COMPETITION_ADMIN', label: 'Competition Admin', icon: UserCog, targetTab: '/dashboard-admin' },
    { id: 'SUPER_ADMIN', label: 'Super Admin', icon: Crown, targetTab: '/dashboard-admin' }
  ];

  const handleRoleChange = (role) => {
    setCurrentRole(role.id);
    navigate(role.targetTab);
    setIsOpen(false);
  };

  return (
    <div style={{ position: 'fixed', bottom: '20px', left: '20px', zIndex: 9999 }}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              bottom: '50px',
              left: '0',
              backgroundColor: 'white',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '16px',
              boxShadow: '0 10px 30px -10px rgba(0,0,0,0.3)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              width: 'max-content',
              maxHeight: '400px',
              overflowY: 'auto'
            }}
          >
            <div style={{ fontSize: '0.8rem', color: 'var(--ink-light)', marginBottom: '8px' }}>
              Simulasi Login: <strong style={{ color: 'var(--ppi-gold)' }}>{user.name}</strong>
            </div>
            {roles.map(r => {
              const Icon = r.icon;
              return (
                <button
                  key={r.id}
                  onClick={() => handleRoleChange(r)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 16px',
                    backgroundColor: currentRole === r.id ? 'var(--ppi-navy)' : 'transparent',
                    color: currentRole === r.id ? 'white' : 'var(--ink)',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    transition: 'all 0.2s ease',
                  }}
                  onMouseOver={(e) => {
                    if (currentRole !== r.id) {
                      e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (currentRole !== r.id) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <Icon size={16} />
                  {r.label}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          backgroundColor: 'var(--ppi-navy)',
          color: 'var(--ppi-gold)',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          transition: 'transform 0.2s ease'
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        aria-label="Toggle Role Simulation"
      >
        <Settings size={20} />
      </button>
    </div>
  );
};
