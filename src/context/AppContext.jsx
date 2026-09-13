import React, { createContext, useContext, useState } from 'react';
import { 
  INITIAL_COMPETITIONS, 
  INITIAL_ANNOUNCEMENTS, 
  INITIAL_REGISTRATIONS, 
  INITIAL_FINALISTS, 
  INITIAL_RESULTS, 
  INITIAL_AUDIT_LOGS 
} from '../data/mockData';
import { DEMO_ACCOUNTS, ROLES, hasPermission, isAdminRole, isParticipantRole } from '../auth/authModel';
import { signInWithSupabase, signUpParticipant as signUpViaSupabase, signOutFromSupabase } from '../services/authService';
import { isSupabaseConfigured } from '../lib/supabase';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [accounts, setAccounts] = useState(DEMO_ACCOUNTS);
  const [user, setUserState] = useState(() => {
    const stored = sessionStorage.getItem('fokri_session_user');
    return stored ? JSON.parse(stored) : null;
  });

  const setUser = (nextUser) => {
    if (nextUser) {
      sessionStorage.setItem('fokri_session_user', JSON.stringify(nextUser));
    } else {
      sessionStorage.removeItem('fokri_session_user');
    }
    setUserState(nextUser);
  };

  const currentRole = user?.role || ROLES.VISITOR;
  const isAuthenticated = Boolean(user);

  const login = async (email, password, adminOnly = false) => {
    // When Supabase is configured, always use it as the primary auth provider.
    // For adminOnly=true with Supabase configured: never fall back to DEMO_ACCOUNTS.
    const supabaseConfigured = isSupabaseConfigured();

    if (supabaseConfigured) {
      const supabaseResult = await signInWithSupabase({ email, password, adminOnly });
      if (supabaseResult.success) {
        const safeUser = { ...supabaseResult.user, role: supabaseResult.user.role || ROLES.PARTICIPANT };
        setUser({ ...safeUser, verified: Boolean(safeUser.verified), profileComplete: true });
        return { success: true, user: safeUser };
      }
      // Supabase is configured — return its error directly, no demo fallback.
      return {
        success: false,
        message: supabaseResult.message || 'Autentikasi gagal.',
        code: supabaseResult.code || 'AUTH_FAILED',
      };
    }

    // Supabase not configured — allow DEMO_ACCOUNTS only for non-admin flows.
    if (adminOnly) {
      return {
        success: false,
        message: 'Layanan autentikasi belum tersedia.',
        code: 'AUTH_NOT_CONFIGURED',
      };
    }

    const account = accounts.find(item => item.email.toLowerCase() === email.trim().toLowerCase() && item.password === password);
    if (!account || isAdminRole(account.role)) {
      return { success: false, message: 'Email atau password tidak sesuai.' };
    }

    const { password: _password, ...safeUser } = account;
    setUser({ ...safeUser, verified: true, profileComplete: true });
    return { success: true, user: safeUser };
  };

  const registerParticipant = async (details) => {
    const supabaseResult = await signUpViaSupabase(details);
    if (supabaseResult.success) {
      return { success: true, user: supabaseResult.user };
    }

    const email = details.email.trim().toLowerCase();
    if (accounts.some(account => account.email.toLowerCase() === email)) {
      return { success: false, message: 'Email tersebut sudah terdaftar.' };
    }

    const sanitized = {
      name: String(details.name || '').trim(),
      email,
      phone: String(details.phone || '').trim(),
      institution: String(details.institution || '').trim(),
      password: String(details.password || '').trim()
    };

    const participant = {
      id: `usr-participant-${Date.now()}`,
      name: sanitized.name,
      email: sanitized.email,
      phone: sanitized.phone,
      institution: sanitized.institution,
      role: ROLES.PARTICIPANT,
      password: sanitized.password
    };
    setAccounts(previous => [...previous, participant]);
    return { success: true };
  };

  const logout = async () => {
    await signOutFromSupabase();
    setUser(null);
    sessionStorage.removeItem('fokri_session_user');
  };

  // Database collections state
  const [competitions, setCompetitions] = useState(INITIAL_COMPETITIONS);
  const [announcements, setAnnouncements] = useState(INITIAL_ANNOUNCEMENTS);
  const [registrations, setRegistrations] = useState(INITIAL_REGISTRATIONS);
  const [finalists, setFinalists] = useState(INITIAL_FINALISTS);
  const [results, setResults] = useState(INITIAL_RESULTS);
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS);
  
  // Pending result change requests (for elevated approval rule in PRD Section 8.3)
  const [resultChangeRequests, setResultChangeRequests] = useState([]);
  
  // Toast notifications
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 4000);
  };

  const denyUnlessAdmin = () => {
    if (!hasPermission(currentRole, 'MANAGE_REGISTRATIONS')) {
      showToast('Akses ditolak. Area ini hanya tersedia untuk panitia berwenang.', 'danger');
      return false;
    }
    return true;
  };

  // Log action to append-only audit trail (PRD Section 35)
  const logAudit = (action, target, details) => {
    const newEntry = {
      id: `audit-${Date.now()}`,
      actor: `${user.name} (${currentRole})`,
      action,
      target,
      details,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      ip: '127.0.0.1'
    };
    setAuditLogs(prev => [newEntry, ...prev]);
  };

  // Registration submit logic (PRD Section 14)
  const submitRegistration = (newRegData) => {
    if (!isParticipantRole(currentRole)) {
      showToast('Sesi peserta diperlukan untuk membuat pendaftaran.', 'danger');
      return false;
    }
    // Check BR-1: participant active registration per competition
    const existing = registrations.find(
      r => r.competitionId === newRegData.competitionId && 
           ['SUBMITTED', 'UNDER_REVIEW', 'REVISION_REQUIRED', 'APPROVED'].includes(r.status)
    );
    if (existing && currentRole === 'PARTICIPANT') {
      showToast('Gagal: Anda sudah memiliki pendaftaran aktif untuk cabang ini!', 'danger');
      return false;
    }

    const regId = `reg-${Date.now()}`;
    const comp = competitions.find(c => c.id === newRegData.competitionId);
    const cat = comp?.categories.find(c => c.id === newRegData.categoryId);

    // Check atomic quota (PRD Section 27)
    if (comp && comp.currentRegistrations >= comp.quota) {
      showToast('Gagal: Kuota pendaftaran untuk kompetisi ini sudah penuh!', 'danger');
      return false;
    }

    const registrationNumber = `FG12-${comp?.slug.substring(0, 5).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const newReg = {
      id: regId,
      registrationNumber,
      competitionId: newRegData.competitionId,
      competitionName: comp?.name || 'Kompetisi',
      categoryId: newRegData.categoryId,
      categoryName: cat?.name || 'Kategori',
      mode: newRegData.mode,
      teamName: newRegData.teamName || null,
      leaderUserId: user.id,
      leaderName: user.name,
      institution: user.institution,
      status: 'SUBMITTED',
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      revisionNotes: null,
      documents: newRegData.documents || [],
      members: newRegData.members || []
    };

    setRegistrations(prev => [newReg, ...prev]);

    // Update competition count
    setCompetitions(prev => prev.map(c => {
      if (c.id === comp.id) {
        return { ...c, currentRegistrations: c.currentRegistrations + 1 };
      }
      return c;
    }));

    logAudit('SUBMIT_REGISTRATION', `Registration ${registrationNumber}`, `Pendaftaran berhasil dikirim.`);
    showToast(`Pendaftaran Berhasil! Nomor Registrasi: ${registrationNumber}`, 'success');
    return true;
  };

  // Verification decision (PRD Section 17)
  const verifyRegistration = (regId, decision, reason, flaggedDocReqId = null) => {
    if (!denyUnlessAdmin()) return false;
    // decision: 'APPROVED', 'REJECTED', 'REVISION_REQUIRED'
    if ((decision === 'REJECTED' || decision === 'REVISION_REQUIRED') && !reason.trim()) {
      showToast('Alasan verifikasi wajib diisi untuk penolakan atau minta revisi!', 'danger');
      return false;
    }

    setRegistrations(prev => prev.map(r => {
      if (r.id === regId) {
        return {
          ...r,
          status: decision,
          revisionNotes: decision === 'REVISION_REQUIRED' ? reason : null,
          flaggedDocumentReqId: decision === 'REVISION_REQUIRED' ? flaggedDocReqId : null
        };
      }
      return r;
    }));

    const reg = registrations.find(r => r.id === regId);
    logAudit(
      decision === 'APPROVED' ? 'APPROVE_REGISTRATION' : decision === 'REJECTED' ? 'REJECT_REGISTRATION' : 'REQUEST_REVISION',
      `Registration ${reg?.registrationNumber}`,
      `Keputusan verifikator: ${decision}. Catatan: ${reason || '-'}`
    );

    showToast(`Status pendaftaran ${reg?.registrationNumber} diubah menjadi ${decision}`, 'success');
    return true;
  };

  // Update document during revision loop (PRD Section 16)
  const updateDocumentRevision = (regId, reqId, newFile) => {
    const registration = registrations.find(item => item.id === regId);
    if (!isParticipantRole(currentRole) || registration?.leaderUserId !== user?.id) {
      showToast('Anda hanya dapat mengubah dokumen milik sendiri.', 'danger');
      return false;
    }
    setRegistrations(prev => prev.map(r => {
      if (r.id === regId) {
        const updatedDocs = r.documents.map(doc => {
          if (doc.requirementId === reqId) {
            return {
              ...doc,
              filename: newFile.name,
              version: doc.version + 1,
              uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
              scanStatus: 'CLEAN'
            };
          }
          return doc;
        });

        return {
          ...r,
          documents: updatedDocs,
          status: 'UNDER_REVIEW', // Loop back to review (PRD Section 25.1)
          revisionNotes: null
        };
      }
      return r;
    }));

    logAudit('UPLOAD_DOCUMENT', `Registration ${regId}`, `Dokumen direvisi oleh peserta.`);
    showToast('Dokumen revisi berhasil diunggah. Pendaftaran Anda kembali ditinjau verifikator.', 'success');
    return true;
  };

  // Admin Competition CRUD
  const saveCompetition = (compData) => {
    if (!denyUnlessAdmin()) return;
    if (compData.id) {
      setCompetitions(prev => prev.map(c => c.id === compData.id ? compData : c));
      logAudit('EDIT_COMPETITION', `Competition ${compData.name}`, 'Konfigurasi kompetisi diperbarui');
      showToast('Kompetisi berhasil diperbarui.', 'success');
    } else {
      const newComp = {
        ...compData,
        id: `comp-${Date.now()}`,
        slug: compData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        currentRegistrations: 0
      };
      setCompetitions(prev => [newComp, ...prev]);
      logAudit('CREATE_COMPETITION', `Competition ${newComp.name}`, 'Kompetisi baru dibuat');
      showToast('Kompetisi baru berhasil ditambahkan.', 'success');
    }
  };

  // Announcement CRUD & Pinned Banner
  const saveAnnouncement = (annData) => {
    if (!denyUnlessAdmin()) return;
    if (annData.id) {
      setAnnouncements(prev => prev.map(a => a.id === annData.id ? annData : a));
      logAudit('EDIT_ANNOUNCEMENT', `Pengumuman ${annData.title}`, 'Pengumuman diedit');
      showToast('Pengumuman berhasil diperbarui.', 'success');
    } else {
      const newAnn = {
        ...annData,
        id: `ann-${Date.now()}`,
        publishedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        author: user.name
      };
      setAnnouncements(prev => [newAnn, ...prev]);
      logAudit('CREATE_ANNOUNCEMENT', `Pengumuman ${newAnn.title}`, 'Pengumuman baru dibuat');
      showToast('Pengumuman baru berhasil diterbitkan.', 'success');
    }
  };

  // Results Management with Elevated Approval Rule (PRD Section 8.3)
  const publishResults = (compSlug, resultEntries) => {
    if (!denyUnlessAdmin()) return;
    // If results already published, Competition Admin must submit RESULT_CHANGE_REQUEST
    const existing = results.find(r => r.competitionId === compSlug || r.id === compSlug);
    if (existing && existing.status === 'PUBLISHED' && currentRole === 'COMPETITION_ADMIN') {
      const reqId = `req-${Date.now()}`;
      const changeReq = {
        id: reqId,
        competitionId: compSlug,
        entries: resultEntries,
        requestedBy: user.name,
        requestedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        status: 'PENDING_APPROVAL'
      };
      setResultChangeRequests(prev => [changeReq, ...prev]);
      logAudit('RESULT_CHANGE_REQUEST', `Hasil ${compSlug}`, 'Permintaan perubahan hasil diajukan ke Super Admin');
      showToast('Hasil sudah terbit. Permintaan perubahan telah diajukan ke Super Admin untuk persetujuan!', 'warning');
      return;
    }

    setResults(prev => {
      const filtered = prev.filter(r => r.id !== compSlug);
      const updated = {
        id: compSlug,
        competitionId: compSlug,
        competitionName: competitions.find(c => c.slug === compSlug || c.id === compSlug)?.name || 'Kompetisi',
        categoryName: 'Hasil Final',
        status: 'PUBLISHED',
        entries: resultEntries
      };
      return [updated, ...filtered];
    });

    logAudit('PUBLISH_RESULT', `Hasil ${compSlug}`, 'Hasil kejuaraan resmi dipublikasikan.');
    showToast('Hasil kejuaraan berhasil dipublikasikan ke publik!', 'success');
  };

  // Super Admin approval of elevated change request
  const approveResultChangeRequest = (reqId) => {
    if (!hasPermission(currentRole, 'APPROVE_PUBLISHED_RESULT_CHANGE')) {
      showToast('Hanya Super Admin yang dapat menyetujui perubahan hasil terbit.', 'danger');
      return;
    }
    const req = resultChangeRequests.find(r => r.id === reqId);
    if (!req) return;

    publishResults(req.competitionId, req.entries);
    setResultChangeRequests(prev => prev.filter(r => r.id !== reqId));
    logAudit('RESULT_CHANGE_APPROVED', `Hasil ${req.competitionId}`, 'Super Admin menyetujui perubahan hasil kejuaraan');
    showToast('Perubahan hasil disetujui dan diperbarui.', 'success');
  };

  const visibleRegistrations = isAdminRole(currentRole)
    ? registrations
    : registrations.filter(registration => registration.leaderUserId === user?.id || registration.members?.some(member => member.email === user?.email));
  const visibleAuditLogs = isAdminRole(currentRole) ? auditLogs : [];
  const visibleChangeRequests = isAdminRole(currentRole) ? resultChangeRequests : [];

  return (
    <AppContext.Provider value={{
      currentRole,
      isAuthenticated,
      user,
      setUser,
      login,
      logout,
      registerParticipant,
      competitions,
      announcements,
      registrations: visibleRegistrations,
      finalists,
      results,
      auditLogs: visibleAuditLogs,
      resultChangeRequests: visibleChangeRequests,
      toast,
      showToast,
      submitRegistration,
      verifyRegistration,
      updateDocumentRevision,
      saveCompetition,
      saveAnnouncement,
      publishResults,
      approveResultChangeRequest,
      logAudit
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
