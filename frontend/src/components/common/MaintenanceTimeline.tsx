import React from 'react';
import type { MaintenanceEvent } from '@/types/equipment';
import { Wrench, Eye, RefreshCw, AlertTriangle, Power } from 'lucide-react';

const iconMap: Record<MaintenanceEvent['eventType'], React.ElementType> = {
  COMMISSIONED: Power,
  ROUTINE_SERVICE: RefreshCw,
  COMPONENT_REPLACE: Wrench,
  INSPECTION: Eye,
  EMERGENCY_REPAIR: AlertTriangle,
};

interface MaintenanceTimelineProps {
  events: MaintenanceEvent[];
}

export const MaintenanceTimeline: React.FC<MaintenanceTimelineProps> = ({ events }) => {
  if (!events.length) {
    return (
      <p className="text-xs py-4 text-center" style={{ color: 'var(--text-muted)' }}>
        No maintenance events recorded.
      </p>
    );
  }

  return (
    <div className="relative pl-5 space-y-5">
      {/* Vertical guide */}
      <div
        className="absolute left-2 top-1 bottom-1 w-px"
        style={{ background: 'var(--border-default)' }}
      />

      {events.map((evt) => {
        const Icon = iconMap[evt.eventType] ?? Wrench;
        return (
          <div key={evt.id} className="relative">
            {/* Dot */}
            <div
              className="absolute -left-5 top-1 size-3 rounded-full flex items-center justify-center ring-4"
              style={{
                background: 'var(--green-700)',
                border: '2px solid var(--bg-surface)',
              }}
            />

            <div className="flex items-start justify-between gap-2 pl-1">
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-1.5">
                  <Icon className="size-3 shrink-0" style={{ color: 'var(--green-400)' }} />
                  <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {evt.eventType.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {evt.description}
                </p>
                <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
                  Tech: {evt.technicianId} · {evt.operatingHoursAtEvent} hrs
                </span>
              </div>
              <span className="text-[10px] font-mono whitespace-nowrap shrink-0 mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {evt.date}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
