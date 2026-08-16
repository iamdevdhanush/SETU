import React, { useState, useEffect } from 'react';
import { auditService, subscribeDataChanges } from '@/lib/data/serviceLayer';
import { StatusBadge } from '@/components/common/StatusBadge';
import type { CaseOfficerStatus } from '@/types/sustainmentCase';
import { Clock } from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsub = subscribeDataChanges(() => setTick((t) => t + 1));
    return unsub;
  }, []);

  const entries = auditService.getEntries();

  return (
    <div className="h-full overflow-y-auto p-5 space-y-5 max-w-[1600px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Historical Decision Log
          </h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Chronological log of officer decisions with verification outcomes.
          </p>
        </div>
        <span
          className="text-[10px] font-mono px-2.5 py-1 rounded"
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-default)',
            color: 'var(--text-muted)',
          }}
        >
          SYNTHETIC AUDIT TRAIL
        </span>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded" style={{ border: '1px solid var(--border-subtle)' }}>
        <div
          className="flex items-center gap-1.5 px-4 py-3"
          style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)' }}
        >
          <Clock className="size-3.5" style={{ color: 'var(--green-400)' }} />
          <span className="section-label">Historical Records — {entries.length} entries</span>
        </div>
        <table className="w-full text-left text-xs border-collapse">
          <thead style={{ background: 'var(--bg-elevated)' }}>
            <tr>
              {['Date & Time', 'Case ID', 'Asset ID', 'Prediction Details', 'Risk Score', 'Officer Decision', 'Verified Outcome'].map((h) => (
                <th
                  key={h}
                  className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider"
                  style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id} className="list-row">
                <td className="px-4 py-3 font-mono whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
                  {entry.timestamp}
                </td>
                <td className="px-4 py-3 font-mono font-bold" style={{ color: 'var(--text-primary)' }}>
                  {entry.caseId}
                </td>
                <td className="px-4 py-3 font-mono" style={{ color: 'var(--text-secondary)' }}>
                  {entry.equipmentId}
                </td>
                <td className="px-4 py-3 max-w-xs" style={{ color: 'var(--text-secondary)' }}>
                  <span className="truncate block">{entry.predictionDetails}</span>
                </td>
                <td className="px-4 py-3 font-mono font-bold" style={{ color: 'var(--status-warning)' }}>
                  {entry.predictedRiskScore}%
                </td>
                <td className="px-4 py-3">
                  <StatusBadge variant={entry.officerDecision as CaseOfficerStatus} />
                </td>
                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>
                  {entry.actualOutcome}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
