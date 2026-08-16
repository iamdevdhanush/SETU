import React from 'react';
import { ShieldAlert } from 'lucide-react';

interface RiskDistributionProps {
  critical: number;
  high: number;
  moderate: number;
  normal: number;
}

export const RiskDistribution: React.FC<RiskDistributionProps> = ({
  critical,
  high,
  moderate,
  normal
}) => {
  const total = critical + high + moderate + normal || 1;

  const getPercent = (count: number) => Math.round((count / total) * 100);

  return (
    <div className="tactical-card p-5 rounded-lg border border-[#1a2636] bg-[#0f151d] flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <ShieldAlert className="size-4 text-amber-400" /> Fleet Maintenance Risk Distribution
        </span>
        <span className="text-[10px] font-mono text-slate-400">{total} PLATFORMS</span>
      </div>

      {/* Multi-segment Progress Bar */}
      <div className="h-3.5 w-full rounded-full bg-[#141d27] overflow-hidden flex my-2 border border-[#1e2a38]">
        <div style={{ width: `${getPercent(critical)}%` }} className="bg-red-500 transition-all duration-500" title={`Critical: ${critical}`}></div>
        <div style={{ width: `${getPercent(high)}%` }} className="bg-amber-500 transition-all duration-500" title={`High: ${high}`}></div>
        <div style={{ width: `${getPercent(moderate)}%` }} className="bg-cyan-500 transition-all duration-500" title={`Moderate: ${moderate}`}></div>
        <div style={{ width: `${getPercent(normal)}%` }} className="bg-emerald-500 transition-all duration-500" title={`Normal: ${normal}`}></div>
      </div>

      {/* Grid of Risk Breakdown */}
      <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2">
        <div className="p-2 rounded bg-red-500/10 border border-red-500/30 flex items-center justify-between">
          <span className="text-red-400 font-semibold flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-red-500"></span> CRITICAL
          </span>
          <span className="text-slate-100 font-bold">{critical} ({getPercent(critical)}%)</span>
        </div>

        <div className="p-2 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
          <span className="text-amber-400 font-semibold flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-amber-500"></span> HIGH
          </span>
          <span className="text-slate-100 font-bold">{high} ({getPercent(high)}%)</span>
        </div>

        <div className="p-2 rounded bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-between">
          <span className="text-cyan-400 font-semibold flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-cyan-500"></span> MODERATE
          </span>
          <span className="text-slate-100 font-bold">{moderate} ({getPercent(moderate)}%)</span>
        </div>

        <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
          <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-emerald-500"></span> NORMAL
          </span>
          <span className="text-slate-100 font-bold">{normal} ({getPercent(normal)}%)</span>
        </div>
      </div>
    </div>
  );
};
