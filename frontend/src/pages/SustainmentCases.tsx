import React, { useState, useMemo, useEffect } from 'react';
import { casesService, subscribeDataChanges } from '@/lib/data/serviceLayer';
import type { SustainmentCase, CaseOfficerStatus } from '@/types/sustainmentCase';
import { StatusBadge } from '@/components/common/StatusBadge';
import { PredictionEvidence } from '@/components/common/PredictionEvidence';
import type { EvidenceFactor } from '@/components/common/PredictionEvidence';
import { DecisionPanel } from '@/components/common/DecisionPanel';
import { Search, ChevronRight, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

// ──────────────────────────────────────────────
// CASE LIST ROW
// ──────────────────────────────────────────────
const CaseRow: React.FC<{
  c: SustainmentCase;
  selected: boolean;
  onClick: () => void;
}> = ({ c, selected, onClick }) => (
  <div
    onClick={onClick}
    className={cn('list-row px-4 py-3 flex items-center justify-between gap-3', selected && 'selected')}
  >
    <div className="min-w-0">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="id-tag">{c.id}</span>
        <span className="id-tag" style={{ color: 'var(--text-secondary)' }}>{c.equipmentId}</span>
        <StatusBadge variant={c.riskLevel} />
      </div>
      <div className="text-[11px] mt-0.5 truncate" style={{ color: 'var(--text-secondary)' }}>
        {c.platformClass} · {c.whyFlagged[0]}
      </div>
    </div>
    <div className="flex items-center gap-2 shrink-0">
      <StatusBadge variant={c.officerStatus} />
      <ChevronRight className="size-3.5" style={{ color: 'var(--text-muted)' }} />
    </div>
  </div>
);

// ──────────────────────────────────────────────
// CASE DETAIL PANEL
// ──────────────────────────────────────────────
const CaseDetailPanel: React.FC<{ c: SustainmentCase; onDecision?: () => void }> = ({
  c,
  onDecision,
}) => {
  const factors: EvidenceFactor[] = c.whyFlagged.map((reason, i) => ({
    label: `Risk Factor ${i + 1}`,
    value: reason,
    status: i === 0 ? 'CRITICAL' : i === 1 ? 'ELEVATED' : 'APPROACHING',
  }));

  return (
    <div className="h-full overflow-y-auto" style={{ background: 'var(--bg-base)' }}>
      {/* Header */}
      <div
        className="sticky top-0 z-10 px-5 py-4"
        style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)' }}
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="id-tag text-base">{c.id}</span>
              <StatusBadge variant={c.riskLevel} />
              <StatusBadge variant={c.officerStatus} />
            </div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
              {c.equipmentId} · {c.platformClass}
            </div>
          </div>
          <Link
            to={`/equipment/${c.equipmentId}`}
            onClick={(e) => e.stopPropagation()}
            className="text-[11px] px-2.5 py-1 rounded transition-colors"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-default)',
              color: 'var(--green-400)',
            }}
          >
            Open Asset →
          </Link>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-2 mt-3">
          {[
            { label: 'Maintenance Risk', value: `${c.maintenanceRiskScore}%`, color: 'var(--status-critical)' },
            { label: 'Confidence', value: `${c.confidenceScore}%`, color: 'var(--status-healthy)' },
            { label: 'Window', value: c.expectedWindowDays, color: 'var(--status-warning)' },
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

      {/* Body */}
      <div className="p-5 space-y-5">
        {/* Prediction Evidence */}
        <div className="space-y-2">
          <PredictionEvidence
            factors={factors}
            confidenceScore={c.confidenceScore}
            defaultOpen={true}
          />
        </div>

        {/* Spare Dependencies */}
        {c.spareImpact.length > 0 && (
          <div className="space-y-2">
            <div className="section-label flex items-center gap-1.5">
              <Package className="size-3" /> Spare Requirement
            </div>
            {c.spareImpact.map((sp, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-3 py-2.5 rounded text-xs"
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
              >
                <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  {sp.partName}
                </span>
                <div className="flex items-center gap-3 font-mono text-[11px]">
                  <span style={{ color: 'var(--text-secondary)' }}>
                    Stock: <strong style={{ color: 'var(--text-primary)' }}>{sp.stockQty}</strong>
                  </span>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    Need: <strong style={{ color: 'var(--text-primary)' }}>{sp.needQty}</strong>
                  </span>
                  <span
                    className="font-bold"
                    style={{
                      color: sp.needQty > sp.stockQty
                        ? 'var(--status-critical)'
                        : 'var(--status-healthy)',
                    }}
                  >
                    Gap: {sp.needQty - sp.stockQty}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SETU Advisory */}
        <div
          className="px-4 py-3 rounded text-xs space-y-1"
          style={{ background: 'var(--green-900)', border: '1px solid var(--green-800)' }}
        >
          <div className="section-label" style={{ color: 'var(--green-400)' }}>
            SETU Recommendation
          </div>
          <p style={{ color: 'var(--green-300)' }}>{c.setuRecommendation}</p>
        </div>

        {/* Officer Decision */}
        <DecisionPanel
          caseId={c.id}
          currentStatus={c.officerStatus}
          currentNotes={c.officerNotes}
          onDecision={onDecision}
        />
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────
// CASES PAGE
// ──────────────────────────────────────────────
export const SustainmentCasesPage: React.FC = () => {
  const [, setTick] = useState(0);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<CaseOfficerStatus | 'ALL'>('ALL');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const unsub = subscribeDataChanges(() => setTick((t) => t + 1));
    return unsub;
  }, []);

  const all = casesService.getAll();

  const filtered = useMemo(
    () =>
      all.filter((c) => {
        if (
          query &&
          !c.id.toLowerCase().includes(query.toLowerCase()) &&
          !c.equipmentId.toLowerCase().includes(query.toLowerCase())
        )
          return false;
        if (statusFilter !== 'ALL' && c.officerStatus !== statusFilter) return false;
        if (riskFilter !== 'ALL' && c.riskLevel !== riskFilter) return false;
        return true;
      }),
    [all, query, statusFilter, riskFilter]
  );

  const selectedCase = filtered.find((c) => c.id === selectedId) ?? filtered[0] ?? null;

  useEffect(() => {
    if (filtered.length > 0 && !filtered.find((c) => c.id === selectedId)) {
      setSelectedId(filtered[0]?.id ?? null);
    }
  }, [filtered]);

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
      {/* LEFT: Case List */}
      <div
        className="flex flex-col shrink-0 border-r overflow-hidden"
        style={{ width: 360, borderColor: 'var(--border-subtle)' }}
      >
        {/* Filters */}
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
              placeholder="Search case ID or asset ID…"
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded outline-none"
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-default)',
                color: 'var(--text-primary)',
              }}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} style={filterSelectStyle}>
              <option value="ALL">All Statuses</option>
              <option value="PENDING_REVIEW">Needs Review</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="INSPECTION_SCHEDULED">Inspection</option>
              <option value="DISMISSED">Deferred</option>
            </select>
            <select value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)} style={filterSelectStyle}>
              <option value="ALL">All Risk</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MODERATE">Moderate</option>
            </select>
          </div>
        </div>

        {/* List Header */}
        <div
          className="px-4 py-2 flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider shrink-0"
          style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)' }}
        >
          <span>{filtered.length} Cases</span>
          <span>Risk · Status</span>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
              No cases match the current filters.
            </div>
          ) : (
            filtered.map((c) => (
              <CaseRow
                key={c.id}
                c={c}
                selected={selectedCase?.id === c.id}
                onClick={() => setSelectedId(c.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* RIGHT: Case Detail */}
      <div className="flex-1 overflow-hidden">
        {selectedCase ? (
          <CaseDetailPanel
            c={selectedCase}
            onDecision={() => setTick((t) => t + 1)}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-sm" style={{ color: 'var(--text-muted)' }}>
            Select a case to review it.
          </div>
        )}
      </div>
    </div>
  );
};
