import React from 'react';
import { ShieldX, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { getDashboardPath } from '../../auth/authModel';

export const AccessDenied = () => {
  const navigate = useNavigate();
  const { isAuthenticated, currentRole } = useApp();
  const destination = isAuthenticated ? getDashboardPath(currentRole) : '/';

  return (
    <section className="access-denied-page">
      <div className="access-denied-mark"><ShieldX size={34} /></div>
      <span className="eyebrow eyebrow-gold">FOKRI GAMES XII / ACCESS CONTROL</span>
      <h1>403 — Akses Ditolak</h1>
      <p>Anda tidak memiliki izin untuk mengakses halaman ini.</p>
      <button className="btn btn-primary" onClick={() => navigate(destination)}>
        <ArrowLeft size={17} /> Kembali ke Dashboard
      </button>
    </section>
  );
};