import type { AuditEntry } from '../types/audit';

export const mockAuditTrail: AuditEntry[] = [
  {
    id: 'AUD-001',
    timestamp: '2026-08-16 09:30:14',
    caseId: 'CASE-801',
    equipmentId: 'EQ-042',
    predictedRiskScore: 88,
    predictionDetails: 'Transmission pressure variance + thermal load threshold breach.',
    officerDecision: 'PENDING_REVIEW',
    officerId: 'OFFICER-SYS',
    actualOutcome: 'Awaiting human officer evaluation',
    verificationStatus: 'PENDING_VALIDATION'
  },
  {
    id: 'AUD-002',
    timestamp: '2026-08-15 16:40:22',
    caseId: 'CASE-803',
    equipmentId: 'EQ-512',
    predictedRiskScore: 79,
    predictionDetails: 'Recoil cylinder damping delay 14% increase.',
    officerDecision: 'INSPECTION_SCHEDULED',
    officerId: 'OFFICER-7042',
    actualOutcome: 'Inspection team dispatched for 2026-08-19',
    verificationStatus: 'VERIFIED_CORRECT'
  },
  {
    id: 'AUD-003',
    timestamp: '2026-08-14 11:20:05',
    caseId: 'CASE-804',
    equipmentId: 'EQ-117',
    predictedRiskScore: 76,
    predictionDetails: 'Gear tooth pitting vibration frequency signature.',
    officerDecision: 'ACCEPTED',
    officerId: 'OFFICER-3011',
    actualOutcome: 'Spare Drive Shaft pre-allocated at Workshop 2',
    verificationStatus: 'VERIFIED_CORRECT'
  },
  {
    id: 'AUD-004',
    timestamp: '2026-08-10 14:15:33',
    caseId: 'CASE-792',
    equipmentId: 'EQ-203',
    predictedRiskScore: 52,
    predictionDetails: 'Minor CTIS pressure drop anomaly.',
    officerDecision: 'DISMISSED',
    officerId: 'OFFICER-7042',
    actualOutcome: 'Routine service logged for 25k km interval without premature failure',
    verificationStatus: 'VERIFIED_CORRECT'
  }
];
