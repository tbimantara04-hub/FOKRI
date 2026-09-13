export const ROLES = Object.freeze({
  VISITOR: 'VISITOR',
  PARTICIPANT: 'PARTICIPANT',
  TEAM_LEADER: 'TEAM_LEADER',
  VERIFIER: 'VERIFIER',
  COMPETITION_ADMIN: 'COMPETITION_ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN'
});

export const normalizeRole = (role) => {
  const value = String(role || '').trim().toUpperCase();
  if (value === 'ADMIN') return ROLES.COMPETITION_ADMIN;
  if (value === 'SUPERADMIN' || value === 'SUPER_ADMIN') return ROLES.SUPER_ADMIN;
  if (value === 'PARTICIPANT' || value === 'TEAM_LEADER') return ROLES.PARTICIPANT;
  return value || ROLES.VISITOR;
};

export const ADMIN_ROLES = [ROLES.VERIFIER, ROLES.COMPETITION_ADMIN, ROLES.SUPER_ADMIN];
export const PARTICIPANT_ROLES = [ROLES.PARTICIPANT, ROLES.TEAM_LEADER];

export const PERMISSIONS = Object.freeze({
  VIEW_OWN_DATA: [ROLES.PARTICIPANT, ROLES.TEAM_LEADER, ROLES.VERIFIER, ROLES.COMPETITION_ADMIN, ROLES.SUPER_ADMIN],
  MANAGE_REGISTRATIONS: [ROLES.VERIFIER, ROLES.COMPETITION_ADMIN, ROLES.SUPER_ADMIN],
  MANAGE_COMPETITIONS: [ROLES.COMPETITION_ADMIN, ROLES.SUPER_ADMIN],
  PUBLISH_RESULTS: [ROLES.COMPETITION_ADMIN, ROLES.SUPER_ADMIN],
  APPROVE_PUBLISHED_RESULT_CHANGE: [ROLES.SUPER_ADMIN],
  VIEW_AUDIT_LOGS: [ROLES.VERIFIER, ROLES.COMPETITION_ADMIN, ROLES.SUPER_ADMIN]
});

export const DEMO_ACCOUNTS = [
  {
    id: 'usr-participant-1',
    name: 'Ahmad Fauzi',
    email: 'fauzi@ui.ac.id',
    phone: '081298765432',
    institution: 'Universitas Indonesia',
    role: ROLES.PARTICIPANT,
    password: 'participant123'
  },
  {
    id: 'usr-admin-1',
    name: 'Administrator FOKRI',
    email: 'admin@fokri.games',
    institution: 'Panitia FOKRI GAMES XII',
    role: ROLES.COMPETITION_ADMIN,
    password: 'admin123'
  },
  {
    id: 'usr-super-admin-1',
    name: 'Super Admin FOKRI',
    email: 'superadmin@fokri.games',
    institution: 'Panitia FOKRI GAMES XII',
    role: ROLES.SUPER_ADMIN,
    password: 'superadmin123'
  }
];

export const getDashboardPath = (role) => {
  if (PARTICIPANT_ROLES.includes(role)) return '/dashboard';
  if (role === ROLES.VERIFIER) return '/admin/dashboard';
  if (ADMIN_ROLES.includes(role)) return '/admin/dashboard';
  return '/auth';
};

export const isAdminRole = (role) => ADMIN_ROLES.includes(role);
export const isParticipantRole = (role) => PARTICIPANT_ROLES.includes(role);
export const hasPermission = (role, permission) => PERMISSIONS[permission]?.includes(role) || false;

export const canAccess = (role, area) => {
  if (area === 'participant') return isParticipantRole(role);
  if (area === 'admin') return isAdminRole(role);
  return true;
};