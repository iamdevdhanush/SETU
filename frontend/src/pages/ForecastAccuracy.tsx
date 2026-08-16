import React from 'react';
import { forecastService } from '@/lib/data/serviceLayer';
import { Target, CheckCircle2 } from 'lucide-react';

export const ForecastAccuracyPage: React.FC = () => {
  const metrics = forecastService.getMetrics();
  const records = forecastService.getRecords();

  const panelStyle: React.CSSProperties = {
    background: 'var(--bg-surface)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius)',
  };

  const OUTCOME_STYLES: Record<string, React.CSSProperties> = {
    PREVENTATIVE_SERVICED: {
      background: 'var(--status-healthy-bg)',
      color: 'var(--status-healthy)',
      borderColor: 'var(--status-healthy-border)',
    },
    FAILED_IN_WINDOW: {
      background: 'var(--status-warning-bg)',
      color: 'var(--status-warning)',
      borderColor: 'var(--status-warning-border)',
    },
  };

  return (
    <div className="h-full overflow-y-auto p-5 space-y-5 max-w-[1600px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Forecast Accuracy — Model Trust
          </h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Empirical evaluation of statistical prediction performance against simulated outcomes.
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
          SYNTHETIC VALIDATION DATA
        </span>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Prototype Accuracy', value: `${Math.round(metrics.overallAccuracy * 100)}%`, sub: 'Synthetic test set score', color: 'var(--status-healthy)' },
          { label: 'Lead Time MAE', value: `±${metrics.maeLeadTimeDays} Days`, sub: 'Mean absolute window error', color: 'var(--text-primary)' },
          { label: 'Precision / Recall', value: `${Math.round(metrics.precision * 100)}% / ${Math.round(metrics.recall * 100)}%`, sub: `F1: ${metrics.f1Score}`, color: 'var(--status-healthy)' },
          { label: 'False Positive / Negative', value: `${Math.round(metrics.falsePositiveRate * 100)}% / ${Math.round(metrics.falseNegativeRate * 100)}%`, sub: 'Error calibration rate', color: 'var(--status-warning)' },
        ].map((m) => (
          <div key={m.label} className="p-4 space-y-1" style={panelStyle}>
            <div className="section-label">{m.label}</div>
            <div className="text-xl font-bold font-mono mt-0.5" style={{ color: m.color }}>
              {m.value}
            </div>
            <div className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
              {m.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded" style={{ border: '1px solid var(--border-subtle)' }}>
        <div
          className="flex items-center gap-1.5 px-4 py-3"
          style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)' }}
        >
          <Target className="size-3.5" style={{ color: 'var(--green-400)' }} />
          <span className="section-label">Predicted vs Simulated Outcomes</span>
        </div>
        <table className="w-full text-left text-xs border-collapse">
          <thead style={{ background: 'var(--bg-elevated)' }}>
            <tr>
              {['Forecast ID', 'Asset', 'Platform', 'Pred. Risk', 'Window', 'Simulated Outcome', 'Lead Time Acc.', 'Calibration'].map((h) => (
                <th
                  key={h}
                  className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider"
                  style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.map((rec) => (
              <tr key={rec.id} className="list-row">
                <td className="px-4 py-3 font-mono font-bold" style={{ color: 'var(--text-primary)' }}>{rec.id}</td>
                <td className="px-4 py-3 font-mono" style={{ color: 'var(--text-secondary)' }}>{rec.equipmentId}</td>
                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{rec.platformClass}</td>
                <td className="px-4 py-3 font-mono font-bold text-right" style={{ color: 'var(--status-warning)' }}>
                  {rec.predictedRiskScore}%
                </td>
                <td className="px-4 py-3 font-mono" style={{ color: 'var(--text-secondary)' }}>{rec.predictedFailureWindow}</td>
                <td className="px-4 py-3">
                  <span
                    className="px-2 py-0.5 rounded text-[10px] font-semibold border"
                    style={OUTCOME_STYLES[rec.actualOutcome] ?? {
                      background: 'var(--bg-elevated)',
                      color: 'var(--text-muted)',
                      borderColor: 'var(--border-default)',
                    }}
                  >
                    {rec.actualOutcome.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-right" style={{ color: 'var(--text-secondary)' }}>
                  {rec.leadTimeDaysAccuracy > 0 ? `${rec.leadTimeDaysAccuracy}d` : 'N/A'}
                </td>
                <td className="px-4 py-3 text-center">
                  {rec.isCalibrated ? (
                    <span className="text-[11px] inline-flex items-center gap-1" style={{ color: 'var(--status-healthy)' }}>
                      <CheckCircle2 className="size-3" /> Calibrated
                    </span>
                  ) : (
                    <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Uncalibrated</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
