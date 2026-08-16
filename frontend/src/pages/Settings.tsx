import React from 'react';
import { Database, Cpu } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const panelStyle: React.CSSProperties = {
    background: 'var(--bg-surface)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius)',
  };

  const rowStyle: React.CSSProperties = {
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius)',
  };

  return (
    <div className="h-full overflow-y-auto p-5 space-y-5 max-w-[900px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            System Settings
          </h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Workbench preferences and model configuration.
          </p>
        </div>
        <span
          className="text-[10px] font-mono px-2.5 py-1 rounded"
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-default)',
            color: 'var(--text-muted)',
          }}
        >
          DEMO WORKSHOP
        </span>
      </div>

      {/* Environment */}
      <div className="p-4 space-y-3" style={panelStyle}>
        <div className="section-label flex items-center gap-1.5">
          <Database className="size-3" style={{ color: 'var(--green-400)' }} /> Environment Configuration
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs">
          {[
            { label: 'Dataset Mode', value: 'SYNTHETIC DATASET', desc: 'Unclassified synthetic equipment and telemetry.', mono: true },
            { label: 'Application Mode', value: 'DEMO WORKSHOP', desc: 'Isolated client-side prototype workbench.', mono: true },
          ].map((f) => (
            <div key={f.label} className="p-3 space-y-1" style={rowStyle}>
              <div style={{ color: 'var(--text-muted)' }}>{f.label}</div>
              <div
                className={f.mono ? 'font-mono font-bold text-sm' : 'font-semibold text-sm'}
                style={{ color: 'var(--text-primary)' }}
              >
                {f.value}
              </div>
              <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* System Info */}
      <div className="p-4 space-y-3" style={panelStyle}>
        <div className="section-label flex items-center gap-1.5">
          <Cpu className="size-3" style={{ color: 'var(--status-warning)' }} /> System Information
        </div>
        <div className="space-y-2 text-xs">
          {[
            { label: 'System Descriptor', value: 'SETU-Sustain Predictive Spares Intelligence', color: 'var(--text-primary)' },
            { label: 'Inference Engine Model', value: 'SETU-ML-Inference v2.4 (Advisory)', color: 'var(--green-400)', mono: true },
            { label: 'Backend API Layer', value: 'DISCONNECTED (Mock Layer Active)', color: 'var(--text-muted)', mono: true },
            { label: 'Frontend Build', value: 'Vite + React 18 + TypeScript', color: 'var(--text-secondary)' },
          ].map((r) => (
            <div
              key={r.label}
              className="flex items-center justify-between px-3 py-2 rounded"
              style={rowStyle}
            >
              <span style={{ color: 'var(--text-muted)' }}>{r.label}</span>
              <span
                className={r.mono ? 'font-mono font-semibold' : ''}
                style={{ color: r.color }}
              >
                {r.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
