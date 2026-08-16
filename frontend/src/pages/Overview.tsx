import React, { useState, useEffect } from 'react';
import { casesService, equipmentService, sparesService, subscribeDataChanges } from '@/lib/data/serviceLayer';
import { StatusBadge } from '@/components/common/StatusBadge';
import { DecisionPanel } from '@/components/common/DecisionPanel';
import { PredictionEvidence } from '@/components/common/PredictionEvidence';
import type { EvidenceFactor } from '@/components/common/PredictionEvidence';
import type { SustainmentCase } from '@/types/sustainmentCase';
import { AlertTriangle, Shield, Package, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const OverviewPage: React.FC = () => {
  const [, setTick] = useState(0);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

  useEffect(() => {
    const unsub = subscribeDataChanges(() => setTick((t) => t + 1));
    return unsub;
  }, []);

  const allCases = casesService.getAll();
  const fleetStats = equipmentService.getFleetStats();
  const shortages = sparesService.getShortages();

  // Sort by risk score desc, pending first
  const sorted = [...allCases].sort((a, b) => {
    if (a.officerStatus === 'PENDING_REVIEW' && b.officerStatus !== 'PENDING_REVIEW') return -1;
    if (b.officerStatus === 'PENDING_REVIEW' && a.officerStatus !== 'PENDING_REVIEW') return 1;
    return b.maintenanceRiskScore - a.maintenanceRiskScore;
  });

  const pendingCount = allCases.filter((c) => c.officerStatus === 'PENDING_REVIEW').length;

  const makeFactors = (c: SustainmentCase): EvidenceFactor[] =>
    c.whyFlagged.map((reason, i) => ({
      label: `Risk Factor ${i + 1}`,
      value: reason,
      status: i === 0 ? 'CRITICAL' : i === 1 ? 'ELEVATED' : 'APPROACHING',
    }));

  return (
    <div className="flex h-full overflow-hidden">
      {/* ─ LEFT: Work Queue + Context ─ */}
      <div className="flex flex-col flex-1 overflow-hidden border-r" style={{ borderColor: 'var(--border-subtle)' }}>
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-3.5 shrink-0"
          style={{ borderBottom: '1px solid var(--border-subtle)' }}
        >
          <div>
            <h1 className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <AlertTriangle className="size-4" style={{ color: 'var(--status-warning)' }} />
              Sustainment Work Queue
            </h1>
            <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {pendingCount} cases requiring officer review
            </p>
          </div>
          <Link
            to="/cases"
            className="text-[11px] px-2.5 py-1 rounded transition-colors flex items-center gap-1"
            style={{
              background: 'var(--green-900)',
              border: '1px solid var(--green-800)',
              color: 'var(--green-400)',
            }}
          >
            View All Cases <ChevronRight className="size-3.5" />
          </Link>
        </div>

        {/* Queue list */}
        <div className="flex-1 overflow-y-auto">
          {sorted.map((c) => {
            const isSelected = selectedCaseId === c.id;
            const isPending = c.officerStatus === 'PENDING_REVIEW';
            return (
              <div
                key={c.id}
                onClick={() => setSelectedCaseId(isSelected ? null : c.id)}
                className={`list-row px-5 py-4 ${isSelected ? 'selected' : ''}`}
              >
                {/* Row: Asset + Risk */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="id-tag">{c.equipmentId}</span>
                      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{c.platformClass}</span>
                      <StatusBadge variant={c.riskLevel} />
                      {isPending && (
                        <span
                          className="text-[10px] px-2 py-0.5 rounded font-semibold"
                          style={{
                            background: 'var(--status-warning-bg)',
                            color: 'var(--status-warning)',
                            border: '1px solid var(--status-warning-border)',
                          }}
                        >
                          NEEDS REVIEW
                        </span>
                      )}
                    </div>

                    {/* Compact metrics row */}
                    <div className="flex items-center gap-4 text-[11px] font-mono flex-wrap">
                      <span>
                        <span style={{ color: 'var(--text-muted)' }}>Window: </span>
                        <span className="font-semibold" style={{ color: 'var(--status-warning)' }}>
                          {c.expectedWindowDays}
                        </span>
                      </span>
                      <span>
                        <span style={{ color: 'var(--text-muted)' }}>Risk: </span>
                        <span className="font-semibold" style={{ color: 'var(--status-critical)' }}>
                          {c.maintenanceRiskScore}%
                        </span>
                      </span>
                      <span>
                        <span style={{ color: 'var(--text-muted)' }}>Conf: </span>
                        <span className="font-semibold" style={{ color: 'var(--status-healthy)' }}>
                          {c.confidenceScore}%
                        </span>
                      </span>
                    </div>

                    {/* Primary why-flagged reason */}
                    <div className="text-[11px] mt-1 truncate" style={{ color: 'var(--text-secondary)' }}>
                      {c.whyFlagged[0]}
                    </div>

                    {/* Spare gap summary */}
                    {c.spareImpact.length > 0 && (
                      <div className="flex items-center gap-1.5 mt-1 text-[11px]">
                        <Package className="size-3 shrink-0" style={{ color: 'var(--status-critical)' }} />
                        <span style={{ color: 'var(--text-secondary)' }}>
                          {c.spareImpact[0].partName}:
                        </span>
                        <span className="font-mono font-semibold" style={{ color: 'var(--status-critical)' }}>
                          Gap {c.spareImpact[0].needQty - c.spareImpact[0].stockQty}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <StatusBadge variant={c.officerStatus} />
                  </div>
                </div>

                {/* Expandable: Evidence + Decision */}
                {isSelected && (
                  <div
                    className="mt-4 pt-4 space-y-4"
                    style={{ borderTop: '1px solid var(--border-subtle)' }}
                  >
                    <PredictionEvidence
                      factors={makeFactors(c)}
                      confidenceScore={c.confidenceScore}
                      defaultOpen={true}
                    />

                    {/* Spare table */}
                    {c.spareImpact.length > 0 && (
                      <div className="space-y-1.5">
                        <div className="section-label">Spare Requirement</div>
                        {c.spareImpact.map((sp, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between px-3 py-2 rounded text-xs"
                            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
                          >
                            <span style={{ color: 'var(--text-primary)' }}>{sp.partName}</span>
                            <div className="flex items-center gap-3 font-mono text-[11px]">
                              <span style={{ color: 'var(--text-muted)' }}>Stock: <strong style={{ color: 'var(--text-primary)' }}>{sp.stockQty}</strong></span>
                              <span style={{ color: 'var(--text-muted)' }}>Need: <strong style={{ color: 'var(--text-primary)' }}>{sp.needQty}</strong></span>
                              <span className="font-bold" style={{ color: sp.needQty > sp.stockQty ? 'var(--status-critical)' : 'var(--status-healthy)' }}>
                                Gap: {sp.needQty - sp.stockQty}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* SETU Advisory */}
                    <div
                      className="px-3 py-2.5 rounded text-xs"
                      style={{ background: 'var(--green-900)', border: '1px solid var(--green-800)' }}
                    >
                      <div className="section-label mb-1" style={{ color: 'var(--green-400)' }}>SETU Advisory</div>
                      <p style={{ color: 'var(--green-300)' }}>{c.setuRecommendation}</p>
                    </div>

                    {/* Decision buttons */}
                    <DecisionPanel
                      caseId={c.id}
                      currentStatus={c.officerStatus}
                      currentNotes={c.officerNotes}
                      onDecision={() => setTick((t) => t + 1)}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ─ RIGHT: Context Rail ─ */}
      <div
        className="flex flex-col shrink-0 overflow-y-auto"
        style={{ width: 260, background: 'var(--bg-surface)' }}
      >
        {/* Fleet State */}
        <div className="p-4 space-y-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="section-label flex items-center gap-1.5">
            <Shield className="size-3" /> Fleet State
          </div>

          <div className="space-y-2">
            {[
              { label: 'Operational', value: `${fleetStats.operational} / ${fleetStats.total}`, color: 'var(--status-healthy)' },
              { label: 'Critical', value: fleetStats.critical, color: 'var(--status-critical)' },
              { label: 'High Risk', value: fleetStats.high, color: 'var(--status-high)' },
              { label: 'Moderate', value: fleetStats.moderate, color: 'var(--status-warning)' },
            ].map((r) => (
              <div key={r.label} className="flex items-center justify-between text-xs">
                <span style={{ color: 'var(--text-secondary)' }}>{r.label}</span>
                <span className="font-mono font-semibold" style={{ color: r.color }}>{r.value}</span>
              </div>
            ))}
          </div>

          {/* Readiness bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px]">
              <span style={{ color: 'var(--text-muted)' }}>Fleet Readiness</span>
              <span className="font-mono font-bold" style={{ color: 'var(--status-healthy)' }}>
                {fleetStats.overallReadiness}%
              </span>
            </div>
            <div className="h-1.5 rounded-full" style={{ background: 'var(--bg-elevated)' }}>
              <div
                className="h-full rounded-full"
                style={{ width: `${fleetStats.overallReadiness}%`, background: 'var(--green-600)' }}
              />
            </div>
            <div className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
              Projected: 72% in 30 days
            </div>
          </div>
        </div>

        {/* Spares Watch */}
        <div className="p-4 space-y-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="section-label flex items-center justify-between">
            <span className="flex items-center gap-1.5"><Package className="size-3" /> Spares Watch</span>
            <Link to="/spares" className="text-[10px]" style={{ color: 'var(--green-400)' }}>
              View →
            </Link>
          </div>

          {shortages.slice(0, 4).map((sp) => (
            <div key={sp.id} className="flex items-center justify-between text-xs">
              <span className="truncate max-w-[150px]" style={{ color: 'var(--text-secondary)' }}>
                {sp.name}
              </span>
              <span
                className="font-mono font-bold"
                style={{ color: 'var(--status-critical)' }}
              >
                -{sp.shortageGap}
              </span>
            </div>
          ))}

          {shortages.length === 0 && (
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>No critical shortages.</p>
          )}
        </div>

        {/* Upcoming Windows */}
        <div className="p-4 space-y-3">
          <div className="section-label flex items-center gap-1.5">
            <Clock className="size-3" /> Upcoming Windows
          </div>
          <div
            className="px-3 py-2.5 rounded text-xs"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
          >
            <div className="font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>
              8 assets entering risk windows
            </div>
            <p style={{ color: 'var(--text-muted)' }}>
              Preventive intervention recommended within 30 days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
