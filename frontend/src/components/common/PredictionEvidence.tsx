import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export interface EvidenceFactor {
  label: string;
  value: string;
  baseline?: string;
  status: 'CRITICAL' | 'ELEVATED' | 'APPROACHING' | 'NOMINAL';
}

const STATUS_COLORS: Record<EvidenceFactor['status'], { color: string; bg: string; border: string }> = {
  CRITICAL:   { color: 'var(--status-critical)',  bg: 'var(--status-critical-bg)',  border: 'var(--status-critical-border)' },
  ELEVATED:   { color: 'var(--status-warning)',   bg: 'var(--status-warning-bg)',   border: 'var(--status-warning-border)' },
  APPROACHING:{ color: 'var(--status-high)',      bg: 'var(--status-high-bg)',      border: 'var(--status-high-border)' },
  NOMINAL:    { color: 'var(--status-healthy)',   bg: 'var(--status-healthy-bg)',   border: 'var(--status-healthy-border)' },
};

interface PredictionEvidenceProps {
  factors: EvidenceFactor[];
  confidenceScore: number;
  defaultOpen?: boolean;
}

export const PredictionEvidence: React.FC<PredictionEvidenceProps> = ({
  factors,
  confidenceScore,
  defaultOpen = false,
}) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded overflow-hidden" style={{ border: '1px solid var(--border-subtle)' }}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-3 py-2.5 text-left transition-colors"
        style={{ background: 'var(--bg-elevated)' }}
      >
        <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
          Prediction Evidence — Why Flagged
        </span>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-mono" style={{ color: 'var(--text-muted)' }}>
            Confidence: <strong style={{ color: 'var(--status-healthy)' }}>{confidenceScore}%</strong>
          </span>
          {open
            ? <ChevronUp className="size-3.5" style={{ color: 'var(--text-muted)' }} />
            : <ChevronDown className="size-3.5" style={{ color: 'var(--text-muted)' }} />}
        </div>
      </button>

      {open && (
        <div className="px-3 pb-3 pt-2 space-y-2" style={{ background: 'var(--bg-base)' }}>
          {factors.map((f, i) => {
            const sc = STATUS_COLORS[f.status];
            return (
              <div
                key={i}
                className="flex items-center justify-between gap-2 px-2.5 py-2 rounded text-xs"
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
              >
                <div className="min-w-0">
                  <div className="font-medium" style={{ color: 'var(--text-primary)' }}>{f.label}</div>
                  <div style={{ color: 'var(--text-secondary)' }}>
                    {f.value}
                    {f.baseline && (
                      <span className="ml-2 font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>
                        (baseline: {f.baseline})
                      </span>
                    )}
                  </div>
                </div>
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded border shrink-0"
                  style={{ background: sc.bg, color: sc.color, borderColor: sc.border }}
                >
                  {f.status}
                </span>
              </div>
            );
          })}
          <div
            className="text-[10px] font-mono pt-1"
            style={{ color: 'var(--text-muted)' }}
          >
            SYNTHETIC INFERENCE MODEL v2.4 · DATA COVERAGE: Good
          </div>
        </div>
      )}
    </div>
  );
};
