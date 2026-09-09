import React from 'react';
import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Toast = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 size={20} color="#16A34A" />,
    danger: <XCircle size={20} color="#DC2626" />,
    warning: <AlertCircle size={20} color="#D97706" />,
    info: <Info size={20} color="#2563EB" />
  };

  const bgColors = {
    success: '#DCFCE7',
    danger: '#FEE2E2',
    warning: '#FEF3C7',
    info: '#EFF6FF'
  };

  const borderColors = {
    success: '#16A34A',
    danger: '#DC2626',
    warning: '#D97706',
    info: '#2563EB'
  };

  return (
    <div style={{
      position: 'fixed',
      top: '80px',
      right: '24px',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.85rem 1.25rem',
      borderRadius: '8px',
      backgroundColor: bgColors[toast.type] || bgColors.info,
      borderLeft: `4px solid ${borderColors[toast.type] || borderColors.info}`,
      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.15)',
      color: '#332C2B',
      maxWidth: '420px',
      fontSize: '0.9rem',
      fontWeight: 500,
      animation: 'slideIn 0.3s ease-out'
    }}>
      {icons[toast.type] || icons.info}
      <div>{toast.message}</div>
    </div>
  );
};
