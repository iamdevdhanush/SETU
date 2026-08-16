import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { equipmentService, casesService } from '@/lib/data/serviceLayer';
import { EquipmentVisual } from '@/components/equipment/EquipmentVisual';
import { PredictionEvidence } from '@/components/common/PredictionEvidence';
import type { EvidenceFactor } from '@/components/common/PredictionEvidence';
import { MaintenanceTimeline } from '@/components/common/MaintenanceTimeline';
import { DecisionPanel } from '@/components/common/DecisionPanel';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ArrowLeft, Package } from 'lucide-react';

export const EquipmentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [, setTick] = useState(0);

  const equipment = equipmentService.getById(id ?? '');
  const relatedCase = equipment ? casesService.getAll().find((c) => c.equipmentId === equipment.id) : null;

  if (!equipment) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4 text-sm" style={{ color: 'var(--text-muted)' }}>
        <p>Equipment record not found: {id}</p>
        <Link to="/equipment" style={{ color: 'var(--green-400)' }}>← Return to Equipment</Link>
      </div>
    );
  }

  const factors: EvidenceFactor[] = equipment.primaryFactors.map((f, i) => ({
    label: f.factor,
    value: f.description,
    status: i === 0 ? 'CRITICAL' : f.weight === 'HIGH' ? 'ELEVATED' : 'APPROACHING',
  }));

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <div
        className="sticky top-0 z-10 flex items-center justify-between px-6 py-3"
        style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)' }}
      >
        <div className="flex items-center gap-3">
          <Link
            to="/equipment"
            className="flex items-center gap-1.5 text-xs transition-colors"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            <ArrowLeft className="size-3.5" /> Equipment
          </Link>
          <span style={{ color: 'var(--border-strong)' }}>/</span>
          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            {equipment.id} — Engineering Case File
          </span>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge variant={equipment.riskLevel} />
          <StatusBadge variant={equipment.status} />
        </div>
      </div>

      {/* Metrics Banner */}
      <div
        className="grid grid-cols-4 gap-0 px-6 py-4"
        style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)' }}
      >
        {[
          { label: 'Platform', value: equipment.platformClass, color: 'var(--text-primary)' },
          { label: 'Maintenance Risk', value: `${equipment.maintenanceRiskScore}%`, color: 'var(--status-critical)' },
          { label: 'Confidence', value: `${equipment.confidenceScore}%`, color: 'var(--status-healthy)' },
          { label: 'Window', value: `${equipment.predictedFailureWindowDays.min}–${equipment.predictedFailureWindowDays.max} days`, color: 'var(--status-warning)' },
        ].map((m, i) => (
          <div
            key={m.label}
            className="px-4"
            style={{ borderLeft: i > 0 ? '1px solid var(--border-subtle)' : 'none' }}
          >
            <div className="section-label">{m.label}</div>
            <div className="font-mono font-bold text-sm mt-0.5 truncate" style={{ color: m.color }}>
              {m.value}
            </div>
          </div>
        ))}
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 max-w-[1600px] mx-auto">
        {/* Left: Visual + Evidence + Spares + Advisory + Decision */}
        <div className="lg:col-span-2 space-y-5">
          <EquipmentVisual
            platformClass={equipment.platformClass}
            status={equipment.status}
            riskLevel={equipment.riskLevel}
            className="rounded"
          />

          <PredictionEvidence
            factors={factors}
            confidenceScore={equipment.confidenceScore}
            defaultOpen={true}
          />

          {/* Spare Dependencies */}
          {equipment.spareImpact.length > 0 && (
            <div
              className="rounded p-4 space-y-3"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
            >
              <div className="section-label flex items-center gap-1.5">
                <Package className="size-3" /> Spare Dependencies
              </div>
              {equipment.spareImpact.map((sp, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-3 py-2.5 rounded text-xs"
                  style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
                >
                  <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                    {sp.partName}
                  </span>
                  <div className="flex items-center gap-3 font-mono text-[11px]">
                    <span style={{ color: 'var(--text-muted)' }}>
                      Stock: <strong style={{ color: 'var(--text-primary)' }}>{sp.currentStock}</strong>
                    </span>
                    <span style={{ color: 'var(--text-muted)' }}>
                      Req: <strong style={{ color: 'var(--text-primary)' }}>{sp.requiredQty}</strong>
                    </span>
                    <span
                      className="font-bold"
                      style={{ color: sp.requiredQty > sp.currentStock ? 'var(--status-critical)' : 'var(--status-healthy)' }}
                    >
                      Gap: {sp.requiredQty - sp.currentStock}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Advisory */}
          <div
            className="px-4 py-3 rounded text-xs space-y-1"
            style={{ background: 'var(--green-900)', border: '1px solid var(--green-800)' }}
          >
            <div className="section-label" style={{ color: 'var(--green-400)' }}>
              SETU Advisory Assessment
            </div>
            <p style={{ color: 'var(--green-300)' }}>{equipment.advisoryRecommendation}</p>
          </div>

          {/* Decision */}
          {relatedCase && (
            <div
              className="p-4 rounded space-y-3"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
            >
              <DecisionPanel
                caseId={relatedCase.id}
                currentStatus={relatedCase.officerStatus}
                currentNotes={relatedCase.officerNotes}
                onDecision={() => setTick((t) => t + 1)}
              />
            </div>
          )}
        </div>

        {/* Right: Maintenance Timeline */}
        <div
          className="rounded p-4 space-y-4 self-start"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
        >
          <div className="section-label">Maintenance History</div>
          <MaintenanceTimeline events={equipment.maintenanceHistory} />

          {/* Service dates */}
          <div className="pt-3 space-y-2 text-xs" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <div className="flex justify-between">
              <span style={{ color: 'var(--text-muted)' }}>Last Service</span>
              <span className="font-mono" style={{ color: 'var(--text-secondary)' }}>
                {equipment.lastServiceDate}
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: 'var(--text-muted)' }}>Next Scheduled</span>
              <span className="font-mono" style={{ color: 'var(--status-warning)' }}>
                {equipment.nextScheduledService}
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: 'var(--text-muted)' }}>Odometer</span>
              <span className="font-mono" style={{ color: 'var(--text-secondary)' }}>
                {equipment.mileageKm.toLocaleString()} km
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
