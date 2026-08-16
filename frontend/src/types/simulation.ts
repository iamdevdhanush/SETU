export interface SimulationParams {
  spareAllocationOffsetPercent: number; // e.g. -20 to +50%
  maintenanceCapacityOffsetPercent: number; // e.g. -20 to +40%
  interventionTimingSpeedDays: number; // e.g. -15 to +15 days
}

export interface SimulationResultMetrics {
  projectedReadinessPercent: number;
  projectedBacklogPercent: number;
  projectedSpareShortagesCount: number;
  criticalCasesCount: number;
  highRiskCount: number;
  moderateRiskCount: number;
  normalCount: number;
}

export interface ScenarioComparison {
  baseline: SimulationResultMetrics;
  simulated: SimulationResultMetrics;
  params: SimulationParams;
}
