import type { Equipment } from '../types/equipment';

export const mockEquipmentList: Equipment[] = [
  {
    id: 'EQ-042',
    name: 'EQ-042 (Tracked Platform A)',
    platformClass: 'Tracked Platform A',
    unitSector: 'Northern Sector / Workshop 4',
    status: 'OPERATIONAL',
    riskLevel: 'CRITICAL',
    maintenanceRiskScore: 88,
    confidenceScore: 92,
    predictedFailureWindowDays: { min: 14, max: 28 },
    operatingHours: 2840,
    mileageKm: 14200,
    lastServiceDate: '2026-05-10',
    nextScheduledService: '2026-09-01',
    primaryFactors: [
      { factor: 'Transmission Oil Pressure Variance', weight: 'HIGH', description: 'Micro-fluctuations detected during high-load operational cycles.' },
      { factor: 'Operating Hours Above Median', weight: 'HIGH', description: '+340 hours beyond fleet average service threshold.' },
      { factor: 'Thermal Stress Exposure', weight: 'MEDIUM', description: 'Frequent extreme thermal cycles in high-altitude deployment.' },
      { factor: 'Historical Component Fatigue', weight: 'MEDIUM', description: 'Previous seal replacement at 1800 hrs.' }
    ],
    spareImpact: [
      { partId: 'SPR-101', partName: 'Tracked Power Transmission Assembly', requiredQty: 1, currentStock: 0, gap: 1, criticality: 'HIGH' },
      { partId: 'SPR-104', partName: 'Heavy Drive Shaft Assembly', requiredQty: 2, currentStock: 1, gap: 1, criticality: 'HIGH' },
      { partId: 'SPR-202', partName: 'High-Pressure Hydraulic Seal Kit', requiredQty: 4, currentStock: 6, gap: 0, criticality: 'MEDIUM' }
    ],
    maintenanceHistory: [
      { id: 'MH-101', date: '2026-05-10', eventType: 'ROUTINE_SERVICE', description: 'Full oil & fluid replacement. Filter inspection clean.', technicianId: 'TECH-402', operatingHoursAtEvent: 2400 },
      { id: 'MH-102', date: '2025-11-18', eventType: 'COMPONENT_REPLACE', description: 'Hydraulic high-pressure valve replacement.', technicianId: 'TECH-309', operatingHoursAtEvent: 1850 },
      { id: 'MH-103', date: '2025-04-02', eventType: 'COMMISSIONED', description: 'Initial depot commissioning and unit deployment.', technicianId: 'TECH-101', operatingHoursAtEvent: 0 }
    ],
    advisoryRecommendation: 'Schedule priority workshop review within 14 days. Pre-stage Transmission Assembly SPR-101 from Sector Hub.'
  },
  {
    id: 'EQ-117',
    name: 'EQ-117 (Tracked Platform A)',
    platformClass: 'Tracked Platform A',
    unitSector: 'Northern Sector / Workshop 2',
    status: 'DEGRADED',
    riskLevel: 'HIGH',
    maintenanceRiskScore: 76,
    confidenceScore: 88,
    predictedFailureWindowDays: { min: 21, max: 35 },
    operatingHours: 2310,
    mileageKm: 11800,
    lastServiceDate: '2026-04-12',
    nextScheduledService: '2026-08-30',
    primaryFactors: [
      { factor: 'Final Drive Wear Telemetry', weight: 'HIGH', description: 'Vibration frequency anomaly matching gear tooth degradation.' },
      { factor: 'High Usage Rate', weight: 'HIGH', description: 'Operational duty cycle 28% higher than nominal.' },
      { factor: 'Engine Temperature Spikes', weight: 'MEDIUM', description: 'Transient temperature excursions under continuous load.' }
    ],
    spareImpact: [
      { partId: 'SPR-104', partName: 'Heavy Drive Shaft Assembly', requiredQty: 2, currentStock: 1, gap: 1, criticality: 'HIGH' },
      { partId: 'SPR-301', partName: 'Primary Fuel Injector Array', requiredQty: 6, currentStock: 4, gap: 2, criticality: 'MEDIUM' }
    ],
    maintenanceHistory: [
      { id: 'MH-104', date: '2026-04-12', eventType: 'INSPECTION', description: 'Track tensioning adjust and drive inspection.', technicianId: 'TECH-402', operatingHoursAtEvent: 2010 },
      { id: 'MH-105', date: '2025-09-05', eventType: 'ROUTINE_SERVICE', description: 'Engine oil, coolant flush, track bolt torque verification.', technicianId: 'TECH-204', operatingHoursAtEvent: 1420 }
    ],
    advisoryRecommendation: 'Inspect Final Drive housing for metallic debris. Order pre-positioning of Drive Shaft SPR-104.'
  },
  {
    id: 'EQ-203',
    name: 'EQ-203 (Wheeled Platform A)',
    platformClass: 'Wheeled Platform A',
    unitSector: 'Western Sector / Mobile Unit 1',
    status: 'OPERATIONAL',
    riskLevel: 'MODERATE',
    maintenanceRiskScore: 48,
    confidenceScore: 85,
    predictedFailureWindowDays: { min: 45, max: 60 },
    operatingHours: 1650,
    mileageKm: 24800,
    lastServiceDate: '2026-06-20',
    nextScheduledService: '2026-10-15',
    primaryFactors: [
      { factor: 'Tire Pressure Management Valve Leak', weight: 'MEDIUM', description: 'Slow pressure drop in central tire inflation system.' },
      { factor: 'Approaching Service Interval', weight: 'LOW', description: 'Scheduled 25,000 km maintenance due in ~200 km.' }
    ],
    spareImpact: [
      { partId: 'SPR-401', partName: 'Central Tire Inflation Valve Assembly', requiredQty: 1, currentStock: 8, gap: 0, criticality: 'LOW' }
    ],
    maintenanceHistory: [
      { id: 'MH-106', date: '2026-06-20', eventType: 'ROUTINE_SERVICE', description: 'Wheel alignment, hub bearing lubrication.', technicianId: 'TECH-112', operatingHoursAtEvent: 1500 }
    ],
    advisoryRecommendation: 'Address CTIS valve leak during upcoming routine 25,000 km service.'
  },
  {
    id: 'EQ-318',
    name: 'EQ-318 (Recovery Platform A)',
    platformClass: 'Recovery Platform A',
    unitSector: 'Central Base / Depot 1',
    status: 'OPERATIONAL',
    riskLevel: 'NORMAL',
    maintenanceRiskScore: 18,
    confidenceScore: 94,
    predictedFailureWindowDays: { min: 90, max: 120 },
    operatingHours: 920,
    mileageKm: 6100,
    lastServiceDate: '2026-07-01',
    nextScheduledService: '2026-11-20',
    primaryFactors: [
      { factor: 'Winch Hydraulic Load Test Clean', weight: 'LOW', description: 'All stress parameters within nominal design limits.' }
    ],
    spareImpact: [],
    maintenanceHistory: [
      { id: 'MH-107', date: '2026-07-01', eventType: 'ROUTINE_SERVICE', description: 'Annual winch cable stress calibration.', technicianId: 'TECH-301', operatingHoursAtEvent: 880 }
    ],
    advisoryRecommendation: 'No immediate action required. Continue routine monitoring.'
  },
  {
    id: 'EQ-405',
    name: 'EQ-405 (Wheeled Platform B)',
    platformClass: 'Wheeled Platform B',
    unitSector: 'Eastern Sector / Workshop 1',
    status: 'MAINTENANCE_REQUIRED',
    riskLevel: 'CRITICAL',
    maintenanceRiskScore: 91,
    confidenceScore: 96,
    predictedFailureWindowDays: { min: 7, max: 15 },
    operatingHours: 3120,
    mileageKm: 38900,
    lastServiceDate: '2026-03-01',
    nextScheduledService: '2026-07-15',
    primaryFactors: [
      { factor: 'Brake Line Pressure Loss', weight: 'HIGH', description: 'Sensor alert: Pneumatic line pressure below safety baseline.' },
      { factor: 'Overdue Scheduled Service', weight: 'HIGH', description: 'Overdue by 32 days due to operational deployment.' }
    ],
    spareImpact: [
      { partId: 'SPR-502', partName: 'Pneumatic Brake Valve & Line Kit', requiredQty: 2, currentStock: 0, gap: 2, criticality: 'HIGH' }
    ],
    maintenanceHistory: [
      { id: 'MH-108', date: '2026-03-01', eventType: 'ROUTINE_SERVICE', description: 'Brake pad replacement and master cylinder check.', technicianId: 'TECH-505', operatingHoursAtEvent: 2700 }
    ],
    advisoryRecommendation: 'Immediate operational stand-down for brake line replacement.'
  },
  {
    id: 'EQ-512',
    name: 'EQ-512 (Artillery System B)',
    platformClass: 'Artillery System B',
    unitSector: 'Northern Sector / Battery 3',
    status: 'OPERATIONAL',
    riskLevel: 'HIGH',
    maintenanceRiskScore: 79,
    confidenceScore: 90,
    predictedFailureWindowDays: { min: 18, max: 30 },
    operatingHours: 1450,
    mileageKm: 4200,
    lastServiceDate: '2026-05-15',
    nextScheduledService: '2026-09-10',
    primaryFactors: [
      { factor: 'Recoil Hydropneumatic Cylinder Pressure', weight: 'HIGH', description: 'Recoil stroke damping time increased by 14% across last 45 cycles.' },
      { factor: 'Elevation Gear Backlash', weight: 'MEDIUM', description: 'Micro-play detected during automated target positioning.' }
    ],
    spareImpact: [
      { partId: 'SPR-601', partName: 'Recoil Buffer Cylinder Seal Assembly', requiredQty: 1, currentStock: 1, gap: 0, criticality: 'HIGH' },
      { partId: 'SPR-603', partName: 'Precision Elevation Gear Ring', requiredQty: 1, currentStock: 0, gap: 1, criticality: 'HIGH' }
    ],
    maintenanceHistory: [
      { id: 'MH-109', date: '2026-05-15', eventType: 'INSPECTION', description: 'Borescope inspection of barrel and recoil mechanism check.', technicianId: 'TECH-202', operatingHoursAtEvent: 1300 }
    ],
    advisoryRecommendation: 'Perform recoil cylinder fluid pressure recalibration. Request priority dispatch of Elevation Gear Ring.'
  },
  {
    id: 'EQ-608',
    name: 'EQ-608 (Tracked Platform B)',
    platformClass: 'Tracked Platform B',
    unitSector: 'Northern Sector / Workshop 4',
    status: 'OPERATIONAL',
    riskLevel: 'MODERATE',
    maintenanceRiskScore: 54,
    confidenceScore: 84,
    predictedFailureWindowDays: { min: 40, max: 55 },
    operatingHours: 1980,
    mileageKm: 9400,
    lastServiceDate: '2026-06-05',
    nextScheduledService: '2026-10-01',
    primaryFactors: [
      { factor: 'Auxiliary Power Unit Voltage Droop', weight: 'MEDIUM', description: 'APU alternator ripple voltage exceeds recommended 5% threshold.' }
    ],
    spareImpact: [
      { partId: 'SPR-305', partName: 'APU Alternator & Regulator Set', requiredQty: 1, currentStock: 3, gap: 0, criticality: 'MEDIUM' }
    ],
    maintenanceHistory: [
      { id: 'MH-110', date: '2026-06-05', eventType: 'ROUTINE_SERVICE', description: 'APU belt replacement and battery check.', technicianId: 'TECH-402', operatingHoursAtEvent: 1850 }
    ],
    advisoryRecommendation: 'Monitor APU voltage telemetry during static battery charge cycles.'
  },
  {
    id: 'EQ-721',
    name: 'EQ-721 (Wheeled Platform A)',
    platformClass: 'Wheeled Platform A',
    unitSector: 'Southern Sector / Workshop 1',
    status: 'OPERATIONAL',
    riskLevel: 'NORMAL',
    maintenanceRiskScore: 12,
    confidenceScore: 97,
    predictedFailureWindowDays: { min: 120, max: 150 },
    operatingHours: 780,
    mileageKm: 11200,
    lastServiceDate: '2026-07-20',
    nextScheduledService: '2026-12-10',
    primaryFactors: [
      { factor: 'All Systems Nominal', weight: 'LOW', description: 'No anomalies recorded across 48 telemetry channels.' }
    ],
    spareImpact: [],
    maintenanceHistory: [
      { id: 'MH-111', date: '2026-07-20', eventType: 'ROUTINE_SERVICE', description: 'Standard 10,000 km maintenance completed.', technicianId: 'TECH-601', operatingHoursAtEvent: 750 }
    ],
    advisoryRecommendation: 'No maintenance intervention required.'
  }
];
