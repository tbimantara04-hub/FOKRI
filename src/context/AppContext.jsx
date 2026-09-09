import React, { createContext, useContext, useState } from 'react';
import { 
  INITIAL_COMPETITIONS, 
  INITIAL_ANNOUNCEMENTS, 
  INITIAL_REGISTRATIONS, 
  INITIAL_FINALISTS, 
  INITIAL_RESULTS, 
  INITIAL_AUDIT_LOGS 
} from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Current active role for testing: 'VISITOR', 'PARTICIPANT', 'TEAM_LEADER', 'VERIFIER', 'COMPETITION_ADMIN', 'SUPER_ADMIN'
  const [currentRole, setCurrentRole] = useState('PARTICIPANT');
  
  // User profile state
  const [user, setUser] = useState({
    id: 'usr-participant-1',
    name: 'Ahmad Fauzi',
    email: 'fauzi@ui.ac.id',
    phone: '081298765432',
    institution: 'Universitas Indonesia',
    idNumber: '1906381029',
    verified: true,
    profileComplete: true
  });

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
  };

  // Admin Competition CRUD
  const saveCompetition = (compData) => {
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
    const req = resultChangeRequests.find(r => r.id === reqId);
    if (!req) return;

    publishResults(req.competitionId, req.entries);
    setResultChangeRequests(prev => prev.filter(r => r.id !== reqId));
    logAudit('RESULT_CHANGE_APPROVED', `Hasil ${req.competitionId}`, 'Super Admin menyetujui perubahan hasil kejuaraan');
    showToast('Perubahan hasil disetujui dan diperbarui.', 'success');
  };

  return (
    <AppContext.Provider value={{
      currentRole,
      setCurrentRole,
      user,
      setUser,
      competitions,
      announcements,
      registrations,
      finalists,
      results,
      auditLogs,
      resultChangeRequests,
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
