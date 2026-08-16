import type { RiskLevel } from './equipment';

export type CaseOfficerStatus = 'PENDING_REVIEW' | 'ACCEPTED' | 'DISMISSED' | 'INSPECTION_SCHEDULED';

export interface SustainmentCase {
  id: string;
  equipmentId: string;
  equipmentName: string;
  platformClass: string;
  unitSector: string;
  riskLevel: RiskLevel;
  maintenanceRiskScore: number;
  confidenceScore: number;
  expectedWindowDays: string;
  whyFlagged: string[];
  spareImpact: {
    partName: string;
    needQty: number;
    stockQty: number;
  }[];
  setuRecommendation: string;
  officerStatus: CaseOfficerStatus;
  officerNotes?: string;
  updatedAt: string;
}
