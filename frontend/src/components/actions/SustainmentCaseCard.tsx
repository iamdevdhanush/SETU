import React, { useState } from 'react';
import type { SustainmentCase, CaseOfficerStatus } from '@/types/sustainmentCase';
import { casesService } from '@/lib/data/serviceLayer';
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Wrench,
  ChevronRight,
  Package,
  Clock,
  UserCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface SustainmentCaseCardProps {
  sustainmentCase: SustainmentCase;
  onDecisionUpdated?: () => void;
  isCompact?: boolean;
}

export const SustainmentCaseCard: React.FC<SustainmentCaseCardProps> = ({
  sustainmentCase,
  onDecisionUpdated,
  isCompact = false
}) => {
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [officerNotes, setOfficerNotes] = useState(sustainmentCase.officerNotes || '');

  const getRiskStyle = (risk: string) => {
    switch (risk) {
      case 'CRITICAL':
        return {
          bg: 'bg-red-500/10 border-red-500/30 text-red-400',
          badge: 'bg-red-500/20 text-red-400 border-red-500/40',
          indicator: 'bg-red-500'
        };
      case 'HIGH':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
          badge: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
          indicator: 'bg-amber-500'
        };
      case 'MODERATE':
        return {
          bg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
          badge: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
          indicator: 'bg-cyan-500'
        };
      default:
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
          indicator: 'bg-emerald-500'
        };
    }
  };

  const riskStyle = getRiskStyle(sustainmentCase.riskLevel);

  const handleDecision = (status: CaseOfficerStatus) => {
    casesService.updateOfficerDecision(sustainmentCase.id, status, officerNotes);
    if (onDecisionUpdated) onDecisionUpdated();
  };

  const getStatusBadge = (status: CaseOfficerStatus) => {
    switch (status) {
      case 'ACCEPTED':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
            <CheckCircle2 className="size-3" /> RECOMMENDATION ACCEPTED
          </span>
        );
      case 'INSPECTION_SCHEDULED':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center gap-1">
            <Wrench className="size-3" /> INSPECTION SCHEDULED
          </span>
        );
      case 'DISMISSED':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-slate-700/50 text-slate-400 border border-slate-600/30 flex items-center gap-1">
            <XCircle className="size-3" /> DISMISSED
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1 animate-pulse">
            <Clock className="size-3" /> PENDING OFFICER REVIEW
          </span>
        );
    }
  };

  return (
    <div className="tactical-card rounded-lg overflow-hidden border border-[#1d2b3c] bg-[#0f151d] hover:border-[#2d425c] transition-all">
      {/* Header: Asset Identification & Risk Level */}
      <div className="px-4 py-3 bg-[#131b26] border-b border-[#1a2636] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className={cn('size-2.5 rounded-full shrink-0', riskStyle.indicator)}></div>
          <div>
            <Link
              to={`/equipment/${sustainmentCase.equipmentId}`}
              className="text-sm font-bold text-slate-100 hover:text-emerald-400 transition-colors flex items-center gap-1.5"
            >
              {sustainmentCase.equipmentName}
              <ChevronRight className="size-3.5 text-slate-500" />
            </Link>
            <span className="text-[11px] text-slate-400 font-mono">
              {sustainmentCase.unitSector} • Case #{sustainmentCase.id}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {getStatusBadge(sustainmentCase.officerStatus)}
          <span className={cn('px-2 py-0.5 rounded text-xs font-mono font-bold border', riskStyle.badge)}>
            {sustainmentCase.riskLevel} RISK ({sustainmentCase.maintenanceRiskScore}%)
          </span>
        </div>
      </div>

      <div className="p-4 space-y-4 text-xs">
        {/* Risk & Window telemetry banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-md bg-[#141d27] border border-[#1d2a3a]">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Maintenance Risk</span>
            <div className="text-base font-bold text-slate-100 font-mono flex items-center gap-1.5 mt-0.5">
              <span>{sustainmentCase.maintenanceRiskScore}%</span>
              <span className="text-[10px] text-slate-400 font-normal">probability</span>
            </div>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Model Confidence</span>
            <div className="text-base font-bold text-emerald-400 font-mono mt-0.5">
              {sustainmentCase.confidenceScore}%
            </div>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Expected Window</span>
            <div className="text-base font-bold text-amber-400 font-mono mt-0.5">
              {sustainmentCase.expectedWindowDays}
            </div>
          </div>
        </div>

        {/* EVIDENCE BREAKDOWN */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-slate-300 font-mono text-[11px] uppercase tracking-wider font-semibold">
            <AlertTriangle className="size-3.5 text-amber-400" /> Why SETU Flagged This Asset
          </div>
          <ul className="space-y-1 pl-1">
            {sustainmentCase.whyFlagged.map((bullet, i) => (
              <li key={i} className="flex items-start gap-2 text-slate-300">
                <span className="size-1 rounded-full bg-amber-400 mt-1.5 shrink-0"></span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* SPARE IMPACT */}
        {sustainmentCase.spareImpact.length > 0 && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-slate-300 font-mono text-[11px] uppercase tracking-wider font-semibold">
              <Package className="size-3.5 text-cyan-400" /> Projected Spares Impact
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {sustainmentCase.spareImpact.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded bg-[#121923] border border-[#1b2738] flex items-center justify-between text-[11px]"
                >
                  <span className="text-slate-300 truncate pr-2">{item.partName}</span>
                  <div className="flex items-center gap-2 shrink-0 font-mono">
                    <span className="text-slate-400">Need: <strong className="text-slate-200">{item.needQty}</strong></span>
                    <span className={cn(item.stockQty < item.needQty ? 'text-red-400 font-bold' : 'text-emerald-400')}>
                      Stock: {item.stockQty}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ADVISORY RECOMMENDATION */}
        <div className="p-3 rounded-md bg-[#16241c] border border-[#2d5a40]/60 space-y-1">
          <div className="flex items-center gap-1.5 text-[#84c59b] font-mono text-[11px] font-bold uppercase">
            <Wrench className="size-3.5" /> SETU Advisory Recommendation
          </div>
          <p className="text-slate-200 leading-relaxed font-sans">
            {sustainmentCase.setuRecommendation}
          </p>
        </div>

        {/* HUMAN OFFICER DECISION ACTION BAR */}
        {!isCompact && (
          <div className="pt-3 border-t border-[#1a2636] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                <UserCheck className="size-3.5 text-emerald-400" /> Duty Officer Decision Workstation
              </span>
              <button
                onClick={() => setIsNotesOpen(!isNotesOpen)}
                className="text-[11px] font-mono text-slate-400 hover:text-slate-200 underline"
              >
                {isNotesOpen ? 'Hide Log Notes' : 'Add Officer Notes'}
              </button>
            </div>

            {isNotesOpen && (
              <textarea
                placeholder="Enter operational notes or technician instructions..."
                value={officerNotes}
                onChange={(e) => setOfficerNotes(e.target.value)}
                className="w-full p-2 rounded bg-[#131b26] border border-[#1e2a38] text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#3e7b57]"
                rows={2}
              />
            )}

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={() => handleDecision('ACCEPTED')}
                className={cn(
                  'px-3 py-1.5 rounded text-xs font-medium font-sans flex items-center gap-1.5 transition-all',
                  sustainmentCase.officerStatus === 'ACCEPTED'
                    ? 'bg-emerald-600 text-white font-bold ring-2 ring-emerald-400'
                    : 'bg-[#1e392a] hover:bg-[#2d5a40] text-emerald-200 border border-[#3e7b57]'
                )}
              >
                <CheckCircle2 className="size-3.5" /> Accept Recommendation
              </button>

              <button
                onClick={() => handleDecision('INSPECTION_SCHEDULED')}
                className={cn(
                  'px-3 py-1.5 rounded text-xs font-medium font-sans flex items-center gap-1.5 transition-all',
                  sustainmentCase.officerStatus === 'INSPECTION_SCHEDULED'
                    ? 'bg-cyan-600 text-white font-bold ring-2 ring-cyan-400'
                    : 'bg-[#142334] hover:bg-[#1e344d] text-cyan-200 border border-cyan-800'
                )}
              >
                <Wrench className="size-3.5" /> Mark for Inspection
              </button>

              <button
                onClick={() => handleDecision('DISMISSED')}
                className={cn(
                  'px-3 py-1.5 rounded text-xs font-medium font-sans flex items-center gap-1.5 transition-all',
                  sustainmentCase.officerStatus === 'DISMISSED'
                    ? 'bg-slate-700 text-white font-bold ring-2 ring-slate-400'
                    : 'bg-[#18202a] hover:bg-[#222c3a] text-slate-400 border border-[#283648]'
                )}
              >
                <XCircle className="size-3.5" /> Dismiss Case
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
