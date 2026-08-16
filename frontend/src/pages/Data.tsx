import React, { useState } from 'react';
import { dataUploadService } from '@/lib/data/serviceLayer';
import { Upload, Database, CheckCircle2, Layers } from 'lucide-react';

export const DataPage: React.FC = () => {
  const [batches, setBatches] = useState(dataUploadService.getBatches());
  const previewData = dataUploadService.getSamplePreview();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState('');

  const panelStyle: React.CSSProperties = {
    background: 'var(--bg-surface)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius)',
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setTimeout(() => {
        dataUploadService.addBatch(file.name, Math.round(file.size / 1024) || 450, 2800);
        setBatches(dataUploadService.getBatches());
        setIsUploading(false);
        setUploadMsg(`Parsed ${file.name} — 2,800 telemetry rows validated.`);
        setTimeout(() => setUploadMsg(''), 4000);
      }, 1000);
    }
  };

  const STATUS_STYLE: Record<string, React.CSSProperties> = {
    VALID: { background: 'var(--status-healthy-bg)', color: 'var(--status-healthy)', borderColor: 'var(--status-healthy-border)' },
    WARNING: { background: 'var(--status-warning-bg)', color: 'var(--status-warning)', borderColor: 'var(--status-warning-border)' },
    ERROR: { background: 'var(--status-critical-bg)', color: 'var(--status-critical)', borderColor: 'var(--status-critical-border)' },
  };

  return (
    <div className="h-full overflow-y-auto p-5 space-y-5 max-w-[1600px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Data Ingestion
          </h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Upload and validate CSV/XLSX telemetry datasets for local processing.
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
          PROTOTYPE MODE
        </span>
      </div>

      {/* Upload success */}
      {uploadMsg && (
        <div
          className="p-3 rounded text-xs font-mono flex items-center gap-2"
          style={{
            background: 'var(--status-healthy-bg)',
            border: '1px solid var(--status-healthy-border)',
            color: 'var(--status-healthy)',
          }}
        >
          <CheckCircle2 className="size-4 shrink-0" />
          {uploadMsg}
        </div>
      )}

      {/* Dropzone */}
      <div
        className="p-8 border-2 border-dashed rounded text-center space-y-3"
        style={{
          background: 'var(--bg-surface)',
          borderColor: 'var(--border-strong)',
          borderRadius: 'var(--radius)',
        }}
      >
        <div
          className="size-10 rounded-full flex items-center justify-center mx-auto"
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
        >
          <Upload className="size-5" style={{ color: 'var(--green-400)' }} />
        </div>
        <div>
          <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
            Upload Telemetry Dataset (.csv, .xlsx)
          </div>
          <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Mock file parser for schema validation and local memory storage
          </p>
        </div>
        <label
          className="inline-block px-4 py-1.5 rounded text-xs font-semibold cursor-pointer transition-colors"
          style={{
            background: 'var(--green-700)',
            color: '#fff',
          }}
        >
          {isUploading ? 'Parsing…' : 'Select File'}
          <input type="file" accept=".csv,.xlsx" onChange={handleFileUpload} className="hidden" disabled={isUploading} />
        </label>
        <p className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
          PROTOTYPE MODE: Data parsed locally. No backend transmission.
        </p>
      </div>

      {/* Batches + Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        {/* Batch Log */}
        <div className="p-4 space-y-3" style={panelStyle}>
          <div className="section-label flex items-center gap-1.5">
            <Layers className="size-3" style={{ color: 'var(--green-400)' }} /> Batch History
          </div>
          <div className="space-y-2">
            {batches.map((b) => (
              <div
                key={b.batchId}
                className="px-3 py-2.5 rounded space-y-1 text-xs"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                    {b.fileName}
                  </span>
                  <span
                    className="text-[9px] px-1.5 py-0.5 rounded font-mono shrink-0 border"
                    style={{
                      background: 'var(--status-healthy-bg)',
                      color: 'var(--status-healthy)',
                      borderColor: 'var(--status-healthy-border)',
                    }}
                  >
                    {b.syncStatus}
                  </span>
                </div>
                <div className="flex justify-between font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>
                  <span>{b.recordsCount} rows</span>
                  <span>{b.uploadedAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Preview table */}
        <div className="lg:col-span-2 overflow-hidden rounded" style={{ border: '1px solid var(--border-subtle)' }}>
          <div
            className="flex items-center gap-1.5 px-4 py-3"
            style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)' }}
          >
            <Database className="size-3.5" style={{ color: 'var(--green-400)' }} />
            <span className="section-label">Parsed Telemetry Sample Preview</span>
          </div>
          <table className="w-full text-left text-xs border-collapse">
            <thead style={{ background: 'var(--bg-elevated)' }}>
              <tr>
                {['Rec ID', 'Asset ID', 'Parameter', 'Reading Value', 'Validation'].map((h) => (
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
              {previewData.map((row) => (
                <tr key={row.id} className="list-row">
                  <td className="px-4 py-2.5 font-mono" style={{ color: 'var(--text-muted)' }}>{row.id}</td>
                  <td className="px-4 py-2.5 font-mono font-bold" style={{ color: 'var(--text-primary)' }}>{row.equipmentId}</td>
                  <td className="px-4 py-2.5" style={{ color: 'var(--text-secondary)' }}>{row.telemetryType}</td>
                  <td className="px-4 py-2.5 font-mono" style={{ color: 'var(--text-primary)' }}>{row.readingValue}</td>
                  <td className="px-4 py-2.5">
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-semibold border"
                      style={STATUS_STYLE[row.status] ?? STATUS_STYLE.VALID}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
