import React, { useEffect, useState } from 'react';
import { ArrowRight, Eye, EyeOff, LockKeyhole, ShieldCheck, Trophy, UserPlus } from 'lucide-react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { getDashboardPath } from '../../auth/authModel';
import { resolveAuthMode } from '../../services/authMode';

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

  useEffect(() => {
    const nextMode = resolveAuthMode(adminOnly, searchParams.get('mode'));
    setMode(nextMode);
    setError('');
    setRegistered(false);
    setSignupNotice('');
  }, [adminOnly, searchParams]);

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

  const switchMode = (nextMode) => {
    if (adminOnly && nextMode === 'signup') return;
    setSearchParams(nextMode === 'signup' ? { mode: 'signup' } : {});
    setError('');
    setRegistered(false);
    setSignupNotice('');
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
            <span className="auth-kicker">{adminOnly ? 'PORTAL PANITIA' : 'FOKRI GAMES XII'}</span>
            <h2>{adminOnly ? 'Masuk ke Portal Admin' : 'Selamat Datang di FOKRI GAMES XII'}</h2>
            <p>{adminOnly ? 'Akses administratif untuk akun panitia yang telah diprovision.' : 'Daftar atau masuk untuk mengelola keikutsertaan Anda.'}</p>
          </div>

          {!adminOnly && <div className="auth-tabs" role="tablist" aria-label="Pilih alur autentikasi">
            <button className={mode === 'login' ? 'active' : ''} onClick={() => switchMode('login')} role="tab" aria-selected={mode === 'login'}>Login</button>
            <button className={mode === 'signup' ? 'active' : ''} onClick={() => switchMode('signup')} role="tab" aria-selected={mode === 'signup'}>Sign Up</button>
          </div>}

          {registered ? (
            <div className="auth-success" role="status">
              <div className="auth-success-icon"><UserPlus size={24} /></div>
              <h3>Akun berhasil dibuat.</h3>
              <p>{signupNotice || 'Akun Anda terdaftar sebagai Peserta. Silakan masuk untuk melanjutkan.'}</p>
              <button className="btn btn-primary auth-submit" onClick={() => switchMode('login')}>Masuk sekarang <ArrowRight size={17} /></button>
            </div>
          ) : mode === 'login' ? (
            <form className="auth-form" onSubmit={handleLogin}>
              <label>Email<input name="email" type="email" placeholder="Masukkan email" autoComplete="email" required /></label>
              <label>Password<div className="password-input"><input name="password" type={showPassword ? 'text' : 'password'} placeholder="Masukkan password" autoComplete="current-password" required /><button type="button" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></label>
              <div className="auth-form-meta"><label className="checkbox-label"><input type="checkbox" name="remember" /> Ingat saya</label><button type="button" className="auth-link" onClick={() => showToast('Fitur reset password akan tersedia saat backend autentikasi terhubung.', 'info')}>Lupa password?</button></div>
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
              <label>Nama lengkap<input name="name" type="text" placeholder="Masukkan nama lengkap" autoComplete="name" required /></label>
              <label>Email<input name="email" type="email" placeholder="Masukkan email aktif" autoComplete="email" required /></label>
              <div className="auth-form-grid"><label>Nomor WhatsApp<input name="phone" type="tel" placeholder="08xxxxxxxxxx" autoComplete="tel" required /></label><label>Institusi<input name="institution" type="text" placeholder="Perguruan tinggi / instansi" required /></label></div>
              <label>Password<div className="password-input"><input name="password" type={showPassword ? 'text' : 'password'} placeholder="Minimal 8 karakter" autoComplete="new-password" minLength="8" required /><button type="button" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></label>
              <label>Konfirmasi password<div className="password-input"><input name="confirmPassword" type={showPassword ? 'text' : 'password'} placeholder="Ulangi password" autoComplete="new-password" required /><button type="button" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></label>
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