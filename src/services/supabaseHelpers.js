export const safeErrorMessage = (error, fallback = 'Terjadi kesalahan.') => {
  if (!error) return fallback;
  if (typeof error === 'string') return error;
  if (error.message) return error.message;
  return fallback;
};

export const makeAuditPayload = ({ actorId, action, entityType, entityId, metadata }) => ({
  actor_id: actorId || null,
  action,
  entity_type: entityType,
  entity_id: entityId || null,
  metadata: metadata || {}
});
