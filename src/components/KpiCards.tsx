import React from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  IndianRupee,
  Users,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { AnomalySeverity, BuildingInfo, ImpactEstimate, RiskFactorDecomposition } from '../types';

interface KpiCardsProps {
  severity: AnomalySeverity;
  activeAnomaliesCount: number;
  impact: ImpactEstimate;
  risk: RiskFactorDecomposition;
  building: BuildingInfo;
  isSimulatedActive: boolean;
}

export const KpiCards: React.FC<KpiCardsProps> = ({
  severity,
  activeAnomaliesCount,
  impact,
  risk,
  building,
  isSimulatedActive,
}) => {
  const isCritical = severity === 'CRITICAL';
  const isWarning = severity === 'WARNING';
  const isWatch = severity === 'WATCH';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* KPI 1: Infrastructure Status */}
      <div
        className={`p-5 rounded-xl border transition-all duration-300 relative overflow-hidden ${
          isCritical
            ? 'bg-rose-950/20 border-rose-800/80 shadow-lg shadow-rose-950/30'
            : isWarning
            ? 'bg-amber-950/20 border-amber-800/70 shadow-lg shadow-amber-950/30'
            : isWatch
            ? 'bg-yellow-950/15 border-yellow-800/60'
            : 'bg-slate-900/80 border-slate-800'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Infrastructure Status
          </span>
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isCritical
                ? 'bg-rose-500/20 text-rose-400'
                : isWarning
                ? 'bg-amber-500/20 text-amber-400'
                : 'bg-emerald-500/20 text-emerald-400'
            }`}
          >
            {isCritical ? (
              <AlertTriangle className="w-4 h-4 animate-bounce" />
            ) : isWarning ? (
              <AlertTriangle className="w-4 h-4" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span
            className={`text-2xl font-extrabold tracking-tight font-['Plus_Jakarta_Sans'] ${
              isCritical
                ? 'text-rose-400'
                : isWarning
                ? 'text-amber-300'
                : isWatch
                ? 'text-yellow-300'
                : 'text-emerald-400'
            }`}
          >
            {severity}
          </span>
          <span className="text-xs text-slate-400 font-mono">
            {isCritical
              ? 'Immediate Action Required'
              : isWarning
              ? 'Elevated Degradation'
              : 'Nominal Operations'}
          </span>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>Continuous Health Score:</span>
          <span className="font-semibold text-slate-200">
            {100 - risk.compositeRiskScore}%
          </span>
        </div>
      </div>

      {/* KPI 2: Active Anomalies */}
      <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Active Anomalies
          </span>
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-cyan-400 flex items-center justify-center">
            <ShieldAlert className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-white font-mono">
            {activeAnomaliesCount}
          </span>
          <span className="text-xs text-slate-400">
            {activeAnomaliesCount === 1 ? 'Incident Flagged' : 'Incidents Flagged'}
          </span>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
          <span>Risk Probability:</span>
          <span className="font-mono font-semibold text-cyan-300">
            {Math.round(risk.probabilityFactor * 100)}%
          </span>
        </div>
      </div>

      {/* KPI 3: Estimated Daily Loss */}
      <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Estimated Daily Loss
          </span>
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <IndianRupee className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-amber-400 font-mono">
            ₹{impact.monetaryLossPerDay.toLocaleString()}
          </span>
          <span className="text-xs text-slate-400 font-mono">/ day</span>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
          <span>Weekly Projection:</span>
          <span className="font-mono font-semibold text-amber-300">
            ₹{impact.monetaryLossPerWeek.toLocaleString()} / wk
          </span>
        </div>
      </div>

      {/* KPI 4: Risk Exposure */}
      <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Risk Exposure
          </span>
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-white font-mono">
            {building.totalOccupants}
          </span>
          <span className="text-xs text-slate-400">
            people / {building.apartmentsCount} units
          </span>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
          <span>Risk Score:</span>
          <span
            className={`font-mono font-bold ${
              risk.compositeRiskScore > 75
                ? 'text-rose-400'
                : risk.compositeRiskScore > 50
                ? 'text-amber-400'
                : 'text-emerald-400'
            }`}
          >
            {risk.compositeRiskScore} / 100
          </span>
        </div>
      </div>
    </div>
  );
};
