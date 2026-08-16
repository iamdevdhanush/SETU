export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'NORMAL';
export type EquipmentStatus = 'OPERATIONAL' | 'MAINTENANCE_REQUIRED' | 'UNDER_INSPECTION' | 'DEGRADED';
export type PlatformClass = 'Tracked Platform A' | 'Tracked Platform B' | 'Wheeled Platform A' | 'Wheeled Platform B' | 'Recovery Platform A' | 'Artillery System B';

export interface FactorBreakdown {
  factor: string;
  weight: 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
}

export interface SpareImpactItem {
  partId: string;
  partName: string;
  requiredQty: number;
  currentStock: number;
  gap: number;
  criticality: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface MaintenanceEvent {
  id: string;
  date: string;
  eventType: 'COMMISSIONED' | 'ROUTINE_SERVICE' | 'COMPONENT_REPLACE' | 'INSPECTION' | 'EMERGENCY_REPAIR';
  description: string;
  technicianId: string;
  operatingHoursAtEvent: number;
}

export interface Equipment {
  id: string; // e.g. "EQ-042"
  name: string; // e.g. "EQ-042 (Tracked Platform A)"
  platformClass: PlatformClass;
  unitSector: string; // e.g. "Northern Sector / Workshop 4"
  status: EquipmentStatus;
  riskLevel: RiskLevel;
  maintenanceRiskScore: number; // 0 to 100 percentage
  confidenceScore: number; // 0 to 100 percentage (Risk != Confidence)
  predictedFailureWindowDays: { min: number; max: number };
  operatingHours: number;
  mileageKm: number;
  lastServiceDate: string;
  nextScheduledService: string;
  primaryFactors: FactorBreakdown[];
  spareImpact: SpareImpactItem[];
  maintenanceHistory: MaintenanceEvent[];
  advisoryRecommendation: string;
}
