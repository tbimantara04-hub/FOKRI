import React, { useEffect, useState } from 'react';
import { ArrowRight, Eye, EyeOff, LockKeyhole, ShieldAlert, ShieldCheck, Trophy } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { getSupabaseClient } from '../../lib/supabase';
import { updateRecoveredPassword, verifyPasswordRecoveryContext } from '../../services/authService';

const getCallbackError = () => {
  if (typeof window === 'undefined') return null;
  const searchParams = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams(window.location.hash.slice(1));
  const errorCode = searchParams.get('error_code') || hashParams.get('error_code') || searchParams.get('error') || hashParams.get('error');
  const errorDescription = searchParams.get('error_description') || hashParams.get('error_description');
  if (errorCode || errorDescription) {
    return { errorCode, errorDescription };
  }
  return null;
};

export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { clearLocalSession } = useApp();
  const [status, setStatus] = useState('checking'); // 'checking' | 'ready' | 'invalid' | 'updated'
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [sessionCleared, setSessionCleared] = useState(true);

  useEffect(() => {
    let active = true;

    const callbackError = getCallbackError();
    if (callbackError) {
      setError('Tautan pemulihan tidak valid, sudah digunakan, atau sudah kedaluwarsa. Minta tautan reset baru untuk melanjutkan.');
      setStatus('invalid');
      return;
    }

    const verify = async () => {
      const result = await verifyPasswordRecoveryContext();
      if (!active) return;
      if (!result.success) {
        setError(result.message);
        setStatus('invalid');
        return;
      }
      setStatus('ready');
    };

    // Listen for PASSWORD_RECOVERY event if it arrives asynchronously
    const client = getSupabaseClient();
    let subscription = null;
    if (client?.auth?.onAuthStateChange) {
      const { data } = client.auth.onAuthStateChange((event) => {
        if (!active) return;
        if (event === 'PASSWORD_RECOVERY') {
          setStatus('ready');
        }
      });
      subscription = data?.subscription;
    }

    verify();

    return () => {
      active = false;
      subscription?.unsubscribe?.();
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;
    const form = event.currentTarget;
    setError('');

    const newPassword = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    if (newPassword.length < 8) {
      setError('Password minimal terdiri dari 8 karakter.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Konfirmasi password tidak cocok.');
      return;
    }

    setLoading(true);
    try {
      const result = await updateRecoveredPassword(newPassword);
      if (!result.success) {
        setError(result.message);
        if (result.code === 'AUTH_RECOVERY_SESSION_INVALID' || result.code === 'AUTH_RECOVERY_CONTEXT_MISSING') {
          setStatus('invalid');
        }
        return;
      }
      clearLocalSession();
      setSessionCleared(result.sessionCleared);
      setStatus('updated');
    } finally {
      setLoading(false);
    }
  };

  const handleReturnToLogin = () => {
    navigate('/auth', {
      replace: true,
      state: { notice: 'Password Anda berhasil diperbarui. Silakan masuk dengan password baru.' },
    });
  };

  return (
    <main className="auth-page">
      <section className="auth-brand-panel">
        <div className="auth-brand-content">
          <Link to="/" className="auth-logo"><Trophy size={22} /> FOKRI <strong>GAMES XII</strong></Link>
          <div className="auth-brand-copy">
            <span className="eyebrow eyebrow-gold">ACCOUNT SECURITY</span>
            <h1>Buat password<br /><em>baru dan aman.</em></h1>
            <p>Gunakan password baru untuk kembali mengakses akun FOKRI GAMES XII Anda.</p>
          </div>
          <div className="auth-brand-footer"><ShieldCheck size={17} /> Tautan pemulihan hanya dapat digunakan untuk akun Anda</div>
        </div>
      </section>

      <section className="auth-form-panel">
        <div className="auth-card">
          <div className="auth-card-heading">
            <span className="auth-kicker">PEMULIHAN AKUN</span>
            <h2>{status === 'updated' ? 'Password diperbarui' : status === 'invalid' ? 'Tautan Tidak Valid' : 'Atur password baru'}</h2>
            <p>
              {status === 'updated'
                ? 'Password akun Anda telah berhasil diubah.'
                : status === 'invalid'
                ? 'Sesi atau tautan pemulihan ini tidak dapat digunakan.'
                : 'Masukkan password baru untuk menyelesaikan pemulihan akun.'}
            </p>
          </div>

          {status === 'checking' && (
            <div className="auth-recovery-status" role="status">
              <span className="auth-spinner" aria-hidden="true" />
              <p>Memverifikasi tautan pemulihan...</p>
            </div>
          )}

          {status === 'invalid' && (
            <div className="auth-recovery-state">
              <div className="auth-error-banner" role="alert">
                <ShieldAlert size={20} />
                <span>{error || 'Tautan pemulihan tidak valid atau sudah kedaluwarsa. Minta tautan reset baru untuk melanjutkan.'}</span>
              </div>
              <Link className="btn btn-primary auth-submit" to="/auth?forgot=1">
                Minta tautan reset baru <ArrowRight size={17} />
              </Link>
              <Link className="auth-link auth-back-link" to="/auth">
                Kembali ke halaman login
              </Link>
            </div>
          )}

          {status === 'ready' && (
            <form className="auth-form auth-recovery-form" onSubmit={handleSubmit}>
              <label htmlFor="recovery-new-password">
                Password baru
                <div className="password-input">
                  <input
                    id="recovery-new-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    minLength="8"
                    placeholder="Minimal 8 karakter"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(value => !value)}
                    aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </label>

              <label htmlFor="recovery-confirm-password">
                Konfirmasi password
                <div className="password-input">
                  <input
                    id="recovery-confirm-password"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Ulangi password baru"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(value => !value)}
                    aria-label={showConfirmPassword ? 'Sembunyikan konfirmasi password' : 'Tampilkan konfirmasi password'}
                  >
                    {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </label>

              {error && <p className="auth-error" role="alert">{error}</p>}
              <p className="auth-recovery-hint">Password minimal terdiri dari 8 karakter. Persyaratan tambahan dari penyedia autentikasi tetap berlaku.</p>

              <button className="btn btn-primary auth-submit" type="submit" disabled={loading} aria-busy={loading}>
                <LockKeyhole size={17} /> {loading ? 'Menyimpan...' : 'Simpan password baru'} {!loading && <ArrowRight size={17} />}
              </button>
            </form>
          )}

          {status === 'updated' && (
            <div className="auth-success" role="status">
              <div className="auth-success-icon"><ShieldCheck size={24} /></div>
              <h3>Password berhasil diubah.</h3>
              <p>
                {sessionCleared
                  ? 'Sesi pemulihan telah ditutup demi keamanan akun Anda. Silakan login dengan password baru.'
                  : 'Silakan login dengan password baru. Jika sesi lama masih terbuka, tutup sesi tersebut setelah login.'}
              </p>
              <button type="button" className="btn btn-primary auth-submit" onClick={handleReturnToLogin}>
                Masuk dengan password baru <ArrowRight size={17} />
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

