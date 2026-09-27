import React, { useState, useMemo, useEffect } from 'react';
import {
  BUILDINGS,
  DEFAULT_TARIFFS,
  HISTORICAL_INCIDENTS,
  generateSyntheticHistory,
} from './data/mockData';
import {
  AlertItem,
  AnomalyResult,
  BuildingInfo,
  ConsumptionRecord,
  DemoStage,
  IncidentHistoryItem,
  TariffConfig,
  UtilityType,
} from './types';
import {
  calculateBaseline,
  computeImpact,
  computeRisk,
  computeRootCause,
  detectAnomaly,
  getRecommendedAction,
} from './services/analyticsEngine';

// Components
import { Header } from './components/Header';
import { LandingHero } from './components/LandingHero';
import { KpiCards } from './components/KpiCards';
import { InfrastructureOverview } from './components/InfrastructureOverview';
import { ConsumptionChart } from './components/ConsumptionChart';
import { FailureChainSimulator } from './components/FailureChainSimulator';
import { RootCausePanel } from './components/RootCausePanel';
import { RecommendedActionPanel } from './components/RecommendedActionPanel';
import { ActiveAlertsPanel } from './components/ActiveAlertsPanel';
import { HistoricalIncidentsTable } from './components/HistoricalIncidentsTable';
import { BuildingsView } from './components/BuildingsView';
import { UtilitiesView } from './components/UtilitiesView';
import { PipelineView } from './components/PipelineView';
import { PresentationMode } from './components/PresentationMode';
import { DemoControllerBar } from './components/DemoControllerBar';
import { SettingsModal } from './components/SettingsModal';
import { DataIngestionModal } from './components/DataIngestionModal';
import { AlertDetailModal } from './components/AlertDetailModal';

