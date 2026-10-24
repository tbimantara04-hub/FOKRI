import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Eye, EyeOff, LockKeyhole, ShieldCheck, Trophy, UserPlus } from 'lucide-react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { getDashboardPath } from '../../auth/authModel';
import { resolveAuthMode } from '../../services/authMode';
import { requestPasswordReset } from '../../services/authService';

export const AuthPage = ({ adminOnly = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { login, registerParticipant, showToast } = useApp();
  const [mode, setMode] = useState(resolveAuthMode(adminOnly, searchParams.get('mode')));
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [signupNotice, setSignupNotice] = useState('');
  const [forgotPassword, setForgotPassword] = useState(searchParams.get('forgot') === '1');
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySent, setRecoverySent] = useState(false);

  useEffect(() => {
    const nextMode = resolveAuthMode(adminOnly, searchParams.get('mode'));
    setMode(nextMode);
    setError('');
    setRegistered(false);
    setSignupNotice(location.state?.notice || '');
    setForgotPassword(searchParams.get('forgot') === '1');
    setRecoverySent(false);
  }, [adminOnly, searchParams, location.state]);

  const handleLogin = async (event) => {
    event.preventDefault();
    if (loading) return;
    const form = event.currentTarget;
    setError('');
    setLoading(true);
    try {
      const result = await login(form.email.value, form.password.value, adminOnly);
      if (!result.success) {
        setError(result.message || 'Login gagal.');
        return;
      }
      const destination = location.state?.from || getDashboardPath(result.user.role);
      const nextState = location.state?.startRegCompId ? { startRegCompId: location.state.startRegCompId } : undefined;
      navigate(destination, { replace: true, state: nextState });
    } catch (err) {
      console.error('[Admin Login] Unexpected error:', err?.message ?? 'unknown');
      setError('Terjadi kesalahan saat menghubungkan ke server autentikasi.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    if (loading) return;
    const form = event.currentTarget;
    setError('');
    if (form.password.value.length < 8) {
      setError('Password minimal terdiri dari 8 karakter.');
      return;
    }
    if (form.password.value !== form.confirmPassword.value) {
      setError('Konfirmasi password tidak cocok.');
      return;
    }

    setLoading(true);
    try {
      const result = await registerParticipant({
        name: form.name.value,
        email: form.email.value,
        phone: form.phone.value,
        institution: form.institution.value,
        password: form.password.value
      });
      if (!result.success) {
        setError(result.message || 'Akun gagal dibuat.');
        return;
      }
      setRegistered(true);
      const notice = result.message || (result.requiresEmailConfirmation
        ? 'Akun berhasil dibuat. Silakan cek email Anda untuk verifikasi sebelum login.'
        : 'Akun Anda terdaftar sebagai Peserta. Silakan masuk untuk melanjutkan.');
      setSignupNotice(notice);
      showToast(notice, 'success');
    } catch (err) {
      console.error('[Signup] Unexpected error:', err?.message ?? 'unknown');
      setError('Terjadi kesalahan saat pendaftaran akun.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordResetRequest = async (event) => {
    event.preventDefault();
    if (loading) return;
    setError('');
    setLoading(true);
    try {
      const result = await requestPasswordReset(recoveryEmail);
      if (!result.success) {
        setError(result.message);
        return;
      }
      setRecoverySent(true);
    } finally {
      setLoading(false);
    }
  };

  const openPasswordRecovery = () => {
    setError('');
    setRecoverySent(false);
    setForgotPassword(true);
    setSearchParams({ forgot: '1' });
  };

  const returnToLogin = () => {
    setError('');
    setRecoverySent(false);
    setForgotPassword(false);
    setSearchParams({});
  };

  const switchMode = (nextMode) => {
    if (adminOnly && nextMode === 'signup') return;
    setSearchParams(nextMode === 'signup' ? { mode: 'signup' } : {});
    setError('');
    setRegistered(false);
    setSignupNotice('');
    setForgotPassword(false);
    setRecoverySent(false);
    setMode(nextMode);
  };

  return (
    <main className="auth-page">
      <section className="auth-brand-panel">
        <div className="auth-brand-content">
          <Link to="/" className="auth-logo"><Trophy size={22} /> FOKRI <strong>GAMES XII</strong></Link>
          <div className="auth-brand-copy">
            <span className="eyebrow eyebrow-gold">NATIONAL COMPETITION PLATFORM</span>
            <h1>Tempat prestasi<br /><em>bertemu kesempatan.</em></h1>
            <p>Kelola perjalanan kompetisi FOKRI GAMES XII melalui satu akun yang aman, terarah, dan transparan.</p>
          </div>
          <div className="auth-brand-footer"><ShieldCheck size={17} /> Sistem terstruktur untuk peserta dan panitia</div>
        </div>
      </section>

      <section className="auth-form-panel">
        <div className="auth-card">
          <div className="auth-card-heading">
            <span className="auth-kicker">
              {forgotPassword ? 'PEMULIHAN AKUN' : adminOnly ? 'PORTAL PANITIA' : 'FOKRI GAMES XII'}
            </span>
            <h2>
              {forgotPassword
                ? (recoverySent ? 'Periksa Email Anda' : 'Lupa Password')
                : adminOnly
                ? 'Masuk ke Portal Admin'
                : 'Selamat Datang di FOKRI GAMES XII'}
            </h2>
            <p>
              {forgotPassword
                ? (recoverySent
                    ? 'Instruksi pemulihan telah dikirim ke email Anda.'
                    : 'Masukkan email akun Anda untuk menerima tautan pemulihan password.')
                : adminOnly
                ? 'Akses administratif untuk akun panitia yang telah diprovision.'
                : 'Daftar atau masuk untuk mengelola keikutsertaan Anda.'}
            </p>
          </div>

          {!adminOnly && !forgotPassword && !registered && (
            <div className="auth-tabs" role="tablist" aria-label="Pilih alur autentikasi">
              <button className={mode === 'login' ? 'active' : ''} onClick={() => switchMode('login')} role="tab" aria-selected={mode === 'login'}>Login</button>
              <button className={mode === 'signup' ? 'active' : ''} onClick={() => switchMode('signup')} role="tab" aria-selected={mode === 'signup'}>Sign Up</button>
            </div>
          )}

          {signupNotice && mode === 'login' && !forgotPassword && !registered && (
            <div className="auth-notice-banner" role="status">
              <ShieldCheck size={18} />
              <span>{signupNotice}</span>
            </div>
          )}

          {registered ? (
            <div className="auth-success" role="status">
              <div className="auth-success-icon"><UserPlus size={24} /></div>
              <h3>Akun berhasil dibuat.</h3>
              <p>{signupNotice || 'Akun Anda terdaftar sebagai Peserta. Silakan masuk untuk melanjutkan.'}</p>
              <button className="btn btn-primary auth-submit" onClick={() => switchMode('login')}>Masuk sekarang <ArrowRight size={17} /></button>
            </div>
          ) : forgotPassword ? (
            recoverySent ? (
              <div className="auth-success" role="status">
                <div className="auth-success-icon"><ShieldCheck size={24} /></div>
                <h3>Periksa email Anda.</h3>
                <p>Jika email terdaftar, tautan reset password akan dikirim. Silakan periksa inbox atau folder spam.</p>
                <button type="button" className="btn btn-secondary auth-submit" onClick={() => setRecoverySent(false)}>Kirim tautan lagi</button>
                <button type="button" className="auth-link auth-back-link" onClick={returnToLogin}><ArrowLeft size={15} /> Kembali ke login</button>
              </div>
            ) : (
              <form className="auth-form auth-recovery-form" onSubmit={handlePasswordResetRequest}>
                <p className="auth-recovery-intro">Masukkan email akun Anda. Jika terdaftar, kami akan mengirimkan tautan untuk membuat password baru.</p>
                <label htmlFor="recovery-email">
                  Email
                  <input
                    id="recovery-email"
                    name="email"
                    type="email"
                    placeholder="Masukkan email terdaftar"
                    autoComplete="email"
                    value={recoveryEmail}
                    onChange={event => setRecoveryEmail(event.target.value)}
                    required
                  />
                </label>
                {error && <p className="auth-error" role="alert">{error}</p>}
                <button className="btn btn-primary auth-submit" type="submit" disabled={loading} aria-busy={loading}>
                  {loading ? 'Mengirim...' : 'Kirim tautan reset'} {!loading && <ArrowRight size={17} />}
                </button>
                <button type="button" className="auth-link auth-back-link" onClick={returnToLogin}><ArrowLeft size={15} /> Kembali ke login</button>
              </form>
            )
          ) : mode === 'login' ? (
            <form className="auth-form" onSubmit={handleLogin}>
              <label htmlFor="login-email">Email<input id="login-email" name="email" type="email" placeholder="Masukkan email" autoComplete="email" required /></label>
              <label htmlFor="login-password">Password<div className="password-input"><input id="login-password" name="password" type={showPassword ? 'text' : 'password'} placeholder="Masukkan password" autoComplete="current-password" required /><button type="button" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></label>
              <div className="auth-form-meta"><label className="checkbox-label"><input type="checkbox" name="remember" /> Ingat saya</label><button type="button" className="auth-link" onClick={openPasswordRecovery}>Lupa password?</button></div>
              {error && <p className="auth-error" role="alert">{error}</p>}
              <button
                className="btn btn-primary auth-submit"
                type="submit"
                disabled={loading}
                aria-busy={loading}
              >
                <LockKeyhole size={17} />
                {loading ? 'Memverifikasi...' : adminOnly ? 'Masuk sebagai Admin' : 'Masuk'}
                {!loading && <ArrowRight size={17} />}
              </button>
              {!adminOnly && <p className="auth-switch">Belum punya akun? <button type="button" className="auth-link" onClick={() => switchMode('signup')}>Daftar sekarang</button></p>}
              {!adminOnly && <Link className="admin-entry-link" to="/admin/login">Portal admin</Link>}
            </form>
          ) : (
            <form className="auth-form" onSubmit={handleSignup}>
              <label htmlFor="signup-name">Nama lengkap<input id="signup-name" name="name" type="text" placeholder="Masukkan nama lengkap" autoComplete="name" required /></label>
              <label htmlFor="signup-email">Email<input id="signup-email" name="email" type="email" placeholder="Masukkan email aktif" autoComplete="email" required /></label>
              <div className="auth-form-grid"><label htmlFor="signup-phone">Nomor WhatsApp<input id="signup-phone" name="phone" type="tel" placeholder="08xxxxxxxxxx" autoComplete="tel" required /></label><label htmlFor="signup-institution">Institusi<input id="signup-institution" name="institution" type="text" placeholder="Perguruan tinggi / instansi" required /></label></div>
              <label htmlFor="signup-password">Password<div className="password-input"><input id="signup-password" name="password" type={showPassword ? 'text' : 'password'} placeholder="Minimal 8 karakter" autoComplete="new-password" minLength="8" required /><button type="button" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></label>
              <label htmlFor="signup-confirm-password">Konfirmasi password<div className="password-input"><input id="signup-confirm-password" name="confirmPassword" type={showPassword ? 'text' : 'password'} placeholder="Ulangi password" autoComplete="new-password" required /><button type="button" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></label>
              <label className="checkbox-label agreement"><input type="checkbox" required /> Saya menyetujui syarat dan ketentuan FOKRI GAMES XII</label>
              {error && <p className="auth-error" role="alert">{error}</p>}
              <button
                className="btn btn-primary auth-submit"
                type="submit"
                disabled={loading}
                aria-busy={loading}
              >
                <UserPlus size={17} />
                {loading ? 'Mendaftarkan...' : 'Daftar sebagai Peserta'}
                {!loading && <ArrowRight size={17} />}
              </button>
              <p className="auth-switch">Sudah punya akun? <button type="button" className="auth-link" onClick={() => switchMode('login')}>Masuk</button></p>
            </form>
          )}
        </div>
      </section>
    </main>
  );
};