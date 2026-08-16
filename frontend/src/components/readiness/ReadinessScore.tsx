import React from 'react';
import { Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReadinessScoreProps {
  score: number;
  targetScore?: number;
  criticalCount: number;
  totalAssets: number;
}

export const ReadinessScore: React.FC<ReadinessScoreProps> = ({
  score,
  targetScore = 85,
  criticalCount,
  totalAssets
}) => {
  const getScoreColor = (val: number) => {
    if (val >= 80) return 'text-emerald-400 stroke-emerald-400';
    if (val >= 65) return 'text-amber-400 stroke-amber-400';
    return 'text-red-400 stroke-red-400';
  };

  const scoreColorClass = getScoreColor(score);
  const strokeDashoffset = 283 - (283 * score) / 100;

  return (
    <div className="tactical-card p-5 rounded-lg border border-[#1a2636] bg-[#0f151d] flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Activity className="size-4 text-emerald-400" /> Fleet Readiness Index
        </span>
        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#16202c] text-slate-300 border border-[#1e2a38]">
          TARGET: {targetScore}%
        </span>
      </div>

      <div className="flex items-center justify-around my-4">
        {/* Telemetry Gauge Circle */}
        <div className="relative size-32 flex items-center justify-center">
          <svg className="size-full rotate-[-90deg]" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              className="stroke-[#16202c]"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              className={cn('transition-all duration-1000 ease-out', scoreColorClass)}
              strokeWidth="8"
              strokeDasharray="283"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-bold font-mono text-slate-100">{score}%</span>
            <span className="text-[10px] text-slate-400 font-mono">OPERATIONAL</span>
          </div>
        </div>

        {/* Readiness Highlights */}
        <div className="space-y-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-emerald-400"></div>
            <div>
              <span className="text-slate-400 block text-[10px]">Active Platforms</span>
              <span className="text-slate-100 font-bold">{totalAssets - criticalCount} / {totalAssets}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-red-400 animate-pulse"></div>
            <div>
              <span className="text-slate-400 block text-[10px]">Critical Interventions</span>
              <span className="text-red-400 font-bold">{criticalCount} Assets</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-[#16202c] flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <span>STATUS: {score >= targetScore ? 'OPTIMAL READINESS' : 'ATTENTION REQUIRED'}</span>
        <span className="text-emerald-400">LIVE TELEMETRY</span>
      </div>
    </div>
  );
};
