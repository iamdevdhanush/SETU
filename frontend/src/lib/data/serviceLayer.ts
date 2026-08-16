import type { Equipment, RiskLevel } from '../../types/equipment';
import type { SparePart } from '../../types/spare';
import type { SustainmentCase, CaseOfficerStatus } from '../../types/sustainmentCase';
import type { SimulationParams, SimulationResultMetrics } from '../../types/simulation';
import type { ForecastRecord, ModelPerformanceMetrics } from '../../types/forecast';
import type { AuditEntry } from '../../types/audit';
import type { UploadBatch } from '../../types/dataUpload';

import {
  mockEquipmentList,
  mockSparesList,
  mockCasesList,
  mockForecastMetrics,
  mockForecastRecords,
  mockAuditTrail,
  mockUploadBatches,
  mockSampleCsvPreview
} from '../../data';

let equipmentStore: Equipment[] = [...mockEquipmentList];
let casesStore: SustainmentCase[] = [...mockCasesList];
let auditStore: AuditEntry[] = [...mockAuditTrail];
let uploadStore: UploadBatch[] = [...mockUploadBatches];

type ChangeListener = () => void;
const listeners: Set<ChangeListener> = new Set();

const notifyListeners = () => {
  listeners.forEach((listener) => listener());
};

export const subscribeDataChanges = (listener: ChangeListener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const equipmentService = {
  getAll: (): Equipment[] => [...equipmentStore],
  getById: (id: string): Equipment | undefined => equipmentStore.find((eq) => eq.id === id),
  getByRiskLevel: (risk: RiskLevel): Equipment[] => equipmentStore.filter((eq) => eq.riskLevel === risk),
  getFleetStats: () => {
    const total = equipmentStore.length;
    const critical = equipmentStore.filter((eq) => eq.riskLevel === 'CRITICAL').length;
    const high = equipmentStore.filter((eq) => eq.riskLevel === 'HIGH').length;
    const moderate = equipmentStore.filter((eq) => eq.riskLevel === 'MODERATE').length;
    const normal = equipmentStore.filter((eq) => eq.riskLevel === 'NORMAL').length;
    const operational = equipmentStore.filter((eq) => eq.status === 'OPERATIONAL').length;
    const overallReadiness = Math.round((operational / total) * 100);

    return {
      total,
      critical,
      high,
      moderate,
      normal,
      operational,
      overallReadiness
    };
  }
};

export const sparesService = {
  getAll: (): SparePart[] => [...mockSparesList],
  getShortages: (): SparePart[] => mockSparesList.filter((sp) => sp.shortageGap > 0),
  getById: (id: string): SparePart | undefined => mockSparesList.find((sp) => sp.id === id)
};

export const casesService = {
  getAll: (): SustainmentCase[] => [...casesStore],
  getById: (id: string): SustainmentCase | undefined => casesStore.find((c) => c.id === id),
  getPending: (): SustainmentCase[] => casesStore.filter((c) => c.officerStatus === 'PENDING_REVIEW'),
  
  updateOfficerDecision: (caseId: string, status: CaseOfficerStatus, notes?: string): SustainmentCase | undefined => {
    const caseIndex = casesStore.findIndex((c) => c.id === caseId);
    if (caseIndex === -1) return undefined;

    const updatedCase: SustainmentCase = {
      ...casesStore[caseIndex],
      officerStatus: status,
      officerNotes: notes || casesStore[caseIndex].officerNotes,
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    casesStore[caseIndex] = updatedCase;

    const auditEntry: AuditEntry = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      caseId: updatedCase.id,
      equipmentId: updatedCase.equipmentId,
      predictedRiskScore: updatedCase.maintenanceRiskScore,
      predictionDetails: updatedCase.whyFlagged.join('; '),
      officerDecision: status,
      officerId: 'OFFICER-CURRENT',
      actualOutcome: status === 'ACCEPTED' ? 'Advisory recommendation accepted and logged' : status === 'INSPECTION_SCHEDULED' ? 'Inspection ticket generated' : 'Case dismissed by officer',
      verificationStatus: 'PENDING_VALIDATION'
    };

    auditStore = [auditEntry, ...auditStore];
    notifyListeners();

    return updatedCase;
  }
};

export const simulationService = {
  runSimulation: (params: SimulationParams): { baseline: SimulationResultMetrics; simulated: SimulationResultMetrics } => {
    const fleetStats = equipmentService.getFleetStats();
    
    const baseline: SimulationResultMetrics = {
      projectedReadinessPercent: 74,
      projectedBacklogPercent: 22,
      projectedSpareShortagesCount: 14,
      criticalCasesCount: fleetStats.critical,
      highRiskCount: fleetStats.high,
      moderateRiskCount: fleetStats.moderate,
      normalCount: fleetStats.normal
    };

    const spareImpact = Math.round(params.spareAllocationOffsetPercent * 0.25);
    const capacityImpact = Math.round(params.maintenanceCapacityOffsetPercent * 0.3);
    const timingImpact = Math.round(params.interventionTimingSpeedDays * 0.4);

    const projectedReadinessPercent = Math.min(98, Math.max(50, baseline.projectedReadinessPercent + spareImpact + capacityImpact + timingImpact));
    const projectedBacklogPercent = Math.max(5, Math.min(50, baseline.projectedBacklogPercent - Math.round(capacityImpact * 0.8) - Math.round(spareImpact * 0.5)));
    const projectedSpareShortagesCount = Math.max(1, baseline.projectedSpareShortagesCount - Math.round(params.spareAllocationOffsetPercent * 0.18));

    const simulated: SimulationResultMetrics = {
      projectedReadinessPercent,
      projectedBacklogPercent,
      projectedSpareShortagesCount,
      criticalCasesCount: Math.max(0, baseline.criticalCasesCount - (spareImpact > 5 ? 1 : 0)),
      highRiskCount: Math.max(1, baseline.highRiskCount - (capacityImpact > 5 ? 1 : 0)),
      moderateRiskCount: baseline.moderateRiskCount,
      normalCount: baseline.normalCount + 2
    };

    return { baseline, simulated };
  }
};

export const forecastService = {
  getMetrics: (): ModelPerformanceMetrics => ({ ...mockForecastMetrics }),
  getRecords: (): ForecastRecord[] => [...mockForecastRecords]
};

export const auditService = {
  getEntries: (): AuditEntry[] => [...auditStore]
};

export const dataUploadService = {
  getBatches: (): UploadBatch[] => [...uploadStore],
  getSamplePreview: () => [...mockSampleCsvPreview],
  addBatch: (fileName: string, fileSizeKb: number, recordsCount: number): UploadBatch => {
    const newBatch: UploadBatch = {
      batchId: `BATCH-${Date.now().toString().slice(-6)}`,
      fileName,
      fileSizeKb,
      uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      recordsCount,
      quality: {
        totalRows: recordsCount,
        validRecords: Math.round(recordsCount * 0.96),
        missingFieldsCount: Math.round(recordsCount * 0.03),
        warningsCount: Math.round(recordsCount * 0.01),
        errorsCount: 0,
        healthScorePercent: 96
      },
      syncStatus: 'LOCAL_PROCESSED'
    };
    uploadStore = [newBatch, ...uploadStore];
    notifyListeners();
    return newBatch;
  }
};
