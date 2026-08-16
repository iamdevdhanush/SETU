import type { ForecastRecord, ModelPerformanceMetrics } from '../types/forecast';

export const mockForecastMetrics: ModelPerformanceMetrics = {
  precision: 0.892,
  recall: 0.865,
  f1Score: 0.878,
  maeLeadTimeDays: 3.4,
  falsePositiveRate: 0.078,
  falseNegativeRate: 0.057,
  overallAccuracy: 0.914
};

export const mockForecastRecords: ForecastRecord[] = [
  {
    id: 'FCT-901',
    equipmentId: 'EQ-031',
    platformClass: 'Tracked Platform A',
    predictedDate: '2026-07-15',
    predictedFailureWindow: '14–21 days',
    predictedRiskScore: 84,
    actualOutcome: 'PREVENTATIVE_SERVICED',
    actualDate: '2026-07-28',
    leadTimeDaysAccuracy: 13,
    confidenceScore: 91,
    isCalibrated: true
  },
  {
    id: 'FCT-902',
    equipmentId: 'EQ-109',
    platformClass: 'Wheeled Platform A',
    predictedDate: '2026-07-10',
    predictedFailureWindow: '20–30 days',
    predictedRiskScore: 78,
    actualOutcome: 'FAILED_IN_WINDOW',
    actualDate: '2026-07-31',
    leadTimeDaysAccuracy: 21,
    confidenceScore: 87,
    isCalibrated: true
  },
  {
    id: 'FCT-903',
    equipmentId: 'EQ-222',
    platformClass: 'Tracked Platform B',
    predictedDate: '2026-06-25',
    predictedFailureWindow: '30–45 days',
    predictedRiskScore: 65,
    actualOutcome: 'FALSE_POSITIVE',
    actualDate: 'N/A',
    leadTimeDaysAccuracy: 0,
    confidenceScore: 72,
    isCalibrated: false
  },
  {
    id: 'FCT-904',
    equipmentId: 'EQ-501',
    platformClass: 'Artillery System B',
    predictedDate: '2026-06-18',
    predictedFailureWindow: '10–20 days',
    predictedRiskScore: 92,
    actualOutcome: 'PREVENTATIVE_SERVICED',
    actualDate: '2026-06-29',
    leadTimeDaysAccuracy: 11,
    confidenceScore: 95,
    isCalibrated: true
  },
  {
    id: 'FCT-905',
    equipmentId: 'EQ-312',
    platformClass: 'Recovery Platform A',
    predictedDate: '2026-05-30',
    predictedFailureWindow: '25–40 days',
    predictedRiskScore: 58,
    actualOutcome: 'NO_FAILURE_OBSERVED',
    actualDate: 'N/A',
    leadTimeDaysAccuracy: 0,
    confidenceScore: 81,
    isCalibrated: true
  }
];
