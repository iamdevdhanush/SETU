export interface ForecastRecord {
  id: string;
  equipmentId: string;
  platformClass: string;
  predictedDate: string;
  predictedFailureWindow: string;
  predictedRiskScore: number;
  actualOutcome: 'FAILED_IN_WINDOW' | 'PREVENTATIVE_SERVICED' | 'NO_FAILURE_OBSERVED' | 'FALSE_POSITIVE';
  actualDate?: string;
  leadTimeDaysAccuracy: number;
  confidenceScore: number;
  isCalibrated: boolean;
}

export interface ModelPerformanceMetrics {
  precision: number;
  recall: number;
  f1Score: number;
  maeLeadTimeDays: number;
  falsePositiveRate: number;
  falseNegativeRate: number;
  overallAccuracy: number;
}
