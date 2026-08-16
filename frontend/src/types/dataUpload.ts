export interface DataQualitySummary {
  totalRows: number;
  validRecords: number;
  missingFieldsCount: number;
  warningsCount: number;
  errorsCount: number;
  healthScorePercent: number;
}

export interface PreviewRecord {
  id: string;
  equipmentId: string;
  telemetryType: string;
  readingValue: string;
  status: 'VALID' | 'WARNING' | 'ERROR';
  note?: string;
}

export interface UploadBatch {
  batchId: string;
  fileName: string;
  fileSizeKb: number;
  uploadedAt: string;
  recordsCount: number;
  quality: DataQualitySummary;
  syncStatus: 'LOCAL_PROCESSED' | 'SYNCED' | 'FAILED' | 'PENDING';
}
