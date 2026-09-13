export const ROLE_DEFINITIONS = Object.freeze({
  participant: 'participant',
  committee: 'committee',
  admin: 'admin',
  super_admin: 'super_admin'
});

export const ADMIN_ROLES = new Set(['committee', 'admin', 'super_admin']);
export const PARTICIPANT_ROLES = new Set(['participant']);

export const normalizeRole = (role) => {
  const value = String(role || '').trim().toLowerCase();
  if (!value) return 'participant';
  if (value === 'superadmin') return 'super_admin';
  return value;
};

export const isAdminRole = (role) => ADMIN_ROLES.has(normalizeRole(role));
export const isParticipantRole = (role) => PARTICIPANT_ROLES.has(normalizeRole(role));
export const isSuperAdmin = (role) => normalizeRole(role) === 'super_admin';

export const canAccessRoute = (role, area) => {
  const normalizedRole = normalizeRole(role);
  if (area === 'participant') return normalizedRole === 'participant';
  if (area === 'admin') return ADMIN_ROLES.has(normalizedRole);
  return true;
};

export const sanitizePublicRegistrationPayload = (payload = {}) => ({
  name: String(payload.name || '').trim(),
  email: String(payload.email || '').trim().toLowerCase(),
  phone: String(payload.phone || '').trim(),
  institution: String(payload.institution || '').trim(),
  password: String(payload.password || '').trim(),
  role: 'participant'
});

export const assertResourceOwnership = ({ actorId, ownerId, actorRole, allowAdmin = false }) => {
  const normalizedActorRole = normalizeRole(actorRole);
  const isOwner = Boolean(actorId && ownerId && String(actorId) === String(ownerId));
  const isAllowedAdmin = allowAdmin && ADMIN_ROLES.has(normalizedActorRole);

  if (isOwner || isAllowedAdmin) {
    return { allowed: true };
  }

  return {
    allowed: false,
    status: 403,
    error: 'Forbidden: resource ownership validation failed.'
  };
};
