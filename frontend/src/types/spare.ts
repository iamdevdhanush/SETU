import type { PlatformClass } from './equipment';

export type ShortageRiskLevel = 'CRITICAL_GAP' | 'HIGH_RISK' | 'MODERATE' | 'SUFFICIENT';

export interface SparePart {
  id: string;
  partNumber: string;
  name: string;
  category: 'Powertrain' | 'Hydraulics' | 'Electronics' | 'Braking' | 'Track/Tires' | 'Engine Assembly';
  currentStock: number;
  minThreshold: number;
  predictedDemand30d: number;
  predictedDemand60d: number;
  predictedDemand90d: number;
  shortageGap: number;
  shortageRisk: ShortageRiskLevel;
  reorderLeadTimeDays: number;
  unitCostUSD: number;
  compatiblePlatforms: PlatformClass[];
  primaryConsumerUnits: string[];
}
