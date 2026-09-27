import React, { useState } from 'react';
import {
  GitBranch,
  Play,
  RotateCcw,
  AlertTriangle,
  Clock,
  IndianRupee,
  Activity,
  Layers,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Droplets,
  Zap,
} from 'lucide-react';
import {
  AnomalyResult,
  BuildingInfo,
  ImpactEstimate,
  RiskFactorDecomposition,
  TariffConfig,
  UtilityType,
} from '../types';
import { simulateFailureChain } from '../services/analyticsEngine';

interface FailureChainSimulatorProps {
  anomaly: AnomalyResult;
  impact: ImpactEstimate;
  risk: RiskFactorDecomposition;
  building: BuildingInfo;
  utilityType: UtilityType;
  tariffs: TariffConfig;
}

export const FailureChainSimulator: React.FC<FailureChainSimulatorProps> = ({
  anomaly,
  impact,
  risk,
  building,
  utilityType,
  tariffs,
}) => {
  const [selectedHours, setSelectedHours] = useState<24 | 48 | 72>(24);
  const [showAssumptions, setShowAssumptions] = useState(false);

  // Compute deterministic simulation model
  const sim = simulateFailureChain(anomaly, impact, risk, selectedHours, utilityType, tariffs);
  const currentStage = sim.currentStage;
  const unit = utilityType === 'water' ? 'Litres' : 'kWh';

  return (
    <div className="p-6 rounded-xl bg-gradient-to-b from-[#0b1220] via-slate-900 to-[#090d16] border border-cyan-500/30 shadow-2xl relative overflow-hidden space-y-6">
      {/* Background glow accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-mono text-[11px] font-bold uppercase tracking-wider">
              Flagship Simulator
            </span>
            <h2 className="text-lg font-extrabold text-white tracking-tight font-['Plus_Jakarta_Sans'] flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-cyan-400" />
              <span>FAILURE CHAIN SIMULATOR</span>
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulate unmitigated failure evolution across 24h, 48h, and 72h horizons to project cascading impact
          </p>
        </div>

        {/* Time Horizon Selector Buttons */}
        <div className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-lg border border-slate-800">
          <span className="text-[11px] font-mono text-slate-400 px-2 hidden md:inline">
            Horizon:
          </span>
          <button
            onClick={() => setSelectedHours(24)}
            className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all ${
              selectedHours === 24
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30 scale-105'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Simulate 24h
          </button>

          <button
            onClick={() => setSelectedHours(48)}
            className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all ${
              selectedHours === 48
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30 scale-105'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Simulate 48h
          </button>

          <button
            onClick={() => setSelectedHours(72)}
            className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all ${
              selectedHours === 72
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30 scale-105'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Simulate 72h
          </button>

          <button
            onClick={() => setSelectedHours(24)}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
            title="Reset Simulation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Visual Progressive Timeline Stages (Day 0 -> Day 1 -> Day 2 -> Day 3) */}
      <div className="relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {sim.allStages.map((stage, idx) => {
            const isCurrent = stage.hours === selectedHours;
            const isPassed = stage.hours <= selectedHours;

            return (
              <div
                key={stage.hours}
                onClick={() => stage.hours > 0 && setSelectedHours(stage.hours as any)}
                className={`p-4 rounded-xl border transition-all duration-300 relative cursor-pointer ${
                  isCurrent
                    ? 'bg-slate-800/90 border-cyan-400 shadow-xl shadow-cyan-950/60 ring-2 ring-cyan-400/40 -translate-y-1'
                    : isPassed
                    ? 'bg-slate-900/80 border-slate-700'
                    : 'bg-slate-950/40 border-slate-800/60 opacity-60 hover:opacity-90'
                }`}
              >
                {/* Stage top pill */}
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span
                    className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                      isCurrent
                        ? 'bg-cyan-500 text-slate-950 font-extrabold'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {stage.dayLabel}
                  </span>
                  <span className="text-slate-400">+{stage.hours}h</span>
                </div>

                <h3 className="text-xs font-bold text-white mb-2 leading-tight">
                  {stage.title}
                </h3>

                <p className="text-[11px] text-slate-400 leading-snug min-h-[40px] mb-3">
                  {stage.physicalSymptom}
                </p>

                {/* Micro metrics */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800/80 text-[11px] font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Cumulative Loss:</span>
                    <span className="text-slate-200 font-bold">
                      {stage.projectedExcessCumulative.toLocaleString()} {unit}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Financial Impact:</span>
                    <span className="text-amber-300 font-bold">
                      ₹{stage.projectedFinancialLossCumulative.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Risk Score:</span>
                    <span
                      className={`font-bold ${
                        stage.projectedRiskScore >= 90
                          ? 'text-rose-400'
                          : stage.projectedRiskScore >= 75
                          ? 'text-amber-400'
                          : 'text-cyan-400'
                      }`}
                    >
                      {stage.projectedRiskScore}/100
                    </span>
                  </div>
                </div>

                {/* Progress dot */}
                <div className="mt-3 flex items-center justify-center">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      isCurrent
                        ? 'bg-cyan-400 animate-ping'
                        : isPassed
                        ? 'bg-cyan-600'
                        : 'bg-slate-700'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic Projected Escalation Dashboard for Selected Horizon */}
      <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase text-slate-400 font-semibold">
              Projected Outcome at +{selectedHours} Hours
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono">
              Deterioration Factor: ×{sim.deteriorationFactor}
            </span>
          </div>

          {currentStage.isInterventionWindowOpen ? (
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/80 px-2.5 py-1 rounded">
              <Clock className="w-3.5 h-3.5" />
              <span>INTERVENTION WINDOW: OPEN (ACT NOW)</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs font-mono text-rose-400 bg-rose-950/40 border border-rose-800/80 px-2.5 py-1 rounded animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>WINDOW CLOSED: STRUCTURAL FAILURE IMMINENT</span>
            </div>
          )}
        </div>

        {/* 4 Projected Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block">Cumulative Resource Loss</span>
            <span className="text-xl font-extrabold text-cyan-300">
              {currentStage.projectedExcessCumulative.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400 ml-1">{unit}</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block">Direct Financial Waste</span>
            <span className="text-xl font-extrabold text-amber-400">
              ₹{currentStage.projectedFinancialLossCumulative.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Direct tariff basis</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block">Simulated Risk Score</span>
            <div className="flex items-baseline gap-2">
              <span
                className={`text-xl font-extrabold ${
                  currentStage.projectedRiskScore >= 90
                    ? 'text-rose-400'
                    : 'text-amber-400'
                }`}
              >
                {currentStage.projectedRiskScore}
              </span>
              <span className="text-xs text-slate-400">/ 100</span>
            </div>
            {/* Mini progress bar */}
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1.5">
              <div
                className={`h-full transition-all duration-500 ${
                  currentStage.projectedRiskScore >= 90 ? 'bg-rose-500' : 'bg-amber-500'
                }`}
                style={{ width: `${currentStage.projectedRiskScore}%` }}
              />
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block">Escalation Probability</span>
            <span className="text-xl font-extrabold text-white">
              {currentStage.escalationProbability}%
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              {building.apartmentsCount} units / {building.totalOccupants} occupants
            </span>
          </div>
        </div>
      </div>

      {/* Simulation Assumptions Collapsible Panel */}
      <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-950/60 relative z-10">
        <button
          onClick={() => setShowAssumptions(!showAssumptions)}
          className="w-full px-4 py-2.5 flex items-center justify-between text-xs text-slate-300 hover:text-white font-mono hover:bg-slate-900/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold">Simulation Assumptions & Mathematical Modeling</span>
          </div>
          {showAssumptions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showAssumptions && (
          <div className="px-4 py-3 border-t border-slate-800 text-xs text-slate-400 space-y-3 font-mono leading-relaxed bg-slate-900/30">
            <p>
              The simulation uses deterministic mechanical and thermal degradation equations to avoid stochastic jitter. Identical parameter inputs will continuously reproduce identical risk trajectories.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400 font-bold block mb-1">
                  1. Physical Degradation Model:
                </span>
                <span className="text-slate-300">{sim.assumptions.deteriorationModel}</span>
              </div>

              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400 font-bold block mb-1">
                  2. Tariff Basis & Unit Cost:
                </span>
                <span className="text-slate-300">{sim.assumptions.tariffBasis}</span>
              </div>

              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400 font-bold block mb-1">
                  3. Flow Expansion Factor:
                </span>
                <span className="text-slate-300">
                  +{sim.assumptions.flowExpansionRatePercent}% compounded daily under dynamic hydraulic pressure
                </span>
              </div>

              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400 font-bold block mb-1">
                  4. Secondary Remediation Multiplier:
                </span>
                <span className="text-slate-300">
                  ×{sim.assumptions.repairCostMultiplierPerDay} per day of delay (reflecting structural ceiling/insulation water ingress)
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
