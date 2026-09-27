import React from 'react';
import { Building2, Users, Droplets, Zap, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';
import { BUILDINGS } from '../data/mockData';
import { BuildingInfo, UtilityType } from '../types';

interface BuildingsViewProps {
  selectedBuildingId: string;
  onSelectBuilding: (buildingId: string) => void;
  waterConsumptionMap: Record<string, number>;
  electricityConsumptionMap: Record<string, number>;
  anomalyBuildingMap: Record<string, boolean>;
}

export const BuildingsView: React.FC<BuildingsViewProps> = ({
  selectedBuildingId,
  onSelectBuilding,
  waterConsumptionMap,
  electricityConsumptionMap,
  anomalyBuildingMap,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white tracking-tight font-['Plus_Jakarta_Sans']">
          Facility Infrastructure Portfolio
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Real-time telemetry, population exposure, and active risk states across monitored buildings
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {BUILDINGS.map((b) => {
          const isSelected = b.id === selectedBuildingId;
          const hasAnomaly = anomalyBuildingMap[b.id];
          const water = waterConsumptionMap[b.id] || 1850;
          const elec = electricityConsumptionMap[b.id] || 380;

          return (
            <div
              key={b.id}
              onClick={() => onSelectBuilding(b.id)}
              className={`p-5 rounded-xl border transition-all cursor-pointer relative ${
                isSelected
                  ? 'bg-slate-900 border-cyan-400 shadow-xl shadow-cyan-950/40 ring-1 ring-cyan-400/50'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      hasAnomaly
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                    }`}
                  >
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{b.name}</h3>
                    <span className="text-xs font-mono text-slate-400">
                      Zone: {b.zone} • Built {b.constructionYear}
                    </span>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                    hasAnomaly
                      ? 'bg-rose-950 text-rose-300 border border-rose-800 animate-pulse'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}
                >
                  {hasAnomaly ? 'ANOMALY DETECTED' : 'NORMAL'}
                </span>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono mb-4">
                <div className="p-2 rounded bg-slate-950/80 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Apartments</span>
                  <span className="text-white font-bold">{b.apartmentsCount} units</span>
                </div>
                <div className="p-2 rounded bg-slate-950/80 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Population</span>
                  <span className="text-white font-bold">{b.totalOccupants} people</span>
                </div>
                <div className="p-2 rounded bg-slate-950/80 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Water Draw</span>
                  <span className="text-cyan-300 font-bold">{water.toLocaleString()} L/d</span>
                </div>
                <div className="p-2 rounded bg-slate-950/80 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Electric Draw</span>
                  <span className="text-amber-300 font-bold">{elec.toLocaleString()} kWh/d</span>
                </div>
              </div>

              {/* Physical specifications */}
              <div className="text-[11px] font-mono text-slate-400 space-y-1 pt-3 border-t border-slate-800">
                <div className="flex justify-between">
                  <span>Plumbing Spec:</span>
                  <span className="text-slate-300">{b.primaryPipeMaterial}</span>
                </div>
                <div className="flex justify-between">
                  <span>Substation Feed:</span>
                  <span className="text-slate-300">{b.electricalRatingKVA} kVA Dedicated Bus</span>
                </div>
              </div>

              {/* Select Indicator */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-cyan-400 font-semibold font-mono flex items-center gap-1">
                  <span>{isSelected ? 'Active Monitored Asset' : 'Switch Command Center to this Building'}</span>
                </span>
                <ArrowRight className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
