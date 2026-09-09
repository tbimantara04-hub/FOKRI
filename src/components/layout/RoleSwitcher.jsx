import React from 'react';
import { ShieldCheck, UserCheck, Users, CheckCircle2, UserCog, Crown } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const RoleSwitcher = ({ setActiveTab }) => {
  const { currentRole, setCurrentRole, user } = useApp();

  const roles = [
    { id: 'VISITOR', label: 'Pengunjung Publik', icon: ShieldCheck, targetTab: 'home' },
    { id: 'PARTICIPANT', label: 'Peserta Individu', icon: UserCheck, targetTab: 'dashboard-participant' },
    { id: 'TEAM_LEADER', label: 'Ketua Tim', icon: Users, targetTab: 'dashboard-participant' },
    { id: 'VERIFIER', label: 'Verifikasi Panitia', icon: CheckCircle2, targetTab: 'dashboard-verifier' },
    { id: 'COMPETITION_ADMIN', label: 'Competition Admin', icon: UserCog, targetTab: 'dashboard-admin' },
    { id: 'SUPER_ADMIN', label: 'Super Admin', icon: Crown, targetTab: 'dashboard-admin' }
  ];

  const handleRoleChange = (role) => {
    setCurrentRole(role.id);
    setActiveTab(role.targetTab);
  };

  return (
    <div className="role-switcher-bar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontWeight: 600, color: '#F7B512' }}>Simulasi Peran Pengguna (RBAC Matrix PRD):</span>
        <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>(Login sebagai: <strong>{user.name}</strong>)</span>
      </div>
      <div className="role-switcher-pills">
        {roles.map(r => {
          const Icon = r.icon;
          return (
            <button
              key={r.id}
              className={`role-pill ${currentRole === r.id ? 'active' : ''}`}
              onClick={() => handleRoleChange(r)}
            >
              <Icon size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
              {r.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
