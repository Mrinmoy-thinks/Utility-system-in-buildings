export type UtilityType = 'water' | 'electricity' | 'municipal';

export type AnomalySeverity = 'NORMAL' | 'WATCH' | 'WARNING' | 'CRITICAL';

export interface ConsumptionRecord {
  date: string; // YYYY-MM-DD
  dayIndex: number;
  buildingId: string;
  utilityType: UtilityType;
  consumption: number; // Litres for water, kWh for electricity, events/hours for municipal
  temperatureC: number;
  rainfallMm: number;
  occupancyCount: number;
  outageHours: number;
  tariffPerUnit: number; // ₹ per L or ₹ per kWh
  isSimulatedAnomaly?: boolean;
}

export interface BuildingInfo {
  id: string;
  name: string;
  code: string;
  apartmentsCount: number;
  occupantsPerApartment: number;
  totalOccupants: number;
  zone: string;
  constructionYear: number;
  primaryPipeMaterial: string;
  electricalRatingKVA: number;
}

export interface AnomalyResult {
  isAnomaly: boolean;
  score: number; // 0 - 100
  severity: AnomalySeverity;
  observedValue: number;
  baselineValue: number;
  deviationAbsolute: number;
  deviationPercent: number;
  zScore: number;
  consecutiveAbnormalDays: number;
  detectionTimestamp: string;
  inputsContribution: {
    zScoreContribution: number;
    percentageContribution: number;
    persistenceContribution: number;
    occupancyDeltaScore: number;
    weatherExclusionScore: number;
  };
}

export interface RootCauseHypothesis {
  cause: string;
  probabilityPercent: number; // 0 - 100
  confidence: 'High' | 'Moderate' | 'Low';
  evidencePoints: string[];
}

export interface RiskFactorDecomposition {
  probabilityFactor: number; // 0.0 - 1.0
  impactFactor: number; // 0.0 - 1.0 (scaled resource & financial loss)
  exposureFactor: number; // 0.0 - 1.0 (scaled units & residents)
  compositeRiskScore: number; // 0 - 100
  severityTier: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface ImpactEstimate {
  excessPerDay: number;
  excessPerWeek: number;
  monetaryLossPerDay: number; // in ₹
  monetaryLossPerWeek: number; // in ₹
  unitLabel: string;
  currencySymbol: string;
}

export interface FailureProgressionStage {
  hours: number; // 0, 24, 48, 72
  dayLabel: string;
  title: string;
  projectedExcessCumulative: number;
  projectedFinancialLossCumulative: number;
  projectedRiskScore: number;
  physicalSymptom: string;
  escalationProbability: number; // %
  severity: AnomalySeverity;
  isInterventionWindowOpen: boolean;
}

export interface SimulationResult {
  hours: 24 | 48 | 72;
  currentStage: FailureProgressionStage;
  allStages: FailureProgressionStage[];
  deteriorationFactor: number;
  assumptions: {
    deteriorationModel: string;
    flowExpansionRatePercent: number;
    tariffBasis: string;
    repairCostMultiplierPerDay: number;
  };
}

export interface RecommendedAction {
  urgency: 'IMMEDIATE' | 'HIGH' | 'MEDIUM' | 'ROUTINE';
  actionTitle: string;
  description: string;
  consequenceOfDelay: string;
  goldenInterventionWindowHours: number;
  checklist: string[];
  targetLocation: string;
}

export interface AlertItem {
  id: string;
  buildingId: string;
  buildingName: string;
  utility: UtilityType;
  anomalyPercent: number;
  probabilityPercent: number;
  riskScore: number;
  severity: AnomalySeverity;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  detectedTime: string;
  status: 'INVESTIGATING' | 'UNRESOLVED' | 'ACTION_REQUIRED' | 'RESOLVED';
  summary: string;
}

export interface IncidentHistoryItem {
  id: string;
  date: string;
  buildingId: string;
  buildingName: string;
  utility: UtilityType;
  issue: string;
  detectedAnomaly: string;
  estimatedImpact: string;
  resolution: string;
  status: 'Resolved' | 'Active' | 'Under Investigation';
  resolvedDurationHours: number;
}

export interface TariffConfig {
  waterPerLitre: number; // default ₹0.05
  electricityPerKWh: number; // default ₹8.00
  municipalBaselineCharge: number;
}

export type DemoStage = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
