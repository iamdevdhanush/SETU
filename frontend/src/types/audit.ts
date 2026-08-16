import type { CaseOfficerStatus } from './sustainmentCase';

export interface AuditEntry {
  id: string;
  timestamp: string;
  caseId: string;
  equipmentId: string;
  predictedRiskScore: number;
  predictionDetails: string;
  officerDecision: CaseOfficerStatus;
  officerId: string;
  actualOutcome: string;
  verificationStatus: 'VERIFIED_CORRECT' | 'VERIFIED_DISCREPANCY' | 'PENDING_VALIDATION';
}
