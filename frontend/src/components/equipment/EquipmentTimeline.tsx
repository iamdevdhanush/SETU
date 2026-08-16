import React from 'react';
import type { MaintenanceEvent } from '@/types/equipment';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

interface EquipmentTimelineProps {
  history: MaintenanceEvent[];
  predictedWindow: { min: number; max: number };
}

export const EquipmentTimeline: React.FC<EquipmentTimelineProps> = ({
  history,
  predictedWindow
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="text-slate-400 font-semibold uppercase tracking-wider">
          Life-Cycle Maintenance & Prediction Timeline
        </span>
        <span className="text-slate-500">CHRONOLOGICAL HISTORY</span>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#1e2a38]">
        {/* Past Events */}
        {history.map((evt) => (
          <div key={evt.id} className="relative flex items-start justify-between gap-4 text-xs font-mono">
            <span className="absolute -left-6 top-0.5 size-4 rounded-full bg-[#16202c] border border-[#3e7b57] flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="size-3" />
            </span>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-200">{evt.eventType.replace('_', ' ')}</span>
                <span className="text-[10px] text-slate-500">{evt.date}</span>
              </div>
              <p className="text-slate-400 font-sans text-xs">{evt.description}</p>
              <span className="text-[10px] text-slate-500">Tech ID: {evt.technicianId} • Hours: {evt.operatingHoursAtEvent} hrs</span>
            </div>
          </div>
        ))}

        {/* Predicted Maintenance Window (Advisory Future Event) */}
        <div className="relative flex items-start justify-between gap-4 text-xs font-mono p-3 rounded bg-amber-500/10 border border-amber-500/30">
          <span className="absolute -left-6 top-3 size-4 rounded-full bg-amber-500/20 border border-amber-500 text-amber-400 flex items-center justify-center animate-pulse">
            <AlertTriangle className="size-3" />
          </span>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-amber-300">PREDICTED MAINTENANCE WINDOW</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30">
                ADVISORY
              </span>
            </div>
            <p className="text-slate-300 font-sans text-xs">
              Statistical model projects high probability of component fatigue within {predictedWindow.min}–{predictedWindow.max} days.
            </p>
            <span className="text-[10px] text-amber-400">
              Recommended pre-service inspection before window opening.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
