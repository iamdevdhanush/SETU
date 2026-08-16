import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { TrendingUp } from 'lucide-react';

const mockTrendData = [
  { day: 'W1', historical: 78, projected: 78 },
  { day: 'W2', historical: 76, projected: 76 },
  { day: 'W3', historical: 79, projected: 79 },
  { day: 'W4', historical: 74, projected: 74 },
  { day: 'W5 (Now)', historical: 74, projected: 74 },
  { day: '+7d', projected: 71 },
  { day: '+14d', projected: 68 },
  { day: '+30d', projected: 64 },
  { day: '+45d', projected: 61 }
];

export const ReadinessTrend: React.FC = () => {
  return (
    <div className="tactical-card p-5 rounded-lg border border-[#1a2636] bg-[#0f151d] flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <TrendingUp className="size-4 text-emerald-400" /> Projected Readiness Trajectory (30-Day Window)
        </span>
        <span className="text-[10px] font-mono text-slate-500">
          WITHOUT INTERVENTION
        </span>
      </div>

      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={mockTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="readinessGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3e7b57" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3e7b57" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#182332" />
            <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
            <YAxis domain={[50, 100]} stroke="#64748b" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f151d', borderColor: '#1e2a38', fontSize: '11px', fontFamily: 'monospace' }}
              labelStyle={{ color: '#94a3b8' }}
            />
            <Area type="monotone" dataKey="projected" stroke="#4e9c6e" strokeWidth={2} fillOpacity={1} fill="url(#readinessGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="pt-3 border-t border-[#16202c] flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <span>PROJECTED DEGRADATION: <strong className="text-amber-400">-13% in 45 days</strong></span>
        <span className="text-slate-500">ML INFERENCE MODEL</span>
      </div>
    </div>
  );
};
