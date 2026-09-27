import React, { useState } from 'react';
import {
  X,
  Activity,
  AlertTriangle,
  GitBranch,
  ShieldAlert,
  IndianRupee,
  Clock,
  Wrench,
  CheckCircle2,
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

interface PresentationModeProps {
  onClose: () => void;
  building: BuildingInfo;
  utilityType: UtilityType;
  anomaly: AnomalyResult;
  impact: ImpactEstimate;
  risk: RiskFactorDecomposition;
  tariffs: TariffConfig;
  primaryCause: string;
  primaryProbability: number;
}

export const PresentationMode: React.FC<PresentationModeProps> = ({
  onClose,
  building,
  utilityType,
  anomaly,
  impact,
  risk,
  tariffs,
  primaryCause,
  primaryProbability,
}) => {
  const [simHours, setSimHours] = useState<24 | 48 | 72>(24);
  const sim = simulateFailureChain(anomaly, impact, risk, simHours, utilityType, tariffs);
  const currentStage = sim.currentStage;
  const unit = utilityType === 'water' ? 'Litres' : 'kWh';

  const isCritical = anomaly.severity === 'CRITICAL';

  return (
    <div className="fixed inset-0 z-50 bg-[#070b13] text-white flex flex-col p-6 overflow-y-auto">
      {/* Top Presentation Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 border border-cyan-400 flex items-center justify-center">
            <Activity className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black font-['Plus_Jakarta_Sans'] tracking-tight">
                Shadow<span className="text-cyan-400">Grid</span>
              </h1>
              <span className="px-2.5 py-0.5 rounded bg-indigo-950 border border-indigo-700 text-indigo-300 font-mono text-xs uppercase tracking-wider font-bold">
                JUDGE PRESENTATION MODE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Detect what infrastructure doesn't tell you • Zero Additional Sensors
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded bg-slate-900 border border-slate-700 text-cyan-300 text-xs font-mono">
            {building.name}
          </span>
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs border border-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Exit Fullscreen</span>
          </button>
        </div>
      </div>

      {/* Main High-Impact Layout */}
      <div className="space-y-6 max-w-7xl mx-auto w-full">
        {/* Core Differentiator Banner for Judges */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/70 via-slate-900 to-blue-950/70 border border-cyan-500/40 flex items-center justify-between text-sm">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-cyan-400 animate-ping"></span>
            <span className="font-extrabold text-cyan-300 tracking-wide text-base">
              “Hardware adds sensors. ShadowGrid adds intelligence to the data you already have.”
            </span>
          </div>
          <span className="font-mono text-xs text-slate-400 hidden md:inline">
            SIMULATED DEMO DATA
          </span>
        </div>

        {/* 4 Jumbo Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
            <span className="text-xs font-mono text-slate-400 uppercase">Detection State</span>
            <div className="text-3xl font-extrabold text-rose-400 tracking-tight font-['Plus_Jakarta_Sans']">
              {anomaly.severity}
            </div>
            <span className="text-xs text-slate-400 font-mono block">
              +{anomaly.deviationPercent}% vs 14d Baseline
            </span>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
            <span className="text-xs font-mono text-slate-400 uppercase">Primary Root-Cause</span>
            <div className="text-xl font-bold text-white leading-tight font-['Plus_Jakarta_Sans']">
              {primaryCause}
            </div>
            <span className="text-xs text-cyan-300 font-mono block">
              {primaryProbability}% Probabilistic Likelihood
            </span>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
            <span className="text-xs font-mono text-slate-400 uppercase">Risk Score (P × I × E)</span>
            <div className="text-3xl font-extrabold text-amber-400 font-mono">
              {risk.compositeRiskScore} <span className="text-lg text-slate-500">/ 100</span>
            </div>
            <span className="text-xs text-slate-400 font-mono block">
              {building.apartmentsCount} units / {building.totalOccupants} occupants
            </span>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
            <span className="text-xs font-mono text-slate-400 uppercase">Unchecked Daily Loss</span>
            <div className="text-3xl font-extrabold text-amber-300 font-mono">
              ₹{impact.monetaryLossPerDay.toLocaleString()}
            </div>
            <span className="text-xs text-slate-400 font-mono block">
              ₹{impact.monetaryLossPerWeek.toLocaleString()} weekly waste
            </span>
          </div>
        </div>

        {/* Jumbo Failure Chain Simulator */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-cyan-500/40 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-white">Failure Chain Projection Engine</h2>
            </div>

            <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-lg border border-slate-800 font-mono text-xs">
              <span className="text-slate-400 px-2">Timeline:</span>
              <button
                onClick={() => setSimHours(24)}
                className={`px-3 py-1.5 rounded font-bold transition-all ${
                  simHours === 24 ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                +24 Hours
              </button>
              <button
                onClick={() => setSimHours(48)}
                className={`px-3 py-1.5 rounded font-bold transition-all ${
                  simHours === 48 ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                +48 Hours
              </button>
              <button
                onClick={() => setSimHours(72)}
                className={`px-3 py-1.5 rounded font-bold transition-all ${
                  simHours === 72 ? 'bg-rose-500 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                +72 Hours
              </button>
            </div>
          </div>

          {/* 4 Progression Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {sim.allStages.map((st) => {
              const active = st.hours === simHours;
              return (
                <div
                  key={st.hours}
                  className={`p-4 rounded-xl border font-mono transition-all ${
                    active
                      ? 'bg-slate-800 border-cyan-400 ring-2 ring-cyan-400/50 scale-[1.02]'
                      : 'bg-slate-950/70 border-slate-800 opacity-60'
                  }`}
                >
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span className="font-bold text-cyan-400">{st.dayLabel}</span>
                    <span>+{st.hours}h</span>
                  </div>
                  <div className="text-sm font-bold text-white mb-2">{st.title}</div>
                  <div className="text-xs text-slate-300 font-sans mb-3 leading-snug">
                    {st.physicalSymptom}
                  </div>
                  <div className="text-xs space-y-1 pt-2 border-t border-slate-800 text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Loss:</span>
                      <span className="font-bold">{st.projectedExcessCumulative.toLocaleString()} {unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Cost:</span>
                      <span className="font-bold text-amber-300">₹{st.projectedFinancialLossCumulative}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Risk:</span>
                      <span className="font-bold text-rose-400">{st.projectedRiskScore}/100</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Immediate Intervention Directive */}
        <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-rose-950 border border-rose-800 text-rose-300 font-mono text-xs font-bold uppercase">
                URGENT DIRECTIVE
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Golden Window: 36h before wall drywall breach
              </span>
            </div>
            <p className="text-sm font-semibold text-white">
              Perform physical zero-demand meter audit and acoustic listening along {building.zone} Vertical Chase.
            </p>
          </div>

          <div className="shrink-0 text-xs font-mono text-slate-400 bg-slate-950 px-4 py-2.5 rounded-lg border border-slate-800">
            Decision Support System: Indicative analysis grounded in measured consumption logs.
          </div>
        </div>
      </div>
    </div>
  );
};
