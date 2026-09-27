import React, { useState } from 'react';
import { Droplets, Zap, Building, ArrowUpRight, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { AnomalyResult, RiskFactorDecomposition } from '../types';

interface UtilitiesViewProps {
  waterAnomaly: AnomalyResult;
  waterRisk: RiskFactorDecomposition;
  electricityAnomaly: AnomalyResult;
  electricityRisk: RiskFactorDecomposition;
}

export const UtilitiesView: React.FC<UtilitiesViewProps> = ({
  waterAnomaly,
  waterRisk,
  electricityAnomaly,
  electricityRisk,
}) => {
  const [activeTab, setActiveTab] = useState<'water' | 'electricity' | 'municipal'>('water');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight font-['Plus_Jakarta_Sans']">
            Utility Network Sub-Systems
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Deep-dive operational metrics across hydraulic, electrical, and municipal telemetry
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setActiveTab('water')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'water'
                ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Droplets className="w-3.5 h-3.5 text-cyan-400" />
            <span>Water Network</span>
          </button>

          <button
            onClick={() => setActiveTab('electricity')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'electricity'
                ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Electrical Grid</span>
          </button>

          <button
            onClick={() => setActiveTab('municipal')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'municipal'
                ? 'bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building className="w-3.5 h-3.5 text-indigo-400" />
            <span>Municipal Feed</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Water */}
      {activeTab === 'water' && (
        <div className="p-6 rounded-xl bg-slate-900/90 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Hydraulic Distribution System</h3>
                <span className="text-xs text-slate-400 font-mono">
                  Potable supply, booster pump heads, and secondary vertical risers
                </span>
              </div>
            </div>

            <span
              className={`px-2.5 py-1 rounded text-xs font-mono font-bold uppercase ${
                waterAnomaly.isAnomaly
                  ? 'bg-rose-950 text-rose-300 border border-rose-800'
                  : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
              }`}
            >
              {waterAnomaly.severity}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 uppercase block mb-1">Observed Draw</span>
              <span className="text-2xl font-bold text-white">
                {waterAnomaly.observedValue.toLocaleString()}
              </span>
              <span className="text-slate-400 text-xs ml-1">L/day</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 uppercase block mb-1">Baseline Standard</span>
              <span className="text-2xl font-bold text-slate-300">
                {waterAnomaly.baselineValue.toLocaleString()}
              </span>
              <span className="text-slate-400 text-xs ml-1">L/day</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 uppercase block mb-1">Deviation Percentage</span>
              <span
                className={`text-2xl font-bold ${
                  waterAnomaly.deviationPercent > 10 ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                +{waterAnomaly.deviationPercent}%
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 uppercase block mb-1">Leak Probability</span>
              <span className="text-2xl font-bold text-cyan-300">87%</span>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2 font-mono">
            <span className="text-cyan-400 uppercase font-bold block">Hydraulic Diagnostic Profile</span>
            <p className="leading-relaxed font-sans text-slate-300">
              Continuous elevation of baseline without nocturnal troughs indicates continuous flow (orifice leak) rather than variable intermittent fixture use. The calculated orifice expansion rate matches an unmetered concealed copper riser fracture.
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: Electricity */}
      {activeTab === 'electricity' && (
        <div className="p-6 rounded-xl bg-slate-900/90 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Three-Phase Electrical Distribution</h3>
                <span className="text-xs text-slate-400 font-mono">
                  Main distribution panel, HVAC central chiller, and power factor logs
                </span>
              </div>
            </div>

            <span
              className={`px-2.5 py-1 rounded text-xs font-mono font-bold uppercase ${
                electricityAnomaly.isAnomaly
                  ? 'bg-rose-950 text-rose-300 border border-rose-800'
                  : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
              }`}
            >
              {electricityAnomaly.severity}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 uppercase block mb-1">Daily Consumption</span>
              <span className="text-2xl font-bold text-white">
                {electricityAnomaly.observedValue.toLocaleString()}
              </span>
              <span className="text-slate-400 text-xs ml-1">kWh/d</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 uppercase block mb-1">Peak Demand Draw</span>
              <span className="text-2xl font-bold text-amber-400">88.4</span>
              <span className="text-slate-400 text-xs ml-1">kVA</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 uppercase block mb-1">Deviation Percentage</span>
              <span
                className={`text-2xl font-bold ${
                  electricityAnomaly.deviationPercent > 10 ? 'text-amber-400' : 'text-emerald-400'
                }`}
              >
                +{electricityAnomaly.deviationPercent}%
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 uppercase block mb-1">Overload Likelihood</span>
              <span className="text-2xl font-bold text-amber-300">84%</span>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2 font-mono">
            <span className="text-amber-400 uppercase font-bold block">Electrical Diagnostic Profile</span>
            <p className="leading-relaxed font-sans text-slate-300">
              Elevated idle load during non-operational periods reveals high compressor cycling or stuck dampers in air handler units. Sustained overcurrent will increase thermal resistance in conductor coils.
            </p>
          </div>
        </div>
      )}

      {/* Tab 3: Municipal */}
      {activeTab === 'municipal' && (
        <div className="p-6 rounded-xl bg-slate-900/90 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Municipal Grid Interconnection</h3>
                <span className="text-xs text-slate-400 font-mono">
                  Town feeder substation connection, harmonic distortion, and outage telemetry
                </span>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded text-xs font-mono font-bold uppercase bg-emerald-950 text-emerald-300 border border-emerald-800">
              NOMINAL (SYNCHRONIZED)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 uppercase block mb-1">Outage Events (30d)</span>
              <span className="text-2xl font-bold text-emerald-400">0</span>
              <span className="text-slate-400 text-xs ml-1">incidents</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 uppercase block mb-1">Average Duration</span>
              <span className="text-2xl font-bold text-slate-300">0.0</span>
              <span className="text-slate-400 text-xs ml-1">mins</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 uppercase block mb-1">Voltage Sag Skew</span>
              <span className="text-2xl font-bold text-emerald-400">0.4%</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 uppercase block mb-1">Composite Risk</span>
              <span className="text-2xl font-bold text-slate-200">14 / 100</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
