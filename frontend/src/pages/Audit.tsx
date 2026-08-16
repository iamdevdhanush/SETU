import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { auditService, subscribeDataChanges } from '@/lib/data/serviceLayer';
import { History, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export const AuditPage: React.FC = () => {
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsubscribe = subscribeDataChanges(() => setTick((t) => t + 1));
    return () => {
      unsubscribe();
    };
  }, []);

  const auditEntries = auditService.getEntries();

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <PageHeader
        title="Audit Trail & Decision Governance Log"
        subtitle="Immutable chronological log recording machine predictions, model evidence, officer decisions, and verified operational outcomes."
        breadcrumbs={[{ label: 'Audit Trail' }]}
        statusBadge={
          <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-semibold flex items-center gap-1.5">
            <ShieldCheck className="size-4" /> AUDIT COMPLIANT
          </span>
        }
      />

      <div className="tactical-card rounded-lg overflow-hidden border border-[#1a2636] bg-[#0f151d] p-5 space-y-4">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <History className="size-4 text-emerald-400" /> Chronological Governance Log
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#131b26] border-b border-[#1a2636] text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="p-3">Log Timestamp</th>
                <th className="p-3">Audit ID</th>
                <th className="p-3">Case / Asset</th>
                <th className="p-3">Risk Score</th>
                <th className="p-3">Prediction Telemetry Evidence</th>
                <th className="p-3">Officer Decision</th>
                <th className="p-3">Verified Operational Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#182332] text-slate-300">
              {auditEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-[#141d27] transition-colors">
                  <td className="p-3 text-slate-400 whitespace-nowrap">{entry.timestamp}</td>
                  <td className="p-3 font-bold text-slate-100">{entry.id}</td>
                  <td className="p-3">
                    <span className="font-bold text-slate-200 block">{entry.equipmentId}</span>
                    <span className="text-[10px] text-slate-500">{entry.caseId}</span>
                  </td>
                  <td className="p-3 font-bold text-amber-400">{entry.predictedRiskScore}%</td>
                  <td className="p-3 text-slate-300 max-w-xs truncate">{entry.predictionDetails}</td>
                  <td className="p-3">
                    <span className={cn(
                      'px-2 py-0.5 rounded text-[10px] font-bold border',
                      entry.officerDecision === 'ACCEPTED' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                      entry.officerDecision === 'INSPECTION_SCHEDULED' ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' :
                      entry.officerDecision === 'DISMISSED' ? 'bg-slate-700 text-slate-300 border-slate-600' :
                      'bg-amber-500/20 text-amber-400 border-amber-500/30'
                    )}>
                      {entry.officerDecision.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-3 text-slate-400">{entry.actualOutcome}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
