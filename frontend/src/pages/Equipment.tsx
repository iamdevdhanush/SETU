import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { equipmentService, casesService } from '@/lib/data/serviceLayer';
import type { Equipment, RiskLevel, EquipmentStatus } from '@/types/equipment';
import { StatusBadge } from '@/components/common/StatusBadge';
import { MaintenanceTimeline } from '@/components/common/MaintenanceTimeline';
import { PredictionEvidence } from '@/components/common/PredictionEvidence';
import type { EvidenceFactor } from '@/components/common/PredictionEvidence';
import { DecisionPanel } from '@/components/common/DecisionPanel';
import { EquipmentVisual } from '@/components/equipment/EquipmentVisual';
import { Search, ChevronRight, AlertTriangle, Clock, Gauge, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

// ──────────────────────────────────────────────
// ASSET LIST ROW
// ──────────────────────────────────────────────
const AssetRow: React.FC<{
  equipment: Equipment;
  selected: boolean;
  onClick: () => void;
}> = ({ equipment, selected, onClick }) => (
  <div
    onClick={onClick}
    className={cn('list-row px-4 py-3 flex items-center justify-between gap-3', selected && 'selected')}
  >
    <div className="min-w-0">
      <div className="flex items-center gap-2">
        <span className="id-tag">{equipment.id}</span>
        <StatusBadge variant={equipment.riskLevel} />
      </div>
      <div className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-secondary)' }}>
        {equipment.platformClass}
      </div>
    </div>
    <div className="flex items-center gap-3 shrink-0 text-right">
      <div>
        <div className="text-xs font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>
          {equipment.maintenanceRiskScore}%
        </div>
        <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>risk</div>
      </div>
      <div className="text-[11px] font-mono" style={{ color: 'var(--status-warning)' }}>
        {equipment.predictedFailureWindowDays.min}–{equipment.predictedFailureWindowDays.max}d
      </div>
      <ChevronRight className="size-3.5 shrink-0" style={{ color: 'var(--text-muted)' }} />
    </div>
  </div>
);

