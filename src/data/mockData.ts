import { BuildingInfo, ConsumptionRecord, IncidentHistoryItem, TariffConfig } from '../types';

export const DEFAULT_TARIFFS: TariffConfig = {
  waterPerLitre: 0.05, // ₹0.05 per litre
  electricityPerKWh: 8.00, // ₹8.00 per kWh
  municipalBaselineCharge: 450.00,
};

export const BUILDINGS: BuildingInfo[] = [
  {
    id: 'bldg-a',
    name: 'Building A (Residential Block 1)',
    code: 'BLD-A',
    apartmentsCount: 12,
    occupantsPerApartment: 3,
    totalOccupants: 36,
    zone: 'North Wing',
    constructionYear: 2019,
    primaryPipeMaterial: 'Cross-linked Polyethylene (PEX)',
    electricalRatingKVA: 120,
  },
  {
    id: 'bldg-b',
    name: 'Building B (Tower 4)',
    code: 'BLD-B',
    apartmentsCount: 14,
    occupantsPerApartment: 3,
    totalOccupants: 42,
    zone: 'Central Complex',
    constructionYear: 2017,
    primaryPipeMaterial: 'Concealed Copper/CPVC',
    electricalRatingKVA: 150,
  },
  {
    id: 'bldg-c',
    name: 'Building C (Commercial & Suites)',
    code: 'BLD-C',
    apartmentsCount: 28,
    occupantsPerApartment: 3,
    totalOccupants: 84,
    zone: 'South Hub',
    constructionYear: 2015,
    primaryPipeMaterial: 'Ductile Iron & PEX',
    electricalRatingKVA: 350,
  },
  {
    id: 'bldg-d',
    name: 'Building D (East Wing Complex)',
    code: 'BLD-D',
    apartmentsCount: 20,
    occupantsPerApartment: 3,
    totalOccupants: 60,
    zone: 'East Perimeter',
    constructionYear: 2021,
    primaryPipeMaterial: 'PEX / HDPE',
    electricalRatingKVA: 220,
  },
];

// Generate 30 days of realistic synthetic data leading up to today
export function generateSyntheticHistory(): {
  records: ConsumptionRecord[];
} {
  const records: ConsumptionRecord[] = [];
  const baseDate = new Date('2026-09-01T00:00:00Z');

  for (let d = 0; d < 30; d++) {
    const curDate = new Date(baseDate);
    curDate.setDate(baseDate.getDate() + d);
    const dateStr = curDate.toISOString().slice(0, 10);
    const isWeekend = curDate.getDay() === 0 || curDate.getDay() === 6;

    // Environmental baseline
    const ambientTemp = 28 + Math.sin(d / 5) * 3 + (d > 23 ? 1.5 : 0);
    const rainfall = d === 12 || d === 13 ? 18.4 : 0;

    // ==========================================
    // BUILDING A - Normal baseline throughout
    // ==========================================
    records.push({
      date: dateStr,
      dayIndex: d,
      buildingId: 'bldg-a',
      utilityType: 'water',
      consumption: Math.round(1200 + Math.sin(d) * 60 + (isWeekend ? 80 : 0)),
      temperatureC: ambientTemp,
      rainfallMm: rainfall,
      occupancyCount: 36,
      outageHours: 0,
      tariffPerUnit: DEFAULT_TARIFFS.waterPerLitre,
      isSimulatedAnomaly: false,
    });
    records.push({
      date: dateStr,
      dayIndex: d,
      buildingId: 'bldg-a',
      utilityType: 'electricity',
      consumption: Math.round(310 + Math.cos(d) * 18 + (isWeekend ? 25 : 0)),
      temperatureC: ambientTemp,
      rainfallMm: rainfall,
      occupancyCount: 36,
      outageHours: 0,
      tariffPerUnit: DEFAULT_TARIFFS.electricityPerKWh,
      isSimulatedAnomaly: false,
    });

    // ==========================================
    // BUILDING B - Primary Demo: Water Leak Scenario
    // Days 0-23: Normal baseline ~1850 L/day
    // Days 24-29: Progressive hidden leak ramping to 2550 L/day (+38%, 6 consecutive days)
    // ==========================================
    let bldgBWater = 1850 + Math.sin(d * 1.2) * 55 + (isWeekend ? 90 : 0);
    let isBAnom = false;
    if (d >= 24) {
      isBAnom = true;
      // Step progression: 1900 -> 2050 -> 2250 -> 2400 -> 2500 -> 2550
      const progression = [1900, 2050, 2250, 2400, 2500, 2550];
      bldgBWater = progression[d - 24] + (Math.sin(d) * 12);
    }

    records.push({
      date: dateStr,
      dayIndex: d,
      buildingId: 'bldg-b',
      utilityType: 'water',
      consumption: Math.round(bldgBWater),
      temperatureC: ambientTemp,
      rainfallMm: rainfall,
      occupancyCount: 42, // Occupancy is completely stable!
      outageHours: 0,
      tariffPerUnit: DEFAULT_TARIFFS.waterPerLitre,
      isSimulatedAnomaly: isBAnom,
    });

    records.push({
      date: dateStr,
      dayIndex: d,
      buildingId: 'bldg-b',
      utilityType: 'electricity',
      consumption: Math.round(380 + Math.sin(d * 0.9) * 20 + (isWeekend ? 30 : 0)),
      temperatureC: ambientTemp,
      rainfallMm: rainfall,
      occupancyCount: 42,
      outageHours: 0,
      tariffPerUnit: DEFAULT_TARIFFS.electricityPerKWh,
      isSimulatedAnomaly: false,
    });

    // ==========================================
    // BUILDING C - Secondary Demo: Electricity Overload
    // Days 0-24: Normal ~420 kWh/day
    // Days 25-29: Abnormal spike to ~590 kWh/day (+40%, 5 consecutive days)
    // ==========================================
    let bldgCElec = 420 + Math.cos(d * 0.8) * 22 + (isWeekend ? 35 : 0);
    let isCAnom = false;
    if (d >= 25) {
      isCAnom = true;
      const progressionElec = [480, 525, 560, 580, 592];
      bldgCElec = progressionElec[d - 25] + (Math.cos(d) * 4);
    }

    records.push({
      date: dateStr,
      dayIndex: d,
      buildingId: 'bldg-c',
      utilityType: 'electricity',
      consumption: Math.round(bldgCElec),
      temperatureC: ambientTemp,
      rainfallMm: rainfall,
      occupancyCount: 84, // Occupancy unchanged
      outageHours: 0,
      tariffPerUnit: DEFAULT_TARIFFS.electricityPerKWh,
      isSimulatedAnomaly: isCAnom,
    });

    records.push({
      date: dateStr,
      dayIndex: d,
      buildingId: 'bldg-c',
      utilityType: 'water',
      consumption: Math.round(3100 + Math.sin(d) * 120),
      temperatureC: ambientTemp,
      rainfallMm: rainfall,
      occupancyCount: 84,
      outageHours: 0,
      tariffPerUnit: DEFAULT_TARIFFS.waterPerLitre,
      isSimulatedAnomaly: false,
    });

    // ==========================================
    // BUILDING D - Weather-related spike (No hidden fault)
    // High heat on days 26-29 drives HVAC up, but temperature correlates!
    // ==========================================
    const heatwaveTemp = d >= 26 ? 38.5 + (d - 26) * 0.8 : ambientTemp;
    const weatherElec = d >= 26 ? 610 + (d - 26) * 15 : 440 + Math.sin(d) * 25;

    records.push({
      date: dateStr,
      dayIndex: d,
      buildingId: 'bldg-d',
      utilityType: 'electricity',
      consumption: Math.round(weatherElec),
      temperatureC: heatwaveTemp,
      rainfallMm: 0,
      occupancyCount: 60,
      outageHours: 0,
      tariffPerUnit: DEFAULT_TARIFFS.electricityPerKWh,
      isSimulatedAnomaly: false, // Weather-explained
    });

    records.push({
      date: dateStr,
      dayIndex: d,
      buildingId: 'bldg-d',
      utilityType: 'water',
      consumption: Math.round(2200 + Math.sin(d * 0.5) * 80),
      temperatureC: heatwaveTemp,
      rainfallMm: 0,
      occupancyCount: 60,
      outageHours: 0,
      tariffPerUnit: DEFAULT_TARIFFS.waterPerLitre,
      isSimulatedAnomaly: false,
    });
  }

  return { records };
}

