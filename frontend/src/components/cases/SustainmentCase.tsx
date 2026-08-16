import React, { useState } from 'react';
import type { SustainmentCase as SustainmentCaseType, CaseOfficerStatus } from '@/types/sustainmentCase';
import { casesService } from '@/lib/data/serviceLayer';
import { PredictionEvidence } from './PredictionEvidence';
import type { EvidenceFactor } from './PredictionEvidence';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ChevronRight, CheckCircle2, XCircle, Wrench, Clock, FileText } from 'lucide-react';

interface SustainmentCaseProps {
  sustainmentCase: SustainmentCaseType;
  onDecisionUpdated?: () => void;
}

export const SustainmentCase: React.FC<SustainmentCaseProps> = ({
  sustainmentCase,
  onDecisionUpdated
}) => {
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [officerNotes, setOfficerNotes] = useState(sustainmentCase.officerNotes || '');

  const getStatusBadge = (status: CaseOfficerStatus) => {
    switch (status) {
      case 'ACCEPTED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-sans font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
            <CheckCircle2 className="size-3" /> Accepted Recommendation
          </span>
        );
      case 'INSPECTION_SCHEDULED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-sans font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
            <Wrench className="size-3" /> Inspection Scheduled
          </span>
        );
      case 'DISMISSED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-sans font-semibold bg-slate-700/60 text-slate-400 border border-slate-600/30 flex items-center gap-1">
            <XCircle className="size-3" /> Dismissed
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-sans font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1">
            <Clock className="size-3" /> Needs Review
          </span>
        );
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'CRITICAL':
        return 'bg-red-500/20 text-red-400 border-red-500/40 font-bold';
      case 'HIGH':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold';
      default:
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 font-bold';
    }
  };

  const handleDecision = (status: CaseOfficerStatus) => {
    casesService.updateOfficerDecision(sustainmentCase.id, status, officerNotes);
    if (onDecisionUpdated) onDecisionUpdated();
  };

  // Convert string reasons into evidence factors
  const evidenceFactors: EvidenceFactor[] = sustainmentCase.whyFlagged.map((reason, idx) => ({
    label: `Risk Factor #${idx + 1}`,
    value: reason,
    status: idx === 0 ? 'CRITICAL' : idx === 1 ? 'ELEVATED' : 'APPROACHING'
  }));

  return (
    <div className="workbench-panel font-sans text-xs divide-y divide-[#182332]">
      {/* 1. HEADER: ASSET ID & RISK BADGE */}
      <div className="px-4 py-3 bg-[#121924] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm font-bold text-slate-100 tracking-tight">
            {sustainmentCase.equipmentId}
          </span>
          <span className="text-slate-300 font-medium">
            {sustainmentCase.platformClass}
          </span>
          <span className="text-slate-500 text-[11px] font-mono">
            Case #{sustainmentCase.id}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {getStatusBadge(sustainmentCase.officerStatus)}
          <span className={cn('px-2.5 py-0.5 rounded text-xs border uppercase font-mono', getRiskBadge(sustainmentCase.riskLevel))}>
            {sustainmentCase.riskLevel}
          </span>
        </div>
      </div>

      {/* 2. MAINTENANCE OUTLOOK & RISK/CONFIDENCE METRICS */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Maintenance Outlook Window */}
        <div className="p-3 rounded bg-[#0d141e] border border-[#182332] space-y-1">
          <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">
            MAINTENANCE OUTLOOK
          </span>
          <div className="flex items-center gap-2 font-mono text-xs pt-1">
            <span className="font-bold text-slate-200">{sustainmentCase.expectedWindowDays.split('–')[0]}</span>
            <span className="text-slate-500">───────────────</span>
            <span className="font-bold text-amber-400">{sustainmentCase.expectedWindowDays.split('–')[1] || 'window'}</span>
          </div>
          <span className="text-[10px] text-slate-400 block pt-0.5">predicted window</span>
        </div>

        {/* Risk Probability */}
        <div className="p-3 rounded bg-[#0d141e] border border-[#182332] space-y-1">
          <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">
            MAINTENANCE RISK
          </span>
          <div className="text-lg font-bold font-mono text-red-400">
            {sustainmentCase.maintenanceRiskScore}%
          </div>
          <span className="text-[10px] text-slate-400 block">failure probability</span>
        </div>

        {/* Model Confidence */}
        <div className="p-3 rounded bg-[#0d141e] border border-[#182332] space-y-1">
          <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">
            MODEL CONFIDENCE
          </span>
          <div className="text-lg font-bold font-mono text-emerald-400">
            {sustainmentCase.confidenceScore}%
          </div>
          <span className="text-[10px] text-slate-400 block">calibration score</span>
        </div>
      </div>

      {/* 3. WHY FLAGGED (EVIDENCE BREAKDOWN) */}
      <div className="p-4 space-y-2">
        <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">
          WHY FLAGGED
        </span>
        <div className="space-y-1.5">
          {sustainmentCase.whyFlagged.map((bullet, i) => (
            <div key={i} className="flex items-start justify-between gap-2 p-2 rounded bg-[#0d141e] border border-[#182332] text-xs">
              <span className="text-slate-300">{bullet}</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                ELEVATED
              </span>
            </div>
          ))}
        </div>

        <PredictionEvidence
          factors={evidenceFactors}
          confidenceScore={sustainmentCase.confidenceScore}
        />
      </div>

      {/* 4. SPARE DEPENDENCY */}
      {sustainmentCase.spareImpact.length > 0 && (
        <div className="p-4 space-y-2">
          <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">
            SPARE DEPENDENCY
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {sustainmentCase.spareImpact.map((spare, idx) => (
              <div key={idx} className="p-2.5 rounded bg-[#0d141e] border border-[#182332] flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-slate-200 block">{spare.partName}</span>
                </div>
                <div className="flex items-center gap-3 font-mono text-[11px] shrink-0">
                  <span className="text-slate-400">Stock: <strong className="text-slate-200">{spare.stockQty}</strong></span>
                  <span className="text-slate-400">Req: <strong className="text-slate-200">{spare.needQty}</strong></span>
                  <span className={cn(spare.needQty > spare.stockQty ? 'text-red-400 font-bold' : 'text-emerald-400')}>
                    Gap: {spare.needQty - spare.stockQty}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. SETU ASSESSMENT */}
      <div className="p-4 bg-[#121924] space-y-1">
        <span className="text-[10px] uppercase font-semibold text-emerald-400 tracking-wider block">
          SETU ASSESSMENT (ADVISORY)
        </span>
        <p className="text-slate-200 text-xs leading-relaxed">
          {sustainmentCase.setuRecommendation}
        </p>
      </div>

      {/* 6. OFFICER HUMAN ACTION BAR */}
      <div className="p-4 space-y-3 bg-[#0a0e14]">
        {isNotesOpen && (
          <textarea
            placeholder="Log officer review notes or technician routing instructions..."
            value={officerNotes}
            onChange={(e) => setOfficerNotes(e.target.value)}
            className="w-full p-2 rounded bg-[#101722] border border-[#1e2a38] text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#3e7b57]"
            rows={2}
          />
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            to={`/equipment/${sustainmentCase.equipmentId}`}
            className="px-3 py-1.5 rounded bg-[#16202e] hover:bg-[#1f2d40] text-slate-200 border border-[#243447] text-xs font-medium flex items-center gap-1.5 transition-all"
          >
            <FileText className="size-3.5 text-slate-400" /> Open Engineering Case File <ChevronRight className="size-3" />
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsNotesOpen(!isNotesOpen)}
              className="px-2.5 py-1.5 rounded text-slate-400 hover:text-slate-200 text-xs underline font-medium"
            >
              {isNotesOpen ? 'Hide Note' : 'Add Note'}
            </button>

            <button
              onClick={() => handleDecision('ACCEPTED')}
              className={cn(
                'px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-all',
                sustainmentCase.officerStatus === 'ACCEPTED'
                  ? 'bg-emerald-600 text-white font-bold ring-1 ring-emerald-400'
                  : 'bg-[#1e392a] hover:bg-[#2d5a40] text-emerald-200 border border-[#3e7b57]'
              )}
            >
              <CheckCircle2 className="size-3.5" /> Accept Review
            </button>

            <button
              onClick={() => handleDecision('INSPECTION_SCHEDULED')}
              className={cn(
                'px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-all',
                sustainmentCase.officerStatus === 'INSPECTION_SCHEDULED'
                  ? 'bg-amber-600 text-white font-bold ring-1 ring-amber-400'
                  : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30'
              )}
            >
              <Wrench className="size-3.5" /> Schedule Inspection
            </button>

            <button
              onClick={() => handleDecision('DISMISSED')}
              className={cn(
                'px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-all',
                sustainmentCase.officerStatus === 'DISMISSED'
                  ? 'bg-slate-700 text-white font-bold ring-1 ring-slate-400'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700'
              )}
            >
              <XCircle className="size-3.5" /> Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