export default function App() {
  // Scenario state: 'water-leak' (Building B) | 'electricity-overload' (Building C) | 'normal' (Building A)
  const [currentScenario, setCurrentScenario] = useState<'water-leak' | 'electricity-overload' | 'normal'>('water-leak');
  const [activeBuildingId, setActiveBuildingId] = useState<string>('bldg-b');
  const [activeUtility, setActiveUtility] = useState<'water' | 'electricity'>('water');
  const [tariffs, setTariffs] = useState<TariffConfig>(DEFAULT_TARIFFS);

  // Navigation & View state
  const [activeTab, setActiveTab] = useState<'dashboard' | 'buildings' | 'utilities' | 'incidents' | 'pipeline'>('dashboard');
  const [showLandingHero, setShowLandingHero] = useState<boolean>(true);
  const [isPresentationMode, setIsPresentationMode] = useState<boolean>(false);

  // Demo Mode state
  const [isDemoActive, setIsDemoActive] = useState<boolean>(false);
  const [demoStage, setDemoStage] = useState<DemoStage>(1);

  // Modals state
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isIngestOpen, setIsIngestOpen] = useState<boolean>(false);
  const [selectedAlert, setSelectedAlert] = useState<AlertItem | null>(null);

  // Synthetic records dataset
  const [allRecords, setAllRecords] = useState<ConsumptionRecord[]>(() => {
    return generateSyntheticHistory().records;
  });

  // Handle Scenario Switch
  const handleSelectScenario = (scenario: 'water-leak' | 'electricity-overload' | 'normal') => {
    setCurrentScenario(scenario);
    if (scenario === 'water-leak') {
      setActiveBuildingId('bldg-b');
      setActiveUtility('water');
    } else if (scenario === 'electricity-overload') {
      setActiveBuildingId('bldg-c');
      setActiveUtility('electricity');
    } else {
      setActiveBuildingId('bldg-a');
      setActiveUtility('water');
    }
  };

  // Synchronize building selection
  const currentBuilding: BuildingInfo = useMemo(() => {
    return BUILDINGS.find((b) => b.id === activeBuildingId) || {
      id: activeBuildingId,
      name: `Custom Facility (${activeBuildingId})`,
      code: 'CFG-01',
      apartmentsCount: 14,
      occupantsPerApartment: 3,
      totalOccupants: 42,
      zone: 'Sector Alpha',
      constructionYear: 2020,
      primaryPipeMaterial: 'PEX / Copper',
      electricalRatingKVA: 150,
    };
  }, [activeBuildingId]);

  // Filter records for active building & utility
  const activeRecords = useMemo(() => {
    // If in demo stage 1 or 2, adjust records to simulate gradual progression
    let filtered = allRecords.filter(
      (r) => r && r.buildingId === activeBuildingId && r.utilityType === activeUtility
    );

    if (filtered.length === 0) {
      // Fallback to all records of active utility or any records
      filtered = allRecords.filter((r) => r && r.utilityType === activeUtility);
      if (filtered.length === 0) {
        filtered = allRecords;
      }
    }

    if (isDemoActive && activeBuildingId === 'bldg-b') {
      if (demoStage === 1) {
        // Stage 1: perfectly normal baseline
        filtered = filtered.map((r) => ({
          ...r,
          consumption: r.dayIndex >= 24 ? 1850 + (r.dayIndex % 3) * 15 : r.consumption,
          isSimulatedAnomaly: false,
        }));
      } else if (demoStage === 2) {
        // Stage 2: gradual rise
        const ramp = [1900, 2050, 2250, 2400, 2500, 2550];
        filtered = filtered.map((r) => ({
          ...r,
          consumption: r.dayIndex >= 24 ? ramp[r.dayIndex - 24] : r.consumption,
          isSimulatedAnomaly: r.dayIndex >= 27,
        }));
      }
    }

    return filtered;
  }, [allRecords, activeBuildingId, activeUtility, isDemoActive, demoStage]);

  // Current inspection record (day 29 or last record)
  const currentRecord = useMemo(() => {
    if (activeRecords.length > 0 && activeRecords[activeRecords.length - 1]) {
      return activeRecords[activeRecords.length - 1];
    }
    return {
      date: '2026-09-30',
      dayIndex: 29,
      buildingId: activeBuildingId,
      utilityType: activeUtility,
      consumption: 2550,
      temperatureC: 28.5,
      rainfallMm: 0,
      occupancyCount: currentBuilding.totalOccupants,
      outageHours: 0,
      tariffPerUnit: tariffs.waterPerLitre,
      isSimulatedAnomaly: true,
    };
  }, [activeRecords, activeBuildingId, activeUtility, currentBuilding, tariffs]);

  // Deterministic Analytics Computations
  const anomalyResult: AnomalyResult = useMemo(() => {
    return detectAnomaly(currentRecord, activeRecords);
  }, [currentRecord, activeRecords]);

  // Root cause hypothesis
  const rootCauseAnalysis = useMemo(() => {
    return computeRootCause(activeUtility, anomalyResult, currentRecord);
  }, [activeUtility, anomalyResult, currentRecord]);

  // Risk calculation (P * I * E)
  const riskDecomposition = useMemo(() => {
    const impactVal = Math.max(anomalyResult.deviationAbsolute, 50);
    return computeRisk(
      rootCauseAnalysis.primaryProbability,
      impactVal,
      currentBuilding,
      activeUtility
    );
  }, [rootCauseAnalysis.primaryProbability, anomalyResult.deviationAbsolute, currentBuilding, activeUtility]);

  // Financial and resource impact estimation
  const impactEstimate = useMemo(() => {
    return computeImpact(anomalyResult.deviationAbsolute, activeUtility, tariffs);
  }, [anomalyResult.deviationAbsolute, activeUtility, tariffs]);

  // Recommended Action
  const recommendedAction = useMemo(() => {
    return getRecommendedAction(activeUtility, currentBuilding, anomalyResult);
  }, [activeUtility, currentBuilding, anomalyResult]);

  // Active Alerts List
  const activeAlerts: AlertItem[] = useMemo(() => {
    const list: AlertItem[] = [];

    // Check Building B Water
    const bRecords = allRecords.filter((r) => r && r.buildingId === 'bldg-b' && r.utilityType === 'water');
    const bCur = bRecords.length > 0 ? bRecords[bRecords.length - 1] : undefined;
    if (bCur) {
      const bAnom = detectAnomaly(bCur, bRecords);
      if (bAnom.isAnomaly || (isDemoActive && demoStage >= 3)) {
        list.push({
          id: 'AL-204',
          buildingId: 'bldg-b',
          buildingName: 'Building B (Tower 4)',
          utility: 'water',
          anomalyPercent: bAnom.deviationPercent > 0 ? bAnom.deviationPercent : 38,
          probabilityPercent: 87,
          riskScore: 84,
          severity: 'CRITICAL',
          priority: 'HIGH',
          detectedTime: 'Today, 06:30 AM',
          status: 'ACTION_REQUIRED',
          summary:
            'Continuous unmetered flow detected (+38% above 14d baseline). 6 consecutive days elevated without occupancy variance.',
        });
      }
    }

    // Check Building C Electricity
    const cRecords = allRecords.filter((r) => r && r.buildingId === 'bldg-c' && r.utilityType === 'electricity');
    const cCur = cRecords.length > 0 ? cRecords[cRecords.length - 1] : undefined;
    if (cCur) {
      const cAnom = detectAnomaly(cCur, cRecords);
      if (cAnom.isAnomaly && currentScenario === 'electricity-overload') {
        list.push({
          id: 'AL-108',
          buildingId: 'bldg-c',
          buildingName: 'Building C (Commercial)',
          utility: 'electricity',
          anomalyPercent: cAnom.deviationPercent,
          probabilityPercent: 84,
          riskScore: 78,
          severity: 'WARNING',
          priority: 'HIGH',
          detectedTime: 'Today, 04:15 AM',
          status: 'INVESTIGATING',
          summary:
            'Elevated base load (+40% above baseline) during off-peak night cycles. HVAC chiller short-cycling signature suspected.',
        });
      }
    }

    return list;
  }, [allRecords, currentScenario, isDemoActive, demoStage]);

  // Consumption maps for buildings overview
  const { waterMap, elecMap, anomMap } = useMemo(() => {
    const w: Record<string, number> = {};
    const e: Record<string, number> = {};
    const a: Record<string, boolean> = {};

    BUILDINGS.forEach((bldg) => {
      const bWater = allRecords.filter((r) => r && r.buildingId === bldg.id && r.utilityType === 'water');
      const bElec = allRecords.filter((r) => r && r.buildingId === bldg.id && r.utilityType === 'electricity');
      w[bldg.id] = bWater[bWater.length - 1]?.consumption || 1850;
      e[bldg.id] = bElec[bElec.length - 1]?.consumption || 380;
      a[bldg.id] =
        bldg.id === 'bldg-b' && (currentScenario === 'water-leak' || isDemoActive)
          ? true
          : bldg.id === 'bldg-c' && currentScenario === 'electricity-overload'
          ? true
          : false;
    });

    return { waterMap: w, elecMap: e, anomMap: a };
  }, [allRecords, currentScenario, isDemoActive]);

  // Run Demo Action
  const handleStartDemo = () => {
    handleSelectScenario('water-leak');
    setIsDemoActive(true);
    setDemoStage(1);
    setShowLandingHero(false);
    setActiveTab('dashboard');
  };

  // Reset System Action
  const handleResetSystem = () => {
    handleSelectScenario('normal');
    setIsDemoActive(false);
    setDemoStage(1);
  };

  // Custom CSV Ingest
  const handleCustomCsvIngest = (newRecords: ConsumptionRecord[]) => {
    setAllRecords(newRecords);
    setActiveBuildingId('custom-bldg');
    setActiveUtility('water');
    setCurrentScenario('water-leak');
  };

  return (
    <div className="min-h-screen bg-[#070b13] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans'] antialiased">
      {/* Top Header */}
      <Header
        currentScenario={currentScenario}
        onSelectScenario={handleSelectScenario}
        systemSeverity={anomalyResult.severity}
        onRunDemo={handleStartDemo}
        onReset={handleResetSystem}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenIngest={() => setIsIngestOpen(true)}
        onTogglePresentation={() => setIsPresentationMode(true)}
        isPresentationMode={isPresentationMode}
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'dashboard') setShowLandingHero(false);
        }}
      />

      {/* Landing Page Hero View (Shown by default on first load or when toggled) */}
      {showLandingHero && activeTab === 'dashboard' && (
        <LandingHero
          onLaunch={() => {
            setShowLandingHero(false);
          }}
          onRunDemo={handleStartDemo}
        />
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* TAB 1: COMMAND CENTER DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Top KPI Cards */}
            <KpiCards
              severity={anomalyResult.severity}
              activeAnomaliesCount={activeAlerts.length}
              impact={impactEstimate}
              risk={riskDecomposition}
              building={currentBuilding}
              isSimulatedActive={Boolean(currentRecord.isSimulatedAnomaly)}
            />

            {/* SECTION 1: Infrastructure Overview */}
            <InfrastructureOverview
              waterAnomaly={
                activeUtility === 'water'
                  ? anomalyResult
                  : (() => {
                      const bWater = allRecords.filter((r) => r && r.buildingId === 'bldg-b' && r.utilityType === 'water');
                      const cur = bWater.length > 0 ? bWater[bWater.length - 1] : undefined;
                      return detectAnomaly(cur, bWater);
                    })()
              }
              waterRisk={riskDecomposition}
              electricityAnomaly={
                activeUtility === 'electricity'
                  ? anomalyResult
                  : (() => {
                      const cElec = allRecords.filter((r) => r && r.buildingId === 'bldg-c' && r.utilityType === 'electricity');
                      const cur = cElec.length > 0 ? cElec[cElec.length - 1] : undefined;
                      return detectAnomaly(cur, cElec);
                    })()
              }
              electricityRisk={riskDecomposition}
              activeUtility={activeUtility}
              onSelectUtility={(u) => {
                setActiveUtility(u);
                if (u === 'electricity' && currentScenario !== 'electricity-overload') {
                  setCurrentScenario('electricity-overload');
                  setActiveBuildingId('bldg-c');
                } else if (u === 'water' && currentScenario !== 'water-leak') {
                  setCurrentScenario('water-leak');
                  setActiveBuildingId('bldg-b');
                }
              }}
            />

            {/* SECTION 2: Consumption Analytics Line Chart */}
            <ConsumptionChart
              records={activeRecords}
              utilityType={activeUtility}
              baselineValue={anomalyResult.baselineValue}
              isAnomalyActive={Boolean(currentRecord.isSimulatedAnomaly || anomalyResult.isAnomaly)}
              buildingName={currentBuilding.name}
            />

            {/* SECTION 3: Active Alerts */}
            <ActiveAlertsPanel
              alerts={activeAlerts}
              onSelectAlert={(alert) => setSelectedAlert(alert)}
            />

            {/* SECTION 4: AI & Root-Cause Explanation Panel */}
            <RootCausePanel
              utilityType={activeUtility}
              anomaly={anomalyResult}
              impact={impactEstimate}
              risk={riskDecomposition}
              building={currentBuilding}
              hypotheses={rootCauseAnalysis.hypotheses}
              evidencePoints={rootCauseAnalysis.evidencePoints}
            />

            {/* SECTION 5: Failure Chain Simulator (Flagship Feature!) */}
            <FailureChainSimulator
              anomaly={anomalyResult}
              impact={impactEstimate}
              risk={riskDecomposition}
              building={currentBuilding}
              utilityType={activeUtility}
              tariffs={tariffs}
            />

            {/* SECTION 6: Recommended Action */}
            <RecommendedActionPanel action={recommendedAction} />
          </div>
        )}

        {/* TAB 2: FACILITY BUILDINGS */}
        {activeTab === 'buildings' && (
          <BuildingsView
            selectedBuildingId={activeBuildingId}
            onSelectBuilding={(id) => {
              setActiveBuildingId(id);
              if (id === 'bldg-b') setCurrentScenario('water-leak');
              else if (id === 'bldg-c') setCurrentScenario('electricity-overload');
              else setCurrentScenario('normal');
              setActiveTab('dashboard');
            }}
            waterConsumptionMap={waterMap}
            electricityConsumptionMap={elecMap}
            anomalyBuildingMap={anomMap}
          />
        )}

        {/* TAB 3: UTILITY SYSTEMS */}
        {activeTab === 'utilities' && (
          <UtilitiesView
            waterAnomaly={anomalyResult}
            waterRisk={riskDecomposition}
            electricityAnomaly={anomalyResult}
            electricityRisk={riskDecomposition}
          />
        )}

        {/* TAB 4: HISTORICAL INCIDENTS AUDIT LOG */}
        {activeTab === 'incidents' && (
          <HistoricalIncidentsTable incidents={HISTORICAL_INCIDENTS} />
        )}

        {/* TAB 5: ARCHITECTURE & ENGINE */}
        {activeTab === 'pipeline' && <PipelineView />}
      </main>

      {/* Floating Demo Controller Bar (Engaged during Demo Mode) */}
      {isDemoActive && (
        <DemoControllerBar
          currentStage={demoStage}
          onSelectStage={(st) => setDemoStage(st)}
          onClose={() => setIsDemoActive(false)}
        />
      )}

      {/* Fullscreen Presentation Mode */}
      {isPresentationMode && (
        <PresentationMode
          onClose={() => setIsPresentationMode(false)}
          building={currentBuilding}
          utilityType={activeUtility}
          anomaly={anomalyResult}
          impact={impactEstimate}
          risk={riskDecomposition}
          tariffs={tariffs}
          primaryCause={rootCauseAnalysis.primaryCause}
          primaryProbability={rootCauseAnalysis.primaryProbability}
        />
      )}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        tariffs={tariffs}
        onSaveTariffs={(t) => setTariffs(t)}
      />

      {/* Data Ingestion Modal */}
      <DataIngestionModal
        isOpen={isIngestOpen}
        onClose={() => setIsIngestOpen(false)}
        currentRecords={activeRecords}
        onLoadDataset={(bId) => {
          setActiveBuildingId(bId);
          if (bId === 'bldg-b') handleSelectScenario('water-leak');
          else if (bId === 'bldg-c') handleSelectScenario('electricity-overload');
          else handleSelectScenario('normal');
          setActiveTab('dashboard');
        }}
        onCustomCsvIngest={handleCustomCsvIngest}
      />

      {/* Alert Detail Modal */}
      <AlertDetailModal
        alert={selectedAlert}
        onClose={() => setSelectedAlert(null)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#080d16] py-6 px-4 text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">ShadowGrid Platform</span>
            <span>•</span>
            <span>“Detect what infrastructure doesn't tell you.”</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Deterministic Analytics + Gemini Intelligence</span>
            <span>•</span>
            <span className="text-cyan-400">Zero Retrofit Sensors Required</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
