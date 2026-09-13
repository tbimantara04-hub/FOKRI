export const resolveAuthMode = (adminOnly = false, modeQuery = null) => {
  if (adminOnly) return 'login';
  return modeQuery === 'signup' ? 'signup' : 'login';
};
