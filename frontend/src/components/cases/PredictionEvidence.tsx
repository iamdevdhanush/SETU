import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface EvidenceFactor {
  label: string;
  value: string;
  baseline?: string;
  status: 'CRITICAL' | 'ELEVATED' | 'APPROACHING' | 'NOMINAL';
}

interface PredictionEvidenceProps {
  factors: EvidenceFactor[];
  confidenceScore: number;
  dataCoverage?: string;
  isInitiallyOpen?: boolean;
}

export const PredictionEvidence: React.FC<PredictionEvidenceProps> = ({
  factors,
  confidenceScore,
  dataCoverage = 'Good (48hr resolution)',
  isInitiallyOpen = false
}) => {
  const [isOpen, setIsOpen] = useState(isInitiallyOpen);

  const getStatusBadge = (status: EvidenceFactor['status']) => {
    switch (status) {
      case 'CRITICAL':
        return 'bg-red-500/20 text-red-400 border-red-500/40';
      case 'ELEVATED':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'APPROACHING':
        return 'bg-slate-700 text-slate-300 border-slate-600';
      default:
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    }
  };

  return (
    <div className="border border-[#1a2636] rounded bg-[#0d141e] font-sans text-xs overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 bg-[#121924] hover:bg-[#151e2b] flex items-center justify-between text-left font-medium text-slate-200 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Info className="size-3.5 text-amber-400 shrink-0" />
          <span className="font-semibold uppercase tracking-wider text-[11px] text-slate-300">
            Prediction Evidence Breakdown (Why Flagged)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-400">
            Confidence: <strong className="text-emerald-400 font-bold">{confidenceScore}%</strong>
          </span>
          {isOpen ? <ChevronUp className="size-3.5 text-slate-400" /> : <ChevronDown className="size-3.5 text-slate-400" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-3 space-y-3 border-t border-[#182332]">
          <div className="space-y-2">
            {factors.map((f, idx) => (
              <div
                key={idx}
                className="p-2 rounded bg-[#101722] border border-[#182332] flex flex-wrap items-center justify-between gap-2 text-xs"
              >
                <div>
                  <span className="font-semibold text-slate-200 block">{f.label}</span>
                  <span className="text-slate-400 text-[11px]">
                    Current: <strong className="text-slate-200 font-mono">{f.value}</strong>
                    {f.baseline && <span className="text-slate-500 ml-1.5">(Baseline: {f.baseline})</span>}
                  </span>
                </div>
                <span className={cn('px-2 py-0.5 rounded text-[10px] font-mono font-bold border', getStatusBadge(f.status))}>
                  {f.status}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#182332] text-[10px] font-mono text-slate-400">
            <span>DATA COVERAGE: <strong className="text-slate-300">{dataCoverage}</strong></span>
            <span>SYNTHETIC INFERENCE MODEL v2.4</span>
          </div>
        </div>
      )}
    </div>
  );
};
