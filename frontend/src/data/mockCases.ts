import type { SustainmentCase } from '../types/sustainmentCase';

export const mockCasesList: SustainmentCase[] = [
  {
    id: 'CASE-801',
    equipmentId: 'EQ-042',
    equipmentName: 'EQ-042 (Tracked Platform A)',
    platformClass: 'Tracked Platform A',
    unitSector: 'Northern Sector / Workshop 4',
    riskLevel: 'CRITICAL',
    maintenanceRiskScore: 88,
    confidenceScore: 92,
    expectedWindowDays: '14–28 days',
    whyFlagged: [
      'Transmission Oil Pressure Variance exceeding 18% nominal limit',
      'Operating hours +340 hrs past fleet average service interval',
      'Extreme thermal cycle stress accumulated during high-altitude ops'
    ],
    spareImpact: [
      { partName: 'Tracked Power Transmission Assembly (SPR-101)', needQty: 1, stockQty: 0 },
      { partName: 'Heavy Drive Shaft Assembly (SPR-104)', needQty: 2, stockQty: 1 }
    ],
    setuRecommendation: 'Pre-stage Transmission SPR-101 and schedule priority workshop inspection within 14 days to prevent catastrophic gearbox seizure.',
    officerStatus: 'PENDING_REVIEW',
    updatedAt: '2026-08-16 09:30'
  },
  {
    id: 'CASE-802',
    equipmentId: 'EQ-405',
    equipmentName: 'EQ-405 (Wheeled Platform B)',
    platformClass: 'Wheeled Platform B',
    unitSector: 'Eastern Sector / Workshop 1',
    riskLevel: 'CRITICAL',
    maintenanceRiskScore: 91,
    confidenceScore: 96,
    expectedWindowDays: '7–15 days',
    whyFlagged: [
      'Pneumatic brake line pressure drops below safety baseline under braking loads',
      'Scheduled service overdue by 32 operational deployment days'
    ],
    spareImpact: [
      { partName: 'Pneumatic Brake Valve & Line Kit (SPR-502)', needQty: 2, stockQty: 0 }
    ],
    setuRecommendation: 'Issue immediate advisory stand-down for EQ-405. Dispatch Brake Line Kit SPR-502 from Regional Depot.',
    officerStatus: 'PENDING_REVIEW',
    updatedAt: '2026-08-16 10:15'
  },
  {
    id: 'CASE-803',
    equipmentId: 'EQ-512',
    equipmentName: 'EQ-512 (Artillery System B)',
    platformClass: 'Artillery System B',
    unitSector: 'Northern Sector / Battery 3',
    riskLevel: 'HIGH',
    maintenanceRiskScore: 79,
    confidenceScore: 90,
    expectedWindowDays: '18–30 days',
    whyFlagged: [
      'Recoil hydropneumatic damping stroke delay increased by 14%',
      'Targeting elevation gear backlash micro-play detected'
    ],
    spareImpact: [
      { partName: 'Precision Elevation Gear Ring (SPR-603)', needQty: 1, stockQty: 0 },
      { partName: 'Recoil Buffer Cylinder Seal Assembly (SPR-601)', needQty: 1, stockQty: 1 }
    ],
    setuRecommendation: 'Perform field recalibration of recoil stroke pressure and schedule elevation gear backlash inspection.',
    officerStatus: 'INSPECTION_SCHEDULED',
    officerNotes: 'Scheduled field inspection team for 2026-08-19.',
    updatedAt: '2026-08-15 16:40'
  },
  {
    id: 'CASE-804',
    equipmentId: 'EQ-117',
    equipmentName: 'EQ-117 (Tracked Platform A)',
    platformClass: 'Tracked Platform A',
    unitSector: 'Northern Sector / Workshop 2',
    riskLevel: 'HIGH',
    maintenanceRiskScore: 76,
    confidenceScore: 88,
    expectedWindowDays: '21–35 days',
    whyFlagged: [
      'Vibration frequency analysis indicates early gear tooth pitting',
      'Continuous operational cycle exceeds nominal standard by 28%'
    ],
    spareImpact: [
      { partName: 'Heavy Drive Shaft Assembly (SPR-104)', needQty: 2, stockQty: 1 },
      { partName: 'Primary Fuel Injector Array (SPR-301)', needQty: 6, stockQty: 4 }
    ],
    setuRecommendation: 'Order pre-allocation of Drive Shaft Assembly SPR-104 and conduct magnetic oil drain plug check.',
    officerStatus: 'ACCEPTED',
    officerNotes: 'Requisition submitted for Drive Shaft pre-positioning.',
    updatedAt: '2026-08-14 11:20'
  },
  {
    id: 'CASE-805',
    equipmentId: 'EQ-608',
    equipmentName: 'EQ-608 (Tracked Platform B)',
    platformClass: 'Tracked Platform B',
    unitSector: 'Northern Sector / Workshop 4',
    riskLevel: 'MODERATE',
    maintenanceRiskScore: 54,
    confidenceScore: 84,
    expectedWindowDays: '40–55 days',
    whyFlagged: [
      'APU ripple voltage variance exceeds 5% baseline'
    ],
    spareImpact: [
      { partName: 'APU Alternator & Regulator Set (SPR-305)', needQty: 1, stockQty: 3 }
    ],
    setuRecommendation: 'Review APU battery charge telemetry during routine scheduled stop.',
    officerStatus: 'PENDING_REVIEW',
    updatedAt: '2026-08-16 08:00'
  }
];
