import React, { useState } from 'react';
import { 
  BarChart3, 
  Trophy, 
  FileText, 
  Bell, 
  Award, 
  ShieldCheck, 
  Plus, 
  Edit, 
  Eye, 
  Lock, 
  Users, 
  UserCheck, 
  CheckCircle2, 
  AlertTriangle,
  FileSpreadsheet
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';

export const AdminDashboard = () => {
  const { 
    currentRole, 
    competitions, 
    registrations, 
    announcements, 
    results, 
    auditLogs, 
    resultChangeRequests,
    saveCompetition,
    saveAnnouncement,
    publishResults,
    approveResultChangeRequest,
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState('overview'); // overview, comps, announcements, results, audit

  // Modals state
  const [showCompModal, setShowCompModal] = useState(false);
  const [editingComp, setEditingComp] = useState(null);

  const [showAnnModal, setShowAnnModal] = useState(false);
  const [editingAnn, setEditingAnn] = useState(null);

  const [showResultModal, setShowResultModal] = useState(false);
  const [selectedCompForResults, setSelectedCompForResults] = useState(competitions[0]?.slug);
  const [resultEntries, setResultEntries] = useState([
    { rankLabel: 'Juara 1', participantName: '', institution: '', score: '90.00', scoreVisible: true },
    { rankLabel: 'Juara 2', participantName: '', institution: '', score: '85.00', scoreVisible: true }
  ]);

  // Statistics calculation
  const totalRegistrations = registrations.length;
  const pendingVerification = registrations.filter(r => r.status === 'SUBMITTED' || r.status === 'UNDER_REVIEW').length;
  const approvedCount = registrations.filter(r => r.status === 'APPROVED').length;
  const revisionCount = registrations.filter(r => r.status === 'REVISION_REQUIRED').length;
  const rejectedCount = registrations.filter(r => r.status === 'REJECTED').length;

  // Handle Competition Form Save
  const handleSaveCompSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const compObj = {
      id: editingComp?.id || null,
      name: form.compName.value,
      organizer: form.organizer.value,
      mode: form.mode.value,
      status: form.status.value,
      quota: parseInt(form.quota.value),
      shortDescription: form.shortDescription.value,
      fullDescription: form.fullDescription.value || editingComp?.fullDescription || '',
      eligibilityText: form.eligibilityText.value || editingComp?.eligibilityText || '',
      coverImage: editingComp?.coverImage || "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
      categories: editingComp?.categories || [{ id: 'cat-new', name: 'Kategori Utama', quota: 25, teamMin: 1, teamMax: 3 }],
      schedules: editingComp?.schedules || [{ label: 'Pembukaan', date: '01 September 2026' }],
      documentRequirements: editingComp?.documentRequirements || [
        { id: 'docreq-new', name: 'KTM / ID Card', appliesTo: 'both', required: true, maxCount: 1, allowedFormats: 'PDF, JPG', maxSizeMb: 5 }
      ],
      prizes: editingComp?.prizes || [{ rank: 'Juara 1', prize: 'Rp 5.000.000' }],
      rules: editingComp?.rules || 'Format standar kompetisi FOKRI GAMES XII'
    };

    saveCompetition(compObj);
    setShowCompModal(false);
    setEditingComp(null);
  };

  // Handle Announcement Form Save
  const handleSaveAnnSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const annObj = {
      id: editingAnn?.id || null,
      title: form.annTitle.value,
      category: form.annCategory.value,
      content: form.annContent.value,
      pinned: form.annPinned.checked,
      competitionId: form.annCompId.value || null
    };

    saveAnnouncement(annObj);
    setShowAnnModal(false);
    setEditingAnn(null);
  };

  // CSV Export simulation (PRD Section 12 FR-DASH & Section 36 SHOULD HAVE)
  const exportCsv = () => {
    showToast('Exporting dataset pendaftaran resmi ke format CSV...', 'success');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '0.25rem' }}>
            Panel Control Admin ({currentRole === 'SUPER_ADMIN' ? 'Super Admin' : 'Competition Admin'})
          </h1>
          <p style={{ color: '#64748B' }}>
            Manajemen kompetisi, pengumuman, audit log, serta persetujuan publikasi hasil kejuaraan.
          </p>
        </div>

        <button className="btn btn-secondary btn-sm" onClick={exportCsv}>
          <FileSpreadsheet size={16} /> Export Data CSV
        </button>
      </div>

      {/* Admin Navigation Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid #E2E8F0', marginBottom: '1.75rem', overflowX: 'auto' }}>
        {[
          { id: 'overview', label: 'Ringkasan & Statistik', icon: BarChart3 },
          { id: 'comps', label: 'Manajemen Kompetisi', icon: Trophy },
          { id: 'announcements', label: 'Manajemen Pengumuman', icon: Bell },
          { id: 'results', label: 'Hasil & Elevated Approval', icon: Award },
          { id: 'audit', label: 'Log Audit Sistem (Tamper-Proof)', icon: ShieldCheck }
        ].map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                padding: '0.75rem 1.25rem',
                border: 'none',
                background: 'none',
                borderBottom: activeTab === t.id ? '3px solid var(--ppi-navy)' : '3px solid transparent',
                color: activeTab === t.id ? 'var(--ppi-navy)' : '#64748B',
                fontWeight: activeTab === t.id ? 700 : 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.95rem',
                whiteSpace: 'nowrap'
              }}
            >
              <Icon size={16} /> {t.label}
              {t.id === 'results' && resultChangeRequests.length > 0 && (
                <span className="badge badge-revision" style={{ fontSize: '0.7rem' }}>{resultChangeRequests.length}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
            <div className="card" style={{ padding: '1.25rem' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748B' }}>Total Pendaftaran</span>
              <h2 style={{ fontSize: '2.2rem', color: 'var(--ppi-navy)' }}>{totalRegistrations}</h2>
            </div>

            <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #2563EB' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748B' }}>Menunggu Verifikasi</span>
              <h2 style={{ fontSize: '2.2rem', color: '#2563EB' }}>{pendingVerification}</h2>
              <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Antrean Paling Lama: 2 hari</span>
            </div>

            <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #16A34A' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748B' }}>Disetujui (Approved)</span>
              <h2 style={{ fontSize: '2.2rem', color: '#16A34A' }}>{approvedCount}</h2>
            </div>

            <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #D97706' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748B' }}>Perlu Revisi (Revision)</span>
              <h2 style={{ fontSize: '2.2rem', color: '#D97706' }}>{revisionCount}</h2>
            </div>

            <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #DC2626' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748B' }}>Ditolak (Rejected)</span>
              <h2 style={{ fontSize: '2.2rem', color: '#DC2626' }}>{rejectedCount}</h2>
            </div>
          </div>
        </div>
      )}

      {/* COMPETITION MANAGER TAB */}
      {activeTab === 'comps' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3>Konfigurasi Cabang Kompetisi</h3>
            <button className="btn btn-primary btn-sm" onClick={() => { setEditingComp(null); setShowCompModal(true); }}>
              <Plus size={16} /> Buat Kompetisi Baru
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {competitions.map(c => (
              <div key={c.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <StatusBadge status={c.status} />
                    <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Mode: {c.mode}</span>
                  </div>
                  <h4 style={{ fontSize: '1.15rem', color: 'var(--deep-navy)' }}>{c.name}</h4>
                  <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
                    Penyelenggara: {c.organizer} · Kuota: {c.currentRegistrations}/{c.quota}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      setEditingComp(c);
                      setShowCompModal(true);
                    }}
                  >
                    <Edit size={14} /> Edit Konfigurasi
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ANNOUNCEMENT MANAGER TAB */}
      {activeTab === 'announcements' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3>Manajemen Pengumuman Resmi</h3>
            <button className="btn btn-primary btn-sm" onClick={() => { setEditingAnn(null); setShowAnnModal(true); }}>
              <Plus size={16} /> Terbitkan Pengumuman Baru
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {announcements.map(a => (
              <div key={a.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <span className="badge badge-submitted">{a.category}</span>
                    {a.pinned && <span className="badge badge-revision">PINNED EMERGENCY</span>}
                  </div>
                  <h4 style={{ color: 'var(--deep-navy)' }}>{a.title}</h4>
                  <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Tanggal: {a.publishedAt}</span>
                </div>

                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setEditingAnn(a);
                    setShowAnnModal(true);
                  }}
                >
                  <Edit size={14} /> Edit
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RESULTS & ELEVATED APPROVAL TAB */}
      {activeTab === 'results' && (
        <div>
          {/* Elevated Approval Panel for Super Admin (PRD Section 8.3) */}
          {resultChangeRequests.length > 0 && (
            <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem', backgroundColor: '#FEF3C7', borderLeft: '4px solid #D97706' }}>
              <h3 style={{ color: '#92400E', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={20} /> Permintaan Persetujuan Perubahan Hasil Post-Publikasi (Elevated Approval)
              </h3>

              {resultChangeRequests.map(req => (
                <div key={req.id} style={{ backgroundColor: '#FFF', padding: '1rem', borderRadius: '6px', marginBottom: '0.75rem' }}>
                  <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                    Admin <strong>{req.requestedBy}</strong> meminta pembaruan hasil terbit untuk kompetisi slug: <code>{req.competitionId}</code> pada {req.requestedAt}.
                  </p>

                  {currentRole === 'SUPER_ADMIN' ? (
                    <button className="btn btn-primary btn-sm" onClick={() => approveResultChangeRequest(req.id)}>
                      <CheckCircle2 size={16} /> Disetujui & Terapkan Perubahan (Super Admin Only)
                    </button>
                  ) : (
                    <span style={{ fontSize: '0.82rem', color: '#B45309', fontWeight: 600 }}>
                      Menunggu persetujuan Super Admin...
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3>Entri & Publikasi Hasil Kejuaraan</h3>
            <button className="btn btn-primary btn-sm" onClick={() => setShowResultModal(true)}>
              <Plus size={16} /> Entri Hasil Baru
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {results.map(r => (
              <div key={r.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <StatusBadge status={r.status} />
                    <h4 style={{ fontSize: '1.15rem', color: 'var(--deep-navy)', marginTop: '0.35rem' }}>{r.competitionName}</h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AUDIT LOG TRAIL TAB (PRD Section 35) */}
      {activeTab === 'audit' && (
        <div className="card" style={{ padding: '0', overflowX: 'auto' }}>
          <div style={{ padding: '1.25rem', borderBottom: '1px solid #E2E8F0', backgroundColor: '#0F172A', color: '#FFF' }}>
            <h3 style={{ color: '#FFF', fontSize: '1.1rem' }}>Audit Trail Sistem (Append-Only Log)</h3>
            <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Seluruh tindakan administratif dicatat secara permanen tanpa opsi hapus.</span>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', textAlign: 'left', borderBottom: '2px solid #E2E8F0' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Waktu</th>
                <th style={{ padding: '0.75rem 1rem' }}>Aktor</th>
                <th style={{ padding: '0.75rem 1rem' }}>Tindakan (Action)</th>
                <th style={{ padding: '0.75rem 1rem' }}>Target</th>
                <th style={{ padding: '0.75rem 1rem' }}>Detail Operasi</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map(log => (
                <tr key={log.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.8rem', color: '#64748B' }}>{log.timestamp}</td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{log.actor}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <code style={{ backgroundColor: '#EFF6FF', color: '#2563EB', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>{log.action}</code>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{log.target}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#475569' }}>{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* COMPETITION MODAL */}
      {showCompModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '650px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3>{editingComp ? 'Edit Konfigurasi Kompetisi' : 'Buat Cabang Kompetisi Baru'}</h3>
            <form onSubmit={handleSaveCompSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Nama Cabang Kompetisi</label>
                <input type="text" name="compName" defaultValue={editingComp?.name || ''} required style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #CBD5E1' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Penyelenggara</label>
                <input type="text" name="organizer" defaultValue={editingComp?.organizer || 'Panitia FOKRI GAMES XII'} required style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #CBD5E1' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Format</label>
                  <select name="mode" defaultValue={editingComp?.mode || 'team'} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}>
                    <option value="team">Tim</option>
                    <option value="individual">Individu</option>
                    <option value="either">Individu / Tim</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Status</label>
                  <select name="status" defaultValue={editingComp?.status || 'REGISTRATION_OPEN'} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}>
                    <option value="DRAFT">DRAFT</option>
                    <option value="PUBLISHED">PUBLISHED</option>
                    <option value="REGISTRATION_OPEN">REGISTRATION_OPEN</option>
                    <option value="REGISTRATION_CLOSED">REGISTRATION_CLOSED</option>
                    <option value="RESULTS_PUBLISHED">RESULTS_PUBLISHED</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Kuota Slot</label>
                  <input type="number" name="quota" defaultValue={editingComp?.quota || 50} required style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #CBD5E1' }} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Deskripsi Singkat</label>
                <textarea name="shortDescription" defaultValue={editingComp?.shortDescription || ''} rows={2} required style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}></textarea>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Deskripsi Lengkap</label>
                <textarea name="fullDescription" defaultValue={editingComp?.fullDescription || ''} rows={3} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}></textarea>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Kriteria Kelayakan (Eligibility)</label>
                <textarea name="eligibilityText" defaultValue={editingComp?.eligibilityText || ''} rows={2} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}></textarea>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowCompModal(false)}>Batal</button>
                <button type="submit" className="btn btn-primary">Simpan Konfigurasi</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ANNOUNCEMENT MODAL */}
      {showAnnModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '600px', padding: '2rem' }}>
            <h3>{editingAnn ? 'Edit Pengumuman' : 'Terbitkan Pengumuman Baru'}</h3>
            <form onSubmit={handleSaveAnnSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Judul Pengumuman</label>
                <input type="text" name="annTitle" defaultValue={editingAnn?.title || ''} required style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #CBD5E1' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Kategori</label>
                  <select name="annCategory" defaultValue={editingAnn?.category || 'General'} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}>
                    <option value="Emergency">Emergency (Darurat)</option>
                    <option value="Technical Meeting">Technical Meeting</option>
                    <option value="Registration">Registration</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Kompetisi Terkait (Opsional)</label>
                  <select name="annCompId" defaultValue={editingAnn?.competitionId || ''} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}>
                    <option value="">Global / Semua</option>
                    {competitions.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Isi Konten Pengumuman</label>
                <textarea name="annContent" defaultValue={editingAnn?.content || ''} rows={4} required style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}></textarea>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input type="checkbox" id="annPinned" name="annPinned" defaultChecked={editingAnn?.pinned || false} />
                <label htmlFor="annPinned" style={{ fontSize: '0.88rem', fontWeight: 600 }}>Sematkan sebagai Banner Darurat (Emergency Pinned Banner)</label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAnnModal(false)}>Batal</button>
                <button type="submit" className="btn btn-primary">Terbitkan Pengumuman</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESULTS ENTRY MODAL */}
      {showResultModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '650px', padding: '2rem' }}>
            <h3>Entri & Publikasi Hasil Kejuaraan</h3>
            <div style={{ marginTop: '1rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Pilih Cabang Kompetisi</label>
              <select value={selectedCompForResults} onChange={(e) => setSelectedCompForResults(e.target.value)} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #CBD5E1', marginBottom: '1rem' }}>
                {competitions.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
              </select>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {resultEntries.map((e, idx) => (
                  <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr', gap: '0.5rem' }}>
                    <input type="text" value={e.rankLabel} onChange={(ev) => {
                      const copy = [...resultEntries];
                      copy[idx].rankLabel = ev.target.value;
                      setResultEntries(copy);
                    }} placeholder="Gelar Juara" style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #CBD5E1' }} />

                    <input type="text" value={e.participantName} onChange={(ev) => {
                      const copy = [...resultEntries];
                      copy[idx].participantName = ev.target.value;
                      setResultEntries(copy);
                    }} placeholder="Nama Peserta / Tim" style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #CBD5E1' }} />

                    <input type="text" value={e.institution} onChange={(ev) => {
                      const copy = [...resultEntries];
                      copy[idx].institution = ev.target.value;
                      setResultEntries(copy);
                    }} placeholder="Instansi" style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #CBD5E1' }} />
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button className="btn btn-secondary" onClick={() => setShowResultModal(false)}>Batal</button>
                <button className="btn btn-primary" onClick={() => {
                  publishResults(selectedCompForResults, resultEntries);
                  setShowResultModal(false);
                }}>
                  Publikasikan Hasil Resmi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
