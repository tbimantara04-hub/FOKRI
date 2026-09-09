import React from 'react';
import { Clock, CheckCircle2, AlertTriangle, XCircle, FileText, Ban } from 'lucide-react';

export const StatusBadge = ({ status }) => {
  const configs = {
    DRAFT: { label: 'DRAFT', class: 'badge-draft', icon: FileText },
    SUBMITTED: { label: 'SUBMITTED', class: 'badge-submitted', icon: Clock },
    UNDER_REVIEW: { label: 'UNDER REVIEW', class: 'badge-review', icon: Clock },
    REVISION_REQUIRED: { label: 'PERLU REVISI', class: 'badge-revision', icon: AlertTriangle },
    APPROVED: { label: 'APPROVED', class: 'badge-approved', icon: CheckCircle2 },
    REJECTED: { label: 'REJECTED', class: 'badge-rejected', icon: XCircle },
    CANCELLED: { label: 'DIBATALKAN', class: 'badge-cancelled', icon: Ban },
    WITHDRAWN_COMPETITION_CANCELLED: { label: 'KOMPETISI BATAL', class: 'badge-cancelled', icon: Ban },
    
    // Competition statuses
    REGISTRATION_OPEN: { label: 'PENDAFTARAN DIBUKA', class: 'badge-approved', icon: CheckCircle2 },
    REGISTRATION_CLOSED: { label: 'PENDAFTARAN DITUTUP', class: 'badge-draft', icon: Clock },
    ONGOING: { label: 'BERLANGSUNG', class: 'badge-review', icon: Clock },
    COMPLETED: { label: 'SELESAI', class: 'badge-draft', icon: CheckCircle2 },
    RESULTS_PUBLISHED: { label: 'HASIL DITERBITKAN', class: 'badge-approved', icon: CheckCircle2 }
  };

  const config = configs[status] || { label: status, class: 'badge-draft', icon: FileText };
  const Icon = config.icon;

  return (
    <span className={`badge ${config.class}`}>
      <Icon size={12} />
      <span>{config.label}</span>
    </span>
  );
};
