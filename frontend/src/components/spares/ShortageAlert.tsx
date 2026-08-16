import React from 'react';
import type { SparePart } from '@/types/spare';
import { AlertCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface ShortageAlertProps {
  spare: SparePart;
}

export const ShortageAlert: React.FC<ShortageAlertProps> = ({ spare }) => {
  const isCritical = spare.shortageRisk === 'CRITICAL_GAP';

  return (
    <div
      className={cn(
        'p-3.5 rounded-lg border flex flex-col justify-between transition-all',
        isCritical
          ? 'bg-red-500/10 border-red-500/40 text-red-300'
          : 'bg-amber-500/10 border-amber-500/40 text-amber-300'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          {isCritical ? (
            <AlertCircle className="size-4 text-red-400 shrink-0 mt-0.5 animate-pulse" />
          ) : (
            <AlertTriangle className="size-4 text-amber-400 shrink-0 mt-0.5" />
          )}
          <div>
            <h4 className="text-xs font-bold text-slate-100">{spare.name}</h4>
            <span className="text-[10px] font-mono text-slate-400">{spare.partNumber} • {spare.category}</span>
          </div>
        </div>

        <span
          className={cn(
            'px-2 py-0.5 rounded text-[10px] font-mono font-bold border',
            isCritical ? 'bg-red-500/20 text-red-400 border-red-500/40' : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
          )}
        >
          {spare.shortageRisk.replace('_', ' ')}
        </span>
      </div>

      <div className="my-3 p-2 rounded bg-[#0b1119] border border-[#1a2636] grid grid-cols-3 gap-2 text-center text-xs font-mono">
        <div>
          <span className="text-[10px] text-slate-500 block">CURRENT STOCK</span>
          <span className="font-bold text-slate-200">{spare.currentStock}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 block">PREDICTED DEMAND</span>
          <span className="font-bold text-amber-400">{spare.predictedDemand30d}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 block">PROJECTED GAP</span>
          <span className="font-bold text-red-400">-{spare.shortageGap}</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] font-mono pt-1">
        <span className="text-slate-400">Lead Time: <strong className="text-slate-200">{spare.reorderLeadTimeDays} days</strong></span>
        <Link to="/spares" className="text-emerald-400 hover:underline flex items-center gap-1">
          Review Inventory <ArrowRight className="size-3" />
        </Link>
      </div>
    </div>
  );
};
