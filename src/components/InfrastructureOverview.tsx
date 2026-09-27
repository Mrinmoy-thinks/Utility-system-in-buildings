import React from 'react';
import { Droplets, Zap, Building, ArrowUpRight, Check, AlertCircle } from 'lucide-react';
import { AnomalyResult, RiskFactorDecomposition } from '../types';

interface InfrastructureOverviewProps {
  waterAnomaly: AnomalyResult;
  waterRisk: RiskFactorDecomposition;
  electricityAnomaly: AnomalyResult;
  electricityRisk: RiskFactorDecomposition;
  activeUtility: 'water' | 'electricity';
  onSelectUtility: (utility: 'water' | 'electricity') => void;
}

export const InfrastructureOverview: React.FC<InfrastructureOverviewProps> = ({
  waterAnomaly,
  waterRisk,
  electricityAnomaly,
  electricityRisk,
  activeUtility,
  onSelectUtility,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-mono uppercase tracking-wider text-slate-300 font-semibold flex items-center gap-2">
          <span>SECTION 1</span>
          <span className="text-slate-500">•</span>
          <span>Infrastructure Overview</span>
        </h2>
        <span className="text-xs text-slate-400">Click card to switch analytics view</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Water Utility Card */}
        <div
          onClick={() => onSelectUtility('water')}
          className={`p-5 rounded-xl border cursor-pointer transition-all duration-200 relative ${
            activeUtility === 'water'
              ? 'bg-slate-900 border-cyan-500/80 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-500/50'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  waterAnomaly.isAnomaly
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                }`}
              >
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Water Network</h3>
                <span className="text-[11px] text-slate-400">Potable & Booster Supply</span>
              </div>
            </div>

            <span
              className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold uppercase ${
                waterAnomaly.severity === 'CRITICAL'
                  ? 'bg-rose-950/80 text-rose-300 border border-rose-800'
                  : waterAnomaly.severity === 'WARNING'
                  ? 'bg-amber-950/80 text-amber-300 border border-amber-800'
                  : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
              }`}
            >
              {waterAnomaly.severity}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Current Usage</span>
              <span className="text-base font-bold text-white font-mono">
                {waterAnomaly.observedValue.toLocaleString()} <span className="text-xs text-slate-400">L/d</span>
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">14-Day Baseline</span>
              <span className="text-base font-bold text-slate-300 font-mono">
                {waterAnomaly.baselineValue.toLocaleString()} <span className="text-xs text-slate-400">L/d</span>
              </span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 font-mono">
              <span className="text-slate-400">Deviation:</span>
              <span
                className={`font-bold ${
                  waterAnomaly.deviationPercent > 10 ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {waterAnomaly.deviationPercent >= 0 ? `+${waterAnomaly.deviationPercent}%` : `${waterAnomaly.deviationPercent}%`}
              </span>
            </div>
            <div className="flex items-center gap-1 font-mono">
              <span className="text-slate-400">Risk:</span>
              <span className="font-bold text-slate-200">{waterRisk.compositeRiskScore}/100</span>
            </div>
          </div>
        </div>

        {/* Electricity Utility Card */}
        <div
          onClick={() => onSelectUtility('electricity')}
          className={`p-5 rounded-xl border cursor-pointer transition-all duration-200 relative ${
            activeUtility === 'electricity'
              ? 'bg-slate-900 border-amber-500/80 shadow-lg shadow-amber-950/40 ring-1 ring-amber-500/50'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  electricityAnomaly.isAnomaly
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}
              >
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Electrical Grid</h3>
                <span className="text-[11px] text-slate-400">Distribution & Sub-meters</span>
              </div>
            </div>

            <span
              className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold uppercase ${
                electricityAnomaly.severity === 'CRITICAL'
                  ? 'bg-rose-950/80 text-rose-300 border border-rose-800'
                  : electricityAnomaly.severity === 'WARNING'
                  ? 'bg-amber-950/80 text-amber-300 border border-amber-800'
                  : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
              }`}
            >
              {electricityAnomaly.severity}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Current Usage</span>
              <span className="text-base font-bold text-white font-mono">
                {electricityAnomaly.observedValue.toLocaleString()} <span className="text-xs text-slate-400">kWh/d</span>
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">14-Day Baseline</span>
              <span className="text-base font-bold text-slate-300 font-mono">
                {electricityAnomaly.baselineValue.toLocaleString()} <span className="text-xs text-slate-400">kWh/d</span>
              </span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 font-mono">
              <span className="text-slate-400">Deviation:</span>
              <span
                className={`font-bold ${
                  electricityAnomaly.deviationPercent > 10 ? 'text-amber-400' : 'text-emerald-400'
                }`}
              >
                {electricityAnomaly.deviationPercent >= 0 ? `+${electricityAnomaly.deviationPercent}%` : `${electricityAnomaly.deviationPercent}%`}
              </span>
            </div>
            <div className="flex items-center gap-1 font-mono">
              <span className="text-slate-400">Risk:</span>
              <span className="font-bold text-slate-200">{electricityRisk.compositeRiskScore}/100</span>
            </div>
          </div>
        </div>

        {/* Municipal Services Card */}
        <div className="p-5 rounded-xl border bg-slate-900/60 border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Municipal Grid</h3>
                <span className="text-[11px] text-slate-400">Town Feeder & Stormwater</span>
              </div>
            </div>

            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold uppercase bg-emerald-950/80 text-emerald-300 border border-emerald-800">
              NOMINAL
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Outage Hours (30d)</span>
              <span className="text-base font-bold text-emerald-400 font-mono">
                0.0 <span className="text-xs text-slate-400">hrs</span>
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Grid Reliability</span>
              <span className="text-base font-bold text-slate-200 font-mono">99.98%</span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 font-mono text-slate-400">
              <span>Status:</span>
              <span className="text-emerald-400 font-medium">Synchronized</span>
            </div>
            <div className="flex items-center gap-1 font-mono text-slate-400">
              <span>Risk:</span>
              <span className="text-slate-200 font-bold">14/100</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