// ──────────────────────────────────────────────
// ASSET DETAIL PANEL
// ──────────────────────────────────────────────
const AssetDetailPanel: React.FC<{ equipment: Equipment; onDecision?: () => void }> = ({
  equipment,
  onDecision,
}) => {
  const relatedCase = casesService.getAll().find((c) => c.equipmentId === equipment.id);

  const factors: EvidenceFactor[] = equipment.primaryFactors.map((f, i) => ({
    label: f.factor,
    value: f.description,
    status: i === 0 ? 'CRITICAL' : i === 1 ? 'ELEVATED' : 'APPROACHING',
  }));

  return (
    <div className="h-full overflow-y-auto" style={{ background: 'var(--bg-base)' }}>
      {/* ─ Header ─ */}
      <div
        className="sticky top-0 z-10 px-5 py-4"
        style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)' }}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="id-tag text-base">{equipment.id}</span>
              <StatusBadge variant={equipment.riskLevel} />
              <StatusBadge variant={equipment.status} />
            </div>
            <div className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              {equipment.platformClass} · {equipment.unitSector}
            </div>
          </div>
        </div>

        {/* Key metrics row */}
        <div className="grid grid-cols-4 gap-3 mt-4">
          {[
            { label: 'Risk', value: `${equipment.maintenanceRiskScore}%`, color: 'var(--status-critical)', icon: AlertTriangle },
            { label: 'Confidence', value: `${equipment.confidenceScore}%`, color: 'var(--status-healthy)', icon: Gauge },
            { label: 'Window', value: `${equipment.predictedFailureWindowDays.min}–${equipment.predictedFailureWindowDays.max}d`, color: 'var(--status-warning)', icon: Clock },
            { label: 'Oper. Hours', value: `${equipment.operatingHours}h`, color: 'var(--text-primary)', icon: Clock },
          ].map((m) => (
            <div
              key={m.label}
              className="rounded px-3 py-2"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
            >
              <div className="section-label">{m.label}</div>
              <div className="font-mono font-bold text-sm mt-0.5" style={{ color: m.color }}>
                {m.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─ Body ─ */}
      <div className="p-5 space-y-6">
        {/* Equipment visual */}
        <EquipmentVisual
          platformClass={equipment.platformClass}
          status={equipment.status}
          riskLevel={equipment.riskLevel}
          className="rounded"
        />

        {/* Prediction Evidence */}
        <div className="space-y-2">
          <div className="section-label">Prediction Evidence</div>
          <PredictionEvidence
            factors={factors}
            confidenceScore={equipment.confidenceScore}
            defaultOpen={true}
          />
        </div>

        {/* Spare Dependencies */}
        {equipment.spareImpact.length > 0 && (
          <div className="space-y-2">
            <div className="section-label flex items-center gap-1.5">
              <Package className="size-3" />
              Spare Dependencies
            </div>
            <div className="space-y-1.5">
              {equipment.spareImpact.map((sp, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-3 py-2 rounded text-xs"
                  style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
                >
                  <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                    {sp.partName}
                  </span>
                  <div className="flex items-center gap-3 font-mono text-[11px]">
                    <span style={{ color: 'var(--text-secondary)' }}>
                      Stock: <strong style={{ color: 'var(--text-primary)' }}>{sp.currentStock}</strong>
                    </span>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      Need: <strong style={{ color: 'var(--text-primary)' }}>{sp.requiredQty}</strong>
                    </span>
                    <span
                      className="font-bold"
                      style={{
                        color: sp.requiredQty > sp.currentStock
                          ? 'var(--status-critical)'
                          : 'var(--status-healthy)',
                      }}
                    >
                      Gap: {sp.requiredQty - sp.currentStock}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SETU Advisory */}
        <div
          className="px-4 py-3 rounded text-xs space-y-1"
          style={{ background: 'var(--green-900)', border: '1px solid var(--green-800)' }}
        >
          <div className="section-label" style={{ color: 'var(--green-400)' }}>
            SETU Advisory Assessment
          </div>
          <p style={{ color: 'var(--green-300)' }}>{equipment.advisoryRecommendation}</p>
        </div>

        {/* Officer Decision */}
        {relatedCase && (
          <DecisionPanel
            caseId={relatedCase.id}
            currentStatus={relatedCase.officerStatus}
            currentNotes={relatedCase.officerNotes}
            onDecision={onDecision}
          />
        )}

        {/* Maintenance History */}
        <div className="space-y-3">
          <div className="section-label">Maintenance History</div>
          <MaintenanceTimeline events={equipment.maintenanceHistory} />
        </div>
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────
// EQUIPMENT PAGE
// ──────────────────────────────────────────────
export const EquipmentPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('search') ?? '');
  const [riskFilter, setRiskFilter] = useState<RiskLevel | 'ALL'>('ALL');
  const [conditionFilter, setConditionFilter] = useState<EquipmentStatus | 'ALL'>('ALL');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [, setTick] = useState(0);

  const allEquipment = equipmentService.getAll();

  const filtered = useMemo(
    () =>
      allEquipment
        .filter((eq) => {
          if (query && !eq.id.toLowerCase().includes(query.toLowerCase()) && !eq.name.toLowerCase().includes(query.toLowerCase())) return false;
          if (riskFilter !== 'ALL' && eq.riskLevel !== riskFilter) return false;
          if (conditionFilter !== 'ALL' && eq.status !== conditionFilter) return false;
          return true;
        })
        .sort((a, b) => b.maintenanceRiskScore - a.maintenanceRiskScore),
    [allEquipment, query, riskFilter, conditionFilter]
  );

  const selectedEquipment = useMemo(
    () => (selectedId ? allEquipment.find((eq) => eq.id === selectedId) : null),
    [selectedId, allEquipment]
  );

  // Auto-select first on mount
  useEffect(() => {
    if (!selectedId && filtered.length > 0) setSelectedId(filtered[0].id);
  }, []);

  const filterSelectStyle: React.CSSProperties = {
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border-default)',
    color: 'var(--text-secondary)',
    borderRadius: 'var(--radius)',
    fontSize: 12,
    padding: '4px 8px',
    outline: 'none',
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* ─ LEFT: Equipment List ─ */}
      <div
        className="flex flex-col shrink-0 border-r overflow-hidden"
        style={{ width: 320, borderColor: 'var(--border-subtle)' }}
      >
        {/* Filter bar */}
        <div
          className="p-3 space-y-2 shrink-0"
          style={{ borderBottom: '1px solid var(--border-subtle)' }}
        >
          <div className="relative">
            <Search
              className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5"
              style={{ color: 'var(--text-muted)' }}
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search asset ID…"
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded outline-none"
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-default)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          <div className="flex gap-2">
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value as any)}
              style={filterSelectStyle}
            >
              <option value="ALL">All Risk</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MODERATE">Moderate</option>
              <option value="NORMAL">Normal</option>
            </select>
            <select
              value={conditionFilter}
              onChange={(e) => setConditionFilter(e.target.value as any)}
              style={filterSelectStyle}
            >
              <option value="ALL">All Conditions</option>
              <option value="OPERATIONAL">Operational</option>
              <option value="DEGRADED">Degraded</option>
              <option value="MAINTENANCE_REQUIRED">Maintenance Required</option>
            </select>
          </div>
        </div>

        {/* List header */}
        <div
          className="px-4 py-2 flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider shrink-0"
          style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)' }}
        >
          <span>{filtered.length} Assets</span>
          <span>Risk · Window</span>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
              No equipment matches the current filters.
            </div>
          ) : (
            filtered.map((eq) => (
              <AssetRow
                key={eq.id}
                equipment={eq}
                selected={selectedId === eq.id}
                onClick={() => setSelectedId(eq.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* ─ RIGHT: Asset Detail ─ */}
      <div className="flex-1 overflow-hidden">
        {selectedEquipment ? (
          <AssetDetailPanel
            equipment={selectedEquipment}
            onDecision={() => setTick((t) => t + 1)}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-sm" style={{ color: 'var(--text-muted)' }}>
            Select an asset to view its engineering case file.
          </div>
        )}
      </div>
    </div>
  );
};
