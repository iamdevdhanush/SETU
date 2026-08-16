import React, { useState, useMemo } from 'react';
import { sparesService } from '@/lib/data/serviceLayer';
import type { SparePart } from '@/types/spare';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Search, Filter, X, Package, TrendingDown } from 'lucide-react';

// ──────────────────────────────────────────────
// SPARE DETAIL DRAWER
// ──────────────────────────────────────────────
const SpareDetailDrawer: React.FC<{ spare: SparePart; onClose: () => void }> = ({
  spare,
  onClose,
}) => (
  <div className="h-full overflow-y-auto" style={{ background: 'var(--bg-base)' }}>
    {/* Header */}
    <div
      className="sticky top-0 z-10 px-5 py-4 flex items-start justify-between gap-2"
      style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)' }}
    >
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <Package className="size-4" style={{ color: 'var(--green-400)' }} />
          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            {spare.name}
          </span>
          <StatusBadge variant={spare.shortageRisk} />
        </div>
        <div className="text-[11px] font-mono mt-1" style={{ color: 'var(--text-muted)' }}>
          {spare.partNumber} · {spare.id} · {spare.category}
        </div>
      </div>
      <button onClick={onClose} className="text-xs" style={{ color: 'var(--text-muted)' }}>
        <X className="size-4" />
      </button>
    </div>

    <div className="p-5 space-y-5">
      {/* Stock & Demand Grid */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Current Stock', value: spare.currentStock, color: 'var(--text-primary)' },
          { label: 'Projected Gap', value: spare.shortageGap > 0 ? `-${spare.shortageGap}` : '0', color: spare.shortageGap > 0 ? 'var(--status-critical)' : 'var(--status-healthy)' },
          { label: '30-Day Demand', value: spare.predictedDemand30d, color: 'var(--status-warning)' },
          { label: '60-Day Demand', value: spare.predictedDemand60d, color: 'var(--status-high)' },
          { label: '90-Day Demand', value: spare.predictedDemand90d, color: 'var(--status-critical)' },
          { label: 'Reorder Lead Time', value: `${spare.reorderLeadTimeDays}d`, color: 'var(--text-primary)' },
        ].map((m) => (
          <div
            key={m.label}
            className="rounded px-3 py-2"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
          >
            <div className="section-label">{m.label}</div>
            <div className="font-mono font-bold text-sm mt-0.5" style={{ color: m.color }}>
              {m.value}
            </div>
          </div>
        ))}
      </div>

      {/* Demand visual bar */}
      <div className="space-y-2">
        <div className="section-label flex items-center gap-1.5">
          <TrendingDown className="size-3" /> Demand Trajectory
        </div>
        {[
          { label: '30 days', value: spare.predictedDemand30d },
          { label: '60 days', value: spare.predictedDemand60d },
          { label: '90 days', value: spare.predictedDemand90d },
        ].map((d) => (
          <div key={d.label} className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span style={{ color: 'var(--text-secondary)' }}>{d.label}</span>
              <span className="font-mono" style={{ color: 'var(--text-primary)' }}>{d.value} units</span>
            </div>
            <div className="h-1.5 rounded-full" style={{ background: 'var(--bg-elevated)' }}>
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${Math.min(100, (d.value / spare.predictedDemand90d) * 100)}%`,
                  background: d.value > spare.currentStock ? 'var(--status-critical)' : 'var(--green-600)',
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Compatible Platforms */}
      <div className="space-y-2">
        <div className="section-label">Compatible Platforms</div>
        <div className="space-y-1">
          {spare.compatiblePlatforms.map((p, i) => (
            <div
              key={i}
              className="px-3 py-1.5 rounded text-xs"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}
            >
              {p}
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// ──────────────────────────────────────────────
// SPARES PAGE
// ──────────────────────────────────────────────
export const SparesPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const all = sparesService.getAll();

  const filtered = useMemo(
    () =>
      all.filter((sp) => {
        if (
          query &&
          !sp.name.toLowerCase().includes(query.toLowerCase()) &&
          !sp.partNumber.toLowerCase().includes(query.toLowerCase()) &&
          !sp.id.toLowerCase().includes(query.toLowerCase())
        )
          return false;
        if (categoryFilter !== 'ALL' && sp.category !== categoryFilter) return false;
        return true;
      }),
    [all, query, categoryFilter]
  );

  const selectedSpare = filtered.find((sp) => sp.id === selectedId) ?? null;

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
    <div className="flex flex-col h-full overflow-hidden">
      {/* Page Header */}
      <div
        className="flex items-center justify-between px-5 py-3.5 shrink-0"
        style={{ borderBottom: '1px solid var(--border-subtle)' }}
      >
        <div>
          <h1 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Spares Planning
          </h1>
          <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Projected spare part demand and shortage analysis.
          </p>
        </div>
        <span
          className="text-[10px] font-mono px-2 py-1 rounded"
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-default)',
            color: 'var(--text-muted)',
          }}
        >
          SYNTHETIC DATASET
        </span>
      </div>

      {/* Filter Bar */}
      <div
        className="flex items-center gap-3 px-5 py-2.5 shrink-0"
        style={{ borderBottom: '1px solid var(--border-subtle)' }}
      >
        <div className="relative w-56">
          <Search
            className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5"
            style={{ color: 'var(--text-muted)' }}
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search part name or NSN…"
            className="w-full text-xs pl-8 pr-3 py-1.5 rounded outline-none"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-default)',
              color: 'var(--text-primary)',
            }}
          />
        </div>
        <Filter className="size-3.5" style={{ color: 'var(--text-muted)' }} />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={filterSelectStyle}
        >
          <option value="ALL">All Categories</option>
          <option value="Powertrain">Powertrain</option>
          <option value="Hydraulics">Hydraulics</option>
          <option value="Engine Assembly">Engine Assembly</option>
          <option value="Braking">Braking</option>
        </select>
        <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
          {filtered.length} parts
        </span>
      </div>

      {/* Main Content: Table + optional Drawer */}
      <div className="flex flex-1 overflow-hidden">
        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-xs border-collapse">
            <thead
              className="sticky top-0 z-10"
              style={{ background: 'var(--bg-surface)' }}
            >
              <tr>
                {['Part', 'Stock', '30d Demand', 'Gap', 'Platforms', 'Status'].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((sp) => (
                <tr
                  key={sp.id}
                  onClick={() => setSelectedId(selectedId === sp.id ? null : sp.id)}
                  className="list-row"
                  style={selectedSpare?.id === sp.id ? { background: 'var(--bg-elevated)', borderLeft: '2px solid var(--green-600)' } : {}}
                >
                  <td className="px-4 py-3">
                    <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                      {sp.name}
                    </div>
                    <div className="font-mono text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {sp.partNumber}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono font-semibold text-right" style={{ color: 'var(--text-primary)' }}>
                    {sp.currentStock}
                  </td>
                  <td className="px-4 py-3 font-mono text-right" style={{ color: 'var(--status-warning)' }}>
                    {sp.predictedDemand30d}
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-right"
                    style={{ color: sp.shortageGap > 0 ? 'var(--status-critical)' : 'var(--status-healthy)' }}>
                    {sp.shortageGap > 0 ? `-${sp.shortageGap}` : '0'}
                  </td>
                  <td className="px-4 py-3 text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                    <span className="truncate max-w-[160px] block">{sp.compatiblePlatforms.slice(0, 2).join(', ')}{sp.compatiblePlatforms.length > 2 ? ' …' : ''}</span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge variant={sp.shortageRisk} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Drawer */}
        {selectedSpare && (
          <div
            className="shrink-0 border-l overflow-hidden"
            style={{ width: 360, borderColor: 'var(--border-subtle)' }}
          >
            <SpareDetailDrawer
              spare={selectedSpare}
              onClose={() => setSelectedId(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
};
