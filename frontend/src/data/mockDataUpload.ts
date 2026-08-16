import type { UploadBatch } from '../types/dataUpload';

export const mockUploadBatches: UploadBatch[] = [
  {
    batchId: 'BATCH-20260816-01',
    fileName: 'telemetry_northern_sector_w4.csv',
    fileSizeKb: 1420,
    uploadedAt: '2026-08-16 08:15',
    recordsCount: 4500,
    quality: {
      totalRows: 4500,
      validRecords: 4410,
      missingFieldsCount: 62,
      warningsCount: 28,
      errorsCount: 0,
      healthScorePercent: 98
    },
    syncStatus: 'LOCAL_PROCESSED'
  },
  {
    batchId: 'BATCH-20260812-04',
    fileName: 'spares_inventory_snapshot.xlsx',
    fileSizeKb: 890,
    uploadedAt: '2026-08-12 14:00',
    recordsCount: 1200,
    quality: {
      totalRows: 1200,
      validRecords: 1185,
      missingFieldsCount: 10,
      warningsCount: 5,
      errorsCount: 0,
      healthScorePercent: 99
    },
    syncStatus: 'SYNCED'
  }
];

export const mockSampleCsvPreview = [
  { id: 'REC-001', equipmentId: 'EQ-042', telemetryType: 'Transmission Oil Pressure (PSI)', readingValue: '42.4 (Variance +18%)', status: 'WARNING' as const, note: 'Exceeds threshold' },
  { id: 'REC-002', equipmentId: 'EQ-042', telemetryType: 'Engine Coolant Temp (°C)', readingValue: '88.2', status: 'VALID' as const, note: 'Nominal' },
  { id: 'REC-003', equipmentId: 'EQ-117', telemetryType: 'Drive Shaft Vibration (Hz)', readingValue: '142.8 (Peak FFT)', status: 'WARNING' as const, note: 'Frequency spike' },
  { id: 'REC-004', equipmentId: 'EQ-203', telemetryType: 'CTIS System Pressure (Bar)', readingValue: '3.1', status: 'VALID' as const, note: 'Nominal' },
  { id: 'REC-005', equipmentId: 'EQ-405', telemetryType: 'Pneumatic Brake Line (PSI)', readingValue: '28.1 (Min Baseline 45)', status: 'ERROR' as const, note: 'Safety threshold breach' },
  { id: 'REC-006', equipmentId: 'EQ-512', telemetryType: 'Recoil Stroke Delay (ms)', readingValue: '312', status: 'WARNING' as const, note: '14% above baseline' }
];
