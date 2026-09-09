import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  UploadCloud, 
  Plus, 
  Users, 
  User, 
  Calendar, 
  ArrowRight,
  ShieldCheck,
  Edit,
  X
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';

export const ParticipantDashboard = () => {
  const { 
    user, 
    registrations, 
    competitions, 
    submitRegistration, 
    updateDocumentRevision, 
    currentRole,
    showToast 
  } = useApp();

  const location = useLocation();
  const navigate = useNavigate();
  const startRegCompId = location.state?.startRegCompId;

  const [activeNav, setActiveNav] = useState(startRegCompId ? 'wizard' : 'overview'); // overview, my-registrations, wizard, profile
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [selectedRegForRevision, setSelectedRegForRevision] = useState(null);

  // Wizard state
  const [wizardStep, setWizardStep] = useState(1);
  const [selectedCompId, setSelectedCompId] = useState(startRegCompId || competitions[0]?.id);
  const [selectedCatId, setSelectedCatId] = useState(competitions[0]?.categories[0]?.id);
  const [regMode, setRegMode] = useState('team'); // individual or team
  const [teamName, setTeamName] = useState('');
  const [membersList, setMembersList] = useState([
    { email: user.email, name: user.name, role: 'Leader', status: 'ACCEPTED' }
  ]);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState({});

  // Filter registrations owned by current user
  const myRegistrations = registrations.filter(r => r.leaderUserId === user.id || r.members.some(m => m.email === user.email));
  const revisionRequiredRegs = myRegistrations.filter(r => r.status === 'REVISION_REQUIRED');

  // Handle member invitation in wizard
  const handleAddMember = () => {
    if (!newMemberEmail.trim()) return;
    if (membersList.some(m => m.email === newMemberEmail)) {
      showToast('Email anggota sudah ada dalam daftar roster!', 'warning');
      return;
    }
    setMembersList(prev => [
      ...prev, 
      { email: newMemberEmail, name: `Anggota (${newMemberEmail.split('@')[0]})`, role: 'Member', status: 'PENDING' }
    ]);
    setNewMemberEmail('');
    showToast(`Undangan partisipasi dikirim ke ${newMemberEmail}`, 'info');
  };

  // Handle document upload simulation in wizard
  const handleFileUpload = (reqId, file) => {
    setUploadedFiles(prev => ({
      ...prev,
      [reqId]: {
        requirementId: reqId,
        filename: file.name,
        uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        version: 1,
        scanStatus: 'CLEAN'
      }
    }));
    showToast(`File ${file.name} berhasil terbebas dari virus & diunggah`, 'success');
  };

  // Submit Wizard
  const handleWizardSubmit = () => {
    const comp = competitions.find(c => c.id === selectedCompId);
    if (!comp) return;

    // Validate required documents
    const missingDocs = comp.documentRequirements.filter(req => req.required && !uploadedFiles[req.id]);
    if (missingDocs.length > 0) {
      showToast(`Gagal Submit: Harap lengkapi berkas wajib: ${missingDocs.map(d => d.name).join(', ')}`, 'danger');
      return;
    }

    const regData = {
      competitionId: selectedCompId,
      categoryId: selectedCatId,
      mode: regMode,
      teamName: regMode === 'team' ? teamName || `Tim ${user.name}` : null,
      documents: Object.values(uploadedFiles),
      members: regMode === 'team' ? membersList : []
    };

    const success = submitRegistration(regData);
    if (success) {
      setWizardStep(1);
      
      // Navigate to remove the location state so it doesn't stay in wizard
      navigate('.', { replace: true, state: {} });
      setActiveNav('my-registrations');
    }
  };

  // Handle revision upload submission
  const handleRevisionSubmit = (e) => {
    e.preventDefault();
    const fileInput = e.target.elements.revFile.files[0];
    if (!fileInput) {
      showToast('Pilih file perbaikan terlebih dahulu!', 'danger');
      return;
    }

    updateDocumentRevision(
      selectedRegForRevision.id, 
      selectedRegForRevision.flaggedDocumentReqId || selectedRegForRevision.documents[0]?.requirementId,
      fileInput
    );

    setShowRevisionModal(false);
    setSelectedRegForRevision(null);
  };

  const selectedCompObj = competitions.find(c => c.id === selectedCompId);

  return (
    <div className="dashboard-layout">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div style={{ padding: '0 0.75rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <strong style={{ fontSize: '1rem', color: '#FFF', display: 'block' }}>{user.name}</strong>
          <span style={{ fontSize: '0.8rem', color: 'var(--ppi-gold)' }}>{currentRole === 'TEAM_LEADER' ? 'Ketua Tim' : 'Peserta Individu'}</span>
        </div>

        <div className="sidebar-title">Menu Utama Peserta</div>
        <ul className="sidebar-menu">
          <li 
            className={`sidebar-item ${activeNav === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveNav('overview')}
          >
            <LayoutDashboard size={18} /> Overview & Notifikasi
          </li>
          
          <li 
            className={`sidebar-item ${activeNav === 'my-registrations' ? 'active' : ''}`}
            onClick={() => setActiveNav('my-registrations')}
          >
            <FileText size={18} /> Pendaftaran Saya ({myRegistrations.length})
          </li>

          <li 
            className={`sidebar-item ${activeNav === 'wizard' ? 'active' : ''}`}
            onClick={() => {
              setWizardStep(1);
              setActiveNav('wizard');
            }}
          >
            <Plus size={18} /> Daftar Kompetisi Baru
          </li>

          <li 
            className={`sidebar-item ${activeNav === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveNav('profile')}
          >
            <User size={18} /> Profil & Akun
          </li>
        </ul>
      </aside>

      {/* Main View Area */}
      <div className="dashboard-view">
        {/* OVERVIEW TAB */}
        {activeNav === 'overview' && (
          <div>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>Dashboard Peserta</h2>

            {/* ACTION REQUIRED PANEL (PRD Section 22 Requirement) */}
            {revisionRequiredRegs.length > 0 ? (
              <div className="card" style={{
                borderLeft: '5px solid #D97706',
                backgroundColor: '#FEF3C7',
                padding: '1.5rem',
                marginBottom: '2rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#B45309', marginBottom: '0.75rem' }}>
                  <AlertTriangle size={24} />
                  <h3 style={{ fontSize: '1.25rem', color: '#92400E' }}>ACTION REQUIRED — Tindakan Diperlukan!</h3>
                </div>

                {revisionRequiredRegs.map(reg => (
                  <div key={reg.id} style={{ backgroundColor: '#FFF', padding: '1rem 1.25rem', borderRadius: '8px', marginBottom: '0.75rem', border: '1px solid #FDE68A' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <strong style={{ color: 'var(--ppi-navy)' }}>{reg.competitionName} ({reg.registrationNumber})</strong>
                      <StatusBadge status={reg.status} />
                    </div>
                    <p style={{ fontSize: '0.9rem', color: '#332C2B', marginBottom: '0.75rem' }}>
                      <strong>Catatan Verifikator Panitia:</strong> "{reg.revisionNotes}"
                    </p>
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        setSelectedRegForRevision(reg);
                        setShowRevisionModal(true);
                      }}
                    >
                      <UploadCloud size={16} /> Perbaiki & Unggah Ulang Berkas Sekaran
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card" style={{ padding: '1.25rem 1.5rem', marginBottom: '2rem', backgroundColor: '#DCFCE7', border: '1px solid #86EFAC' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#166534' }}>
                  <CheckCircle2 size={20} />
                  <span>Semua pendaftaran Anda berada dalam status aman atau sedang ditinjau panitia.</span>
                </div>
              </div>
            )}

            {/* Registered Competitions Overview Grid */}
            <h3 style={{ marginBottom: '1rem' }}>Status Pendaftaran Aktif</h3>
            {myRegistrations.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '2.5rem' }}>
                <FileText size={40} style={{ color: '#CBD5E1', marginBottom: '1rem' }} />
                <h4>Belum ada pendaftaran kompetisi</h4>
                <p style={{ color: '#64748B', marginBottom: '1.5rem' }}>Pilih cabang kompetisi dan lengkapi berkas pendaftaran Anda.</p>
                <button className="btn btn-primary" onClick={() => setActiveNav('wizard')}>
                  Daftar Sekarang <ArrowRight size={16} />
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {myRegistrations.map(reg => (
                  <div key={reg.id} className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                          <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.88rem', color: 'var(--ppi-navy)' }}>
                            {reg.registrationNumber}
                          </span>
                          <StatusBadge status={reg.status} />
                        </div>
                        <h4 style={{ fontSize: '1.15rem', color: 'var(--deep-navy)' }}>{reg.competitionName}</h4>
                        <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
                          Kategori: {reg.categoryName} · {reg.mode === 'team' ? `Tim: ${reg.teamName}` : 'Individu'}
                        </span>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.8rem', color: '#64748B', display: 'block' }}>Tanggal Submit</span>
                        <strong style={{ fontSize: '0.85rem' }}>{reg.submittedAt}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MY REGISTRATIONS TAB */}
        {activeNav === 'my-registrations' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2>Daftar Pendaftaran Saya</h2>
              <button className="btn btn-primary btn-sm" onClick={() => setActiveNav('wizard')}>
                <Plus size={16} /> Pendaftaran Baru
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {myRegistrations.map(reg => (
                <div key={reg.id} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.85rem', marginBottom: '1rem' }}>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Nomor Registrasi Unik Resmi</span>
                      <h3 style={{ color: 'var(--ppi-navy)', fontFamily: 'monospace' }}>{reg.registrationNumber}</h3>
                    </div>
                    <StatusBadge status={reg.status} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: '#64748B', display: 'block' }}>Cabang Kompetisi</span>
                      <strong>{reg.competitionName}</strong>
                    </div>

                    <div>
                      <span style={{ fontSize: '0.8rem', color: '#64748B', display: 'block' }}>Kategori</span>
                      <strong>{reg.categoryName}</strong>
                    </div>

                    <div>
                      <span style={{ fontSize: '0.8rem', color: '#64748B', display: 'block' }}>Format Pendaftaran</span>
                      <strong>{reg.mode === 'team' ? `Tim: ${reg.teamName}` : 'Individu'}</strong>
                    </div>
                  </div>

                  {/* Document Status */}
                  <h4 style={{ fontSize: '0.95rem', marginBottom: '0.5rem' }}>Status Dokumen Terunggah:</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                    {reg.documents.map(doc => (
                      <div key={doc.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', backgroundColor: 'var(--light-bg)', padding: '0.5rem 0.75rem', borderRadius: '6px' }}>
                        <span>📄 {doc.filename} (Versi {doc.version})</span>
                        <span style={{ color: doc.scanStatus === 'CLEAN' ? '#16A34A' : '#DC2626', fontWeight: 600 }}>
                          {doc.scanStatus === 'CLEAN' ? '✓ Bebas Malware / Steril' : '⚠ Perlu Perbaikan'}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Action buttons */}
                  {reg.status === 'REVISION_REQUIRED' && (
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        setSelectedRegForRevision(reg);
                        setShowRevisionModal(true);
                      }}
                    >
                      <UploadCloud size={16} /> Unggah Ulang Berkas Revisi
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REGISTRATION WIZARD TAB (PRD Section 14 Flow) */}
        {activeNav === 'wizard' && (
          <div className="card" style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '0.5rem' }}>Wizard Pendaftaran Kompetisi</h2>
            <p style={{ color: '#64748B', marginBottom: '1.5rem' }}>
              Langkah {wizardStep} dari 4: {
                wizardStep === 1 ? 'Pilih Kompetisi & Kategori' :
                wizardStep === 2 ? 'Form Roster Tim / Peserta' :
                wizardStep === 3 ? 'Unggah Dokumen Wajib' : 'Review & Submit'
              }
            </p>

            {/* Wizard Steps Progress Indicator */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
              {[1, 2, 3, 4].map(s => (
                <div key={s} style={{
                  flex: 1,
                  height: '6px',
                  backgroundColor: s <= wizardStep ? 'var(--ppi-gold)' : '#E2E8F0',
                  borderRadius: '3px'
                }}></div>
              ))}
            </div>

            {/* STEP 1: Select Competition & Category */}
            {wizardStep === 1 && (
              <div>
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Pilih Cabang Kompetisi</label>
                  <select 
                    value={selectedCompId} 
                    onChange={(e) => {
                      setSelectedCompId(e.target.value);
                      const c = competitions.find(x => x.id === e.target.value);
                      if (c && c.categories.length > 0) setSelectedCatId(c.categories[0].id);
                    }}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.95rem' }}
                  >
                    {competitions.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.currentRegistrations}/{c.quota} Kuota)
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Pilih Sub-Kategori</label>
                  <select 
                    value={selectedCatId} 
                    onChange={(e) => setSelectedCatId(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.95rem' }}
                  >
                    {selectedCompObj?.categories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name} (Roster {cat.teamMin}-{cat.teamMax} orang)
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Mode Pendaftaran</label>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    {selectedCompObj?.mode !== 'individual' && (
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <input type="radio" name="mode" checked={regMode === 'team'} onChange={() => setRegMode('team')} />
                        <strong>Format Tim</strong>
                      </label>
                    )}
                    {selectedCompObj?.mode !== 'team' && (
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <input type="radio" name="mode" checked={regMode === 'individual'} onChange={() => setRegMode('individual')} />
                        <strong>Format Individu</strong>
                      </label>
                    )}
                  </div>
                </div>

                <button className="btn btn-primary" onClick={() => setWizardStep(2)}>
                  Lanjut ke Langkah 2 <ArrowRight size={16} />
                </button>
              </div>
            )}

            {/* STEP 2: Team Roster Creation */}
            {wizardStep === 2 && (
              <div>
                {regMode === 'team' ? (
                  <div>
                    <div style={{ marginBottom: '1.25rem' }}>
                      <label style={{ fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Nama Tim</label>
                      <input 
                        type="text"
                        placeholder="Contoh: Tim Garuda ITB"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}
                      />
                    </div>

                    <h4 style={{ marginBottom: '0.75rem' }}>Daftar Roster Anggota Tim</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                      {membersList.map((m, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--light-bg)', padding: '0.6rem 0.85rem', borderRadius: '6px' }}>
                          <div>
                            <strong>{m.name}</strong> ({m.email})
                          </div>
                          <span className="badge badge-approved">{m.role} - {m.status}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                      <input 
                        type="email"
                        placeholder="Email anggota lain..."
                        value={newMemberEmail}
                        onChange={(e) => setNewMemberEmail(e.target.value)}
                        style={{ flex: 1, padding: '0.6rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}
                      />
                      <button className="btn btn-secondary btn-sm" onClick={handleAddMember}>
                        <Plus size={16} /> Undang Anggota
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ color: '#475569' }}>Pendaftaran sebagai Individu dengan data akun Anda: <strong>{user.name} ({user.institution})</strong>.</p>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button className="btn btn-secondary" onClick={() => setWizardStep(1)}>Kembali</button>
                  <button className="btn btn-primary" onClick={() => setWizardStep(3)}>
                    Lanjut ke Unggah Berkas <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Document Upload */}
            {wizardStep === 3 && (
              <div>
                <h3 style={{ marginBottom: '1rem' }}>Unggah Dokumen Persyaratan</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
                  {selectedCompObj?.documentRequirements.map(req => (
                    <div key={req.id} style={{ border: '1px solid #E2E8F0', borderRadius: '8px', padding: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <strong style={{ color: 'var(--deep-navy)' }}>{req.name} {req.required && <span style={{ color: '#DC2626' }}>*</span>}</strong>
                        <span className={`badge ${req.required ? 'badge-revision' : 'badge-draft'}`}>
                          {req.required ? 'WAJIB' : 'OPSIONAL'}
                        </span>
                      </div>

                      <p style={{ fontSize: '0.82rem', color: '#64748B', marginBottom: '0.75rem' }}>
                        Format: {req.allowedFormats} · Maksimal {req.maxSizeMb}MB
                      </p>

                      {uploadedFiles[req.id] ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#16A34A', fontSize: '0.9rem', fontWeight: 600 }}>
                          <CheckCircle2 size={18} /> Berkas Terunggah: {uploadedFiles[req.id].filename}
                        </div>
                      ) : (
                        <input 
                          type="file"
                          onChange={(e) => {
                            if (e.target.files[0]) handleFileUpload(req.id, e.target.files[0]);
                          }}
                          style={{ fontSize: '0.88rem' }}
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button className="btn btn-secondary" onClick={() => setWizardStep(2)}>Kembali</button>
                  <button className="btn btn-primary" onClick={() => setWizardStep(4)}>
                    Review & Submit <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Review Summary Checklist */}
            {wizardStep === 4 && (
              <div>
                <h3 style={{ marginBottom: '1rem' }}>Ringkasan & Konfirmasi Pendaftaran</h3>
                <div style={{ backgroundColor: 'var(--light-bg)', padding: '1.25rem', borderRadius: '8px', marginBottom: '1.5rem', borderLeft: '4px solid var(--ppi-gold)' }}>
                  <p style={{ marginBottom: '0.5rem' }}><strong>Kompetisi:</strong> {selectedCompObj?.name}</p>
                  <p style={{ marginBottom: '0.5rem' }}><strong>Mode:</strong> {regMode === 'team' ? `Tim (${teamName || 'Tim Saya'})` : 'Individu'}</p>
                  <p style={{ marginBottom: '0.5rem' }}><strong>Jumlah Dokumen Terlampir:</strong> {Object.keys(uploadedFiles).length} Berkas</p>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button className="btn btn-secondary" onClick={() => setWizardStep(3)}>Kembali</button>
                  <button className="btn btn-primary" onClick={handleWizardSubmit}>
                    Submit Pendaftaran Sekarang (Kirim Berkas)
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* PROFILE TAB */}
        {activeNav === 'profile' && (
          <div className="card" style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '1rem' }}>Profil & Akun Saya</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Nama Lengkap</label>
                <input type="text" value={user.name} disabled style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #CBD5E1', backgroundColor: '#F1F5F9' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Email Terverifikasi</label>
                <input type="text" value={user.email} disabled style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #CBD5E1', backgroundColor: '#F1F5F9' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Asal Perguruan Tinggi / Instansi</label>
                <input type="text" value={user.institution} disabled style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #CBD5E1', backgroundColor: '#F1F5F9' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>NIM / ID Identitas</label>
                <input type="text" value={user.idNumber} disabled style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #CBD5E1', backgroundColor: '#F1F5F9' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* REVISION MODAL */}
      {showRevisionModal && selectedRegForRevision && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.7)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '540px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ color: 'var(--deep-navy)' }}>Unggah Berkas Perbaikan (Revisi)</h3>
              <button onClick={() => setShowRevisionModal(false)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ backgroundColor: '#FEF3C7', padding: '1rem', borderRadius: '6px', marginBottom: '1.25rem', fontSize: '0.88rem', color: '#92400E' }}>
              <strong>Catatan Verifikator:</strong> "{selectedRegForRevision.revisionNotes}"
            </div>

            <form onSubmit={handleRevisionSubmit}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Pilih File PDF/Gambar Terbaru</label>
                <input type="file" name="revFile" required style={{ width: '100%', fontSize: '0.9rem' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowRevisionModal(false)}>Batal</button>
                <button type="submit" className="btn btn-primary">Unggah Berkas Revisi Now</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