export const HISTORICAL_INCIDENTS: IncidentHistoryItem[] = [
  {
    id: 'INC-2026-089',
    date: '2026-08-14',
    buildingId: 'bldg-b',
    buildingName: 'Building B (Tower 4)',
    utility: 'water',
    issue: 'Riser Joint Creep & Concealed Gasket Failure',
    detectedAnomaly: '+28% continuous nocturnal flow (4 consecutive days)',
    estimatedImpact: 'Saved ~28,400 L & ₹1,420 water loss before ceiling drywall damage',
    resolution: 'Acoustic leak pinpointing confirmed riser valve leak; replaced flange gasket within 18h',
    status: 'Resolved',
    resolvedDurationHours: 18,
  },
  {
    id: 'INC-2026-064',
    date: '2026-07-22',
    buildingId: 'bldg-c',
    buildingName: 'Building C (Commercial & Suites)',
    utility: 'electricity',
    issue: 'Chiller Damper Stuck & Compressor Short-Cycling',
    detectedAnomaly: '+44% off-hours base load (3 consecutive days)',
    estimatedImpact: 'Prevented motor burnout estimated at ₹185,000 and saved ₹14,200 in power',
    resolution: 'HVAC controller recalibrated; damper actuator replacement completed',
    status: 'Resolved',
    resolvedDurationHours: 12,
  },
  {
    id: 'INC-2026-041',
    date: '2026-06-03',
    buildingId: 'bldg-a',
    buildingName: 'Building A (Residential Block 1)',
    utility: 'water',
    issue: 'Sub-surface irrigation bypass valve leak',
    detectedAnomaly: '+22% daily consumption with zero occupant delta',
    estimatedImpact: 'Detected 12 days before surface pooling would have manifested',
    resolution: 'Solenoid valve sealed; backflow preventer recalibrated',
    status: 'Resolved',
    resolvedDurationHours: 24,
  },
  {
    id: 'INC-2026-018',
    date: '2026-04-19',
    buildingId: 'bldg-d',
    buildingName: 'East Wing Complex',
    utility: 'municipal',
    issue: 'Phase unbalance & intermittent feeder sag',
    detectedAnomaly: 'Multiple micro-outages and 18% phase current skew during peak hours',
    estimatedImpact: 'Notified municipal grid operator prior to transformer trip',
    resolution: 'Municipal team rebalanced feeder distribution line',
    status: 'Resolved',
    resolvedDurationHours: 36,
  },
];
