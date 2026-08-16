import React, { useState } from 'react';
import type { CaseOfficerStatus } from '@/types/sustainmentCase';
import { casesService } from '@/lib/data/serviceLayer';
import { CheckCircle2, Wrench, XCircle } from 'lucide-react';

interface DecisionPanelProps {
  caseId: string;
  currentStatus: CaseOfficerStatus;
  currentNotes?: string;
  onDecision?: (status: CaseOfficerStatus) => void;
}

const ACTIONS: { status: CaseOfficerStatus; label: string; icon: React.ElementType; style: { default: React.CSSProperties; active: React.CSSProperties } }[] = [
  {
    status: 'ACCEPTED',
    label: 'Accept Review',
    icon: CheckCircle2,
    style: {
      default: {
        background: 'var(--green-900)',
        border: '1px solid var(--green-800)',
        color: 'var(--green-300)',
      },
      active: {
        background: 'var(--green-700)',
        border: '1px solid var(--green-600)',
        color: '#fff',
      },
    },
  },
  {
    status: 'INSPECTION_SCHEDULED',
    label: 'Schedule Inspection',
    icon: Wrench,
    style: {
      default: {
        background: 'var(--status-high-bg)',
        border: '1px solid var(--status-high-border)',
        color: 'var(--status-high)',
      },
      active: {
        background: 'var(--status-high)',
        border: '1px solid var(--status-high)',
        color: '#fff',
      },
    },
  },
  {
    status: 'DISMISSED',
    label: 'Defer',
    icon: XCircle,
    style: {
      default: {
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-default)',
        color: 'var(--text-secondary)',
      },
      active: {
        background: 'var(--border-strong)',
        border: '1px solid var(--border-strong)',
        color: 'var(--text-primary)',
      },
    },
  },
];

export const DecisionPanel: React.FC<DecisionPanelProps> = ({
  caseId,
  currentStatus,
  currentNotes,
  onDecision,
}) => {
  const [notes, setNotes] = useState(currentNotes ?? '');
  const [status, setStatus] = useState<CaseOfficerStatus>(currentStatus);

  const handleAction = (s: CaseOfficerStatus) => {
    setStatus(s);
    casesService.updateOfficerDecision(caseId, s, notes);
    onDecision?.(s);
  };

  return (
    <div className="space-y-2">
      <span className="section-label">Officer Review Decision</span>

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Add review notes or routing instructions…"
        rows={2}
        className="w-full text-xs px-2.5 py-2 rounded resize-none outline-none transition-colors"
        style={{
          background: 'var(--bg-base)',
          border: '1px solid var(--border-default)',
          color: 'var(--text-primary)',
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--green-700)')}
        onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border-default)')}
      />

      <div className="flex flex-wrap gap-2">
        {ACTIONS.map((action) => {
          const isActive = status === action.status;
          const s = isActive ? action.style.active : action.style.default;
          return (
            <button
              key={action.status}
              onClick={() => handleAction(action.status)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-all"
              style={s}
            >
              <action.icon className="size-3.5" />
              {action.label}
            </button>
          );
        })}
      </div>

      <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
        SETU is advisory only. Officer retains responsibility for all decisions.
      </p>
    </div>
  );
};
