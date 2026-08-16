import React from 'react';
import type { RiskLevel } from '@/types/equipment';
import type { CaseOfficerStatus } from '@/types/sustainmentCase';
import type { ShortageRiskLevel } from '@/types/spare';

type BadgeVariant =
  | RiskLevel
  | CaseOfficerStatus
  | ShortageRiskLevel
  | 'OPERATIONAL'
  | 'DEGRADED'
  | 'MAINTENANCE_REQUIRED'
  | 'UNDER_INSPECTION';

const CONFIG: Record<BadgeVariant, { label: string; bg: string; color: string; border: string }> = {
  // Risk levels
  CRITICAL:              { label: 'Critical',    bg: 'var(--status-critical-bg)',  color: 'var(--status-critical)',  border: 'var(--status-critical-border)' },
  HIGH:                  { label: 'High',         bg: 'var(--status-high-bg)',      color: 'var(--status-high)',      border: 'var(--status-high-border)' },
  MODERATE:              { label: 'Moderate',     bg: 'var(--status-warning-bg)',   color: 'var(--status-warning)',   border: 'var(--status-warning-border)' },
  NORMAL:                { label: 'Normal',       bg: 'var(--status-healthy-bg)',   color: 'var(--status-healthy)',   border: 'var(--status-healthy-border)' },
  // Officer statuses
  PENDING_REVIEW:        { label: 'Needs Review', bg: 'var(--status-warning-bg)',   color: 'var(--status-warning)',   border: 'var(--status-warning-border)' },
  ACCEPTED:              { label: 'Accepted',     bg: 'var(--status-healthy-bg)',   color: 'var(--status-healthy)',   border: 'var(--status-healthy-border)' },
  DISMISSED:             { label: 'Deferred',     bg: 'var(--status-info-bg)',      color: 'var(--status-info)',      border: 'var(--status-info-border)' },
  INSPECTION_SCHEDULED:  { label: 'Inspection',   bg: 'var(--status-high-bg)',      color: 'var(--status-high)',      border: 'var(--status-high-border)' },
  // Spare shortage
  CRITICAL_GAP:          { label: 'Critical Gap', bg: 'var(--status-critical-bg)',  color: 'var(--status-critical)',  border: 'var(--status-critical-border)' },
  HIGH_RISK:             { label: 'High Risk',    bg: 'var(--status-high-bg)',      color: 'var(--status-high)',      border: 'var(--status-high-border)' },
  SUFFICIENT:            { label: 'Sufficient',   bg: 'var(--status-healthy-bg)',   color: 'var(--status-healthy)',   border: 'var(--status-healthy-border)' },
  // Equipment condition
  OPERATIONAL:           { label: 'Operational',  bg: 'var(--status-healthy-bg)',   color: 'var(--status-healthy)',   border: 'var(--status-healthy-border)' },
  DEGRADED:              { label: 'Degraded',     bg: 'var(--status-warning-bg)',   color: 'var(--status-warning)',   border: 'var(--status-warning-border)' },
  MAINTENANCE_REQUIRED:  { label: 'Maintenance',  bg: 'var(--status-critical-bg)',  color: 'var(--status-critical)',  border: 'var(--status-critical-border)' },
  UNDER_INSPECTION:      { label: 'Inspection',   bg: 'var(--status-high-bg)',      color: 'var(--status-high)',      border: 'var(--status-high-border)' },
};

interface StatusBadgeProps {
  variant: BadgeVariant;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ variant, className }) => {
  const cfg = CONFIG[variant] ?? CONFIG.NORMAL;
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${className ?? ''}`}
      style={{ background: cfg.bg, color: cfg.color, borderColor: cfg.border }}
    >
      {cfg.label}
    </span>
  );
};
