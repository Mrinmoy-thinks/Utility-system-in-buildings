import React from 'react';
import {
  Activity,
  AlertTriangle,
  Play,
  RotateCcw,
  Sliders,
  UploadCloud,
  Tv,
  Droplets,
  Zap,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import { AnomalySeverity } from '../types';

interface HeaderProps {
  currentScenario: 'water-leak' | 'electricity-overload' | 'normal';
  onSelectScenario: (scenario: 'water-leak' | 'electricity-overload' | 'normal') => void;
  systemSeverity: AnomalySeverity;
  onRunDemo: () => void;
  onReset: () => void;
  onOpenSettings: () => void;
  onOpenIngest: () => void;
  onTogglePresentation: () => void;
  isPresentationMode: boolean;
  activeTab: 'dashboard' | 'buildings' | 'utilities' | 'incidents' | 'pipeline';
  onSelectTab: (tab: 'dashboard' | 'buildings' | 'utilities' | 'incidents' | 'pipeline') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScenario,
  onSelectScenario,
  systemSeverity,
  onRunDemo,
  onReset,
  onOpenSettings,
  onOpenIngest,
  onTogglePresentation,
  isPresentationMode,
  activeTab,
  onSelectTab,
}) => {
  const isCritical = systemSeverity === 'CRITICAL';
  const isWarning = systemSeverity === 'WARNING';

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#0c121e]/95 backdrop-blur-md">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-cyan-950/60 via-slate-900 to-indigo-950/60 px-4 py-1 text-xs border-b border-cyan-900/30 flex items-center justify-between">
        <div className="flex items-center gap-2 text-cyan-300">
          <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span className="font-mono uppercase tracking-wider font-semibold">
            “Hardware adds sensors. ShadowGrid adds intelligence to the data you already have.”
          </span>
        </div>
        <div className="flex items-center gap-3 text-slate-400">
          <span className="px-2 py-0.5 rounded bg-slate-800/90 text-[10px] font-mono border border-slate-700 text-cyan-200">
            SIMULATED DEMO DATA
          </span>
          <span className="hidden md:inline text-[11px] text-slate-400">
            Decision Support System (Probabilistic)
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center shadow-lg shadow-cyan-500/20 border border-cyan-400/40">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-white font-['Plus_Jakarta_Sans']">
                Shadow<span className="text-cyan-400">Grid</span>
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                v2.4
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Infrastructure Intelligence Platform
            </p>
          </div>
        </div>

        {/* Live Status Beacon */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs font-mono transition-all duration-300">
          {isCritical ? (
            <div className="flex items-center gap-2 text-rose-400 bg-rose-950/40 border border-rose-800/70 px-2.5 py-1 rounded">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
              <AlertTriangle className="w-3.5 h-3.5" />
              <span className="font-bold tracking-wide">● CRITICAL ANOMALY DETECTED</span>
            </div>
          ) : isWarning ? (
            <div className="flex items-center gap-2 text-amber-300 bg-amber-950/40 border border-amber-800/70 px-2.5 py-1 rounded">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
              <span className="font-bold tracking-wide">● WARNING: ELEVATED RISK</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-emerald-400 bg-emerald-950/30 border border-emerald-800/60 px-2.5 py-1 rounded">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="font-bold tracking-wide">● SYSTEM MONITORING ACTIVE (NORMAL)</span>
            </div>
          )}
        </div>

        {/* Incident Scenario Quick Switcher */}
        <div className="hidden md:flex items-center bg-slate-900/90 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => onSelectScenario('water-leak')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-all font-medium ${
              currentScenario === 'water-leak'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Building B: +38% Water Leakage Anomaly"
          >
            <Droplets className="w-3.5 h-3.5 text-cyan-400" />
            <span>Water Leak (Bldg B)</span>
          </button>

          <button
            onClick={() => onSelectScenario('electricity-overload')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-all font-medium ${
              currentScenario === 'electricity-overload'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Building C: +40% Electricity Overload Anomaly"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Power Spike (Bldg C)</span>
          </button>

          <button
            onClick={() => onSelectScenario('normal')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-all font-medium ${
              currentScenario === 'normal'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Building A: Normal Baseline"
          >
            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Baseline (Bldg A)</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Run Demo Button */}
          <button
            onClick={onRunDemo}
            className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold px-3 py-1.5 rounded-md shadow-md shadow-cyan-600/20 transition-all border border-cyan-400/30"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Run Demo</span>
          </button>

          {/* Reset */}
          <button
            onClick={onReset}
            className="p-1.5 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            title="Reset to Normal State"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Presentation Mode */}
          <button
            onClick={onTogglePresentation}
            className={`p-1.5 rounded-md border transition-colors ${
              isPresentationMode
                ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border-slate-700'
            }`}
            title="Presentation / Projector Mode"
          >
            <Tv className="w-4 h-4" />
          </button>

          {/* Tariffs & Assumptions Settings */}
          <button
            onClick={onOpenSettings}
            className="p-1.5 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            title="Tariff & Assumptions Configuration"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Ingest CSV */}
          <button
            onClick={onOpenIngest}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium transition-colors"
            title="Upload CSV / Ingest Raw Data"
          >
            <UploadCloud className="w-3.5 h-3.5 text-cyan-400" />
            <span>Ingest</span>
          </button>
        </div>
      </div>

      {/* Subnav Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between border-t border-slate-800/60 overflow-x-auto scrollbar-none">
        <nav className="flex space-x-6 text-xs font-medium">
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`py-2.5 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'border-cyan-400 text-cyan-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Command Center</span>
          </button>

          <button
            onClick={() => onSelectTab('buildings')}
            className={`py-2.5 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'buildings'
                ? 'border-cyan-400 text-cyan-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Facility Buildings (4)</span>
          </button>

          <button
            onClick={() => onSelectTab('utilities')}
            className={`py-2.5 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'utilities'
                ? 'border-cyan-400 text-cyan-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Utility Systems</span>
          </button>

          <button
            onClick={() => onSelectTab('incidents')}
            className={`py-2.5 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'incidents'
                ? 'border-cyan-400 text-cyan-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Incident Audit Log</span>
          </button>

          <button
            onClick={() => onSelectTab('pipeline')}
            className={`py-2.5 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'pipeline'
                ? 'border-cyan-400 text-cyan-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Architecture & Engine</span>
          </button>
        </nav>

        <div className="hidden md:flex items-center gap-2 text-[11px] font-mono text-slate-400 py-1">
          <span>Active Asset:</span>
          <span className="text-slate-200 font-semibold">
            {currentScenario === 'water-leak'
              ? 'Building B (Tower 4)'
              : currentScenario === 'electricity-overload'
              ? 'Building C (Commercial)'
              : 'Building A (Block 1)'}
          </span>
        </div>
      </div>
    </header>
  );
};
