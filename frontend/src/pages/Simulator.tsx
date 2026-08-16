import React, { useState } from 'react';
import { simulationService } from '@/lib/data/serviceLayer';
import type { SimulationParams } from '@/types/simulation';
import { SlidersHorizontal, RotateCcw, AlertTriangle, ArrowRight } from 'lucide-react';

export const SimulatorPage: React.FC = () => {
  const [params, setParams] = useState<SimulationParams>({
    spareAllocationOffsetPercent: 25,
    maintenanceCapacityOffsetPercent: 15,
    interventionTimingSpeedDays: 10,
  });

  const { baseline, simulated } = simulationService.runSimulation(params);

  const resetParams = () =>
    setParams({ spareAllocationOffsetPercent: 0, maintenanceCapacityOffsetPercent: 0, interventionTimingSpeedDays: 0 });

  const panelStyle: React.CSSProperties = {
    background: 'var(--bg-surface)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius)',
  };

  const SliderField = ({
    label, value, min, max, step, unit, onChange,
  }: {
    label: string; value: number; min: number; max: number; step: number;
    unit: (v: number) => string; onChange: (v: number) => void;
  }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
        <span className="font-mono font-bold" style={{ color: 'var(--green-400)' }}>{unit(value)}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full cursor-pointer"
        style={{ accentColor: 'var(--green-600)' }}
      />
    </div>
  );

  return (
    <div className="h-full overflow-y-auto p-5 space-y-5 max-w-[1600px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            What-if Simulator
          </h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Model sustainment effect of spare allocation, workshop capacity, and intervention timing.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className="text-[11px] px-2.5 py-1 rounded font-mono flex items-center gap-1.5"
            style={{
              background: 'var(--status-warning-bg)',
              border: '1px solid var(--status-warning-border)',
              color: 'var(--status-warning)',
            }}
          >
            <AlertTriangle className="size-3.5" /> SIMULATION ONLY
          </span>
          <button
            onClick={resetParams}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded transition-colors"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-default)',
              color: 'var(--text-secondary)',
            }}
          >
            <RotateCcw className="size-3.5" /> Reset
          </button>
        </div>
      </div>

      {/* Disclaimer */}
      <div
        className="p-3 rounded text-xs font-mono"
        style={{
          background: 'var(--status-warning-bg)',
          border: '1px solid var(--status-warning-border)',
          color: 'var(--status-warning)',
        }}
      >
        <strong>SIMULATED:</strong> Outcomes are mathematical projections only. NOT operational data.
      </div>

      {/* Main 3-col layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        {/* Sliders */}
        <div className="p-4 space-y-5" style={panelStyle}>
          <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
            <SlidersHorizontal className="size-4" style={{ color: 'var(--green-400)' }} />
            Scenario Controls
          </div>

          <SliderField
            label="Spare Allocation Offset"
            value={params.spareAllocationOffsetPercent}
            min={-30} max={50} step={5}
            unit={(v) => v >= 0 ? `+${v}%` : `${v}%`}
            onChange={(v) => setParams((p) => ({ ...p, spareAllocationOffsetPercent: v }))}
          />
          <SliderField
            label="Workshop Capacity Offset"
            value={params.maintenanceCapacityOffsetPercent}
            min={-20} max={40} step={5}
            unit={(v) => v >= 0 ? `+${v}%` : `${v}%`}
            onChange={(v) => setParams((p) => ({ ...p, maintenanceCapacityOffsetPercent: v }))}
          />
          <SliderField
            label="Intervention Timing"
            value={params.interventionTimingSpeedDays}
            min={-10} max={20} step={1}
            unit={(v) => v >= 0 ? `${v}d earlier` : `${Math.abs(v)}d delayed`}
            onChange={(v) => setParams((p) => ({ ...p, interventionTimingSpeedDays: v }))}
          />
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-4">
          {/* Metrics row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Fleet Readiness', base: baseline.projectedReadinessPercent, sim: simulated.projectedReadinessPercent, unit: '%', positive: true },
              { label: 'Maintenance Backlog', base: baseline.projectedBacklogPercent, sim: simulated.projectedBacklogPercent, unit: '%', positive: false },
              { label: 'Spare Gaps Remaining', base: baseline.projectedSpareShortagesCount, sim: simulated.projectedSpareShortagesCount, unit: '', positive: false },
            ].map((m) => {
              const delta = m.sim - m.base;
              const improved = m.positive ? delta > 0 : delta < 0;
              return (
                <div key={m.label} className="p-4 space-y-2" style={panelStyle}>
                  <div className="section-label">{m.label}</div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-lg line-through" style={{ color: 'var(--text-muted)' }}>
                      {m.base}{m.unit}
                    </span>
                    <ArrowRight className="size-3.5" style={{ color: 'var(--text-muted)' }} />
                    <span className="font-mono text-2xl font-bold" style={{ color: improved ? 'var(--status-healthy)' : 'var(--status-critical)' }}>
                      {m.sim}{m.unit}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono" style={{ color: improved ? 'var(--status-healthy)' : 'var(--status-critical)' }}>
                    {delta > 0 ? '+' : ''}{delta}{m.unit}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Asset effect table */}
          <div className="p-4 space-y-3" style={panelStyle}>
            <div className="section-label">Projected Effect Per Asset</div>
            <div className="space-y-2 text-xs">
              {[
                { id: 'EQ-042', platform: 'Tracked Platform A', note: 'Power Transmission pre-allocated', from: 'CRITICAL', to: 'HIGH' },
                { id: 'EQ-117', platform: 'Tracked Platform A', note: 'Final Drive inspection timing accelerated', from: 'HIGH', to: 'MODERATE' },
                { id: 'EQ-203', platform: 'Wheeled Platform A', note: 'Routine service window maintained', from: 'MODERATE', to: 'MODERATE' },
              ].map((a) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between px-3 py-2.5 rounded"
                  style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
                >
                  <div>
                    <div className="font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {a.id} ({a.platform})
                    </div>
                    <div style={{ color: 'var(--text-secondary)' }}>{a.note}</div>
                  </div>
                  <div className="flex items-center gap-2 font-mono shrink-0">
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-bold border"
                      style={{
                        background: 'var(--status-critical-bg)',
                        color: 'var(--status-critical)',
                        borderColor: 'var(--status-critical-border)',
                      }}
                    >
                      {a.from}
                    </span>
                    <ArrowRight className="size-3.5" style={{ color: 'var(--text-muted)' }} />
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-bold border"
                      style={{
                        background: 'var(--status-warning-bg)',
                        color: 'var(--status-warning)',
                        borderColor: 'var(--status-warning-border)',
                      }}
                    >
                      {a.to}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
