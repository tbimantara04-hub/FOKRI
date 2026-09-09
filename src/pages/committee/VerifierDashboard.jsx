import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Search, 
  Filter, 
  FileText, 
  Eye, 
  Lock, 
  UserCheck, 
  MessageSquare,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';

export const VerifierDashboard = () => {
  const { registrations, verifyRegistration, competitions, showToast } = useApp();

  const [selectedCompFilter, setSelectedCompFilter] = useState('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('SUBMITTED');
  const [search, setSearch] = useState('');

  // Review Modal state
  const [selectedReg, setSelectedReg] = useState(null);
  const [decisionReason, setDecisionReason] = useState('');
  const [internalNote, setInternalNote] = useState('');
  const [flaggedDocId, setFlaggedDocId] = useState('');

  const filteredQueue = registrations.filter(r => {
    const matchesComp = selectedCompFilter === 'ALL' || r.competitionId === selectedCompFilter;
    const matchesStatus = selectedStatusFilter === 'ALL' || r.status === selectedStatusFilter;
    const matchesSearch = r.registrationNumber.toLowerCase().includes(search.toLowerCase()) || 
                          r.leaderName.toLowerCase().includes(search.toLowerCase()) || 
                          r.institution.toLowerCase().includes(search.toLowerCase());
    return matchesComp && matchesStatus && matchesSearch;
  });

  const handleDecision = (decision) => {
    if (!selectedReg) return;

    if ((decision === 'REJECTED' || decision === 'REVISION_REQUIRED') && !decisionReason.trim()) {
      showToast('Alasan verifikasi wajib diisi untuk Penolakan atau Minta Revisi!', 'danger');
      return;
    }

    const ok = verifyRegistration(selectedReg.id, decision, decisionReason, flaggedDocId);
    if (ok) {
      setSelectedReg(null);
      setDecisionReason('');
      setInternalNote('');
      setFlaggedDocId('');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>Antrean Verifikasi Berkas (Panitia Verifikator)</h1>
        <p style={{ color: '#64748B' }}>
          Tinjau dokumen pendaftaran peserta, tentukan persetujuan/revisi/penolakan secara akuntabel.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '1rem 1.25rem', marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input 
            type="text"
            placeholder="Cari No. Registrasi / Nama / Instansi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '0.6rem 0.75rem 0.6rem 2.4rem',
              borderRadius: '6px',
              border: '1px solid #CBD5E1',
              fontSize: '0.9rem'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <select 
            value={selectedCompFilter} 
            onChange={(e) => setSelectedCompFilter(e.target.value)}
            style={{ padding: '0.55rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
          >
            <option value="ALL">Semua Kompetisi</option>
            {competitions.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          <select 
            value={selectedStatusFilter} 
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            style={{ padding: '0.55rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
          >
            <option value="ALL">Semua Status</option>
            <option value="SUBMITTED">SUBMITTED (Perlu Ditinjau)</option>
            <option value="UNDER_REVIEW">UNDER REVIEW</option>
            <option value="REVISION_REQUIRED">REVISION REQUIRED</option>
            <option value="APPROVED">APPROVED</option>
            <option value="REJECTED">REJECTED</option>
          </select>
        </div>
      </div>

      {/* Queue Table */}
      <div className="card" style={{ padding: '0', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#0F172A', color: '#FFF', textAlign: 'left' }}>
              <th style={{ padding: '0.85rem 1rem' }}>No. Registrasi</th>
              <th style={{ padding: '0.85rem 1rem' }}>Peserta / Tim</th>
              <th style={{ padding: '0.85rem 1rem' }}>Kompetisi & Kategori</th>
              <th style={{ padding: '0.85rem 1rem' }}>Tanggal Submit</th>
              <th style={{ padding: '0.85rem 1rem' }}>Status</th>
              <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Aksi Review</th>
            </tr>
          </thead>
          <tbody>
            {filteredQueue.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: '#64748B' }}>
                  Tidak ada berkas pendaftaran dalam antrean verifikasi untuk filter ini.
                </td>
              </tr>
            ) : (
              filteredQueue.map(reg => (
                <tr key={reg.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', fontWeight: 700, color: 'var(--ppi-navy)' }}>
                    {reg.registrationNumber}
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <strong style={{ display: 'block', color: 'var(--deep-navy)' }}>
                      {reg.mode === 'team' ? reg.teamName : reg.leaderName}
                    </strong>
                    <span style={{ fontSize: '0.8rem', color: '#64748B' }}>{reg.institution}</span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <strong>{reg.competitionName}</strong>
                    <span style={{ display: 'block', fontSize: '0.8rem', color: '#64748B' }}>{reg.categoryName}</span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem' }}>
                    {reg.submittedAt}
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <StatusBadge status={reg.status} />
                  </td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        setSelectedReg(reg);
                        setDecisionReason(reg.revisionNotes || '');
                      }}
                    >
                      <Eye size={14} /> Review Berkas
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* VERIFICATION REVIEW MODAL */}
      {selectedReg && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '780px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.85rem' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Review Pendaftaran Resmi</span>
                <h3 style={{ color: 'var(--ppi-navy)', fontFamily: 'monospace' }}>{selectedReg.registrationNumber}</h3>
              </div>
              <button onClick={() => setSelectedReg(null)} className="btn btn-secondary btn-sm">Tutup</button>
            </div>

            {/* Registration Details */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem', backgroundColor: 'var(--light-bg)', padding: '1rem', borderRadius: '8px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#64748B', display: 'block' }}>Ketua / Pendaftar</span>
                <strong>{selectedReg.leaderName}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#64748B', display: 'block' }}>Asal Perguruan Tinggi</span>
                <strong>{selectedReg.institution}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#64748B', display: 'block' }}>Cabang / Kategori</span>
                <strong>{selectedReg.competitionName}</strong>
              </div>
            </div>

            {/* Document Verification Section (IDOR Protected URL Simulation) */}
            <h4 style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={18} style={{ color: 'var(--ppi-navy)' }} /> Berkas Lampiran Terverifikasi IDOR-Safe
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {selectedReg.documents.map((doc, idx) => (
                <div key={idx} style={{ border: '1px solid #E2E8F0', padding: '0.85rem', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--deep-navy)' }}>📄 {doc.filename}</strong>
                    <span style={{ display: 'block', fontSize: '0.78rem', color: '#64748B' }}>
                      Versi {doc.version} · Diunggah: {doc.uploadedAt}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '0.78rem', color: '#16A34A', backgroundColor: '#DCFCE7', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>
                      ✓ Signed URL Valid
                    </span>
                    <button className="btn btn-secondary btn-sm" onClick={() => showToast(`Mengunduh dokumen aman: ${doc.filename}`, 'info')}>
                      Unduh & Inspect
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Verification Decision Controls */}
            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1.25rem' }}>
              <h4 style={{ marginBottom: '0.75rem' }}>Keputusan Verifikasi Panitia</h4>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                  Alasan Verifikasi (Wajib untuk Reject & Revision Required):
                </label>
                <textarea 
                  rows={3}
                  placeholder="Tuliskan catatan perbaikan atau alasan penolakan berkas yang jelas untuk peserta..."
                  value={decisionReason}
                  onChange={(e) => setDecisionReason(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                ></textarea>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                  Catatan Internal Panitia (Private - Tidak Terlihat oleh Peserta):
                </label>
                <input 
                  type="text"
                  placeholder="Catatan rahasia untuk sesama verifikator..."
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                <button className="btn btn-danger btn-sm" onClick={() => handleDecision('REJECTED')}>
                  <XCircle size={16} /> REJECT (Tolak Pendaftaran)
                </button>

                <button className="btn btn-primary btn-sm" style={{ backgroundColor: '#D97706', color: '#FFF' }} onClick={() => handleDecision('REVISION_REQUIRED')}>
                  <AlertTriangle size={16} /> REVISION REQUIRED (Minta Revisi)
                </button>

                <button className="btn btn-primary btn-sm" style={{ backgroundColor: '#16A34A', color: '#FFF' }} onClick={() => handleDecision('APPROVED')}>
                  <CheckCircle2 size={16} /> APPROVE (Setujui Pendaftaran)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
