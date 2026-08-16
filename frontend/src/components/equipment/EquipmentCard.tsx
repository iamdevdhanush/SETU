import React from 'react';
import type { Equipment } from '@/types/equipment';
import { EquipmentVisual } from './EquipmentVisual';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface EquipmentCardProps {
  equipment: Equipment;
}

export const EquipmentCard: React.FC<EquipmentCardProps> = ({ equipment }) => {
  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'CRITICAL':
        return 'bg-red-500/20 text-red-400 border-red-500/40';
      case 'HIGH':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'MODERATE':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    }
  };

  return (
    <div className="tactical-card rounded-lg overflow-hidden border border-[#1a2636] bg-[#0f151d] hover:border-[#2d425c] transition-all flex flex-col justify-between">
      {/* Visual Header */}
      <EquipmentVisual
        platformClass={equipment.platformClass}
        status={equipment.status}
        riskLevel={equipment.riskLevel}
        className="rounded-t-lg rounded-b-none border-0 border-b border-[#1a2636]"
      />

      {/* Main Info */}
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-100">{equipment.name}</h3>
              <span className="text-[11px] font-mono text-slate-400">{equipment.unitSector}</span>
            </div>
            <span className={cn('px-2 py-0.5 rounded text-[10px] font-mono font-bold border', getRiskBadge(equipment.riskLevel))}>
              {equipment.riskLevel} ({equipment.maintenanceRiskScore}%)
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 my-3 p-2 rounded bg-[#131b26] border border-[#1c2a3c] text-xs font-mono">
            <div>
              <span className="text-[10px] text-slate-500 block">OPERATING HOURS</span>
              <span className="text-slate-200 font-bold">{equipment.operatingHours} hrs</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">PREDICTED WINDOW</span>
              <span className="text-amber-400 font-bold">{equipment.predictedFailureWindowDays.min}–{equipment.predictedFailureWindowDays.max} days</span>
            </div>
          </div>

          {/* Primary Factor snippet */}
          {equipment.primaryFactors.length > 0 && (
            <div className="text-[11px] text-slate-400 space-y-1">
              <span className="text-[10px] uppercase font-mono text-slate-500 block font-semibold">Primary Risk Factor</span>
              <p className="text-slate-300 truncate font-sans">
                • {equipment.primaryFactors[0].factor}: {equipment.primaryFactors[0].description}
              </p>
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-[#1a2636] flex items-center justify-between">
          <span className="text-[10px] font-mono text-slate-500">
            CONFIDENCE: <strong className="text-emerald-400">{equipment.confidenceScore}%</strong>
          </span>
          <Link
            to={`/equipment/${equipment.id}`}
            className="px-3 py-1.5 rounded bg-[#16202c] hover:bg-[#1e2b3c] text-xs text-emerald-400 font-mono font-semibold border border-[#3e7b57]/40 flex items-center gap-1 transition-all"
          >
            Engineering Case File <ChevronRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
