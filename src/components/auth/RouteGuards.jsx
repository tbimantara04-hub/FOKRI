import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { canAccess, getDashboardPath } from '../../auth/authModel';

export const ProtectedRoute = ({ area, children }) => {
  const { isAuthenticated, currentRole } = useApp();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }

  if (!canAccess(currentRole, area)) {
    return <Navigate to="/403" replace state={{ from: location.pathname }} />;
  }

  return children;
};

export const AdminLoginRoute = ({ children }) => {
  const { isAuthenticated, currentRole } = useApp();
  if (isAuthenticated) return <Navigate to={getDashboardPath(currentRole)} replace />;
  return children;
};